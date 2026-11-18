import React from "react";
import { Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Headline } from "../style/components/Headline";
import { SceneLayout } from "../style/components/SceneLayout";
import { Stamp } from "../style/components/Stamp";
import { QuestionMark, TestTube } from "../style/components/Props";
import { PropLabel, ScreenShake, Tag } from "../style/components/ui";
import { SPRING, clamp } from "../style/theme";
import { camera, slide } from "../style/motion";
import type { SceneProps } from "../style/types";

// "Autopsy late hui, organs decompose ho gaye."  The "LATE" stamp lands on the word.
export const Scene07Autopsy: React.FC<SceneProps> = ({ t, from, frames }) => {
  const frame = useCurrentFrame();
  const lateAt = t.at(89) - from;
  const decompAt = t.at(92) - from;

  const cam = camera(frame, [
    { at: 0, scale: 1.01, y: 6, x: 0 },
    { at: lateAt, scale: 1.06, y: -2, x: 0 },
    { at: frames, scale: 1.09, y: -10, x: 0 },
  ]);

  return (
    <SceneLayout
      headline={<Headline label="THE AUTOPSY" line1="TOO" line2="LATE" tone="paper" delay={0} width={700} align="left" size={150} variant="press" accentRule ruleLength={78} />}
    >
      <Img
        src={staticFile("reels/lead-masks/assets/scene7-autopsy.jpg")}
        style={{ width: "100%", height: "100%", objectFit: "contain", transform: cam }}
      />
      <Stamp text="LATE" delay={lateAt} rotate={-8} size={80} style={{ top: 40, right: 0 }} />
      <div data-el="hero" data-kind="content" style={{ position: "absolute", left: 0, top: 0, width: "70%", height: "100%" }}>
        <div style={{ position: "absolute", left: 0, top: 0, display: "flex", flexDirection: "column", gap: 14 }}>
          <Tag text="AUTOPSY REPORT" rotate={0} size={24} />
          <PropLabel text="ORGANS DECOMPOSED" at={decompAt} rotate={0} from="left" dist={120} />
        </div>
      </div>
    </SceneLayout>
  );
};

// Red question marks, one per spoken phrase, over the report.
const Marks: React.FC<{ frames: number[] }> = ({ frames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const spots = [
    { left: 610, top: 190, size: 180, rotate: -8 },
    { left: 742, top: 322, size: 120, rotate: 8 },
    { left: 672, top: 420, size: 100, rotate: -4 },
  ];
  return (
    <>
      {spots.map((m, i) => {
        const at = frames[Math.min(i, frames.length - 1)];
        const s = spring({ frame: frame - at, fps, config: SPRING.slam });
        const p = Math.min(1, Math.max(0, s));
        const float = Math.sin((frame + i * 20) / 24) * 4;
        const drift = Math.min(6, Math.max(0, frame - at) * 0.06);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: m.left,
              top: m.top,
              opacity: p,
              transform: `translateX(${-drift}px) translateY(${float}px) scale(${interpolate(s, [0, 1], [1.9, 1], clamp)})`,
            }}
          >
            <QuestionMark size={m.size} rotate={m.rotate} />
          </div>
        );
      })}
    </>
  );
};

// "Zeher ka test nahi ho paaya. Aaj tak wajah pata nahi."
// Three questions settle into depth, then UNSOLVED closes the file.
export const Scene07Unsolved: React.FC<SceneProps> = ({ t, from, frames }) => {
  const frame = useCurrentFrame();
  const zeherAt = t.at(95) - from;
  const testAt = t.at(97) - from;
  const paayaAt = t.at(100) - from;
  const nahi2At = t.at(105) - from;

  const cam = camera(frame, [
    { at: 0, scale: 1.03, y: 4, x: 0 },
    { at: nahi2At, scale: 1.08, y: -6, x: 0 },
    { at: frames, scale: 1.1, y: -12, x: 0 },
  ]);

  return (
    <ScreenShake at={[nahi2At + 3]}>
      <SceneLayout
        headline={<Headline label="THE VERDICT" line1="NO" line2="ANSWER" tone="paper" delay={0} width={600} align="left" size={160} variant="mask" accentRule ruleLength={74} />}
      >
        <Img
          src={staticFile("reels/lead-masks/assets/scene7-unsolved.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "contain", transform: cam }}
        />
        <Stamp text="UNSOLVED" delay={nahi2At} rotate={-8} size={72} style={{ top: 40, right: 0 }} />
        <div data-el="hero" data-kind="content" style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }}>
          <div style={{ position: "absolute", left: 0, top: 0, display: "flex", flexDirection: "column", gap: 14 }}>
            <Tag text="AUTOPSY REPORT" rotate={0} size={24} />
          </div>
          <Sequence from={testAt} layout="none">
            <TubeReveal labelAt={0} tagAt={paayaAt - testAt} />
          </Sequence>
          <Marks frames={[zeherAt, testAt, paayaAt]} />
        </div>
      </SceneLayout>
    </ScreenShake>
  );
};

const TubeReveal: React.FC<{ labelAt: number; tagAt: number }> = ({ labelAt, tagAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: SPRING.pop });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 12,
        opacity: s,
        transform: slide(s, "left", 200),
      }}
    >
      <TestTube width={72} />
      <PropLabel text="TEST TUBE" at={labelAt} rotate={0} from="left" dist={60} />
      <PropLabel text="NO TOX TEST" at={tagAt} rotate={0} size={22} from="left" dist={60} />
    </div>
  );
};
