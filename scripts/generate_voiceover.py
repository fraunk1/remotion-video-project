"""Generate per-slide voiceover MP3s for a scene.json.

Reads scene.json, synthesizes each slide's notes via OmniVoice,
appends 400ms silence padding, updates scene.json with audio metadata,
and copies the final scene.json to public/scenes/ for Remotion.
"""

from __future__ import annotations

import argparse
import hashlib
import shutil
import subprocess
import sys
import time
from pathlib import Path

# Allow running this file directly (`python scripts/generate_voiceover.py`)
# in addition to `python -m scripts.generate_voiceover` by putting the project
# root on sys.path before importing the sibling module.
if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from scripts.scene_model import AudioRef, Scene


SILENCE_PADDING_SECONDS = 0.4


def compute_content_hash(text: str, voice_id: str, model_version: str, seed: int) -> str:
    payload = f"{text}|{voice_id}|{model_version}|{seed}".encode("utf-8")
    return hashlib.sha256(payload).hexdigest()[:16]


def probe_duration_seconds(path: Path) -> float:
    """Use ffprobe to get audio duration."""
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
        capture_output=True, text=True, check=True,
    )
    return float(result.stdout.strip())


def append_silence(mp3_path: Path, seconds: float) -> None:
    """Append `seconds` of silence to an MP3 in place (via ffmpeg concat)."""
    tmp = mp3_path.with_suffix(".padded.mp3")
    silence = mp3_path.with_suffix(".silence.mp3")

    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error",
         "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono",
         "-t", str(seconds), "-c:a", "libmp3lame", "-b:a", "192k", str(silence)],
        check=True,
    )

    list_file = mp3_path.with_suffix(".list.txt")
    list_file.write_text(f"file '{mp3_path.name}'\nfile '{silence.name}'\n", encoding="utf-8")

    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error",
         "-f", "concat", "-safe", "0", "-i", str(list_file),
         "-c", "copy", str(tmp)],
        check=True,
        cwd=str(mp3_path.parent),
    )

    silence.unlink()
    list_file.unlink()
    mp3_path.unlink()
    tmp.rename(mp3_path)


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate voiceover MP3s for a scene")
    parser.add_argument("--scene", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path, help="Output directory, e.g., public/voiceover/<name>/")
    args = parser.parse_args()

    if not args.scene.exists():
        print(f"ERROR: scene file not found: {args.scene}", file=sys.stderr)
        return 1

    from voiceover_pptx.tts import TTSConfig
    from voiceover_pptx.tts.omnivoice import OmniVoiceEngine

    scene = Scene.read(args.scene)
    args.output.mkdir(parents=True, exist_ok=True)

    config = TTSConfig(
        voice_sample=Path(scene.voice.sample_path),
        voice_sample_text=scene.voice.reference_text,
        output_format="mp3",
        seed=42,
    )
    engine = OmniVoiceEngine(config)
    if not engine.is_available():
        print("ERROR: OmniVoice is not installed in this venv. Run the smoke test.", file=sys.stderr)
        return 1

    model_version = OmniVoiceEngine.model_version()
    total = len(scene.slides)
    stats = {"cached": 0, "generated": 0, "skipped": 0}
    t_start = time.perf_counter()

    for i, slide in enumerate(scene.slides, start=1):
        slug = slide.id
        mp3_path = args.output / f"{slug}.mp3"
        content_hash = compute_content_hash(
            text=slide.notes,
            voice_id=scene.voice.sample_id,
            model_version=model_version,
            seed=config.seed,
        )

        preview = (slide.notes[:60] + "...") if len(slide.notes) > 60 else slide.notes

        if mp3_path.exists() and slide.audio.content_hash == content_hash:
            print(f"[{i}/{total}] {slug}: CACHED")
            stats["cached"] += 1
            continue

        if not slide.notes.strip():
            print(f"[{i}/{total}] {slug}: SKIP (empty notes)")
            slide.audio = AudioRef(file="", duration_seconds=0.0, content_hash=content_hash)
            stats["skipped"] += 1
            continue

        t0 = time.perf_counter()
        print(f"[{i}/{total}] {slug}: {preview!r}")
        engine.synthesize(slide.notes, mp3_path)
        append_silence(mp3_path, SILENCE_PADDING_SECONDS)
        duration = probe_duration_seconds(mp3_path)
        print(f"           -> {duration:.1f}s ({time.perf_counter() - t0:.1f}s synth)")

        rel_file = f"voiceover/{args.output.name}/{mp3_path.name}"
        slide.audio = AudioRef(
            file=rel_file,
            duration_seconds=round(duration, 3),
            content_hash=content_hash,
        )
        stats["generated"] += 1

    scene.write(args.scene)

    public_scenes = Path(__file__).parent.parent / "public" / "scenes"
    public_scenes.mkdir(parents=True, exist_ok=True)
    public_scene_path = public_scenes / args.scene.name
    shutil.copy2(args.scene, public_scene_path)

    elapsed = time.perf_counter() - t_start
    print(f"\nSummary: {stats['generated']} generated, {stats['cached']} cached, {stats['skipped']} skipped, {total} total in {elapsed:.1f}s")
    print(f"Scene copied to {public_scene_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
