import { EvidenceBoard } from "../components/EvidenceBoard";
import { SceneFrame } from "../components/SceneFrame";
import type { BoardScene, SceneComponent } from "../types";

export const InvestigationBoard: SceneComponent<BoardScene> = ({ scene, theme, localFrame: frame, duration, timeline, from }) => (
  <SceneFrame
    id={scene.id}
    theme={theme}
    frame={frame}
    duration={duration}
    from={from}
    words={timeline.words}
    kicker={scene.kicker ?? "INVESTIGATION BOARD"}
    chapter="07 / 12"
    signature="grid"
    variant="void"
    transitionIn={scene.transitionIn}
    transitionOut={scene.transitionOut}
  >
    <EvidenceBoard
      theme={theme}
      frame={frame}
      duration={duration}
      headline={scene.headline}
      nodes={scene.nodes}
      links={scene.links}
      note={scene.note}
    />
  </SceneFrame>
);
