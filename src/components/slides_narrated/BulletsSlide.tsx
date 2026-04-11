import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { Slide } from "../../scenes/types";
import { fsmbTheme } from "../../theme/fsmb";

export const BulletsSlide: React.FC<{ slide: Slide; slideDurationFrames: number }> = ({
  slide,
  slideDurationFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = spring({ frame, fps, config: { damping: 14 } });

  // Even-spaced staggering: delay_i = (duration / (N+1)) * (i+1)
  const gap = slideDurationFrames / (slide.bullets.length + 1);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: fsmbTheme.colors.bgLight,
        fontFamily: fsmbTheme.fonts.heading,
        padding: "120px 160px",
      }}
    >
      <h2
        style={{
          fontSize: fsmbTheme.sizes.titleL,
          color: fsmbTheme.colors.navy,
          fontWeight: 700,
          margin: 0,
          marginBottom: 80,
          opacity: titleOpacity,
          transform: `translateX(${(1 - titleOpacity) * 40}px)`,
          borderLeft: `12px solid ${fsmbTheme.colors.orange}`,
          paddingLeft: 32,
        }}
      >
        {slide.title}
      </h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {slide.bullets.map((bullet, i) => {
          const delay = gap * (i + 1);
          const bulletSpring = spring({
            frame: frame - delay,
            fps,
            config: { damping: 16 },
          });
          return (
            <li
              key={i}
              style={{
                fontSize: fsmbTheme.sizes.body,
                color: fsmbTheme.colors.textDark,
                marginBottom: 32,
                lineHeight: 1.3,
                opacity: bulletSpring,
                transform: `translateX(${(1 - bulletSpring) * 40}px)`,
                display: "flex",
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  color: fsmbTheme.colors.orange,
                  fontSize: fsmbTheme.sizes.body,
                  marginRight: 24,
                  fontWeight: 700,
                }}
              >
                ▸
              </span>
              {bullet}
            </li>
          );
        })}
      </ul>
    </AbsoluteFill>
  );
};
