import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, FONT } from "../theme";

type Props = { text: string; color?: string; delay?: number; rotate?: number };

export const Stamp: React.FC<Props> = ({
  text,
  color = C.danger,
  delay = 0,
  rotate = -8,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame,
    fps,
    delay,
    config: { damping: 14, stiffness: 300, mass: 0.6 },
  });
  const scale = interpolate(s, [0, 1], [3, 1]);
  const opacity = interpolate(frame - delay, [0, 3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const since = frame - delay - 5;
  const shake =
    since >= 0 ? Math.sin(since * 2.4) * 14 * Math.max(0, 1 - since / 10) : 0;
  return (
    <div
      style={{
        display: "inline-block",
        opacity,
        backgroundColor: C.bg,
        color,
        fontFamily: FONT.headline,
        fontSize: 130,
        letterSpacing: 6,
        padding: "4px 36px",
        border: `10px solid ${color}`,
        borderRadius: 20,
        transform: `translateX(${shake}px) rotate(${rotate}deg) scale(${scale})`,
      }}
    >
      {text.toUpperCase()}
    </div>
  );
};
