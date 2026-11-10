import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadBarlow } from "@remotion/google-fonts/BarlowCondensed";
import { brand as myBrand } from "../../brand";
import { useBrand } from "../../brand-context";
import { FONTS } from "../../fonts";
import { CAPTION_BOTTOM, SAFE_BOX } from "../../layout";
import { ReelFrame, type ReelProps } from "../../components";
import { sec, type Word } from "../../timing";

const DISPLAY = loadBarlow("normal", { weights: ["700", "800"], subsets: ["latin"] }).fontFamily;
const SANS = FONTS.Inter;
const LABEL = FONTS.SpaceGrotesk;

export const AUDIO = "reels/white-house-hack/vo.wav";

const C = {
  paper: "#F7EFDC",
  paperDeep: "#E8D9BB",
  paperShade: "#D9C7A6",
  cream: "#FFF9EC",
  ink: "#241D19",
  inkSoft: "#4A3B30",
  red: "#C82E22",
  redDark: "#8E1F17",
  orange: "#EE6C26",
  charcoal: "#211D1A",
  charcoal2: "#2C2621",
  wood: "#C9A27A",
  woodLight: "#E6C9A2",
  woodDark: "#8F6A47",
  woodLine: "#5E4028",
  white: "#FFFFFF",
} as const;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const clampNum = (min: number, max: number, value: number) =>
  Math.max(min, Math.min(max, value));

const TRANSITION = 8;
const LAST_TAIL = 12;

type PropKind = "whitehouse" | "house" | "magnifier" | "server" | "door" | "mask" | "none";
type Pose = "point" | "shrug" | "hold" | "stand" | "kick" | "walk" | "wave";

type SceneDef = {
  chapter: string;
  line1: string;
  line2: string;
  seconds: number;
  script: string;
  prop: PropKind;
  pose: Pose;
  dark?: boolean;
  stamp?: string;
};

type Scene = SceneDef & {
  index: number;
  start: number;
  startFrame: number;
  durationFrames: number;
};

const SCENE_DEFS: SceneDef[] = [
  {
    chapter: "THE HOOK",
    line1: "SOMEONE WAS INSIDE",
    line2: "THE WHITE HOUSE NETWORK",
    seconds: 5.4,
    script:
      "Someone was hiding inside the White House network… and it didn’t look like a hack.",
    prop: "whitehouse",
    pose: "point",
  },
  {
    chapter: "THE NETWORK",
    line1: "RESIDENTIAL PROXY TRAFFIC",
    line2: "FROM THE WHITE HOUSE",
    seconds: 5.2,
    script:
      "Security researchers say they spotted residential proxy traffic coming from the White House network.",
    prop: "server",
    pose: "point",
  },
  {
    chapter: "THE ALERT",
    line1: "NOT A MOVIE BREAK-IN",
    line2: "NOT A RED ALERT",
    seconds: 4.0,
    script: "Not a movie-style break-in. Not a blinking red alert. Something quieter.",
    prop: "door",
    pose: "shrug",
    dark: true,
    stamp: "NOT A HACK",
  },
  {
    chapter: "THE PROXY",
    line1: "RESIDENTIAL PROXIES",
    line2: "LOOK LIKE HOME",
    seconds: 4.8,
    script:
      "Residential proxies are the kind that make internet traffic look like it’s coming from a normal home.",
    prop: "house",
    pose: "hold",
  },
  {
    chapter: "THE CREEP",
    line1: "THAT’S WHAT MAKES",
    line2: "IT CREEPY",
    seconds: 3.4,
    script: "That’s what makes this creepy.",
    prop: "magnifier",
    pose: "hold",
    dark: true,
  },
  {
    chapter: "THE BLEND",
    line1: "A REGULAR PERSON",
    line2: "ON REGULAR WI-FI",
    seconds: 4.6,
    script:
      "If the traffic looks like a regular person on a regular Wi-Fi connection, it blends in.",
    prop: "house",
    pose: "stand",
  },
  {
    chapter: "THE SLIP",
    line1: "IT SLIPS PAST",
    line2: "THE USUAL SUSPICION",
    seconds: 4.2,
    script:
      "It can slip past the kind of suspicion you’d have for a strange server in another country.",
    prop: "server",
    pose: "point",
    dark: true,
  },
  {
    chapter: "THE QUESTION",
    line1: "THE REAL QUESTION",
    line2: "WHO WAS USING IT?",
    seconds: 5.6,
    script:
      "So the question isn’t just, “How did this happen?” It’s, “Who was using that cover, and what were they trying to reach?”",
    prop: "door",
    pose: "shrug",
  },
  {
    chapter: "THE ANSWER",
    line1: "WE DON’T HAVE",
    line2: "EVERY ANSWER YET",
    seconds: 4.2,
    script: "We don’t have every answer yet.",
    prop: "magnifier",
    pose: "hold",
    dark: true,
  },
  {
    chapter: "THE REMINDER",
    line1: "THE SCARIEST THREATS",
    line2: "DON’T KICK THE DOOR",
    seconds: 6.0,
    script:
      "But when a network that powerful shows signs of hidden traffic, it’s a reminder: the scariest threats don’t always kick the door down.",
    prop: "door",
    pose: "kick",
  },
  {
    chapter: "THE MASK",
    line1: "SOMETIMES THEY WALK IN",
    line2: "AS ORDINARY LIFE",
    seconds: 5.0,
    script: "Sometimes they walk in wearing the mask of ordinary life.",
    prop: "mask",
    pose: "walk",
    dark: true,
    stamp: "TWIST!",
  },
  {
    chapter: "THE CTA",
    line1: "KEEP YOU UP AT NIGHT?",
    line2: "FOLLOW FOR MORE",
    seconds: 6.0,
    script:
      "If stories like this keep you up at night, follow for more real cases that sound fake until you check the sources.",
    prop: "none",
    pose: "wave",
    stamp: "FOLLOW FOR MORE",
  },
];

