// Juliane Koepcke survival reel — raw cinematic jungle look.
// Voiceover audio + scenes anchored to spoken words (fallback seconds keep it
// previewable before caption sync; captions file is currently empty).
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { cinematicDark } from "../../presets";
import { useBrand } from "../../brand-context";
import { useMouth } from "../../avatars/useMouth";
import { EndCard, ReelFrame, SceneBlock, type ReelProps } from "../../components";
import { AVATAR_BOX, CAPTION_BOTTOM, SAFE, SAFE_BOX } from "../../layout";
import { timing, type Word } from "../../timing";
import mouthJson from "../../../public/reels/juliane-koepcke/mouth.json";
import wordsJson from "../../../public/reels/juliane-koepcke/captions.words.json";

const words = wordsJson as unknown as Word[];
const mouth = mouthJson as unknown as number[];

export const t = timing(words);
export const AUDIO = "reels/juliane-koepcke/vo.wav";
export const durationInFrames = t.duration(0.8, 54);

// Every cut is anchored to a spoken word. Fallback seconds keep the composition previewable before sync.
const S = {
  hook: [0, t.atText("On", 3)],
  impact: [t.atText("On", 3), t.atText("alone", 8)],
  alone: [t.atText("alone", 8), t.atText("So", 16)],
  stream: [t.atText("So", 16), t.atText("parents", 19)],
  heritage: [t.atText("parents", 19), t.atText("On", 26, 1)],
  jungle: [t.atText("On", 26, 1), t.atText("Rescue", 34)],
  search: [t.atText("Rescue", 34), t.atText("Ten", 39)],
  rescue: [t.atText("Ten", 39), t.atText("found", 44, 1)],
  hut: [t.atText("found", 44, 1), durationInFrames - 90],
  end: [durationInFrames - 90, durationInFrames],
} as const;

const cleanWord = (word: string) => word.toLowerCase().replace(/[^a-z0-9]/g, "");

// ---- Jungle backdrop: layered canopy + animated rain + drifting fog ----

const RAIN = Array.from({ length: 22 }, (_, i) => ({
  left: (i * 47 + 13) % 104,
  w: 2 + (i % 3),
  h: 60 + (i % 5) * 26,
  speed: 14 + (i % 7) * 3,
  op: 0.22 + (i % 4) * 0.12,
  seed: (i * 137) % 900,
}));

const Rain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {RAIN.map((r, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${r.left}%`,
            top: ((frame * r.speed + r.seed) % 1900) - 120,
            width: r.w,
            height: r.h,
            borderRadius: 99,
            background: "linear-gradient(#9fd0c8, transparent)",
            opacity: r.op,
          }}
        />
      ))}
    </div>
  );
};

const Fog: React.FC = () => {
  const frame = useCurrentFrame();
  const d1 = interpolate(Math.sin(frame / 140), [-1, 1], [-90, 90]);
  const d2 = interpolate(Math.sin(frame / 190 + 2), [-1, 1], [70, -70]);
  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 1400, height: 420, left: -200 + d1, top: 520, borderRadius: "50%", background: "radial-gradient(ellipse at center, #A9C0A855 0%, transparent 65%)", filter: "blur(30px)" }} />
      <div style={{ position: "absolute", width: 1600, height: 360, left: -300 + d2, top: 1180, borderRadius: "50%", background: "radial-gradient(ellipse at center, #8FB5A040 0%, transparent 60%)", filter: "blur(36px)" }} />
    </div>
  );
};

const JungleBackdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const light = interpolate(Math.sin(frame / 160), [-1, 1], [0.05, 0.11]);
  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#060B09" }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, #050907 0%, #0A1410 46%, #101B15 72%, #0A120E 100%)`, opacity: 1 }} />
      {/* distant canopy silhouettes */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 36% at 18% 12%, #0C1A13 0%, transparent 60%), radial-gradient(130% 40% at 82% 8%, #0B1712 0%, transparent 62%), radial-gradient(150% 34% at 50% 30%, #0D1813 0%, transparent 58%)" }} />
      {/* faint light shafts */}
      <div style={{ position: "absolute", inset: 0, opacity: light, background: "linear-gradient(115deg, transparent 40%, #D8EAD8 48%, transparent 56%, #D8EAD8 64%, transparent 72%)", filter: "blur(14px)", mixBlendMode: "screen" }} />
      <Fog />
      <Rain />
      <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 260px #000000DD", pointerEvents: "none" }} />
    </div>
  );
};

