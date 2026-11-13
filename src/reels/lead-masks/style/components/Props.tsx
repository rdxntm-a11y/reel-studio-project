import React from "react";
import { alpha, C, FONT } from "../theme";

export const Suitcase: React.FC<{ width?: number }> = ({ width = 460 }) => (
  <svg width={width} height={width * 0.72} viewBox="0 0 420 300" style={{ overflow: "visible" }}>
    <g style={{ filter: `drop-shadow(0 12px 0 ${alpha(C.ink, 18)})` }}>
      <path d="M 48 152 L 68 58 L 352 58 L 352 152 Z" fill={C.charcoalSoft} stroke={C.ink} strokeWidth="5" />
      <rect x="42" y="148" width="336" height="118" rx="14" fill={C.charcoal} stroke={C.ink} strokeWidth="5" />
      <rect x="64" y="166" width="292" height="82" rx="6" fill={C.paperDeep} opacity="0.55" />
      <rect x="86" y="178" width="78" height="46" rx="4" fill={C.paperLight} stroke={C.ink} strokeWidth="2" transform="rotate(-6 125 201)" />
      <rect x="170" y="182" width="78" height="46" rx="4" fill={C.paperLight} stroke={C.ink} strokeWidth="2" transform="rotate(4 209 205)" />
      <rect x="254" y="176" width="78" height="46" rx="4" fill={C.paperLight} stroke={C.ink} strokeWidth="2" transform="rotate(-3 293 199)" />
      <path d="M 86 196 L 164 190 M 170 200 L 248 206 M 254 194 L 332 190" stroke={C.ink} strokeWidth="3" />
      <path d="M 92 86 C 150 66 270 66 328 86" stroke={C.ink} strokeWidth="6" fill="none" />
      <rect x="74" y="86" width="272" height="18" rx="9" fill={C.lead} stroke={C.ink} strokeWidth="3" />
      <rect x="104" y="72" width="18" height="46" rx="4" fill={C.ink} transform="rotate(-14 113 95)" />
      <rect x="146" y="68" width="16" height="52" rx="4" fill={C.ink} transform="rotate(9 154 94)" />
      <circle cx="113" cy="72" r="10" fill={C.leadLight} stroke={C.ink} strokeWidth="3" />
      <path d="M 238 70 L 252 94 L 266 70" fill="none" stroke={C.leadLight} strokeWidth="6" />
      <rect x="244" y="88" width="16" height="34" rx="4" fill={C.ink} />
    </g>
  </svg>
);

export const Clock: React.FC<{ second?: number; minute?: number; width?: number }> = ({
  second = 0,
  minute = 24,
  width = 360,
}) => (
  <svg width={width} height={width} viewBox="0 0 300 300" style={{ overflow: "visible" }}>
    <circle cx="150" cy="150" r="140" fill={C.paperLight} stroke={C.ink} strokeWidth="9" />
    <circle cx="150" cy="150" r="124" fill="none" stroke={C.ink} strokeWidth="2" opacity="0.35" />
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i / 12) * Math.PI * 2;
      const x1 = 150 + Math.sin(a) * 108;
      const y1 = 150 - Math.cos(a) * 108;
      const x2 = 150 + Math.sin(a) * 122;
      const y2 = 150 - Math.cos(a) * 122;
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.ink} strokeWidth="5" strokeLinecap="round" />;
    })}
    <text x="150" y="62" textAnchor="middle" fontFamily={FONT.type} fontSize="20" fill={C.inkSoft}>
      NITERÓI
    </text>
    <g transform={`rotate(${minute * 6} 150 150)`}>
      <line x1="150" y1="150" x2="150" y2="92" stroke={C.ink} strokeWidth="10" strokeLinecap="round" />
    </g>
    <g transform={`rotate(${second * 6} 150 150)`}>
      <line x1="150" y1="168" x2="150" y2="64" stroke={C.red} strokeWidth="4" strokeLinecap="round" />
    </g>
    <circle cx="150" cy="150" r="10" fill={C.ink} />
  </svg>
);

