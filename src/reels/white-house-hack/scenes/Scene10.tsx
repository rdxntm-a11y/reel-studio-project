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
import { Boot, Door, Key } from "../style/components/Props";
import { Chip, Vignette } from "../style/components/ui";
import { SPRING, clamp } from "../style/theme";
import { wordFrame, type Word } from "../style/timing";

export const Scene10: React.FC<{ words: Word[]; from: number }> = ({
  words,
  from,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tKick = wordFrame(words, 142, fps) - from;

  const doorIn = spring({ frame, fps, config: SPRING.heavy });
  const bootRot = interpolate(frame, [0, tKick - 4], [-30, 12], clamp);
  const bootOut = interpolate(frame, [tKick, tKick + 6], [1, 0], clamp);
  const keyIn = interpolate(frame, [tKick, tKick + 6], [0, 1], clamp);
  const keySpring = spring({
    frame,
    fps,
    delay: Math.max(0, tKick),
    config: SPRING.pop,
  });
  const keyX = interpolate(keySpring, [0, 1], [0, 314]);
  const keyTurn = interpolate(
    frame,
    [tKick + 12, tKick + 22],
    [0, 8],
    clamp,
  );
  const knob = spring({
    frame,
    fps,
    delay: Math.max(0, tKick + 8),
    config: SPRING.snappy,
  });
  const since = frame - tKick - 10;
  const shake =
    since >= 0
      ? Math.sin(since * 2.4) * 6 * Math.max(0, 1 - since / 4)
      : 0;

  return (
    <AbsoluteFill>
      <Vignette opacity={0.3} />
      <Chip text="THE REMINDER" />
      <Headline text="THEY DON'T KICK" accent={[1]} />

      <div
        style={{
          position: "absolute",
          left: 310,
          top: 760,
          opacity: interpolate(doorIn, [0, 0.4], [0, 1], clamp),
          transform: `translateX(${shake}px) scale(${interpolate(doorIn, [0, 1], [0.8, 1])})`,
        }}
      >
        <Door size={460} knob={knob} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 80,
          top: 820,
          opacity: bootOut,
          transform: `rotate(${bootRot}deg)`,
          transformOrigin: "100% 100%",
        }}
      >
        <Boot size={300} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 80,
          top: 863,
          opacity: keyIn,
          transform: `translateX(${keyX}px) rotate(${keyTurn}deg)`,
          transformOrigin: "243px 150px",
        }}
      >
        <Key size={300} />
      </div>

      <div style={{ position: "absolute", left: 740, top: 860 }}>
        <Stick pose={POSES.idle} width={200} mood="neutral" />
      </div>
    </AbsoluteFill>
  );
};
