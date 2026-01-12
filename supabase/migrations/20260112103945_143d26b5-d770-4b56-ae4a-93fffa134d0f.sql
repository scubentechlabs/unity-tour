-- Create storage bucket for hero slide images
INSERT INTO storage.buckets (id, name, public)
VALUES ('hero-slides', 'hero-slides', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view hero slide images (public bucket)
CREATE POLICY "Hero slide images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'hero-slides');

-- Allow admins to upload hero slide images
CREATE POLICY "Admins can upload hero slide images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'hero-slides' AND public.is_admin(auth.uid()));

-- Allow admins to update hero slide images
CREATE POLICY "Admins can update hero slide images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'hero-slides' AND public.is_admin(auth.uid()));

-- Allow admins to delete hero slide images
CREATE POLICY "Admins can delete hero slide images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'hero-slides' AND public.is_admin(auth.uid()));