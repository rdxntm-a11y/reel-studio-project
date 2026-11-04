import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

const SCENES = [
  { text: "She fell three kilometres and survived.", start: 0, dur: 120 },
  { text: "1971: Lightning struck her plane over the Amazon.", start: 120, dur: 180 },
  { text: "She woke up alone with a broken collarbone.", start: 300, dur: 240 },
  { text: "She followed a stream, using jungle knowledge.", start: 540, dur: 240 },
  { text: "Rescue planes flew overhead, but the canopy hid her.", start: 780, dur: 240 },
  { text: "Day 11: She finally found a hut.", start: 1020, dur: 240 },
  { text: "Her childhood at a jungle station saved her life.", start: 1260, dur: 240 },
  { text: "Comment 'SURVIVE' for the full story.", start: 1500, dur: 200 }
];

const Rain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {Array.from({ length: 40 }).map((_, i) => {
        const x = (i * 35 + frame * 2) % 1080;
        const y = (i * 50 + frame * 15) % 1920;
        return (
          <div key={i} style={{ position: 'absolute', left: x, top: y, width: 2, height: 40, backgroundColor: 'rgba(255,255,255,0.15)' }} />
        );
      })}
    </AbsoluteFill>
  );
};

const StickFigure: React.FC<{ frame: number }> = ({ frame }) => {
  const walkCycle = Math.sin(frame / 5) * 15;
  return (
    <svg width="250" height="350" viewBox="0 0 100 150" style={{ position: 'absolute', right: 80, bottom: 200 }}>
      <line x1="50" y1="40" x2="50" y2="90" stroke="white" strokeWidth="3" />
      <line x1="50" y1="90" x2={40 + walkCycle} y2="130" stroke="white" strokeWidth="3" />
      <line x1="50" y1="90" x2={60 - walkCycle} y2="130" stroke="white" strokeWidth="3" />
      <line x1="50" y1="55" x2={30 - walkCycle} y2="80" stroke="white" strokeWidth="3" />
      <line x1="50" y1="55" x2={70 + walkCycle} y2="80" stroke="white" strokeWidth="3" />
      <circle cx="50" cy="25" r="15" fill="none" stroke="white" strokeWidth="3" />
      <path d="M35 20 Q50 0 65 20" fill="#ef4444" />
      <circle cx="50" cy="-2" r="5" fill="#ef4444" />
      <circle cx="45" cy="25" r="2" fill="white" />
      <circle cx="55" cy="25" r="2" fill="white" />
    </svg>
  );
};

const Scene: React.FC<{ text: string; index: number }> = ({ text, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#02120f', justifyContent: 'center', alignItems: 'center', padding: 60 }}>
      <Rain />
      <StickFigure frame={frame} />
      
      <div style={{ opacity, transform: `scale(${scale})`, textAlign: 'center', zIndex: 10, marginTop: -250 }}>
        <div style={{ color: '#ef4444', fontSize: 28, fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: 6, marginBottom: 20 }}>
          {index === 0 || index === 7 ? '@midnightfiles' : `SURVIVAL / DAY 0${index}`}
        </div>
        <div style={{ color: 'white', fontSize: 75, fontWeight: 900, fontFamily: 'system-ui', lineHeight: 1.1, textShadow: '0 10px 20px rgba(0,0,0,0.9)' }}>
          {text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Reel: React.FC = () => {
  return (
    <AbsoluteFill>
      <Audio src={staticFile('reels/juliane-koepcke/vo.wav')} />
      {SCENES.map((s, i) => (
        <Sequence key={i} from={s.start} durationInFrames={s.dur}>
          <Scene text={s.text} index={i} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
export default Reel;
