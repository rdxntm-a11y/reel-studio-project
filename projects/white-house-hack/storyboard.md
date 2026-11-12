# White House Hack — Storyboard

**Style:** Editorial Flat Geometric on Dark Navy (the style declared inside `paper-style-skill.md`; the filename says “paper”, the content wins).
**Status:** waiting for approval. No code or render until you say yes.

> Note: `paper-style-skill.md` has 8 sections and no Section 11. Its storyboard step is **Section 7 → Step 1 (SCENE PLAN)**, so this uses that exact field set. If you meant a different Section 11, paste it and I will re-cut this.

---

## 0. Source and truth guard

- **Voice:** existing `public/reels/white-house-hack/vo.wav` — 178 words, **64.66 s**; **65.66 s** with the guide’s +1 s tail.
- **Captions:** existing `public/reels/white-house-hack/captions.words.json` (word-level, 30 fps).
- **What the report actually says:** Layer3 Intel found **residential proxy exits** from six IPs on **AS2650** (Executive Office of the President). It did **not** report a confirmed breach.
- **Truth guard:** every scene stays on that side of the line. No stolen files, no hooded hacker, no “they got in” imagery. The one “inside” image is a proxy exit point, labelled as such.
- **On-screen data tags (not spoken):** 236 exits · 6 IPs · 28 services · 26 of 30 days · 5 pm–midnight ET · no breach confirmed.
- **Sources:** see the bottom of this file.

---

## 1. Style lock

| Item | Decision |
|---|---|
| Canvas | 1080 × 1920, 30 fps |
| Background | radial vignette (`panel` → `bg` → `bgDark`) + drifting 80 px grid + 7 % film grain |
| Character | same `Stick` in every scene: `muted` shirt, `ink` limbs, two dot eyes, small mouth |
| Props | flat SVG, 8–12 px round strokes, one soft drop shadow, no gradients on characters/props |
| Headline | Bebas Neue 400, uppercase, 150 px (120 px for long lines), letter-spacing 2, line-height 0.95 |
| Captions | Inter 800, 72 px, max 4 words per chunk, active word `primary` |
| Labels / data | Inter 700, 48–56 px |
| Accent | exactly **one** `primary` (amber) element per scene; `secondary` (cyan) supports; `danger`/`success` only in before/after or threat/safe pairs |
| Safe zone | x 60–960, y 220–1520; captions at y 1330; nothing below y 1520 |
| Motion | every entrance is a spring; start 3–6 frames before its keyword; hold ≥ 0.5 s; max 2 things moving at full speed |
| Forbidden | 3D, photos, emoji, CSS transitions, `Math.random()`, raw hex in scenes, more than 2 fonts on screen at once |

**Palette:** `bg #0B1220` · `bgDark #060A12` · `panel #141E33` · `line #2A3654` · `ink #F5F2EA` · `primary #FFC83D` · `secondary #3EC9FF` · `success #2ED9A0` · `danger #FF5C5C` · `muted #8E9BB8`.

**Springs:** `smooth` (calm), `snappy` (UI/captions), `pop` (default hero), `bouncy` (drops), `heavy` (big objects), `whip` (stamps/hits).

**Transitions:** only two styles in the whole reel — `fade()` and `slide({direction: 'from-right'})`, T = 10 frames, alternating.

---

## 2. Scene map

