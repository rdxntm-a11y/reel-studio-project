import React, { useMemo } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Word } from "../../../../timing";
import { C, FONT, SPRING, ZONE } from "../theme";

type Chunk = { words: Word[]; start: number; end: number };

const makeChunks = (words: Word[], max = 4): Chunk[] => {
  const chunks: Chunk[] = [];
  let cur: Word[] = [];
  words.forEach((w, i) => {
    cur.push(w);
    const stop = /[.!?,;:]$/.test(w.word) || cur.length >= max;
    if (stop || i === words.length - 1) {
      chunks.push({
        words: cur,
        start: cur[0].start,
        end: cur[cur.length - 1].end,
      });
      cur = [];
    }
  });
  return chunks;
};

export const Caption: React.FC<{ words: Word[] }> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chunks = useMemo(() => makeChunks(words), [words]);
  const t = frame / fps;

  let idx = -1;
  chunks.forEach((c, i) => {
    if (c.start - 0.05 <= t) idx = i;
  });
  if (idx < 0 || t > chunks[idx].end + 0.5) return null;

  const chunk = chunks[idx];
  const pop = spring({
    frame: frame - Math.round(chunk.start * fps),
    fps,
    config: SPRING.pop,
  });
  const scale = interpolate(pop, [0, 1], [0.92, 1]);

  return (
    <div
      style={{
        position: "absolute",
        left: ZONE.caption.x,
        top: ZONE.caption.y,
        width: ZONE.caption.w,
        height: ZONE.caption.h,
        containerType: "inline-size",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* dark, semi-transparent pill so the words stay readable over any image */}
      <div
        style={{
          transform: `scale(${scale})`,
          maxWidth: ZONE.caption.w,
          boxSizing: "border-box",
          padding: "16px 34px",
          borderRadius: 22,
          background: "rgba(0, 0, 0, 0.7)",
          border: "1.5px solid rgba(255, 255, 255, 0.14)",
          boxShadow: "0 10px 26px rgba(0, 0, 0, 0.45)",
          textAlign: "center",
          textWrap: "pretty",
          fontFamily: FONT.body,
          fontWeight: 800,
          fontSize: "clamp(48px, 6.9cqi, 62px)",
          lineHeight: 1.2,
        }}
      >
        {chunk.words.map((w, i) => {
          const spoken = t >= w.start;
          const active = spoken && t < w.end + 0.05;
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                marginRight: i < chunk.words.length - 1 ? 16 : 0,
                color: active ? C.red : spoken ? C.white : "rgba(255, 255, 255, 0.5)",
                transform: active ? "scale(1.08)" : "scale(1)",
                transformOrigin: "center bottom",
                transition: "none",
              }}
            >
              {w.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
