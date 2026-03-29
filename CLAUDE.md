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

- `/` — Homepage (Hero, Vehicles, Segments, HowItWorks, Reviews, CTA banner)
- `/nabidka` — Vehicle listing with client-side filtering/sorting (`"use client"`)
- `/auto/[slug]` — Vehicle detail, statically generated via `generateStaticParams()`
- `/o-nas` — About page (Proč CarBeat, Služby, Kontakt with form + map)
- `/faq` — Standalone FAQ page with JSON-LD FAQPage schema for SEO
- `/aviloo` — AVILOO battery diagnostics page
- `/admin` — Protected admin panel (CRUD for cars, photo uploads, status management)

### Data Layer

Cars are stored in **Supabase** (PostgreSQL). Public pages fetch via `src/lib/supabase/queries.ts` using the anon key. Admin panel uses service role client (`src/lib/supabase/admin.ts`). Types in `src/types/car.ts`. All public pages use ISR with 60s revalidation.

**Car statuses:** `koncept` → `pripravujeme` → `v_nabidce` → `prodano`

**Photo URLs:** `car_photos.storage_path` — if starts with `/images/` it's a local file in `/public/`, otherwise it's in Supabase Storage bucket `car-photos`. Resolved by `getPhotoUrl()` in queries.ts.

**Drive options in DB:** "Předních kol", "Zadních kol", "4x4" — displayed on car cards as "Přední", "Zadní", "4x4" via `formatDrive()` in CarCard.

### API Routes

- `api/contact` — Contact form submission
- `api/admin/cars` — CRUD operations for cars
- `api/admin/cars/[id]/photos` — Photo upload/management
- `api/admin/cars/[id]/publish` — Publish/unpublish
- `api/admin/cars/[id]/status` — Status transitions

### Component Organization

- `src/components/layout/` — Header, Topbar, Footer, MobileNav, WhatsAppFloat, Navigation
- `src/components/home/` — Hero, Vehicles, Segments, HowItWorks, WhyCarBeat, Reviews, Services, Contact, ContactForm, CtaBanner
- `src/components/o-nas/` — FAQ (accordion), faqData (shared data for FAQ + JSON-LD)
- `src/components/car/` — CarCard, Gallery (with lightbox), SpecsGrid, EquipmentSection, DefectsBox
- `src/components/nabidka/` — SegmentTabs, Filters, DualRangeSlider, NabidkaClient
- `src/components/seo/` — JsonLd (structured data)
- `src/components/ui/` — ThemeToggle, SocialIcons

### Navigation Structure

Desktop: O nás | FAQ | Aviloo | [Nabídka vozů CTA button]
Mobile: Nabídka vozů | O nás | FAQ | Aviloo | [Phone + WhatsApp CTAs]

## Styling

**Tailwind v4 CSS-first config** — no `tailwind.config.js`. All theme tokens defined via `@theme {}` in `src/app/globals.css`. PostCSS plugin: `@tailwindcss/postcss`.

Custom CSS in `globals.css` handles: EKG keyframe animations (`drawPulse`, `travelGlow`), car card spec icons (SVG data URIs as `::before` pseudo-elements — classes: `spec-icon--year`, `--km`, `--fuel`, `--power`, `--trans`, `--drive`), detail page specs grid (`.detail-specs-grid` with nth-child border logic), dual-range sliders, scroll reveal.

**Brand color:** `#1c8ac9` — the only blue. All theme colors are CSS custom properties overridden in `.dark {}`.

## Dark Mode

- **Dark is the default.** Light mode only when user explicitly selects it.
- Class strategy: `<html class="dark">` toggled via ThemeToggle component.
- IIFE in `layout.tsx` runs before paint (reads `localStorage('cb-theme')`).
- Logo: `.logo-img` class applies `filter: invert(1) hue-rotate(180deg)` always (white text + blue EKG). Header has dark bg in both modes.
- Buttons on colored backgrounds use `!text-white` to force white text in both modes.
- Cebia badge always forced: `!bg-[#dcfce7] !text-[#16a34a]`.
- Footer logo uses `brightness-0 invert` (always white on dark bg).

## Hero Video Slideshow

7 background videos cycle via EKG pulse animation. The SVG `.pulse-travel` path fires `animationiteration` every 5s which triggers `nextSlide()`. No JS timers — the animation is the sole trigger. Videos play/pause via refs on slide change. Source videos in `../Input/Pozadi/Videa/`.

## Adding a New Car

Use the **admin panel** at `/admin`:
1. Go to `/admin/auta/novy` and fill in the form
2. Upload photos — they're client-side converted to WebP (max 1920px, 85% quality) and uploaded to Supabase Storage
3. Set status to "v_nabidce" to make it visible on the public site
4. The car appears on the homepage and `/nabidka` within 60 seconds (ISR revalidation)

Source materials (photos, .docx context) live in `../Input/Inzeraty/{Značka Model}/`
Car card badges: position bottom-left (`text-xs` compact). CTA button text: "Prohlédnout vůz →". Car card specs: 3×2 grid (`2fr 3fr 2fr`) — row 1: year, km, fuel; row 2: power, transmission, drive. Footer wraps on narrow screens (price above, button below).

### Image Optimization Script

```bash
node scripts/optimize-images.mjs              # all car folders
node scripts/optimize-images.mjs seat-leon    # specific car
node scripts/optimize-images.mjs audi merc    # multiple (partial match)
```

Uses sharp (bundled with Next.js). Settings: max 1920px width, WebP 92% quality. Only overwrites if WebP is smaller than original. Originals kept as .bak. **Always run after copying new photos into public/images/cars/.**

### Video Compression Script

```bash
node scripts/compress-videos.mjs              # compress all hero videos
node scripts/compress-videos.mjs --dry-run    # preview sizes only
```

Requires ffmpeg (`winget install ffmpeg`). Compresses to 720p H.264 CRF 28, no audio. Originals saved as `.original.mp4`.

## Performance & Bandwidth

- **Image optimization**: Next.js serves AVIF/WebP automatically (`formats` in next.config.ts). Admin uploads convert to WebP client-side.
- **Cache headers**: Static assets (`/videos/*`, `/images/*`, `/aviloo/*`) have `Cache-Control: public, max-age=31536000, immutable`.
- **Video loading**: Only first hero video preloads fully; others load metadata only until activated.

## Vehicle Filtering (nabidka)

Client-side `useMemo()` filtering: segment tabs, fuel/transmission pill buttons, price/km dual-range sliders, sort dropdown. Supports URL param `?segment=`. Car segments: `japonska`, `seat-cupra`, `elektro`, `sportovni`, `ostatni`.

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
