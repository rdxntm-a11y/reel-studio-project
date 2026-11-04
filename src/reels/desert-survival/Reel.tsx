import React from 'react';
import { AbsoluteFill, Easing, Sequence, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { ReelFrame, type ReelProps } from '../../components';
import { brand as myBrand } from '../../brand';
import { SAFE_BOX } from '../../layout';

const ACCENT = '#f59e0b';
export const AUDIO = 'reels/desert-survival/vo.wav';

const EASE_IN_OUT = Easing.bezier(0.77, 0, 0.175, 1);
const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

const MOTION = {
  breathFrames: 120,
  breathRise: 1.6,
  chestScale: 0.014,
  blinkClose: 4,
  blinkHold: 1,
  blinkOpen: 6,
  doubleBlinkChance: 0.32
};

const SCENES = [
  { text: "He ran the Sahara—then vanished.", start: 0, dur: 77 },
  { text: "1994: 250 km across Morocco.", start: 77, dur: 210 },
  { text: "Day 4: the sandstorm hit.", start: 287, dur: 105 },
  { text: "Lost. Half a bottle of water.", start: 392, dur: 101 },
  { text: "He drank his own urine.", start: 493, dur: 72 },
  { text: "Bats' blood. The helicopter missed him.", start: 565, dur: 168 },
  { text: "His blood was too thick to drain.", start: 733, dur: 225 },
  { text: "Day 8: an oasis.", start: 958, dur: 103 },
  { text: "A nomad camp in Algeria.", start: 1061, dur: 94 },
  { text: "291 km off course. 16 kg lighter.", start: 1155, dur: 142 },
  { text: "Ten days lost. One failed escape.", start: 1297, dur: 165 },
  { text: "Follow for more epic survival stories", start: 1462, dur: 80 }
];

export const durationInFrames = 1542;

type Pose = 'sprint' | 'run' | 'brace' | 'search' | 'drink' | 'lookup' | 'fall' | 'crawl' | 'wave' | 'walk' | 'despair' | 'cheer';
type Vec = { x: number; y: number };
type Camera = {
  scale: [number, number];
  x: [number, number];
  y: [number, number];
  rotate: [number, number];
  origin: string;
};

const POSES: Pose[] = ['sprint', 'run', 'brace', 'search', 'drink', 'lookup', 'fall', 'crawl', 'wave', 'walk', 'despair', 'cheer'];

const CAMERAS: Camera[] = [
  { scale: [1.02, 1.16], x: [-12, 16], y: [0, -10], rotate: [-1, 1], origin: '52% 68%' },
  { scale: [1.18, 1.05], x: [18, -10], y: [-8, 0], rotate: [1, -0.5], origin: '50% 66%' },
  { scale: [1.04, 1.22], x: [0, -18], y: [0, 12], rotate: [-1.5, 1.5], origin: '48% 72%' },
  { scale: [1.14, 1.04], x: [-14, 8], y: [6, -4], rotate: [1, -1], origin: '55% 70%' },
  { scale: [1.03, 1.15], x: [8, -6], y: [0, -6], rotate: [-0.5, 0.5], origin: '42% 74%' },
  { scale: [1.06, 1.13], x: [-6, 12], y: [-4, -18], rotate: [0, -1], origin: '50% 68%' },
  { scale: [1.2, 1.03], x: [0, 0], y: [-10, 4], rotate: [1, -0.5], origin: '50% 70%' },
  { scale: [1.02, 1.14], x: [10, -14], y: [0, -6], rotate: [-0.5, 0.8], origin: '58% 70%' },
  { scale: [1.14, 1.04], x: [-12, 10], y: [4, 0], rotate: [0.8, -0.8], origin: '46% 68%' },
  { scale: [1.03, 1.12], x: [12, -8], y: [0, 6], rotate: [-0.5, 0.5], origin: '50% 72%' },
  { scale: [1.16, 1.04], x: [0, 14], y: [-6, 2], rotate: [1, -1], origin: '50% 72%' },
  { scale: [1.04, 1.12], x: [-8, 0], y: [0, -8], rotate: [0, 1], origin: '50% 66%' }
];

const STORM = [0.18, 0.1, 1, 0.55, 0.3, 0.14, 0.1, 0.06, 0.06, 0.14, 0.16, 0.06];
const WATER = [0.92, 0.84, 0.68, 0.5, 0.26, 0.12, 0, 0, 0, 0, 0, 0];
const SUN = [1, 1, 0.16, 0.55, 0.82, 0.9, 0.48, 1, 0.82, 0.9, 0.7, 1];
const HEAT = [0.55, 0.72, 0.1, 0.66, 0.92, 0.98, 0.52, 0.36, 0.48, 0.58, 0.3, 0.42];
const TRAIL = [0.5, 0.84, 0.96, 0.92, 0.88, 0.82, 0.7, 0, 0, 0.44, 0.34, 0.24];
const FIGURE_X = [370, 370, 370, 370, 370, 370, 370, 220, 370, 370, 370, 370];

const BACKGROUNDS = [
  'linear-gradient(180deg,#2b1405 0%,#7c3f12 52%,#2a1405 100%)',
  'linear-gradient(180deg,#331a08 0%,#9a5218 55%,#2f1707 100%)',
  'linear-gradient(180deg,#1f1207 0%,#6b3d16 50%,#170c04 100%)',
  'linear-gradient(180deg,#2a1608 0%,#8a4a17 55%,#251205 100%)',
  'linear-gradient(180deg,#301708 0%,#8f4c16 55%,#241104 100%)',
  'linear-gradient(180deg,#281506 0%,#7a4214 52%,#1a0d04 100%)',
  'linear-gradient(180deg,#1b0f06 0%,#5c3413 50%,#120a03 100%)',
  'linear-gradient(180deg,#3a1d08 0%,#c06a1c 52%,#5a2b0a 100%)',
  'linear-gradient(180deg,#311807 0%,#955018 55%,#2a1305 100%)',
  'linear-gradient(180deg,#241306 0%,#7d4514 55%,#1c0e04 100%)',
  'linear-gradient(180deg,#1b0f06 0%,#5f3513 52%,#120a03 100%)',
  'linear-gradient(180deg,#2f1607 0%,#a85918 55%,#341806 100%)'
];

const KEYWORDS = new Set(['survive', 'oasis', 'helicopter', 'sandstorm', 'follow']);
const clean = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeOutBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const snapSwing = (phase: number) => {
  const s = Math.sin(phase);
  return Math.sign(s) * Math.pow(Math.abs(s), 0.82);
};

const rand = (i: number, seed: number) => {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const blinkCurve = (local: number) => {
  const { blinkClose: close, blinkHold: hold, blinkOpen: open } = MOTION;
  if (local < 0) return 1;
  if (local < close) return 1 - local / close;
  if (local < close + hold) return 0;
  if (local < close + hold + open) return (local - close - hold) / open;
  return 1;
};

const blinkOpenness = (frame: number, seed: number) => {
  const period = 104 + Math.floor(rand(seed, 21) * 28);
  const offset = Math.floor(rand(seed, 22) * period);
  const cycle = Math.floor((frame + offset) / period);
  let openness = 1;
  for (let c = cycle - 1; c <= cycle + 1; c += 1) {
    const jitter = Math.floor((rand(seed * 13 + c, 23) - 0.5) * 18);
    const start = c * period + offset + jitter;
    openness = Math.min(openness, blinkCurve(frame - start));
    if (rand(seed * 7 + c, 24) > 1 - MOTION.doubleBlinkChance) {
      openness = Math.min(openness, blinkCurve(frame - start - 24));
    }
  }
  return openness;
};

const Dust: React.FC<{ frame: number; intensity: number }> = ({ frame, intensity }) => {
  const haze = 0.2 + intensity * 0.28 + 0.04 * Math.sin(frame / 18);
  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 30%, rgba(245,158,11,0.34), transparent 66%)', opacity: haze }} />
      {Array.from({ length: 150 }).map((_, i) => {
        const speed = 3 + rand(i, 1) * 10 + intensity * 34;
        const size = 1.5 + rand(i, 2) * 5 + intensity * 4;
        const x = (rand(i, 3) * 1400 + frame * speed) % 1400 - 160;
        const y = (rand(i, 4) * 2000 + frame * (1 + rand(i, 5) * 5)) % 2040 - 60;
        const opacity = (0.1 + intensity * 0.55) * (0.35 + rand(i, 6) * 0.65);
        return (
          <div key={i} style={{ position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: '50%', backgroundColor: 'rgba(245,158,11,0.75)', opacity }} />
        );
      })}
      {intensity > 0.35
        ? Array.from({ length: 26 }).map((_, i) => {
            const speed = 20 + rand(i, 7) * 42;
            const x = (rand(i, 8) * 1500 + frame * speed) % 1500 - 220;
            const y = rand(i, 9) * 1960 - 20;
            const len = 70 + rand(i, 10) * 190;
            return (
              <div key={`streak-${i}`} style={{ position: 'absolute', left: x, top: y, width: len, height: 2, borderRadius: 2, backgroundColor: 'rgba(245,158,11,0.6)', opacity: intensity * 0.45 }} />
            );
          })
        : null}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(104deg, transparent 18%, rgba(245,158,11,0.3) 44%, transparent 72%)',
          transform: `translateX(${(frame * (12 + intensity * 40)) % 1400 - 180}px)`,
          opacity: intensity * 0.42
        }}
      />
    </AbsoluteFill>
  );
};

