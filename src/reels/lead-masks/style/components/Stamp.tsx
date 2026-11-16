import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { alpha, C, FONT, clamp, type Tone } from "../theme";
import { slamPose } from "../motion";

type StampProps = {
  text: string;
  delay?: number;
  rotate?: number;
  size?: number;
  tone?: Tone;
  style?: React.CSSProperties;
  bleed?: boolean;
  /** centre the stamp horizontally over the main action */
  center?: boolean;
};

export const Stamp: React.FC<StampProps> = ({
  text,
  delay = 0,
  rotate = -7,
  size = 92,
  tone = "paper",
  style,
  bleed = true,
  center = false,
}) => {
  const frame = useCurrentFrame();
  const { scale, y, opacity, shake } = slamPose(frame, delay);
  const bleedOpacity = interpolate(frame - delay, [4, 22], [0, 0.3], clamp);
  const pos: React.CSSProperties = center
    ? { left: 0, right: 0, width: "max-content", marginLeft: "auto", marginRight: "auto" }
    : {};

  return (
    <div
      style={{
        position: "absolute",
        ...pos,
        ...style,
        transform: `rotate(${rotate}deg) translateY(${y}px) translateX(${shake}px) scale(${scale})`,
        opacity,
      }}
    >
      {bleed ? (
        <>
          <div
            style={{
              position: "absolute",
              inset: "-12px -18px",
              background: C.red,
              filter: "blur(9px)",
              opacity: bleedOpacity * 0.55,
              borderRadius: 18,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 18,
              right: -10,
              top: -8,
              bottom: 10,
              background: C.red,
              filter: "blur(16px)",
              opacity: bleedOpacity * 0.35,
              borderRadius: 30,
            }}
          />
        </>
      ) : null}
      <div
        style={{
          fontFamily: FONT.display,
          fontSize: size,
          lineHeight: 0.92,
          letterSpacing: 1,
          color: C.red,
          borderRadius: 8,
          boxShadow: `inset 0 0 0 12px ${C.red}`,
          padding: "2px 33px 0",
          whiteSpace: "nowrap",
          mixBlendMode: tone === "paper" ? "multiply" : "normal",
          textShadow: `0 1px 0 ${alpha(C.ink, 8)}`,
        }}
      >
        {text}
      </div>
    </div>
  );
};