| # | Words | Time | Headline (amber word) | Hero + single accent | Hit (frame) | Transition |
|---|---|---|---|---|---|---|
| 1 | 0 “Someone” | 0.00–5.26 | SOMEONE IS **INSIDE** | White House facade + network grid; amber window | “hiding” · 22 | fade |
| 2 | 15 “Security” | 5.26–11.12 | THEY **SPOTTED** IT | Magnifier over the White House; amber handle | “spotted” · 205 | slide |
| 3 | 29 “Not” | 11.12–18.00 | NOT A MOVIE → SOMETHING **QUIETER** | Clapperboard + two red stamps; amber “QUIETER” | “quieter” · 488 | fade |
| 4 | 40 “Residential” | 18.00–23.42 | A NORMAL **HOME** | House + wifi + mask; amber address plate | “normal home” · 661 | slide |
| 5 | 57 “That’s” | 23.42–25.44 | THIS IS **CREEPY** | The same house going dark; amber porch light | “creepy” · 731 | fade |
| 6 | 62 “If” | 25.44–31.30 | IT **BLENDS** IN | Five identical figures + one amber packet | “blends in” · 902 | slide |
| 7 | 78 “It” | 31.30–36.56 | IT **SLIPS** PAST | Red server vs ordinary figure; amber “SLIPS” | “slip” · 950 | fade |
| 8 | 95 “So” | 36.56–44.38 | **WHO** WAS USING IT? | Mask as cover + amber door | “Who” · 1224 | slide |
| 9 | 117 “We” | 44.38–46.74 | NOT EVERY **ANSWER** | Case file + amber “UNKNOWN” stamp | “yet” · 1369 | fade |
| 10 | 123 “But” | 46.74–54.70 | THEY **DON’T** KICK | Door + boot morphing into a key; amber key | “kick” · 1587 | slide |
| 11 | 146 “Sometimes” | 54.70–57.98 | THE **MASK** OF NORMAL | Open door + server-rack shadow; amber light | “mask” · 1700 | fade |
| 12 | 156 “If” | 57.98–65.66 | **FOLLOW** FOR MORE | White House lamp clicks off + phone CTA; amber stamp | “follow” · 1828 | none |

---

## 3. Scene blocks

### SCENE 1 — THE HIDDEN
- **Start:** word 0 “Someone” · 0.00 s · frame 0. **End:** 5.26 s.
- **LINE:** “Someone was hiding inside the White House network… and it didn’t look like a hack.”
- **OPTIONS:** (a) a hooded hacker at a keyboard inside the building. (b) a stick figure hiding behind a giant White House door. (c) a calm stick figure standing inside the White House window grid, holding a plain “HOME” tag — no hoodie, no alarm.
- **CHOSEN:** (c). The absence of hacker tropes is the hook; readable in under one second.
- **VISUAL:** Hero = flat White House facade (wide `panel` body, six columns, flag) with a `secondary` network grid in the windows. `Stick` (muted shirt, ink limbs, idle pose) stands inside the centre window. **Accent = amber outline around that one window.** Headline “SOMEONE IS INSIDE” (**INSIDE** amber). Chip “CASE FILE 01 / WHITE HOUSE”. Small tag “PROXY EXIT, NOT A BREACH” in `muted` Inter 48 px under the facade.
- **TWIST:** the flag flickers once like a text cursor; the figure blinks in sync with a grid pulse.
- **HIT:** “hiding” (word 2) · frame 22 · `power-up-tick.mp3`.
- **ANIMATION:** White House `SPRING.heavy`; grid `DrawPath`; figure `SPRING.pop` starting frame 18; flag flicker `interpolate`; `Camera` 1.0 → 1.04. Transition: **fade**.

### SCENE 2 — THE SPOT
- **Start:** word 15 “Security” · 5.26 s · frame 158. **End:** 11.12 s.
- **LINE:** “Security researchers say they spotted residential proxy traffic coming from the White House network.”
- **OPTIONS:** (a) a researcher at a monitor full of logs. (b) a giant magnifier sweeps the White House and locks on a tiny house icon. (c) a radar sweep where one blip is shaped like a house key.
- **CHOSEN:** (b). The guide’s `Magnifier` prop; “a house inside the house” is the first clue and lands instantly.
- **VISUAL:** White House facade moves left, smaller. Hero = `Magnifier` (`secondary` lens, amber handle) sweeping right-to-left and locking on a tiny `House` icon in the centre window. **Accent = amber handle.** Headline “THEY SPOTTED IT” (**SPOTTED** amber). Chip “LAYER3 INTEL / 4 NOV 2026”. Data tag “236 EXITS · 6 IPs · 28 SERVICES” in `ink` Inter 700 48 px under the house.
- **TWIST:** the lens reveals the tiny house has its own wifi arcs — the traffic is residential.
- **HIT:** “spotted” (word 19) · frame 205 · `lens-click.mp3`.
- **ANIMATION:** Magnifier `SPRING.pop` at frame 201 + `Floaty` idle; `CountUp` 0 → 236 on the data tag; house icon `SPRING.snappy`. Transition: **slide from-right**.

