import React from "react";
import { C, FONT } from "../theme";

type P = { size?: number };
const Svg: React.FC<P & { children: React.ReactNode }> = ({
  size = 300,
  children,
}) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    {children}
  </svg>
);

const stroke = {
  strokeWidth: 10,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export const Lock: React.FC<P & { color?: string }> = ({
  size,
  color = C.primary,
}) => (
  <Svg size={size}>
    <path
      d="M72 92 V66 a28 28 0 0 1 56 0 V92"
      fill="none"
      stroke={C.ink}
      {...stroke}
      strokeWidth={14}
    />
    <rect x={50} y={90} width={100} height={88} rx={18} fill={color} />
    <circle cx={100} cy={126} r={9} fill={C.bg} />
    <rect x={95} y={130} width={10} height={24} rx={5} fill={C.bg} />
  </Svg>
);

export const Shield: React.FC<P & { color?: string }> = ({
  size,
  color = C.success,
}) => (
  <Svg size={size}>
    <path
      d="M100 16 L170 42 V98 C170 144 135 174 100 188 C65 174 30 144 30 98 V42 Z"
      fill={color}
    />
    <path
      d="M68 100 L92 124 L134 76"
      fill="none"
      stroke={C.bg}
      {...stroke}
      strokeWidth={16}
    />
  </Svg>
);

export const Mask: React.FC<P & { glow?: number; glow2?: number }> = ({
  size,
  glow = 0,
  glow2,
}) => {
  const g2 = glow2 ?? glow;
  return (
    <Svg size={size}>
      <path
        d="M24 66 Q100 36 176 66 Q176 142 138 164 Q100 180 62 164 Q24 142 24 66 Z"
        fill={C.secondary}
      />
      <ellipse cx={66} cy={100} rx={20} ry={11} fill={C.bg} />
      <ellipse cx={134} cy={100} rx={20} ry={11} fill={C.bg} />
      {glow > 0 || g2 > 0 ? (
        <>
          <ellipse cx={66} cy={100} rx={12} ry={6} fill={C.primary} opacity={glow} />
          <ellipse cx={134} cy={100} rx={12} ry={6} fill={C.primary} opacity={g2} />
        </>
      ) : null}
      <path d="M80 144 Q100 154 120 144" fill="none" stroke={C.bg} {...stroke} />
    </Svg>
  );
};

export const Magnifier: React.FC<P> = ({ size }) => (
  <Svg size={size}>
    <circle
      cx={84}
      cy={84}
      r={52}
      fill="rgba(62,201,255,0.14)"
      stroke={C.ink}
      {...stroke}
      strokeWidth={12}
    />
    <line
      x1={122}
      y1={122}
      x2={176}
      y2={176}
      stroke={C.primary}
      {...stroke}
      strokeWidth={20}
    />
  </Svg>
);

export const House: React.FC<
  P & { windowDark?: number[]; porchLight?: number; peephole?: number }
> = ({ size, windowDark = [0, 0, 0], porchLight = 0, peephole = 0 }) => (
  <Svg size={size}>
    <path d="M20 92 L100 28 L180 92 Z" fill={C.panel} stroke={C.ink} {...stroke} />
    <rect
      x={36}
      y={90}
      width={128}
      height={90}
      rx={8}
      fill={C.panel}
      stroke={C.ink}
      {...stroke}
    />
    <rect x={56} y={112} width={22} height={22} rx={3} fill={C.secondary} opacity={1 - (windowDark[0] ?? 0)} stroke={C.ink} strokeWidth={5} />
    <rect x={122} y={112} width={22} height={22} rx={3} fill={C.secondary} opacity={1 - (windowDark[1] ?? 0)} stroke={C.ink} strokeWidth={5} />
    <circle cx={100} cy={76} r={10} fill={C.secondary} opacity={1 - (windowDark[2] ?? 0)} stroke={C.ink} strokeWidth={5} />
    <rect x={88} y={130} width={24} height={50} rx={4} fill={C.ink} />
    {porchLight > 0 ? (
      <>
        <circle cx={100} cy={140} r={20} fill={C.primary} opacity={porchLight * 0.18} />
        <circle cx={100} cy={140} r={6} fill={C.primary} opacity={porchLight} />
      </>
    ) : null}
    {peephole > 0 ? (
      <>
        <circle cx={100} cy={150} r={7} fill={C.bg} />
        <circle cx={100} cy={150} r={2 + 3 * peephole} fill={C.ink} />
      </>
    ) : null}
  </Svg>
);

export const Wifi: React.FC<P & { progress?: number; color?: string }> = ({
  size,
  progress = 1,
  color = C.secondary,
}) => {
  const arcs = [
    "M40 140 Q100 60 160 140",
    "M62 158 Q100 104 138 158",
    "M84 176 Q100 148 116 176",
  ];
  return (
    <Svg size={size}>
      {arcs.map((d, i) => {
        const p = Math.max(0, Math.min(1, progress * 1.35 - i * 0.15));
        return (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={10}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - p}
          />
        );
      })}
    </Svg>
  );
};

export const WhiteHouse: React.FC<
  P & { grid?: number; lit?: number; flag?: number }
