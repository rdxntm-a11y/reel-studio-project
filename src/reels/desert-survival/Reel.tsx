import React from 'react';
import { AbsoluteFill, Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont as loadSerif } from '@remotion/google-fonts/CormorantGaramond';
import { ReelFrame, type ReelProps } from '../../components';
import { brand as myBrand } from '../../brand';
import { FPS, SAFE_BOX } from '../../layout';
import { timing } from '../../timing';
import timedWords from '../../../public/reels/desert-survival/captions.words.json';

const SERIF = loadSerif('normal', { weights: ['600', '700'], subsets: ['latin'] }).fontFamily;
const ACCENT = '#ffb347';
export const AUDIO = 'reels/desert-survival/vo.wav';

const EASE_IN_OUT = Easing.bezier(0.77, 0, 0.175, 1);
const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

type Vec = { x: number; y: number };
type Pose = 'sprint' | 'run' | 'brace' | 'search' | 'drink' | 'lookup' | 'fall' | 'crawl' | 'wave' | 'walk' | 'despair' | 'cheer';
type GradeKey = 'scorch' | 'storm' | 'ash' | 'shrine' | 'collapse' | 'oasis' | 'gold' | 'end';

type Camera = {
  scale: [number, number];
  x: [number, number];
  y: [number, number];
  rotate: [number, number];
  origin: string;
};

type Pal = {
  base: string;
  sky: [string, string, string, string, string];
  dune: [string, string, string, string];
  fore: [string, string];
  light: string;
  light2: string;
  glow: string;
  accent: string;
  paper: string;
  skyShade: string;
  duneShade: string;
  foreShade: string;
  figure: string;
  figureLit: string;
  figureShade: string;
};

type SceneCue = {
  text: string;
  cue: number;
  pose: Pose;
  grade: GradeKey;
  storm: number;
  sun: number;
  water: number;
  heat: number;
  trail: number;
  figureX: number;
  impact: number;
  impactAt: number;
  whip: boolean;
  exhaustion: number;
};

const PALETTES: Record<GradeKey, Pal> = {
  scorch: {
    base: '#5a2a12',
    sky: ['#6b2c12', '#8f3f16', '#b85a1e', '#d98330', '#e8a24a'],
    dune: ['#e0a04a', '#bd7c34', '#8a5122', '#4a2811'],
    fore: ['#2a1408', '#180b04'],
    light: '#ffd88a', light2: '#f2ac4c', glow: '#fff3cf',
    accent: '#ffb347', paper: '#f6e7c8',
    skyShade: '#4a2110', duneShade: '#3a1e0c', foreShade: '#100702',
    figure: '#1b0d05', figureLit: '#f4b768', figureShade: '#0c0502'
  },
  storm: {
    base: '#243433',
    sky: ['#23302f', '#334542', '#485c56', '#607068', '#7c877a'],
    dune: ['#8b8f78', '#69705c', '#464e40', '#252d27'],
    fore: ['#161d19', '#0b0f0c'],
    light: '#c6cbb2', light2: '#9aa793', glow: '#eef0dd',
    accent: '#f0b45e', paper: '#e9e7d8',
    skyShade: '#1a2423', duneShade: '#1f2721', foreShade: '#080b09',
    figure: '#0f1512', figureLit: '#c8cdb6', figureShade: '#060907'
  },
  ash: {
    base: '#3a3a30',
    sky: ['#31312a', '#45463a', '#5d5c4b', '#78745e', '#918a6f'],
    dune: ['#a49a78', '#7f775c', '#57523f', '#302d23'],
    fore: ['#1c1a14', '#0e0d09'],
    light: '#e2d7b2', light2: '#b3a786', glow: '#f6edce',
    accent: '#e2ad5c', paper: '#ece4cd',
    skyShade: '#27261f', duneShade: '#28261d', foreShade: '#0a0906',
    figure: '#14130e', figureLit: '#d9cda8', figureShade: '#080705'
  },
  shrine: {
    base: '#1b3031',
    sky: ['#142426', '#1f3435', '#2d4644', '#3e5953', '#546b60'],
    dune: ['#77806c', '#586253', '#3a463c', '#1e2924'],
    fore: ['#0e1714', '#060c09'],
    light: '#b9c9b0', light2: '#87a091', glow: '#e6ecd7',
    accent: '#e8a854', paper: '#dfe4d3',
    skyShade: '#101c1d', duneShade: '#18231e', foreShade: '#040806',
    figure: '#0a100d', figureLit: '#c2d0b8', figureShade: '#040705'
  },
  collapse: {
    base: '#3a2416',
    sky: ['#2a1912', '#3c261a', '#543522', '#6e482d', '#855c38'],
    dune: ['#9a6338', '#7a4a2a', '#53331d', '#2b1a0e'],
    fore: ['#170c06', '#0a0402'],
    light: '#d9a267', light2: '#b07c46', glow: '#f2d3a4',
    accent: '#e2a257', paper: '#ecdcc0',
    skyShade: '#22130d', duneShade: '#25150a', foreShade: '#080301',
    figure: '#120a05', figureLit: '#d9a267', figureShade: '#070302'
  },
  oasis: {
    base: '#8a6420',
    sky: ['#7a5618', '#a47628', '#c9953e', '#e3b95d', '#f0cf80'],
    dune: ['#e7bc62', '#c5963f', '#936d2b', '#4e3915'],
    fore: ['#271b09', '#130c04'],
    light: '#ffe9a6', light2: '#f3c95e', glow: '#fff5cf',
    accent: '#ffcf6b', paper: '#f8edcd',
    skyShade: '#624311', duneShade: '#3c2a0d', foreShade: '#0e0803',
    figure: '#1b1206', figureLit: '#ffe0a0', figureShade: '#0b0703'
  },
  gold: {
    base: '#8c641d',
    sky: ['#7d5816', '#a97a27', '#cb9b3e', '#e6bf61', '#f2d489'],
    dune: ['#e7bd62', '#c69a41', '#96702c', '#513b16'],
    fore: ['#281c09', '#140d04'],
    light: '#ffeaa8', light2: '#f5cd65', glow: '#fff6d2',
    accent: '#ffd473', paper: '#f9eecd',
    skyShade: '#654610', duneShade: '#3e2b0e', foreShade: '#0f0903',
    figure: '#1c1206', figureLit: '#ffe6a6', figureShade: '#0c0703'
  },
  end: {
    base: '#a97a24',
    sky: ['#8e6418', '#b98a2c', '#dbaa47', '#f0cc72', '#fbe19a'],
    dune: ['#f0c96e', '#d3a64c', '#a67c34', '#5a421a'],
    fore: ['#2c1e0a', '#160f04'],
    light: '#fff0b8', light2: '#ffd97a', glow: '#fffbe0',
    accent: '#ffe08a', paper: '#fbf3d8',
    skyShade: '#715011', duneShade: '#443016', foreShade: '#110b03',
    figure: '#1e1407', figureLit: '#ffefb5', figureShade: '#0d0803'
  }
};

