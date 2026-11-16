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
import { PropLabel } from "../style/components/ui";
import { C, SPRING, clamp } from "../style/theme";
import type { SceneProps } from "../style/types";

export const Scene03Clock: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const stampAt = t.at(21) - from;
  const pop = spring({ frame: frame - 0, fps, config: SPRING.pop });
  const y = interpolate(pop, [0, 1], [100, 0], clamp);
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.05], clamp);

  return (
    <AbsoluteFill>
      <Img
        src={staticFile("reels/lead-masks/assets/scene3-clock.jpg")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />
      <Headline
        text="THE NIGHT"
        tone="dark"
        accent={[1]}
        size={168}
        delay={0}
        width={580}
        align="left"
      />
      <Stamp
        text="17 AUGUST"
        delay={stampAt}
        rotate={-6}
        size={66}
        style={{ left: 570, top: 250 }}
      />
      <div
        data-el="hero"
        data-kind="content"
        style={{
          position: "absolute",
          left: 60,
          top: 720,
          width: 900,
          height: 540,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          transform: `translateY(${y}px)`,
          opacity: pop,
        }}
      >
        <PropLabel text="BAR IN NITERÓI" at={0} rotate={-1} />
      </div>
    </AbsoluteFill>
  );
};

export const Scene03Receipt: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const pop = spring({ frame: frame - 0, fps, config: SPRING.pop });
  const y = interpolate(pop, [0, 1], [100, 0], clamp);
  const figureAt = t.at(30) - from;
  const figure = spring({ frame: frame - figureAt, fps, config: SPRING.pop });
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.05], clamp);

  return (
    <AbsoluteFill>
      <Img
        src={staticFile("reels/lead-masks/assets/scene3-receipt.jpg")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />
      <Headline
        text="NERVOUS"
        tone="dark"
        accent={[0]}
        size={168}
        delay={0}
        width={620}
        align="left"
      />
      <div
        data-el="hero"
        data-kind="content"
        style={{
          position: "absolute",
          left: 60,
          top: 760,
          width: 900,
          height: 520,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 46,
          transform: `translateY(${y}px)`,
          opacity: pop,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 18,
            opacity: figure,
            transform: `translateY(${interpolate(figure, [0, 1], [40, 0], clamp)}px)`,
          }}
        >
          <PropLabel text="WAITRESS" at={0} rotate={-2} background={C.paperDeep} />
          <PropLabel text="MIGUEL" at={figureAt} rotate={2} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
