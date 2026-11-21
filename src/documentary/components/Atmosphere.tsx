import type { CSSProperties } from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { DOC_HEIGHT, DOC_WIDTH } from "../geometry";
import { CLAMP, EASE, linearProgress } from "../motion";
import { alpha, type DocTheme } from "../theme";

type AtmosphereProps = {
  theme: DocTheme;
  frame: number;
  duration: number;
  id: string;
  variant?: "void" | "deep" | "paper" | "split";
  grain?: number;
};

export const Atmosphere: React.FC<AtmosphereProps> = ({
  theme,
  frame,
  duration,
  id,
  variant = "void",
  grain,
}) => {
  const p = linearProgress(frame, 0, duration);
  const drift = interpolate(p, [0, 1], [-40, 40], CLAMP);
  const sweep = interpolate(p, [0, 1], [-170, 170], CLAMP);
  const sweepOpacity = interpolate(p, [0, 0.18, 0.82, 1], [0.08, 0.2, 0.2, 0.08], CLAMP);
  const gid = `grain-${id.replace(/[^a-zA-Z0-9]/g, "")}`;
  const paper = variant === "paper";
  const split = variant === "split";
  const base = paper ? theme.color.paper : split || variant === "deep" ? theme.color.deep : theme.color.void;
  const wash = paper ? theme.color.paperShade : theme.color.panel;

  const background: CSSProperties = {
    background: paper
      ? `radial-gradient(circle at 30% 20%, ${alpha(wash, 70)}, transparent 58%), linear-gradient(155deg, ${base}, ${theme.color.paperShade})`
      : split
        ? `linear-gradient(104deg, ${theme.color.deep} 0 45%, ${alpha(theme.color.accent, 14)} 46% 47%, ${theme.color.void} 48% 100%), radial-gradient(circle at 78% 24%, ${alpha(theme.color.panel, 62)}, transparent 56%)`
        : `radial-gradient(circle at 72% 28%, ${alpha(theme.color.panel, 78)}, transparent 55%), radial-gradient(circle at 16% 82%, ${alpha(theme.color.signal, 10)}, transparent 48%), linear-gradient(160deg, ${base}, ${theme.color.void})`,
  };

  return (
    <AbsoluteFill style={{ backgroundColor: base }}>
      <AbsoluteFill style={background} />
      <AbsoluteFill
        style={{
          transform: `translate3d(${sweep.toFixed(2)}px, ${(-sweep * 0.11).toFixed(2)}px, 0) scale(1.04)`,
          opacity: paper ? 0.06 : sweepOpacity,
          pointerEvents: "none",
          background: `radial-gradient(ellipse 42% 30% at 44% 50%, ${alpha(theme.color.accent, 20)}, transparent 74%)`,
        }}
      />
      <AbsoluteFill
        style={{
          transform: `translate3d(${drift.toFixed(2)}px, ${(-drift * 0.4).toFixed(2)}px, 0)`,
          opacity: paper ? 0.16 : 0.3,
          backgroundImage: `linear-gradient(${alpha(theme.color.line, 55)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(theme.color.line, 55)} 1px, transparent 1px)`,
          backgroundSize: "120px 120px",
          maskImage: "radial-gradient(ellipse at center, black, transparent 78%)",
        }}
      />
      <AbsoluteFill
        style={{
          transform: `translate3d(${(-drift * 0.36).toFixed(2)}px, ${(drift * 0.18).toFixed(2)}px, 0)`,
          opacity: paper ? 0.08 : 0.14,
          backgroundImage: `linear-gradient(${alpha(theme.color.line, 40)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(theme.color.line, 40)} 1px, transparent 1px)`,
          backgroundSize: "320px 320px",
          maskImage: "radial-gradient(ellipse at center, black, transparent 86%)",
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, transparent 38%, ${alpha(theme.color.void, paper ? 30 : 62)} 100%)`,
        }}
      />
      <svg width={DOC_WIDTH} height={DOC_HEIGHT} style={{ position: "absolute", opacity: grain ?? theme.grain, mixBlendMode: paper ? "multiply" : "overlay" }}>
        <filter id={gid}>
          <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="2" seed={Math.round(p * 3) + 1} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={DOC_WIDTH} height={DOC_HEIGHT} filter={`url(#${gid})`} opacity={0.55} />
      </svg>
    </AbsoluteFill>
  );
};

export const Scrim: React.FC<{
  theme: DocTheme;
  position?: "bottom" | "top" | "left";
  strength?: number;
}> = ({ theme, position = "bottom", strength = 0.78 }) => {
  const directions: Record<"bottom" | "top" | "left", string> = {
    bottom: "to top",
    top: "to bottom",
    left: "to right",
  };
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${directions[position]}, ${alpha(theme.color.void, strength)}, transparent 72%)`,
      }}
    />
  );
};

export const fadeEnvelope = (frame: number, duration: number, length = 15) =>
  interpolate(frame, [0, length, duration - length, duration], [0, 1, 1, 0], { ...CLAMP, easing: EASE.enter });