export const Receipt: React.FC<{ width?: number }> = ({ width = 420 }) => (
  <div
    style={{
      width,
      background: C.paperLight,
      color: C.ink,
      fontFamily: FONT.type,
      fontSize: 26,
      lineHeight: 1.55,
      padding: "34px 30px 50px",
      boxShadow: `0 14px 0 ${alpha(C.ink, 16)}`,
      transform: "rotate(-2deg)",
      clipPath:
        "polygon(0 0, 100% 0, 100% 94%, 96% 100%, 92% 94%, 88% 100%, 84% 94%, 80% 100%, 76% 94%, 72% 100%, 68% 94%, 64% 100%, 60% 94%, 56% 100%, 52% 94%, 48% 100%, 44% 94%, 40% 100%, 36% 94%, 32% 100%, 28% 94%, 24% 100%, 20% 94%, 16% 100%, 12% 94%, 8% 100%, 4% 94%, 0 100%)",
    }}
  >
    <div style={{ textAlign: "center", letterSpacing: 3, fontSize: 30 }}>BAR CENTRAL</div>
    <div style={{ borderTop: `2px dashed ${C.inkSoft}`, margin: "16px 0" }} />
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span>DATE</span>
      <span>17 AUG 1966</span>
    </div>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span>TIME</span>
      <span>22:15</span>
    </div>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span>TABLE</span>
      <span>MIGUEL</span>
    </div>
    <div style={{ borderTop: `2px dashed ${C.inkSoft}`, margin: "16px 0" }} />
    <div style={{ textAlign: "center", color: C.redDark, fontSize: 28, letterSpacing: 2 }}>
      NERVOUS. KEPT CHECKING WATCH.
    </div>
  </div>
);

export const Kite: React.FC<{ width?: number; tilt?: number }> = ({ width = 300, tilt = 0 }) => (
  <svg
    width={width}
    height={width * 1.55}
    viewBox="0 0 300 465"
    style={{ overflow: "visible", transform: `rotate(${tilt}deg)` }}
  >
    <g style={{ filter: `drop-shadow(0 8px 0 ${alpha(C.ink, 14)})` }}>
      <path d="M 150 8 L 246 116 L 150 258 L 54 116 Z" fill={C.paperLight} stroke={C.ink} strokeWidth="6" />
      <path d="M 150 8 L 150 258 M 54 116 L 246 116" stroke={C.ink} strokeWidth="4" />
      <path d="M 150 258 C 170 320 120 350 148 405" stroke={C.ink} strokeWidth="3" fill="none" />
      <path d="M 148 310 L 174 326 L 148 342 L 122 326 Z" fill={C.red} />
      <path d="M 148 370 L 172 384 L 148 398 L 124 384 Z" fill={C.red} opacity="0.8" />
      <path d="M 150 258 C 80 340 46 400 12 462" stroke={C.ink} strokeWidth="2.5" fill="none" strokeDasharray="7 8" />
    </g>
  </svg>
);

export const Bottle: React.FC<{ width?: number }> = ({ width = 110 }) => (
  <svg width={width} height={width * 2.1} viewBox="0 0 110 231" style={{ overflow: "visible" }}>
    <g style={{ filter: `drop-shadow(0 8px 0 ${alpha(C.ink, 14)})` }}>
      <rect x="38" y="8" width="34" height="26" rx="5" fill={C.ink} />
      <path d="M 42 34 L 42 64 Q 16 84 16 124 L 16 208 Q 16 222 30 222 L 80 222 Q 94 222 94 208 L 94 124 Q 94 84 68 64 L 68 34 Z" fill={C.paperLight} fillOpacity="0.55" stroke={C.ink} strokeWidth="4" />
      <path d="M 22 138 L 88 138 L 88 198 L 22 198 Z" fill={C.paperDeep} opacity="0.7" />
      <text x="55" y="176" textAnchor="middle" fontFamily={FONT.type} fontSize="15" fill={C.ink}>
        EMPTY
      </text>
    </g>
  </svg>
);

