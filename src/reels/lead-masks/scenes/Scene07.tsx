import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PaperBackground } from "../style/components/PaperBackground";
import { Headline } from "../style/components/Headline";
import { Stamp } from "../style/components/Stamp";
import { Clipboard, QuestionMark, TestTube } from "../style/components/Props";
import { PaperBody } from "../style/components/PaperFigure";
import { Tag } from "../style/components/ui";
import { C, SPRING, clamp } from "../style/theme";
import type { SceneProps } from "../style/types";

const Marks: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const marks = [
    { left: 470, top: 0, size: 190, rotate: -10, delay: 0 },
    { left: 620, top: 90, size: 150, rotate: 8, delay: 10 },
    { left: 780, top: 10, size: 170, rotate: -4, delay: 20 },
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
  const { fps } = useVideoConfig();
  const clipAt = t.at(88) - from;
  const clip = spring({ frame: frame - clipAt, fps, config: SPRING.pop });
  const bodiesAt = t.at(91) - from;
  const bodies = spring({ frame: frame - bodiesAt, fps, config: SPRING.pop });

  return (
    <AbsoluteFill>
      <PaperBackground tone="dark" seed={61} />
      <Headline text="THE AUTOPSY" tone="dark" size={150} delay={2} width={700} align="left" />
      <div
        data-el="hero"
        data-kind="content"
        style={{ position: "absolute", left: 60, top: 720, width: 900, height: 560 }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 60,
            opacity: clip,
            transform: `translateY(${interpolate(clip, [0, 1], [50, 0], clamp)}px) rotate(${interpolate(clip, [0, 1], [-6, 0], clamp)}deg)`,
          }}
        >
          <Clipboard width={270} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 210,
            right: 0,
            bottom: 10,
            display: "flex",
            justifyContent: "flex-end",
            gap: 0,
            opacity: bodies,
            transform: `translateY(${interpolate(bodies, [0, 1], [70, 0], clamp)}px)`,
          }}
        >
          <PaperBody tone="dark" outfit="suit" mask={1} width={390} />
          <PaperBody tone="dark" outfit="coat" mask={1} width={390} />
        </div>
        <Marks start={t.at(91) - from} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 1280,
          width: 900,
          height: 8,
          background: C.paperDeep,
          opacity: 0.35,
          borderRadius: 4,
        }}
      />
    </AbsoluteFill>
  );
};

export const Scene07Unsolved: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stampAt = t.at(105) - from;
  const tubeAt = t.at(95) - from;
  const tagAt = t.at(98) - from;
  const tube = spring({ frame: frame - tubeAt, fps, config: SPRING.pop });
  const tag = spring({ frame: frame - tagAt, fps, config: SPRING.pop });
  const bodies = spring({ frame: frame - 2, fps, config: SPRING.pop });

  return (
    <AbsoluteFill>
      <PaperBackground tone="dark" seed={62} />
      <Headline text="NO ANSWER" tone="dark" size={160} delay={0} width={600} align="left" />
      <Stamp text="UNSOLVED" delay={stampAt} rotate={-7} size={78} style={{ left: 520, top: 238 }} />
      <div
        data-el="hero"
        data-kind="content"
        style={{ position: "absolute", left: 60, top: 720, width: 900, height: 560 }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 120,
            bottom: 10,
            display: "flex",
            justifyContent: "center",
            gap: 0,
            opacity: bodies,
            transform: `translateY(${interpolate(bodies, [0, 1], [70, 0], clamp)}px)`,
          }}
        >
          <PaperBody tone="dark" outfit="suit" mask={1} width={390} />
          <PaperBody tone="dark" outfit="coat" mask={1} width={390} />
        </div>
        <div
          style={{
            position: "absolute",
            right: 20,
            top: 60,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            opacity: tube,
            transform: `translateY(${interpolate(tube, [0, 1], [40, 0], clamp)}px)`,
          }}
        >
          <TestTube width={100} />
          <div style={{ opacity: tag, transform: `scale(${interpolate(tag, [0, 1], [0.7, 1], clamp)})` }}>
            <Tag text="TEST: MISSING" rotate={-3} size={24} />
          </div>
        </div>
        <Marks start={0} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 1280,
          width: 900,
          height: 8,
          background: C.paperDeep,
          opacity: 0.35,
          borderRadius: 4,
        }}
      />
    </AbsoluteFill>
  );
};
