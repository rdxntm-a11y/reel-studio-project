import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Headline } from "../style/components/Headline";
import { Cockroach, Wasp } from "../style/components/Props";
import { Camera, Chip, Tag, Vignette } from "../style/components/ui";
import { C, SPRING, clamp } from "../style/theme";
import { wordFrame, wordIndex, type Word } from "../style/timing";

export const Scene04: React.FC<{ words: Word[]; from: number }> = ({
  words,
  from,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tAntenna = wordFrame(words, wordIndex(words, "antenna"), fps) - from;

  const waspIn = spring({ frame, fps, config: SPRING.heavy });
  const leash = spring({
    frame,
    fps,
    delay: Math.max(0, tAntenna - 6),
    config: SPRING.whip,
  });
  const flag = spring({
    frame,
    fps,
    delay: Math.max(0, tAntenna - 2),
    config: SPRING.bouncy,
  });
  const flagAngle = Math.sin(frame / 4) * (8 + flag * 10);
  const gust = interpolate(flag, [0, 1], [0, 1], clamp) *
    Math.max(0, Math.sin(frame / 6));

  return (
    <AbsoluteFill>
      <Vignette opacity={0.4} />
      <Chip text="CASE 04 / THE FLAG" />
      <Headline text="FLAG ANTENNA" />
      <Camera from={1} to={1.05}>
        <div
          style={{
            position: "absolute",
            left: 180,
            top: 900,
            opacity: interpolate(waspIn, [0, 0.3], [0, 1], clamp),
            transform: `translateX(${interpolate(leash, [0, 1], [-40, 0])}px)`,
          }}
        >
          <Cockroach size={260} color={C.panel} glow={0} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 620,
            top: 780,
            opacity: interpolate(waspIn, [0, 0.3], [0, 1], clamp),
            transform: `translateY(${interpolate(waspIn, [0, 1], [-60, 0])}px)`,
          }}
        >
          <Wasp size={300} wing={0.5 + gust * 0.5} />
        </div>
        <svg
          width={420}
          height={260}
          style={{ position: "absolute", left: 340, top: 820 }}
        >
          <line
            x1={43}
            y1={114}
            x2={331}
            y2={128}
            stroke={C.ink}
            strokeWidth={6}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - leash}
          />
          <g transform={`translate(331 128) rotate(${flagAngle})`}>
            <path
              d="M0 0 L58 -16 L48 12 Z"
              fill={C.secondary}
              stroke={C.ink}
              strokeWidth={4}
              strokeLinejoin="round"
              opacity={flag}
            />
          </g>
          {[0, 1].map((i) => (
            <path
              key={i}
              d={i === 0 ? "M26 78 Q10 68 2 78" : "M30 94 Q14 84 6 94"}
              fill="none"
              stroke={C.secondary}
              strokeWidth={4}
              strokeLinecap="round"
              opacity={gust * 0.8}
            />
          ))}
        </svg>
      </Camera>
      <Tag
        text="GRABBED BY THE ANTENNA. LED LIKE A FLAG."
        top={1250}
        color={C.muted}
        size={44}
      />
    </AbsoluteFill>
  );
};
