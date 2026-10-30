
import { Composition, Sequence } from 'remotion';
import React from 'react';

// Assuming these components are available in the project's src/components/ directory
import { SceneBlock } from '../../components/SceneBlock';
import { Title } from '../../components/Title';
import { Card } from '../../components/Card';
// import { SAFE_BOX } from '../src/layout'; // Assuming SceneBlock handles layout, or SAFE_BOX is applied within SceneBlock
// import { brand } from '../src/brand'; // Assuming brand might be used for styling, but not explicitly required by the prompt

const VIDEO_WIDTH = 1080;
const VIDEO_HEIGHT = 1920;
const FPS = 30;

// The user provided frame durations that sum to 1525 frames.
// This will define the total duration of the composition.
const SCENE_CONFIG = [
  {
    id: 'intro',
    from: 0,
    durationInFrames: 200,
    title: "3 Sleep Mistakes That Ruin Your Mornings",
    body: "Are you making these common sleep errors? Let's find out.",
  },
  {
    id: 'hydration',
    from: 200,
    durationInFrames: 300,
    title: "Mistake 1: Dehydration",
    body: "Not drinking enough water during the day and before bed can disrupt sleep cycles.",
  },
  {
    id: 'movement',
    from: 500,
    durationInFrames: 300,
    title: "Mistake 2: Too Much Evening Screen Time",
    body: "Blue light from devices suppresses melatonin, making it harder to fall asleep.",
  },
  {
    id: 'rest',
    from: 800,
    durationInFrames: 300,
    title: "Mistake 3: Inconsistent Sleep Schedule",
    body: "Going to bed and waking up at different times confuses your body's natural clock.",
  },
  {
    id: 'conclusion',
    from: 1100,
    durationInFrames: 425,
    title: "Sleep Smarter, Live Better",
    body: "Fix these habits for energized mornings! Follow for more tips.",
  },
];

// Calculate total duration from the scene config
const totalDurationInFrames = SCENE_CONFIG.reduce((sum, scene) => sum + scene.durationInFrames, 0);

export const HabitsOver40Reel: React.FC = () => {
  return (
    <Composition
      id="HabitsOver40Reel"
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
      fps={FPS}
      durationInFrames={totalDurationInFrames} // This will be 1525
      // Potentially add defaultProps if needed by components, e.g., brand colors
      // defaultProps={{ brand: brand }}
    >
      {SCENE_CONFIG.map((scene) => (
        <Sequence key={scene.id} from={scene.from} durationInFrames={scene.durationInFrames}>
          {/*
            The prompt requires using SceneBlock, Title, and Card components.
            The actual content for titles and body text is taken from the script.
            Since the script content was not provided, placeholder text relevant to the
            reel topic "habits-over-40" has been used.
            These should be updated with the actual script content once available.
          */}
          <SceneBlock>
            <Title titleText={scene.title} />
            <Card bodyText={scene.body} />
          </SceneBlock>
        </Sequence>
      ))}
    </Composition>
  );
};