const CUES: SceneCue[] = [
  { text: 'I ran the Sahara. It swallowed me.', cue: 0, pose: 'sprint', grade: 'scorch', storm: 0.12, sun: 1, water: 0.92, heat: 0.55, trail: 0.5, figureX: 370, impact: 0, impactAt: 0, whip: false, exhaustion: 0 },
  { text: '1994. 250 km of Morocco.', cue: 8, pose: 'run', grade: 'scorch', storm: 0.08, sun: 1, water: 0.84, heat: 0.7, trail: 0.84, figureX: 370, impact: 0, impactAt: 0, whip: false, exhaustion: 0.15 },
  { text: 'Day 4. The sandstorm hit.', cue: 17, pose: 'brace', grade: 'storm', storm: 1, sun: 0.12, water: 0.68, heat: 0.1, trail: 0.96, figureX: 370, impact: 1, impactAt: 3, whip: true, exhaustion: 0.45 },
  { text: 'Half a bottle. Then nothing.', cue: 36, pose: 'search', grade: 'ash', storm: 0.5, sun: 0.3, water: 0.5, heat: 0.6, trail: 0.92, figureX: 370, impact: 0, impactAt: 0, whip: false, exhaustion: 0.7 },
  { text: 'I drank my own urine.', cue: 43, pose: 'drink', grade: 'ash', storm: 0.28, sun: 0.24, water: 0.26, heat: 0.9, trail: 0.88, figureX: 370, impact: 0, impactAt: 0, whip: false, exhaustion: 0.85 },
  { text: "Bats' blood in a desert shrine.", cue: 48, pose: 'despair', grade: 'shrine', storm: 0.12, sun: 0.18, water: 0.1, heat: 0.95, trail: 0.8, figureX: 370, impact: 0, impactAt: 0, whip: false, exhaustion: 0.95 },
  { text: 'The helicopter did not see me.', cue: 59, pose: 'lookup', grade: 'shrine', storm: 0.1, sun: 0.24, water: 0.08, heat: 0.9, trail: 0.7, figureX: 370, impact: 0, impactAt: 0, whip: false, exhaustion: 1 },
  { text: 'My blood was too thick to drain.', cue: 69, pose: 'fall', grade: 'collapse', storm: 0.16, sun: 0.1, water: 0, heat: 0.5, trail: 0.5, figureX: 260, impact: 1, impactAt: 16, whip: false, exhaustion: 0.9 },
  { text: 'It would not drain. I woke alive.', cue: 83, pose: 'despair', grade: 'collapse', storm: 0.12, sun: 0.16, water: 0, heat: 0.4, trail: 0.3, figureX: 300, impact: 0, impactAt: 0, whip: false, exhaustion: 0.85 },
  { text: 'Day 8. An oasis.', cue: 91, pose: 'crawl', grade: 'oasis', storm: 0.06, sun: 1, water: 0, heat: 0.35, trail: 0, figureX: 330, impact: 0, impactAt: 0, whip: false, exhaustion: 0.8 },
  { text: 'A nomad camp in Algeria.', cue: 98, pose: 'wave', grade: 'oasis', storm: 0.05, sun: 0.9, water: 0, heat: 0.3, trail: 0, figureX: 370, impact: 0, impactAt: 0, whip: false, exhaustion: 0.5 },
  { text: '291 km off course. 16 kg lighter.', cue: 109, pose: 'walk', grade: 'gold', storm: 0.08, sun: 0.85, water: 0, heat: 0.35, trail: 0.25, figureX: 370, impact: 0, impactAt: 0, whip: false, exhaustion: 0.55 },
  { text: 'Ten days lost. One failed escape.', cue: 116, pose: 'despair', grade: 'gold', storm: 0.14, sun: 0.7, water: 0, heat: 0.3, trail: 0.2, figureX: 370, impact: 0, impactAt: 0, whip: false, exhaustion: 0.6 },
  { text: 'Follow for more survival stories', cue: 122, pose: 'cheer', grade: 'end', storm: 0.04, sun: 1, water: 0, heat: 0.25, trail: 0, figureX: 370, impact: 0, impactAt: 0, whip: false, exhaustion: 0.15 }
];

const t = timing(timedWords);
export const durationInFrames = t.duration(1.2);

const SCENES = CUES.map((c, i) => {
  const start = i === 0 ? 0 : t.at(c.cue);
  const next = CUES[i + 1] ? t.at(CUES[i + 1].cue) : durationInFrames;
  return { ...c, start, dur: Math.max(1, next - start) };
});

const CAMERAS: Camera[] = [
  { scale: [1.03, 1.16], x: [-12, 16], y: [0, -10], rotate: [-1, 1], origin: '52% 68%' },
  { scale: [1.16, 1.05], x: [18, -10], y: [-8, 0], rotate: [1, -0.5], origin: '50% 66%' },
  { scale: [1.06, 1.22], x: [34, -30], y: [0, 16], rotate: [-2, 2], origin: '48% 72%' },
  { scale: [1.14, 1.04], x: [-14, 8], y: [6, -4], rotate: [1, -1], origin: '55% 70%' },
  { scale: [1.03, 1.14], x: [8, -6], y: [0, -6], rotate: [-0.5, 0.5], origin: '42% 74%' },
  { scale: [1.06, 1.12], x: [-6, 12], y: [-4, -18], rotate: [0, -1], origin: '50% 68%' },
  { scale: [1.2, 1.03], x: [0, 0], y: [-10, 4], rotate: [1, -0.5], origin: '50% 70%' },
  { scale: [1.02, 1.13], x: [10, -14], y: [0, -6], rotate: [-0.5, 0.8], origin: '58% 70%' },
  { scale: [1.12, 1.04], x: [-12, 10], y: [4, 0], rotate: [0.8, -0.8], origin: '46% 68%' },
  { scale: [1.03, 1.12], x: [12, -8], y: [0, 6], rotate: [-0.5, 0.5], origin: '50% 72%' },
  { scale: [1.14, 1.04], x: [0, 14], y: [-6, 2], rotate: [1, -1], origin: '50% 72%' },
  { scale: [1.04, 1.12], x: [-8, 0], y: [0, -8], rotate: [0, 1], origin: '50% 66%' },
  { scale: [1.16, 1.04], x: [8, -4], y: [-4, 0], rotate: [0.6, -0.6], origin: '50% 70%' },
  { scale: [1.04, 1.12], x: [-6, 0], y: [0, -6], rotate: [-0.5, 0.5], origin: '50% 66%' }
];

