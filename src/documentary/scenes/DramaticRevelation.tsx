import { interpolate } from "remotion";
import { CLAMP, pulse, stampPose } from "../motion";
import { alpha } from "../theme";
import { Headline } from "../components/Headline";
import { SceneFrame } from "../components/SceneFrame";
import type { RevelationScene, SceneComponent } from "../types";

export const DramaticRevelation: SceneComponent<RevelationScene> = ({ scene, theme, localFrame: frame, duration, timeline, from }) => {
  const ring = interpolate(frame, [8, 58], [0.4, 2.6], CLAMP);
  const ringOpacity = interpolate(frame, [8, 58], [0.5, 0], CLAMP);
  const stamp = stampPose(frame, 30, scene.stamp ? 26 : 999);
  return (
    <SceneFrame
      id={scene.id}
      theme={theme}
      frame={frame}
      duration={duration}
      from={from}
      words={timeline.words}
      kicker={scene.kicker ?? "THE REVELATION"}
      chapter="09 / 12"
      signature="corner"
      variant="void"
      transitionIn={scene.transitionIn}
      transitionOut={scene.transitionOut}
      backgroundImage={scene.image}
      camera="pull"
      cameraStrength={0.55}
      scrim
    >
      <div
        style={{
          position: "absolute",
          left: 830,
          top: 480,
          width: 520,
          height: 520,
          marginLeft: -260,
          marginTop: -260,
          borderRadius: "50%",
          border: `2px solid ${alpha(theme.color.accent, ringOpacity * 100)}`,
          transform: `scale(${ring.toFixed(3)})`,
        }}
      />
      <div style={{ position: "absolute", left: 60, top: 210, width: 1560 }}>
        <Headline text={scene.headline} theme={theme} frame={frame} fps={30} at={6} size={158} variant="stamp" maxWidth={1560} align="center" />
        <div
          style={{
            width: 160,
            height: 4,
            background: theme.color.accent,
            margin: "40px auto 0",
            opacity: interpolate(frame, [30, 42], [0, 1], CLAMP),
          }}
        />
        {scene.support ? (
          <div
            style={{
              margin: "28px auto 0",
              maxWidth: 950,
              textAlign: "center",
              fontFamily: theme.font.body,
              fontSize: 32,
              lineHeight: 1.45,
              color: theme.color.muted,
              opacity: interpolate(frame, [38, 52], [0, 1], CLAMP),
            }}
          >
            {scene.support}
          </div>
        ) : null}
      </div>
      {scene.stamp ? (
        <div
          style={{
            position: "absolute",
            right: 120,
            top: 700,
            transform: `rotate(-8deg) scale(${stamp.scale.toFixed(3)}) translateX(${stamp.shake.toFixed(1)}px)`,
            opacity: stamp.opacity,
            padding: "14px 26px",
            border: `5px solid ${theme.color.danger}`,
            color: theme.color.danger,
            fontFamily: theme.font.display,
            fontSize: 48,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          {scene.stamp}
        </div>
      ) : null}
      <div style={{ position: "absolute", right: 0, bottom: 40, fontFamily: theme.font.type, fontSize: 21, color: theme.color.faint, opacity: 0.5 + pulse(frame, 40) * 0.4 }}>
        UNTOLD / CONFIRMED
      </div>
    </SceneFrame>
  );
};
