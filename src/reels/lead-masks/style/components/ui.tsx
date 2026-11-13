import React from "react";
import { useCurrentFrame } from "remotion";
import { alpha, C, FONT } from "../theme";

export const Floaty: React.FC<{
  children: React.ReactNode;
  amount?: number;
  speed?: number;
}> = ({ children, amount = 6, speed = 18 }) => {
  const frame = useCurrentFrame();
  return <div style={{ transform: `translateY(${Math.sin(frame / speed) * amount}px)` }}>{children}</div>;
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
