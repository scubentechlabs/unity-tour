-- Create taxi vehicles table
CREATE TABLE public.taxi_vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'sedan',
  image_url TEXT,
  seating_capacity INTEGER NOT NULL DEFAULT 4,
  luggage_capacity INTEGER NOT NULL DEFAULT 2,
  ac BOOLEAN NOT NULL DEFAULT true,
  fuel_type TEXT DEFAULT 'Petrol',
  base_price_per_km NUMERIC NOT NULL DEFAULT 12,
  base_price_per_day NUMERIC NOT NULL DEFAULT 2500,
  is_active BOOLEAN NOT NULL DEFAULT true,
  features TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create taxi enquiries table
CREATE TABLE public.taxi_enquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  vehicle_id UUID REFERENCES public.taxi_vehicles(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  pickup_location TEXT NOT NULL,
  drop_location TEXT,
  trip_type TEXT NOT NULL DEFAULT 'one-way',
  pickup_date DATE NOT NULL,
  pickup_time TEXT,
  return_date DATE,
  passengers INTEGER DEFAULT 1,
  message TEXT,
  estimated_distance NUMERIC,
  estimated_price NUMERIC,
  quoted_price NUMERIC,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.taxi_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taxi_enquiries ENABLE ROW LEVEL SECURITY;

-- RLS policies for taxi_vehicles (public read for active vehicles)
CREATE POLICY "Active vehicles are viewable by everyone"
ON public.taxi_vehicles
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage vehicles"
ON public.taxi_vehicles
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- RLS policies for taxi_enquiries
CREATE POLICY "Anyone can submit taxi enquiries"
ON public.taxi_enquiries
FOR INSERT
WITH CHECK (
  name IS NOT NULL AND name <> '' AND
  email IS NOT NULL AND email <> '' AND
  phone IS NOT NULL AND phone <> '' AND
  pickup_location IS NOT NULL AND pickup_location <> ''
);

CREATE POLICY "Users can view their own taxi enquiries"
ON public.taxi_enquiries
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all taxi enquiries"
ON public.taxi_enquiries
FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update taxi enquiries"
ON public.taxi_enquiries
FOR UPDATE
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete taxi enquiries"
ON public.taxi_enquiries
FOR DELETE
USING (public.is_admin(auth.uid()));

-- Add triggers for updated_at
CREATE TRIGGER update_taxi_vehicles_updated_at
BEFORE UPDATE ON public.taxi_vehicles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_taxi_enquiries_updated_at
BEFORE UPDATE ON public.taxi_enquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample vehicles
INSERT INTO public.taxi_vehicles (name, category, seating_capacity, luggage_capacity, base_price_per_km, base_price_per_day, features, image_url) VALUES
('Swift Dzire', 'sedan', 4, 2, 12, 2500, ARRAY['AC', 'Music System', 'USB Charging'], 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400'),
('Toyota Etios', 'sedan', 4, 2, 13, 2800, ARRAY['AC', 'Music System', 'USB Charging', 'GPS'], 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=400'),
('Ertiga', 'suv', 6, 3, 16, 3500, ARRAY['AC', 'Music System', 'USB Charging', 'Extra Legroom'], 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400'),
('Innova Crysta', 'suv', 7, 4, 18, 4500, ARRAY['AC', 'Music System', 'USB Charging', 'Premium Interior', 'GPS'], 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400'),
('Tempo Traveller', 'tempo', 12, 8, 22, 6000, ARRAY['AC', 'Music System', 'Push Back Seats', 'LCD Screen'], 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400'),
('Luxury Bus', 'bus', 20, 20, 35, 12000, ARRAY['AC', 'Music System', 'Push Back Seats', 'LCD Screen', 'WiFi'], 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400');