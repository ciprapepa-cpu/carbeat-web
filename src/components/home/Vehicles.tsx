import Link from "next/link";
import CarCard from "@/components/car/CarCard";

// Hardcoded for now — will be replaced by Supabase query in Phase 7
const cars = [
  {
    slug: "mercedes-c43-amg",
    name: "Mercedes-Benz C43 AMG 4Matic Kombi",
    category: "Sportovní",
    year: 2017,
    km: "92 000 km",
    powerKw: "270 kW",
    transmission: "9G Automat · 4MATIC",
    fuel: "Benzín V6 biturbo",
    price: "699 900 Kč",
    imageSrc: "/images/cars/mercedes-c43.jpg",
    imageAlt: "Mercedes-Benz C43 AMG Kombi",
    badges: ["Cebia"],
  },
  {
    slug: "audi-tts",
    name: "Audi TTS 2.0 TFSI Quattro DSG",
    category: "Sportovní",
    year: 2008,
    km: "125 000 km",
    powerKw: "200 kW",
    transmission: "S tronic 6st. · Quattro",
    fuel: "Benzín",
    price: "279 900 Kč",
    imageSrc: "/images/cars/audi-tts.jpg",
    imageAlt: "Audi TTS 2.0 TFSI Quattro",
    badges: ["Cebia"],
  },
  {
    slug: "seat-leon",
    name: "Seat Leon Style 1.5 TSI · Full LED · CarPlay",
    category: "Seat / Cupra",
    year: 2022,
    km: "67 000 km",
    powerKw: "96 kW",
    transmission: "Manuál 6st.",
    fuel: "Benzín",
    price: "459 900 Kč",
    imageSrc: "/images/cars/seat-leon.jpg",
    imageAlt: "Seat Leon Style 1.5 TSI",
    badges: ["Cebia", "Po servisu"],
  },
  {
    slug: "renault-trafic",
    name: "Renault Trafic 1.6 dCi L2H1 · nové turbo",
    category: "Užitkové",
    year: 2015,
    km: "105 000 km",
    powerKw: "85 kW",
    transmission: "Manuál 6st.",
    fuel: "Nafta",
    price: "249 900 Kč",
    imageSrc: "/images/cars/renault-trafic.jpg",
    imageAlt: "Renault Trafic 1.6 dCi L2H1",
    badges: ["Cebia", "Po velkém servisu"],
  },
] as const;

export default function Vehicles() {
  return (
    <section className="py-24 bg-surface">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-12 gap-5 flex-wrap">
          <div>
            <span className="inline-block text-xs font-bold tracking-[2px] uppercase text-blue mb-3">
              Aktuální nabídka
            </span>
            <h2 className="text-[clamp(28px,4vw,42px)] font-extrabold leading-[1.15] text-text">
              Vozy <span className="text-blue">právě dostupné</span>
            </h2>
          </div>
          <Link
            href="/nabidka"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[8px] text-[15px] font-semibold bg-transparent text-blue border-2 border-blue transition-all duration-[250ms] hover:bg-blue hover:text-white"
          >
            Celá nabídka
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-6 max-lg:grid-cols-1">
          {cars.map((car) => (
            <CarCard key={car.slug} {...car} />
          ))}
        </div>
      </div>
    </section>
  );
}
