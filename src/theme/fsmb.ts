/**
 * FSMB brand tokens — shared by NarratedPresentation slide components.
 * Per brand guidelines in Projects/brand/regulAItor - Brand Guidelines.md.
 */

export const fsmbTheme = {
  colors: {
    blue: "#2563EB",      // Actions / primary
    orange: "#F7941D",    // Highlights / accents
    navy: "#2E4A6E",      // Structure / titles
    gold: "#D4A017",
    chrome: "#E5E7EB",
    bgLight: "#FAFAF9",
    bgDark: "#0F172A",
    textDark: "#0F172A",
    textLight: "#FAFAF9",
    textMuted: "#64748B",
  },
  fonts: {
    body: '"DM Sans", -apple-system, "Segoe UI", sans-serif',
    heading: '"DM Sans", -apple-system, "Segoe UI", sans-serif',
  },
  sizes: {
    titleXL: 120,
    titleL: 88,
    titleM: 64,
    body: 40,
    caption: 32,
    label: 24,
  },
} as const;

export type FsmbTheme = typeof fsmbTheme;
