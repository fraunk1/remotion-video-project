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

  // Sequential card reveal — all three enter in the first ~1s of the slide.
  const cardDelays = [10, 22, 34];
  // Bottom adoption-pattern chip strip — also enters at slide start.
  const stripP = spring({ frame: frame - 46, fps, config: { damping: 200 } });

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
        One Architecture, Two State Bills
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
                background: t.colors.bgCardGray,
                border: `2px solid ${t.colors.bgCardGrayBorder}`,
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
                  borderTop: `1px dashed ${t.colors.bgCardGrayBorder}`,
                  textAlign: "center",
                }}
              >
                <span style={{ ...citationStyle, textAlign: "center", fontSize: 13 }}>{bill.url}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cicero track-record callout — Parallel Board pattern: gray card +
          orange left-border (NOT orange-tinted bg). */}
      <div
        style={{
          marginTop: 20,
          background: t.colors.bgCardGray,
          border: `2px solid ${t.colors.bgCardGrayBorder}`,
          borderLeft: `6px solid ${t.colors.orange}`,
          borderRadius: "0 12px 12px 0",
          padding: "18px 28px",
          fontFamily: t.font.family,
          fontSize: 22,
          fontStyle: "italic",
          fontWeight: t.font.weight.medium,
          color: t.colors.textBright,
          lineHeight: 1.45,
          opacity: interpolate(stripP, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(stripP, [0, 1], [8, 0])}px)`,
        }}
      >
        <span
          style={{
            display: "inline-block",
            fontSize: 18,
            fontWeight: t.font.weight.bold,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontStyle: "normal",
            marginRight: 16,
            verticalAlign: "middle",
            backgroundImage: `linear-gradient(90deg, ${t.colors.orange} 0%, ${t.colors.orange} 35%, #DEE9F2 50%, ${t.colors.orange} 65%, ${t.colors.orange} 100%)`,
            backgroundSize: "300% 100%",
            backgroundPosition: `${((frame % 120) / 120) * -300}% 50%`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            willChange: "background-position",
          }}
        >
          Cicero Track Record
        </span>
        Homelessness model bill introduced in 15 states, passed in 8 — AIMSA on the same trajectory.
      </div>
    </AimsaContainer>
  );
};
