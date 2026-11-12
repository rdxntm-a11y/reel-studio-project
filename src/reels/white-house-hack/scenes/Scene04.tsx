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
import { House, Mask, Wifi } from "../style/components/Props";
import { AddressPlate, Chip, Tag, Vignette } from "../style/components/ui";
import { C, SPRING, clamp } from "../style/theme";
import { wordFrame, type Word } from "../style/timing";

export const Scene04: React.FC<{ words: Word[]; from: number }> = ({
  words,
  from,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tHome = wordFrame(words, 55, fps) - from;

  const houseIn = spring({ frame, fps, config: SPRING.pop });
  const wifi = spring({ frame, fps, delay: 6, config: SPRING.smooth });
  const flip = spring({
    frame,
    fps,
    delay: Math.max(0, tHome - 4),
    config: SPRING.snappy,
  });
  const maskIn = spring({
    frame,
    fps,
    delay: Math.max(0, tHome - 4),
    config: SPRING.bouncy,
  });
  const p = Math.max(0, Math.min(1, flip));
  const plateA = interpolate(p, [0, 0.5], [1, 0], clamp);
  const plateB = interpolate(p, [0.5, 1], [0, 1], clamp);
  const peek = frame > tHome && frame < tHome + 8 ? 1 : 0;

  return (
    <AbsoluteFill>
      <Vignette opacity={0.2} />
      <Chip text="RESIDENTIAL PROXY" />
      <Headline text="A NORMAL HOME" accent={[2]} />

      <div
        style={{
          position: "absolute",
          left: 310,
          top: 760,
          opacity: interpolate(houseIn, [0, 0.4], [0, 1], clamp),
          transform: `scale(${interpolate(houseIn, [0, 1], [0.8, 1])})`,
        }}
      >
        <House size={460} peephole={peek} />
      </div>

      <div style={{ position: "absolute", left: 400, top: 640 }}>
        <Wifi size={280} progress={wifi} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 620,
          top: 880,
          opacity: interpolate(maskIn, [0, 0.25], [0, 1], clamp),
          transform: `translateY(${interpolate(maskIn, [0, 1], [-160, 0])}px)`,
        }}
      >
        <Mask size={140} />
      </div>

      <div style={{ position: "absolute", left: 720, top: 820 }}>
        <Stick pose={POSES.idle} width={220} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 470,
          top: 1130,
          width: 140,
          height: 70,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            opacity: plateA,
            transform: `scaleX(${plateA})`,
          }}
        >
          <AddressPlate text="1600" color={C.ink} />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            opacity: plateB,
            transform: `scaleX(${plateB})`,
          }}
        >
          <AddressPlate text="HOME" color={C.primary} />
        </div>
      </div>

      <Tag
        text="AS2650 · EOP NETWORK"
        top={1240}
        color={C.ink}
        size={48}
      />
    </AbsoluteFill>
  );
};
