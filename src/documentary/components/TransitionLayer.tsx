import { DOC_HEIGHT, DOC_WIDTH } from "../geometry";
import { clamp01 } from "../motion";
import { alpha, type DocTheme } from "../theme";
import type { TransitionKind } from "../types";

type TransitionLayerProps = {
  theme: DocTheme;
  mode: TransitionKind | undefined;
  frame: number;
  duration: number;
  phase: "in" | "out";
};

const LENGTH = 15;
const DIP_MIN = 0.12;
const DIP_MAX = 0.9;

const dip = (p: number) => DIP_MIN + (1 - DIP_MIN) * clamp01(p) * DIP_MAX;

export const TransitionLayer: React.FC<TransitionLayerProps> = ({ theme, mode, frame, duration, phase }) => {
  if (!mode || mode === "none") return null;
  const local = phase === "in" ? frame : frame - Math.max(0, duration - LENGTH);
  if (local < 0 || local > LENGTH) return null;
  const raw = clamp01(local / LENGTH);
  const p = phase === "in" ? 1 - raw : raw;

  if (mode === "fade") {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, ${alpha(theme.color.accent, 12)}, transparent 62%), linear-gradient(155deg, ${theme.color.panel}, ${theme.color.deep})`,
          opacity: dip(p),
          pointerEvents: "none",
        }}
      />
    );
  }

  if (mode === "match") {
    const sweep = phase === "in" ? raw : 1 - raw;
    return (
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(90deg, ${theme.color.deep}, ${theme.color.panel}, ${theme.color.deep})`,
            opacity: dip(p) * 0.72,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${(sweep * 118 - 9).toFixed(1)}%`,
            width: 3,
            background: alpha(theme.color.accent, 85),
            boxShadow: `0 0 42px ${alpha(theme.color.accent, 55)}`,
          }}
        />
      </div>
    );
  }

  if (mode === "whip") {
    const x = phase === "in" ? -100 + raw * (DOC_WIDTH + 600) : -DOC_WIDTH - 500 + raw * (DOC_WIDTH + 400);
    return (
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: x - index * 60,
              top: index * (DOC_HEIGHT / 5),
              width: DOC_WIDTH + 400,
              height: DOC_HEIGHT / 5 + 2,
              background: index % 2 === 0 ? alpha(theme.color.deep, 96) : alpha(theme.color.panel, 92),
              transform: "skewX(-14deg)",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            left: x + 260,
            top: 0,
            width: 6,
            height: DOC_HEIGHT,
            background: alpha(theme.color.accent, 85),
            boxShadow: `0 0 60px ${alpha(theme.color.accent, 45)}`,
          }}
        />
      </div>
    );
  }

  if (mode === "iris") {
    const radius = phase === "in" ? 20 + raw * 120 : 140 - raw * 120;
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: theme.color.deep,
          maskImage: `radial-gradient(circle at 50% 50%, transparent ${radius.toFixed(1)}%, black ${(radius + 3).toFixed(1)}%)`,
          pointerEvents: "none",
        }}
      />
    );
  }

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {Array.from({ length: 8 }, (_, index) => {
        const delay = index * 1.4;
        const bar = clamp01((raw * LENGTH - delay) / (LENGTH - delay));
        const amount = phase === "in" ? bar : 1 - bar;
        const direction = phase === "in" ? -1 : 1;
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: 0,
              top: (index * DOC_HEIGHT) / 8,
              width: DOC_WIDTH,
              height: DOC_HEIGHT / 8 + 2,
              background: index % 2 === 0 ? alpha(theme.color.deep, 96) : alpha(theme.color.panel, 88),
              transform: `translateX(${(direction * amount * DOC_WIDTH).toFixed(1)}px)`,
            }}
          />
        );
      })}
    </div>
  );
};

export const exposureFlash = (frame: number, at: number, theme: DocTheme) =>
  interpolateFlash(frame, at) > 0 ? { boxShadow: `inset 0 0 240px ${alpha(theme.color.text, 60)}` } : undefined;

const interpolateFlash = (frame: number, at: number) => {
  const t = frame - at;
  if (t <= 0 || t >= 8) return 0;
  return t < 2 ? t / 2 : 1 - (t - 2) / 6;
};
