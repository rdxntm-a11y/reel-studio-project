import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadTypewriter } from "@remotion/google-fonts/SpecialElite";

export const W = 1080;
export const H = 1920;
export const FPS = 30;

export const FONT = {
  display: loadBebas("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily,
  body: loadInter("normal", { weights: ["400", "600", "800"], subsets: ["latin"] }).fontFamily,
  hand: loadCaveat("normal", { weights: ["400", "700"], subsets: ["latin"] }).fontFamily,
  type: loadTypewriter("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily,
};

export const C = {
  paper: "oklch(0.8975 0.0358 85.41)",
  paperLight: "oklch(0.9393 0.0258 84.59)",
  paperDeep: "oklch(0.8344 0.0478 85.17)",
  charcoal: "oklch(0.2846 0.0073 95.32)",
  charcoalSoft: "oklch(0.3407 0.0106 91.65)",
  ink: "oklch(0.2709 0.0123 78.08)",
  inkSoft: "oklch(0.4456 0.0197 79.21)",
  inkFaint: "oklch(0.6074 0.0221 77.21)",
  red: "oklch(0.5013 0.1783 28.70)",
  redDark: "oklch(0.4065 0.1432 28.59)",
  lead: "oklch(0.6013 0.0122 256.72)",
  leadLight: "oklch(0.7423 0.0103 252.84)",
  white: "oklch(0.9593 0.0184 86.15)",
};

/** Perceptual alpha mix — avoids the grey cast of rgba over dark paper. */
export const alpha = (color: string, percent: number) =>
  `color-mix(in oklab, ${color} ${percent}%, transparent)`;

export const ZONE = {
  headline: { x: 60, y: 260, w: 960, h: 400 },
  hero: { x: 60, y: 720, w: 900, h: 520 },
  caption: { x: 60, y: 1330, w: 900, h: 190 },
  stamp: { x: 650, y: 230, w: 300, h: 140 },
};

export const SPRING = {
  slam: { damping: 12, stiffness: 220, mass: 0.7 },
  pop: { damping: 13, stiffness: 180, mass: 0.6 },
  drop: { damping: 9, stiffness: 160, mass: 0.9 },
};

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export type Tone = "paper" | "dark";

export const toneColors = (tone: Tone) =>
  tone === "paper"
    ? { bg: C.paper, fg: C.ink, soft: C.inkSoft, faint: C.inkFaint, panel: C.paperLight }
    : { bg: C.charcoal, fg: C.white, soft: C.paperDeep, faint: C.inkFaint, panel: C.charcoalSoft };