> = ({ size = 760, grid = 0, lit = 0, flag = 1 }) => (
  <svg width={size} height={size * 0.65} viewBox="0 0 400 260">
    <rect x={40} y={90} width={320} height={150} fill={C.panel} stroke={C.ink} {...stroke} />
    <rect x={20} y={70} width={360} height={24} fill={C.panel} stroke={C.ink} {...stroke} />
    <path d="M160 70 L200 30 L240 70 Z" fill={C.panel} stroke={C.ink} {...stroke} />
    <rect x={170} y={100} width={60} height={120} fill={C.bg} stroke={lit > 0 ? C.primary : C.ink} strokeWidth={lit > 0 ? 8 : 6} opacity={1} />
    <path
      d="M180 100 V220 M190 100 V220 M200 100 V220 M210 100 V220 M220 100 V220"
      stroke={C.secondary}
      strokeWidth={2}
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - Math.max(0, Math.min(1, grid))}
    />
    <path
      d="M170 120 H230 M170 140 H230 M170 160 H230 M170 180 H230 M170 200 H230"
      stroke={C.secondary}
      strokeWidth={2}
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - Math.max(0, Math.min(1, grid))}
    />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <rect key={i} x={70 + i * 50} y={100} width={14} height={120} fill={C.ink} />
    ))}
    <rect x={188} y={190} width={24} height={50} fill={C.ink} />
    <line x1={330} y1={70} x2={330} y2={18} stroke={C.ink} strokeWidth={6} />
    <path d="M330 18 L372 27 L330 36 Z" fill={C.secondary} opacity={flag} />
  </svg>
);

export const ServerRack: React.FC<
  P & { tint?: string; lightColor?: string; lights?: number | number[] }
> = ({ size, tint = C.panel, lightColor = C.secondary, lights = 1 }) => (
  <Svg size={size}>
    {[0, 1, 2].map((i) => {
      const l = Array.isArray(lights) ? (lights[i] ?? 0) : lights;
      return (
        <g key={i}>
          <rect x={40} y={30 + i * 55} width={120} height={45} rx={6} fill={tint} stroke={C.ink} {...stroke} strokeWidth={7} />
          <line x1={55} y1={46 + i * 55} x2={105} y2={46 + i * 55} stroke={C.line} strokeWidth={4} />
          <line x1={55} y1={56 + i * 55} x2={90} y2={56 + i * 55} stroke={C.line} strokeWidth={4} />
          <circle cx={138} cy={46 + i * 55} r={5} fill={lightColor} opacity={l} />
          <circle cx={138} cy={60 + i * 55} r={5} fill={lightColor} opacity={l * 0.5} />
        </g>
      );
    })}
  </Svg>
);

export const Door: React.FC<
  P & { open?: number; light?: number; knob?: number; knobColor?: string }
> = ({ size, open = 0, light = 0, knob = 0, knobColor = C.primary }) => (
  <Svg size={size}>
    <rect x={30} y={20} width={140} height={170} rx={6} fill="none" stroke={C.ink} {...stroke} />
    <rect x={40} y={30} width={120} height={160} rx={4} fill={C.bgDark} />
    {light > 0 ? (
      <rect x={40} y={30} width={120} height={160} rx={4} fill={C.primary} opacity={light * 0.35} />
    ) : null}
    <g transform={`translate(40 30) scale(${1 - open * 0.68} 1) translate(-40 -30)`}>
      <rect x={40} y={30} width={120} height={160} rx={4} fill={C.panel} stroke={C.ink} {...stroke} />
      <circle cx={142} cy={110} r={6} fill={knobColor} opacity={0.45 + knob * 0.55} />
    </g>
  </Svg>
);

export const Key: React.FC<P> = ({ size }) => (
  <Svg size={size}>
    <circle cx={60} cy={100} r={28} fill="none" stroke={C.primary} strokeWidth={16} />
    <circle cx={60} cy={100} r={12} fill="none" stroke={C.primary} strokeWidth={10} />
    <line x1={88} y1={100} x2={162} y2={100} stroke={C.primary} strokeWidth={16} strokeLinecap="round" />
    <line x1={140} y1={100} x2={140} y2={124} stroke={C.primary} strokeWidth={14} strokeLinecap="round" />
    <line x1={160} y1={100} x2={160} y2={116} stroke={C.primary} strokeWidth={14} strokeLinecap="round" />
  </Svg>
);

export const Boot: React.FC<P> = ({ size }) => (
  <Svg size={size}>
    <path
      d="M62 38 L112 38 L112 118 L150 138 Q170 150 170 168 L170 178 L62 178 Z"
      fill={C.panel}
      stroke={C.ink}
      {...stroke}
    />
    <rect x={56} y={172} width={120} height={16} rx={7} fill={C.ink} />
    <line x1={80} y1={58} x2={104} y2={58} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
    <line x1={80} y1={74} x2={104} y2={74} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
    <line x1={80} y1={90} x2={104} y2={90} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
  </Svg>
);

