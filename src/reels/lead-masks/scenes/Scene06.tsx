import React from "react";
import { Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Headline } from "../style/components/Headline";
import { SceneLayout } from "../style/components/SceneLayout";
import { EvidencePlate, PropLabel } from "../style/components/ui";
import { Capsule } from "../style/components/Props";
import { LeadMask as MaskGraphic } from "../style/components/PaperFigure";
import { alpha, C, FONT, SPRING, clamp } from "../style/theme";
import { camera, ease, slide } from "../style/motion";
import type { SceneProps } from "../style/types";

// A torn paper scrap that slides in from an edge and "writes" its line on the word.
const tornTop =
  "polygon(0 7%, 5% 0, 10% 7%, 15% 0, 20% 7%, 25% 0, 30% 7%, 35% 0, 40% 7%, 45% 0, 50% 7%, 55% 0, 60% 7%, 65% 0, 70% 7%, 75% 0, 80% 7%, 85% 0, 90% 7%, 95% 0, 100% 7%, 100% 100%, 0 100%)";

const TornNote: React.FC<{
  text: string;
  at: number;
  from?: "left" | "right" | "top" | "bottom";
  mode?: "slide" | "lay" | "lift";
  sub?: string;
  subAt?: number;
  size?: number;
  rotate?: number;
}> = ({ text, at, from = "left", mode = "slide", sub, subAt, size = 52, rotate = -1.5 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: SPRING.pop });
  const p = Math.min(1, Math.max(0, s));
  const write = interpolate(s, [0, 1], [0, 100], clamp);
  const enter =
    mode === "slide"
      ? slide(s, from, 230)
      : mode === "lay"
        ? `translateY(${(1 - p) * 20}px) rotate(${(1 - p) * -2.6}deg) scale(${0.97 + 0.03 * p})`
        : `translateY(${(1 - p) * 54}px)`;
  return (
    <div style={{ opacity: p, transform: enter }}>
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
          <div style={{ marginTop: 12 }}>
            <PropLabel text={sub} at={subAt ?? at} rotate={0} size={22} background={C.paperDeep} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

// "Notebook: 16:30 par pahuncho."  The document scans in, then the instruction is laid on top.
export const Scene06Notebook: React.FC<SceneProps> = ({ t, from, frames }) => {
  const frame = useCurrentFrame();
  const t1630At = t.at(73) - from;
  const pahunchoAt = t.at(75) - from;
  const reveal = ease(frame, 0, 14, 0.24, 1);
  const scan = interpolate(reveal, [0, 1], [0, 100], clamp);

  const cam = camera(frame, [
    { at: 0, scale: 1.06, y: 0, x: 0 },
    { at: frames, scale: 1.1, y: -12, x: 0 },
  ]);

  return (
    <SceneLayout
      headline={<Headline label="THE NOTEBOOK" line1="THE" line2="INSTRUCTIONS" tone="paper" delay={0} width={700} align="left" size={136} variant="mask" />}
    >
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 ${(1 - reveal) * 100}% 0)`, opacity: 0.75 + 0.25 * reveal }}>
        <Img
          src={staticFile("reels/lead-masks/assets/scene6-notebook.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "contain", transform: cam }}
        />
      </div>
      {reveal < 0.995 ? (
        <div
          style={{
            position: "absolute",
            left: "14%",
            right: "14%",
            top: `${scan}%`,
            height: 2,
            background: alpha(C.red, 60),
            opacity: 1 - reveal,
            pointerEvents: "none",
          }}
        />
      ) : null}
      <div data-el="hero" data-kind="content" style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", display: "flex", alignItems: "flex-start", justifyContent: "flex-start" }}>
        <TornNote text="16:30 — PAHUNCHO" at={t1630At} from="left" mode="lay" sub="REACH THE MEETING POINT" subAt={pahunchoAt} />
      </div>
    </SceneLayout>
  );
};

// "18:30 par capsules lo."  A mounted capsule plate from the right, then the capsules pop in.
export const Scene06Capsules: React.FC<SceneProps> = ({ t, from, frames }) => {
  const frame = useCurrentFrame();
  const capsAt = t.at(78) - from;
  const loAt = t.at(79) - from;

  const cam = camera(frame, [
    { at: 0, scale: 1.04, y: 0, x: 0 },
    { at: capsAt, scale: 1.1, y: -6, x: -4 },
    { at: frames, scale: 1.13, y: -12, x: 0 },
  ]);

  return (
    <SceneLayout
      headline={<Headline label="THE NOTEBOOK" line1="TAKE THE" line2="CAPSULES" tone="paper" delay={0} width={620} align="left" size={150} variant="split" />}
    >
      <EvidencePlate src={staticFile("reels/lead-masks/assets/scene6-capsules.jpg")} transform={cam} rotate={-0.6} at={-5} />
      <div data-el="hero" data-kind="content" style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start", gap: 22 }}>
        <TornNote text="18:30 — CAPSULES LO" at={-3} from="right" rotate={-1.2} />
        <Sequence from={capsAt} layout="none">
          <CapsuleRow labelAt={loAt - capsAt} />
        </Sequence>
      </div>
    </SceneLayout>
  );
};

const CapsuleRow: React.FC<{ labelAt: number }> = ({ labelAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s1 = spring({ frame, fps, config: SPRING.pop });
  const s2 = spring({ frame: frame - 7, fps, config: SPRING.pop });
  const c1 = Math.min(1, Math.max(0, s1));
  const c2 = Math.min(1, Math.max(0, s2));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22, opacity: c1, transform: slide(s1, "left", 220) }}>
      <div style={{ opacity: c1, transform: `translateY(${(1 - c1) * 18}px) scale(${0.9 + 0.1 * c1})` }}>
        <Capsule width={130} rotate={-14} />
      </div>
      <div style={{ opacity: c2, transform: `translateY(${(1 - c2) * 18}px) scale(${0.9 + 0.1 * c2})` }}>
        <Capsule width={130} rotate={6} />
      </div>
      <PropLabel text="CAPSULES" at={labelAt} rotate={0} from="left" dist={80} />
    </div>
  );
};

// "Dhaatu bachao, mask ka signal ka intezaar karo."  The mask breathes and the signal rings out.
const SignalRing: React.FC<{ at: number; i: number }> = ({ at, i }) => {
  const frame = useCurrentFrame();
  const local = frame - at - i * 8;
  if (local < 0) return null;
  const period = 30;
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
        border: `3px solid ${C.red}`,
        opacity: (1 - p) * 0.55,
        transform: `scale(${1 + p * 3.2})`,
      }}
    />
  );
};

const SignalPulse: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const breathe = 0.5 + 0.5 * Math.sin((frame - at) / 18);
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 208,
        height: 208,
        marginLeft: -104,
        marginTop: -104,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${alpha(C.red, 16)}, transparent 68%)`,
        opacity: 0.4 + 0.25 * breathe,
        transform: `scale(${1 + 0.06 * breathe})`,
        pointerEvents: "none",
      }}
    />
  );
};

