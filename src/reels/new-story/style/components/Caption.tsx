import React, { useMemo } from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, FONT, SPRING, ZONE } from "../theme";
import { sf, type Word } from "../timing";

type Chunk = { words: Word[]; start: number; end: number };

export const makeChunks = (words: Word[], max = 4): Chunk[] => {
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

type Props = { words: Word[] };

export const Caption: React.FC<Props> = ({ words }) => {
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
    frame: frame - sf(chunk.start, fps),
    fps,
    config: SPRING.snappy,
  });
  const scale = interpolate(pop, [0, 1], [0.9, 1]);

  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        width: 900,
        top: ZONE.caption.y,
        height: ZONE.caption.h,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          maxWidth: 900,
          boxSizing: "border-box",
          padding: "14px 30px",
          borderRadius: 28,
          background: "rgba(6,10,18,0.78)",
          textAlign: "center",
          fontFamily: FONT.body,
          fontWeight: 800,
          fontSize: 66,
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
                color: active ? C.primary : spoken ? C.ink : C.muted,
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
