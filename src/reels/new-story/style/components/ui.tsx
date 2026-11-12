import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, ZONE, clamp } from "../theme";

export const Camera: React.FC<{
  children: React.ReactNode;
  from?: number;
  to?: number;
}> = ({ children, from = 1, to = 1.04 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const s = interpolate(
    frame,
    [0, Math.max(1, durationInFrames)],
    [from, to],
    clamp,
  );
  return (
    <AbsoluteFill style={{ transform: `scale(${s})` }}>{children}</AbsoluteFill>
  );
};

export const Floaty: React.FC<{
  children: React.ReactNode;
  amount?: number;
  speed?: number;
}> = ({ children, amount = 6, speed = 15 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ transform: `translateY(${Math.sin(frame / speed) * amount}px)` }}>
      {children}
    </div>
  );
};

export const Vignette: React.FC<{ opacity: number }> = ({ opacity }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle at 50% 45%, rgba(6,10,18,0) 30%, rgba(6,10,18,${opacity}) 100%)`,
    }}
  />
);

export const Chip: React.FC<{ text: string; color?: string }> = ({
  text,
  color = C.muted,
}) => (
  <div
    style={{
      position: "absolute",
      top: ZONE.chip.y,
      left: 60,
      width: 900,
      height: ZONE.chip.h,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        padding: "8px 28px",
        borderRadius: 999,
        border: `2px solid ${C.line}`,
        background: "rgba(20,30,51,0.75)",
        color,
        fontFamily: FONT.body,
        fontWeight: 700,
        fontSize: 44,
        letterSpacing: 1,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  </div>
);

export const Tag: React.FC<{
  text: string;
  top: number;
  left?: number;
  width?: number;
  color?: string;
  size?: number;
  align?: "left" | "center" | "right";
}> = ({
  text,
  top,
  left = 60,
  width = 900,
  color = C.muted,
  size = 48,
  align = "center",
}) => (
  <div
    style={{
      position: "absolute",
      top,
      left,
      width,
      textAlign: align,
      fontFamily: FONT.body,
      fontWeight: 700,
      fontSize: size,
      lineHeight: 1.2,
      color,
      whiteSpace: "pre-line",
    }}
  >
    {text}
  </div>
);