### SCENE 3 — NOT A MOVIE
- **Start:** word 29 “Not” · 11.12 s · frame 334. **End:** 18.00 s.
- **LINE:** “Not a movie-style break-in. Not a blinking red alert. Something quieter.”
- **OPTIONS:** (a) a red alarm bell and a broken door. (b) a red siren over a closed door. (c) a movie clapperboard labelled “HEIST” gets stamped “CUT”, the set goes dark, and one amber cursor blinks in the empty space.
- **CHOSEN:** (c). It kills the Hollywood expectation in one stamp, then uses negative space for “quieter”.
- **VISUAL:** Hero = tilted clapperboard (`panel`/`ink`, Bebas “HEIST”). `Stick` at the right, arms crossed (`shrug` pose), unimpressed. **Accent = `danger` red stamps** “NOT A BREAK-IN” then “NOT AN ALERT” (before state). Headline “NOT A MOVIE” (**NOT** danger) swaps to “SOMETHING QUIETER” (**QUIETER** amber) on the keyword. Background vignette deepens.
- **TWIST:** the second stamp turns to grey dust; the clapperboard hinge clicks shut; the amber cursor blinks once.
- **HIT:** “break-in” (word 32) · frame 361 · `stamp-thud.mp3`; “quieter” (word 39) · frame 488 · `whoosh.mp3`.
- **ANIMATION:** two `Stamp` slams (`whip`); headline swap `SPRING.snappy`; vignette `interpolate`; figure `Floaty`. Transition: **fade**.

### SCENE 4 — A NORMAL HOME
- **Start:** word 40 “Residential” · 18.00 s · frame 540. **End:** 23.42 s.
- **LINE:** “Residential proxies are the kind that make internet traffic look like it’s coming from a normal home.”
- **OPTIONS:** (a) a server rack labelled “PROXY”. (b) a house with wifi and a mask. (c) a mail envelope wearing a tiny house as a hat, walking into a neighbourhood.
- **CHOSEN:** (b). The guide’s House + wifi + `Mask` equation is the clearest one-second read.
- **VISUAL:** Hero = flat suburban house (pentagon roof, rect body, door, three wifi arcs) in `panel`/`ink`, `secondary` wifi. `Stick` holds a `secondary` `Mask` in front of the door. **Accent = amber address plate** that flips from “1600” to “HOME”. Headline “A NORMAL HOME” (**HOME** amber). Chip “RESIDENTIAL PROXY”. Small tag “AS2650 · EOP NETWORK” in `ink` Inter 48 px.
- **TWIST:** the door peephole blinks once, like an eye.
- **HIT:** “normal home” (words 55–56) · frame 661 · `flip-click.mp3`.
- **ANIMATION:** House `SPRING.pop`; wifi arcs `DrawPath`; Mask `SPRING.bouncy`; address plate `scaleX` flip; peephole blink `interpolate`. Transition: **slide from-right**.

### SCENE 5 — THIS IS CREEPY
- **Start:** word 57 “That’s” · 23.42 s · frame 703. **End:** 25.44 s.
- **LINE:** “That’s what makes this creepy.”
- **OPTIONS:** (a) the word “CREEPY” in red. (b) a long shadow behind the figure. (c) the “normal home” stays on screen; its windows go dark one by one until only the amber porch light is left, and the figure’s smile fades.
- **CHOSEN:** (c). A quiet, physical reveal; no new object needed; the darkness does the work.
- **VISUAL:** Hero = the house from scene 4, isolated on dark navy. Windows go dark in a 3-frame stagger. `Stick` in front, small, looking up. **Accent = amber porch light.** Headline “THIS IS CREEPY” (**CREEPY** amber). Chip “THE CREEP”.
- **TWIST:** the porch light flickers twice, then holds; the figure’s mouth swaps from happy to neutral.
- **HIT:** “creepy” (word 61) · frame 731 · `click-hum.mp3`.
- **ANIMATION:** `Camera` 1.0 → 1.08; window fades `interpolate` staggered; porch light `SPRING.pop`; mouth via `mood`. Transition: **fade**.

