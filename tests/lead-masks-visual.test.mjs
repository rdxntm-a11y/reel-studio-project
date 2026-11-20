import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const CHECK_DIR = join(process.cwd(), "out/LeadMasksDocumentary/check");

const framePath = (frame) => join(CHECK_DIR, `f_0${frame}.jpg`);

const grayCrop = (frame, crop) => {
  const path = framePath(frame);
  assert.ok(existsSync(path), `missing ${path}; run npm run check -- LeadMasksDocumentary first`);
  return execFileSync(
    "ffmpeg",
    ["-loglevel", "error", "-i", path, "-vf", `crop=${crop},format=gray`, "-f", "rawvideo", "-"],
    { maxBuffer: 16 * 1024 * 1024 },
  );
};

const brightPixels = (buffer, threshold) => {
  let count = 0;
  for (const value of buffer) {
    if (value > threshold) count += 1;
  }
  return count;
};

const changedPixels = (a, b, threshold) => {
  let count = 0;
  for (let index = 0; index < a.length; index += 1) {
    if (Math.abs(a[index] - b[index]) > threshold) count += 1;
  }
  return count;
};

test("board shows main content at global frame 1260", () => {
  const boardRegion = grayCrop(1260, "1160:700:0:150");
  assert.ok(brightPixels(boardRegion, 110) > 10000, "board content is missing at frame 1260");
});

test("evidence-condition bullet list changes across caption beats", () => {
  const listRegion = "960:420:10:250";
  const first = grayCrop(1080, listRegion);
  const second = grayCrop(1140, listRegion);
  const third = grayCrop(1200, listRegion);
  assert.ok(changedPixels(first, second, 24) > 7000, "bullet list progression is too weak from 36s to 38s");
  assert.ok(changedPixels(second, third, 24) > 7000, "bullet list progression is too weak from 38s to 40s");
});
