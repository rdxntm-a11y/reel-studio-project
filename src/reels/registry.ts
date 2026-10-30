// Every reel the studio and the render know about.
import type React from "react";
import type { ReelProps } from "../components";
import type { Word } from "../timing";
import { PRESETS } from "../presets";
import * as demo from "./demo/Reel";

export type ReelEntry = {
  id: string;
  Component?: React.FC<ReelProps>;
  lazyComponent?: () => Promise<React.FC<ReelProps>>;
  durationInFrames: number;
  variants?: { suffix: string; props: ReelProps }[];
};

export const REELS: ReelEntry[] = [
  {
    id: "Demo",
    Component: demo.Reel,
    durationInFrames: demo.durationInFrames,
    variants: [
      { suffix: "Illustrated", props: { avatar: "illustrated" } },
      { suffix: "Pixel", props: { avatar: "pixel" } },
      { suffix: "BoldDark", props: { brand: PRESETS.boldDark } },
      { suffix: "SoftPastel", props: { brand: PRESETS.softPastel } },
    ],
  },
  { 
    id: "habits-over-40", 
    lazyComponent: () => import("./habits-over-40/Reel").then((mod) => mod.default || mod.Reel || mod.HabitsOver40Reel),
    durationInFrames: 1525 
  },
];

export type { Word };
