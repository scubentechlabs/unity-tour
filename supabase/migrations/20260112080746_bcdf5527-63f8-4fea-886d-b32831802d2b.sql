-- Create has_role function for checking admin access
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = _user_id
  )
$$;

-- Allow admins to view all enquiries
CREATE POLICY "Admins can view all enquiries"
ON public.tour_enquiries
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Allow admins to update all enquiries
CREATE POLICY "Admins can update all enquiries"
ON public.tour_enquiries
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Allow admins to delete enquiries
CREATE POLICY "Admins can delete enquiries"
ON public.tour_enquiries
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));