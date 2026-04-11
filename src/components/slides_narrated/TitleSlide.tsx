import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { Slide } from "../../scenes/types";
import { fsmbTheme } from "../../theme/fsmb";

export const TitleSlide: React.FC<{ slide: Slide }> = ({ slide }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 14 } });
  const subtitleSpring = spring({ frame: frame - 15, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: fsmbTheme.colors.bgLight,
        fontFamily: fsmbTheme.fonts.heading,
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "0 160px",
      }}
    >
      <div
        style={{
          width: 12,
          height: 240,
          background: fsmbTheme.colors.orange,
          position: "absolute",
          left: 100,
          top: "50%",
          transform: `translateY(-50%) scaleY(${titleSpring})`,
          transformOrigin: "center",
        }}
      />
      <h1
        style={{
          fontSize: fsmbTheme.sizes.titleXL,
          color: fsmbTheme.colors.navy,
          fontWeight: 700,
          margin: 0,
          lineHeight: 1.05,
          opacity: titleSpring,
          transform: `translateX(${(1 - titleSpring) * 40}px)`,
        }}
      >
        {slide.title}
      </h1>
      {slide.subtitle && (
        <h2
          style={{
            fontSize: fsmbTheme.sizes.titleM,
            color: fsmbTheme.colors.textMuted,
            fontWeight: 500,
            marginTop: 24,
            opacity: subtitleSpring,
            transform: `translateX(${(1 - subtitleSpring) * 40}px)`,
          }}
        >
          {slide.subtitle}
        </h2>
      )}
    </AbsoluteFill>
  );
};
