import React from "react";
import { AbsoluteFill } from "remotion";
import { C, ZONE } from "../theme";
import { PaperBackground } from "./PaperBackground";

export const SceneLayout: React.FC<{ headline: React.ReactNode; children: React.ReactNode }> = ({ headline, children }) => (
  <AbsoluteFill
    style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      width: "100%",
      boxSizing: "border-box",
      padding: `${ZONE.headline.y}px 120px 380px ${ZONE.hero.x}px`,
      background: C.paper,
      overflow: "hidden",
    }}
  >
    <div style={{ position: "absolute", inset: 0 }}>
      <PaperBackground tone="paper" seed={19} subtle />
    </div>
    <div style={{ height: ZONE.headline.h, flexShrink: 0, position: "relative" }}>{headline}</div>
    <div style={{ height: ZONE.hero.h, flexShrink: 0, position: "relative", overflow: "hidden" }}>{children}</div>
    <div style={{ height: "20%", flexShrink: 0 }} />
  </AbsoluteFill>
);
