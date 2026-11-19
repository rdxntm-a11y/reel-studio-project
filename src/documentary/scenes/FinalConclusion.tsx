import { interpolate } from "remotion";
import { CLAMP, ease } from "../motion";
import { alpha } from "../theme";
import { Headline } from "../components/Headline";
import { SceneFrame } from "../components/SceneFrame";
import type { ConclusionScene, SceneComponent } from "../types";

export const FinalConclusion: SceneComponent<ConclusionScene> = ({ scene, theme, localFrame: frame, duration, timeline, from }) => (
  <SceneFrame
    id={scene.id}
    theme={theme}
    frame={frame}
    duration={duration}
    from={from}
    words={timeline.words}
    kicker={scene.kicker ?? "THE CONCLUSION"}
    chapter="11 / 12"
    signature="rail"
    variant="split"
    backgroundImage={scene.image}
    camera="push"
    cameraStrength={0.3}
    scrim
    transitionIn={scene.transitionIn}
    transitionOut={scene.transitionOut}
  >
    <div style={{ position: "absolute", left: 20, top: 160, width: 940 }}>
      <Headline text={scene.statement} theme={theme} frame={frame} fps={30} at={8} size={96} variant="mask" maxWidth={940} lineHeight={1.02} />
      <div style={{ width: interpolate(frame, [12, 34], [0, 420], CLAMP), height: 5, background: theme.color.accent, marginTop: 38 }} />
    </div>
    <div style={{ position: "absolute", right: 20, top: 180, width: 620, display: "flex", flexDirection: "column", gap: 26 }}>
      {(scene.points ?? []).map((point, index) => {
        const at = 18 + index * 12;
        const rise = ease(frame, at, 16, 36, 0);
        return (
          <div
            key={`${point}-${index}`}
            style={{
              display: "flex",
              gap: 22,
              opacity: interpolate(frame, [at, at + 14], [0, 1], CLAMP),
              transform: `translateY(${rise.toFixed(1)}px)`,
              paddingBottom: 22,
              borderBottom: `1px solid ${alpha(theme.color.muted, 38)}`,
            }}
          >
            <span style={{ fontFamily: theme.font.type, fontSize: 22, color: theme.color.accent }}>{String(index + 1).padStart(2, "0")}</span>
            <span style={{ fontFamily: theme.font.body, fontSize: 28, lineHeight: 1.4, color: theme.color.text }}>{point}</span>
          </div>
        );
      })}
    </div>
    <div style={{ position: "absolute", left: 20, bottom: 40, fontFamily: theme.font.type, fontSize: 20, letterSpacing: 3, color: theme.color.faint }}>
      END OF INVESTIGATION / QUESTIONS REMAIN
    </div>
  </SceneFrame>
);