// ---- Stickman survivor: stick figure with a red beanie (Style 2B), SVG ----

const BEANIE_RED = "#C23A2E"; // the one character accent; the rest comes from the brand

const Stickman: React.FC<{ mouth: number; armUp: boolean }> = ({ mouth, armUp }) => {
  const frame = useCurrentFrame();
  const sway = interpolate(Math.sin(frame / 30), [-1, 1], [-3.5, 3.5]);
  const breath = 1 + 0.015 * Math.sin(frame / 20);
  return (
    <svg viewBox="0 0 220 340" width="340" height="340" aria-hidden="true" style={{ display: "block", transform: `rotate(${sway}deg)`, transformOrigin: "50% 90%" }}>
      {/* legs */}
      <g stroke="#0A0D0B" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round">
        <line x1={110} y1={205} x2={86} y2={312} />
        <line x1={110} y1={205} x2={134} y2={312} />
        <line x1={86} y1={312} x2={66} y2={332} />
        <line x1={134} y1={312} x2={154} y2={332} />
      </g>
      {/* torso (breathing) */}
      <g style={{ transformOrigin: "110px 120px", transform: `scaleY(${breath})` }}>
        <line x1={110} y1={120} x2={110} y2={205} stroke="#0A0D0B" strokeWidth={10} strokeLinecap="round" />
      </g>
      {/* arms — one raises when she signals for rescue */}
      <g stroke="#0A0D0B" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round">
        <line x1={110} y1={135} x2={70} y2={armUp ? 92 : 176} />
        <line x1={110} y1={135} x2={150} y2={armUp ? 186 : 179} />
      </g>
      {/* head */}
      <circle cx={110} cy={82} r={34} fill="#0A0D0B" />
      <circle cx={110} cy={82} r={33} fill="#D8C7AE" />
      {/* red beanie */}
      <path d="M76 74 Q110 18 144 74 Z" fill={BEANIE_RED} />
      <rect x={74} y={70} width={72} height={14} rx={7} fill="#B02F24" />
      {/* mouth follows the voice */}
      <ellipse cx={110} cy={93} rx={8} ry={1 + mouth * 5} fill="#0A0D0B" />
    </svg>
  );
};

// ---- Kinetic typography: word-by-word pop (mask-less rise + blur) ----

