import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Headline } from "../style/components/Headline";
import { HatchCockroach } from "../style/components/Props";
import { Camera, Chip, Tag, Vignette } from "../style/components/ui";
import { C, SPRING, clamp } from "../style/theme";
import { wordFrame, wordIndex, type Word } from "../style/timing";

export const Scene05: React.FC<{ words: Word[]; from: number }> = ({
  words,
  from,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tBaby = wordFrame(words, wordIndex(words, "bachcha"), fps) - from;

  const shell = spring({ frame, fps, config: SPRING.heavy });
  const burst = spring({
    frame,
    fps,
    delay: Math.max(0, tBaby - 4),
    config: SPRING.bouncy,
  });
  const open = interpolate(burst, [0, 1], [0, 1], clamp);
  const baby = interpolate(burst, [0, 1], [0, 1], clamp);

  const ring = (delay: number) =>
    spring({ frame, fps, delay: Math.max(0, delay), config: SPRING.smooth });

  return (
    <AbsoluteFill>
      <Vignette opacity={0.45} />
      <Chip text="CASE 05 / THE BABY" />
      <Headline text="BABY COCKROACH" accent={[0]} />
      <Camera from={1} to={1.06}>
        <div
          style={{
            position: "absolute",
            left: 300,
            top: 780,
            opacity: interpolate(shell, [0, 0.3], [0, 1], clamp),
            transform: `scale(${interpolate(shell, [0, 1], [0.75, 1])})`,
          }}
        >
          <HatchCockroach size={460} open={open} baby={baby} />
        </div>
        {[ring(tBaby), ring(tBaby + 4)].map((r, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 530 - 90 - r * 130,
              top: 1037 - 90 - r * 130,
              width: 180 + r * 260,
              height: 180 + r * 260,
              borderRadius: "50%",
              border: `4px solid ${C.primary}`,
              opacity: Math.max(0, 0.55 - r * 0.55),
            }}
          />
        ))}
      </Camera>
      <Tag
        text="IT EATS THE HOST FROM THE INSIDE"
        top={1250}
        color={C.muted}
        size={44}
      />
    </AbsoluteFill>
  );
};
