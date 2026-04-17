/**
 * TypeScript mirror of scripts/scene_model.py.
 * Keep these two files in sync.
 */

// Known slide types used by built-in components. Briefings may register
// additional types via GenericBriefing's componentRegistry — the `& {}` trick
// preserves autocomplete on known names while allowing any string.
export type SlideType =
  | "title"
  | "bullets"
  | "twoColumn"
  | "quote"
  | "closing"
  | "content"
  | "section_header"
  | "agenda"
  | (string & {});

export interface VoiceRef {
  sample_id: string;
  sample_path: string;
  reference_text: string;
}

export interface Theme {
  accent: string;
  navy: string;
  font: string;
}

export interface AudioRef {
  file: string;
  duration_seconds: number;
  content_hash: string;
}

export interface Slide {
  id: string;
  type: SlideType;
  title: string;
  subtitle: string | null;
  bullets: string[];
  image: string | null;
  notes: string;
  audio: AudioRef;
  // Per-slide props passed to the registered component for `type`.
  // GenericBriefing forwards these straight through.
  props?: Record<string, unknown>;
}

export interface Scene {
  version: number;
  source_deck: string;
  title: string;
  captions: boolean;
  voice: VoiceRef;
  theme: Theme;
  slides: Slide[];
}
