import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Headline } from "../style/components/Headline";
import { Cockroach, EggCluster } from "../style/components/Props";
import { Stamp } from "../style/components/Stamp";
import { Camera, Chip, Tag, Vignette } from "../style/components/ui";
import { C, SPRING, clamp } from "../style/theme";
import { wordFrame, wordIndex, type Word } from "../style/timing";

export const Scene06: React.FC<{ words: Word[]; from: number }> = ({
  words,
  from,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tHorror = wordFrame(words, wordIndex(words, "horror"), fps) - from;

  const draw = spring({ frame, fps, delay: 4, config: SPRING.smooth });
  const eggGlow = spring({
    frame,
    fps,
    delay: Math.max(0, tHorror - 4),
    config: SPRING.pop,
  });
  const adult = spring({ frame, fps, delay: 12, config: SPRING.pop });
  const pulse = frame > tHorror ? Math.max(0, 1 - (frame - tHorror) / 15) : 0;

  return (
    <AbsoluteFill>
      <Vignette opacity={0.25 + pulse * 0.5} />
      <Chip text="CASE 06 / NATURE" />
      <Headline text="EVOLUTION HORROR" accent={[1]} />
      <Camera from={1} to={1.04}>
        <svg
          width={800}
          height={300}
          style={{ position: "absolute", left: 140, top: 820 }}
        >
          <path
            d="M100 230 H690"
            fill="none"
            stroke={C.line}
            strokeWidth={8}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - draw}
          />
          <path
            d="M668 216 L694 230 L668 244"
            fill="none"
            stroke={C.line}
            strokeWidth={8}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={draw}
          />
        </svg>

        <div style={{ position: "absolute", left: 150, top: 880 }}>
          <EggCluster size={170} glow={eggGlow} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 440,
            top: 860,
            opacity: interpolate(draw, [0, 0.4], [0, 1], clamp),
            transform: `scale(${interpolate(draw, [0, 1], [0.6, 1])})`,
          }}
        >
          <Cockroach size={190} color={C.secondary} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 720,
            top: 820,
            opacity: interpolate(adult, [0, 0.4], [0, 1], clamp),
            transform: `scale(${interpolate(adult, [0, 1], [0.6, 1])})`,
          }}
        >
          <Cockroach size={230} color={C.panel} />
        </div>
      </Camera>

      <Tag text="EGG" top={1060} left={150} width={170} size={44} />
      <Tag text="NYMPH" top={1060} left={440} width={190} size={44} />
      <Tag text="ADULT" top={1060} left={720} width={230} size={44} />

      <div
        style={{
          position: "absolute",
          left: 240,
          top: 1150,
          width: 600,
          textAlign: "center",
        }}
      >
        <Stamp text="HORROR" color={C.danger} delay={Math.max(0, tHorror - 5)} />
      </div>
    </AbsoluteFill>
  );
};
