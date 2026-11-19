import { interpolate } from "remotion";
import { CLAMP, ease } from "../motion";
import { alpha } from "../theme";
import { AnnotationPin, DocumentPlate, PhotoPlate } from "../components/Plate";
import { SceneFrame } from "../components/SceneFrame";
import type { EvidenceScene, SceneComponent } from "../types";

export const EvidencePresentation: SceneComponent<EvidenceScene> = ({ scene, theme, localFrame: frame, duration, timeline, from }) => {
  const header = ease(frame, 6, 16, -80, 0);
  return (
    <SceneFrame
      id={scene.id}
      theme={theme}
      frame={frame}
      duration={duration}
      from={from}
      words={timeline.words}
      kicker={scene.kicker ?? "EXHIBIT REVIEW"}
      chapter="06 / 12"
      signature="corner"
      variant="deep"
      transitionIn={scene.transitionIn}
      transitionOut={scene.transitionOut}
    >
      <div style={{ position: "absolute", left: 10, top: 40, transform: `translateX(${header.toFixed(1)}px)`, opacity: interpolate(frame, [6, 20], [0, 1], CLAMP) }}>
        <div style={{ fontFamily: theme.font.type, fontSize: 24, letterSpacing: 5, color: theme.color.danger }}>{scene.exhibit}</div>
        <div style={{ fontFamily: theme.font.display, fontSize: 68, fontWeight: 700, textTransform: "uppercase", color: theme.color.text }}>{scene.label}</div>
      </div>
      <DocumentPlate
        title="ARCHIVE TRANSCRIPT / EXTRACT"
        lines={["SUBJECT: UNVERIFIED", "SOURCE: THIRD PARTY", "DATE: REDACTED", "STATUS: CORROBORATED"]}
        theme={theme}
        frame={frame}
        at={12}
        x={60}
        y={170}
        width={690}
        height={690}
        rotate={-1.5}
        stamp="REDACTED"
        gid={`doc-${scene.id}`}
      />
      <PhotoPlate
        src={scene.image}
        theme={theme}
        frame={frame}
        duration={duration}
        x={930}
        y={200}
        width={650}
        height={600}
        move="panLeft"
        treatment={scene.treatment === "document" ? "warm" : "photo"}
        rotate={1.8}
        label="ORIGINAL / ARCHIVE"
        gid={`ev-${scene.id}`}
      />
      {(scene.annotations ?? []).map((annotation, index) => (
        <AnnotationPin
          key={`${annotation.text}-${index}`}
          x={930 + annotation.x * 650}
          y={200 + annotation.y * 600}
          text={annotation.text}
          theme={theme}
          frame={frame}
          at={30 + index * 8}
        />
      ))}
      {scene.note ? (
        <div
          style={{
            position: "absolute",
            right: 12,
            bottom: 54,
            maxWidth: 640,
            fontFamily: theme.font.body,
            fontSize: 26,
            lineHeight: 1.45,
            color: theme.color.muted,
            opacity: interpolate(frame, [40, 54], [0, 1], CLAMP),
          }}
        >
          {scene.note}
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 60, bottom: 54, width: 690, height: 1, background: alpha(theme.color.muted, 40) }} />
    </SceneFrame>
  );
};
