import React from "react";
import { Img, staticFile, spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { AimsaContainer } from "./AimsaContainer";
import { aimsaTheme as t } from "./theme";

/**
 * Slide 1 — title slide. Italic orange "AIMSA" accent + navy main title,
 * blue subtitle below, then meta (presenter + role + date).
 */
export const AimsaTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoProgress = spring({ frame: frame - 0, fps, config: { damping: 180 } });
  const eyebrowProgress = spring({ frame: frame - 10, fps, config: { damping: 180 } });
  const titleProgress = spring({ frame: frame - 20, fps, config: { damping: 160 } });
  const ruleProgress = spring({ frame: frame - 36, fps, config: { damping: 200 } });
  const subProgress = spring({ frame: frame - 44, fps, config: { damping: 200 } });
  const metaProgress = spring({ frame: frame - 54, fps, config: { damping: 200 } });

  const line = (p: number, distance = 32) => ({
    opacity: interpolate(p, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(p, [0, 1], [distance, 0])}px)`,
  });

  return (
    <AimsaContainer background="swoosh-corner" padding={0}>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 180px",
        }}
      >
        <Img
          src={staticFile("aimsa-bg/fsmb-logo.png")}
          style={{
            width: 260,
            height: "auto",
            marginBottom: 48,
            ...line(logoProgress, 16),
          }}
        />

        <div
          style={{
            fontFamily: t.font.family,
            fontSize: 26,
            fontWeight: t.font.weight.semibold,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: t.colors.blue,
            marginBottom: 36,
            ...line(eyebrowProgress, 12),
          }}
        >
          A Briefing for State Medical Boards
        </div>

        <div
          style={{
            fontFamily: t.font.family,
            fontSize: 200,
            fontWeight: t.font.weight.bold,
            lineHeight: 1.0,
            color: t.colors.orange,
            fontStyle: "italic",
            letterSpacing: "-0.02em",
            ...line(titleProgress, 48),
          }}
        >
          AIMSA
        </div>

        <div
          style={{
            fontFamily: t.font.family,
            fontSize: 56,
            fontWeight: t.font.weight.semibold,
            color: t.colors.navy,
            marginTop: 14,
            ...line(titleProgress, 36),
          }}
        >
          The AI Medical Services Act
        </div>

        <div
          style={{
            width: 240,
            height: 3,
            marginTop: 36,
            background: `linear-gradient(90deg, transparent, ${t.colors.blue}, ${t.colors.orange}, transparent)`,
            transform: `scaleX(${interpolate(ruleProgress, [0, 1], [0, 1])})`,
            transformOrigin: "center center",
          }}
        />

        <div
          style={{
            fontFamily: t.font.family,
            fontSize: 34,
            fontWeight: t.font.weight.medium,
            color: t.colors.blue,
            marginTop: 32,
            maxWidth: "28em",
            lineHeight: 1.35,
            ...line(subProgress, 20),
          }}
        >
          Cicero Institute model legislation, now in play in Idaho and Iowa
        </div>

        <div
          style={{
            fontFamily: t.font.family,
            fontSize: 24,
            color: t.colors.textDim,
            letterSpacing: "0.06em",
            lineHeight: 1.8,
            marginTop: 44,
            ...line(metaProgress, 16),
          }}
        >
          <div style={{ fontWeight: t.font.weight.medium, color: t.colors.text, fontSize: 26 }}>
            Frank B. Meyers, JD
          </div>
          <div>Director, Regulatory Innovation &amp; Member Services</div>
          <div style={{ marginTop: 10, opacity: 0.9, fontFamily: t.font.mono, fontSize: 20 }}>
            FSMB · April 2026 · Cicero AIMSA · Idaho HB 945 · Iowa HSB 766
          </div>
        </div>
      </div>
    </AimsaContainer>
  );
};
