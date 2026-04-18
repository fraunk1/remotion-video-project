/**
 * FSMB brand theme — colors, DM Sans typography, card shadows.
 *
 * The palette + typography + shadow tokens are sourced from the canonical
 * `fsmb-tokens.json` (auto-propagated from `Projects/ai-briefings/tokens/
 * fsmb-tokens.json` via `scripts/generate_tokens.py`). Do NOT hand-edit the
 * JSON copy — edit the source file in ai-briefings and re-run the
 * generator. That keeps HTML deck (CSS custom properties) and Remotion
 * components reading the same numbers.
 */

import type React from "react";
import tokens from "./fsmb-tokens.json";

export const fsmbTheme = {
  colors: tokens.colors,
  font: tokens.font,
  sizes: tokens.sizes,
  timing: tokens.timing,
  shadows: tokens.shadows,
} as const;

export type BriefingTheme = typeof fsmbTheme;

/**
 * Slide-type → container background map. Lets components ask the theme
 * "what container should a `title` slide render on?" rather than hardcoding.
 * Source of truth: `fsmb-tokens.json` → `slideContainers`.
 */
export const slideContainerDefaults: Readonly<Record<string, string>> = tokens.slideContainers as Record<string, string>;

/**
 * Shared citation/hyperlink style — monospace + blue-underline treatment.
 * Apply to every citation URL across slides to signal linkable intent.
 */
export const citationStyle: React.CSSProperties = {
  fontFamily: tokens.font.mono,
  fontSize: tokens.sizes.cite - 4,   // footnote-sized: 14px when cite size is 18
  color: tokens.colors.blue,
  textDecoration: "underline",
  textDecorationColor: "rgba(24, 154, 207, 0.45)",
  textDecorationThickness: 1,
  textUnderlineOffset: 3,
  letterSpacing: "0.01em",
  marginTop: 6,
  display: "block",
  wordBreak: "break-all",
  lineHeight: 1.4,
};
