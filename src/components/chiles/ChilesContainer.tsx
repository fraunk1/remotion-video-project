import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { chilesTheme as t } from "./theme";

/**
 * Base slide frame for every Chiles composition slide.
 *
 * Props:
 *  - background: 'white' (default), 'watermark' (white + faint FSMB logo top-left),
 *    'swoosh-blue' (blue-swoosh full-bleed for Part I/III headers),
 *    'swoosh-orange' (orange-swoosh full-bleed for Part II/IV headers),
 *    'swoosh-corner' (white + orange swoosh in corner, for title/closing)
 *  - textOnDark: if true, default text color is white + shadow (section headers)
 *  - padding: px padding on the content area (default 120)
 */
export type ChilesBackground = "white" | "watermark" | "swoosh-blue" | "swoosh-orange" | "swoosh-corner";

export const ChilesContainer: React.FC<{
  background?: ChilesBackground;
  textOnDark?: boolean;
  padding?: number;
  children: React.ReactNode;
}> = ({ background = "watermark", textOnDark = false, padding = 120, children }) => {
  const frame = useCurrentFrame();
  // Subtle slide-in opacity for the whole frame (avoids hard cuts between scenes)
  const enter = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const bgColor = background === "swoosh-blue" || background === "swoosh-orange"
    ? t.colors.navy
    : t.colors.bgSoft; // soft grey page lets white cards feel anchored

  return (
    <AbsoluteFill style={{ background: bgColor, opacity: enter }}>
      {/* Background layer — full-bleed swoosh or corner treatment */}
      {background === "swoosh-blue" && (
        <Img
          src={staticFile("chiles-bg/swoosh-blue.jpg")}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
      {background === "swoosh-orange" && (
        <Img
          src={staticFile("chiles-bg/swoosh-orange.jpg")}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
      {background === "swoosh-corner" && (
        <Img
          src={staticFile("chiles-bg/swoosh-corner.jpg")}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
      {/* FSMB logo bottom-left on content and section-header slides.
          Swoosh images all have a light/white strip at the bottom, so the
          dark brand logo reads cleanly on both watermark and swoosh bgs. */}
      {(background === "watermark" || background === "swoosh-blue" || background === "swoosh-orange") && (
        <Img
          src={staticFile("chiles-bg/fsmb-logo.png")}
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

      {/* Content area — reserves 140px at the bottom for logo/accent band on watermark slides */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          paddingTop: padding,
          paddingLeft: padding,
          paddingRight: padding,
          paddingBottom: background === "watermark" ? 160 : padding,
          fontFamily: t.font.family,
          color: textOnDark ? t.colors.white : t.colors.text,
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>

      {/* Subtle brand accent strip at very bottom (2px) */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${t.colors.navy} 0%, ${t.colors.blue} 50%, ${t.colors.orange} 100%)`,
          opacity: background === "swoosh-blue" || background === "swoosh-orange" ? 0 : 0.8,
        }}
      />
    </AbsoluteFill>
  );
};
