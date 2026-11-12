import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Headline } from "../style/components/Headline";
import { Brain, Cockroach } from "../style/components/Props";
import { POSES, Stick } from "../style/components/Stick";
import { Camera, Chip, Tag, Vignette } from "../style/components/ui";
import { C, SPRING, clamp } from "../style/theme";
import { wordFrame, wordIndex, type Word } from "../style/timing";

export const Scene02: React.FC<{ words: Word[]; from: number }> = ({
  words,
  from,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tDance = wordFrame(words, wordIndex(words, "danc"), fps) - from;

  const brainIn = spring({ frame, fps, config: SPRING.heavy });
  const roachIn = spring({
    frame,
    fps,
    delay: Math.max(0, tDance - 4),
    config: SPRING.bouncy,
  });
  const highlight = interpolate(roachIn, [0, 1], [0, 1], clamp);
  const dance = frame > tDance ? Math.sin((frame - tDance) / 3) * 16 : 0;

  const ring = (delay: number) =>
    spring({ frame, fps, delay: Math.max(0, delay), config: SPRING.smooth });

  return (
    <AbsoluteFill>
      <Vignette opacity={0.4} />
      <Chip text="CASE 02 / BRAIN DANCE" />
      <Headline text="BRAIN DANCE" />
      <Camera from={1} to={1.06}>
        <div
          style={{
            position: "absolute",
            left: 140,
            top: 760,
            opacity: interpolate(brainIn, [0, 0.3], [0, 1], clamp),
            transform: `scale(${interpolate(brainIn, [0, 1], [0.8, 1])})`,
          }}
        >
          <Brain size={520} highlight={highlight} />
        </div>
        {[ring(tDance), ring(tDance + 4)].map((r, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 431 - 90 - r * 120,
              top: 1030 - 90 - r * 120,
              width: 180 + r * 240,
              height: 180 + r * 240,
              borderRadius: "50%",
              border: `4px solid ${C.primary}`,
              opacity: Math.max(0, 0.5 - r * 0.5),
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            left: 356,
            top: 955,
            opacity: interpolate(roachIn, [0, 0.3], [0, 1], clamp),
            transform: `rotate(${dance}deg) scale(${interpolate(roachIn, [0, 1], [0.5, 1])})`,
          }}
        >
          <Cockroach size={150} color={C.panel} glow={1} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 700,
            top: 820,
            transform: "scaleX(-1)",
          }}
        >
          <Stick pose={POSES.point} width={240} shirt={C.secondary} mood="happy" />
        </div>
      </Camera>
      <Tag
        text="STRAIGHT INTO ONE SMALL PART OF THE BRAIN"
        top={1250}
        color={C.muted}
        size={44}
      />
    </AbsoluteFill>
  );
};
