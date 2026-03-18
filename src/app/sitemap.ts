import type { MetadataRoute } from "next";
import { getVisibleCars } from "@/lib/supabase/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://carbeat.cz";

  const cars = await getVisibleCars();

  const carUrls: MetadataRoute.Sitemap = cars
    .filter((car) => car.status === "v_nabidce" || car.status === "pripravujeme")
    .map((car) => ({
      url: `${baseUrl}/auto/${car.slug}`,
      lastModified: car.updated_at ? new Date(car.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/nabidka`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/o-nas`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/aviloo`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...carUrls,
  ];
}