let cursor = 0;
const SCENES: Scene[] = SCENE_DEFS.map((def, index) => {
  const start = cursor;
  cursor += def.seconds;
  return {
    ...def,
    index,
    start,
    startFrame: sec(start),
    durationFrames: sec(def.seconds),
  };
});

// shortcut: word timings are estimated from the script; replace this with
// public/reels/white-house-hack/captions.words.json after `npm run sync`.
const WORDS: Word[] = SCENES.flatMap((scene) => {
  const tokens = scene.script.trim().split(/\s+/);
  const span = scene.seconds * 0.94;
  const step = span / tokens.length;
  return tokens.map((word, i) => ({
    word,
    start: scene.start + i * step,
    end: scene.start + (i + 1) * step - 0.04,
  }));
});

const LAST = SCENES[SCENES.length - 1];
export const durationInFrames = LAST.startFrame + LAST.durationFrames + LAST_TAIL;

const PopIn: React.FC<{
  delay: number;
  rotate?: number;
  origin?: string;
  children: React.ReactNode;
}> = ({ delay, rotate = 0, origin = "50% 80%", children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({
    frame: frame - delay,
    fps,
    config: { damping: 9, stiffness: 150, mass: 0.75 },
  });
  const opacity = interpolate(frame - delay, [0, 4], [0, 1], clamp);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${(1 - pop) * 28}px) scale(${0.72 + 0.28 * pop}) rotate(${
          rotate * (1 - pop)
        }deg)`,
        transformOrigin: origin,
        filter: "drop-shadow(0 18px 18px rgba(0,0,0,0.22))",
      }}
    >
      {children}
    </div>
  );
};

const PaperBG: React.FC<{ dark: boolean; id: number }> = ({ dark, id }) => (
  <AbsoluteFill
    style={{
      backgroundColor: dark ? C.charcoal : C.paper,
      overflow: "hidden",
    }}
  >
    <AbsoluteFill
      style={{
        backgroundImage: dark
          ? "radial-gradient(ellipse at 18% 10%, rgba(238,108,38,0.08), transparent 52%), radial-gradient(ellipse at 82% 88%, rgba(200,46,34,0.07), transparent 58%)"
          : "radial-gradient(ellipse at 18% 8%, rgba(255,255,255,0.62), transparent 50%), radial-gradient(ellipse at 82% 92%, rgba(143,106,71,0.16), transparent 58%)",
      }}
    />
    <AbsoluteFill
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(94,64,40,0.035) 0px, rgba(94,64,40,0.035) 1px, transparent 1px, transparent 5px)",
        opacity: dark ? 0.45 : 0.6,
        mixBlendMode: dark ? "screen" : "multiply",
      }}
    />
    <svg
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity: dark ? 0.18 : 0.3,
        mixBlendMode: dark ? "screen" : "multiply",
      }}
    >
      <filter id={`grain-${id}`}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.86"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncA type="linear" slope={0.42} />
        </feComponentTransfer>
      </filter>
      <rect width="100%" height="100%" filter={`url(#grain-${id})`} />
    </svg>
    <AbsoluteFill
      style={{
        background: dark
          ? "radial-gradient(ellipse at 50% 45%, transparent 30%, rgba(0,0,0,0.62) 100%)"
          : "radial-gradient(ellipse at 50% 45%, transparent 40%, rgba(90,64,36,0.2) 100%)",
      }}
    />
  </AbsoluteFill>
);

const TopStrip: React.FC<{ chapter: string; index: number; dark: boolean }> = ({
  chapter,
  index,
  dark,
}) => {
  const brand = useBrand();
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], clamp);

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE_BOX.x,
        top: SAFE_BOX.y,
        width: SAFE_BOX.width,
        opacity,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          color: dark ? "rgba(247,239,220,0.8)" : "rgba(36,29,25,0.72)",
          fontFamily: LABEL,
          fontSize: 23,
          fontWeight: 700,
          letterSpacing: 3.4,
        }}
      >
        <span>{`${chapter} / FIG. ${index + 1}`}</span>
        <span style={{ color: C.red, letterSpacing: 2 }}>{brand.handle}</span>
      </div>
      <div
        style={{
          marginTop: 12,
          height: 2,
          width: "100%",
          background: `linear-gradient(90deg, ${C.red} 0%, ${C.red} 58%, rgba(200,46,34,0) 100%)`,
        }}
      />
    </div>
  );
};

