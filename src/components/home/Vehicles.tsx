import Link from "next/link";
import CarCard from "@/components/car/CarCard";
import { getVisibleCars, getPhotoUrl } from "@/lib/supabase/queries";

const czNumber = new Intl.NumberFormat("cs");

export default async function Vehicles() {
  const allCars = await getVisibleCars();

  // Show only "v_nabidce" cars on the homepage, max 4
  const cars = allCars
    .filter((c) => c.status === "v_nabidce")
    .slice(0, 4);

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
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[8px] text-[15px] font-semibold bg-transparent text-blue border-2 border-blue transition-all duration-[250ms] hover:bg-blue hover:!text-white"
          >
            Celá nabídka
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-6 max-lg:grid-cols-1">
          {cars.map((car) => {
            const sortedPhotos = (car.car_photos ?? []).sort((a, b) => a.position - b.position);
            const firstPhoto = sortedPhotos[0];
            const imageSrc = firstPhoto ? getPhotoUrl(firstPhoto.storage_path) : "/images/placeholder-car.jpg";

            return (
              <CarCard
                key={car.slug}
                slug={car.slug}
                name={car.name}
                category={car.category_label}
                year={car.year}
                km={`${czNumber.format(car.km)} km`}
                powerKw={`${car.power_kw} kW`}
                transmission={car.transmission_type}
                fuel={car.fuel}
                price={car.price === -1 ? "Cena na dotaz" : `${czNumber.format(car.price)} Kč`}
                imageSrc={imageSrc}
                imageAlt={car.name}
                badges={car.badges ?? ["Cebia"]}
              />
            );
          })}
        </div>

        {cars.length === 0 && (
          <div className="text-center py-16">
            <p className="text-text-muted text-lg">Momentálně nemáme žádná vozidla v nabídce.</p>
            <Link
              href="/#kontakt"
              className="mt-4 inline-flex items-center gap-2 px-7 py-3.5 rounded-[8px] text-[15px] font-semibold bg-blue !text-white border-2 border-blue transition-all duration-[250ms] hover:bg-blue-hover hover:border-blue-hover"
            >
              Kontaktujte nás
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
