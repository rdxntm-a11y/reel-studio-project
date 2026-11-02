import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand as myBrand } from "../../brand";
import { useBrand } from "../../brand-context";
import { Avatar } from "../../avatars/Avatar";
import { useMouth } from "../../avatars/useMouth";
import type { PoseCue } from "../../avatars/SpritePlayer";
import { BigNumber, Card, EndCard, ReelFrame, SceneBlock, type ReelProps } from "../../components";
import { AVATAR_BOX, CAPTION_BOTTOM, SAFE, SAFE_BOX } from "../../layout";
import { timing, type Word } from "../../timing";
import mouth from "../../../public/reels/habits-over-40/mouth.json";
import words from "../../../public/reels/habits-over-40/captions.words.json";

export const t = timing(words);
export const AUDIO = "reels/habits-over-40/vo.wav";

// Scene boundaries using word timing with fallback seconds (before sync runs)
const S = {
  hook: [0, t.atText("Women", 4.2, 0)],
  sleep: [t.atText("Women", 4.2, 0), t.atText("mindful", 10.5)],
  movement: [t.atText("mindful", 10.5), t.atText("hydration", 17.8)],
  nutrition: [t.atText("hydration", 17.8), t.atText("biggest", 23.5)],
  impact: [t.atText("biggest", 23.5), t.atText("Comment", 28.0)],
  end: [t.atText("Comment", 28.0), t.duration()],
} as const;

// Simple pose cues for flat mascot (ignored by flat style but kept for consistency)
const poseCues: PoseCue[] = [
  { at: 0, pose: "idle" },
  { at: 4.2, pose: "explain" },
  { at: 10.5, pose: "one" },
  { at: 17.8, pose: "two" },
  { at: 23.5, pose: "three" },
  { at: 28.0, pose: "point-down" },
];

export const durationInFrames = t.duration();

const ENTER_CONFIG = { damping: 18, stiffness: 260, mass: 0.7 };
const WORD_CONFIG = { damping: 13, stiffness: 250, mass: 0.55 };
const cleanWord = (value: string) => value.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

