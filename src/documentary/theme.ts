import { loadFont as loadBarlow } from "@remotion/google-fonts/BarlowCondensed";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadSpecial } from "@remotion/google-fonts/SpecialElite";

export const DOC_FONTS = {
  display: loadBarlow("normal", { weights: ["600", "700"], subsets: ["latin"] }).fontFamily,
  body: loadInter("normal", { weights: ["400", "500", "600", "800"], subsets: ["latin"] }).fontFamily,
  type: loadSpecial("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily,
};

export type DocTheme = {
  name: string;
  color: {
    void: string;
    deep: string;
    panel: string;
    paper: string;
    paperShade: string;
    ink: string;
    text: string;
    muted: string;
    faint: string;
    accent: string;
    signal: string;
    danger: string;
    line: string;
  };
  font: { display: string; body: string; type: string };
  motion: { base: number; reveal: number; hold: number; stagger: number };
  channel: { name: string; handle: string; mark: string };
  grain: number;
};

export const untoldStory: DocTheme = {
  name: "Untold Story",
  color: {
    void: "oklch(0.11 0.012 250)",
    deep: "oklch(0.18 0.016 250)",
    panel: "oklch(0.23 0.018 250)",
    paper: "oklch(0.91 0.018 84)",
    paperShade: "oklch(0.82 0.022 82)",
    ink: "oklch(0.24 0.012 80)",
    text: "oklch(0.96 0.008 85)",
    muted: "oklch(0.72 0.014 250)",
    faint: "oklch(0.52 0.016 250)",
    accent: "oklch(0.78 0.15 62)",
    signal: "oklch(0.76 0.11 210)",
    danger: "oklch(0.62 0.18 25)",
    line: "oklch(0.38 0.018 250)",
  },
  font: DOC_FONTS,
  motion: { base: 15, reveal: 18, hold: 90, stagger: 4 },
  channel: { name: "UNTOLD STORY", handle: "@untoldstory", mark: "US" },
  grain: 0.045,
};

export const coldCase: DocTheme = {
  ...untoldStory,
  name: "Cold Case",
  color: {
    ...untoldStory.color,
    void: "oklch(0.12 0.018 150)",
    deep: "oklch(0.19 0.024 155)",
    panel: "oklch(0.25 0.026 155)",
    accent: "oklch(0.76 0.13 145)",
    signal: "oklch(0.79 0.12 95)",
    line: "oklch(0.39 0.02 155)",
  },
};

export const THEMES = { untoldStory, coldCase };
export type ThemeKey = keyof typeof THEMES;

export const getTheme = (key: string | undefined): DocTheme => THEMES[(key as ThemeKey) ?? "untoldStory"] ?? untoldStory;

export const alpha = (color: string, percent: number) =>
  `color-mix(in oklab, ${color} ${percent}%, transparent)`;
