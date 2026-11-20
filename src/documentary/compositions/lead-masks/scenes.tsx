import { Img, interpolate, staticFile } from "remotion";
import { Headline } from "../../components/Headline";
import { SceneFrame } from "../../components/SceneFrame";
import { CLAMP, ease, pulse, stampPose } from "../../motion";
import { alpha, type DocTheme } from "../../theme";
import type {
  BoardNode,
  BoardScene,
  CharacterScene,
  CinematicTransitionScene,
  ConclusionScene,
  DocScene,
  EvidenceScene,
  ExplanationScene,
  HookScene,
  IntroScene,
  MapScene,
  OutroScene,
  RevelationScene,
  SceneComponent,
  TimelineScene,
} from "../../types";
import { PortraitStage, type PortraitBox } from "./PortraitStage";

export type PortraitScene = DocScene & {
  image?: string;
  imageLabel?: string;
  imageBox?: PortraitBox;
  imageB?: string;
  imageLabelB?: string;
  lines?: string[];
};

const TOTAL_SCENES = 14;

const chapterLabel = (index: number) => `${String(index + 1).padStart(2, "0")} / ${TOTAL_SCENES}`;

const asPortrait = (scene: DocScene) => scene as PortraitScene;

const Portrait: React.FC<{
  scene: DocScene;
  theme: DocTheme;
  frame: number;
  duration: number;
  box: PortraitBox;
  label?: string;
  move?: "push" | "pull" | "driftUp" | "panLeft" | "panRight";
  gid: string;
}> = ({ scene, theme, frame, duration, box, label, move = "driftUp", gid }) => {
  const data = asPortrait(scene);
  if (!data.image) return null;
  return (
    <PortraitStage
      src={data.image}
      theme={theme}
      frame={frame}
      duration={duration}
      box={box}
      label={data.imageLabel ?? label}
      move={move}
      gid={gid}
    />
  );
};

const Pill: React.FC<{ text: string; theme: DocTheme; frame: number; danger?: boolean }> = ({ text, theme, frame, danger }) => (
  <div
    style={{
      display: "inline-block",
      padding: "8px 16px",
      border: `1px solid ${alpha(danger ? theme.color.danger : theme.color.accent, 70)}`,
      color: danger ? theme.color.danger : theme.color.accent,
      fontFamily: theme.font.type,
      fontSize: 21,
      letterSpacing: 4,
      textTransform: "uppercase",
      opacity: interpolate(frame, [0, 12], [0, 1], CLAMP),
    }}
  >
    {text}
  </div>
);

const Stat: React.FC<{ value: string; label: string; theme: DocTheme; frame: number; at: number }> = ({ value, label, theme, frame, at }) => (
  <div style={{ opacity: interpolate(frame, [at, at + 12], [0, 1], CLAMP), transform: `translateY(${ease(frame, at, 16, 26, 0)}px)` }}>
    <div style={{ fontFamily: theme.font.display, fontSize: 58, fontWeight: 700, lineHeight: 1, color: theme.color.text }}>{value}</div>
    <div style={{ marginTop: 10, fontFamily: theme.font.type, fontSize: 19, letterSpacing: 3, textTransform: "uppercase", color: theme.color.accent }}>{label}</div>
    <div style={{ marginTop: 10, width: 116, height: 2, background: alpha(theme.color.accent, 60) }} />
  </div>
);

const Bullets: React.FC<{ items: string[]; theme: DocTheme; frame: number; at: number; activeIndex?: number | null }> = ({ items, theme, frame, at, activeIndex = null }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
    {items.map((item, index) => {
      const a = at + index * 8;
      const active = index === activeIndex;
      return (
        <div
          key={`${item}-${index}`}
          style={{
            display: "flex",
            gap: 16,
            alignItems: "baseline",
            padding: active ? "8px 14px 8px 8px" : "6px 12px",
            marginLeft: active ? -14 : 0,
            borderLeft: `6px solid ${active ? theme.color.accent : "transparent"}`,
            background: active ? alpha(theme.color.accent, 22) : "transparent",
            opacity: interpolate(frame, [a, a + 12], [0, 1], CLAMP),
            transform: `translateY(${ease(frame, a, 14, 18, 0)}px)`,
          }}
        >
          <span style={{ fontFamily: theme.font.type, fontSize: 21, color: theme.color.accent }}>{String(index + 1).padStart(2, "0")}</span>
          <span style={{ fontFamily: theme.font.body, fontSize: 29, lineHeight: 1.4, fontWeight: active ? 700 : 400, color: active ? theme.color.accent : theme.color.muted }}>{item}</span>
        </div>
      );
    })}
  </div>
);

