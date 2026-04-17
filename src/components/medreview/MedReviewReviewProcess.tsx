import React from "react";
import { Img, staticFile, spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { FileInput, BookOpenText, Scale, Send, Timer } from "lucide-react";
import { MedReviewContainer } from "./MedReviewContainer";
import { medreviewTheme as t } from "./theme";

/**
 * Slide 13 — The Review Process. Left: 4-step card (Lucide icons,
 * gradient borders, staggered reveal). Right: real evaluation-form
 * screenshot framed as a browser window.
 */
const STEPS = [
  { n: "1", label: "Open", detail: "Receive invite · open a case in MedReview", Icon: FileInput },
  { n: "2", label: "Review", detail: "Read documents; form an independent impression", Icon: BookOpenText },
  { n: "3", label: "Compare", detail: "See the AI’s analysis and rate each finding", Icon: Scale },
  { n: "4", label: "Submit", detail: "Accuracy · missed findings · confidence", Icon: Send },
];

export const MedReviewReviewProcess: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const eyebrowP = spring({ frame, fps, config: { damping: 180 } });
  const titleP = spring({ frame: frame - 6, fps, config: { damping: 180 } });
  const imgP = spring({ frame: frame - 18, fps, config: { damping: 180 } });
  const stepDelays = [30, 48, 66, 84];
  const etaP = spring({ frame: frame - 104, fps, config: { damping: 16 } });

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
        Your Role
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
        The Review Process
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.35fr",
          gap: 60,
          marginTop: 50,
          flex: 1,
        }}
      >
        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {STEPS.map((s, i) => {
            const p = spring({ frame: frame - stepDelays[i], fps, config: { damping: 180 } });
            const op = interpolate(p, [0, 1], [0, 1]);
            const x = interpolate(p, [0, 1], [-24, 0]);
            return (
              <div
                key={s.n}
                style={{
                  background: t.colors.bgCard,
                  border: `1px solid ${t.colors.border}`,
                  borderRadius: 12,
                  padding: "18px 22px",
                  boxShadow: t.shadows.card,
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  opacity: op,
                  transform: `translateX(${x}px)`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: 5,
                    background: `linear-gradient(180deg, ${t.colors.blueBright} 0%, ${t.colors.blue} 100%)`,
                  }}
                />
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 14,
                    background: `linear-gradient(135deg, ${t.colors.blueBright} 0%, ${t.colors.blue} 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 6px 16px ${t.colors.blue}55`,
                    flexShrink: 0,
                    marginLeft: 6,
                    position: "relative",
                  }}
                >
                  <s.Icon size={30} color="#FFFFFF" strokeWidth={2.2} />
                  <div
                    style={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      background: t.colors.white,
                      color: t.colors.blueBright,
                      border: `2px solid ${t.colors.blue}`,
                      fontFamily: t.font.family,
                      fontSize: 16,
                      fontWeight: t.font.weight.bold,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {s.n}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div
                    style={{
                      fontFamily: t.font.family,
                      fontSize: 28,
                      fontWeight: t.font.weight.bold,
                      color: t.colors.navy,
                    }}
                  >
                    {s.label}
                  </div>
                  <div
                    style={{
                      fontFamily: t.font.family,
                      fontSize: 20,
                      color: t.colors.text,
                      lineHeight: 1.3,
                      marginTop: 2,
                    }}
                  >
                    {s.detail}
                  </div>
                </div>
              </div>
            );
          })}

          <div
            style={{
              marginTop: 10,
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              alignSelf: "flex-start",
              background: `linear-gradient(135deg, ${t.colors.orangeBright} 0%, ${t.colors.orange} 100%)`,
              color: t.colors.white,
              fontFamily: t.font.family,
              fontSize: 22,
              fontWeight: t.font.weight.bold,
              letterSpacing: "0.06em",
              padding: "12px 24px",
              borderRadius: 999,
              boxShadow: `0 8px 22px ${t.colors.orange}55`,
              opacity: interpolate(etaP, [0, 1], [0, 1]),
              transform: `scale(${interpolate(etaP, [0, 1], [0.88, 1])})`,
            }}
          >
            <Timer size={22} color="#FFFFFF" strokeWidth={2.4} />
            ~10–15 min per case · auto-saves
          </div>
        </div>

        {/* Eval form screenshot */}
        <div
          style={{
            position: "relative",
            opacity: interpolate(imgP, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(imgP, [0, 1], [26, 0])}px)`,
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
            {/* Fake browser chrome */}
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
                  fontSize: 16,
                  color: t.colors.textDim,
                }}
              >
                medreview-eval.fly.dev / cases / 79 / evaluate
              </div>
            </div>
            <Img
              src={staticFile("medreview-bg/eval_form_filled.png")}
              style={{ display: "block", width: "100%", height: "auto" }}
            />
          </div>
        </div>
      </div>
    </MedReviewContainer>
  );
};