const KEYWORDS = new Set(['swallowed', 'sandstorm', 'urine', 'blood', 'drain', 'alive', 'oasis', 'algeria', 'lost', 'escape', 'follow']);
const clean = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const rand = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const snapSwing = (phase: number) => {
  const s = Math.sin(phase);
  return Math.sign(s) * Math.pow(Math.abs(s), 0.82);
};
const bandColor = (arr: readonly string[], at: number, seed: number) => {
  const jitter = (rand(seed) - 0.5) * 0.85;
  const idx = Math.max(0, Math.min(arr.length - 1, Math.floor(clamp01(at) * arr.length + jitter)));
  return arr[idx];
};

type KnifeStroke = {
  x: number;
  y: number;
  len: number;
  wid: number;
  ang: number;
  fill: string;
  shade: string;
  light: string;
  ridge: number;
};

const knifePath = (len: number, wid: number) => {
  const l = len / 2;
  const w = wid / 2;
  return `M ${-l} ${-w * 0.55} C ${-l * 0.55} ${-w} ${l * 0.1} ${-w * 0.92} ${l * 0.72} ${-w * 0.5} L ${l} 0 L ${l * 0.72} ${w * 0.5} C ${l * 0.1} ${w * 0.92} ${-l * 0.55} ${w} ${-l} ${w * 0.55} Q ${-l * 1.06} 0 ${-l} ${-w * 0.55} Z`;
};

const knifeRidge = (len: number, wid: number) => {
  const l = len / 2;
  const w = wid / 2;
  return `M ${-l * 0.72} ${-w * 0.42} C ${-l * 0.2} ${-w * 0.72} ${l * 0.25} ${-w * 0.7} ${l * 0.66} ${-w * 0.38}`;
};

const makeSky = (pal: Pal, seed: number): KnifeStroke[] => {
  const out: KnifeStroke[] = [];
  const rows = 13;
  let id = seed * 701 + 11;
  for (let r = 0; r < rows; r += 1) {
    const at = r / (rows - 1);
    const y = -100 + at * 1040;
    const baseLen = 150 - at * 62;
    const baseWid = 46 - at * 18;
    for (let x = -170; x < 1460; x += baseLen * (0.62 + rand(id) * 0.22)) {
      out.push({
        x: x + (rand(id + 3) - 0.5) * 40,
        y: y + (rand(id + 4) - 0.5) * 34,
        len: baseLen * (0.8 + rand(id + 1) * 0.55),
        wid: baseWid * (0.75 + rand(id + 2) * 0.5),
        ang: (rand(id + 5) - 0.5) * 12 + (at - 0.5) * 8,
        fill: bandColor(pal.sky, at, id + 6),
        shade: pal.skyShade,
        light: pal.light,
        ridge: 0.18 + rand(id + 7) * 0.35
      });
      id += 9;
    }
  }
  for (let i = 0; i < 12; i += 1) {
    const at = 0.84 + rand(id) * 0.16;
    out.push({
      x: -120 + rand(id + 1) * 1560,
      y: 800 + rand(id + 2) * 150,
      len: 260 + rand(id + 3) * 220,
      wid: 28 + rand(id + 4) * 34,
      ang: (rand(id + 5) - 0.5) * 6,
      fill: bandColor(pal.sky, at, id + 6),
      shade: pal.skyShade,
      light: pal.light,
      ridge: 0.25
    });
    id += 9;
  }
  return out;
};

const makeLight = (pal: Pal, seed: number): KnifeStroke[] => {
  const out: KnifeStroke[] = [];
  let id = seed * 809 + 300;
  const cx = 930;
  const cy = 300;
  for (let ring = 0; ring < 3; ring += 1) {
    const n = 10 - ring * 3;
    for (let i = 0; i < n; i += 1) {
      const a = (i / n) * Math.PI * 2 + rand(id) * 0.6 + ring * 0.3;
      const r = 38 + ring * 58 + rand(id + 1) * 34;
      out.push({
        x: cx + Math.cos(a) * r,
        y: cy + Math.sin(a) * r * 0.78,
        len: 70 + rand(id + 2) * 96,
        wid: 18 + rand(id + 3) * 22,
        ang: (a * 180) / Math.PI,
        fill: ring === 0 ? pal.glow : pal.light,
        shade: pal.light2,
        light: pal.glow,
        ridge: 0.45 + rand(id + 4) * 0.3
      });
      id += 6;
    }
  }
  for (let i = 0; i < 18; i += 1) {
    const w = 90 + rand(id + 1) * 280;
    out.push({
      x: cx - w / 2 + rand(id + 2) * 90,
      y: 898 + i * 12 + rand(id) * 12,
      len: w,
      wid: 8 + rand(id + 3) * 10,
      ang: 1 + rand(id + 4) * 3,
      fill: pal.light,
      shade: pal.light2,
      light: pal.glow,
      ridge: 0.4
    });
    id += 7;
  }
  return out;
};

const makeDunes = (pal: Pal, seed: number): KnifeStroke[] => {
  const out: KnifeStroke[] = [];
  let id = seed * 913 + 600;
  for (let b = 0; b < 3; b += 1) {
    const baseY = 960 + b * 178;
    const freq = 0.0058 + b * 0.0012;
    const phase = b * 2.1 + rand(seed * 17 + b) * 3;
    for (let x = -180; x < 1500; x += 62) {
      const wave = Math.sin(x * freq + phase) * 54 + Math.sin(x * 0.0141 + phase * 0.7) * 20;
      const ridgeY = baseY + wave;
      const slope = Math.cos(x * freq + phase) * 54 * freq + Math.cos(x * 0.0141 + phase * 0.7) * 20 * 0.0141;
      const ang = (Math.atan(slope) * 180) / Math.PI;
      const wid = 34 + rand(id) * 26;
      out.push({
        x,
        y: ridgeY + wid * 0.55,
        len: 110 + rand(id + 1) * 100,
        wid,
        ang: ang + (rand(id + 2) - 0.5) * 10,
        fill: bandColor(pal.dune, b / 3 + (rand(id + 3) - 0.5) * 0.18, id + 3),
        shade: pal.duneShade,
        light: pal.light,
        ridge: 0.2 + rand(id + 4) * 0.35
      });
      out.push({
        x,
        y: ridgeY + wid * 1.18,
        len: 150 + rand(id + 5) * 130,
        wid: wid * 0.85,
        ang: ang + (rand(id + 6) - 0.5) * 8,
        fill: pal.duneShade,
        shade: pal.duneShade,
        light: pal.light2,
        ridge: 0.12
      });
      id += 8;
    }
  }
  return out;
};

