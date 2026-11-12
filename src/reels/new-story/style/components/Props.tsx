import React from "react";
import { C } from "../theme";

type P = { size?: number };

const Svg: React.FC<P & { children: React.ReactNode }> = ({
  size = 300,
  children,
}) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    {children}
  </svg>
);

export const Cockroach: React.FC<P & { color?: string; glow?: number }> = ({
  size,
  color = C.panel,
  glow = 0,
}) => (
  <Svg size={size}>
    <path
      d="M62 100 L34 86 M56 114 L24 114 M62 128 L34 142"
      stroke={C.ink}
      strokeWidth={8}
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M138 100 L166 86 M144 114 L176 114 M138 128 L166 142"
      stroke={C.ink}
      strokeWidth={8}
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M90 60 Q68 34 44 26"
      stroke={C.ink}
      strokeWidth={7}
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M110 60 Q132 34 156 26"
      stroke={C.ink}
      strokeWidth={7}
      strokeLinecap="round"
      fill="none"
    />
    <ellipse cx={100} cy={112} rx={50} ry={38} fill={color} stroke={C.ink} strokeWidth={8} />
    <ellipse cx={100} cy={112} rx={24} ry={16} fill={C.line} opacity={0.6} />
    <line x1={100} y1={78} x2={100} y2={146} stroke={C.line} strokeWidth={5} />
    {glow > 0 ? (
      <ellipse cx={100} cy={68} rx={20} ry={11} fill={C.primary} opacity={glow * 0.3} />
    ) : null}
    <circle cx={100} cy={70} r={18} fill={color} stroke={C.ink} strokeWidth={8} />
    <circle cx={92} cy={66} r={4} fill={glow > 0 ? C.primary : C.bg} />
    <circle cx={108} cy={66} r={4} fill={glow > 0 ? C.primary : C.bg} />
  </Svg>
);

export const Lock: React.FC<P & { color?: string }> = ({
  size,
  color = C.primary,
}) => (
  <Svg size={size}>
    <path
      d="M72 92 V66 a28 28 0 0 1 56 0 V92"
      fill="none"
      stroke={C.ink}
      strokeWidth={14}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x={50} y={90} width={100} height={88} rx={18} fill={color} />
    <circle cx={100} cy={126} r={9} fill={C.bg} />
    <rect x={95} y={130} width={10} height={24} rx={5} fill={C.bg} />
  </Svg>
);

export const Syringe: React.FC<P> = ({ size }) => (  <Svg size={size}>
    <g transform="rotate(-30 100 100)">
      <rect x={70} y={78} width={90} height={44} rx={8} fill={C.panel} stroke={C.ink} strokeWidth={8} />
      <rect x={78} y={86} width={54} height={28} rx={4} fill={C.primary} />
      <rect x={160} y={96} width={34} height={8} rx={4} fill={C.ink} />
      <circle cx={197} cy={100} r={5} fill={C.primary} />
      <rect x={50} y={82} width={18} height={36} rx={4} fill={C.ink} />
      <line x1={70} y1={100} x2={160} y2={100} stroke={C.ink} strokeWidth={4} />
      <line x1={86} y1={78} x2={86} y2={122} stroke={C.ink} strokeWidth={3} />
      <line x1={104} y1={78} x2={104} y2={122} stroke={C.ink} strokeWidth={3} />
    </g>
  </Svg>
);

export const Brain: React.FC<P & { highlight?: number }> = ({
  size,
  highlight = 0,
}) => (
  <Svg size={size}>
    <path
      d="M40 122 Q20 82 56 64 Q60 30 100 34 Q140 30 144 64 Q180 82 160 122 Q168 160 120 168 Q90 182 60 160 Q32 156 40 122 Z"
      fill={C.panel}
      stroke={C.ink}
      strokeWidth={10}
      strokeLinejoin="round"
    />
    <path
      d="M100 40 V164 M72 58 Q92 88 74 118 Q62 140 80 158 M128 58 Q108 90 128 118 Q144 138 124 160"
      stroke={C.line}
      strokeWidth={6}
      fill="none"
      strokeLinecap="round"
    />
    <ellipse cx={112} cy={104} rx={30} ry={24} fill={C.primary} opacity={highlight * 0.85} />
  </Svg>
);

