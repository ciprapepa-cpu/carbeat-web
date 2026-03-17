-- Add status column to cars table
-- Values: koncept (draft), pripravujeme (preparing), v_nabidce (published), prodano (sold)

ALTER TABLE cars
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'koncept'
  CHECK (status IN ('koncept', 'pripravujeme', 'v_nabidce', 'prodano'));

-- Migrate existing data: published cars → v_nabidce, others → koncept
UPDATE cars SET status = 'v_nabidce' WHERE is_published = true;
UPDATE cars SET status = 'koncept' WHERE is_published = false;

-- Update RLS: public can read cars that are not koncept (pripravujeme, v_nabidce, prodano are visible)
DROP POLICY IF EXISTS "Public can read published cars" ON cars;
CREATE POLICY "Public can read visible cars"
  ON cars FOR SELECT
  USING (status IN ('pripravujeme', 'v_nabidce', 'prodano'));

-- Update photos RLS to match
DROP POLICY IF EXISTS "Public can read photos of published cars" ON car_photos;
CREATE POLICY "Public can read photos of visible cars"
  ON car_photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cars
      WHERE cars.id = car_photos.car_id
      AND cars.status IN ('pripravujeme', 'v_nabidce', 'prodano')
    )
  );

CREATE INDEX IF NOT EXISTS idx_cars_status ON cars(status);
