import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Headline } from "../style/components/Headline";
import { Stamp } from "../style/components/Stamp";
import { PropLabel, Tag } from "../style/components/ui";
import { C, SPRING, clamp } from "../style/theme";
import type { SceneProps } from "../style/types";

export const Scene04Discovery: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const stampAt = t.at(39) - from;
  const boyAt = t.at(43) - from;
  const kiteAt = t.at(44) - from;
  const bodiesAt = t.at(49) - from;
  const bodies = spring({ frame: frame - bodiesAt, fps, config: SPRING.pop });
  const boy = spring({ frame: frame - boyAt, fps, config: SPRING.pop });
  const kite = spring({ frame: frame - kiteAt, fps, config: SPRING.pop });
  const y = interpolate(spring({ frame: frame - 0, fps, config: SPRING.pop }), [0, 1], [70, 0], clamp);
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.05], clamp);

  return (
    <AbsoluteFill>
      <Img
        src={staticFile("reels/lead-masks/assets/scene4-discovery.jpg")}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }}
      />
      <Headline text="THE DISCOVERY" tone="paper" accent={[1]} size={142} delay={0} width={620} align="left" />
      <Stamp text="3 DAYS LATER" delay={stampAt} rotate={4} size={60} style={{ left: 520, top: 238 }} />
      <div data-el="hero" data-kind="content" style={{ position: "absolute", left: 60, top: 720, width: 900, height: 560, transform: `translateY(${y}px)` }}>
        <div style={{ position: "absolute", right: 0, top: 0, opacity: kite, transform: `translateY(${interpolate(kite, [0, 1], [-30, 0], clamp)}px)` }}>
          <PropLabel text="KITE" at={kiteAt} rotate={-2} />
        </div>
        <div style={{ position: "absolute", left: 0, bottom: 12, opacity: boy, transform: `translateY(${interpolate(boy, [0, 1], [30, 0], clamp)}px)` }}>
          <PropLabel text="KITE BOY" at={boyAt} rotate={1} background={C.paperDeep} />
        </div>
        <div style={{ position: "absolute", right: 0, bottom: 0, opacity: bodies, transform: `translateY(${interpolate(bodies, [0, 1], [60, 0], clamp)}px)` }}>
          <PropLabel text="TWO BODIES" at={bodiesAt} rotate={-1} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Scene04Bodies: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const suitAt = t.at(53) - from;
  const coatAt = t.at(55) - from;
  const suit = spring({ frame: frame - suitAt, fps, config: SPRING.pop });
  const coat = spring({ frame: frame - coatAt, fps, config: SPRING.pop });
  const pop = spring({ frame: frame - 0, fps, config: SPRING.pop });
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.05], clamp);

  return (
    <AbsoluteFill>
      <Img
        src={staticFile("reels/lead-masks/assets/scene4-bodies.jpg")}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }}
      />
      <Headline text="THE OUTFIT" tone="paper" accent={[1]} size={150} delay={0} width={600} align="left" />
      <div data-el="hero" data-kind="content" style={{ position: "absolute", left: 60, top: 720, width: 900, height: 560, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: 18, opacity: pop }}>
        <PropLabel text="THE VICTIMS" at={0} rotate={-1} />
        <div style={{ display: "flex", gap: 22 }}>
          <div style={{ opacity: suit, transform: `translateY(${interpolate(suit, [0, 1], [24, 0], clamp)}px)` }}>
            <Tag text="FORMAL SUIT" rotate={-3} size={30} />
          </div>
          <div style={{ opacity: coat, transform: `translateY(${interpolate(coat, [0, 1], [24, 0], clamp)}px)` }}>
            <Tag text="WATERPROOF COAT" rotate={2} size={30} background={C.paperDeep} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
