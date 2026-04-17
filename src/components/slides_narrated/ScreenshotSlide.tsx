import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { Slide } from "../../scenes/types";

/**
 * Renders a full-bleed screenshot of the original Reveal.js slide.
 * Uses a darker background (#E8E8E6) to reduce white blow-out on video,
 * and adds a subtle vignette overlay for depth.
 */
export const ScreenshotSlide: React.FC<{ slide: Slide }> = ({ slide }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fadeIn = spring({ frame, fps, config: { damping: 20 } });
  const scale = 1 + (1 - fadeIn) * 0.02;

  return (
    <AbsoluteFill style={{ backgroundColor: "#E0E0DE" }}>
      <Img
        src={staticFile(slide.image!)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: fadeIn,
          transform: `scale(${scale})`,
          filter: "brightness(0.96) contrast(1.03)",
        }}
      />
      {/* Subtle vignette overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.08) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
