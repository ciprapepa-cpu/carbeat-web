-- ============================================================
-- Storage bucket for car photos
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('car-photos', 'car-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access for all car photos
CREATE POLICY "Public read access for car photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'car-photos');

-- Authenticated users can upload car photos
CREATE POLICY "Authenticated users can upload car photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'car-photos');

-- Authenticated users can update car photos
CREATE POLICY "Authenticated users can update car photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'car-photos');

-- Authenticated users can delete car photos
CREATE POLICY "Authenticated users can delete car photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'car-photos');
