import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand as myBrand } from "../../brand";
import { useBrand } from "../../brand-context";
import { Avatar } from "../../avatars/Avatar";
import { useMouth } from "../../avatars/useMouth";
import type { PoseCue } from "../../avatars/SpritePlayer";
import { ReelFrame, SceneBlock, type ReelProps } from "../../components";
import { CAPTION_BOTTOM, SAFE, SAFE_BOX } from "../../layout";
import { timing, type Word } from "../../timing";
import mouthData from "../../../public/reels/habits-over-40/mouth.json";
import words from "../../../public/reels/habits-over-40/captions.words.json";

export const t = timing(words);
export const AUDIO = "reels/habits-over-40/vo.wav";
// Keep the cinematic end card alive through the 1,525-frame composition registered for this reel.
export const durationInFrames = Math.max(t.duration(), 1525);

const IVORY = "#f7f0dc";
const MUTED = "#aaa99f";
const GOLD = "#e7b86b";
const GOLD_BRIGHT = "#ffe0a1";
const RUBY = "#bd5268";
const CYAN = "#77d5d0";
const NIGHT = "#070910";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const ENTRY = { damping: 24, stiffness: 150, mass: 0.9 };
const WORD_ENTRY = { damping: 18, stiffness: 230, mass: 0.65 };
const cleanWord = (value: string) => value.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

// The scene rhythm follows the spoken phrases, with shorter chapters where the narration pivots.
const S = {
  hook: [0, t.atText("First", 5.44)],
  sleep: [t.atText("First", 5.44), t.atText("It's", 11.46)],
  recovery: [t.atText("It's", 11.46), t.atText("Next", 15)],
  movement: [t.atText("Next", 15), t.atText("This", 21)],
  choices: [t.atText("This", 21), t.atText("Finally", 27.28)],
  nutrition: [t.atText("Finally", 27.28), t.atText("Proper", 34.56)],
  nourishment: [t.atText("Proper", 34.56), t.atText("The", 38.98, 1)],
  impact: [t.atText("The", 38.98, 1), t.atText("Comment", 44.16)],
  end: [t.atText("Comment", 44.16), durationInFrames],
} as const;

const poseCues: PoseCue[] = [
  { at: 0, pose: "idle" },
  { at: 5.44, pose: "one" },
  { at: 15, pose: "two" },
  { at: 27.28, pose: "three" },
  { at: 38.98, pose: "explain" },
  { at: 44.16, pose: "point-down" },
];