const TypeOn: React.FC<{
  text: string;
  delay: number;
  color: string;
  size: number;
}> = ({ text, delay, color, size }) => {
  const frame = useCurrentFrame();
  const chars = Array.from(text);

  return (
    <div
      aria-label={text}
      style={{
        fontFamily: DISPLAY,
        fontSize: size,
        fontWeight: 800,
        color,
        lineHeight: 0.92,
        letterSpacing: -0.5,
        whiteSpace: "nowrap",
      }}
    >
      {chars.map((char, i) => {
        const visible = frame >= delay + i * 1.15;
        return (
          <span
            key={`${char}-${i}`}
            aria-hidden="true"
            style={{
              display: "inline-block",
              opacity: visible ? 1 : 0,
              transform: `translateY(${visible ? 0 : 4}px)`,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
    </div>
  );
};

const Headline: React.FC<{ scene: Scene }> = ({ scene }) => {
  const longest = Math.max(scene.line1.length, scene.line2.length);
  const size = Math.round(clampNum(64, 120, 1980 / longest));
  const line1Delay = 8;
  const line2Delay = line1Delay + scene.line1.length * 1.15 + 5;

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE_BOX.x,
        top: SAFE_BOX.y + 76,
        width: SAFE_BOX.width,
      }}
    >
      <TypeOn
        text={scene.line1}
        delay={line1Delay}
        color={scene.dark ? C.paper : C.ink}
        size={size}
      />
      <TypeOn text={scene.line2} delay={line2Delay} color={C.red} size={size} />
    </div>
  );
};

type Pt = { x: number; y: number };
type Limb = [Pt, Pt, Pt];

const nudge = (limb: Limb, dx: number, dy = 0): Limb => [
  limb[0],
  limb[1],
  { x: limb[2].x + dx, y: limb[2].y + dy },
];

const POSES: Record<
  Pose,
  {
    leftArm: Limb;
    rightArm: Limb;
    leftLeg: Limb;
    rightLeg: Limb;
    lean: number;
  }
> = {
  stand: {
    leftArm: [
      { x: 78, y: 100 },
      { x: 64, y: 145 },
      { x: 58, y: 186 },
    ],
    rightArm: [
      { x: 122, y: 100 },
      { x: 136, y: 145 },
      { x: 142, y: 186 },
    ],
    leftLeg: [
      { x: 92, y: 190 },
      { x: 84, y: 250 },
      { x: 76, y: 310 },
    ],
    rightLeg: [
      { x: 108, y: 190 },
      { x: 116, y: 250 },
      { x: 124, y: 310 },
    ],
    lean: 0,
  },
  point: {
    leftArm: [
      { x: 78, y: 100 },
      { x: 64, y: 145 },
      { x: 58, y: 186 },
    ],
    rightArm: [
      { x: 122, y: 100 },
      { x: 154, y: 118 },
      { x: 186, y: 104 },
    ],
    leftLeg: [
      { x: 92, y: 190 },
      { x: 84, y: 250 },
      { x: 76, y: 310 },
    ],
    rightLeg: [
      { x: 108, y: 190 },
      { x: 116, y: 250 },
      { x: 124, y: 310 },
    ],
    lean: -3,
  },
  shrug: {
    leftArm: [
      { x: 78, y: 100 },
      { x: 58, y: 112 },
      { x: 42, y: 96 },
    ],
    rightArm: [
      { x: 122, y: 100 },
      { x: 142, y: 112 },
      { x: 158, y: 96 },
    ],
    leftLeg: [
      { x: 92, y: 190 },
      { x: 84, y: 250 },
      { x: 76, y: 310 },
    ],
    rightLeg: [
      { x: 108, y: 190 },
      { x: 116, y: 250 },
      { x: 124, y: 310 },
    ],
    lean: 0,
  },
  hold: {
    leftArm: [
      { x: 78, y: 100 },
      { x: 72, y: 140 },
      { x: 90, y: 132 },
    ],
    rightArm: [
      { x: 122, y: 100 },
      { x: 128, y: 140 },
      { x: 110, y: 132 },
    ],
    leftLeg: [
      { x: 92, y: 190 },
      { x: 84, y: 250 },
      { x: 76, y: 310 },
    ],
    rightLeg: [
      { x: 108, y: 190 },
      { x: 116, y: 250 },
      { x: 124, y: 310 },
    ],
    lean: 0,
  },
  kick: {
    leftArm: [
      { x: 78, y: 100 },
      { x: 60, y: 95 },
      { x: 48, y: 110 },
    ],
    rightArm: [
      { x: 122, y: 100 },
      { x: 140, y: 95 },
      { x: 152, y: 110 },
    ],
    leftLeg: [
      { x: 92, y: 190 },
      { x: 84, y: 250 },
      { x: 76, y: 310 },
    ],
    rightLeg: [
      { x: 108, y: 190 },
      { x: 150, y: 238 },
      { x: 188, y: 212 },
    ],
    lean: -6,
  },
  walk: {
    leftArm: [
      { x: 78, y: 100 },
      { x: 58, y: 132 },
      { x: 48, y: 170 },
    ],
    rightArm: [
      { x: 122, y: 100 },
      { x: 142, y: 132 },
      { x: 152, y: 170 },
    ],
    leftLeg: [
      { x: 92, y: 190 },
      { x: 70, y: 245 },
      { x: 58, y: 305 },
    ],
    rightLeg: [
      { x: 108, y: 190 },
      { x: 134, y: 245 },
      { x: 146, y: 305 },
    ],
    lean: -4,
  },
  wave: {
    leftArm: [
      { x: 78, y: 100 },
      { x: 64, y: 145 },
      { x: 58, y: 186 },
    ],
    rightArm: [
      { x: 122, y: 100 },
      { x: 148, y: 70 },
      { x: 160, y: 28 },
    ],
    leftLeg: [
      { x: 92, y: 190 },
      { x: 84, y: 250 },
      { x: 76, y: 310 },
    ],
    rightLeg: [
      { x: 108, y: 190 },
      { x: 116, y: 250 },
      { x: 124, y: 310 },
    ],
    lean: 0,
  },
};

const WoodLimb: React.FC<{ limb: Limb }> = ({ limb }) => {
  const points = limb.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <>
      <polyline
        points={points}
        fill="none"
        stroke={C.woodLine}
        strokeWidth={22}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points={points}
        fill="none"
        stroke={C.wood}
        strokeWidth={16}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points={points}
        fill="none"
        stroke={C.woodLight}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.65}
        transform="translate(-1.5 -1.5)"
      />
      {limb.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={i === 1 ? 8 : 7}
          fill={C.woodDark}
          stroke={C.woodLine}
          strokeWidth={2.5}
        />
      ))}
    </>
  );
};

