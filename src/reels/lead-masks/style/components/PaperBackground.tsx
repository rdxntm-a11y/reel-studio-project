import { AbsoluteFill } from "remotion";
import { alpha, C, H, W, type Tone } from "../theme";

const GRAIN = "lead-masks-grain";

export const PaperBackground: React.FC<{ tone: Tone; seed?: number; subtle?: boolean }> = ({ tone, seed = 7, subtle = false }) => {
  const dark = tone === "dark";
  const grainId = `${GRAIN}-${seed}`;
  return (
    <AbsoluteFill style={{ background: dark ? C.charcoal : C.paper, overflow: "hidden", isolation: "isolate" }}>
      <AbsoluteFill
        style={{
          background: dark
            ? `radial-gradient(ellipse at 50% 38% in oklab, ${alpha(C.white, 7)}, ${alpha(C.ink, 0)} 62%)`
            : `radial-gradient(ellipse at 50% 36% in oklab, ${alpha(C.white, subtle ? 24 : 50)}, ${alpha(C.ink, subtle ? 4 : 12)} 100%)`,
        }}
      />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: subtle ? (dark ? 0.06 : 0.08) : dark ? 0.16 : 0.22 }}>
        <filter id={grainId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves={3} seed={seed} />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0.42" />
          </feComponentTransfer>
        </filter>
        <rect width={W} height={H} filter={`url(#${grainId})`} />
      </svg>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: subtle ? 0.06 : dark ? 0.12 : 0.2 }}>
        <path d={`M 0 340 Q 310 320 560 350 T ${W} 330`} stroke={dark ? C.white : C.ink} strokeWidth={2} fill="none" />
        <path d={`M 0 1440 Q 260 1420 520 1450 T ${W} 1430`} stroke={dark ? C.white : C.ink} strokeWidth={2} fill="none" />
        <path d={`M 910 0 Q 930 420 905 860 T 940 ${H}`} stroke={dark ? C.white : C.ink} strokeWidth={1.5} fill="none" />
      </svg>
      <AbsoluteFill
        style={{
          boxShadow: dark
            ? `inset 0 0 260px ${alpha(C.ink, 72)}`
            : `inset 0 0 240px ${alpha(C.ink, subtle ? 8 : 20)}`,
        }}
      />
    </AbsoluteFill>
  );
};
