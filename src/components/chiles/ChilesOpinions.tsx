import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { ChilesContainer } from "./ChilesContainer";
import { chilesTheme as t } from "./theme";

/** Slide 8 — Kagan concurrence + Jackson dissent, side by side. */
export const ChilesOpinions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const eyebrowP = spring({ frame, fps, config: { damping: 180 } });
  const h2P = spring({ frame: frame - 6, fps, config: { damping: 180 } });
  // Both cards load near the start, staggered for visual flow (Kagan first, Jackson ~1s later)
  const kaganP = spring({ frame: frame - 14, fps, config: { damping: 14 } });
  const jacksonP = spring({ frame: frame - 34, fps, config: { damping: 14 } });

  const enter = (p: number, dir: "left" | "right" = "left") => {
    const shift = dir === "left" ? -40 : 40;
    return {
      opacity: interpolate(p, [0, 1], [0, 1]),
      transform: `translateX(${interpolate(p, [0, 1], [shift, 0])}px)`,
    };
  };

  const lineIn = (p: number) => ({
    opacity: interpolate(p, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(p, [0, 1], [20, 0])}px)`,
  });

  const card = (border: string, tint: string, title: string, body: React.ReactNode, p: number, dir: "left" | "right") => (
    <div
      style={{
        background: t.colors.bgCard,
        border: `1px solid ${t.colors.border}`,
        borderLeft: `8px solid ${border}`,
        borderRadius: 12,
        padding: "40px 44px",
        boxShadow: t.shadows.card,
        ...enter(p, dir),
      }}
    >
      <div
        style={{
          display: "inline-block",
          padding: "8px 20px",
          background: tint,
          color: border,
          fontFamily: t.font.family,
          fontSize: 22,
          fontWeight: t.font.weight.bold,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          borderRadius: 20,
        }}
      >
        {title}
      </div>
      <div style={{ fontFamily: t.font.family, fontSize: 28, color: t.colors.text, lineHeight: 1.55, marginTop: 28 }}>
        {body}
      </div>
    </div>
  );

  return (
    <ChilesContainer background="watermark">
      <div style={{ fontFamily: t.font.family, fontSize: 26, fontWeight: t.font.weight.semibold, letterSpacing: "0.16em", textTransform: "uppercase", color: t.colors.blue, ...lineIn(eyebrowP) }}>
        The Split Opinions
      </div>
      <div style={{ fontFamily: t.font.family, fontSize: 92, fontWeight: t.font.weight.bold, color: t.colors.navy, marginTop: 6, ...lineIn(h2P) }}>
        Kagan &amp; Jackson
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginTop: 60 }}>
        {card(t.colors.blue, "rgba(24,154,207,0.15)",
          "Kagan, J., concurring (w/ Sotomayor)",
          <>
            <div style={{ marginBottom: 14 }}>
              <span style={{ color: t.colors.textBright, fontWeight: 600 }}>Agrees on viewpoint discrimination.</span> But flags an open door:
              content-based but <em>viewpoint-neutral</em> restrictions in doctors' offices may warrant less than strict scrutiny.
            </div>
            <div>
              <span style={{ color: t.colors.textBright, fontWeight: 600 }}>Implication:</span> regulate modality or outcome, not ideological sides.
            </div>
          </>, kaganP, "left")}

        {card(t.colors.orange, "rgba(251,170,41,0.18)",
          "Jackson, J., dissenting",
          <>
            <div style={{ marginBottom: 14 }}>
              Would apply speech-incident-to-conduct doctrine — speech restriction is "incidental" to regulating a medical treatment.
            </div>
            <div style={{ marginBottom: 14 }}>
              Warns the decision "might make speech-only therapies… <span style={{ color: t.colors.textBright, fontWeight: 600 }}>effectively unregulatable</span>."
            </div>
            <div>
              Catalogs rules now at risk: "humane treatment," "best interests," "undue influence," competence standards.
            </div>
          </>, jacksonP, "right")}
      </div>
    </ChilesContainer>
  );
};
