"""Tests for the content-hash cache key logic — no real synthesis."""

from scripts.generate_voiceover import compute_content_hash


def test_hash_stable_for_same_inputs():
    a = compute_content_hash("hello", "voice-a", "model-v1", seed=42)
    b = compute_content_hash("hello", "voice-a", "model-v1", seed=42)
    assert a == b


def test_hash_changes_with_text():
    a = compute_content_hash("hello", "voice-a", "model-v1", seed=42)
    b = compute_content_hash("goodbye", "voice-a", "model-v1", seed=42)
    assert a != b


def test_hash_changes_with_voice():
    a = compute_content_hash("hello", "voice-a", "model-v1", seed=42)
    b = compute_content_hash("hello", "voice-b", "model-v1", seed=42)
    assert a != b


def test_hash_changes_with_model_version():
    a = compute_content_hash("hello", "voice-a", "model-v1", seed=42)
    b = compute_content_hash("hello", "voice-a", "model-v2", seed=42)
    assert a != b


def test_hash_changes_with_seed():
    a = compute_content_hash("hello", "voice-a", "model-v1", seed=42)
    b = compute_content_hash("hello", "voice-a", "model-v1", seed=43)
    assert a != b
