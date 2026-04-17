import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { FileText, FileBarChart, Pill, FileWarning, Image as ImageIcon, AlertTriangle } from "lucide-react";
import { MedReviewContainer } from "./MedReviewContainer";
import { medreviewTheme as t, countUp } from "./theme";

/**
 * Slide 2 — A Complaint Arrives. Werner case card + documents card +
 * allegation banner. Uses Lucide icons for documents and a count-up
 * animation on the 52 conditions / 103 medications stats.
 */

const DOCUMENTS: { label: string; Icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>; color: string }[] = [
  { label: "Complaint Narrative (2,454 characters)", Icon: FileText, color: "#189ACF" },
  { label: "Discharge Summary", Icon: FileBarChart, color: "#156082" },
  { label: "Medication List (103 medications)", Icon: Pill, color: "#FBAA29" },
  { label: "Progress Note + Lab Report", Icon: FileWarning, color: "#189ACF" },
  { label: "Chest X-Ray", Icon: ImageIcon, color: "#E8870F" },
];

export const MedReviewComplaintArrives: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const eyebrowP = spring({ frame, fps, config: { damping: 180 } });
  const titleP = spring({ frame: frame - 6, fps, config: { damping: 180 } });
  const allegP = spring({ frame: frame - 16, fps, config: { damping: 180 } });
  const card1P = spring({ frame: frame - 28, fps, config: { damping: 180 } });
  const card2P = spring({ frame: frame - 40, fps, config: { damping: 180 } });

  const conditions = countUp(frame, 40, 40, 52);
  const medications = countUp(frame, 55, 45, 103);

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
        The Scenario
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
        A Complaint Arrives
      </div>

      {/* Allegation banner with warning icon */}
      <div
        style={{
          marginTop: 30,
          background: "linear-gradient(90deg, rgba(251, 170, 41, 0.18) 0%, rgba(251, 170, 41, 0.06) 100%)",
          borderLeft: `6px solid ${t.colors.orange}`,
          borderRadius: "0 12px 12px 0",
          padding: "20px 26px",
          display: "flex",
          alignItems: "center",
          gap: 22,
          ...lineIn(allegP, 16),
        }}
      >
        <AlertTriangle size={52} color={t.colors.orangeBright} strokeWidth={2.2} />
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: t.font.family,
              fontSize: 18,
              fontWeight: t.font.weight.bold,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: t.colors.orangeBright,
              marginBottom: 4,
            }}
          >
            Allegation
          </div>
          <div
            style={{
              fontFamily: t.font.family,
              fontSize: 24,
              color: t.colors.textBright,
              lineHeight: 1.35,
            }}
          >
            Delayed recognition during a myocardial infarction, polypharmacy without adequate interaction monitoring, and reactive rather than proactive cardiac care.
          </div>
        </div>
      </div>

      {/* Two cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 36, marginTop: 30, flex: 1 }}>
        {/* Case card with count-up stats */}
        <div
          style={{
            background: t.colors.bgCard,
            border: `1px solid ${t.colors.border}`,
            borderRadius: 14,
            padding: "28px 34px",
            boxShadow: t.shadows.card,
            position: "relative",
            overflow: "hidden",
            opacity: interpolate(card1P, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(card1P, [0, 1], [28, 0])}px)`,
          }}
        >
          {/* Gradient top border */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 6,
              background: `linear-gradient(90deg, ${t.colors.blue} 0%, ${t.colors.navy} 100%)`,
            }}
          />
          <div
            style={{
              fontFamily: t.font.family,
              fontSize: 18,
              fontWeight: t.font.weight.bold,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: t.colors.blueBright,
              marginBottom: 6,
            }}
          >
            Case MR-20260408-1C07BF
          </div>
          <div
            style={{
              fontFamily: t.font.family,
              fontSize: 34,
              fontWeight: t.font.weight.bold,
              color: t.colors.navy,
              marginBottom: 4,
            }}
          >
            Werner Cruickshank
          </div>
          <div
            style={{
              fontFamily: t.font.family,
              fontSize: 20,
              color: t.colors.textDim,
              marginBottom: 20,
            }}
          >
            65-year-old male · Dr. Samuel Harding, PCP
          </div>

          {/* Count-up stat row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
            <div
              style={{
                background: t.colors.bgCardAlt,
                borderRadius: 10,
                padding: "18px 20px",
                borderLeft: `5px solid ${t.colors.blue}`,
              }}
            >
              <div style={{ fontFamily: t.font.family, fontSize: 64, fontWeight: t.font.weight.bold, color: t.colors.blue, lineHeight: 1 }}>
                {Math.round(conditions)}
              </div>
              <div style={{ fontFamily: t.font.family, fontSize: 18, color: t.colors.textDim, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 6 }}>
                Conditions
              </div>
            </div>
            <div
              style={{
                background: t.colors.bgCardAlt,
                borderRadius: 10,
                padding: "18px 20px",
                borderLeft: `5px solid ${t.colors.orange}`,
              }}
            >
              <div style={{ fontFamily: t.font.family, fontSize: 64, fontWeight: t.font.weight.bold, color: t.colors.orange, lineHeight: 1 }}>
                {Math.round(medications)}
              </div>
              <div style={{ fontFamily: t.font.family, fontSize: 18, color: t.colors.textDim, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 6 }}>
                Medications
              </div>
            </div>
          </div>

          <div style={{ fontFamily: t.font.family, fontSize: 19, color: t.colors.text, lineHeight: 1.5 }}>
            <div><span style={{ color: t.colors.blueBright, fontWeight: t.font.weight.semibold }}>History:</span> MI, CHF, obesity, hypertension</div>
            <div style={{ marginTop: 4 }}><span style={{ color: t.colors.orangeBright, fontWeight: t.font.weight.semibold }}>On:</span> Aspirin, Metoprolol, Simvastatin, Furosemide, +99</div>
          </div>
        </div>

        {/* Documents card with Lucide icons */}
        <div
          style={{
            background: t.colors.bgCard,
            border: `1px solid ${t.colors.border}`,
            borderRadius: 14,
            padding: "28px 30px",
            boxShadow: t.shadows.card,
            position: "relative",
            overflow: "hidden",
            opacity: interpolate(card2P, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(card2P, [0, 1], [28, 0])}px)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 6,
              background: `linear-gradient(90deg, ${t.colors.orange} 0%, ${t.colors.orangeBright} 100%)`,
            }}
          />
          <div
            style={{
              fontFamily: t.font.family,
              fontSize: 30,
              fontWeight: t.font.weight.bold,
              color: t.colors.navy,
              marginBottom: 18,
              marginTop: 4,
            }}
          >
            Documents Submitted
          </div>
          {DOCUMENTS.map(({ label, Icon, color }, i) => {
            const p = spring({ frame: frame - (50 + i * 7), fps, config: { damping: 180 } });
            return (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "10px 4px",
                  borderBottom: i < DOCUMENTS.length - 1 ? `1px solid ${t.colors.border}` : "none",
                  opacity: interpolate(p, [0, 1], [0, 1]),
                  transform: `translateX(${interpolate(p, [0, 1], [-14, 0])}px)`,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: `${color}1f`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={24} color={color} strokeWidth={2.2} />
                </div>
                <div style={{ fontFamily: t.font.family, fontSize: 22, color: t.colors.textBright, lineHeight: 1.3 }}>
                  {label}
                </div>
              </div>
            );
          })}
          <div
            style={{
              fontFamily: t.font.family,
              fontSize: 16,
              fontStyle: "italic",
              color: t.colors.textDim,
              marginTop: 16,
              textAlign: "center",
            }}
          >
            Built entirely from synthetic data. No real patient information.
          </div>
        </div>
      </div>
    </MedReviewContainer>
  );
};
