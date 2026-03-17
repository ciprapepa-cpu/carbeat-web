"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import CarCard from "@/components/car/CarCard";
import SegmentTabs from "@/components/nabidka/SegmentTabs";
import Filters, { type FiltersState, defaultFilters } from "@/components/nabidka/Filters";
import TrustBar from "@/components/home/TrustBar";
import type { CarStatus } from "@/types/car";

interface MappedCar {
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
  badges: string[];
  status: CarStatus;
}

type SortOption = "newest" | "price-asc" | "price-desc" | "km-asc";
type StatusFilter = "vse" | "v_nabidce" | "pripravujeme" | "prodano";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Nejnovější" },
  { value: "price-asc", label: "Cena od nejnižší" },
  { value: "price-desc", label: "Cena od nejvyšší" },
  { value: "km-asc", label: "Nájezd od nejnižšího" },
];

const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: "vse", label: "Vše" },
  { value: "v_nabidce", label: "V nabídce" },
  { value: "pripravujeme", label: "Připravujeme" },
  { value: "prodano", label: "Prodáno" },
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

interface NabidkaClientProps {
  cars: MappedCar[];
}

function NabidkaContent({ cars }: NabidkaClientProps) {
  const searchParams = useSearchParams();
  const segmentParam = searchParams.get("segment") ?? "vse";

  const [activeSegment, setActiveSegment] = useState(segmentParam);
  const [filters, setFilters] = useState<FiltersState>(defaultFilters);
  const [sort, setSort] = useState<SortOption>("newest");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("vse");

  const applyFilters = useMemo(() => {
    return (carsToFilter: MappedCar[]) => {
      let result = [...carsToFilter];

      // Segment filter
      if (activeSegment !== "vse") {
        result = result.filter((c) => c.segment === activeSegment);
      }

      // Fuel filter
      if (filters.fuel !== "Vše") {
        const fuelMap: Record<string, string> = {
          "Benzín": "benzín",
          "Diesel": "diesel",
          "Nafta": "nafta",
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
    };
  }, [activeSegment, filters, sort]);

  // Split cars by status
  const vNabidce = useMemo(() => applyFilters(cars.filter((c) => c.status === "v_nabidce")), [applyFilters, cars]);
  const pripravujeme = useMemo(() => applyFilters(cars.filter((c) => c.status === "pripravujeme")), [applyFilters, cars]);
  const prodano = useMemo(() => applyFilters(cars.filter((c) => c.status === "prodano")), [applyFilters, cars]);

  // What to show based on status filter
  const showVNabidce = statusFilter === "vse" || statusFilter === "v_nabidce";
  const showPripravujeme = statusFilter === "vse" || statusFilter === "pripravujeme";
  const showProdano = statusFilter === "vse" || statusFilter === "prodano";

  const totalCount = (showVNabidce ? vNabidce.length : 0) +
    (showPripravujeme ? pripravujeme.length : 0) +
    (showProdano ? prodano.length : 0);

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
            <div>
              <Filters filters={filters} onChange={setFilters} />

              {/* Status filter */}
              <div className="mt-6 bg-surface border border-border rounded-[12px] p-5">
                <h3 className="text-sm font-semibold text-text mb-3">Stav</h3>
                <div className="flex flex-wrap gap-2">
                  {statusFilters.map((sf) => (
                    <button
                      key={sf.value}
                      onClick={() => setStatusFilter(sf.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        statusFilter === sf.value
                          ? "bg-blue !text-white"
                          : "bg-bg text-text-muted hover:text-text"
                      }`}
                    >
                      {sf.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main content */}
            <div>
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <p className="text-sm text-text-muted">
                  {totalCount === 1
                    ? "1 vozidlo"
                    : totalCount >= 2 && totalCount <= 4
                      ? `${totalCount} vozidla`
                      : `${totalCount} vozidel`}
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

              {/* V nabídce */}
              {showVNabidce && vNabidce.length > 0 && (
                <div className="mb-12">
                  {(showPripravujeme || showProdano) && (statusFilter === "vse") && (
                    <h3 className="text-lg font-bold text-text mb-4">V nabídce</h3>
                  )}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {vNabidce.map((car) => (
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
                        status="v_nabidce"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Připravujeme */}
              {showPripravujeme && pripravujeme.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-lg font-bold text-text mb-4">Připravujeme</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {pripravujeme.map((car) => (
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
                        status="pripravujeme"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Prodáno */}
              {showProdano && prodano.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-lg font-bold text-text mb-4">Prodáno</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {prodano.map((car) => (
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
                        status="prodano"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {totalCount === 0 && (
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
                      setStatusFilter("vse");
                    }}
                    className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-[8px] text-sm font-semibold bg-blue !text-white border-2 border-blue transition-all duration-[250ms] hover:bg-blue-hover hover:border-blue-hover"
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
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[8px] text-[15px] font-semibold bg-blue !text-white border-2 border-blue transition-all duration-[250ms] hover:bg-blue-hover hover:border-blue-hover hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(28,138,201,0.35)]"
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

export default function NabidkaClient({ cars }: NabidkaClientProps) {
  return (
    <Suspense>
      <NabidkaContent cars={cars} />
    </Suspense>
  );
}
