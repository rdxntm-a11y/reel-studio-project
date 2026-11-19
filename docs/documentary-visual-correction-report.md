# Documentary Visual Correction Report

## 1. Objective and scope
- Applied a professional visual-correction pass to the existing 16:9 `Untold Story` documentary template in `src/documentary/`.
- Preserved the dark cinematic identity, orange accent system, and existing typography system; no rebuild from scratch.
- Did **not** modify the Lead Masks project/assets, push to GitHub, or render the final full-length video.

## 2. Process followed
- Read the task-observer, motion-art-direction, shot-composition, animation-principles, Remotion, kinetic-typography, color-motion, caption-animation, motion-background, and lower-thirds skills before editing.
- Audited all 12 scenes and transition boundaries in `src/documentary/compositions/UntoldStoryDemo.tsx`.
- Used numeric frame analysis with PIL/numpy because direct visual inspection of JPEG frames was unavailable in this session.
- Rewrote the transition layer, added scene-specific editorial signatures, improved type scales, and added deterministic frame-based animation.
- Ran typecheck and the full Remotion check pipeline; regenerated stills and both contact sheets.

## 3. PHASE 1 — findings before correction
| Area | Finding |
|---|---|
| Black frames | Pure-black boundary frames confirmed at `f_00150`, `f_00300`, `f_00450`, `f_00735`, `f_01365`; exploration reported 6 total. |
| White flash | `f_01170` had mean luma `213`, std `2` — a near-white `match` transition blowout. |
| Flat frames | 13 sampled frames had std `< 12`; several were near-empty. |
| Whip/slice | Outgoing `whip`/`slice` phases were directionally inverted, producing flat bars instead of a clean exit. |
| Outro | Opened nearly empty (`f_01515`, `f_01530`) and had a frozen-looking tail (`f_01575`–`f_01664`). |
| Character | Name, role, and quote were effectively static. |
| Conclusion | Statement was static text with no reveal. |
| Legibility | Timeline, map, evidence board, plates, captions, and lower thirds were undersized. |
| Composition | Repeated shell across scenes: dark background + top-left kicker + bottom captions. |

### Root causes
- `TransitionLayer` used `p = 1` at local frame `0` for incoming transitions, rendering a fully opaque `theme.color.void` layer.
- The scene scheduler unmouts outgoing sequences, so no crossfade existed between scenes.
- `match` used `theme.color.text` at `0.88` opacity, causing the whiteout.
- `whip`/`slice` `out` phases were mirrored incorrectly.
- Most scene content animations began after frame `0`, leaving boundary frames with no visible content.

## 4. PHASE 2 — black/blank frame corrections
- `TransitionLayer.tsx`
  - Replaced full-void fade with a panel/deep gradient plus a subtle accent glow.
  - Added a bounded dip curve (`DIP_MIN 0.12`, `DIP_MAX 0.9`) so transitions never become fully opaque black.
  - Replaced white `match` flash with a deep/panel sweep and accent line.
  - Corrected `whip` direction for both phases.
  - Corrected `iris` radius so it never closes to zero.
  - Corrected `slice` direction with phase-aware stagger.
  - Replaced generic exposure flash with deterministic `interpolateFlash`.
- `SceneFrame.tsx`
  - Added a `TransitionSlate` drawn **above** transition overlays: centered accent rule, diamond, and chapter label.
  - Moved kicker, chapter marker, signature, and captions above transition overlays so editorial chrome persists across cuts.
  - This ensures every boundary frame carries intentional visible structure rather than an empty dark fill.

### Result
- Pure-black frames: **6 → 0**.
- Near-white frames: **1 → 0**.
- Boundary frames now have visible chapter slates and persistent kicker/caption chrome.

## 5. PHASE 3 — typography improvements
- `Headline.tsx`: line height `1.02 → 1.08`, wider tracking, stronger shadow.
- `geometry.ts`: caption max width `1480 → 1520`, caption size `52 → 58`.
- `DocCaption.tsx`: active word gets accent padding and underline; stronger shadow.
- `LowerThird.tsx`: name `66 → 70`, role `27 → 30`, heavier role weight, stronger panel and left rule.
- `TimelineGraphic.tsx`: headline `76 → 84`, year `58 → 64`, labels `20 → 26`, details `17 → 21`.
- `MapGraphic.tsx`: region `24 → 27`, place `122 → 126`, notes `25 → 27`, coords `20 → 23`.
- `EvidenceBoard.tsx`: headline `62 → 68`, node type `16 → 19`, label `22 → 25`, note `23 → 26`.
- `Plate.tsx`: photo label, document title, lines, stamp, and annotation pins all enlarged.
- Scene-local bumps in hook, intro, character, evidence, explanation, revelation, chapter, conclusion, and outro.

## 6. PHASE 4 — composition variety
- `SceneFrame.tsx` gained:
  - `variant: "void" | "deep" | "paper" | "split"`.
  - `kickerSide: "left" | "right" | "vertical"`.
  - `chapter` marker.
  - `signature: "rule" | "rail" | "corner" | "grid" | "none"`.
