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
  if (lower.includes("benz")) return "GASOLINE";
  if (lower.includes("nafta") || lower.includes("diesel")) return "DIESEL";
  if (lower.includes("elektr")) return "ELECTRIC";
  if (lower.includes("hybrid")) return "HYBRID";
  if (lower.includes("lpg") || lower.includes("cng")) return "FLEX";
  return "OTHER";
}

function mapTransmission(trans: string): string {
  const lower = trans.toLowerCase();
  if (lower.includes("automat")) return "Automatic";
  if (lower.includes("manuál") || lower.includes("manual")) return "Manual";
  return "Automatic";
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
  if (lower.includes("4x4") || lower.includes("4wd") || lower.includes("awd")) return "4X4";
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

function buildListing(car: CarWithPhotos): string {
  const { make, model } = parseMakeModel(car.name);
  const photos = getSortedPhotos(car);
  const url = `${BASE_URL}/auto/${car.slug}`;
  const description = car.description
    || `${car.name} – ${car.year}, ${car.km.toLocaleString("cs-CZ")} km, ${car.fuel}, ${car.power_kw} kW`;

  const imageElements = photos
    .map((photoUrl, i) => `    <image>
      <url>${escapeXml(photoUrl)}</url>
      <tag>${i === 0 ? "Exterior" : "Interior"}</tag>
    </image>`)
    .join("\n");

  return `  <listing>
    <vehicle_id>${escapeXml(car.id)}</vehicle_id>
    <title>${escapeXml(car.name)} ${car.year}</title>
    <description><![CDATA[${description}]]></description>
    <url>${escapeXml(url)}</url>
    <make>${escapeXml(make)}</make>
    <model>${escapeXml(model)}</model>
    <year>${car.year}</year>
    <mileage>
      <value>${car.km}</value>
      <unit>KM</unit>
    </mileage>
    <price>${car.price} CZK</price>
    <body_style>${mapBodyStyle(car.body_type)}</body_style>
    <transmission>${mapTransmission(car.transmission)}</transmission>
    <fuel_type>${mapFuel(car.fuel)}</fuel_type>
    <drivetrain>${mapDrivetrain(car.drive)}</drivetrain>
    <exterior_color>N/A</exterior_color>
    <state_of_vehicle>Used</state_of_vehicle>
    <availability>In stock</availability>
    <address format="simple">
      <component name="addr1">Sviňišťany 63</component>
      <component name="city">Sviňišťany</component>
      <component name="region">Královéhradecký kraj</component>
      <component name="postal_code">552 01</component>
      <component name="country">CZ</component>
    </address>
    <latitude>50.1848</latitude>
    <longitude>15.7378</longitude>
    <dealer_name>CarBeat s.r.o.</dealer_name>
    <dealer_phone>+420777027809</dealer_phone>
${imageElements}
  </listing>`;
}

export async function GET(): Promise<NextResponse> {
  const cars = await getVisibleCars();
  const feedCars = cars.filter((car) => car.status === "v_nabidce");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<listings>
  <title>CarBeat Vehicle Feed</title>
  <link rel="self" href="${BASE_URL}/feed/meta-catalog.xml"/>
${feedCars.map(buildListing).join("\n")}
</listings>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