export const LMHook: SceneComponent = ({ scene, theme, localFrame: frame, duration, timeline, from, index }) => {
  const s = scene as HookScene;
  const rule = ease(frame, 6, 24, 0, 560);
  const sub = interpolate(frame, [14, 28], [0, 1], CLAMP);
  return (
    <SceneFrame
      id={s.id}
      theme={theme}
      frame={frame}
      duration={duration}
      from={from}
      words={timeline.words}
      kicker={s.kicker}
      chapter={chapterLabel(index)}
      signature="rail"
      transitionOut={s.transitionOut}
    >
      <Portrait scene={scene} theme={theme} frame={frame} duration={duration} box={{ x: 1210, y: 120, width: 500, height: 680 }} label="ARCHIVE / OPENING" gid="fig-01" move="push" />
      <div style={{ position: "absolute", left: 6, top: 150, width: 1130 }}>
        <Pill text={s.tag ?? "NARRATED CASE / OPEN"} theme={theme} frame={frame} />
        <div style={{ marginTop: 30 }}>
          <Headline text={s.headline} theme={theme} frame={frame} fps={30} at={-12} size={122} variant="mask" maxWidth={1120} />
        </div>
        <div style={{ width: rule, height: 5, background: theme.color.accent, marginTop: 30 }} />
        {s.subhead ? (
          <div style={{ marginTop: 26, maxWidth: 780, fontFamily: theme.font.body, fontSize: 31, lineHeight: 1.45, color: theme.color.muted, opacity: sub }}>{s.subhead}</div>
        ) : null}
      </div>
    </SceneFrame>
  );
};

export const LMIntro: SceneComponent = ({ scene, theme, localFrame: frame, duration, timeline, from, index }) => {
  const s = scene as IntroScene;
  const ghost = interpolate(frame, [4, 40], [0.05, 0.1], CLAMP);
  return (
    <SceneFrame
      id={s.id}
      theme={theme}
      frame={frame}
      duration={duration}
      from={from}
      words={timeline.words}
      kicker={s.kicker}
      chapter={chapterLabel(index)}
      signature="grid"
      variant="split"
      transitionIn={s.transitionIn}
      transitionOut={s.transitionOut}
    >
      {s.year ? (
        <div style={{ position: "absolute", right: -30, top: -90, fontFamily: theme.font.display, fontSize: 520, fontWeight: 700, lineHeight: 1, color: alpha(theme.color.text, ghost * 100) }}>{s.year}</div>
      ) : null}
      <Portrait scene={scene} theme={theme} frame={frame} duration={duration} box={{ x: 1180, y: 120, width: 540, height: 690 }} label="ARCHIVE / SUBJECTS" gid="fig-02" move="driftUp" />
      <div style={{ position: "absolute", left: 6, top: 120, width: 1040 }}>
        <Pill text="THE TWO MEN" theme={theme} frame={frame} />
        <div style={{ marginTop: 28 }}>
          <Headline text={s.question} theme={theme} frame={frame} fps={30} at={6} size={92} variant="rise" maxWidth={1020} lineHeight={1.02} />
        </div>
        <div style={{ marginTop: 30, paddingLeft: 24, borderLeft: `3px solid ${theme.color.accent}`, maxWidth: 820, fontFamily: theme.font.body, fontSize: 28, lineHeight: 1.5, color: theme.color.muted, opacity: interpolate(frame, [28, 44], [0, 1], CLAMP) }}>
          {s.context}
        </div>
        <div style={{ marginTop: 44, display: "flex", gap: 70 }}>
          {(s.facts ?? []).map((fact, index) => (
            <Stat key={fact.label} value={fact.value} label={fact.label} theme={theme} frame={frame} at={34 + index * 10} />
          ))}
        </div>
      </div>
    </SceneFrame>
  );
};

