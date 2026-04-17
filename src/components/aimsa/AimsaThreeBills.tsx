import React from "react";
import { Img, staticFile, spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { AimsaContainer } from "./AimsaContainer";
import { aimsaTheme as t, citationStyle } from "./theme";

/**
 * Slide 4 — KEY source-veracity slide. Shows all three bills as document
 * thumbnails alongside their source URLs and metadata.
 */

type Bill = {
  name: string;
  shortLabel: string;
  url: string;
  thumb: string;
  meta: string[];
  color: string;
};

const BILLS: Bill[] = [
  {
    name: "Cicero AIMSA",
    shortLabel: "Model Bill",
    url: "ciceroinstitute.org/research/ai-medical-services-act/",
    thumb: "aimsa-bg/cicero-model-p1.png",
    meta: [
      "Released: January 2026",
      "28 pages · 14 sections",
      "Sponsor: Cicero Institute (think tank)",
    ],
    color: t.colors.navy,
  },
  {
    name: "Idaho HB 945",
    shortLabel: "Idaho",
    url: "legislature.idaho.gov/sessioninfo/2026/legislation/H0945/",
    thumb: "aimsa-bg/idaho-hb945-p1.png",
    meta: [
      "Introduced: Feb 2026",
      "Committee: Ways & Means",
      "Effective: July 1, 2026 (emergency clause)",
    ],
    color: t.colors.blue,
  },
  {
    name: "Iowa HSB 766",
    shortLabel: "Iowa",
    url: "legis.iowa.gov/legislation/BillBook?ga=91&ba=HSB766",
    thumb: "aimsa-bg/iowa-hsb766-p1.png",
    meta: [
      "Introduced: Feb 2026",
      "Committee: Appropriations",
      "Embedded in Ch. 147 · adds anti-dissolution clause",
    ],
    color: t.colors.orange,
  },
];

export const AimsaThreeBills: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const eyebrowP = spring({ frame, fps, config: { damping: 180 } });
  const h2P = spring({ frame: frame - 6, fps, config: { damping: 180 } });

  const lineIn = (p: number, d = 24) => ({
    opacity: interpolate(p, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(p, [0, 1], [d, 0])}px)`,
  });

  // Sequential card reveal — each with its own spring delay.
  const cardDelays = [10, 150, 280];
  // Bottom adoption-pattern chip strip — narration mentions multi-state
  // pattern around frame 480 (16s into the slide).
  const stripP = spring({ frame: frame - 480, fps, config: { damping: 200 } });

  return (
    <AimsaContainer background="watermark">
      <div
        style={{
          fontFamily: t.font.family,
          fontSize: 24,
          fontWeight: t.font.weight.semibold,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: t.colors.blue,
          ...lineIn(eyebrowP),
        }}
      >
        What's in Play
      </div>
      <div
        style={{
          fontFamily: t.font.family,
          fontSize: 66,
          fontWeight: t.font.weight.bold,
          color: t.colors.navy,
          marginTop: 4,
          lineHeight: 1.05,
          ...lineIn(h2P),
        }}
      >
        Three Bills, One Architecture
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginTop: 24, flex: 1, minHeight: 0 }}>
        {BILLS.map((bill, i) => {
          const p = spring({ frame: frame - cardDelays[i], fps, config: { damping: 180 } });
          const enter = {
            opacity: interpolate(p, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(p, [0, 1], [0.96, 1])})`,
          };
          return (
            <div
              key={bill.name}
              style={{
                background: t.colors.bgCardTint,
                border: `2px solid ${t.colors.bgCardTintBorder}`,
                borderTop: `6px solid ${bill.color}`,
                borderRadius: 14,
                padding: "20px 22px",
                boxShadow: t.shadows.card,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minHeight: 0,
                ...enter,
              }}
            >
              <div
                style={{
                  fontFamily: t.font.family,
                  fontSize: 19,
                  fontWeight: t.font.weight.bold,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: bill.color,
                  marginBottom: 6,
                }}
              >
                {bill.shortLabel}
              </div>
              <div
                style={{
                  fontFamily: t.font.family,
                  fontSize: 28,
                  fontWeight: t.font.weight.bold,
                  color: t.colors.navy,
                  marginBottom: 14,
                  textAlign: "center",
                  lineHeight: 1.1,
                }}
              >
                {bill.name}
              </div>

              {/* Document thumbnail — larger, no bleaching overlay */}
              <div
                style={{
                  width: "100%",
                  aspectRatio: "0.773",
                  maxHeight: 340,
                  border: `1px solid ${t.colors.border}`,
                  borderRadius: 4,
                  boxShadow: t.shadows.doc,
                  overflow: "hidden",
                  background: t.colors.white,
                  marginBottom: 14,
                  position: "relative",
                }}
              >
                <Img
                  src={staticFile(bill.thumb)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top center",
                  }}
                />
              </div>

              {/* Metadata */}
              <div
                style={{
                  width: "100%",
                  fontFamily: t.font.family,
                  fontSize: 24,
                  color: t.colors.text,
                  lineHeight: 1.5,
                  marginBottom: 10,
                }}
              >
                {bill.meta.map((m, mi) => (
                  <div key={mi} style={{ marginBottom: 2 }}>{m}</div>
                ))}
              </div>

              {/* Source URL — visible citation */}
              <div
                style={{
                  width: "100%",
                  marginTop: "auto",
                  paddingTop: 8,
                  borderTop: `1px dashed ${t.colors.bgCardTintBorder}`,
                  textAlign: "center",
                }}
              >
                <span style={{ ...citationStyle, textAlign: "center", fontSize: 13 }}>{bill.url}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom adoption-pattern chip strip — fills whitespace with substance */}
      <div
        style={{
          marginTop: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "stretch",
          gap: 12,
          opacity: interpolate(stripP, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(stripP, [0, 1], [16, 0])}px)`,
        }}
      >
        <AdoptionChip label="Model bill released" value="January 2026" accent={t.colors.navy} />
        <AdoptionChip label="States introduced" value="Idaho · Iowa" accent={t.colors.blue} />
        <AdoptionChip label="Cicero track record" value="15 introduced → 8 passed" accent={t.colors.orange} />
        <AdoptionChip label="Reciprocity mechanism" value="Built into every bill" accent="#C98A2B" />
      </div>
    </AimsaContainer>
  );
};

const AdoptionChip: React.FC<{ label: string; value: string; accent: string }> = ({ label, value, accent }) => (
  <div
    style={{
      flex: 1,
      background: t.colors.bgCardTint,
      border: `2px solid ${t.colors.bgCardTintBorder}`,
      borderLeft: `4px solid ${accent}`,
      borderRadius: 10,
      padding: "10px 14px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        fontFamily: t.font.family,
        fontSize: 14,
        fontWeight: t.font.weight.bold,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: accent,
        marginBottom: 4,
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontFamily: t.font.family,
        fontSize: 19,
        fontWeight: t.font.weight.semibold,
        color: t.colors.navy,
        lineHeight: 1.2,
      }}
    >
      {value}
    </div>
  </div>
);
