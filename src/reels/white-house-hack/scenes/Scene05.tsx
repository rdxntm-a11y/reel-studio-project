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
import { House } from "../style/components/Props";
import { Camera, Chip, Vignette } from "../style/components/ui";
import { SPRING, clamp } from "../style/theme";
import { wordFrame, type Word } from "../style/timing";

export const Scene05: React.FC<{ words: Word[]; from: number }> = ({
  words,
  from,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tCreep = wordFrame(words, 61, fps) - from;

  const d0 = interpolate(frame, [tCreep - 14, tCreep - 8], [0, 1], clamp);
  const d1 = interpolate(frame, [tCreep - 10, tCreep - 4], [0, 1], clamp);
  const d2 = interpolate(frame, [tCreep - 6, tCreep], [0, 1], clamp);
  const porch = spring({
    frame,
    fps,
    delay: Math.max(0, tCreep - 8),
    config: SPRING.pop,
  });
  const flick =
    frame > tCreep && frame < tCreep + 12
      ? Math.floor((frame - tCreep) / 3) % 2 === 0
        ? 1
        : 0.2
      : 1;

  return (
    <AbsoluteFill>
      <Vignette opacity={0.55} />
      <Chip text="THE CREEP" />
      <Headline text="THIS IS CREEPY" accent={[2]} />
      <Camera from={1} to={1.08}>
        <div style={{ position: "absolute", left: 290, top: 800 }}>
          <House
            size={500}
            windowDark={[d0, d1, d2]}
            porchLight={porch * flick}
          />
        </div>
        <div style={{ position: "absolute", left: 470, top: 900 }}>
          <Stick
            pose={{ ...POSES.idle, head: -4 }}
            width={200}
            mood={frame > tCreep ? "neutral" : "happy"}
          />
        </div>
      </Camera>
    </AbsoluteFill>
  );
};
