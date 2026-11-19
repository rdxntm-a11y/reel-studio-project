# Untold Story — documentary template implementation report

Date: 2026-11-19
Composition: `UntoldStoryDemo`, 1920x1080, 30 fps, 55.5 s

## 1. Skill audit

Inspected all installed skill manifests (86 SKILL.md paths across the kit, user and agent skill trees). Eleven craft skills were read in depth and their rules applied:

| Skill | Rules applied |
|---|---|
| Motion Art Direction | Calm + Sharp motion language, one hero per frame, max two easing curves, one "wow" beat, pacing arc |
| Shot Composition | 5% safe area (96/54 px), 12-column grid, thirds focal points, depth layers at 0.1–1.5x, one camera move per beat, 1/3 travel rule |
| Animation Principles | Enter ease `(0.16,1,0.3,1)`, 15–18f reveals, 4f stagger, 60–120f hold, anticipation and follow-through |
| Remotion Video | Sequence-local frames, clamped `interpolate`, spring presets, `calculateMetadata`/composition registration, deterministic still-based verification |
| Kinetic Typography | Masked line reveals, word-level stagger, static type before motion, `aria-label` on split text |
| Motion Background | 8–30 s slow drift, low-contrast grid/wash, grain at 3–5%, never brighter than foreground |
| Color and Motion | OKLCH palette, tinted neutrals, no raw-sRGB interpolation, 3–5% `feTurbulence` grain, vignette and scrim |
| Caption Animation | Word-level timing from `captions.words.json`, 4-word phrase paging, active-word highlight, readable stroke/scrim |
| Beat Sync Editing | 30fps / 15f beat grid, phrase-based cuts, motivated transitions, longest hold on the reveal |
| Lower Thirds | Two lines, 15f enter, 4f/8f stagger, 12f exit derived from scene duration, 5% left anchor |
| After Effects | Applied conceptually only: exposure/grade order and delivery-tier thinking; no AE project was created |

Skills judged irrelevant to this deliverable (logo sting generators, explainer/stick-figure/survival generators, browser UI tooling, code-audit personas, web research, static design hubs) were deliberately excluded. No new packages were installed.

## 2. Architecture

All new code is under `src/documentary/`. The only existing file changed is `src/Root.tsx`, where one 16:9 composition is registered outside the 9:16 `REELS.map`. Lead Masks, its assets, `src/brand.ts`, `src/layout.ts` and every other reel are untouched.

```
src/documentary/
  theme.ts                  OKLCH theme tokens, 2 presets, font trio, channel identity
  geometry.ts               1920x1080, 5% safe area, grid, thirds, caption/lower-third bands
  motion.ts                 easing curves, reveals, camera moves, parallax, deterministic jitter
  utils.ts                  formatting and caption helpers
  types.ts                  12-scene discriminated union, timeline, audio, word types
  Documentary.tsx           timeline scheduler, scene sequences, audio bed, probe
  index.ts                  scene registry
  components/
    Atmosphere.tsx          gradient wash, grid, vignette, film grain, scrim
    SceneFrame.tsx          shared shell: safe area, plate, captions, transitions, debug
    Camera.tsx              push/pull/pan/drift wrappers
    Headline.tsx            rise / mask / split / tracking / stamp typography
    DocCaption.tsx          word-synced 4-word caption pages, SRT emitter
    LowerThird.tsx          name + role plate with asymmetric enter/exit
    Plate.tsx               photo/document archival plates, annotations, camera plates
    MapGraphic.tsx          graticule, abstract landmasses, animated route, marker ping
    TimelineGraphic.tsx     horizontal date rail with alternating event cards
    EvidenceBoard.tsx       pinned nodes, drawn threads, clue cards
    TransitionLayer.tsx     fade, whip, iris, slice, match overlays
    AudioBed.tsx            VO/music/SFX tracks, volume envelopes, silent SFX placeholders
    DocProbe.tsx            16:9 self-check probe emitting REEL_PROBE
  scenes/                   12 scene components, one per scene kind
  compositions/UntoldStoryDemo.tsx    demo timeline and deterministic sample word timings
public/documentary/demo/assets/      4 abstract SVG stand-in images
tools/documentary/contact-sheet.mjs  16:9 contact-sheet builder
```

