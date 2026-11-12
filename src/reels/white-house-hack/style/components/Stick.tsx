import React from "react";
import { C } from "../theme";

export type Pose = {
  lUp: number;
  lLow: number;
  rUp: number;
  rLow: number;
  lThigh: number;
  lShin: number;
  rThigh: number;
  rShin: number;
  head: number;
  lean: number;
};

const base: Pose = {
  lUp: 8,
  lLow: 6,
  rUp: -8,
  rLow: -6,
  lThigh: 4,
  lShin: 0,
  rThigh: -4,
  rShin: 0,
  head: 0,
  lean: 0,
};

export const POSES = {
  idle: base,
  wave: { ...base, rUp: -150, rLow: -10 },
  point: { ...base, rUp: -90, rLow: 0 },
  idea: { ...base, rUp: -175, rLow: 0 },
  cheer: { ...base, lUp: 155, lLow: 10, rUp: -155, rLow: -10 },
  shrug: { ...base, lUp: 35, lLow: 115, rUp: -35, rLow: -115, head: 6 },
  walk: { ...base, lThigh: 22, lShin: 14, rThigh: -18, rShin: -8 },
} satisfies Record<string, Pose>;

export const mixPose = (a: Pose, b: Pose, t: number): Pose => {
  const out = { ...a };
  (Object.keys(a) as (keyof Pose)[]).forEach((k) => {
    out[k] = a[k] + (b[k] - a[k]) * t;
  });
  return out;
};

type LimbProps = {
  x: number;
  y: number;
  angle: number;
  len: number;
  width?: number;
  children?: React.ReactNode;
};

const Limb: React.FC<LimbProps> = ({
  x,
  y,
  angle,
  len,
  width = 14,
  children,
}) => (
  <g transform={`rotate(${angle} ${x} ${y})`}>
    <line
      x1={x}
      y1={y}
      x2={x}
      y2={y + len}
      stroke={C.ink}
      strokeWidth={width}
      strokeLinecap="round"
    />
    {children}
  </g>
);

type StickProps = {
  pose: Pose;
  width?: number;
  shirt?: string;
  mood?: "happy" | "worried" | "neutral";
  blink?: number;
};

export const Stick: React.FC<StickProps> = ({
  pose,
  width = 300,
  shirt = C.muted,
  mood = "happy",
  blink = 0,
}) => {
  const mouth = {
    happy: "M91 58 Q100 67 109 58",
    worried: "M91 63 Q100 55 109 63",
    neutral: "M92 60 L108 60",
  }[mood];
  const eyeRy = Math.max(0.6, 3.5 * (1 - blink));
  return (
    <svg width={width} height={width * 1.7} viewBox="0 0 200 340">
      <Limb x={88} y={200} angle={pose.lThigh} len={65}>
        <Limb x={88} y={265} angle={pose.lShin} len={65} />
      </Limb>
      <Limb x={112} y={200} angle={pose.rThigh} len={65}>
        <Limb x={112} y={265} angle={pose.rShin} len={65} />
      </Limb>
      <g transform={`rotate(${pose.lean} 100 200)`}>
        <rect x={70} y={92} width={60} height={118} rx={30} fill={shirt} />
        <Limb x={78} y={108} angle={pose.lUp} len={55}>
          <Limb x={78} y={163} angle={pose.lLow} len={50} />
        </Limb>
        <Limb x={122} y={108} angle={pose.rUp} len={55}>
          <Limb x={122} y={163} angle={pose.rLow} len={50} />
        </Limb>
        <g transform={`rotate(${pose.head} 100 78)`}>
          <circle cx={100} cy={50} r={30} fill={C.ink} />
          <ellipse cx={90} cy={46} rx={3.5} ry={eyeRy} fill={C.bg} />
          <ellipse cx={110} cy={46} rx={3.5} ry={eyeRy} fill={C.bg} />
          <path
            d={mouth}
            stroke={C.bg}
            strokeWidth={4}
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </g>
    </svg>
  );
};
