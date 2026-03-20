import { createClient } from "@supabase/supabase-js";
import type { CarWithPhotos, CarStatus } from "@/types/car";

/**
 * Create a lightweight Supabase client for public reads.
 * Uses anon key — no cookies needed, works at build time and in server components.
 */
function getPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Get the public URL for a car photo from Supabase Storage.
 */
export function getPhotoUrl(storagePath: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/car-photos/${storagePath}`;
}

const VISIBLE_STATUSES: CarStatus[] = ["pripravujeme", "v_nabidce", "prodano"];

/**
 * Fetch all visible cars (pripravujeme, v_nabidce, prodano) with their photos.
 * Ordered by sort_order, then created_at desc.
 */
export async function getVisibleCars(): Promise<CarWithPhotos[]> {
  const supabase = getPublicClient();

  const { data, error } = await supabase
    .from("cars")
    .select("*, car_photos(*)")
    .in("status", VISIBLE_STATUSES)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching cars:", error);
    return [];
  }

  return (data ?? []) as CarWithPhotos[];
}

/**
 * Fetch a single car by slug, with photos.
 * Only returns published, visible cars.
 */
export async function getCarBySlugFromDb(slug: string): Promise<CarWithPhotos | null> {
  const supabase = getPublicClient();

  const { data, error } = await supabase
    .from("cars")
    .select("*, car_photos(*)")
    .eq("slug", slug)
    .in("status", VISIBLE_STATUSES)
    .single();

  if (error) {
    return null;
  }

  return data as CarWithPhotos;
}

/**
 * Get all slugs of visible cars (for generateStaticParams).
 */
export async function getAllVisibleSlugs(): Promise<string[]> {
  const supabase = getPublicClient();

  const { data, error } = await supabase
    .from("cars")
    .select("slug")
    .in("status", VISIBLE_STATUSES);

  if (error) {
    console.error("Error fetching slugs:", error);
    return [];
  }

  return (data ?? []).map((row: { slug: string }) => row.slug);
}
