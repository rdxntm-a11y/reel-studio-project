import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { DOC_FPS } from "./geometry";
import { getTheme } from "./theme";
import type { DocScene, DocTimeline, SceneComponent } from "./types";
import { AudioBed } from "./components/AudioBed";
import { DocProbe } from "./components/DocProbe";
import { sceneComponentFor } from "./index";

export type ScheduledScene = { scene: DocScene; from: number; index: number };

export const scheduleScenes = (timeline: DocTimeline): ScheduledScene[] => {
  let cursor = 0;
  return timeline.scenes.map((scene, index) => {
    const from = scene.from ?? cursor;
    cursor = from + scene.durationInFrames;
    return { scene, from, index };
  });
};

export const timelineDuration = (timeline: DocTimeline) => {
  const scheduled = scheduleScenes(timeline);
  if (!scheduled.length) return 0;
  return Math.max(...scheduled.map((entry) => entry.from + entry.scene.durationInFrames));
};

const SceneSlot: React.FC<{
  Component: SceneComponent;
  scene: DocScene;
  timeline: DocTimeline;
  theme: ReturnType<typeof getTheme>;
  from: number;
  index: number;
}> = ({ Component, scene, timeline, theme, from, index }) => {
  const localFrame = useCurrentFrame();
  return (
    <Component
      scene={scene}
      timeline={timeline}
      theme={theme}
      localFrame={localFrame}
      globalFrame={from + localFrame}
      duration={scene.durationInFrames}
      from={from}
      index={index}
    />
  );
};

export const Documentary: React.FC<{ timeline: DocTimeline; probe?: boolean; debugSafeZones?: boolean }> = ({
  timeline,
  probe = false,
  debugSafeZones = false,
}) => {
  const theme = getTheme(timeline.theme);
  const fps = timeline.fps ?? DOC_FPS;
  const scheduled = scheduleScenes(timeline);
  const duration = timelineDuration(timeline);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.color.void }}>
      <AudioBed bed={timeline.audio} duration={duration} fps={fps} />
      <DocProbe probe={probe} debug={debugSafeZones} />
      {scheduled.map(({ scene, from, index }) => (
        <Sequence
          key={`${index}-${scene.id}`}
          from={from}
          durationInFrames={scene.durationInFrames}
          layout="none"
          name={`${String(index + 1).padStart(2, "0")}-${scene.kind}`}
        >
          <SceneSlot
            Component={sceneComponentFor(scene)}
            scene={scene}
            timeline={timeline}
            theme={theme}
            from={from}
            index={index}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
