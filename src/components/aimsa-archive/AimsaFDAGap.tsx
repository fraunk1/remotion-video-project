import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { AimsaContainer } from "./AimsaContainer";
import { aimsaTheme as t, citationStyle } from "./theme";

/**
 * Slide 11 — Why FDA Regulation Is Not Sufficient.
 * Tiered reveal timed to narration (~35.06s / ~1052 frames @ 30fps):
 *   - eyebrow/title/subtitle + col headers: 0-30
 *   - LEFT bullet 1 (Cures § 3060): frame 150
 *   - LEFT bullet 2 (97% § 510(k)): frame 300
 *   - LEFT bullet 3 (Riegel preemption): frame 540
 *   - RIGHT bullets cascade: 780-960 (~36f apart)
 *   - Bottom callout: frame 980
 *   - Graceful end beat: subtle callout border color shift + scale pulse 1000-1052
 */

type FDAItem = {
  text: string;
  cite: string;
};

const FDA_LEFT: FDAItem[] = [
  {
    text: "21st Century Cures § 3060 carve-out keeps much clinical AI outside FDA reach by statute",
    cite: "Pub. L. No. 114-255 · 21 U.S.C. § 360j(o)",
  },
  {
    text: "97% of AI/ML clearances move through § 510(k) substantial-equivalence — focused on equivalence, not safety",
    cite: "Medtronic, Inc. v. Lohr, 518 U.S. 470 (1996)",
  },
  {
    text: "PMA-cleared autonomous AI may invoke federal preemption to shield manufacturers from state tort claims",
    cite: "Riegel v. Medtronic, 552 U.S. 312 (2008) · 21 U.S.C. § 360k(a)",
  },
];

const STATE_RIGHT = [
  "Standard of care for clinical decisions",
  "Off-label use and prescribing practice",
  "Scope of practice and supervision",
  "Ongoing physician competency",
  "Deployment context and integration into care",
];

// SIMPLIFIED PACING (per Frank): just have each bullet point quickly load.
// No narration sync — rapid cascade so everything is visible by ~3 seconds,
// then the slide holds while narration plays. Avoids "audio chopped" feeling.
const LEFT_FRAMES = [30, 50, 70];
const RIGHT_BASE_FRAME = 40;
const RIGHT_STEP = 8;
const CALLOUT_FRAME = 110;
const END_BEAT_START = 1000;
const END_BEAT_END = 1052;

