import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { Slide } from "../../scenes/types";
import { fsmbTheme } from "../../theme/fsmb";

export const QuoteSlide: React.FC<{ slide: Slide }> = ({ slide }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: fsmbTheme.colors.navy,
        fontFamily: fsmbTheme.fonts.body,
        justifyContent: "center",
        alignItems: "center",
        padding: "0 240px",
      }}
    >
      <div
        style={{
          fontSize: 240,
          color: fsmbTheme.colors.orange,
          fontFamily: "Georgia, serif",
          lineHeight: 0.8,
          marginBottom: -40,
          alignSelf: "flex-start",
          opacity: s,
        }}
      >
        "
      </div>
      <blockquote
        style={{
          fontSize: fsmbTheme.sizes.titleM,
          color: fsmbTheme.colors.textLight,
          fontWeight: 500,
          margin: 0,
          lineHeight: 1.35,
          fontStyle: "italic",
          opacity: s,
          transform: `translateY(${(1 - s) * 20}px)`,
          textAlign: "center",
        }}
      >
        {slide.title}
      </blockquote>
    </AbsoluteFill>
  );
};
