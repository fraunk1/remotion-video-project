import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { AimsaContainer } from "./AimsaContainer";
import { aimsaTheme as t } from "./theme";

const PILLARS = [
  {
    num: "I",
    color: t.colors.blue,
    title: "The Bills",
    desc: "Cicero model + Idaho HB 945 + Iowa HSB 766",
  },
  {
    num: "II",
    color: t.colors.orange,
    title: "The Headline",
    desc: "A parallel board that bypasses existing medical boards",
  },
  {
    num: "III",
    color: t.colors.blue,
    title: "Considerations",
    desc: "The structural design of the regime",
  },
  {
    num: "IV",
    color: t.colors.orange,
    title: "Implications",
    desc: "Comparative landscape, FDA limits, FSMB response",
  },
];

export const AimsaAgenda: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerProgress = spring({ frame, fps, config: { damping: 180 } });
  const headerLine = (p: number) => ({
    opacity: interpolate(p, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px)`,
  });

  const calloutP = spring({ frame: frame - 60, fps, config: { damping: 200 } });

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
          ...headerLine(headerProgress),
        }}
      >
        Roadmap
      </div>
      <div
        style={{
          fontFamily: t.font.family,
          fontSize: 92,
          fontWeight: t.font.weight.bold,
          color: t.colors.navy,
          marginTop: 4,
          lineHeight: 1.0,
          ...headerLine(spring({ frame: frame - 6, fps, config: { damping: 180 } })),
        }}
      >
        Agenda
      </div>

      {/* 4 pillar cards — the agenda itself */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 24,
          marginTop: 48,
        }}
      >
        {PILLARS.map((p, i) => {
          const pr = spring({ frame: frame - 20 - i * 10, fps, config: { damping: 180 } });
          const enter = {
            opacity: interpolate(pr, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(pr, [0, 1], [40, 0])}px)`,
          };
          return (
            <div
              key={p.num}
              style={{
                background: t.colors.bgCardGray,
                border: `2px solid ${t.colors.bgCardGrayBorder}`,
                borderTop: `6px solid ${p.color}`,
                borderRadius: 14,
                padding: "28px 26px",
                boxShadow: t.shadows.card,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                ...enter,
              }}
            >
              <div
                style={{
                  fontFamily: t.font.family,
                  fontSize: 102,
                  fontWeight: t.font.weight.bold,
                  color: p.color,
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                {p.num}
              </div>
              <div
                style={{
                  fontFamily: t.font.family,
                  fontSize: 26,
                  fontWeight: t.font.weight.bold,
                  color: t.colors.navy,
                  marginTop: 18,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {p.title}
              </div>
              <div
                style={{
                  fontFamily: t.font.family,
                  fontSize: 22,
                  color: t.colors.text,
                  marginTop: 14,
                  lineHeight: 1.45,
                }}
              >
                {p.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Single key-facts callout — Parallel Board pattern: gray card +
          orange left-border (NOT orange-tinted bg). */}
      <div
        style={{
          marginTop: "auto",
          marginBottom: 8,
          background: t.colors.bgCardGray,
          border: `2px solid ${t.colors.bgCardGrayBorder}`,
          borderLeft: `6px solid ${t.colors.orange}`,
          borderRadius: "0 14px 14px 0",
          padding: "22px 32px",
          display: "flex",
          alignItems: "center",
          gap: 26,
          opacity: interpolate(calloutP, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(calloutP, [0, 1], [12, 0])}px)`,
        }}
      >
        <div
          style={{
            flex: "0 0 auto",
            fontFamily: t.font.family,
            fontSize: 18,
            fontWeight: t.font.weight.bold,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            backgroundImage: `linear-gradient(90deg, ${t.colors.orange} 0%, ${t.colors.orange} 35%, #DEE9F2 50%, ${t.colors.orange} 65%, ${t.colors.orange} 100%)`,
            backgroundSize: "300% 100%",
            backgroundPosition: `${((frame % 120) / 120) * -300}% 50%`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            willChange: "background-position",
          }}
        >
          Why This Briefing Now
        </div>
        <div
          style={{
            flex: 1,
            fontFamily: t.font.family,
            fontSize: 24,
            fontStyle: "italic",
            fontWeight: t.font.weight.medium,
            color: t.colors.textBright,
            lineHeight: 1.45,
          }}
        >
          Cicero model released January 2026 · Idaho HB 945 and Iowa HSB 766 introduced ·
          expect 8–15 more state introductions over 12–18 months.
        </div>
      </div>
    </AimsaContainer>
  );
};
