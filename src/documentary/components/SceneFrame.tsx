import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Img, interpolate, staticFile } from "remotion";
import { DOC_SAFE } from "../geometry";
import { CLAMP, EASE, clamp01, type CameraMove } from "../motion";
import { alpha, type DocTheme } from "../theme";
import type { DocWord, TransitionKind } from "../types";
import { Atmosphere, Scrim } from "./Atmosphere";
import { Camera } from "./Camera";
import { DocCaption } from "./DocCaption";
import { TransitionLayer } from "./TransitionLayer";

type SceneSignature = "rule" | "rail" | "corner" | "grid" | "none";

type SceneFrameProps = {
  id: string;
  theme: DocTheme;
  frame: number;
  duration: number;
  children: ReactNode;
  variant?: "void" | "deep" | "paper" | "split";
  backgroundImage?: string;
  camera?: CameraMove;
  cameraStrength?: number;
  words?: DocWord[];
  from?: number;
  kicker?: string;
  kickerSide?: "left" | "right" | "vertical";
  chapter?: string;
  signature?: SceneSignature;
  transitionIn?: TransitionKind;
  transitionOut?: TransitionKind;
  debug?: boolean;
  caption?: boolean;
  scrim?: boolean;
  imageBrightness?: number;
  scrimStrength?: number;
};

const Signature: React.FC<{ kind: SceneSignature; theme: DocTheme }> = ({ kind, theme }) => {
  if (kind === "rule") {
    return (
      <div
        style={{
          position: "absolute",
          left: DOC_SAFE.left,
          top: 116,
          width: 360,
          height: 2,
          background: alpha(theme.color.accent, 62),
        }}
      />
    );
  }
  if (kind === "rail") {
    return (
      <div style={{ position: "absolute", left: DOC_SAFE.left - 34, top: DOC_SAFE.top + 40, width: 2, height: 560, background: alpha(theme.color.accent, 38) }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ position: "absolute", left: -6, top: i * 180, width: 14, height: 2, background: alpha(theme.color.accent, 58) }} />
        ))}
      </div>
    );
  }
  if (kind === "corner") {
    return (
      <div style={{ position: "absolute", right: DOC_SAFE.right, top: DOC_SAFE.top + 30, width: 54, height: 54 }}>
        <div style={{ position: "absolute", right: 0, top: 0, width: 54, height: 2, background: alpha(theme.color.accent, 64) }} />
        <div style={{ position: "absolute", right: 0, top: 0, width: 2, height: 54, background: alpha(theme.color.accent, 64) }} />
      </div>
    );
  }
  if (kind === "grid") {
    return (
      <div style={{ position: "absolute", left: DOC_SAFE.left, bottom: DOC_SAFE.bottom + 96, display: "grid", gridTemplateColumns: "repeat(3, 8px)", gap: 10, opacity: 0.7 }}>
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i === 4 ? theme.color.accent : alpha(theme.color.line, 90) }} />
        ))}
      </div>
    );
  }
  return null;
};

const TRANSITION_LENGTH = 15;

const TransitionSlate: React.FC<{
  theme: DocTheme;
  frame: number;
  duration: number;
  transitionIn?: TransitionKind;
  transitionOut?: TransitionKind;
  label?: string;
}> = ({ theme, frame, duration, transitionIn, transitionOut, label }) => {
  const windows: { start: number; direction: "in" | "out" }[] = [];
  if (transitionIn && transitionIn !== "none") windows.push({ start: 0, direction: "in" });
  if (transitionOut && transitionOut !== "none") windows.push({ start: Math.max(0, duration - TRANSITION_LENGTH), direction: "out" });
  const active = windows.find((window) => frame >= window.start && frame <= window.start + TRANSITION_LENGTH);
  if (!active) return null;
  const raw = clamp01((frame - active.start) / TRANSITION_LENGTH);
  const strength = active.direction === "in" ? 1 - raw : raw;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        opacity: 0.1 + strength * 0.68,
        transform: `scale(${(0.94 + strength * 0.06).toFixed(3)})`,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 170, height: 2, background: alpha(theme.color.accent, 92) }} />
          <div style={{ width: 14, height: 14, border: `2px solid ${theme.color.accent}`, transform: "rotate(45deg)" }} />
          <div style={{ width: 170, height: 2, background: alpha(theme.color.accent, 92) }} />
        </div>
        {label ? (
          <div style={{ fontFamily: theme.font.type, fontSize: 19, letterSpacing: 7, color: alpha(theme.color.text, 82) }}>{label}</div>
        ) : null}
      </div>
    </div>
  );
};

