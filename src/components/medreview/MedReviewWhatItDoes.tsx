import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import {
  FileText,
  PenLine,
  Stethoscope,
  Pill,
  ClipboardList,
  AlertTriangle,
  ScanEye,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";
import { MedReviewContainer } from "./MedReviewContainer";
import { medreviewTheme as t } from "./theme";

/**
 * Slide 5 — What MedReview Does. Two saturated cards (Processes / Produces)
 * with big Lucide icons per bullet, gradient top borders, and a
 * key-principle callout anchored by a ShieldCheck icon.
 */

type Item = { label: string; Icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }> };

const PROCESSES: Item[] = [
  { label: "Complaint narratives and clinical documents", Icon: FileText },
  { label: "Handwritten and scanned records (any quality)", Icon: PenLine },
  { label: "Medical imaging — chest X-rays, radiology", Icon: Stethoscope },
  { label: "Medication lists and lab reports", Icon: Pill },
];

const PRODUCES: Item[] = [
  { label: "Clinical summary with timeline of events", Icon: ClipboardList },
  { label: "Flagged concerns with severity ratings", Icon: AlertTriangle },
  { label: "Imaging analysis with confidence scores", Icon: ScanEye },
  { label: "Structured report for human review", Icon: FileCheck2 },
];

export const MedReviewWhatItDoes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const eyebrowP = spring({ frame, fps, config: { damping: 180 } });
  const titleP = spring({ frame: frame - 6, fps, config: { damping: 180 } });
  const leftP = spring({ frame: frame - 16, fps, config: { damping: 180 } });
  const rightP = spring({ frame: frame - 32, fps, config: { damping: 180 } });
  const keyP = spring({ frame: frame - 100, fps, config: { damping: 180 } });

  const lineIn = (p: number, d = 24) => ({
    opacity: interpolate(p, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(p, [0, 1], [d, 0])}px)`,
  });

  const card = (
    title: string,
    color: string,
    colorBright: string,
    items: Item[],
    cardP: number,
    itemDelayStart: number,
  ) => (
    <div
      style={{
        background: t.colors.bgCard,
        border: `1px solid ${t.colors.border}`,
        borderRadius: 16,
        padding: "32px 34px 28px",
        boxShadow: t.shadows.card,
        position: "relative",
        overflow: "hidden",
        opacity: interpolate(cardP, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(cardP, [0, 1], [28, 0])}px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background: `linear-gradient(90deg, ${color} 0%, ${colorBright} 100%)`,
        }}
      />
      <div
        style={{
          fontFamily: t.font.family,
          fontSize: 36,
          fontWeight: t.font.weight.bold,
          color,
          marginBottom: 22,
          marginTop: 6,
        }}
      >
        {title}
      </div>
      {items.map((it, i) => {
        const ip = spring({ frame: frame - (itemDelayStart + i * 6), fps, config: { damping: 180 } });
        return (
          <div
            key={it.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "12px 0",
              borderBottom: i < items.length - 1 ? `1px solid ${t.colors.border}` : "none",
              opacity: interpolate(ip, [0, 1], [0, 1]),
              transform: `translateX(${interpolate(ip, [0, 1], [-16, 0])}px)`,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: `${color}1a`,
                border: `1.5px solid ${color}40`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <it.Icon size={30} color={color} strokeWidth={2.1} />
            </div>
            <div
              style={{
                fontFamily: t.font.family,
                fontSize: 24,
                color: t.colors.textBright,
                lineHeight: 1.3,
                fontWeight: t.font.weight.medium,
              }}
            >
              {it.label}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <MedReviewContainer background="watermark">
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
        Overview
      </div>
      <div
        style={{
          fontFamily: t.font.family,
          fontSize: 92,
          fontWeight: t.font.weight.bold,
          color: t.colors.navy,
          marginTop: 6,
          ...lineIn(titleP),
        }}
      >
        What MedReview Does
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36, marginTop: 40, flex: 1 }}>
        {card("Processes", t.colors.blue, t.colors.blueBright, PROCESSES, leftP, 30)}
        {card("Produces", t.colors.orange, t.colors.orangeBright, PRODUCES, rightP, 52)}
      </div>

      <div
        style={{
          marginTop: 24,
          background: "linear-gradient(90deg, rgba(21, 128, 61, 0.14) 0%, rgba(21, 128, 61, 0.03) 100%)",
          border: `1px solid rgba(21, 128, 61, 0.25)`,
          borderLeft: `5px solid ${t.colors.green}`,
          borderRadius: "0 12px 12px 0",
          padding: "18px 26px",
          display: "flex",
          alignItems: "center",
          gap: 18,
          ...lineIn(keyP, 14),
        }}
      >
        <ShieldCheck size={32} color={t.colors.green} strokeWidth={2.2} />
        <div
          style={{
            fontFamily: t.font.family,
            fontSize: 22,
            color: t.colors.textBright,
            lineHeight: 1.5,
          }}
        >
          <span style={{ fontWeight: t.font.weight.bold, color: t.colors.green }}>Key principle:</span>{" "}
          MedReview assists human reviewers. It does not make decisions. Every finding includes a confidence score.
        </div>
      </div>
    </MedReviewContainer>
  );
};
