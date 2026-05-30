import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const imagesDir = path.join(root, "public/images");
const backupDir = path.join(imagesDir, ".optimized-backup");

const MAX_LONG_EDGE = 2400;
const MAX_POSTER_EDGE = 1600;
const JPEG_QUALITY = 88;
const PNG_QUALITY = 92;

const POSTER_NAMES = new Set(["envelope-closed.png"]);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === ".optimized-backup") continue;
      files.push(...(await walk(fullPath)));
    } else if (/\.(jpe?g|png)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

async function ensureBackup(filePath) {
  const relative = path.relative(imagesDir, filePath);
  const backupPath = path.join(backupDir, relative);
  await fs.mkdir(path.dirname(backupPath), { recursive: true });
  try {
    await fs.access(backupPath);
  } catch {
    await fs.copyFile(filePath, backupPath);
  }
}

async function optimizeFile(filePath) {
  const before = (await fs.stat(filePath)).size;
  const ext = path.extname(filePath).toLowerCase();
  const base = path.basename(filePath);
  const maxEdge = POSTER_NAMES.has(base) ? MAX_POSTER_EDGE : MAX_LONG_EDGE;

  const meta = await sharp(filePath, { failOn: "none" }).metadata();

  let pipeline = sharp(filePath, { failOn: "none" }).rotate().resize({
    width: maxEdge,
    height: maxEdge,
    fit: "inside",
    withoutEnlargement: true,
  });

  const tempPath = `${filePath}.tmp`;

  if (ext === ".jpg" || ext === ".jpeg") {
    await pipeline
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true })
      .toFile(tempPath);
  } else if (meta.hasAlpha && before > 400_000) {
    await pipeline
      .webp({ quality: 90, effort: 6, alphaQuality: 90 })
      .toFile(tempPath.replace(/\.png$/i, ".webp"));
    const webpPath = filePath.replace(/\.png$/i, ".webp");
    await fs.rename(tempPath.replace(/\.png$/i, ".webp"), webpPath);
    if (webpPath !== filePath) {
      await fs.unlink(filePath).catch(() => undefined);
    }
    const after = (await fs.stat(webpPath)).size;
    return { filePath: webpPath, before, after, skipped: false, converted: "webp" };
  } else {
    const hasAlpha = meta.hasAlpha;
    await pipeline
      .png({
        compressionLevel: 9,
        effort: 10,
        quality: PNG_QUALITY,
        palette: !hasAlpha,
      })
      .toFile(tempPath);
  }

  const after = (await fs.stat(tempPath)).size;
  if (after >= before) {
    await fs.unlink(tempPath);
    return { filePath, before, after: before, skipped: true };
  }

  await fs.rename(tempPath, filePath);
  return {
    filePath,
    before,
    after,
    skipped: false,
    width: meta.width,
    height: meta.height,
  };
}

function fmt(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

const files = await walk(imagesDir);
const results = [];

for (const file of files.sort()) {
  await ensureBackup(file);
  results.push(await optimizeFile(file));
}

let saved = 0;
for (const result of results) {
  const rel = path.relative(root, result.filePath);
  const delta = result.before - result.after;
  saved += Math.max(delta, 0);
  const note = result.skipped ? "kept original" : `${fmt(result.before)} -> ${fmt(result.after)}`;
  console.log(`${rel}: ${note}`);
}

console.log(`\nTotal saved: ${fmt(saved)}`);
console.log(`Originals backed up in public/images/.optimized-backup/`);
