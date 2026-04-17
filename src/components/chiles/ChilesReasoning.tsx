import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { ChilesContainer } from "./ChilesContainer";
import { chilesTheme as t } from "./theme";

/** Slide 7 — 4-step reasoning chain timed to narration cues. */

const STEPS = [
  {
    num: "01",
    color: t.colors.blue,
    title: "Speech, not conduct",
    body: "Calling talk therapy a \"treatment\" or \"modality\" does not transform protected speech into regulable conduct.",
    quote: "\"The First Amendment is no word game.\"",
  },
  {
    num: "02",
    color: t.colors.orange,
    title: "Content-based",
    body: "Colorado permits affirming therapy yet forbids therapy that attempts to change orientation or identity — a regulation that turns on the speech's content.",
  },
  {
    num: "03",
    color: t.colors.blue,
    title: "Viewpoint-discriminatory",
    body: "The law privileges one side of an ideological debate. Viewpoint discrimination is the \"egregious form\" of content regulation — automatic red flag under Rosenberger.",
  },
  {
    num: "04",
    color: t.colors.orange,
    title: "Strict scrutiny",
    body: "State must prove narrow tailoring to a compelling interest. Lower courts erred by using rational-basis review; NIFLA forecloses a \"professional speech\" exception.",
  },
];

// All cards use one consistent accent color (FSMB blue). A tighter stagger so
// all four land within the first ~3 seconds rather than dribbling in over 10s.
const STEP_DELAYS_FRAMES = [18, 44, 70, 96];

export const ChilesReasoning: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const eyebrowP = spring({ frame, fps, config: { damping: 180 } });
  const h2P = spring({ frame: frame - 6, fps, config: { damping: 180 } });

  const quoteP = spring({ frame: frame - 540, fps, config: { damping: 200 } }); // near end of 24s audio

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
        How the Court Got There
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
        Key Reasoning
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginTop: 60, flex: 1, alignContent: "start" }}>
        {STEPS.map((s, i) => {
          const p = spring({ frame: frame - STEP_DELAYS_FRAMES[i], fps, config: { damping: 14 } });
          return (
            <div
              key={s.num}
              style={{
                background: t.colors.bgCard,
                border: `1px solid ${t.colors.border}`,
                borderTop: `4px solid ${s.color}`,
                borderRadius: 14,
                padding: "32px 28px",
                boxShadow: t.shadows.card,
                opacity: interpolate(p, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px) scale(${interpolate(p, [0, 1], [0.96, 1])})`,
              }}
            >
              <div
                style={{
                  fontFamily: t.font.family,
                  fontSize: 76,
                  fontWeight: t.font.weight.bold,
                  color: s.color,
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                {s.num}
              </div>
              <div
                style={{
                  fontFamily: t.font.family,
                  fontSize: 34,
                  fontWeight: t.font.weight.bold,
                  color: t.colors.navy,
                  marginTop: 22,
                  lineHeight: 1.2,
                }}
              >
                {s.title}
              </div>
              <div
                style={{
                  fontFamily: t.font.family,
                  fontSize: 24,
                  color: t.colors.text,
                  marginTop: 18,
                  lineHeight: 1.5,
                }}
              >
                {s.body}
              </div>
              {s.quote && (
                <div
                  style={{
                    fontFamily: t.font.family,
                    fontSize: 22,
                    fontStyle: "italic",
                    color: t.colors.blueBright,
                    marginTop: 14,
                    lineHeight: 1.4,
                  }}
                >
                  {s.quote}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 44,
          textAlign: "center",
          fontFamily: t.font.family,
          fontSize: 26,
          fontStyle: "italic",
          color: t.colors.textBright,
          lineHeight: 1.45,
          maxWidth: 1500,
          marginLeft: "auto",
          marginRight: "auto",
          opacity: interpolate(quoteP, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(quoteP, [0, 1], [10, 0])}px)`,
        }}
      >
        "A prevailing standard of care may reflect what most practitioners believe today,
        but it cannot mark the outer boundary of what they may say tomorrow."{" "}
        <span style={{ color: t.colors.textDim, fontStyle: "normal" }}>— Slip op. at 22</span>
      </div>
    </ChilesContainer>
  );
};