export const LMTimeline: SceneComponent = ({ scene, theme, localFrame: frame, duration, timeline, from, index }) => {
  const s = scene as TimelineScene;
  const rail = ease(frame, 8, 40, 0, 620);
  return (
    <SceneFrame
      id={s.id}
      theme={theme}
      frame={frame}
      duration={duration}
      from={from}
      words={timeline.words}
      kicker={s.kicker}
      chapter={chapterLabel(index)}
      signature="rule"
      variant="deep"
      transitionIn={s.transitionIn}
      transitionOut={s.transitionOut}
    >
      <Portrait scene={scene} theme={theme} frame={frame} duration={duration} box={{ x: 1180, y: 470, width: 530, height: 340 }} label="ARCHIVE / TIME" gid="fig-03" move="panLeft" />
      <div style={{ position: "absolute", left: 6, top: 40, width: 1120 }}>
        <Headline text={s.headline} theme={theme} frame={frame} fps={30} at={4} size={82} variant="tracking" maxWidth={1120} />
        <div style={{ position: "relative", marginTop: 56, paddingLeft: 44 }}>
          <div style={{ position: "absolute", left: 8, top: 8, width: 3, height: rail, background: theme.color.accent }} />
          {s.events.map((event, index) => {
            const a = 22 + index * 11;
            return (
              <div
                key={`${event.year}-${index}`}
                style={{
                  position: "relative",
                  paddingBottom: 32,
                  opacity: interpolate(frame, [a, a + 12], [0, 1], CLAMP),
                  transform: `translateX(${ease(frame, a, 16, 24, 0)}px)`,
                }}
              >
                <div style={{ position: "absolute", left: -44, top: 8, width: 18, height: 18, borderRadius: "50%", background: index === 0 ? theme.color.accent : theme.color.panel, border: `2px solid ${theme.color.accent}` }} />
                <div style={{ display: "flex", alignItems: "baseline", gap: 22 }}>
                  <span style={{ fontFamily: theme.font.display, fontSize: 50, fontWeight: 700, color: theme.color.text, minWidth: 180 }}>{event.year}</span>
                  <span style={{ fontFamily: theme.font.body, fontSize: 27, fontWeight: 600, color: theme.color.accent }}>{event.label}</span>
                </div>
                {event.detail ? <div style={{ marginTop: 6, marginLeft: 202, fontFamily: theme.font.body, fontSize: 23, color: theme.color.muted }}>{event.detail}</div> : null}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ position: "absolute", right: 0, top: 56, fontFamily: theme.font.type, fontSize: 20, letterSpacing: 2, color: theme.color.faint }}>FROM THE NARRATION ONLY</div>
    </SceneFrame>
  );
};

export const LMMap: SceneComponent = ({ scene, theme, localFrame: frame, duration, timeline, from, index }) => {
  const s = scene as MapScene;
  const reveal = interpolate(frame, [8, 36], [0, 1], CLAMP);
  return (
    <SceneFrame
      id={s.id}
      theme={theme}
      frame={frame}
      duration={duration}
      from={from}
      words={timeline.words}
      kicker={s.kicker}
      chapter={chapterLabel(index)}
      signature="corner"
      variant="deep"
      transitionIn={s.transitionIn}
      transitionOut={s.transitionOut}
    >
      <Portrait scene={scene} theme={theme} frame={frame} duration={duration} box={{ x: 1180, y: 120, width: 540, height: 690 }} label="ARCHIVE / PLACE" gid="fig-04" move="push" />
      <div style={{ position: "absolute", left: 6, top: 120, width: 1040 }}>
        <div style={{ fontFamily: theme.font.body, fontSize: 26, fontWeight: 600, letterSpacing: 6, textTransform: "uppercase", color: theme.color.accent, opacity: reveal }}>{s.region ?? "LOCATION"}</div>
        <div style={{ fontFamily: theme.font.display, fontSize: 146, fontWeight: 700, lineHeight: 0.95, textTransform: "uppercase", color: theme.color.text, textShadow: `0 16px 44px ${alpha(theme.color.void, 78)}`, opacity: reveal }}>{s.place}</div>
        {s.note ? (
          <div style={{ marginTop: 30, maxWidth: 700, padding: "18px 24px", borderLeft: `3px solid ${theme.color.signal}`, background: alpha(theme.color.void, 66), fontFamily: theme.font.body, fontSize: 27, lineHeight: 1.45, color: theme.color.text, opacity: interpolate(frame, [30, 46], [0, 1], CLAMP) }}>
            {s.note}
          </div>
        ) : null}
      </div>
      <div style={{ position: "absolute", left: 130, top: 650, width: 420, height: 260, opacity: reveal }}>
        <svg viewBox="0 0 420 260" width="100%" height="100%">
          <rect width="420" height="260" fill="none" stroke={alpha(theme.color.line, 60)} />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx="210" cy="130" r={40 + i * 70} fill="none" stroke={alpha(theme.color.line, 45)} />
          ))}
          <circle cx="210" cy="130" r={9 + pulse(frame, 36) * 16} fill="none" stroke={theme.color.accent} strokeWidth={2} />
          <circle cx="210" cy="130" r="7" fill={theme.color.accent} />
        </svg>
      </div>
    </SceneFrame>
  );
};

