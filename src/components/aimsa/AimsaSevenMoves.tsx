import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { AimsaContainer } from "./AimsaContainer";
import { aimsaTheme as t } from "./theme";

/**
 * Slide 8 — Seven Considerations for State Medical Boards.
 *
 * Layout: content-dense vertical stack of 7 full-width rows + a full-width
 * callout at the bottom. Each row = large circle-badge + bold title + 2-line
 * description. This replaces the 2×4 grid which left too much empty white
 * space inside each cell.
 */

type Consideration = {
  num: number;
  title: string;
  desc: string;
};

const ITEMS: Consideration[] = [
  {
    num: 1,
    title: "Parallel Board",
    desc: "New \"Board of Autonomous Medical Practice\" with non-clinician majority. Separate from, and preemptive of, the existing state medical board.",
  },
  {
    num: 2,
    title: "Sandbox-as-Structure",
    desc: "Two-year live-patient sandbox with default-to-approval at 90 days and a burden-of-proof inversion favoring applicants.",
  },
  {
    num: 3,
    title: "Standard-of-Care Redefinition",
    desc: "\"Economic stewardship\" baked into the duty of loyalty, with an affiliate-steering safe harbor for cheaper substitutes.",
  },
  {
    num: 4,
    title: "Liability Shield",
    desc: "Non-economic damages cap for sandbox participants, Medical Director non-liability, and Corporate Practice of Medicine waiver.",
  },
  {
    num: 5,
    title: "Reimbursement Manufacture",
    desc: "AAASPs deemed eligible providers for state Medicaid, state employee plans, and private insurance (non-discrimination).",
  },
  {
    num: 6,
    title: "Reciprocity Cascade",
    desc: "Sandbox-state recognition creates multi-state network effects — once 5–7 states adopt, the network is self-sustaining.",
  },
  {
    num: 7,
    title: "Anti-Protectionism Framing",
    desc: "Legislative findings pre-empt medical-board pushback as \"economic self-interest\" rather than safety concern.",
  },
];

// Staggered entry delays sync with narration enumerating each consideration.
const ROW_DELAYS = [14, 65, 120, 170, 225, 280, 335];

export const AimsaSevenMoves: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const eyebrowP = spring({ frame, fps, config: { damping: 180 } });
  const h2P = spring({ frame: frame - 6, fps, config: { damping: 180 } });
  const subP = spring({ frame: frame - 12, fps, config: { damping: 180 } });

  const lineIn = (p: number, d = 24) => ({
    opacity: interpolate(p, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(p, [0, 1], [d, 0])}px)`,
  });

  const renderRow = (item: Consideration, idx: number) => {
    const p = spring({ frame: frame - ROW_DELAYS[idx], fps, config: { damping: 180 } });
    const enter = {
      opacity: interpolate(p, [0, 1], [0, 1]),
      transform: `translateX(${interpolate(p, [0, 1], [-18, 0])}px)`,
    };
    const isOrange = item.num >= 5;
    const accent = isOrange ? t.colors.orange : t.colors.blue;
    const isLast = idx === ITEMS.length - 1;
    return (
      <div
        key={item.num}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 26,
          padding: "16px 18px",
          borderBottom: isLast ? "none" : `1px solid ${t.colors.bgCardTintBorder}`,
          ...enter,
        }}
      >
        {/* Circle number badge */}
        <div
          style={{
            flex: "0 0 auto",
            width: 76,
            height: 76,
            borderRadius: 999,
            background: accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: t.font.family,
            fontSize: 38,
            fontWeight: t.font.weight.bold,
            color: t.colors.white,
            letterSpacing: "-0.02em",
            boxShadow: "0 2px 6px rgba(14, 40, 65, 0.18)",
          }}
        >
          {item.num}
        </div>

        {/* Title */}
        <div
          style={{
            flex: "0 0 360px",
            fontFamily: t.font.family,
            fontSize: 26,
            fontWeight: t.font.weight.bold,
            color: t.colors.navy,
            lineHeight: 1.2,
            letterSpacing: "-0.005em",
          }}
        >
          {item.title}
        </div>

        {/* Description */}
        <div
          style={{
            flex: "1 1 auto",
            fontFamily: t.font.family,
            fontSize: 23,
            color: t.colors.text,
            lineHeight: 1.4,
          }}
        >
          {item.desc}
        </div>
      </div>
    );
  };

  return (
    <AimsaContainer background="watermark" padding={70}>
      {/* Header block */}
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
        What State Boards Should Watch
      </div>
      <div
        style={{
          fontFamily: t.font.family,
          fontSize: 46,
          fontWeight: t.font.weight.bold,
          color: t.colors.navy,
          marginTop: 2,
          lineHeight: 1.05,
          ...lineIn(h2P),
        }}
      >
        Seven Considerations for State Medical Boards
      </div>
      <div
        style={{
          fontFamily: t.font.family,
          fontSize: 24,
          color: t.colors.text,
          marginTop: 4,
          fontStyle: "italic",
          ...lineIn(subP),
        }}
      >
        Coordinated design choices that reinforce each other
      </div>

      {/* Row stack — 7 full-width rows. No bottom callout — the "leverage
          point" idea is implicit in row #1 (Parallel Board) and would otherwise
          overlap with the FSMB watermark logo. */}
      <div
        style={{
          marginTop: 20,
          background: t.colors.bgCardTint,
          border: `2px solid ${t.colors.bgCardTintBorder}`,
          borderRadius: 14,
          boxShadow: t.shadows.card,
          padding: "8px 18px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {ITEMS.map((item, i) => renderRow(item, i))}
      </div>
    </AimsaContainer>
  );
};