const Dunes: React.FC = () => (
  <svg viewBox="0 0 1080 500" width={1080} height={500} preserveAspectRatio="none" style={{ position: 'absolute', left: 0, bottom: 0 }}>
    <path d="M0 250 Q220 170 480 245 T1080 220 L1080 500 L0 500Z" fill="rgba(46,22,7,0.55)" />
    <path d="M0 340 Q260 250 560 330 T1080 300 L1080 500 L0 500Z" fill="rgba(28,13,4,0.82)" />
  </svg>
);

const Sun: React.FC<{ frame: number; intensity: number }> = ({ frame, intensity }) => {
  const pulse = 0.94 + Math.sin(frame / 22) * 0.05;
  const grow = 0.9 + intensity * 0.14;
  return (
    <div style={{ position: 'absolute', right: -80, top: 176, width: 420, height: 420, opacity: intensity, transform: `scale(${grow})`, transformOrigin: '68% 30%' }}>
      <div style={{ position: 'absolute', inset: -60, background: 'radial-gradient(circle, rgba(251,191,36,0.4) 0%, rgba(245,158,11,0.16) 38%, transparent 68%)', transform: `scale(${pulse})` }} />
      <svg viewBox="0 0 400 400" width={420} height={420}>
        <defs>
          <radialGradient id="desert-sun">
            <stop offset="0%" stopColor="#fff7d6" />
            <stop offset="45%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#ea7a12" />
          </radialGradient>
        </defs>
        <g transform={`rotate(${frame * 0.12} 200 200)`}>
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={i} x1={200} y1={82} x2={200} y2={54} stroke="rgba(251,191,36,0.7)" strokeWidth={7} strokeLinecap="round" transform={`rotate(${i * 30} 200 200)`} />
          ))}
        </g>
        <circle cx={200} cy={200} r={68} fill="url(#desert-sun)" />
      </svg>
    </div>
  );
};

