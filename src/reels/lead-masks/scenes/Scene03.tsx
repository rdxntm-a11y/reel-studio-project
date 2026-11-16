import React from "react";
import { AbsoluteFill, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Headline } from "../style/components/Headline";
import { Stamp } from "../style/components/Stamp";
import { PropLabel, ScreenShake } from "../style/components/ui";
import { Clock } from "../style/components/Props";
import { C, SPRING, clamp } from "../style/theme";
import { camera } from "../style/motion";
import type { SceneProps } from "../style/types";

// "17 August, Niterói. Bar mein paani."  The date stamp slams on "August".
export const Scene03Clock: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const augAt = t.at(22) - from;
  const barAt = t.at(24) - from;

  const cam = camera(frame, [
    { at: 0, scale: 1.02, y: 0, x: 0 },
    { at: barAt, scale: 1.16, y: -22, x: -12 },
    { at: durationInFrames, scale: 1.2, y: -32, x: -16 },
  ]);

  return (
    <ScreenShake at={[augAt + 3]}>
      <AbsoluteFill>
        <Img
          src={staticFile("reels/lead-masks/assets/scene3-clock.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: cam }}
        />
        <Headline label="THE NIGHT" line1="AUGUST" line2="17TH" tone="dark" delay={0} width={580} align="left" size={160} />
        <Stamp text="17 AUGUST" center delay={augAt} rotate={-6} size={66} style={{ top: 700 }} />
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
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <PropLabel text="BAR IN NITERÓI" at={barAt} rotate={-1} from="left" dist={150} />
        </div>
      </AbsoluteFill>
    </ScreenShake>
  );
};

// "Waitress ne kaha Miguel nervous tha, baar baar ghadi dekh raha tha."
// Pan from the waitress to Miguel, then the watch reveals on "ghadi" and starts ticking.
export const Scene03Receipt: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const waitressAt = t.at(27) - from;
  const migAt = t.at(30) - from;
  const ghadiAt = t.at(35) - from;
  const dekhAt = t.at(36) - from;

  const cam = camera(frame, [
    { at: 0, scale: 1.1, y: 0, x: 46 },
    { at: migAt, scale: 1.08, y: 0, x: -44 },
    { at: ghadiAt, scale: 1.22, y: -40, x: -96 },
    { at: durationInFrames, scale: 1.24, y: -48, x: -104 },
  ]);

  return (
    <AbsoluteFill>
      <Img
        src={staticFile("reels/lead-masks/assets/scene3-receipt.jpg")}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: cam }}
      />
      <Headline label="THE WITNESS" line1="NERVOUS" line2="WAITING" tone="dark" delay={0} width={620} align="left" size={160} />
      <div
        data-el="hero"
        data-kind="content"
        style={{ position: "absolute", left: 60, top: 760, width: 900, height: 520 }}
      >
        <div style={{ position: "absolute", left: 0, bottom: 0 }}>
          <PropLabel text="WAITRESS" at={waitressAt} rotate={-2} background={C.paperDeep} from="left" dist={150} />
        </div>
        <div style={{ position: "absolute", left: 220, bottom: 0 }}>
          <PropLabel text="MIGUEL" at={migAt} rotate={2} from="bottom" dist={90} />
        </div>

        {/* the watch slides in from the right on "ghadi" and ticks */}
        <Sequence from={ghadiAt} layout="none">
          <WatchReveal labelAt={dekhAt - ghadiAt} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

const WatchReveal: React.FC<{ labelAt: number }> = ({ labelAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: SPRING.pop });
  const tick = Math.floor(frame) % 60;
  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        width: 300,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        opacity: s,
        transform: `translateX(${interpolate(s, [0, 1], [180, 0], clamp)}px) scale(${interpolate(s, [0, 1], [0.7, 1], clamp)})`,
      }}
    >
      <Clock second={tick} minute={24} width={260} />
      <PropLabel text="CHECKING WATCH" at={labelAt} rotate={-2} size={22} from="right" dist={90} />
    </div>
  );
};
