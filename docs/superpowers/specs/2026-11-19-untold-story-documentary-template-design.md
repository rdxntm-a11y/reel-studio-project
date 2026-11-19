# Untold Story — reusable cinematic documentary template

## Intent
A new, independent 16:9 Remotion production system for the YouTube channel "Untold Story". The deliverable is not a single film: it is a typed scene library, a timeline schema, a renderer and one demo composition. A future episode supplies a topic, script, voiceover, word timings and images; the system produces a visually consistent documentary without touching existing 9:16 reels.

## Goals
- Twelve distinct scene languages, not one repeated headline/image/stamp layout.
- Frame-accurate, deterministic motion driven only by `useCurrentFrame`, `interpolate`, `spring` and seeded maths.
- All scene durations configurable from a single timeline object.
- Optional voiceover, music, SFX cues and word-level captions; no required media assets for the demo.
- Re-skin from one theme object using OKLCH tokens; no hard-coded colours in scenes.
- 1920x1080 / 30 fps, 5% title-safe margins, 12-column grid, thirds-based focal points.

## Non-goals
- No AI video generation, no automatic pose engine, no external animation library.
- No final full-length render in this phase; stills and a contact sheet only.
- No changes to `src/reels/**`, existing assets or the 9:16 brand.

## Constraints
- Existing deps only: Remotion 4.0.538, React 19, TypeScript, `@remotion/google-fonts`.
- Remotion seeks frames: no CSS transitions, keyframes, timers, `Date.now()` or `Math.random()`.
- Complex subjects come from image files; SVG is used only for maps, grids, lines, frames and charts.
- The existing `npm run check` renders 216x384 contact-sheet tiles, so a wide-format contact sheet helper is added separately.

## Approaches considered
1. **Extend the Lead Masks reel** — fastest but would inherit 9:16 constraints and its paper/red identity. Rejected.
2. **Separate app with its own entry point** — maximum isolation but breaks `npm run check` and duplicates tooling. Rejected.
3. **Separate `src/documentary/` module registered as its own 16:9 composition** — chosen. Independent code and identity, reuses installed Remotion tooling, leaves every existing reel untouched.

## Design
- `theme.ts`: channel identity, OKLCH palette, font trio, motion constants.
- `geometry.ts`: canvas, 5% safe area, grid, thirds, caption band.
- `motion.ts`: easing curves, reveal helpers, one-camera-move-per-beat, parallax, grain jitter, counters.
- `types.ts`: discriminated union of twelve scene configs plus `DocTimeline`, audio and caption types.
- `components/`: atmosphere, camera, headline, captions, lower third, archival plates, map, timeline graphic, evidence board, transitions, scene frame, audio bed.
- `scenes/`: one component per scene kind with its own composition grammar.
- `Documentary.tsx`: timeline renderer; computes scene starts, mounts audio, handles transitions.
- `UntoldStoryDemo.tsx`: 12 scenes, deterministic demo word timings, no external media required.

## Verification
`npm run typecheck`, Remotion composition discovery, `npm run check -- UntoldStoryDemo`, wide contact sheet, transition-frame inspection, written report.
