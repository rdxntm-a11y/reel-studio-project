import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

export const W = 1080;
export const H = 1920;
export const FPS = 30;

export const C = {
  bg: "#0B1220",
  bgDark: "#060A12",
  panel: "#141E33",
  line: "#2A3654",
  ink: "#F5F2EA",
  primary: "#FFC83D",
  secondary: "#3EC9FF",
  success: "#2ED9A0",
  danger: "#FF5C5C",
  muted: "#8E9BB8",
} as const;

const bebas = loadBebas("normal", { weights: ["400"], subsets: ["latin"] });
const inter = loadInter("normal", {
  weights: ["500", "700", "800"],
  subsets: ["latin"],
});

export const FONT = {
  headline: `${bebas.fontFamily}, Impact, sans-serif`,
  body: `${inter.fontFamily}, system-ui, sans-serif`,
};

export const SAFE = { left: 60, right: 960, top: 220, bottom: 1520 };
export const ZONE = {
  chip: { y: 200, h: 60 },
  headline: { y: 280, h: 420 },
  hero: { y: 720, h: 580, cx: 540, cy: 1010 },
  caption: { y: 1330, h: 190 },
};

export const SPRING = {
  smooth: { damping: 200 },
  snappy: { damping: 20, stiffness: 200 },
  pop: { damping: 12, stiffness: 180, mass: 0.8 },
  bouncy: { damping: 8 },
  heavy: { damping: 15, stiffness: 80, mass: 2 },
  whip: { damping: 14, stiffness: 260, mass: 0.5 },
} as const;

export const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