const Heatwaves: React.FC<{ frame: number; intensity: number }> = ({ frame, intensity }) => (
  <svg viewBox="0 0 1080 260" width={1080} height={260} preserveAspectRatio="none" style={{ position: 'absolute', left: 0, top: 820, opacity: intensity * 0.48, pointerEvents: 'none' }}>
    {[0, 1, 2, 3, 4].map((k) => {
      const y = 28 + k * 46;
      let d = `M0 ${y}`;
      for (let x = 0; x < 1080; x += 60) {
        const wobble = Math.sin(frame / 11 + k * 1.3 + x / 54) * (7 + (k % 3) * 3);
        d += ` Q${x + 30} ${y + wobble} ${x + 60} ${y}`;
      }
      return <path key={k} d={d} fill="none" stroke="rgba(251,191,36,0.55)" strokeWidth={2.5 + (k % 3) * 1.2} strokeLinecap="round" />;
    })}
  </svg>
);

const HeatHaze: React.FC<{ frame: number; intensity: number }> = ({ frame, intensity }) => {
  const period = 150;
  const phase = ((frame % period) / period) * Math.PI * 2;
  const drift = Math.sin(phase) * 16;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen', opacity: 0.42 + intensity * 0.3 }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <filter id="desert-heat-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
          <linearGradient id="desert-heat-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(251,191,36,0)" />
            <stop offset="52%" stopColor="rgba(251,191,36,0.5)" />
            <stop offset="100%" stopColor="rgba(251,191,36,0)" />
          </linearGradient>
        </defs>
        {Array.from({ length: 11 }).map((_, k) => {
          const baseY = 520 + k * 126 + drift;
          let d = `M-40 ${baseY}`;
          for (let x = -40; x <= 1120; x += 80) {
            const wobble = Math.sin(phase + k * 0.82 + x / 148) * (15 + (k % 4) * 4) + Math.sin(phase * 2 + k * 1.63 + x / 61) * 6;
            d += ` Q${x + 40} ${baseY + wobble} ${x + 80} ${baseY}`;
          }
          return (
            <path
              key={k}
              d={d}
              fill="none"
              stroke="url(#desert-heat-fade)"
              strokeWidth={3 + (k % 4) * 2}
              strokeLinecap="round"
              filter="url(#desert-heat-blur)"
              opacity={0.1 + (k % 3) * 0.035}
            />
          );
        })}
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 82%, rgba(245,158,11,0.2) 0%, rgba(251,191,36,0.08) 32%, transparent 64%)',
          transform: `translateY(${drift * 0.8}px) scale(${1 + Math.sin(phase) * 0.015})`,
        }}
      />
    </AbsoluteFill>
  );
};

const Footprints: React.FC<{ opacity: number }> = ({ opacity }) => (
  <svg viewBox="0 0 760 240" width={760} height={240} style={{ position: 'absolute', left: 150, bottom: 380, opacity }}>
    {Array.from({ length: 18 }).map((_, i) => {
      const side = i % 2 === 0 ? -1 : 1;
      const cx = 690 - i * 38;
      const cy = 205 - i * 9 + side * 7;
      const rx = 16 - i * 0.7;
      const ry = 6 - i * 0.2;
      return <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill="rgba(20,10,3,0.4)" transform={`rotate(${side * 12} ${cx} ${cy})`} />;
    })}
  </svg>
);

