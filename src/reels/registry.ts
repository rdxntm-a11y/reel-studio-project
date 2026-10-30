import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';

const SCENES = [
  { text: '3 Simple Habits for Women Over 40', start: 0, dur: 305 },
  { text: 'Habit 1: Strength Training', start: 305, dur: 305 },
  { text: 'Habit 2: Protein First', start: 610, dur: 305 },
  { text: 'Habit 3: Sleep & Recovery', start: 915, dur: 305 },
  { text: 'Start Today', start: 1220, dur: 305 },
];

const Scene: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const y = spring({ frame, fps, config: { damping: 200 } });
  const translate = interpolate(y, [0, 1], [40, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#111827', // Dark background
        justifyContent: 'center',
        alignItems: 'center',
        padding: 60,
      }}
    >
      <div style={{ 
        opacity, 
        transform: `translateY(${translate}px)`, 
        color: 'white', 
        fontSize: 80, 
        fontWeight: 'bold', 
        textAlign: 'center',
        fontFamily: 'sans-serif'
      }}>
        {text}
      </div>
    </AbsoluteFill>
  );
};

const HabitsOver40Reel: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#111827' }}>
      <Audio src={staticFile('reels/habits-over-40/vo.wav')} />
      {SCENES.map((s, i) => (
        <Sequence key={i} from={s.start} durationInFrames={s.dur}>
          <Scene text={s.text} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export default HabitsOver40Reel;
