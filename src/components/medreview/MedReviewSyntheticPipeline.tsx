import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Users, Brain, Microscope, ShieldCheck } from "lucide-react";
import { MedReviewContainer } from "./MedReviewContainer";
import { medreviewTheme as t, countUp } from "./theme";

/**
 * Slide 10 — The Synthetic Data Pipeline. Three numbered cards with big
 * Lucide icons, OUTPUT sub-boxes, gradient top borders, plus a bottom
 * stat strip with count-up "45 / 0" stats.
 */
const STEPS = [
  {
    n: "1",
    source: "Synthea by MITRE",
    body: "Open-source synthetic patient generator. Creates complete clinical histories — demographics, conditions, medications, encounters, procedures.",
    outputDetail: "45 synthetic patients with full medical records",
    color: "#189ACF",
    colorBright: "#156082",
    Icon: Users,
  },
  {
    n: "2",
    source: "Generated via Claude",
    body: "Anthropic’s Claude generates realistic complaints, discharge summaries, lab reports, and medication lists from each patient’s profile.",
    outputDetail: "200+ clinical documents across 45 cases",
    color: "#156082",
    colorBright: "#0E2841",
    Icon: Brain,
  },
  {
    n: "3",
    source: "NIH ChestX-ray14",
    body: "Real de-identified chest X-rays from the NIH Clinical Center (CC0 public domain), matched to cases by clinical finding.",
    outputDetail: "Matched X-rays for each cardiac case",
    color: "#FBAA29",
    colorBright: "#E8870F",
    Icon: Microscope,
  },
];

export const MedReviewSyntheticPipeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const eyebrowP = spring({ frame, fps, config: { damping: 180 } });
  const titleP = spring({ frame: frame - 6, fps, config: { damping: 180 } });
  const cardDelays = [22, 42, 62];
  const statP = spring({ frame: frame - 100, fps, config: { damping: 180 } });

  const count45 = countUp(frame, 108, 40, 45);
  const count0 = 0;

  const lineIn = (p: number, d = 24) => ({
    opacity: interpolate(p, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(p, [0, 1], [d, 0])}px)`,
  });

  return (
    <MedReviewContainer background="watermark">
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
        Methodology
      </div>
      <div
        style={{
          fontFamily: t.font.family,
          fontSize: 84,
          fontWeight: t.font.weight.bold,
          color: t.colors.navy,
          marginTop: 6,
          ...lineIn(titleP),
        }}
      >
        The Synthetic Data Pipeline
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 30, marginTop: 48, flex: 1 }}>
        {STEPS.map((s, i) => {
          const p = spring({ frame: frame - cardDelays[i], fps, config: { damping: 180 } });
          const op = interpolate(p, [0, 1], [0, 1]);
          const y = interpolate(p, [0, 1], [32, 0]);
          return (
            <div
              key={s.n}
              style={{
                background: t.colors.bgCard,
                border: `1px solid ${t.colors.border}`,
                borderRadius: 16,
                padding: "40px 30px 28px",
                boxShadow: t.shadows.card,
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                opacity: op,
                transform: `translateY(${y}px)`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 6,
                  background: `linear-gradient(90deg, ${s.colorBright} 0%, ${s.color} 100%)`,
                }}
              />

              {/* Icon tile — big, saturated */}
              <div
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: 20,
                  background: `linear-gradient(135deg, ${s.colorBright} 0%, ${s.color} 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 18,
                  boxShadow: `0 10px 22px ${s.color}50`,
                  position: "relative",
                }}
              >
                <s.Icon size={46} color="#FFFFFF" strokeWidth={2.1} />
                <div
                  style={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    background: t.colors.white,
                    color: s.color,
                    border: `3px solid ${s.color}`,
                    fontFamily: t.font.family,
                    fontSize: 20,
                    fontWeight: t.font.weight.bold,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {s.n}
                </div>
              </div>

              <div
                style={{
                  fontFamily: t.font.family,
                  fontSize: 26,
                  fontWeight: t.font.weight.bold,
                  color: t.colors.navy,
                  lineHeight: 1.2,
                }}
              >
                {s.source}
              </div>
              <div
                style={{
                  fontFamily: t.font.family,
                  fontSize: 19,
                  color: t.colors.text,
                  lineHeight: 1.5,
                  marginTop: 12,
                  flex: 1,
                }}
              >
                {s.body}
              </div>

              {/* OUTPUT sub-box with saturated fill */}
              <div
                style={{
                  background: `linear-gradient(135deg, ${s.colorBright} 0%, ${s.color} 100%)`,
                  borderRadius: 10,
                  padding: "14px 18px",
                  marginTop: 18,
                  boxShadow: `0 6px 16px ${s.color}40`,
                }}
              >
                <div
                  style={{
                    fontFamily: t.font.family,
                    fontSize: 14,
                    fontWeight: t.font.weight.bold,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(255, 255, 255, 0.85)",
                    marginBottom: 4,
                  }}
                >
                  Output
                </div>
                <div
                  style={{
                    fontFamily: t.font.family,
                    fontSize: 19,
                    color: t.colors.white,
                    fontWeight: t.font.weight.medium,
                    lineHeight: 1.3,
                  }}
                >
                  {s.outputDetail}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stat strip */}
      <div
        style={{
          marginTop: 26,
          background: t.colors.bgCard,
          border: `1px solid ${t.colors.border}`,
          borderRadius: 14,
          padding: "22px 30px",
          display: "grid",
          gridTemplateColumns: "auto 1fr auto auto",
          gap: 32,
          alignItems: "center",
          boxShadow: t.shadows.card,
          position: "relative",
          overflow: "hidden",
          opacity: interpolate(statP, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(statP, [0, 1], [14, 0])}px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: 5,
            background: `linear-gradient(180deg, ${t.colors.green} 0%, ${t.colors.blue} 100%)`,
          }}
        />
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: `linear-gradient(135deg, ${t.colors.green} 0%, #0f6432 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 8,
          }}
        >
          <ShieldCheck size={26} color="#FFFFFF" strokeWidth={2.2} />
        </div>
        <div style={{ fontFamily: t.font.family, fontSize: 20, color: t.colors.textBright, lineHeight: 1.45 }}>
          <span style={{ fontWeight: t.font.weight.bold, color: t.colors.green }}>Why synthetic:</span>{" "}
          Patient privacy fully protected. No IRB required. Safe to share. Reproducible across teams.
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: t.font.family, fontSize: 54, fontWeight: t.font.weight.bold, color: t.colors.blue, lineHeight: 1 }}>
            {Math.round(count45)}
          </div>
          <div style={{ fontFamily: t.font.family, fontSize: 14, color: t.colors.textDim, letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 4 }}>
            Complete cases
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: t.font.family, fontSize: 54, fontWeight: t.font.weight.bold, color: t.colors.orange, lineHeight: 1 }}>
            {count0}
          </div>
          <div style={{ fontFamily: t.font.family, fontSize: 14, color: t.colors.textDim, letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 4 }}>
            Real patient data
          </div>
        </div>
      </div>
    </MedReviewContainer>
  );
};
