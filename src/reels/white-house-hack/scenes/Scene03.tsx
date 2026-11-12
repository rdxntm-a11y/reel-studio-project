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
import { Clapperboard } from "../style/components/Props";
import { Stamp } from "../style/components/Stamp";
import { Chip, Floaty, Vignette } from "../style/components/ui";
import { C, SPRING, clamp } from "../style/theme";
import { wordFrame, type Word } from "../style/timing";

export const Scene03: React.FC<{ words: Word[]; from: number }> = ({
  words,
  from,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tBreak = wordFrame(words, 32, fps) - from;
  const tAlert = wordFrame(words, 37, fps) - from;
  const tQuiet = wordFrame(words, 39, fps) - from;

  const clapIn = spring({ frame, fps, config: SPRING.heavy });
  const open = interpolate(frame, [tBreak, tBreak + 6], [1, 0], clamp);
  const dust = interpolate(frame, [tAlert, tAlert + 20], [0, 1], clamp);
  const clapFade = interpolate(
    frame,
    [tQuiet - 4, tQuiet + 10],
    [1, 0.25],
    clamp,
  );
  const swap = spring({
    frame,
    fps,
    delay: Math.max(0, tQuiet - 6),
    config: SPRING.snappy,
  });
  const firstOut = interpolate(swap, [0, 1], [1, 0], clamp);
  const secondIn = interpolate(swap, [0, 1], [0, 1], clamp);
  const cursorOn = frame > tQuiet;
  const cursorBlink =
    cursorOn && Math.floor((frame - tQuiet) / 6) % 2 === 0 ? 1 : 0.15;

  return (
    <AbsoluteFill>
      <Vignette opacity={interpolate(frame, [0, tQuiet], [0.2, 0.65], clamp)} />
      <Chip text="THE QUIET PART" />

      <div style={{ position: "absolute", inset: 0, opacity: firstOut }}>
        <Headline
          text="NOT A MOVIE"
          accent={[0]}
          accentColor={C.danger}
          delay={0}
        />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: secondIn }}>
        <Headline
          text="SOMETHING QUIETER"
          accent={[1]}
          delay={Math.max(0, tQuiet)}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 280,
          top: 780,
          opacity: interpolate(clapIn, [0, 0.4], [0, 1], clamp) * clapFade,
          transform: `rotate(-6deg) scale(${interpolate(clapIn, [0, 1], [0.8, 1])})`,
        }}
      >
        <Clapperboard size={520} open={open} text="HEIST" />
      </div>

      <div
        style={{
          position: "absolute",
          left: 760,
          top: 900,
          opacity: 0.85 * clapFade,
        }}
      >
        <Floaty amount={4} speed={18}>
          <Stick pose={POSES.shrug} width={200} mood="neutral" />
        </Floaty>
      </div>

      <div
        style={{
          position: "absolute",
          top: 600,
          left: 60,
          width: 900,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Stamp
          text="NOT A BREAK-IN"
          delay={Math.max(0, tBreak - 5)}
          size={120}
          rotate={-7}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: 900,
          left: 60,
          width: 900,
          display: "flex",
          justifyContent: "center",
          opacity: 1 - 0.75 * dust,
          filter: `grayscale(${dust})`,
        }}
      >
        <Stamp
          text="NOT AN ALERT"
          delay={Math.max(0, tAlert - 5)}
          size={120}
          rotate={5}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 536,
          top: 1080,
          width: 10,
          height: 64,
          background: C.muted,
          opacity: cursorBlink,
        }}
      />
    </AbsoluteFill>
  );
};
