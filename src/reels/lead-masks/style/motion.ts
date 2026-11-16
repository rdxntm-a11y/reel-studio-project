// Story-driven motion helpers for the lead-masks reel.
// Every delay below is a LOCAL frame (word frame minus the scene's `from`), so
// each reveal is anchored to a spoken word from captions.words.json.
import { interpolate, spring } from "remotion";
import { SPRING, clamp } from "./theme";

/** spring progress that stays 0 until `delay` (local frames). */
export const springAt = (frame: number, fps: number, delay: number, config = SPRING.pop) =>
  spring({ frame: frame - delay, fps, config });

/**
 * A hard stamp slam: scale 2 -> 1 across 3 frames, then a tiny settle wobble and
 * a short sideways shake. Returns the pose for the stamp element itself.
 */
export const slamPose = (frame: number, delay: number) => {
  const t = frame - delay;
  const impact = interpolate(t, [0, 3], [2, 1], clamp);
  const settle = t > 3 ? Math.sin((t - 3) * 0.9) * 0.05 * Math.exp(-(t - 3) * 0.32) : 0;
  const y = interpolate(t, [0, 3], [-38, 0], clamp);
  const opacity = interpolate(t, [0, 2], [0, 1], clamp);
  const shake = t >= 3 && t < 12 ? Math.sin(t * 2.7) * 4.5 * (1 - (t - 3) / 9) : 0;
  return { scale: impact + settle, y, opacity, shake, t };
};

/**
 * Slow camera move on a still. Pass keyframes whose `at` are word frames, so the
 * pan/zoom happens exactly when the narrator says the matching words.
 * Keys must be sorted by `at` and hold at least two entries.
 */
export const camera = (
  frame: number,
  keys: { at: number; scale?: number; x?: number; y?: number }[],
) => {
  const at = keys.map((k) => k.at);
  const scale = interpolate(frame, at, keys.map((k) => k.scale ?? 1), clamp);
  const x = interpolate(frame, at, keys.map((k) => k.x ?? 0), clamp);
  const y = interpolate(frame, at, keys.map((k) => k.y ?? 0), clamp);
  return `translate(${x}px, ${y}px) scale(${scale})`;
};

/** ease from `from` to `to`, starting at local frame `at`, over `frames`. */
export const ease = (frame: number, at: number, frames: number, from: number, to: number) =>
  interpolate(frame, [at, at + Math.max(1, frames)], [from, to], clamp);

/** travel for an edge slide-in. `p` is a 0..1 progress (e.g. a spring). */
export const slide = (p: number, dir: "left" | "right" | "top" | "bottom", dist = 120) => {
  const d = (1 - p) * dist;
  if (dir === "left") return `translateX(${-d}px)`;
  if (dir === "right") return `translateX(${d}px)`;
  if (dir === "top") return `translateY(${-d}px)`;
  return `translateY(${d}px)`;
};