const WaterBottle: React.FC<{ frame: number; level: number; tip?: number }> = ({ frame, level, tip = 0 }) => {
  const fill = 124 * level;
  const critical = level > 0 && level <= 0.26;
  const sway = Math.sin(frame / 20) * 2.5;
  return (
    <svg
      viewBox="0 0 80 190"
      width={80}
      height={190}
      style={{
        position: 'absolute',
        left: 104,
        bottom: 492,
        transform: `rotate(${sway + tip}deg)`,
        transformOrigin: '50% 100%',
        filter: critical ? 'drop-shadow(0 0 12px rgba(245,158,11,0.6))' : undefined
      }}
    >
      <rect x={30} y={6} width={20} height={20} rx={5} fill="rgba(255,255,255,0.75)" />
      <rect x={20} y={24} width={40} height={146} rx={13} fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.75)" strokeWidth={2.5} />
      <rect x={23} y={24 + 142 - fill} width={34} height={fill} rx={10} fill="rgba(56,189,248,0.72)" />
      <line x1={28} y1={52} x2={52} y2={52} stroke="rgba(255,255,255,0.6)" strokeWidth={2.5} />
      <line x1={28} y1={60} x2={52} y2={60} stroke="rgba(255,255,255,0.35)" strokeWidth={2} />
      {critical ? <circle cx={40} cy={120} r={3} fill="rgba(245,158,11,0.9)" opacity={0.55 + Math.sin(frame / 7) * 0.35} /> : null}
    </svg>
  );
};

const Helicopter: React.FC<{ frame: number; dur: number }> = ({ frame, dur }) => {
  const x = interpolate(frame, [0, dur], [-320, 1400], { extrapolateRight: 'clamp' });
  const y = 300 + Math.sin(frame / 16) * 9;
  return (
    <svg viewBox="0 0 240 110" width={240} height={110} style={{ position: 'absolute', left: x, top: y, opacity: 0.9 }}>
      <ellipse cx={112} cy={62} rx={38} ry={17} fill="#1b0d03" />
      <path d="M148 58 L206 54 L214 60 L150 68Z" fill="#1b0d03" />
      <path d="M204 42 L216 58 L204 54Z" fill="#1b0d03" />
      <rect x={92} y={44} width={40} height={5} rx={2.5} fill="#1b0d03" />
      <line x1={72} y1={44} x2={152} y2={44} stroke="#1b0d03" strokeWidth={4} strokeLinecap="round" transform={`rotate(${Math.sin(frame * 1.4) * 5} 112 44)`} />
      <line x1={100} y1={78} x2={92} y2={92} stroke="#1b0d03" strokeWidth={4} strokeLinecap="round" />
      <line x1={124} y1={78} x2={132} y2={92} stroke="#1b0d03" strokeWidth={4} strokeLinecap="round" />
      <circle cx={112} cy={60} r={8} fill="rgba(245,158,11,0.55)" />
    </svg>
  );
};

const Oasis: React.FC<{ frame: number }> = ({ frame }) => (
  <svg viewBox="0 0 420 240" width={420} height={240} style={{ position: 'absolute', right: 40, bottom: 440 }}>
    <ellipse cx={210} cy={196} rx={128} ry={24} fill="rgba(28,120,112,0.8)" />
    <ellipse cx={210} cy={192} rx={104} ry={13} fill="rgba(125,211,201,0.55)" />
    <path d="M232 182 Q222 132 236 96" fill="none" stroke="#1c0d04" strokeWidth={9} strokeLinecap="round" />
    <path d="M234 100 Q198 78 172 92 Q204 88 230 106Z" fill="#173b26" />
    <path d="M234 100 Q256 66 288 70 Q258 82 238 108Z" fill="#1d4a2e" />
    <path d="M234 100 Q212 60 180 58 Q210 76 230 108Z" fill="#173b26" />
    <path d="M234 100 Q268 90 292 110 Q258 100 236 112Z" fill="#1d4a2e" />
    <path d="M234 100 Q206 112 188 136 Q214 118 236 112Z" fill="#173b26" />
    <ellipse cx={258} cy={100} rx={5} ry={7} fill="#fbbf24" opacity={0.7 + Math.sin(frame / 10) * 0.2} />
  </svg>
);

const Camp: React.FC = () => (
  <svg viewBox="0 0 420 220" width={420} height={220} style={{ position: 'absolute', right: 30, bottom: 470 }}>
    <path d="M54 188 L102 104 L150 188Z" fill="rgba(24,12,4,0.9)" />
    <path d="M176 188 L224 118 L272 188Z" fill="rgba(30,15,5,0.9)" />
    <path d="M270 188 L310 130 L350 188Z" fill="rgba(20,10,3,0.85)" />
    <line x1={54} y1={188} x2={150} y2={188} stroke="rgba(245,158,11,0.35)" strokeWidth={3} />
    <line x1={176} y1={188} x2={272} y2={188} stroke="rgba(245,158,11,0.35)" strokeWidth={3} />
    <line x1={270} y1={188} x2={350} y2={188} stroke="rgba(245,158,11,0.35)" strokeWidth={3} />
  </svg>
);

