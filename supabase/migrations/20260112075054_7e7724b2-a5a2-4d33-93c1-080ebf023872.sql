-- Create hero_slides table for managing homepage slider
CREATE TABLE public.hero_slides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  button_text TEXT DEFAULT 'Explore Now',
  button_link TEXT DEFAULT '/domestic-tours',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

-- Everyone can view active slides
CREATE POLICY "Active hero slides are viewable by everyone"
ON public.hero_slides
FOR SELECT
USING (is_active = true);

-- Add trigger for updated_at
CREATE TRIGGER update_hero_slides_updated_at
BEFORE UPDATE ON public.hero_slides
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default slides
INSERT INTO public.hero_slides (title, subtitle, description, image_url, button_text, button_link, display_order) VALUES
('Discover the World in Unparalleled Luxury', '✨ Premium Travel Experiences', 'Experience extraordinary journeys with our curated tours, premium taxi services, and hassle-free flight bookings.', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Explore Tours', '/domestic-tours', 1),
('Experience the Magic of Kashmir', '🏔️ Hill Station Paradise', 'Discover breathtaking valleys, pristine lakes, and snow-capped mountains in the crown of India.', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'View Kashmir Tours', '/domestic-tours', 2),
('Tropical Beach Getaways', '🌴 Beach & Island Tours', 'Escape to pristine beaches with crystal clear waters and golden sands in Goa, Andaman & more.', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Beach Packages', '/domestic-tours', 3);

-- Create admin_users table for managing admin access
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL,
  name TEXT,
  is_super_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only admins can view admin list
CREATE POLICY "Admins can view admin list"
ON public.admin_users
FOR SELECT
USING (auth.uid() = user_id);

-- Allow admin operations on hero_slides
CREATE POLICY "Admins can manage hero slides"
ON public.hero_slides
FOR ALL
USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);