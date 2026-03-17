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
- `/aviloo` — AVILOO battery diagnostics page (Flash Test, Premium Test, certificates)

### Data Layer

Cars are stored in **Supabase** (PostgreSQL). Public pages fetch via `src/lib/supabase/queries.ts` using the anon key. Admin panel uses service role client (`src/lib/supabase/admin.ts`). Types in `src/types/car.ts`. All public pages use ISR with 60s revalidation.

**Admin panel** at `/admin` — manages cars (CRUD), photo uploads to Supabase Storage, status management (koncept/pripravujeme/v_nabidce/prodano). Protected by middleware + Supabase Auth.

**Photo URLs:** `car_photos.storage_path` — if starts with `/images/` it's a local file in `/public/`, otherwise it's in Supabase Storage bucket `car-photos`. Resolved by `getPhotoUrl()` in queries.ts.

Legacy hardcoded data in `src/data/cars.ts` is no longer used by the frontend.

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

## Adding a New Car

Use the **admin panel** at `/admin`:
1. Go to `/admin/auta/novy` and fill in the form
2. Upload photos — they're client-side resized (max 1920px, JPEG 85%) and uploaded to Supabase Storage
3. Set status to "v_nabidce" to make it visible on the public site
4. The car appears on the homepage and `/nabidka` within 60 seconds (ISR revalidation)

Source materials (photos, .docx context) live in `../Input/Inzeraty/{Značka Model}/`
Car card badges: position bottom-left, 50% larger than default. CTA button text: "Prohlédnout vůz →"

### Image Optimization Script

```bash
node scripts/optimize-images.mjs              # all car folders
node scripts/optimize-images.mjs seat-leon    # specific car
node scripts/optimize-images.mjs audi merc    # multiple (partial match)
```

Located at `scripts/optimize-images.mjs`. Uses sharp (bundled with Next.js). Settings: max 1920px width, 92% JPG quality, mozjpeg compression. Only overwrites if result is smaller than original. **Always run after copying new photos into public/images/cars/.**

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