const KineticHeadline: React.FC<{
  text: string;
  at?: number;
  size?: number;
  accentWords?: string[];
}> = ({ text, at = 0, size = 104, accentWords = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = useBrand();
  const accents = new Set(accentWords.map(cleanWord));
  return (
    <div
      data-el="title"
      data-kind="content"
      aria-label={text}
      style={{
        color: b.colors.text,
        fontFamily: b.fontFamily,
        fontSize: size,
        fontWeight: 700,
        lineHeight: 0.98,
        letterSpacing: -3,
        maxWidth: "100%",
      }}
    >
      {text.split(" ").map((word, index, all) => {
        const enter = spring({
          frame: frame - at - index * 3,
          fps,
          config: { damping: 15, stiffness: 170, mass: 0.62 },
        });
        return (
          <span
            key={`${word}-${index}`}
            aria-hidden="true"
            style={{
              display: "inline-block",
              marginRight: index === all.length - 1 ? 0 : "0.22em",
              opacity: interpolate(enter, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              transform: `translateY(${(1 - enter) * 34}px) scale(${0.86 + enter * 0.14})`,
              filter: `blur(${(1 - enter) * 7}px)`,
              color: accents.has(cleanWord(word)) ? b.colors.accent : b.colors.text,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

const Eyebrow: React.FC<{ children: React.ReactNode; at?: number }> = ({ children, at = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = useBrand();
  const enter = spring({ frame: frame - at, fps, config: { damping: 18, stiffness: 150, mass: 0.7 } });
  return (
    <div
      data-el="eyebrow"
      data-kind="content"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        color: b.colors.accent2,
        fontFamily: b.fontFamily,
        fontSize: 28,
        fontWeight: 600,
        letterSpacing: 5,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 16}px)`,
      }}
    >
      <span style={{ width: 56, height: 2, background: b.colors.accent }} />
      {children}
    </div>
  );
};

// A bare fact line — no panel, just a gold tick and readable text.
const SurvivalLine: React.FC<{ children: React.ReactNode; at?: number; style?: React.CSSProperties }> = ({ children, at = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = useBrand();
  const enter = spring({ frame: frame - at, fps, config: { damping: 16, stiffness: 140, mass: 0.7 } });
  return (
    <div
      data-el="fact"
      data-kind="content"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 18,
        maxWidth: "100%",
        color: b.colors.text,
        fontFamily: b.fontFamily,
        fontSize: 32,
        fontWeight: 600,
        lineHeight: 1.25,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 20}px)`,
        ...style,
      }}
    >
      <span style={{ width: 4, height: 44, marginTop: 6, background: b.colors.accent, flexShrink: 0 }} />
      <span>{children}</span>
    </div>
  );
};

export const Reel: React.FC<ReelProps> = ({ brand = cinematicDark, avatar = "flat", debugSafeZones, probe }) => {
  const m = useMouth(mouth, words);
  const frame = useCurrentFrame();
  // She raises an arm while stumbling toward rescue + the hut.
  const armUp = frame >= S.rescue[0] && frame < S.end[0];
  return (
    <ReelFrame brand={brand} audio={AUDIO} debugSafeZones={debugSafeZones} probe={probe}>
      <JungleBackdrop />

      <SceneBlock name="hook" from={S.hook[0]} to={S.hook[1]}>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: SAFE.top + 54, width: SAFE_BOX.width }}>
          <Eyebrow>TRUE SURVIVAL · PERU · 1971</Eyebrow>
          <div style={{ marginTop: 52 }}><KineticHeadline text="SHE FELL 3 KM AND SURVIVED" size={104} accentWords={["3", "survived"]} /></div>
          <div style={{ marginTop: 42, width: 280, height: 2, background: "linear-gradient(90deg, #E5B85C, transparent)" }} />
        </div>
      </SceneBlock>

      <SceneBlock name="impact" from={S.impact[0]} to={S.impact[1]}>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: SAFE.top + 60, width: SAFE_BOX.width }}>
          <Eyebrow>CHRISTMAS EVE · 1971</Eyebrow>
          <div style={{ marginTop: 44, maxWidth: 720 }}><KineticHeadline text="LIGHTNING BROKE THE SKY" size={100} accentWords={["LIGHTNING"]} /></div>
          <SurvivalLine at={t.atText("lightning", 4)} style={{ marginTop: 60, maxWidth: 610 }}>
            The aircraft broke apart over Peru — she fell to the canopy.
          </SurvivalLine>
        </div>
      </SceneBlock>

      <SceneBlock name="alone" from={S.alone[0]} to={S.alone[1]}>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: SAFE.top + 54, width: SAFE_BOX.width }}>
          <Eyebrow>THE NEXT MORNING</Eyebrow>
          <div style={{ marginTop: 48 }}><KineticHeadline text="SHE WOKE ALONE" size={118} accentWords={["ALONE"]} /></div>
          <SurvivalLine at={t.atText("woke", 9)} style={{ marginTop: 58 }}>
            17 years old. Broken collarbone, deep cuts — one sandal, no glasses.
          </SurvivalLine>
        </div>
      </SceneBlock>

      <SceneBlock name="stream" from={S.stream[0]} to={S.stream[1]}>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: SAFE.top + 66, width: SAFE_BOX.width }}>
          <Eyebrow>THE ONLY WAY OUT</Eyebrow>
          <div style={{ marginTop: 48 }}><KineticHeadline text="FOLLOW THE WATER" size={112} accentWords={["WATER"]} /></div>
          <SurvivalLine at={t.atText("follow", 17)} style={{ marginTop: 78 }}>
            Her parents' jungle science was the only compass she had.
          </SurvivalLine>
        </div>
      </SceneBlock>

      <SceneBlock name="heritage" from={S.heritage[0]} to={S.heritage[1]}>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: SAFE.top + 54, width: SAFE_BOX.width }}>
          <Eyebrow>THE KNOWLEDGE SHE CARRIED</Eyebrow>
          <div style={{ marginTop: 46 }}><KineticHeadline text="THE JUNGLE WAS HER MAP" size={96} accentWords={["MAP"]} /></div>
          <SurvivalLine at={S.heritage[0]} style={{ marginTop: 68, maxWidth: 760 }}>
            Her parents ran a rainforest research station — she grew up in this world.
          </SurvivalLine>
        </div>
      </SceneBlock>

      <SceneBlock name="jungle" from={S.jungle[0]} to={S.jungle[1]}>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: SAFE.top + 54, width: SAFE_BOX.width }}>
          <Eyebrow>DAY FOUR</Eyebrow>
          <div style={{ marginTop: 46 }}><KineticHeadline text="THE CANOPY HID HER" size={100} accentWords={["HID"]} /></div>
          <SurvivalLine at={t.atText("found", 32)} style={{ marginTop: 72, maxWidth: 770 }}>
            Crash victims below. Search planes above. Not one could see her.
          </SurvivalLine>
        </div>
      </SceneBlock>

      <SceneBlock name="search" from={S.search[0]} to={S.search[1]}>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: SAFE.top + 54, width: SAFE_BOX.width }}>
          <Eyebrow>THE SEARCH</Eyebrow>
          <div style={{ marginTop: 46 }}><KineticHeadline text="PLANES PASSED OVERHEAD" size={96} accentWords={["OVERHEAD"]} /></div>
          <SurvivalLine at={S.search[0]} style={{ marginTop: 70, maxWidth: 720 }}>
            The canopy was too dense for anyone to spot her below.
          </SurvivalLine>
        </div>
      </SceneBlock>

      <SceneBlock name="rescue" from={S.rescue[0]} to={S.rescue[1]}>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: SAFE.top + 54, width: SAFE_BOX.width }}>
          <Eyebrow>DAY TEN</Eyebrow>
          <div style={{ marginTop: 46 }}><KineticHeadline text="WEAK STARVING STILL MOVING" size={91} accentWords={["STILL"]} /></div>
          <SurvivalLine at={t.atText("hut", 39)} style={{ marginTop: 58 }}>
            Thirty maggots pulled from an infected wound — then voices outside the hut.
          </SurvivalLine>
        </div>
      </SceneBlock>

      <SceneBlock name="hut" from={S.hut[0]} to={S.hut[1]}>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: SAFE.top + 54, width: SAFE_BOX.width }}>
          <Eyebrow>THEN, A SIGN OF LIFE</Eyebrow>
          <div style={{ marginTop: 46 }}><KineticHeadline text="A HUT BY THE RIVER" size={104} accentWords={["HUT"]} /></div>
          <SurvivalLine at={S.hut[0]} style={{ marginTop: 70, maxWidth: 700 }}>
            A path. A hut. A chance. She called out in Spanish.
          </SurvivalLine>
        </div>
      </SceneBlock>

      <SceneBlock name="end" from={S.end[0]} to={S.end[1]}>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: SAFE.top + 82, width: SAFE_BOX.width }}><EndCard keyword="SURVIVE" lead="Want the full story?" sub="I will send the source list" at={S.end[0]} /></div>
      </SceneBlock>

      {avatar !== "none" ? (
        <div style={{ position: "absolute", left: AVATAR_BOX.x, top: AVATAR_BOX.y }}><Stickman mouth={m} armUp={armUp} /></div>
      ) : null}
      <div style={{ position: "absolute", left: SAFE_BOX.x, width: SAFE_BOX.width, bottom: CAPTION_BOTTOM }}>
        {/* captions render nothing until caption sync fills captions.words.json */}
      </div>
    </ReelFrame>
  );
};
