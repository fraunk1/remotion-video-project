import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { AimsaContainer } from "./AimsaContainer";
import { aimsaTheme as t } from "./theme";

/**
 * Section header slide: full-bleed swoosh background (blue or orange)
 * with animated part label, title, rule, and subtitle.
 */
export const AimsaSectionHeader: React.FC<{
  partLabel: string;
  title: string;
  subtitle?: string;
  color: "blue" | "orange";
}> = ({ partLabel, title, subtitle, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgScale = interpolate(frame, [0, 60], [1.04, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
    <AimsaContainer
      background={color === "blue" ? "swoosh-blue" : "swoosh-orange"}
      textOnDark
      padding={0}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${bgScale})`,
          transformOrigin: "center center",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 120px",
        }}
      >
        <div
          style={{
            fontFamily: t.font.family,
            fontSize: 30,
            fontWeight: t.font.weight.semibold,
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
            fontFamily: t.font.family,
            fontSize: 130,
            fontWeight: t.font.weight.bold,
            color: t.colors.white,
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
              fontFamily: t.font.family,
              fontSize: 32,
              fontWeight: t.font.weight.regular,
              color: "rgba(255,255,255,0.92)",
              textShadow: "0 2px 6px rgba(0,0,0,0.3)",
              marginTop: 36,
              maxWidth: "60em",
              whiteSpace: "nowrap",
              lineHeight: 1.4,
              opacity: subOpacity,
              transform: `translateY(${subY}px)`,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </AimsaContainer>
  );
};
