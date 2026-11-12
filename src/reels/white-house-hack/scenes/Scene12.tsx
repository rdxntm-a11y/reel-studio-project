import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Headline } from "../style/components/Headline";
import { POSES, Stick } from "../style/components/Stick";
import { CaseFile, Lamp, Phone } from "../style/components/Props";
import { Stamp } from "../style/components/Stamp";
import { Chip, Tag, Vignette } from "../style/components/ui";
import { C, SPRING, clamp } from "../style/theme";
import { wordFrame, type Word } from "../style/timing";

export const Scene12: React.FC<{ words: Word[]; from: number }> = ({
  words,
  from,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tNight = wordFrame(words, 164, fps) - from;
  const tFollow = wordFrame(words, 165, fps) - from;

  const lampIn = spring({ frame, fps, config: SPRING.pop });
  const phoneIn = spring({
    frame,
    fps,
    delay: Math.max(0, tFollow - 4),
    config: SPRING.snappy,
  });
  const endIn = interpolate(
    frame,
    [tFollow + 6, tFollow + 16],
    [0, 1],
    clamp,
  );
  const lit =
    frame >= tNight
      ? 0
      : frame > tNight - 4 && frame < tNight - 2
        ? 0.3
        : 1;

  return (
    <AbsoluteFill>
      <Vignette opacity={0.6} />
      <Chip text="CASE FILE 01" />
      <Headline text="FOLLOW FOR MORE" accent={[0]} />

      <div style={{ position: "absolute", inset: 0, opacity: endIn }}>
        <Tag
          text="REAL CASES / SOUND FAKE"
          top={700}
          color={C.muted}
          size={44}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 300,
          top: 1080,
          width: 340,
          height: 22,
          borderRadius: 6,
          background: C.panel,
          border: `2px solid ${C.line}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 330,
          top: 1102,
          width: 16,
          height: 100,
          background: C.panel,
          border: `2px solid ${C.line}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 590,
          top: 1102,
          width: 16,
          height: 100,
          background: C.panel,
          border: `2px solid ${C.line}`,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 300,
          top: 800,
          opacity: interpolate(lampIn, [0, 0.4], [0, 1], clamp),
          transform: `scale(${interpolate(lampIn, [0, 1], [0.7, 1])})`,
        }}
      >
        <Lamp size={280} lit={lit} />
      </div>

      <div style={{ position: "absolute", left: 760, top: 900 }}>
        <Stick
          pose={{ ...POSES.idle, head: 4 }}
          width={200}
          mood="neutral"
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 500,
          top: 860,
          opacity: interpolate(phoneIn, [0, 0.4], [0, 1], clamp),
          transform: `translateY(${interpolate(phoneIn, [0, 1], [120, 0])}px)`,
        }}
      >
        <Phone size={220} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 565,
          top: 910,
          opacity: interpolate(phoneIn, [0, 0.4], [0, 1], clamp),
        }}
      >
        <CaseFile size={90} page={0.65} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 510,
          top: 990,
          width: 200,
          display: "flex",
          justifyContent: "center",
          transform: "scale(0.3)",
          opacity: interpolate(phoneIn, [0, 0.4], [0, 1], clamp),
        }}
      >
        <Stamp
          text="FOLLOW"
          color={C.primary}
          delay={Math.max(0, tFollow - 5)}
          rotate={-6}
        />
      </div>
    </AbsoluteFill>
  );
};
