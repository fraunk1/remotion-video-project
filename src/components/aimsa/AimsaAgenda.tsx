import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { AimsaContainer } from "./AimsaContainer";
import { aimsaTheme as t } from "./theme";

const PILLARS = [
  {
    num: "I",
    color: t.colors.blue,
    title: "The Bills",
    desc: "Cicero model + Idaho HB 945 + Iowa HSB 766",
  },
  {
    num: "II",
    color: t.colors.orange,
    title: "The Headline",
    desc: "A parallel board that bypasses existing medical boards",
  },
  {
    num: "III",
    color: t.colors.blue,
    title: "Considerations",
    desc: "The structural design of the regime",
  },
  {
    num: "IV",
    color: t.colors.orange,
    title: "Implications",
    desc: "Comparative landscape, FDA limits, FSMB response",
  },
];

// Timeline ticker — past / now / future arc that frames where AIMSA sits.
type TimelineStop = {
  label: string;
  period: string;
  color: string;
  items: string[];
  isNow?: boolean;
};
const TIMELINE: TimelineStop[] = [
  {
    label: "Past",
    period: "2024–2025",
    color: t.colors.textDim,
    items: [
      "Utah Doctronic sandbox precedent",
      "California AB 489 signed (Oct 2025)",
      "Cicero homelessness template: 15 states, 8 passed",
    ],
  },
  {
    label: "Now",
    period: "Apr 2026",
    color: t.colors.orange,
    isNow: true,
    items: [
      "Cicero AIMSA model bill (Jan 2026)",
      "Idaho HB 945 · Iowa HSB 766",
      "FSMB analysis · this briefing",
    ],
  },
  {
    label: "Future",
    period: "12–18 months",
    color: t.colors.blue,
    items: [
      "8–15 more state introductions expected",
      "Reciprocity cascade after 5–7 adoptions",
      "FSMB position + member-board response",
    ],
  },
];

