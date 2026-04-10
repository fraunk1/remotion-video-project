# Remotion Video Project — Cowork Instructions

## What This Project Is

A Remotion (v4.0.441) + React 19 project for creating programmatic videos. It has three compositions ready to customize and render, plus a shared animation library. The `.claude/skills/remotion/SKILL.md` file has the full Remotion API reference and code patterns — read it before writing any new composition code.

## Project Structure

```
src/
  index.ts                  → Entry point (registerRoot)
  Root.tsx                  → Composition registry (ids, dimensions, durations)
  components/animations.tsx → Shared: FadeIn, ScaleIn, SlideIn, Typewriter, AnimatedCounter, FloatingParticles, ProgressBar, useFadeSlideIn hook
  compositions/
    Presentation.tsx        → Slide deck (16:9, 1920×1080, 810 frames / 27s)
    SocialClip.tsx          → Vertical social clip (9:16, 1080×1920, 420 frames / 14s)
    DataDashboard.tsx       → Animated dashboard (16:9, 1920×1080, 180 frames / 6s)
public/                     → Static assets (images, fonts, audio) — use staticFile()
```

## How Compositions Work

Every composition follows a constants-first pattern. Editable values live in clearly marked `CONSTANTS` blocks at the top of each file:

- **Presentation.tsx** — `THEME` (colors/fonts), `LAYOUT` (sizing), `SLIDES` array (type + content + duration per slide). Slide types: `title`, `bullets`, `twoColumn`, `quote`, `closing`. Transitions alternate automatically.
- **SocialClip.tsx** — `THEME` (colors/gradient), `CONTENT` (hook text, topic, numbered points, CTA, handle), `SAFE` (platform UI padding). Each point gets a 90-frame scene.
- **DataDashboard.tsx** — `THEME`, `METRICS` (KPI cards with label/value/change), `BAR_DATA`, `DONUT_DATA`. Everything animates from zero with spring physics.

## Rules When Writing Code

1. **Determinism required.** Never use `Math.random()` → use `random('seed')` from remotion. Never use `Date.now()`.
2. **Frame-driven animation only.** All motion comes from `useCurrentFrame()` + `interpolate()` or `spring()`. Always clamp interpolate on both sides.
3. **Assets in public/.** Reference with `staticFile("name.png")`.
4. **Keep durations in sync.** If you change scene count or timing, update `durationInFrames` in Root.tsx to match.
5. **Use the shared animation library.** Check `components/animations.tsx` before writing custom fade/slide/scale logic — it likely already exists there.
6. **Constants-first.** When creating or editing compositions, keep all configurable values (colors, timing, content, data) in top-level constants. Don't bury magic numbers in JSX.

## Adding a New Composition

1. Create `src/compositions/NewVideo.tsx` with a constants block + exported component.
2. Register in `Root.tsx` with a `<Composition>` element (set id, dimensions, fps, duration).
3. Add a render script in `package.json`: `"render:newvideo": "npx remotion render NewVideoId out/new-video.mp4"`

## Commands

- `npm run dev` → Remotion Studio preview at localhost:3000
- `npm run render:presentation` / `render:social` / `render:dashboard` / `render:all` → MP4 output to `out/`
- `npm run still:presentation` / `still:dashboard` → PNG thumbnail export
- Use `--crf=18` for higher quality, `--codec=vp8` for WebM
