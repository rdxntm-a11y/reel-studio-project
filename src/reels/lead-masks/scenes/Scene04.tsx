import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PaperBackground } from "../style/components/PaperBackground";
import { Headline } from "../style/components/Headline";
import { Stamp } from "../style/components/Stamp";
import { Kite } from "../style/components/Props";
import { PaperBody, StandingFigure } from "../style/components/PaperFigure";
import { Floaty, Tag } from "../style/components/ui";
import { C, SPRING, clamp } from "../style/theme";
import type { SceneProps } from "../style/types";

export const Scene04Discovery: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stampAt = t.at(40) - from;
  const bodiesAt = t.at(49) - from;
  const bodies = spring({ frame: frame - bodiesAt, fps, config: SPRING.pop });
  const boy = spring({ frame: frame - 12, fps, config: SPRING.pop });
  const y = interpolate(spring({ frame: frame - 4, fps, config: SPRING.pop }), [0, 1], [70, 0], clamp);

  return (
    <AbsoluteFill>
      <PaperBackground tone="paper" seed={31} />
      <Headline text="THE DISCOVERY" tone="paper" accent={[1]} size={142} delay={2} width={620} align="left" />
      <Stamp text="3 DAYS LATER" delay={stampAt} rotate={4} size={60} style={{ left: 520, top: 238 }} />
      <div
        data-el="hero"
        data-kind="content"
        style={{
          position: "absolute",
          left: 60,
          top: 720,
          width: 900,
          height: 560,
          transform: `translateY(${y}px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            opacity: boy,
            transform: `translateY(${interpolate(boy, [0, 1], [-30, 0], clamp)}px)`,
          }}
        >
          <Floaty amount={9} speed={18}>
            <Kite width={270} tilt={0} />
          </Floaty>
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 12,
            opacity: boy,
            transform: `translateY(${interpolate(boy, [0, 1], [30, 0], clamp)}px)`,
          }}
        >
          <StandingFigure tone="paper" width={130} mask={false} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 120,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "flex-end",
            gap: 4,
            opacity: bodies,
            transform: `translateY(${interpolate(bodies, [0, 1], [60, 0], clamp)}px)`,
          }}
        >
          <PaperBody tone="paper" outfit="suit" mask={1} width={390} />
          <PaperBody tone="paper" outfit="coat" mask={1} width={390} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Scene04Bodies: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const maskAt = t.at(58) - from;
  const drop = spring({ frame: frame - maskAt, fps, config: SPRING.drop });
  const suitAt = t.at(53) - from;
  const coatAt = t.at(55) - from;
  const suit = spring({ frame: frame - suitAt, fps, config: SPRING.pop });
  const coat = spring({ frame: frame - coatAt, fps, config: SPRING.pop });
  const pop = spring({ frame: frame - 2, fps, config: SPRING.pop });

  return (
    <AbsoluteFill>
      <PaperBackground tone="paper" seed={32} />
      <Headline text="THE OUTFIT" tone="paper" accent={[1]} size={150} delay={0} width={600} align="left" />
      <Stamp text="3 DAYS LATER" delay={-200} rotate={4} size={60} style={{ left: 520, top: 238 }} />
      <div
        data-el="hero"
        data-kind="content"
        style={{
          position: "absolute",
          left: 60,
          top: 720,
          width: 900,
          height: 560,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          opacity: pop,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
          <PaperBody tone="paper" outfit="suit" mask={drop} width={440} />
          <PaperBody tone="paper" outfit="coat" mask={drop} width={440} />
        </div>
        <div style={{ display: "flex", gap: 22 }}>
          <div style={{ opacity: suit, transform: `translateY(${interpolate(suit, [0, 1], [24, 0], clamp)}px)` }}>
            <Tag text="FORMAL SUIT" rotate={-3} size={30} />
          </div>
          <div style={{ opacity: coat, transform: `translateY(${interpolate(coat, [0, 1], [24, 0], clamp)}px)` }}>
            <Tag text="WATERPROOF COAT" rotate={2} size={30} background={C.paperDeep} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