const REVEAL_WORDS: React.FC<{
  text: string;
  at: number;
  highlight?: string;
  style?: React.CSSProperties;
}> = ({ text, at, highlight, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tokens = text.trim().split(/\s+/);
  const highlightKey = highlight ? cleanWord(highlight) : "";

  return (
    <span aria-label={text} style={{ display: "inline", ...style }}>
      {tokens.map((token, index) => {
        const progress = spring({ frame: frame - (at + index * 2), fps, config: WORD_ENTRY });
        const clip = interpolate(progress, [0, 1], [100, 0], clamp);
        const opacity = interpolate(progress, [0, 0.35, 1], [0.58, 0.86, 1], clamp);
        const scale = interpolate(progress, [0, 1], [0.97, 1], clamp);
        const isHighlight = highlightKey !== "" && cleanWord(token) === highlightKey;

        return (
          <span key={`${token}-${index}`} style={{ display: "inline-block", verticalAlign: "bottom", marginRight: index === tokens.length - 1 ? 0 : "0.2em" }}>
            <span
              aria-hidden="true"
              style={{
                display: "inline-block",
                color: isHighlight ? GOLD_BRIGHT : style?.color ?? IVORY,
                opacity,
                clipPath: `inset(${clip}% 0 0 0)`,
                transform: `translate3d(0, 0, 0) scale(${scale})`,
                transformOrigin: "50% 100%",
                textShadow: isHighlight ? `0 0 24px ${GOLD}66` : "none",
                willChange: "transform, opacity",
              }}
            >
              {token}
            </span>
          </span>
        );
      })}
    </span>
  );
};

const StainedGlassWindow: React.FC<{ id: string; tint?: string; revealAt?: number }> = ({ id, tint = GOLD, revealAt = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = spring({ frame: frame - revealAt, fps, config: { damping: 28, stiffness: 120, mass: 1.2 } });
  const lift = interpolate(reveal, [0, 1], [26, 0], clamp);
  const opacity = interpolate(reveal, [0, 1], [0.28, 0.92], clamp);
  const cells = [
    ["M18 22 L72 22 L72 125 L18 125 Z", GOLD],
    ["M78 22 L132 22 L132 125 L78 125 Z", CYAN],
    ["M138 22 L192 22 L192 125 L138 125 Z", RUBY],
    ["M198 22 L252 22 L252 125 L198 125 Z", GOLD_BRIGHT],
    ["M18 132 L72 132 L72 240 L18 240 Z", RUBY],
    ["M78 132 L132 132 L132 240 L78 240 Z", GOLD_BRIGHT],
    ["M138 132 L192 132 L192 240 L138 240 Z", CYAN],
    ["M198 132 L252 132 L252 240 L198 240 Z", RUBY],
    ["M18 247 L72 247 L72 355 L18 355 Z", CYAN],
    ["M78 247 L132 247 L132 355 L78 355 Z", RUBY],
    ["M138 247 L192 247 L192 355 L138 355 Z", GOLD],
    ["M198 247 L252 247 L252 355 L198 355 Z", CYAN],
  ];

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 270 560"
      style={{
        width: "100%",
        height: "100%",
        overflow: "visible",
        opacity,
        transform: `translate3d(0, ${lift}px, 0)`,
        filter: `drop-shadow(0 0 22px ${tint}44)`,
      }}
    >
      <defs>
        <linearGradient id={`${id}-wash`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={tint} stopOpacity="0.15" />
          <stop offset="0.5" stopColor={CYAN} stopOpacity="0.08" />
          <stop offset="1" stopColor={RUBY} stopOpacity="0.2" />
        </linearGradient>
        <clipPath id={`${id}-arch`}>
          <path d="M10 550 V128 C10 42 68 4 135 4 C202 4 260 42 260 128 V550 Z" />
        </clipPath>
      </defs>
      <path d="M10 550 V128 C10 42 68 4 135 4 C202 4 260 42 260 128 V550 Z" fill={`url(#${id}-wash)`} stroke={`${IVORY}66`} strokeWidth="3" />
      <g clipPath={`url(#${id}-arch)`}>
        <rect x="0" y="0" width="270" height="560" fill={`${NIGHT}99`} />
        {cells.map(([path, color], index) => (
          <path key={index} d={path} fill={color} fillOpacity={0.48 + (index % 3) * 0.12} stroke={`${IVORY}55`} strokeWidth="3" />
        ))}
        <path d="M135 0 V560 M0 240 H270 M0 360 H270" stroke={`${IVORY}aa`} strokeWidth="5" />
        <circle cx="135" cy="90" r="31" fill="none" stroke={GOLD_BRIGHT} strokeWidth="5" />
        <circle cx="135" cy="90" r="10" fill={GOLD_BRIGHT} opacity="0.8" />
        <path d="M22 414 Q135 328 248 414 V560 H22 Z" fill={tint} fillOpacity="0.32" />
        <path d="M40 500 Q135 410 230 500" fill="none" stroke={GOLD_BRIGHT} strokeOpacity="0.55" strokeWidth="4" />
      </g>
      <path d="M10 550 V128 C10 42 68 4 135 4 C202 4 260 42 260 128 V550" fill="none" stroke={IVORY} strokeOpacity="0.8" strokeWidth="6" />
    </svg>
  );
};

const GlassParticles: React.FC = () => {
  const frame = useCurrentFrame();
  const particles = [
    [8, 20, 4, 0.017, 0.2],
    [18, 76, 3, 0.024, 1.1],
    [25, 44, 5, 0.013, 2.2],
    [34, 88, 3, 0.02, 0.6],
    [42, 12, 4, 0.016, 1.7],
    [51, 67, 2, 0.03, 2.8],
    [60, 30, 4, 0.018, 1.3],
    [70, 92, 3, 0.022, 0.1],
    [77, 57, 5, 0.015, 2.6],
    [86, 18, 3, 0.026, 1.9],
    [92, 80, 4, 0.019, 0.9],
  ];

  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: 0.72 }}>
      {particles.map(([top, left, size, speed, phase], index) => {
        const drift = Math.sin(frame * speed + phase) * 18;
        const shimmer = 0.3 + (Math.sin(frame * speed * 1.8 + phase) + 1) * 0.28;
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              top: `${top}%`,
              left: `${left}%`,
              width: size,
              height: size,
              borderRadius: "50%",
              background: index % 2 ? CYAN : GOLD_BRIGHT,
              opacity: shimmer,
              boxShadow: `0 0 ${size * 5}px ${index % 2 ? CYAN : GOLD_BRIGHT}`,
              transform: `translate3d(${drift}px, ${Math.cos(frame * speed + phase) * 12}px, 0)`,
            }}
          />
        );
      })}
    </div>
  );
};