## 3. Scene system

| # | Kind | Visual grammar | Default duration |
|---|---|---|---|
| 1 | `hook` | Full-bleed plate, slow push, masked headline, case tag, vertical archive strip | 5 s |
| 2 | `intro` | Ghost year, stacked question, ruled fact column | 5 s |
| 3 | `timeline` | Horizontal rail, alternating year cards, progress line | 5 s |
| 4 | `map` | Graticule map, animated route, pulsing marker, coordinate readout | 5 s |
| 5 | `character` | Portrait plate, large name, numbered facts, quote, lower third | 4.5 s |
| 6 | `evidence` | Document + photograph plates, annotation pins, exhibit header | 5 s |
| 7 | `board` | Node/thread board, pinned clue cards, handwritten note | 5 s |
| 8 | `explanation` | Three numbered columns, connector rules, staggered reveal | 4.5 s |
| 9 | `revelation` | Pull-back plate, expanding ring, centred stamp headline | 4 s |
| 10 | `transition` | Mode-specific whip/iris/slice/match chapter card | 2.5 s |
| 11 | `conclusion` | Statement + ruled point column over dim plate | 5 s |
| 12 | `outro` | Mark, channel name, handle, CTA, next-episode card | 5 s |

Each scene takes a typed config from `DocTimeline.scenes[]`; `durationInFrames`, `from`, `kicker`, `transitionIn` and `transitionOut` are configurable per scene. The demo supplies all twelve.

## 4. Reuse workflow

1. Copy `UNTOLD_STORY_DEMO` in `src/documentary/compositions/UntoldStoryDemo.tsx` and replace `title`, `words`, `audio` and `scenes`.
2. Replace `words` with `public/reels/<id>/captions.words.json` produced by `npm run sync -- <id>`.
3. Set real audio paths in `audio.voiceover`, `audio.music` and `audio.sfx[].src`; absent paths stay silent and SFX become visible-only data markers.
4. Point image fields at files under `public/` via paths relative to `public/` (e.g. `reels/<id>/assets/photo.jpg`).
5. Register the new composition in `src/Root.tsx` with `width={1920} height={1080}`.
6. Run `npm run typecheck`, `npm run check -- <id>`, then inspect the contact sheet before any full render.

## 5. Verification performed

- `npm run typecheck` — passed, zero errors.
- `npx remotion compositions` — `UntoldStoryDemo` listed as 1920x1080 / 30 fps / 1665 frames (55.5 s).
- `npm run check -- UntoldStoryDemo` — 113 stills rendered; all 12 scenes detected with correct durations; **no blocking findings**. One INFO notes that frozen-picture detection needs an MP4, which is intentionally absent this phase.
- `node tools/documentary/contact-sheet.mjs UntoldStoryDemo 24` — 23-tile 16:9 contact sheet written to `out/UntoldStoryDemo/check/contact-sheet-16x9.jpg`.
- Automated frame statistics confirmed non-blank output across all scenes; black/white samples occur only on fade/match transition boundary frames.
- Caption demo timings end at ~52.0 s, inside the 55.5 s composition.

Defects found and fixed during verification: caption transform mis-measurement in the probe, headline mask clipping descenders, intentional image-crop false positives, hook content not visible on frame 0, an over-short chapter scene and demo words extending past the timeline.

## 6. Limitations

- I cannot visually inspect images in this session; the contact sheet must be opened by a human before a final render.
- Demo word timings are deterministic estimates, not a transcription. Replace them with real `captions.words.json` before producing a real episode.
- Demo images are abstract SVG stand-ins. Real documentaries need generated or licensed plates; complex subjects must not be hand-drawn as SVG.
- Audio is absent by default; the SFX cues are metadata placeholders until real files are supplied.
- The shared `npm run check` tool still applies reel-specific 60/90 s length warnings and 4–8 s pacing guidance; these are informational for long-form documentary.
- No final MP4 was rendered, as requested.
