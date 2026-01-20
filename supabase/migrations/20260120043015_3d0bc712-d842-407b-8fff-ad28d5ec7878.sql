-- Create driver_registrations table for driver partner registrations
CREATE TABLE public.driver_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.driver_registrations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (anyone can register)
CREATE POLICY "Anyone can submit driver registration"
ON public.driver_registrations
FOR INSERT
WITH CHECK (true);

-- Create policy for admins to view all registrations
CREATE POLICY "Admins can view all driver registrations"
ON public.driver_registrations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);

-- Create policy for admins to update registrations
CREATE POLICY "Admins can update driver registrations"
ON public.driver_registrations
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);

-- Create policy for admins to delete registrations
CREATE POLICY "Admins can delete driver registrations"
ON public.driver_registrations
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_driver_registrations_updated_at
BEFORE UPDATE ON public.driver_registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();