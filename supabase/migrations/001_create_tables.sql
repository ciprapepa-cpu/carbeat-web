-- ============================================================
-- CarBeat DB Schema
-- ============================================================

-- Cars table
CREATE TABLE IF NOT EXISTS cars (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text UNIQUE NOT NULL,
  name          text NOT NULL,
  segment       text NOT NULL CHECK (segment IN ('japonska', 'seat-cupra', 'elektro', 'sportovni', 'ostatni')),
  category_label text NOT NULL DEFAULT '',
  year          smallint NOT NULL,
  km            integer NOT NULL,
  power_kw      smallint NOT NULL,
  fuel          text NOT NULL,
  engine        text NOT NULL DEFAULT '',
  transmission  text NOT NULL DEFAULT '',
  transmission_type text NOT NULL DEFAULT '',
  drive         text NOT NULL DEFAULT '',
  body_type     text NOT NULL DEFAULT '',
  price         integer NOT NULL,
  description   text,
  defects       text[] DEFAULT '{}',
  badges        text[] DEFAULT '{Cebia}',
  youtube_url   text,
  equipment     jsonb DEFAULT '{}',
  is_published  boolean DEFAULT true,
  sort_order    integer DEFAULT 0,
  meta_title    text,
  meta_description text,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- Car photos table
CREATE TABLE IF NOT EXISTS car_photos (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id        uuid NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  storage_path  text NOT NULL,
  position      smallint NOT NULL DEFAULT 0,
  alt_text      text,
  created_at    timestamptz DEFAULT now()
);

CREATE INDEX idx_car_photos_car_id ON car_photos(car_id);
CREATE INDEX idx_cars_segment ON cars(segment);
CREATE INDEX idx_cars_slug ON cars(slug);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cars_updated_at
  BEFORE UPDATE ON cars
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_photos ENABLE ROW LEVEL SECURITY;

-- Public read access for published cars
CREATE POLICY "Public can read published cars"
  ON cars FOR SELECT
  USING (is_published = true);

-- Public read access for photos of published cars
CREATE POLICY "Public can read photos of published cars"
  ON car_photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cars WHERE cars.id = car_photos.car_id AND cars.is_published = true
    )
  );

-- Admin full access (authenticated users — will be restricted further in Phase 6)
CREATE POLICY "Authenticated users can manage cars"
  ON cars FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage photos"
  ON car_photos FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
