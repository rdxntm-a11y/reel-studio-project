import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Headline } from "../style/components/Headline";
import { Stamp } from "../style/components/Stamp";
import { PropLabel } from "../style/components/ui";
import { C, SPRING, clamp } from "../style/theme";
import type { SceneProps } from "../style/types";

export const Scene05: React.FC<SceneProps> = ({ t, from }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const stampAt = t.at(60) - from;
  const bottleAt = t.at(65) - from;
  const towelsAt = t.at(68) - from;
  const notebookAt = t.at(71) - from;
  const bottle = spring({ frame: frame - bottleAt, fps, config: SPRING.pop });
  const towels = spring({ frame: frame - towelsAt, fps, config: SPRING.pop });
  const notebook = spring({ frame: frame - notebookAt, fps, config: SPRING.pop });
  const pop = spring({ frame: frame - 0, fps, config: SPRING.pop });
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.05], clamp);
  const rise = (s: number) => `translateY(${interpolate(s, [0, 1], [70, 0], clamp)}px)`;

  return (
    <AbsoluteFill>
      <Img src={staticFile("reels/lead-masks/assets/scene5.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }} />
      <Headline text="THE SCENE" tone="dark" accent={[1]} size={154} delay={0} width={580} align="left" />
      <Stamp text="NO WOUNDS" delay={stampAt} rotate={-5} size={78} style={{ left: 520, top: 238 }} />
      <div data-el="hero" data-kind="content" style={{ position: "absolute", left: 60, top: 760, width: 900, height: 520, display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 12, opacity: pop }}>
        <div style={{ opacity: bottle, transform: rise(bottle) }}>
          <PropLabel text="EMPTY BOTTLE" at={bottleAt} rotate={-2} size={20} />
        </div>
        <div style={{ opacity: towels, transform: rise(towels) }}>
          <PropLabel text="TWO WET TOWELS" at={towelsAt} rotate={1} size={20} background={C.paperDeep} />
        </div>
        <div style={{ opacity: notebook, transform: rise(notebook) }}>
          <PropLabel text="NOTEBOOK" at={notebookAt} rotate={-1} size={20} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 90, top: 1280, width: 900, height: 8, background: C.paperDeep, opacity: 0.45, borderRadius: 4 }} />
    </AbsoluteFill>
  );
};
