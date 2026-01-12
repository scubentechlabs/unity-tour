-- Create storage bucket for tour images
INSERT INTO storage.buckets (id, name, public)
VALUES ('tour-images', 'tour-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view tour images (public bucket)
CREATE POLICY "Tour images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'tour-images');

-- Allow admins to upload tour images
CREATE POLICY "Admins can upload tour images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'tour-images' AND public.is_admin(auth.uid()));

-- Allow admins to update tour images
CREATE POLICY "Admins can update tour images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'tour-images' AND public.is_admin(auth.uid()));

-- Allow admins to delete tour images
CREATE POLICY "Admins can delete tour images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'tour-images' AND public.is_admin(auth.uid()));