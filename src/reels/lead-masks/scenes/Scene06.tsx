import React from "react";
import { AbsoluteFill, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Headline } from "../style/components/Headline";
import { PropLabel } from "../style/components/ui";
import { Capsule } from "../style/components/Props";
import { LeadMask as MaskGraphic } from "../style/components/PaperFigure";
import { alpha, C, FONT, SPRING, clamp } from "../style/theme";
import { slide } from "../style/motion";
import type { SceneProps } from "../style/types";

// A torn paper scrap that slides in from an edge and "writes" its line on the word.
const tornTop =
  "polygon(0 7%, 5% 0, 10% 7%, 15% 0, 20% 7%, 25% 0, 30% 7%, 35% 0, 40% 7%, 45% 0, 50% 7%, 55% 0, 60% 7%, 65% 0, 70% 7%, 75% 0, 80% 7%, 85% 0, 90% 7%, 95% 0, 100% 7%, 100% 100%, 0 100%)";

const TornNote: React.FC<{
  text: string;
  at: number;
  from?: "left" | "right" | "top" | "bottom";
  sub?: string;
  subAt?: number;
  size?: number;
  rotate?: number;
}> = ({ text, at, from = "left", sub, subAt, size = 52, rotate = -1.5 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: SPRING.pop });
  const write = interpolate(s, [0, 1], [0, 100], clamp);
  return (
    <div style={{ opacity: s, transform: slide(s, from, 230) }}>
      <div
        style={{
          position: "relative",
          background: C.paperLight,
          padding: "30px 38px 34px",
          clipPath: tornTop,
          boxShadow: `0 14px 0 ${alpha(C.ink, 16)}`,
          transform: `rotate(${rotate}deg)`,
        }}
      >
        <div
          style={{
            fontFamily: FONT.hand,
            fontSize: size,
            lineHeight: 1.12,
            color: C.ink,
            clipPath: `inset(0 ${100 - write}% 0 0)`,
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </div>
        {sub ? (
          <div style={{ marginTop: 12, fontFamily: FONT.hand, fontSize: 32, color: C.inkFaint, transform: "rotate(-1deg)" }}>
            <PropLabel text={sub} at={subAt ?? at} rotate={-1} size={22} background={C.paperDeep} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

// "Notebook: 16:30 par pahuncho."  The scrap slides in from the left and writes its line.
export const Scene06Notebook: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t1630At = t.at(73) - from;
  const pahunchoAt = t.at(75) - from;
  const push = interpolate(frame, [0, durationInFrames], [0, -18], clamp);

  return (
    <AbsoluteFill>
      <Img
        src={staticFile("reels/lead-masks/assets/scene6-notebook.jpg")}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(1.08) translateY(${push}px)` }}
      />
      <Headline label="THE NOTEBOOK" line1="THE" line2="INSTRUCTIONS" tone="paper" delay={0} width={700} align="left" size={136} />
      <div
        data-el="hero"
        data-kind="content"
        style={{ position: "absolute", left: 60, top: 800, width: 900, height: 480, display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <TornNote text="16:30 — PAHUNCHO" at={t1630At} from="left" sub="REACH THE MEETING POINT" subAt={pahunchoAt} />
      </div>
    </AbsoluteFill>
  );
};

// "18:30 par capsules lo."  A second scrap from the right, then the capsules slide in.
export const Scene06Capsules: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const capsAt = t.at(78) - from;
  const loAt = t.at(79) - from;
  const push = interpolate(frame, [0, durationInFrames], [0, -16], clamp);

  return (
    <AbsoluteFill>
      <Img
        src={staticFile("reels/lead-masks/assets/scene6-capsules.jpg")}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(1.08) translateY(${push}px)` }}
      />
      <Headline label="THE NOTEBOOK" line1="TAKE THE" line2="CAPSULES" tone="paper" delay={0} width={620} align="left" size={150} />
      <div
        data-el="hero"
        data-kind="content"
        style={{ position: "absolute", left: 60, top: 780, width: 900, height: 520, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26 }}
      >
        <TornNote text="18:30 — CAPSULES LO" at={0} from="right" rotate={1.2} />
        <Sequence from={capsAt} layout="none">
          <CapsuleRow labelAt={loAt - capsAt} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

const CapsuleRow: React.FC<{ labelAt: number }> = ({ labelAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: SPRING.pop });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22, opacity: s, transform: slide(s, "right", 220) }}>
      <Capsule width={130} rotate={-14} />
      <Capsule width={130} rotate={6} />
      <PropLabel text="CAPSULES" at={labelAt} rotate={-2} from="right" dist={80} />
    </div>
  );
};

// "Dhaatu bachao, mask ka signal ka intezaar karo."  The mask drops in and starts signalling.
const SignalRing: React.FC<{ at: number; i: number }> = ({ at, i }) => {
  const frame = useCurrentFrame();
  const local = frame - at - i * 7;
  if (local < 0) return null;
  const period = 24;
  const p = (local % period) / period;
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 64,
        height: 64,
        marginLeft: -32,
        marginTop: -32,
        borderRadius: "50%",
        border: `4px solid ${C.red}`,
        opacity: (1 - p) * 0.7,
        transform: `scale(${1 + p * 4})`,
      }}
    />
  );
};

export const Scene06Metal: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const maskAt = t.at(82) - from;
  const signalAt = t.at(84) - from;
  const mask = spring({ frame: frame - maskAt, fps, config: SPRING.drop });
  const push = interpolate(frame, [0, durationInFrames], [0, -14], clamp);

  return (
    <AbsoluteFill>
      <Img
        src={staticFile("reels/lead-masks/assets/scene6-metal.jpg")}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(1.08) translateY(${push}px)` }}
      />
      <Headline label="THE NOTEBOOK" line1="WAIT FOR" line2="THE SIGNAL" tone="paper" delay={0} width={620} align="left" size={144} />
      <div
        data-el="hero"
        data-kind="content"
        style={{ position: "absolute", left: 60, top: 770, width: 900, height: 520, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}
      >
        <TornNote text="METAL BACHÃO" at={0} from="left" size={48} />
        <div style={{ position: "relative", opacity: mask, transform: `translateY(${interpolate(mask, [0, 1], [-140, 0], clamp)}px) scale(${interpolate(mask, [0, 1], [0.7, 1], clamp)})` }}>
          <MaskGraphic size={220} glow={1} />
          <SignalRing at={signalAt} i={0} />
          <SignalRing at={signalAt} i={1} />
          <SignalRing at={signalAt} i={2} />
        </div>
        <TornNote text="MASK KA SIGNAL KA INTEZAAR" at={signalAt} from="bottom" size={40} rotate={-1} />
      </div>
    </AbsoluteFill>
  );
};
