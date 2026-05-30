import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const input = path.join(root, "public/videos/opener.mp4");
const output = path.join(root, "public/videos/opener.optimized.mp4");
const ffmpeg = (await import("ffmpeg-static")).default;

if (!ffmpeg || !fs.existsSync(ffmpeg)) {
  console.error("ffmpeg-static is not installed. Run: npm install");
  process.exit(1);
}

if (!fs.existsSync(input)) {
  console.error(`Missing input video: ${input}`);
  process.exit(1);
}

const args = [
  "-y",
  "-hide_banner",
  "-loglevel",
  "error",
  "-i",
  input,
  "-an",
  "-vf",
  "scale=720:-2",
  "-c:v",
  "libx264",
  "-profile:v",
  "main",
  "-level",
  "3.1",
  "-pix_fmt",
  "yuv420p",
  "-crf",
  "26",
  "-preset",
  "medium",
  "-movflags",
  "+faststart",
  "-tag:v",
  "avc1",
  output,
];

const result = spawnSync(ffmpeg, args, { stdio: "inherit" });
if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

const before = fs.statSync(input).size;
const after = fs.statSync(output).size;
console.log(`Optimized: ${(before / 1024 / 1024).toFixed(2)} MB -> ${(after / 1024 / 1024).toFixed(2)} MB`);
console.log(`Review ${output}, then replace public/videos/opener.mp4 when happy.`);
