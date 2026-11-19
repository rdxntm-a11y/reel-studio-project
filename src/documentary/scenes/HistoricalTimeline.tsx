import { SceneFrame } from "../components/SceneFrame";
import { TimelineGraphic } from "../components/TimelineGraphic";
import type { SceneComponent, TimelineScene } from "../types";

export const HistoricalTimeline: SceneComponent<TimelineScene> = ({ scene, theme, localFrame: frame, duration, timeline, from }) => (
  <SceneFrame
    id={scene.id}
    theme={theme}
    frame={frame}
    duration={duration}
    from={from}
    words={timeline.words}
    kicker={scene.kicker ?? "CHRONOLOGY"}
    chapter="03 / 12"
    signature="rule"
    variant="deep"
    transitionIn={scene.transitionIn}
    transitionOut={scene.transitionOut}
  >
    <TimelineGraphic
      theme={theme}
      frame={frame}
      duration={duration}
      events={scene.events}
      headline={scene.headline}
    />
  </SceneFrame>
);
