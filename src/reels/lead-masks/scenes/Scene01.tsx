import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { Headline } from "../style/components/Headline";
import { SceneLayout } from "../style/components/SceneLayout";
import { Stamp } from "../style/components/Stamp";
import { PropLabel, ScreenShake } from "../style/components/ui";
import { C } from "../style/theme";
import { camera, parallax } from "../style/motion";
import type { SceneProps } from "../style/types";

// Hook: "Brazil, 1966. Sisa ki mask, aur do laashe."
// A controlled establishing push-in holds on the mask, then settles as the labels arrive.
export const Scene01: React.FC<SceneProps> = ({ t, from, frames }) => {
  const frame = useCurrentFrame();
  const yearAt = t.at(1) - from;
  const maskAt = t.at(4) - from;
  const doAt = t.at(6) - from;
  const laasheAt = t.at(7) - from;

  const cam = camera(frame, [
    { at: 0, scale: 1.02, y: 26, x: 0 },
    { at: maskAt, scale: 1.05, y: 8, x: -4 },
    { at: laasheAt, scale: 1.08, y: -8, x: 6 },
    { at: frames, scale: 1.1, y: -20, x: 0 },
  ]);

  return (
    <ScreenShake at={[yearAt + 3]}>
      <SceneLayout
        headline={<Headline label="THE REPORT" line1="BRAZIL" line2="1966" tone="paper" delay={0} width={680} align="left" size={170} variant="track" accentRule />}
      >
        <Img
          src={staticFile("reels/lead-masks/assets/scene1.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "contain", transform: cam }}
        />
        <Stamp text="1966" delay={yearAt} rotate={-8} size={96} style={{ top: 40, right: 0 }} />
        <div data-el="hero" data-kind="content" style={{ position: "absolute", left: 0, top: 0, width: "70%", height: "100%" }}>
          <div style={{ position: "absolute", left: 0, top: 20, display: "flex", flexDirection: "column", gap: 14, transform: parallax(frame, frames, 12) }}>
            <PropLabel text="SISA KI MASK" at={maskAt} rotate={0} from="left" dist={160} />
            <PropLabel text="DO LAASHE" at={doAt} rotate={0} from="left" dist={120} />
            <PropLabel text="2 VICTIMS" at={laasheAt} rotate={0} background={C.paperDeep} from="left" dist={120} />
          </div>
        </div>
      </SceneLayout>
    </ScreenShake>
  );
};