const getGeometry = (pose: Pose, frame: number) => {
  const stand = {
    torso: [{ x: 100, y: 70 }, { x: 100, y: 118 }],
    head: { x: 100, y: 52, r: 19 },
    eyes: [{ x: 94, y: 50 }, { x: 106, y: 50 }],
    arms: [
      { points: [{ x: 100, y: 84 }, { x: 78, y: 100 }, { x: 64, y: 116 }] },
      { points: [{ x: 100, y: 84 }, { x: 122, y: 100 }, { x: 136, y: 116 }] }
    ],
    legs: [
      { points: [{ x: 100, y: 118 }, { x: 88, y: 142 }, { x: 78, y: 168 }] },
      { points: [{ x: 100, y: 118 }, { x: 112, y: 142 }, { x: 122, y: 168 }] }
    ],
    lean: 0,
    bob: 0
  };

  if (pose === 'sprint' || pose === 'run' || pose === 'walk') {
    const cfg = pose === 'sprint' ? { speed: 3, reach: 29, lean: -17, bob: 10 } : pose === 'run' ? { speed: 4.5, reach: 22, lean: -10, bob: 7 } : { speed: 7, reach: 13, lean: -3, bob: 3 };
    const phase = frame / cfg.speed;
    const s = snapSwing(phase);
    const trail = snapSwing(phase - 0.42);
    const armReach = trail * cfg.reach;
    const legReach = trail * cfg.reach * 1.2;
    return {
      ...stand,
      lean: cfg.lean + Math.sin(phase - 0.55) * 2.4,
      bob: -Math.abs(Math.sin(phase)) * cfg.bob,
      arms: [
        { points: [{ x: 100, y: 84 }, { x: 82 - s * cfg.reach * 0.5, y: 98 }, { x: 64 - armReach, y: 112 }] },
        { points: [{ x: 100, y: 84 }, { x: 118 + s * cfg.reach * 0.5, y: 98 }, { x: 136 + armReach, y: 112 }] }
      ],
      legs: [
        { points: [{ x: 100, y: 118 }, { x: 88 + s * cfg.reach * 0.5, y: 142 }, { x: 76 + legReach, y: 168 }] },
        { points: [{ x: 100, y: 118 }, { x: 112 - s * cfg.reach * 0.5, y: 142 }, { x: 124 - legReach, y: 168 }] }
      ]
    };
  }

  if (pose === 'brace') {
    const gust = Math.sin(frame / 6.5) * 0.7 + Math.sin(frame / 15) * 0.3;
    const shiver = Math.sin(frame * 1.9) * 0.9;
    const headX = 100 + gust * 2;
    return {
      ...stand,
      torso: [{ x: 98, y: 70 }, { x: 100, y: 118 }],
      head: { x: headX, y: 58, r: 19 },
      eyes: [{ x: headX - 6, y: 55 }, { x: headX + 6, y: 55 }],
      lean: -21 + gust * 5 + shiver * 0.4,
      bob: -4 + Math.abs(gust) * 1.6,
      arms: [
        { points: [{ x: 100, y: 84 }, { x: 84, y: 74 }, { x: 94, y: 64 }] },
        { points: [{ x: 100, y: 84 }, { x: 118, y: 92 }, { x: 136, y: 84 }] }
      ],
      legs: [
        { points: [{ x: 100, y: 118 }, { x: 82, y: 146 }, { x: 68, y: 174 }] },
        { points: [{ x: 100, y: 118 }, { x: 118, y: 146 }, { x: 132, y: 170 }] }
      ]
    };
  }

  if (pose === 'search') {
    return {
      ...stand,
      head: { x: 102, y: 50, r: 19 },
      eyes: [{ x: 97, y: 47 }, { x: 108, y: 47 }],
      arms: [
        { points: [{ x: 100, y: 84 }, { x: 84, y: 98 }, { x: 70, y: 112 }] },
        { points: [{ x: 102, y: 84 }, { x: 116, y: 68 }, { x: 108, y: 48 }] }
      ]
    };
  }

  if (pose === 'drink') {
    return {
      ...stand,
      head: { x: 100, y: 50, r: 19 },
      eyes: [{ x: 94, y: 47 }, { x: 106, y: 47 }],
      arms: [
        { points: [{ x: 100, y: 84 }, { x: 92, y: 102 }, { x: 82, y: 118 }] },
        { points: [{ x: 100, y: 84 }, { x: 114, y: 72 }, { x: 106, y: 54 }] }
      ]
    };
  }

  if (pose === 'lookup') {
    return {
      ...stand,
      head: { x: 100, y: 48, r: 19 },
      eyes: [{ x: 94, y: 44 }, { x: 106, y: 44 }],
      arms: [
        { points: [{ x: 100, y: 84 }, { x: 82, y: 104 }, { x: 72, y: 122 }] },
        { points: [{ x: 100, y: 84 }, { x: 118, y: 104 }, { x: 128, y: 122 }] }
      ]
    };
  }

  if (pose === 'fall') {
    return {
      ...stand,
      torso: [{ x: 72, y: 150 }, { x: 118, y: 150 }],
      head: { x: 54, y: 146, r: 19 },
      eyes: [{ x: 49, y: 143 }, { x: 59, y: 143 }],
      arms: [
        { points: [{ x: 112, y: 150 }, { x: 128, y: 132 }, { x: 142, y: 126 }] },
        { points: [{ x: 104, y: 152 }, { x: 90, y: 168 }, { x: 76, y: 172 }] }
      ],
      legs: [
        { points: [{ x: 118, y: 150 }, { x: 144, y: 162 }, { x: 166, y: 168 }] },
        { points: [{ x: 118, y: 150 }, { x: 138, y: 172 }, { x: 158, y: 178 }] }
      ]
    };
  }

  if (pose === 'crawl') {
    return {
      ...stand,
      torso: [{ x: 74, y: 152 }, { x: 120, y: 132 }],
      head: { x: 140, y: 122, r: 18 },
      eyes: [{ x: 145, y: 118 }, { x: 154, y: 120 }],
      arms: [
        { points: [{ x: 118, y: 136 }, { x: 136, y: 150 }, { x: 154, y: 158 }] },
        { points: [{ x: 112, y: 140 }, { x: 126, y: 158 }, { x: 138, y: 166 }] }
      ],
      legs: [
        { points: [{ x: 74, y: 152 }, { x: 54, y: 160 }, { x: 40, y: 168 }] },
        { points: [{ x: 78, y: 156 }, { x: 62, y: 170 }, { x: 48, y: 178 }] }
      ]
    };
  }

  if (pose === 'wave') {
    const s = Math.sin(frame / 5);
    return {
      ...stand,
      head: { x: 100, y: 50, r: 19 },
      eyes: [{ x: 94, y: 47 }, { x: 106, y: 47 }],
      arms: [
        { points: [{ x: 100, y: 84 }, { x: 118, y: 64 }, { x: 136 + s * 8, y: 40 }] },
        { points: [{ x: 100, y: 84 }, { x: 84, y: 100 }, { x: 74, y: 116 }] }
      ]
    };
  }

  if (pose === 'cheer') {
    const s = Math.sin(frame / 6);
    return {
      ...stand,
      head: { x: 100, y: 50, r: 19 },
      eyes: [{ x: 94, y: 46 }, { x: 106, y: 46 }],
      arms: [
        { points: [{ x: 100, y: 84 }, { x: 78, y: 62 }, { x: 62, y: 38 + s * 6 }] },
        { points: [{ x: 100, y: 84 }, { x: 122, y: 62 }, { x: 138, y: 34 - s * 6 }] }
      ],
      legs: [
        { points: [{ x: 100, y: 118 }, { x: 88, y: 142 }, { x: 76, y: 168 }] },
        { points: [{ x: 100, y: 118 }, { x: 112, y: 142 }, { x: 124, y: 168 }] }
      ]
    };
  }

  if (pose === 'despair') {
    return {
      ...stand,
      torso: [{ x: 96, y: 108 }, { x: 100, y: 152 }],
      head: { x: 92, y: 90, r: 18 },
      eyes: [{ x: 87, y: 93 }, { x: 97, y: 93 }],
      arms: [
        { points: [{ x: 96, y: 116 }, { x: 82, y: 100 }, { x: 90, y: 88 }] },
        { points: [{ x: 96, y: 116 }, { x: 76, y: 104 }, { x: 88, y: 92 }] }
      ],
      legs: [
        { points: [{ x: 100, y: 152 }, { x: 128, y: 152 }, { x: 150, y: 168 }] },
        { points: [{ x: 100, y: 152 }, { x: 116, y: 160 }, { x: 148, y: 172 }] }
      ]
    };
  }

  return {
    ...stand,
    torso: [{ x: 98, y: 106 }, { x: 100, y: 150 }],
    head: { x: 96, y: 84, r: 18 },
    eyes: [{ x: 90, y: 86 }, { x: 100, y: 86 }],
    arms: [
      { points: [{ x: 98, y: 112 }, { x: 112, y: 130 }, { x: 130, y: 146 }] },
      { points: [{ x: 98, y: 112 }, { x: 88, y: 132 }, { x: 104, y: 148 }] }
    ],
    legs: [
      { points: [{ x: 100, y: 150 }, { x: 128, y: 152 }, { x: 150, y: 168 }] },
      { points: [{ x: 100, y: 150 }, { x: 116, y: 160 }, { x: 148, y: 172 }] }
    ]
  };
};

