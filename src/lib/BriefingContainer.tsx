import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { fsmbTheme, BriefingTheme } from "./themes/fsmb";

/**
 * Base slide frame for generic briefings. FSMB-branded by default.
 *
 * Background variants:
 *  - "white": clean white page (default for title/closing)
 *  - "watermark": soft-grey page + optional bottom-left logo + accent strip
 *  - "solid-blue" / "solid-orange": full-bleed navy/orange (section headers)
 *  - "custom": caller supplies `backgroundImage` path via staticFile
 *
 * The Chiles briefing uses its own ChilesContainer for the swoosh look.
 * New briefings should start here.
 */
export type BriefingBackground = "white" | "watermark" | "solid-blue" | "solid-orange" | "custom";

export const BriefingContainer: React.FC<{
  background?: BriefingBackground;
  backgroundImage?: string;
  textOnDark?: boolean;
  padding?: number;
  logoPath?: string;
  theme?: BriefingTheme;
  children: React.ReactNode;
}> = ({
  background = "watermark",
  backgroundImage,
  textOnDark = false,
  padding = 120,
  logoPath,
  theme = fsmbTheme,
  children,
}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bgColor =
    background === "solid-blue"
      ? theme.colors.navy
      : background === "solid-orange"
      ? theme.colors.orangeBright
      : background === "white"
      ? theme.colors.white
      : theme.colors.bgSoft;

  const showLogo = logoPath && (background === "watermark" || background === "solid-blue" || background === "solid-orange");
  const showAccentStrip = background !== "solid-blue" && background !== "solid-orange";

  return (
    <AbsoluteFill style={{ background: bgColor, opacity: enter }}>
      {background === "custom" && backgroundImage && (
        <Img
          src={staticFile(backgroundImage)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}

      {showLogo && (
        <Img
          src={staticFile(logoPath!)}
          style={{
            position: "absolute",
            bottom: 48,
            left: 64,
            width: 220,
            height: "auto",
            opacity: 0.92,
            zIndex: 10,
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          inset: 0,
          paddingTop: padding,
          paddingLeft: padding,
          paddingRight: padding,
          paddingBottom: showLogo ? 160 : padding,
          fontFamily: theme.font.family,
          color: textOnDark ? theme.colors.white : theme.colors.text,
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>

      {showAccentStrip && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, ${theme.colors.navy} 0%, ${theme.colors.blue} 50%, ${theme.colors.orange} 100%)`,
            opacity: 0.8,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
