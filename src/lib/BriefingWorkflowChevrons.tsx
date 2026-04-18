import React from "react";
import {
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { BriefingContainer } from "./BriefingContainer";
import { fsmbTheme } from "./themes/fsmb";
import { lineIn } from "./animations";
import type { Slide } from "../scenes/types";

/**
 * `workflow_chevrons` slide — cascading numbered chevrons for ordered
 * considerations/phases. Supports 1-N phases with an internal crossfade
 * anchored at each `phaseBreaks` mark (seconds into the slide).
 *
 * Each phase is its own cascade of chevron rows. Chevrons step down-and-
 * right with a darkening back-plate + drop shadow for depth. Numbered
 * circle badges anchor each row. No inter-badge arrows — the cascade IS
 * the rail.
 *
 * Props (slide.props):
 *   - phases:      ChevronPhase[]            // required
 *   - phaseBreaks: number[]                  // seconds-anchor per break
 *                                            //   (len = phases.length - 1)
 */

export type ChevronItem = {
  num: number;
  title: string;
  desc: string;
};

export type ChevronPhase = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  color?: "blue" | "orange";
  items?: ChevronItem[];
};

export type WorkflowChevronsProps = {
  phases?: ChevronPhase[];
  /** Seconds at which each phase ends / next phase begins. Length = phases.length - 1. */
  phaseBreaks?: number[];
};

const CROSSFADE_FRAMES = 30;

