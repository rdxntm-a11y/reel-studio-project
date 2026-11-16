import React from "react";
import { AbsoluteFill, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Headline } from "../style/components/Headline";
import { Stamp } from "../style/components/Stamp";
import { QuestionMark, TestTube } from "../style/components/Props";
import { PropLabel, ScreenShake, Tag } from "../style/components/ui";
import { SPRING, clamp } from "../style/theme";
import { camera, slide } from "../style/motion";
import type { SceneProps } from "../style/types";

// "Autopsy late hui, organs decompose ho gaye."  The "LATE" stamp slams on "late".
export const Scene07Autopsy: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const lateAt = t.at(89) - from;
  const decompAt = t.at(92) - from;

  const cam = camera(frame, [
    { at: 0, scale: 1.04, y: 0, x: 0 },
    { at: lateAt, scale: 1.12, y: -10, x: 0 },
    { at: durationInFrames, scale: 1.16, y: -16, x: 0 },
  ]);

  return (
    <ScreenShake at={[lateAt + 3]}>
      <AbsoluteFill>
        <Img
          src={staticFile("reels/lead-masks/assets/scene7-autopsy.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: cam }}
        />
        <Headline label="THE AUTOPSY" line1="TOO" line2="LATE" tone="dark" delay={0} width={700} align="left" size={150} />
        <Stamp text="LATE" center delay={lateAt} rotate={-4} size={92} style={{ top: 700 }} />
        <div data-el="hero" data-kind="content" style={{ position: "absolute", left: 60, top: 770, width: 900, height: 520 }}>
          <div style={{ position: "absolute", left: 0, top: 40 }}>
            <Tag text="AUTOPSY REPORT" rotate={-4} size={24} />
          </div>
          <div style={{ position: "absolute", right: 0, bottom: 0 }}>
            <PropLabel text="ORGANS DECOMPOSED" at={decompAt} rotate={-1} from="bottom" dist={120} />
          </div>
        </div>
      </AbsoluteFill>
    </ScreenShake>
  );
};

// Red question marks, one per spoken phrase, over the report.
const Marks: React.FC<{ frames: number[] }> = ({ frames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const spots = [
    { left: 470, top: 0, size: 190, rotate: -10 },
    { left: 620, top: 96, size: 150, rotate: 8 },
    { left: 700, top: 8, size: 168, rotate: -4 },
    { left: 556, top: 206, size: 132, rotate: 14 },
  ];
  return (
    <>
      {spots.map((m, i) => {
        const at = frames[Math.min(i, frames.length - 1)];
        const s = spring({ frame: frame - at, fps, config: SPRING.slam });
        const float = Math.sin((frame + i * 20) / 24) * 8;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: m.left,
              top: m.top,
              opacity: s,
              transform: `translateY(${float}px) scale(${interpolate(s, [0, 1], [1.9, 1], clamp)})`,
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
// Question marks pop one by one on the phrase, then UNSOLVED slams.
export const Scene07Unsolved: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const zeherAt = t.at(95) - from;
  const testAt = t.at(97) - from;
  const nahiAt = t.at(98) - from;
  const paayaAt = t.at(100) - from;
  const nahi2At = t.at(105) - from;

  const cam = camera(frame, [
    { at: 0, scale: 1.06, y: 0, x: 0 },
    { at: nahi2At, scale: 1.16, y: -14, x: 0 },
    { at: durationInFrames, scale: 1.18, y: -18, x: 0 },
  ]);

  return (
    <ScreenShake at={[nahi2At + 3]}>
      <AbsoluteFill>
        <Img
          src={staticFile("reels/lead-masks/assets/scene7-unsolved.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: cam }}
        />
        <Headline label="THE VERDICT" line1="NO" line2="ANSWER" tone="dark" delay={0} width={600} align="left" size={160} />
        <Stamp text="UNSOLVED" center delay={nahi2At} rotate={-7} size={78} style={{ top: 700 }} />
        <div data-el="hero" data-kind="content" style={{ position: "absolute", left: 60, top: 760, width: 900, height: 520 }}>
          <div style={{ position: "absolute", left: 0, top: 40 }}>
            <Tag text="AUTOPSY REPORT" rotate={-4} size={24} />
          </div>
          <Sequence from={testAt} layout="none">
            <TubeReveal labelAt={0} tagAt={paayaAt - testAt} />
          </Sequence>
          <Marks frames={[zeherAt, testAt, nahiAt, paayaAt]} />
        </div>
      </AbsoluteFill>
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
        bottom: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        opacity: s,
        transform: slide(s, "left", 200),
      }}
    >
      <TestTube width={72} />
      <PropLabel text="TEST TUBE" at={labelAt} rotate={-2} from="left" dist={60} />
      <PropLabel text="NO TOX TEST" at={tagAt} rotate={-3} size={22} from="left" dist={60} />
    </div>
  );
};
