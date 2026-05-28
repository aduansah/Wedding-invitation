import { promises as fs } from "fs";
import path from "path";
import { get, put } from "@vercel/blob";
import type { RsvpStoreData, RsvpSubmission } from "./rsvpTypes";

const BLOB_PATHNAME = "wedding-rsvp/submissions.json";
const LOCAL_DATA_PATH = path.join(process.cwd(), "data", "rsvps.json");

const emptyStore = (): RsvpStoreData => ({ submissions: [] });

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

async function readBlobStore(): Promise<RsvpStoreData> {
  try {
    const result = await get(BLOB_PATHNAME, {
      access: "private",
      useCache: false,
    });

    if (!result?.stream) return emptyStore();

    const raw = await new Response(result.stream).text();
    const parsed = JSON.parse(raw) as RsvpStoreData;
    if (!Array.isArray(parsed.submissions)) return emptyStore();
    return parsed;
  } catch {
    return emptyStore();
  }
}

async function writeBlobStore(data: RsvpStoreData) {
  await put(BLOB_PATHNAME, JSON.stringify(data), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

function useBlobStore() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function listRsvpSubmissions(): Promise<RsvpSubmission[]> {
  const store = useBlobStore() ? await readBlobStore() : await readLocalStore();
  return [...store.submissions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function addRsvpSubmission(
  firstName: string,
  lastName: string,
): Promise<RsvpSubmission> {
  const store = useBlobStore() ? await readBlobStore() : await readLocalStore();
  const submission: RsvpSubmission = {
    id: crypto.randomUUID(),
    firstName,
    lastName,
    createdAt: new Date().toISOString(),
  };

  store.submissions.push(submission);

  if (useBlobStore()) {
    await writeBlobStore(store);
  } else {
    await writeLocalStore(store);
  }

  return submission;
}
