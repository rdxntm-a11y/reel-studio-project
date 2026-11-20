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
  gid,
}) => {
  const pose = cameraTransform(frame, duration, move, strength);
  const edge = interpolate(frame, [0, Math.min(24, Math.max(1, duration - 1))], [0.3, 0.85], CLAMP);

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
            filter: "blur(28px) brightness(0.4) grayscale(0.35)",
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
            filter: "contrast(1.08) saturate(0.9)",
          }}
        />
      </div>
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
