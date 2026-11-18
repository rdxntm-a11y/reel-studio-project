import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { Headline } from "../style/components/Headline";
import { SceneLayout } from "../style/components/SceneLayout";
import { Stamp } from "../style/components/Stamp";
import { PropLabel } from "../style/components/ui";
import { C } from "../style/theme";
import { camera } from "../style/motion";
import type { SceneProps } from "../style/types";

// "Manoel aur Miguel, electronics technicians. Ghar walon se kaha office ka kaam hai."
// A lateral two-shot drift; the names split in from opposite edges, then the lie lands.
export const Scene02: React.FC<SceneProps> = ({ t, from, frames }) => {
  const frame = useCurrentFrame();
  const elecAt = t.at(11) - from;
  const techAt = t.at(12) - from;
  const officeAt = t.at(17) - from;

  const cam = camera(frame, [
    { at: 0, scale: 1.09, y: 22, x: -32 },
    { at: elecAt, scale: 1.05, y: 6, x: -8 },
    { at: officeAt, scale: 1.02, y: -6, x: 14 },
    { at: frames, scale: 1.04, y: -12, x: 22 },
  ]);

  return (
    <SceneLayout
      headline={<Headline label="THE SUBJECTS" line1="MANOEL +" line2="MIGUEL" tone="paper" delay={0} width={700} align="left" size={130} variant="split" />}
    >
      <Img
        src={staticFile("reels/lead-masks/assets/scene2.jpg")}
        style={{ width: "100%", height: "100%", objectFit: "contain", transform: cam }}
      />
      <Stamp text="TECHNICIANS" delay={techAt} rotate={-8} size={52} style={{ top: 40, right: 0 }} />
      <div data-el="hero" data-kind="content" style={{ position: "absolute", left: 0, top: 0, width: "70%", height: "100%" }}>
        <div style={{ position: "absolute", left: 0, top: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <PropLabel text="ELECTRONICS KIT" at={elecAt} rotate={0} from="left" dist={170} />
          <PropLabel
            text="SAID: OFFICE WORK"
            at={officeAt}
            rotate={0}
            background={C.paperDeep}
            from="right"
            dist={200}
          />
        </div>
      </div>
    </SceneLayout>
  );
};
