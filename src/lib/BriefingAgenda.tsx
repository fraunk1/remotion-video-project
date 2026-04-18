import React from "react";
import {
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { BriefingContainer } from "./BriefingContainer";
import { fsmbTheme } from "./themes/fsmb";
import { lineIn, revealAt } from "./animations";
import type { Slide } from "../scenes/types";

/**
 * `agenda` slide — pillar cards (I/II/III/IV) representing the briefing
 * roadmap, plus one optional 1-line "Why this briefing now" callout.
 * Per DESIGN_GUIDELINES §9, this slide is roadmap-only — do NOT stack
 * per-period timeline cards underneath; the pillars ARE the agenda.
 */

export type AgendaPillar = {
  num: string;         // "I" / "II" / "III" / "IV"
  color?: string;      // "blue" | "orange" | hex
  title: string;
  desc?: string;
};

export type AgendaCallout = {
  label?: string;
  text: string;
};

export type AgendaProps = {
  eyebrow?: string;
  title?: string;
  pillars?: AgendaPillar[];
  callout?: AgendaCallout;
};

const resolveColor = (c: string | undefined): string => {
  const t = fsmbTheme.colors;
  if (!c) return t.blue;
  if (c === "blue") return t.blue;
  if (c === "orange") return t.orange;
  if (c === "navy") return t.navy;
  return c;
};

export const BriefingAgenda: React.FC<{ slide: Slide }> = ({ slide }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = fsmbTheme;

  const p = (slide.props as AgendaProps | undefined) ?? {};
  const eyebrow = p.eyebrow ?? "Roadmap";
  const title = p.title ?? slide.title ?? "Agenda";
  const pillars = p.pillars ?? [];
  const callout = p.callout;

  const eyebrowP = revealAt({ frame, fps, damping: 180 });
  const titleP = revealAt({ frame, fps, delay: 6, damping: 180 });
  const calloutP = revealAt({ frame, fps, delay: 60, damping: 200 });

  return (
    <BriefingContainer background="watermark" logoPath="aimsa-bg/fsmb-logo.png">
      <div
        style={{
          fontFamily: t.font.family,
          fontSize: 24,
          fontWeight: t.font.weight.semibold,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: t.colors.blue,
          ...lineIn(eyebrowP),
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          fontFamily: t.font.family,
          fontSize: 92,
          fontWeight: t.font.weight.bold,
          color: t.colors.navy,
          marginTop: 4,
          lineHeight: 1.0,
          ...lineIn(titleP),
        }}
      >
        {title}
      </div>

      {pillars.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(pillars.length, 4)}, 1fr)`,
            gap: 24,
            marginTop: 48,
          }}
        >
          {pillars.map((pillar, i) => {
            const pr = spring({
              frame: frame - 20 - i * 10,
              fps,
              config: { damping: 180 },
            });
            const color = resolveColor(pillar.color);
            return (
              <div
                key={pillar.num + i}
                style={{
                  background: t.colors.bgCardGray,
                  border: `2px solid ${t.colors.bgCardGrayBorder}`,
                  borderTop: `6px solid ${color}`,
                  borderRadius: 14,
                  padding: "28px 26px",
                  boxShadow: t.shadows.card,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  opacity: interpolate(pr, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(pr, [0, 1], [40, 0])}px)`,
                }}
              >
                <div
                  style={{
                    fontFamily: t.font.family,
                    fontSize: 102,
                    fontWeight: t.font.weight.bold,
                    color,
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {pillar.num}
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
                  {pillar.title}
                </div>
                {pillar.desc && (
                  <div
                    style={{
                      fontFamily: t.font.family,
                      fontSize: 22,
                      color: t.colors.text,
                      marginTop: 14,
                      lineHeight: 1.45,
                    }}
                  >
                    {pillar.desc}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {callout && (
        <div
          style={{
            marginTop: "auto",
            marginBottom: 8,
            background: t.colors.bgCardGray,
            border: `2px solid ${t.colors.bgCardGrayBorder}`,
            borderLeft: `6px solid ${t.colors.orange}`,
            borderRadius: "0 14px 14px 0",
            padding: "22px 32px",
            display: "flex",
            alignItems: "center",
            gap: 26,
            opacity: interpolate(calloutP, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(calloutP, [0, 1], [12, 0])}px)`,
          }}
        >
          {callout.label && (
            <div
              style={{
                flex: "0 0 auto",
                fontFamily: t.font.family,
                fontSize: 18,
                fontWeight: t.font.weight.bold,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: t.colors.orange,
                whiteSpace: "nowrap",
              }}
            >
              {callout.label}
            </div>
          )}
          <div
            style={{
              flex: 1,
              fontFamily: t.font.family,
              fontSize: 24,
              fontStyle: "italic",
              fontWeight: t.font.weight.medium,
              color: t.colors.textBright,
              lineHeight: 1.45,
            }}
            dangerouslySetInnerHTML={{ __html: callout.text }}
          />
        </div>
      )}
    </BriefingContainer>
  );
};
