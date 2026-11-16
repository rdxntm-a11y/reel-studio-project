import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { alpha, C, FONT, SPRING, clamp } from "../theme";

export const Floaty: React.FC<{
  children: React.ReactNode;
  amount?: number;
  speed?: number;
}> = ({ children, amount = 6, speed = 18 }) => {
  const frame = useCurrentFrame();
  return <div style={{ transform: `translateY(${Math.sin(frame / speed) * amount}px)` }}>{children}</div>;
};

export const CameraDrift: React.FC<{
  children: React.ReactNode;
  panX?: number;
  panY?: number;
  zoom?: number;
}> = ({ children, panX = 0, panY = 0, zoom = 0 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `translate(${panX * p}px, ${panY * p}px) scale(${1 + zoom * p})`,
        transformOrigin: "50% 50%",
      }}
    >
      {children}
    </div>
  );
};

export const PropLabel: React.FC<{
  text: string;
  at: number;
  color?: string;
  background?: string;
  rotate?: number;
  size?: number;
}> = ({ text, at, color, background, rotate, size = 26 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: SPRING.pop });
  return (
    <div
      style={{
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [14, 0], clamp)}px)`,
      }}
    >
      <Tag text={text} color={color} background={background} rotate={rotate} size={size} />
    </div>
  );
};

export const Tag: React.FC<{
  text: string;
  color?: string;
  background?: string;
  rotate?: number;
  size?: number;
}> = ({ text, color = C.ink, background = C.paperLight, rotate = -2, size = 34 }) => (
  <div
    style={{
      display: "inline-block",
      padding: "8px 18px",
      background,
      color,
      border: `3px solid ${C.ink}`,
      borderRadius: 4,
      fontFamily: FONT.body,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: 1,
      textTransform: "uppercase",
      transform: `rotate(${rotate}deg)`,
      boxShadow: `0 5px 0 ${alpha(C.ink, 14)}`,
      whiteSpace: "nowrap",
      flexShrink: 0,
      width: "max-content",
    }}
  >
    {text}
  </div>
);
