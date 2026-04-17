import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Check, HelpCircle, TrendingUp, FileStack, Gauge, Target } from "lucide-react";
import { MedReviewContainer } from "./MedReviewContainer";
import { medreviewTheme as t, countUp, formatStat } from "./theme";

/**
 * Slide 11 — Where We Are. Four count-up stat tiles, then two-column
 * lists (What's Working with green check badges / What We Don't Know Yet
 * with orange question badges).
 */

const STATS = [
  { target: 45, decimals: 0, suffix: "", label: "Synthetic cases built", color: "#189ACF", Icon: FileStack },
  { target: 200, decimals: 0, suffix: "+", label: "Documents processed", color: "#FBAA29", Icon: TrendingUp },
  { target: 0.85, decimals: 2, suffix: "", label: "Avg. confidence score", color: "#156082", Icon: Gauge },
  { target: 3, decimals: 0, suffix: "", label: "Findings per case (avg)", color: "#E8870F", Icon: Target },
];

const WORKING = [
  "Identifies clinical findings from docs + imaging",
  "Produces severity ratings + confidence scores",
  "OCR handles any document quality",
  "Structured reports ready for review",
];

const UNKNOWN = [
  "Are findings clinically accurate?",
  "Are severity ratings appropriate?",
  "What does the AI miss?",
  "Where does the AI hallucinate?",
];

export const MedReviewStatus: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const eyebrowP = spring({ frame, fps, config: { damping: 180 } });
  const titleP = spring({ frame: frame - 6, fps, config: { damping: 180 } });
  const statAppearDelays = [16, 24, 32, 40];
  const statCountDelays = [24, 32, 40, 48];
  const workingP = spring({ frame: frame - 72, fps, config: { damping: 180 } });
  const unknownP = spring({ frame: frame - 88, fps, config: { damping: 180 } });

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
        Status
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
        Where We Are
      </div>

      {/* Stat row with count-ups */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 24, marginTop: 40 }}>
        {STATS.map((s, i) => {
          const p = spring({ frame: frame - statAppearDelays[i], fps, config: { damping: 180 } });
          const value = countUp(frame, statCountDelays[i], 36, s.target);
          const op = interpolate(p, [0, 1], [0, 1]);
          const y = interpolate(p, [0, 1], [22, 0]);
          return (
            <div
              key={s.label}
              style={{
                background: t.colors.bgCard,
                border: `1px solid ${t.colors.border}`,
                borderRadius: 14,
                padding: "22px 24px 20px",
                position: "relative",
                overflow: "hidden",
                boxShadow: t.shadows.card,
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
                  height: 5,
                  background: `linear-gradient(90deg, ${s.color} 0%, ${s.color}aa 100%)`,
                }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 4 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: `${s.color}1a`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <s.Icon size={22} color={s.color} strokeWidth={2.2} />
                </div>
                <div
                  style={{
                    fontFamily: t.font.family,
                    fontSize: 72,
                    fontWeight: t.font.weight.bold,
                    color: s.color,
                    lineHeight: 1,
                  }}
                >
                  {formatStat(value, s.decimals, s.suffix)}
                </div>
              </div>
              <div
                style={{
                  fontFamily: t.font.family,
                  fontSize: 17,
                  color: t.colors.text,
                  marginTop: 14,
                  lineHeight: 1.3,
                }}
              >
                {s.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Two columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, marginTop: 36, flex: 1 }}>
        <div
          style={{
            background: "linear-gradient(135deg, rgba(21, 128, 61, 0.10) 0%, rgba(21, 128, 61, 0.02) 100%)",
            border: "1px solid rgba(21, 128, 61, 0.26)",
            borderRadius: 14,
            padding: "24px 28px",
            opacity: interpolate(workingP, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(workingP, [0, 1], [22, 0])}px)`,
          }}
        >
          <div
            style={{
              fontFamily: t.font.family,
              fontSize: 28,
              fontWeight: t.font.weight.bold,
              color: t.colors.green,
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: t.colors.green,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Check size={22} color="#FFFFFF" strokeWidth={3} />
            </div>
            What’s Working
          </div>
          {WORKING.map((w, i) => {
            const itemP = spring({ frame: frame - (78 + i * 6), fps, config: { damping: 180 } });
            return (
              <div
                key={w}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "10px 0",
                  borderBottom: i < WORKING.length - 1 ? "1px solid rgba(21, 128, 61, 0.14)" : "none",
                  fontFamily: t.font.family,
                  fontSize: 22,
                  color: t.colors.textBright,
                  lineHeight: 1.35,
                  opacity: interpolate(itemP, [0, 1], [0, 1]),
                  transform: `translateX(${interpolate(itemP, [0, 1], [-12, 0])}px)`,
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    background: t.colors.green,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Check size={16} color="#FFFFFF" strokeWidth={3} />
                </div>
                {w}
              </div>
            );
          })}
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, rgba(251, 170, 41, 0.12) 0%, rgba(251, 170, 41, 0.02) 100%)",
            border: "1px solid rgba(251, 170, 41, 0.32)",
            borderRadius: 14,
            padding: "24px 28px",
            opacity: interpolate(unknownP, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(unknownP, [0, 1], [22, 0])}px)`,
          }}
        >
          <div
            style={{
              fontFamily: t.font.family,
              fontSize: 28,
              fontWeight: t.font.weight.bold,
              color: t.colors.orangeBright,
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: t.colors.orangeBright,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <HelpCircle size={22} color="#FFFFFF" strokeWidth={2.4} />
            </div>
            What We Don’t Know Yet
          </div>
          {UNKNOWN.map((u, i) => {
            const itemP = spring({ frame: frame - (94 + i * 6), fps, config: { damping: 180 } });
            return (
              <div
                key={u}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "10px 0",
                  borderBottom: i < UNKNOWN.length - 1 ? "1px solid rgba(251, 170, 41, 0.22)" : "none",
                  fontFamily: t.font.family,
                  fontSize: 22,
                  color: t.colors.textBright,
                  lineHeight: 1.35,
                  opacity: interpolate(itemP, [0, 1], [0, 1]),
                  transform: `translateX(${interpolate(itemP, [0, 1], [-12, 0])}px)`,
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    background: t.colors.orangeBright,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <HelpCircle size={16} color="#FFFFFF" strokeWidth={2.4} />
                </div>
                {u}
              </div>
            );
          })}
        </div>
      </div>
    </MedReviewContainer>
  );
};
