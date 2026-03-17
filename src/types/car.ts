export type CarSegment = "japonska" | "seat-cupra" | "elektro" | "sportovni" | "ostatni";
export type CarStatus = "koncept" | "pripravujeme" | "v_nabidce" | "prodano";

export interface Car {
  id: string;
  slug: string;
  name: string;
  segment: CarSegment;
  category_label: string;
  year: number;
  km: number;
  power_kw: number;
  fuel: string;
  engine: string;
  transmission: string;
  transmission_type: string;
  drive: string;
  body_type: string;
  price: number;
  description: string | null;
  defects: string[];
  badges: string[];
  youtube_url: string | null;
  equipment: Record<string, string[]>;
  status: CarStatus;
  is_published: boolean;
  sort_order: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CarPhoto {
  id: string;
  car_id: string;
  storage_path: string;
  position: number;
  alt_text: string | null;
  created_at: string;
}

export interface CarWithPhotos extends Car {
  car_photos: CarPhoto[];
}
