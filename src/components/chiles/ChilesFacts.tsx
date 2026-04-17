import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { ChilesContainer } from "./ChilesContainer";
import { chilesTheme as t } from "./theme";

/**
 * Slide 4: Facts + procedural timeline.
 *
 * Narration cues (durations from the normalized audio):
 *   - "Two things to flag" ~0.0s  → show both cards
 *   - "…rational basis. That framing is what the Supreme Court rejected" ~17.5s → show timeline
 * Timings are in frames at 30fps.
 */

const TL_STEPS = [
  { date: "Dec 2022", court: "District Court", cite: "D. Colo.", action: "Denied preliminary injunction", color: t.colors.navy },
  { date: "Sept 2024", court: "Tenth Circuit", cite: "116 F.4th 1178", action: "Affirmed · rational basis", color: t.colors.blue },
  { date: "Mar 2026", court: "Supreme Court", cite: "607 U. S. ___", action: "Reversed & remanded, 8–1", color: t.colors.orange },
];

export const ChilesFacts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const eyebrowP = spring({ frame, fps, config: { damping: 180 } });
  const h2P = spring({ frame: frame - 6, fps, config: { damping: 180 } });
  const card1P = spring({ frame: frame - 14, fps, config: { damping: 180 } });
  const card2P = spring({ frame: frame - 22, fps, config: { damping: 180 } });

  // Timeline loads right after the two cards — connector first, then pills stagger in quickly.
  const TIMELINE_DELAY = 32; // ~1s after slide starts
  const lineP = spring({ frame: frame - TIMELINE_DELAY, fps, config: { damping: 200 } });
  const dotDelays = [TIMELINE_DELAY + 14, TIMELINE_DELAY + 30, TIMELINE_DELAY + 48];

  const lineIn = (p: number, d = 24) => ({
    opacity: interpolate(p, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(p, [0, 1], [d, 0])}px)`,
  });

  return (
    <ChilesContainer background="watermark">
      <div
        style={{
          fontFamily: t.font.family,
          fontSize: 26,
          fontWeight: t.font.weight.semibold,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: t.colors.blue,
          ...lineIn(eyebrowP),
        }}
      >
        The Statute, the Plaintiff, the Courts Below
      </div>
      <div
        style={{
          fontFamily: t.font.family,
          fontSize: 92,
          fontWeight: t.font.weight.bold,
          color: t.colors.navy,
          marginTop: 6,
          ...lineIn(h2P),
        }}
      >
        Facts &amp; Posture
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginTop: 50 }}>
        <div
          style={{
            background: t.colors.bgCard,
            border: `1px solid ${t.colors.border}`,
            borderLeft: `6px solid ${t.colors.blue}`,
            borderRadius: 12,
            padding: "30px 34px",
            boxShadow: t.shadows.card,
            ...lineIn(card1P, 32),
          }}
        >
          <div style={{ fontFamily: t.font.family, fontSize: 38, fontWeight: t.font.weight.bold, color: t.colors.navy, marginBottom: 20 }}>
            Colorado's MCTL (2019)
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", fontFamily: t.font.family, fontSize: 26, color: t.colors.text, lineHeight: 1.5 }}>
            <li style={{ paddingLeft: 22, position: "relative", marginBottom: 10 }}>
              <span style={{ position: "absolute", left: 0, top: 12, width: 8, height: 8, borderRadius: 4, background: t.colors.blue }} />
              Bans licensed counselors from "conversion therapy" with minors — any effort to change orientation, identity, behaviors, or expressions
            </li>
            <li style={{ paddingLeft: 22, position: "relative" }}>
              <span style={{ position: "absolute", left: 0, top: 12, width: 8, height: 8, borderRadius: 4, background: t.colors.blue }} />
              Expressly permits affirming therapy and gender-transition assistance; enforced by fines, probation, or loss of license
            </li>
          </ul>
        </div>

        <div
          style={{
            background: t.colors.bgCard,
            border: `1px solid ${t.colors.border}`,
            borderLeft: `6px solid ${t.colors.orange}`,
            borderRadius: 12,
            padding: "30px 34px",
            boxShadow: t.shadows.card,
            ...lineIn(card2P, 32),
          }}
        >
          <div style={{ fontFamily: t.font.family, fontSize: 38, fontWeight: t.font.weight.bold, color: t.colors.navy, marginBottom: 20 }}>
            Kaley Chiles
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", fontFamily: t.font.family, fontSize: 26, color: t.colors.text, lineHeight: 1.5 }}>
            <li style={{ paddingLeft: 22, position: "relative", marginBottom: 10 }}>
              <span style={{ position: "absolute", left: 0, top: 12, width: 8, height: 8, borderRadius: 4, background: t.colors.orange }} />
              Licensed Colorado counselor providing only talk therapy — no medications, no physical interventions
            </li>
            <li style={{ paddingLeft: 22, position: "relative" }}>
              <span style={{ position: "absolute", left: 0, top: 12, width: 8, height: 8, borderRadius: 4, background: t.colors.orange }} />
              Filed as-applied pre-enforcement First Amendment challenge on behalf of client-directed counseling
            </li>
          </ul>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 70 }}>
        <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, padding: "0 140px" }}>
          {/* Gradient connector line */}
          <div
            style={{
              position: "absolute",
              top: 36,
              left: "18%",
              right: "18%",
              height: 4,
              background: `linear-gradient(90deg, ${t.colors.navy} 0%, ${t.colors.blue} 55%, ${t.colors.orange} 100%)`,
              borderRadius: 2,
              transform: `scaleX(${interpolate(lineP, [0, 1], [0, 1])})`,
              transformOrigin: "left center",
              zIndex: 0,
            }}
          />
          {TL_STEPS.map((s, i) => {
            const p = spring({ frame: frame - dotDelays[i], fps, config: { damping: 180 } });
            const dotScale = interpolate(p, [0, 1], [0, 1]);
            const textOp = interpolate(p, [0.4, 1], [0, 1]);
            const textY = interpolate(p, [0.4, 1], [16, 0]);
            return (
              <div key={s.court} style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                {/* Date pill */}
                <div
                  style={{
                    display: "inline-block",
                    fontFamily: t.font.family,
                    fontSize: 26,
                    fontWeight: t.font.weight.bold,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: t.colors.white,
                    background: s.color,
                    padding: "14px 30px",
                    borderRadius: 999,
                    border: `3px solid ${t.colors.white}`,
                    boxShadow: "0 4px 12px rgba(14,40,65,0.2)",
                    transform: `scale(${dotScale})`,
                  }}
                >
                  {s.date}
                </div>
                <div
                  style={{
                    fontFamily: t.font.family,
                    fontSize: 40,
                    fontWeight: t.font.weight.bold,
                    color: t.colors.navy,
                    marginTop: 32,
                    opacity: textOp,
                    transform: `translateY(${textY}px)`,
                  }}
                >
                  {s.court}
                </div>
                <div
                  style={{
                    fontFamily: t.font.family,
                    fontSize: 22,
                    fontWeight: t.font.weight.medium,
                    color: t.colors.textDim,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginTop: 10,
                    opacity: textOp,
                  }}
                >
                  {s.cite}
                </div>
                <div
                  style={{
                    fontFamily: t.font.family,
                    fontSize: 28,
                    color: t.colors.text,
                    marginTop: 16,
                    opacity: textOp,
                  }}
                >
                  {s.action}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ChilesContainer>
  );
};
