# Implementation plan — Untold Story documentary template

Goal: ship the template described in `docs/superpowers/specs/2026-11-19-untold-story-documentary-template-design.md`.

## Architecture
All new source lives in `src/documentary/`. One 16:9 composition is registered in `src/Root.tsx` outside the existing `REELS.map`. No existing reel, asset or brand file is modified.

## Tasks
1. Create `theme.ts`, `geometry.ts`, `motion.ts`, `types.ts`, `utils.ts`. Verify: `npm run typecheck`.
2. Create shared `components/`: Atmosphere, SceneFrame, Camera, Headline, DocCaption, LowerThird, Plate, MapGraphic, TimelineGraphic, EvidenceBoard, TransitionLayer, AudioBed. Verify: typecheck.
3. Create twelve `scenes/` components, each consuming a typed scene config. Verify: typecheck.
4. Create `Documentary.tsx`, scene registry, demo timeline and Root registration. Verify: `npx remotion compositions`.
5. Add `tools/documentary/contact-sheet.mjs` for 16:9 tiles. Verify: typecheck, `npm run check -- UntoldStoryDemo`, contact sheet generated.
6. Inspect transition frames, fix timing/layout defects, write implementation report.

## Global constraints
- Frame-based motion only; all `interpolate` calls clamped.
- No hard-coded colours in scenes; use theme tokens.
- No new npm dependencies.
- Keep every scene duration configurable through `DocTimeline.scenes[].durationInFrames`.

## Review focus
- No safe-area violations at frames containing captions, lower thirds and map labels.
- Exactly one hero element per frame; no simultaneous full-frame motion.
- Caption words align to their source timings; no `at` beyond its scene.
- Every scene kind appears in the demo and has a visually distinct grammar.
