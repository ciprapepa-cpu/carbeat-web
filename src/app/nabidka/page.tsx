"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import CarCard from "@/components/car/CarCard";
import SegmentTabs from "@/components/nabidka/SegmentTabs";
import Filters, { type FiltersState, defaultFilters } from "@/components/nabidka/Filters";
import TrustBar from "@/components/home/TrustBar";

interface Car {
  slug: string;
  name: string;
  category: string;
  segment: string;
  fuel: string;
  trans: string;
  year: number;
  km: number;
  powerKw: number;
  transmission: string;
  fuelLabel: string;
  price: number;
  imageSrc: string;
  badges: readonly string[];
}

const cars: readonly Car[] = [
  {
    slug: "mercedes-c43-amg",
    name: "Mercedes-Benz C43 AMG 4Matic Kombi",
    category: "Sportovní",
    segment: "sportovni",
    fuel: "benzín",
    trans: "automat",
    year: 2017,
    km: 92000,
    powerKw: 270,
    transmission: "9G Automat · 4MATIC",
    fuelLabel: "Benzín V6 biturbo",
    price: 699900,
    imageSrc: "/images/cars/mercedes-c43.jpg",
    badges: ["Cebia"],
  },
  {
    slug: "audi-tts",
    name: "Audi TTS 2.0 TFSI Quattro DSG",
    category: "Sportovní",
    segment: "sportovni",
    fuel: "benzín",
    trans: "automat",
    year: 2008,
    km: 125000,
    powerKw: 200,
    transmission: "S tronic 6st. · Quattro",
    fuelLabel: "Benzín",
    price: 279900,
    imageSrc: "/images/cars/audi-tts.jpg",
    badges: ["Cebia"],
  },
  {
    slug: "seat-leon",
    name: "Seat Leon Style 1.5 TSI · Full LED · CarPlay",
    category: "Seat / Cupra",
    segment: "seat-cupra",
    fuel: "benzín",
    trans: "manuál",
    year: 2022,
    km: 67000,
    powerKw: 96,
    transmission: "Manuál 6st.",
    fuelLabel: "Benzín",
    price: 459900,
    imageSrc: "/images/cars/seat-leon.jpg",
    badges: ["Cebia", "Po servisu"],
  },
  {
    slug: "renault-trafic",
    name: "Renault Trafic 1.6 dCi L2H1 · nové turbo",
    category: "Užitkové",
    segment: "ostatni",
    fuel: "diesel",
    trans: "manuál",
    year: 2015,
    km: 105000,
    powerKw: 85,
    transmission: "Manuál 6st.",
    fuelLabel: "Nafta",
    price: 249900,
    imageSrc: "/images/cars/renault-trafic.jpg",
    badges: ["Cebia", "Po velkém servisu"],
  },
] as const;

type SortOption = "newest" | "price-asc" | "price-desc" | "km-asc";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Nejnovější" },
  { value: "price-asc", label: "Cena od nejnižší" },
  { value: "price-desc", label: "Cena od nejvyšší" },
  { value: "km-asc", label: "Nájezd od nejnižšího" },
];

const czNumber = new Intl.NumberFormat("cs");

function formatKm(km: number): string {
  return `${czNumber.format(km)} km`;
}

function formatPrice(price: number): string {
  return `${czNumber.format(price)} Kč`;
}

function formatPower(kw: number): string {
  return `${kw} kW`;
}

