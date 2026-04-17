import React from "react";
import { Img, staticFile, spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { FileText, Copy, PenTool, Feather } from "lucide-react";
import { MedReviewContainer } from "./MedReviewContainer";
import { medreviewTheme as t } from "./theme";

/**
 * Slide 7 — Reading Any Document. Four real document-scan images from
 * the synthetic OCR test corpus (clean / photocopy / handwritten print /
 * cursive), each with a Lucide icon badge and animated confidence gauge.
 */

const SAMPLES = [
  {
    label: "Clean Typed",
    src: "medreview-bg/doc_clean.jpg",
    conf: 0.97,
    accent: "#189ACF",
    accentBright: "#156082",
    Icon: FileText,
  },
  {
    label: "Photocopy",
    src: "medreview-bg/doc_photocopy.jpg",
    conf: 0.85,
    accent: "#FBAA29",
    accentBright: "#E8870F",
    Icon: Copy,
  },
  {
    label: "Handwritten Print",
    src: "medreview-bg/doc_handprint.jpg",
    conf: 0.76,
    accent: "#156082",
    accentBright: "#0E2841",
    Icon: PenTool,
  },
  {
    label: "Cursive",
    src: "medreview-bg/doc_cursive.jpg",
    conf: 0.62,
    accent: "#E8870F",
    accentBright: "#B45309",
    Icon: Feather,
  },
] as const;

export const MedReviewOCR: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const eyebrowP = spring({ frame, fps, config: { damping: 180 } });
  const titleP = spring({ frame: frame - 6, fps, config: { damping: 180 } });
  const cardDelays = [22, 38, 54, 70];
  const footerP = spring({ frame: frame - 120, fps, config: { damping: 180 } });

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
        OCR Capability
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
        Reading Any Document
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 28, marginTop: 48, flex: 1 }}>
        {SAMPLES.map((s, i) => {
          const p = spring({ frame: frame - cardDelays[i], fps, config: { damping: 180 } });
          const op = interpolate(p, [0, 1], [0, 1]);
          const y = interpolate(p, [0, 1], [28, 0]);
          // Confidence gauge fills in
          const gaugeProgress = spring({ frame: frame - (cardDelays[i] + 18), fps, config: { damping: 200 } });
          const gaugeWidth = interpolate(gaugeProgress, [0, 1], [0, s.conf * 100]);
          return (
            <div
              key={s.label}
              style={{
                background: t.colors.bgCard,
                border: `1px solid ${t.colors.border}`,
                borderRadius: 14,
                padding: 20,
                boxShadow: t.shadows.card,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
                opacity: op,
                transform: `translateY(${y}px)`,
              }}
            >
              {/* Gradient top border */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 5,
                  background: `linear-gradient(90deg, ${s.accent} 0%, ${s.accentBright} 100%)`,
                }}
              />

              {/* Icon + label header */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, marginTop: 6 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: `linear-gradient(135deg, ${s.accent} 0%, ${s.accentBright} 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 4px 12px ${s.accent}55`,
                  }}
                >
                  <s.Icon size={24} color="#FFFFFF" strokeWidth={2.2} />
                </div>
                <div
                  style={{
                    fontFamily: t.font.family,
                    fontSize: 22,
                    fontWeight: t.font.weight.bold,
                    color: t.colors.navy,
                  }}
                >
                  {s.label}
                </div>
              </div>

              {/* Real document image */}
              <div
                style={{
                  flex: 1,
                  borderRadius: 8,
                  overflow: "hidden",
                  border: `1px solid ${t.colors.border}`,
                  background: "#FAFAF8",
                  display: "flex",
                  alignItems: "stretch",
                  justifyContent: "center",
                  minHeight: 380,
                }}
              >
                <Img
                  src={staticFile(s.src)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top center",
                  }}
                />
              </div>

              {/* Confidence gauge */}
              <div style={{ marginTop: 16 }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
                  <div
                    style={{
                      fontFamily: t.font.family,
                      fontSize: 14,
                      fontWeight: t.font.weight.semibold,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: t.colors.textDim,
                    }}
                  >
                    Confidence
                  </div>
                  <div
                    style={{
                      fontFamily: t.font.family,
                      fontSize: 26,
                      fontWeight: t.font.weight.bold,
                      color: s.accent,
                    }}
                  >
                    {Math.round(interpolate(gaugeProgress, [0, 1], [0, s.conf * 100]))}%
                  </div>
                </div>
                <div
                  style={{
                    height: 8,
                    borderRadius: 4,
                    background: t.colors.bgCardAlt,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${gaugeWidth}%`,
                      background: `linear-gradient(90deg, ${s.accent} 0%, ${s.accentBright} 100%)`,
                      borderRadius: 4,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 22,
          fontFamily: t.font.family,
          fontSize: 22,
          color: t.colors.text,
          lineHeight: 1.45,
          ...lineIn(footerP, 14),
        }}
      >
        Printed text processed by{" "}
        <span style={{ color: t.colors.blueBright, fontWeight: t.font.weight.bold }}>Tesseract OCR</span>. Handwriting processed by{" "}
        <span style={{ color: t.colors.orangeBright, fontWeight: t.font.weight.bold }}>TrOCR</span> neural network.
      </div>
    </MedReviewContainer>
  );
};