export const Towels: React.FC<{ width?: number }> = ({ width = 250 }) => (
  <svg width={width} height={width * 0.62} viewBox="0 0 250 155" style={{ overflow: "visible" }}>
    <ellipse cx="125" cy="142" rx="112" ry="12" fill={C.lead} opacity="0.25" />
    <g style={{ filter: `drop-shadow(0 7px 0 ${alpha(C.ink, 14)})` }}>
      <rect x="18" y="52" width="96" height="82" rx="8" fill={C.paperLight} stroke={C.ink} strokeWidth="4" transform="rotate(-5 66 93)" />
      <rect x="128" y="46" width="104" height="86" rx="8" fill={C.paperDeep} stroke={C.ink} strokeWidth="4" transform="rotate(4 180 89)" />
      <path d="M 30 74 L 104 68 M 34 92 L 108 86 M 138 68 L 220 72 M 136 88 L 218 92" stroke={C.ink} strokeWidth="2.5" opacity="0.6" />
      <path d="M 60 134 Q 58 146 64 152 M 74 136 Q 72 148 78 154 M 188 132 Q 186 146 192 152" stroke={C.lead} strokeWidth="4" strokeLinecap="round" fill="none" />
    </g>
  </svg>
);

export const Notebook: React.FC<{ width?: number; children?: React.ReactNode }> = ({
  width = 760,
  children,
}) => (
  <div
    style={{
      width,
      height: width * 0.66,
      position: "relative",
      filter: `drop-shadow(0 14px 0 ${alpha(C.ink, 18)})`,
      transform: "rotate(-1.5deg)",
      boxSizing: "border-box",
      background: C.ink,
      borderRadius: 10,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 4,
        display: "flex",
        borderRadius: 6,
        overflow: "hidden",
        background: C.paperLight,
        boxSizing: "border-box",
      }}
    >
      <div style={{ flex: 0.32, borderRight: `3px solid ${C.ink}`, background: C.paperDeep, opacity: 0.55 }} />
      <div
        style={{
          flex: 0.68,
          position: "relative",
          background: `repeating-linear-gradient(${C.paperLight} 0px, ${C.paperLight} 43px, ${C.inkFaint} 44px)`,
        }}
      >
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 40, width: 3, background: C.red, opacity: 0.55 }} />
        <div style={{ position: "absolute", inset: "24px 24px 20px 56px" }}>{children}</div>
      </div>
    </div>
    {Array.from({ length: 7 }).map((_, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: -14,
          top: 36 + i * 62,
          width: 44,
          height: 12,
          borderRadius: 8,
          background: C.lead,
          border: `2px solid ${C.ink}`,
        }}
      />
    ))}
  </div>
);

export const QuestionMark: React.FC<{ size?: number; rotate?: number; opacity?: number }> = ({
  size = 170,
  rotate = -8,
  opacity = 1,
}) => (
  <div
    style={{
      fontFamily: FONT.display,
      fontSize: size,
      lineHeight: 0.8,
      color: C.red,
      transform: `rotate(${rotate}deg)`,
      opacity,
      minWidth: size * 0.7,
      textAlign: "center",
      textShadow: `0 4px 0 ${alpha(C.ink, 18)}`,
    }}
  >
    ?
  </div>
);

