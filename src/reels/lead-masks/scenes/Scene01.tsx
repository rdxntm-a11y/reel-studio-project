import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Headline } from "../style/components/Headline";
import { Stamp } from "../style/components/Stamp";
import { PropLabel, ScreenShake, TextMasks } from "../style/components/ui";
import { C } from "../style/theme";
import { camera } from "../style/motion";
import type { SceneProps } from "../style/types";

// Hook: "Brazil, 1966. Sisa ki mask, aur do laashe."
// We open tight on the lead mask, then pull the camera back to reveal the two bodies.
export const Scene01: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const yearAt = t.at(1) - from;
  const maskAt = t.at(4) - from;
  const doAt = t.at(6) - from;
  const laasheAt = t.at(7) - from;

  const cam = camera(frame, [
    { at: 0, scale: 1.26, y: 84, x: 0 },
    { at: t.at(2) - from, scale: 1.14, y: 8, x: -8 },
    { at: t.at(5) - from, scale: 1.04, y: -24, x: 8 },
    { at: durationInFrames, scale: 1.0, y: -34, x: 0 },
  ]);

  return (
    <ScreenShake at={[yearAt + 3]}>
      <AbsoluteFill>
        <Img
          src={staticFile("reels/lead-masks/assets/scene1.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: cam }}
        />
        <TextMasks tone="paper" />

        <Headline label="THE REPORT" line1="BRAZIL" line2="1966" tone="paper" delay={0} width={680} align="left" size={170} />
        <Stamp text="1966" delay={yearAt} rotate={-8} size={96} style={{ top: 700, right: 80 }} />

        <div
          data-el="hero"
          data-kind="content"
          style={{ position: "absolute", left: 60, top: 760, width: 900, height: 520 }}
        >
          <div style={{ position: "absolute", left: 0, top: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            <PropLabel text="SISA KI MASK" at={maskAt} rotate={0} from="left" dist={160} />
            <PropLabel text="DO LAASHE" at={doAt} rotate={0} from="left" dist={120} />
            <PropLabel text="2 VICTIMS" at={laasheAt} rotate={0} background={C.paperDeep} from="left" dist={120} />
          </div>
        </div>
      </AbsoluteFill>
    </ScreenShake>
  );
};
