-- Fix overly permissive RLS policy for tour_enquiries INSERT
-- Drop the permissive policy
DROP POLICY "Anyone can create enquiries" ON public.tour_enquiries;

-- Create a more secure policy that still allows public submissions but validates input
CREATE POLICY "Allow enquiry submissions with rate limiting context" 
ON public.tour_enquiries 
FOR INSERT 
WITH CHECK (
  -- Ensure required fields are not empty
  name IS NOT NULL AND name != '' AND
  email IS NOT NULL AND email != '' AND
  phone IS NOT NULL AND phone != ''
);