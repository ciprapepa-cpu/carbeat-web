import { z } from "zod";

export const CAR_SEGMENTS = [
  "japonska",
  "seat-cupra",
  "elektro",
  "sportovni",
  "ostatni",
] as const;

export const CAR_STATUSES = [
  "koncept",
  "pripravujeme",
  "v_nabidce",
  "prodano",
] as const;

export const carSchema = z.object({
  name: z.string().min(1, "Název je povinný"),
  slug: z.string().min(1, "Slug je povinný"),
  segment: z.enum(CAR_SEGMENTS, { message: "Vyberte segment" }),
  category_label: z.string().default(""),
  year: z.number().int().min(1990).max(2030),
  km: z.number().int().min(0),
  power_kw: z.number().int().min(0),
  fuel: z.string().min(1, "Palivo je povinné"),
  engine: z.string().default(""),
  transmission: z.string().default(""),
  transmission_type: z.string().default(""),
  drive: z.string().default(""),
  body_type: z.string().default(""),
  price: z.number().int().min(-1, "Cena musí být kladná nebo -1 pro cenu na dotaz"),
  description: z.string().nullable().default(null),
  defects: z.array(z.string()).default([]),
  badges: z.array(z.string()).default(["Cebia"]),
  youtube_url: z.string().url().nullable().or(z.literal("")).transform((v) => v || null).default(null),
  equipment: z.record(z.string(), z.array(z.string())).default({}),
  status: z.enum(CAR_STATUSES).default("koncept"),
  is_published: z.boolean().default(false),
  sort_order: z.number().int().default(0),
  meta_title: z.string().nullable().default(null),
  meta_description: z.string().nullable().default(null),
});

export type CarFormData = z.infer<typeof carSchema>;

export const photoReorderSchema = z.object({
  photos: z.array(
    z.object({
      id: z.string().uuid(),
      position: z.number().int().min(0),
    })
  ),
});
