import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { cinematicDark } from "../../presets";
import { Avatar } from "../../avatars/Avatar";
import { useMouth } from "../../avatars/useMouth";
import type { PoseCue } from "../../avatars/SpritePlayer";
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

const poseCues: PoseCue[] = [
  { at: 0, pose: "idle" },
  { at: 4, pose: "explain" },
  { at: 9, pose: "thinking" },
  { at: 16, pose: "point-right" },
  { at: 30, pose: "one" },
  { at: 46, pose: "thumbs-up" },
];

const cleanWord = (word: string) => word.toLowerCase().replace(/[^a-z0-9]/g, "");

const KineticHeadline: React.FC<{
  text: string;
  at?: number;
  size?: number;
  accentWords?: string[];
}> = ({ text, at = 0, size = 106, accentWords = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accents = new Set(accentWords.map(cleanWord));

  return (
    <div
      data-el="title"
      data-kind="content"
      aria-label={text}
      style={{
        color: "#F4F1E8",
        fontFamily: "'Space Grotesk', sans-serif",
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
              color: accents.has(cleanWord(word)) ? "#E5B85C" : "#F4F1E8",
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
  const enter = spring({ frame: frame - at, fps, config: { damping: 18, stiffness: 150, mass: 0.7 } });
  return (
    <div
      data-el="eyebrow"
      data-kind="content"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        color: "#6EA4B8",
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 28,
        fontWeight: 600,
        letterSpacing: 5,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 16}px)`,
      }}
    >
      <span style={{ width: 56, height: 2, background: "#E5B85C" }} />
      {children}
    </div>
  );
};

const CinematicPanel: React.FC<{ children: React.ReactNode; at?: number; style?: React.CSSProperties }> = ({ children, at = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - at, fps, config: { damping: 18, stiffness: 150, mass: 0.75 } });
  return (
    <div
      data-el="card"
      data-kind="content"
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "34px 38px",
        border: "1px solid #E5B85C44",
        borderRadius: 18,
        background: "linear-gradient(135deg, #111722F2, #0B0F16E8)",
        boxShadow: "0 20px 80px #00000055",
        color: "#F4F1E8",
        fontFamily: "'Space Grotesk', sans-serif",
        opacity: enter,
        transform: `translateY(${(1 - enter) * 26}px) scale(${0.96 + enter * 0.04})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Metric: React.FC<{ value: string; label: string; accent?: boolean }> = ({ value, label, accent = false }) => (
  <div style={{ flex: 1, minWidth: 0 }}>
    <div style={{ color: accent ? "#E5B85C" : "#F4F1E8", fontSize: 58, fontWeight: 700, lineHeight: 1 }}>{value}</div>
    <div style={{ marginTop: 10, color: "#9AA7B3", fontSize: 22, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>{label}</div>
  </div>
);

const PlaneMark: React.FC<{ at?: number }> = ({ at = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 120, mass: 0.8 } });
  const drift = interpolate(Math.sin(frame / 24), [-1, 1], [-18, 18]);
  return (
    <div aria-hidden="true" style={{ position: "absolute", right: 88, top: 510, width: 260, height: 160, opacity: enter, transform: `translate(${drift}px, ${(1 - enter) * 26}px) rotate(-12deg) scale(${0.7 + enter * 0.3})` }}>
      <div style={{ position: "absolute", left: 18, top: 68, width: 220, height: 18, borderRadius: 20, background: "#E5B85C" }} />
      <div style={{ position: "absolute", left: 84, top: 30, width: 22, height: 90, background: "#E5B85C", clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }} />
      <div style={{ position: "absolute", left: 188, top: 50, width: 18, height: 55, background: "#E5B85C", clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }} />
      <div style={{ position: "absolute", left: 2, top: 52, width: 50, height: 52, background: "#6EA4B8", clipPath: "polygon(0 50%, 100% 0, 100% 100%)" }} />
    </div>
  );
};

const StreamLine: React.FC<{ at?: number }> = ({ at = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - at, fps, config: { damping: 22, stiffness: 110, mass: 0.9 } });
  return (
    <div aria-hidden="true" style={{ position: "relative", height: 220, opacity: enter, transform: `scaleY(${0.82 + enter * 0.18})` }}>
      <svg width="100%" height="100%" viewBox="0 0 900 220" preserveAspectRatio="none">
        <path d="M30 30 C260 140 280 20 460 95 S690 200 870 70" fill="none" stroke="#6EA4B8" strokeWidth="8" strokeLinecap="round" opacity=".78" />
        <path d="M30 54 C260 164 280 44 460 119 S690 224 870 94" fill="none" stroke="#E5B85C" strokeWidth="2" strokeDasharray="10 18" opacity=".72" />
      </svg>
      <div style={{ position: "absolute", left: "2%", top: 8, color: "#9AA7B3", fontSize: 22, letterSpacing: 3 }}>FOLLOW THE WATER</div>
    </div>
  );
};

const CinematicBackdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(Math.sin(frame / 90), [-1, 1], [-3, 3]);
  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#07090D" }}>
      <div style={{ position: "absolute", inset: -120, transform: `translate(${drift}px, ${-drift}px)`, background: "radial-gradient(circle at 68% 18%, #29425444 0, transparent 28%), radial-gradient(circle at 24% 76%, #A8702B18 0, transparent 34%), linear-gradient(145deg, #07090D 0%, #0A1119 54%, #07090D 100%)" }} />
      <div style={{ position: "absolute", inset: 0, opacity: 0.08, backgroundImage: "linear-gradient(transparent 0%, #FFFFFF 50%, transparent 100%)", backgroundSize: "100% 5px", mixBlendMode: "screen" }} />
      <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 220px #000000CC", pointerEvents: "none" }} />
    </div>
  );
};

const CinematicCaptions: React.FC<{ captionWords: Word[]; keywords: string[] }> = ({ captionWords, keywords }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!captionWords.length) return null;
  const time = frame / fps;
  let current = -1;
  captionWords.forEach((word, index) => {
    if (word.start <= time) current = index;
  });
  if (current < 0) return null;
  const chunkStart = Math.floor(current / 4) * 4;
  const chunk = captionWords.slice(chunkStart, chunkStart + 4);
  const keySet = new Set(keywords.map(cleanWord));
  return (
    <div data-el="captions" data-kind="caption" style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <div style={{ maxWidth: SAFE_BOX.width, padding: "20px 26px", border: "1px solid #E5B85C44", borderRadius: 14, background: "#07090DCC", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 0.34em", fontFamily: "'Space Grotesk', sans-serif", fontSize: 54, fontWeight: 700, lineHeight: 1.18, textShadow: "0 3px 18px #000" }}>
        {chunk.map((word, index) => {
          const wordIndex = chunkStart + index;
          const enter = spring({ frame: frame - Math.round(word.start * fps), fps, config: { damping: 13, stiffness: 180, mass: 0.55 } });
          const active = wordIndex === current && time <= word.end;
          return (
            <span key={wordIndex} style={{ display: "inline-block", opacity: wordIndex <= current ? 1 : 0.3, color: active || keySet.has(cleanWord(word.word)) ? "#E5B85C" : "#F4F1E8", transform: `translateY(${(1 - enter) * 8}px) scale(${0.9 + enter * 0.1})`, transformOrigin: "center bottom" }}>
              {word.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const Reel: React.FC<ReelProps> = ({ brand = cinematicDark, avatar = "flat", debugSafeZones, probe }) => {
  const m = useMouth(mouth, words);
  return (
    <ReelFrame brand={brand} audio={AUDIO} debugSafeZones={debugSafeZones} probe={probe}>
      <CinematicBackdrop />

      <SceneBlock name="hook" from={S.hook[0]} to={S.hook[1]}>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: SAFE.top + 54, width: SAFE_BOX.width }}>
          <Eyebrow>TRUE SURVIVAL · PERU · 1971</Eyebrow>
          <div style={{ marginTop: 52 }}><KineticHeadline text="SHE FELL 3 KILOMETRES AND SURVIVED" size={104} accentWords={["3", "kilometres", "survived"]} /></div>
          <div style={{ marginTop: 42, width: 280, height: 2, background: "linear-gradient(90deg, #E5B85C, transparent)" }} />
        </div>
      </SceneBlock>

      <SceneBlock name="impact" from={S.impact[0]} to={S.impact[1]}>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: SAFE.top + 60, width: SAFE_BOX.width }}>
          <Eyebrow>CHRISTMAS EVE · 1971</Eyebrow>
          <div style={{ marginTop: 44, maxWidth: 720 }}><KineticHeadline text="LIGHTNING BROKE THE SKY" size={100} accentWords={["LIGHTNING"]} /></div>
          <CinematicPanel at={t.atText("lightning", 4)} style={{ marginTop: 60, width: 610 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}><div style={{ color: "#E5B85C", fontSize: 72, fontWeight: 700 }}>3 KM</div><div style={{ color: "#9AA7B3", fontSize: 26, letterSpacing: 2 }}>to the canopy</div></div>
            <div style={{ marginTop: 14, color: "#F4F1E8", fontSize: 30, lineHeight: 1.25 }}>The aircraft broke apart over Peru.</div>
          </CinematicPanel>
          <PlaneMark at={t.atText("plane", 5)} />
        </div>
      </SceneBlock>

      <SceneBlock name="alone" from={S.alone[0]} to={S.alone[1]}>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: SAFE.top + 54, width: SAFE_BOX.width }}>
          <Eyebrow>THE NEXT MORNING</Eyebrow>
          <div style={{ marginTop: 48 }}><KineticHeadline text="SHE WOKE ALONE" size={118} accentWords={["ALONE"]} /></div>
          <CinematicPanel at={t.atText("woke", 9)} style={{ marginTop: 58 }}>
            <div style={{ display: "flex", gap: 28 }}><Metric value="17" label="years old" accent /><Metric value="1" label="sandal" /><Metric value="0" label="glasses" /></div>
            <div style={{ marginTop: 26, paddingTop: 22, borderTop: "1px solid #FFFFFF18", color: "#9AA7B3", fontSize: 28 }}>Broken collarbone. Deep cuts. No one around.</div>
          </CinematicPanel>
        </div>
      </SceneBlock>

      <SceneBlock name="stream" from={S.stream[0]} to={S.stream[1]}>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: SAFE.top + 66, width: SAFE_BOX.width }}>
          <Eyebrow>THE ONLY WAY OUT</Eyebrow>
          <div style={{ marginTop: 48 }}><KineticHeadline text="FOLLOW THE WATER" size={112} accentWords={["WATER"]} /></div>
          <div style={{ marginTop: 78 }}><StreamLine at={t.atText("follow", 17)} /></div>
        </div>
      </SceneBlock>

      <SceneBlock name="heritage" from={S.heritage[0]} to={S.heritage[1]}>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: SAFE.top + 54, width: SAFE_BOX.width }}>
          <Eyebrow>THE KNOWLEDGE SHE CARRIED</Eyebrow>
          <div style={{ marginTop: 46 }}><KineticHeadline text="THE JUNGLE WAS HER MAP" size={96} accentWords={["MAP"]} /></div>
          <CinematicPanel at={S.heritage[0]} style={{ marginTop: 68, width: 760 }}>
            <div style={{ color: "#E5B85C", fontSize: 25, letterSpacing: 3, textTransform: "uppercase" }}>Inherited knowledge</div>
            <div style={{ marginTop: 14, fontSize: 34, lineHeight: 1.22 }}>Her parents ran a rainforest research station.</div>
          </CinematicPanel>
        </div>
      </SceneBlock>

      <SceneBlock name="jungle" from={S.jungle[0]} to={S.jungle[1]}>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: SAFE.top + 54, width: SAFE_BOX.width }}>
          <Eyebrow>DAY FOUR</Eyebrow>
          <div style={{ marginTop: 46 }}><KineticHeadline text="THE CANOPY HID HER" size={100} accentWords={["HID"]} /></div>
          <CinematicPanel at={t.atText("found", 32)} style={{ marginTop: 72, width: 770 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 26 }}><div style={{ width: 78, height: 78, borderRadius: "50%", border: "2px solid #E5B85C", display: "grid", placeItems: "center", color: "#E5B85C", fontSize: 38 }}>4</div><div style={{ fontSize: 34, lineHeight: 1.2 }}>Crash victims below.<br /><span style={{ color: "#9AA7B3" }}>Search planes above.</span></div></div>
          </CinematicPanel>
          <div style={{ marginTop: 48, color: "#6EA4B8", fontSize: 26, letterSpacing: 3 }}>NOT ONE COULD SEE HER</div>
        </div>
      </SceneBlock>

      <SceneBlock name="search" from={S.search[0]} to={S.search[1]}>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: SAFE.top + 54, width: SAFE_BOX.width }}>
          <Eyebrow>THE SEARCH</Eyebrow>
          <div style={{ marginTop: 46 }}><KineticHeadline text="PLANES PASSED OVERHEAD" size={96} accentWords={["OVERHEAD"]} /></div>
          <CinematicPanel at={S.search[0]} style={{ marginTop: 70, width: 720 }}>
            <div style={{ fontSize: 36, lineHeight: 1.2 }}>The canopy was too dense.<br /><span style={{ color: "#9AA7B3" }}>No one could see her below.</span></div>
          </CinematicPanel>
        </div>
      </SceneBlock>

      <SceneBlock name="rescue" from={S.rescue[0]} to={S.rescue[1]}>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: SAFE.top + 54, width: SAFE_BOX.width }}>
          <Eyebrow>DAY TEN</Eyebrow>
          <div style={{ marginTop: 46 }}><KineticHeadline text="WEAK STARVING STILL MOVING" size={91} accentWords={["STILL"]} /></div>
          <CinematicPanel at={t.atText("hut", 39)} style={{ marginTop: 58 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 30 }}><div style={{ color: "#E5B85C", fontSize: 104, lineHeight: 0.9, fontWeight: 700 }}>30</div><div style={{ fontSize: 31, lineHeight: 1.22 }}>maggots pulled<br /><span style={{ color: "#9AA7B3" }}>from an infected wound</span></div></div>
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #FFFFFF18", color: "#F4F1E8", fontSize: 30 }}>Then, voices outside the hut.</div>
          </CinematicPanel>
        </div>
      </SceneBlock>

      <SceneBlock name="hut" from={S.hut[0]} to={S.hut[1]}>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: SAFE.top + 54, width: SAFE_BOX.width }}>
          <Eyebrow>THEN, A SIGN OF LIFE</Eyebrow>
          <div style={{ marginTop: 46 }}><KineticHeadline text="A HUT BY THE RIVER" size={104} accentWords={["HUT"]} /></div>
          <CinematicPanel at={S.hut[0]} style={{ marginTop: 70, width: 700 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <div style={{ width: 76, height: 76, border: "2px solid #E5B85C", display: "grid", placeItems: "center", color: "#E5B85C", fontSize: 38 }}>→</div>
              <div style={{ fontSize: 34, lineHeight: 1.2 }}>A path.<br /><span style={{ color: "#9AA7B3" }}>A hut. A chance.</span></div>
            </div>
          </CinematicPanel>
        </div>
      </SceneBlock>

      <SceneBlock name="end" from={S.end[0]} to={S.end[1]}>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: SAFE.top + 82, width: SAFE_BOX.width }}><EndCard keyword="SURVIVE" lead="Want the full story?" sub="I will send the source list" at={S.end[0]} /></div>
      </SceneBlock>

      {avatar !== "none" ? <div style={{ position: "absolute", left: AVATAR_BOX.x, top: AVATAR_BOX.y }}><Avatar style={avatar} mouth={m} cues={poseCues} size={AVATAR_BOX.size} /></div> : null}
      <div style={{ position: "absolute", left: SAFE_BOX.x, width: SAFE_BOX.width, bottom: CAPTION_BOTTOM }}><CinematicCaptions captionWords={words} keywords={["survived", "alone", "water", "thirty", "SURVIVE"]} /></div>
    </ReelFrame>
  );
};
