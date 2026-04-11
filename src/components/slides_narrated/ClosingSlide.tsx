import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { Slide } from "../../scenes/types";
import { fsmbTheme } from "../../theme/fsmb";

export const ClosingSlide: React.FC<{ slide: Slide }> = ({ slide }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: fsmbTheme.colors.bgLight,
        fontFamily: fsmbTheme.fonts.heading,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          fontSize: fsmbTheme.sizes.titleXL,
          color: fsmbTheme.colors.navy,
          fontWeight: 700,
          margin: 0,
          opacity: s,
          transform: `scale(${0.9 + s * 0.1})`,
          textAlign: "center",
        }}
      >
        {slide.title}
      </h1>
      <div
        style={{
          width: 240,
          height: 8,
          background: fsmbTheme.colors.orange,
          marginTop: 48,
          transform: `scaleX(${s})`,
          transformOrigin: "center",
        }}
      />
    </AbsoluteFill>
  );
};
