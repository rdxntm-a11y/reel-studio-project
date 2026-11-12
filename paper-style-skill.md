REMOTION REEL: STYLE AND PROMPT GUIDE
For an AI coder (OpenCode / Claude) building a 1080x1920 vertical reel in code.
No video generator, no stock footage. Only React, SVG, CSS and Remotion.

======================================================================
MEMBER KE LIYE (HINGLISH)
======================================================================

Ye poori file pehle apne AI coder ko do (copy-paste ya file attach).
Uske baad ek alag message mein ye do cheezein do:
  1. Apni script (text)
  2. Voice file (voice.mp3) aur words.json (har word ka start/end time)

Phir "MASTER PROMPT" (section 7) copy karke bhejo. Usme [SCRIPT],
[LANGUAGE], [VOICE FILE], [DURATION] bharna hai. Coder pehle scene plan
dega, tum plan dekh lo, phir wo Reel.tsx likhega.

words.json kaise banega: voice ko Whisper (word timestamps ke saath) se
chalao, ya coder se bolo "words.json bana do". Format section 2 mein hai.
Agar kuch galat dikhe to section 7 (TROUBLESHOOTING) dekho.

Neeche sab kuch AI coder ke liye English mein hai.

======================================================================
1. HOW TO USE THIS GUIDE (FOR THE AI CODER)
======================================================================

You are building ONE vertical reel as a Remotion project. Read this whole
file before writing code. It has these parts:

  2. SETUP AND PROJECT STRUCTURE
  3. THEME AND STYLE
  4. COLORS AND FONTS
  5. ANIMATION RULES
  6. CREATIVITY BLUEPRINT
  7. MASTER PROMPT, QA CHECKLIST, TROUBLESHOOTING
  8. APPENDIX: COMPLETE WORKING CODE (copy it, do not rewrite it)

