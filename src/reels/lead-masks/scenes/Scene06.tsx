import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PaperBackground } from "../style/components/PaperBackground";
import { Headline } from "../style/components/Headline";
import { Stamp } from "../style/components/Stamp";
import { Capsule, Notebook } from "../style/components/Props";
import { LeadMask } from "../style/components/PaperFigure";
import { C, FONT, SPRING, clamp } from "../style/theme";
import type { SceneProps } from "../style/types";

const HandLine: React.FC<{
  text: string;
  at: number;
  size?: number;
  color?: string;
  rotate?: number;
}> = ({ text, at, size = 52, color = C.ink, rotate = -1.5 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: SPRING.pop });
  const reveal = interpolate(s, [0, 1], [0, 100], clamp);
  return (
    <div
      style={{
        fontFamily: FONT.hand,
        fontSize: size,
        lineHeight: 1.15,
        color,
        opacity: s,
        transform: `rotate(${rotate}deg)`,
        clipPath: `inset(0 ${100 - reveal}% 0 0)`,
      }}
    >
      {text}
    </div>
  );
};

export const Scene06Notebook: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stampAt = t.at(73) - from;
  const pop = spring({ frame: frame - 2, fps, config: SPRING.pop });

  return (
    <AbsoluteFill>
      <PaperBackground tone="paper" seed={51} />
      <Headline text="THE NOTEBOOK" tone="paper" accent={[1]} size={140} delay={0} width={700} align="left" />
      <Stamp text="INSTRUCTIONS" delay={stampAt} rotate={-4} size={58} style={{ left: 500, top: 238 }} />
      <div
        data-el="hero"
        data-kind="content"
        style={{
          position: "absolute",
          left: 60,
          top: 730,
          width: 900,
          height: 540,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: pop,
          transform: `translateY(${interpolate(pop, [0, 1], [70, 0], clamp)}px)`,
        }}
      >
        <Notebook width={760}>
          <HandLine text="16:30 — PAHUNCHO" at={t.at(73) - from} size={54} />
          <div style={{ height: 18 }} />
          <div style={{ fontFamily: FONT.hand, fontSize: 34, color: C.inkFaint, transform: "rotate(-1deg)" }}>
            (reach the meeting point)
          </div>
        </Notebook>
      </div>
    </AbsoluteFill>
  );
};

export const Scene06Capsules: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const capsuleAt = t.at(78) - from;
  const capsule = spring({ frame: frame - capsuleAt, fps, config: SPRING.pop });
  const pop = spring({ frame: frame - 2, fps, config: SPRING.pop });

  return (
    <AbsoluteFill>
      <PaperBackground tone="paper" seed={52} />
      <Headline text="18:30" tone="paper" accent={[0]} size={178} delay={0} width={500} align="left" />
      <Stamp text="INSTRUCTIONS" delay={-200} rotate={-4} size={58} style={{ left: 500, top: 238 }} />
      <div
        data-el="hero"
        data-kind="content"
        style={{
          position: "absolute",
          left: 60,
          top: 730,
          width: 900,
          height: 540,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: pop,
          transform: `translateY(${interpolate(pop, [0, 1], [70, 0], clamp)}px)`,
        }}
      >
        <Notebook width={760}>
          <div style={{ fontFamily: FONT.hand, fontSize: 46, color: C.inkFaint, opacity: 0.45, transform: "rotate(-1.5deg)" }}>
            16:30 — PAHUNCHO
          </div>
          <div style={{ height: 22 }} />
          <HandLine text="18:30 — CAPSULES LO" at={0} size={54} />
          <div style={{ marginTop: 18, opacity: capsule, transform: `scale(${interpolate(capsule, [0, 1], [0.6, 1])})` }}>
            <Capsule width={150} rotate={-10} />
          </div>
        </Notebook>
      </div>
    </AbsoluteFill>
  );
};

export const Scene06Metal: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const maskAt = t.at(82) - from;
  const mask = spring({ frame: frame - maskAt, fps, config: SPRING.pop });
  const pop = spring({ frame: frame - 2, fps, config: SPRING.pop });

  return (
    <AbsoluteFill>
      <PaperBackground tone="paper" seed={53} />
      <Headline text="THE RULE" tone="paper" accent={[1]} size={154} delay={0} width={500} align="left" />
      <Stamp text="INSTRUCTIONS" delay={-200} rotate={-4} size={58} style={{ left: 500, top: 238 }} />
      <div
        data-el="hero"
        data-kind="content"
        style={{
          position: "absolute",
          left: 60,
          top: 730,
          width: 900,
          height: 540,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: pop,
          transform: `translateY(${interpolate(pop, [0, 1], [70, 0], clamp)}px)`,
        }}
      >
        <Notebook width={760}>
          <div style={{ fontFamily: FONT.hand, fontSize: 40, color: C.inkFaint, opacity: 0.4, transform: "rotate(-1.5deg)" }}>
            16:30 — PAHUNCHO / 18:30 — CAPSULES
          </div>
          <div style={{ height: 20 }} />
          <HandLine text="METAL BACHÃO" at={0} size={52} />
          <div style={{ height: 8 }} />
          <HandLine text="MASK KA SIGNAL KA INTEZAAR" at={t.at(84) - from} size={38} rotate={-1} />
          <div
            style={{
              marginTop: 16,
              display: "flex",
              alignItems: "center",
              gap: 22,
              opacity: mask,
              transform: `translateY(${interpolate(mask, [0, 1], [24, 0], clamp)}px)`,
            }}
          >
            <LeadMask size={90} />
            <svg width="120" height="60" viewBox="0 0 120 60">
              <path d="M 10 30 Q 30 4 50 30" stroke={C.red} strokeWidth="5" fill="none" />
              <path d="M 26 30 Q 46 8 66 30" stroke={C.red} strokeWidth="5" fill="none" opacity="0.75" />
              <path d="M 42 30 Q 62 12 82 30" stroke={C.red} strokeWidth="5" fill="none" opacity="0.5" />
            </svg>
          </div>
        </Notebook>
      </div>
    </AbsoluteFill>
  );
};
