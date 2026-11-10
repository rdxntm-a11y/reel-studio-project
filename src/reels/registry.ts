// Every reel the studio and the render know about.
import React from "react";
import { ReelProps } from "../components";
import { Word } from "../timing";
import { PRESETS } from "../presets";
import * as demo from "./demo/Reel";
import * as r_habits_over_40 from "./habits-over-40/Reel";
import * as r_juliane_koepcke from "./juliane-koepcke/Reel";
import * as r_desert_survival from "./desert-survival/Reel";
import * as r_white_house_hack from "./white-house-hack/Reel";

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
    Component: r_habits_over_40.Reel, 
    durationInFrames: 1525 
  },
  { 
    id: "juliane-koepcke", 
    Component: r_juliane_koepcke.Reel, 
    durationInFrames: 1700 
  },
  { 
    id: "desert-survival", 
    Component: r_desert_survival.Reel, 
    durationInFrames: r_desert_survival.durationInFrames 
  },
  { 
    id: "white-house-hack", 
    Component: r_white_house_hack.Reel, 
    durationInFrames: r_white_house_hack.durationInFrames 
  },
];

export type { Word };