const makeFore = (pal: Pal, seed: number): KnifeStroke[] => {
  const out: KnifeStroke[] = [];
  let id = seed * 1013 + 900;
  for (let x = -220; x < 1520; x += 96) {
    const wid = 60 + rand(id + 1) * 54;
    out.push({
      x,
      y: 1580 + rand(id) * 230,
      len: 190 + rand(id + 2) * 190,
      wid,
      ang: -16 + rand(id + 3) * 26,
      fill: pal.fore[rand(id + 4) > 0.35 ? 0 : 1],
      shade: pal.foreShade,
      light: pal.dune[0],
      ridge: 0.1 + rand(id + 5) * 0.12
    });
    id += 6;
  }
  for (let x = -260; x < 1560; x += 150) {
    out.push({
      x,
      y: 1900 + rand(id) * 190,
      len: 260 + rand(id + 1) * 210,
      wid: 90 + rand(id + 2) * 62,
      ang: -8 + rand(id + 3) * 18,
      fill: pal.fore[1],
      shade: pal.foreShade,
      light: pal.dune[1],
      ridge: 0.08
    });
    id += 5;
  }
  return out;
};

type Plate = { sky: KnifeStroke[]; light: KnifeStroke[]; dunes: KnifeStroke[]; fore: KnifeStroke[] };

const PLATES: Plate[] = CUES.map((c, i) => {
  const pal = PALETTES[c.grade];
  return {
    sky: makeSky(pal, i + 1),
    light: makeLight(pal, i + 1),
    dunes: makeDunes(pal, i + 1),
    fore: makeFore(pal, i + 1)
  };
});

const Knife: React.FC<{ s: KnifeStroke; opacity?: number }> = ({ s, opacity = 1 }) => (
  <g transform={`translate(${s.x} ${s.y}) rotate(${s.ang})`} opacity={opacity}>
    <path d={knifePath(s.len, s.wid)} fill={s.shade} transform={`translate(${s.wid * 0.09} ${s.wid * 0.14})`} />
    <path d={knifePath(s.len, s.wid)} fill={s.fill} />
    <path d={knifeRidge(s.len, s.wid)} fill="none" stroke={s.light} strokeWidth={Math.max(1, s.wid * 0.1)} strokeLinecap="round" opacity={s.ridge} />
  </g>
);

const SkyLayer: React.FC<{ index: number; pal: Pal }> = ({ index, pal }) => {
  const p = PLATES[index];
  return (
    <svg viewBox="0 0 1360 2120" width={1360} height={2120} style={{ position: 'absolute', left: 0, top: 0 }}>
      <rect width="1360" height="2120" fill={pal.base} />
      {p.sky.map((s, i) => (
        <Knife key={`sky-${i}`} s={s} />
      ))}
      {p.light.map((s, i) => (
        <Knife key={`light-${i}`} s={s} opacity={0.9} />
      ))}
    </svg>
  );
};

const DuneLayer: React.FC<{ index: number }> = ({ index }) => (
  <svg viewBox="0 0 1360 2120" width={1360} height={2120} style={{ position: 'absolute', left: 0, top: 0 }}>
    {PLATES[index].dunes.map((s, i) => (
      <Knife key={`dune-${i}`} s={s} />
    ))}
  </svg>
);

const ForeLayer: React.FC<{ index: number }> = ({ index }) => (
  <svg viewBox="0 0 1360 2120" width={1360} height={2120} style={{ position: 'absolute', left: 0, top: 0 }}>
    {PLATES[index].fore.map((s, i) => (
      <Knife key={`fore-${i}`} s={s} />
    ))}
  </svg>
);

const Storm: React.FC<{ frame: number; intensity: number; pal: Pal }> = ({ frame, intensity, pal }) => {
  if (intensity < 0.22) return null;
  const strokes: KnifeStroke[] = [];
  for (let i = 0; i < 30; i += 1) {
    const speed = 10 + rand(i + 3) * 26;
    strokes.push({
      x: ((rand(i) * 1900 + frame * speed) % 2100) - 500,
      y: rand(i + 1) * 1900 - 40,
      len: 180 + rand(i + 2) * 330,
      wid: 12 + rand(i + 4) * 26,
      ang: -28 + rand(i + 5) * 16,
      fill: i % 5 === 0 ? pal.light : pal.skyShade,
      shade: pal.skyShade,
      light: pal.light,
      ridge: 0.22
    });
  }
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: 'absolute', inset: 0, opacity: intensity * 0.6 }}>
      {strokes.map((s, i) => (
        <Knife key={`storm-${i}`} s={s} opacity={i % 5 === 0 ? 0.5 : 0.75} />
      ))}
    </svg>
  );
};

const HeatShimmer: React.FC<{ frame: number; intensity: number; pal: Pal }> = ({ frame, intensity, pal }) => {
  if (intensity < 0.42) return null;
  const strokes: KnifeStroke[] = [];
  for (let i = 0; i < 10; i += 1) {
    strokes.push({
      x: 540 + Math.sin(frame / 34 + i * 0.8) * 150 + (rand(i) - 0.5) * 500,
      y: 860 + i * 34 + Math.sin(frame / 21 + i) * 10,
      len: 120 + rand(i + 1) * 260,
      wid: 6 + rand(i + 2) * 8,
      ang: (rand(i + 3) - 0.5) * 3,
      fill: pal.glow,
      shade: pal.light2,
      light: pal.glow,
      ridge: 0.5
    });
  }
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: 'absolute', inset: 0, opacity: intensity * 0.22, mixBlendMode: 'screen' }}>
      {strokes.map((s, i) => (
        <Knife key={`heat-${i}`} s={s} />
      ))}
    </svg>
  );
};

