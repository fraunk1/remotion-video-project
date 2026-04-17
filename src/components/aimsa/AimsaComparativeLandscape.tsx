import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { AimsaContainer } from "./AimsaContainer";
import { aimsaTheme as t, citationStyle } from "./theme";

/**
 * Slide 10 — Comparative Landscape. LEFT and RIGHT panels are parallel-structured
 * bulleted lists with identical card shells. The only visual differentiator is
 * the accent color (blue vs orange) and the header-band stat.
 */

type BulletItem = {
  title: string;
  body: string;
  cite: string;
};

const PRESERVING: BulletItem[] = [
  {
    title: "California AB 489",
    body: "CMA-sponsored; existing licensing boards enforce title protection",
    cite: "leginfo.legislature.ca.gov · AB 489 (2024)",
  },
  {
    title: "Texas SB 1188 + HB 149",
    body: "TMB retains discipline; AI sandbox sits under the Texas AI Council",
    cite: "Holland & Knight · TX AI Laws (2025)",
  },
  {
    title: "Utah Doctronic",
    body: "Narrow refill pilot under Office of AI Policy + existing physician oversight",
    cite: "commerce.utah.gov/ai/agreements/doctronic/",
  },
  {
    title: "New Hampshire HB 1406",
    body: "Protects physician judgment from insurer-AI override",
    cite: "legiscan.com · NH HB 1406",
  },
];

const BYPASSING: BulletItem[] = [
  {
    title: "Creates a Parallel Board",
    body: "New \"Board of Autonomous Medical Practice\" — separate from the existing medical board",
    cite: "Idaho HB 945 § 54-6008 · Cicero AIMSA § 8",
  },
  {
    title: "Clinician-Minority Composition",
    body: "4 of 11 voting members are clinicians; industry & at-large seats dominate",
    cite: "Idaho HB 945 § 54-6008(2)",
  },
  {
    title: "Strips Existing Board",
    body: "Exclusive jurisdiction over autonomous AI clinical practice moves out of the medical board",
    cite: "Idaho HB 945 § 54-6008(7) · Iowa HSB 766 § 153A.17",
  },
  {
    title: "Promoted by a Think Tank",
    body: "Not sponsored by organized medicine; model developed by the Cicero Institute",
    cite: "ciceroinstitute.org/research/ai-medical-services-act/",
  },
];

export const AimsaComparativeLandscape: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const eyebrowP = spring({ frame, fps, config: { damping: 180 } });
  const h2P = spring({ frame: frame - 6, fps, config: { damping: 180 } });
  // LEFT panel + items load first (all in by ~3.7s).
  // RIGHT panel + items load shortly after (~6.7s) so the viewer can absorb
  // the comparison without a long dead gap. Per Frank's pacing note.
  const leftP = spring({ frame: frame - 16, fps, config: { damping: 180 } });
  const rightP = spring({ frame: frame - 180, fps, config: { damping: 180 } });

  const lineIn = (p: number, d = 24) => ({
    opacity: interpolate(p, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(p, [0, 1], [d, 0])}px)`,
  });

  const renderPanel = (opts: {
    items: BulletItem[];
    accent: string;
    eyebrow: string;
    headerBand: { stat: string; label: string };
    title: string;
    panelP: number;
    itemBaseDelay: number;
    bulletDirection: -12 | 12;
  }) => {
    const { items, accent, eyebrow, headerBand, title, panelP, itemBaseDelay, bulletDirection } = opts;
    return (
      <div
        style={{
          background: t.colors.bgCardTint,
          border: `2px solid ${t.colors.bgCardTintBorder}`,
          borderTop: `6px solid ${accent}`,
          borderRadius: 12,
          padding: "26px 28px",
          boxShadow: t.shadows.card,
          opacity: interpolate(panelP, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(panelP, [0, 1], [32, 0])}px)`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header band — stat */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 14,
            borderBottom: `1px solid ${t.colors.bgCardTintBorder}`,
            paddingBottom: 14,
            marginBottom: 18,
          }}
        >
          <div
            style={{
              fontFamily: t.font.family,
              fontSize: 54,
              fontWeight: t.font.weight.bold,
              color: accent,
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            {headerBand.stat}
          </div>
          <div
            style={{
              fontFamily: t.font.family,
              fontSize: 24,
              fontWeight: t.font.weight.bold,
              color: t.colors.navy,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              lineHeight: 1.25,
              whiteSpace: "pre-line",
            }}
          >
            {headerBand.label}
          </div>
        </div>

        <div
          style={{
            fontFamily: t.font.family,
            fontSize: 16,
            fontWeight: t.font.weight.bold,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: accent,
            marginBottom: 6,
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            fontFamily: t.font.family,
            fontSize: 24,
            fontWeight: t.font.weight.bold,
            color: t.colors.navy,
            marginBottom: 18,
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {items.map((a, i) => {
            const itemP = spring({ frame: frame - itemBaseDelay - i * 24, fps, config: { damping: 200 } });
            return (
              <div
                key={a.title}
                style={{
                  paddingLeft: 22,
                  position: "relative",
                  opacity: interpolate(itemP, [0, 1], [0, 1]),
                  transform: `translateX(${interpolate(itemP, [0, 1], [bulletDirection, 0])}px)`,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 10,
                    width: 9,
                    height: 9,
                    borderRadius: 5,
                    background: accent,
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
                  <span style={{ fontWeight: t.font.weight.bold, color: t.colors.navy }}>{a.title}</span>{" "}
                  — {a.body}
                </div>
                <span style={citationStyle}>{a.cite}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

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
        The Comparative Landscape
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
        Cicero AIMSA Stands Alone
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginTop: 36, flex: 1 }}>
        {renderPanel({
          items: PRESERVING,
          accent: t.colors.blue,
          eyebrow: "Other State Approaches",
          headerBand: { stat: "4", label: "States Preserving\nBoard Authority" },
          title: "Preserve Existing Boards",
          panelP: leftP,
          itemBaseDelay: 40,
          bulletDirection: -12,
        })}
        {renderPanel({
          items: BYPASSING,
          accent: t.colors.orange,
          eyebrow: "Cicero AIMSA",
          headerBand: { stat: "1", label: "Model Bill\nBypassing" },
          title: "The Only Approach That Bypasses",
          panelP: rightP,
          itemBaseDelay: 200,
          bulletDirection: 12,
        })}
      </div>
    </AimsaContainer>
  );
};
