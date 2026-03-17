import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCarBySlugFromDb, getAllVisibleSlugs, getPhotoUrl } from "@/lib/supabase/queries";
import Gallery from "@/components/car/Gallery";
import SpecsGrid from "@/components/car/SpecsGrid";
import EquipmentSection from "@/components/car/EquipmentSection";
import DefectsBox from "@/components/car/DefectsBox";
import { CarProductJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import ContactForm from "@/components/home/ContactForm";

// Revalidate every 60s so new/updated cars appear without redeploy
export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllVisibleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const car = await getCarBySlugFromDb(slug);
  if (!car) return {};

  const firstPhoto = car.car_photos?.sort((a, b) => a.position - b.position)[0];
  const ogImage = firstPhoto ? getPhotoUrl(firstPhoto.storage_path) : undefined;

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
      images: ogImage ? [ogImage] : [],
    },
  };
}

/* Spec grid icons as inline SVGs — matching original detail-mercedes-c43.html exactly */
function CalendarIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function SpeedometerIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10" />
      <path d="M14.5 9.5L12 12" />
      <circle cx="12" cy="12" r="1.5" />
      <path d="M4.5 17h15" />
    </svg>
  );
}

/* Chess knight — FILL, not stroke! */
function KnightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 384 512" fill="currentColor">
      <path d="M32 391.6V416H352V224c0-106-86-192-192-192H12.9C5.8 32 0 37.8 0 44.9c0 2 .5 4 1.4 5.8L16 80 9.4 86.6c-6 6-9.4 14.1-9.4 22.6V242.3c0 13.1 8 24.9 20.1 29.7l46.5 18.6c8.5 3.4 18 3 26.2-1.1l6.6-3.3c8-4 14-11.2 16.5-19.8l8.3-28.9c2.5-8.6 8.4-15.8 16.5-19.8L160 208v40.4c0 24.2-13.7 46.4-35.4 57.2L67.4 334.3C45.7 345.2 32 367.3 32 391.6zM72 148c0 11-9 20-20 20s-20-9-20-20s9-20 20-20s20 9 20 20zM352 448H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H352c17.7 0 32-14.3 32-32s-14.3-32-32-32z" />
    </svg>
  );
}

/* Gear/cog wheel — transmission */
function GearIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

/* Fuel pump */
function FuelIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M3 22V5a2 2 0 012-2h8a2 2 0 012 2v17" />
      <path d="M15 10h1a2 2 0 012 2v3a2 2 0 002 2h0a2 2 0 002-2V8l-3-3" />
      <path d="M3 22h12" />
      <rect x="6" y="7" width="6" height="4" rx="0.5" />
    </svg>
  );
}

/* Engine block */
function EngineIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 3h4v2h-4z" />
      <path d="M12 3V1.5" />
      <path d="M5 5h14v4.5c0 1.5 1.5 2.5 1.5 4.5S19 17 19 17v2H5v-2s-1.5-.5-1.5-3S5 9.5 5 9.5z" />
      <path d="M2.5 10H5" />
      <path d="M2.5 14H5" />
      <path d="M19 10h2.5" />
      <path d="M19 14h2.5" />
    </svg>
  );
}

/* Battery */
function BatteryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="6" width="18" height="12" rx="2" />
      <path d="M23 10v4" />
      <path d="M7 10v4" />
      <path d="M11 10v4" />
    </svg>
  );
}

/* Car body */
function CarIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-3-5H7L4 10l-2.5 1.1C.7 11.3 0 12.1 0 13v3c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}

/* 4WD/axle — drive */
function DriveIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="6" x2="19" y2="6" />
      <line x1="5" y1="18" x2="19" y2="18" />
      <line x1="12" y1="6" x2="12" y2="18" />
      <rect x="1.5" y="4" width="4" height="4" rx="1" transform="rotate(-15 3.5 6)" />
      <rect x="18.5" y="4" width="4" height="4" rx="1" transform="rotate(15 20.5 6)" />
      <rect x="1.5" y="16" width="4" height="4" rx="1" transform="rotate(15 3.5 18)" />
      <rect x="18.5" y="16" width="4" height="4" rx="1" transform="rotate(-15 20.5 18)" />
      <path d="M10.5 10.5l1.5 1.5 1.5-1.5" />
      <path d="M10.5 13.5l1.5-1.5 1.5 1.5" />
    </svg>
  );
}

