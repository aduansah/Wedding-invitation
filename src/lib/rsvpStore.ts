import { promises as fs } from "fs";
import path from "path";
import { del, head, list, put } from "@vercel/blob";
import type { RsvpStoreData, RsvpSubmission } from "./rsvpTypes";

const ENTRIES_PREFIX = "wedding-rsvp/entries/";
const LEGACY_BLOB_PATHNAME = "wedding-rsvp/submissions.json";
const LOCAL_DATA_PATH = path.join(process.cwd(), "data", "rsvps.json");

const emptyStore = (): RsvpStoreData => ({ submissions: [] });

function isVercelRuntime() {
  return Boolean(process.env.VERCEL);
}

function useBlobStore() {
  if (isVercelRuntime()) {
    return true;
  }

  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

function blobAccess() {
  return process.env.BLOB_ACCESS === "private" ? "private" : "public";
}

function sortSubmissions(submissions: RsvpSubmission[]) {
  return [...submissions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

function dedupeSubmissions(submissions: RsvpSubmission[]) {
  const byId = new Map<string, RsvpSubmission>();
  for (const submission of submissions) {
    byId.set(submission.id, submission);
  }
  return sortSubmissions([...byId.values()]);
}

async function readLocalStore(): Promise<RsvpStoreData> {
  try {
    const raw = await fs.readFile(LOCAL_DATA_PATH, "utf8");
    const parsed = JSON.parse(raw) as RsvpStoreData;
    if (!Array.isArray(parsed.submissions)) return emptyStore();
    return parsed;
  } catch {
    return emptyStore();
  }
}

async function writeLocalStore(data: RsvpStoreData) {
  await fs.mkdir(path.dirname(LOCAL_DATA_PATH), { recursive: true });
  await fs.writeFile(LOCAL_DATA_PATH, JSON.stringify(data, null, 2), "utf8");
}

async function readJsonFromUrl(url: string): Promise<unknown | null> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) return null;

  const raw = await response.text();
  if (!raw.trim()) return null;

  return JSON.parse(raw) as unknown;
}

async function readJsonFromPathname(pathname: string): Promise<unknown | null> {
  try {
    const meta = await head(pathname);
    return readJsonFromUrl(meta.url);
  } catch (error) {
    console.error(`Failed to read RSVP blob ${pathname}:`, error);
    return null;
  }
}

async function readLegacyBlobStore(): Promise<RsvpStoreData> {
  const parsed = (await readJsonFromPathname(LEGACY_BLOB_PATHNAME)) as RsvpStoreData | null;
  if (!parsed || !Array.isArray(parsed.submissions)) return emptyStore();
  return parsed;
}

async function listBlobSubmissions(): Promise<RsvpSubmission[]> {
  const submissions: RsvpSubmission[] = [];
  const legacy = await readLegacyBlobStore();
  submissions.push(...legacy.submissions);

  let cursor: string | undefined;

  do {
    const page = await list({
      prefix: ENTRIES_PREFIX,
      limit: 1000,
      cursor,
    });

    for (const blob of page.blobs) {
      try {
        const parsed = await readJsonFromUrl(blob.url);
        if (parsed && typeof parsed === "object") {
          submissions.push(parsed as RsvpSubmission);
        }
      } catch (error) {
        console.error(`Failed to read RSVP entry ${blob.pathname}:`, error);
      }
    }

    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  return dedupeSubmissions(submissions);
}

async function writeBlobSubmission(submission: RsvpSubmission) {
  await put(`${ENTRIES_PREFIX}${submission.id}.json`, JSON.stringify(submission), {
    access: blobAccess(),
    addRandomSuffix: false,
    allowOverwrite: false,
    contentType: "application/json",
  });
}

async function clearBlobSubmissions() {
  try {
    await del(LEGACY_BLOB_PATHNAME);
  } catch {
    // Legacy file may not exist.
  }

  let cursor: string | undefined;

  do {
    const page = await list({
      prefix: ENTRIES_PREFIX,
      limit: 1000,
      cursor,
    });

    if (page.blobs.length > 0) {
      await del(page.blobs.map((blob) => blob.pathname));
    }

    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
}

export async function listRsvpSubmissions(): Promise<RsvpSubmission[]> {
  if (useBlobStore()) {
    return listBlobSubmissions();
  }

  const store = await readLocalStore();
  return sortSubmissions(store.submissions);
}

export async function addRsvpSubmission(
  firstName: string,
  lastName: string,
): Promise<RsvpSubmission> {
  const submission: RsvpSubmission = {
    id: crypto.randomUUID(),
    firstName,
    lastName,
    createdAt: new Date().toISOString(),
  };

  if (useBlobStore()) {
    await writeBlobSubmission(submission);
    return submission;
  }

  const store = await readLocalStore();
  store.submissions.push(submission);
  await writeLocalStore(store);
  return submission;
}

export async function clearRsvpSubmissions(): Promise<void> {
  if (useBlobStore()) {
    await clearBlobSubmissions();
    return;
  }

  await writeLocalStore(emptyStore());
}
