import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Headline } from "../style/components/Headline";
import { Cockroach, Syringe } from "../style/components/Props";
import { mixPose, POSES, Stick } from "../style/components/Stick";
import { Camera, Chip, Tag, Vignette } from "../style/components/ui";
import { C, SPRING, ZONE, clamp } from "../style/theme";
import { wordFrame, wordIndex, type Word } from "../style/timing";

export const Scene01: React.FC<{ words: Word[]; from: number }> = ({
  words,
  from,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tZombie = wordFrame(words, wordIndex(words, "zombie"), fps) - from;

  const arm = spring({ frame, fps, delay: 6, config: SPRING.snappy });
  const pose = mixPose(POSES.idle, POSES.point, arm);
  pose.rUp += Math.sin(frame / 4) * 4 * arm;

  const enter = spring({ frame, fps, config: SPRING.heavy });
  const rise = spring({
    frame,
    fps,
    delay: Math.max(0, tZombie - 4),
    config: SPRING.pop,
  });
  const glow = interpolate(rise, [0, 1], [0, 1], clamp);

  return (
    <AbsoluteFill>
      <Vignette opacity={0.3} />
      <Chip text="CASE 01 / ZOMBIE" />
      <Headline text="ZOMBIE COCKROACHES" accent={[0]} />
      <Camera from={1} to={1.05}>
        <div
          style={{
            position: "absolute",
            left: 110,
            top: 760,
            opacity: interpolate(enter, [0, 0.3], [0, 1], clamp),
            transform: `translateY(${interpolate(enter, [0, 1], [-60, 0])}px)`,
          }}
        >
          <Stick pose={pose} width={300} shirt={C.secondary} mood="worried" />
        </div>
        <div
          style={{
            position: "absolute",
            left: 330,
            top: 840,
            opacity: interpolate(enter, [0, 0.3], [0, 1], clamp),
          }}
        >
          <Syringe size={210} />
        </div>
        {[0, 1, 2].map((i) => {
          const p = spring({
            frame,
            fps,
            delay: 10 + i * 4,
            config: SPRING.pop,
          });
          const lift = rise * (i === 1 ? 80 : 42);
          const wig = Math.sin((frame + i * 10) / 8) * (6 + glow * 4);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 560 + i * 130,
                top: ZONE.hero.cy - 110 - lift,
                opacity: interpolate(p, [0, 0.3], [0, 1], clamp),
                transform:
                  `translateY(${Math.sin((frame + i * 7) / 14) * 6}px) ` +
                  `rotate(${wig}deg) scale(${interpolate(p, [0, 1], [0.6, 1])})`,
              }}
            >
              <Cockroach size={130} color={C.panel} glow={glow} />
            </div>
          );
        })}
      </Camera>
      <Tag
        text="ONE DOSE. NO KILL. JUST CONTROL."
        top={1250}
        color={C.muted}
        size={44}
      />
    </AbsoluteFill>
  );
};