export const LMCharacter: SceneComponent = ({ scene, theme, localFrame: frame, duration, timeline, from, index }) => {
  const s = scene as CharacterScene;
  return (
    <SceneFrame
      id={s.id}
      theme={theme}
      frame={frame}
      duration={duration}
      from={from}
      words={timeline.words}
      kicker={s.kicker}
      chapter={chapterLabel(index)}
      signature="rail"
      variant="void"
      transitionIn={s.transitionIn}
      transitionOut={s.transitionOut}
    >
      <Portrait scene={scene} theme={theme} frame={frame} duration={duration} box={{ x: 1010, y: 80, width: 700, height: 760 }} label="ARCHIVE / ACCOUNT" gid="fig-05" move="driftUp" />
      <div style={{ position: "absolute", left: 10, top: 110, width: 920 }}>
        <div style={{ width: 90, height: 5, background: theme.color.accent, marginBottom: 28 }} />
        <div style={{ fontFamily: theme.font.display, fontSize: 100, fontWeight: 700, lineHeight: 0.95, textTransform: "uppercase", color: theme.color.text, opacity: interpolate(frame, [4, 20], [0, 1], CLAMP), transform: `translateY(${ease(frame, 4, 18, 30, 0)}px)` }}>
          {s.name}
        </div>
        <div style={{ marginTop: 18, fontFamily: theme.font.body, fontSize: 29, fontWeight: 600, color: theme.color.accent, opacity: interpolate(frame, [10, 26], [0, 1], CLAMP) }}>{s.role}</div>
        {s.years ? <div style={{ marginTop: 10, fontFamily: theme.font.type, fontSize: 22, letterSpacing: 3, color: theme.color.faint }}>{s.years}</div> : null}
        <div style={{ marginTop: 42 }}>
          <Bullets items={s.facts ?? []} theme={theme} frame={frame} at={18} />
        </div>
      </div>
    </SceneFrame>
  );
};

