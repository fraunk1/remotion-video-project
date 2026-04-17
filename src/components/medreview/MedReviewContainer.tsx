import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { medreviewTheme as t } from "./theme";

/**
 * Base slide frame for every MedReview briefing slide. Reuses the shared
 * FSMB swoosh backgrounds from Chiles (`chiles-bg/*`) — they are brand
 * assets, not Chiles-specific.
 *
 * Backgrounds:
 *  - 'white'           soft grey page
 *  - 'watermark'       soft grey + faint FSMB logo bottom-left (most content slides)
 *  - 'swoosh-blue'     full-bleed navy+blue swoosh (Part I/III headers)
 *  - 'swoosh-orange'   full-bleed orange swoosh (Part II headers)
 *  - 'swoosh-corner'   white + orange swoosh in corner (title/closing)
 */
export type MedReviewBackground = "white" | "watermark" | "swoosh-blue" | "swoosh-orange" | "swoosh-corner";

export const MedReviewContainer: React.FC<{
  background?: MedReviewBackground;
  textOnDark?: boolean;
  padding?: number;
  children: React.ReactNode;
}> = ({ background = "watermark", textOnDark = false, padding = 90, children }) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bgColor =
    background === "swoosh-blue" || background === "swoosh-orange"
      ? t.colors.navy
      : t.colors.bgSoft;

  return (
    <AbsoluteFill style={{ background: bgColor, opacity: enter }}>
      {/* Subtle dot-grid texture for non-swoosh backgrounds — breaks up flat grey */}
      {(background === "white" || background === "watermark" || background === "swoosh-corner") && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle at center, rgba(14, 40, 65, 0.07) 1.2px, transparent 1.3px)",
            backgroundSize: "28px 28px",
            backgroundPosition: "0 0",
            opacity: 0.9,
            pointerEvents: "none",
          }}
        />
      )}
      {/* Soft gradient wash for visual depth */}
      {background === "watermark" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at top right, rgba(251, 170, 41, 0.10) 0%, transparent 55%), radial-gradient(ellipse at bottom left, rgba(24, 154, 207, 0.10) 0%, transparent 55%)",
            pointerEvents: "none",
          }}
        />
      )}
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
      {(background === "watermark" || background === "swoosh-blue" || background === "swoosh-orange") && (
        <Img
          src={staticFile("medreview-bg/fsmb-logo-transparent.png")}
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
