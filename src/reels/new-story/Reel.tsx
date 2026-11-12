import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand as myBrand } from "../../brand";
import { ReelFrame, type ReelProps } from "../../components";
import type { Word } from "../../timing";
import rawWords from "../../../public/reels/new-story/captions.words.json";
import { Background } from "./style/components/Background";
import { Caption } from "./style/components/Caption";
import { W, clamp } from "./style/theme";
import { sceneTimings, totalFrames } from "./style/timing";
import { Scene01 } from "./scenes/Scene01";
import { Scene02 } from "./scenes/Scene02";
import { Scene03 } from "./scenes/Scene03";
import { Scene04 } from "./scenes/Scene04";
import { Scene05 } from "./scenes/Scene05";
import { Scene06 } from "./scenes/Scene06";

const WORDS = rawWords as Word[];

export const AUDIO = "reels/new-story/vo.wav";

const T = 10;

const SCENE_STARTS = [0, 11, 20, 29, 41, 50];
const SCENES = [Scene01, Scene02, Scene03, Scene04, Scene05, Scene06];

type TransitionKind = "none" | "fade" | "slide";

const SceneTransition: React.FC<{
  children: React.ReactNode;
  duration: number;
  incoming: TransitionKind;
  outgoing: TransitionKind;
}> = ({ children, duration, incoming, outgoing }) => {
  const frame = useCurrentFrame();
  const inFade =
    incoming === "fade" ? interpolate(frame, [0, T], [0, 1], clamp) : 1;
  const outFade =
    outgoing === "fade"
      ? interpolate(frame, [duration - T, duration], [1, 0], clamp)
      : 1;
  const opacity = Math.min(inFade, outFade);
  const tx =
    (incoming === "slide"
      ? interpolate(frame, [0, T], [W, 0], clamp)
      : 0) +
    (outgoing === "slide"
      ? interpolate(frame, [duration - T, duration], [0, -W], clamp)
      : 0);
  return (
    <AbsoluteFill style={{ opacity, transform: `translateX(${tx}px)` }}>
      {children}
    </AbsoluteFill>
  );
};

const SceneSlot: React.FC<{
  index: number;
  from: number;
  frames: number;
  last: boolean;
  children: React.ReactNode;
}> = ({ index, from, frames, last, children }) => {
  const seqDuration = frames + (last ? 0 : T);
  const incoming: TransitionKind =
    index === 0 ? "none" : index % 2 === 1 ? "fade" : "slide";
  const outgoing: TransitionKind = last
    ? "none"
    : index % 2 === 0
      ? "fade"
      : "slide";
  return (
    <Sequence from={from} durationInFrames={seqDuration}>
      <SceneTransition
        duration={seqDuration}
        incoming={incoming}
        outgoing={outgoing}
      >
        {children}
      </SceneTransition>
    </Sequence>
  );
};

export const durationInFrames = totalFrames(WORDS, 30, 1);

export const Reel: React.FC<ReelProps> = ({
  brand = myBrand,
  debugSafeZones,
  probe,
}) => {
  const { fps } = useVideoConfig();
  const timings = sceneTimings(WORDS, SCENE_STARTS, fps, 1);

  return (
    <ReelFrame
      brand={brand}
      audio={AUDIO}
      debugSafeZones={debugSafeZones}
      probe={probe}
    >
      <Background />
      {SCENES.map((Scene, i) => (
        <SceneSlot
          key={i}
          index={i}
          from={timings[i].from}
          frames={timings[i].frames}
          last={i === SCENES.length - 1}
        >
          <Scene words={WORDS} from={timings[i].from} />
        </SceneSlot>
      ))}
      <Caption words={WORDS} />
    </ReelFrame>
  );
};

export default Reel;
