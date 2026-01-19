-- Add is_taxi_slide column to hero_slides table
ALTER TABLE public.hero_slides 
ADD COLUMN is_taxi_slide boolean NOT NULL DEFAULT false;

-- Add comment for clarity
COMMENT ON COLUMN public.hero_slides.is_taxi_slide IS 'When true, renders as a taxi booking slide with special layout';