const LightShafts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = interpolate(frame % (fps * 4), [0, fps * 2, fps * 4], [0.35, 0.72, 0.35], { easing: Easing.inOut(Easing.sin), ...clamp });
  const shafts = [
    { left: "-10%", width: 160, rotate: -22, color: GOLD_BRIGHT, delay: 0 },
    { left: "13%", width: 92, rotate: -15, color: CYAN, delay: 0.8 },
    { left: "42%", width: 130, rotate: -8, color: GOLD, delay: 1.6 },
    { left: "71%", width: 88, rotate: 9, color: RUBY, delay: 2.4 },
    { left: "91%", width: 150, rotate: 17, color: GOLD_BRIGHT, delay: 3.1 },
  ];

  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: -220, overflow: "hidden", opacity: 0.36 }}>
      {shafts.map((shaft, index) => {
        const drift = Math.sin(frame / 48 + shaft.delay) * 30;
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              top: -260,
              bottom: -260,
              left: shaft.left,
              width: shaft.width,
              background: `linear-gradient(180deg, transparent, ${shaft.color}55 32%, ${shaft.color}22 70%, transparent)`,
              opacity: pulse * (index % 2 ? 0.65 : 1),
              filter: "blur(18px)",
              transform: `translate3d(${drift}px, 0, 0) rotate(${shaft.rotate}deg)`,
              transformOrigin: "50% 50%",
            }}
          />
        );
      })}
    </div>
  );
};

const CinematicWorld: React.FC = () => {
  const frame = useCurrentFrame();
  const camera = interpolate(frame, [0, durationInFrames], [1.01, 1.045], clamp);
  const x = Math.sin(frame / 90) * 5;
  const y = Math.cos(frame / 110) * 4;

  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", background: NIGHT }}>
      <div
        style={{
          position: "absolute",
          inset: -50,
          transform: `translate3d(${x}px, ${y}px, 0) scale(${camera})`,
          background: `radial-gradient(circle at 72% 24%, ${GOLD}1a 0, transparent 28%), radial-gradient(circle at 22% 68%, ${CYAN}13 0, transparent 30%), linear-gradient(145deg, #121327 0%, ${NIGHT} 48%, #160b13 100%)`,
        }}
      />
      <LightShafts />
      <GlassParticles />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.16,
          backgroundImage: "repeating-radial-gradient(circle at 20% 30%, transparent 0, transparent 2px, rgba(255,255,255,0.13) 3px, transparent 4px)",
          backgroundSize: "9px 9px",
          mixBlendMode: "screen",
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 28%, rgba(0,0,0,0.24) 63%, rgba(0,0,0,0.86) 100%)" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 24, background: "#020308" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 24, background: "#020308" }} />
    </div>
  );
};

