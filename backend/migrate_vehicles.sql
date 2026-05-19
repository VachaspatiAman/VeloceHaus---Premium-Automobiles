-- Run this in Supabase Dashboard > SQL Editor
-- Adds spec columns + color_variants JSONB to the vehicles table

ALTER TABLE public.vehicles
  ADD COLUMN IF NOT EXISTS engine        TEXT,
  ADD COLUMN IF NOT EXISTS transmission  TEXT,
  ADD COLUMN IF NOT EXISTS horsepower    INTEGER,
  ADD COLUMN IF NOT EXISTS torque        TEXT,
  ADD COLUMN IF NOT EXISTS mileage       TEXT,
  ADD COLUMN IF NOT EXISTS seats         INTEGER DEFAULT 5,
  ADD COLUMN IF NOT EXISTS top_speed     INTEGER,
  ADD COLUMN IF NOT EXISTS warranty      TEXT,
  ADD COLUMN IF NOT EXISTS color_variants JSONB DEFAULT '[]'::jsonb;
