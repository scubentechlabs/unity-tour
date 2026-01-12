
-- Add RLS policies for admins to manage tour packages
CREATE POLICY "Admins can insert tour packages"
ON public.tour_packages
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update tour packages"
ON public.tour_packages
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete tour packages"
ON public.tour_packages
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));