const StickFigure: React.FC<{ pose: Pose; frame: number; left: number; opacity: number; seed: number; wind?: number }> = ({ pose, frame, left, opacity, seed, wind = 0 }) => {
  const { fps } = useVideoConfig();
  const g = getGeometry(pose, frame);
  const settle = spring({ frame, fps, config: { damping: 9, stiffness: 125, mass: 0.85 } });
  const breath = Math.sin((frame / MOTION.breathFrames) * Math.PI * 2);
  const chestLift = -breath * MOTION.breathRise * 0.55;
  const chestScale = 1 + breath * MOTION.chestScale;
  const moving = pose === 'sprint' || pose === 'run' || pose === 'walk';
  const nervous = pose === 'brace';
  const scared = nervous || pose === 'fall' || pose === 'crawl';
  const tired = pose === 'despair' || pose === 'drink';
  const sway = moving ? 0 : Math.sin((frame / 132) * Math.PI * 2) * (nervous ? 0.25 : 0.55);
  const blink = blinkOpenness(frame, seed);
  const eyeRx = scared ? 2.5 : 2.1;
  const eyeRy = Math.max(0.3, (scared ? 2.9 : 2.1) * blink);
  const enterY = (1 - settle) * -26;
  const enterScale = 0.9 + 0.1 * settle;
  return (
    <svg data-el="figure" width={340} height={340} viewBox="0 0 200 200" style={{ position: 'absolute', left, bottom: 420, opacity, filter: 'drop-shadow(0 12px 12px rgba(0,0,0,0.45))' }}>
      <g transform={`translate(${wind} ${g.bob + enterY}) rotate(${g.lean + sway} 100 118) translate(100 118) scale(${enterScale}) translate(-100 -118)`}>
        {g.legs.map((limb, i) => (
          <polyline key={`leg-${i}`} points={limb.points.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke="white" strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" />
        ))}
        <g transform={`translate(100 118) translate(0 ${chestLift}) scale(1 ${chestScale}) translate(-100 -118)`}>
          <polyline points={g.torso.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke="white" strokeWidth={3.6} strokeLinecap="round" />
          {g.arms.map((limb, i) => (
            <polyline key={`arm-${i}`} points={limb.points.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke="white" strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" />
          ))}
          <circle cx={g.head.x} cy={g.head.y} r={g.head.r} fill="none" stroke="white" strokeWidth={3.6} />
          <path d={`M${g.head.x - g.head.r} ${g.head.y - 4} Q${g.head.x} ${g.head.y - 30} ${g.head.x + g.head.r} ${g.head.y - 4}`} fill={ACCENT} />
          <circle cx={g.head.x} cy={g.head.y - 25} r={4.5} fill={ACCENT} />
          {g.eyes.map((eye, i) => (
            <ellipse key={`eye-${i}`} cx={eye.x} cy={eye.y} rx={eyeRx} ry={eyeRy} fill="white" />
          ))}
          {scared
            ? g.eyes.map((eye, i) => {
                const left = eye.x - 3.6;
                const right = eye.x + 3.6;
                const outerY = eye.y - 4.8;
                const innerY = eye.y - 7.2;
                return <line key={`brow-${i}`} x1={i === 0 ? left : right} y1={outerY} x2={i === 0 ? right : left} y2={innerY} stroke="white" strokeWidth={1.6} strokeLinecap="round" />;
              })
            : null}
          {scared ? <ellipse cx={g.head.x} cy={g.head.y + 9} rx={3.2} ry={4.4} fill="none" stroke="white" strokeWidth={1.7} /> : null}
          {tired ? <line x1={g.head.x - 4} y1={g.head.y + 10} x2={g.head.x + 4} y2={g.head.y + 10} stroke="white" strokeWidth={1.7} strokeLinecap="round" /> : null}
        </g>
      </g>
    </svg>
  );
};

const Word: React.FC<{ word: string; at: number; accent: boolean }> = ({ word, at, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = Math.max(0, frame - at);
  const progress = spring({ frame: local, fps, config: { damping: 8.5, stiffness: 165, mass: 0.7 } });
  const opacity = interpolate(local, [0, 3.5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const lift = (1 - progress) * 48;
  const scale = (0.52 + 0.48 * progress) * (accent ? 1.04 : 1);
  const tilt = (1 - progress) * -8;
  const blur = Math.max(0, 1 - progress) * 9;
  const settle = easeOutBack(clamp01(local / 16));
  return (
    <span
      style={{
        display: 'inline-block',
        color: accent ? ACCENT : 'white',
        opacity,
        transform: `translateY(${lift}px) scale(${scale}) rotate(${tilt}deg)`,
        transformOrigin: '50% 62%',
        filter: `blur(${blur}px)`,
        textShadow: accent ? `0 0 ${18 + settle * 14}px rgba(245,158,11,0.55), 0 8px 24px rgba(0,0,0,0.9)` : '0 8px 24px rgba(0,0,0,0.9)'
      }}
    >
      {word}
    </span>
  );
};

const Scene: React.FC<{ text: string; index: number; dur: number; start: number }> = ({ text, index, dur, start }) => {
  const frame = useCurrentFrame();
  const storm = STORM[index];
  const heat = HEAT[index];
  const camera = CAMERAS[index];
  const cameraEase = index % 3 === 0 ? EASE_OUT : EASE_IN_OUT;
  const scale = interpolate(frame, [0, dur], camera.scale, { extrapolateRight: 'clamp', easing: cameraEase });
  const x = interpolate(frame, [0, dur], camera.x, { extrapolateRight: 'clamp', easing: cameraEase });
  const y = interpolate(frame, [0, dur], camera.y, { extrapolateRight: 'clamp', easing: cameraEase });
  const rotate = interpolate(frame, [0, dur], camera.rotate, { extrapolateRight: 'clamp', easing: cameraEase });
  const handheldX = Math.sin(frame / 43) * 1.8 + Math.sin(frame / 11.7) * 0.5;
  const handheldY = Math.cos(frame / 57) * 1.6;
  const shakeAmp = storm * (index === 2 ? 46 : 7) * interpolate(frame, [0, 5], [0.2, 1], { extrapolateRight: 'clamp' });
  const shakeX = (Math.sin(frame * 2.6) + Math.sin(frame * 6.9) * 0.55 + Math.sin(frame * 13.1) * 0.25) * shakeAmp;
  const shakeY = (Math.cos(frame * 3.1) + Math.cos(frame * 7.7) * 0.5 + Math.sin(frame * 11.3) * 0.22) * shakeAmp * 0.72;
  const shakeRotate = (Math.sin(frame * 1.9) + Math.sin(frame * 5.3) * 0.45) * shakeAmp * 0.07;
  const shakeScale = 1 + Math.abs(Math.sin(frame * 0.83)) * storm * 0.012;
  const fadeOut = index === 0 ? interpolate(frame, [dur - 24, dur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 1;
  const dipIn = interpolate(frame, [0, 6], [1, 0], { extrapolateRight: 'clamp' });
  const dipOut = index === SCENES.length - 1 ? 0 : interpolate(frame, [dur - 7, dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const dip = Math.max(dipIn, dipOut) * 0.72;
  const wind = index === 2 ? Math.sin(frame / 6) * 5 + Math.sin(frame / 14) * 2.5 + Math.sin(frame * 1.7) * 0.8 : 0;
  const words = text.split(' ');
  const headerOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
  const wordGap = Math.min(6, Math.max(2.4, (dur * 0.36) / Math.max(1, words.length)));
  const titleSize = text.length > 38 ? 60 : text.length > 28 ? 66 : 74;
  const progress = clamp01((start + frame) / durationInFrames);

  return (
    <AbsoluteFill data-scene={`scene-${index}`} style={{ background: BACKGROUNDS[index], overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `translate(${x + handheldX + shakeX}px, ${y + handheldY + shakeY}px) rotate(${rotate + shakeRotate}deg) scale(${scale * shakeScale})`, transformOrigin: camera.origin, overflow: 'hidden' }}>
        <Dunes />
        <Sun frame={frame} intensity={SUN[index]} />
        <HeatHaze frame={frame} intensity={index === 2 ? 0.3 : 0.4 + heat * 0.35} />
        <Heatwaves frame={frame} intensity={heat} />
        <Footprints opacity={TRAIL[index]} />
        {index >= 1 && index <= 6 ? <WaterBottle frame={frame} level={WATER[index]} tip={index === 4 ? -20 : 0} /> : null}
        {index === 5 ? <Helicopter frame={frame} dur={dur} /> : null}
        {index === 7 ? <Oasis frame={frame} /> : null}
        {index === 8 ? <Camp /> : null}
        <StickFigure pose={POSES[index]} frame={frame} left={FIGURE_X[index]} opacity={fadeOut} seed={index} wind={wind} />
      </AbsoluteFill>

      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 54%, transparent 34%, rgba(0,0,0,0.52) 100%)' }} />
      <Dust frame={frame} intensity={storm} />

      <div style={{ position: 'absolute', left: SAFE_BOX.x, top: SAFE_BOX.y + 4, width: SAFE_BOX.width, height: 3, borderRadius: 2, background: 'rgba(245,158,11,0.18)', zIndex: 13 }}>
        <div style={{ width: `${progress * 100}%`, height: '100%', borderRadius: 2, background: ACCENT, boxShadow: '0 0 10px rgba(245,158,11,0.65)' }} />
      </div>

      <div data-el="title" data-kind="content" style={{ position: 'absolute', left: SAFE_BOX.x, top: 520, width: SAFE_BOX.width, textAlign: 'center', zIndex: 10 }}>
        <div style={{ color: ACCENT, fontSize: 28, fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: 6, marginBottom: 20, opacity: headerOpacity }}>
          {index === 0 || index === SCENES.length - 1 ? '@midnightfiles' : `SAHARA / ${String(index).padStart(2, '0')}`}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 0.28em', color: 'white', fontSize: titleSize, fontWeight: 900, fontFamily: 'system-ui', lineHeight: 1.08 }}>
          {words.map((word, i) => (
            <Word key={`${word}-${i}`} word={word} at={2 + i * wordGap} accent={KEYWORDS.has(clean(word))} />
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', inset: 0, background: '#140a03', opacity: dip, pointerEvents: 'none', zIndex: 20 }} />
    </AbsoluteFill>
  );
};

export const Reel: React.FC<ReelProps> = ({ brand = myBrand, debugSafeZones, probe }) => {
  return (
    <ReelFrame brand={brand} audio={AUDIO} debugSafeZones={debugSafeZones} probe={probe}>
      {SCENES.map((s, i) => (
        <Sequence key={i} from={s.start} durationInFrames={s.dur}>
          <Scene text={s.text} index={i} dur={s.dur} start={s.start} />
        </Sequence>
      ))}
    </ReelFrame>
  );
};
export default Reel;
