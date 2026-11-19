import type { CSSProperties } from "react";
import { maskReveal, SPRING, springAt, clamp01 } from "../motion";
import { alpha, type DocTheme } from "../theme";

export type HeadlineVariant = "rise" | "mask" | "split" | "tracking" | "stamp";

type HeadlineProps = {
  text: string;
  theme: DocTheme;
  frame: number;
  fps: number;
  at?: number;
  size?: number;
  variant?: HeadlineVariant;
  color?: string;
  accent?: string;
  maxWidth?: number;
  lineHeight?: number;
  align?: "left" | "center" | "right";
  stagger?: number;
  uppercase?: boolean;
  style?: CSSProperties;
};

export const Headline: React.FC<HeadlineProps> = ({
  text,
  theme,
  frame,
  fps,
  at = 0,
  size = 116,
  variant = "mask",
  color,
  accent,
  maxWidth = 1500,
  lineHeight = 1.08,
  align = "left",
  stagger = 3,
  uppercase = true,
  style,
}) => {
  const words = text.split(/\s+/).filter(Boolean);
  const baseColor = color ?? theme.color.text;
  const highlight = accent ?? theme.color.accent;
  const tracking = variant === "tracking" ? springAt(frame, fps, at, SPRING.soft) : 1;

  return (
    <div
      aria-label={text}
      data-doc-el="headline"
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
        maxWidth,
        fontFamily: theme.font.display,
        fontSize: size,
        fontWeight: 700,
        lineHeight,
        letterSpacing: `${(-2.2 + tracking * 2.2).toFixed(2)}px`,
        textTransform: uppercase ? "uppercase" : "none",
        color: baseColor,
        textShadow: `0 14px 44px ${alpha(theme.color.void, 75)}, 0 2px 0 ${alpha(theme.color.void, 38)}`,
        ...style,
      }}
    >
      {words.map((word, index) => {
        const delay = at + index * stagger;
        const pose = maskReveal(frame, fps, delay);
        const splitPose = variant === "split" ? (index % 2 === 0 ? pose.y : -pose.y) : pose.y;
        const pop = variant === "stamp" ? springAt(frame, fps, delay, SPRING.snap) : 1;
        const isAccent = index === words.length - 1 && variant === "stamp";
        const wordStyle: CSSProperties = {
          display: "inline-block",
          opacity: clamp01(pose.progress),
          transform: `translateY(${splitPose.toFixed(2)}px) scale(${(0.9 + pop * 0.1).toFixed(3)})`,
          color: isAccent ? highlight : baseColor,
        };
        return (
          <span
            key={`${word}-${index}`}
            aria-hidden
            style={{
              display: "inline-block",
              overflow: "hidden",
              paddingRight: "0.24em",
              paddingTop: 10,
              paddingBottom: 24,
              marginTop: -10,
              marginBottom: -24,
            }}
          >
            <span style={wordStyle}>{word}</span>
          </span>
        );
      })}
    </div>
  );
};
