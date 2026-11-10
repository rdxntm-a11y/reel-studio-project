import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand as myBrand } from "../../brand";
import { FONTS } from "../../fonts";
import { CAPTION_BOTTOM, SAFE_BOX } from "../../layout";
import { ReelFrame, type ReelProps } from "../../components";
import { sec, type Word } from "../../timing";
import rawWords from "../../../public/reels/white-house-hack/captions.words.json";

// Visual plan approved: physical metaphors, one twist per scene, stamps slam on the
// twist word, dark scenes for the big questions, bounce + glitch micro-details.
const WORDS = rawWords as Word[];

export const AUDIO = "reels/white-house-hack/vo.wav";

const C = {
  paper: "#F7EFDC",
  paperDeep: "#E8D9BB",
  ink: "#241D19",
  inkSoft: "#4A3B30",
  red: "#C82E22",
  redDark: "#8E1F17",
  orange: "#EE6C26",
  charcoal: "#211D1A",
  cream: "#EDE4CF",
  white: "#FFF9EC",
  wood: "#C9A27A",
  woodDark: "#8F6A47",
  woodLine: "#5E4028",
  labelDim: "#B8AB90",
  xray: "#1E2A20",
  xrayInk: "#CFE3C8",
  sepia: "#D9C7A6",
} as const;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const sin01 = (f: number, speed = 1, phase = 0) => 0.5 + 0.5 * Math.sin(f * speed + phase);

type StampDef = { text: string; word: number; top?: number; right?: number };

type SceneDef = {
  chapter: string;
  line1: string;
  line2: string;
  fromWord: number;
  dark?: boolean;
  vignette?: number;
  stamps?: StampDef[];
  swap?: { line1: string; line2: string; word: number };
};

const SCENE_DEFS: SceneDef[] = [
  {
    chapter: "THE HOOK",
    line1: "SOMEONE WAS HIDING",
    line2: "INSIDE THE NETWORK",
    fromWord: 0,
    stamps: [{ text: "NOT A HACK", word: 14, top: 560, right: 120 }],
  },
  {
    chapter: "THE SPOT",
    line1: "PROXY TRAFFIC",
    line2: "FROM THE WHITE HOUSE",
    fromWord: 15,
  },
  {
    chapter: "THE QUIET",
    line1: "NOT A BREAK-IN",
    line2: "NOT A RED ALERT",
    fromWord: 29,
    dark: true,
    stamps: [
      { text: "NO BREAK-IN", word: 32, top: 470, right: 130 },
      { text: "NO ALERT", word: 37, top: 470, right: 130 },
    ],
    swap: { line1: "SOMETHING", line2: "QUIETER", word: 38 },
  },
  {
    chapter: "THE PROXY",
    line1: "IT LOOKS LIKE",
    line2: "A NORMAL HOME",
    fromWord: 40,
  },
  {
    chapter: "THE CREEP",
    line1: "THAT’S WHAT MAKES",
    line2: "IT CREEPY",
    fromWord: 57,
    dark: true,
    vignette: 0.55,
  },
  {
    chapter: "THE BLEND",
    line1: "REGULAR PERSON",
    line2: "REGULAR WI-FI",
    fromWord: 62,
  },
  {
    chapter: "THE SLIP",
    line1: "IT SLIPS PAST",
    line2: "THE SUSPICION",
    fromWord: 78,
  },
  {
    chapter: "THE QUESTION",
    line1: "WHO WAS USING",
    line2: "THAT COVER?",
    fromWord: 95,
    dark: true,
    vignette: 0.75,
  },
  {
    chapter: "THE UNKNOWN",
    line1: "WE DON’T HAVE",
    line2: "EVERY ANSWER YET",
    fromWord: 117,
    dark: true,
    vignette: 0.75,
  },
  {
    chapter: "THE REMINDER",
    line1: "THE SCARIEST THREATS",
    line2: "DON’T KICK DOORS",
    fromWord: 123,
  },
  {
    chapter: "THE MASK",
    line1: "WEARING THE MASK",
    line2: "OF ORDINARY LIFE",
    fromWord: 146,
    dark: true,
    vignette: 0.85,
    stamps: [{ text: "TWIST!", word: 152, top: 540, right: 150 }],
  },
  {
    chapter: "THE CTA",
    line1: "FOLLOW FOR MORE",
    line2: "REAL CASES",
    fromWord: 156,
    stamps: [{ text: "FOLLOW", word: 165, top: 620, right: 140 }],
  },
];

const wordFrame = (n: number) => sec(WORDS[n]?.start ?? 0);
const TAIL = sec(1.4);

type Scene = SceneDef & {
  index: number;
  startFrame: number;
  endFrame: number;
  durationFrames: number;
};

const SCENES: Scene[] = SCENE_DEFS.map((def, index) => {
  const next = SCENE_DEFS[index + 1];
  const startFrame = wordFrame(def.fromWord);
  const endFrame = next
    ? wordFrame(next.fromWord)
    : sec(WORDS[WORDS.length - 1].end) + TAIL;
  return { ...def, index, startFrame, endFrame, durationFrames: endFrame - startFrame };
});

export const durationInFrames = SCENES[SCENES.length - 1].endFrame;

// ---------------------------------------------------------------- primitives

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)'/%3E%3C/svg%3E")`;

