// Every reel the studio and the render know about.
import type React from "react";
import type { ReelProps } from "../components";
import type { Word } from "../timing";
import { PRESETS } from "../presets";
import * as demo from "./demo/Reel";
import * as r_habits_over_40 from "./habits-over-40/Reel";

export type ReelEntry = {
  id: string;
  Component: React.FC<ReelProps>;
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
    Component: r_habits_over_40.HabitsOver40Reel, // Yahan HabitsOver40Reel likha hai
    durationInFrames: 1525 
  },
];

export type { Word };
