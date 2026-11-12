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
import { CaseFile } from "../style/components/Props";
import { Stamp } from "../style/components/Stamp";
import { Chip, PopIn, Vignette } from "../style/components/ui";
import { C, SPRING, clamp } from "../style/theme";
import { wordFrame, type Word } from "../style/timing";

export const Scene09: React.FC<{ words: Word[]; from: number }> = ({
  words,
  from,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tYet = wordFrame(words, 122, fps) - from;

  const folderIn = spring({ frame, fps, config: SPRING.pop });
  const page = spring({
    frame,
    fps,
    delay: Math.max(0, tYet - 6),
    config: SPRING.snappy,
  });

  return (
    <AbsoluteFill>
      <Vignette opacity={0.35} />
      <Chip text="NO BREACH CONFIRMED" />
      <Headline text="NOT EVERY ANSWER" accent={[2]} />

      <div
        style={{
          position: "absolute",
          left: 310,
          top: 820,
          opacity: interpolate(folderIn, [0, 0.4], [0, 1], clamp),
          transform: `scale(${interpolate(folderIn, [0, 1], [0.7, 1])})`,
        }}
      >
        <CaseFile size={460} page={page} />
      </div>

      <div
        style={{
          position: "absolute",
          top: 900,
          left: 60,
          width: 900,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Stamp
          text="UNKNOWN"
          color={C.primary}
          delay={Math.max(0, tYet - 5)}
          rotate={-6}
        />
      </div>

      <div style={{ position: "absolute", left: 60, top: 900 }}>
        <PopIn delay={4} from={0.8} config={SPRING.snappy}>
          <Stick pose={POSES.shrug} width={220} mood="neutral" />
        </PopIn>
      </div>
    </AbsoluteFill>
  );
};
