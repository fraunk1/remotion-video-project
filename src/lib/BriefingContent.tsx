import React from "react";
import { Img, staticFile, spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { BriefingContainer } from "./BriefingContainer";
import { fsmbTheme, BriefingTheme } from "./themes/fsmb";

/**
 * Generic content slide: eyebrow + title + bullets (optional) + image
 * (optional). The fallback slide type when a briefing doesn't register a
 * custom component for `slide.type`.
 */
export const BriefingContent: React.FC<{
  eyebrow?: string;
  title: string;
  subtitle?: string;
  bullets?: string[];
  image?: string;
  logoPath?: string;
  theme?: BriefingTheme;
}> = ({ eyebrow, title, subtitle, bullets = [], image, logoPath, theme = fsmbTheme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const eyebrowP = spring({ frame, fps, config: { damping: 180 } });
  const titleP = spring({ frame: frame - 6, fps, config: { damping: 180 } });
  const subP = spring({ frame: frame - 14, fps, config: { damping: 180 } });

  const line = (p: number, d = 20) => ({
    opacity: interpolate(p, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(p, [0, 1], [d, 0])}px)`,
  });

  const bulletLine = (idx: number) => {
    const p = spring({ frame: frame - (22 + idx * 6), fps, config: { damping: 180 } });
    return {
      opacity: interpolate(p, [0, 1], [0, 1]),
      transform: `translateX(${interpolate(p, [0, 1], [-16, 0])}px)`,
    };
  };

  return (
    <BriefingContainer background="watermark" logoPath={logoPath} theme={theme}>
      {eyebrow && (
        <div
          style={{
            fontFamily: theme.font.family,
            fontSize: theme.sizes.eyebrow,
            fontWeight: theme.font.weight.semibold,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: theme.colors.blue,
            marginBottom: 20,
            ...line(eyebrowP, 12),
          }}
        >
          {eyebrow}
        </div>
      )}

      <div
        style={{
          fontFamily: theme.font.family,
          fontSize: theme.sizes.h1,
          fontWeight: theme.font.weight.bold,
          color: theme.colors.navy,
          lineHeight: 1.1,
          marginBottom: subtitle ? 16 : 40,
          ...line(titleP, 28),
        }}
      >
        {title}
      </div>

      {subtitle && (
        <div
          style={{
            fontFamily: theme.font.family,
            fontSize: theme.sizes.body,
            color: theme.colors.text,
            lineHeight: 1.5,
            marginBottom: 48,
            maxWidth: "28em",
            ...line(subP, 20),
          }}
        >
          {subtitle}
        </div>
      )}

      <div style={{ display: "flex", gap: 80, flex: 1, alignItems: "flex-start" }}>
        {bullets.length > 0 && (
          <div style={{ flex: 1 }}>
            {bullets.map((b, i) => (
              <div
                key={i}
                style={{
                  fontFamily: theme.font.family,
                  fontSize: theme.sizes.body,
                  color: theme.colors.text,
                  lineHeight: 1.5,
                  marginBottom: 24,
                  paddingLeft: 32,
                  position: "relative",
                  ...bulletLine(i),
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "0.5em",
                    width: 14,
                    height: 14,
                    borderRadius: 3,
                    background: theme.colors.orange,
                  }}
                />
                {b}
              </div>
            ))}
          </div>
        )}

        {image && (
          <Img
            src={staticFile(image)}
            style={{
              flex: 1,
              maxHeight: 560,
              width: "auto",
              objectFit: "contain",
              borderRadius: 8,
              boxShadow: theme.shadows.card,
            }}
          />
        )}
      </div>
    </BriefingContainer>
  );
};
