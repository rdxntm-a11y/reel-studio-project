import React, { useMemo } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Word } from "../../../../timing";
import { alpha, C, FONT, SPRING, ZONE } from "../theme";

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
  const scale = interpolate(pop, [0, 1], [0.9, 1]);

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
      <div
        style={{
          transform: `scale(${scale})`,
          maxWidth: ZONE.caption.w,
          boxSizing: "border-box",
          padding: "14px 30px",
          borderRadius: 18,
          border: `2px solid ${alpha(C.white, 16)}`,
          background: alpha(C.charcoal, 92),
          boxShadow: `0 8px 0 ${alpha(C.ink, 18)}`,
          textAlign: "center",
          textWrap: "pretty",
          fontFamily: FONT.body,
          fontWeight: 800,
          fontSize: "clamp(48px, 6.9cqi, 62px)",
          lineHeight: 1.18,
        }}
      >
        {chunk.words.map((w, i) => {
          const spoken = t >= w.start;
          const active = spoken && t < w.end + 0.05;
          return (
            <span
              key={i}
              style={{
                color: active ? C.red : spoken ? C.white : C.inkFaint,
                marginRight: i < chunk.words.length - 1 ? 16 : 0,
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
