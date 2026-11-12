import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Headline } from "../style/components/Headline";
import { POSES, Stick } from "../style/components/Stick";
import { WhiteHouse } from "../style/components/Props";
import { Camera, Chip, Tag, Vignette } from "../style/components/ui";
import { C, SPRING, ZONE, clamp } from "../style/theme";
import { wordFrame, type Word } from "../style/timing";

export const Scene01: React.FC<{ words: Word[]; from: number }> = ({
  words,
  from,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tHide = wordFrame(words, 2, fps) - from;

  const drop = spring({ frame, fps, config: SPRING.heavy });
  const grid = spring({ frame, fps, delay: 4, config: SPRING.smooth });
  const pop = spring({
    frame,
    fps,
    delay: Math.max(0, tHide - 4),
    config: SPRING.pop,
  });
  const lit = spring({
    frame,
    fps,
    delay: Math.max(0, tHide - 4),
    config: SPRING.pop,
  });
  const flicker = frame > tHide && frame < tHide + 6;
  const houseW = 760;
  const houseTop = ZONE.hero.y + 40;

  return (
    <AbsoluteFill>
      <Vignette opacity={0.25} />
      <Chip text="CASE FILE 01 / WHITE HOUSE" />
      <Headline text="SOMEONE IS INSIDE" accent={[2]} />
      <Camera from={1} to={1.04}>
        <div
          style={{
            position: "absolute",
            left: ZONE.hero.cx - houseW / 2,
            top: houseTop,
            opacity: interpolate(drop, [0, 0.3], [0, 1], clamp),
            transform: `translateY(${interpolate(drop, [0, 1], [-80, 0])}px)`,
          }}
        >
          <WhiteHouse
            size={houseW}
            grid={grid}
            lit={lit}
            flag={flicker ? 0.35 : 1}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: ZONE.hero.cx - 90,
            top: houseTop + 140,
            opacity: interpolate(pop, [0, 0.4], [0, 1], clamp),
            transform: `scale(${interpolate(pop, [0, 1], [0.6, 1])})`,
          }}
        >
          <Stick pose={POSES.idle} width={180} blink={flicker ? 1 : 0} />
        </div>
      </Camera>
      <Tag
        text="PROXY EXIT, NOT A BREACH"
        top={1260}
        color={C.muted}
        size={44}
      />
    </AbsoluteFill>
  );
};
