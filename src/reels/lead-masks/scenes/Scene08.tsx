import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { useBrand } from "../../../brand-context";
import { PaperBackground } from "../style/components/PaperBackground";
import { Headline } from "../style/components/Headline";
import { Stamp } from "../style/components/Stamp";
import { PropLabel, ScreenShake } from "../style/components/ui";
import { alpha, C, FONT, SPRING, clamp } from "../style/theme";
import { camera } from "../style/motion";
import type { SceneProps } from "../style/types";

// "Theory: dono scientific spiritualists the. UFO ke liye mask pehne, overdose ho gaya."
// Camera tilts up to the UFO, then the "OVERDOSE" twist slams.
export const Scene08Theory: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const theoryAt = t.at(106) - from;
  const spirAt = t.at(109) - from;
  const ufoAt = t.at(111) - from;
  const odAt = t.at(116) - from;

  const cam = camera(frame, [
    { at: 0, scale: 1.06, y: 40, x: 0 },
    { at: ufoAt, scale: 1.1, y: -50, x: 0 },
    { at: odAt, scale: 1.14, y: -104, x: 0 },
    { at: durationInFrames, scale: 1.16, y: -116, x: 0 },
  ]);

  const believers = spring({ frame: frame - spirAt, fps, config: SPRING.pop });

  return (
    <ScreenShake at={[theoryAt + 3, odAt + 3]}>
      <AbsoluteFill>
        <Img
          src={staticFile("reels/lead-masks/assets/scene8-theory.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: cam }}
        />
        <Headline label="THE THEORY" line1="SIGNAL OR" line2="OVERDOSE" tone="paper" delay={0} width={620} align="left" size={146} />
        <Stamp text="THEORY" center delay={theoryAt} rotate={-8} size={82} style={{ top: 682 }} />
        <Stamp text="OVERDOSE" center delay={odAt} rotate={5} size={86} style={{ top: 874 }} />

        <div
          data-el="hero"
          data-kind="content"
          style={{ position: "absolute", left: 60, top: 1010, width: 900, height: 290, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}
        >
          <PropLabel text="UFO" at={ufoAt} rotate={2} from="top" dist={90} />
          <div
            style={{
              opacity: believers,
              transform: `translateY(${interpolate(believers, [0, 1], [40, 0], clamp)}px)`,
            }}
          >
            <PropLabel text="SCIENTIFIC SPIRITUALISTS" at={spirAt} rotate={-2} size={26} from="left" dist={200} />
          </div>
        </div>
      </AbsoluteFill>
    </ScreenShake>
  );
};

const torn =
  "polygon(0 3%, 4% 0, 8% 3%, 12% 0, 16% 3%, 20% 0, 24% 3%, 28% 0, 32% 3%, 36% 0, 40% 3%, 44% 0, 48% 3%, 52% 0, 56% 3%, 60% 0, 64% 3%, 68% 0, 72% 3%, 76% 0, 80% 3%, 84% 0, 88% 3%, 92% 0, 96% 3%, 100% 0, 100% 100%, 0 100%)";

export const Scene08CTA: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { handle } = useBrand();
  const followAt = t.at(119) - from;
  const s = spring({ frame: frame - 0, fps, config: SPRING.pop });
  const y = interpolate(s, [0, 1], [80, 0], clamp);

  return (
    <ScreenShake at={[followAt + 3]} amount={1.8}>
      <AbsoluteFill>
        <PaperBackground tone="paper" seed={72} />
        <div
          data-el="endcard"
          data-kind="content"
          style={{
            position: "absolute",
            left: 160,
            top: 720,
            width: 760,
            height: 560,
            containerType: "inline-size",
            transform: `translateY(${y}px) rotate(-1deg)`,
            opacity: s,
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              background: C.paperLight,
              border: `5px solid ${C.ink}`,
              boxShadow: `0 18px 0 ${alpha(C.ink, 20)}`,
              clipPath: torn,
              padding: "54px 50px",
              boxSizing: "border-box",
            }}
          >
            <div style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 28, letterSpacing: 4, color: C.inkSoft }}>
              MORE REAL CASES
            </div>
            <div style={{ fontFamily: FONT.display, fontSize: "clamp(64px, 12.1cqi, 92px)", lineHeight: 0.95, color: C.ink, marginTop: 12 }}>
              THAT KEEP YOU
              <br />
              UP AT NIGHT
            </div>
            <div style={{ marginTop: 20, fontFamily: FONT.body, fontWeight: 800, fontSize: 34, color: C.ink }}>
              {handle}
            </div>
            <Stamp text="FOLLOW" center delay={followAt} rotate={-8} size={62} bleed={false} style={{ top: 348 }} />
          </div>
        </div>
      </AbsoluteFill>
    </ScreenShake>
  );
};
