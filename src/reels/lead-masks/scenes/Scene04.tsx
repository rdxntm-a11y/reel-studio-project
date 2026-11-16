import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Headline } from "../style/components/Headline";
import { Stamp } from "../style/components/Stamp";
import { PropLabel, ScreenShake, Tag } from "../style/components/ui";
import { C, SPRING, clamp } from "../style/theme";
import { camera } from "../style/motion";
import type { SceneProps } from "../style/types";

// "Teen din baad ek ladka patang uda raha tha. Usko do laashe mile."
// Camera holds on the kite, then on "teen din baad" it pans DOWN to reveal the bodies,
// and the "3 DAYS LATER" stamp slams on that same word.
export const Scene04Discovery: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const baadAt = t.at(41) - from;
  const ladkaAt = t.at(43) - from;
  const patangAt = t.at(44) - from;
  const laasheAt = t.at(50) - from;
  const mileAt = t.at(51) - from;

  const cam = camera(frame, [
    { at: 0, scale: 1.18, y: 170, x: 0 },
    { at: baadAt, scale: 1.16, y: 170, x: 0 },
    { at: baadAt + 45, scale: 1.08, y: -60, x: 0 },
    { at: mileAt, scale: 1.03, y: -120, x: 0 },
    { at: durationInFrames, scale: 1.0, y: -130, x: 0 },
  ]);

  const bodies = spring({ frame: frame - laasheAt, fps, config: SPRING.pop });

  return (
    <ScreenShake at={[baadAt + 3, laasheAt + 3]}>
      <AbsoluteFill>
        <Img
          src={staticFile("reels/lead-masks/assets/scene4-discovery.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: cam }}
        />
        <Headline text="THE DISCOVERY" tone="paper" accent={[1]} size={142} delay={0} width={620} align="left" />
        <Stamp text="3 DAYS LATER" center delay={baadAt} rotate={4} size={60} style={{ top: 700 }} />

        <div
          data-el="hero"
          data-kind="content"
          style={{ position: "absolute", left: 60, top: 760, width: 900, height: 520 }}
        >
          <div style={{ position: "absolute", right: 0, top: 0 }}>
            <PropLabel text="KITE" at={patangAt} rotate={-2} from="top" dist={90} />
          </div>
          <div style={{ position: "absolute", left: 0, top: 120 }}>
            <PropLabel text="KITE BOY" at={ladkaAt} rotate={1} background={C.paperDeep} from="left" dist={150} />
          </div>
          {/* the bodies drop in as the camera lands on them */}
          <div
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 12,
              opacity: bodies,
              transform: `translateY(${interpolate(bodies, [0, 1], [70, 0], clamp)}px)`,
            }}
          >
            <PropLabel text="TWO BODIES" at={laasheAt} rotate={-1} from="bottom" dist={70} />
            <Tag text="FOUND" rotate={2} size={24} />
          </div>
        </div>
      </AbsoluteFill>
    </ScreenShake>
  );
};

// "Formal suit, waterproof coat, sisa ki mask."
// The outfit is named item by item; the lead mask slams as the payoff.
export const Scene04Bodies: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const suitAt = t.at(53) - from;
  const coatAt = t.at(55) - from;
  const maskAt = t.at(58) - from;

  const cam = camera(frame, [
    { at: 0, scale: 1.04, y: 0, x: 0 },
    { at: maskAt, scale: 1.14, y: -14, x: 0 },
    { at: durationInFrames, scale: 1.18, y: -22, x: 0 },
  ]);

  return (
    <ScreenShake at={[maskAt + 3]}>
      <AbsoluteFill>
        <Img
          src={staticFile("reels/lead-masks/assets/scene4-bodies.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: cam }}
        />
        <Headline text="THE OUTFIT" tone="paper" accent={[1]} size={150} delay={0} width={600} align="left" />
        <Stamp text="LEAD MASK" center delay={maskAt} rotate={-6} size={72} style={{ top: 700 }} />

        <div
          data-el="hero"
          data-kind="content"
          style={{
            position: "absolute",
            left: 60,
            top: 800,
            width: 900,
            height: 480,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 24,
          }}
        >
          <PropLabel text="THE VICTIMS" at={0} rotate={-1} from="bottom" dist={80} />
          <div style={{ display: "flex", gap: 22, flexWrap: "wrap", justifyContent: "center" }}>
            <PropLabel text="FORMAL SUIT" at={suitAt} rotate={-3} from="left" dist={160} />
            <PropLabel
              text="WATERPROOF COAT"
              at={coatAt}
              rotate={2}
              background={C.paperDeep}
              from="right"
              dist={160}
            />
          </div>
        </div>
      </AbsoluteFill>
    </ScreenShake>
  );
};