export const Scene06Metal: React.FC<SceneProps> = ({ t, from, frames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const maskAt = t.at(82) - from;
  const signalAt = t.at(84) - from;
  const mask = spring({ frame: frame - maskAt, fps, config: SPRING.drop });
  const mp = Math.min(1, Math.max(0, mask));

  const cam = camera(frame, [
    { at: 0, scale: 1.03, y: 0, x: 0 },
    { at: signalAt, scale: 1.06, y: -4, x: 0 },
    { at: frames, scale: 1.08, y: -10, x: 0 },
  ]);

  return (
    <SceneLayout
      headline={<Headline label="THE NOTEBOOK" line1="WAIT FOR" line2="THE SIGNAL" tone="paper" delay={0} width={620} align="left" size={144} variant="rise" accentRule ruleLength={72} />}
    >
      <Img
        src={staticFile("reels/lead-masks/assets/scene6-metal.jpg")}
        style={{ width: "100%", height: "100%", objectFit: "contain", transform: cam }}
      />
      <div data-el="hero" data-kind="content" style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start", gap: 18 }}>
        <TornNote text="METAL BACHÃO" at={0} from="left" mode="lift" size={48} />
        <div style={{ position: "relative", opacity: mp, transform: `translateY(${interpolate(mask, [0, 1], [-140, 0], clamp)}px) scale(${interpolate(mask, [0, 1], [0.7, 1], clamp)})`, alignSelf: "center" }}>
          <SignalPulse at={signalAt} />
          <MaskGraphic size={220} glow={1} />
          <SignalRing at={signalAt} i={0} />
          <SignalRing at={signalAt} i={1} />
          <SignalRing at={signalAt} i={2} />
        </div>
        <TornNote text="MASK KA SIGNAL KA INTEZAAR" at={signalAt} from="left" mode="lay" size={40} rotate={-1} />
      </div>
    </SceneLayout>
  );
};
