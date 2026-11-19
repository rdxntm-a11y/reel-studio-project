import { interpolate } from "remotion";
import { CLAMP, EASE, pulse } from "../motion";
import { alpha } from "../theme";
import { SceneFrame } from "../components/SceneFrame";
import type { OutroScene, SceneComponent } from "../types";

export const ProfessionalOutro: SceneComponent<OutroScene> = ({ scene, theme, localFrame: frame, duration, timeline, from }) => {
  const mark = interpolate(frame, [0, 20], [0.34, 1], CLAMP);
  const text = interpolate(frame, [8, 26], [0, 1], CLAMP);
  const cta = interpolate(frame, [24, 42], [0, 1], CLAMP);
  const drift = interpolate(frame, [0, duration], [22, -34], { ...CLAMP, easing: EASE.camera });
  const glow = 54 + pulse(frame, 46) * 34;
  return (
    <SceneFrame
      id={scene.id}
      theme={theme}
      frame={frame}
      duration={duration}
      from={from}
      words={timeline.words}
      kicker="STAY CURIOUS"
      chapter="12 / 12"
      signature="grid"
      variant="void"
      caption={false}
      transitionIn={scene.transitionIn}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateY(${drift.toFixed(1)}px)`,
        }}
      >
        <div style={{ textAlign: "center", width: 1400 }}>
          <div
            style={{
              width: 150,
              height: 150,
              margin: "0 auto 42px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `3px solid ${theme.color.accent}`,
              fontFamily: theme.font.display,
              fontSize: 76,
              fontWeight: 700,
              letterSpacing: -4,
              color: theme.color.accent,
              opacity: mark,
              transform: `scale(${(0.9 + mark * 0.1).toFixed(3)})`,
              boxShadow: `0 0 ${glow.toFixed(1)}px ${alpha(theme.color.accent, 20)}`,
            }}
          >
            {theme.channel.mark}
          </div>
          <div style={{ opacity: text, transform: `translateY(${((1 - text) * 22).toFixed(1)}px)` }}>
            <div style={{ fontFamily: theme.font.display, fontSize: 120, fontWeight: 700, letterSpacing: "-3px", textTransform: "uppercase", color: theme.color.text, textShadow: `0 16px 46px ${alpha(theme.color.void, 78)}` }}>
              {theme.channel.name}
            </div>
            <div style={{ marginTop: 14, fontFamily: theme.font.type, fontSize: 30, letterSpacing: 6, color: theme.color.accent }}>
              {scene.handle ?? theme.channel.handle}
            </div>
          </div>
          <div style={{ marginTop: 58, opacity: cta, transform: `translateY(${((1 - cta) * 18).toFixed(1)}px)` }}>
            <div style={{ width: 320, height: 3, background: theme.color.accent, margin: "0 auto 30px" }} />
            <div style={{ fontFamily: theme.font.body, fontSize: 38, fontWeight: 600, color: theme.color.text }}>
              {scene.cta ?? "Subscribe for the next untold story"}
            </div>
            {scene.next ? (
              <div
                style={{
                  marginTop: 24,
                  display: "inline-block",
                  padding: "16px 30px",
                  border: `1px solid ${alpha(theme.color.muted, 55)}`,
                  fontFamily: theme.font.body,
                  fontSize: 24,
                  color: theme.color.muted,
                }}
              >
                NEXT: {scene.next}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 28, textAlign: "center", fontFamily: theme.font.type, fontSize: 21, letterSpacing: 3, color: theme.color.faint }}>
        ARCHIVE MATERIAL / {theme.channel.name}
      </div>
    </SceneFrame>
  );
};
