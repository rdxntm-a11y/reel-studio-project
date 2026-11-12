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
import { Door, Mask, ServerRack } from "../style/components/Props";
import { Chip, Vignette } from "../style/components/ui";
import { C, SPRING, clamp, sin01 } from "../style/theme";
import { wordFrame, type Word } from "../style/timing";

export const Scene11: React.FC<{ words: Word[]; from: number }> = ({
  words,
  from,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tMask = wordFrame(words, 152, fps) - from;

  const doorIn = spring({ frame, fps, config: SPRING.heavy });
  const walk = spring({ frame, fps, delay: 0, config: SPRING.smooth });
  const maskIn = spring({
    frame,
    fps,
    delay: Math.max(0, tMask - 4),
    config: SPRING.bouncy,
  });
  const lights = [0, 1, 2].map((i) =>
    spring({
      frame,
      fps,
      delay: Math.max(0, tMask + 4 + i * 3),
      config: SPRING.snappy,
    }),
  );

  return (
    <AbsoluteFill>
      <Vignette opacity={0.45} />
      <Chip text="THE TWIST" />
      <Headline text="THE MASK OF NORMAL" accent={[1]} size={120} />

      <div style={{ position: "absolute", left: 640, top: 820, opacity: 0.35 }}>
        <ServerRack
          size={320}
          tint={C.panel}
          lightColor={C.secondary}
          lights={lights}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 310,
          top: 760,
          opacity: interpolate(doorIn, [0, 0.4], [0, 1], clamp),
          transform: `scale(${interpolate(doorIn, [0, 1], [0.8, 1])})`,
        }}
      >
        <Door size={460} open={1} light={0.8 + 0.2 * sin01(frame, 0.2)} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 420,
          top: 860,
          transform: `translateX(${interpolate(walk, [0, 1], [-80, 0])}px)`,
        }}
      >
        <Stick pose={POSES.walk} width={240} mood="neutral" />
      </div>

      <div
        style={{
          position: "absolute",
          left: 475,
          top: 855,
          opacity: interpolate(maskIn, [0, 0.25], [0, 1], clamp),
          transform: `translateY(${interpolate(maskIn, [0, 1], [-160, 0])}px)`,
        }}
      >
        <Mask size={130} />
      </div>
    </AbsoluteFill>
  );
};
