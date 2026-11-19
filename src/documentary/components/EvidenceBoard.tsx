import { interpolate } from "remotion";
import { CLAMP, EASE, ease } from "../motion";
import { alpha, type DocTheme } from "../theme";
import type { BoardNode } from "../types";

type EvidenceBoardProps = {
  theme: DocTheme;
  frame: number;
  duration: number;
  headline: string;
  nodes: BoardNode[];
  links: [string, string][];
  note?: string;
  at?: number;
};

export const EvidenceBoard: React.FC<EvidenceBoardProps> = ({ theme, frame, duration, headline, nodes, links, note, at = 10 }) => {
  const width = 1728;
  const height = 810;
  const position = (node: BoardNode) => ({ x: (node.x / 100) * width, y: (node.y / 100) * height });
  const colors: Record<"accent" | "signal" | "danger" | "text", string> = {
    accent: theme.color.accent,
    signal: theme.color.signal,
    danger: theme.color.danger,
    text: theme.color.text,
  };

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div
        data-doc-el="evidence-board"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width,
          height,
          border: `1px solid ${alpha(theme.color.line, 80)}`,
          background: `repeating-linear-gradient(0deg, transparent, transparent 39px, ${alpha(theme.color.line, 20)} 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, ${alpha(theme.color.line, 20)} 40px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 30,
          top: 30,
          fontFamily: theme.font.display,
          fontSize: 68,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "-1px",
          color: theme.color.text,
          opacity: interpolate(frame, [at, at + 14], [0, 1], CLAMP),
        }}
      >
        {headline}
      </div>
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={width} height={height}>
        {links.map(([from, to], index) => {
          const a = nodes.find((node) => node.id === from);
          const b = nodes.find((node) => node.id === to);
          if (!a || !b) return null;
          const pa = position(a);
          const pb = position(b);
          const progress = interpolate(frame, [at + 12 + index * 4, at + 30 + index * 4], [0, 1], CLAMP);
          return (
            <g key={`${from}-${to}-${index}`}>
              <line
                x1={pa.x + 90}
                y1={pa.y + 42}
                x2={pb.x + 90}
                y2={pb.y + 42}
                stroke={alpha(theme.color.accent, 32)}
                strokeWidth={3}
                strokeDasharray={1}
                pathLength={1}
                strokeDashoffset={1 - progress}
              />
              <circle cx={pb.x + 90} cy={pb.y + 42} r={5 * progress} fill={theme.color.accent} />
            </g>
          );
        })}
      </svg>
      {nodes.map((node, index) => {
        const delay = at + index * 5;
        const pose = ease(frame, delay, 14, -28, 0, EASE.enter);
        const opacity = interpolate(frame, [delay, delay + 10], [0, 1], CLAMP);
        const kind = node.type ?? "clue";
        const color = kind === "person" ? colors.accent : kind === "place" ? colors.signal : kind === "event" ? colors.danger : colors.text;
        const p = position(node);
        return (
          <div
            key={node.id}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              width: 180,
              minHeight: 84,
              opacity,
              transform: `translateY(${pose.toFixed(1)}px) rotate(${((index % 3) - 1) * 1.2}deg)`,
              padding: "16px 14px 12px",
              background: index % 4 === 1 ? theme.color.paper : alpha(theme.color.panel, 96),
              color: index % 4 === 1 ? theme.color.ink : theme.color.text,
              boxShadow: `0 16px 34px ${alpha(theme.color.void, 55)}`,
              borderTop: `4px solid ${color}`,
            }}
          >
            <div style={{ position: "absolute", left: 80, top: -11, width: 18, height: 18, borderRadius: "50%", background: color, boxShadow: `0 3px 8px ${alpha(theme.color.void, 70)}` }} />
            <div style={{ fontFamily: theme.font.type, fontSize: 19, letterSpacing: 2, textTransform: "uppercase", color, opacity: 0.9 }}>
              {node.type ?? "clue"}
            </div>
            <div style={{ fontFamily: theme.font.body, fontSize: 25, fontWeight: 600, lineHeight: 1.2, marginTop: 6 }}>{node.label}</div>
          </div>
        );
      })}
      {note ? (
        <div
          style={{
            position: "absolute",
            right: 44,
            bottom: 34,
            fontFamily: theme.font.type,
            fontSize: 26,
            color: theme.color.danger,
            transform: "rotate(-3deg)",
            opacity: interpolate(frame, [at + 34, at + 48], [0, 1], CLAMP),
          }}
        >
          {note}
        </div>
      ) : null}
    </div>
  );
};
