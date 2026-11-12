import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Headline } from "../style/components/Headline";
import { POSES, Stick } from "../style/components/Stick";
import { Magnifier, Packet, Wifi } from "../style/components/Props";
import { Chip, PopIn, Vignette } from "../style/components/ui";
import { C, FONT, SPRING, clamp } from "../style/theme";
import { wordFrame, type Word } from "../style/timing";

const LEFT = (i: number) => 80 + i * 175;

export const Scene06: React.FC<{ words: Word[]; from: number }> = ({
  words,
  from,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tBlend = wordFrame(words, 76, fps) - from;

  const sweep = interpolate(
    frame,
    [tBlend - 40, tBlend],
    [0, 360],
    clamp,
  );
  const packetDim = interpolate(frame, [tBlend, tBlend + 20], [0, 0.5], clamp);
  const packetPulse = 1 + Math.sin(frame / 6) * 0.08;

  return (
    <AbsoluteFill>
      <Vignette opacity={0.15} />
      <Chip text="REGULAR WI-FI" />
      <Headline text="IT BLENDS IN" accent={[1]} />

      {[0, 1, 2, 3, 4].map((i) => {
        const s = spring({
          frame,
          fps,
          delay: i * 4,
          config: SPRING.snappy,
        });
        const wifi = spring({
          frame,
          fps,
          delay: 6 + i * 4,
          config: SPRING.smooth,
        });
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: LEFT(i) + 30, top: 820 }}>
              <Wifi size={100} progress={wifi} />
            </div>
            <div
              style={{
                position: "absolute",
                left: LEFT(i),
                top: 900,
                opacity: interpolate(s, [0, 0.4], [0, 1], clamp),
                transform: `scale(${interpolate(s, [0, 1], [0.7, 1])})`,
              }}
            >
              <Stick pose={POSES.idle} width={160} />
            </div>
          </React.Fragment>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: 485,
          top: 1000,
          opacity: 1 - packetDim,
          transform: `scale(${packetPulse})`,
        }}
      >
        <Packet size={50} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 60,
          top: 780,
          transform: `translateX(${sweep}px)`,
        }}
      >
        <Magnifier size={360} />
      </div>

      <div
        style={{
          position: "absolute",
          top: 1240,
          left: 60,
          width: 900,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <PopIn
          delay={Math.max(0, tBlend + 6)}
          from={0.6}
          config={SPRING.snappy}
        >
          <div
            style={{
              padding: "10px 28px",
              border: `3px solid ${C.line}`,
              borderRadius: 12,
              background: C.panel,
              color: C.muted,
              fontFamily: FONT.body,
              fontWeight: 800,
              fontSize: 48,
              letterSpacing: 2,
            }}
          >
            NO MATCH
          </div>
        </PopIn>
      </div>
    </AbsoluteFill>
  );
};