const Mannequin: React.FC<{ pose: Pose; uid: string }> = ({ pose, uid }) => {
  const frame = useCurrentFrame();
  const poseData = POSES[pose];
  const idle = Math.sin(frame / 42) * 1.2;
  const breathe = Math.sin(frame / 26) * 0.8;
  const wave = pose === "wave" ? Math.sin(frame / 4) * 7 : 0;
  const step = pose === "walk" ? Math.sin(frame / 5) * 9 : 0;

  const rightArm = pose === "wave" ? nudge(poseData.rightArm, wave) : poseData.rightArm;
  const leftLeg = pose === "walk" ? nudge(poseData.leftLeg, step) : poseData.leftLeg;
  const rightLeg = pose === "walk" ? nudge(poseData.rightLeg, -step) : poseData.rightLeg;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 330"
      width={210}
      height={347}
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id={`wood-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={C.woodLight} />
          <stop offset="0.55" stopColor={C.wood} />
          <stop offset="1" stopColor={C.woodDark} />
        </linearGradient>
        <radialGradient id={`head-${uid}`} cx="35%" cy="28%" r="78%">
          <stop offset="0" stopColor={C.woodLight} />
          <stop offset="0.7" stopColor={C.wood} />
          <stop offset="1" stopColor={C.woodDark} />
        </radialGradient>
      </defs>

      <g transform={`rotate(${poseData.lean + idle} 100 312)`}>
        <WoodLimb limb={leftLeg} />
        <WoodLimb limb={rightLeg} />

        <ellipse
          cx={100}
          cy={145 + breathe}
          rx={28}
          ry={48}
          fill={`url(#wood-${uid})`}
          stroke={C.woodLine}
          strokeWidth={4}
        />
        <path
          d="M84 120 Q100 110 116 122 M82 145 Q100 136 118 148 M84 170 Q100 162 116 172"
          fill="none"
          stroke={C.woodDark}
          strokeWidth={2}
          opacity={0.42}
        />
        <line
          x1={100}
          y1={108}
          x2={100}
          y2={182}
          stroke={C.woodLine}
          strokeWidth={1.5}
          opacity={0.3}
        />

        <WoodLimb limb={poseData.leftArm} />
        <WoodLimb limb={rightArm} />

        <rect
          x={94}
          y={84}
          width={12}
          height={18}
          rx={5}
          fill={C.wood}
          stroke={C.woodLine}
          strokeWidth={3}
        />
        <circle
          cx={100}
          cy={190}
          r={14}
          fill={C.wood}
          stroke={C.woodLine}
          strokeWidth={3.5}
        />
        <circle cx={100} cy={190} r={5} fill={C.woodDark} stroke={C.woodLine} strokeWidth={2} />
        <circle
          cx={100}
          cy={55}
          r={26}
          fill={`url(#head-${uid})`}
          stroke={C.woodLine}
          strokeWidth={4}
        />
        <circle cx={100} cy={27} r={7} fill={C.woodDark} stroke={C.woodLine} strokeWidth={2.5} />
        <path
          d="M82 48 Q100 36 118 48"
          fill="none"
          stroke={C.woodDark}
          strokeWidth={2}
          opacity={0.4}
        />
      </g>
    </svg>
  );
};

const WhiteHouse: React.FC = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 440 340"
    width={440}
    height={340}
    style={{ overflow: "visible" }}
  >
    <g fill="none" stroke={C.red} strokeWidth={2.5} strokeDasharray="5 9" opacity={0.35}>
      <path d="M28 78 C 110 22 330 22 412 78" />
      <path d="M28 78 C 80 148 360 148 412 78" />
    </g>
    <circle cx={28} cy={78} r={6} fill={C.red} />
    <circle cx={412} cy={78} r={6} fill={C.red} />
    <path
      d="M62 152 L220 68 L378 152 Z"
      fill={C.paperDeep}
      stroke={C.ink}
      strokeWidth={6}
      strokeLinejoin="round"
    />
    <rect x={82} y={152} width={276} height={128} fill={C.paper} stroke={C.ink} strokeWidth={6} />
    <rect x={82} y={152} width={276} height={16} fill={C.paperShade} opacity={0.7} />
    {[105, 143, 181, 219, 257, 295, 333].map((x) => (
      <rect
        key={x}
        x={x}
        y={168}
        width={10}
        height={112}
        fill={C.paperDeep}
        stroke={C.ink}
        strokeWidth={3}
      />
    ))}
    <rect x={198} y={220} width={44} height={60} fill={C.ink} opacity={0.85} />
    <rect x={210} y={232} width={20} height={12} fill={C.orange} opacity={0.9} />
    <rect x={96} y={190} width={26} height={30} fill={C.orange} opacity={0.8} />
    <rect x={318} y={190} width={26} height={30} fill={C.orange} opacity={0.8} />
    <line x1={220} y1={68} x2={220} y2={26} stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
    <path d="M222 28 L262 38 L222 50 Z" fill={C.red} />
    <line x1={40} y1={280} x2={400} y2={280} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
    <path d="M70 280 L64 300 M370 280 L376 300" stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
  </svg>
);

