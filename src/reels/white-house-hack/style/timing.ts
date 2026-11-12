export type Word = { word: string; start: number; end: number };

export const sf = (sec: number, fps: number): number => Math.round(sec * fps);

  const clean = (s: string): string =>
    s.toLowerCase().replace(/[.,!?;:()…-]/g, "").replace(/\s+/g, " ").trim();

export const wordIndex = (words: Word[], text: string, nth = 0): number => {
  let seen = 0;
  for (let i = 0; i < words.length; i++) {
    if (clean(words[i].word) === clean(text)) {
      if (seen === nth) return i;
      seen++;
    }
  }
  throw new Error(`Word not found in words.json: "${text}" (#${nth})`);
};

export const wordFrame = (words: Word[], i: number, fps: number): number =>
  sf(words[i].start, fps);

export type SceneTiming = { from: number; frames: number };

export const sceneTimings = (
  words: Word[],
  firstWordOfScene: number[],
  fps: number,
  tailSec = 1,
): SceneTiming[] => {
  const starts = firstWordOfScene.map((i, k) =>
    k === 0 ? 0 : wordFrame(words, i, fps),
  );
  const end = sf(words[words.length - 1].end + tailSec, fps);
  return starts.map((from, k) => ({
    from,
    frames: (k < starts.length - 1 ? starts[k + 1] : end) - from,
  }));
};

export const totalFrames = (words: Word[], fps: number, tailSec = 1): number =>
  sf(words[words.length - 1].end + tailSec, fps);
