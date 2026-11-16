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
import { Stamp } from "../style/components/Stamp";
import { QuestionMark } from "../style/components/Props";
import { PropLabel, Tag } from "../style/components/ui";
import { C, SPRING, clamp } from "../style/theme";
import type { SceneProps } from "../style/types";

const Marks: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const marks = [
    { left: 470, top: 0, size: 190, rotate: -10, delay: 0 },
    { left: 620, top: 90, size: 150, rotate: 8, delay: 10 },
    { left: 690, top: 10, size: 170, rotate: -4, delay: 20 },
    { left: 560, top: 200, size: 120, rotate: 14, delay: 30 },
  ];
  return (
    <>
      {marks.map((m, i) => {
        const s = spring({ frame: frame - start - m.delay, fps, config: SPRING.pop });
        const float = Math.sin((frame + i * 20) / 22) * 8;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: m.left,
              top: m.top,
              opacity: s,
              transform: `translateY(${float}px) scale(${interpolate(s, [0, 1], [0.5, 1], clamp)})`,
            }}
          >
            <QuestionMark size={m.size} rotate={m.rotate} />
          </div>
        );
      })}
    </>
  );
};

export const Scene07Autopsy: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const clipAt = t.at(88) - from;
  const bodiesAt = t.at(91) - from;
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.05], clamp);

  return (
    <AbsoluteFill>
      <Img src={staticFile("reels/lead-masks/assets/scene7-autopsy.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }} />
      <Headline text="THE AUTOPSY" tone="dark" size={150} delay={0} width={700} align="left" />
      <div data-el="hero" data-kind="content" style={{ position: "absolute", left: 60, top: 720, width: 900, height: 560 }}>
        <div style={{ position: "absolute", left: 0, top: 60 }}>
          <Tag text="AUTOPSY REPORT" rotate={-4} size={24} />
        </div>
        <div style={{ position: "absolute", left: 320, right: 0, bottom: 10, display: "flex", justifyContent: "flex-end" }}>
          <PropLabel text="THE VICTIMS" at={bodiesAt} rotate={-1} />
        </div>
        <Marks start={t.at(91) - from} />
      </div>
      <div style={{ position: "absolute", left: 90, top: 1280, width: 900, height: 8, background: C.paperDeep, opacity: 0.35, borderRadius: 4 }} />
    </AbsoluteFill>
  );
};

export const Scene07Unsolved: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const stampAt = t.at(105) - from;
  const tubeAt = t.at(95) - from;
  const tagAt = t.at(98) - from;
  const tube = spring({ frame: frame - tubeAt, fps, config: SPRING.pop });
  const tag = spring({ frame: frame - tagAt, fps, config: SPRING.pop });
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.05], clamp);

  return (
    <AbsoluteFill>
      <Img src={staticFile("reels/lead-masks/assets/scene7-unsolved.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }} />
      <Headline text="NO ANSWER" tone="dark" size={160} delay={0} width={600} align="left" />
      <Stamp text="UNSOLVED" delay={stampAt} rotate={-7} size={78} style={{ left: 520, top: 238 }} />
      <div data-el="hero" data-kind="content" style={{ position: "absolute", left: 60, top: 720, width: 900, height: 560 }}>
        <div style={{ position: "absolute", right: 20, top: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: tube, transform: `translateY(${interpolate(tube, [0, 1], [40, 0], clamp)}px)` }}>
          <PropLabel text="TEST TUBE" at={tubeAt} rotate={-2} />
          <div style={{ opacity: tag, transform: `scale(${interpolate(tag, [0, 1], [0.7, 1], clamp)})` }}>
            <Tag text="NO TOX TEST" rotate={-3} size={22} />
          </div>
        </div>
        <Marks start={0} />
      </div>
      <div style={{ position: "absolute", left: 90, top: 1280, width: 900, height: 8, background: C.paperDeep, opacity: 0.35, borderRadius: 4 }} />
    </AbsoluteFill>
  );
};
