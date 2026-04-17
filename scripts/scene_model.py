"""Scene data model — the JSON contract between extractor, voiceover generator, and Remotion.

This module owns the Python side of the contract. The TypeScript side
(src/scenes/types.ts) mirrors the same shape and will be created separately.
"""

from __future__ import annotations

import json
from dataclasses import dataclass, field, asdict
from pathlib import Path
from typing import Any, Optional

# Slide type names are free-form strings. The built-in components recognize
# "title", "bullets", "twoColumn", "quote", "closing", "content",
# "section_header", "agenda"; briefings can introduce their own types and
# register components for them in GenericBriefing's componentRegistry.
SlideType = str


@dataclass
class VoiceRef:
    sample_id: str
    sample_path: str
    reference_text: str


@dataclass
class Theme:
    accent: str = "#F7941D"
    navy: str = "#2E4A6E"
    font: str = "DM Sans"


@dataclass
class AudioRef:
    file: str = ""
    duration_seconds: float = 0.0
    content_hash: str = ""


@dataclass
class Slide:
    id: str
    type: SlideType
    title: str
    subtitle: Optional[str] = None
    bullets: list[str] = field(default_factory=list)
    image: Optional[str] = None
    notes: str = ""
    audio: AudioRef = field(default_factory=AudioRef)
    # Per-slide props forwarded to the component registered for this type.
    props: Optional[dict[str, Any]] = None


@dataclass
class Scene:
    version: int
    source_deck: str
    title: str
    captions: bool
    voice: VoiceRef
    theme: Theme
    slides: list[Slide]

    def to_json(self) -> str:
        return json.dumps(asdict(self), indent=2, ensure_ascii=False)

    def write(self, path: Path) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(self.to_json(), encoding="utf-8")

    @classmethod
    def read(cls, path: Path) -> "Scene":
        data = json.loads(path.read_text(encoding="utf-8"))
        return cls(
            version=data["version"],
            source_deck=data["source_deck"],
            title=data["title"],
            captions=data.get("captions", True),
            voice=VoiceRef(**data["voice"]),
            theme=Theme(**data["theme"]),
            slides=[
                Slide(
                    id=s["id"],
                    type=s["type"],
                    title=s["title"],
                    subtitle=s.get("subtitle"),
                    bullets=s.get("bullets", []),
                    image=s.get("image"),
                    notes=s.get("notes", ""),
                    audio=AudioRef(**s.get("audio", {})),
                    props=s.get("props"),
                )
                for s in data["slides"]
            ],
        )
