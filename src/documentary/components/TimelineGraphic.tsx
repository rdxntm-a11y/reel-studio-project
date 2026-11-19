import { interpolate } from "remotion";
import { CLAMP, ease, EASE } from "../motion";
import { alpha, type DocTheme } from "../theme";
import type { TimelineEvent } from "../types";

type TimelineGraphicProps = {
  theme: DocTheme;
  frame: number;
  duration: number;
  events: TimelineEvent[];
  headline?: string;
  at?: number;
};

export const TimelineGraphic: React.FC<TimelineGraphicProps> = ({ theme, frame, duration, events, headline, at = 8 }) => {
  const available = 1480;
  const gap = events.length > 1 ? available / (events.length - 1) : 0;
  const rail = interpolate(frame, [at, at + 50], [0, available], CLAMP);
  const count = Math.max(1, events.length);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {headline ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 40,
            fontFamily: theme.font.display,
            fontSize: 84,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "-1px",
            color: theme.color.text,
            opacity: interpolate(frame, [at, at + 14], [0, 1], CLAMP),
          }}
        >
          {headline}
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 120, top: 540, width: available, height: 2, background: alpha(theme.color.muted, 34) }} />
      <div style={{ position: "absolute", left: 120, top: 539, width: rail, height: 4, background: theme.color.accent }} />
      {events.map((event, index) => {
        const x = 120 + index * gap;
        const eventAt = event.at ?? at + 10 + index * Math.floor(46 / count);
        const active = frame >= eventAt;
        const above = index % 2 === 0;
        const rise = ease(frame, eventAt, 14, above ? 26 : -26, 0);
        const opacity = interpolate(frame, [eventAt, eventAt + 12], [0, 1], CLAMP);
        return (
          <div key={`${event.year}-${index}`} style={{ position: "absolute", left: x, top: 540, opacity }}>
            <div
              style={{
                position: "absolute",
                left: -10,
                top: -9,
                width: active ? 20 : 12,
                height: active ? 20 : 12,
                borderRadius: "50%",
                transform: "translateX(-50%)",
                background: active ? theme.color.accent : theme.color.panel,
                border: `2px solid ${active ? theme.color.accent : theme.color.muted}`,
                boxShadow: active ? `0 0 0 10px ${alpha(theme.color.accent, 14)}` : "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                  left: -120,
                  width: 240,
                top: above ? -150 : 34,
                transform: `translateY(${rise.toFixed(1)}px)`,
                textAlign: "center",
              }}
            >
                <div style={{ fontFamily: theme.font.display, fontSize: 64, fontWeight: 700, color: active ? theme.color.text : theme.color.faint }}>
                  {event.year}
                </div>
                <div style={{ fontFamily: theme.font.body, fontSize: 26, fontWeight: 600, lineHeight: 1.25, color: active ? theme.color.accent : theme.color.faint, marginTop: 8 }}>
                  {event.label}
                </div>
                {event.detail && active ? (
                  <div style={{ fontFamily: theme.font.body, fontSize: 21, lineHeight: 1.35, color: theme.color.muted, marginTop: 8 }}>
                  {event.detail}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 120,
          bottom: 26,
          fontFamily: theme.font.type,
          fontSize: 21,
          letterSpacing: 2,
          color: theme.color.faint,
          opacity: interpolate(frame, [at, at + 16], [0, 1], CLAMP),
        }}
      >
        CHRONOLOGY / SOURCES CROSS-CHECKED
      </div>
      <div style={{ position: "absolute", right: 20, bottom: 26, fontFamily: theme.font.type, fontSize: 21, color: theme.color.faint }}>
        {`${count} KEY DATES`}
      </div>
    </div>
  );
};
