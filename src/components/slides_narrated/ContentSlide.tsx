import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { Slide } from "../../scenes/types";
import { fsmbTheme } from "../../theme/fsmb";

export const ContentSlide: React.FC<{ slide: Slide }> = ({ slide }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: fsmbTheme.colors.bgLight,
        fontFamily: fsmbTheme.fonts.body,
        padding: "120px 160px",
      }}
    >
      <h2
        style={{
          fontSize: fsmbTheme.sizes.titleL,
          color: fsmbTheme.colors.navy,
          fontWeight: 700,
          margin: 0,
          marginBottom: 40,
          borderLeft: `12px solid ${fsmbTheme.colors.orange}`,
          paddingLeft: 32,
          opacity: s,
          transform: `translateX(${(1 - s) * 40}px)`,
        }}
      >
        {slide.title}
      </h2>
      {slide.subtitle && (
        <p style={{ fontSize: fsmbTheme.sizes.body, color: fsmbTheme.colors.textMuted, opacity: s }}>
          {slide.subtitle}
        </p>
      )}
    </AbsoluteFill>
  );
};
