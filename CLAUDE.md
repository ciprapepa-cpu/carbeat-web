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

### Feed Routes

- `feed/meta-catalog.xml` — Meta (Facebook) Automotive Inventory XML feed. Generates `<listings>` with vehicle data for Commerce Manager catalog (type: Vehicles). Maps Czech values to Meta enums (e.g., "Benzín" → GASOLINE, "Automat" → Automatic). Photos sorted by position, max 20 per listing. Only includes cars with status `v_nabidce`. Cached 1hr with 10min stale-while-revalidate.

### API Routes

- `api/contact` — Contact form submission
- `api/admin/cars` — CRUD operations for cars
- `api/admin/cars/[id]/photos` — Photo upload/management
- `api/admin/cars/[id]/publish` — Publish/unpublish
- `api/admin/cars/[id]/status` — Status transitions

### Auth & Admin

Middleware (`src/middleware.ts`) protects `/admin/*` and `/api/admin/*` routes via Supabase SSR auth. Login at `/admin/prihlaseni`. API routes use `requireAuth()` which returns 401 if no session. Admin write endpoints have rate limiting (30 req/60s per IP).

### Analytics & Consent (GDPR)

Three-layer setup in `src/components/analytics/`:
- `ConsentDefaults.tsx` — Server component, sets all consent to "denied" by default (inline `<script>`)
- `CookieConsent.tsx` — Banner UI, stores preference in `cookie_consent` cookie (365 days)
- `GoogleAnalytics.tsx` / `MetaPixel.tsx` — Initialize only after `ad_storage === "granted"`
- `RouteChangeTracker.tsx` — Sends page_view on client-side navigation
- `TrackViewCar.tsx` / `TrackClick.tsx` — Event tracking wrappers for Server Components

Event helpers in `src/lib/analytics.ts`: `trackViewCar()` fires both GA4 `view_item` and Meta `ViewContent` (with `content_type: "vehicle"` and `content_ids: [car.id]` for catalog matching). Consent logic in `src/lib/consent.ts`.

### Supabase Migrations

Sequential files in `supabase/migrations/`: `001_create_tables.sql` through `005_add_vin.sql`. Run manually against Supabase dashboard (no CLI migration setup). RLS enabled on all tables.

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

## Contract Wizard (Kupní smlouva)

8-step wizard for generating Czech vehicle purchase contracts. Accessible at `/admin/auta/[id]/smlouva` (admin-only). Car list table has a "Smlouva" button for each car.

### File Structure

- `src/types/contract.ts` — All TypeScript types, constants, and labels
- `src/app/(admin)/admin/_components/smlouva/ContractWizard.tsx` — Main 8-step wizard form (612 lines)
- `src/app/(admin)/admin/_components/smlouva/ContractPreview.tsx` — Live HTML preview + print (436 lines)
- `src/app/(admin)/admin/_components/smlouva/contractDocx.ts` — DOCX export via `docx` library (593 lines)
- `src/app/(admin)/admin/_components/smlouva/contractUtils.ts` — Helpers: legal regime detection, validation, presets, Czech number-to-words
- `src/app/(admin)/admin/auta/[id]/smlouva/page.tsx` — Route page (loads car from Supabase, passes to wizard)

### Knowledge Base (Input)

- `../Input/Kupni-smlouva/kupni_smlouva_auto_knowledge.json` — Legal framework, contract structure, all 8 articles, warnings
- `../Input/Kupni-smlouva/kupni_smlouva_questions_claude_code.json` — Structured Q&A flow (Q01-Q19), validation rules

### Wizard Steps

1. **Transaction type** — CZ-registered vehicle vs. DE/EU import
2. **Seller** — Presets (Josef Cipra FO, CarBeat s.r.o.) or custom entry
3. **Buyer** — FO (individual) / OSVČ (sole proprietor) / PO (company)
4. **Vehicle** — Pre-filled from Supabase car data (VIN, brand, model, km, etc.)
5. **Price & payment** — Bank transfer / cash / combined. Cash limit: 270,000 CZK
6. **Registration** — Who handles re-registration, power of attorney form, penalty
7. **Signing** — Location, date
8. **Preview & export** — Live HTML preview, DOCX download, print

### Contract Variants

- **CZ_REG** — Vehicle already registered in Czech Republic. Includes CZ handover protocol items (ORV, Servisní knížka, Protokol STK, Plná moc) as checkboxes.
- **DE_IMPORT** — Import from Germany. Extra fields: Fahrzeugbrief number, TÜV, import document checklist (COC, Kaufvertrag, etc.). Shows `DE_ONLY_DOCS` set.

### Legal Regime Detection

`detectLegalRegime()` in contractUtils.ts determines consumer protection applicability:
- **C2C** (FO→FO): No consumer protection, hidden defects 5 years
- **B2C** (business→FO): Consumer protection applies (§ 2158+ OZ), 2-year warranty
- **C2B** / **B2B**: No consumer protection

### Key Legal References

- Czech Civil Code (§ 89/2012 Sb.) — purchase contracts, defects, "as is"
- Cash limit (Zák. č. 254/2004 Sb.) — max 270,000 CZK
- Vehicle registration (Zák. č. 56/2001 Sb.) — 10-day transfer deadline
- AML compliance for cash payments

### Contract Articles (8)

1. Smluvní strany (parties)
2. Předmět koupě (vehicle identification)
3. Prohlášení prodávajícího (seller declarations — 7 checkboxes, customizable)
4. Technický stav a vady (condition & defects with 7 categories, replaces blanket "as is")
5. Kupní cena a platební podmínky (price & payment)
6. Přechod vlastnictví (ownership transfer + CZ-specific additions: registration costs → buyer, insurance cancellation → seller within 14 days)
7. Přeregistrace (registration responsibility, deadlines, penalties)
8. Závěrečná ustanovení (final provisions)

### Handover Protocol

Generated as part of contract. CZ vehicles: checkboxes for ORV, Servisní knížka, Protokol STK, Plná moc (moved from seller step to vehicle/protocol step). When checked, a textarea appears for details. In printed contract, items appear in the handover protocol section.

### Seller Presets (contractUtils.ts)

- **Josef Cipra** — FO preset with personal details
- **CarBeat s.r.o.** — PO preset with company registration details

### UI Details

- Step indicator is **sticky** with backdrop-blur effect at top
- Bod 4.3 includes: *"Stav vozidla odpovídá jeho stáří a počtu najetých kilometrů. Prodávající v této souvislosti poskytl kupujícímu pravdivé a podstatné informace."*
- "Společně na úřadě (doporučujeme)" label for joint registration option
- OP jednající osoby field is required for PO (company) buyers
- Dark mode compatible, print-optimized styles

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...          # Server-only, never expose to client
NEXT_PUBLIC_GA_MEASUREMENT_ID=...      # GA4 measurement ID (G-...)
NEXT_PUBLIC_META_PIXEL_ID=...          # Meta/Facebook Pixel ID
```

## Key Constraints

- Brand language is Czech, formal tone ("vykání" — Vás/Vaším)
- Never use `type: any` — strict TypeScript
- Git author: ciprapepa@gmail.com (Vercel requirement)
- Never commit `.env.local` or secrets
- Use Context7 MCP to fetch up-to-date library docs before implementing
