import React from "react";
import { alpha, C, type Tone } from "../theme";

export const LeadMask: React.FC<{ size?: number; glow?: number }> = ({ size = 90, glow = 0 }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 90 54" style={{ overflow: "visible" }}>
    <ellipse
      cx="45"
      cy="28"
      rx="44"
      ry="26"
      fill={C.white}
      opacity={glow * 0.45}
      style={{ filter: "blur(8px)" }}
    />
    <path
      d="M 8 20 Q 8 6 45 6 Q 82 6 82 20 L 82 34 Q 82 48 45 48 Q 8 48 8 34 Z"
      fill={C.lead}
      stroke={C.ink}
      strokeWidth="2.5"
    />
    <ellipse cx="30" cy="27" rx="8.5" ry="6.5" fill={C.ink} />
    <ellipse cx="60" cy="27" rx="8.5" ry="6.5" fill={C.ink} />
    <path d="M 8 20 Q 45 14 82 20" stroke={C.leadLight} strokeWidth="2" fill="none" opacity="0.7" />
    <path d="M 4 24 L -2 30 M 86 24 L 92 30" stroke={C.ink} strokeWidth="2.5" />
  </svg>
);

type BodyProps = {
  tone?: Tone;
  outfit?: "suit" | "coat";
  mask?: number;
  glow?: number;
  width?: number;
};

export const PaperBody: React.FC<BodyProps> = ({
  tone = "paper",
  outfit = "suit",
  mask = 0,
  glow = 0,
  width = 360,
}) => {
  const fill = tone === "paper" ? C.charcoal : C.paperDeep;
  const line = tone === "paper" ? C.ink : C.inkFaint;
  const maskY = -280 * (1 - mask);
  return (
    <svg
      width={width}
      height={width * 0.46}
      viewBox="0 0 340 156"
      style={{ overflow: "visible", filter: `drop-shadow(0 10px 0 ${alpha(C.ink, 18)})` }}
    >
      <g>
        <path d="M 74 70 L 120 38 L 132 46 L 98 78 Z" fill={fill} stroke={line} strokeWidth="3" />
        <path d="M 74 92 L 128 120 L 140 110 L 98 84 Z" fill={fill} stroke={line} strokeWidth="3" />
        <rect x="82" y="56" width="148" height="46" rx="20" fill={fill} stroke={line} strokeWidth="3" />
        <path d="M 222 66 L 310 66 L 322 76 L 310 86 L 222 86 Z" fill={fill} stroke={line} strokeWidth="3" />
        <path d="M 222 88 L 306 100 L 300 110 L 222 98 Z" fill={fill} stroke={line} strokeWidth="3" />
        <circle cx="52" cy="78" r="29" fill={fill} stroke={line} strokeWidth="3" />
        {outfit === "suit" ? (
          <>
            <path d="M 96 58 L 118 78 L 96 96" fill={C.paperLight} stroke={line} strokeWidth="2.5" />
            <path d="M 118 78 L 108 106 L 128 106 Z" fill={C.red} opacity="0.85" />
          </>
        ) : (
          <>
            <path d="M 88 60 Q 110 44 136 60 L 132 92 L 92 92 Z" fill={C.charcoalSoft} stroke={line} strokeWidth="2.5" />
            <path d="M 92 66 L 132 66" stroke={line} strokeWidth="2" opacity="0.6" />
          </>
        )}
        <g transform={`translate(22 ${maskY})`} opacity={mask === 0 ? 0 : 1}>
          <LeadMask size={64} glow={glow} />
        </g>
      </g>
    </svg>
  );
};

export const StandingFigure: React.FC<{
  tone?: Tone;
  glow?: number;
  width?: number;
  mask?: boolean;
  watch?: boolean;
}> = ({ tone = "paper", glow = 0, width = 160, mask = true, watch = false }) => {
  const fill = tone === "paper" ? C.charcoal : C.paperDeep;
  const line = tone === "paper" ? C.ink : C.inkFaint;
  return (
    <svg
      width={width}
      height={width * 2.3}
      viewBox="0 0 130 300"
      style={{ overflow: "visible", filter: `drop-shadow(0 10px 0 ${alpha(C.ink, 18)})` }}
    >
      <circle cx="65" cy="42" r="27" fill={fill} stroke={line} strokeWidth="3" />
      <rect x="38" y="70" width="54" height="118" rx="16" fill={fill} stroke={line} strokeWidth="3" />
      <rect x="44" y="184" width="16" height="92" rx="7" fill={fill} stroke={line} strokeWidth="3" />
      <rect x="70" y="184" width="16" height="92" rx="7" fill={fill} stroke={line} strokeWidth="3" />
      <rect x="20" y="78" width="15" height="108" rx="7" fill={fill} stroke={line} strokeWidth="3" />
      <rect x="95" y="78" width="15" height="108" rx="7" fill={fill} stroke={line} strokeWidth="3" />
      <path d="M 48 72 L 65 94 L 82 72" fill="none" stroke={line} strokeWidth="2.5" opacity="0.8" />
      {mask ? (
        <g transform="translate(38 20)">
          <LeadMask size={54} glow={glow} />
        </g>
      ) : (
        <>
          <circle cx="56" cy="38" r="3.5" fill={C.paperLight} />
          <circle cx="74" cy="38" r="3.5" fill={C.paperLight} />
          <path d="M 56 52 Q 65 57 74 52" stroke={C.paperLight} strokeWidth="3" fill="none" />
        </>
      )}
      {watch ? (
        <g>
          <circle cx="27" cy="166" r="9" fill={C.paperLight} stroke={C.ink} strokeWidth="3" />
          <path d="M 27 166 L 27 160 M 27 166 L 32 168" stroke={C.ink} strokeWidth="2" />
        </g>
      ) : null}
    </svg>
  );
};
