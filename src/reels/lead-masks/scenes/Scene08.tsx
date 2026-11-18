import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { useBrand } from "../../../brand-context";
import { PaperBackground } from "../style/components/PaperBackground";
import { Headline } from "../style/components/Headline";
import { SceneLayout } from "../style/components/SceneLayout";
import { Stamp } from "../style/components/Stamp";
import { AtmosphereGlow, PropLabel, ScreenShake } from "../style/components/ui";
import { alpha, C, FONT, SPRING, clamp } from "../style/theme";
import { camera, ease } from "../style/motion";
import type { SceneProps } from "../style/types";

// "Theory: dono scientific spiritualists the. UFO ke liye mask pehne, overdose ho gaya."
// The camera tilts into the sky, a low glow breathes, then OVERDOSE lands the twist.
export const Scene08Theory: React.FC<SceneProps> = ({ t, from, frames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theoryAt = t.at(106) - from;
  const spirAt = t.at(109) - from;
  const ufoAt = t.at(111) - from;
  const odAt = t.at(116) - from;

  const cam = camera(frame, [
    { at: 0, scale: 1.03, y: 34, x: 0 },
    { at: ufoAt, scale: 1.06, y: -30, x: 0 },
    { at: odAt, scale: 1.09, y: -56, x: 0 },
    { at: frames, scale: 1.1, y: -64, x: 0 },
  ]);

  const believers = spring({ frame: frame - spirAt, fps, config: SPRING.pop });

  return (
    <ScreenShake at={[odAt + 3]} amount={1.8}>
      <SceneLayout
        headline={<Headline label="THE THEORY" line1="SIGNAL OR" line2="OVERDOSE" tone="paper" delay={0} width={620} align="left" size={146} variant="split" />}
      >
        <Img
          src={staticFile("reels/lead-masks/assets/scene8-theory.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "contain", transform: cam }}
        />
        <AtmosphereGlow at={ufoAt} top={-60} width={660} height={840} strength={0.17} />
        <Stamp text="THEORY" delay={theoryAt} rotate={-8} size={72} style={{ top: 40, right: 0 }} />
        <Stamp text="OVERDOSE" delay={odAt} rotate={-7} size={72} style={{ bottom: 40, right: 0 }} />
        <div data-el="hero" data-kind="content" style={{ position: "absolute", left: 0, top: 0, width: "70%", height: "100%" }}>
          <div style={{ position: "absolute", left: 0, top: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            <PropLabel text="UFO" at={ufoAt} rotate={0} from="right" dist={90} />
            <div
              style={{
                opacity: believers,
                transform: `translateY(${interpolate(believers, [0, 1], [40, 0], clamp)}px)`,
              }}
            >
              <PropLabel text="SCIENTIFIC SPIRITUALISTS" at={spirAt} rotate={0} size={26} from="left" dist={200} />
            </div>
          </div>
        </div>
      </SceneLayout>
    </ScreenShake>
  );
};

const torn =
  "polygon(0 3%, 4% 0, 8% 3%, 12% 0, 16% 3%, 20% 0, 24% 3%, 28% 0, 32% 3%, 36% 0, 40% 3%, 44% 0, 48% 3%, 52% 0, 56% 3%, 60% 0, 64% 3%, 68% 0, 72% 3%, 76% 0, 80% 3%, 84% 0, 88% 3%, 92% 0, 96% 3%, 100% 0, 100% 100%, 0 100%)";

export const Scene08CTA: React.FC<SceneProps> = ({ t, from, frames }) => {
  const frame = useCurrentFrame();
  const { handle } = useBrand();
  const followAt = t.at(119) - from;
  const enter = ease(frame, 0, 18, 0, 1);
  const hold = Math.min(1, Math.max(0, (frame - 18) / Math.max(1, frames - 18)));
  const y = interpolate(enter, [0, 1], [48, 0], clamp) - hold * 4;
  const rotate = interpolate(enter, [0, 1], [-1.8, -1], clamp) - hold * 0.2;
  const scale = (0.992 + 0.008 * enter) * (1 + 0.012 * hold);

  const kicker = ease(frame, 0, 10, 0.7, 1);
  const title1 = ease(frame, 0, 12, 0.65, 1);
  const title2 = ease(frame, 2, 12, 0.5, 1);
  const handleIn = ease(frame, 4, 10, 0.7, 1);
  const line = (p: number): React.CSSProperties => ({
    display: "block",
    opacity: p,
    transform: `translateY(${(1 - p) * 12}px)`,
  });

  return (
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
          transform: `translateY(${y}px) rotate(${rotate}deg) scale(${scale})`,
          opacity: 1,
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
          <div style={{ opacity: kicker, transform: `translateY(${(1 - kicker) * 10}px)`, fontFamily: FONT.body, fontWeight: 800, fontSize: 28, letterSpacing: 4, color: C.inkSoft }}>
            MORE REAL CASES
          </div>
          <div style={{ fontFamily: FONT.display, fontSize: "clamp(64px, 12.1cqi, 92px)", lineHeight: 0.95, color: C.ink, marginTop: 12 }}>
            <span style={line(title1)}>THAT KEEP YOU</span>
            <span style={line(title2)}>UP AT NIGHT</span>
          </div>
          <div style={{ opacity: handleIn, transform: `translateY(${(1 - handleIn) * 10}px)`, marginTop: 20, fontFamily: FONT.body, fontWeight: 800, fontSize: 34, color: C.ink }}>
            {handle}
          </div>
          <Stamp text="FOLLOW" delay={followAt + 6} rotate={-8} size={62} bleed={false} style={{ top: 320, right: 40 }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