const HouseWifi: React.FC = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 360 340"
    width={380}
    height={350}
    style={{ overflow: "visible" }}
  >
    <ellipse cx={180} cy={312} rx={132} ry={14} fill={C.ink} opacity={0.12} />
    <path
      d="M44 190 L180 92 L316 190"
      fill={C.paperDeep}
      stroke={C.ink}
      strokeWidth={6}
      strokeLinejoin="round"
    />
    <rect x={68} y={190} width={224} height={118} fill={C.paper} stroke={C.ink} strokeWidth={6} />
    <rect x={162} y={238} width={44} height={70} fill={C.ink} opacity={0.85} />
    <rect x={92} y={220} width={34} height={34} fill={C.orange} opacity={0.85} stroke={C.ink} strokeWidth={3} />
    <rect x={236} y={220} width={34} height={34} fill={C.orange} opacity={0.85} stroke={C.ink} strokeWidth={3} />
    <rect x={102} y={230} width={14} height={14} fill={C.paper} opacity={0.5} />
    <rect x={246} y={230} width={14} height={14} fill={C.paper} opacity={0.5} />
    <circle cx={180} cy={86} r={8} fill={C.orange} stroke={C.ink} strokeWidth={3} />
    <g fill="none" stroke={C.orange} strokeWidth={8} strokeLinecap="round">
      <path d="M122 66 Q180 16 238 66" />
      <path d="M144 80 Q180 46 216 80" />
    </g>
    <path d="M68 190 L44 190 M292 190 L316 190" stroke={C.red} strokeWidth={3} opacity={0.5} />
  </svg>
);

