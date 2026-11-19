import { interpolate } from "remotion";
import { CLAMP, ease } from "../motion";
import { alpha } from "../theme";
import { Headline } from "../components/Headline";
import { SceneFrame } from "../components/SceneFrame";
import type { HookScene, SceneComponent } from "../types";

export const CinematicHook: SceneComponent<HookScene> = ({ scene, theme, localFrame: frame, duration, timeline, from }) => {
  const rule = ease(frame, 4, 26, 0, 620);
  const sub = interpolate(frame, [12, 26], [0, 1], CLAMP);
  return (
    <SceneFrame
      id={scene.id}
      theme={theme}
      frame={frame}
      duration={duration}
      from={from}
      words={timeline.words}
      kicker={scene.kicker}
      chapter="01 / 12"
      signature="rail"
      transitionOut={scene.transitionOut}
      backgroundImage={scene.image}
      camera="push"
      cameraStrength={0.75}
      scrim
      imageBrightness={0.86}
      scrimStrength={0.52}
    >
      <div style={{ position: "absolute", left: 34, top: 176, width: 1180 }}>
        <div
          style={{
            display: "inline-block",
            padding: "9px 18px",
            marginBottom: 34,
            border: `1px solid ${alpha(theme.color.accent, 70)}`,
            color: theme.color.accent,
            fontFamily: theme.font.type,
            fontSize: 23,
            letterSpacing: 4,
            textTransform: "uppercase",
            opacity: interpolate(frame, [0, 12], [0, 1], CLAMP),
          }}
        >
          {scene.tag ?? "CASE FILE / OPEN"}
        </div>
        <Headline text={scene.headline} theme={theme} frame={frame} fps={30} at={-15} size={146} variant="mask" maxWidth={1180} />
        <div style={{ width: rule, height: 5, background: theme.color.accent, marginTop: 34 }} />
        {scene.subhead ? (
          <div
            style={{
              marginTop: 28,
              maxWidth: 820,
              fontFamily: theme.font.body,
              fontSize: 33,
              lineHeight: 1.4,
              color: theme.color.muted,
              opacity: sub,
            }}
          >
            {scene.subhead}
          </div>
        ) : null}
      </div>
      <div
        style={{
          position: "absolute",
          right: 10,
          top: 170,
          writingMode: "vertical-rl",
          fontFamily: theme.font.type,
          fontSize: 22,
          letterSpacing: 5,
          color: theme.color.faint,
          opacity: sub,
        }}
      >
        {theme.channel.name} / ARCHIVE 001
      </div>
    </SceneFrame>
  );
};
