import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../theme";

export const SceneLayout: React.FC<{ headline: React.ReactNode; children: React.ReactNode }> = ({ headline, children }) => (
  <AbsoluteFill
    style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      width: "100%",
      boxSizing: "border-box",
      padding: "220px 120px 380px 60px",
      background: C.paper,
      overflow: "hidden",
    }}
  >
    <div style={{ height: "20%", flexShrink: 0 }}>{headline}</div>
    <div style={{ height: "60%", flexShrink: 0, position: "relative", overflow: "hidden" }}>{children}</div>
    <div style={{ height: "20%", flexShrink: 0 }} />
  </AbsoluteFill>
);
