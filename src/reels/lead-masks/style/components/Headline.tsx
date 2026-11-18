import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, SPRING, ZONE, clamp, type Tone } from "../theme";
import { ease, p01 } from "../motion";

export type HeadlineVariant = "rise" | "mask" | "track" | "split" | "press" | "dateline";

type HeadlineProps = {
  label?: string;
  line1: string;
  line2?: string;
  tone?: Tone;
  delay?: number;
  align?: "left" | "center";
  width?: number;
  size?: number;
  /** choose a different entrance so consecutive beats do not read as one template */
  variant?: HeadlineVariant;
  /** short editorial rule beside the kicker; dateline adds a timeline node */
  accentRule?: boolean;
  ruleLength?: number;
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
  variant = "rise",
  accentRule = false,
  ruleLength = 56,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const line1Color = tone === "dark" ? C.cream : C.ink;
  const lines = [line1, line2].filter(Boolean) as string[];
  const labelSpace = label ? 42 : 0;
  const longest = Math.max(...lines.map((text) => text.length));
  const widthFit = (width * 0.94) / (longest * 0.52);
  const heightFit = (ZONE.headline.h - labelSpace) / (lines.length * 0.9);
  const fontSize = Math.max(56, Math.min(size, widthFit, heightFit));
  const ruleOn = accentRule || variant === "dateline";
  const labelS = spring({ frame: frame - delay, fps, config: SPRING.pop });
  const ruleP = ease(frame, delay + 2, variant === "dateline" ? 22 : 16, 0, 1);

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
            display: "flex",
            alignItems: "center",
            gap: ruleOn ? 12 : 0,
            marginBottom: 14,
            opacity: labelS,
            transform: `translateX(${interpolate(labelS, [0, 1], align === "center" ? [0, 0] : [-12, 0], clamp)}px)`,
          }}
        >
          {ruleOn ? (
            <div
              style={{
                position: "relative",
                width: interpolate(ruleP, [0, 1], [0, ruleLength], clamp),
                height: variant === "dateline" ? 5 : 4,
                background: C.red,
                flexShrink: 0,
              }}
            >
              {variant === "dateline" ? (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: -3,
                    width: 11,
                    height: 11,
                    background: C.red,
                  }}
                />
              ) : null}
            </div>
          ) : null}
          <div
            style={{
              fontFamily: FONT.type,
              fontSize: 28,
              letterSpacing: 6,
              color: C.accent,
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </div>
        </div>
      ) : null}
      {lines.map((text, i) => {
        const cfg = variant === "press" ? SPRING.drop : SPRING.pop;
        const s = spring({ frame: frame - delay - (label ? 2 : 0) - i * 3, fps, config: cfg });
        const p = p01(s);

        let transform = `translateY(${interpolate(s, [0, 1], [42, 0], clamp)}px)`;
        let clipPath: string | undefined;
        let letterSpacing = 1;

        if (variant === "mask") {
          transform = `translateY(${interpolate(s, [0, 1], [18, 0], clamp)}px)`;
          clipPath = `inset(${(1 - p) * 100}% 0 0 0)`;
        } else if (variant === "track" || variant === "dateline") {
          transform = `scale(${0.985 + 0.015 * p})`;
          letterSpacing = interpolate(s, [0, 1], [4, 1], clamp);
        } else if (variant === "split") {
          const dir = i % 2 === 0 ? -1 : 1;
          transform = `translateX(${dir * 42 * (1 - p)}px)`;
          clipPath =
            dir < 0 ? `inset(0 ${(1 - p) * 100}% 0 0)` : `inset(0 0 0 ${(1 - p) * 100}%)`;
        } else if (variant === "press") {
          transform = `translateY(${interpolate(s, [0, 1], [-34, 0], clamp)}px) scale(${interpolate(
            s,
            [0, 1],
            [1.07, 1],
            clamp,
          )})`;
        }

        return (
          <div
            key={i}
            style={{
              fontFamily: FONT.display,
              fontWeight: 700,
              fontSize,
              lineHeight: 0.9,
              letterSpacing,
              color: i === 1 ? C.accent : line1Color,
              whiteSpace: "nowrap",
              maxWidth: "100%",
              transform,
              clipPath,
              opacity: p,
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
