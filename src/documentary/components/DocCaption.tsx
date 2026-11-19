import { useCurrentFrame } from "remotion";
import { DOC_CAPTION, DOC_FPS } from "../geometry";
import { clamp01, springAt } from "../motion";
import { alpha, type DocTheme } from "../theme";
import type { DocWord } from "../types";

type DocCaptionProps = {
  words: DocWord[];
  from: number;
  theme: DocTheme;
  duration: number;
  fps?: number;
  size?: number;
  groupSize?: number;
};

export const DocCaption: React.FC<DocCaptionProps> = ({
  words,
  from,
  theme,
  duration,
  fps = DOC_FPS,
  size = DOC_CAPTION.fontSize,
  groupSize = 4,
}) => {
  const local = useCurrentFrame();
  const absolute = from + local;
  const time = absolute / fps;
  if (!words.length) return null;

  let activeIndex = -1;
  for (let i = 0; i < words.length; i++) {
    if (time >= words[i].start && time < words[i].end) {
      activeIndex = i;
      break;
    }
  }
  if (activeIndex < 0) return null;

  const group = Math.floor(activeIndex / groupSize);
  const start = group * groupSize;
  const visible = words.slice(start, start + groupSize);
  const localStart = Math.round(words[start].start * fps) - from;

  return (
    <div
      data-doc-el="caption"
      data-doc-keep-transform="true"
      style={{
        position: "absolute",
        left: "50%",
        bottom: DOC_CAPTION.bottom,
        transform: "translateX(-50%)",
        width: DOC_CAPTION.maxWidth,
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "0 18px",
        padding: "14px 28px",
        borderRadius: 14,
        background: `linear-gradient(90deg, transparent, ${alpha(theme.color.void, 72)} 12%, ${alpha(theme.color.void, 72)} 88%, transparent)`,
      }}
    >
      {visible.map((word, index) => {
        const isActive = start + index === activeIndex;
        const enter = springAt(local, fps, localStart + index * 2);
        const opacity = clamp01(enter * (isActive ? 1 : 0.72));
        const scale = isActive ? 1.06 : 0.97 + clamp01(enter) * 0.03;
        return (
          <span
            key={`${word.word}-${start + index}`}
            style={{
              fontFamily: theme.font.body,
              fontSize: size,
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-1px",
              color: isActive ? theme.color.accent : theme.color.text,
              opacity,
              padding: isActive ? "0 4px 5px" : "0 4px",
              borderBottom: isActive ? `3px solid ${theme.color.accent}` : "3px solid transparent",
              transform: `translateY(${(1 - clamp01(enter)) * 14}px) scale(${scale.toFixed(3)})`,
              textShadow: `0 5px 22px ${alpha(theme.color.void, 96)}, 0 0 3px ${alpha(theme.color.void, 96)}, 0 0 1px ${alpha(theme.color.void, 96)}`,
            }}
          >
            {word.word}
          </span>
        );
      })}
    </div>
  );
};

export const buildSrt = (words: DocWord[]) => {
  const groups: DocWord[][] = [];
  for (let i = 0; i < words.length; i += 4) groups.push(words.slice(i, i + 4));
  return groups
    .map((group, index) => {
      const time = (seconds: number) => {
        const ms = Math.max(0, Math.round(seconds * 1000));
        const h = String(Math.floor(ms / 3600000)).padStart(2, "0");
        const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, "0");
        const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
        const r = String(ms % 1000).padStart(3, "0");
        return `${h}:${m}:${s},${r}`;
      };
      return `${index + 1}\n${time(group[0].start)} --> ${time(group[group.length - 1].end)}\n${group.map((w) => w.word).join(" ")}\n`;
    })
    .join("\n");
};
