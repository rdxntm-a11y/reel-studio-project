import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Headline } from "../style/components/Headline";
import { PropLabel } from "../style/components/ui";
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
  const { fps, durationInFrames } = useVideoConfig();
  const pop = spring({ frame: frame - 0, fps, config: SPRING.pop });
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.05], clamp);

  return (
    <AbsoluteFill>
      <Img src={staticFile("reels/lead-masks/assets/scene6-notebook.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }} />
      <Headline text="THE NOTEBOOK" tone="paper" accent={[1]} size={140} delay={0} width={700} align="left" />
      <div data-el="hero" data-kind="content" style={{ position: "absolute", left: 60, top: 730, width: 900, height: 540, display: "flex", alignItems: "center", justifyContent: "center", opacity: pop, transform: `translateY(${interpolate(pop, [0, 1], [70, 0], clamp)}px)` }}>
        <div style={{ background: "rgba(245,236,215,0.85)", padding: "28px 36px", borderRadius: 8, maxWidth: 760 }}>
          <HandLine text="16:30 — PAHUNCHO" at={t.at(73) - from} size={54} />
          <div style={{ height: 18 }} />
          <div style={{ fontFamily: FONT.hand, fontSize: 34, color: C.inkFaint, transform: "rotate(-1deg)" }}>
            (reach the meeting point)
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Scene06Capsules: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const capsuleAt = t.at(78) - from;
  const capsule = spring({ frame: frame - capsuleAt, fps, config: SPRING.pop });
  const pop = spring({ frame: frame - 0, fps, config: SPRING.pop });
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.05], clamp);

  return (
    <AbsoluteFill>
      <Img src={staticFile("reels/lead-masks/assets/scene6-capsules.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }} />
      <Headline text="18:30" tone="paper" accent={[0]} size={178} delay={0} width={500} align="left" />
      <div data-el="hero" data-kind="content" style={{ position: "absolute", left: 60, top: 730, width: 900, height: 540, display: "flex", alignItems: "center", justifyContent: "center", opacity: pop, transform: `translateY(${interpolate(pop, [0, 1], [70, 0], clamp)}px)` }}>
        <div style={{ background: "rgba(245,236,215,0.85)", padding: "28px 36px", borderRadius: 8, maxWidth: 760 }}>
          <div style={{ fontFamily: FONT.hand, fontSize: 46, color: C.inkFaint, opacity: 0.45, transform: "rotate(-1.5deg)" }}>
            16:30 — PAHUNCHO
          </div>
          <div style={{ height: 22 }} />
          <HandLine text="18:30 — CAPSULES LO" at={0} size={54} />
          <div style={{ marginTop: 18, opacity: capsule, transform: `scale(${interpolate(capsule, [0, 1], [0.6, 1], clamp)})` }}>
            <PropLabel text="CAPSULES" at={capsuleAt} rotate={-2} size={22} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Scene06Metal: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const maskAt = t.at(82) - from;
  const signalAt = t.at(84) - from;
  const mask = spring({ frame: frame - maskAt, fps, config: SPRING.pop });
  const pop = spring({ frame: frame - 0, fps, config: SPRING.pop });
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.05], clamp);

  return (
    <AbsoluteFill>
      <Img src={staticFile("reels/lead-masks/assets/scene6-metal.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }} />
      <Headline text="THE RULE" tone="paper" accent={[1]} size={154} delay={0} width={500} align="left" />
      <div data-el="hero" data-kind="content" style={{ position: "absolute", left: 60, top: 730, width: 900, height: 540, display: "flex", alignItems: "center", justifyContent: "center", opacity: pop, transform: `translateY(${interpolate(pop, [0, 1], [70, 0], clamp)}px)` }}>
        <div style={{ background: "rgba(245,236,215,0.85)", padding: "28px 36px", borderRadius: 8, maxWidth: 760 }}>
          <div style={{ fontFamily: FONT.hand, fontSize: 40, color: C.inkFaint, opacity: 0.4, transform: "rotate(-1.5deg)" }}>
            16:30 — PAHUNCHO / 18:30 — CAPSULES
          </div>
          <div style={{ height: 20 }} />
          <HandLine text="METAL BACHÃO" at={0} size={52} />
          <div style={{ height: 8 }} />
          <HandLine text="MASK KA SIGNAL KA INTEZAAR" at={maskAt} size={38} rotate={-1} />
          <div style={{ marginTop: 16, display: "flex", gap: 26, opacity: mask, transform: `translateY(${interpolate(mask, [0, 1], [24, 0], clamp)}px)` }}>
            <PropLabel text="LEAD MASK" at={maskAt} rotate={-1} size={22} />
            <PropLabel text="SIGNAL" at={signalAt} rotate={1} size={22} background={C.paperDeep} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
