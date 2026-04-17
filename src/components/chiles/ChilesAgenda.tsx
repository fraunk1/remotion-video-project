import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { ChilesContainer } from "./ChilesContainer";
import { chilesTheme as t } from "./theme";

const PILLARS = [
  { num: "I", color: t.colors.blue, title: "The Case", desc: "Colorado's MCTL, Ms. Chiles, and the circuit split" },
  { num: "II", color: t.colors.orange, title: "The Decision", desc: "8–1 holding, Gorsuch's reasoning, the split opinions" },
  { num: "III", color: t.colors.blue, title: "Impact on Boards", desc: "What survives, what's now at risk" },
  { num: "IV", color: t.colors.orange, title: "Hypotheticals", desc: "Four scenarios to test the new rule" },
];

export const ChilesAgenda: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerProgress = spring({ frame, fps, config: { damping: 180 } });
  const headerLine = (p: number) => ({
    opacity: interpolate(p, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px)`,
  });

  return (
    <ChilesContainer background="watermark">
      <div
        style={{
          fontFamily: t.font.family,
          fontSize: 26,
          fontWeight: t.font.weight.semibold,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: t.colors.blue,
          ...headerLine(headerProgress),
        }}
      >
        What we'll cover
      </div>
      <div
        style={{
          fontFamily: t.font.family,
          fontSize: 108,
          fontWeight: t.font.weight.bold,
          color: t.colors.navy,
          marginTop: 8,
          ...headerLine(spring({ frame: frame - 6, fps, config: { damping: 180 } })),
        }}
      >
        Agenda
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 40,
          marginTop: 90,
          flex: 1,
        }}
      >
        {PILLARS.map((p, i) => {
          const pr = spring({ frame: frame - 20 - i * 10, fps, config: { damping: 180 } });
          const enter = {
            opacity: interpolate(pr, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(pr, [0, 1], [60, 0])}px)`,
          };
          return (
            <div
              key={p.num}
              style={{
                background: t.colors.white,
                border: `1px solid ${t.colors.border}`,
                borderTop: `6px solid ${p.color}`,
                borderRadius: 14,
                padding: "48px 36px",
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
                  fontSize: 130,
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
                  fontSize: 32,
                  fontWeight: t.font.weight.bold,
                  color: t.colors.navy,
                  marginTop: 28,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {p.title}
              </div>
              <div
                style={{
                  fontFamily: t.font.family,
                  fontSize: 24,
                  color: t.colors.text,
                  marginTop: 20,
                  lineHeight: 1.5,
                }}
              >
                {p.desc}
              </div>
            </div>
          );
        })}
      </div>
    </ChilesContainer>
  );
};