export const LMEvidence: SceneComponent = ({ scene, theme, localFrame: frame, duration, timeline, from, index }) => {
  const s = scene as EvidenceScene;
  const data = asPortrait(scene);
  const words = timeline.words ?? [];
  const lines = data.lines ?? [];
  const box = data.imageBox ?? { x: 1010, y: 120, width: 700, height: 700 };
  const absoluteTime = (from + frame) / 30;
  const findLineIndex = (pattern: RegExp) => lines.findIndex((line) => pattern.test(line.toLowerCase()));
  const beatStart = (pattern: RegExp) => {
    const word = words.find((word) => pattern.test(word.word.toLowerCase()));
    return word ? word.start : null;
  };
  const beats: { start: number | null; line: number }[] = [
    { start: beatStart(/chot/), line: findLineIndex(/blood/) },
    { start: beatStart(/ladai/), line: findLineIndex(/struggle/) },
    { start: beatStart(/khaali/), line: findLineIndex(/robbery/) },
    { start: beatStart(/notebook/), line: findLineIndex(/notebook/) },
  ];
  let activeIndex: number | null = null;
  for (const beat of beats) {
    if (beat.line >= 0 && beat.start !== null && absoluteTime >= beat.start) activeIndex = beat.line;
  }
  const notebookWordIndex = words.findIndex((word) => /notebook/i.test(word.word));
  const focusWord = notebookWordIndex >= 3 ? words[notebookWordIndex - 3] : null;
  const focusAt = focusWord ? Math.round(focusWord.start * 30) - from : null;
  const focusProgress = focusAt === null ? 0 : interpolate(frame, [focusAt, focusAt + 18], [0, 1], CLAMP);
  const cropX = box.width * 0.42;
  const cropY = box.height * 0.42;
  return (
    <SceneFrame
      id={s.id}
      theme={theme}
      frame={frame}
      duration={duration}
      from={from}
      words={timeline.words}
      kicker={s.kicker}
      chapter={chapterLabel(index)}
      signature="corner"
      variant="deep"
      transitionIn={s.transitionIn}
      transitionOut={s.transitionOut}
    >
      <Portrait scene={scene} theme={theme} frame={frame} duration={duration} box={box} label="ARCHIVE / EXHIBIT" gid={`fig-${s.id}`} move="panLeft" />
      {data.image && focusAt !== null ? (
        <div
          style={{
            position: "absolute",
            left: box.x + cropX,
            top: box.y + cropY,
            width: box.width - cropX,
            height: box.height - cropY,
            overflow: "hidden",
            opacity: focusProgress * 0.9,
            pointerEvents: "none",
          }}
        >
          <Img
            src={staticFile(data.image)}
            style={{
              position: "absolute",
              left: -cropX,
              top: -cropY,
              width: box.width,
              height: box.height,
              objectFit: "contain",
              filter: "contrast(1.08) saturate(0.9)",
              transform: `scale(${(1 + focusProgress * 0.16).toFixed(3)})`,
              transformOrigin: "68% 78%",
            }}
          />
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 10, top: 40, width: 960 }}>
        <div style={{ fontFamily: theme.font.type, fontSize: 23, letterSpacing: 5, color: theme.color.danger, opacity: interpolate(frame, [4, 16], [0, 1], CLAMP) }}>{s.exhibit}</div>
        <div style={{ marginTop: 10 }}>
          <Headline text={s.label} theme={theme} frame={frame} fps={30} at={6} size={86} variant="mask" maxWidth={940} />
        </div>
        <div style={{ marginTop: 26, width: interpolate(frame, [10, 30], [0, 420], CLAMP), height: 4, background: theme.color.accent }} />
        {lines.length ? (
          <div style={{ marginTop: 34 }}>
            <Bullets items={lines} theme={theme} frame={frame} at={22} activeIndex={activeIndex} />
          </div>
        ) : null}
        {s.note ? (
          <div style={{ marginTop: 30, maxWidth: 880, fontFamily: theme.font.body, fontSize: 27, lineHeight: 1.45, color: theme.color.muted, opacity: interpolate(frame, [36, 52], [0, 1], CLAMP) }}>{s.note}</div>
        ) : null}
      </div>
      <div style={{ position: "absolute", left: 10, bottom: 30, fontFamily: theme.font.type, fontSize: 20, letterSpacing: 3, color: theme.color.faint }}>SOURCE / THE NARRATION</div>
    </SceneFrame>
  );
};

const nodeColor = (node: BoardNode, theme: DocTheme) =>
  node.type === "person" ? theme.color.accent : node.type === "place" ? theme.color.signal : node.type === "event" ? theme.color.danger : theme.color.text;

