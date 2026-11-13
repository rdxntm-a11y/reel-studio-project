import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { useBrand } from "../../../brand-context";
import { PaperBackground } from "../style/components/PaperBackground";
import { Headline } from "../style/components/Headline";
import { Stamp } from "../style/components/Stamp";
import { UFO } from "../style/components/Props";
import { StandingFigure } from "../style/components/PaperFigure";
import { Tag } from "../style/components/ui";
import { alpha, C, FONT, SPRING, clamp } from "../style/theme";
import type { SceneProps } from "../style/types";

export const Scene08Theory: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stampAt = t.at(106) - from;
  const flickerAt = t.at(111) - from;
  const glowAt = t.at(114) - from;
  const overdoseAt = t.at(116) - from;
  const tagAt = t.at(108) - from;
  const pop = spring({ frame: frame - 2, fps, config: SPRING.pop });
  const glow = Math.max(
    interpolate(frame, [glowAt, glowAt + 14], [0, 0.9], clamp),
    interpolate(frame, [overdoseAt, overdoseAt + 10], [0, 1], clamp),
  );
  const flicker = Math.max(0, 1 - Math.abs(frame - flickerAt) / 6);
  const tag = spring({ frame: frame - tagAt, fps, config: SPRING.pop });

  return (
    <AbsoluteFill>
      <PaperBackground tone="paper" seed={71} />
      <Headline text="THE THEORY" tone="paper" accent={[1]} size={150} delay={0} width={620} align="left" />
      <Stamp text="THEORY" delay={stampAt} rotate={-8} size={90} style={{ left: 600, top: 238 }} />
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
          alignItems: "flex-end",
          justifyContent: "center",
          opacity: pop,
          transform: `translateY(${interpolate(pop, [0, 1], [70, 0], clamp)}px)`,
        }}
      >
        <div style={{ position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)" }}>
          <UFO beam={1} flicker={flicker} width={430} />
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 34, marginBottom: 10 }}>
          <StandingFigure tone="paper" width={150} glow={glow} />
          <StandingFigure tone="paper" width={150} glow={glow} />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: -8,
            left: 0,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            opacity: tag,
            transform: `translateY(${interpolate(tag, [0, 1], [22, 0], clamp)}px)`,
          }}
        >
          <Tag text="SCIENTIFIC SPIRITUALISTS" rotate={-2} size={28} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const torn =
  "polygon(0 3%, 4% 0, 8% 3%, 12% 0, 16% 3%, 20% 0, 24% 3%, 28% 0, 32% 3%, 36% 0, 40% 3%, 44% 0, 48% 3%, 52% 0, 56% 3%, 60% 0, 64% 3%, 68% 0, 72% 3%, 76% 0, 80% 3%, 84% 0, 88% 3%, 92% 0, 96% 3%, 100% 0, 100% 100%, 0 100%)";

export const Scene08CTA: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { handle } = useBrand();
  const stampAt = t.at(119) - from;
  const s = spring({ frame: frame - 2, fps, config: SPRING.pop });
  const y = interpolate(s, [0, 1], [80, 0], clamp);

  return (
    <AbsoluteFill>
      <PaperBackground tone="paper" seed={72} />
      <div
        data-el="endcard"
        data-kind="content"
        style={{
          position: "absolute",
          left: 160,
          top: 720,
          width: 760,
          height: 560,
          containerType: "inline-size",
          transform: `translateY(${y}px) rotate(-1deg)`,
          opacity: s,
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            background: C.paperLight,
            border: `5px solid ${C.ink}`,
            boxShadow: `0 18px 0 ${alpha(C.ink, 20)}`,
            clipPath: torn,
            padding: "54px 50px",
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 28, letterSpacing: 4, color: C.inkSoft }}>
            MORE REAL CASES
          </div>
          <div style={{ fontFamily: FONT.display, fontSize: "clamp(64px, 12.1cqi, 92px)", lineHeight: 0.95, color: C.ink, marginTop: 12 }}>
            THAT KEEP YOU
            <br />
            UP AT NIGHT
          </div>
          <div style={{ marginTop: 20, fontFamily: FONT.body, fontWeight: 800, fontSize: 34, color: C.ink }}>
            {handle}
          </div>
          <Stamp text="FOLLOW" delay={stampAt} rotate={-8} size={70} style={{ left: 318, top: 348 }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
