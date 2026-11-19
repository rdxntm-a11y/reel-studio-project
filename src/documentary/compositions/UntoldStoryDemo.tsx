import { Documentary } from "../Documentary";
import type { DocTimeline, DocWord } from "../types";

const SCRIPT =
  "At two fourteen in the morning the light at Point Thirty One went out. For thirty years it had guided ships through the narrow channel. The official report called it a power failure. But the keeper's log tells a different story. Elena Voss had been stationed there since nineteen seventy four. She knew every sound of that tower. In the final entry she wrote that the lamp was not broken. It was covered. Three witnesses reported a boat approaching from the east. None of them were interviewed. The logbook disappeared two days later. What remained was a single page folded into four. On it was a diagram of the lens and a warning. The light had been aimed away from the rocks. Toward a ship that was never supposed to arrive. When the coast guard finally returned the tower was empty. The lamp was cold. And the door was locked from the inside. Decades later the answer is still buried in the archive. But the page survived. And the signal it described was never a mistake. It was a message.";

const DEMO_WORDS: DocWord[] = (() => {
  let cursor = 0.55;
  return SCRIPT.split(/\s+/).map((word, index) => {
    const duration = 0.18 + ((index * 7) % 5) * 0.02;
    const start = cursor;
    cursor += duration + 0.05;
    if ((index + 1) % 17 === 0) cursor += 0.28;
    return { word, start, end: start + duration };
  });
})();

