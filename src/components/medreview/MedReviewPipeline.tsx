import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Inbox, ScanText, FileSearch, Stethoscope, FileCheck2 } from "lucide-react";
import { MedReviewContainer } from "./MedReviewContainer";
import { medreviewTheme as t } from "./theme";

/**
 * Slide 6 — How It Works. Five-stage horizontal pipeline with big
 * Lucide-iconed tiles and a gradient connector that draws in as a
 * stroked SVG path.
 */
const STAGES = [
  { label: "Documents In", detail: "Complaints · Records · Imaging", color: "#0E2841", colorBright: "#156082", Icon: Inbox },
  { label: "OCR", detail: "Tesseract + TrOCR", color: "#156082", colorBright: "#0E2841", Icon: ScanText },
  { label: "Clinical Analysis", detail: "Summaries + flagged concerns", color: "#189ACF", colorBright: "#156082", Icon: FileSearch },
  { label: "MedGemma", detail: "Chest X-ray interpretation", color: "#E8870F", colorBright: "#B45309", Icon: Stethoscope },
  { label: "Structured Report", detail: "Findings · severity · confidence", color: "#FBAA29", colorBright: "#E8870F", Icon: FileCheck2 },
];

export const MedReviewPipeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const eyebrowP = spring({ frame, fps, config: { damping: 180 } });
  const titleP = spring({ frame: frame - 6, fps, config: { damping: 180 } });
  const lineProgress = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const stageDelays = [26, 40, 54, 68, 82];

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
        Pipeline
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
        How It Works
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 20 }}>
        <div
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
            gap: 0,
            padding: "0 30px",
          }}
        >
          {/* SVG draw-on connector beneath the tiles */}
          <svg
            viewBox="0 0 1000 8"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              top: 78,
              left: "10%",
              right: "10%",
              width: "80%",
              height: 8,
              zIndex: 0,
            }}
          >
            <defs>
              <linearGradient id="pipe-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={STAGES[0].color} />
                <stop offset="50%" stopColor={STAGES[2].color} />
                <stop offset="100%" stopColor={STAGES[4].color} />
              </linearGradient>
            </defs>
            <line
              x1="0"
              y1="4"
              x2="1000"
              y2="4"
              stroke="url(#pipe-grad)"
              strokeWidth="5"
              strokeDasharray="1000"
              strokeDashoffset={interpolate(lineProgress, [0, 1], [1000, 0])}
              strokeLinecap="round"
            />
          </svg>

          {STAGES.map((s, i) => {
            const p = spring({ frame: frame - stageDelays[i], fps, config: { damping: 180 } });
            const tileScale = interpolate(p, [0, 1], [0.7, 1]);
            const textOp = interpolate(p, [0.4, 1], [0, 1]);
            const textY = interpolate(p, [0.4, 1], [16, 0]);
            return (
              <div key={s.label} style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                <div
                  style={{
                    width: 156,
                    height: 156,
                    borderRadius: 78,
                    background: `linear-gradient(135deg, ${s.colorBright} 0%, ${s.color} 100%)`,
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `5px solid ${t.colors.white}`,
                    boxShadow: `0 10px 26px ${s.color}66`,
                    transform: `scale(${tileScale})`,
                  }}
                >
                  <s.Icon size={66} color="#FFFFFF" strokeWidth={1.9} />
                </div>
                <div
                  style={{
                    fontFamily: t.font.family,
                    fontSize: 28,
                    fontWeight: t.font.weight.bold,
                    color: t.colors.navy,
                    marginTop: 24,
                    opacity: textOp,
                    transform: `translateY(${textY}px)`,
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontFamily: t.font.family,
                    fontSize: 18,
                    color: t.colors.text,
                    marginTop: 8,
                    lineHeight: 1.35,
                    opacity: textOp,
                    padding: "0 6px",
                  }}
                >
                  {s.detail}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MedReviewContainer>
  );
};
