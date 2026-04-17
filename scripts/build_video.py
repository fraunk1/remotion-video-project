"""One-command deck-to-video pipeline orchestrator.

Usage:
    python scripts/build_video.py \\
        --deck "../../Presentations/2026 FSMB Keynote/deck.html" \\
        --voice frank-formal-v1
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path

# Ensure UTF-8 stdout on Windows (default cp1252 can't encode unicode like U+2192).
# Safe no-op on macOS/Linux where stdout is already UTF-8.
try:
    sys.stdout.reconfigure(encoding="utf-8")  # type: ignore[attr-defined]
    sys.stderr.reconfigure(encoding="utf-8")  # type: ignore[attr-defined]
except Exception:
    pass

# Allow both `python scripts/build_video.py` and `python -m scripts.build_video`
if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))


def slugify(text: str) -> str:
    s = re.sub(r"[^\w\s-]", "", text).strip().lower()
    return re.sub(r"[\s-]+", "-", s) or "untitled"


def run(cmd: list[str], *, cwd: Path, extra_env: dict[str, str] | None = None) -> None:
    print(f"  $ {' '.join(cmd)}")
    env = os.environ.copy()
    env.setdefault("PYTHONIOENCODING", "utf-8")
    if extra_env:
        env.update(extra_env)
    # On Windows, `npx` is a .cmd shim and CreateProcess can't find it without
    # shell=True. Bare executable names like `npx`/`npm` require shell=True here;
    # direct Python interpreter paths do not.
    use_shell = sys.platform == "win32" and cmd and not os.path.isabs(cmd[0])
    if use_shell:
        # When shell=True on Windows, pass a single string so cmd.exe resolves
        # the .cmd extension. Quote args that contain spaces.
        cmd_str = subprocess.list2cmdline(cmd)
        result = subprocess.run(cmd_str, cwd=str(cwd), env=env, shell=True)
    else:
        result = subprocess.run(cmd, cwd=str(cwd), env=env)
    if result.returncode != 0:
        print(f"ERROR: command failed with exit {result.returncode}", file=sys.stderr)
        sys.exit(result.returncode)


def find_tts_venv(project_root: Path) -> tuple[Path | None, Path | None]:
    """Locate the sibling voiceover-pptx venv with TTS deps installed.

    Returns (venv_python, voiceover_project_root) or (None, None).
    Using the venv's own interpreter avoids version conflicts with the
    host Python's site-packages (torch/torchvision ABI mismatches).
    """
    voiceover_root = project_root.parent / "voiceover-pptx"
    # Find the venv's Python interpreter
    python_candidates = [
        voiceover_root / ".venv" / "Scripts" / "python.exe",  # Windows
        voiceover_root / ".venv" / "bin" / "python",           # *nix
    ]
    for py in python_candidates:
        if py.is_file():
            return py, voiceover_root
    return None, None


def tts_deps_importable() -> bool:
    """Return True iff torch, torchaudio, and omnivoice can be imported here."""
    import importlib.util
    for mod in ("torch", "torchaudio", "omnivoice"):
        if importlib.util.find_spec(mod) is None:
            return False
    return True


def main() -> int:
    parser = argparse.ArgumentParser(description="Build a narrated video from a Reveal.js deck")
    parser.add_argument("--deck", required=True, type=Path, help="Path to deck.html")
    parser.add_argument("--voice", default="frank-formal-v1", help="Voice sample ID")
    parser.add_argument("--name", default=None, help="Scene name (default: slugified deck folder name)")
    parser.add_argument("--skip-extract", action="store_true")
    parser.add_argument("--skip-voiceover", action="store_true")
    parser.add_argument("--still", action="store_true", help="Render a still frame instead of a full video")
    parser.add_argument("--frames", default=None, help="Frame range to render, e.g., 0-150")
    parser.add_argument("--no-open", action="store_true", help="Do not auto-open output after build")
    parser.add_argument(
        "--engine",
        choices=["omnivoice", "xtts"],
        default="omnivoice",
        help="TTS engine to use (default: omnivoice)",
    )
    args = parser.parse_args()

    if not args.deck.exists():
        print(f"ERROR: deck not found: {args.deck}", file=sys.stderr)
        return 1
    deck = args.deck.resolve()

    name = args.name or slugify(deck.parent.name)
    project_root = Path(__file__).parent.parent.resolve()
    scene_json = project_root / "src" / "scenes" / f"{name}.json"
    voiceover_dir = project_root / "public" / "voiceover" / name
    output_mp4 = project_root / "out" / f"{name}.mp4"
    output_png = project_root / "out" / f"{name}.png"

    print(f"=== Building video: {name} ===")
    print(f"  deck:       {deck}")
    print(f"  voice:      {args.voice}")
    print(f"  scene.json: {scene_json}")
    print(f"  voiceover:  {voiceover_dir}")
    print()

    if not args.skip_extract:
        print("[1/3] Extract deck → scene.json")
        overrides = deck.parent / "narration_overrides.md"
        cmd = [
            sys.executable, "-m", "scripts.extract_deck",
            "--deck", str(deck),
            "--output", str(scene_json),
            "--voice", args.voice,
        ]
        if overrides.exists():
            cmd += ["--overrides", str(overrides)]
        run(cmd, cwd=project_root)
    else:
        print("[1/3] Extract: SKIPPED")

    if not args.skip_voiceover:
        print("[2/3] Generate voiceover")
        voiceover_env: dict[str, str] = {}
        python_exe = sys.executable
        if not tts_deps_importable():
            venv_py, voiceover_proj = find_tts_venv(project_root)
            if venv_py is None:
                print(
                    "ERROR: torch/torchaudio/omnivoice not importable and no sibling\n"
                    "       voiceover-pptx venv found. Install with:\n"
                    "         pip install torch torchaudio omnivoice\n"
                    "       or create ../voiceover-pptx/.venv with those deps.",
                    file=sys.stderr,
                )
                sys.exit(1)
            print(f"  (using venv Python: {venv_py})")
            python_exe = str(venv_py)
            # voiceover_pptx source package lives at the project root, not in site-packages
            voiceover_env["PYTHONPATH"] = str(voiceover_proj)
        run(
            [
                python_exe, "-m", "scripts.generate_voiceover",
                "--scene", str(scene_json),
                "--output", str(voiceover_dir),
                "--engine", args.engine,
            ],
            cwd=project_root,
            extra_env=voiceover_env,
        )
    else:
        print("[2/3] Voiceover: SKIPPED")

    print("[3/3] Render via Remotion")
    props = json.dumps({"sceneName": name})
    if args.still:
        output_png.parent.mkdir(parents=True, exist_ok=True)
        render_cmd = ["npx", "remotion", "still", "NarratedPresentation", str(output_png), f"--props={props}"]
        output_path = output_png
    else:
        output_mp4.parent.mkdir(parents=True, exist_ok=True)
        render_cmd = ["npx", "remotion", "render", "NarratedPresentation", str(output_mp4), f"--props={props}"]
        if args.frames:
            render_cmd.append(f"--frames={args.frames}")
        output_path = output_mp4

    run(render_cmd, cwd=project_root)

    print(f"\nDONE: {output_path}")

    if not args.no_open and output_path.exists():
        if sys.platform == "win32":
            os.startfile(str(output_path))  # type: ignore[attr-defined]
        elif sys.platform == "darwin":
            subprocess.run(["open", str(output_path)])
        else:
            subprocess.run(["xdg-open", str(output_path)])

    return 0


if __name__ == "__main__":
    sys.exit(main())
