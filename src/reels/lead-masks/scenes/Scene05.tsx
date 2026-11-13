import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PaperBackground } from "../style/components/PaperBackground";
import { Headline } from "../style/components/Headline";
import { Stamp } from "../style/components/Stamp";
import { Bottle, Notebook, Towels } from "../style/components/Props";
import { C, FONT, SPRING, clamp } from "../style/theme";
import type { SceneProps } from "../style/types";

export const Scene05: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stampAt = t.at(60) - from;
  const bottleAt = t.at(65) - from;
  const towelsAt = t.at(68) - from;
  const notebookAt = t.at(71) - from;
  const bottle = spring({ frame: frame - bottleAt, fps, config: SPRING.pop });
  const towels = spring({ frame: frame - towelsAt, fps, config: SPRING.pop });
  const notebook = spring({ frame: frame - notebookAt, fps, config: SPRING.pop });
  const pop = spring({ frame: frame - 4, fps, config: SPRING.pop });
  const drip = (frame % 54) / 54;

  const rise = (s: number) => `translateY(${interpolate(s, [0, 1], [70, 0], clamp)}px)`;

  return (
    <AbsoluteFill>
      <PaperBackground tone="dark" seed={41} />
      <Headline text="THE SCENE" tone="dark" accent={[1]} size={154} delay={2} width={580} align="left" />
      <Stamp text="NO WOUNDS" delay={stampAt} rotate={-5} size={78} style={{ left: 520, top: 238 }} />
      <div
        data-el="hero"
        data-kind="content"
        style={{
          position: "absolute",
          left: 60,
          top: 760,
          width: 900,
          height: 520,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 44,
          opacity: pop,
        }}
      >
        <div style={{ opacity: bottle, transform: rise(bottle) }}>
          <Bottle width={110} />
        </div>
        <div style={{ opacity: towels, transform: rise(towels), position: "relative" }}>
          <Towels width={250} />
          <div
            style={{
              position: "absolute",
              left: 96,
              top: 128,
              width: 8,
              height: 16,
              borderRadius: 6,
              background: C.leadLight,
              opacity: 0.75,
              transform: `translateY(${drip * 34}px)`,
            }}
          />
        </div>
        <div style={{ opacity: notebook, transform: rise(notebook) }}>
          <Notebook width={350}>
            <div
              style={{
                fontFamily: FONT.hand,
                fontSize: 38,
                lineHeight: 1,
                color: C.ink,
                transform: "rotate(-3deg)",
                paddingTop: 6,
              }}
            >
              16:30
              <div style={{ fontSize: 24, marginTop: 8 }}>no wounds?</div>
            </div>
          </Notebook>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 1280,
          width: 900,
          height: 8,
          background: C.paperDeep,
          opacity: 0.45,
          borderRadius: 4,
        }}
      />
    </AbsoluteFill>
  );
};