const BrandLine: React.FC<{ chapter?: string }> = ({ chapter = "A STUDY IN CONSISTENCY" }) => {
  const b = useBrand();
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: `${IVORY}a8`, fontFamily: b.fontFamily, fontSize: 22, letterSpacing: 4, fontWeight: 600 }}>
      <span>{chapter}</span>
      <span style={{ color: GOLD, letterSpacing: 2 }}>{b.handle}</span>
    </div>
  );
};

const SceneMotion: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - at, fps, config: ENTRY });
  const y = interpolate(progress, [0, 1], [28, 0], clamp);
  const scale = interpolate(progress, [0, 1], [0.985, 1], clamp);
  const bloom = interpolate(frame - at, [0, 8, 22], [0.48, 0.12, 0], clamp);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: 0.98, transform: `translate3d(0, ${y}px, 0) scale(${scale})`, transformOrigin: "50% 48%", willChange: "transform" }}>
      {children}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `radial-gradient(circle at 78% 38%, ${GOLD_BRIGHT} 0, transparent 25%)`, opacity: bloom, mixBlendMode: "screen", filter: "blur(20px)" }} />
    </div>
  );
};

const CinematicPanel: React.FC<{ top?: number; height?: number; children: React.ReactNode; align?: "left" | "center" }> = ({ top = 300, height = 1120, children, align = "left" }) => (
  <div
    data-el="card"
    data-kind="content"
    style={{
      position: "absolute",
      left: SAFE_BOX.x,
      top,
      width: SAFE_BOX.width,
      height,
      boxSizing: "border-box",
      padding: 58,
      overflow: "hidden",
      color: IVORY,
      textAlign: align,
      fontFamily: "inherit",
      background: `linear-gradient(135deg, rgba(15,18,32,0.88), rgba(7,9,16,0.65))`,
      border: `1px solid ${IVORY}2b`,
      borderRadius: 8,
      boxShadow: `0 28px 90px rgba(0,0,0,0.48), inset 0 0 80px ${GOLD}08`,
    }}
  >
    <div aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, width: 170, height: 2, background: `linear-gradient(90deg, ${GOLD_BRIGHT}, transparent)` }} />
    <div aria-hidden="true" style={{ position: "absolute", right: 0, bottom: 0, width: 210, height: 2, background: `linear-gradient(270deg, ${CYAN}, transparent)` }} />
    {children}
  </div>
);

const ChapterLabel: React.FC<{ chapter: string; number: string; at: number }> = ({ chapter, number, at }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 20, color: GOLD, fontSize: 24, fontWeight: 700, letterSpacing: 4 }}>
    <span style={{ display: "inline-flex", width: 58, height: 58, alignItems: "center", justifyContent: "center", border: `1px solid ${GOLD}aa`, borderRadius: "50%", fontSize: 22 }}>
      <REVEAL_WORDS text={number} at={at} style={{ color: GOLD_BRIGHT }} />
    </span>
    <span><REVEAL_WORDS text={chapter} at={at + 4} style={{ color: GOLD }} /></span>
  </div>
);

const HabitPanel: React.FC<{
  at: number;
  number: string;
  chapter: string;
  title: string;
  titleAt: number;
  body: string;
  bodyAt: number;
  detail: string;
  tint?: string;
}> = ({ at, number, chapter, title, titleAt, body, bodyAt, detail, tint = GOLD }) => (
  <SceneMotion at={at}>
    <CinematicPanel>
      <BrandLine chapter={chapter} />
      <div style={{ marginTop: 68, width: 560 }}>
        <ChapterLabel chapter={chapter} number={number} at={at + 4} />
        <div style={{ marginTop: 44, fontSize: 70, lineHeight: 1.02, letterSpacing: -2, fontWeight: 700, maxWidth: 570 }}>
          <REVEAL_WORDS text={title} at={titleAt} highlight={title.split(" ")[0]} />
        </div>
        <div style={{ width: 120, height: 3, margin: "38px 0 34px", background: `linear-gradient(90deg, ${tint}, transparent)` }} />
        <div style={{ fontSize: 42, lineHeight: 1.16, fontWeight: 600, color: IVORY, maxWidth: 530 }}>
          <REVEAL_WORDS text={body} at={bodyAt} />
        </div>
        <div style={{ marginTop: 44, paddingTop: 26, borderTop: `1px solid ${IVORY}2b`, color: MUTED, fontSize: 28, lineHeight: 1.3, maxWidth: 500 }}>
          <REVEAL_WORDS text={detail} at={bodyAt + 18} style={{ color: MUTED }} />
        </div>
      </div>
      <div style={{ position: "absolute", right: 58, top: 210, width: 250, height: 560 }}>
        <StainedGlassWindow id={`window-${number}-${at}`} tint={tint} revealAt={at + 8} />
      </div>
      <div aria-hidden="true" style={{ position: "absolute", right: 84, bottom: 78, color: `${tint}88`, fontSize: 18, letterSpacing: 3 }}>RESTORE / REPEAT</div>
    </CinematicPanel>
  </SceneMotion>
);

