import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { AimsaContainer } from "./AimsaContainer";
import { aimsaTheme as t } from "./theme";

/**
 * Slide 8 — Seven Considerations for State Medical Boards, presented as
 * two cascading chevron waterfalls that crossfade at the narrative midpoint.
 *
 *   Phase 1 (frames 0 – 585)  : "Board-Level Design Choices" — moves 1–4
 *   Phase 2 (frames 615 – end): "System-Level Consequences" — moves 5–7
 *
 * Each consideration is a horizontal chevron bar that steps down and right,
 * diminishing in width — a visual cascade. Clean single-idea per slide,
 * Parallel-Board-style focus.
 */

type Consideration = {
  num: number;
  title: string;
  desc: string;
};

const PHASE_1: Consideration[] = [
  {
    num: 1,
    title: "Parallel Board",
    desc: "New \"Board of Autonomous Medical Practice\" with non-clinician majority; separate from and preemptive of the existing state medical board.",
  },
  {
    num: 2,
    title: "Sandbox-as-Structure",
    desc: "Two-year live-patient sandbox with default-to-approval at 90 days and a burden-of-proof inversion favoring applicants.",
  },
  {
    num: 3,
    title: "Standard-of-Care Redefinition",
    desc: "\"Economic stewardship\" baked into duty of loyalty, with an affiliate-steering safe harbor for cheaper substitutes.",
  },
  {
    num: 4,
    title: "Liability Shield",
    desc: "Non-economic damages cap, Medical Director non-liability, and Corporate Practice of Medicine waiver.",
  },
];

