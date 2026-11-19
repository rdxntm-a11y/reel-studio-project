import type { CSSProperties } from "react";
import { Img, interpolate, staticFile } from "remotion";
import { Camera } from "./Camera";
import { CLAMP, cameraTransform, type CameraMove } from "../motion";
import { alpha, type DocTheme } from "../theme";

type PhotoPlateProps = {
  src: string;
  theme: DocTheme;
  frame: number;
  duration: number;
  x: number;
  y: number;
  width: number;
  height: number;
  move?: CameraMove;
  treatment?: "photo" | "cold" | "warm";
  rotate?: number;
  label?: string;
  gid: string;
  opacity?: number;
};

const filters: Record<NonNullable<PhotoPlateProps["treatment"]>, string> = {
  photo: "grayscale(0.85) contrast(1.16) sepia(0.18)",
  cold: "grayscale(0.7) contrast(1.22) sepia(0.08) hue-rotate(165deg)",
  warm: "grayscale(0.45) contrast(1.1) sepia(0.32)",
};

export const PhotoPlate: React.FC<PhotoPlateProps> = ({
  src,
  theme,
  frame,
  duration,
  x,
  y,
  width,
  height,
  move = "push",
  treatment = "photo",
  rotate = 0,
  label,
  gid,
  opacity = 1,
}) => {
  const pose = cameraTransform(frame, duration, move, 0.7);
  return (
    <div
      data-doc-el="photo-plate"
      data-doc-overflow-ok="true"
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        overflow: "hidden",
        opacity,
        transform: `rotate(${rotate}deg)`,
        border: `1px solid ${alpha(theme.color.text, 28)}`,
        boxShadow: `0 34px 80px ${alpha(theme.color.void, 70)}`,
        backgroundColor: theme.color.deep,
      }}
    >
      <div style={{ position: "absolute", inset: -8, transform: pose.transform, transformOrigin: "55% 45%" }}>
        <Img
          src={staticFile(src)}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: filters[treatment] }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, transparent 45%, ${alpha(theme.color.void, 55)})`,
        }}
      />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: 0.07, mixBlendMode: "overlay" }}>
        <filter id={`plate-${gid}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={4} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={width} height={height} filter={`url(#plate-${gid})`} />
      </svg>
      <CornerMarks color={alpha(theme.color.text, 62)} />
      {label ? (
        <div
          style={{
            position: "absolute",
            left: 18,
            bottom: 16,
            padding: "6px 12px",
            fontFamily: theme.font.type,
            fontSize: 23,
            letterSpacing: 1,
            color: theme.color.text,
            background: alpha(theme.color.void, 74),
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};

export const CornerMarks: React.FC<{ color: string; size?: number }> = ({ color, size = 26 }) => {
  const shared: CSSProperties = { position: "absolute", width: size, height: size, borderColor: color, borderStyle: "solid" };
  return (
    <>
      <div style={{ ...shared, left: 12, top: 12, borderWidth: "2px 0 0 2px" }} />
      <div style={{ ...shared, right: 12, top: 12, borderWidth: "2px 2px 0 0" }} />
      <div style={{ ...shared, left: 12, bottom: 12, borderWidth: "0 0 2px 2px" }} />
      <div style={{ ...shared, right: 12, bottom: 12, borderWidth: "0 2px 2px 0" }} />
    </>
  );
};

type DocumentPlateProps = {
  title: string;
  lines: string[];
  theme: DocTheme;
  frame: number;
  at: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotate?: number;
  stamp?: string;
  gid: string;
};

export const DocumentPlate: React.FC<DocumentPlateProps> = ({
  title,
  lines,
  theme,
  frame,
  at,
  x,
  y,
  width,
  height,
  rotate = 0,
  stamp,
  gid,
}) => {
  const reveal = interpolate(frame, [at, at + 16], [0, 1], CLAMP);
  const stampPose = interpolate(frame, [at + 18, at + 22], [2.1, 1], CLAMP);
  return (
    <div
      data-doc-el="document-plate"
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        transform: `rotate(${rotate}deg) scale(${0.96 + reveal * 0.04})`,
        opacity: reveal,
        padding: "42px 46px",
        boxSizing: "border-box",
        color: theme.color.ink,
        background: `linear-gradient(150deg, ${theme.color.paper}, ${theme.color.paperShade})`,
        boxShadow: `0 30px 70px ${alpha(theme.color.void, 68)}`,
      }}
    >
      <div style={{ fontFamily: theme.font.type, fontSize: 28, letterSpacing: 2, borderBottom: `2px solid ${alpha(theme.color.ink, 40)}`, paddingBottom: 14 }}>
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 30 }}>
        {lines.map((line, index) => (
          <div
            key={`${line}-${index}`}
            style={{
              fontFamily: theme.font.type,
              fontSize: 25,
              lineHeight: 1.4,
              opacity: interpolate(frame, [at + 6 + index * 4, at + 14 + index * 4], [0, 1], CLAMP),
            }}
          >
            {line}
          </div>
        ))}
      </div>
      {stamp ? (
        <div
          style={{
            position: "absolute",
            right: 42,
            bottom: 40,
            transform: `rotate(-13deg) scale(${stampPose})`,
            border: `4px solid ${theme.color.danger}`,
            color: theme.color.danger,
            fontFamily: theme.font.display,
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: 3,
            padding: "10px 18px",
            opacity: stampPose > 1.05 ? 0 : 0.85,
          }}
        >
          {stamp}
        </div>
      ) : null}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: 0.08, mixBlendMode: "multiply" }}>
        <filter id={`doc-${gid}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" seed={7} />
        </filter>
        <rect width={width} height={height} filter={`url(#doc-${gid})`} />
      </svg>
    </div>
  );
};

export const AnnotationPin: React.FC<{ x: number; y: number; text: string; theme: DocTheme; frame: number; at: number }> = ({
  x,
  y,
  text,
  theme,
  frame,
  at,
}) => {
  const reveal = interpolate(frame, [at, at + 8], [0, 1], CLAMP);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity: reveal,
        transform: `translate(${0}px, ${(1 - reveal) * -18}px)`,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: theme.color.accent, boxShadow: `0 0 0 8px ${alpha(theme.color.accent, 18)}` }} />
      <div
        style={{
          fontFamily: theme.font.type,
          fontSize: 24,
          color: theme.color.text,
          background: alpha(theme.color.void, 88),
          padding: "6px 12px",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const CameraPlate: React.FC<{
  src: string;
  theme: DocTheme;
  frame: number;
  duration: number;
  move?: CameraMove;
  strength?: number;
  treatment?: string;
}> = ({ src, theme, frame, duration, move = "push", strength = 1, treatment = "grayscale(0.6) contrast(1.12)" }) => (
  <Camera frame={frame} duration={duration} move={move} strength={strength}>
    <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: treatment }} />
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${alpha(theme.color.void, 78)}, transparent 65%)` }} />
  </Camera>
);
