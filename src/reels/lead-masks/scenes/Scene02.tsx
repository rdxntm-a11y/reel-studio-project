import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PaperBackground } from "../style/components/PaperBackground";
import { Headline } from "../style/components/Headline";
import { Stamp } from "../style/components/Stamp";
import { Suitcase } from "../style/components/Props";
import { Floaty, Tag } from "../style/components/ui";
import { C, SPRING, clamp } from "../style/theme";
import type { SceneProps } from "../style/types";

export const Scene02: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stampAt = t.at(12) - from;
  const pop = spring({ frame: frame - 6, fps, config: SPRING.pop });
  const y = interpolate(pop, [0, 1], [120, 0], clamp);
  const tag = spring({ frame: frame - 34, fps, config: SPRING.pop });

  return (
    <AbsoluteFill>
      <PaperBackground tone="paper" seed={11} />
      <Headline text="MANOEL + MIGUEL" tone="paper" accent={[2]} size={128} delay={2} width={600} align="left" />
      <Stamp text="TECHNICIANS" delay={stampAt} rotate={5} size={58} style={{ left: 548, top: 238 }} />

      <div
        data-el="hero"
        data-kind="content"
        style={{
          position: "absolute",
          left: 60,
          top: 760,
          width: 900,
          height: 520,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 20,
          transform: `translateY(${y}px)`,
          opacity: pop,
        }}
      >
        <Floaty amount={7} speed={20}>
          <Suitcase width={520} />
        </Floaty>
        <div
          style={{
            display: "flex",
            gap: 26,
            opacity: tag,
            transform: `scale(${interpolate(tag, [0, 1], [0.7, 1])})`,
          }}
        >
          <Tag text="CASH" rotate={-3} />
          <Tag text="TOOL BELT" rotate={2} background={C.paperDeep} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