const PHASE_2: Consideration[] = [
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

const TRANSITION_START = 585;
const TRANSITION_END = 615;

export const AimsaSevenMoves: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phase1Opacity = interpolate(
    frame,
    [TRANSITION_START, TRANSITION_END],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const phase2Opacity = interpolate(
    frame,
    [TRANSITION_START, TRANSITION_END],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AimsaContainer background="watermark" padding={70}>
      {frame < TRANSITION_START && (
        <PhasePanel kind="phase1" frame={frame} fps={fps} opacity={1} />
      )}
      {frame >= TRANSITION_START && frame < TRANSITION_END && (
        <>
          <PhasePanel kind="phase1" frame={frame} fps={fps} opacity={phase1Opacity} />
          <PhasePanel kind="phase2" frame={frame} fps={fps} opacity={phase2Opacity} />
        </>
      )}
      {frame >= TRANSITION_END && (
        <PhasePanel kind="phase2" frame={frame} fps={fps} opacity={1} />
      )}
    </AimsaContainer>
  );
};

// -------------------------------------------------------------------------
// Phase panel
// -------------------------------------------------------------------------
type PhaseKind = "phase1" | "phase2";

const PhasePanel: React.FC<{ kind: PhaseKind; frame: number; fps: number; opacity: number }> = ({
  kind,
  frame,
  fps,
  opacity,
}) => {
  const isPhase1 = kind === "phase1";
  const localFrame = isPhase1 ? frame : frame - TRANSITION_END;
  const items = isPhase1 ? PHASE_1 : PHASE_2;
  const accent = isPhase1 ? t.colors.blue : t.colors.orange;
  const partLabel = isPhase1 ? "Part 1 of 2 · How the Board Is Designed" : "Part 2 of 2 · What the Board Produces";
  const title = isPhase1 ? "Board-Level Design Choices" : "System-Level Consequences";
  const subtitle = isPhase1
    ? "Four coordinated choices that define the regulatory surface"
    : "Three downstream effects that propagate once the board exists";

  const eyebrowP = spring({ frame: localFrame, fps, config: { damping: 180 } });
  const h2P = spring({ frame: localFrame - 6, fps, config: { damping: 180 } });
  const subP = spring({ frame: localFrame - 12, fps, config: { damping: 180 } });

  const lineIn = (p: number, d = 24) => ({
    opacity: interpolate(p, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(p, [0, 1], [d, 0])}px)`,
  });

  // Vertical layout: header block + stacked chevrons filling remainder.
  // Phase 1: 4 chevrons · Phase 2: 3 chevrons (taller per chevron).
  const chevronCount = items.length;
  const chevronGap = 14;
  // Stepping: each chevron shifts right by `stepIndent` px and narrows.
  const stepIndent = isPhase1 ? 70 : 90;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        padding: "70px 70px 210px 70px",
        display: "flex",
        flexDirection: "column",
        opacity,
        boxSizing: "border-box",
      }}
    >
      {/* Header row — eyebrow + progress indicator on same baseline */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            fontFamily: t.font.family,
            fontSize: 22,
            fontWeight: t.font.weight.semibold,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: accent,
            ...lineIn(eyebrowP),
          }}
        >
          {partLabel}
        </div>
        <ProgressDots isPhase1={isPhase1} accent={accent} opacity={interpolate(eyebrowP, [0, 1], [0, 1])} />
      </div>

      {/* H2 with accent underline */}
      <div style={{ ...lineIn(h2P), marginTop: 4 }}>
        <div
          style={{
            fontFamily: t.font.family,
            fontSize: 58,
            fontWeight: t.font.weight.bold,
            color: t.colors.navy,
            lineHeight: 1.05,
            display: "inline-block",
            borderBottom: `4px solid ${accent}`,
            paddingBottom: 6,
          }}
        >
          {title}
        </div>
      </div>

      <div
        style={{
          fontFamily: t.font.family,
          fontSize: 28,
          color: t.colors.text,
          marginTop: 14,
          fontStyle: "italic",
          ...lineIn(subP),
        }}
      >
        {subtitle}
      </div>

      {/* Chevron waterfall — each chevron indented right, slightly narrower */}
      <div
        style={{
          marginTop: 30,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: chevronGap,
          minHeight: 0,
        }}
      >
        {items.map((item, i) => (
          <ChevronStep
            key={item.num}
            item={item}
            accent={accent}
            indentLeft={i * stepIndent}
            reservedRight={(chevronCount - 1 - i) * Math.round(stepIndent * 0.25)}
            revealDelay={12 + i * 10}
            localFrame={localFrame}
            fps={fps}
            tallerRows={!isPhase1}
            stepIndex={i}
          />
        ))}
      </div>
    </div>
  );
};

// -------------------------------------------------------------------------
// Stepping chevron — a single consideration row with chevron-arrow shape
// -------------------------------------------------------------------------
const ChevronStep: React.FC<{
  item: Consideration;
  accent: string;
  indentLeft: number;
  reservedRight: number;
  revealDelay: number;
  localFrame: number;
  fps: number;
  tallerRows: boolean;
  stepIndex: number;
}> = ({ item, accent, indentLeft, reservedRight, revealDelay, localFrame, fps, tallerRows, stepIndex }) => {
  const p = spring({ frame: localFrame - revealDelay, fps, config: { damping: 180 } });
  // Chevron shape — arrow point on the right, flat on the left.
  const chevronClip = "polygon(0 0, calc(100% - 40px) 0, 100% 50%, calc(100% - 40px) 100%, 0 100%)";

  // Depth cues: each step has a darker "back plate" offset down-right giving
  // a real stacked/staircase feel, plus a strong drop shadow. Steps overlap
  // slightly with marginTop negative so they read as connected stairs.
  const depthOffset = 10;

  return (
    <div
      style={{
        marginLeft: indentLeft,
        marginRight: reservedRight,
        marginTop: stepIndex > 0 ? -8 : 0,
        flex: 1,
        minHeight: 0,
        position: "relative",
        opacity: interpolate(p, [0, 1], [0, 1]),
        transform: `translate(${interpolate(p, [0, 1], [-24, 0])}px, ${interpolate(p, [0, 1], [-12, 0])}px)`,
      }}
    >
      {/* Back plate — darker shade, offset down-right to show depth */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: t.colors.navy,
          opacity: 0.22,
          clipPath: chevronClip,
          transform: `translate(${depthOffset}px, ${depthOffset}px)`,
          filter: "blur(2px)",
        }}
      />

      {/* Riser edge — thin darker strip at the bottom of the step face */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, transparent 0%, transparent 86%, ${accent}22 88%, ${accent}44 100%)`,
          clipPath: chevronClip,
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Main step face */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          background: `linear-gradient(180deg, #FCFDFE 0%, ${t.colors.bgCardGray} 60%, ${t.colors.bgCardGray} 100%)`,
          borderLeft: `6px solid ${accent}`,
          clipPath: chevronClip,
          padding: "18px 60px 18px 28px",
          display: "flex",
          alignItems: "center",
          gap: 24,
          boxShadow: `0 14px 28px rgba(14, 40, 65, 0.18), 0 6px 10px rgba(14, 40, 65, 0.12)`,
          zIndex: 1,
        }}
      >
        {/* Number badge */}
        <div
          style={{
            flex: "0 0 auto",
            width: tallerRows ? 80 : 68,
            height: tallerRows ? 80 : 68,
            borderRadius: 999,
            background: accent,
            color: t.colors.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: t.font.family,
            fontSize: tallerRows ? 40 : 34,
            fontWeight: t.font.weight.bold,
            letterSpacing: "-0.02em",
            boxShadow: `0 3px 8px ${accent}44`,
          }}
        >
          {item.num}
        </div>

        {/* Title + description stacked */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
          <div
            style={{
              fontFamily: t.font.family,
              fontSize: tallerRows ? 28 : 24,
              fontWeight: t.font.weight.bold,
              color: t.colors.navy,
              lineHeight: 1.15,
              letterSpacing: "-0.005em",
            }}
          >
            {item.title}
          </div>
          <div
            style={{
              fontFamily: t.font.family,
              fontSize: tallerRows ? 22 : 20,
              color: t.colors.text,
              lineHeight: 1.4,
            }}
          >
            {item.desc}
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------------------
// Progress dots — ● ○ for Phase 1, ○ ● for Phase 2
// -------------------------------------------------------------------------
const ProgressDots: React.FC<{ isPhase1: boolean; accent: string; opacity: number }> = ({
  isPhase1,
  accent,
  opacity,
}) => (
  <div
    style={{
      display: "flex",
      gap: 10,
      alignItems: "center",
      opacity,
    }}
  >
    <div
      style={{
        width: 14,
        height: 14,
        borderRadius: 999,
        background: isPhase1 ? accent : "transparent",
        border: `2px solid ${accent}`,
      }}
    />
    <div
      style={{
        width: 14,
        height: 14,
        borderRadius: 999,
        background: isPhase1 ? "transparent" : accent,
        border: `2px solid ${accent}`,
      }}
    />
  </div>
);