export const LMBoard: SceneComponent = ({ scene, theme, localFrame: frame, duration, timeline, from, index }) => {
  const s = scene as BoardScene;
  const data = asPortrait(scene);
  const width = 1080;
  const height = 820;
  const pos = (node: BoardNode) => ({ x: (node.x / 100) * width, y: (node.y / 100) * height });
  return (
    <SceneFrame
      id={s.id}
      theme={theme}
      frame={frame}
      duration={duration}
      from={from}
      words={timeline.words}
      kicker={s.kicker}
      chapter={chapterLabel(index)}
      signature="grid"
      variant="void"
      transitionIn={s.transitionIn}
      transitionOut={s.transitionOut}
    >
      {data.image ? <PortraitStage src={data.image} theme={theme} frame={frame} duration={duration} box={{ x: 1180, y: 70, width: 540, height: 380 }} label={data.imageLabel ?? "ARCHIVE / A"} gid="fig-07a" move="driftUp" /> : null}
      {data.imageB ? <PortraitStage src={data.imageB} theme={theme} frame={frame} duration={duration} box={{ x: 1180, y: 480, width: 540, height: 380 }} label={data.imageLabelB ?? "ARCHIVE / B"} gid="fig-07b" move="push" /> : null}
      <div style={{ position: "absolute", left: 6, top: 34, width: 1140 }}>
        <Headline text={s.headline} theme={theme} frame={frame} fps={30} at={-8} size={78} variant="mask" maxWidth={1120} />
      </div>
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={width} height={height}>
        {s.links.map(([fromId, toId], index) => {
          const a = s.nodes.find((node) => node.id === fromId);
          const b = s.nodes.find((node) => node.id === toId);
          if (!a || !b) return null;
          const pa = pos(a);
          const pb = pos(b);
          const progress = interpolate(frame, [-8 + index * 2, 10 + index * 2], [0, 1], CLAMP);
          return (
            <line key={`${fromId}-${toId}`} x1={pa.x + 140} y1={pa.y + 80} x2={pb.x + 140} y2={pb.y + 80} stroke={alpha(theme.color.accent, 34)} strokeWidth={3} strokeDasharray={1} pathLength={1} strokeDashoffset={1 - progress} />
          );
        })}
      </svg>
      {s.nodes.map((node, index) => {
        const a = -8 + index * 2;
        const p = pos(node);
        const color = nodeColor(node, theme);
        return (
          <div
            key={node.id}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y + 70,
              width: 280,
              minHeight: 96,
              padding: "16px 18px",
              background: index % 3 === 1 ? theme.color.paper : alpha(theme.color.panel, 96),
              color: index % 3 === 1 ? theme.color.ink : theme.color.text,
              borderTop: `4px solid ${color}`,
              boxShadow: `0 16px 34px ${alpha(theme.color.void, 55)}`,
              opacity: interpolate(frame, [a, a + 12], [0, 1], CLAMP),
              transform: `translateY(${ease(frame, a, 14, -24, 0)}px) rotate(${((index % 3) - 1) * 1.1}deg)`,
            }}
          >
            <div style={{ fontFamily: theme.font.type, fontSize: 18, letterSpacing: 2, textTransform: "uppercase", color }}>{node.type ?? "clue"}</div>
            <div style={{ fontFamily: theme.font.body, fontSize: 24, fontWeight: 600, lineHeight: 1.2, marginTop: 6 }}>{node.label}</div>
          </div>
        );
      })}
      {s.note ? (
        <div style={{ position: "absolute", left: 10, bottom: 24, fontFamily: theme.font.type, fontSize: 24, color: theme.color.danger, opacity: interpolate(frame, [42, 56], [0, 1], CLAMP) }}>{s.note}</div>
      ) : null}
    </SceneFrame>
  );
};

export const LMExplanation: SceneComponent = ({ scene, theme, localFrame: frame, duration, timeline, from, index }) => {
  const s = scene as ExplanationScene;
  return (
    <SceneFrame
      id={s.id}
      theme={theme}
      frame={frame}
      duration={duration}
      from={from}
      words={timeline.words}
      kicker={s.kicker}
      chapter={chapterLabel(index)}
      signature="rule"
      variant="split"
      transitionIn={s.transitionIn}
      transitionOut={s.transitionOut}
    >
      <Portrait scene={scene} theme={theme} frame={frame} duration={duration} box={{ x: 1180, y: 120, width: 540, height: 690 }} label="ARCHIVE / NOTES" gid="fig-08" move="push" />
      <div style={{ position: "absolute", left: 6, top: 40, width: 1080 }}>
        <Headline text={s.headline} theme={theme} frame={frame} fps={30} at={4} size={80} variant="mask" maxWidth={1060} />
        <div style={{ marginTop: 46, display: "flex", flexDirection: "column", gap: 26 }}>
          {s.steps.map((step, index) => {
            const a = 22 + index * 14;
            return (
              <div
                key={`${step.index}-${index}`}
                style={{
                  display: "flex",
                  gap: 28,
                  alignItems: "baseline",
                  paddingBottom: 22,
                  borderBottom: `1px solid ${alpha(theme.color.muted, 35)}`,
                  opacity: interpolate(frame, [a, a + 14], [0, 1], CLAMP),
                  transform: `translateY(${ease(frame, a, 16, 24, 0)}px)`,
                }}
              >
                <span style={{ fontFamily: theme.font.display, fontSize: 70, fontWeight: 700, lineHeight: 0.9, color: alpha(theme.color.text, 30) }}>{step.index}</span>
                <span style={{ minWidth: 250, fontFamily: theme.font.display, fontSize: 44, fontWeight: 700, textTransform: "uppercase", color: theme.color.text }}>{step.title}</span>
                <span style={{ fontFamily: theme.font.body, fontSize: 27, lineHeight: 1.4, color: theme.color.muted }}>{step.body}</span>
              </div>
            );
          })}
        </div>
      </div>
    </SceneFrame>
  );
};