export const CaseFile: React.FC<P & { page?: number }> = ({ size, page = 0 }) => (
  <Svg size={size}>
    <path d="M20 40 H90 L105 60 H180 V180 H20 Z" fill={C.panel} stroke={C.ink} {...stroke} />
    <rect x={52} y={62 - page * 46} width={96} height={92} rx={4} fill={C.ink} opacity={page} />
    <g opacity={page}>
      <line x1={64} y1={84 - page * 46} x2={136} y2={84 - page * 46} stroke={C.muted} strokeWidth={4} />
      <line x1={64} y1={100 - page * 46} x2={124} y2={100 - page * 46} stroke={C.muted} strokeWidth={4} />
      <line x1={64} y1={116 - page * 46} x2={130} y2={116 - page * 46} stroke={C.muted} strokeWidth={4} />
    </g>
    <path d="M20 70 H180 V180 H20 Z" fill={C.panel} stroke={C.ink} {...stroke} />
    <line x1={44} y1={94} x2={156} y2={94} stroke={C.line} strokeWidth={4} />
    <line x1={44} y1={112} x2={128} y2={112} stroke={C.line} strokeWidth={4} />
  </Svg>
);

export const Phone: React.FC<P> = ({ size }) => (
  <Svg size={size}>
    <rect x={55} y={15} width={90} height={170} rx={16} fill={C.panel} stroke={C.ink} {...stroke} />
    <rect x={65} y={30} width={70} height={140} rx={8} fill={C.bgDark} />
    <rect x={88} y={20} width={24} height={6} rx={3} fill={C.ink} />
  </Svg>
);

export const Lamp: React.FC<P & { lit?: number }> = ({ size = 300, lit = 1 }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 200 260">
    <circle cx={100} cy={62} r={54} fill={C.primary} opacity={lit * 0.16} />
    <rect x={52} y={40} width={96} height={54} fill={C.panel} stroke={C.ink} {...stroke} strokeWidth={7} />
    <path d="M46 40 L100 12 L154 40 Z" fill={C.panel} stroke={C.ink} {...stroke} strokeWidth={7} />
    <rect x={78} y={54} width={18} height={18} rx={3} fill={C.primary} opacity={lit} />
    <rect x={104} y={54} width={18} height={18} rx={3} fill={C.primary} opacity={lit} />
    <rect x={92} y={82} width={16} height={12} fill={C.ink} />
    <line x1={100} y1={94} x2={100} y2={210} stroke={C.ink} strokeWidth={10} strokeLinecap="round" />
    <rect x={58} y={210} width={84} height={16} rx={8} fill={C.ink} />
  </svg>
);

export const Clapperboard: React.FC<P & { open?: number; text?: string }> = ({
  size,
  open = 0,
  text = "HEIST",
}) => (
  <Svg size={size}>
    <rect x={20} y={70} width={160} height={110} rx={8} fill={C.panel} stroke={C.ink} {...stroke} />
    <g transform={`rotate(${-open * 18} 20 74)`}>
      <rect x={20} y={40} width={160} height={34} rx={6} fill={C.ink} />
      <path d="M34 40 L58 74 M70 40 L94 74 M106 40 L130 74 M142 40 L166 74" stroke={C.bg} strokeWidth={8} />
    </g>
    <circle cx={20} cy={74} r={7} fill={C.ink} />
    <text
      x={100}
      y={148}
      textAnchor="middle"
      fontFamily={FONT.headline}
      fontSize={56}
      letterSpacing={4}
      fill={C.ink}
    >
      {text.toUpperCase()}
    </text>
  </Svg>
);

export const Scanner: React.FC<P & { look?: number; scan?: number }> = ({
  size,
  look = 0,
  scan = 0.5,
}) => (
  <Svg size={size}>
    <path
      d="M100 16 L170 42 V98 C170 144 135 174 100 188 C65 174 30 144 30 98 V42 Z"
      fill={C.panel}
      stroke={C.secondary}
      {...stroke}
    />
    <circle cx={75} cy={95} r={11} fill={C.ink} />
    <circle cx={125} cy={95} r={11} fill={C.ink} />
    <circle cx={75 + look * 5} cy={95} r={4} fill={C.secondary} />
    <circle cx={125 + look * 5} cy={95} r={4} fill={C.secondary} />
    <line
      x1={52}
      y1={58 + scan * 100}
      x2={148}
      y2={58 + scan * 100}
      stroke={C.secondary}
      strokeWidth={4}
      opacity={0.7}
    />
  </Svg>
);

export const WarningTriangle: React.FC<P> = ({ size }) => (
  <Svg size={size}>
    <path d="M100 20 L180 170 H20 Z" fill={C.danger} stroke={C.ink} {...stroke} />
    <rect x={94} y={66} width={12} height={52} rx={6} fill={C.bg} />
    <circle cx={100} cy={142} r={8} fill={C.bg} />
  </Svg>
);

export const Packet: React.FC<P & { color?: string }> = ({
  size = 40,
  color = C.primary,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x={12} y={24} width={76} height={52} rx={12} fill={color} />
    <circle cx={30} cy={50} r={7} fill={C.bg} />
    <line x1={46} y1={50} x2={76} y2={50} stroke={C.bg} strokeWidth={7} strokeLinecap="round" />
  </svg>
);
