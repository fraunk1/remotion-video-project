import React from "react";
import { Img, staticFile, spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { AlertTriangle, Gauge, ListChecks } from "lucide-react";
import { MedReviewContainer } from "./MedReviewContainer";
import { medreviewTheme as t, countUp } from "./theme";

/**
 * Slide 8 — What the AI Found. Browser-framed MedReview screenshot
 * (2/3 width, left) plus three saturated stat cards (1/3 width, right)
 * for severity · confidence · findings, with animated count-ups on
 * the numeric stats and Lucide icons.
 */
const STATS = [
  { value: "MEDIUM", label: "Severity", color: "#FBAA29", colorBright: "#E8870F", Icon: AlertTriangle, numeric: false },
  { value: 80, label: "Confidence", color: "#189ACF", colorBright: "#156082", Icon: Gauge, numeric: true, suffix: "%" },
  { value: 7, label: "Findings", color: "#0E2841", colorBright: "#156082", Icon: ListChecks, numeric: true, suffix: "" },
] as const;

export const MedReviewCaseAnalysis: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const eyebrowP = spring({ frame, fps, config: { damping: 180 } });
  const titleP = spring({ frame: frame - 6, fps, config: { damping: 180 } });
  const imgP = spring({ frame: frame - 16, fps, config: { damping: 180 } });
  const statDelays = [32, 50, 68];
  const capP = spring({ frame: frame - 90, fps, config: { damping: 180 } });

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
        Case Analysis
      </div>
      <div
        style={{
          fontFamily: t.font.family,
          fontSize: 92,
          fontWeight: t.font.weight.bold,
          color: t.colors.navy,
          marginTop: 6,
          ...lineIn(titleP),
        }}
      >
        What the AI Found
      </div>

      {/* Screenshot + stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2.2fr 1fr",
          gap: 44,
          marginTop: 40,
          flex: 1,
          alignItems: "flex-start",
        }}
      >
        {/* Browser-framed screenshot */}
        <div
          style={{
            opacity: interpolate(imgP, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(imgP, [0, 1], [26, 0])}px) scale(${interpolate(imgP, [0, 1], [0.98, 1])})`,
          }}
        >
          <div
            style={{
              borderRadius: 14,
              overflow: "hidden",
              border: `1px solid ${t.colors.border}`,
              boxShadow: t.shadows.cardPop,
              background: t.colors.bgCard,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 16px",
                background: "#EDF0F5",
                borderBottom: `1px solid ${t.colors.border}`,
              }}
            >
              {["#E0635C", "#ECB442", "#62C465"].map((c) => (
                <div key={c} style={{ width: 12, height: 12, borderRadius: 6, background: c }} />
              ))}
              <div
                style={{
                  marginLeft: 12,
                  fontFamily: '"Courier New", Consolas, monospace',
                  fontSize: 15,
                  color: t.colors.textDim,
                }}
              >
                medreview / cases / werner-cruickshank / analysis
              </div>
            </div>
            <Img
              src={staticFile("medreview-bg/werner_analysis.png")}
              style={{ display: "block", width: "100%", height: "auto" }}
            />
          </div>
        </div>

        {/* Stat stack */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {STATS.map((s, i) => {
            const p = spring({ frame: frame - statDelays[i], fps, config: { damping: 180 } });
            const op = interpolate(p, [0, 1], [0, 1]);
            const y = interpolate(p, [0, 1], [24, 0]);
            const displayValue = s.numeric
              ? `${Math.round(countUp(frame, statDelays[i] + 8, 30, s.value as number))}${s.suffix ?? ""}`
              : s.value;
            return (
              <div
                key={s.label}
                style={{
                  background: t.colors.bgCard,
                  border: `1px solid ${t.colors.border}`,
                  borderRadius: 14,
                  padding: "22px 24px",
                  boxShadow: t.shadows.card,
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  opacity: op,
                  transform: `translateY(${y}px)`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: 6,
                    background: `linear-gradient(180deg, ${s.color} 0%, ${s.colorBright} 100%)`,
                  }}
                />
                <div
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: 16,
                    background: `linear-gradient(135deg, ${s.colorBright} 0%, ${s.color} 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 6px 16px ${s.color}55`,
                    flexShrink: 0,
                    marginLeft: 4,
                  }}
                >
                  <s.Icon size={36} color="#FFFFFF" strokeWidth={2.2} />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: t.font.family,
                      fontSize: s.numeric ? 56 : 40,
                      fontWeight: t.font.weight.bold,
                      color: s.color,
                      lineHeight: 1,
                      letterSpacing: s.numeric ? 0 : "0.02em",
                    }}
                  >
                    {displayValue}
                  </div>
                  <div
                    style={{
                      fontFamily: t.font.family,
                      fontSize: 18,
                      fontWeight: t.font.weight.semibold,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: t.colors.navy,
                      marginTop: 6,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Source caption */}
      <div
        style={{
          marginTop: 22,
          fontFamily: t.font.family,
          fontSize: 22,
          color: t.colors.textDim,
          letterSpacing: "0.04em",
          ...lineIn(capP, 14),
        }}
      >
        Werner Cruickshank case · Imaging via MedGemma · X-rays from NIH ChestX-ray14 (CC0)
      </div>
    </MedReviewContainer>
  );
};