export const UFO: React.FC<{ beam?: number; flicker?: number; width?: number }> = ({
  beam = 1,
  flicker = 0,
  width = 430,
}) => (
  <svg width={width} height={width * 0.9} viewBox="0 0 430 387" style={{ overflow: "visible" }}>
    <defs>
      <linearGradient id="lm-beam" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={C.white} stopOpacity={0.38} />
        <stop offset="100%" stopColor={C.white} stopOpacity={0} />
      </linearGradient>
    </defs>
    <polygon
      points="150,126 280,126 390,380 40,380"
      fill="url(#lm-beam)"
      opacity={beam * (0.75 + flicker * 0.25)}
    />
    <ellipse cx="215" cy="122" rx="148" ry="44" fill={C.lead} stroke={C.ink} strokeWidth="5" />
    <ellipse cx="215" cy="108" rx="66" ry="40" fill={C.paperLight} stroke={C.ink} strokeWidth="5" />
    <ellipse cx="215" cy="126" rx="116" ry="24" fill={C.leadLight} opacity="0.65" />
    <circle cx="118" cy="128" r="9" fill={C.red} />
    <circle cx="170" cy="136" r="7" fill={C.paperLight} />
    <circle cx="215" cy="139" r="7" fill={C.paperLight} />
    <circle cx="260" cy="136" r="7" fill={C.paperLight} />
    <circle cx="312" cy="128" r="9" fill={C.red} />
  </svg>
);

export const Clipboard: React.FC<{ width?: number }> = ({ width = 300 }) => (
  <div
    style={{
      width,
      minHeight: width * 1.25,
      background: C.ink,
      borderRadius: 8,
      boxShadow: `0 12px 0 ${alpha(C.ink, 18)}`,
      transform: "rotate(3deg)",
      position: "relative",
    }}
  >
    <div
      style={{
        margin: 5,
        minHeight: width * 1.25 - 10,
        background: C.paperLight,
        borderRadius: 4,
        padding: "54px 26px 26px",
        boxSizing: "border-box",
        color: C.ink,
        fontFamily: FONT.type,
      }}
    >
      <div style={{ fontSize: 24, letterSpacing: 2, borderBottom: `3px solid ${C.ink}`, paddingBottom: 10 }}>
        AUTOPSY
      </div>
      <div style={{ marginTop: 18, fontSize: 17, lineHeight: 1.6 }}>
        <div>BODY 1: LATE</div>
        <div>BODY 2: LATE</div>
        <div>ORGANS: DECOMPOSED</div>
        <div style={{ color: C.redDark, marginTop: 12 }}>TOXICOLOGY: MISSING</div>
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        top: -18,
        left: "50%",
        width: 120,
        height: 38,
        transform: "translateX(-50%)",
        background: C.lead,
        border: `4px solid ${C.ink}`,
        borderRadius: 8,
      }}
    />
  </div>
);

export const TestTube: React.FC<{ width?: number }> = ({ width = 80 }) => (
  <svg width={width} height={width * 2.4} viewBox="0 0 80 192" style={{ overflow: "visible" }}>
    <path d="M 22 10 L 22 150 Q 22 180 40 180 Q 58 180 58 150 L 58 10" fill={C.paperLight} fillOpacity="0.5" stroke={C.ink} strokeWidth="4" />
    <path d="M 23 118 L 57 118 L 57 150 Q 57 176 40 176 Q 23 176 23 150 Z" fill={C.lead} opacity="0.55" />
    <rect x="16" y="4" width="48" height="14" rx="4" fill={C.ink} />
    <path d="M 18 70 L 62 148 M 62 70 L 18 148" stroke={C.red} strokeWidth="9" strokeLinecap="round" />
  </svg>
);

export const Capsule: React.FC<{ width?: number; rotate?: number }> = ({ width = 120, rotate = -12 }) => (
  <svg width={width} height={width * 0.42} viewBox="0 0 120 50" style={{ transform: `rotate(${rotate}deg)` }}>
    <rect x="2" y="2" width="116" height="46" rx="23" fill={C.paperLight} stroke={C.ink} strokeWidth="4" />
    <path d="M 60 2 L 60 48" stroke={C.ink} strokeWidth="4" />
    <path d="M 60 4 L 114 4 Q 118 25 114 46 L 60 46 Z" fill={C.lead} opacity="0.6" />
  </svg>
);