export const BriefingWorkflowChevrons: React.FC<{ slide: Slide }> = ({
  slide,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const p = (slide.props as WorkflowChevronsProps | undefined) ?? {};
  const phases = p.phases ?? [];
  const phaseBreakSeconds = p.phaseBreaks ?? [];

  if (phases.length === 0) {
    return <BriefingContainer background="watermark" logoPath="aimsa-bg/fsmb-logo.png"><></></BriefingContainer>;
  }

  // Frame at which each phase's crossfade CENTER sits. Phase k ends at
  // phaseBreakSeconds[k] (k < phases.length - 1). The crossfade window is
  // centered on that anchor with ±half-window on each side.
  const breakFrames = phaseBreakSeconds.map((s) => Math.round(s * fps));

  // Determine the active phase (the one with opacity > 0) + compute per-
  // phase opacity for the crossfade overlay window.
  const half = CROSSFADE_FRAMES / 2;

  const phaseOpacities = phases.map((_, i) => {
    // Phase i is visible between breakFrames[i-1] (fade-in end) and
    // breakFrames[i] (fade-out start). First phase fades in at frame 0;
    // last phase stays to end of slide.
    const fadeInEnd = i === 0 ? 0 : breakFrames[i - 1] + half;
    const fadeOutStart = i === phases.length - 1 ? Infinity : breakFrames[i] - half;
    const fadeOutEnd = i === phases.length - 1 ? Infinity : breakFrames[i] + half;

    if (frame < fadeInEnd - CROSSFADE_FRAMES) return 0;
    if (frame >= fadeOutEnd) return 0;
    if (frame < fadeInEnd) {
      // Fading in from the previous phase
      return interpolate(
        frame,
        [fadeInEnd - CROSSFADE_FRAMES, fadeInEnd],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      );
    }
    if (frame < fadeOutStart) return 1;
    return interpolate(
      frame,
      [fadeOutStart, fadeOutEnd],
      [1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
  });

  // Compute each phase's local frame (frame relative to phase start) so
  // reveal animations play when that phase becomes visible. Phase 0
  // starts at frame 0; phase k (k>0) starts at breakFrames[k-1].
  const phaseStartFrames = phases.map((_, i) => (i === 0 ? 0 : breakFrames[i - 1]));

  return (
    <BriefingContainer background="watermark" logoPath="aimsa-bg/fsmb-logo.png" padding={70}>
      {phases.map((phase, i) => {
        const opacity = phaseOpacities[i];
        if (opacity === 0) return null;
        const localFrame = frame - phaseStartFrames[i];
        return (
          <PhasePanel
            key={i}
            phase={phase}
            phaseIndex={i}
            phaseTotal={phases.length}
            localFrame={localFrame}
            fps={fps}
            opacity={opacity}
          />
        );
      })}
    </BriefingContainer>
  );
};

// ---------------------------------------------------------------------------

const PhasePanel: React.FC<{
  phase: ChevronPhase;
  phaseIndex: number;
  phaseTotal: number;
  localFrame: number;
  fps: number;
  opacity: number;
}> = ({ phase, phaseIndex, phaseTotal, localFrame, fps, opacity }) => {
  const t = fsmbTheme;
  const accent =
    phase.color === "orange" ? t.colors.orange : t.colors.blue;
  const items = phase.items ?? [];

  const eyebrowP = spring({ frame: localFrame, fps, config: { damping: 180 } });
  const h2P = spring({ frame: localFrame - 6, fps, config: { damping: 180 } });
  const subP = spring({ frame: localFrame - 12, fps, config: { damping: 180 } });

  // Step-indent: tighter cascade for larger item counts; looser for short
  // phases (mirrors AimsaSevenMoves' 70px Phase-1, 90px Phase-2 distinction).
  const stepIndent = items.length >= 4 ? 70 : 90;
  const tallerRows = items.length <= 3;

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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {phase.eyebrow && (
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
            {phase.eyebrow}
          </div>
        )}
        <ProgressDots
          phaseIndex={phaseIndex}
          phaseTotal={phaseTotal}
          accent={accent}
          opacity={interpolate(eyebrowP, [0, 1], [0, 1])}
        />
      </div>

      {phase.title && (
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
            {phase.title}
          </div>
        </div>
      )}

      {phase.subtitle && (
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
          {phase.subtitle}
        </div>
      )}

      <div
        style={{
          marginTop: 30,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          minHeight: 0,
        }}
      >
        {items.map((item, i) => (
          <ChevronStep
            key={item.num}
            item={item}
            accent={accent}
            indentLeft={i * stepIndent}
            reservedRight={(items.length - 1 - i) * Math.round(stepIndent * 0.25)}
            revealDelay={12 + i * 10}
            localFrame={localFrame}
            fps={fps}
            tallerRows={tallerRows}
            stepIndex={i}
          />
        ))}
      </div>
    </div>
  );
};

const ChevronStep: React.FC<{
  item: ChevronItem;
  accent: string;
  indentLeft: number;
  reservedRight: number;
  revealDelay: number;
  localFrame: number;
  fps: number;
  tallerRows: boolean;
  stepIndex: number;
}> = ({
  item,
  accent,
  indentLeft,
  reservedRight,
  revealDelay,
  localFrame,
  fps,
  tallerRows,
  stepIndex,
}) => {
  const t = fsmbTheme;
  const p = spring({
    frame: localFrame - revealDelay,
    fps,
    config: { damping: 180 },
  });
  const chevronClip =
    "polygon(0 0, calc(100% - 40px) 0, 100% 50%, calc(100% - 40px) 100%, 0 100%)";
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
        transform: `translate(${interpolate(p, [0, 1], [-24, 0])}px, ${interpolate(
          p,
          [0, 1],
          [-12, 0],
        )}px)`,
      }}
    >
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
          boxShadow:
            "0 14px 28px rgba(14, 40, 65, 0.18), 0 6px 10px rgba(14, 40, 65, 0.12)",
          zIndex: 1,
        }}
      >
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
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            minWidth: 0,
          }}
        >
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

const ProgressDots: React.FC<{
  phaseIndex: number;
  phaseTotal: number;
  accent: string;
  opacity: number;
}> = ({ phaseIndex, phaseTotal, accent, opacity }) => (
  <div style={{ display: "flex", gap: 10, alignItems: "center", opacity }}>
    {Array.from({ length: phaseTotal }).map((_, i) => (
      <div
        key={i}
        style={{
          width: 14,
          height: 14,
          borderRadius: 999,
          background: i === phaseIndex ? accent : "transparent",
          border: `2px solid ${accent}`,
        }}
      />
    ))}
  </div>
);
