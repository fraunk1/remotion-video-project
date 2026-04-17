import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { ChilesContainer } from "./ChilesContainer";
import { chilesTheme as t } from "./theme";

/** Slide 6 — the Holding. 3 stat cards count in, then two quote callouts. */
export const ChilesHolding: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const eyebrowP = spring({ frame, fps, config: { damping: 180 } });
  const h2P = spring({ frame: frame - 6, fps, config: { damping: 180 } });

  const card1 = spring({ frame: frame - 18, fps, config: { damping: 14 } });
  const card2 = spring({ frame: frame - 28, fps, config: { damping: 14 } });
  const card3 = spring({ frame: frame - 38, fps, config: { damping: 14 } });

  // Narration cues for quote reveals:
  //   Q1 (Gorsuch Syllabus): fade in when narration says "One: …as-applied ruling" (~4s)
  //   Q2 ("no word game"):   fade in when narration says "Three:" (~18s)
  const q1 = spring({ frame: frame - 120, fps, config: { damping: 200 } });
  const q2 = spring({ frame: frame - 540, fps, config: { damping: 200 } });

  const lineIn = (p: number, d = 24) => ({
    opacity: interpolate(p, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(p, [0, 1], [d, 0])}px)`,
  });

  // Counter animation for 8–1 — 2-second linear sweep (slower than spring)
  // Starts counting ~6 frames after card lands (spring-in for the card itself, then count)
  const voteCount = interpolate(frame - 28, [0, 60], [0, 8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const statCard = (
    label: string,
    value: string,
    color: string,
    p: number,
  ) => (
    <div
      style={{
        background: t.colors.bgCard,
        border: `1px solid ${t.colors.border}`,
        borderRadius: 14,
        padding: "32px 24px",
        textAlign: "center",
        boxShadow: t.shadows.card,
        opacity: interpolate(p, [0, 1], [0, 1]),
        transform: `scale(${interpolate(p, [0, 1], [0.85, 1])})`,
      }}
    >
      <div
        style={{
          fontFamily: t.font.family,
          fontSize: 118,
          fontWeight: t.font.weight.bold,
          color,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: t.font.family,
          fontSize: 22,
          fontWeight: t.font.weight.medium,
          color: t.colors.textDim,
          marginTop: 16,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );

  return (
    <ChilesContainer background="watermark">
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
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
        What the Court Held
      </div>
      <div
        style={{
          fontFamily: t.font.family,
          fontSize: 92,
          fontWeight: t.font.weight.bold,
          color: t.colors.navy,
          marginTop: 6,
          ...lineIn(h2P),
        }}
      >
        The Holding
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 28, marginTop: 44 }}>
        {statCard(
          "Merits vote",
          `${Math.round(voteCount)}\u20131`,
          t.colors.navy,
          card1,
        )}
        {statCard("Scrutiny required on remand", "Strict", t.colors.blue, card2)}
        {statCard("Discrimination found as applied", "Viewpoint", t.colors.orange, card3)}
      </div>

      {/* Quote callouts */}
      <div
        style={{
          marginTop: 36,
          background: "rgba(24, 154, 207, 0.08)",
          borderLeft: `6px solid ${t.colors.blue}`,
          borderRadius: "0 10px 10px 0",
          padding: "20px 30px",
          fontFamily: t.font.family,
          fontSize: 22,
          fontStyle: "italic",
          color: t.colors.textBright,
          lineHeight: 1.5,
          opacity: interpolate(q1, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(q1, [0, 1], [16, 0])}px)`,
        }}
      >
        "Colorado's law banning conversion therapy, as applied to Ms. Chiles's talk therapy, regulates speech based on viewpoint, and the lower courts erred by failing to apply sufficiently rigorous First Amendment scrutiny."
        <div
          style={{
            fontStyle: "normal",
            fontSize: 18,
            color: t.colors.textDim,
            marginTop: 10,
            letterSpacing: "0.02em",
          }}
        >
          — Gorsuch, J., Syllabus
        </div>
      </div>

      <div
        style={{
          marginTop: 16,
          background: "rgba(251, 170, 41, 0.09)",
          borderLeft: `6px solid ${t.colors.orange}`,
          borderRadius: "0 10px 10px 0",
          padding: "20px 30px",
          fontFamily: t.font.family,
          fontSize: 22,
          fontStyle: "italic",
          color: t.colors.textBright,
          lineHeight: 1.5,
          opacity: interpolate(q2, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(q2, [0, 1], [16, 0])}px)`,
        }}
      >
        "Her speech does not become 'conduct' just because a government says so or because it may be described as a 'treatment' or 'therapeutic modality.' The First Amendment is no word game…."
        <div
          style={{
            fontStyle: "normal",
            fontSize: 18,
            color: t.colors.textDim,
            marginTop: 10,
            letterSpacing: "0.02em",
          }}
        >
          — Slip op. at 12–13
        </div>
      </div>
      </div>
    </ChilesContainer>
  );
};