const CinematicCaptions: React.FC<{ words: Word[] }> = ({ words: captionWords }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  if (!captionWords.length) return null;

  let current = -1;
  for (let index = 0; index < captionWords.length; index++) {
    if (captionWords[index].start <= time) current = index;
    else break;
  }
  if (current < 0) return null;

  const chunkSize = 4;
  const chunkStart = Math.floor(current / chunkSize) * chunkSize;
  const chunk = captionWords.slice(chunkStart, chunkStart + chunkSize);
  const last = chunk[chunk.length - 1];
  if (time > last.end + 0.45 && chunkStart + chunkSize >= captionWords.length) return null;

  const keys = new Set(["cardio", "habits", "sleep", "movement", "hydration", "nutrition", "energy"].map(cleanWord));
  return (
    <div data-el="captions" data-kind="caption" style={{ position: "absolute", left: SAFE_BOX.x, width: SAFE_BOX.width, bottom: CAPTION_BOTTOM, display: "flex", justifyContent: "center", fontFamily: "inherit" }}>
      <div style={{ maxWidth: "100%", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 0.28em", padding: "16px 26px", border: `1px solid ${IVORY}38`, borderRadius: 6, background: "rgba(5,7,13,0.9)", boxShadow: `0 10px 34px rgba(0,0,0,0.38), 0 0 24px ${GOLD}12`, fontSize: 43, fontWeight: 700, lineHeight: 1.22 }}>
        {chunk.map((word, index) => {
          const absoluteIndex = chunkStart + index;
          const spoken = absoluteIndex <= current;
          const active = time >= word.start && time <= word.end;
          const progress = spring({ frame: frame - word.start * fps, fps, config: WORD_ENTRY });
          const y = interpolate(progress, [0, 1], [10, 0], clamp);
          const scale = interpolate(progress, [0, 1], [0.92, 1], clamp);
          const isKey = keys.has(cleanWord(word.word));
          return (
            <span key={absoluteIndex} style={{ display: "inline-block", color: active ? NIGHT : isKey ? GOLD_BRIGHT : IVORY, opacity: spoken ? 1 : 0.34, background: active ? GOLD_BRIGHT : "transparent", borderRadius: 3, padding: active ? "0 0.08em" : 0, transform: `translate3d(0, ${y}px, 0) scale(${scale})`, transformOrigin: "50% 100%", textShadow: active ? `0 0 18px ${GOLD_BRIGHT}` : "none" }}>{word.word}</span>
          );
        })}
      </div>
    </div>
  );
};

const HookScene: React.FC = () => {
  const b = useBrand();
  return (
    <SceneMotion at={0}>
      <CinematicPanel top={350} height={980}>
        <BrandLine chapter="THE CATHEDRAL OF CONSISTENCY" />
        <div style={{ marginTop: 132, width: 610 }}>
          <div style={{ color: GOLD, fontSize: 24, fontWeight: 700, letterSpacing: 5 }}><REVEAL_WORDS text="A VERTICAL STUDY IN LIGHT" at={0} style={{ color: GOLD }} /></div>
          <div style={{ marginTop: 34, fontSize: 96, lineHeight: 0.98, letterSpacing: -4, fontWeight: 700 }}>
            <div><REVEAL_WORDS text="STOP DOING" at={0} /></div>
            <div style={{ color: GOLD_BRIGHT, textShadow: `0 0 32px ${GOLD}55` }}><REVEAL_WORDS text="CARDIO" at={5} highlight="CARDIO" /></div>
          </div>
          <div style={{ width: 170, height: 4, margin: "46px 0 34px", background: `linear-gradient(90deg, ${GOLD_BRIGHT}, transparent)` }} />
          <div style={{ color: IVORY, fontSize: 38, lineHeight: 1.22, maxWidth: 520 }}><REVEAL_WORDS text="Women over 40 need these 3 habits instead." at={t.atText("Women", 2.26)} /></div>
        </div>
        <div style={{ position: "absolute", right: 54, top: 134, width: 250, height: 560 }}><StainedGlassWindow id="window-hook" revealAt={10} /></div>
        <div style={{ position: "absolute", bottom: 62, left: 58, color: MUTED, fontSize: 20, letterSpacing: 4, fontFamily: b.fontFamily }}>01 / 09 &nbsp; • &nbsp; MAKE ROOM FOR WHAT RESTORES YOU</div>
      </CinematicPanel>
    </SceneMotion>
  );
};

const ImpactScene: React.FC = () => (
  <SceneMotion at={S.impact[0]}>
    <CinematicPanel top={430} height={780} align="center">
      <BrandLine chapter="THE LIGHT RETURNS" />
      <div style={{ marginTop: 108, fontSize: 68, lineHeight: 1.05, letterSpacing: -2, fontWeight: 700 }}>
        <div><REVEAL_WORDS text="The biggest impact" at={S.impact[0]} highlight="biggest" /></div>
        <div style={{ color: GOLD_BRIGHT, textShadow: `0 0 30px ${GOLD}55` }}><REVEAL_WORDS text="comes from the simplest" at={S.impact[0] + 8} highlight="simplest" /></div>
        <div><REVEAL_WORDS text="daily actions." at={S.impact[0] + 16} /></div>
      </div>
      <div style={{ width: 150, height: 3, margin: "58px auto 30px", background: `linear-gradient(90deg, transparent, ${GOLD_BRIGHT}, transparent)` }} />
      <div style={{ color: MUTED, fontSize: 26, letterSpacing: 4 }}>CONSISTENCY IS A FORM OF SELF-RESPECT</div>
      <div style={{ position: "absolute", left: 274, top: 110, width: 350, height: 600, opacity: 0.34 }}><StainedGlassWindow id="window-impact" tint={GOLD_BRIGHT} revealAt={S.impact[0]} /></div>
    </CinematicPanel>
  </SceneMotion>
);

const EndScene: React.FC = () => {
  const b = useBrand();
  return (
    <SceneMotion at={S.end[0]}>
      <CinematicPanel top={350} height={1000} align="center">
        <BrandLine chapter="THE FINAL WINDOW" />
        <div style={{ marginTop: 92, fontSize: 60, lineHeight: 1.08, letterSpacing: -1.5, fontWeight: 700 }}>
          <div><REVEAL_WORDS text="Want the breakdown?" at={S.end[0]} /></div>
          <div style={{ marginTop: 22, color: GOLD_BRIGHT, fontSize: 112, letterSpacing: 7, textShadow: `0 0 38px ${GOLD}66` }}><REVEAL_WORDS text="HABITS" at={S.end[0] + 8} highlight="HABITS" /></div>
        </div>
        <div style={{ marginTop: 42, color: IVORY, fontSize: 34, lineHeight: 1.3 }}><REVEAL_WORDS text="Comment HABITS and I'll send you a detailed breakdown!" at={S.end[0] + 16} highlight="HABITS" /></div>
        <div style={{ margin: "58px auto 0", width: 220, height: 350, opacity: 0.92 }}><StainedGlassWindow id="window-end" tint={GOLD_BRIGHT} revealAt={S.end[0] + 10} /></div>
        <div style={{ position: "absolute", bottom: 54, left: 0, right: 0, color: GOLD, fontSize: 24, letterSpacing: 5, fontFamily: b.fontFamily }}>{b.handle} &nbsp; / &nbsp; RETURN TO YOUR LIGHT</div>
      </CinematicPanel>
    </SceneMotion>
  );
};

export const Reel: React.FC<ReelProps> = ({ brand = myBrand, avatar = "none", debugSafeZones, probe }) => {
  const mouth = useMouth(mouthData, words);
  return (
    <ReelFrame brand={brand} audio={AUDIO} debugSafeZones={debugSafeZones} probe={probe}>
      <CinematicWorld />

      <SceneBlock name="hook" from={S.hook[0]} to={S.hook[1]}><HookScene /></SceneBlock>
      <SceneBlock name="sleep" from={S.sleep[0]} to={S.sleep[1]}>
        <HabitPanel at={S.sleep[0]} number="01" chapter="RESTORE" title="Prioritize sleep" titleAt={t.atText("prioritize", 6.46)} body="Aim for 7 to 9 hours of quality sleep." bodyAt={t.atText("Aim", 8.3)} detail="Quality sleep is where energy, mood, and recovery begin." tint={CYAN} />
      </SceneBlock>
      <SceneBlock name="recovery" from={S.recovery[0]} to={S.recovery[1]}>
        <HabitPanel at={S.recovery[0]} number="01" chapter="RECOVER" title="Let recovery catch up" titleAt={t.atText("It's", 11.46)} body="Sleep is not a reward. It is the foundation." bodyAt={t.atText("It's", 11.46)} detail="Protect the quiet hours that give tomorrow its strength." tint={GOLD} />
      </SceneBlock>
      <SceneBlock name="movement" from={S.movement[0]} to={S.movement[1]}>
        <HabitPanel at={S.movement[0]} number="02" chapter="MOVE" title="Mindful movement" titleAt={t.atText("mindful", 15.96)} body="Incorporate 30 minutes of daily activity." bodyAt={t.atText("Incorporate", 17.72)} detail="Walk, yoga, or dancing — choose motion that feels alive." tint={RUBY} />
      </SceneBlock>
      <SceneBlock name="choices" from={S.choices[0]} to={S.choices[1]}>
        <HabitPanel at={S.choices[0]} number="02" chapter="MOVE" title="Choose what moves you" titleAt={t.atText("This", 21)} body="A brisk walk, yoga, or dancing all count." bodyAt={t.atText("brisk", 21.687)} detail="The best movement is the one you can return to tomorrow." tint={CYAN} />
      </SceneBlock>
      <SceneBlock name="nutrition" from={S.nutrition[0]} to={S.nutrition[1]}>
        <HabitPanel at={S.nutrition[0]} number="03" chapter="NOURISH" title="Hydration and nutrition" titleAt={t.atText("hydration", 28.36)} body="Drink plenty of water throughout the day." bodyAt={t.atText("Drink", 30.2)} detail="Let hydration keep the whole system moving." tint={CYAN} />
      </SceneBlock>
      <SceneBlock name="nourishment" from={S.nourishment[0]} to={S.nourishment[1]}>
        <HabitPanel at={S.nourishment[0]} number="03" chapter="NOURISH" title="Feed your energy" titleAt={t.atText("Proper", 34.56)} body="Focus on whole foods for sustained energy." bodyAt={t.atText("focus", 32.6)} detail="Simple inputs. Clearer energy. A steadier day." tint={GOLD} />
      </SceneBlock>
      <SceneBlock name="impact" from={S.impact[0]} to={S.impact[1]}><ImpactScene /></SceneBlock>
      <SceneBlock name="end" from={S.end[0]} to={S.end[1]}><EndScene /></SceneBlock>

      {avatar !== "none" ? (
        <div style={{ position: "absolute", left: SAFE.left, top: 1130, opacity: 0.82, filter: `drop-shadow(0 0 18px ${GOLD}44)` }}>
          <Avatar style={avatar} mouth={mouth} cues={poseCues} size={280} />
        </div>
      ) : null}
      <CinematicCaptions words={words} />
    </ReelFrame>
  );
};

export default Reel;