export const LMConclusion: SceneComponent = ({ scene, theme, localFrame: frame, duration, timeline, from, index }) => {
  const s = scene as ConclusionScene;
  return (
    <SceneFrame
      id={s.id}
      theme={theme}
      frame={frame}
      duration={duration}
      from={from}
      words={timeline.words}
      kicker={s.kicker}
      chapter={chapterLabel(index)}
      signature="rail"
      variant="split"
      transitionIn={s.transitionIn}
      transitionOut={s.transitionOut}
    >
      <Portrait scene={scene} theme={theme} frame={frame} duration={duration} box={{ x: 1150, y: 120, width: 570, height: 700 }} label="ARCHIVE / STATUS" gid="fig-11" move="push" />
      <div style={{ position: "absolute", left: 6, top: 150, width: 1080 }}>
        <Headline text={s.statement} theme={theme} frame={frame} fps={30} at={8} size={100} variant="mask" maxWidth={1060} lineHeight={1.02} />
        <div style={{ width: interpolate(frame, [12, 34], [0, 420], CLAMP), height: 5, background: theme.color.accent, marginTop: 34 }} />
        <div style={{ marginTop: 36 }}>
          <Bullets items={s.points ?? []} theme={theme} frame={frame} at={20} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 6, bottom: 30, fontFamily: theme.font.type, fontSize: 20, letterSpacing: 3, color: theme.color.faint }}>WHAT THE RECORD SHOWS</div>
    </SceneFrame>
  );
};

export const LMTransition: SceneComponent = ({ scene, theme, localFrame: frame, duration, timeline, from, index }) => {
  const s = scene as CinematicTransitionScene;
  const p = interpolate(frame, [0, duration - 1], [0, 1], CLAMP);
  const reveal = interpolate(frame, [0, 16], [0, 1], CLAMP);
  const exit = interpolate(frame, [duration - 16, duration], [1, 0], CLAMP);
  return (
    <SceneFrame id={s.id} theme={theme} frame={frame} duration={duration} from={from} words={timeline.words} kicker={s.kicker}       chapter={chapterLabel(index)} signature="grid" variant="void">
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} style={{ position: "absolute", left: -600 + p * 2600 - i * 90, top: (i * 972) / 7, width: 2500, height: 972 / 7 + 2, background: i % 2 === 0 ? alpha(theme.color.panel, 92) : alpha(theme.color.void, 92), transform: "skewX(-18deg)" }} />
        ))}
      </div>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: Math.min(reveal, exit) }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: theme.font.type, fontSize: 24, letterSpacing: 8, color: theme.color.accent }}>CASE FILE / UNRESOLVED</div>
          <div style={{ marginTop: 16, fontFamily: theme.font.display, fontSize: 148, fontWeight: 700, lineHeight: 0.95, textTransform: "uppercase", letterSpacing: "-2px", color: theme.color.text }}>{s.label ?? "Unsolved"}</div>
          <div style={{ width: 420 * p, height: 3, background: theme.color.accent, margin: "30px auto 0" }} />
        </div>
      </div>
    </SceneFrame>
  );
};

