import { interpolate } from "remotion";
import { CLAMP, ease } from "../motion";
import { alpha } from "../theme";
import { Headline } from "../components/Headline";
import { SceneFrame } from "../components/SceneFrame";
import type { IntroScene, SceneComponent } from "../types";

export const StoryIntroduction: SceneComponent<IntroScene> = ({ scene, theme, localFrame: frame, duration, timeline, from }) => {
  const ghost = interpolate(frame, [4, 44], [0.05, 0.11], CLAMP);
  const ghostX = interpolate(frame, [0, duration], [0, -70], CLAMP);
  return (
    <SceneFrame
      id={scene.id}
      theme={theme}
      frame={frame}
      duration={duration}
      from={from}
      words={timeline.words}
      kicker={scene.kicker ?? "THE PREMISE"}
      chapter="02 / 12"
      signature="grid"
      variant="split"
      transitionIn={scene.transitionIn}
      transitionOut={scene.transitionOut}
    >
      {scene.year ? (
        <div
          style={{
            position: "absolute",
            right: -40,
            top: -110,
            fontFamily: theme.font.display,
            fontSize: 560,
            fontWeight: 700,
            lineHeight: 1,
            color: alpha(theme.color.text, ghost * 100),
            transform: `translateX(${ghostX.toFixed(1)}px)`,
          }}
        >
          {scene.year}
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 20, top: 120, width: 940 }}>
        <Headline text={scene.question} theme={theme} frame={frame} fps={30} at={6} size={96} variant="rise" maxWidth={920} lineHeight={1.02} />
        <div
          style={{
            marginTop: 34,
            paddingLeft: 24,
            borderLeft: `3px solid ${theme.color.accent}`,
            maxWidth: 760,
            fontFamily: theme.font.body,
            fontSize: 29,
            lineHeight: 1.5,
            color: theme.color.muted,
            opacity: interpolate(frame, [28, 44], [0, 1], CLAMP),
          }}
        >
          {scene.context}
        </div>
      </div>
      <div style={{ position: "absolute", right: 20, bottom: 170, width: 540, display: "flex", flexDirection: "column", gap: 18 }}>
        {(scene.facts ?? []).map((fact, index) => {
          const at = 18 + index * 10;
          const width = ease(frame, at, 18, 0, 440);
          return (
            <div key={`${fact.label}-${index}`} style={{ opacity: interpolate(frame, [at, at + 12], [0, 1], CLAMP) }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
                <span style={{ fontFamily: theme.font.display, fontSize: 56, fontWeight: 700, color: theme.color.text }}>{fact.value}</span>
                <span style={{ fontFamily: theme.font.body, fontSize: 22, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: theme.color.accent }}>{fact.label}</span>
              </div>
              <div style={{ width, height: 1, background: alpha(theme.color.muted, 55), marginTop: 8 }} />
            </div>
          );
        })}
      </div>
    </SceneFrame>
  );
};
