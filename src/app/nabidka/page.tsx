import { getVisibleCars, getPhotoUrl } from "@/lib/supabase/queries";
import NabidkaClient from "./NabidkaClient";

// Revalidate every 60s so new/updated cars appear without redeploy
export const revalidate = 60;

export default async function NabidkaPage() {
  const cars = await getVisibleCars();

  // Map DB cars to the shape the client component expects
  const mappedCars = cars.map((car) => {
    const sortedPhotos = (car.car_photos ?? []).sort((a, b) => a.position - b.position);
    const firstPhoto = sortedPhotos[0];
    const imageSrc = firstPhoto ? getPhotoUrl(firstPhoto.storage_path) : "/images/placeholder-car.jpg";

    // Build transmission label from transmission name (or type as fallback) + drive
    const transName = car.transmission || car.transmission_type;
    const transLabel = car.drive && car.drive !== "Předních kol"
      ? `${transName} · ${car.drive}`
      : transName;

    return {
      slug: car.slug,
      name: car.name,
      category: car.category_label,
      segment: car.segment,
      fuel: car.fuel.toLowerCase(),
      trans: car.transmission_type === "Automatická" ? "automat" : "manuál",
      year: car.year,
      km: car.km,
      powerKw: car.power_kw,
      transmission: transLabel,
      fuelLabel: car.engine ? `${car.fuel} ${car.engine}` : car.fuel,
      price: car.price,
      imageSrc,
      badges: car.badges ?? ["Cebia"],
      status: car.status,
    };
  });

  return <NabidkaClient cars={mappedCars} />;
}
