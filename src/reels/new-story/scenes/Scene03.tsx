import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Headline } from "../style/components/Headline";
import { Cockroach, Lock } from "../style/components/Props";
import { Camera, Chip, Tag, Vignette } from "../style/components/ui";
import { C, SPRING, clamp } from "../style/theme";
import { wordFrame, wordIndex, type Word } from "../style/timing";

export const Scene03: React.FC<{ words: Word[]; from: number }> = ({
  words,
  from,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tBand = wordFrame(words, wordIndex(words, "band"), fps) - from;

  const flow = spring({ frame, fps, config: SPRING.smooth });
  const freeze = spring({
    frame,
    fps,
    delay: Math.max(0, tBand - 4),
    config: SPRING.whip,
  });
  const lock = spring({
    frame,
    fps,
    delay: Math.max(0, tBand - 2),
    config: SPRING.whip,
  });

  return (
    <AbsoluteFill>
      <Vignette opacity={0.45} />
      <Chip text="CASE 03 / FREEZE" />
      <Headline text="FREEZING POISON" accent={[1]} />
      <Camera from={1} to={1.05}>
        <svg
          width={840}
          height={180}
          style={{
            position: "absolute",
            left: 120,
            top: 900,
            opacity: 1 - freeze * 0.9,
          }}
        >
          <path
            d="M0 90 Q70 20 140 90 T280 90 T420 90 T560 90 T700 90 T840 90"
            fill="none"
            stroke={C.danger}
            strokeWidth={10}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - flow}
          />
          {[0, 1, 2].map((i) => (
            <circle
              key={i}
              cx={(frame * 7 + i * 260) % 840}
              cy={90 + Math.sin((frame + i * 30) / 9) * 28}
              r={12}
              fill={C.danger}
              opacity={0.85}
            />
          ))}
        </svg>

        <svg
          width={480}
          height={480}
          style={{
            position: "absolute",
            left: 300,
            top: 740,
            opacity: freeze,
          }}
        >
          <path d="M70 86 L96 20 L118 92 Z" fill={C.secondary} opacity={0.7} />
          <path d="M356 96 L394 40 L408 108 Z" fill={C.secondary} opacity={0.6} />
          <path d="M120 372 L160 330 L176 388 Z" fill={C.secondary} opacity={0.65} />
          <path d="M340 356 L380 322 L392 380 Z" fill={C.secondary} opacity={0.55} />
        </svg>

        <div
          style={{
            position: "absolute",
            left: 370,
            top: 800,
            opacity: interpolate(freeze, [0, 0.4], [0, 1], clamp),
            transform: `scale(${interpolate(freeze, [0, 1], [0.5, 1])})`,
          }}
        >
          <Cockroach size={340} color={C.secondary} glow={0} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 465,
            top: 850,
            opacity: interpolate(lock, [0, 0.4], [0, 1], clamp),
            transform: `scale(${interpolate(lock, [0, 1], [1.8, 1])})`,
          }}
        >
          <Lock size={150} color={C.ink} />
        </div>
      </Camera>
      <Tag
        text="THE ESCAPE SIGNAL IS CUT OFF"
        top={1250}
        color={C.muted}
        size={44}
      />
    </AbsoluteFill>
  );
};