const RakingLight: React.FC<{ pal: Pal; sun: number; heat: number }> = ({ pal, sun, heat }) => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(ellipse at 74% 16%, ${pal.glow} 0%, transparent 52%)`,
        opacity: 0.16 + sun * 0.2,
        mixBlendMode: 'screen'
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(ellipse at 50% 92%, ${pal.accent} 0%, transparent 58%)`,
        opacity: 0.08 + heat * 0.1,
        mixBlendMode: 'screen'
      }}
    />
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 52%, transparent 44%, rgba(0,0,0,0.44) 100%)' }} />
  </AbsoluteFill>
);

const ImpactChips: React.FC<{ frame: number; at: number; intensity: number; figureX: number; pal: Pal }> = ({ frame, at, intensity, figureX, pal }) => {
  const age = frame - at;
  if (intensity <= 0 || age < 0 || age > 26) return null;
  const p = age / 26;
  const strokes: KnifeStroke[] = [];
  for (let i = 0; i < 18; i += 1) {
    const a = (i / 18) * Math.PI * 2 + rand(i + 31);
    const dist = (24 + rand(i + 32) * 140) * Math.pow(p, 0.62);
    strokes.push({
      x: figureX + 170 + Math.cos(a) * dist,
      y: 1370 - Math.sin(a) * dist * 0.5 + p * p * 90,
      len: 18 + rand(i + 33) * 40,
      wid: 8 + rand(i + 34) * 16,
      ang: (a * 180) / Math.PI,
      fill: pal.dune[0],
      shade: pal.duneShade,
      light: pal.light,
      ridge: 0.35
    });
  }
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: 'absolute', inset: 0, opacity: (1 - p) * intensity * 0.85 }}>
      {strokes.map((s, i) => (
        <Knife key={`chip-${i}`} s={s} />
      ))}
    </svg>
  );
};

const PaintWipe: React.FC<{ frame: number; pal: Pal }> = ({ frame, pal }) => {
  if (frame > 9) return null;
  const p = clamp01(frame / 9);
  const strokes: KnifeStroke[] = [];
  for (let i = 0; i < 7; i += 1) {
    const dir = i % 2 === 0 ? 1 : -1;
    strokes.push({
      x: 540 + dir * p * (900 + i * 70),
      y: 120 + i * 290,
      len: 1500,
      wid: 320 - i * 16,
      ang: dir * (2 + i),
      fill: i === 2 || i === 4 ? pal.accent : i % 3 === 0 ? pal.skyShade : pal.sky[1],
      shade: pal.skyShade,
      light: pal.light,
      ridge: 0.18
    });
  }
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: 'absolute', inset: 0, opacity: 1 - p * 0.9 }}>
      {strokes.map((s, i) => (
        <Knife key={`wipe-${i}`} s={s} />
      ))}
    </svg>
  );
};

const PaintedProgress: React.FC<{ progress: number; pal: Pal }> = ({ progress, pal }) => (
  <div style={{ position: 'absolute', left: SAFE_BOX.x, top: SAFE_BOX.y + 4, width: SAFE_BOX.width, height: 6, zIndex: 14 }}>
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.28)', borderRadius: 4 }} />
    <div
      style={{
        width: `${progress * 100}%`,
        height: '100%',
        borderRadius: 4,
        background: pal.accent,
        boxShadow: `0 0 12px ${pal.accent}99`,
        transform: 'rotate(-0.35deg)'
      }}
    />
  </div>
);

const getGeometry = (pose: Pose, frame: number, exhaustion = 0) => {
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
    const cfg =
      pose === 'sprint'
        ? { speed: 3, reach: 29, lean: -17, bob: 10 }
        : pose === 'run'
          ? { speed: 4.5, reach: 22, lean: -10 - exhaustion * 4, bob: 7 + exhaustion * 2 }
          : { speed: 10 - exhaustion * 2, reach: 12, lean: -7 - exhaustion * 10, bob: 4 + exhaustion * 8 };
    const phase = frame / cfg.speed;
    const s = snapSwing(phase);
    const trail = snapSwing(phase - 0.42);
    const armReach = trail * cfg.reach * (1 - exhaustion * 0.35);
    const legReach = trail * cfg.reach * 1.2;
    const drag = pose === 'walk' ? exhaustion : 0;
    return {
      ...stand,
      head: { ...stand.head, y: stand.head.y + exhaustion * 3 },
      eyes: [{ x: 94, y: 50 + exhaustion * 3 }, { x: 106, y: 50 + exhaustion * 3 }],
      lean: cfg.lean + Math.sin(phase - 0.55) * 2.4,
      bob: -Math.abs(Math.sin(phase)) * cfg.bob,
      arms: [
        { points: [{ x: 100, y: 84 }, { x: 82 - s * cfg.reach * 0.5, y: 98 + exhaustion * 5 }, { x: 64 - armReach, y: 112 + exhaustion * 9 }] },
        { points: [{ x: 100, y: 84 }, { x: 118 + s * cfg.reach * 0.5, y: 98 + exhaustion * 5 }, { x: 136 + armReach, y: 112 + exhaustion * 9 }] }
      ],
      legs: [
        { points: [{ x: 100, y: 118 }, { x: 88 + s * cfg.reach * 0.5, y: 142 }, { x: 76 + legReach, y: 168 + drag * 6 }] },
        { points: [{ x: 100, y: 118 }, { x: 112 - s * cfg.reach * 0.5, y: 142 + drag * 3 }, { x: 124 - legReach, y: 168 + drag * 2 }] }
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
      ]
    };
  }

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
};

const blinkCurve = (local: number) => {
  if (local < 0) return 1;
  if (local < 4) return 1 - local / 4;
  if (local < 5) return 0;
  if (local < 11) return (local - 5) / 6;
  return 1;
};

const blinkOpenness = (frame: number, seed: number) => {
  const period = 104 + Math.floor(rand(seed * 21 + 1) * 28);
  const offset = Math.floor(rand(seed * 22 + 2) * period);
  const cycle = Math.floor((frame + offset) / period);
  let openness = 1;
  for (let c = cycle - 1; c <= cycle + 1; c += 1) {
    const jitter = Math.floor((rand(seed * 13 + c + 23) - 0.5) * 18);
    const start = c * period + offset + jitter;
    openness = Math.min(openness, blinkCurve(frame - start));
    if (rand(seed * 7 + c + 24) > 0.68) {
      openness = Math.min(openness, blinkCurve(frame - start - 24));
    }
  }
  return openness;
};

