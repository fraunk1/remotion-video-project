"""Extract scene.json from a Reveal.js HTML deck.

Usage:
    python scripts/extract_deck.py \
        --deck path/to/deck.html \
        --overrides path/to/narration_overrides.md \
        --output src/scenes/my-video.json \
        --voice frank-formal-v1
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path
from typing import Optional

from bs4 import BeautifulSoup, Tag

from scripts.scene_model import AudioRef, Scene, Slide, SlideType, Theme, VoiceRef


STAGE_DIRECTION_PATTERN = re.compile(r"\[[^\]]+\]")
WHITESPACE_PATTERN = re.compile(r"\s+")
CLOSING_HINTS = ("thank you", "questions", "q&a", "q & a", "thanks")


def detect_slide_type(section: Tag) -> SlideType:
    """Heuristic classifier for slide content."""
    if section.find("blockquote"):
        return "quote"

    title_el = section.find(["h1", "h2"])
    if title_el:
        title_text = title_el.get_text(strip=True).lower()
        if any(hint in title_text for hint in CLOSING_HINTS):
            return "closing"

    h1 = section.find("h1")
    h3 = section.find("h3")
    if h1 and h3:
        return "title"

    if section.find("ul"):
        return "bullets"

    cols = section.find_all("div", class_=re.compile(r"col-"))
    if len(cols) >= 2:
        return "twoColumn"

    return "content"


def _text_or_none(el: Optional[Tag]) -> Optional[str]:
    return el.get_text(strip=True) if el else None


def extract_from_html(html: str) -> list[Slide]:
    """Parse Reveal.js HTML into a list of Slide objects."""
    soup = BeautifulSoup(html, "html.parser")
    sections = soup.select("div.slides > section")
    if not sections:
        sections = [s for s in soup.find_all("section") if s.find(["h1", "h2", "h3"])]

    slides: list[Slide] = []
    for i, section in enumerate(sections, start=1):
        slide_id = f"slide-{i:02d}"
        slide_type = detect_slide_type(section)

        title = _text_or_none(section.find(["h1", "h2"])) or ""
        subtitle = _text_or_none(section.find("h3"))

        bullets: list[str] = []
        ul = section.find("ul")
        if ul:
            bullets = [li.get_text(strip=True) for li in ul.find_all("li", recursive=False)]

        image: Optional[str] = None
        img = section.find("img")
        if img and img.get("src"):
            image = img["src"]

        if slide_type == "quote" and not title:
            bq = section.find("blockquote")
            if bq:
                title = bq.get_text(strip=True).strip('"')

        notes_aside = section.find("aside", class_="notes")
        notes_raw = notes_aside.get_text(separator=" ", strip=True) if notes_aside else ""
        notes = normalize_notes_for_tts(notes_raw)

        slides.append(Slide(
            id=slide_id,
            type=slide_type,
            title=title,
            subtitle=subtitle,
            bullets=bullets,
            image=image,
            notes=notes,
            audio=AudioRef(),
        ))

    return slides


def normalize_notes_for_tts(text: str) -> str:
    """Strip stage directions, collapse whitespace, enforce trailing punctuation."""
    if not text:
        return ""
    text = STAGE_DIRECTION_PATTERN.sub("", text)
    text = WHITESPACE_PATTERN.sub(" ", text).strip()
    if not text:
        return ""
    if not text.endswith((".", "!", "?")):
        text = text + "."
    return text


def apply_overrides(slides: list[Slide], overrides_path: Path) -> list[Slide]:
    """Overlay Markdown overrides onto matching slides. Missing file is fine."""
    if not overrides_path.exists():
        return slides

    text = overrides_path.read_text(encoding="utf-8")
    pattern = re.compile(r"^##\s+(slide-\d+)\s*$", re.MULTILINE)
    matches = list(pattern.finditer(text))
    overrides: dict[str, str] = {}
    for i, m in enumerate(matches):
        slide_id = m.group(1).strip()
        start = m.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        body = text[start:end].strip()
        if body:
            overrides[slide_id] = normalize_notes_for_tts(body)

    slide_ids = {s.id for s in slides}
    orphans = set(overrides.keys()) - slide_ids
    if orphans:
        raise ValueError(f"Override sections reference nonexistent slides: {sorted(orphans)}")

    for slide in slides:
        if slide.id in overrides:
            slide.notes = overrides[slide.id]

    return slides


def _slugify_title(text: str) -> str:
    s = re.sub(r"[^\w\s-]", "", text).strip().lower()
    return re.sub(r"[\s-]+", "-", s) or "untitled"


def main() -> int:
    parser = argparse.ArgumentParser(description="Extract scene.json from a Reveal.js deck")
    parser.add_argument("--deck", required=True, type=Path)
    parser.add_argument("--overrides", type=Path, default=None)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--voice", required=True, help="Voice sample ID (e.g., frank-formal-v1)")
    parser.add_argument("--captions", action="store_true", default=True)
    args = parser.parse_args()

    if not args.deck.exists():
        print(f"ERROR: deck not found: {args.deck}", file=sys.stderr)
        return 1

    voiceover_pptx_root = Path(__file__).parent.parent.parent / "voiceover-pptx"
    voice_wav = voiceover_pptx_root / "voice_samples" / f"{args.voice}.wav"
    voice_txt = voiceover_pptx_root / "voice_samples" / f"{args.voice}.txt"
    if not voice_wav.exists():
        print(f"ERROR: voice sample not found: {voice_wav}", file=sys.stderr)
        print(f"       Run: cd ../voiceover-pptx && python scripts/capture_voice_sample.py --id {args.voice}", file=sys.stderr)
        return 1
    if not voice_txt.exists():
        print(f"ERROR: voice transcript not found: {voice_txt}", file=sys.stderr)
        return 1

    html = args.deck.read_text(encoding="utf-8")
    slides = extract_from_html(html)
    print(f"Extracted {len(slides)} slides from {args.deck.name}")

    overrides_path = args.overrides or (args.deck.parent / "narration_overrides.md")
    if overrides_path.exists():
        slides = apply_overrides(slides, overrides_path)
        print(f"Applied overrides from {overrides_path.name}")

    # Preserve existing audio metadata when re-extracting over an existing
    # scene.json. The voiceover cache keys on slide.audio.content_hash, so if
    # we wipe it on every run the cache never hits. Match by slide id.
    if args.output.exists():
        try:
            prior = Scene.read(args.output)
            prior_audio_by_id = {s.id: s.audio for s in prior.slides}
            preserved = 0
            for slide in slides:
                if slide.id in prior_audio_by_id:
                    slide.audio = prior_audio_by_id[slide.id]
                    preserved += 1
            if preserved:
                print(f"Preserved audio metadata for {preserved} slide(s) from existing scene.json")
        except Exception as e:
            print(f"WARN: could not reuse prior scene.json ({e}); starting fresh")

    soup = BeautifulSoup(html, "html.parser")
    title_tag = soup.find("title")
    deck_title = (title_tag.get_text(strip=True) if title_tag else "") or (slides[0].title if slides else "Untitled")

    scene = Scene(
        version=1,
        source_deck=str(args.deck.resolve()),
        title=deck_title,
        captions=args.captions,
        voice=VoiceRef(
            sample_id=args.voice,
            sample_path=str(voice_wav.resolve()),
            reference_text=voice_txt.read_text(encoding="utf-8").strip(),
        ),
        theme=Theme(),
        slides=slides,
    )
    scene.write(args.output)
    print(f"Wrote {args.output}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
