import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Headline } from "../style/components/Headline";
import { House, Magnifier, WhiteHouse, Wifi } from "../style/components/Props";
import {
  Chip,
  CountUp,
  Floaty,
  Vignette,
} from "../style/components/ui";
import { C, FONT, SPRING, clamp } from "../style/theme";
import { wordFrame, type Word } from "../style/timing";

export const Scene02: React.FC<{ words: Word[]; from: number }> = ({
  words,
  from,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tSpot = wordFrame(words, 19, fps) - from;

  const houseIn = spring({ frame, fps, config: SPRING.pop });
  const lens = spring({
    frame,
    fps,
    delay: Math.max(0, tSpot - 4),
    config: SPRING.pop,
  });
  const tiny = spring({
    frame,
    fps,
    delay: Math.max(0, tSpot),
    config: SPRING.snappy,
  });
  const slideX = interpolate(lens, [0, 1], [320, 0]);
  const lensScale = interpolate(lens, [0, 1], [0.5, 1]);

  const houseW = 560;
  const houseLeft = 80;
  const houseTop = 820;
  const lensLeft = 184;
  const lensTop = 868;

  return (
    <AbsoluteFill>
      <Vignette opacity={0.2} />
      <Chip text="LAYER3 INTEL / 4 NOV 2026" />
      <Headline text="THEY SPOTTED IT" accent={[1]} />

      <div
        style={{
          position: "absolute",
          left: houseLeft,
          top: houseTop,
          opacity: interpolate(houseIn, [0, 0.4], [0, 1], clamp),
          transform: `scale(${interpolate(houseIn, [0, 1], [0.85, 1])})`,
        }}
      >
        <WhiteHouse size={houseW} grid={0.75} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 300,
          top: 984,
          opacity: interpolate(tiny, [0, 0.4], [0, 1], clamp),
          transform: `scale(${interpolate(tiny, [0, 1], [0.4, 1])})`,
        }}
      >
        <House size={120} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 330,
          top: 950,
          opacity: interpolate(tiny, [0, 0.4], [0, 1], clamp),
        }}
      >
        <Wifi size={60} progress={tiny} />
      </div>

      <div
        style={{
          position: "absolute",
          left: lensLeft,
          top: lensTop,
          opacity: interpolate(lens, [0, 0.3], [0, 1], clamp),
          transform: `translateX(${slideX}px) scale(${lensScale})`,
        }}
      >
        <Floaty amount={5} speed={16}>
          <Magnifier size={420} />
        </Floaty>
      </div>

      <div
        style={{
          position: "absolute",
          top: 1240,
          left: 60,
          width: 900,
          display: "flex",
          alignItems: "baseline",
          justifyContent: "center",
          gap: 12,
          fontFamily: FONT.body,
          fontWeight: 700,
          fontSize: 48,
          color: C.ink,
        }}
      >
        <CountUp
          to={236}
          delay={Math.max(0, tSpot)}
          duration={24}
          size={64}
          color={C.ink}
        />
        <span>EXITS · 6 IPs · 28 SERVICES</span>
      </div>
    </AbsoluteFill>
  );
};
