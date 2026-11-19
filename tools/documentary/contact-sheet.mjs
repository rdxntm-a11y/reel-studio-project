import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const id = process.argv[2] ?? "UntoldStoryDemo";
const maxTiles = Number(process.argv[3] ?? 24);
const checkDir = path.resolve("out", id, "check");
const output = path.join(checkDir, "contact-sheet-16x9.jpg");

if (!fs.existsSync(checkDir)) {
  console.error(`No frame directory: ${checkDir}. Run npm run check -- ${id} first.`);
  process.exit(1);
}

const frames = fs
  .readdirSync(checkDir)
  .filter((name) => /^f_\d+\.jpg$/.test(name))
  .sort((a, b) => Number(a.match(/\d+/)?.[0] ?? 0) - Number(b.match(/\d+/)?.[0] ?? 0));

if (!frames.length) {
  console.error(`No f_*.jpg stills in ${checkDir}.`);
  process.exit(1);
}

const step = Math.max(1, Math.ceil(frames.length / maxTiles));
const selected = frames.filter((_, index) => index % step === 0);
const temp = fs.mkdtempSync(path.join(process.cwd(), "out", ".contact-"));

try {
  selected.forEach((name, index) => {
    fs.copyFileSync(path.join(checkDir, name), path.join(temp, `t_${String(index + 1).padStart(3, "0")}.jpg`));
  });
  const columns = 4;
  const rows = Math.ceil(selected.length / columns);
  const filter = `scale=320:180,tile=${columns}x${rows}:padding=6:color=0x141414`;
  execFileSync(
    "ffmpeg",
    ["-y", "-loglevel", "error", "-framerate", "1", "-i", path.join(temp, "t_%03d.jpg"), "-vf", filter, "-frames:v", "1", output],
    { stdio: "inherit" },
  );
  console.log(`Wrote ${output} (${selected.length} of ${frames.length} frames)`);
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