export const SceneFrame: React.FC<SceneFrameProps> = ({
  id,
  theme,
  frame,
  duration,
  children,
  variant = "void",
  backgroundImage,
  camera = "none",
  cameraStrength = 1,
  words,
  from = 0,
  kicker,
  kickerSide = "left",
  chapter,
  signature = "none",
  transitionIn,
  transitionOut,
  debug = false,
  caption = true,
  scrim = false,
  imageBrightness = 0.66,
  scrimStrength = 0.68,
}) => {
  const settle = interpolate(frame, [0, Math.max(1, duration - 1)], [0, 1], { ...CLAMP, easing: EASE.camera });
  const contentScale = 0.996 + settle * 0.004;
  const kickerStyle: CSSProperties = {
    position: "absolute",
    fontFamily: theme.font.type,
    fontSize: 23,
    letterSpacing: 5,
    textTransform: "uppercase",
    color: theme.color.accent,
    textShadow: `0 3px 14px ${alpha(theme.color.void, 80)}`,
  };

  return (
    <AbsoluteFill data-doc-scene={id} style={{ backgroundColor: theme.color.void }}>
      <Atmosphere theme={theme} frame={frame} duration={duration} id={id} variant={variant} />
      {backgroundImage ? (
        <Camera frame={frame} duration={duration} move={camera} strength={cameraStrength}>
          <Img
            src={staticFile(backgroundImage)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: `grayscale(0.72) contrast(1.14) brightness(${imageBrightness})`,
            }}
          />
        </Camera>
      ) : null}
      {scrim ? <Scrim theme={theme} strength={scrimStrength} /> : null}
      <div
        data-doc-content="true"
        style={{
          position: "absolute",
          left: DOC_SAFE.left,
          right: DOC_SAFE.right,
          top: DOC_SAFE.top,
          bottom: DOC_SAFE.bottom,
        }}
      >
        <div style={{ position: "absolute", inset: 0, transform: `scale(${contentScale.toFixed(4)})`, transformOrigin: "50% 50%" }}>
          {children}
        </div>
      </div>
      <TransitionLayer theme={theme} mode={transitionIn} frame={frame} duration={duration} phase="in" />
      <TransitionLayer theme={theme} mode={transitionOut} frame={frame} duration={duration} phase="out" />
      <TransitionSlate
        theme={theme}
        frame={frame}
        duration={duration}
        transitionIn={transitionIn}
        transitionOut={transitionOut}
        label={chapter}
      />
      <Signature kind={signature} theme={theme} />
      {kicker ? (
        <div
          style={{
            ...kickerStyle,
            left: kickerSide === "left" ? DOC_SAFE.left : undefined,
            right: kickerSide === "right" ? DOC_SAFE.right : undefined,
            top: kickerSide === "vertical" ? 180 : 34,
            writingMode: kickerSide === "vertical" ? "vertical-rl" : "horizontal-tb",
          }}
        >
          {kicker}
        </div>
      ) : null}
      {chapter ? (
        <div
          style={{
            position: "absolute",
            right: kickerSide === "right" ? undefined : DOC_SAFE.right,
            left: kickerSide === "right" ? DOC_SAFE.left : undefined,
            top: 36,
            fontFamily: theme.font.type,
            fontSize: 21,
            letterSpacing: 3,
            color: theme.color.muted,
          }}
        >
          {chapter}
        </div>
      ) : null}
      {caption && words?.length ? <DocCaption words={words} from={from} theme={theme} duration={duration} /> : null}
      {debug ? (
        <div
          style={{
            position: "absolute",
            left: DOC_SAFE.left,
            right: DOC_SAFE.right,
            top: DOC_SAFE.top,
            bottom: DOC_SAFE.bottom,
            border: `2px dashed ${alpha(theme.color.accent, 60)}`,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