function NabidkaContent() {
  const searchParams = useSearchParams();
  const segmentParam = searchParams.get("segment") ?? "vse";

  const [activeSegment, setActiveSegment] = useState(segmentParam);
  const [filters, setFilters] = useState<FiltersState>(defaultFilters);
  const [sort, setSort] = useState<SortOption>("newest");

  const filtered = useMemo(() => {
    let result = [...cars];

    // Segment filter
    if (activeSegment !== "vse") {
      result = result.filter((c) => c.segment === activeSegment);
    }

    // Fuel filter
    if (filters.fuel !== "Vše") {
      const fuelMap: Record<string, string> = {
        "Benzín": "benzín",
        "Diesel": "diesel",
        "Hybrid": "hybrid",
        "Elektro": "elektro",
      };
      const target = fuelMap[filters.fuel];
      if (target) {
        result = result.filter((c) => c.fuel === target);
      }
    }

    // Transmission filter
    if (filters.trans !== "Vše") {
      const transMap: Record<string, string> = {
        "Automat": "automat",
        "Manuál": "manuál",
      };
      const target = transMap[filters.trans];
      if (target) {
        result = result.filter((c) => c.trans === target);
      }
    }

    // Year filter
    if (filters.yearFrom !== null) {
      result = result.filter((c) => c.year >= (filters.yearFrom as number));
    }
    if (filters.yearTo !== null) {
      result = result.filter((c) => c.year <= (filters.yearTo as number));
    }

    // Price filter
    result = result.filter((c) => c.price >= filters.priceMin && c.price <= filters.priceMax);

    // KM filter
    result = result.filter((c) => c.km >= filters.kmMin && c.km <= filters.kmMax);

    // Sort
    switch (sort) {
      case "newest":
        result.sort((a, b) => b.year - a.year);
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "km-asc":
        result.sort((a, b) => a.km - b.km);
        break;
    }

    return result;
  }, [activeSegment, filters, sort]);

  return (
    <>
      {/* Page Hero */}
      <section className="pt-[calc(var(--topbar-height)+var(--nav-height))] bg-dark">
        <div className="max-w-[1200px] mx-auto px-6 py-12">
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Domů
            </Link>
            <span>/</span>
            <span className="text-white">Nabídka</span>
          </nav>
          <h1 className="text-[clamp(28px,4vw,42px)] font-extrabold text-white leading-[1.15]">
            Aktuální nabídka vozů
          </h1>
          <p className="text-white/60 mt-3 text-lg max-w-2xl">
            Vyberte si z prověřených ojetých vozů dovezených z Německa. Ke každému vozu
            poskytujeme Cebia certifikát a kompletní servisní historii.
          </p>
        </div>
      </section>

      {/* Segment Tabs */}
      <SegmentTabs activeSegment={activeSegment} onSegmentChange={setActiveSegment} />

      {/* Listing */}
      <section className="py-14 bg-bg">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
            {/* Sidebar */}
            <Filters filters={filters} onChange={setFilters} />

            {/* Main content */}
            <div>
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <p className="text-sm text-text-muted">
                  {filtered.length === 1
                    ? "1 vozidlo"
                    : filtered.length >= 2 && filtered.length <= 4
                      ? `${filtered.length} vozidla`
                      : `${filtered.length} vozidel`}
                </p>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="px-3 py-2 rounded-[8px] border border-border bg-surface text-sm text-text focus:outline-none focus:border-blue transition-colors cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Car Grid */}
              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filtered.map((car) => (
                    <CarCard
                      key={car.slug}
                      slug={car.slug}
                      name={car.name}
                      category={car.category}
                      year={car.year}
                      km={formatKm(car.km)}
                      powerKw={formatPower(car.powerKw)}
                      transmission={car.transmission}
                      fuel={car.fuelLabel}
                      price={formatPrice(car.price)}
                      imageSrc={car.imageSrc}
                      imageAlt={car.name}
                      badges={car.badges}
                    />
                  ))}
                </div>
              ) : (
                /* Empty state */
                <div className="text-center py-20">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-light flex items-center justify-center text-blue">
                    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-text mb-2">
                    Žádná vozidla neodpovídají filtrům
                  </h3>
                  <p className="text-text-muted text-sm max-w-md mx-auto">
                    Zkuste upravit filtry nebo se podívejte na celou nabídku.
                  </p>
                  <button
                    onClick={() => {
                      setFilters(defaultFilters);
                      setActiveSegment("vse");
                    }}
                    className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-[8px] text-sm font-semibold bg-blue text-white border-2 border-blue transition-all duration-[250ms] hover:bg-blue-hover hover:border-blue-hover"
                  >
                    Zobrazit vše
                  </button>
                </div>
              )}

              {/* Info box */}
              <div className="mt-12 p-8 rounded-[20px] bg-surface border border-border text-center">
                <h3 className="text-lg font-bold text-text mb-2">
                  Nenašli jste co hledáte?
                </h3>
                <p className="text-text-muted text-sm max-w-lg mx-auto mb-5">
                  Dovezeme Vám vůz na míru přímo z Německa. Stačí nám říct, co hledáte,
                  a my se postaráme o zbytek — od výběru přes prověrku až po předání.
                </p>
                <Link
                  href="/#kontakt"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[8px] text-[15px] font-semibold bg-blue text-white border-2 border-blue transition-all duration-[250ms] hover:bg-blue-hover hover:border-blue-hover hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(28,138,201,0.35)]"
                >
                  Kontaktujte nás
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <TrustBar />
    </>
  );
}

export default function NabidkaPage() {
  return (
    <Suspense>
      <NabidkaContent />
    </Suspense>
  );
}
