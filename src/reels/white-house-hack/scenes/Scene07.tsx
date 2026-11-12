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
import {
  Door,
  Scanner,
  ServerRack,
  WarningTriangle,
} from "../style/components/Props";
import { Chip, Tag, Vignette } from "../style/components/ui";
import { C, SPRING, clamp, sin01 } from "../style/theme";
import { wordFrame, type Word } from "../style/timing";

export const Scene07: React.FC<{ words: Word[]; from: number }> = ({
  words,
  from,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tSlip = wordFrame(words, 80, fps) - from;

  const serverIn = spring({ frame, fps, config: SPRING.heavy });
  const walk = spring({ frame, fps, delay: 0, config: SPRING.smooth });
  const look =
    frame < tSlip
      ? interpolate(walk, [0, 1], [-1, 1], clamp)
      : frame < tSlip + 12
        ? 1
        : -1;
  const trusted = frame >= tSlip && frame < tSlip + 3;

  return (
    <AbsoluteFill>
      <Vignette opacity={0.2} />
      <Chip text="THE BLIND SPOT" />
      <Headline text="IT SLIPS PAST" accent={[1]} />

      <div
        style={{
          position: "absolute",
          left: 80,
          top: 780,
          opacity: interpolate(serverIn, [0, 0.4], [0, 1], clamp),
          transform: `scale(${interpolate(serverIn, [0, 1], [0.7, 1])})`,
        }}
      >
        <ServerRack
          size={360}
          tint={C.danger}
          lightColor={C.bg}
          lights={0.55}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 140,
          top: 720,
          opacity: 0.65 + 0.35 * sin01(frame, 0.25),
        }}
      >
        <WarningTriangle size={140} />
      </div>

      <Tag
        text={"STRANGE SERVER\nANOTHER COUNTRY"}
        top={1180}
        left={60}
        width={460}
        color={C.danger}
        size={44}
      />

      <div style={{ position: "absolute", left: 620, top: 760 }}>
        <Door size={320} open={0.2} knobColor={C.secondary} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 700,
          top: 860,
          transform: `translateX(${interpolate(walk, [0, 1], [-100, 0])}px)`,
        }}
      >
        <Stick pose={POSES.walk} width={220} />
      </div>

      <Tag
        text={trusted ? "TRUSTED" : "NORMAL"}
        top={1240}
        left={700}
        width={260}
        color={trusted ? C.success : C.secondary}
        size={48}
      />

      <div
        style={{
          position: "absolute",
          left: 420,
          top: 860,
          transform: `rotate(${look * 5}deg)`,
          transformOrigin: "50% 50%",
        }}
      >
        <Scanner size={260} look={look} scan={0.5 + Math.sin(frame / 8) * 0.3} />
      </div>
    </AbsoluteFill>
  );
};