Ground rules:

  - The appendix code was type-checked with strict TypeScript and rendered
    with Remotion 4.0.542. Copy the appendix files VERBATIM, then add new
    scenes and extra props in the same style.
  - Check the installed version first: run `npx remotion versions`. All
    Remotion packages must show the SAME 4.x version. If your version does
    not export `Html5Audio`, use `Audio` from 'remotion' instead (same props).
  - Never invent an API. If unsure, open node_modules/remotion/dist/cjs/*.d.ts.
  - Never use placeholder code, "TODO", "..." or "rest of the code here".

======================================================================
2. SETUP AND PROJECT STRUCTURE
======================================================================

INSTALL (inside an empty folder):

    npm init -y
    npm i remotion @remotion/cli @remotion/google-fonts \
      @remotion/transitions react react-dom
    npm i -D typescript @types/react @types/react-dom

    # Optional, only if you use <Audio> from the new media package:
    # npm i @remotion/media

All @remotion/* packages and `remotion` must be on the same exact version.

FOLDER LAYOUT

    src/index.ts            registerRoot(RemotionRoot)
    src/Root.tsx            <Composition id="Reel">, reads words.json
    src/Reel.tsx            scene list, transitions, captions, audio
    src/theme.ts            colors, fonts, layout zones, spring presets
    src/timing.ts           word/frame helpers (the ONLY seconds->frames code)
    src/scenes/*.tsx        one file per scene (Scene1.tsx, Scene2.tsx ...)
    src/components/
        Stick.tsx           stick figure + poses
        Props.tsx           SVG props (lock, shield, mask, magnifier, ...)
        Headline.tsx        spring word-pop headline
        Caption.tsx         word-by-word captions
        Stamp.tsx           slam-in stamp
        Background.tsx      vignette + grid + grain
    public/voice.mp3        the voiceover
    public/music.mp3        optional background music
    public/words.json       word timings (see below)
    public/sfx/*.mp3        optional sound effects

tsconfig.json needs: "strict": true, "jsx": "react-jsx",
"module": "esnext", "moduleResolution": "bundler", "target": "es2022",
"skipLibCheck": true, "noEmit": true.

WORDS.JSON FORMAT (seconds, in speaking order, one entry per spoken word):

    [
      {"word": "Everyone", "start": 0.30, "end": 0.75},
      {"word": "can",      "start": 0.75, "end": 0.95}
    ]

How to get it: transcribe voice.mp3 with Whisper word timestamps
(@remotion/install-whisper-cpp needs a 16 kHz WAV; Python whisper with
word_timestamps=True also works). If the transcript words do not match the
script words one-to-one, fix the text (keep the timings) so each script word
has one entry. If you cannot match them, ask the user. Do not guess timings.

TIMING MODEL (important, read once):

  - Video length = last word end + 1 second. Root.tsx computes this with
    calculateMetadata from words.json. Never hard-code the duration.
  - Every scene begins at the frame of its first word (SCENE_STARTS lists
    the word index that opens each scene). Scene 0 begins at frame 0.
  - TransitionSeries overlaps neighbours, so each scene's sequence is
    (scene frames + T) long, except the last. Net result: each scene's
    visible start equals its first word.
  - Captions and audio sit OUTSIDE the TransitionSeries, so they use the
    global frame. Scenes get a `from` prop (global start frame) and
    subtract it: localFrame = wordFrame - from.

RENDER

    npx remotion studio                      # live preview
    npx remotion render Reel out/reel.mp4 --codec=h264

If rendering is slow: remove the grain <rect> in Background.tsx, and add
`--concurrency=4`. Fonts load through loadFont(), which pauses the render
until the font file is ready. It needs internet access: if the render
times out on fonts, check the network.

======================================================================
3. THEME AND STYLE
======================================================================

ONE STYLE ONLY: "EDITORIAL FLAT GEOMETRIC ON DARK NAVY".

Look: deep navy background, one warm accent (amber) used for the single
most important thing in each scene, one cool secondary (cyan) for support.
Flat shapes, thin soft outlines, big bold condensed headlines, small
glowing details. Think explainer video from a modern tech magazine.

Ingredients (all pure code):

  - Background: radial vignette (panel color to dark navy) + a faint grid
    that drifts slowly + film grain from SVG feTurbulence at 7% opacity.
  - Characters: SVG stick figures built from a circle, a capsule torso and
    round-cap limbs. No faces beyond two dot eyes and a small mouth.
  - Props: flat SVG objects built from rect, circle, path and line only.
  - Shadows: soft, one per object, e.g. filter: drop-shadow(0 18px 30px
    rgba(0,0,0,0.45)). Never hard black shadows.
  - Outlines: 8 to 12 px, round caps and joins, in ink or the object color.
  - Depth: scale and blur only on the background layer (parallax).

DO

  - Keep ONE hero object per scene, centered, at least 380 px wide or tall.
  - Keep ONE accent colored element per scene.
  - Leave empty space. A scene with 3 elements beats one with 9.
  - Use the same character (same shirt) in every scene for recognition.
  - Animate every entrance. Nothing just appears.
  - Respect the safe zones below.

DON'T

  - No 3D, no wooden mannequin, no realistic hands, no photos, no emoji.
  - No gradients on characters or props (flat fills only).
  - No more than 2 fonts on screen at once, no more than 6 lines of text.
  - No text smaller than 44 px. No text in the bottom 400 px (the app UI
    covers it) or outside the left/right margins.
  - No more than 2 things moving at once at full speed.
  - No Math.random() (it changes every frame). Use random('seed').
  - No CSS transitions or CSS animations: they do not render in Remotion.
    Drive everything from useCurrentFrame().

CANVAS: 1080 x 1920, 30 fps.

SAFE ZONES AND LAYOUT GRID (px; also in theme.ts as SAFE and ZONE):

  - Safe area: left 60, right 960, top 220, bottom 1520.
  - Top chip / label:   y 200, height 60.
  - Headline block:     y 280, height 420 (max 3 lines of ~150 px).
  - Hero visual:        y 720, height 580, center x 540, center y 1010.
  - Caption block:      y 1330, height 190 (max 2 lines).
  - y 1520 to 1920 stays empty of text and key visuals.

STICK FIGURE SPEC (Stick.tsx)

  - viewBox 0 0 200 340. Head: circle r 30 at (100, 50).
  - Torso: capsule rect x 70, y 92, 60 x 118, rx 30, filled with `shirt`.
  - Shoulders at (78, 108) and (122, 108). Hips at y 200.
  - Arms: upper 55 + forearm 50. Legs: thigh 65 + shin 65. Round caps.
  - Joints are nested <g transform="rotate(angle x y)"> groups: the forearm
    group sits INSIDE the upper-arm group, so it follows automatically.
  - Angle convention: 0 = hanging straight down, positive = clockwise.
    "l" limbs are on the screen-left side.
  - Poses (all exist in POSES): idle, wave, point, idea, cheer, shrug.
    Blend with mixPose(a, b, springValue). Add new poses by spreading
    `base`, e.g. think: {...base, rUp: -120, rLow: -140}.
  - Mood: Stick takes mood = 'happy' | 'worried' | 'neutral' (mouth/eyes).

PROP LIBRARY (Props.tsx). Each prop is a 200 x 200 viewBox component with
flat fills and round strokes. Implemented in the appendix: Lock, Shield,
Mask, Magnifier. Build the rest the same way (same Svg wrapper, `stroke`
helper, colors from C):

  - Phone: rect 70,20 60x160 rx 16 ink outline; screen rect fill panel;
    small notch rect on top; one accent circle on the screen.
  - House + wifi: pentagon path roof (polygon) over a rect body; door rect
    in primary; three concentric arcs above the roof (path "M.. a.. ")
    in secondary, stroke only, round caps.
  - Server rack: 3 stacked rects rx 10 in panel with ink outline; each has
    two small circles (status lights: success, primary) and a short line.
  - Door: tall rect rx 8 in panel; knob circle in primary; a thin frame
    path around it. Open door = a skewed polygon beside a dark rect.
  - Graph: two axis lines (muted), a polyline in secondary with round
    joins, end dot in primary. Animate with path drawing.
  - Coin: circle r 70 primary; inner circle stroke bg, r 52; a "$" or
    symbol as <text> in bg color. Squash the x scale to fake a spin.
  - Speech bubble: rounded rect + small triangle path, fill ink, text bg.
  - Stamp: bordered rotated label (Stamp.tsx).

======================================================================
4. COLORS AND FONTS
======================================================================

PALETTE (put ONLY these in theme.ts; never type a raw hex in a scene)

  - bg        #0B1220   main background
  - bgDark    #060A12   vignette edge, text on amber
  - panel     #141E33   cards, object bodies, caption pill
  - line      #2A3654   grid lines, dividers (decorative only)
  - ink       #F5F2EA   main text, outlines (warm off-white)
  - primary   #FFC83D   amber: THE accent (1 per scene), highlights
  - secondary #3EC9FF   cyan: supporting objects, links, data lines
  - success   #2ED9A0   green: safe, correct, "after"
  - danger    #FF5C5C   red: threat, wrong, "before"
  - muted     #8E9BB8   unspoken caption words, small labels

USE RULES

  - Roughly 70% bg/panel, 20% ink, 8% primary, 2% everything else.
  - Primary is for the one thing the viewer must look at. If two things
    are amber, nothing is.
  - Danger and success appear only in before/after or threat/safe pairs.
  - Text on amber uses bg (#0B1220).

CONTRAST (WCAG ratios against bg #0B1220)

  - ink 16.7, primary 12.1, success 10.3, secondary 9.8, muted 6.7,
    danger 6.2. All pass AA for text. Primary text on bg: fine.
  - bg on primary: 12.1. Good for stamps and buttons.
  - line is only 1.6. Never use it for text or key shapes.

FONTS (Google Fonts, loaded in theme.ts with @remotion/google-fonts)

  - HEADLINE: Bebas Neue (400). Latin only. Uppercase. 150 px for 1 to 3
    lines, 120 px if the line is long. Letter-spacing 2 px. Line height 0.95.
    Alternative: Anton.
  - BODY: Inter (500, 700, 800). Labels 48 to 56 px, weight 700.
    Letter-spacing 0 to 1 px. Alternative: Poppins.
  - DEVANAGARI (Hindi in Hindi script): Noto Sans Devanagari (600, 700).
    Captions 64 to 72 px, line height 1.25. Alternatives: Mukta, Hind.
    Bebas has NO Devanagari glyphs: for Hindi headlines use Noto 700 at
    110 px, no uppercase, no letter-spacing.
  - MONO (numbers, code, IP addresses): JetBrains Mono (500), 44 to 60 px.
  - CAPTIONS: Inter 800 at 72 px (English / Hinglish in Latin letters) or
    Noto Sans Devanagari 700 at 68 px (Hindi script). Max 4 words per chunk.

LOADING (already in theme.ts, copy it)

    import {loadFont} from '@remotion/google-fonts/Inter';
    const inter = loadFont('normal', {weights: ['500','700','800'],
      subsets: ['latin']});
    // use inter.fontFamily in style={{fontFamily: ...}}

Load ONLY the weights and subsets you use (less download, faster render).
For Noto Sans Devanagari load subsets ['devanagari', 'latin'].

======================================================================
5. ANIMATION RULES
======================================================================

THE TWO TOOLS AND THE LOGIC

  frame = useCurrentFrame() is the clock. Every animated value must be a
  pure function of frame. Same frame in, same pixels out.

  spring({frame, fps, delay, config}) returns a number that goes 0 -> 1
  with physics (it can overshoot 1 and settle). Use it for entrances and
  anything that should feel alive: pop, slam, bounce, drop. `delay` is in
  frames and shifts the start; before the delay the value is 0.

  interpolate(x, [in0, in1], [out0, out1], {extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp'}) maps a number range to another range
  linearly (or with an `easing`). Use it to turn a spring (0..1) into
  pixels, degrees, opacity, or to map frames to values directly
  (fades, count-ups, drawing). ALWAYS pass both clamp options, otherwise
  values run off the end (opacity 3, scale -2).

  The standard recipe: p = spring(...); then interpolate(p, [0,1], [from,to]).
  The spring supplies the feel, interpolate supplies the units.

SPRING PRESETS (in theme.ts as SPRING; measured at 30 fps)

  - smooth  {damping: 200}                      23 frames, no overshoot
    use for: fades, slides, camera, anything calm
  - snappy  {damping: 20, stiffness: 200}       15 frames, 4% overshoot
    use for: UI, captions, cards, text blocks
  - pop     {damping: 12, stiffness: 180, mass: 0.8}   19 frames, 16%
    use for: headlines, icons, objects appearing (DEFAULT hero entrance)
  - bouncy  {damping: 8}                        36 frames, 25%
    use for: fun drops, coins, "ta-da" moments (use rarely)
  - heavy   {damping: 15, stiffness: 80, mass: 2}   44 frames, 10%
    use for: big objects: doors, rack, vault
  - whip    {damping: 14, stiffness: 260, mass: 0.5}   12 frames, 8%
    use for: stamps, hits, fast transitions

TIMING RULES (30 fps)

  - Scene length: 2 to 5 s (60 to 150 frames). Longer scenes need a second
    beat (a new object or twist at the half-way point).
  - Entrance: 8 to 15 frames visible motion. Never longer than 20.
  - Stagger: 3 to 5 frames between items in a group.
  - Transition: T = 10 frames, shorter than the shortest scene minus
    entrance time. Transitions cannot touch each other.
  - Objects enter BEFORE the word is spoken: start the spring 3 to 6
    frames before the keyword, so the hit lands on the word.
  - Hold: after an entrance, keep the element still (or idle sin motion)
    for at least 0.5 s so it can be read.
  - Exit: usually none. The scene transition does the exit.

SYNC TO THE VOICE

  words.json is the single source of timing. Use the helpers in timing.ts:

    const i = wordIndex(words, 'mask');            // find the word
    const tMask = wordFrame(words, i, fps) - from; // local frame
    const p = spring({frame, fps, delay: tMask - 4, config: SPRING.pop});

  Never write `frame >= 83` by hand. If the voice changes, only
  words.json changes. For repeated words use wordIndex(words, 'ip', 1).

AUDIO

  - Voice at volume 1. Music at 0.08 while someone speaks, 0.25 in pauses
    (ducking function in Reel.tsx; a plain number also works).
  - SFX: short (under 1 s) clips from public/sfx/ at volume 0.4 to 0.7,
    placed with the Sfx recipe on the "hit" frame. Max one sound per beat.
  - Music is optional: set HAS_MUSIC = true only if public/music.mp3 exists.

PERFORMANCE AND SAFETY

  - Use random('seed') from remotion, never Math.random() or Date.now().
  - Compute with frame; no useState/useEffect for animation.
  - Keep SVG filters (blur, feTurbulence) to the background layer only.
  - No more than ~60 animated DOM/SVG nodes per frame (confetti: 24 max).
  - Put constant objects (arrays, styles) outside the component.
  - Use <Sequence> or TransitionSeries to mount things only when needed.
  - Images/videos: staticFile('name.ext'); never import from outside src.

RECIPES (each one is type-checked; they live in src/recipes.tsx. Copy only
what a scene needs into components or scenes.)

All recipes share these imports and this helper at the top of the file:

    import React from 'react';
    import {
      Easing, Html5Audio, Sequence, interpolate, random, spring,
      staticFile, useCurrentFrame, useVideoConfig,
    } from 'remotion';
    import {C, FONT, SPRING} from './theme';   // adjust the path

    const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

--- 5.1 POP-IN (scale + opacity, spring)

    export const PopIn: React.FC<{delay?: number; children: React.ReactNode}> = ({
      delay = 0,
      children,
    }) => {
      const frame = useCurrentFrame();
      const {fps} = useVideoConfig();
      const s = spring({frame, fps, delay, config: SPRING.pop}); // 0 -> ~1.16 -> 1
      return (
        <div style={{transform: `scale(${s})`, opacity: Math.min(1, s * 3)}}>
          {children}
        </div>
      );
    };

--- 5.2 SLIDE + FADE (spring drives both)

    export const SlideFade: React.FC<{delay?: number; children: React.ReactNode}> = ({
      delay = 0,
      children,
    }) => {
      const frame = useCurrentFrame();
      const p = interpolate(frame, [delay, delay + 12], [0, 1], {
        ...clamp,
        easing: Easing.out(Easing.cubic),
      });
      return (
        <div style={{opacity: p, transform: `translateY(${(1 - p) * 60}px)`}}>
          {children}
        </div>
      );
    };

--- 5.3 TYPEWRITER (frame to characters)

    export const Typewriter: React.FC<{text: string; start?: number}> = ({
      text,
      start = 0,
    }) => {
      const frame = useCurrentFrame();
      const n = Math.floor(
        interpolate(frame, [start, start + text.length * 2], [0, text.length], clamp),
      ); // 1 character every 2 frames = 15 chars/sec at 30 fps
      const cursor = Math.floor(frame / 8) % 2 === 0 ? '|' : ' ';
      return (
        <span style={{fontFamily: FONT.mono, fontSize: 48, color: C.secondary}}>
          {text.slice(0, n)}
          {cursor}
        </span>
      );
    };

--- 5.4 STAGGERED LIST

    export const StaggerList: React.FC<{items: string[]}> = ({items}) => {
      const frame = useCurrentFrame();
      const {fps} = useVideoConfig();
      return (
        <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
          {items.map((label, i) => {
            const s = spring({frame, fps, delay: 10 + i * 6, config: SPRING.snappy});
            return (
              <div
                key={label}
                style={{
                  opacity: Math.min(1, s * 2),
                  color: C.ink,
                  fontFamily: FONT.body,
                  fontWeight: 700,
                  fontSize: 56,
                  transform: `translateX(${(1 - s) * -120}px)`,
                }}
              >
                {label}
              </div>
            );
          })}
        </div>
      );
    };

--- 5.5 COUNT-UP NUMBER

    export const CountUp: React.FC<{to: number; delay?: number}> = ({
      to,
      delay = 0,
    }) => {
      const frame = useCurrentFrame();
      const v = interpolate(frame, [delay, delay + 45], [0, to], {
        ...clamp,
        easing: Easing.out(Easing.cubic),
      });
      return (
        <span style={{fontFamily: FONT.headline, fontSize: 220, color: C.primary}}>
          {Math.round(v).toLocaleString('en-US')}
        </span>
      );
    };

--- 5.6 PATH DRAWING (strokeDashoffset, line charts, underline, arrows)

    export const DrawPath: React.FC<{d: string; delay?: number}> = ({d, delay = 0}) => {
      const frame = useCurrentFrame();
      const p = interpolate(frame, [delay, delay + 30], [0, 1], {
        ...clamp,
        easing: Easing.inOut(Easing.cubic),
      });
      // pathLength={1} normalises the length, so no manual length measuring.
      return (
        <path
          d={d}
          pathLength={1}
          fill="none"
          stroke={C.secondary}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={1}
          strokeDashoffset={1 - p}
        />
      );
    };

--- 5.7 CAMERA PUSH-IN AND PARALLAX
Wrap a scene's content in the camera. For parallax, give back layers a
smaller travel (e.g. 0.3 x) than front layers (1.0 x).

    export const Camera: React.FC<{children: React.ReactNode}> = ({children}) => {
      const frame = useCurrentFrame();
      const {durationInFrames} = useVideoConfig();
      const zoom = interpolate(frame, [0, durationInFrames], [1, 1.08], clamp);
      return (
        <div style={{position: 'absolute', inset: 0, transform: `scale(${zoom})`}}>
          {children}
        </div>
      );
    };
    // Parallax: far layers move less than near ones, e.g.
    // translateX(frame * 0.3) for the background, frame * 1.0 for props.

--- 5.8 IDLE LOOP (sin wave, keeps things alive after the entrance)

    export const Floaty: React.FC<{children: React.ReactNode}> = ({children}) => {
      const frame = useCurrentFrame();
      const y = Math.sin(frame / 15) * 8; // period = 2*PI*15 = ~94 frames (3 s)
      const r = Math.sin(frame / 20) * 2; // slight tilt, degrees
      return (
        <div style={{transform: `translateY(${y}px) rotate(${r}deg)`}}>{children}</div>
      );
    };

--- 5.9 CONFETTI WITH SEEDED RANDOM

    export const Confetti: React.FC = () => {
      const frame = useCurrentFrame();
      return (
        <>
          {Array.from({length: 24}, (_, i) => {
            const x = random(`x-${i}`) * 1080; // same value on every render thread
            const speed = 6 + random(`v-${i}`) * 10;
            const y = ((frame * speed + random(`y-${i}`) * 1920) % 2100) - 100;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  width: 14,
                  height: 14,
                  borderRadius: 4,
                  background: i % 2 ? C.primary : C.secondary,
                }}
              />
            );
          })}
        </>
      );
    };

--- 5.10 SOUND EFFECT ON A FRAME

    // `at` is in the frames of the parent timeline (global if placed in Reel,
    // local if placed inside a scene). Files live in public/sfx/.
    export const Sfx: React.FC<{file: string; at: number; volume?: number}> = ({
      file,
      at,
      volume = 0.6,
    }) => (
      <Sequence from={at} durationInFrames={45}>
        <Html5Audio src={staticFile(`sfx/${file}`)} volume={volume} />
      </Sequence>
    );

--- 5.11 SHAKE AND STAMP SLAM
Already implemented in Stamp.tsx (appendix). Logic: spring whip 0 -> 1
drives scale 3 -> 1 (it lands with a thump); shake = sin(since * 2.4) *
14 * max(0, 1 - since / 10) where `since` = frames after landing, so the
shake decays to zero in 10 frames. Fire a 0.5 s screen shake the same way
on the whole hero group, with amplitude 6 to 10 px.

--- 5.12 WORD-BY-WORD CAPTIONS
Implemented in Caption.tsx (appendix). It reads words.json, groups words
into chunks of up to 4 (breaking at , . ? ! and the Hindi danda), shows the
current chunk, paints spoken words ink, the active word primary, unspoken
words muted, and pops the pill in with a snappy spring.

--- 5.13 SCENE TRANSITIONS
Use @remotion/transitions (TransitionSeries). Tested: fade(), slide() with
direction 'from-right'. T = 10 frames with linearTiming. Max 2 different
transition styles per reel. A hard cut (no transition) is fine and often
best when the voice has no pause. Do not put two transitions in a row.

======================================================================
6. CREATIVITY BLUEPRINT: 5 RULES FOR SCRIPT LINE TO VISUAL
======================================================================

Apply all five to every script line. The example topics: (A) residential
proxy and privacy, (B) saving money, (C) learning a skill.

RULE 1. MAKE THE ABSTRACT A PHYSICAL OBJECT.
  Find the noun that cannot be seen (IP address, trust, deadline, habit),
  and draw the physical object that behaves the same way.
  - A: "Your IP address is visible" -> a house with a number on the door
       that a magnifier hovers over. The IP is the house address.
  - A: "A proxy hides you" -> the stick figure puts on a mask; the
       address plate on the house flips to a different number.
  - B: "Small spends add up" -> coins drop one by one into a glass jar
       that visibly fills; each coin lands on a spring bounce.
  - C: "Skills compound" -> a staircase drawn step by step, the figure
       climbing with the path-drawing recipe.

RULE 2. GENERATE THREE OPTIONS, PICK THE UNEXPECTED BUT CLEAR ONE.
  For each line, list: (a) the obvious literal, (b) a classic metaphor,
  (c) a surprising one. Choose (c) only if a first-time viewer gets it in
  under one second without the caption. Otherwise use (b). Never ship (a)
  unless the line is already visual. The plan MUST show all three.
  - A: "Websites can track you" -> (a) text "tracking", (b) a magnifier,
       (c) footprints that follow the figure across the screen. Pick (c).
  - B: "Inflation eats your savings" -> (a) falling number, (b) a coin
       shrinking, (c) a coin with bite marks growing. Pick (b): faster.

RULE 3. ONE SMALL VISUAL TWIST PER SCENE.
  Each scene gets exactly one surprising detail that rewards attention:
  the mask winks, a coin lands and spins, the lock clicks and sparkles,
  the door's peephole blinks. One only. It happens on the keyword frame.
  - A: The shield's lock icon clicks shut with a tiny shake on "private".
  - C: The figure's lightbulb flickers twice, then glows on "idea".

RULE 4. USE CONTRAST: BEFORE / AFTER, BIG / SMALL, RED / GREEN.
  Show the problem and the fix in the same frame position so the eye
  compares. Danger on the left or top, success on the right or after.
  - A: Red open door with a tracker eye (before) -> green door with a lock
       and a mask over the figure (after), same position, color swap.
  - B: A tall red bar for fees next to a short green bar after switching;
       the bars grow with the same spring, different heights.

RULE 5. VOICE, MOTION AND SOUND LAND ON ONE HIT.
  Pick the single most important word of the line. On that exact frame:
  the object pops in, the accent color appears, and one SFX plays.
  Everything else in that line is quiet. Start the spring 3 to 6 frames
  early so the peak meets the word.
  - A: On "mask", the mask drops in (bouncy), a soft "whoosh-thud" plays,
       the headline word MASK turns amber.
  - C: On "ten minutes a day", the number 10 counts up, a tick sound
       plays, the clock hand sweeps one full turn.

======================================================================
7. MASTER PROMPT, QA CHECKLIST, TROUBLESHOOTING
======================================================================

HOW TO SEND: paste everything between the lines START and END into the AI
coder (after the coder has read this guide). Replace the four [PLACEHOLDERS].

---------------------------- START MASTER PROMPT ---------------------------

You are an expert Remotion 4 and React engineer and motion designer.
Build a complete vertical reel as pure code, following the STYLE AND
PROMPT GUIDE you were given. Do not ask questions unless a file is missing.

INPUTS
  Script: [SCRIPT]
  Language: [LANGUAGE]
  Voice file: [VOICE FILE]  (to be placed at public/voice.mp3)
  Target duration: [DURATION]  (the real length is set by words.json plus
  1 second; if they differ by more than 2 seconds, say so)

STEP 0. ENVIRONMENT
  1. Run `npx remotion versions`. Report the version. All remotion
     packages must match. Use Html5Audio (or Audio on versions before it).
  2. Make sure public/voice.mp3 and public/words.json exist. If words.json
     is missing, create it by transcribing voice.mp3 with word timestamps,
     then check each script word has exactly one entry. If you cannot,
     STOP and tell the user what you need.

STEP 1. SCENE PLAN (output this FIRST, before any code)
  Split the script into 5 to 9 scenes of 2 to 5 seconds, one idea each.
  For every scene print a block with these fields:
    SCENE n: start word (index + text), start/end in seconds
    LINE: the script text of the scene
    OPTIONS: (a) literal, (b) classic metaphor, (c) surprising one
    CHOSEN: which one and why (clear in under 1 second)
    VISUAL: hero object, character pose, the one accent element, headline
            text (max 4 words, uppercase for Latin) and which word is amber
    TWIST: the one small visual surprise (Creativity Rule 3)
    HIT: keyword + frame it lands + SFX name or "none"
    ANIMATION: which recipes/spring presets, and the transition used
  Then continue directly to code (do not wait for approval) unless the user
  asked to review the plan first.

STEP 2. CODE
  1. Create every file in the project structure of the guide.
  2. Copy these appendix files verbatim: theme.ts, timing.ts, index.ts,
     Root.tsx, Stick.tsx, Headline.tsx, Caption.tsx, Stamp.tsx,
     Background.tsx. Copy Props.tsx and add any extra props you need.
  3. Write one scene file per planned scene, in the style of Scene1-3.
     Each takes {words, from}. All timing comes from wordIndex/wordFrame.
  4. Write the complete Reel.tsx: SCENE_STARTS (word indexes), SCENES,
     transitions (T = 10), Background, Caption, voice audio, optional music.
  5. Use only the palette, fonts, layout zones and spring presets from
     theme.ts. No raw hex colors, no raw font names in scenes.
  6. Captions follow the language: if [LANGUAGE] is Hindi in Devanagari,
     pass hindi to Caption and use the Devanagari font.
  7. Everything complete: no placeholder code, no "...", no missing
     imports, valid strict TypeScript, no `any`.
  8. Correct Remotion 4 APIs only: useCurrentFrame, useVideoConfig, spring,
     interpolate (with clamp), AbsoluteFill, Sequence, staticFile,
     random, calculateMetadata, TransitionSeries, Html5Audio.

STEP 3. SELF-CHECK (run these; fix everything, then report PASS or FIX)
  [ ] Every import exists in the package and is used; none missing.
  [ ] `npx tsc --noEmit` passes with zero errors.
  [ ] No undefined variables; every scene is imported in Reel.tsx.
  [ ] Frame math: each scene frames > T + 15; transitions not adjacent;
      scene starts equal first-word frames; durations from words.json.
  [ ] Fonts loaded through theme.ts; weights/subsets used are loaded.
  [ ] Every interpolate has both clamp options. Springs use SPRING presets.
  [ ] No Math.random, Date.now, CSS transitions, useState for animation.
  [ ] Audio included: voice, plus music only if the file exists.
  [ ] Composition is 1080x1920, 30 fps, duration = voice end + 1 s.
  [ ] No text below y 1520 or outside left/right 60 px; all text >= 44 px.
  [ ] One amber element per scene; one hero object per scene.
  [ ] Render 3 stills (first, middle, last scene) with
      `npx remotion still Reel out/check.png --frame=N` and look at them.
  [ ] Final: `npx remotion render Reel out/reel.mp4 --codec=h264`.

STEP 4. REPORT
  List the files created, the scene plan, the checks you actually ran with
  their results, and anything you could not verify. Do not claim a check
  passed unless you ran it.

----------------------------- END MASTER PROMPT ----------------------------

TROUBLESHOOTING: "IF X LOOKS BAD, TELL THE CODER Y"

  - Too crowded or busy -> "Remove everything except the hero object, the
    headline and the caption. One accent only."
  - Animation feels slow or floaty -> "Use SPRING.snappy or whip, entrance
    under 12 frames, and start 4 frames before the keyword."
  - Animation feels stiff or robotic -> "Use SPRING.pop for the hero, add
    the idle sin loop, stagger by 4 frames."
  - Captions out of sync -> "Recompute every caption time from words.json;
    check words.json matches the voice file; no hand-typed frame numbers."
  - Text cut off or hidden by the app UI -> "Keep text between y 220 and
    1520 and x 60 to 960. Reduce headline to 120 px or 2 lines."
  - Hindi text shows boxes -> "Use Noto Sans Devanagari with the
    'devanagari' subset; Bebas Neue has no Hindi."
  - Colors look random -> "Use only tokens from theme.ts. Primary only
    on the single most important element."
  - Render is slow -> "Remove the grain filter, use --concurrency=4,
    reduce confetti, avoid blur on moving elements."
  - Render fails on audio or font download -> "Check network access; if
    the sandbox blocks localhost, set NO_PROXY=localhost,127.0.0.1."
  - Metaphor not clear -> "Show me three options again for this scene and
    pick the clearest one. A first-time viewer must get it in one second."
  - Scene feels flat -> "Add exactly one twist (Rule 3) on the keyword."
  - Wrong version errors -> "Run npx remotion versions; make all packages
    the same version; do not mix 3.x and 4.x APIs."

======================================================================
8. APPENDIX: COMPLETE WORKING CODE
======================================================================

This is a complete, type-checked 3-scene example for the script:
"Everyone can see your IP address. A residential proxy wears a mask. Now
nobody knows who you are."   Scene starts: word indexes 0, 6, 12.
Add more scenes by copying a scene file, adding it to SCENES and adding the
first-word index to SCENE_STARTS in Reel.tsx.

Sample public/words.json for it (first entries, same format for all):

    [
      {"word": "Everyone", "start": 0.30, "end": 0.75},
      {"word": "can", "start": 0.75, "end": 0.95},
      {"word": "see", "start": 0.95, "end": 1.25}
    ]

--- FILE: src/index.ts

    import {registerRoot} from 'remotion';
    import {RemotionRoot} from './Root';

    registerRoot(RemotionRoot);

--- FILE: src/Root.tsx

    import React from 'react';
    import {CalculateMetadataFunction, Composition, staticFile} from 'remotion';
    import {Reel, ReelProps} from './Reel';
    import {FPS, H, W} from './theme';
    import {totalFrames, Word} from './timing';

    // Duration = last spoken word + 1 s, read from public/words.json.
    const calculateMetadata: CalculateMetadataFunction<ReelProps> = async ({
      abortSignal,
    }) => {
      const res = await fetch(staticFile('words.json'), {signal: abortSignal});
      const words: Word[] = await res.json();
      return {durationInFrames: totalFrames(words, FPS, 1), props: {words}};
    };

    export const RemotionRoot: React.FC = () => (
      <Composition
        id="Reel"
        component={Reel}
        width={W}
        height={H}
        fps={FPS}
        durationInFrames={FPS * 10} // placeholder; calculateMetadata overrides it
        defaultProps={{words: []} as ReelProps}
        calculateMetadata={calculateMetadata}
      />
    );

--- FILE: src/theme.ts

    import {loadFont as loadBebas} from '@remotion/google-fonts/BebasNeue';
    import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
    import {loadFont as loadDeva} from '@remotion/google-fonts/NotoSansDevanagari';
    import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';

    export const W = 1080;

    export const H = 1920;
    export const FPS = 30;

    export const C = {
      bg: '#0B1220',
      bgDark: '#060A12',
      panel: '#141E33',
      line: '#2A3654',
      ink: '#F5F2EA',
      primary: '#FFC83D',
      secondary: '#3EC9FF',
      success: '#2ED9A0',
      danger: '#FF5C5C',
      muted: '#8E9BB8',
    } as const;

    // loadFont() holds the render (delayRender) until the font file is ready.
    const bebas = loadBebas('normal', {weights: ['400'], subsets: ['latin']});
    const inter = loadInter('normal', {
      weights: ['500', '700', '800'],
      subsets: ['latin'],
    });
    const deva = loadDeva('normal', {
      weights: ['600', '700'],
      subsets: ['devanagari', 'latin'],
    });
    const mono = loadMono('normal', {weights: ['500'], subsets: ['latin']});

    export const FONT = {
      headline: `${bebas.fontFamily}, Impact, sans-serif`,
      body: `${inter.fontFamily}, system-ui, sans-serif`,
      hindi: `${deva.fontFamily}, ${inter.fontFamily}, sans-serif`,
      mono: `${mono.fontFamily}, monospace`,
    };

    // Layout zones in px on the 1080x1920 canvas. Keep text inside SAFE.
    export const SAFE = {left: 60, right: 960, top: 220, bottom: 1520};
    export const ZONE = {
      chip: {y: 200, h: 60},
      headline: {y: 280, h: 420},
      hero: {y: 720, h: 580, cx: 540, cy: 1010},
      caption: {y: 1330, h: 190},
    };

    // Spring presets. Measured at 30 fps: settle frames / overshoot.
    export const SPRING = {
      smooth: {damping: 200}, // 23f, no overshoot
      snappy: {damping: 20, stiffness: 200}, // 15f, ~4%
      pop: {damping: 12, stiffness: 180, mass: 0.8}, // 19f, ~16%
      bouncy: {damping: 8}, // 36f, ~25%
      heavy: {damping: 15, stiffness: 80, mass: 2}, // 44f, ~10%
      whip: {damping: 14, stiffness: 260, mass: 0.5}, // 12f, ~8%
    } as const;

--- FILE: src/timing.ts

    export type Word = {word: string; start: number; end: number};

    // seconds -> frames. The ONLY place where this conversion is written.
    export const sf = (sec: number, fps: number): number => Math.round(sec * fps);

    const clean = (s: string): string => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');

    // Index of the n-th (0-based) occurrence of `text` in the words list.
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

    // Start frame of a word, relative to the whole video.
    export const wordFrame = (words: Word[], i: number, fps: number): number =>
      sf(words[i].start, fps);

    // Scene boundaries from word indexes. Scene k starts at the first word of
    // scene k, ends where scene k+1 starts. Last scene ends at voice end + tail.
    export type SceneTiming = {from: number; frames: number};

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

--- FILE: src/Reel.tsx

    import React from 'react';
    import {AbsoluteFill, Html5Audio, staticFile, interpolate} from 'remotion';
    import {TransitionSeries, linearTiming} from '@remotion/transitions';
    import {fade} from '@remotion/transitions/fade';
    import {slide} from '@remotion/transitions/slide';
    import {useVideoConfig} from 'remotion';
    import {Background} from './components/Background';
    import {Caption} from './components/Caption';
    import {Scene1} from './scenes/Scene1';
    import {Scene2} from './scenes/Scene2';
    import {Scene3} from './scenes/Scene3';
    import {C} from './theme';
    import {sceneTimings, Word} from './timing';

    export type ReelProps = {words: Word[]};

    const T = 10; // transition length in frames (must be < half the shortest scene)
    const HAS_MUSIC = false; // set true after adding public/music.mp3

    // Index (in words.json) of the first word of each scene.
    const SCENE_STARTS = [0, 6, 12];
    const SCENES = [Scene1, Scene2, Scene3];

    // Music volume: low while someone speaks, higher in pauses, 0.4 s ramps.
    const makeDuck = (words: Word[], fps: number) => (f: number) => {
      const t = f / fps;
      let dist = Infinity; // seconds to the nearest spoken word
      for (const w of words) {
        const d = t < w.start ? w.start - t : t > w.end ? t - w.end : 0;
        dist = Math.min(dist, d);
      }
      return interpolate(dist, [0, 0.4], [0.08, 0.25], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
    };

    export const Reel: React.FC<ReelProps> = ({words}) => {
      const {fps} = useVideoConfig();
      if (words.length === 0) return <AbsoluteFill style={{backgroundColor: C.bg}} />;

      const timings = sceneTimings(words, SCENE_STARTS, fps);
      const items: React.ReactNode[] = [];
      timings.forEach((tm, i) => {
        const Scene = SCENES[i];
        const last = i === timings.length - 1;
        items.push(
          <TransitionSeries.Sequence
            key={`s${i}`}
            durationInFrames={tm.frames + (last ? 0 : T)}
          >
            <Scene words={words} from={tm.from} />
          </TransitionSeries.Sequence>,
        );
        if (!last) {
          items.push(
            <TransitionSeries.Transition
              key={`t${i}`}
              timing={linearTiming({durationInFrames: T})}
              presentation={i === 0 ? fade() : slide({direction: 'from-right'})}
            />,
          );
        }
      });

      return (
        <AbsoluteFill style={{backgroundColor: C.bg}}>
          <Background />
          <TransitionSeries>{items}</TransitionSeries>
          <Caption words={words} />
          <Html5Audio src={staticFile('voice.mp3')} />
          {HAS_MUSIC ? (
            <Html5Audio
              src={staticFile('music.mp3')}
              volume={makeDuck(words, fps)}
              loop
            />
          ) : null}
        </AbsoluteFill>
      );
    };

--- FILE: src/scenes/Scene1.tsx

    import React from 'react';
    import {
      AbsoluteFill,
      interpolate,
      spring,
      useCurrentFrame,
      useVideoConfig,
    } from 'remotion';
    import {Headline} from '../components/Headline';
    import {Stick, POSES, mixPose} from '../components/Stick';
    import {Magnifier} from '../components/Props';
    import {SPRING, ZONE} from '../theme';
    import {wordFrame, wordIndex, Word} from '../timing';

    // `from` = global start frame of this scene (so we can sync to words).
    export const Scene1: React.FC<{words: Word[]; from: number}> = ({words, from}) => {
      const frame = useCurrentFrame(); // local: 0 at scene start
      const {fps} = useVideoConfig();
      const tSee = wordFrame(words, wordIndex(words, 'see'), fps) - from;

      const wave = spring({frame, fps, delay: 6, config: SPRING.snappy});
      const pose = mixPose(POSES.idle, POSES.wave, wave);
      pose.rLow += Math.sin(frame / 3) * 18 * wave; // waving forearm

      const lens = spring({frame, fps, delay: tSee, config: SPRING.pop});
      const slideX = interpolate(lens, [0, 1], [300, 0]);
      const lensScale = interpolate(lens, [0, 1], [0.5, 1]);
      const bob = Math.sin(frame / 15) * 6; // idle motion

      return (
        <AbsoluteFill>
          <Headline text="Everyone sees your IP" accent={[3]} />
          <div
            style={{
              position: 'absolute',
              left: ZONE.hero.cx - 330,
              top: ZONE.hero.cy - 255 + bob,
            }}
          >
            <Stick pose={pose} width={300} />
          </div>
          <div
            style={{
              position: 'absolute',
              left: ZONE.hero.cx - 20,
              top: ZONE.hero.cy - 190,
              opacity: interpolate(lens, [0, 0.3], [0, 1], {extrapolateRight: 'clamp'}),
              transform: `translateX(${slideX}px) scale(${lensScale})`,
            }}
          >
            <Magnifier size={380} />
          </div>
        </AbsoluteFill>
      );
    };

--- FILE: src/scenes/Scene2.tsx

    import React from 'react';
    import {
      AbsoluteFill,
      interpolate,
      spring,
      useCurrentFrame,
      useVideoConfig,
    } from 'remotion';
    import {Headline} from '../components/Headline';
    import {Stick, POSES} from '../components/Stick';
    import {Mask} from '../components/Props';
    import {C, SPRING, ZONE} from '../theme';
    import {wordFrame, wordIndex, Word} from '../timing';

    export const Scene2: React.FC<{words: Word[]; from: number}> = ({words, from}) => {
      const frame = useCurrentFrame();
      const {fps} = useVideoConfig();
      const tMask = wordFrame(words, wordIndex(words, 'mask'), fps) - from;
      const drop = spring({frame, fps, delay: tMask, config: SPRING.bouncy});

      const left = ZONE.hero.cx - 150; // Stick is 300 px wide, 510 px high
      const top = ZONE.hero.cy - 255;
      return (
        <AbsoluteFill>
          <Headline text="A mask for your IP" accent={[1]} />
          <div style={{position: 'absolute', left, top}}>
            <Stick pose={POSES.shrug} width={300} shirt={C.secondary} mood="neutral" />
          </div>
          {/* Mask is 150 px: its center (75,75) lands on the head center (150,75) */}
          <div
            style={{
              position: 'absolute',
              left: left + 75,
              top,
              opacity: interpolate(drop, [0, 0.2], [0, 1], {extrapolateRight: 'clamp'}),
              transform: `translateY(${interpolate(drop, [0, 1], [-420, 0])}px)`,
            }}
          >
            <Mask size={150} />
          </div>
        </AbsoluteFill>
      );
    };

