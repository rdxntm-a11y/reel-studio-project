import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { alpha, C, FONT, SPRING, clamp } from "../theme";
import { slide } from "../motion";

/**
 * A slight screen shake. Wrap a whole scene in it and pass the local frames at
 * which a stamp lands; the shake decays over ~half a second. Amplitude is kept
 * under the self-check's 3px tolerance so it never trips the safe-zone probe.
 */
export const ScreenShake: React.FC<{
  at: number[];
  amount?: number;
  children: React.ReactNode;
}> = ({ at, amount = 2.4, children }) => {
  const frame = useCurrentFrame();
  let x = 0;
  let y = 0;
  at.forEach((a) => {
    const t = frame - a;
    if (t >= 0 && t < 16) {
      const decay = Math.pow(1 - t / 16, 1.5);
      x += Math.sin(t * 3.4) * amount * decay;
      y += Math.cos(t * 4.6) * amount * 0.8 * decay;
    }
  });
  return <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px)` }}>{children}</AbsoluteFill>;
};

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
  /** which edge the label slides in from */
  from?: "left" | "right" | "top" | "bottom";
  dist?: number;
}> = ({ text, at, color, background, rotate, size = 26, from = "bottom", dist = 26 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: SPRING.pop });
  return (
    <div
      style={{
        opacity: s,
        transform: slide(s, from, dist),
        willChange: "transform, opacity",
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
