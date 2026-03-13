# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Turbopack)
npm run build     # Production build — always run before pushing
npm run lint      # ESLint (flat config, next/typescript)
npm start         # Start production server
```

No test framework is configured yet.

## Architecture

**Next.js 16 App Router** with React 19, TypeScript (strict), Tailwind CSS v4, deploying to Vercel via GitHub auto-deploy (master branch).

### Routing

- `/` — Homepage (server component composing ~10 home sections)
- `/nabidka` — Vehicle listing with client-side filtering/sorting (`"use client"`)
- `/auto/[slug]` — Vehicle detail, statically generated via `generateStaticParams()`

### Data Layer (transitional)

Cars are **hardcoded** in `src/data/cars.ts` with `getCarBySlug()` and `getAllSlugs()`. Supabase clients exist in `src/lib/supabase/` (client + server) but the frontend doesn't query them yet. Types are in `src/types/car.ts`. The plan is to replace hardcoded data with Supabase queries and add an admin panel.

### Component Organization

- `src/components/layout/` — Header, Topbar, Footer, MobileNav, WhatsAppFloat, Navigation
- `src/components/home/` — Hero (video slideshow + EKG), TrustBar, Vehicles, Segments, HowItWorks, WhyCarBeat, Reviews, Services, Contact
- `src/components/car/` — CarCard, Gallery (with lightbox), SpecsGrid, EquipmentSection, DefectsBox
- `src/components/nabidka/` — SegmentTabs, Filters, DualRangeSlider
- `src/components/ui/` — ThemeToggle, SocialIcons

## Styling

**Tailwind v4 CSS-first config** — no `tailwind.config.js`. All theme tokens defined via `@theme {}` in `src/app/globals.css`. PostCSS plugin: `@tailwindcss/postcss`.

Custom CSS in `globals.css` handles: EKG keyframe animations (`drawPulse`, `travelGlow`), car card spec icons (SVG data URIs as `::before` pseudo-elements), detail page specs grid (`.detail-specs-grid` with nth-child border logic), dual-range sliders, scroll reveal.

**Brand color:** `#1c8ac9` — the only blue. All theme colors are CSS custom properties overridden in `.dark {}`.

## Dark Mode

- **Dark is the default.** Light mode only when user explicitly selects it.
- Class strategy: `<html class="dark">` toggled via ThemeToggle component.
- IIFE in `layout.tsx` runs before paint (reads `localStorage('cb-theme')`).
- Logo: `.logo-img` class applies `filter: invert(1) hue-rotate(180deg)` in dark mode (inverts black text to white, preserves blue EKG line).
- Buttons on colored backgrounds use `!text-white` to force white text in both modes.
- Cebia badge always forced: `!bg-[#dcfce7] !text-[#16a34a]`.
- Footer logo uses `brightness-0 invert` (always white on dark bg).

## Hero Video Slideshow

6 background videos cycle via EKG pulse animation. The SVG `.pulse-travel` path fires `animationiteration` every 5s which triggers `nextSlide()`. No JS timers — the animation is the sole trigger. Videos play/pause via refs on slide change.

## Vehicle Filtering (nabidka)

Client-side `useMemo()` filtering: segment tabs, fuel/transmission pill buttons, price/km dual-range sliders, sort dropdown. Supports URL param `?segment=`. Data currently filtered from the hardcoded array.

## Detail Page Specs Grid

`.detail-specs-grid` in CSS: 4 columns desktop → 2 at 900px → 1 at 768px. Border logic uses `nth-child(4n)` / `nth-last-child(-n+4)` with responsive overrides. Icons are inline SVG components defined in the page file.

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...      # Server-only, never expose to client
```

## Key Constraints

- Brand language is Czech, formal tone ("vykání" — Vás/Vaším)
- Never use `type: any` — strict TypeScript
- Git author: ciprapepa@gmail.com (Vercel requirement)
- Never commit `.env.local` or secrets
- Use Context7 MCP to fetch up-to-date library docs before implementing
