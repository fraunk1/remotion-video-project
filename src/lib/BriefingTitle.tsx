import React from "react";
import { Img, staticFile, spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { BriefingContainer } from "./BriefingContainer";
import { fsmbTheme, BriefingTheme } from "./themes/fsmb";

/**
 * Generic title slide: top logo, eyebrow, hero title, gradient rule, subtitle, meta.
 *
 * Accepts title as two parts so the "italic accent + regular" pattern (e.g.
 * "*Chiles* v. Salazar") can be preserved without specific components.
 */
export const BriefingTitle: React.FC<{
  logoPath?: string;
  eyebrow?: string;
  titleAccent?: string;
  titleMain: string;
  subtitle?: string;
  presenter?: string;
  presenterRole?: string;
  caseCite?: string;
  theme?: BriefingTheme;
}> = ({
  logoPath,
  eyebrow,
  titleAccent,
  titleMain,
  subtitle,
  presenter,
  presenterRole,
  caseCite,
  theme = fsmbTheme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoProgress = spring({ frame, fps, config: { damping: 180 } });
  const eyebrowProgress = spring({ frame: frame - 10, fps, config: { damping: 180 } });
  const titleProgress = spring({ frame: frame - 20, fps, config: { damping: 160 } });
  const ruleProgress = spring({ frame: frame - 36, fps, config: { damping: 200 } });
  const subProgress = spring({ frame: frame - 44, fps, config: { damping: 200 } });
  const metaProgress = spring({ frame: frame - 54, fps, config: { damping: 200 } });

  const line = (p: number, distance = 32) => ({
    opacity: interpolate(p, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(p, [0, 1], [distance, 0])}px)`,
  });

  // When titleAccent is provided it becomes the hero (large italic orange)
  // and titleMain reads as the descriptive line underneath. Without accent,
  // titleMain IS the hero. Matches the AimsaTitle pattern where "AIMSA" is
  // the 200px accent and "The AI Medical Services Act" is the 56px descender.
  const heroLogoPath = logoPath ?? "aimsa-bg/fsmb-logo.png";

  return (
    <BriefingContainer
      background="swoosh-corner"
      padding={0}
      theme={theme}
    >
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
        {heroLogoPath && (
          <Img
            src={staticFile(heroLogoPath)}
            style={{
              width: 260,
              height: "auto",
              marginBottom: 48,
              ...line(logoProgress, 16),
            }}
          />
        )}

        {eyebrow && (
          <div
            style={{
              fontFamily: theme.font.family,
              fontSize: 26,
              fontWeight: theme.font.weight.semibold,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: theme.colors.blue,
              marginBottom: 36,
              ...line(eyebrowProgress, 12),
            }}
          >
            {eyebrow}
          </div>
        )}

        {titleAccent ? (
          <>
            <div
              style={{
                fontFamily: theme.font.family,
                fontSize: 200,
                fontWeight: theme.font.weight.bold,
                lineHeight: 1.0,
                color: theme.colors.orange,
                fontStyle: "italic",
                letterSpacing: "-0.02em",
                ...line(titleProgress, 48),
              }}
            >
              {titleAccent}
            </div>
            <div
              style={{
                fontFamily: theme.font.family,
                fontSize: 56,
                fontWeight: theme.font.weight.semibold,
                color: theme.colors.navy,
                marginTop: 14,
                ...line(titleProgress, 36),
              }}
            >
              {titleMain}
            </div>
          </>
        ) : (
          <div
            style={{
              fontFamily: theme.font.family,
              fontSize: 172,
              fontWeight: theme.font.weight.bold,
              lineHeight: 1.0,
              color: theme.colors.navy,
              ...line(titleProgress, 48),
            }}
          >
            {titleMain}
          </div>
        )}

        <div
          style={{
            width: 240,
            height: 3,
            marginTop: 48,
            background: `linear-gradient(90deg, transparent, ${theme.colors.blue}, ${theme.colors.orange}, transparent)`,
            transform: `scaleX(${interpolate(ruleProgress, [0, 1], [0, 1])})`,
            transformOrigin: "center center",
          }}
        />

        {subtitle && (
          <div
            style={{
              fontFamily: theme.font.family,
              fontSize: 38,
              fontWeight: theme.font.weight.medium,
              color: theme.colors.blue,
              marginTop: 40,
              ...line(subProgress, 20),
            }}
          >
            {subtitle}
          </div>
        )}

        {(presenter || presenterRole || caseCite) && (
          <div
            style={{
              fontFamily: theme.font.family,
              fontSize: 26,
              color: theme.colors.textDim,
              letterSpacing: "0.08em",
              lineHeight: 1.8,
              marginTop: 48,
              ...line(metaProgress, 16),
            }}
          >
            {presenter && (
              <div style={{ fontWeight: theme.font.weight.medium, color: theme.colors.text }}>
                {presenter}
              </div>
            )}
            {presenterRole && <div>{presenterRole}</div>}
            {caseCite && (
              <div style={{ marginTop: 10, opacity: 0.85 }}>{caseCite}</div>
            )}
          </div>
        )}
      </div>
    </BriefingContainer>
  );
};