export const UNTOLD_STORY_DEMO: DocTimeline = {
  id: "UntoldStoryDemo",
  title: "The Night the Lighthouse Went Dark",
  theme: "untoldStory",
  words: DEMO_WORDS,
  audio: {
    sfx: [
      { at: 0, name: "room tone", note: "low coastal wind bed" },
      { at: 5.2, name: "lamp cut", note: "sharp electrical disconnect" },
      { at: 12.8, name: "paper rustle", note: "logbook page turn" },
      { at: 25.4, name: "string swell", note: "tension rise into revelation" },
      { at: 38.2, name: "impact hit", note: "sub drop on stamp" },
      { at: 50.0, name: "tail resolve", note: "soft decay into outro" },
    ],
  },
  scenes: [
    {
      id: "hook",
      kind: "hook",
      durationInFrames: 150,
      kicker: "CASE FILE / 001",
      tag: "ARCHIVE / UNTOLD STORY",
      headline: "The night the lighthouse went dark",
      subhead: "One missing logbook. Three witnesses. A signal nobody was meant to see.",
      image: "documentary/demo/assets/lighthouse.svg",
      transitionOut: "fade",
    },
    {
      id: "intro",
      kind: "intro",
      durationInFrames: 150,
      kicker: "THE PREMISE",
      question: "What happened at Point Thirty One?",
      context: "The official record calls it a power failure. The people who were there never agreed.",
      year: "1978",
      facts: [
        { value: "02:14", label: "time of blackout" },
        { value: "03", label: "witnesses" },
        { value: "01", label: "missing logbook" },
      ],
      transitionIn: "fade",
      transitionOut: "iris",
    },
    {
      id: "timeline",
      kind: "timeline",
      durationInFrames: 150,
      kicker: "CHRONOLOGY",
      headline: "Four dates that matter",
      events: [
        { year: "1974", label: "Voss arrives", detail: "Assistant keeper, north station" },
        { year: "1976", label: "Lens refit", detail: "New rotating assembly installed" },
        { year: "1978", label: "The blackout", detail: "Lamp out at 02:14" },
        { year: "1981", label: "Station closed", detail: "Automation, no inquiry" },
      ],
      transitionIn: "iris",
      transitionOut: "fade",
    },
    {
      id: "map",
      kind: "map",
      durationInFrames: 150,
      kicker: "LOCATION REVEAL",
      place: "Point 31",
      region: "North Coast",
      marker: { x: 0.42, y: 0.44 },
      route: [
        { x: 0.14, y: 0.7 },
        { x: 0.27, y: 0.56 },
        { x: 0.42, y: 0.44 },
      ],
      note: "The beam swept the shipping lane, not the rocks.",
      zoom: 1.12,
      transitionIn: "fade",
      transitionOut: "whip",
    },
    {
      id: "character",
      kind: "character",
      durationInFrames: 135,
      kicker: "PERSON OF INTEREST",
      name: "Elena Voss",
      role: "Lighthouse keeper",
      years: "STATIONED 1974 - 1978",
      image: "documentary/demo/assets/portrait.svg",
      facts: ["Knew every mechanical sound in the tower", "Filed the last complete weather report", "Requested a transfer two weeks earlier"],
      quote: "The lamp was not broken. It was covered.",
      transitionIn: "whip",
      transitionOut: "fade",
    },
    {
      id: "evidence",
      kind: "evidence",
      durationInFrames: 150,
      kicker: "EXHIBIT REVIEW",
      image: "documentary/demo/assets/document.svg",
      exhibit: "EXHIBIT B / PAGE ONE",
      label: "The log book",
      annotations: [
        { x: 0.32, y: 0.3, text: "ALTERED ENTRY" },
        { x: 0.68, y: 0.66, text: "MISSING SIGNATURE" },
      ],
      note: "One page survived the file purge. The ink does not match the rest of the log.",
      treatment: "document",
      transitionIn: "fade",
      transitionOut: "slice",
    },
    {
      id: "board",
      kind: "board",
      durationInFrames: 150,
      kicker: "INVESTIGATION BOARD",
      headline: "What the record connects",
      nodes: [
        { id: "voss", label: "Elena Voss", x: 8, y: 24, type: "person" },
        { id: "boat", label: "Unregistered boat", x: 60, y: 12, type: "clue" },
        { id: "lamp", label: "Lens assembly", x: 48, y: 48, type: "event" },
        { id: "page", label: "Folded page", x: 12, y: 62, type: "clue" },
        { id: "guard", label: "Coast guard", x: 68, y: 70, type: "place" },
      ],
      links: [
        ["voss", "lamp"],
        ["boat", "lamp"],
        ["lamp", "page"],
        ["page", "guard"],
      ],
      note: "NO INTERVIEW TRANSCRIPT FOUND",
      transitionIn: "slice",
      transitionOut: "fade",
    },
    {
      id: "explanation",
      kind: "explanation",
      durationInFrames: 135,
      kicker: "HOW IT WORKS",
      headline: "The signal trick",
      steps: [
        { index: "01", title: "The cover", body: "A dark cloth over the lens stopped the beam without breaking the lamp." },
        { index: "02", title: "The angle", body: "The housing was turned eleven degrees off the shipping lane." },
        { index: "03", title: "The message", body: "A short flash pattern repeated every four minutes until dawn." },
      ],
      transitionIn: "fade",
      transitionOut: "match",
    },
    {
      id: "revelation",
      kind: "revelation",
      durationInFrames: 120,
      kicker: "THE REVELATION",
      headline: "The light was never off",
      support: "It was aimed at a ship that was not supposed to be there.",
      image: "documentary/demo/assets/lighthouse.svg",
      stamp: "Confirmed",
      transitionIn: "match",
      transitionOut: "fade",
    },
    {
      id: "chapter",
      kind: "transition",
      durationInFrames: 75,
      kicker: "CHAPTER BREAK",
      mode: "whip",
      label: "Part Two",
    },
    {
      id: "conclusion",
      kind: "conclusion",
      durationInFrames: 150,
      kicker: "THE CONCLUSION",
      statement: "A message hidden in plain sight",
      points: [
        "The failure was deliberate, not mechanical.",
        "The folded page names a route, not a person.",
        "The inquiry was closed before it began.",
      ],
      image: "documentary/demo/assets/coast.svg",
      transitionIn: "fade",
    },
    {
      id: "outro",
      kind: "outro",
      durationInFrames: 150,
      cta: "Subscribe for the next untold story",
      next: "The Vanishing at Mile 49",
    },
  ],
};

export const UntoldStoryDemo: React.FC<{ probe?: boolean; debugSafeZones?: boolean }> = ({ probe, debugSafeZones }) => (
  <Documentary timeline={UNTOLD_STORY_DEMO} probe={probe} debugSafeZones={debugSafeZones} />
);

export default UntoldStoryDemo;
