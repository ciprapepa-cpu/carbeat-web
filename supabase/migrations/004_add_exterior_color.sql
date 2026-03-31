-- Add exterior_color column for Meta catalog feed (required field)
ALTER TABLE cars ADD COLUMN exterior_color TEXT NOT NULL DEFAULT 'Other';
