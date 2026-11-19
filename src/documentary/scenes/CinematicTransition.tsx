import { interpolate } from "remotion";
import { CLAMP, linearProgress } from "../motion";
import { alpha } from "../theme";
import { SceneFrame } from "../components/SceneFrame";
import type { CinematicTransitionScene, SceneComponent } from "../types";

export const CinematicTransition: SceneComponent<CinematicTransitionScene> = ({ scene, theme, localFrame: frame, duration, timeline, from }) => {
  const p = linearProgress(frame, 0, duration - 1);
  const reveal = interpolate(frame, [0, 16], [0, 1], CLAMP);
  const exit = interpolate(frame, [duration - 16, duration], [1, 0], CLAMP);
  const opacity = Math.min(reveal, exit);

  return (
    <SceneFrame
      id={scene.id}
      theme={theme}
      frame={frame}
      duration={duration}
      from={from}
      words={timeline.words}
      kicker={scene.kicker ?? "CHAPTER BREAK"}
      chapter="10 / 12"
      signature="grid"
      variant="void"
    >
      {scene.mode === "whip" ? (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {Array.from({ length: 7 }, (_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: -600 + p * 2600 - i * 90,
                top: (i * 972) / 7,
                width: 2500,
                height: 972 / 7 + 2,
                background: i % 2 === 0 ? alpha(theme.color.panel, 92) : alpha(theme.color.void, 92),
                transform: "skewX(-18deg)",
              }}
            />
          ))}
        </div>
      ) : null}
      {scene.mode === "iris" ? (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 620,
            height: 620,
            marginLeft: -310,
            marginTop: -310,
            borderRadius: "50%",
            border: `2px solid ${alpha(theme.color.accent, 70)}`,
            transform: `scale(${(0.4 + p * 1.5).toFixed(3)})`,
            boxShadow: `0 0 120px ${alpha(theme.color.accent, 22)}`,
          }}
        />
      ) : null}
      {scene.mode === "slice" ? (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
          {Array.from({ length: 9 }, (_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                background: i % 2 === 0 ? alpha(theme.color.panel, 70) : "transparent",
                transform: `translateX(${((i % 3) - 1) * p * 90}px)`,
              }}
            />
          ))}
        </div>
      ) : null}
      {scene.mode === "match" ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(90deg, transparent 48%, ${alpha(theme.color.text, 14)} 50%, transparent 52%)`,
            opacity: Math.sin(p * Math.PI),
          }}
        />
      ) : null}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: theme.font.type, fontSize: 25, letterSpacing: 8, color: theme.color.accent }}>{theme.channel.name}</div>
          <div
            style={{
              marginTop: 18,
              fontFamily: theme.font.display,
              fontSize: 136,
              fontWeight: 700,
              lineHeight: 0.95,
              textTransform: "uppercase",
              letterSpacing: "-2px",
              color: theme.color.text,
            }}
          >
            {scene.label ?? "To Be Continued"}
          </div>
          <div style={{ width: 420 * p, height: 3, background: theme.color.accent, margin: "34px auto 0" }} />
        </div>
      </div>
    </SceneFrame>
  );
};
