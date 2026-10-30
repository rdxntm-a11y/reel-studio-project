import React from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useVideoConfig,
} from 'remotion';
import { SceneBlock, Title } from '../../components';

export const HabitsOver40Reel: React.FC = () => {
  const { fps, width, height } = useVideoConfig();

  const totalDurationInFrames = 1525;

  const scene1_duration = 10 * fps;
  const scene2_duration = 10 * fps;
  const scene3_duration = 10 * fps;
  const scene4_duration = 10 * fps;
  const scene5_duration = totalDurationInFrames - (scene1_duration + scene2_duration + scene3_duration + scene4_duration);

  return (
    <AbsoluteFill style={{ width, height, backgroundColor: '#1a1a1a' }}>
      <Audio src={staticFile('reels/habits-over-40/vo.wav')} />

      <SceneBlock
        title="3 Simple Habits for Women Over 40"
        durationInFrames={scene1_duration}
        startFrame={0}
        sceneNumber={1}
      />

      <SceneBlock
        title="Habit 1: Strength Training"
        durationInFrames={scene2_duration}
        startFrame={scene1_duration}
        sceneNumber={2}
      />

      <SceneBlock
        title="Habit 2: Protein First"
        durationInFrames={scene3_duration}
        startFrame={scene1_duration + scene2_duration}
        sceneNumber={3}
      />

      <SceneBlock
        title="Habit 3: Sleep & Recovery"
        durationInFrames={scene4_duration}
        startFrame={scene1_duration + scene2_duration + scene3_duration}
        sceneNumber={4}
      />

      <SceneBlock
        title="Start Today"
        durationInFrames={scene5_duration}
        startFrame={scene1_duration + scene2_duration + scene3_duration + scene4_duration}
        sceneNumber={5}
      />
    </AbsoluteFill>
  );
};
