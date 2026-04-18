/**
 * Shared animation primitives for briefing components.
 *
 * These helpers live in the lib so every BriefingX component animates with
 * the same vocabulary: spring-driven opacity fades paired with translate-Y
 * reveals. All timings target the 2-second-reveal rule from
 * `Projects/ai-briefings/DESIGN_GUIDELINES.md` §5.
 */

import { interpolate, spring, type SpringConfig } from "remotion";

/**
 * Opacity/translate-Y fade-in driven by a spring progress value in [0, 1].
 *
 * Usage:
 *   const p = spring({ frame: frame - 16, fps, config: { damping: 180 } });
 *   <div style={{ ...lineIn(p) }}>…</div>
 */
export function lineIn(
  progress: number,
  options: { fromY?: number } = {},
): React.CSSProperties {
  const { fromY = 24 } = options;
  return {
    opacity: interpolate(progress, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(progress, [0, 1], [fromY, 0])}px)`,
  };
}

/**
 * Compute a spring progress value for a given delayed frame in one call.
 * Avoids duplicating `spring({ frame: frame - delay, fps, config })` in
 * every component.
 */
export function revealAt(args: {
  frame: number;
  fps: number;
  delay?: number;
  damping?: number;
  mass?: number;
  stiffness?: number;
}): number {
  const { frame, fps, delay = 0, damping = 180, mass, stiffness } = args;
  const config: Partial<SpringConfig> = { damping };
  if (mass !== undefined) config.mass = mass;
  if (stiffness !== undefined) config.stiffness = stiffness;
  return spring({ frame: frame - delay, fps, config });
}

/**
 * Crossfade helper for components that switch between phases internally.
 * Given `phaseBreakFrame` (the anchor frame where phase 1 ends and phase 2
 * begins) and a `window` (total crossfade duration), returns the opacity
 * pair for the two phases.
 *
 * The window is centered on the phase break: opacity crosses 50/50 at
 * exactly `phaseBreakFrame`.
 */
export function phaseCrossfade(
  frame: number,
  phaseBreakFrame: number,
  window = 30,
): { phase1Opacity: number; phase2Opacity: number } {
  const half = window / 2;
  const start = phaseBreakFrame - half;
  const end = phaseBreakFrame + half;
  const phase1Opacity = interpolate(frame, [start, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const phase2Opacity = interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { phase1Opacity, phase2Opacity };
}