const SceneBG: React.FC<{ dark: boolean; vignette?: number }> = ({ dark, vignette = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: dark ? C.charcoal : C.paper }}>
      <AbsoluteFill
        style={{
          backgroundImage: dark
            ? "radial-gradient(ellipse at 20% 12%, rgba(238,108,38,0.08), transparent 55%), radial-gradient(ellipse at 80% 92%, rgba(200,46,34,0.07), transparent 60%)"
            : "radial-gradient(ellipse at 18% 8%, rgba(255,255,255,0.6), transparent 50%), radial-gradient(ellipse at 82% 92%, rgba(143,106,71,0.14), transparent 58%)",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: GRAIN,
          backgroundSize: "240px 240px",
          backgroundPosition: `${(frame * 7) % 240}px ${(frame * 11) % 240}px`,
          mixBlendMode: dark ? "screen" : "multiply",
          opacity: dark ? 0.07 : 0.09,
        }}
      />
      {dark && (
        <AbsoluteFill
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0px, rgba(0,0,0,0.25) 1px, transparent 1px, transparent 4px)",
            opacity: 0.35,
            backgroundPosition: `0 ${(frame * 0.5) % 4}px`,
          }}
        />
      )}
      {vignette > 0 && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse at 50% 42%, transparent 44%, rgba(10,8,6,${vignette}) 100%)`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

const DustMotes: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  n?: number;
  color?: string;
}> = ({ x, y, w, h, n = 7, color = "rgba(255,255,255,0.5)" }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {Array.from({ length: n }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x + ((i * 97) % w) + Math.sin(frame * (0.02 + (i % 3) * 0.01) + i) * 14,
            top: y + ((i * 53) % h) + Math.cos(frame * (0.015 + (i % 4) * 0.008) + i * 2) * 18,
            width: 4 + (i % 3) * 2,
            height: 4 + (i % 3) * 2,
            borderRadius: "50%",
            background: color,
            opacity: 0.2 + 0.25 * sin01(frame, 0.08, i),
          }}
        />
      ))}
    </>
  );
};

const TypeOn: React.FC<{
  text: string;
  at: number;
  color: string;
  size: number;
  charFrames?: number;
  style?: React.CSSProperties;
}> = ({ text, at, color, size, charFrames = 1.15, style }) => {
  const frame = useCurrentFrame();
  const chars = [...text];
  const visible = at < 0 ? chars.length : Math.max(0, Math.floor((frame - at) / charFrames) + 1);
  const done = visible >= chars.length;
  return (
    <div
      style={{
        fontFamily: FONTS.Inter,
        fontSize: size,
        fontWeight: 800,
        lineHeight: 1.08,
        letterSpacing: -1,
        textTransform: "uppercase",
        color,
        ...style,
      }}
    >
      {chars.map((ch, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            whiteSpace: "pre",
            opacity: i < visible ? 1 : 0,
            transform: i === visible - 1 && !done ? "scale(1.16)" : "scale(1)",
            transformOrigin: "50% 85%",
          }}
        >
          {ch}
        </span>
      ))}
      {!done && (
        <span
          style={{
            display: "inline-block",
            width: size * 0.42,
            height: size * 0.72,
            background: color,
            marginLeft: 5,
            transform: "translateY(6px)",
            opacity: frame % 6 < 3 ? 0.9 : 0,
          }}
        />
      )}
    </div>
  );
};

const StampIn: React.FC<{ text: string; at: number; top?: number; right?: number }> = ({
  text,
  at,
  top = 700,
  right = 84,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - at;
  if (t < 0) return null;
  const slam = spring({ frame: t, fps, config: { damping: 6, stiffness: 260, mass: 0.55 } });
  const shake = Math.sin(t * 2.9) * Math.max(0, 8 - t) * 1.1;
  const opacity = interpolate(t, [0, 3], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        right,
        top,
        opacity,
        zIndex: 30,
        transform: `rotate(-11deg) translate(${shake}px, ${shake * 0.4}px) scale(${2.4 - 1.4 * slam})`,
        fontFamily: FONTS.SpaceGrotesk,
        fontSize: 64,
        fontWeight: 700,
        letterSpacing: 4,
        color: C.red,
        border: `6px solid ${C.red}`,
        borderRadius: 10,
        padding: "10px 26px",
        textTransform: "uppercase",
      }}
    >
      {text}
    </div>
  );
};

const GlitchAt: React.FC<{ frames: number[]; power?: number; children: React.ReactNode }> = ({
  frames,
  power = 8,
  children,
}) => {
  const frame = useCurrentFrame();
  const hit = frames.find((f) => frame - f >= 0 && frame - f <= 1);
  const g = hit === undefined ? 0 : frame - hit === 0 ? -power : power;
  return <div style={{ transform: `translateX(${g}px)` }}>{children}</div>;
};

const PopIn: React.FC<{ delay: number; dx?: number; children: React.ReactNode }> = ({
  delay,
  dx = 0,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 9, stiffness: 170, mass: 0.7 } });
  const o = interpolate(frame - delay, [0, 4], [0, 1], clamp);
  return (
    <div
      style={{
        opacity: o,
        transform: `translate(${dx * (1 - p)}px, ${(1 - p) * 26}px) scale(${0.82 + 0.18 * p})`,
      }}
    >
      {children}
    </div>
  );
};

// ---------------------------------------------------------------- mannequin

const Limb: React.FC<{
  x: number;
  y: number;
  upper: number;
  lower: number;
  rotUpper: number;
  rotLower: number;
  w: number;
}> = ({ x, y, upper, lower, rotUpper, rotLower, w }) => (
  <g transform={`rotate(${rotUpper} ${x} ${y})`}>
    <line x1={x} y1={y} x2={x} y2={y + upper} stroke={C.wood} strokeWidth={w} strokeLinecap="round" />
    <circle cx={x} cy={y + upper} r={w * 0.42} fill={C.wood} stroke={C.woodLine} strokeWidth={2.5} />
    <g transform={`rotate(${rotLower} ${x} ${y + upper})`}>
      <line
        x1={x}
        y1={y + upper}
        x2={x}
        y2={y + upper + lower}
        stroke={C.wood}
        strokeWidth={w * 0.85}
        strokeLinecap="round"
      />
      <circle cx={x} cy={y + upper + lower} r={w * 0.32} fill={C.wood} stroke={C.woodLine} strokeWidth={2} />
    </g>
  </g>
);

const Mannequin: React.FC<{
  height?: number;
  lArm?: number;
  lElbow?: number;
  rArm?: number;
  rElbow?: number;
  lLeg?: number;
  lKnee?: number;
  rLeg?: number;
  rKnee?: number;
  headTilt?: number;
  lean?: number;
}> = ({
  height = 320,
  lArm = 8,
  lElbow = 0,
  rArm = -8,
  rElbow = 0,
  lLeg = 4,
  lKnee = 0,
  rLeg = -4,
  rKnee = 0,
  headTilt = 0,
  lean = 0,
}) => (
  <svg viewBox="0 0 200 340" style={{ height, width: (height * 200) / 340, overflow: "visible" }}>
    <g transform={`rotate(${lean} 100 160)`}>
      <Limb x={86} y={166} upper={64} lower={60} rotUpper={lLeg} rotLower={lKnee} w={20} />
      <Limb x={114} y={166} upper={64} lower={60} rotUpper={rLeg} rotLower={rKnee} w={20} />
      <line x1={100} y1={62} x2={100} y2={104} stroke={C.wood} strokeWidth={26} strokeLinecap="round" />
      <rect x={82} y={98} width={36} height={62} rx={16} fill={C.wood} stroke={C.woodDark} strokeWidth={2} />
      <Limb x={78} y={74} upper={52} lower={46} rotUpper={lArm} rotLower={lElbow} w={16} />
      <Limb x={122} y={74} upper={52} lower={46} rotUpper={rArm} rotLower={rElbow} w={16} />
      <g transform={`rotate(${headTilt} 100 40)`}>
        <circle cx={100} cy={38} r={24} fill={C.wood} stroke={C.woodDark} strokeWidth={2} />
        <circle cx={100} cy={30} r={2.6} fill={C.woodLine} />
      </g>
    </g>
  </svg>
);

// ---------------------------------------------------------------- props

const HouseMark: React.FC = () => (
  <svg width={26} height={22} viewBox="0 0 26 22">
    <polygon points="13,1 25,9 1,9" fill={C.red} />
    <rect x={3} y={9} width={20} height={12} fill="none" stroke={C.red} strokeWidth={2.5} />
    <rect x={10} y={13} width={6} height={8} fill={C.red} />
  </svg>
);

const WhiteHouse: React.FC<{ lit: number; curtain: number; silhouette: boolean; flag: number }> = ({
  lit,
  curtain,
  silhouette,
  flag,
}) => (
  <svg width={640} height={380} viewBox="0 0 640 380">
    <line x1={320} y1={22} x2={320} y2={0} stroke={C.woodDark} strokeWidth={4} />
    <polygon points="326,4 372,8 366,16 372,24 326,20" fill={C.red} transform={`skewY(${(flag - 0.5) * 6})`} />
    <polygon points="110,120 320,24 530,120" fill={C.white} stroke={C.woodDark} strokeWidth={3} />
    <rect x={40} y={118} width={560} height={230} fill={C.white} stroke={C.woodDark} strokeWidth={3} />
    {[190, 270, 370, 450].map((x) => (
      <rect key={x} x={x - 13} y={140} width={26} height={190} fill={C.paperDeep} stroke={C.woodDark} strokeWidth={2} />
    ))}
    <rect x={296} y={250} width={48} height={98} fill={C.inkSoft} />
    {[110, 500, 60, 560].map((x) => (
      <rect key={x} x={x} y={150} width={44} height={62} fill={C.paperDeep} stroke={C.woodDark} strokeWidth={2} />
    ))}
    <rect x={297} y={128} width={46} height={56} fill="#F4C25C" opacity={lit} />
    {silhouette && (
      <g fill={C.ink} opacity={0.85}>
        <circle cx={320} cy={158} r={8} />
        <rect x={308} y={162} width={24} height={22} rx={7} />
      </g>
    )}
    <rect x={298} y={129} width={44} height={54 * curtain} fill={C.cream} stroke={C.woodDark} strokeWidth={2} />
    {[308, 318, 328].map((x) => (
      <line key={x} x1={x} y1={130} x2={x} y2={130 + 52 * curtain} stroke={C.paperDeep} strokeWidth={3} />
    ))}
  </svg>
);

const Envelope: React.FC<{ legs?: boolean }> = ({ legs }) => (
  <svg width={92} height={legs ? 86 : 60} viewBox={legs ? "0 0 92 86" : "0 0 92 60"}>
    <rect x={1} y={1} width={90} height={58} fill={C.white} stroke={C.woodDark} strokeWidth={2.5} />
    <polyline points="1,1 46,34 91,1" fill="none" stroke={C.woodDark} strokeWidth={2} />
    <g transform="translate(8,36)">
      <HouseMark />
    </g>
    {legs && (
      <g stroke={C.ink} strokeWidth={4} strokeLinecap="round">
        <line x1={32} y1={59} x2={32} y2={78} />
        <line x1={60} y1={59} x2={60} y2={78} />
        <line x1={26} y1={78} x2={40} y2={78} />
        <line x1={54} y1={78} x2={68} y2={78} />
      </g>
    )}
  </svg>
);

const DoorProp: React.FC<{ w?: number; h?: number; open?: number; cracked?: boolean }> = ({
  w = 240,
  h = 420,
  open = 0,
  cracked = false,
}) => (
  <svg width={w} height={h} viewBox="0 0 240 420">
    <rect x={4} y={4} width={232} height={412} fill="none" stroke={C.woodLine} strokeWidth={8} />
    <g transform={`rotate(${open * 16} 12 210)`}>
      <rect x={12} y={12} width={216} height={396} fill="#B98F63" stroke={C.woodDark} strokeWidth={3} />
      {[46, 118].map((y) =>
        [30, 126].map((x) => (
          <rect key={`${x}-${y}`} x={x} y={y} width={84} height={62} fill="none" stroke={C.woodDark} strokeWidth={3} />
        ))
      )}
      <circle cx={210} cy={210} r={9} fill={C.woodLine} />
      {cracked && (
        <g stroke={C.woodLine} strokeWidth={3} fill="none">
          <polyline points="60,12 90,90 70,170 110,260 90,408" />
          <polyline points="170,12 150,120 180,220 160,408" />
        </g>
      )}
    </g>
  </svg>
);

const Boot: React.FC = () => (
  <svg width={110} height={70} viewBox="0 0 110 70">
    <rect x={6} y={6} width={56} height={34} rx={10} fill="#8F6A47" stroke={C.woodLine} strokeWidth={3} />
    <rect x={6} y={40} width={98} height={22} rx={8} fill={C.woodLine} />
    <rect x={10} y={44} width={34} height={4} fill={C.woodDark} />
  </svg>
);

const Shards: React.FC<{ at: number; x: number; y: number }> = ({ at, x, y }) => {
  const frame = useCurrentFrame();
  const d = Math.max(0, frame - at);
  if (d === 0) return null;
  return (
    <svg width={360} height={460} viewBox="0 0 360 460" style={{ position: "absolute", left: x, top: y }}>
      {Array.from({ length: 6 }).map((_, i) => {
        const ang = (i / 6) * Math.PI * 2;
        const dx = Math.cos(ang) * d * (3 + (i % 3));
        const dy = Math.sin(ang) * d * 2 + d * d * 0.12;
        return (
          <polygon
            key={i}
            points="0,0 14,4 6,16"
            fill="#B98F63"
            stroke={C.woodDark}
            strokeWidth={2}
            transform={`translate(${180 + dx}, ${230 + dy}) rotate(${d * (4 + i)})`}
          />
        );
      })}
    </svg>
  );
};

const Siren: React.FC<{ on: boolean }> = ({ on }) => {
  const frame = useCurrentFrame();
  const blink = on ? (frame % 10 < 5 ? 1 : 0.25) : 0;
  return (
    <svg width={220} height={140} viewBox="0 0 220 140">
      <rect x={100} y={0} width={20} height={30} fill={C.woodLine} />
      <path d="M70,30 Q110,4 150,30 Z" fill={C.red} opacity={blink} />
      <polygon points="70,32 150,32 210,130 10,130" fill={C.red} opacity={blink * 0.16} />
    </svg>
  );
};

const FlatShadow: React.FC<{ progress: number }> = ({ progress }) => (
  <div
    style={{
      position: "absolute",
      width: 250,
      height: 30,
      borderRadius: 15,
      background: "repeating-linear-gradient(90deg, rgba(20,16,12,0.95) 0 14px, rgba(46,38,30,0.9) 14px 16px)",
      transform: `translateX(${(1 - progress) * 260}px)`,
    }}
  >
    <div
      style={{
        position: "absolute",
        right: -4,
        top: -16,
        width: 34,
        height: 34,
        borderRadius: "50% 50% 40% 40%",
        background: "rgba(20,16,12,0.95)",
      }}
    />
  </div>
);

const SuburbanHouse: React.FC = () => (
  <svg width={480} height={380} viewBox="0 0 480 380">
    <rect x={40} y={150} width={400} height={220} fill={C.white} stroke={C.woodDark} strokeWidth={3} />
    <polygon points="20,150 240,30 460,150" fill={C.redDark} stroke={C.woodDark} strokeWidth={3} />
    <rect x={360} y={60} width={26} height={60} fill={C.paperDeep} stroke={C.woodDark} strokeWidth={2} />
    <rect x={90} y={190} width={70} height={80} fill="#F4C25C" stroke={C.woodDark} strokeWidth={2} opacity={0.85} />
    <line x1={125} y1={190} x2={125} y2={270} stroke={C.woodDark} strokeWidth={2} />
    <rect x={205} y={210} width={80} height={160} fill={C.ink} stroke={C.woodDark} strokeWidth={2} />
    <rect x={310} y={240} width={80} height={80} fill={C.paperDeep} stroke={C.woodDark} strokeWidth={2} />
    <ellipse cx={60} cy={368} rx={50} ry={12} fill="#9BA97F" />
    <ellipse cx={430} cy={368} rx={50} ry={12} fill="#9BA97F" />
  </svg>
);

const HouseMask: React.FC<{ scale?: number; slip?: number; blink: boolean }> = ({
  scale = 1,
  slip = 0,
  blink,
}) => (
  <svg
    width={92 * scale}
    height={104 * scale}
    viewBox="0 0 92 104"
    style={{ position: "absolute", left: -13 * scale, top: (-26 - slip * 22) * scale, zIndex: 2 }}
  >
    <polygon points="46,0 92,30 0,30" fill={C.paperDeep} stroke={C.woodDark} strokeWidth={3} />
    <rect x={6} y={30} width={80} height={72} fill={C.cream} stroke={C.woodDark} strokeWidth={3} />
    <circle cx={30} cy={54} r={6} fill={C.ink} opacity={blink ? 1 : 0.15} />
    <circle cx={62} cy={54} r={6} fill={C.ink} opacity={blink ? 1 : 0.15} />
    <rect x={36} y={78} width={20} height={24} fill={C.redDark} />
  </svg>
);

const Packet: React.FC<{ mask: number; slip: boolean; blink: boolean }> = ({ mask, slip, blink }) => (
  <div style={{ position: "relative", width: 66, height: 66 }}>
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: slip ? C.red : C.white,
        border: `2.5px solid ${C.woodDark}`,
        borderRadius: 8,
      }}
    />
    {!slip && (
      <>
        <div style={{ position: "absolute", left: 10, top: 10, width: 34, height: 4, background: "rgba(143,106,71,0.35)", borderRadius: 2 }} />
        <div style={{ position: "absolute", left: 10, top: 19, width: 22, height: 4, background: "rgba(143,106,71,0.35)", borderRadius: 2 }} />
      </>
    )}
    {mask > 0 && !slip && (
      <div style={{ position: "absolute", inset: 0, opacity: mask }}>
        <HouseMask blink={blink} />
      </div>
    )}
  </div>
);

const Teddy: React.FC<{ eyesOpen: boolean; headTurn?: number; pupilDx?: number; height?: number }> = ({
  eyesOpen,
  headTurn = 0,
  pupilDx = 0,
  height = 240,
}) => (
  <svg width={(height * 200) / 230} height={height} viewBox="0 0 200 230" style={{ overflow: "visible" }}>
    <ellipse cx={62} cy={198} rx={22} ry={16} fill="#A9764F" stroke="#6E4A2E" strokeWidth={3} />
    <ellipse cx={138} cy={198} rx={22} ry={16} fill="#A9764F" stroke="#6E4A2E" strokeWidth={3} />
    <ellipse cx={100} cy={150} rx={62} ry={58} fill="#A9764F" stroke="#6E4A2E" strokeWidth={3} />
    <ellipse cx={100} cy={160} rx={34} ry={34} fill="#D8B98E" />
    <ellipse cx={48} cy={122} rx={18} ry={30} fill="#A9764F" stroke="#6E4A2E" strokeWidth={3} transform="rotate(24 48 122)" />
    <ellipse cx={152} cy={122} rx={18} ry={30} fill="#A9764F" stroke="#6E4A2E" strokeWidth={3} transform="rotate(-24 152 122)" />
    <g transform={`rotate(${headTurn} 100 66)`}>
      <circle cx={68} cy={30} r={16} fill="#A9764F" stroke="#6E4A2E" strokeWidth={3} />
      <circle cx={132} cy={30} r={16} fill="#A9764F" stroke="#6E4A2E" strokeWidth={3} />
      <circle cx={100} cy={62} r={42} fill="#A9764F" stroke="#6E4A2E" strokeWidth={3} />
      <ellipse cx={100} cy={76} rx={20} ry={14} fill="#D8B98E" />
      <polygon points="94,68 106,68 100,76" fill="#3B2A1B" />
      {eyesOpen ? (
        <>
          {[82, 118].map((x) => (
            <g key={x}>
              <circle cx={x} cy={56} r={7} fill="#3B2A1B" />
              <circle cx={x + pupilDx} cy={54} r={2.2} fill="#F5EFE2" />
              <line x1={x - 5} y1={56} x2={x + 5} y2={56} stroke="#D8B98E" strokeWidth={1.6} />
              <line x1={x} y1={51} x2={x} y2={61} stroke="#D8B98E" strokeWidth={1.6} />
            </g>
          ))}
        </>
      ) : (
        <>
          <path d="M76,56 Q82,60 88,56" fill="none" stroke="#3B2A1B" strokeWidth={2.5} />
          <path d="M112,56 Q118,60 124,56" fill="none" stroke="#3B2A1B" strokeWidth={2.5} />
        </>
      )}
    </g>
  </svg>
);

const Cup: React.FC<{ steamPhase?: number }> = ({ steamPhase = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "relative", width: 44, height: 40 }}>
      <svg width={44} height={40} viewBox="0 0 44 40">
        <path d="M4,8 L36,8 L32,36 L8,36 Z" fill={C.white} stroke={C.woodDark} strokeWidth={2.5} />
        <path d="M36,12 Q46,18 36,26" fill="none" stroke={C.woodDark} strokeWidth={2.5} />
      </svg>
      {[0, 1].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 14 + i * 10,
            top: -14 - ((frame * 0.9 + i * 18 + steamPhase * 9) % 36),
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.55)",
            opacity: 0.8 - ((frame * 0.9 + i * 18) % 36) / 60,
          }}
        />
      ))}
    </div>
  );
};

const Skull: React.FC = () => (
  <svg width={110} height={110} viewBox="0 0 110 110">
    <circle cx={55} cy={46} r={30} fill={C.xrayInk} />
    <rect x={38} y={70} width={34} height={24} rx={6} fill={C.xrayInk} />
    <circle cx={43} cy={42} r={8} fill={C.xray} />
    <circle cx={67} cy={42} r={8} fill={C.xray} />
    <polygon points="55,52 49,60 61,60" fill={C.xray} />
    {[44, 52, 60].map((x) => (
      <line key={x} x1={x} y1={78} x2={x} y2={90} stroke={C.xray} strokeWidth={2} />
    ))}
  </svg>
);

const Teacup: React.FC = () => (
  <svg width={110} height={110} viewBox="0 0 110 110">
    <path d="M20,34 L78,34 L70,74 Q54,84 34,74 Z" fill={C.xrayInk} />
    <path d="M78,40 Q94,52 76,64" fill="none" stroke={C.xrayInk} strokeWidth={7} />
    <ellipse cx={48} cy={84} rx={30} ry={7} fill={C.xrayInk} />
    <ellipse cx={50} cy={80} rx={22} ry={5} fill={C.xray} />
    <path d="M44,20 Q48,10 44,2 M60,20 Q64,10 60,2" fill="none" stroke={C.xrayInk} strokeWidth={3} />
  </svg>
);

const XRayScreen: React.FC<{ x: number; y: number; label: string; active: boolean; children: React.ReactNode }> = ({
  x,
  y,
  label,
  active,
  children,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 330, height: 200 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: C.xray,
          border: `5px solid ${C.woodLine}`,
          borderRadius: 12,
          opacity: active ? 1 : 0.45,
        }}
      />
      {active && (
        <>
          <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.95 }}>
            {children}
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: ((frame * 3) % 200),
              height: 10,
              background: "rgba(207,227,200,0.25)",
            }}
          />
        </>
      )}
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: -34,
          fontFamily: FONTS.SpaceGrotesk,
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: 2,
          color: C.labelDim,
        }}
      >
        {label}
      </div>
    </div>
  );
};

const ServerBox: React.FC = () => (
  <svg width={130} height={100} viewBox="0 0 130 100">
    <rect x={10} y={20} width={110} height={70} rx={8} fill="#17130F" stroke={C.inkSoft} strokeWidth={3} />
    {[0, 1, 2].map((i) => (
      <polygon key={i} points={`${25 + i * 40},${20} ${35 + i * 40},2 ${45 + i * 40},20`} fill="#17130F" stroke={C.inkSoft} strokeWidth={2} />
    ))}
    <circle cx={100} cy={50} r={7} fill={C.red} />
    {[34, 48, 62].map((y) => (
      <line key={y} x1={22} y1={y} x2={78} y2={y} stroke={C.inkSoft} strokeWidth={3} />
    ))}
  </svg>
);

const Photo: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  children?: React.ReactNode;
  develop?: number;
}> = ({ x, y, w, h, rot, children, develop = 0 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      background: C.white,
      border: `3px solid ${C.woodDark}`,
      padding: 10,
      transform: `rotate(${rot}deg)`,
      boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
    }}
  >
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: develop > 0 ? C.sepia : "#141110",
        overflow: "hidden",
      }}
    >
      {children && <div style={{ position: "absolute", inset: 0, opacity: develop }}>{children}</div>}
    </div>
    <div
      style={{
        position: "absolute",
        top: -10,
        left: "50%",
        width: 16,
        height: 16,
        borderRadius: "50%",
        background: C.red,
        boxShadow: "0 3px 6px rgba(0,0,0,0.4)",
      }}
    />
  </div>
);

const Family: React.FC = () => (
  <svg width="100%" height="100%" viewBox="0 0 160 170">
    <g fill="#F5EFE2" opacity={0.9}>
      <circle cx={50} cy={44} r={16} />
      <rect x={32} y={58} width={36} height={58} rx={12} />
      <circle cx={108} cy={44} r={16} />
      <rect x={90} y={58} width={36} height={58} rx={12} />
      <circle cx={79} cy={118} r={11} />
      <rect x={66} y={128} width={26} height={42} rx={10} />
    </g>
  </svg>
);

const Magnifier: React.FC<{ x: number; y: number; r: number; children: React.ReactNode }> = ({
  x,
  y,
  r,
  children,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x, top: y, width: r * 2 + 60, height: r * 2 + 130 }}>
      <div
        style={{
          position: "absolute",
          left: 30,
          top: 30,
          width: r * 2,
          height: r * 2,
          borderRadius: "50%",
          overflow: "hidden",
          border: `10px solid ${C.wood}`,
          boxShadow: `0 0 0 4px ${C.woodLine}, 0 18px 30px rgba(0,0,0,0.4)`,
        }}
      >
        {children}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "40%",
            height: "200%",
            background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)",
            transform: `translateX(${(frame * 2) % (r * 4)}px) rotate(8deg)`,
          }}
        />
      </div>
      <svg width={r * 2 + 60} height={80} viewBox="0 0 200 80" style={{ position: "absolute", bottom: 0, left: 0 }}>
        <line x1={130} y1={0} x2={185} y2={70} stroke={C.wood} strokeWidth={16} strokeLinecap="round" />
      </svg>
    </div>
  );
};

const PaperBagMask: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg width={96} height={112} viewBox="0 0 96 112">
      <rect x={4} y={4} width={88} height={104} rx={10} fill={C.white} stroke={C.woodDark} strokeWidth={3} />
      <circle cx={34} cy={40} r={7} fill={C.ink} opacity={frame % 14 < 11 ? 1 : 0.1} />
      <circle cx={62} cy={40} r={7} fill={C.ink} opacity={(frame + 5) % 17 < 14 ? 1 : 0.1} />
      <path d="M30,68 Q48,86 66,68" fill="none" stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
      <circle cx={22} cy={62} r={5} fill="rgba(200,46,34,0.25)" />
      <circle cx={74} cy={62} r={5} fill="rgba(200,46,34,0.25)" />
    </svg>
  );
};

const ServerBack: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg width={96} height={104} viewBox="0 0 96 104">
      <rect x={4} y={0} width={88} height={104} rx={8} fill="#17130F" stroke={C.inkSoft} strokeWidth={3} />
      {Array.from({ length: 12 }).map((_, i) => (
        <circle
          key={i}
          cx={18 + (i % 4) * 20}
          cy={16 + Math.floor(i / 4) * 26}
          r={5}
          fill={sin01(frame, 0.35 + (i % 3) * 0.12, i * 1.7) > 0.55 ? "#7CE07C" : "#2E4A2E"}
        />
      ))}
    </svg>
  );
};

const Casserole: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "relative", width: 90, height: 60 }}>
      <svg width={90} height={60} viewBox="0 0 90 60">
        <rect x={4} y={14} width={82} height={40} rx={8} fill="#3A3129" stroke={C.ink} strokeWidth={3} />
        <rect x={12} y={4} width={66} height={14} rx={6} fill="#4A3B30" stroke={C.ink} strokeWidth={2} />
        <rect x={0} y={28} width={10} height={10} rx={3} fill="#4A3B30" />
        <rect x={80} y={28} width={10} height={10} rx={3} fill="#4A3B30" />
      </svg>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 26 + i * 16,
            top: -8 - ((frame * 0.8 + i * 12) % 30) - Math.sin(frame * 0.2 + i) * 3,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.4)",
            opacity: 0.7 - ((frame * 0.8 + i * 12) % 30) / 50,
          }}
        />
      ))}
    </div>
  );
};

const Doormat: React.FC<{ x: number; y: number; w?: number }> = ({ x, y, w = 340 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: 64,
      background: C.paperDeep,
      border: `3px solid ${C.woodDark}`,
      borderRadius: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: FONTS.SpaceGrotesk,
      fontSize: 30,
      fontWeight: 700,
      letterSpacing: 6,
      color: C.inkSoft,
    }}
  >
    WELCOME
  </div>
);

const PhoneCard: React.FC = () => (
  <div
    style={{
      width: 290,
      height: 500,
      background: C.ink,
      borderRadius: 34,
      border: `6px solid ${C.woodLine}`,
      padding: 18,
      boxShadow: "0 20px 40px rgba(36,29,25,0.35)",
    }}
  >
    <div
      style={{
        width: "100%",
        height: "100%",
        background: C.paper,
        borderRadius: 20,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      <div style={{ fontFamily: FONTS.SpaceGrotesk, fontSize: 30, fontWeight: 700, color: C.red, letterSpacing: 1 }}>
        REAL CASES
      </div>
      {["RESEARCHERS", "REPORT", "SOURCE LIST"].map((s) => (
        <div key={s} style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: "#2E7D32",
              color: C.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 800,
              fontFamily: FONTS.Inter,
            }}
          >
            ✓
          </div>
          <div style={{ fontFamily: FONTS.Inter, fontSize: 24, fontWeight: 700, color: C.ink, letterSpacing: 1 }}>
            {s}
          </div>
        </div>
      ))}
      <div style={{ marginTop: "auto", fontFamily: FONTS.SpaceGrotesk, fontSize: 22, color: C.inkSoft, letterSpacing: 2 }}>
        SOUND FAKE? CHECK.
      </div>
    </div>
  </div>
);

// ---------------------------------------------------------------- scenes

const S1: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const snapAt = wordFrame(14) - scene.startFrame;
  const snap = spring({ frame: frame - snapAt, fps, config: { damping: 14, stiffness: 320, mass: 0.5 } });
  const dim = interpolate(frame, [snapAt + 13, snapAt + 24], [0, 0.16], clamp);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 220, top: 640 }}>
        <WhiteHouse lit={0.72 + 0.28 * sin01(frame, 0.55)} curtain={snap} silhouette={snap < 0.9} flag={sin01(frame, 0.3)} />
      </div>
      <DustMotes x={200} y={620} w={680} h={360} color="rgba(143,106,71,0.4)" />
      <AbsoluteFill style={{ background: C.ink, opacity: dim }} />
    </AbsoluteFill>
  );
};

const PourEnvelope: React.FC<{ delay: number; x: number; rot: number }> = ({ delay, x, rot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drop = spring({ frame: frame - delay, fps, config: { damping: 8, stiffness: 120, mass: 0.8 } });
  const y = 560 + (1075 - 560) * drop;
  const wobble = 2 * Math.sin(frame * 0.3 + delay);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `rotate(${rot + wobble}deg)`,
        opacity: frame < delay ? 0 : 1,
      }}
    >
      <Envelope />
    </div>
  );
};

const S2: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const holdAt = wordFrame(19) - scene.startFrame; // "spotted"
  const pourAt = wordFrame(20) - scene.startFrame; // "residential"
  const hopAt = wordFrame(28) - scene.startFrame; // "network." -> legs
  const lift = spring({ frame: frame - holdAt, fps, config: { damping: 10, stiffness: 150 } });
  const hopX = interpolate(frame, [hopAt, hopAt + 40], [410, 950], clamp);
  const hopY = 1000 - 70 * Math.abs(Math.sin((frame - hopAt) * 0.24));
  return (
    <AbsoluteFill>
      {/* chute */}
      <div style={{ position: "absolute", left: 240, top: 480 }}>
        <svg width={220} height={150} viewBox="0 0 220 150">
          <rect x={10} y={10} width={200} height={110} rx={10} fill={C.paperDeep} stroke={C.woodDark} strokeWidth={3} />
          <rect x={40} y={54} width={140} height={22} rx={8} fill={C.ink} />
          <text x={110} y={38} textAnchor="middle" fontFamily={FONTS.SpaceGrotesk} fontSize={20} fontWeight={700} fill={C.ink} letterSpacing={2}>
            WHITE HOUSE MAIL
          </text>
        </svg>
      </div>
      {/* desk */}
      <div style={{ position: "absolute", left: 250, top: 1075 }}>
        <svg width={560} height={130} viewBox="0 0 560 130">
          <rect x={10} y={10} width={540} height={26} rx={8} fill={C.wood} stroke={C.woodDark} strokeWidth={3} />
          <rect x={40} y={36} width={20} height={90} fill={C.woodDark} />
          <rect x={500} y={36} width={20} height={90} fill={C.woodDark} />
        </svg>
      </div>
      {/* researcher holds one envelope to the lamp */}
      <div style={{ position: "absolute", left: 790, top: 820 }}>
        <Mannequin height={400} lArm={-95} lElbow={70} rArm={-12} rElbow={20} headTilt={-4} />
      </div>
      <div style={{ position: "absolute", left: 660, top: 640 }}>
        <svg width={90} height={130} viewBox="0 0 90 130">
          <line x1={45} y1={0} x2={45} y2={40} stroke={C.woodLine} strokeWidth={4} />
          <polygon points="5,60 85,60 65,38 25,38" fill={C.inkSoft} />
          <circle cx={45} cy={72} r={10} fill="#F4C25C" />
          <polygon points="20,74 70,74 96,130 -6,130" fill="rgba(244,194,92,0.25)" />
        </svg>
      </div>
      <div
        style={{
          position: "absolute",
          left: 672,
          top: 700 + (1 - lift) * 120,
          transform: `rotate(${(1 - lift) * -14}deg)`,
          opacity: frame < holdAt ? 0 : 1,
        }}
      >
        <Envelope />
      </div>
      {/* envelopes pour */}
      {[0, 1, 2, 3].map((i) => (
        <PourEnvelope key={i} delay={pourAt + 2 + i * 6} x={290 + i * 26} rot={i % 2 === 0 ? -4 : 3} />
      ))}
      {/* the hop-away twist */}
      {frame >= hopAt && (
        <div
          style={{
            position: "absolute",
            left: hopX,
            top: hopY,
            transform: `rotate(${6 * Math.sin((frame - hopAt) * 0.3)}deg)`,
          }}
        >
          <Envelope legs />
        </div>
      )}
    </AbsoluteFill>
  );
};

const S3: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const breakAt = wordFrame(32) - scene.startFrame; // "break-in."
  const alertAt = wordFrame(35) - scene.startFrame; // "blinking"
  const resetAt = wordFrame(38) - scene.startFrame; // "Something"
  const bootX = interpolate(frame, [10, breakAt], [-140, 400], clamp);
  const openAmt = frame >= breakAt && frame < resetAt ? 1 : 0;
  const shadow = interpolate(frame, [resetAt + 2, resetAt + 30], [0, 1], clamp);
  const resetFlash = frame - resetAt >= 0 && frame - resetAt <= 1 ? 0.5 : 0;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 390, top: 640 }}>
        <DoorProp open={openAmt} cracked={openAmt > 0} />
      </div>
      {frame < breakAt && (
        <div style={{ position: "absolute", left: bootX, top: 820 }}>
          <Boot />
        </div>
      )}
      {openAmt > 0 && frame < resetAt && <Shards at={breakAt} x={360} y={620} />}
      {frame >= alertAt && frame < resetAt && (
        <div style={{ position: "absolute", left: 430, top: 480 }}>
          <Siren on />
        </div>
      )}
      {frame >= resetAt && (
        <>
          <AbsoluteFill style={{ background: C.white, opacity: resetFlash }} />
          <div style={{ position: "absolute", left: 390, top: 640 }}>
            <DoorProp open={0} cracked={false} />
          </div>
          {shadow > 0 && (
            <div style={{ position: "absolute", left: 430, top: 1056 }}>
              <FlatShadow progress={shadow} />
            </div>
          )}
        </>
      )}
    </AbsoluteFill>
  );
};

const WalkPacket: React.FC<{ delay: number; fromX: number; toX: number; maskAt: number; slipAt: number; phase: number }> = ({
  delay,
  fromX,
  toX,
  maskAt,
  slipAt,
  phase,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const walk = interpolate(frame, [delay, delay + 90], [fromX, toX], clamp);
  const bob = Math.abs(Math.sin(frame * 0.35 + phase)) * 6;
  const rot = 3 * Math.sin(frame * 0.35 + phase);
  const mask = frame >= maskAt ? spring({ frame: frame - maskAt, fps, config: { damping: 9, stiffness: 170 } }) : 0;
  const slip = frame >= slipAt && frame <= slipAt + 1;
  const blink = sin01(frame, 0.4, phase) > 0.5;
  return (
    <div
      style={{
        position: "absolute",
        left: walk,
        top: 980 - bob,
        transform: `rotate(${rot}deg)`,
        opacity: frame < delay ? 0 : 1,
      }}
    >
      <Packet mask={mask} slip={slip} blink={blink} />
    </div>
  );
};

const S4: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const mask1 = wordFrame(49) - scene.startFrame; // "look"
  const mask2 = mask1 + 15;
  const mask3 = mask1 + 30;
  const slipAt = mask1 + 54;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 440, top: 600 }}>
        <SuburbanHouse />
      </div>
      {/* chimney smoke */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 812 + i * 10,
            top: 640 - ((frame * 0.7 + i * 14) % 46),
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "rgba(143,106,71,0.28)",
            opacity: 0.7 - ((frame * 0.7 + i * 14) % 46) / 70,
          }}
        />
      ))}
      {/* sidewalk */}
      <div style={{ position: "absolute", left: 60, top: 1060, width: 960, height: 10, background: C.paperDeep, borderRadius: 5 }} />
      <WalkPacket delay={8} fromX={640} toX={330} maskAt={mask1} slipAt={slipAt} phase={0} />
      <WalkPacket delay={20} fromX={640} toX={210} maskAt={mask2} slipAt={-1} phase={2.1} />
      <WalkPacket delay={32} fromX={640} toX={90} maskAt={mask3} slipAt={-1} phase={4.2} />
    </AbsoluteFill>
  );
};

const S5: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const creepyAt = wordFrame(61) - scene.startFrame; // "creepy."
  const eyesOpen = frame >= creepyAt;
  const headTurn = interpolate(frame, [creepyAt + 6, creepyAt + 30], [-5, 7], clamp);
  const flame = 0.7 + 0.3 * sin01(frame, 0.9);
  return (
    <AbsoluteFill>
      {/* porch chair */}
      <div style={{ position: "absolute", left: 560, top: 880 }}>
        <svg width={280} height={300} viewBox="0 0 280 300">
          <rect x={30} y={40} width={220} height={20} rx={6} fill={C.woodDark} />
          <rect x={30} y={60} width={220} height={16} rx={6} fill={C.wood} />
          {[50, 230].map((x) => (
            <rect key={x} x={x - 8} y={60} width={16} height={200} fill={C.woodDark} />
          ))}
          {[80, 200].map((x) => (
            <rect key={x} x={x - 7} y={230} width={14} height={60} fill={C.woodDark} />
          ))}
        </svg>
      </div>
      <div style={{ position: "absolute", left: 600, top: 700 }}>
        <Teddy eyesOpen={eyesOpen} headTurn={headTurn} height={230} />
      </div>
      {/* candle */}
      <div style={{ position: "absolute", left: 250, top: 1000 }}>
        <svg width={60} height={170} viewBox="0 0 60 170">
          <rect x={22} y={60} width={16} height={100} rx={4} fill={C.cream} stroke={C.woodDark} strokeWidth={2} />
          <line x1={30} y1={60} x2={30} y2={44} stroke={C.inkSoft} strokeWidth={3} />
          <ellipse cx={30} cy={34} rx={7 * flame} ry={14 * flame} fill="#F4C25C" opacity={0.9} />
          <ellipse cx={30} cy={30} rx={14 * flame} ry={24 * flame} fill="#F4C25C" opacity={0.25} />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

const CrowdFigure: React.FC<{
  x: number;
  popAt: number;
  phase: number;
  masked: boolean;
  waveAt: number;
}> = ({ x, popAt, phase, masked, waveAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - popAt, fps, config: { damping: 10, stiffness: 160 } });
  const bob = 4 * Math.sin(frame * 0.14 + phase);
  const waving = frame >= waveAt;
  const wave = waving
    ? spring({ frame: frame - waveAt, fps, config: { damping: 8, stiffness: 200 } })
    : 0;
  const wiggle = waving ? 10 * Math.sin((frame - waveAt) * 0.5) : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 800 + bob + (1 - pop) * 60,
        opacity: frame < popAt ? 0 : pop < 1 ? pop : 1,
      }}
    >
      {masked ? (
        <div style={{ position: "relative" }}>
          <Mannequin
            height={340}
            lArm={-60 + wave * -80}
            lElbow={80 + wiggle}
            rArm={-10}
            rElbow={20}
            headTilt={-3}
          />
          <div style={{ position: "absolute", left: 42, top: -14 }}>
            <HouseMask scale={1.15} blink={sin01(frame, 0.3, 1) > 0.5} />
          </div>
          <svg width={30} height={44} viewBox="0 0 30 44" style={{ position: "absolute", left: 128, top: 20 }}>
            <path d="M4,0 Q16,20 6,42" fill="none" stroke={C.red} strokeWidth={3} />
          </svg>
        </div>
      ) : (
        <Mannequin
          height={340}
          lArm={-62}
          lElbow={92}
          rArm={-62}
          rElbow={-92}
          headTilt={2}
        />
      )}
    </div>
  );
};

const S6: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const personAt = wordFrame(69) - scene.startFrame; // "person"
  const blendsAt = wordFrame(76) - scene.startFrame; // "blends"
  const xs = [110, 290, 470, 650, 830];
  const maskedIdx = 3;
  return (
    <AbsoluteFill>
      {xs.map((x, i) => (
        <CrowdFigure
          key={x}
          x={x}
          popAt={personAt + i * 5}
          phase={i * 1.7}
          masked={i === maskedIdx}
          waveAt={i === maskedIdx ? blendsAt : blendsAt + 3 + (i === 0 ? 0 : 3 * (i > maskedIdx ? 1 : 0))}
        />
      ))}
      {/* cups near each figure's mouth */}
      {xs.map((x, i) => (
        <div key={`cup-${x}`} style={{ position: "absolute", left: x + 108, top: 930 + 4 * Math.sin(frame * 0.14 + i * 1.7), opacity: frame >= personAt + i * 5 ? 1 : 0 }}>
          <Cup steamPhase={i} />
        </div>
      ))}
    </AbsoluteFill>
  );
};

const S7: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const strangeAt = wordFrame(91) - scene.startFrame; // "strange"
  const countryAt = wordFrame(94) - scene.startFrame; // "country"
  const deniedAt = countryAt - 8;
  const serverX = interpolate(frame, [30, strangeAt], [-60, 230], clamp);
  const packetX = interpolate(frame, [14, 120], [60, 720], clamp);
  const gateLift = spring({ frame: frame - 62, fps, config: { damping: 8, stiffness: 120 } });
  const deniedSlam = spring({ frame: frame - deniedAt, fps, config: { damping: 6, stiffness: 260, mass: 0.55 } });
  return (
    <AbsoluteFill>
      {/* road */}
      <div style={{ position: "absolute", left: 0, top: 1140, width: 1080, height: 8, background: C.paperDeep }} />
      {/* X-ray screens on posts */}
      <XRayScreen x={130} y={600} label="FOREIGN SERVER" active={frame >= strangeAt}>
        <Skull />
      </XRayScreen>
      <XRayScreen x={560} y={600} label="RESIDENT LANE" active={frame >= countryAt}>
        <Teacup />
      </XRayScreen>
      {/* gate */}
      <div style={{ position: "absolute", left: 660, top: 740 }}>
        <svg width={200} height={400} viewBox="0 0 200 400">
          <rect x={86} y={30} width={24} height={360} fill={C.woodDark} />
          <g transform={`rotate(${-gateLift * 65} 98 60)`}>
            <rect x={98} y={48} width={180} height={20} fill={C.white} />
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={110 + i * 44} y={48} width={22} height={20} fill={C.red} />
            ))}
          </g>
        </svg>
      </div>
      {/* booth + guard */}
      <div style={{ position: "absolute", left: 800, top: 880 }}>
        <svg width={220} height={260} viewBox="0 0 220 260">
          <rect x={10} y={20} width={200} height={220} rx={10} fill={C.paperDeep} stroke={C.woodDark} strokeWidth={3} />
          <rect x={40} y={50} width={140} height={90} rx={8} fill={C.white} stroke={C.woodDark} strokeWidth={3} />
          <text x={110} y={240} textAnchor="middle" fontFamily={FONTS.SpaceGrotesk} fontSize={22} fontWeight={700} fill={C.ink} letterSpacing={2}>
            CHECKPOINT
          </text>
        </svg>
      </div>
      <div style={{ position: "absolute", left: 770, top: 780 }}>
        <Mannequin height={360} lArm={-70} lElbow={60} rArm={-70} rElbow={-50} headTilt={3} />
      </div>
      {/* foreign server slides into the scanner */}
      <div style={{ position: "absolute", left: serverX, top: 1010, opacity: frame >= 30 ? 1 : 0 }}>
        <ServerBox />
      </div>
      {/* denied stamp on its papers */}
      {frame >= deniedAt && (
        <div
          style={{
            position: "absolute",
            left: 120,
            top: 880,
            fontFamily: FONTS.SpaceGrotesk,
            fontSize: 44,
            fontWeight: 700,
            letterSpacing: 3,
            color: C.red,
            border: `5px solid ${C.red}`,
            borderRadius: 8,
            padding: "4px 18px",
            transform: `rotate(-9deg) scale(${2 - 0.9 * deniedSlam})`,
          }}
        >
          DENIED
        </div>
      )}
      {/* house-costume packet strolls through the resident lane */}
      <div
        style={{
          position: "absolute",
          left: packetX,
          top: 1030 - Math.abs(Math.sin(frame * 0.3)) * 5,
          transform: `rotate(${3 * Math.sin(frame * 0.3)}deg)`,
        }}
      >
        <Packet mask={1} slip={false} blink={sin01(frame, 0.4) > 0.2} />
      </div>
    </AbsoluteFill>
  );
};

const S8: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const howAt = wordFrame(100) - scene.startFrame; // "How"
  const whoAt = wordFrame(105) - scene.startFrame; // "Who"
  const reachAt = wordFrame(111) - scene.startFrame; // "what"
  const develop = interpolate(frame, [reachAt + 8, reachAt + 32], [0, 1], clamp);
  const whoSlam = spring({ frame: frame - whoAt, fps, config: { damping: 6, stiffness: 260, mass: 0.55 } });
  const vibe = Math.max(0, 20 - (frame - whoAt)) * Math.sin((frame - whoAt) * 1.3) * 2.2;
  return (
    <AbsoluteFill>
      {/* board */}
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 560,
          width: 940,
          height: 660,
          background: "#342B24",
          borderRadius: 18,
          border: `6px solid ${C.woodLine}`,
        }}
      />
      {/* red string across the pins */}
      <svg width={940} height={660} viewBox="0 0 940 660" style={{ position: "absolute", left: 70, top: 560 }}>
        <path
          d={`M150,80 Q${330 + vibe},${70 - vibe} 500,90 Q${670 + vibe},${70 + vibe} 800,80 L${560 + vibe},370 L${790 + vibe},520`}
          fill="none"
          stroke={C.red}
          strokeWidth={3.5}
        />
      </svg>
      {/* pinned evidence photos */}
      <Photo x={110} y={620} w={190} h={200} rot={-4}>
        <div style={{ transform: "scale(1.6)", transformOrigin: "top left" }}>
          <Envelope />
        </div>
      </Photo>
      <Photo x={400} y={640} w={190} h={200} rot={3}>
        <div style={{ position: "relative", width: 66, height: 66, margin: "40px auto" }}>
          <Packet mask={1} slip={false} blink={false} />
        </div>
      </Photo>
      <Photo x={680} y={615} w={190} h={200} rot={-2}>
        <div style={{ transform: "scale(0.8)", transformOrigin: "top center", margin: "6px auto", width: 150 }}>
          <Teddy eyesOpen headTurn={0} height={170} />
        </div>
      </Photo>
      {/* HOW? small torn card */}
      {frame >= howAt && (
        <div
          style={{
            position: "absolute",
            left: 120,
            top: 960,
            fontFamily: FONTS.SpaceGrotesk,
            fontSize: 40,
            fontWeight: 700,
            color: C.ink,
            background: C.cream,
            padding: "10px 22px 4px",
            clipPath: "polygon(0 0, 100% 0, 100% 70%, 92% 100%, 84% 72%, 70% 96%, 55% 70%, 40% 100%, 26% 74%, 12% 96%, 0 72%)",
            transform: "rotate(-3deg)",
            opacity: interpolate(frame, [howAt, howAt + 4], [0, 1], clamp),
          }}
        >
          HOW?
        </div>
      )}
      {/* WHO? big slam card */}
      {frame >= whoAt && (
        <div
          style={{
            position: "absolute",
            left: 430,
            top: 900,
            fontFamily: FONTS.SpaceGrotesk,
            fontSize: 110,
            fontWeight: 700,
            letterSpacing: 4,
            color: C.red,
            border: `7px solid ${C.red}`,
            borderRadius: 12,
            padding: "8px 36px",
            background: "rgba(247,239,220,0.9)",
            transform: `rotate(-7deg) scale(${2.3 - 1.3 * whoSlam})`,
          }}
        >
          WHO?
        </div>
      )}
      {/* blank polaroid develops into the family cutout */}
      <Photo x={750} y={1050} w={170} h={190} rot={5} develop={develop}>
        <Family />
      </Photo>
      {/* lamp cone + dust */}
      <div
        style={{
          position: "absolute",
          left: 200,
          top: 340,
          width: 560,
          height: 840,
          background: "linear-gradient(180deg, rgba(244,194,92,0.16), transparent 85%)",
          clipPath: "polygon(42% 0, 58% 0, 100% 100%, 0 100%)",
        }}
      />
      <DustMotes x={260} y={480} w={440} h={560} color="rgba(244,194,92,0.5)" />
    </AbsoluteFill>
  );
};

const S9: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const flicker = frame >= 55 && frame <= 57;
  const drift = Math.sin(frame * 0.06) * 14;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 170, top: 620 }}>
        <Photo x={0} y={0} w={360} h={400} rot={-2}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: GRAIN, backgroundSize: "120px 120px", opacity: 0.5 }} />
        </Photo>
      </div>
      <div style={{ position: "absolute", left: 760, top: 800 }}>
        <Mannequin height={400} rArm={-100} rElbow={-10} lArm={-20} lElbow={20} headTilt={-6} />
      </div>
      <Magnifier x={300 + drift} y={780} r={95}>
        <div style={{ position: "absolute", inset: 0, background: "#141110" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: GRAIN, backgroundSize: "60px 60px", opacity: 0.8 }} />
        {flicker && (
          <div style={{ position: "absolute", left: "38%", top: "34%", width: 26, height: 70, opacity: 0.5 }}>
            <svg width={26} height={70} viewBox="0 0 26 70">
              <circle cx={13} cy={10} r={8} fill={C.white} />
              <rect x={4} y={16} width={18} height={54} rx={6} fill={C.white} />
              <rect x={5} y={4} width={16} height={14} fill={C.ink} opacity={0.6} />
            </svg>
          </div>
        )}
      </Magnifier>
    </AbsoluteFill>
  );
};

const S10: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const showsAt = wordFrame(129) - scene.startFrame; // "shows"
  const kickAt = wordFrame(142) - scene.startFrame; // "kick"
  const bootX = interpolate(frame, [kickAt - 7, kickAt], [-140, 200], clamp);
  const lightOn = frame >= showsAt;
  const breathe = 1 + 0.035 * Math.sin(frame / 16);
  return (
    <AbsoluteFill>
      {/* left: the movie version */}
      <AbsoluteFill style={{ left: 0, width: 540, background: C.charcoal }}>
        <div style={{ position: "absolute", left: 190, top: 640 }}>
          <DoorProp w={220} h={380} open={frame >= kickAt ? 1 : 0} cracked={frame >= kickAt} />
        </div>
        {frame >= kickAt && <Shards at={kickAt} x={140} y={600} />}
        {frame >= kickAt - 7 && frame < kickAt && (
          <div style={{ position: "absolute", left: bootX, top: 800 }}>
            <Boot />
          </div>
        )}
        <div
          style={{
            position: "absolute",
            left: 60,
            top: 1090,
            fontFamily: FONTS.SpaceGrotesk,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 3,
            color: C.labelDim,
          }}
        >
          WHAT YOU EXPECT
        </div>
      </AbsoluteFill>
      {/* divider */}
      <div style={{ position: "absolute", left: 540, top: 0, width: 3, height: 1920, background: "rgba(36,29,25,0.3)" }} />
      {/* right: the quiet version */}
      <AbsoluteFill style={{ left: 540, width: 540 }}>
        <div style={{ position: "absolute", left: 660, top: 640 }}>
          <DoorProp w={220} h={380} />
        </div>
        {lightOn && (
          <>
            <div
              style={{
                position: "absolute",
                left: 676,
                top: 1032,
                width: 188,
                height: 5,
                background: "#F4C25C",
                opacity: 0.85 + 0.15 * sin01(frame, 1.1),
                boxShadow: "0 0 14px 3px rgba(244,194,92,0.55)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 740,
                top: 1028,
                width: 52,
                height: 12,
                borderRadius: 6,
                background: "rgba(20,16,12,0.95)",
                transform: `scaleY(${breathe})`,
                transformOrigin: "top",
              }}
            />
          </>
        )}
        <Doormat x={640} y={1070} w={300} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const S11: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const walkX = interpolate(frame, [6, 56], [220, 560], clamp);
  const turnAt = wordFrame(152) - scene.startFrame; // "mask"
  const turn = interpolate(frame, [turnAt, turnAt + 7], [0, 1], { ...clamp, easing: (t) => t * t * (3 - 2 * t) });
  const scaleX = 1 - 2 * turn;
  const walkPhase = frame < 56 ? frame * 0.22 : 0;
  const back = turn >= 0.5;
  const rgbSplit = frame >= turnAt && frame <= turnAt + 2;
  const body = (
    <div style={{ position: "relative" }}>
      <Mannequin
        height={420}
        lArm={-55 + 6 * Math.sin(walkPhase)}
        lElbow={70}
        rArm={-55 - 6 * Math.sin(walkPhase)}
        rElbow={-70}
        lLeg={12 * Math.sin(walkPhase)}
        rLeg={-12 * Math.sin(walkPhase)}
        lKnee={8 * Math.sin(walkPhase + 1)}
        rKnee={-8 * Math.sin(walkPhase + 1)}
      />
      {back ? (
        <div style={{ position: "absolute", left: 44, top: -6 }}>
          <ServerBack />
        </div>
      ) : (
        <div style={{ position: "absolute", left: 38, top: -10 }}>
          <PaperBagMask />
        </div>
      )}
      <div style={{ position: "absolute", left: 80, top: 150 }}>
        <Casserole />
      </div>
    </div>
  );
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 760, top: 580 }}>
        <DoorProp w={240} h={420} />
      </div>
      <Doormat x={700} y={1030} w={360} />
      <div
        style={{
          position: "absolute",
          left: walkX,
          top: 760,
          transform: `scaleX(${scaleX})`,
        }}
      >
        {body}
        {rgbSplit && (
          <>
            <div style={{ position: "absolute", left: -6, top: 0, opacity: 0.4, mixBlendMode: "screen", filter: "hue-rotate(-90deg)" }}>{body}</div>
            <div style={{ position: "absolute", left: 6, top: 0, opacity: 0.4, mixBlendMode: "screen", filter: "hue-rotate(140deg)" }}>{body}</div>
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};

const S12: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nightAt = wordFrame(164) - scene.startFrame; // "night,"
  const checkAt = wordFrame(175) - scene.startFrame; // "check"
  const phonePop = spring({ frame: frame - checkAt, fps, config: { damping: 10, stiffness: 150 } });
  const glowFlicker = 0.55 + 0.2 * sin01(frame, 1.4);
  return (
    <AbsoluteFill>
      {/* bed */}
      <div style={{ position: "absolute", left: 90, top: 1010 }}>
        <svg width={580} height={200} viewBox="0 0 580 200">
          <rect x={0} y={70} width={580} height={26} rx={8} fill={C.wood} stroke={C.woodDark} strokeWidth={3} />
          <rect x={0} y={96} width={580} height={54} rx={10} fill={C.paperDeep} stroke={C.woodDark} strokeWidth={2} />
          <rect x={20} y={30} width={140} height={44} rx={14} fill={C.white} stroke={C.woodDark} strokeWidth={2} />
          <rect x={520} y={40} width={60} height={110} rx={8} fill={C.wood} stroke={C.woodDark} strokeWidth={3} />
          {[40, 130, 220].map((x) => (
            <rect key={x} x={x} y={150} width={14} height={50} fill={C.woodDark} />
          ))}
        </svg>
      </div>
      {/* awake head, eyes open */}
      <div style={{ position: "absolute", left: 150, top: 950 }}>
        <svg width={90} height={80} viewBox="0 0 90 80">
          <circle cx={45} cy={38} r={26} fill={C.wood} stroke={C.woodDark} strokeWidth={2.5} />
          <circle cx={36} cy={32} r={3.4} fill={C.ink} />
          <circle cx={54} cy={32} r={3.4} fill={C.ink} />
          <path d="M32,48 Q45,53 58,48" fill="none" stroke={C.woodLine} strokeWidth={2.5} />
        </svg>
      </div>
      {/* phone glow under the blanket */}
      <div
        style={{
          position: "absolute",
          left: 260,
          top: 1030,
          width: 200,
          height: 90,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, rgba(244,194,92,${glowFlicker}), transparent 70%)`,
        }}
      />
      {/* nightstand + teddy payoff */}
      <div style={{ position: "absolute", left: 730, top: 1080 }}>
        <svg width={220} height={110} viewBox="0 0 220 110">
          <rect x={0} y={10} width={220} height={22} rx={6} fill={C.wood} stroke={C.woodDark} strokeWidth={3} />
          <rect x={20} y={32} width={180} height={70} fill={C.paperDeep} stroke={C.woodDark} strokeWidth={2} />
          <rect x={70} y={44} width={80} height={12} rx={4} fill={C.woodDark} />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 745, top: 880 }}>
        <Teddy eyesOpen={frame >= nightAt} headTurn={-6} pupilDx={frame >= nightAt + 8 ? -3 : 0} height={210} />
      </div>
      <div style={{ position: "absolute", left: 900, top: 1030 }}>
        <Cup steamPhase={2} />
      </div>
      {/* phone tilts forward with the source list */}
      {frame >= checkAt && (
        <div
          style={{
            position: "absolute",
            left: 620,
            top: 700,
            transform: `rotate(${(1 - phonePop) * -16}deg) scale(${0.8 + 0.2 * phonePop})`,
          }}
        >
          <PhoneCard />
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- chrome

const TopStrip: React.FC<{ scene: Scene }> = ({ scene }) => (
  <div style={{ position: "absolute", left: SAFE_BOX.x, top: SAFE_BOX.y, width: SAFE_BOX.width, zIndex: 20 }}>
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 14,
        fontFamily: FONTS.SpaceGrotesk,
        fontSize: 30,
        fontWeight: 700,
        letterSpacing: 3,
        color: scene.dark ? C.labelDim : C.ink,
      }}
    >
      <span>{scene.chapter}</span>
      <span style={{ color: C.red }}>FIG. {scene.index + 1}</span>
    </div>
    <div style={{ height: 3, backgroundColor: C.red, marginTop: 10 }} />
  </div>
);

