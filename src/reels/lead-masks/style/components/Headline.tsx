import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { alpha, C, FONT, SPRING, ZONE, clamp, toneColors, type Tone } from "../theme";

type HeadlineProps = {
  text: string;
  tone?: Tone;
  accent?: number[];
  size?: number;
  delay?: number;
  align?: "left" | "center";
  width?: number;
};

export const Headline: React.FC<HeadlineProps> = ({
  text,
  tone = "paper",
  accent = [],
  size = 148,
  delay = 0,
  align = "center",
  width = ZONE.headline.w,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const col = toneColors(tone);
  const words = text.split(" ");

  return (
    <div
      data-el="headline"
      data-kind="content"
      style={{
        position: "absolute",
        left: ZONE.headline.x,
        top: ZONE.headline.y,
        width,
        height: ZONE.headline.h,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-start",
        alignContent: "flex-start",
        justifyContent: align === "center" ? "center" : "flex-start",
        columnGap: 18,
        rowGap: 0,
        textAlign: align,
        fontFamily: FONT.display,
        fontSize: size,
        lineHeight: 0.9,
        letterSpacing: 1,
        textTransform: "uppercase",
      }}
    >
      {words.map((word, i) => {
        const s = spring({
          frame: frame - delay - i * 2,
          fps,
          config: SPRING.pop,
        });
        const scale = interpolate(s, [0, 1], [0.72, 1], clamp);
        const y = interpolate(s, [0, 1], [34, 0], clamp);
        const isAccent = accent.includes(i);
        return (
          <span
            key={`${word}-${i}`}
            style={{
              display: "inline-block",
              transform: `translateY(${y}px) scale(${scale})`,
              opacity: s,
              color: isAccent ? C.red : col.fg,
              textShadow: tone === "paper" ? `0 3px 0 ${alpha(C.ink, 10)}` : `0 4px 0 ${alpha(C.ink, 35)}`,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