export const AimsaFDAGap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const eyebrowP = spring({ frame, fps, config: { damping: 180 } });
  const h2P = spring({ frame: frame - 6, fps, config: { damping: 180 } });
  const subP = spring({ frame: frame - 12, fps, config: { damping: 180 } });
  const leftColP = spring({ frame: frame - 16, fps, config: { damping: 180 } });
  const rightColP = spring({ frame: frame - 22, fps, config: { damping: 180 } });
  const calloutP = spring({ frame: frame - CALLOUT_FRAME, fps, config: { damping: 200 } });

  const lineIn = (p: number, d = 24) => ({
    opacity: interpolate(p, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(p, [0, 1], [d, 0])}px)`,
  });

  // End-beat — subtle hold pulse + opacity settle signaling closure without
  // chopping the audio. Pulse: 1.0 → 1.015 → 1.0 across 40 frames.
  const endPulse = interpolate(
    frame,
    [END_BEAT_START, END_BEAT_START + 20, END_BEAT_START + 40, END_BEAT_END],
    [1.0, 1.015, 1.0, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // Callout border deepens slightly, plus subtle opacity settle in the last
  // ~0.5s (15 frames before slide end) so the frame feels "landed" before cut.
  const endBeatProgress = interpolate(
    frame,
    [END_BEAT_START, END_BEAT_END],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const calloutBorderWidth = interpolate(endBeatProgress, [0, 1], [6, 9]);
  // Gentle fade from full to 0.92 across last 15 frames — signals closure.
  const settleOpacity = interpolate(
    frame,
    [END_BEAT_END - 15, END_BEAT_END],
    [1.0, 0.94],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AimsaContainer background="watermark">
      <div
        style={{
          fontFamily: t.font.family,
          fontSize: 26,
          fontWeight: t.font.weight.semibold,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: t.colors.blue,
          ...lineIn(eyebrowP),
        }}
      >
        The Federal-State Question
      </div>
      <div
        style={{
          fontFamily: t.font.family,
          fontSize: 72,
          fontWeight: t.font.weight.bold,
          color: t.colors.navy,
          marginTop: 6,
          ...lineIn(h2P),
        }}
      >
        Why FDA Regulation Is Not Sufficient
      </div>
      <div
        style={{
          fontFamily: t.font.family,
          fontSize: 24,
          color: t.colors.text,
          marginTop: 8,
          fontStyle: "italic",
          ...lineIn(subP),
        }}
      >
        FDA regulates products. States regulate the practice of medicine.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginTop: 32, flex: 1 }}>
        {/* LEFT — FDA reach */}
        <div
          style={{
            background: t.colors.bgCardGray,
            border: `2px solid ${t.colors.bgCardGrayBorder}`,
            borderTop: `6px solid ${t.colors.blue}`,
            borderRadius: 12,
            padding: "24px 28px",
            boxShadow: t.shadows.card,
            opacity: interpolate(leftColP, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(leftColP, [0, 1], [32, 0])}px)`,
          }}
        >
          <div
            style={{
              fontFamily: t.font.family,
              fontSize: 26,
              fontWeight: t.font.weight.bold,
              color: t.colors.blue,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            FDA Regulates Products
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {FDA_LEFT.map((it, i) => {
              const itemP = spring({
                frame: frame - LEFT_FRAMES[i],
                fps,
                config: { damping: 180 },
              });
              return (
                <div
                  key={i}
                  style={{
                    paddingLeft: 22,
                    position: "relative",
                    opacity: interpolate(itemP, [0, 1], [0, 1]),
                    transform: `translateY(${interpolate(itemP, [0, 1], [16, 0])}px)`,
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 12,
                      width: 9,
                      height: 9,
                      borderRadius: 5,
                      background: t.colors.blue,
                    }}
                  />
                  <div
                    style={{
                      fontFamily: t.font.family,
                      fontSize: 24,
                      color: t.colors.text,
                      lineHeight: 1.45,
                    }}
                  >
                    {it.text}
                  </div>
                  <span style={citationStyle}>{it.cite}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT — what FDA does NOT review */}
        <div
          style={{
            background: t.colors.bgCardGray,
            border: `2px solid ${t.colors.bgCardGrayBorder}`,
            borderTop: `6px solid ${t.colors.orange}`,
            borderRadius: 12,
            padding: "24px 28px",
            boxShadow: t.shadows.card,
            opacity: interpolate(rightColP, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(rightColP, [0, 1], [32, 0])}px)`,
          }}
        >
          <div
            style={{
              fontFamily: t.font.family,
              fontSize: 26,
              fontWeight: t.font.weight.bold,
              color: t.colors.orange,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            States Regulate the Practice of Medicine
          </div>
          <div
            style={{
              fontFamily: t.font.family,
              fontSize: 24,
              color: t.colors.textDim,
              fontStyle: "italic",
              marginBottom: 18,
            }}
          >
            What FDA does <strong>not</strong> review:
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {STATE_RIGHT.map((s, i) => {
              const itemP = spring({
                frame: frame - (RIGHT_BASE_FRAME + i * RIGHT_STEP),
                fps,
                config: { damping: 180 },
              });
              return (
                <div
                  key={i}
                  style={{
                    paddingLeft: 22,
                    position: "relative",
                    opacity: interpolate(itemP, [0, 1], [0, 1]),
                    transform: `translateY(${interpolate(itemP, [0, 1], [14, 0])}px)`,
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 12,
                      width: 9,
                      height: 9,
                      borderRadius: 5,
                      background: t.colors.orange,
                    }}
                  />
                  <div
                    style={{
                      fontFamily: t.font.family,
                      fontSize: 24,
                      color: t.colors.text,
                      lineHeight: 1.45,
                    }}
                  >
                    {s}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom callout — Parallel Board pattern: gray card + orange left-border */}
      <div
        style={{
          marginTop: 22,
          background: t.colors.bgCardGray,
          border: `2px solid ${t.colors.bgCardGrayBorder}`,
          borderLeft: `${calloutBorderWidth}px solid ${t.colors.orange}`,
          borderRadius: "0 12px 12px 0",
          padding: "22px 32px",
          fontFamily: t.font.family,
          fontSize: 24,
          fontStyle: "italic",
          fontWeight: t.font.weight.medium,
          color: t.colors.textBright,
          opacity: interpolate(calloutP, [0, 1], [0, 1]) * settleOpacity,
          transform: `translateY(${interpolate(calloutP, [0, 1], [16, 0])}px) scale(${endPulse})`,
          transformOrigin: "left center",
        }}
      >
        AIMSA builds on the federal-state gap — then routes the resulting authority
        away from the existing boards into a new, sandbox-friendly forum.
      </div>
    </AimsaContainer>
  );
};