const Magnifier: React.FC<{ uid: string }> = ({ uid }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 360 340"
    width={380}
    height={350}
    style={{ overflow: "visible" }}
  >
    <defs>
      <clipPath id={`mag-${uid}`}>
        <circle cx={158} cy={138} r={92} />
      </clipPath>
      <radialGradient id={`glass-${uid}`} cx="35%" cy="28%" r="80%">
        <stop offset="0" stopColor={C.white} stopOpacity="0.55" />
        <stop offset="0.6" stopColor={C.paper} stopOpacity="0.22" />
        <stop offset="1" stopColor={C.orange} stopOpacity="0.14" />
      </radialGradient>
    </defs>
    <circle cx={158} cy={138} r={108} fill="none" stroke={C.ink} strokeWidth={10} />
    <circle
      cx={158}
      cy={138}
      r={100}
      fill={`url(#glass-${uid})`}
      stroke={C.red}
      strokeWidth={8}
    />
    <g clipPath={`url(#mag-${uid})`}>
      <circle cx={158} cy={138} r={92} fill={C.cream} opacity={0.5} />
      <path
        d="M112 182 L158 142 L204 182"
        fill={C.paperDeep}
        stroke={C.ink}
        strokeWidth={5}
        strokeLinejoin="round"
      />
      <rect x={124} y={182} width={68} height={38} fill={C.paper} stroke={C.ink} strokeWidth={5} />
      <rect x={150} y={198} width={16} height={22} fill={C.ink} opacity={0.8} />
      <circle cx={158} cy={132} r={5} fill={C.orange} stroke={C.ink} strokeWidth={2} />
      <path
        d="M136 122 Q158 100 180 122"
        fill="none"
        stroke={C.orange}
        strokeWidth={6}
        strokeLinecap="round"
      />
    </g>
    <line x1={238} y1={220} x2={314} y2={300} stroke={C.ink} strokeWidth={30} strokeLinecap="round" />
    <line
      x1={238}
      y1={220}
      x2={314}
      y2={300}
      stroke={C.woodDark}
      strokeWidth={22}
      strokeLinecap="round"
    />
    <line
      x1={244}
      y1={226}
      x2={306}
      y2={292}
      stroke={C.woodLight}
      strokeWidth={5}
      strokeLinecap="round"
      opacity={0.6}
    />
    <path
      d="M88 96 Q114 64 150 60"
      stroke={C.white}
      strokeWidth={8}
      strokeLinecap="round"
      fill="none"
      opacity={0.7}
    />
  </svg>
);

const Server: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 340 350"
      width={360}
      height={370}
      style={{ overflow: "visible" }}
    >
      <rect x={54} y={28} width={232} height={300} rx={10} fill={C.paperDeep} stroke={C.ink} strokeWidth={6} />
      {[52, 118, 184, 250].map((y, i) => (
        <g key={y}>
          <rect x={72} y={y} width={196} height={48} rx={5} fill={C.paper} stroke={C.ink} strokeWidth={4} />
          <line x1={90} y1={y + 14} x2={152} y2={y + 14} stroke={C.ink} strokeWidth={3} opacity={0.35} />
          <line x1={90} y1={y + 24} x2={180} y2={y + 24} stroke={C.ink} strokeWidth={3} opacity={0.22} />
          <line x1={90} y1={y + 34} x2={136} y2={y + 34} stroke={C.ink} strokeWidth={3} opacity={0.18} />
          <circle
            cx={244}
            cy={y + 16}
            r={5}
            fill={i === 0 ? C.red : C.orange}
            opacity={0.6 + 0.4 * Math.sin(frame / 8 + i)}
          />
          <circle cx={244} cy={y + 32} r={5} fill={C.ink} opacity={0.3} />
        </g>
      ))}
      <path
        d="M286 280 C 320 280 326 320 300 330"
        fill="none"
        stroke={C.red}
        strokeWidth={5}
        strokeLinecap="round"
        opacity={0.7}
      />
    </svg>
  );
};

