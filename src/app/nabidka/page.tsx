import type { Metadata } from "next";
import { getVisibleCars, getPhotoUrl } from "@/lib/supabase/queries";
import NabidkaClient from "./NabidkaClient";

export const metadata: Metadata = {
  title: "Nabídka vozů | CarBeat",
  description:
    "Aktuální nabídka prověřených ojetých vozů z Německa. Filtrujte podle segmentu, paliva, převodovky, ceny a nájezdu. Cebia certifikát ke každému vozu.",
  alternates: { canonical: "/nabidka" },
  openGraph: {
    title: "Nabídka vozů | CarBeat",
    description:
      "Prověřená ojetá auta z Německa — prohlédněte si naši aktuální nabídku.",
  },
};

// Revalidate every 60s so new/updated cars appear without redeploy
export const revalidate = 60;

export default async function NabidkaPage() {
  const cars = await getVisibleCars();

  // Map DB cars to the shape the client component expects
  const mappedCars = cars.map((car) => {
    const sortedPhotos = (car.car_photos ?? []).sort((a, b) => a.position - b.position);
    const firstPhoto = sortedPhotos[0];
    const imageSrc = firstPhoto ? getPhotoUrl(firstPhoto.storage_path) : "/images/placeholder-car.jpg";

    return {
      slug: car.slug,
      name: car.name,
      category: car.category_label,
      segment: car.segment,
      fuel: car.fuel,
      transmissionType: car.transmission_type,
      drive: car.drive,
      bodyType: car.body_type,
      year: car.year,
      km: car.km,
      powerKw: car.power_kw,
      price: car.price,
      imageSrc,
      badges: car.badges ?? ["Cebia"],
      status: car.status,
    };
  });

  return <NabidkaClient cars={mappedCars} />;
}