export const Wasp: React.FC<P & { wing?: number }> = ({ size, wing = 1 }) => (
  <Svg size={size}>
    <ellipse
      cx={78}
      cy={88}
      rx={34}
      ry={16}
      fill={C.secondary}
      opacity={0.35 + wing * 0.35}
      transform="rotate(-24 78 88)"
    />
    <ellipse
      cx={78}
      cy={116}
      rx={30}
      ry={14}
      fill={C.secondary}
      opacity={0.3 + wing * 0.3}
      transform="rotate(20 78 116)"
    />
    <ellipse cx={104} cy={112} rx={46} ry={28} fill={C.primary} stroke={C.ink} strokeWidth={8} transform="rotate(-12 104 112)" />
    <path
      d="M92 88 L84 136 M112 86 L106 138 M132 92 L128 132"
      stroke={C.bg}
      strokeWidth={8}
      strokeLinecap="round"
    />
    <path
      d="M96 136 L84 162 M116 140 L112 168 M136 136 L146 162"
      stroke={C.ink}
      strokeWidth={7}
      strokeLinecap="round"
      fill="none"
    />
    <path d="M58 112 L34 112" stroke={C.danger} strokeWidth={10} strokeLinecap="round" />
    <circle cx={150} cy={100} r={20} fill={C.ink} />
    <circle cx={158} cy={96} r={4} fill={C.bg} />
    <path d="M162 86 Q176 66 190 70" stroke={C.ink} strokeWidth={6} strokeLinecap="round" fill="none" />
    <path d="M160 92 Q176 78 190 84" stroke={C.ink} strokeWidth={6} strokeLinecap="round" fill="none" />
  </Svg>
);

export const HatchCockroach: React.FC<P & { open?: number; baby?: number }> = ({
  size,
  open = 0,
  baby = 0,
}) => (
  <Svg size={size}>
    <path
      d="M62 100 L34 86 M56 114 L24 114 M62 128 L34 142"
      stroke={C.ink}
      strokeWidth={8}
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M138 100 L166 86 M144 114 L176 114 M138 128 L166 142"
      stroke={C.ink}
      strokeWidth={8}
      strokeLinecap="round"
      fill="none"
    />
    <path d="M90 60 Q68 34 44 26" stroke={C.ink} strokeWidth={7} strokeLinecap="round" fill="none" />
    <path d="M110 60 Q132 34 156 26" stroke={C.ink} strokeWidth={7} strokeLinecap="round" fill="none" />
    <ellipse cx={100} cy={112} rx={50} ry={38} fill={C.panel} stroke={C.ink} strokeWidth={8} />
    <path
      d={`M100 78 Q${100 - open * 24} 112 ${100 - open * 30} 146`}
      stroke={C.bg}
      strokeWidth={6}
      strokeLinecap="round"
      fill="none"
    />
    <path
      d={`M100 78 Q${100 + open * 24} 112 ${100 + open * 30} 146`}
      stroke={C.bg}
      strokeWidth={6}
      strokeLinecap="round"
      fill="none"
    />
    <g transform={`translate(100 ${112 - baby * 46}) scale(${0.5 + baby * 0.2})`}>
      <ellipse cx={0} cy={0} rx={26} ry={20} fill={C.secondary} stroke={C.ink} strokeWidth={6} />
      <circle cx={0} cy={-22} r={10} fill={C.secondary} stroke={C.ink} strokeWidth={5} />
      <circle cx={-4} cy={-24} r={2.5} fill={C.bg} />
      <circle cx={4} cy={-24} r={2.5} fill={C.bg} />
      <path
        d="M-8 -38 Q-16 -52 -26 -54 M8 -38 Q16 -52 26 -54"
        stroke={C.ink}
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
      />
    </g>
    <circle cx={100} cy={70} r={18} fill={C.panel} stroke={C.ink} strokeWidth={8} />
    <circle cx={92} cy={66} r={4} fill={C.danger} />
    <circle cx={108} cy={66} r={4} fill={C.danger} />
  </Svg>
);

export const EggCluster: React.FC<P & { glow?: number }> = ({ size, glow = 0 }) => (
  <Svg size={size}>
    {glow > 0 ? (
      <ellipse cx={100} cy={106} rx={72} ry={58} fill={C.danger} opacity={glow * 0.18} />
    ) : null}
    {[
      [70, 92],
      [118, 82],
      [102, 132],
    ].map(([x, y], i) => (
      <g key={i}>
        <ellipse cx={x} cy={y} rx={17} ry={22} fill={C.ink} stroke={C.line} strokeWidth={5} />
        <ellipse cx={x} cy={y} rx={8} ry={11} fill={glow > 0 ? C.danger : C.muted} opacity={0.4 + glow * 0.6} />
      </g>
    ))}
  </Svg>
);
