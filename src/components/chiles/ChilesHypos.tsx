import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { ChilesContainer } from "./ChilesContainer";
import { chilesTheme as t } from "./theme";

/** Shared hypothetical-card slide for slides 12 (Hypos 1+2) and 13 (Hypos 3+4). */

type Hypo = {
  tag: string;
  title: string;
  facts: string;
  question: string;
};

export const ChilesHypos: React.FC<{
  eyebrow: string;
  h2: string;
  left: Hypo;
  right: Hypo;
  // Delay (seconds into audio) when Hypo B gets introduced — used to time the right card's entry
  rightDelaySec: number;
}> = ({ eyebrow, h2, left, right, rightDelaySec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const eyebrowP = spring({ frame, fps, config: { damping: 180 } });
  const h2P = spring({ frame: frame - 6, fps, config: { damping: 180 } });
  const leftP = spring({ frame: frame - 16, fps, config: { damping: 14 } });
  const rightP = spring({ frame: frame - Math.round(rightDelaySec * 30), fps, config: { damping: 14 } });

  const lineIn = (p: number, d = 24) => ({
    opacity: interpolate(p, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(p, [0, 1], [d, 0])}px)`,
  });

  const card = (h: Hypo, p: number) => (
    <div
      style={{
        background: t.colors.bgCard,
        border: `1px solid ${t.colors.border}`,
        borderLeft: `8px solid ${t.colors.orange}`,
        borderRadius: "0 14px 14px 0",
        padding: "40px 44px",
        boxShadow: t.shadows.card,
        opacity: interpolate(p, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(p, [0, 1], [0.96, 1])})`,
      }}
    >
      <span
        style={{
          display: "inline-block",
          background: t.colors.orange,
          color: t.colors.white,
          fontFamily: t.font.family,
          fontSize: 22,
          fontWeight: t.font.weight.bold,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          padding: "10px 22px",
          borderRadius: 999,
          marginBottom: 22,
        }}
      >
        {h.tag}
      </span>
      <div
        style={{
          fontFamily: t.font.family,
          fontSize: 42,
          fontWeight: t.font.weight.bold,
          color: t.colors.navy,
          lineHeight: 1.2,
          marginBottom: 22,
        }}
      >
        {h.title}
      </div>
      <div
        style={{
          fontFamily: t.font.family,
          fontSize: 26,
          color: t.colors.text,
          lineHeight: 1.5,
          marginBottom: 20,
        }}
      >
        {h.facts}
      </div>
      <div
        style={{
          fontFamily: t.font.family,
          fontSize: 26,
          fontStyle: "italic",
          fontWeight: t.font.weight.medium,
          color: t.colors.blueBright,
          lineHeight: 1.5,
        }}
      >
        {h.question}
      </div>
    </div>
  );

  return (
    <ChilesContainer background="watermark">
      <div style={{ fontFamily: t.font.family, fontSize: 26, fontWeight: t.font.weight.semibold, letterSpacing: "0.16em", textTransform: "uppercase", color: t.colors.blue, ...lineIn(eyebrowP) }}>
        {eyebrow}
      </div>
      <div style={{ fontFamily: t.font.family, fontSize: 92, fontWeight: t.font.weight.bold, color: t.colors.navy, marginTop: 6, ...lineIn(h2P) }}>
        {h2}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginTop: 60, flex: 1 }}>
        {card(left, leftP)}
        {card(right, rightP)}
      </div>
    </ChilesContainer>
  );
};
