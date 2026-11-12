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
import { Door, Magnifier, Mask, ServerRack } from "../style/components/Props";
import {
  Chip,
  Floaty,
  PopIn,
  SpeechBubble,
  Vignette,
} from "../style/components/ui";
import { C, SPRING, clamp } from "../style/theme";
import { wordFrame, type Word } from "../style/timing";

export const Scene08: React.FC<{ words: Word[]; from: number }> = ({
  words,
  from,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tQuestion = wordFrame(words, 97, fps) - from;
  const tWho = wordFrame(words, 105, fps) - from;

  const maskIn = spring({ frame, fps, config: SPRING.bouncy });
  const glow = spring({
    frame,
    fps,
    delay: Math.max(0, tWho - 6),
    config: SPRING.pop,
  });
  const glow2 = spring({
    frame,
    fps,
    delay: Math.max(0, tWho - 2),
    config: SPRING.pop,
  });
  const open = interpolate(frame, [tWho - 10, tWho], [0.05, 0.3], clamp);
  const light = interpolate(frame, [tWho - 10, tWho], [0.2, 0.85], clamp);
  const lights = spring({
    frame,
    fps,
    delay: Math.max(0, tWho),
    config: SPRING.snappy,
  });

  return (
    <AbsoluteFill>
      <Vignette opacity={0.5} />
      <Chip text="THE QUESTION" />
      <Headline text="WHO WAS USING IT?" accent={[0]} size={120} />

      <div
        style={{
          position: "absolute",
          left: 340,
          top: 820,
          opacity: 0.45,
        }}
      >
        <ServerRack
          size={360}
          tint={C.panel}
          lightColor={C.secondary}
          lights={lights}
        />
      </div>

      <div style={{ position: "absolute", left: 660, top: 820 }}>
        <Door size={280} open={open} light={light} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 310,
          top: 780,
          opacity: interpolate(maskIn, [0, 0.25], [0, 1], clamp),
          transform: `translateY(${interpolate(maskIn, [0, 1], [-300, 0])}px)`,
        }}
      >
        <Mask size={460} glow={glow} glow2={glow2} />
      </div>

      <div style={{ position: "absolute", left: 160, top: 880 }}>
        <Stick pose={POSES.idle} width={220} mood="worried" />
      </div>

      <div style={{ position: "absolute", left: 250, top: 1000 }}>
        <Floaty amount={4} speed={17}>
          <Magnifier size={180} />
        </Floaty>
      </div>

      <div style={{ position: "absolute", left: 60, top: 1180 }}>
        <PopIn
          delay={Math.max(0, tQuestion)}
          from={0.7}
          config={SPRING.snappy}
        >
          <SpeechBubble
            text="HOW DID THIS HAPPEN?"
            width={340}
            color={C.muted}
            size={38}
            tail="left"
          />
        </PopIn>
      </div>

      <div style={{ position: "absolute", left: 600, top: 1180 }}>
        <PopIn
          delay={Math.max(0, tWho)}
          from={0.7}
          config={SPRING.snappy}
        >
          <SpeechBubble
            text="WHO? WHAT WERE THEY REACHING?"
            width={360}
            color={C.ink}
            size={36}
            tail="right"
          />
        </PopIn>
      </div>
    </AbsoluteFill>
  );
};