const Limb: React.FC<{ points: Vec[]; pal: Pal; width?: number }> = ({ points, pal, width = 15 }) => {
  const pts = points.map((p) => `${p.x},${p.y}`).join(' ');
  return (
    <>
      <polyline points={pts} fill="none" stroke={pal.figureShade} strokeWidth={width + 4} strokeLinecap="round" strokeLinejoin="round" transform="translate(1.6 2.2)" opacity={0.7} />
      <polyline points={pts} fill="none" stroke={pal.figure} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={pts} fill="none" stroke={pal.figureLit} strokeWidth={Math.max(2.4, width * 0.24)} strokeLinecap="round" strokeLinejoin="round" transform="translate(-1.3 -1.4)" opacity={0.72} />
    </>
  );
};

const PaintedFigure: React.FC<{
  pose: Pose;
  frame: number;
  left: number;
  opacity: number;
  seed: number;
  wind?: number;
  impact?: number;
  impactAt?: number;
  exhaustion?: number;
  pal: Pal;
}> = ({ pose, frame, left, opacity, seed, wind = 0, impact = 0, impactAt = 0, exhaustion = 0, pal }) => {
  const { fps } = useVideoConfig();
  const g = getGeometry(pose, frame, exhaustion);
  const settle = spring({ frame, fps, config: { damping: 9, stiffness: 125, mass: 0.85 } });
  const breath = Math.sin((frame / 120) * Math.PI * 2);
  const chestLift = -breath * 0.9 * (1 + exhaustion * 0.5);
  const chestScale = 1 + breath * 0.014 * (1 + exhaustion * 0.8);
  const moving = pose === 'sprint' || pose === 'run' || pose === 'walk';
  const nervous = pose === 'brace';
  const scared = nervous || pose === 'fall' || pose === 'crawl';
  const tired = pose === 'despair' || pose === 'drink';
  const sway = moving ? 0 : Math.sin((frame / 132) * Math.PI * 2) * (nervous ? 0.25 : 0.55);
  const blink = blinkOpenness(frame, seed);
  const sinceImpact = Math.max(0, frame - impactAt);
  const decay = Math.exp(-sinceImpact / 5);
  const wobble = Math.cos(sinceImpact * 1.9);
  const squashY = 1 - impact * 0.26 * decay * wobble;
  const squashX = 1 + impact * 0.18 * decay * wobble;
  const jolt = impact * Math.sin(sinceImpact * 2.7) * 4 * decay;
  const enterY = (1 - settle) * -22;
  const enterScale = 0.92 + 0.08 * settle;
  const eyeRy = Math.max(0.35, 2.2 * blink);

  return (
    <svg
      data-el="figure"
      width={340}
      height={340}
      viewBox="0 0 200 200"
      style={{ position: 'absolute', left, bottom: 430, opacity, filter: 'drop-shadow(0 14px 10px rgba(0,0,0,0.42))' }}
    >
      <g transform={`translate(100 176) scale(${squashX} ${squashY}) translate(-100 -176)`}>
        <g transform={`translate(${wind + jolt} ${g.bob + enterY}) rotate(${g.lean + sway} 100 118) translate(100 118) scale(${enterScale}) translate(-100 -118)`}>
          {g.legs.map((limb, i) => (
            <Limb key={`leg-${i}`} points={limb.points} pal={pal} width={15} />
          ))}
          <g transform={`translate(100 118) translate(0 ${chestLift}) scale(1 ${chestScale}) translate(-100 -118)`}>
            <Limb points={g.torso} pal={pal} width={16} />
            {g.arms.map((limb, i) => (
              <Limb key={`arm-${i}`} points={limb.points} pal={pal} width={14} />
            ))}
            <circle cx={g.head.x} cy={g.head.y} r={g.head.r} fill={pal.figure} stroke={pal.figureShade} strokeWidth={2.5} />
            <path
              d={`M${g.head.x - g.head.r * 0.92} ${g.head.y + 3} A ${g.head.r * 0.92} ${g.head.r * 0.92} 0 0 1 ${g.head.x + g.head.r * 0.28} ${g.head.y - g.head.r * 0.84}`}
              fill="none"
              stroke={pal.figureLit}
              strokeWidth={2.8}
              strokeLinecap="round"
              opacity={0.8}
            />
            <path d={`M${g.head.x - g.head.r} ${g.head.y - 4} Q${g.head.x} ${g.head.y - 31} ${g.head.x + g.head.r} ${g.head.y - 4}`} fill={pal.accent} />
            <circle cx={g.head.x} cy={g.head.y - 26} r={4.4} fill={pal.accent} />
            {g.eyes.map((eye, i) => (
              <ellipse key={`eye-${i}`} cx={eye.x} cy={eye.y} rx={2.2} ry={eyeRy} fill={pal.paper} />
            ))}
            {scared
              ? g.eyes.map((eye, i) => {
                  const leftX = eye.x - 3.8;
                  const rightX = eye.x + 3.8;
                  return (
                    <line
                      key={`brow-${i}`}
                      x1={i === 0 ? leftX : rightX}
                      y1={eye.y - 5}
                      x2={i === 0 ? rightX : leftX}
                      y2={eye.y - 7.4}
                      stroke={pal.paper}
                      strokeWidth={1.7}
                      strokeLinecap="round"
                      opacity={0.85}
                    />
                  );
                })
              : null}
            {scared ? <ellipse cx={g.head.x} cy={g.head.y + 9} rx={3.2} ry={4.4} fill="none" stroke={pal.paper} strokeWidth={1.7} /> : null}
            {tired ? <line x1={g.head.x - 4} y1={g.head.y + 10} x2={g.head.x + 4} y2={g.head.y + 10} stroke={pal.paper} strokeWidth={1.8} strokeLinecap="round" /> : null}
          </g>
        </g>
      </g>
    </svg>
  );
};

const PaintedBottle: React.FC<{ frame: number; level: number; tip?: number; pal: Pal }> = ({ frame, level, tip = 0, pal }) => {
  const fill = 124 * level;
  const critical = level > 0 && level <= 0.26;
  const sway = Math.sin(frame / 20) * 2.5;
  const water = '#6fd6e6';
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
        filter: critical ? `drop-shadow(0 0 14px ${water}aa)` : 'drop-shadow(0 8px 8px rgba(0,0,0,0.35))'
      }}
    >
      <rect x={30} y={6} width={20} height={20} rx={5} fill={pal.paper} opacity={0.85} />
      <rect x={20} y={24} width={40} height={146} rx={13} fill={pal.paper} opacity={0.14} stroke={pal.paper} strokeWidth={2.5} />
      <rect x={23} y={24 + 142 - fill} width={34} height={fill} rx={10} fill={water} opacity={0.8} />
      <path d="M28 46 Q40 38 52 48" fill="none" stroke={pal.paper} strokeWidth={2.4} strokeLinecap="round" opacity={0.65} />
      <line x1={28} y1={60} x2={52} y2={60} stroke={pal.paper} strokeWidth={2} opacity={0.32} />
      {critical ? <circle cx={40} cy={120} r={3} fill={pal.accent} opacity={0.55 + Math.sin(frame / 7) * 0.35} /> : null}
    </svg>
  );
};

