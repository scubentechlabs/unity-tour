-- Create flight_enquiries table
CREATE TABLE public.flight_enquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  trip_type TEXT NOT NULL DEFAULT 'one-way',
  departure_city TEXT NOT NULL,
  arrival_city TEXT NOT NULL,
  departure_date DATE NOT NULL,
  return_date DATE,
  passengers INTEGER NOT NULL DEFAULT 1,
  class TEXT NOT NULL DEFAULT 'economy',
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  quoted_price NUMERIC,
  admin_notes TEXT,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.flight_enquiries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can submit flight enquiries"
ON public.flight_enquiries
FOR INSERT
WITH CHECK (
  name IS NOT NULL AND name <> '' AND
  email IS NOT NULL AND email <> '' AND
  phone IS NOT NULL AND phone <> '' AND
  departure_city IS NOT NULL AND departure_city <> '' AND
  arrival_city IS NOT NULL AND arrival_city <> ''
);

CREATE POLICY "Admins can view all flight enquiries"
ON public.flight_enquiries
FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update flight enquiries"
ON public.flight_enquiries
FOR UPDATE
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can delete flight enquiries"
ON public.flight_enquiries
FOR DELETE
USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their own flight enquiries"
ON public.flight_enquiries
FOR SELECT
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_flight_enquiries_updated_at
BEFORE UPDATE ON public.flight_enquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();