--- FILE: src/scenes/Scene3.tsx

    import React from 'react';
    import {
      AbsoluteFill,
      interpolate,
      spring,
      useCurrentFrame,
      useVideoConfig,
    } from 'remotion';
    import {Headline} from '../components/Headline';
    import {Stick, POSES} from '../components/Stick';
    import {Shield} from '../components/Props';
    import {Stamp} from '../components/Stamp';
    import {C, SPRING, ZONE} from '../theme';
    import {wordFrame, wordIndex, Word} from '../timing';

    export const Scene3: React.FC<{words: Word[]; from: number}> = ({words, from}) => {
      const frame = useCurrentFrame();
      const {fps} = useVideoConfig();
      const tYou = wordFrame(words, wordIndex(words, 'you'), fps) - from;
      const shield = spring({frame, fps, delay: 4, config: SPRING.pop});
      return (
        <AbsoluteFill>
          <Headline text="Nobody knows you" accent={[0]} />
          <div
            style={{
              position: 'absolute',
              left: ZONE.hero.cx - 420,
              top: ZONE.hero.cy - 280,
              transform: `scale(${interpolate(shield, [0, 1], [0, 1])})`,
            }}
          >
            <Shield size={420} />
          </div>
          <div
            style={{
              position: 'absolute',
              left: ZONE.hero.cx - 20,
              top: ZONE.hero.cy - 255,
            }}
          >
            <Stick pose={POSES.cheer} width={300} shirt={C.success} />
          </div>
          <div
            style={{
              position: 'absolute',
              left: 30,
              width: 600,
              top: ZONE.hero.cy - 70,
              textAlign: 'center',
            }}
          >
            <Stamp text="Private" color={C.primary} delay={Math.max(0, tYou - 5)} />
          </div>
        </AbsoluteFill>
      );
    };

