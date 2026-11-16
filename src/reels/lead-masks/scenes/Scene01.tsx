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
import { SPRING, clamp } from "../style/theme";
import type { SceneProps } from "../style/types";

export const Scene01: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const maskAt = t.at(4) - from;
  const bodiesAt = t.at(7) - from;
  const drop = spring({ frame: frame - maskAt, fps, config: SPRING.drop });
  const reveal = spring({ frame: frame - bodiesAt, fps, config: SPRING.pop });
  const revealY = interpolate(reveal, [0, 1], [80, 0], clamp);
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.05], clamp);

  return (
    <AbsoluteFill>
      <Img
        src={staticFile("reels/lead-masks/assets/scene1.jpg")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />

      <Headline
        text="BRAZIL 1966"
        tone="paper"
        accent={[1]}
        size={190}
        delay={0}
        width={680}
        align="left"
      />
      <Stamp
        text="1966"
        delay={t.at(1) - from}
        rotate={-8}
        size={108}
        style={{ left: 704, top: 238 }}
      />

      <div
        data-el="hero"
        data-kind="content"
        style={{
          position: "absolute",
          left: 60,
          top: 760,
          width: 900,
          height: 560,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 14,
          transform: `translateY(${revealY}px)`,
          opacity: Math.max(reveal, drop),
        }}
      >
        <PropLabel text="TWO VICTIMS" at={bodiesAt} rotate={-2} />
      </div>
    </AbsoluteFill>
  );
};