const PaintedHelicopter: React.FC<{ frame: number; dur: number; pal: Pal }> = ({ frame, dur, pal }) => {
  const x = interpolate(frame, [0, dur], [-320, 1400], { extrapolateRight: 'clamp' });
  const y = 300 + Math.sin(frame / 16) * 9;
  return (
    <svg viewBox="0 0 240 110" width={240} height={110} style={{ position: 'absolute', left: x, top: y }}>
      <ellipse cx={112} cy={62} rx={38} ry={17} fill={pal.fore[0]} />
      <path d="M148 58 L206 54 L214 60 L150 68Z" fill={pal.fore[0]} />
      <path d="M204 42 L216 58 L204 54Z" fill={pal.fore[0]} />
      <rect x={92} y={44} width={40} height={5} rx={2.5} fill={pal.fore[0]} />
      <line x1={72} y1={44} x2={152} y2={44} stroke={pal.fore[0]} strokeWidth={4} strokeLinecap="round" transform={`rotate(${Math.sin(frame * 1.4) * 5} 112 44)`} />
      <line x1={100} y1={78} x2={92} y2={92} stroke={pal.fore[0]} strokeWidth={4} strokeLinecap="round" />
      <line x1={124} y1={78} x2={132} y2={92} stroke={pal.fore[0]} strokeWidth={4} strokeLinecap="round" />
      <circle cx={112} cy={60} r={8} fill={pal.accent} opacity={0.5} />
      <circle cx={112} cy={60} r={3.5} fill={pal.accent} opacity={0.65 + Math.sin(frame / 4) * 0.35} />
    </svg>
  );
};

const PaintedOasis: React.FC<{ frame: number; pal: Pal }> = ({ frame, pal }) => {
  const pool = '#4fbfb0';
  return (
    <svg viewBox="0 0 420 240" width={420} height={240} style={{ position: 'absolute', right: 40, bottom: 440 }}>
      <ellipse cx={210} cy={196} rx={128} ry={24} fill={pool} opacity={0.75} />
      <ellipse cx={210} cy={192} rx={104} ry={13} fill={pool} opacity={0.5} />
      <path d="M232 182 Q222 132 236 96" fill="none" stroke={pal.fore[0]} strokeWidth={9} strokeLinecap="round" />
      <path d="M234 100 Q198 78 172 92 Q204 88 230 106Z" fill={pal.fore[0]} />
      <path d="M234 100 Q256 66 288 70 Q258 82 238 108Z" fill={pal.fore[1]} />
      <path d="M234 100 Q212 60 180 58 Q210 76 230 108Z" fill={pal.fore[0]} />
      <path d="M234 100 Q268 90 292 110 Q258 100 236 112Z" fill={pal.fore[1]} />
      <path d="M234 100 Q206 112 188 136 Q214 118 236 112Z" fill={pal.fore[0]} />
      <ellipse cx={258} cy={100} rx={5} ry={7} fill={pal.accent} opacity={0.7 + Math.sin(frame / 10) * 0.2} />
    </svg>
  );
};

const PaintedCamp: React.FC<{ pal: Pal }> = ({ pal }) => (
  <svg viewBox="0 0 420 220" width={420} height={220} style={{ position: 'absolute', right: 30, bottom: 470 }}>
    <path d="M54 188 L102 104 L150 188Z" fill={pal.fore[0]} />
    <path d="M176 188 L224 118 L272 188Z" fill={pal.fore[1]} />
    <path d="M270 188 L310 130 L350 188Z" fill={pal.fore[0]} />
    <path d="M102 104 L82 188" stroke={pal.accent} strokeWidth={2.5} opacity={0.4} />
    <path d="M224 118 L204 188" stroke={pal.accent} strokeWidth={2.5} opacity={0.4} />
    <line x1={54} y1={188} x2={350} y2={188} stroke={pal.accent} strokeWidth={3} opacity={0.3} />
  </svg>
);

const TitlePlate: React.FC<{ pal: Pal }> = ({ pal }) => (
  <svg
    viewBox="0 0 1000 420"
    preserveAspectRatio="none"
    style={{ position: 'absolute', left: SAFE_BOX.x - 40, top: 470, width: SAFE_BOX.width + 80, height: 400, opacity: 0.62 }}
  >
    <path d="M 22 74 C 220 34 760 30 976 58 L 968 352 C 740 388 250 384 30 344 Z" fill={pal.fore[0]} />
    <path d="M 34 82 C 240 48 748 44 962 66" fill="none" stroke={pal.dune[0]} strokeWidth={7} opacity={0.22} strokeLinecap="round" />
    <path d="M 46 338 C 280 372 720 372 954 342" fill="none" stroke={pal.foreShade} strokeWidth={12} opacity={0.4} strokeLinecap="round" />
  </svg>
);

const Word: React.FC<{ word: string; at: number; accent: boolean; pal: Pal }> = ({ word, at, accent, pal }) => {
  const frame = useCurrentFrame();
  const local = Math.max(0, frame - at);
  const p = interpolate(local, [0, 11], [0, 1], { extrapolateRight: 'clamp', easing: EASE_OUT });
  const lift = (1 - p) * 26;
  const tilt = (1 - p) * -4;
  const clip = `inset(-16% ${(1 - p) * 100}% -16% -3%)`;
  const underline = clamp01((local - 5) / 9);
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        color: accent ? pal.accent : pal.paper,
        transform: `translateY(${lift}px) rotate(${tilt}deg)`,
        clipPath: clip,
        opacity: local === 0 ? 0 : 1,
        textShadow: '0 3px 0 rgba(0,0,0,0.16), 0 12px 30px rgba(0,0,0,0.55)'
      }}
    >
      {word}
      {accent ? (
        <svg
          viewBox="0 0 100 14"
          preserveAspectRatio="none"
          style={{ position: 'absolute', left: '-2%', right: '-2%', bottom: 1, height: 10, transform: `scaleX(${underline})`, transformOrigin: 'left center', opacity: 0.9 }}
        >
          <path d="M2 8 C 26 3, 58 3, 98 7 L 96 11 C 62 8, 30 8, 4 12 Z" fill={pal.accent} />
        </svg>
      ) : null}
    </span>
  );
};

