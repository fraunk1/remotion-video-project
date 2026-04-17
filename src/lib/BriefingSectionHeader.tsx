import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { BriefingContainer } from "./BriefingContainer";
import { fsmbTheme, BriefingTheme } from "./themes/fsmb";

/**
 * Section header slide: solid navy or orange background with animated part
 * label + title + rule reveal + subtitle. Generalized from the Chiles
 * ChilesSectionHeader (which used a full-bleed swoosh image).
 */
export const BriefingSectionHeader: React.FC<{
  partLabel: string;
  title: string;
  subtitle?: string;
  color: "blue" | "orange";
  theme?: BriefingTheme;
}> = ({ partLabel, title, subtitle, color, theme = fsmbTheme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const partProgress = spring({ frame: frame - 6, fps, config: { damping: 180 } });
  const partOpacity = interpolate(partProgress, [0, 1], [0, 1]);
  const partY = interpolate(partProgress, [0, 1], [24, 0]);
  const partSpacing = interpolate(partProgress, [0, 1], [0.4, 0.25]);

  const titleProgress = spring({ frame: frame - 14, fps, config: { damping: 180 } });
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);
  const titleY = interpolate(titleProgress, [0, 1], [40, 0]);

  const ruleProgress = spring({ frame: frame - 24, fps, config: { damping: 200 } });
  const ruleScaleX = interpolate(ruleProgress, [0, 1], [0, 1]);

  const subProgress = spring({ frame: frame - 32, fps, config: { damping: 200 } });
  const subOpacity = interpolate(subProgress, [0, 1], [0, 1]);
  const subY = interpolate(subProgress, [0, 1], [20, 0]);

  return (
    <BriefingContainer
      background={color === "blue" ? "solid-blue" : "solid-orange"}
      textOnDark
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
          padding: "0 160px",
        }}
      >
        <div
          style={{
            fontFamily: theme.font.family,
            fontSize: 30,
            fontWeight: theme.font.weight.semibold,
            letterSpacing: `${partSpacing}em`,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.92)",
            opacity: partOpacity,
            transform: `translateY(${partY}px)`,
            textShadow: "0 2px 6px rgba(0,0,0,0.25)",
            marginBottom: 32,
          }}
        >
          {partLabel}
        </div>

        <div
          style={{
            fontFamily: theme.font.family,
            fontSize: 140,
            fontWeight: theme.font.weight.bold,
            color: theme.colors.white,
            lineHeight: 1.05,
            textShadow: "0 3px 12px rgba(0,0,0,0.35)",
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            maxWidth: "18em",
          }}
        >
          {title}
        </div>

        <div
          style={{
            width: 120,
            height: 3,
            marginTop: 40,
            background: "rgba(255,255,255,0.75)",
            borderRadius: 2,
            transform: `scaleX(${ruleScaleX})`,
            transformOrigin: "center center",
          }}
        />

        {subtitle && (
          <div
            style={{
              fontFamily: theme.font.family,
              fontSize: 36,
              fontWeight: theme.font.weight.regular,
              color: "rgba(255,255,255,0.92)",
              textShadow: "0 2px 6px rgba(0,0,0,0.3)",
              marginTop: 36,
              maxWidth: "28em",
              lineHeight: 1.4,
              opacity: subOpacity,
              transform: `translateY(${subY}px)`,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </BriefingContainer>
  );
};
