import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { fsmbTheme, BriefingTheme } from "./themes/fsmb";

/**
 * Base slide frame for generic briefings. FSMB-branded by default.
 *
 * Background variants:
 *  - "white":         clean white page (default for title/closing)
 *  - "watermark":     soft-grey page + optional bottom-left logo + accent strip
 *  - "solid-blue" / "solid-orange": full-bleed navy/orange (section headers)
 *  - "swoosh-blue":   full-bleed blue swoosh (Part I/III section headers)
 *  - "swoosh-orange": full-bleed orange swoosh (Part II/IV section headers)
 *  - "swoosh-corner": white + orange corner swoosh (title/closing accents)
 *  - "swoosh-gray":   de-saturated blue swoosh (closing takeaway slides)
 *  - "custom":        caller supplies `backgroundImage` path via staticFile
 *
 * Swoosh asset paths are configurable via `swooshAssets` to keep the
 * container briefing-agnostic. Defaults point to the AIMSA asset pack.
 */
export type BriefingBackground =
  | "white"
  | "watermark"
  | "solid-blue"
  | "solid-orange"
  | "swoosh-blue"
  | "swoosh-orange"
  | "swoosh-corner"
  | "swoosh-gray"
  | "custom";

export type SwooshAssets = {
  blue?: string;
  orange?: string;
  corner?: string;
  /** Falls back to `blue` with a grayscale filter when unset. */
  gray?: string;
};

const DEFAULT_SWOOSH_ASSETS: Required<Pick<SwooshAssets, "blue" | "orange" | "corner">> & SwooshAssets = {
  blue: "aimsa-bg/swoosh-blue.jpg",
  orange: "aimsa-bg/swoosh-orange.jpg",
  corner: "aimsa-bg/swoosh-corner.jpg",
};

export const BriefingContainer: React.FC<{
  background?: BriefingBackground;
  backgroundImage?: string;
  textOnDark?: boolean;
  padding?: number;
  logoPath?: string;
  theme?: BriefingTheme;
  swooshAssets?: SwooshAssets;
  children: React.ReactNode;
}> = ({
  background = "watermark",
  backgroundImage,
  textOnDark = false,
  padding = 120,
  logoPath,
  theme = fsmbTheme,
  swooshAssets,
  children,
}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const swoosh = { ...DEFAULT_SWOOSH_ASSETS, ...(swooshAssets ?? {}) };

  const isSwoosh =
    background === "swoosh-blue" ||
    background === "swoosh-orange" ||
    background === "swoosh-corner" ||
    background === "swoosh-gray";

  const bgColor =
    background === "solid-blue"
      ? theme.colors.navy
      : background === "solid-orange"
      ? theme.colors.orangeBright
      : background === "white"
      ? theme.colors.white
      : background === "swoosh-blue" || background === "swoosh-orange"
      ? theme.colors.navy
      : background === "swoosh-gray"
      ? "#3a4756"
      : theme.colors.bgSoft;

  // Swoosh slides overlay their JPG; a custom filter for swoosh-gray
  // desaturates a re-used blue swoosh when no dedicated gray asset is set.
  let swooshSrc: string | undefined;
  let swooshFilter: string | undefined;
  if (background === "swoosh-blue") swooshSrc = swoosh.blue;
  else if (background === "swoosh-orange") swooshSrc = swoosh.orange;
  else if (background === "swoosh-corner") swooshSrc = swoosh.corner;
  else if (background === "swoosh-gray") {
    swooshSrc = swoosh.gray ?? swoosh.blue;
    if (!swoosh.gray) swooshFilter = "grayscale(100%) brightness(0.95) contrast(0.92)";
  }

  const showLogo =
    !!logoPath &&
    (background === "watermark" ||
      background === "solid-blue" ||
      background === "solid-orange" ||
      background === "swoosh-blue" ||
      background === "swoosh-orange");

  const showAccentStrip =
    background !== "solid-blue" &&
    background !== "solid-orange" &&
    background !== "swoosh-blue" &&
    background !== "swoosh-orange";

  return (
    <AbsoluteFill style={{ background: bgColor, opacity: enter }}>
      {background === "custom" && backgroundImage && (
        <Img
          src={staticFile(backgroundImage)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}

      {isSwoosh && swooshSrc && (
        <Img
          src={staticFile(swooshSrc)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: swooshFilter,
          }}
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
            zIndex: 0,
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
          paddingBottom: background === "watermark" && showLogo ? 210 : showLogo ? 160 : padding,
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
