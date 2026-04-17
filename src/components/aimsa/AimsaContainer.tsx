import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { aimsaTheme as t } from "./theme";

/**
 * Base slide frame for every AIMSA composition slide.
 *
 * Background variants (mirroring Chiles):
 *   - 'white'         — flat white
 *   - 'watermark'     — soft grey + faint FSMB logo bottom-left
 *   - 'swoosh-blue'   — full-bleed blue swoosh (Part I/III section headers)
 *   - 'swoosh-orange' — full-bleed orange swoosh (Part II/IV section headers)
 *   - 'swoosh-corner' — white + orange corner swoosh (title/closing)
 */
export type AimsaBackground = "white" | "watermark" | "swoosh-blue" | "swoosh-orange" | "swoosh-corner" | "swoosh-gray";

export const AimsaContainer: React.FC<{
  background?: AimsaBackground;
  textOnDark?: boolean;
  padding?: number;
  children: React.ReactNode;
}> = ({ background = "watermark", textOnDark = false, padding = 120, children }) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const bgColor =
    background === "swoosh-blue" || background === "swoosh-orange"
      ? t.colors.navy
      : background === "swoosh-gray"
      ? "#3a4756"
      : t.colors.bgSoft;

  return (
    <AbsoluteFill style={{ background: bgColor, opacity: enter }}>
      {background === "swoosh-blue" && (
        <Img
          src={staticFile("aimsa-bg/swoosh-blue.jpg")}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
      {background === "swoosh-orange" && (
        <Img
          src={staticFile("aimsa-bg/swoosh-orange.jpg")}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
      {background === "swoosh-corner" && (
        <Img
          src={staticFile("aimsa-bg/swoosh-corner.jpg")}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
      {background === "swoosh-gray" && (
        <Img
          src={staticFile("aimsa-bg/swoosh-blue.jpg")}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "grayscale(100%) brightness(0.95) contrast(0.92)",
          }}
        />
      )}

      {(background === "watermark" || background === "swoosh-blue" || background === "swoosh-orange") && (
        <Img
          src={staticFile("aimsa-bg/fsmb-logo.png")}
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