### SCENE 6 — IT BLENDS IN
- **Start:** word 62 “If” · 25.44 s · frame 763. **End:** 31.30 s.
- **LINE:** “If the traffic looks like a regular person on a regular Wi-Fi connection, it blends in.”
- **OPTIONS:** (a) a stream of packets labelled “TRAFFIC”. (b) the figure in a crowd, same colour as everyone. (c) five identical stick figures in a row, each with a cyan wifi arc; one has a tiny amber packet in its pocket; a magnifier sweeps past and reads “NO MATCH”.
- **CHOSEN:** (c). The identical row makes “blends in” literal; the amber packet is the one thing the eye tracks.
- **VISUAL:** Hero = five identical `Stick` figures (muted shirt, idle pose) in a row at the hero zone; `secondary` wifi arcs above each. Centre figure has a small amber packet. `Magnifier` sweeps left-to-right. **Accent = amber packet.** Headline “IT BLENDS IN” (**BLENDS** amber). Chip “REGULAR WI-FI”.
- **TWIST:** the amber packet pulses once with the wifi arcs; the magnifier passes over it and the lens reads “NO MATCH” in `muted` Inter.
- **HIT:** “blends in” (words 76–77) · frame 902 · `sweep-beep.mp3`.
- **ANIMATION:** row entrance `SPRING.snappy` with 4-frame stagger; magnifier `interpolate`; packet pulse `sin`; “NO MATCH” `SPRING.snappy`. Transition: **slide from-right**.

### SCENE 7 — IT SLIPS PAST
- **Start:** word 78 “It” · 31.30 s · frame 939. **End:** 36.56 s.
- **LINE:** “It can slip past the kind of suspicion you’d have for a strange server in another country.”
- **OPTIONS:** (a) a server rack with a red “SUSPICIOUS” label. (b) a red warning triangle over a foreign server. (c) a shield with two dot eyes stares at a huge red server rack on the left while the ordinary figure walks past on the right under its nose.
- **CHOSEN:** (c). Same-frame contrast: the obvious threat gets the attention; the quiet one gets through.
- **VISUAL:** Left: red-tinted `Server rack` (3 stacked rects) + warning triangle, label “STRANGE SERVER / ANOTHER COUNTRY” in Inter 48 px. Right: the ordinary figure with a `secondary` “NORMAL” tag walks through a `secondary` door frame. Centre: `Shield` with dot eyes (the suspicion scanner) points at the server. **Accent = amber “SLIPS” in the headline.** `danger` red is the threat, not the accent. Headline “IT SLIPS PAST” (**SLIPS** amber). Chip “THE BLIND SPOT”.
- **TWIST:** the shield’s eyes follow the figure for one beat, then snap back to the server; the figure’s tag flips to “TRUSTED” for one frame, then back.
- **HIT:** “slip” (word 80) · frame 950 · `whoosh.mp3`.
- **ANIMATION:** server `SPRING.heavy`; triangle pulse `sin`; figure walks `interpolate` translateX; shield rotate to track; tag flip `scaleX`. Transition: **fade**.

### SCENE 8 — THE QUESTION
- **Start:** word 95 “So” · 36.56 s · frame 1097. **End:** 44.38 s.
- **LINE:** “So the question isn’t just, ‘How did this happen?’ It’s, ‘Who was using that cover, and what were they trying to reach?’”
- **OPTIONS:** (a) two question marks. (b) a detective board with strings. (c) the “normal home” is now a literal mask; behind it, a dark server room and one amber-lit door. The mask’s eye holes glow as the question changes from “HOW?” to “WHO?”.
- **CHOSEN:** (c). The mask-as-cover is the central metaphor; the door is the unknown destination.
- **VISUAL:** Hero = giant `Mask` (`secondary`/`panel`) centre; behind it a dark `Server rack` silhouette and an amber `Door`. `Stick` at the side with a `Magnifier`. **Accent = amber door light.** Headline “WHO WAS USING IT?” (**WHO** amber). Left speech bubble “HOW DID THIS HAPPEN?” in `muted`; right bubble “WHO? WHAT WERE THEY REACHING?” in `ink`. Chip “THE QUESTION”.
- **TWIST:** the mask’s eye holes glow amber one by one; the door opens a crack and spills amber light.
- **HIT:** “question” (word 97) · frame 1112 · muted pop; “Who” (word 105) · frame 1224 · `door-creak.mp3`.
- **ANIMATION:** Mask `SPRING.bouncy`; bubbles `SPRING.snappy`; door `skew`/`scaleX` + amber light `interpolate`. Transition: **slide from-right**.

