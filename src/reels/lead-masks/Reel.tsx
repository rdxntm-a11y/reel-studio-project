import React from "react";
import { Sequence } from "remotion";
import { brand as defaultBrand } from "../../brand";
import { ReelFrame, type ReelProps } from "../../components";
import { timing, type Word } from "../../timing";
import rawWords from "../../../public/reels/lead-masks/captions.words.json";
import { Caption } from "./style/components/Caption";
import { Scene01 } from "./scenes/Scene01";
import { Scene02 } from "./scenes/Scene02";
import { Scene03Clock, Scene03Receipt } from "./scenes/Scene03";
import { Scene04Bodies, Scene04Discovery } from "./scenes/Scene04";
import { Scene05 } from "./scenes/Scene05";
import { Scene06Capsules, Scene06Metal, Scene06Notebook } from "./scenes/Scene06";
import { Scene07Autopsy, Scene07Unsolved } from "./scenes/Scene07";
import { Scene08CTA, Scene08Theory } from "./scenes/Scene08";
import type { SceneProps } from "./style/types";

const WORDS = rawWords as Word[];
const T = timing(WORDS);

export const AUDIO = "reels/lead-masks/vo.wav";
export const durationInFrames = T.duration(1);

const Beat: React.FC<{
  name: string;
  from: number;
  frames: number;
  children: React.ReactNode;
}> = ({ name, from, frames, children }) => (
  <Sequence from={from} durationInFrames={frames}>
    <div data-scene={name} style={{ position: "absolute", inset: 0 }}>
      {children}
    </div>
  </Sequence>
);

const BEATS: { name: string; from: number; frames: number; Scene: React.FC<SceneProps> }[] = [
  { name: "s1-hook", from: T.at(0), frames: T.at(8) - T.at(0), Scene: Scene01 },
  { name: "s2-technicians", from: T.at(8), frames: T.at(21) - T.at(8), Scene: Scene02 },
  { name: "s3-clock", from: T.at(21), frames: T.at(27) - T.at(21), Scene: Scene03Clock },
  { name: "s3-receipt", from: T.at(27), frames: T.at(39) - T.at(27), Scene: Scene03Receipt },
  { name: "s4-discovery", from: T.at(39), frames: T.at(52) - T.at(39), Scene: Scene04Discovery },
  { name: "s4-bodies", from: T.at(52), frames: T.at(59) - T.at(52), Scene: Scene04Bodies },
  { name: "s5-no-wounds", from: T.at(59), frames: T.at(72) - T.at(59), Scene: Scene05 },
  { name: "s6-notebook", from: T.at(72), frames: T.at(76) - T.at(72), Scene: Scene06Notebook },
  { name: "s6-capsules", from: T.at(76), frames: T.at(80) - T.at(76), Scene: Scene06Capsules },
  { name: "s6-metal", from: T.at(80), frames: T.at(88) - T.at(80), Scene: Scene06Metal },
  { name: "s7-autopsy", from: T.at(88), frames: T.at(95) - T.at(88), Scene: Scene07Autopsy },
  { name: "s7-unsolved", from: T.at(95), frames: T.at(106) - T.at(95), Scene: Scene07Unsolved },
  { name: "s8-theory", from: T.at(106), frames: T.at(119) - T.at(106), Scene: Scene08Theory },
  { name: "s8-cta", from: T.at(119), frames: durationInFrames - T.at(119), Scene: Scene08CTA },
];

export const Reel: React.FC<ReelProps> = ({ brand = defaultBrand, debugSafeZones, probe }) => (
  <ReelFrame brand={brand} audio={AUDIO} debugSafeZones={debugSafeZones} probe={probe}>
    {BEATS.map(({ name, from, frames, Scene }) => (
      <Beat key={name} name={name} from={from} frames={frames}>
        <Scene t={T} from={from} />
      </Beat>
    ))}
    <Caption words={WORDS} />
  </ReelFrame>
);

export default Reel;
