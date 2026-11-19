import { SceneFrame } from "../components/SceneFrame";
import { MapGraphic } from "../components/MapGraphic";
import type { MapScene, SceneComponent } from "../types";

export const LocationMapReveal: SceneComponent<MapScene> = ({ scene, theme, localFrame: frame, duration, timeline, from }) => (
  <SceneFrame
    id={scene.id}
    theme={theme}
    frame={frame}
    duration={duration}
    from={from}
    words={timeline.words}
    kicker={scene.kicker ?? "LOCATION REVEAL"}
    chapter="04 / 12"
    signature="corner"
    variant="deep"
    transitionIn={scene.transitionIn}
    transitionOut={scene.transitionOut}
  >
    <MapGraphic
      theme={theme}
      frame={frame}
      duration={duration}
      place={scene.place}
      region={scene.region}
      marker={scene.marker}
      route={scene.route}
      note={scene.note}
      zoom={scene.zoom}
      gid={scene.id}
    />
  </SceneFrame>
);