export const AimsaAgenda: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerProgress = spring({ frame, fps, config: { damping: 180 } });
  const headerLine = (p: number) => ({
    opacity: interpolate(p, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px)`,
  });

  const tickerP = spring({ frame: frame - 80, fps, config: { damping: 180 } });

  return (
    <AimsaContainer background="watermark">
      <div
        style={{
          fontFamily: t.font.family,
          fontSize: 24,
          fontWeight: t.font.weight.semibold,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: t.colors.blue,
          ...headerLine(headerProgress),
        }}
      >
        Roadmap
      </div>
      <div
        style={{
          fontFamily: t.font.family,
          fontSize: 92,
          fontWeight: t.font.weight.bold,
          color: t.colors.navy,
          marginTop: 4,
          lineHeight: 1.0,
          ...headerLine(spring({ frame: frame - 6, fps, config: { damping: 180 } })),
        }}
      >
        Agenda
      </div>

      {/* 4 pillar cards — text-only, shorter, tinted bg */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 24,
          marginTop: 40,
        }}
      >
        {PILLARS.map((p, i) => {
          const pr = spring({ frame: frame - 20 - i * 10, fps, config: { damping: 180 } });
          const enter = {
            opacity: interpolate(pr, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(pr, [0, 1], [40, 0])}px)`,
          };
          return (
            <div
              key={p.num}
              style={{
                background: t.colors.bgCardTint,
                border: `2px solid ${t.colors.bgCardTintBorder}`,
                borderTop: `6px solid ${p.color}`,
                borderRadius: 14,
                padding: "26px 26px",
                boxShadow: t.shadows.card,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                ...enter,
              }}
            >
              <div
                style={{
                  fontFamily: t.font.family,
                  fontSize: 96,
                  fontWeight: t.font.weight.bold,
                  color: p.color,
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                {p.num}
              </div>
              <div
                style={{
                  fontFamily: t.font.family,
                  fontSize: 26,
                  fontWeight: t.font.weight.bold,
                  color: t.colors.navy,
                  marginTop: 18,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {p.title}
              </div>
              <div
                style={{
                  fontFamily: t.font.family,
                  fontSize: 24,
                  color: t.colors.text,
                  marginTop: 12,
                  lineHeight: 1.4,
                }}
              >
                {p.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Timeline ticker — past / now / future arc */}
      <div
        style={{
          marginTop: 36,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          opacity: interpolate(tickerP, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(tickerP, [0, 1], [16, 0])}px)`,
        }}
      >
        {/* Header band */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 22,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: t.colors.orange,
              boxShadow: `0 0 0 4px ${t.colors.orange}33`,
            }}
          />
          <div
            style={{
              fontFamily: t.font.family,
              fontSize: 19,
              fontWeight: t.font.weight.bold,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: t.colors.orange,
            }}
          >
            Where We Are in the Story
          </div>
          <div style={{ flex: 1, height: 1, background: t.colors.bgCardTintBorder }} />
        </div>

        {/* Timeline: 3 stops connected by a horizontal line */}
        <div style={{ position: "relative", padding: "0 40px" }}>
          {/* Connecting line behind the markers */}
          <div
            style={{
              position: "absolute",
              top: 22,
              left: "calc(16.67% + 8px)",
              right: "calc(16.67% + 8px)",
              height: 3,
              background: `linear-gradient(90deg, ${t.colors.textDim} 0%, ${t.colors.orange} 50%, ${t.colors.blue} 100%)`,
              borderRadius: 2,
              opacity: 0.55,
            }}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 32,
              position: "relative",
            }}
          >
            {TIMELINE.map((stop, i) => {
              const sp = spring({ frame: frame - 100 - i * 18, fps, config: { damping: 180 } });
              return (
                <div
                  key={stop.label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    opacity: interpolate(sp, [0, 1], [0, 1]),
                    transform: `translateY(${interpolate(sp, [0, 1], [16, 0])}px)`,
                  }}
                >
                  {/* Marker dot */}
                  <div
                    style={{
                      width: stop.isNow ? 46 : 36,
                      height: stop.isNow ? 46 : 36,
                      borderRadius: 999,
                      background: stop.color,
                      border: `4px solid ${t.colors.bgSoft}`,
                      boxShadow: stop.isNow
                        ? `0 0 0 5px ${stop.color}33, 0 4px 12px rgba(14, 40, 65, 0.18)`
                        : `0 2px 6px rgba(14, 40, 65, 0.18)`,
                      marginBottom: 12,
                      zIndex: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {stop.isNow && (
                      <div
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: 999,
                          background: t.colors.white,
                        }}
                      />
                    )}
                  </div>

                  {/* Label */}
                  <div
                    style={{
                      fontFamily: t.font.family,
                      fontSize: 24,
                      fontWeight: t.font.weight.bold,
                      color: stop.color,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      lineHeight: 1,
                    }}
                  >
                    {stop.label}
                  </div>
                  <div
                    style={{
                      fontFamily: t.font.family,
                      fontSize: 19,
                      fontWeight: t.font.weight.medium,
                      color: t.colors.textDim,
                      letterSpacing: "0.04em",
                      marginTop: 4,
                      marginBottom: 14,
                    }}
                  >
                    {stop.period}
                  </div>

                  {/* Items list */}
                  <div
                    style={{
                      width: "100%",
                      background: t.colors.bgCardTint,
                      border: `2px solid ${t.colors.bgCardTintBorder}`,
                      borderLeft: `4px solid ${stop.color}`,
                      borderRadius: 10,
                      padding: "14px 18px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {stop.items.map((it, ii) => (
                      <div
                        key={ii}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 10,
                          fontFamily: t.font.family,
                          fontSize: 19,
                          color: t.colors.text,
                          lineHeight: 1.35,
                        }}
                      >
                        <span
                          style={{
                            flex: "0 0 auto",
                            width: 5,
                            height: 5,
                            borderRadius: 999,
                            background: stop.color,
                            marginTop: 7,
                          }}
                        />
                        <span>{it}</span>
                      </div>
                    ))}
                  </div>

                  {/* "We are here" tag for now — gentle continuous bob to
                      draw the eye to the current position on the timeline */}
                  {stop.isNow && (
                    <div
                      style={{
                        marginTop: 10,
                        fontFamily: t.font.family,
                        fontSize: 19,
                        fontWeight: t.font.weight.bold,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: stop.color,
                        transform: `translateY(${Math.sin((frame - 80) / 9) * 6}px)`,
                        willChange: "transform",
                      }}
                    >
                      ▲ We are here
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AimsaContainer>
  );
};
