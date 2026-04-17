import React from "react";
import { Img, staticFile, spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { ChilesContainer } from "./ChilesContainer";
import { chilesTheme as t } from "./theme";

/**
 * Slide 1: title. Italic orange "Chiles" + navy "v. Salazar" as hero,
 * blue subtitle below, then meta (presenter + date).
 */
export const ChilesTitle: React.FC = () => {
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
    <ChilesContainer background="swoosh-corner" padding={0}>
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
          src={staticFile("chiles-bg/fsmb-logo.png")}
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
            marginBottom: 48,
            ...line(eyebrowProgress, 12),
          }}
        >
          Board Attorneys Briefing
        </div>

        <div
          style={{
            fontFamily: t.font.family,
            fontSize: 172,
            fontWeight: t.font.weight.bold,
            lineHeight: 1.0,
            color: t.colors.navy,
            ...line(titleProgress, 48),
          }}
        >
          <span style={{ fontStyle: "italic", color: t.colors.orange }}>Chiles</span>{" "}
          <span>v. Salazar</span>
        </div>

        <div
          style={{
            width: 240,
            height: 3,
            marginTop: 48,
            background: `linear-gradient(90deg, transparent, ${t.colors.blue}, ${t.colors.orange}, transparent)`,
            transform: `scaleX(${interpolate(ruleProgress, [0, 1], [0, 1])})`,
            transformOrigin: "center center",
          }}
        />

        <div
          style={{
            fontFamily: t.font.family,
            fontSize: 38,
            fontWeight: t.font.weight.medium,
            color: t.colors.blue,
            marginTop: 40,
            ...line(subProgress, 20),
          }}
        >
          A First Amendment Reset for Medical Regulation
        </div>

        <div
          style={{
            fontFamily: t.font.family,
            fontSize: 26,
            color: t.colors.textDim,
            letterSpacing: "0.08em",
            lineHeight: 1.8,
            marginTop: 48,
            ...line(metaProgress, 16),
          }}
        >
          <div style={{ fontWeight: t.font.weight.medium, color: t.colors.text }}>
            Frank B. Meyers, JD
          </div>
          <div>Director, Regulatory Innovation &amp; Member Services</div>
          <div style={{ marginTop: 10, opacity: 0.85 }}>
            FSMB · 607 U. S. ___ (decided March 31, 2026)
          </div>
        </div>
      </div>
    </ChilesContainer>
  );
};