export const LMRevelation: SceneComponent = ({ scene, theme, localFrame: frame, duration, timeline, from, index }) => {
  const s = scene as RevelationScene;
  const stamp = stampPose(frame, 30, 42);
  return (
    <SceneFrame
      id={s.id}
      theme={theme}
      frame={frame}
      duration={duration}
      from={from}
      words={timeline.words}
      kicker={s.kicker}
      chapter={chapterLabel(index)}
      signature="corner"
      variant="void"
      transitionIn={s.transitionIn}
      transitionOut={s.transitionOut}
    >
      <Portrait scene={scene} theme={theme} frame={frame} duration={duration} box={{ x: 1150, y: 120, width: 570, height: 700 }} label="ILLUSTRATION / THEORY" gid="fig-13" move="pull" />
      <div style={{ position: "absolute", left: 6, top: 150, width: 1080 }}>
        <Pill text="UNVERIFIED THEORY" theme={theme} frame={frame} danger />
        <div style={{ marginTop: 26 }}>
          <Headline text={s.headline} theme={theme} frame={frame} fps={30} at={8} size={112} variant="stamp" maxWidth={1060} />
        </div>
        <div style={{ marginTop: 26, width: interpolate(frame, [20, 40], [0, 380], CLAMP), height: 4, background: theme.color.danger }} />
        {s.support ? (
          <div style={{ marginTop: 26, maxWidth: 980, fontFamily: theme.font.body, fontSize: 30, lineHeight: 1.5, color: theme.color.muted, opacity: interpolate(frame, [34, 50], [0, 1], CLAMP) }}>{s.support}</div>
        ) : null}
        <div style={{ marginTop: 34, display: "inline-block", transform: `rotate(-6deg) scale(${stamp.scale.toFixed(3)})`, opacity: stamp.opacity, padding: "12px 24px", border: `5px solid ${theme.color.danger}`, color: theme.color.danger, fontFamily: theme.font.display, fontSize: 42, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase" }}>
          {s.stamp ?? "THEORY / UNVERIFIED"}
        </div>
      </div>
      <div style={{ position: "absolute", left: 6, bottom: 30, fontFamily: theme.font.type, fontSize: 20, letterSpacing: 3, color: theme.color.faint }}>NOT AN ESTABLISHED CAUSE</div>
    </SceneFrame>
  );
};

export const LMOutro: SceneComponent = ({ scene, theme, localFrame: frame, duration, timeline, from, index }) => {
  const s = scene as OutroScene;
  const mark = interpolate(frame, [0, 20], [0.34, 1], CLAMP);
  const text = interpolate(frame, [8, 26], [0, 1], CLAMP);
  const cta = interpolate(frame, [20, 40], [0, 1], CLAMP);
  const glow = 50 + pulse(frame, 46) * 30;
  return (
    <SceneFrame id={s.id} theme={theme} frame={frame} duration={duration} from={from} words={timeline.words} kicker="STAY CURIOUS" chapter={chapterLabel(index)} signature="grid" variant="void" caption={false}>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", width: 1400 }}>
          <div style={{ width: 120, height: 120, margin: "0 auto 40px", border: `3px solid ${theme.color.accent}`, opacity: mark, transform: `rotate(45deg) scale(${(0.9 + mark * 0.1).toFixed(3)})`, boxShadow: `0 0 ${glow}px ${alpha(theme.color.accent, 22)}` }} />
          <div style={{ opacity: text, transform: `translateY(${((1 - text) * 22).toFixed(1)}px)` }}>
            <div style={{ fontFamily: theme.font.display, fontSize: 96, fontWeight: 700, lineHeight: 1.02, textTransform: "uppercase", color: theme.color.text }}>Follow for more real cases</div>
          </div>
          <div style={{ marginTop: 40, opacity: cta, transform: `translateY(${((1 - cta) * 18).toFixed(1)}px)` }}>
            <div style={{ width: 320, height: 3, background: theme.color.accent, margin: "0 auto 26px" }} />
            <div style={{ fontFamily: theme.font.body, fontSize: 34, fontWeight: 600, color: theme.color.text }}>That keep you up at night</div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 26, textAlign: "center", fontFamily: theme.font.type, fontSize: 20, letterSpacing: 3, color: theme.color.faint }}>NARRATED CASE / END OF FILE</div>
    </SceneFrame>
  );
};
