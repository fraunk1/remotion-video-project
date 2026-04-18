import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { AimsaContainer } from "./AimsaContainer";
import { aimsaTheme as t, citationStyle } from "./theme";

/**
 * Slide 6 — The Parallel Board. A row of 11 bathroom-door human icons
 * color-coded to the AIMSA board composition, with a color-key legend
 * and the exclusive-jurisdiction quote callout preserved below.
 */

type Seat = {
  label: string;
  category: "clinician" | "public" | "industry";
};

// Order matches the Cicero model — clinicians first (left), then public, then industry
const SEATS: Seat[] = [
  { label: "MD/DO", category: "clinician" },
  { label: "RN/APRN", category: "clinician" },
  { label: "Pharmacist", category: "clinician" },
  { label: "Psychologist", category: "clinician" },
  { label: "Ethicist", category: "public" },
  { label: "Public", category: "public" },
  { label: "Hospital", category: "industry" },
  { label: "AI/Tech", category: "industry" },
  { label: "AI/Tech", category: "industry" },
  { label: "AI/Tech", category: "industry" },
  { label: "AI/Tech", category: "industry" },
];

const CATEGORY_COLOR: Record<Seat["category"], string> = {
  clinician: "#189ACF", // FSMB Blue (Pantone 2394) — per FSMB brand reference
  public: "#FBAA29", // FSMB orange
  industry: "#1f2937", // near-black / dark gray
};

const PersonIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 130 }) => (
  <svg viewBox="0 0 48 80" width={size} height={(size * 80) / 48} aria-hidden>
    <circle cx="24" cy="14" r="11" fill={color} />
    <path
      d="M 8 30 Q 8 26, 14 26 L 34 26 Q 40 26, 40 30 L 40 55 Q 40 58, 37 58 L 30 58 L 30 76 Q 30 78, 28 78 L 22 78 Q 20 78, 20 76 L 20 58 L 11 58 Q 8 58, 8 55 Z"
      fill={color}
    />
  </svg>
);

export const AimsaParallelBoard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const eyebrowP = spring({ frame, fps, config: { damping: 180 } });
  const h2P = spring({ frame: frame - 6, fps, config: { damping: 180 } });

  // Icons pop in sequentially — tighter cascade so all 11 land within ~2s
  const iconDelays = SEATS.map((_, i) => 16 + i * 5);

  // Legend enters just after all icons populate
  const legendP = spring({ frame: frame - (16 + SEATS.length * 5 + 6), fps, config: { damping: 180 } });

  // Exclusive-jurisdiction quote — also loads at slide start, just after legend
  const q1 = spring({ frame: frame - (16 + SEATS.length * 5 + 20), fps, config: { damping: 200 } });

  const lineIn = (p: number, d = 24) => ({
    opacity: interpolate(p, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(p, [0, 1], [d, 0])}px)`,
  });

  return (
    <AimsaContainer background="watermark">
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
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
          The Central Structural Move
        </div>
        <div
          style={{
            fontFamily: t.font.family,
            fontSize: 80,
            fontWeight: t.font.weight.bold,
            color: t.colors.navy,
            marginTop: 6,
            ...lineIn(h2P),
          }}
        >
          A Parallel Board
        </div>
        <div
          style={{
            fontFamily: t.font.family,
            fontSize: 24,
            color: t.colors.text,
            marginTop: 10,
            fontStyle: "italic",
            ...lineIn(spring({ frame: frame - 12, fps, config: { damping: 180 } })),
          }}
        >
          11 voting members · clinician-minority composition
        </div>

        {/* Row of 11 bathroom-door figures, color-coded by category */}
        <div
          style={{
            marginTop: 56,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 14,
            padding: "0 10px",
          }}
        >
          {SEATS.map((seat, i) => {
            const p = spring({
              frame: frame - iconDelays[i],
              fps,
              config: { damping: 14, mass: 0.6 },
            });
            const color = CATEGORY_COLOR[seat.category];
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  opacity: interpolate(p, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(p, [0, 1], [22, 0])}px) scale(${interpolate(
                    p,
                    [0, 1],
                    [0.7, 1],
                  )})`,
                }}
              >
                <PersonIcon color={color} size={130} />
                <div
                  style={{
                    fontFamily: t.font.family,
                    fontSize: 24,
                    fontWeight: t.font.weight.semibold,
                    color: t.colors.textBright,
                    marginTop: 14,
                    textAlign: "center",
                    letterSpacing: "0.02em",
                    maxWidth: 130,
                    lineHeight: 1.2,
                  }}
                >
                  {seat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend / key — counts + colors */}
        <div
          style={{
            marginTop: 26,
            display: "flex",
            justifyContent: "center",
            gap: 40,
            opacity: interpolate(legendP, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(legendP, [0, 1], [12, 0])}px)`,
          }}
        >
          <LegendChip color={CATEGORY_COLOR.clinician} count={4} label="clinicians" />
          <LegendChip color={CATEGORY_COLOR.public} count={2} label="public interest" />
          <LegendChip color={CATEGORY_COLOR.industry} count={5} label="industry-aligned" />
        </div>

        {/* Exclusive-jurisdiction quote callout WITH citations (blue-underlined) */}
        <div
          style={{
            marginTop: "auto",
            background: t.colors.bgCardGray,
            border: `2px solid ${t.colors.bgCardGrayBorder}`,
            borderLeft: `6px solid ${t.colors.orange}`,
            borderRadius: "0 12px 12px 0",
            padding: "22px 32px",
            opacity: interpolate(q1, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(q1, [0, 1], [16, 0])}px)`,
          }}
        >
          <div
            style={{
              fontFamily: t.font.family,
              fontSize: 24,
              fontStyle: "italic",
              color: t.colors.textBright,
              lineHeight: 1.5,
            }}
          >
            The new board has <strong>exclusive jurisdiction</strong> over autonomous AI medical practice —
            stripping the existing state medical board of authority over AI clinical care.
          </div>
          <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 22 }}>
            <span style={citationStyle}>Idaho HB 945 § 54-6008(7)</span>
            <span style={citationStyle}>Iowa HSB 766 § 153A.17</span>
            <span style={citationStyle}>Cicero AIMSA § 8(g)</span>
          </div>
        </div>
      </div>
    </AimsaContainer>
  );
};

const LegendChip: React.FC<{ color: string; count: number; label: string }> = ({ color, count, label }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      background: t.colors.bgCardGray,
      border: `2px solid ${t.colors.bgCardGrayBorder}`,
      borderRadius: 999,
      padding: "10px 20px",
    }}
  >
    <span
      style={{
        width: 22,
        height: 22,
        borderRadius: 999,
        background: color,
        display: "inline-block",
        boxShadow: "0 1px 3px rgba(14, 40, 65, 0.18)",
      }}
    />
    <span
      style={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: 24,
        color: "#0E2841",
      }}
    >
      <strong>{count}</strong> {label}
    </span>
  </div>
);