const Door: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = 0.55 + Math.sin(frame / 10) * 0.15;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 340 360"
      width={350}
      height={370}
      style={{ overflow: "visible" }}
    >
      <rect x={48} y={20} width={244} height={320} rx={6} fill={C.paperDeep} stroke={C.ink} strokeWidth={6} />
      <rect x={72} y={44} width={196} height={272} fill={C.charcoal} />
      <path
        d="M72 44 L196 64 L196 296 L72 316 Z"
        fill={C.paper}
        stroke={C.ink}
        strokeWidth={5}
        strokeLinejoin="round"
      />
      <path d="M72 44 L72 316" stroke={C.ink} strokeWidth={5} />
      <rect x={108} y={90} width={56} height={90} rx={3} fill={C.paperShade} stroke={C.ink} strokeWidth={3} opacity={0.8} />
      <rect x={108} y={214} width={56} height={60} rx={3} fill={C.paperShade} stroke={C.ink} strokeWidth={3} opacity={0.8} />
      <circle cx={170} cy={184} r={8} fill={C.red} stroke={C.ink} strokeWidth={3} />
      <path d="M196 64 L268 44 L268 316 L196 296 Z" fill={C.orange} opacity={glow * 0.28} />
      <path d="M196 64 L268 44" stroke={C.ink} strokeWidth={4} />
      <path d="M268 44 L268 316" stroke={C.ink} strokeWidth={4} />
      <path d="M210 80 L252 70 M210 100 L252 90" stroke={C.white} strokeWidth={4} opacity={glow * 0.4} />
    </svg>
  );
};

const Mask: React.FC = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 360 280"
    width={390}
    height={300}
    style={{ overflow: "visible" }}
  >
    <path
      d="M52 128 C52 58 308 58 308 128 C308 208 252 252 180 252 C108 252 52 208 52 128 Z"
      fill={C.paper}
      stroke={C.ink}
      strokeWidth={6}
      strokeLinejoin="round"
    />
    <path d="M52 128 C40 118 30 128 24 140" fill="none" stroke={C.red} strokeWidth={5} strokeLinecap="round" />
    <path d="M308 128 C320 118 330 128 336 140" fill="none" stroke={C.red} strokeWidth={5} strokeLinecap="round" />
    <ellipse cx={128} cy={132} rx={36} ry={25} fill={C.charcoal} stroke={C.ink} strokeWidth={4} />
    <ellipse cx={232} cy={132} rx={36} ry={25} fill={C.charcoal} stroke={C.ink} strokeWidth={4} />
    <path d="M150 196 Q180 214 210 196" fill="none" stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
    <path d="M80 110 Q128 82 176 108" fill="none" stroke={C.paperShade} strokeWidth={5} opacity={0.8} />
    <path d="M184 108 Q232 82 280 110" fill="none" stroke={C.paperShade} strokeWidth={5} opacity={0.8} />
    <path d="M106 118 Q128 96 150 116" fill="none" stroke={C.white} strokeWidth={5} opacity={0.5} />
  </svg>
);

const PropView: React.FC<{ kind: PropKind; delay: number; uid: string }> = ({
  kind,
  delay,
  uid,
}) => {
  if (kind === "none") return null;

  const prop = (() => {
    switch (kind) {
      case "whitehouse":
        return <WhiteHouse />;
      case "house":
        return <HouseWifi />;
      case "magnifier":
        return <Magnifier uid={uid} />;
      case "server":
        return <Server />;
      case "door":
        return <Door />;
      case "mask":
        return <Mask />;
    }
  })();

  return (
    <PopIn delay={delay} rotate={-2} origin="50% 90%">
      {prop}
    </PopIn>
  );
};

