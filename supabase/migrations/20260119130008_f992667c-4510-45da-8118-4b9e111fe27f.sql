-- Create storage bucket for taxi vehicle images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('taxi-vehicles', 'taxi-vehicles', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to taxi vehicle images
CREATE POLICY "Public can view taxi vehicle images"
ON storage.objects FOR SELECT
USING (bucket_id = 'taxi-vehicles');

-- Allow authenticated admins to upload taxi vehicle images
CREATE POLICY "Admins can upload taxi vehicle images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'taxi-vehicles' 
  AND EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- Allow authenticated admins to update taxi vehicle images
CREATE POLICY "Admins can update taxi vehicle images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'taxi-vehicles' 
  AND EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- Allow authenticated admins to delete taxi vehicle images
CREATE POLICY "Admins can delete taxi vehicle images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'taxi-vehicles' 
  AND EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);