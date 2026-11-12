import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, FONT, SPRING, ZONE } from "../theme";

type Props = {
  text: string;
  delay?: number;
  size?: number;
  accent?: number[];
  accentColor?: string;
};

export const Headline: React.FC<Props> = ({
  text,
  delay = 0,
  size = 150,
  accent = [],
  accentColor = C.primary,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.toUpperCase().split(" ");
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        width: 900,
        top: ZONE.headline.y,
        height: ZONE.headline.h,
        display: "flex",
        flexWrap: "wrap",
        alignContent: "center",
        justifyContent: "center",
        gap: "0 26px",
      }}
    >
      {words.map((w, i) => {
        const s = spring({
          frame,
          fps,
          delay: delay + i * 4,
          config: SPRING.pop,
        });
        const y = interpolate(s, [0, 1], [50, 0]);
        const scale = interpolate(s, [0, 1], [0.6, 1]);
        const opacity = interpolate(s, [0, 0.4], [0, 1], {
          extrapolateRight: "clamp",
        });
        return (
          <span
            key={i}
            style={{
              fontFamily: FONT.headline,
              fontSize: size,
              lineHeight: 0.98,
              letterSpacing: 2,
              display: "inline-block",
              opacity,
              color: accent.includes(i) ? accentColor : C.ink,
              transform: `translateY(${y}px) scale(${scale})`,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};
