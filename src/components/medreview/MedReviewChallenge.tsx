import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { FolderOpen, Activity, Clock4, Sparkles } from "lucide-react";
import { MedReviewContainer } from "./MedReviewContainer";
import { medreviewTheme as t } from "./theme";

/**
 * Slide 3 — The Review Challenge. 3 polished cards with large Lucide
 * icons, gradient accents, and a pulsing "Sparkles" research-question
 * callout at the bottom.
 */
const CARDS = [
  {
    title: "Multiple Documents",
    detail: "Complaints, clinical records, imaging, labs, medication lists — all cross-referenced",
    color: "#189ACF",
    colorBright: "#156082",
    Icon: FolderOpen,
  },
  {
    title: "Complex Histories",
    detail: "Dozens of conditions, medications, and potential interactions to evaluate",
    color: "#FBAA29",
    colorBright: "#E8870F",
    Icon: Activity,
  },
  {
    title: "Limited Resources",
    detail: "Staff work tirelessly, but thorough review of complex cases takes significant time",
    color: "#0E2841",
    colorBright: "#156082",
    Icon: Clock4,
  },
] as const;

export const MedReviewChallenge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const eyebrowP = spring({ frame, fps, config: { damping: 180 } });
  const titleP = spring({ frame: frame - 6, fps, config: { damping: 180 } });
  const cardDelays = [22, 40, 58];
  const questionP = spring({ frame: frame - 84, fps, config: { damping: 180 } });

  // Subtle pulse on the icon containers — breathes between frames 80 and end
  const iconPulse = (offset: number) => {
    const t = (frame + offset) / 30;
    return 1 + Math.sin(t * 1.2) * 0.03;
  };

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
        Context
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
        The Review Challenge
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32, marginTop: 58, flex: 1 }}>
        {CARDS.map((c, i) => {
          const p = spring({ frame: frame - cardDelays[i], fps, config: { damping: 180 } });
          const op = interpolate(p, [0, 1], [0, 1]);
          const y = interpolate(p, [0, 1], [34, 0]);
          const pulse = iconPulse(i * 20);
          return (
            <div
              key={c.title}
              style={{
                background: t.colors.bgCard,
                border: `1px solid ${t.colors.border}`,
                borderRadius: 16,
                padding: "46px 36px 40px",
                boxShadow: t.shadows.card,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
                opacity: op,
                transform: `translateY(${y}px)`,
              }}
            >
              {/* Gradient top stripe */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 6,
                  background: `linear-gradient(90deg, ${c.colorBright} 0%, ${c.color} 100%)`,
                }}
              />
              {/* Icon tile — saturated bg + pulse */}
              <div
                style={{
                  width: 108,
                  height: 108,
                  borderRadius: 22,
                  background: `linear-gradient(135deg, ${c.color} 0%, ${c.colorBright} 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 26,
                  boxShadow: `0 12px 28px ${c.color}55`,
                  transform: `scale(${pulse})`,
                }}
              >
                <c.Icon size={56} color="#FFFFFF" strokeWidth={2.1} />
              </div>
              <div
                style={{
                  fontFamily: t.font.family,
                  fontSize: 36,
                  fontWeight: t.font.weight.bold,
                  color: t.colors.navy,
                  marginBottom: 14,
                  lineHeight: 1.15,
                }}
              >
                {c.title}
              </div>
              <div
                style={{
                  fontFamily: t.font.family,
                  fontSize: 22,
                  color: t.colors.text,
                  lineHeight: 1.5,
                }}
              >
                {c.detail}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 30,
          background: "linear-gradient(90deg, rgba(24, 154, 207, 0.16) 0%, rgba(24, 154, 207, 0.04) 100%)",
          border: `1px solid rgba(24, 154, 207, 0.28)`,
          borderLeft: `5px solid ${t.colors.blue}`,
          borderRadius: "0 12px 12px 0",
          padding: "20px 28px",
          display: "flex",
          alignItems: "center",
          gap: 18,
          ...lineIn(questionP, 14),
        }}
      >
        <Sparkles size={32} color={t.colors.blueBright} strokeWidth={2.2} />
        <div
          style={{
            fontFamily: t.font.family,
            fontSize: 24,
            fontStyle: "italic",
            color: t.colors.textBright,
            lineHeight: 1.4,
          }}
        >
          Can AI assist board staff in processing these complex cases? That is the research question MedReview is designed to explore.
        </div>
      </div>
    </MedReviewContainer>
  );
};
