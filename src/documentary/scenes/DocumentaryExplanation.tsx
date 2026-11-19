import { interpolate } from "remotion";
import { CLAMP, ease } from "../motion";
import { alpha } from "../theme";
import { SceneFrame } from "../components/SceneFrame";
import type { ExplanationScene, SceneComponent } from "../types";

export const DocumentaryExplanation: SceneComponent<ExplanationScene> = ({ scene, theme, localFrame: frame, duration, timeline, from }) => (
  <SceneFrame
    id={scene.id}
    theme={theme}
    frame={frame}
    duration={duration}
    from={from}
    words={timeline.words}
    kicker={scene.kicker ?? "HOW IT WORKS"}
    chapter="08 / 12"
    signature="rule"
    variant="split"
    transitionIn={scene.transitionIn}
    transitionOut={scene.transitionOut}
  >
    <div
      style={{
        position: "absolute",
        left: 10,
        top: 46,
        fontFamily: theme.font.display,
        fontSize: 84,
        fontWeight: 700,
        textTransform: "uppercase",
        color: theme.color.text,
        opacity: interpolate(frame, [2, 16], [0, 1], CLAMP),
      }}
    >
      {scene.headline}
    </div>
    <div style={{ position: "absolute", left: 10, right: 10, top: 300, height: 1, background: alpha(theme.color.muted, 40) }} />
    <div style={{ position: "absolute", left: 10, right: 10, top: 700, height: 1, background: alpha(theme.color.muted, 40) }} />
    <div style={{ position: "absolute", left: 10, right: 10, top: 298, display: "flex", gap: 28 }}>
      {scene.steps.map((step, index) => {
        const at = step.at ?? 10 + index * 14;
        const rise = ease(frame, at, 18, 60, 0);
        const opacity = interpolate(frame, [at, at + 16], [0, 1], CLAMP);
        const width = ease(frame, at + 4, 22, 0, 100);
        return (
          <div
            key={`${step.index}-${index}`}
            style={{
              flex: 1,
              transform: `translateY(${rise.toFixed(1)}px)`,
              opacity,
              borderTop: `4px solid ${index === 1 ? theme.color.signal : theme.color.accent}`,
              paddingTop: 24,
            }}
          >
            <div style={{ fontFamily: theme.font.display, fontSize: 112, fontWeight: 700, lineHeight: 0.9, color: alpha(theme.color.text, 26) }}>
              {step.index}
            </div>
            <div style={{ marginTop: 18, fontFamily: theme.font.display, fontSize: 44, fontWeight: 700, textTransform: "uppercase", color: theme.color.text }}>
              {step.title}
            </div>
            <div style={{ marginTop: 16, fontFamily: theme.font.body, fontSize: 26, lineHeight: 1.45, color: theme.color.muted }}>
              {step.body}
            </div>
            <div style={{ marginTop: 28, height: 2, width: `${width}%`, background: theme.color.accent }} />
          </div>
        );
      })}
    </div>
  </SceneFrame>
);
