import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, FONT, SPRING, ZONE, clamp } from "../theme";

type SpringCfg = { damping?: number; stiffness?: number; mass?: number };

export const PopIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  from?: number;
  config?: SpringCfg;
}> = ({ children, delay = 0, from = 0.7, config = SPRING.pop }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, delay, config });
  return (
    <div
      style={{
        transform: `scale(${interpolate(s, [0, 1], [from, 1])})`,
        opacity: interpolate(s, [0, 0.4], [0, 1], clamp),
      }}
    >
      {children}
    </div>
  );
};

export const CountUp: React.FC<{
  to: number;
  delay?: number;
  duration?: number;
  size?: number;
  color?: string;
}> = ({ to, delay = 0, duration = 30, size = 220, color = C.primary }) => {
  const frame = useCurrentFrame();
  const v = Math.round(
    interpolate(frame, [delay, delay + duration], [0, to], clamp),
  );
  return (
    <span
      style={{
        fontFamily: FONT.headline,
        fontSize: size,
        color,
        lineHeight: 0.9,
        letterSpacing: 2,
      }}
    >
      {v}
    </span>
  );
};

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

export const Chip: React.FC<{ text: string }> = ({ text }) => (
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
        color: C.muted,
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

export const AddressPlate: React.FC<{
  text: string;
  color?: string;
  size?: number;
}> = ({ text, color = C.primary, size = 36 }) => (
  <div
    style={{
      minWidth: 150,
      padding: "8px 18px",
      borderRadius: 10,
      border: `4px solid ${color}`,
      background: C.panel,
      color,
      fontFamily: FONT.body,
      fontWeight: 800,
      fontSize: size,
      textAlign: "center",
      letterSpacing: 1,
    }}
  >
    {text}
  </div>
);

export const SpeechBubble: React.FC<{
  text: string;
  width?: number;
  color?: string;
  size?: number;
  tail?: "left" | "right";
}> = ({ text, width = 380, color = C.ink, size = 40, tail = "left" }) => (
  <div
    style={{
      position: "relative",
      width,
      background: C.panel,
      border: `3px solid ${C.line}`,
      borderRadius: 22,
      padding: "14px 18px",
      color,
      fontFamily: FONT.body,
      fontWeight: 700,
      fontSize: size,
      lineHeight: 1.2,
      textAlign: "center",
      boxSizing: "border-box",
    }}
  >
    {text}
    <svg
      width={40}
      height={24}
      style={{
        position: "absolute",
        bottom: -22,
        left: tail === "left" ? 36 : undefined,
        right: tail === "right" ? 36 : undefined,
      }}
    >
      <path d="M0 0 L20 22 L40 0 Z" fill={C.panel} stroke={C.line} strokeWidth={2} />
    </svg>
  </div>
);