/** Full-frame motion layer: a fast settle, late follow-through, and uneven punch-ins. */
const PatternInterruptGroup: React.FC<{ at: number; punches?: number[]; children: React.ReactNode }> = ({ at, punches = [], children }) => {
  const b = useBrand();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const primary = spring({ frame: frame - at, fps, config: ENTER_CONFIG });
  const follow = spring({ frame: frame - (at + 4), fps, config: { damping: 24, stiffness: 220, mass: 0.8 } });
  const pulse = punches.reduce((strongest, punchAt) => {
    const current = interpolate(frame - punchAt, [0, 3, 12], [0, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    return Math.max(strongest, current);
  }, 0);
  const y = interpolate(primary, [0, 1], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) + interpolate(follow, [0, 1], [3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) - pulse * 6;
  const sweepX = interpolate(pulse, [0, 1], [-16, 116], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: interpolate(primary, [0, 0.35, 1], [0.94, 1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        transform: `translate3d(0, ${y}px, 0)`,
        transformOrigin: "50% 45%",
        filter: `saturate(${1 + pulse * 0.12})`,
        willChange: "transform, filter",
      }}
    >
      {children}
      {punches.length ? (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${sweepX}%`,
            width: 14,
            background: b.colors.accent,
            opacity: pulse * 0.18,
            filter: "blur(7px)",
            transform: "skewX(-12deg)",
            pointerEvents: "none",
          }}
        />
      ) : null}
    </div>
  );
};

/** Masked, screen-reader-safe word reveal for titles and supporting copy. */
const KineticWords: React.FC<{ text: string; at: number; highlight?: string; style?: React.CSSProperties }> = ({ text, at, highlight, style }) => {
  const b = useBrand();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tokens = text.trim().split(/\s+/);
  const highlightKey = highlight ? cleanWord(highlight) : "";

  return (
    <span aria-label={text} style={{ display: "inline", ...style }}>
      {tokens.map((token, index) => {
        const progress = spring({ frame: frame - (at + index * 2), fps, config: WORD_CONFIG });
        const clip = interpolate(progress, [0, 1], [100, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const scale = interpolate(progress, [0, 1], [0.96, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const opacity = interpolate(progress, [0, 0.5, 1], [0.2, 0.92, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const isHighlight = highlightKey !== "" && cleanWord(token) === highlightKey;
        return (
          <span
              key={`${token}-${index}`}
              aria-hidden="true"
              style={{
                display: "inline-block",
                clipPath: "inset(0 0 0 0)",
                verticalAlign: "bottom",
                marginRight: index === tokens.length - 1 ? 0 : "0.2em",
            }}
          >
            <span
              style={{
                display: "inline-block",
                color: isHighlight ? b.colors.accent : style?.color ?? b.colors.text,
                opacity,
                clipPath: `inset(${clip}% 0 0 0)`,
                transform: `scale(${scale})`,
                transformOrigin: "50% 100%",
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

const KineticTitle: React.FC<{ text: string; highlight?: string; at: number; size?: number; showHandle?: boolean }> = ({ text, highlight, at, size = 96, showHandle = true }) => {
  const b = useBrand();
  return (
    <div data-el="title" data-kind="content" aria-label={`${b.handle} ${text}`} style={{ transformOrigin: "left center", fontFamily: b.fontFamily, color: b.colors.text }}>
      <div aria-hidden="true">
        {showHandle ? <div style={{ fontSize: 34, fontWeight: 600, opacity: 0.6, marginBottom: 12, letterSpacing: 1 }}>{b.handle}</div> : null}
        <div style={{ fontSize: size, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2 }}>
          <KineticWords text={text} at={at} highlight={highlight} />
        </div>
      </div>
    </div>
  );
};

/** Card line with the same geometry as Line, upgraded with a masked word stagger. */
const KineticLine: React.FC<{ at: number; children: string; first?: boolean }> = ({ at, children, first }) => {
  const b = useBrand();
  return (
    <div
      aria-label={children}
      style={{
        marginTop: first ? 0 : 28,
        paddingTop: first ? 0 : 28,
        borderTop: first ? "none" : `3px solid ${b.colors.text}14`,
        fontSize: 52,
        fontWeight: first ? 800 : 700,
        lineHeight: 1.15,
        letterSpacing: -1,
      }}
    >
      <KineticWords text={children} at={at} />
    </div>
  );
};

/** Word-timed captions with a spring pop on entry and one live-word highlight. */
const AnimatedKaraoke: React.FC<{ words: Word[]; perChunk?: number; keywords?: string[]; size?: number; holdSec?: number; style?: React.CSSProperties }> = ({ words, perChunk = 4, keywords = [], size = 58, holdSec = 0.35, style }) => {
  const b = useBrand();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  const n = Math.min(5, Math.max(2, Math.round(perChunk)));
  if (!words.length) return null;

  let current = -1;
  for (let i = 0; i < words.length; i++) {
    if (words[i].start <= time) current = i;
    else break;
  }
  if (current < 0) return null;

  const chunkStart = Math.floor(current / n) * n;
  const chunk = words.slice(chunkStart, chunkStart + n);
  const last = chunk[chunk.length - 1];
  if (time > last.end + holdSec && chunkStart + n >= words.length) return null;

  const keys = new Set(keywords.map(cleanWord));
  return (
    <div data-el="captions" data-kind="caption" style={{ display: "flex", justifyContent: "center", ...style }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0 0.3em",
          background: b.colors.surface,
          borderRadius: b.radius,
          boxShadow: b.boxShadow,
          padding: "0.35em 0.7em",
          fontFamily: b.fontFamily,
          fontSize: size,
          fontWeight: 800,
          lineHeight: 1.25,
        }}
      >
        {chunk.map((word, index) => {
          const idx = chunkStart + index;
          const spoken = idx <= current;
          const active = time >= word.start && time <= word.end;
          const isKey = keys.has(cleanWord(word.word));
          const pop = spring({ frame: frame - word.start * fps, fps, config: WORD_CONFIG });
          const y = interpolate(pop, [0, 1], [12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const scale = interpolate(pop, [0, 1], [0.78, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <span
              key={idx}
              style={{
                display: "inline-block",
                color: active ? b.colors.bg : isKey ? b.colors.accent : b.colors.text,
                opacity: spoken ? interpolate(pop, [0, 1], [0.45, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0.3,
                transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                transformOrigin: "50% 100%",
                background: active ? b.colors.accent : "transparent",
                borderRadius: active ? Math.max(8, b.radius * 0.35) : 0,
                padding: active ? "0 0.08em" : 0,
                boxShadow: active ? `0 4px 0 ${b.colors.accent}55` : "none",
                willChange: "transform, opacity, color",
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

export const Reel: React.FC<ReelProps> = ({ brand = myBrand, avatar = "flat", debugSafeZones, probe }) => {
  const m = useMouth(mouth, words);
  return (
    <ReelFrame brand={brand} audio={AUDIO} debugSafeZones={debugSafeZones} probe={probe}>
      {/* Scene 1: Hook */}
      <SceneBlock name="hook" from={S.hook[0]} to={S.hook[1]}>
        <PatternInterruptGroup at={-12} punches={[42, 96]}>
          <div style={{ position: "absolute", left: SAFE_BOX.x, top: SAFE.top + 60, width: SAFE_BOX.width }}>
            <KineticTitle text="STOP DOING CARDIO!" highlight="CARDIO" at={-12} size={100} />
            <div style={{ marginTop: 30, color: "white", fontSize: 55, fontWeight: 700, lineHeight: 1.2, letterSpacing: -1 }}>
              <KineticWords text="Women over 40 need these 3 habits instead" at={8} style={{ color: "white" }} />
            </div>
          </div>
        </PatternInterruptGroup>
      </SceneBlock>

      {/* Scene 2: Prioritize Sleep */}
      <SceneBlock name="sleep" from={S.sleep[0]} to={S.sleep[1]}>
        <PatternInterruptGroup at={S.sleep[0]} punches={[S.sleep[0] + 44, S.sleep[0] + 124]}>
          <div style={{ position: "absolute", left: SAFE_BOX.x, top: 280, width: SAFE_BOX.width }}>
            <Card at={S.sleep[0]}>
              <BigNumber to={1} at={S.sleep[0] + 5} label="habit" size={160} tracked={false} />
              <div style={{ height: 24 }} />
              <KineticLine first at={t.atText("Prioritize", 4.5)}>Prioritize Sleep</KineticLine>
              <KineticLine at={t.atText("Aim", 5.5)}>Aim for 7 to 9 hours</KineticLine>
              <KineticLine at={t.atText("quality", 6.5)}>Quality sleep = energy, mood, recovery</KineticLine>
            </Card>
          </div>
        </PatternInterruptGroup>
      </SceneBlock>

      {/* Scene 3: Mindful Movement */}
      <SceneBlock name="movement" from={S.movement[0]} to={S.movement[1]}>
        <PatternInterruptGroup at={S.movement[0]} punches={[S.movement[0] + 54, S.movement[0] + 148]}>
          <div style={{ position: "absolute", left: SAFE_BOX.x, top: 280, width: SAFE_BOX.width }}>
            <Card at={S.movement[0]}>
              <BigNumber to={2} at={S.movement[0] + 5} label="habit" size={160} tracked={false} />
              <div style={{ height: 24 }} />
              <KineticLine first at={t.atText("mindful", 10.5)}>Mindful Movement</KineticLine>
              <KineticLine at={t.atText("Incorporate", 11.5)}>30 minutes daily activity</KineticLine>
              <KineticLine at={t.atText("walk", 13.0)}>Walk, yoga, or dancing</KineticLine>
              <KineticLine at={t.atText("boosts", 14.5)}>Boosts mood and metabolism</KineticLine>
            </Card>
          </div>
        </PatternInterruptGroup>
      </SceneBlock>

      {/* Scene 4: Hydration & Nutrition */}
      <SceneBlock name="nutrition" from={S.nutrition[0]} to={S.nutrition[1]}>
        <PatternInterruptGroup at={S.nutrition[0]} punches={[S.nutrition[0] + 48, S.nutrition[0] + 118]}>
          <div style={{ position: "absolute", left: SAFE_BOX.x, top: 280, width: SAFE_BOX.width }}>
            <Card at={S.nutrition[0]}>
              <BigNumber to={3} at={S.nutrition[0] + 5} label="habit" size={160} tracked={false} />
              <div style={{ height: 24 }} />
              <KineticLine first at={t.atText("hydration", 17.8)}>Hydration & Nutrition</KineticLine>
              <KineticLine at={t.atText("Drink", 18.5)}>Drink plenty of water</KineticLine>
              <KineticLine at={t.atText("whole", 20.0)}>Focus on whole foods</KineticLine>
              <KineticLine at={t.atText("key", 21.5)}>Key for sustained energy</KineticLine>
            </Card>
          </div>
        </PatternInterruptGroup>
      </SceneBlock>

      {/* Scene 5: Impact statement */}
      <SceneBlock name="impact" from={S.impact[0]} to={S.impact[1]}>
        <PatternInterruptGroup at={S.impact[0]} punches={[S.impact[0] + 56]}>
          <div style={{ position: "absolute", left: SAFE_BOX.x, top: 350, width: SAFE_BOX.width, textAlign: "center" }}>
            <div style={{ color: "white", fontSize: 60, fontWeight: 800, lineHeight: 1.2, letterSpacing: -1.5 }}>
              <KineticWords text="The biggest impact comes from the simplest, most consistent daily actions" at={S.impact[0]} style={{ color: "white" }} />
            </div>
          </div>
        </PatternInterruptGroup>
      </SceneBlock>

      {/* Scene 6: End card */}
      <SceneBlock name="end" from={S.end[0]} to={S.end[1]}>
        <PatternInterruptGroup at={S.end[0]} punches={[S.end[0] + 28]}>
          <div style={{ position: "absolute", left: SAFE_BOX.x, top: 350, width: SAFE_BOX.width }}>
            <EndCard keyword="HABITS" lead="Want the breakdown?" sub="Comment HABITS and I'll send it" at={t.atText("Comment", 28.0)} />
          </div>
        </PatternInterruptGroup>
      </SceneBlock>

      {/* Always on: talking character + captions */}
      {avatar !== "none" ? (
        <div style={{ position: "absolute", left: AVATAR_BOX.x, top: AVATAR_BOX.y }}>
          <Avatar style={avatar} mouth={m} cues={poseCues} size={AVATAR_BOX.size} />
        </div>
      ) : null}
      <div style={{ position: "absolute", left: SAFE_BOX.x, width: SAFE_BOX.width, bottom: CAPTION_BOTTOM }}>
        <AnimatedKaraoke words={words} perChunk={4} keywords={["HABITS", "cardio", "Women", "sleep", "movement", "hydration"]} />
      </div>
    </ReelFrame>
  );
};

export default Reel;
