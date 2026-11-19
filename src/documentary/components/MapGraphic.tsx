import { interpolate } from "remotion";
import { CLAMP, pulse } from "../motion";
import { alpha, type DocTheme } from "../theme";
import type { Point } from "../types";

type MapGraphicProps = {
  theme: DocTheme;
  frame: number;
  duration: number;
  place: string;
  region?: string;
  marker: Point;
  route?: Point[];
  note?: string;
  zoom?: number;
  at?: number;
  gid: string;
};

export const MapGraphic: React.FC<MapGraphicProps> = ({
  theme,
  frame,
  duration,
  place,
  region,
  marker,
  route,
  note,
  zoom = 1,
  at = 10,
  gid,
}) => {
  const reveal = interpolate(frame, [at, at + 26], [0, 1], CLAMP);
  const routeProgress = interpolate(frame, [at + 12, at + 54], [0, 1], CLAMP);
  const ping = pulse(frame - at, 34);
  const scale = 1 + (zoom - 1) * reveal;
  const markerX = marker.x * 1200;
  const markerY = marker.y * 700;
  const routePath = route?.length
    ? route.map((point, index) => `${index === 0 ? "M" : "L"}${(point.x * 1200).toFixed(1)} ${(point.y * 700).toFixed(1)}`).join(" ")
    : "";

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <svg viewBox="0 0 1200 700" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={`map-glow-${gid}`}>
            <stop offset="0%" stopColor={theme.color.signal} stopOpacity={0.24} />
            <stop offset="100%" stopColor={theme.color.signal} stopOpacity={0} />
          </radialGradient>
          <pattern id={`map-dots-${gid}`} width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill={alpha(theme.color.line, 60)} />
          </pattern>
          <clipPath id={`map-clip-${gid}`}>
            <rect x="0" y="0" width="1200" height="700" />
          </clipPath>
        </defs>
        <g clipPath={`url(#map-clip-${gid})`} transform={`translate(600 350) scale(${scale.toFixed(3)}) translate(-600 -350)`} opacity={reveal}>
          <rect width="1200" height="700" fill={`url(#map-dots-${gid})`} />
          {Array.from({ length: 13 }, (_, i) => (
            <line key={`v-${i}`} x1={i * 100} y1={0} x2={i * 100} y2={700} stroke={alpha(theme.color.line, 42)} strokeWidth={1} />
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <line key={`h-${i}`} x1={0} y1={i * 100} x2={1200} y2={i * 100} stroke={alpha(theme.color.line, 42)} strokeWidth={1} />
          ))}
          <path
            d="M80 190 C180 120 285 150 330 220 C390 265 365 360 300 390 C245 430 255 520 185 560 C120 590 70 520 88 440 C100 360 40 285 80 190 Z"
            fill={alpha(theme.color.panel, 64)}
            stroke={alpha(theme.color.muted, 45)}
            strokeWidth={2}
          />
          <path
            d="M360 120 C470 90 600 110 660 170 C720 220 850 190 900 260 C960 340 900 420 840 450 C790 480 810 570 720 610 C620 650 520 600 470 540 C410 470 330 440 320 360 C310 270 300 150 360 120 Z"
            fill={alpha(theme.color.panel, 78)}
            stroke={alpha(theme.color.muted, 55)}
            strokeWidth={2}
          />
          <path
            d="M930 360 C1000 330 1100 350 1160 410 C1190 460 1140 540 1060 560 C990 570 930 520 920 460 Z"
            fill={alpha(theme.color.panel, 58)}
            stroke={alpha(theme.color.muted, 40)}
            strokeWidth={2}
          />
          {route ? (
            <>
              <path d={routePath} fill="none" stroke={alpha(theme.color.signal, 28)} strokeWidth={12} strokeLinecap="round" />
              <path
                d={routePath}
                fill="none"
                stroke={theme.color.signal}
                strokeWidth={3}
                strokeLinecap="round"
                strokeDasharray={1}
                pathLength={1}
                strokeDashoffset={1 - routeProgress}
              />
            </>
          ) : null}
          <circle cx={markerX} cy={markerY} r={150} fill={`url(#map-glow-${gid})`} />
          <circle cx={markerX} cy={markerY} r={20 + ping * 26} fill="none" stroke={theme.color.accent} strokeWidth={2} opacity={0.8 - ping * 0.55} />
          <circle cx={markerX} cy={markerY} r={9} fill={theme.color.accent} />
          <line x1={markerX - 44} y1={markerY} x2={markerX - 18} y2={markerY} stroke={theme.color.accent} strokeWidth={2} />
          <line x1={markerX + 18} y1={markerY} x2={markerX + 44} y2={markerY} stroke={theme.color.accent} strokeWidth={2} />
          <line x1={markerX} y1={markerY - 44} x2={markerX} y2={markerY - 18} stroke={theme.color.accent} strokeWidth={2} />
          <line x1={markerX} y1={markerY + 18} x2={markerX} y2={markerY + 44} stroke={theme.color.accent} strokeWidth={2} />
        </g>
      </svg>
      <div data-doc-el="map-title" style={{ position: "absolute", left: 0, top: 170, opacity: reveal, transform: `translateY(${((1 - reveal) * 26).toFixed(1)}px)` }}>
        <div style={{ fontFamily: theme.font.body, fontSize: 27, fontWeight: 600, letterSpacing: 6, textTransform: "uppercase", color: theme.color.accent }}>
          {region ?? "Location"}
        </div>
        <div style={{ fontFamily: theme.font.display, fontSize: 126, fontWeight: 700, lineHeight: 0.95, textTransform: "uppercase", color: theme.color.text, textShadow: `0 16px 44px ${alpha(theme.color.void, 78)}` }}>
          {place}
        </div>
      </div>
      {note ? (
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: 90,
            maxWidth: 480,
            padding: "18px 24px",
            borderLeft: `3px solid ${theme.color.signal}`,
            fontFamily: theme.font.body,
            fontSize: 27,
            lineHeight: 1.45,
            color: theme.color.text,
            background: alpha(theme.color.void, 66),
            opacity: interpolate(frame, [at + 30, at + 46], [0, 1], CLAMP),
          }}
        >
          {note}
        </div>
      ) : null}
      <div style={{ position: "absolute", right: 0, top: 20, fontFamily: theme.font.type, fontSize: 23, color: theme.color.faint, opacity: reveal }}>
        {`${(marker.x * 180).toFixed(2)}° E / ${(marker.y * 90).toFixed(2)}° N`}
      </div>
      <div style={{ position: "absolute", left: 0, bottom: 30, fontFamily: theme.font.type, fontSize: 21, letterSpacing: 2, color: theme.color.faint }}>
        ARCHIVE GEO / {gid.toUpperCase()}
      </div>
    </div>
  );
};