const Headline: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const at = (n: number) => wordFrame(n) - scene.startFrame;
  const swap = scene.swap && frame >= at(scene.swap.word) ? scene.swap : null;
  const l1 = swap ? swap.line1 : scene.line1;
  const l2 = swap ? swap.line2 : scene.line2;
  const start = swap ? at(swap.word) : 5;
  const cf = swap ? 0.8 : 1.15;
  return (
    <div style={{ position: "absolute", left: SAFE_BOX.x, top: 350, width: SAFE_BOX.width, zIndex: 10 }}>
      <TypeOn key={l1} text={l1} at={start} color={scene.dark ? C.cream : C.ink} size={72} charFrames={cf} />
      <TypeOn
        key={l2}
        text={l2}
        at={start + l1.length * cf + 4}
        color={C.red}
        size={72}
        charFrames={cf}
        style={{ marginTop: 10 }}
      />
    </div>
  );
};

const SCENE_VIEWS: React.FC<{ scene: Scene }>[] = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12];

const SceneView: React.FC<{ scene: Scene }> = ({ scene }) => {
  const View = SCENE_VIEWS[scene.index];
  const stampFrames = (scene.stamps ?? []).map((s) => wordFrame(s.word) - scene.startFrame);
  return (
    <AbsoluteFill>
      <SceneBG dark={!!scene.dark} vignette={scene.vignette ?? (scene.dark ? 0.45 : 0)} />
      <TopStrip scene={scene} />
      <Headline scene={scene} />
      <GlitchAt frames={stampFrames}>
        <View scene={scene} />
        {(scene.stamps ?? []).map((s) => (
          <StampIn key={s.text} text={s.text} at={wordFrame(s.word) - scene.startFrame} top={s.top} right={s.right} />
        ))}
      </GlitchAt>
    </AbsoluteFill>
  );
};

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  let current = -1;
  for (let i = 0; i < WORDS.length; i++) {
    if (WORDS[i].start <= time) current = i;
    else break;
  }
  if (current < 0) return null;
  const chunkSize = 4;
  const chunkStart = Math.floor(current / chunkSize) * chunkSize;
  const chunk = WORDS.slice(chunkStart, chunkStart + chunkSize);
  const last = chunk[chunk.length - 1];
  if (time > last.end + 0.55 && chunkStart + chunkSize >= WORDS.length) return null;

  return (
    <div
      data-el="captions"
      data-kind="caption"
      style={{
        position: "absolute",
        left: SAFE_BOX.x,
        bottom: CAPTION_BOTTOM,
        width: SAFE_BOX.width,
        display: "flex",
        justifyContent: "center",
        zIndex: 40,
      }}
    >
      <div
        style={{
          maxWidth: "100%",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0 0.28em",
          padding: "18px 28px",
          background: "rgba(247,239,220,0.94)",
          border: "2px solid rgba(36,29,25,0.12)",
          borderRadius: 16,
          boxShadow: "0 14px 34px rgba(36,29,25,0.2)",
          fontFamily: FONTS.Inter,
          fontSize: 50,
          fontWeight: 800,
          lineHeight: 1.18,
          letterSpacing: -0.5,
        }}
      >
        {chunk.map((w, i) => {
          const index = chunkStart + i;
          const isActive = index === current;
          return (
            <span
              key={index}
              style={{
                display: "inline-block",
                color: isActive ? C.orange : C.ink,
                opacity: isActive || index < current ? 1 : 0.3,
                transform: isActive ? "translateY(-2px) scale(1.04)" : "none",
              }}
            >
              {w.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const Reel: React.FC<ReelProps> = ({ brand = myBrand, debugSafeZones, probe }) => (
  <ReelFrame brand={brand} audio={AUDIO} debugSafeZones={debugSafeZones} probe={probe}>
    {SCENES.map((scene) => (
      <Sequence key={scene.index} from={scene.startFrame} durationInFrames={scene.durationFrames}>
        <SceneView scene={scene} />
      </Sequence>
    ))}
    <Captions />
  </ReelFrame>
);

export default Reel;
