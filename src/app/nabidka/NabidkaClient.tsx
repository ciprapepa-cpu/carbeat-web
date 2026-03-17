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
  transmissionType: string;
  drive: string;
  bodyType: string;
  year: number;
  km: number;
  powerKw: number;
  price: number;
  imageSrc: string;
  badges: string[];
  status: CarStatus;
}

type SortOption = "newest" | "price-asc" | "price-desc" | "km-asc";
type StatusFilterValue = "v_nabidce" | "pripravujeme" | "prodano";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Nejnovější" },
  { value: "price-asc", label: "Cena od nejnižší" },
  { value: "price-desc", label: "Cena od nejvyšší" },
  { value: "km-asc", label: "Nájezd od nejnižšího" },
];

const statusOptions: { value: StatusFilterValue; label: string }[] = [
  { value: "v_nabidce", label: "V nabídce" },
  { value: "pripravujeme", label: "Připravujeme" },
  { value: "prodano", label: "Prodáno" },
];

const defaultStatuses: Set<StatusFilterValue> = new Set(["v_nabidce", "pripravujeme"]);

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
  const [activeStatuses, setActiveStatuses] = useState<Set<StatusFilterValue>>(new Set(defaultStatuses));

  const applyFilters = useMemo(() => {
    return (carsToFilter: MappedCar[]) => {
      let result = [...carsToFilter];

      // Segment filter
      if (activeSegment !== "vse") {
        result = result.filter((c) => c.segment === activeSegment);
      }

      // Fuel filter
      if (filters.fuel !== "Vše") {
        result = result.filter((c) => c.fuel === filters.fuel);
      }

      // Transmission filter
      if (filters.trans !== "Vše") {
        result = result.filter((c) => c.transmissionType === filters.trans);
      }

      // Drive filter
      if (filters.drive !== "Vše") {
        result = result.filter((c) => c.drive === filters.drive);
      }

      // Body type filter
      if (filters.bodyType !== "Vše") {
        result = result.filter((c) => c.bodyType === filters.bodyType);
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

      // Power filter
      result = result.filter((c) => c.powerKw >= filters.powerMin && c.powerKw <= filters.powerMax);

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
  const showVNabidce = activeStatuses.has("v_nabidce");
  const showPripravujeme = activeStatuses.has("pripravujeme");
  const showProdano = activeStatuses.has("prodano");

  const totalCount = (showVNabidce ? vNabidce.length : 0) +
    (showPripravujeme ? pripravujeme.length : 0) +
    (showProdano ? prodano.length : 0);

  const allSelected = activeStatuses.size === statusOptions.length;

  function toggleStatus(value: StatusFilterValue) {
    setActiveStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    });
  }

  function toggleAll() {
    if (allSelected) {
      setActiveStatuses(new Set(defaultStatuses));
    } else {
      setActiveStatuses(new Set(statusOptions.map((s) => s.value)));
    }
  }

  function renderCarCard(car: MappedCar) {
    return (
      <CarCard
        key={car.slug}
        slug={car.slug}
        name={car.name}
        category={car.category}
        year={car.year}
        km={formatKm(car.km)}
        powerKw={formatPower(car.powerKw)}
        transmission={car.transmissionType}
        fuel={car.fuel}
        price={formatPrice(car.price)}
        imageSrc={car.imageSrc}
        imageAlt={car.name}
        badges={car.badges}
        status={car.status}
      />
    );
  }

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

      {/* Status filter */}
      <section className="bg-bg pt-8 pb-0">
        <div className="max-w-[1200px] mx-auto px-6">
          <h4 className="text-xs font-bold uppercase tracking-[1.5px] text-text-muted mb-3">
            Stav
          </h4>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={toggleAll}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                allSelected
                  ? "bg-blue !text-white"
                  : "bg-surface border border-border text-text-muted hover:text-text"
              }`}
            >
              Vše
            </button>
            {statusOptions.map((sf) => (
              <button
                key={sf.value}
                onClick={() => toggleStatus(sf.value)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  activeStatuses.has(sf.value)
                    ? "bg-blue !text-white"
                    : "bg-surface border border-border text-text-muted hover:text-text"
                }`}
              >
                {sf.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Listing */}
      <section className="py-14 bg-bg">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
            {/* Sidebar */}
            <div>
              <Filters filters={filters} onChange={setFilters} />
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
                  {activeStatuses.size > 1 && (
                    <h3 className="text-xl font-extrabold text-text mb-5 pl-4 border-l-4 border-blue">V nabídce</h3>
                  )}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {vNabidce.map(renderCarCard)}
                  </div>
                </div>
              )}

              {/* Připravujeme */}
              {showPripravujeme && pripravujeme.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-xl font-extrabold text-text mb-5 pl-4 border-l-4 border-[#d97706]">Připravujeme</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {pripravujeme.map(renderCarCard)}
                  </div>
                </div>
              )}

              {/* Prodáno */}
              {showProdano && prodano.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-xl font-extrabold text-text mb-5 pl-4 border-l-4 border-text-muted">Prodáno</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {prodano.map(renderCarCard)}
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
                      setActiveStatuses(new Set(statusOptions.map((s) => s.value)));
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
                  Nenašli jste, co hledáte?
                </h3>
                <p className="text-text-muted text-sm max-w-lg mx-auto mb-5">
                  Napište nám, co hledáte, pokud nám dáte dost času a bude se jednat
                  o typ vozu, který jsme schopni sehnat, pokusíme se o to.
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
