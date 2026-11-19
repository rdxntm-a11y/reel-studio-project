import { Easing, interpolate, spring } from "remotion";
import { DOC_FPS } from "./geometry";

export const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const EASE = {
  enter: Easing.bezier(0.16, 1, 0.3, 1),
  exit: Easing.bezier(0.7, 0, 0.84, 0),
  camera: Easing.inOut(Easing.cubic),
  linear: Easing.linear,
};

export const SPRING = {
  reveal: { damping: 20, stiffness: 140, mass: 0.8 },
  snap: { damping: 12, stiffness: 230, mass: 0.65 },
  soft: { damping: 200, stiffness: 100, mass: 1 },
};

export const toFrames = (seconds: number, fps = DOC_FPS) => Math.round(seconds * fps);

export const progress = (frame: number, at: number, length: number) =>
  interpolate(frame, [at, at + Math.max(1, length)], [0, 1], { ...CLAMP, easing: EASE.enter });

export const linearProgress = (frame: number, at: number, length: number) =>
  interpolate(frame, [at, at + Math.max(1, length)], [0, 1], CLAMP);

export const ease = (frame: number, at: number, length: number, from: number, to: number, easing = EASE.enter) =>
  interpolate(frame, [at, at + Math.max(1, length)], [from, to], { ...CLAMP, easing });

export const springAt = (frame: number, fps: number, at: number, config = SPRING.reveal) =>
  spring({ frame: frame - at, fps, config });

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const revealPose = (frame: number, fps: number, at: number, distance = 48) => {
  const p = springAt(frame, fps, at);
  return {
    opacity: clamp01(p * 1.4),
    transform: `translateY(${Math.round((1 - p) * distance)}px)`,
    progress: clamp01(p),
  };
};

export const maskReveal = (frame: number, fps: number, at: number) => {
  const p = springAt(frame, fps, at, SPRING.reveal);
  return { progress: clamp01(p), y: (1 - clamp01(p)) * 110 };
};

export type CameraMove = "none" | "push" | "pull" | "panLeft" | "panRight" | "driftUp";

export const cameraTransform = (frame: number, duration: number, move: CameraMove = "push", strength = 1) => {
  const p = interpolate(frame, [0, Math.max(1, duration - 1)], [0, 1], { ...CLAMP, easing: EASE.camera });
  const s = Math.max(0, strength);
  let scale = 1;
  let x = 0;
  let y = 0;
  if (move === "push") scale = 1 + 0.1 * s * p;
  if (move === "pull") scale = 1.14 - 0.14 * s * p;
  if (move === "panLeft") x = -240 * s * p;
  if (move === "panRight") x = 240 * s * p;
  if (move === "driftUp") y = -90 * s * p;
  return { scale, x, y, transform: `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)})` };
};

export const parallaxOffset = (frame: number, duration: number, depth: number) => {
  const p = interpolate(frame, [0, Math.max(1, duration - 1)], [0, 1], { ...CLAMP, easing: EASE.camera });
  return (p - 0.5) * 120 * depth;
};

export const hash = (value: number) => {
  const v = Math.sin(value * 127.1 + 311.7) * 43758.5453123;
  return v - Math.floor(v);
};

export const filmJitter = (frame: number, seed = 0) => (hash(frame + seed * 37) - 0.5) * 0.9;

export const countTo = (frame: number, at: number, length: number, target: number) =>
  Math.round(progress(frame, at, length) * target);

export const pulse = (frame: number, period = 40) => 0.5 + 0.5 * Math.sin((frame / period) * Math.PI * 2);

export const stampPose = (frame: number, fps: number, at: number) => {
  const t = frame - at;
  const impact = interpolate(t, [0, 3], [1.5, 1], CLAMP);
  const settle = t > 3 ? Math.sin((t - 3) * 0.85) * 0.025 * Math.exp(-(t - 3) * 0.3) : 0;
  const shake = t >= 3 && t < 12 ? Math.sin(t * 2.6) * 3 * (1 - (t - 3) / 9) : 0;
  return { scale: impact + settle, opacity: interpolate(t, [0, 2], [0, 1], CLAMP), shake };
};
