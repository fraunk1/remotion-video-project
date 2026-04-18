/**
 * Shared Remotion components for AI Briefings videos.
 *
 * New briefings should import from here instead of copying from
 * components/chiles/. The Chiles briefing kept its own namespace because it
 * shipped — those components are the historical reference for this library.
 */

export { BriefingContainer } from "./BriefingContainer";
export type { BriefingBackground, SwooshAssets } from "./BriefingContainer";
export { BriefingSectionHeader } from "./BriefingSectionHeader";
export { BriefingTitle } from "./BriefingTitle";
export { BriefingClosing } from "./BriefingClosing";
export { BriefingContent } from "./BriefingContent";
export { BriefingIconRow } from "./BriefingIconRow";
export type {
  IconRowIcon,
  IconRowLegendChip,
  IconRowCallout,
  IconRowProps,
} from "./BriefingIconRow";
export { BriefingWorkflowChevrons } from "./BriefingWorkflowChevrons";
export type {
  ChevronItem,
  ChevronPhase,
  WorkflowChevronsProps,
} from "./BriefingWorkflowChevrons";
export { BriefingComparativePanels } from "./BriefingComparativePanels";
export type {
  ComparativePanel,
  ComparativePanelItem,
  ComparativePanelsProps,
} from "./BriefingComparativePanels";
export { BriefingSourcesGrid } from "./BriefingSourcesGrid";
export type { SourcesGridTile, SourcesGridProps } from "./BriefingSourcesGrid";
export { BriefingTakeawayGraySwoosh } from "./BriefingTakeawayGraySwoosh";
export type { TakeawayGraySwooshProps } from "./BriefingTakeawayGraySwoosh";
export { BriefingAgenda } from "./BriefingAgenda";
export type { AgendaPillar, AgendaCallout, AgendaProps } from "./BriefingAgenda";
export { BriefingContentCards } from "./BriefingContentCards";
export type {
  ContentCard,
  ContentCardBullet,
  ContentCardsCallout,
  ContentCardsProps,
} from "./BriefingContentCards";
export { fsmbTheme, citationStyle } from "./themes/fsmb";
export type { BriefingTheme } from "./themes/fsmb";
export { lineIn, revealAt, phaseCrossfade } from "./animations";
