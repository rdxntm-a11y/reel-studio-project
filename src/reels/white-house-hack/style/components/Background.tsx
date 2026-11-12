import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, H, W } from "../theme";

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const vignette =
    `radial-gradient(circle at 50% 38%, ${C.panel}, ` +
    `${C.bg} 55%, ${C.bgDark})`;
  const drift = (frame * 0.25) % 80;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: vignette }} />
      <svg
        width={W}
        height={H}
        style={{ position: "absolute", left: 0, top: 0 }}
      >
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
