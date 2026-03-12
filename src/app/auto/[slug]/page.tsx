import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCarBySlug, getAllSlugs } from "@/data/cars";
import Gallery from "@/components/car/Gallery";
import SpecsGrid from "@/components/car/SpecsGrid";
import EquipmentSection from "@/components/car/EquipmentSection";
import DefectsBox from "@/components/car/DefectsBox";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const car = getCarBySlug(slug);
  if (!car) return {};

  return {
    title: car.meta_title ?? `${car.name} | CarBeat`,
    description:
      car.meta_description ??
      `${car.name}, ${car.year}, ${car.km.toLocaleString("cs-CZ")} km, ${car.power_kw} kW. Ověřený dovoz z Německa.`,
    openGraph: {
      title: car.meta_title ?? car.name,
      description:
        car.meta_description ??
        `${car.name} za ${car.price.toLocaleString("cs-CZ")} Kč`,
      images: car.photos[0] ? [car.photos[0]] : [],
    },
  };
}

/* Spec grid icons as inline SVGs */
function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function SpeedometerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function FuelIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 22V5a2 2 0 012-2h8a2 2 0 012 2v17" />
      <path d="M15 10h2a2 2 0 012 2v3a2 2 0 002 2h0" />
      <path d="M3 22h12" />
      <rect x="6" y="7" width="6" height="5" />
    </svg>
  );
}

function EngineIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
      <line x1="6" y1="8" x2="6" y2="16" />
      <line x1="18" y1="8" x2="18" y2="16" />
      <line x1="8" y1="6" x2="16" y2="6" />
    </svg>
  );
}

function DriveIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
      <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
      <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
      <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
    </svg>
  );
}

function CarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h14a2 2 0 012 2v6a2 2 0 01-2 2M5 17l-1 3h16l-1-3" />
      <circle cx="7.5" cy="14.5" r="1.5" />
      <circle cx="16.5" cy="14.5" r="1.5" />
    </svg>
  );
}

export default async function CarDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const car = getCarBySlug(slug);

  if (!car) {
    notFound();
  }

  const formattedPrice = car.price.toLocaleString("cs-CZ");
  const formattedKm = car.km.toLocaleString("cs-CZ");

  const specs = [
    { icon: <CalendarIcon />, label: "Rok výroby", value: String(car.year) },
    { icon: <SpeedometerIcon />, label: "Nájezd", value: `${formattedKm} km` },
    { icon: <BoltIcon />, label: "Výkon", value: `${car.power_kw} kW` },
    { icon: <FuelIcon />, label: "Palivo", value: car.fuel },
    { icon: <EngineIcon />, label: "Motor", value: car.engine },
    { icon: <GearIcon />, label: "Převodovka", value: car.transmission },
    { icon: <DriveIcon />, label: "Pohon", value: car.drive },
    { icon: <CarIcon />, label: "Karoserie", value: car.body_type },
  ];

  return (
    <section className="pt-[calc(36px+68px+24px)] pb-16 max-md:pt-[calc(64px+16px)]">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Back link */}
        <Link
          href="/nabidka"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-blue mb-6"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Zpět na nabídku
        </Link>

        {/* Two-column layout */}
        <div className="grid grid-cols-[1fr_1fr] gap-10 max-lg:grid-cols-1">
          {/* Left: Gallery */}
          <div>
            <Gallery photos={car.photos} alt={car.name} />
          </div>

          {/* Right: Info */}
          <div>
            {/* Badges */}
            {car.badges.length > 0 && (
              <div className="flex gap-1.5 mb-3">
                {car.badges.map((badge) => (
                  <span
                    key={badge}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      badge === "Cebia"
                        ? "bg-green-light text-green dark:bg-[#dcfce7] dark:text-[#16a34a]"
                        : "bg-blue text-white"
                    }`}
                  >
                    {badge === "Cebia" ? `✓ ${badge}` : badge}
                  </span>
                ))}
              </div>
            )}

            {/* Category */}
            <p className="text-xs font-semibold text-blue uppercase tracking-wide mb-1">
              {car.category_label}
            </p>

            {/* Name */}
            <h1 className="text-2xl font-bold text-text mb-2 max-md:text-xl">
              {car.name}
            </h1>

            {/* Price */}
            <p className="text-3xl font-extrabold text-text mb-6 max-md:text-2xl">
              {formattedPrice} Kč
            </p>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3 max-w-[480px] mb-8 max-md:grid-cols-1">
              <a
                href="tel:+420777027809"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[8px] text-sm font-semibold bg-blue text-white border-2 border-blue transition-all duration-[250ms] hover:bg-blue-hover hover:border-blue-hover hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(28,138,201,0.35)]"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
                Zavolat
              </a>
              <a
                href="https://wa.me/420777027809"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[8px] text-sm font-semibold bg-surface text-text border-2 border-border transition-all duration-[250ms] hover:border-blue hover:text-blue hover:-translate-y-0.5"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Specs grid */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-text mb-4">Technické parametry</h2>
          <SpecsGrid specs={specs} />
        </div>

        {/* Description */}
        {car.description && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-text mb-3">Popis vozu</h2>
            <p className="text-text-muted leading-relaxed">{car.description}</p>
          </div>
        )}

        {/* Equipment */}
        <div className="mt-10">
          <EquipmentSection equipment={car.equipment} />
        </div>

        {/* Defects */}
        {car.defects.length > 0 && (
          <div className="mt-10">
            <DefectsBox defects={car.defects} />
          </div>
        )}

        {/* YouTube embed */}
        {car.youtube_url && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-text mb-4">Videoprohlídka</h2>
            <div className="relative aspect-video overflow-hidden rounded-[20px] bg-bg">
              <iframe
                src={car.youtube_url}
                title={`Videoprohlídka - ${car.name}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 p-12 bg-bg rounded-[20px] text-center max-md:p-8">
          <h2 className="text-2xl font-bold text-text mb-3 max-md:text-xl">
            Máte zájem o tento vůz?
          </h2>
          <p className="text-text-muted mb-6 max-w-[520px] mx-auto">
            Zavolejte nám nebo napište na WhatsApp. Rádi Vám zodpovíme všechny dotazy a domluvíme prohlídku.
          </p>
          <div className="grid grid-cols-2 gap-3 max-w-[480px] mx-auto max-md:grid-cols-1">
            <a
              href="tel:+420777027809"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[8px] text-sm font-semibold bg-blue text-white border-2 border-blue transition-all duration-[250ms] hover:bg-blue-hover hover:border-blue-hover hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(28,138,201,0.35)]"
            >
              +420 777 027 809
            </a>
            <a
              href="https://wa.me/420777027809"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[8px] text-sm font-semibold bg-surface text-text border-2 border-border transition-all duration-[250ms] hover:border-blue hover:text-blue hover:-translate-y-0.5"
            >
              Napsat na WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
