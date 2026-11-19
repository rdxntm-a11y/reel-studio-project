import type { DocScene, SceneComponent } from "./types";
import { CinematicHook } from "./scenes/CinematicHook";
import { StoryIntroduction } from "./scenes/StoryIntroduction";
import { HistoricalTimeline } from "./scenes/HistoricalTimeline";
import { LocationMapReveal } from "./scenes/LocationMapReveal";
import { CharacterIntroduction } from "./scenes/CharacterIntroduction";
import { EvidencePresentation } from "./scenes/EvidencePresentation";
import { InvestigationBoard } from "./scenes/InvestigationBoard";
import { DocumentaryExplanation } from "./scenes/DocumentaryExplanation";
import { DramaticRevelation } from "./scenes/DramaticRevelation";
import { CinematicTransition } from "./scenes/CinematicTransition";
import { FinalConclusion } from "./scenes/FinalConclusion";
import { ProfessionalOutro } from "./scenes/ProfessionalOutro";

export const SCENE_COMPONENTS = {
  hook: CinematicHook,
  intro: StoryIntroduction,
  timeline: HistoricalTimeline,
  map: LocationMapReveal,
  character: CharacterIntroduction,
  evidence: EvidencePresentation,
  board: InvestigationBoard,
  explanation: DocumentaryExplanation,
  revelation: DramaticRevelation,
  transition: CinematicTransition,
  conclusion: FinalConclusion,
  outro: ProfessionalOutro,
} as const;

export const sceneComponentFor = (scene: DocScene): SceneComponent =>
  SCENE_COMPONENTS[scene.kind] as unknown as SceneComponent;
