"""Tests for extract_deck.py — HTML → scene.json."""

from pathlib import Path

import pytest

from scripts.extract_deck import (
    extract_from_html,
    apply_overrides,
    normalize_notes_for_tts,
    detect_slide_type,
)


FIXTURES = Path(__file__).parent / "fixtures"


def test_extract_slides_from_sample_deck():
    html = (FIXTURES / "sample_deck.html").read_text(encoding="utf-8")
    slides = extract_from_html(html)

    assert len(slides) == 4
    assert slides[0].id == "slide-01"
    assert slides[0].type == "title"
    assert slides[0].title == "AI in Medical Regulation"
    assert slides[0].subtitle == "2026 Outlook"
    assert slides[1].type == "bullets"
    assert len(slides[1].bullets) == 3
    assert "Generative models" in slides[1].bullets[0]
    assert slides[2].type == "quote"
    assert slides[3].type == "closing"


def test_extract_speaker_notes():
    html = (FIXTURES / "sample_deck.html").read_text(encoding="utf-8")
    slides = extract_from_html(html)

    assert "Good morning" in slides[0].notes
    assert "Key stat" in slides[1].notes


def test_normalize_notes_strips_stage_directions():
    text = "Good morning everyone. [pause] Today we begin. [click]"
    cleaned = normalize_notes_for_tts(text)

    assert "[pause]" not in cleaned
    assert "[click]" not in cleaned
    assert "Good morning everyone." in cleaned
    assert "Today we begin." in cleaned


def test_normalize_notes_ends_with_punctuation():
    cleaned = normalize_notes_for_tts("Hello world")
    assert cleaned.endswith((".", "!", "?"))


def test_normalize_notes_collapses_whitespace():
    cleaned = normalize_notes_for_tts("Hello    world.\n\nFoo    bar.")
    assert "    " not in cleaned


def test_apply_overrides_replaces_notes():
    html = (FIXTURES / "sample_deck.html").read_text(encoding="utf-8")
    slides = extract_from_html(html)
    overrides_path = FIXTURES / "sample_overrides.md"

    slides = apply_overrides(slides, overrides_path)

    assert "forty percent uptick" in slides[1].notes
    assert "Good morning" in slides[0].notes


def test_apply_overrides_missing_file_is_ok():
    html = (FIXTURES / "sample_deck.html").read_text(encoding="utf-8")
    slides = extract_from_html(html)
    slides_after = apply_overrides(slides, Path("nonexistent.md"))
    assert slides == slides_after


def test_apply_overrides_orphan_raises():
    html = (FIXTURES / "sample_deck.html").read_text(encoding="utf-8")
    slides = extract_from_html(html)

    import tempfile
    with tempfile.NamedTemporaryFile("w", suffix=".md", delete=False, encoding="utf-8") as f:
        f.write("## slide-99\n\nThis slide does not exist.")
        tmp = Path(f.name)

    try:
        with pytest.raises(ValueError, match="slide-99"):
            apply_overrides(slides, tmp)
    finally:
        tmp.unlink()


def test_detect_slide_type_heuristics():
    from bs4 import BeautifulSoup
    parse = lambda s: BeautifulSoup(s, "html.parser")
    assert detect_slide_type(parse("<section><h1>T</h1><h3>S</h3></section>").section) == "title"
    assert detect_slide_type(parse("<section><ul><li>a</li></ul></section>").section) == "bullets"
    assert detect_slide_type(parse("<section><blockquote>q</blockquote></section>").section) == "quote"
    assert detect_slide_type(parse("<section><h2>Thank You</h2></section>").section) == "closing"
    assert detect_slide_type(parse("<section><p>just text</p></section>").section) == "content"