### SCENE 9 — NOT EVERY ANSWER
- **Start:** word 117 “We” · 44.38 s · frame 1331. **End:** 46.74 s.
- **LINE:** “We don’t have every answer yet.”
- **OPTIONS:** (a) a loading spinner. (b) a puzzle with one missing piece. (c) a case-file folder with most pages blank; an amber “UNKNOWN” stamp slams on the cover.
- **CHOSEN:** (c). It fits the case-file motif and the CTA (“real cases”); the blank page is the honest visual.
- **VISUAL:** Hero = flat case-file folder (`panel`, ink outline, tab) centred. `Stick` beside it, `shrug` pose. **Accent = amber “UNKNOWN” stamp.** Headline “NOT EVERY ANSWER” (**ANSWER** amber). Chip “NO BREACH CONFIRMED” in `muted`. A small blank page slides out.
- **TWIST:** the folder opens; one blank page slides out and stops; the figure catches it.
- **HIT:** “yet” (word 122) · frame 1369 · `paper-slide.mp3`.
- **ANIMATION:** folder `SPRING.pop`; stamp `whip`; page `interpolate`; shrug `spring`. Transition: **fade**.

### SCENE 10 — THEY DON’T KICK
- **Start:** word 123 “But” · 46.74 s · frame 1402. **End:** 54.70 s.
- **LINE:** “But when a network that powerful shows signs of hidden traffic, it’s a reminder: the scariest threats don’t always kick the door down.”
- **OPTIONS:** (a) a big red “THREAT” sign. (b) a locked door with a shadow. (c) a giant boot swings at a door, stops mid-air, and morphs into a house key that slides into the lock.
- **CHOSEN:** (c). The boot-to-key morph is the visual punchline; one shape change on “kick”.
- **VISUAL:** Hero = tall `Door` (`panel`, amber knob) centre; giant `Boot` (`ink`/`panel`) swings from the left; `Stick` at right, watching. **Accent = amber key/knob.** Headline “THEY DON’T KICK” (**DON’T** amber). Chip “THE REMINDER”.
- **TWIST:** the boot’s laces become key teeth; the key turns once; the knob clicks but the door stays shut.
- **HIT:** “kick” (word 142) · frame 1587 · `heavy-whoosh.mp3` + `click`.
- **ANIMATION:** door `SPRING.heavy`; boot swing `interpolate` rotate; boot → key crossfade + `SPRING.pop`; key slide `interpolate`; knob shake 3 frames. Transition: **slide from-right**.

### SCENE 11 — THE MASK OF NORMAL
- **Start:** word 146 “Sometimes” · 54.70 s · frame 1641. **End:** 57.98 s.
- **LINE:** “Sometimes they walk in wearing the mask of ordinary life.”
- **OPTIONS:** (a) a person in a mask walking through a door. (b) a wolf in sheep’s clothing. (c) an ordinary stick figure walks through the open door, but its wall shadow is a server rack; it lowers a mask over its face and the shadow’s lights blink on.
- **CHOSEN:** (c). The shadow is the reveal; the figure itself stays ordinary, which is the point.
- **VISUAL:** Hero = the open `Door` from scene 10 with amber light; the ordinary figure walks through, holding a `secondary` `Mask`. Behind, the wall shadow is a `Server rack`. **Accent = amber door light.** Headline “THE MASK OF NORMAL” (**MASK** amber). Chip “THE TWIST”.
- **TWIST:** the mask drops over the face; the shadow server lights blink on one by one.
- **HIT:** “mask” (word 152) · frame 1700 · `soft-thud.mp3` + `hum`.
- **ANIMATION:** door open `interpolate`; figure walk `translateX`; mask `SPRING.bouncy`; shadow lights 3-frame stagger. Transition: **fade**.

