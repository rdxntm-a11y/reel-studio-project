import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, SPRING, ZONE, clamp, type Tone } from "../theme";

type HeadlineProps = {
  label?: string;
  line1: string;
  line2?: string;
  tone?: Tone;
  delay?: number;
  align?: "left" | "center";
  width?: number;
  size?: number;
};

export const Headline: React.FC<HeadlineProps> = ({
  label,
  line1,
  line2,
  tone = "paper",
  delay = 0,
  align = "center",
  width = ZONE.headline.w,
  size = 148,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const line1Color = tone === "dark" ? C.cream : C.ink;
  const lines = [line1, line2].filter(Boolean) as string[];

  return (
    <div
      data-el="headline"
      data-kind="content"
      style={{
        position: "relative",
        width,
        maxWidth: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        textAlign: align,
        textTransform: "uppercase",
      }}
    >
      {label ? (
        <div
          style={{
            fontFamily: FONT.type,
            fontSize: 28,
            letterSpacing: 6,
            color: C.accent,
            marginBottom: 14,
            opacity: spring({ frame: frame - delay, fps, config: SPRING.pop }),
          }}
        >
          {label}
        </div>
      ) : null}
      {lines.map((text, i) => {
        const s = spring({ frame: frame - delay - (label ? 2 : 0) - i * 2, fps, config: SPRING.pop });
        return (
          <div
            key={i}
            style={{
              fontFamily: FONT.display,
              fontWeight: 700,
              fontSize: Math.min(size, 96),
              lineHeight: 0.88,
              letterSpacing: 1,
              color: i === 1 ? C.accent : line1Color,
              transform: `translateY(${interpolate(s, [0, 1], [34, 0], clamp)}px) scale(${interpolate(s, [0, 1], [0.86, 1], clamp)})`,
              opacity: s,
              textShadow: tone === "dark" ? "0 4px 0 rgba(0,0,0,0.35)" : "0 3px 0 rgba(0,0,0,0.1)",
            }}
          >
            {text}
          </div>
        );
      })}
    </div>
  );
};
