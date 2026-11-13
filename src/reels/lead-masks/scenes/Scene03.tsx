import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PaperBackground } from "../style/components/PaperBackground";
import { Headline } from "../style/components/Headline";
import { Stamp } from "../style/components/Stamp";
import { Clock, Receipt } from "../style/components/Props";
import { StandingFigure } from "../style/components/PaperFigure";
import { Floaty } from "../style/components/ui";
import { SPRING, clamp } from "../style/theme";
import type { SceneProps } from "../style/types";

export const Scene03Clock: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stampAt = t.at(22) - from;
  const pop = spring({ frame: frame - 4, fps, config: SPRING.pop });
  const y = interpolate(pop, [0, 1], [100, 0], clamp);
  const tick = Math.floor(frame / 15);
  const nudge = Math.sin(frame / 4) * 1.5;

  return (
    <AbsoluteFill>
      <PaperBackground tone="dark" seed={21} />
      <Headline text="THE NIGHT" tone="dark" accent={[1]} size={168} delay={2} width={580} align="left" />
      <Stamp text="17 AUGUST" delay={stampAt} rotate={-6} size={66} style={{ left: 570, top: 250 }} />
      <div
        data-el="hero"
        data-kind="content"
        style={{
          position: "absolute",
          left: 60,
          top: 720,
          width: 900,
          height: 540,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateY(${y}px)`,
          opacity: pop,
        }}
      >
        <Floaty amount={5} speed={24}>
          <div style={{ transform: `scale(${1 + nudge * 0.006})` }}>
            <Clock second={tick} minute={22 + frame / 900} width={390} />
          </div>
        </Floaty>
      </div>
    </AbsoluteFill>
  );
};

export const Scene03Receipt: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - 4, fps, config: SPRING.pop });
  const y = interpolate(pop, [0, 1], [100, 0], clamp);
  const figure = spring({ frame: frame - 18, fps, config: SPRING.pop });
  const stampAt = t.at(22) - from;

  return (
    <AbsoluteFill>
      <PaperBackground tone="dark" seed={22} />
      <Headline text="NERVOUS" tone="dark" accent={[0]} size={168} delay={2} width={620} align="left" />
      <Stamp text="17 AUGUST" delay={stampAt} rotate={-6} size={66} style={{ left: 570, top: 250 }} />
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
          gap: 46,
          transform: `translateY(${y}px)`,
          opacity: pop,
        }}
      >
        <Receipt width={430} />
        <div style={{ opacity: figure, transform: `translateY(${interpolate(figure, [0, 1], [40, 0], clamp)}px)` }}>
          <StandingFigure tone="dark" width={170} mask={false} watch />
        </div>
      </div>
    </AbsoluteFill>
  );
};