### SCENE 12 — FOLLOW
- **Start:** word 156 “If” · 57.98 s · frame 1739. **End:** 65.66 s (tail included).
- **LINE:** “If stories like this keep you up at night, follow for more real cases that sound fake until you check the sources.”
- **OPTIONS:** (a) a “FOLLOW” button. (b) a night sky with a glowing phone. (c) a bedside lamp shaped like the White House clicks off; in the dark, a phone screen lights up with a case-file folder and an amber “FOLLOW” stamp.
- **CHOSEN:** (c). It pays off “keep you up at night” and the case-file motif, and ends on the CTA.
- **VISUAL:** Hero = bedside table + White House lamp; the lamp clicks off. `Stick` beside the table, tired (`neutral` mood). Phone rises with a case-file folder; amber “FOLLOW” stamp. **Accent = amber stamp.** Headline “FOLLOW FOR MORE” (**FOLLOW** amber). End card: “REAL CASES / SOUND FAKE” + “FOLLOW” stamp. Chip “CASE FILE 01”.
- **TWIST:** the lamp’s White House windows flicker like the scene 1 grid for one frame, then go dark; the folder opens.
- **HIT:** “night” (word 164) · frame 1819 · `click`; “follow” (word 165) · frame 1828 · `stamp-thud.mp3`.
- **ANIMATION:** lamp `SPRING.pop`; click off `opacity`; phone `SPRING.snappy`; stamp `whip`; 1.4 s hold. Transition: **none** (last scene).

---

## 4. Build path (after approval)

- Implement inside the kit at `src/reels/white-house-hack/`, so `npm run studio / render / check` keep working.
- Add the guide’s style system as a local module: `style/theme.ts`, `style/timing.ts`, `style/components/{Stick,Props,Headline,Caption,Stamp,Background}.tsx`, plus the extra props (`WhiteHouse`, `House`, `ServerRack`, `Door`, `Key`, `Boot`, `CaseFile`, `Phone`, `Lamp`, `Clapperboard`, `SpeechBubble`, `AddressPlate`, `Packet`).
- Keep the existing `AUDIO`, `vo.wav` and `captions.words.json`; export `durationInFrames` from the last word + 1 s so the kit’s registry works unchanged.
- Use the kit’s `npm run check -- white-house-hack` and look at the contact sheet before any final render.

---

## 5. Approval

1. **Approve this storyboard, or tell me what to change** (metaphor, accent, headline, scene order).
2. **Runtime:** this uses the existing **65.7 s** voice. The kit’s guideline is under 60 s. If you want the short cut, say “short cut” and I will rewrite the spoken script to ~50 s with the sourced numbers (236 / 6 / 28, Infatica/Rave, no breach) and re-storyboard before we voice it.

---

## Sources

- Layer3 Intel, “Residential Proxies Detected on White House Network”, 4 Nov 2026 — https://layer3intel.com/blog/residential-proxies-white-house-network
- Infosecurity Magazine, “Residential Proxy Traffic Traced to White House Network”, 5 Nov 2026 — https://www.infosecurity-magazine.com/news/white-house-residential-proxy-exits
- Help Net Security, “Residential proxy traffic caught leaving the White House network”, 6 Nov 2026 — https://www.helpnetsecurity.com/2026/11/06/white-house-residential-proxy-traffic
- CNET, “If the White House Network Can Be Hijacked by Proxies, Your Smart Home Is Already at Risk”, 6 Nov 2026 — https://www.cnet.com/tech/services-and-software/if-the-white-house-network-can-be-hijacked-by-proxies-your-smart-home-is-already-at-risk
- Security Affairs, “White House Network Appears in Global Residential Proxy Traffic”, 6 Nov 2026 — https://securityaffairs.com/202563/security/white-house-network-appears-in-global-residential-proxy-traffic.html