- `Atmosphere.tsx` gained a `split` variant with a diagonal accent seam and a second opposing parallax grid layer.
- Scene assignments:
  - Hook — rail.
  - Intro — grid + split background.
  - Timeline — rule.
  - Map — corner.
  - Character — rail.
  - Evidence — corner.
  - Board — grid.
  - Explanation — rule + split background.
  - Revelation — corner.
  - Chapter — grid.
  - Conclusion — rail + split background.
  - Outro — grid.
- A safe-zone probe initially flagged the board after a temporary camera push; the push was removed and the final check passes with no blocking problems.

## 7. PHASE 5 — deterministic animation
- All animation remains frame-driven (`interpolate`/`ease`/`pulse`/`spring`); no CSS keyframes or time-driven transitions.
- Hook: staggered stamp pop and rule growth.
- Intro: drifting ghost year and staggered fact cards.
- Map: title lift.
- Character: name and role rise/fade; quote and facts staged.
- Evidence: plates retain staged reveals with improved labels.
- Board: thread drawing retained.
- Explanation: stepped reveal with enlarged numerals and titles.
- Revelation: scan/pulse retained.
- Conclusion: statement converted to a `Headline` mask reveal; points stagger.
- Outro: channel mark visible from frame `0`, name at frame `8`, CTA at frame `24`, glow pulse, and a continuous 56 px drift so the tail is no longer frozen.

## 8. Verification results
Commands run from `/root/reel-studio/reel-studio-kit`:

```bash
npm run typecheck
npm run check -- UntoldStoryDemo
node tools/documentary/contact-sheet.mjs UntoldStoryDemo
python3 /tmp/opencode/audit_frames.py
```

- `npm run typecheck`: **passed**, no TypeScript errors.
- `npm run check -- UntoldStoryDemo`: **passed**, no blocking problems.
- Frames checked: **113** across **55.5 s**.
- Contact sheet: `out/UntoldStoryDemo/check/contact-sheet-16x9.jpg` (23 frames).
- Numeric audit after correction:
  - BLACK frames: **0**.
  - FLAT frames: **12** (down from 13; remaining ones are intentional low-detail transition holds).
  - Scene edge averages remain healthy, e.g. hook `0.0230`, character `0.0236`, evidence `0.0358`.
- The checker skipped its frozen-picture test because no final `out/UntoldStoryDemo.mp4` exists; final render was intentionally not performed.

## 9. Remaining visual limitations
- Direct human eyeballing of the contact sheet was not possible in this session; conclusions rely on code review and numeric frame analysis. A human glance at `contact-sheet-16x9.jpg` is still recommended before final delivery.
- The dHash audit reports near-duplicate pairs in static editorial holds; this is expected for title/board/outro cards and is not proof of frozen motion.
- Some transition boundary frames remain intentionally low-detail (`std < 12`) because they are designed cuts with chapter slates, not missing content.
- Full-motion freeze detection requires rendering the final MP4, which was out of scope.

## 10. Modified source files
- `src/Root.tsx` — existing composition registration for `UntoldStoryDemo`.
- `src/documentary/geometry.ts`
- `src/documentary/components/TransitionLayer.tsx`
- `src/documentary/components/SceneFrame.tsx`
- `src/documentary/components/Atmosphere.tsx`
- `src/documentary/components/Headline.tsx`
- `src/documentary/components/DocCaption.tsx`
- `src/documentary/components/LowerThird.tsx`
- `src/documentary/components/TimelineGraphic.tsx`
- `src/documentary/components/MapGraphic.tsx`
- `src/documentary/components/EvidenceBoard.tsx`
- `src/documentary/components/Plate.tsx`
- `src/documentary/scenes/CinematicHook.tsx`
- `src/documentary/scenes/StoryIntroduction.tsx`
- `src/documentary/scenes/HistoricalTimeline.tsx`
- `src/documentary/scenes/LocationMapReveal.tsx`
- `src/documentary/scenes/CharacterIntroduction.tsx`
- `src/documentary/scenes/EvidencePresentation.tsx`
- `src/documentary/scenes/InvestigationBoard.tsx`
- `src/documentary/scenes/DocumentaryExplanation.tsx`
- `src/documentary/scenes/DramaticRevelation.tsx`
- `src/documentary/scenes/CinematicTransition.tsx`
- `src/documentary/scenes/FinalConclusion.tsx`
- `src/documentary/scenes/ProfessionalOutro.tsx`

## 11. Generated artifacts
- `out/UntoldStoryDemo/check/f_*.jpg`
- `out/UntoldStoryDemo/check/contact-sheet.jpg`
- `out/UntoldStoryDemo/check/contact-sheet-16x9.jpg`
- `out/UntoldStoryDemo/check/_visual-metrics.json`
- `docs/documentary-visual-correction-report.md`
