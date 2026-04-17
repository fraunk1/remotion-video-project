import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { ChilesContainer } from "./ChilesContainer";
import { chilesTheme as t } from "./theme";

/** Slide 10 — Preserved vs At Risk two-column. */
const PRESERVED = [
  "Qualifications-based licensing — education, examination, scope",
  "Informed-consent disclosures of factual, noncontroversial information",
  "Malpractice liability — injury + causation + breach",
  "Aversive / physical interventions — shock, drugs, coercive conduct",
  "Viewpoint-neutral modality rules (per Kagan)",
];

const AT_RISK = [
  "Speech-only treatment bans that permit one side and forbid its opposite",
  "Discipline for \"substandard care\" delivered by speech alone",
  "Standards encoding contested medical consensus as a ceiling on speech",
  "Catch-alls (\"best interests,\" \"undue influence\") applied to pure speech",
  "Compelled-speech scripts that push a viewpoint",
];

export const ChilesImpact: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const eyebrowP = spring({ frame, fps, config: { damping: 180 } });
  const h2P = spring({ frame: frame - 6, fps, config: { damping: 180 } });
  const leftP = spring({ frame: frame - 16, fps, config: { damping: 180 } });
  const rightP = spring({ frame: frame - 26, fps, config: { damping: 180 } });

  const lineIn = (p: number, d = 24) => ({
    opacity: interpolate(p, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(p, [0, 1], [d, 0])}px)`,
  });

  const col = (header: string, items: string[], color: string, bullet: string, p: number) => (
    <div style={{ ...lineIn(p, 32) }}>
      <div
        style={{
          fontFamily: t.font.family,
          fontSize: 38,
          fontWeight: t.font.weight.bold,
          color,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginBottom: 28,
        }}
      >
        {bullet} {header}
      </div>
      <div
        style={{
          background: t.colors.bgCard,
          border: `1px solid ${t.colors.border}`,
          borderLeft: `6px solid ${color}`,
          borderRadius: 12,
          padding: "30px 34px",
          boxShadow: t.shadows.card,
        }}
      >
        <ul style={{ margin: 0, padding: 0, listStyle: "none", fontFamily: t.font.family, fontSize: 26, color: t.colors.text, lineHeight: 1.55 }}>
          {items.map((it, i) => {
            const itemP = spring({ frame: frame - 30 - i * 6 - (p === leftP ? 0 : 10), fps, config: { damping: 200 } });
            return (
              <li key={i} style={{ paddingLeft: 28, position: "relative", marginBottom: i === items.length - 1 ? 0 : 12, opacity: interpolate(itemP, [0, 1], [0, 1]), transform: `translateX(${interpolate(itemP, [0, 1], [-10, 0])}px)` }}>
                <span style={{ position: "absolute", left: 0, top: 12, width: 10, height: 10, borderRadius: 5, background: color }} />
                {it}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );

  return (
    <ChilesContainer background="watermark">
      <div style={{ fontFamily: t.font.family, fontSize: 26, fontWeight: t.font.weight.semibold, letterSpacing: "0.16em", textTransform: "uppercase", color: t.colors.blue, ...lineIn(eyebrowP) }}>
        Implications for Board Regulation
      </div>
      <div style={{ fontFamily: t.font.family, fontSize: 92, fontWeight: t.font.weight.bold, color: t.colors.navy, marginTop: 6, ...lineIn(h2P) }}>
        What Survives · What's at Risk
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, marginTop: 60, flex: 1 }}>
        {col("Still Solid Ground", PRESERVED, t.colors.green, "✓", leftP)}
        {col("Now Under Pressure", AT_RISK, t.colors.red, "⚠", rightP)}
      </div>
    </ChilesContainer>
  );
};