export default async function CarDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const car = await getCarBySlugFromDb(slug);

  if (!car) {
    notFound();
  }

  const formattedPrice = car.price === -1 ? "Cena na dotaz" : `${car.price.toLocaleString("cs-CZ")} Kč`;
  const formattedKm = car.km.toLocaleString("cs-CZ");

  // Build photo URLs from car_photos
  const photos = (car.car_photos ?? [])
    .sort((a, b) => a.position - b.position)
    .map((p) => getPhotoUrl(p.storage_path));

  const specs = [
    { icon: <CalendarIcon />, label: "Rok", value: String(car.year) },
    { icon: <SpeedometerIcon />, label: "Nájezd", value: `${formattedKm} km` },
    { icon: <KnightIcon />, label: "Výkon", value: `${car.power_kw} kW` },
    { icon: <GearIcon />, label: "Převodovka", value: car.transmission },
    { icon: <FuelIcon />, label: "Palivo", value: car.fuel },
    car.fuel === "Elektro"
      ? { icon: <BatteryIcon />, label: "Baterie", value: car.engine }
      : { icon: <EngineIcon />, label: "Motor", value: car.engine },
    { icon: <CarIcon />, label: "Karoserie", value: car.body_type },
    { icon: <DriveIcon />, label: "Pohon", value: car.drive },
  ];

  const firstPhotoUrl = photos[0] ?? undefined;

  return (
    <section className="pt-[calc(36px+68px+24px)] pb-16 max-md:pt-[calc(64px+16px)]">
      <CarProductJsonLd
        name={car.name}
        description={car.description ?? `${car.name}, ${car.year}, ${formattedKm} km, ${car.power_kw} kW`}
        image={firstPhotoUrl}
        url={`https://carbeat.cz/auto/${slug}`}
        price={car.price}
        year={car.year}
        km={car.km}
        fuel={car.fuel}
        transmission={car.transmission}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Domů", url: "https://carbeat.cz" },
          { name: "Nabídka", url: "https://carbeat.cz/nabidka" },
          { name: car.name, url: `https://carbeat.cz/auto/${slug}` },
        ]}
      />
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Back link */}
        <Link
          href="/nabidka"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue transition-colors hover:underline mb-5"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Zpět na nabídku
        </Link>

        {/* Gallery — full width */}
        <Gallery photos={photos} alt={car.name} />

        {/* Header: Category, Name, Price */}
        <div className="mt-8 mb-8">
          <p className="text-xs font-bold text-blue uppercase tracking-[1.5px] mb-2">
            {car.category_label}
          </p>
          <h1 className="text-[32px] font-extrabold text-text leading-[1.2] mb-3 max-md:text-[26px]">
            {car.name}
          </h1>
          <p className="text-[36px] font-extrabold text-text max-md:text-[30px]">
            {formattedPrice}
          </p>
        </div>

        {/* Specs grid — 4x2 */}
        <SpecsGrid specs={specs} />

        {/* Action buttons — equal-sized, matching original */}
        <div className="grid grid-cols-2 gap-3 max-w-[480px] mt-8 mb-12 max-md:grid-cols-1 max-md:max-w-full">
          <a
            href="tel:+420777027809"
            className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-[8px] text-base font-semibold bg-blue !text-white border-2 border-blue transition-all duration-[250ms] hover:bg-blue-hover hover:border-blue-hover hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(28,138,201,0.35)]"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 9.06a19.79 19.79 0 01-3.07-8.64A2 2 0 012 .04h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
            </svg>
            Zavolat
          </a>
          <a
            href={`https://wa.me/420777027809?text=${encodeURIComponent(`Dobrý den, mám zájem o ${car.name}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-[8px] text-base font-semibold bg-[#25D366] !text-white border-2 border-[#25D366] transition-all duration-[250ms] hover:bg-[#1da851] hover:border-[#1da851] hover:-translate-y-0.5"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
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

        {/* CTA — contact form */}
        <div className="mt-12 p-12 bg-bg rounded-[20px] max-md:p-8">
          <h2 className="text-2xl font-bold text-text mb-1 max-md:text-xl">
            Máte zájem o tento vůz?
          </h2>
          <p className="text-text-muted mb-6 text-sm">
            Napište nám a my se Vám ozveme co nejdříve.
          </p>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
