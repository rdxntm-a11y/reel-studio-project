import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { alpha, C, FONT, SPRING, clamp, type Tone } from "../theme";

type StampProps = {
  text: string;
  delay?: number;
  rotate?: number;
  size?: number;
  tone?: Tone;
  style?: React.CSSProperties;
  bleed?: boolean;
};

export const Stamp: React.FC<StampProps> = ({
  text,
  delay = 0,
  rotate = -7,
  size = 92,
  tone = "paper",
  style,
  bleed = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: SPRING.slam });
  const scale = interpolate(s, [0, 1], [2.7, 1], clamp);
  const opacity = interpolate(frame - delay, [0, 4], [0, 1], clamp);
  const y = interpolate(s, [0, 1], [-46, 0], clamp);
  const land = frame - delay - 9;
  const shake = land > 0 && land < 9 ? Math.sin(land * 2.6) * 4.5 * (1 - land / 9) : 0;
  const bleedOpacity = interpolate(frame - delay, [6, 24], [0, 0.3], clamp);

  return (
    <div style={{ position: "absolute", ...style, transform: `rotate(${rotate}deg)` }}>
      {bleed ? (
        <>
          <div
            style={{
              position: "absolute",
              inset: "-12px -18px",
              background: C.red,
              filter: "blur(9px)",
              opacity: bleedOpacity * 0.55,
              borderRadius: 18,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 18,
              right: -10,
              top: -8,
              bottom: 10,
              background: C.red,
              filter: "blur(16px)",
              opacity: bleedOpacity * 0.35,
              borderRadius: 30,
            }}
          />
        </>
      ) : null}
      <div
        style={{
          transform: `translateY(${y}px) translateX(${shake}px) scale(${scale})`,
          opacity,
          fontFamily: FONT.display,
          fontSize: size,
          lineHeight: 0.92,
          letterSpacing: 1,
          color: C.red,
          border: `9px solid ${C.red}`,
          borderRadius: 8,
          boxShadow: `inset 0 0 0 3px ${C.red}, 0 2px 0 ${alpha(C.ink, 18)}`,
          padding: "2px 24px 0",
          whiteSpace: "nowrap",
          width: "max-content",
          boxSizing: "border-box",
          mixBlendMode: tone === "paper" ? "multiply" : "normal",
          textShadow: `0 1px 0 ${alpha(C.ink, 8)}`,
        }}
      >
        {text}
      </div>
    </div>
  );
};
