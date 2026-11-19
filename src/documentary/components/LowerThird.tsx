import { interpolate } from "remotion";
import { DOC_LOWER_THIRD } from "../geometry";
import { CLAMP, EASE, clamp01, ease } from "../motion";
import { alpha, type DocTheme } from "../theme";

type LowerThirdProps = {
  name: string;
  role: string;
  theme: DocTheme;
  frame: number;
  duration: number;
  at?: number;
  accent?: string;
};

export const LowerThird: React.FC<LowerThirdProps> = ({ name, role, theme, frame, duration, at = 12, accent }) => {
  const bar = ease(frame, at, 15, -520, 0, EASE.enter);
  const namePose = ease(frame, at + 4, 14, 42, 0);
  const rolePose = ease(frame, at + 8, 14, 30, 0);
  const exit = interpolate(frame, [duration - 12, duration], [1, 0], CLAMP);
  const opacity = clamp01(Math.min(ease(frame, at, 10, 0, 1), exit));
  const color = accent ?? theme.color.accent;

  return (
    <div
      data-doc-el="lower-third"
      style={{
        position: "absolute",
        left: DOC_LOWER_THIRD.x,
        bottom: DOC_LOWER_THIRD.bottom,
        opacity,
        transform: `translateX(${bar.toFixed(1)}px)`,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: "22px 48px 22px 32px",
        borderLeft: `7px solid ${color}`,
        background: `linear-gradient(90deg, ${alpha(theme.color.void, 92)}, ${alpha(theme.color.void, 48)})`,
        boxShadow: `0 18px 46px ${alpha(theme.color.void, 60)}`,
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        style={{
          fontFamily: theme.font.display,
          fontSize: 70,
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: "-1.6px",
          textTransform: "uppercase",
          color: theme.color.text,
          transform: `translateX(${namePose.toFixed(1)}px)`,
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontFamily: theme.font.body,
          fontSize: 30,
          fontWeight: 600,
          letterSpacing: 3.5,
          textTransform: "uppercase",
          color,
          transform: `translateX(${rolePose.toFixed(1)}px)`,
        }}
      >
        {role}
      </div>
    </div>
  );
};
