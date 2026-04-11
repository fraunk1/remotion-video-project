import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { Slide } from "../../scenes/types";
import { fsmbTheme } from "../../theme/fsmb";

export const TwoColumnSlide: React.FC<{ slide: Slide }> = ({ slide }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 14 } });

  const mid = Math.ceil(slide.bullets.length / 2);
  const left = slide.bullets.slice(0, mid);
  const right = slide.bullets.slice(mid);

  const renderColumn = (items: string[]) => (
    <ul style={{ listStyle: "none", padding: 0, flex: 1 }}>
      {items.map((item, i) => (
        <li
          key={i}
          style={{
            fontSize: fsmbTheme.sizes.body,
            color: fsmbTheme.colors.textDark,
            marginBottom: 24,
            opacity: s,
          }}
        >
          <span style={{ color: fsmbTheme.colors.orange, marginRight: 16 }}>▸</span>
          {item}
        </li>
      ))}
    </ul>
  );

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
          marginBottom: 60,
          borderLeft: `12px solid ${fsmbTheme.colors.orange}`,
          paddingLeft: 32,
          opacity: s,
        }}
      >
        {slide.title}
      </h2>
      <div style={{ display: "flex", gap: 120 }}>
        {renderColumn(left)}
        {renderColumn(right)}
      </div>
    </AbsoluteFill>
  );
};
