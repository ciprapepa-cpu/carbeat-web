import { NextResponse } from "next/server";
import { getVisibleCars, getPhotoUrl } from "@/lib/supabase/queries";
import type { CarWithPhotos } from "@/types/car";

export const revalidate = 3600;

const BASE_URL = "https://www.carbeat.cz";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function parseMakeModel(name: string): { make: string; model: string } {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return { make: parts[0], model: parts.slice(1).join(" ") };
  }
  return { make: name, model: name };
}

function mapFuel(fuel: string): string {
  const lower = fuel.toLowerCase();
  if (lower.includes("benz")) return "gasoline";
  if (lower.includes("nafta") || lower.includes("diesel")) return "diesel";
  if (lower.includes("elektr")) return "electric";
  if (lower.includes("hybrid")) return "hybrid";
  if (lower.includes("lpg") || lower.includes("cng")) return "flex";
  return "other";
}

function mapTransmission(trans: string): string {
  const lower = trans.toLowerCase();
  if (lower.includes("automat")) return "automatic";
  if (lower.includes("manuál") || lower.includes("manual")) return "manual";
  return "other";
}

function mapBodyStyle(body: string): string {
  const lower = body.toLowerCase();
  if (lower.includes("sedan")) return "SEDAN";
  if (lower.includes("kombi") || lower.includes("combi")) return "WAGON";
  if (lower.includes("hatchback")) return "HATCHBACK";
  if (lower.includes("suv") || lower.includes("crossover")) return "SUV";
  if (lower.includes("kupé") || lower.includes("coupe") || lower.includes("coupé")) return "COUPE";
  if (lower.includes("kabrio") || lower.includes("cabrio") || lower.includes("kabriolet")) return "CONVERTIBLE";
  if (lower.includes("mpv") || lower.includes("van") || lower.includes("minivan")) return "MINIVAN";
  if (lower.includes("pick")) return "TRUCK";
  return "OTHER";
}

function mapDrivetrain(drive: string): string {
  const lower = drive.toLowerCase();
  if (lower.includes("4x4") || lower.includes("4wd") || lower.includes("awd")) return "AWD";
  if (lower.includes("zadn")) return "RWD";
  return "FWD";
}

function getPhotoAbsoluteUrl(storagePath: string): string {
  if (storagePath.startsWith("/images/")) return `${BASE_URL}${storagePath}`;
  return getPhotoUrl(storagePath);
}

function getSortedPhotos(car: CarWithPhotos): string[] {
  if (!car.car_photos || car.car_photos.length === 0) return [];
  return [...car.car_photos]
    .sort((a, b) => a.position - b.position)
    .slice(0, 20)
    .map((p) => getPhotoAbsoluteUrl(p.storage_path));
}

function buildVehicleItem(car: CarWithPhotos): string {
  const { make, model } = parseMakeModel(car.name);
  const photos = getSortedPhotos(car);
  const url = `${BASE_URL}/auto/${car.slug}`;
  const availability = "in stock";
  const description = car.description || `${car.name} – ${car.year}, ${car.km.toLocaleString("cs-CZ")} km, ${car.fuel}, ${car.power_kw} kW`;

  const imageElements = photos
    .map((photoUrl) => `      <g:image_link>${escapeXml(photoUrl)}</g:image_link>`)
    .join("\n");

  return `    <item>
      <g:id>${escapeXml(car.id)}</g:id>
      <g:title>${escapeXml(car.name)} ${car.year}</g:title>
      <g:description><![CDATA[${description}]]></g:description>
      <g:link>${escapeXml(url)}</g:link>
      <g:price>${car.price} CZK</g:price>
      <g:condition>used</g:condition>
      <g:availability>${availability}</g:availability>
      <g:make>${escapeXml(make)}</g:make>
      <g:model>${escapeXml(model)}</g:model>
      <g:year>${car.year}</g:year>
      <g:mileage.value>${car.km}</g:mileage.value>
      <g:mileage.unit>KM</g:mileage.unit>
      <g:body_style>${mapBodyStyle(car.body_type)}</g:body_style>
      <g:transmission>${mapTransmission(car.transmission)}</g:transmission>
      <g:fuel_type>${mapFuel(car.fuel)}</g:fuel_type>
      <g:drivetrain>${mapDrivetrain(car.drive)}</g:drivetrain>
      <g:exterior_color></g:exterior_color>
${imageElements}
    </item>`;
}

export async function GET(): Promise<NextResponse> {
  const cars = await getVisibleCars();

  const feedCars = cars.filter((car) => car.status === "v_nabidce");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>CarBeat – Ojetá auta s příběhem</title>
    <link>${BASE_URL}</link>
    <description>Nabídka prověřených ojetých vozidel CarBeat</description>
${feedCars.map(buildVehicleItem).join("\n")}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
