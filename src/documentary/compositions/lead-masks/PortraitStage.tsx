import { Img, interpolate, staticFile } from "remotion";
import { CLAMP, cameraTransform, type CameraMove } from "../../motion";
import { alpha, type DocTheme } from "../../theme";

export type PortraitBox = { x: number; y: number; width: number; height: number };

type PortraitStageProps = {
  src: string;
  theme: DocTheme;
  frame: number;
  duration: number;
  box: PortraitBox;
  label?: string;
  move?: CameraMove;
  strength?: number;
  tone?: "normal" | "cold";
  gid: string;
};

export const PortraitStage: React.FC<PortraitStageProps> = ({
  src,
  theme,
  frame,
  duration,
  box,
  label,
  move = "driftUp",
  strength = 0.5,
  tone = "normal",
  gid,
}) => {
  const pose = cameraTransform(frame, duration, move, strength);
  const edge = interpolate(frame, [0, Math.min(24, Math.max(1, duration - 1))], [0.3, 0.85], CLAMP);
  const cold = tone === "cold";
  const haze = ((frame / Math.max(1, duration)) * 26 - 13).toFixed(2);

  return (
    <div
      data-doc-el="portrait"
      data-doc-overflow-ok="true"
      style={{
        position: "absolute",
        left: box.x,
        top: box.y,
        width: box.width,
        height: box.height,
        overflow: "hidden",
        background: theme.color.deep,
        border: `1px solid ${alpha(theme.color.line, 90)}`,
        boxShadow: `0 38px 90px ${alpha(theme.color.void, 72)}`,
      }}
    >
      <div style={{ position: "absolute", inset: "-14%", transform: pose.transform }}>
        <Img
          src={staticFile(src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: cold ? "blur(30px) brightness(0.3) grayscale(0.7)" : "blur(28px) brightness(0.4) grayscale(0.35)",
          }}
        />
      </div>
      <div style={{ position: "absolute", inset: 0, transform: pose.transform }}>
        <Img
          src={staticFile(src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: cold ? "contrast(1.16) saturate(0.42) brightness(0.76) sepia(0.14) hue-rotate(172deg)" : "contrast(1.08) saturate(0.9)",
          }}
        />
      </div>
      {cold ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: `radial-gradient(circle at 50% 42%, ${alpha(theme.color.panel, 22)}, transparent 62%), linear-gradient(162deg, ${alpha(theme.color.void, 42)}, transparent 48%, ${alpha(theme.color.void, 62)})`,
          }}
        />
      ) : null}
      {cold ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.16,
            transform: `translateY(${haze}px)`,
            backgroundImage: "repeating-linear-gradient(180deg, transparent 0 5px, rgba(0, 0, 0, 0.5) 5px 6px)",
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, transparent 62%, ${alpha(theme.color.void, 88)})`,
        }}
      />
      <div style={{ position: "absolute", left: 0, top: 0, width: 110, height: 3, background: theme.color.accent, opacity: edge }} />
      {label ? (
        <div
          style={{
            position: "absolute",
            left: 16,
            bottom: 16,
            padding: "8px 14px",
            background: alpha(theme.color.void, 86),
            borderLeft: `3px solid ${theme.color.accent}`,
            fontFamily: theme.font.type,
            fontSize: 21,
            letterSpacing: 2,
            color: theme.color.text,
          }}
        >
          {label}
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          right: 14,
          top: 12,
          fontFamily: theme.font.type,
          fontSize: 16,
          letterSpacing: 2,
          color: alpha(theme.color.text, 55),
        }}
      >
        {gid.toUpperCase()}
      </div>
    </div>
  );
};
