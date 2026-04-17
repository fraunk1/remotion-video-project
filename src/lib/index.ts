/**
 * Shared Remotion components for AI Briefings videos.
 *
 * New briefings should import from here instead of copying from
 * components/chiles/. The Chiles briefing kept its own namespace because it
 * shipped — those components are the historical reference for this library.
 */

export { BriefingContainer } from "./BriefingContainer";
export type { BriefingBackground } from "./BriefingContainer";
export { BriefingSectionHeader } from "./BriefingSectionHeader";
export { BriefingTitle } from "./BriefingTitle";
export { BriefingClosing } from "./BriefingClosing";
export { BriefingContent } from "./BriefingContent";
export { fsmbTheme } from "./themes/fsmb";
export type { BriefingTheme } from "./themes/fsmb";
