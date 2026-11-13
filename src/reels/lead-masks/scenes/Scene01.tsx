import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PaperBackground } from "../style/components/PaperBackground";
import { Headline } from "../style/components/Headline";
import { Stamp } from "../style/components/Stamp";
import { PaperBody } from "../style/components/PaperFigure";
import { C, SPRING, clamp } from "../style/theme";
import type { SceneProps } from "../style/types";

export const Scene01: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const maskAt = t.at(4) - from;
  const drop = spring({ frame: frame - maskAt, fps, config: SPRING.drop });
  const reveal = spring({ frame: frame - 10, fps, config: SPRING.pop });
  const revealY = interpolate(reveal, [0, 1], [80, 0], clamp);
  const hill = interpolate(reveal, [0, 1], [40, 0], clamp);

  return (
    <AbsoluteFill>
      <PaperBackground tone="paper" seed={3} />
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0 }}
      >
        <path
          d={`M 0 ${1040 + hill} L 220 900 L 430 1010 L 620 880 L 860 1000 L 1080 930 L 1080 1920 L 0 1920 Z`}
          fill={C.charcoal}
          opacity="0.92"
        />
        <path
          d={`M 0 ${1090 + hill} L 260 980 L 500 1070 L 760 960 L 1080 1040`}
          stroke={C.ink}
          strokeWidth="6"
          fill="none"
          opacity="0.6"
        />
      </svg>

      <Headline text="BRAZIL 1966" tone="paper" accent={[1]} size={190} delay={2} width={680} align="left" />
      <Stamp text="1966" delay={2} rotate={-8} size={108} style={{ left: 704, top: 238 }} />

      <div
        data-el="hero"
        data-kind="content"
        style={{
          position: "absolute",
          left: 60,
          top: 760,
          width: 900,
          height: 560,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 8,
          transform: `translateY(${revealY}px)`,
          opacity: reveal,
        }}
      >
        <PaperBody tone="paper" outfit="suit" mask={drop} width={440} />
        <PaperBody tone="paper" outfit="coat" mask={drop} width={440} />
      </div>
    </AbsoluteFill>
  );
};
