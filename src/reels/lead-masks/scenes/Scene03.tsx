import React from "react";
import { Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Headline } from "../style/components/Headline";
import { SceneLayout } from "../style/components/SceneLayout";
import { Stamp } from "../style/components/Stamp";
import { PropLabel } from "../style/components/ui";
import { Clock } from "../style/components/Props";
import { alpha, C, SPRING, clamp } from "../style/theme";
import { camera } from "../style/motion";
import type { SceneProps } from "../style/types";

// "17 August, Niterói. Bar mein paani."  The date reads as a dated case entry.
export const Scene03Clock: React.FC<SceneProps> = ({ t, from, frames }) => {
  const frame = useCurrentFrame();
  const augAt = t.at(22) - from;
  const barAt = t.at(24) - from;

  const cam = camera(frame, [
    { at: 0, scale: 1.0, y: 8, x: 0 },
    { at: barAt, scale: 1.05, y: -6, x: -6 },
    { at: frames, scale: 1.08, y: -16, x: -10 },
  ]);

  return (
    <SceneLayout
      headline={<Headline label="THE NIGHT" line1="AUGUST" line2="17TH" tone="paper" delay={0} width={580} align="left" size={160} variant="dateline" ruleLength={84} />}
    >
      <Img
        src={staticFile("reels/lead-masks/assets/scene3-clock.jpg")}
        style={{ width: "100%", height: "100%", objectFit: "contain", transform: cam }}
      />
      <Stamp text="17 AUGUST" delay={augAt} rotate={-8} size={60} style={{ top: 40, right: 0 }} />
      <div data-el="hero" data-kind="content" style={{ position: "absolute", left: 0, top: 0, width: "70%", height: "100%" }}>
        <div style={{ position: "absolute", left: 0, top: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <PropLabel text="BAR IN NITERÓI" at={barAt} rotate={0} from="left" dist={150} />
        </div>
      </div>
    </SceneLayout>
  );
};

// "Waitress ne kaha Miguel nervous tha, baar baar ghadi dekh raha tha."
// Pan from the waitress to Miguel, then a small witness card drops in on "ghadi".
export const Scene03Receipt: React.FC<SceneProps> = ({ t, from, frames }) => {
  const frame = useCurrentFrame();
  const waitressAt = t.at(27) - from;
  const migAt = t.at(30) - from;
  const ghadiAt = t.at(35) - from;
  const dekhAt = t.at(36) - from;

  const cam = camera(frame, [
    { at: 0, scale: 1.06, y: 0, x: 40 },
    { at: migAt, scale: 1.05, y: 0, x: -30 },
    { at: ghadiAt, scale: 1.14, y: -30, x: -86 },
    { at: frames, scale: 1.16, y: -36, x: -96 },
  ]);

  return (
    <SceneLayout
      headline={<Headline label="THE WITNESS" line1="NERVOUS" line2="WAITING" tone="paper" delay={0} width={620} align="left" size={160} variant="mask" />}
    >
      <Img
        src={staticFile("reels/lead-masks/assets/scene3-receipt.jpg")}
        style={{ width: "100%", height: "100%", objectFit: "contain", transform: cam }}
      />
      <div data-el="hero" data-kind="content" style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }}>
        <div style={{ position: "absolute", left: 0, top: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <PropLabel text="WAITRESS" at={waitressAt} rotate={0} background={C.paperDeep} from="left" dist={150} />
          <PropLabel text="MIGUEL" at={migAt} rotate={0} from="left" dist={90} />
        </div>

        {/* the witness card peels down on "ghadi" and the watch starts ticking */}
        <Sequence from={ghadiAt} layout="none">
          <WatchReveal labelAt={dekhAt - ghadiAt} />
        </Sequence>
      </div>
    </SceneLayout>
  );
};

const WatchReveal: React.FC<{ labelAt: number }> = ({ labelAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: SPRING.pop });
  const p = Math.min(1, Math.max(0, s));
  const tick = Math.floor(frame) % 60;
  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        width: 288,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [-36, 0], clamp)}px) rotate(${interpolate(p, [0, 1], [-6, 0], clamp)}deg) scale(${interpolate(p, [0, 1], [0.93, 1], clamp)})`,
        transformOrigin: "top right",
      }}
    >
      <div
        style={{
          width: "100%",
          background: C.paperLight,
          border: `3px solid ${C.ink}`,
          borderRadius: 4,
          boxShadow: `0 10px 0 ${alpha(C.ink, 14)}`,
          padding: "16px 14px 12px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ width: 52, height: 4, background: C.red, marginBottom: 8 }} />
        <Clock second={tick} minute={24} width={238} />
        <div style={{ marginTop: 8 }}>
          <PropLabel text="CHECKING WATCH" at={labelAt} rotate={0} size={22} from="top" dist={40} />
        </div>
      </div>
    </div>
  );
};