const Scene: React.FC<{ text: string; index: number; dur: number; start: number }> = ({ text, index, dur, start }) => {
  const frame = useCurrentFrame();
  const cue = SCENES[index];
  const pal = PALETTES[cue.grade];
  const camera = CAMERAS[index] ?? CAMERAS[0];
  const cameraEase = index % 3 === 0 ? EASE_OUT : EASE_IN_OUT;
  const scale = interpolate(frame, [0, dur], camera.scale, { extrapolateRight: 'clamp', easing: cameraEase });
  const camX = interpolate(frame, [0, dur], camera.x, { extrapolateRight: 'clamp', easing: cameraEase });
  const camY = interpolate(frame, [0, dur], camera.y, { extrapolateRight: 'clamp', easing: cameraEase });
  const rotate = interpolate(frame, [0, dur], camera.rotate, { extrapolateRight: 'clamp', easing: cameraEase });
  const handheldX = Math.sin(frame / 43) * 1.1;
  const handheldY = Math.cos(frame / 57) * 0.9;
  const impactAge = Math.max(0, frame - cue.impactAt);
  const impactEase = cue.impact * Math.exp(-impactAge / 9);
  const shakeAmp = cue.storm * 3.2 + impactEase * 16;
  const shakeX = (Math.sin(frame * 2.6) + Math.sin(frame * 6.9) * 0.55) * shakeAmp;
  const shakeY = (Math.cos(frame * 3.1) + Math.cos(frame * 7.7) * 0.5) * shakeAmp * 0.7;
  const shakeRotate = Math.sin(frame * 1.9) * shakeAmp * 0.05;
  const shakeScale = 1 + Math.abs(Math.sin(frame * 0.83)) * cue.storm * 0.006;
  const pan = camX * 2.2;
  const bgX = pan * 0.22 + Math.sin(frame / 90) * 4;
  const midX = pan * 0.62 + Math.sin(frame / 64) * 2;
  const fgX = pan * 1.35 + Math.sin(frame / 48) * 6;
  const wind = cue.pose === 'brace' ? Math.sin(frame / 6) * 5 + Math.sin(frame / 14) * 2.5 + Math.sin(frame * 1.7) * 0.8 : 0;
  const words = text.split(' ');
  const headerOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
  const wordGap = Math.min(6, Math.max(2.4, (dur * 0.34) / Math.max(1, words.length)));
  const titleSize = text.length > 38 ? 72 : text.length > 28 ? 80 : 92;
  const progress = clamp01((start + frame) / durationInFrames);
  const flash = cue.impact > 0 ? Math.max(0, 1 - impactAge / 10) * cue.impact : 0;

  return (
    <AbsoluteFill data-scene={`scene-${index}`} style={{ backgroundColor: pal.base, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          transform: `translate(${shakeX + handheldX}px, ${shakeY + handheldY}px) rotate(${rotate + shakeRotate}deg) scale(${scale * shakeScale})`,
          transformOrigin: camera.origin,
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', left: -140, top: -100, width: 1360, height: 2120, transform: `translateX(${bgX}px)`, willChange: 'transform' }}>
          <SkyLayer index={index} pal={pal} />
        </div>

        <div style={{ position: 'absolute', left: -140, top: -100, width: 1360, height: 2120, transform: `translateX(${midX}px)`, willChange: 'transform' }}>
          <DuneLayer index={index} />
        </div>

        <div style={{ position: 'absolute', left: -140, top: -100, width: 1360, height: 2120, transform: `translateX(${midX * 1.08}px)`, willChange: 'transform' }}>
          {index >= 1 && index <= 6 ? <PaintedBottle frame={frame} level={cue.water} tip={index === 4 ? -20 : 0} pal={pal} /> : null}
          {index === 6 ? <PaintedHelicopter frame={frame} dur={dur} pal={pal} /> : null}
          {index === 9 ? <PaintedOasis frame={frame} pal={pal} /> : null}
          {index === 10 ? <PaintedCamp pal={pal} /> : null}
          <PaintedFigure
            pose={cue.pose}
            frame={frame}
            left={cue.figureX}
            opacity={1}
            seed={index}
            wind={wind}
            impact={cue.impact}
            impactAt={cue.impactAt}
            exhaustion={cue.exhaustion}
            pal={pal}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            left: -140,
            top: -100,
            width: 1360,
            height: 2120,
            transform: `translateX(${fgX}px)`,
            filter: `blur(${1 + cue.storm * 3}px)`,
            opacity: 0.92,
            willChange: 'transform'
          }}
        >
          <ForeLayer index={index} />
        </div>
      </AbsoluteFill>

      <Storm frame={frame} intensity={cue.storm} pal={pal} />
      <HeatShimmer frame={frame} intensity={cue.heat} pal={pal} />
      <RakingLight pal={pal} sun={cue.sun} heat={cue.heat} />
      <ImpactChips frame={frame} at={cue.impactAt} intensity={cue.impact} figureX={cue.figureX} pal={pal} />

      {flash > 0.01 ? <div style={{ position: 'absolute', inset: 0, background: pal.glow, opacity: flash * 0.32, mixBlendMode: 'screen', pointerEvents: 'none' }} /> : null}

      <TitlePlate pal={pal} />

      <div
        data-el="title"
        data-kind="content"
        style={{
          position: 'absolute',
          left: SAFE_BOX.x,
          top: 520,
          width: SAFE_BOX.width,
          textAlign: 'center',
          zIndex: 10
        }}
      >
        <div style={{ color: pal.paper, fontSize: 24, fontWeight: 600, fontFamily: SERIF, letterSpacing: 7, marginBottom: 18, opacity: headerOpacity * 0.85, textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>
          {index === 0 || index === SCENES.length - 1 ? '@midnightfiles' : `SAHARA / ${String(index).padStart(2, '0')}`}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 0.24em', color: pal.paper, fontSize: titleSize, fontWeight: 700, fontFamily: SERIF, lineHeight: 1.02, letterSpacing: -1.5 }}>
          {words.map((word, i) => (
            <Word key={`${word}-${i}`} word={word} at={2 + i * wordGap} accent={KEYWORDS.has(clean(word))} pal={pal} />
          ))}
        </div>
      </div>

      <PaintedProgress progress={progress} pal={pal} />
      <PaintWipe frame={frame} pal={pal} />
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
