import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

const SCENES = [
  { text: '3 Simple Habits for Women Over 40', start: 0, dur: 305 },
  { text: 'Habit 1: Strength Training', start: 305, dur: 305 },
  { text: 'Habit 2: Protein First', start: 610, dur: 305 },
  { text: 'Habit 3: Sleep & Recovery', start: 915, dur: 305 },
  { text: 'Start Today', start: 1220, dur: 305 },
];

const Scene: React.FC<{ text: string, index: number }> = ({ text, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const scale = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center', padding: 60 }}>
      <div style={{ opacity, transform: `scale(${scale})`, backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '50px 40px', borderRadius: '30px', textAlign: 'center', width: '100%' }}>
        <div style={{ color: '#fbbf24', fontSize: 30, fontWeight: 'bold', fontFamily: 'system-ui', marginBottom: 20, textTransform: 'uppercase', letterSpacing: 2 }}>
          {index === 0 || index === 4 ? 'Reel Studio' : `Step 0${index}`}
        </div>
        <div style={{ color: 'white', fontSize: 65, fontWeight: 900, fontFamily: 'system-ui', lineHeight: 1.2 }}>
          {text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Reel: React.FC = () => {
  return (
    <AbsoluteFill>
      <Audio src={staticFile('reels/habits-over-40/vo.wav')} />
      {SCENES.map((s, i) => (
        <Sequence key={i} from={s.start} durationInFrames={s.dur}>
          <Scene text={s.text} index={i} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export default Reel;