const Stamp: React.FC<{
  text: string;
  delay: number;
  rotate: number;
  style?: React.CSSProperties;
}> = ({ text, delay, rotate, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({
    frame: frame - delay,
    fps,
    config: { damping: 7, stiffness: 210, mass: 0.6 },
  });
  const hit = Math.max(0, frame - delay);
  const shake = Math.sin(hit * 2.4) * 4 * Math.exp(-hit / 5);
  const opacity = interpolate(hit, [0, 3], [0, 1], clamp);

  return (
    <div
      aria-hidden="true"
      style={{
        ...style,
        opacity,
        transform: `rotate(${rotate + shake}deg) scale(${0.5 + 0.5 * pop})`,
        border: `5px solid ${C.red}`,
        outline: `2px solid rgba(200,46,34,0.35)`,
        outlineOffset: -8,
        borderRadius: 10,
        padding: "10px 22px 6px",
        color: C.red,
        background: "rgba(200,46,34,0.06)",
        fontFamily: DISPLAY,
        fontSize: 54,
        fontWeight: 800,
        letterSpacing: 2,
        lineHeight: 1,
        whiteSpace: "nowrap",
        boxShadow: "0 8px 24px rgba(36,29,25,0.18)",
      }}
    >
      {text}
    </div>
  );
};

const Visual: React.FC<{ scene: Scene }> = ({ scene }) => {
  const propLeft = scene.index % 2 === 0;
  const stampSide = propLeft ? { left: 12 } : { right: 12 };

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE_BOX.x,
        top: 600,
        width: SAFE_BOX.width,
        height: 720,
        display: "flex",
        flexDirection: propLeft ? "row" : "row-reverse",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 10,
          left: "50%",
          width: 570,
          height: 34,
          transform: "translateX(-50%)",
          borderRadius: "50%",
          background: scene.dark ? "rgba(0,0,0,0.42)" : "rgba(90,64,36,0.16)",
          filter: "blur(12px)",
        }}
      />
      <PropView kind={scene.prop} delay={12} uid={`p-${scene.index}`} />
      <PopIn delay={18} origin="50% 90%">
        <Mannequin pose={scene.pose} uid={`m-${scene.index}`} />
      </PopIn>
      {scene.stamp ? (
        <Stamp
          text={scene.stamp}
          delay={26}
          rotate={scene.stamp === "NOT A HACK" ? -9 : 7}
          style={{ position: "absolute", bottom: 4, ...stampSide }}
        />
      ) : null}
    </div>
  );
};

const SceneView: React.FC<{ scene: Scene; isLast: boolean }> = ({ scene, isLast }) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, TRANSITION], [0, 1], clamp);
  const fadeOut = isLast
    ? 1
    : interpolate(frame, [scene.durationFrames, scene.durationFrames + TRANSITION], [1, 0], clamp);
  const opacity = Math.min(fadeIn, fadeOut);
  const drift = interpolate(frame, [0, scene.durationFrames], [0, -14], clamp);

  return (
    <AbsoluteFill
      style={{
        opacity,
        overflow: "hidden",
        backgroundColor: scene.dark ? C.charcoal : C.paper,
      }}
    >
      <PaperBG dark={Boolean(scene.dark)} id={scene.index} />
      <div style={{ position: "absolute", inset: 0, transform: `translate3d(0, ${drift}px, 0)` }}>
        <TopStrip chapter={scene.chapter} index={scene.index} dark={Boolean(scene.dark)} />
        <Headline scene={scene} />
        <Visual scene={scene} />
      </div>
    </AbsoluteFill>
  );
};

const Captions: React.FC<{ words: Word[] }> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  let current = -1;
  for (let i = 0; i < words.length; i++) {
    if (words[i].start <= time) current = i;
    else break;
  }
  if (current < 0) return null;

  const chunkSize = 4;
  const chunkStart = Math.floor(current / chunkSize) * chunkSize;
  const chunk = words.slice(chunkStart, chunkStart + chunkSize);
  const last = chunk[chunk.length - 1];
  if (time > last.end + 0.55 && chunkStart + chunkSize >= words.length) return null;

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
          gap: "0 0.3em",
          padding: "18px 28px",
          background: "rgba(247,239,220,0.94)",
          border: "2px solid rgba(36,29,25,0.12)",
          borderRadius: 16,
          boxShadow: "0 14px 34px rgba(36,29,25,0.2)",
          fontFamily: SANS,
          fontSize: 50,
          fontWeight: 800,
          lineHeight: 1.18,
          letterSpacing: -0.5,
        }}
      >
        {chunk.map((word, i) => {
          const index = chunkStart + i;
          const isActive = index === current;
          const isSpoken = index < current;
          return (
            <span
              key={index}
              style={{
                display: "inline-block",
                color: isActive ? C.orange : isSpoken ? C.ink : "rgba(36,29,25,0.3)",
                transform: isActive ? "translateY(-1px) scale(1.04)" : "none",
                textShadow: isActive ? "0 2px 0 rgba(238,108,38,0.16)" : "none",
              }}
            >
              {word.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const Reel: React.FC<ReelProps> = ({ brand = myBrand, debugSafeZones, probe }) => (
  <ReelFrame brand={brand} audio={AUDIO} debugSafeZones={debugSafeZones} probe={probe}>
    {SCENES.map((scene) => {
      const isLast = scene.index === SCENES.length - 1;
      return (
        <Sequence
          key={scene.index}
          from={scene.startFrame}
          durationInFrames={scene.durationFrames + (isLast ? LAST_TAIL : TRANSITION)}
        >
          <SceneView scene={scene} isLast={isLast} />
        </Sequence>
      );
    })}
    <Captions words={WORDS} />
  </ReelFrame>
);

export default Reel;
