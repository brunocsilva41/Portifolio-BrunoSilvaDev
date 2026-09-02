# Portfolio Professionalization — Design

**Date:** 2026-07-31
**Status:** Approved by user
**Approach:** Incremental evolution in 4 phases on the existing stack (Vite + vanilla JS + Three.js). No framework migration.

## Goal

Turn the portfolio into a professional product serving two audiences equally:
1. Recruiters/clients — polished, fast, discoverable normal mode
2. Technical audience — impressive, well-oriented, mobile-capable space mode

The visual identity (dark navy, blue/green/purple accents, subtle space theme) is kept and refined, not redesigned.

## Current State Summary

- `index.html` (781 lines): normal mode with inline CSS and 7 hardcoded projects
- `space.html` + `src/main.js` (1,091 lines): Three.js scene, 44 planets, GLSL nebula, bloom, 2 view modes, GitHub import, themes, localStorage
- `src/projects.js` (813 lines): single data source for space mode only — duplicated in index.html
- Key weaknesses: data duplication, monolithic main.js, weak mobile/touch support, no SEO metadata, no accessibility work, no orientation aids in 3D scene

## Target Architecture

```
src/
  data/
    projects.js        # DEFAULT_PROJECTS, PROJECT_VIEWS, PROJECT_GROUPS
    profile.js         # profile overview data (stats, career timeline)
    storage.js         # localStorage load/save/reset
    github.js          # GitHub API (fetch repo, parse README)
  space/
    scene.js           # Three.js setup (renderer, camera, composer, lights)
    bodies.js          # planets, sprites, orbits, labels
    effects.js         # GLSL nebula, shooting stars, warp, dust
    camera-travel.js   # camera animations (selectStar, travel, overview)
    interactions.js    # pointer/touch events, selection, navigation
    space-main.js      # space mode entry point
  site/
    site-main.js       # normal mode entry point (renders from data/)
    dashboard.js       # project search/filter
  ui/
    import-ui.js       # GitHub import modal (existing, adjusted)
    i18n.js            # PT/EN dictionaries + t() helper
  styles/
    site.css           # normal mode CSS (extracted from index.html)
    space.css          # space mode CSS (current style.css)
```

**Data flow:** `data/projects.js` is the single source of truth. Normal mode renders cards from `PROJECT_VIEWS` (8 conceptual groups); space mode consumes everything. No project data hardcoded in HTML.

**State:** space mode's scattered file-scope globals are consolidated into a central `spaceState` object.

## Phase 1 — Foundation

1. Extract inline CSS (~500 lines) from `index.html` to `styles/site.css`
2. Remove the 7 hardcoded projects from `index.html`; grid rendered by `site-main.js` from `PROJECT_VIEWS`
3. Split `main.js` into the `space/` modules — behavior-preserving move; globals become `spaceState`
4. Split `projects.js` into `data/projects.js`, `data/storage.js`, `data/github.js`

**Success criteria:** both modes work exactly as before; `npm run build` passes.

## Phase 2 — Normal Mode

### 2a. Profile overview section (between hero and about)
- Stats strip: years of experience, project count (computed from `projects.js`), tech count, areas of expertise
- Mini career timeline (3–5 milestones), data in `data/profile.js`
- Glassmorphism cards consistent with current identity

### 2b. Projects rendered from PROJECT_VIEWS
- 8 main cards (Café Gourmet, Casamento, Steuer & SEFAZ, Kippis, AI & Automação, DevOps, Aplicações Web, TrioOnline)
- Each card: tag, title, description, main techs, repo count
- Detail modal lists component repos, each with GitHub link

### 2c. Projects dashboard
- Below the cards: search bar + filters by technology and category
- Filters the 44 individual repos in a compact list (not large cards)
- Result count; friendly empty state

### 2d. Visual refinement (evolution, not redesign)
- Stronger typographic hierarchy (fluid sizes via `clamp()`)
- Micro-interactions: consistent hover states, smooth transitions, subtle reveal-on-scroll (IntersectionObserver, respecting `prefers-reduced-motion`)
- Revised breakpoints: 480px / 768px / 1024px

### 2e. SEO
- Meta description, theme-color, canonical, complete favicon set
- Open Graph + Twitter Card (static preview image of space mode)
- JSON-LD Person schema, sitemap.xml, robots.txt

### 2f. Accessibility
- ARIA on buttons/links/modals, visible focus (`:focus-visible`), skip-link
- Keyboard-navigable cards (Enter opens modal, ESC closes)
- Contrast reviewed for WCAG AA

## Phase 3 — Space Mode

### 3a. Orientation
- Location breadcrumb at top: `Visão Geral → Steuer & SEFAZ → repo-x` — always visible, clickable to go back levels
- Group legend (screen corner): group list with colors, clickable to travel
- More prominent "Visão Geral" (overview) button

### 3b. Lightweight mobile version
- Detection via `matchMedia` + `navigator.maxTouchPoints`
- On mobile: 1,500 background stars (vs 4,000), no bloom, lower-resolution nebula, pixel ratio capped at 1.5
- Gestures: tap selects, drag orbits, pinch zooms (verify OrbitControls native touch)
- Modals/overlays: `max-width: min(90vw, 520px)`, 44px minimum touch targets

### 3c. UX polish
- Short first-visit onboarding (3 tips: drag, click a planet, use the legend) — dismissable, stored in localStorage
- Hover tooltip with planet name
- Loading indicator with real asset progress
- Error handling: if WebGL fails, friendly message linking to normal mode

## Phase 4 — i18n PT/EN

- `ui/i18n.js` with dictionary modules (`pt.js`, `en.js`) and `t(key)` helper
- UI texts and project descriptions with `desc: { pt, en }` (fallback to pt)
- PT/EN toggle in the navbar of both modes, persisted in localStorage, initial detection via `navigator.language`
- `<html lang>` updated dynamically; hreflang meta tags

## Error Handling

- WebGL unavailable → friendly fallback message with link to normal mode
- GitHub API 403/404 → existing messages kept; no retry logic added (YAGNI)
- localStorage corruption → existing fallback to DEFAULT_PROJECTS kept

## Testing

- Manual verification after each phase: both modes load, build passes
- Phase 1 is behavior-preserving: manual smoke test of all space-mode interactions (select, travel, import, delete, reset, theme, view toggle)
- Phase 2: Lighthouse targets — 90+ desktop performance, SEO and accessibility scores 90+
- Phase 3: test on a real mobile device (touch gestures, performance)
- Phase 4: toggle language and verify both modes fully switch

## Out of Scope

- Framework migration (Astro/React)
- Blog, contact form backend, analytics
- GitHub API authentication/retry logic
- Light mode theme

## Implementation Order

Phase 1 → 2 → 3 → 4. Each phase lands independently and leaves the site working.
