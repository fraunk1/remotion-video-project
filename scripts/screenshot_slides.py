#!/usr/bin/env python3
"""
Screenshot each slide in a Reveal.js deck at 1920x1080 2x resolution.

Saves PNGs to public/slides/<scene-name>/slide-NN.png and updates
scene.json with the image paths.

Usage:
  python -m scripts.screenshot_slides --deck path/to/deck.html --scene path/to/scene.json
"""

import asyncio
import argparse
import json
import sys
from pathlib import Path

from playwright.async_api import async_playwright


async def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--deck", required=True, type=Path)
    parser.add_argument("--scene", required=True, type=Path)
    args = parser.parse_args()

    # Load scene.json
    with open(args.scene, encoding="utf-8") as f:
        scene = json.load(f)

    n_slides = len(scene["slides"])
    scene_name = args.scene.stem

    # Output directory (relative to public/ for Remotion staticFile())
    project_root = Path(__file__).resolve().parent.parent
    slides_dir = project_root / "public" / "slides" / scene_name
    slides_dir.mkdir(parents=True, exist_ok=True)

    print(f"Screenshotting {n_slides} slides from {args.deck.name}...")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Use the deck's native dimensions (1280x720) to avoid background
        # image / layout issues. 3x scale factor = 3840x2160 pixel screenshots,
        # which Remotion scales to fill 1920x1080 crisply.
        context = await browser.new_context(
            viewport={"width": 1280, "height": 720},
            device_scale_factor=3,
        )
        page = await context.new_page()

        # Load the deck
        deck_uri = args.deck.resolve().as_uri()
        await page.goto(deck_uri)
        await page.wait_for_load_state("networkidle")
        await asyncio.sleep(2)  # Let Reveal.js initialize

        # Get total slide count from Reveal.js
        total = await page.evaluate("Reveal.getTotalSlides()")
        print(f"  Reveal.js reports {total} slides (scene.json has {n_slides})")

        # Hide Reveal.js chrome and zero out margin for clean screenshots
        await page.evaluate("""() => {
            Reveal.configure({
                controls: false,
                progress: false,
                slideNumber: false,
                margin: 0,
            });
            Reveal.layout();
            const style = document.createElement('style');
            style.textContent = `
                .reveal .controls, .reveal .progress, .reveal .slide-number {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);
        }""")
        await asyncio.sleep(0.5)

        for i in range(n_slides):
            # Navigate to slide by index
            await page.evaluate(f"Reveal.slide({i})")
            await asyncio.sleep(0.5)  # Let transitions settle

            # Force all fragments visible
            await page.evaluate(
                "Reveal.getCurrentSlide().querySelectorAll('.fragment')"
                ".forEach(f => f.classList.add('visible'))"
            )
            await asyncio.sleep(0.3)

            png_name = f"slide-{i+1:02d}.png"
            png_path = slides_dir / png_name
            await page.screenshot(path=str(png_path))

            # Set image path relative to public/ for staticFile()
            relative_path = f"slides/{scene_name}/{png_name}"
            scene["slides"][i]["image"] = relative_path

            print(f"  [{i+1}/{n_slides}] {png_name} ({scene['slides'][i].get('title', '')[:40]})")

        await browser.close()

    # Write updated scene.json
    with open(args.scene, "w", encoding="utf-8") as f:
        json.dump(scene, f, indent=2, ensure_ascii=False)

    print(f"\nDone. {n_slides} screenshots saved to {slides_dir}")
    print(f"Updated {args.scene.name} with image paths.")


if __name__ == "__main__":
    asyncio.run(main())
