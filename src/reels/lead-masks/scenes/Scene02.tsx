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

export const Scene02: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const kitAt = t.at(11) - from;
  const stampAt = t.at(12) - from;
  const officeAt = t.at(17) - from;
  const pop = spring({ frame: frame - kitAt, fps, config: SPRING.pop });
  const y = interpolate(pop, [0, 1], [120, 0], clamp);
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.05], clamp);

  return (
    <AbsoluteFill>
      <Img
        src={staticFile("reels/lead-masks/assets/scene2.jpg")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />
      <Headline
        text="MANOEL + MIGUEL"
        tone="paper"
        accent={[2]}
        size={128}
        delay={0}
        width={600}
        align="left"
      />
      <Stamp
        text="TECHNICIANS"
        delay={stampAt}
        rotate={5}
        size={58}
        style={{ left: 548, top: 238 }}
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
          alignItems: "center",
          justifyContent: "flex-end",
          flexDirection: "column",
          gap: 20,
          transform: `translateY(${y}px)`,
          opacity: pop,
        }}
      >
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", justifyContent: "center" }}>
          <PropLabel text="TOOL KIT" at={stampAt} rotate={-3} />
          <PropLabel
            text="SAID: OFFICE WORK"
            at={officeAt}
            rotate={2}
            background={C.paperDeep}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
