import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Headline } from "../style/components/Headline";
import { Stamp } from "../style/components/Stamp";
import { PropLabel, ScreenShake } from "../style/components/ui";
import { C } from "../style/theme";
import { camera } from "../style/motion";
import type { SceneProps } from "../style/types";

// "Koi chot nahi. Koi ladai nahi. Khaali bottle, do geele towel, ek notebook."
// Two hard "NO ..." stamps, then the three clues slide in from three edges.
export const Scene05: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const chotAt = t.at(60) - from;
  const ladaiAt = t.at(63) - from;
  const bottleAt = t.at(66) - from;
  const towelAt = t.at(69) - from;
  const notebookAt = t.at(71) - from;

  const cam = camera(frame, [
    { at: 0, scale: 1.02, y: 0, x: 0 },
    { at: notebookAt, scale: 1.12, y: -10, x: 0 },
    { at: durationInFrames, scale: 1.15, y: -18, x: 0 },
  ]);

  return (
    <ScreenShake at={[chotAt + 3, ladaiAt + 3]}>
      <AbsoluteFill>
        <Img
          src={staticFile("reels/lead-masks/assets/scene5.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: cam }}
        />
        <Headline label="THE CLUES" line1="NO WOUNDS" line2="NO FIGHT" tone="dark" delay={0} width={580} align="left" size={140} />
        <Stamp text="NO WOUNDS" center delay={chotAt} rotate={-5} size={72} style={{ top: 680 }} />
        <Stamp text="NO FIGHT" center delay={ladaiAt} rotate={4} size={72} style={{ top: 862 }} />

        <div
          data-el="hero"
          data-kind="content"
          style={{
            position: "absolute",
            left: 60,
            top: 1010,
            width: 900,
            height: 290,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <PropLabel text="EMPTY BOTTLE" at={bottleAt} rotate={-2} size={20} from="left" dist={170} />
          <PropLabel
            text="TWO WET TOWELS"
            at={towelAt}
            rotate={1}
            size={20}
            background={C.paperDeep}
            from="bottom"
            dist={90}
          />
          <PropLabel text="NOTEBOOK" at={notebookAt} rotate={-1} size={20} from="right" dist={170} />
        </div>
      </AbsoluteFill>
    </ScreenShake>
  );
};
