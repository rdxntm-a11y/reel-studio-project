import React from "react";
import { AbsoluteFill, Img, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { alpha, C, FONT, SPRING } from "../theme";
import { ease, slide } from "../motion";

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
}> = ({ text, color = C.ink, background = C.paperLight, rotate = 0, size = 34 }) => (
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
      transform: rotate ? `rotate(${rotate}deg)` : undefined,
      boxShadow: `0 5px 0 ${alpha(C.ink, 14)}`,
      whiteSpace: "nowrap",
      flexShrink: 0,
      width: "max-content",
    }}
  >
    {text}
  </div>
);

export const TextMasks: React.FC<{ tone?: "paper" | "dark" }> = ({ tone = "paper" }) => {
  const color = tone === "dark" ? C.charcoal : C.paper;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "15%",
          background: `linear-gradient(to bottom, ${color} 0%, transparent 100%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "20%",
          background: `linear-gradient(to top, ${color} 0%, transparent 100%)`,
          pointerEvents: "none",
        }}
      />
    </>
  );
};

/** A hairline that draws in on a word. Vertical rules grow from the top. */
export const Rule: React.FC<{
  at: number;
  length?: number;
  frames?: number;
  vertical?: boolean;
  thickness?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ at, length = 180, frames = 18, vertical = false, thickness = 2, color = C.red, style }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, at, frames, 0, 1);
  return (
    <div
      style={{
        position: "absolute",
        width: vertical ? thickness : length,
        height: vertical ? length : thickness,
        background: color,
        transform: vertical ? `scaleY(${p})` : `scaleX(${p})`,
        transformOrigin: vertical ? "top" : "left",
        ...style,
      }}
    />
  );
};

/**
 * A mounted evidence print: cream mat, ink hairline, paper shadow. The camera move
 * happens inside the plate, so zooms crop inside the mount instead of spilling into
 * the dossier gutters.
 */
export const EvidencePlate: React.FC<{
  src: string;
  transform?: string;
  at?: number;
  rotate?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ src, transform = "none", at = 0, rotate = 0, style, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: SPRING.pop });
  const p = Math.min(1, Math.max(0, s));
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: "50%",
        height: "100%",
        aspectRatio: "832 / 1248",
        transform: `translateX(-50%) rotate(${rotate * p}deg) scale(${0.985 + 0.015 * p})`,
        opacity: p,
        background: C.paperLight,
        border: `3px solid ${C.ink}`,
        boxShadow: `0 14px 0 ${alpha(C.ink, 16)}`,
        padding: 11,
        boxSizing: "border-box",
        ...style,
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: C.paperDeep }}>
        <Img
          src={src}
          style={{ width: "100%", height: "100%", objectFit: "contain", transform, transformOrigin: "center" }}
        />
        {children}
      </div>
    </div>
  );
};

/** A low-contrast atmospheric glow for signal / sky beats. Ambient only, never a light show. */
export const AtmosphereGlow: React.FC<{
  at: number;
  top?: number;
  width?: number;
  height?: number;
  strength?: number;
}> = ({ at, top = -40, width = 680, height = 900, strength = 0.2 }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, at, 28, 0, 1);
  const breathe = 0.5 + 0.5 * Math.sin((frame - at) / 26);
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top,
        width,
        height,
        marginLeft: -width / 2,
        opacity: p * (strength + breathe * 0.04),
        pointerEvents: "none",
        background: `radial-gradient(ellipse at 50% 30% in oklab, ${alpha(C.paperLight, 70)}, ${alpha(C.paperLight, 0)} 68%)`,
        transform: `translateY(${(1 - p) * 24}px) scale(${0.96 + 0.04 * p + breathe * 0.008})`,
        mixBlendMode: "screen",
      }}
    />
  );
};
