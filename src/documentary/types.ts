import type { FC } from "react";
import type { DocTheme } from "./theme";

export type DocWord = { word: string; start: number; end: number };

export type AudioTrack = {
  src: string;
  gain?: number;
  fadeInFrames?: number;
  fadeOutFrames?: number;
};

export type SoundCue = {
  at: number;
  name: string;
  src?: string;
  gain?: number;
  note?: string;
};

export type AudioBed = {
  voiceover?: AudioTrack;
  music?: AudioTrack;
  sfx?: SoundCue[];
};

export type TransitionKind = "none" | "fade" | "whip" | "iris" | "slice" | "match";

type SceneBase = {
  id: string;
  durationInFrames: number;
  from?: number;
  kicker?: string;
  transitionIn?: TransitionKind;
  transitionOut?: TransitionKind;
};

export type TimelineEvent = { year: string; label: string; detail?: string; at?: number };
export type Point = { x: number; y: number };
export type BoardNode = { id: string; label: string; x: number; y: number; type?: "person" | "place" | "event" | "clue" };
export type Annotation = { x: number; y: number; text: string };
export type ExplanationStep = { index: string; title: string; body: string; at?: number };
export type Fact = { value: string; label: string };

export type HookScene = SceneBase & {
  kind: "hook";
  headline: string;
  subhead?: string;
  image?: string;
  tag?: string;
};

export type IntroScene = SceneBase & {
  kind: "intro";
  question: string;
  context: string;
  image?: string;
  year?: string;
  facts?: Fact[];
};

export type TimelineScene = SceneBase & {
  kind: "timeline";
  headline: string;
  events: TimelineEvent[];
};

export type MapScene = SceneBase & {
  kind: "map";
  place: string;
  region?: string;
  marker: Point;
  route?: Point[];
  note?: string;
  image?: string;
  zoom?: number;
};

export type CharacterScene = SceneBase & {
  kind: "character";
  name: string;
  role: string;
  years?: string;
  image?: string;
  facts?: string[];
  quote?: string;
};

export type EvidenceScene = SceneBase & {
  kind: "evidence";
  image: string;
  exhibit: string;
  label: string;
  annotations?: Annotation[];
  note?: string;
  treatment?: "photo" | "document";
};

export type BoardScene = SceneBase & {
  kind: "board";
  headline: string;
  nodes: BoardNode[];
  links: [string, string][];
  note?: string;
};

export type ExplanationScene = SceneBase & {
  kind: "explanation";
  headline: string;
  steps: ExplanationStep[];
};

export type RevelationScene = SceneBase & {
  kind: "revelation";
  headline: string;
  support?: string;
  image?: string;
  stamp?: string;
};

export type CinematicTransitionScene = SceneBase & {
  kind: "transition";
  mode: Extract<TransitionKind, "whip" | "fade" | "iris" | "slice" | "match">;
  label?: string;
};

export type ConclusionScene = SceneBase & {
  kind: "conclusion";
  statement: string;
  points?: string[];
  image?: string;
};

export type OutroScene = SceneBase & {
  kind: "outro";
  cta?: string;
  next?: string;
  handle?: string;
};

export type DocScene =
  | HookScene
  | IntroScene
  | TimelineScene
  | MapScene
  | CharacterScene
  | EvidenceScene
  | BoardScene
  | ExplanationScene
  | RevelationScene
  | CinematicTransitionScene
  | ConclusionScene
  | OutroScene;

export type DocTimeline = {
  id: string;
  title: string;
  theme?: string;
  fps?: number;
  words?: DocWord[];
  audio?: AudioBed;
  scenes: DocScene[];
};

export type SceneProps<T extends DocScene = DocScene> = {
  scene: T;
  timeline: DocTimeline;
  theme: DocTheme;
  localFrame: number;
  globalFrame: number;
  duration: number;
  from: number;
  index: number;
};

export type SceneComponent<T extends DocScene = DocScene> = FC<SceneProps<T>>;
