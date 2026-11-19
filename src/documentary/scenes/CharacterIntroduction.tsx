import { interpolate } from "remotion";
import { CLAMP, ease } from "../motion";
import { alpha } from "../theme";
import { LowerThird } from "../components/LowerThird";
import { PhotoPlate } from "../components/Plate";
import { SceneFrame } from "../components/SceneFrame";
import type { CharacterScene, SceneComponent } from "../types";

export const CharacterIntroduction: SceneComponent<CharacterScene> = ({ scene, theme, localFrame: frame, duration, timeline, from }) => {
  const nameRise = ease(frame, 4, 18, 34, 0);
  const roleRise = ease(frame, 10, 18, 24, 0);
  return (
  <SceneFrame
    id={scene.id}
    theme={theme}
    frame={frame}
    duration={duration}
    from={from}
    words={timeline.words}
    kicker={scene.kicker ?? "PERSON OF INTEREST"}
    chapter="05 / 12"
    signature="rail"
    variant="void"
    transitionIn={scene.transitionIn}
    transitionOut={scene.transitionOut}
  >
    {scene.image ? (
      <PhotoPlate
        src={scene.image}
        theme={theme}
        frame={frame}
        duration={duration}
        x={1010}
        y={86}
        width={690}
        height={790}
        move="driftUp"
        treatment="photo"
        rotate={1.2}
        label="SUBJECT / ARCHIVE"
        gid={`portrait-${scene.id}`}
      />
    ) : null}
    <div style={{ position: "absolute", left: 20, top: 116, width: 900 }}>
      <div style={{ width: 90, height: 5, background: theme.color.accent, marginBottom: 30 }} />
      <div
        style={{
          fontFamily: theme.font.display,
          fontSize: 122,
          fontWeight: 700,
          lineHeight: 0.92,
          textTransform: "uppercase",
          color: theme.color.text,
          opacity: interpolate(frame, [4, 20], [0, 1], CLAMP),
          transform: `translateY(${nameRise.toFixed(1)}px)`,
        }}
      >
        {scene.name}
      </div>
      <div
        style={{
          marginTop: 18,
          fontFamily: theme.font.body,
          fontSize: 30,
          fontWeight: 600,
          color: theme.color.accent,
          letterSpacing: 1,
          opacity: interpolate(frame, [10, 26], [0, 1], CLAMP),
          transform: `translateY(${roleRise.toFixed(1)}px)`,
        }}
      >
        {scene.role}
      </div>
      {scene.years ? (
        <div style={{ marginTop: 10, fontFamily: theme.font.type, fontSize: 23, letterSpacing: 3, color: theme.color.faint }}>
          {scene.years}
        </div>
      ) : null}
      <div style={{ marginTop: 46, display: "flex", flexDirection: "column", gap: 16 }}>
        {(scene.facts ?? []).map((fact, index) => (
          <div
            key={`${fact}-${index}`}
            style={{
              display: "flex",
              gap: 18,
              alignItems: "baseline",
              fontFamily: theme.font.body,
              fontSize: 26,
              lineHeight: 1.35,
              color: theme.color.muted,
              opacity: interpolate(frame, [16 + index * 8, 28 + index * 8], [0, 1], CLAMP),
            }}
          >
            <span style={{ color: theme.color.accent, fontFamily: theme.font.type, fontSize: 20 }}>{String(index + 1).padStart(2, "0")}</span>
            <span>{fact}</span>
          </div>
        ))}
      </div>
      {scene.quote ? (
        <div
          style={{
            marginTop: 40,
            maxWidth: 760,
            padding: "18px 24px",
            borderLeft: `3px solid ${theme.color.signal}`,
            fontFamily: theme.font.type,
            fontSize: 25,
            lineHeight: 1.5,
            color: theme.color.text,
            background: alpha(theme.color.void, 55),
            opacity: interpolate(frame, [36, 50], [0, 1], CLAMP),
          }}
        >
          “{scene.quote}”
        </div>
      ) : null}
    </div>
    <LowerThird name={scene.name} role={scene.role} theme={theme} frame={frame} duration={duration} at={24} accent={theme.color.accent} />
  </SceneFrame>
  );
};
