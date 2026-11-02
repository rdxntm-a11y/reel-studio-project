# Motion Skills Analysis for "3 Simple Habits" Reel

## Repository Overview
The `motion-skills-repo` is a meta-repository listing 19 installable packs (56 total skills) from iart.ai. Skills are not bundled locally — each pack installs separately via `npx skills add iart-ai/<pack-name>`.

## Best 3 Skills for Professional & Dynamic Reels

| Rank | Pack | Skills | Why It Improves Our Reel |
|------|------|--------|--------------------------|
| 1 | **tiktok-video-skills** | 4 | Purpose-built for TikTok/Reels/Shorts: beat-synced cuts, safe-zone layouts, vertical pacing hooks, platform-native export presets — directly upgrades our 9:16 pipeline. |
| 2 | **motion-design-skills** | 9 | Pro motion-design craft: easing curves, stagger/reveal choreography, loopable motion, kinetic layout systems — adds the "polished studio feel" our current code-drawn components lack. |
| 3 | **kinetic-typography-skills** | 1 | Specialized text animation: per-word/per-character sync, elastic entrance/exit, emphasis pops — makes captions and titles feel alive instead of static overlays. |

## Honorable Mentions
- **explainer-video-skills** (5) — strong for educational structure, but overlaps with our existing script→scene workflow.
- **web-animation-skills** (9) — useful if we port to web preview, but our render target is Remotion/MP4.

## Next Steps
Install the top pack first:
```bash
npx skills add iart-ai/tiktok-video-skills
```
Then explore its 4 skills to see which map to our `SceneBlock`, `Karaoke`, and `ReelFrame` components.