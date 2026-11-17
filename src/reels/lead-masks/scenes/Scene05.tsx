import React from "react";
import { Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Headline } from "../style/components/Headline";
import { SceneLayout } from "../style/components/SceneLayout";
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
      <SceneLayout
        headline={<Headline label="THE CLUES" line1="NO WOUNDS" line2="NO FIGHT" tone="paper" delay={0} width={580} align="left" size={140} />}
      >
        <Img
          src={staticFile("reels/lead-masks/assets/scene5.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "contain", transform: cam }}
        />
        <Stamp text="NO WOUNDS" delay={chotAt} rotate={-8} size={60} style={{ top: 40, right: 0 }} />
        <Stamp text="NO FIGHT" delay={ladaiAt} rotate={-8} size={60} style={{ top: 140, right: 0 }} />
        <div data-el="hero" data-kind="content" style={{ position: "absolute", left: 0, top: 0, width: "70%", height: "100%" }}>
          <div style={{ position: "absolute", left: 0, top: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            <PropLabel text="EMPTY BOTTLE" at={bottleAt} rotate={0} size={22} from="left" dist={170} />
            <PropLabel
              text="TWO WET TOWELS"
              at={towelAt}
              rotate={0}
              size={22}
              background={C.paperDeep}
              from="left"
              dist={90}
            />
            <PropLabel text="NOTEBOOK" at={notebookAt} rotate={0} size={22} from="left" dist={170} />
          </div>
        </div>
      </SceneLayout>
    </ScreenShake>
  );
};
