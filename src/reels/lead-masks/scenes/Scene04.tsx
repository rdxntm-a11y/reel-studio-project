import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Headline } from "../style/components/Headline";
import { SceneLayout } from "../style/components/SceneLayout";
import { Stamp } from "../style/components/Stamp";
import { EvidencePlate, PropLabel, ScreenShake, Tag } from "../style/components/ui";
import { alpha, C, FONT, SPRING, clamp } from "../style/theme";
import { camera, ease } from "../style/motion";
import type { SceneProps } from "../style/types";

// "Teen din baad ek ladka patang uda raha tha. Usko do laashe mile."
// A date spine in the headline band makes the jump legible while the camera pans down.
export const Scene04Discovery: React.FC<SceneProps> = ({ t, from, frames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const baadAt = t.at(41) - from;
  const ladkaAt = t.at(43) - from;
  const patangAt = t.at(44) - from;
  const laasheAt = t.at(50) - from;
  const mileAt = t.at(51) - from;

  const cam = camera(frame, [
    { at: 0, scale: 1.12, y: 150, x: 0 },
    { at: baadAt, scale: 1.12, y: 150, x: 0 },
    { at: baadAt + 45, scale: 1.06, y: -40, x: 0 },
    { at: mileAt, scale: 1.02, y: -100, x: 0 },
    { at: frames, scale: 1.0, y: -110, x: 0 },
  ]);

  const bodies = spring({ frame: frame - laasheAt, fps, config: SPRING.pop });

  return (
    <ScreenShake at={[baadAt + 3, laasheAt + 3]}>
      <SceneLayout
        headline={
          <>
            <Headline label="THE DISCOVERY" line1="THREE DAYS" line2="LATER" tone="paper" delay={0} width={620} align="left" size={140} variant="rise" />
            <TimeSpine at={baadAt} />
          </>
        }
      >
        <Img
          src={staticFile("reels/lead-masks/assets/scene4-discovery.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "contain", transform: cam }}
        />
        <Stamp text="3 DAYS LATER" delay={baadAt} rotate={-8} size={54} style={{ top: 40, right: 0 }} />
        <div data-el="hero" data-kind="content" style={{ position: "absolute", left: 0, top: 0, width: "70%", height: "100%" }}>
          <div style={{ position: "absolute", left: 0, top: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            <PropLabel text="KITE BOY" at={ladkaAt} rotate={0} background={C.paperDeep} from="left" dist={150} />
            <PropLabel text="KITE" at={patangAt} rotate={0} from="left" dist={90} />
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 12,
              opacity: bodies,
              transform: `translateY(${interpolate(bodies, [0, 1], [70, 0], clamp)}px)`,
            }}
          >
            <PropLabel text="TWO BODIES" at={laasheAt} rotate={0} from="left" dist={70} />
            <Tag text="FOUND" rotate={0} size={24} />
          </div>
        </div>
      </SceneLayout>
    </ScreenShake>
  );
};

const TimeSpine: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const draw = ease(frame, at, 24, 0, 1);
  const travel = ease(frame, at + 6, 32, 0, 1);
  const lineTop = 16;
  const lineLength = 212;
  return (
    <div style={{ position: "absolute", right: 0, top: 6, width: 210, height: 248, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          right: 20,
          top: lineTop,
          width: 2,
          height: lineLength,
          background: alpha(C.ink, 34),
          transform: `scaleY(${draw})`,
          transformOrigin: "top",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 34,
          top: 0,
          width: 124,
          textAlign: "right",
          fontFamily: FONT.type,
          fontSize: 21,
          letterSpacing: 2,
          color: C.inkSoft,
          opacity: draw,
        }}
      >
        17 AUG
      </div>
      <div
        style={{
          position: "absolute",
          right: 34,
          bottom: 2,
          width: 124,
          textAlign: "right",
          fontFamily: FONT.type,
          fontSize: 21,
          letterSpacing: 2,
          color: C.inkSoft,
          opacity: draw,
        }}
      >
        20 AUG
      </div>
      <div
        style={{
          position: "absolute",
          right: 14,
          top: lineTop + travel * lineLength,
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: C.red,
          boxShadow: `0 0 0 4px ${alpha(C.paper, 80)}`,
          opacity: draw,
        }}
      />
    </div>
  );
};

// "Formal suit, waterproof coat, sisa ki mask."
// The outfit is mounted as an evidence print; the lead mask is the closing stamp.
export const Scene04Bodies: React.FC<SceneProps> = ({ t, from, frames }) => {
  const frame = useCurrentFrame();
  const suitAt = t.at(53) - from;
  const coatAt = t.at(55) - from;
  const maskAt = t.at(58) - from;

  const cam = camera(frame, [
    { at: 0, scale: 1.03, y: 0, x: -6 },
    { at: maskAt, scale: 1.09, y: -4, x: 4 },
    { at: frames, scale: 1.12, y: -10, x: 8 },
  ]);

  return (
    <SceneLayout
      headline={<Headline label="THE SCENE" line1="THE" line2="OUTFIT" tone="paper" delay={0} width={600} align="left" size={150} variant="press" accentRule ruleLength={70} />}
    >
      <EvidencePlate src={staticFile("reels/lead-masks/assets/scene4-bodies.jpg")} transform={cam} rotate={-0.8} at={-5} />
      <Stamp text="LEAD MASK" delay={maskAt} rotate={-7} size={64} style={{ bottom: 36, right: 0 }} />
      <div data-el="hero" data-kind="content" style={{ position: "absolute", left: 0, top: 0, width: "70%", height: "100%" }}>
        <div style={{ position: "absolute", left: 0, top: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <PropLabel text="THE VICTIMS" at={0} rotate={0} from="left" dist={80} />
          <PropLabel text="FORMAL SUIT" at={suitAt} rotate={0} from="left" dist={160} />
          <PropLabel
            text="WATERPROOF COAT"
            at={coatAt}
            rotate={0}
            background={C.paperDeep}
            from="left"
            dist={160}
          />
        </div>
      </div>
    </SceneLayout>
  );
};