--- FILE: src/components/Headline.tsx

    import React from 'react';
    import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
    import {C, FONT, SPRING, ZONE} from '../theme';

    type Props = {
      text: string;
      delay?: number; // frames, relative to the start of the current Sequence
      size?: number;
      accent?: number[]; // indexes of words drawn in the primary accent color
    };

    // Each word pops in with a spring, 4 frames after the previous one.
    export const Headline: React.FC<Props> = ({
      text,
      delay = 0,
      size = 150,
      accent = [],
    }) => {
      const frame = useCurrentFrame();
      const {fps} = useVideoConfig();
      const words = text.toUpperCase().split(' ');
      return (
        <div
          style={{
            position: 'absolute',
            left: 60,
            width: 900,
            top: ZONE.headline.y,
            height: ZONE.headline.h,
            display: 'flex',
            flexWrap: 'wrap',
            alignContent: 'center',
            justifyContent: 'center',
            gap: '0 26px',
          }}
        >
          {words.map((w, i) => {
            const s = spring({frame, fps, delay: delay + i * 4, config: SPRING.pop});
            const y = interpolate(s, [0, 1], [50, 0]);
            const scale = interpolate(s, [0, 1], [0.6, 1]);
            const opacity = interpolate(s, [0, 0.4], [0, 1], {
              extrapolateRight: 'clamp',
            });
            return (
              <span
                key={i}
                style={{
                  fontFamily: FONT.headline,
                  fontSize: size,
                  lineHeight: 0.98,
                  letterSpacing: 2,
                  display: 'inline-block',
                  opacity,
                  color: accent.includes(i) ? C.primary : C.ink,
                  transform: `translateY(${y}px) scale(${scale})`,
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
      );
    };

--- FILE: src/components/Caption.tsx

    import React, {useMemo} from 'react';
    import {spring, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
    import {C, FONT, SPRING, ZONE} from '../theme';
    import {sf, Word} from '../timing';

    type Chunk = {words: Word[]; start: number; end: number};

    // Groups words into short caption chunks (max 4 words, break on punctuation).
    export const makeChunks = (words: Word[], max = 4): Chunk[] => {
      const chunks: Chunk[] = [];
      let cur: Word[] = [];
      words.forEach((w, i) => {
        cur.push(w);
        const stop = /[.!?,;:啷$/.test(w.word) || cur.length >= max;
        if (stop || i === words.length - 1) {
          chunks.push({words: cur, start: cur[0].start, end: cur[cur.length - 1].end});
          cur = [];
        }
      });
      return chunks;
    };

    type Props = {words: Word[]; hindi?: boolean};

    // Render this OUTSIDE any <Sequence>/<TransitionSeries>, so that
    // useCurrentFrame() is the global frame and t = seconds in words.json.
    export const Caption: React.FC<Props> = ({words, hindi = false}) => {
      const frame = useCurrentFrame();
      const {fps} = useVideoConfig();
      const chunks = useMemo(() => makeChunks(words), [words]);
      const t = frame / fps;

      let idx = -1;
      chunks.forEach((c, i) => {
        if (c.start - 0.05 <= t) idx = i;
      });
      if (idx < 0 || t > chunks[idx].end + 0.5) return null;

      const chunk = chunks[idx];
      const pop = spring({
        frame: frame - sf(chunk.start, fps),
        fps,
        config: SPRING.snappy,
      });
      const scale = interpolate(pop, [0, 1], [0.9, 1]);

      return (
        <div
          style={{
            position: 'absolute',
            left: 60,
            width: 900,
            top: ZONE.caption.y,
            height: ZONE.caption.h,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              transform: `scale(${scale})`,
              padding: '18px 36px',
              borderRadius: 28,
              background: 'rgba(6,10,18,0.78)',
              textAlign: 'center',
              fontFamily: hindi ? FONT.hindi : FONT.body,
              fontWeight: 800,
              fontSize: 66,
              lineHeight: 1.2,
            }}
          >
            {chunk.words.map((w, i) => {
              const spoken = t >= w.start;
              const active = spoken && t < w.end + 0.05;
              return (
                <span
                  key={i}
                  style={{
                    color: active ? C.primary : spoken ? C.ink : C.muted,
                    marginRight: i < chunk.words.length - 1 ? 16 : 0,
                  }}
                >
                  {w.word}
                </span>
              );
            })}
          </div>
        </div>
      );
    };

--- FILE: src/components/Stick.tsx

    import React from 'react';
    import {C} from '../theme';

    // Angles in degrees. 0 = limb hangs straight down.
    // Positive = clockwise on screen (a down-pointing tip swings to screen-LEFT).
    // "l" = limb on the screen-left side, "r" = screen-right side.
    // Up/Thigh = first segment, Low/Shin = second segment (relative to first).
    export type Pose = {
      lUp: number;
      lLow: number;
      rUp: number;
      rLow: number;
      lThigh: number;
      lShin: number;
      rThigh: number;
      rShin: number;
      head: number;
      lean: number;
    };

    const base: Pose = {
      lUp: 8,
      lLow: 6,
      rUp: -8,
      rLow: -6,
      lThigh: 4,
      lShin: 0,
      rThigh: -4,
      rShin: 0,
      head: 0,
      lean: 0,
    };

    export const POSES = {
      idle: base,
      wave: {...base, rUp: -150, rLow: -10},
      point: {...base, rUp: -90, rLow: 0},
      idea: {...base, rUp: -175, rLow: 0},
      cheer: {...base, lUp: 155, lLow: 10, rUp: -155, rLow: -10},
      shrug: {...base, lUp: 35, lLow: 115, rUp: -35, rLow: -115, head: 6},
    } satisfies Record<string, Pose>;

    // Blend two poses. t = 0 -> a, t = 1 -> b (t may overshoot with a spring).
    export const mixPose = (a: Pose, b: Pose, t: number): Pose => {
      const out = {...a};
      (Object.keys(a) as (keyof Pose)[]).forEach((k) => {
        out[k] = a[k] + (b[k] - a[k]) * t;
      });
      return out;
    };

    type LimbProps = {
      x: number;
      y: number;
      angle: number;
      len: number;
      width?: number;
      children?: React.ReactNode;
    };

    // A segment that hangs down from (x, y) and rotates around (x, y).
    // Children are drawn in the rotated frame, so a forearm nested in an upper
    // arm automatically follows the elbow.
    const Limb: React.FC<LimbProps> = ({x, y, angle, len, width = 14, children}) => (
      <g transform={`rotate(${angle} ${x} ${y})`}>
        <line
          x1={x}
          y1={y}
          x2={x}
          y2={y + len}
          stroke={C.ink}
          strokeWidth={width}
          strokeLinecap="round"
        />
        {children}
      </g>
    );

    type StickProps = {
      pose: Pose;
      width?: number; // rendered width in px (height = width * 1.7)
      shirt?: string;
      mood?: 'happy' | 'worried' | 'neutral';
    };

    export const Stick: React.FC<StickProps> = ({
      pose,
      width = 300,
      shirt = C.primary,
      mood = 'happy',
    }) => {
      const mouth = {
        happy: 'M91 58 Q100 67 109 58',
        worried: 'M91 63 Q100 55 109 63',
        neutral: 'M92 60 L108 60',
      }[mood];
      return (
        <svg width={width} height={width * 1.7} viewBox="0 0 200 340">
          {/* legs first (behind the body) */}
          <Limb x={88} y={200} angle={pose.lThigh} len={65}>
            <Limb x={88} y={265} angle={pose.lShin} len={65} />
          </Limb>
          <Limb x={112} y={200} angle={pose.rThigh} len={65}>
            <Limb x={112} y={265} angle={pose.rShin} len={65} />
          </Limb>
          {/* upper body leans around the hips */}
          <g transform={`rotate(${pose.lean} 100 200)`}>
            <rect x={70} y={92} width={60} height={118} rx={30} fill={shirt} />
            <Limb x={78} y={108} angle={pose.lUp} len={55}>
              <Limb x={78} y={163} angle={pose.lLow} len={50} />
            </Limb>
            <Limb x={122} y={108} angle={pose.rUp} len={55}>
              <Limb x={122} y={163} angle={pose.rLow} len={50} />
            </Limb>
            <g transform={`rotate(${pose.head} 100 78)`}>
              <circle cx={100} cy={50} r={30} fill={C.ink} />
              <circle cx={90} cy={46} r={3.5} fill={C.bg} />
              <circle cx={110} cy={46} r={3.5} fill={C.bg} />
              <path
                d={mouth}
                stroke={C.bg}
                strokeWidth={4}
                strokeLinecap="round"
                fill="none"
              />
            </g>
          </g>
        </svg>
      );
    };

--- FILE: src/components/Props.tsx

    import React from 'react';
    import {C} from '../theme';

    // All props: 200x200 viewBox, flat fills + 8-12px round strokes. Colors from C.
    type P = {size?: number};
    const Svg: React.FC<P & {children: React.ReactNode}> = ({size = 300, children}) => (
      <svg width={size} height={size} viewBox="0 0 200 200">
        {children}
      </svg>
    );
    const stroke = {
      strokeWidth: 10,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    } as const;

    export const Lock: React.FC<P & {color?: string}> = ({size, color = C.primary}) => (
      <Svg size={size}>
        <path
          d="M72 92 V66 a28 28 0 0 1 56 0 V92"
          fill="none"
          stroke={C.ink}
          {...stroke}
          strokeWidth={14}
        />
        <rect x={50} y={90} width={100} height={88} rx={18} fill={color} />
        <circle cx={100} cy={126} r={9} fill={C.bg} />
        <rect x={95} y={130} width={10} height={24} rx={5} fill={C.bg} />
      </Svg>
    );

    export const Shield: React.FC<P & {color?: string}> = ({
      size,
      color = C.success,
    }) => (
      <Svg size={size}>
        <path
          d="M100 16 L170 42 V98 C170 144 135 174 100 188 C65 174 30 144 30 98 V42 Z"
          fill={color}
        />
        <path
          d="M68 100 L92 124 L134 76"
          fill="none"
          stroke={C.bg}
          {...stroke}
          strokeWidth={16}
        />
      </Svg>
    );

    export const Mask: React.FC<P> = ({size}) => (
      <Svg size={size}>
        <path
          d="M24 66 Q100 36 176 66 Q176 142 138 164 Q100 180 62 164 Q24 142 24 66 Z"
          fill={C.secondary}
        />
        <ellipse cx={66} cy={100} rx={20} ry={11} fill={C.bg} />
        <ellipse cx={134} cy={100} rx={20} ry={11} fill={C.bg} />
        <path d="M80 144 Q100 154 120 144" fill="none" stroke={C.bg} {...stroke} />
      </Svg>
    );

    export const Magnifier: React.FC<P> = ({size}) => (
      <Svg size={size}>
        <circle
          cx={84}
          cy={84}
          r={52}
          fill="rgba(62,201,255,0.14)"
          stroke={C.ink}
          {...stroke}
          strokeWidth={12}
        />
        <line
          x1={122}
          y1={122}
          x2={176}
          y2={176}
          stroke={C.primary}
          {...stroke}
          strokeWidth={20}
        />
      </Svg>
    );

--- FILE: src/components/Stamp.tsx

    import React from 'react';
    import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
    import {C, FONT} from '../theme';

    type Props = {text: string; color?: string; delay?: number; rotate?: number};

    // Slams in from 3x size, then shakes for ~10 frames. `delay` = impact frame - 5.
    export const Stamp: React.FC<Props> = ({
      text,
      color = C.danger,
      delay = 0,
      rotate = -8,
    }) => {
      const frame = useCurrentFrame();
      const {fps} = useVideoConfig();
      const s = spring({
        frame,
        fps,
        delay,
        config: {damping: 14, stiffness: 300, mass: 0.6},
      });
      const scale = interpolate(s, [0, 1], [3, 1]);
      const opacity = interpolate(frame - delay, [0, 3], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      const since = frame - delay - 5; // frames since impact
      const shake =
        since >= 0 ? Math.sin(since * 2.4) * 14 * Math.max(0, 1 - since / 10) : 0;
      return (
        <div
          style={{
            display: 'inline-block',
            opacity,
            backgroundColor: C.bg,
            color,
            fontFamily: FONT.headline,
            fontSize: 130,
            letterSpacing: 6,
            padding: '4px 36px',
            border: `10px solid ${color}`,
            borderRadius: 20,
            transform: `translateX(${shake}px) rotate(${rotate}deg) scale(${scale})`,
          }}
        >
          {text.toUpperCase()}
        </div>
      );
    };

--- FILE: src/components/Background.tsx

    import React from 'react';
    import {AbsoluteFill, useCurrentFrame} from 'remotion';
    import {C, H, W} from '../theme';

    // Static-feeling premium backdrop: vignette gradient + slow grid + film grain.
    // Remove the grain <rect> first if rendering is slow.
    export const Background: React.FC = () => {
      const frame = useCurrentFrame();
      const vignette =
        `radial-gradient(circle at 50% 38%, ${C.panel}, ` +
        `${C.bg} 55%, ${C.bgDark})`;
      const drift = (frame * 0.25) % 80;
      return (
        <AbsoluteFill>
          <AbsoluteFill
            style={{
              background: vignette,
            }}
          />
          <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
            <defs>
              <pattern
                id="grid"
                width={80}
                height={80}
                patternUnits="userSpaceOnUse"
                patternTransform={`translate(0 ${drift})`}
              >
                <path d="M80 0 H0 V80" fill="none" stroke={C.line} strokeWidth={1} />
              </pattern>
              <filter id="grain">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency={0.8}
                  numOctaves={2}
                  seed={3}
                />
                <feColorMatrix type="saturate" values="0" />
              </filter>
            </defs>
            <rect width={W} height={H} fill="url(#grid)" opacity={0.35} />
            <rect width={W} height={H} filter="url(#grain)" opacity={0.07} />
          </svg>
        </AbsoluteFill>
      );
    };

======================================================================
END OF GUIDE
======================================================================
