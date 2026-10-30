// Every reel the studio and the render know about.
import React from "react";
import { ReelProps } from "../components";
import { Word } from "../timing";
import { PRESETS } from "../presets";
import * as demo from "./demo/Reel";
import HabitsOver40Reel from "./habits-over-40/Reel";

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
    Component: HabitsOver40Reel,
    durationInFrames: 1525 
  },
];

export type { Word };
