-- Create tour categories enum
CREATE TYPE public.tour_type AS ENUM ('domestic', 'international');
CREATE TYPE public.tour_category AS ENUM ('adventure', 'honeymoon', 'family', 'pilgrimage', 'wildlife', 'beach', 'hill_station', 'heritage');
CREATE TYPE public.enquiry_status AS ENUM ('pending', 'quoted', 'confirmed', 'completed', 'cancelled');

-- Create tour_packages table
CREATE TABLE public.tour_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  tour_type public.tour_type NOT NULL DEFAULT 'domestic',
  category public.tour_category NOT NULL DEFAULT 'adventure',
  location TEXT NOT NULL,
  state TEXT,
  country TEXT DEFAULT 'India',
  duration_days INTEGER NOT NULL,
  duration_nights INTEGER NOT NULL,
  price_per_person DECIMAL(10,2) NOT NULL,
  discounted_price DECIMAL(10,2),
  max_group_size INTEGER DEFAULT 20,
  min_group_size INTEGER DEFAULT 2,
  inclusions TEXT[] DEFAULT '{}',
  exclusions TEXT[] DEFAULT '{}',
  itinerary JSONB DEFAULT '[]',
  highlights TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  featured_image TEXT,
  hotel_details JSONB DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  rating DECIMAL(2,1) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tour_enquiries table
CREATE TABLE public.tour_enquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  tour_package_id UUID REFERENCES public.tour_packages(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  travel_date DATE,
  adults INTEGER DEFAULT 1,
  children INTEGER DEFAULT 0,
  message TEXT,
  status public.enquiry_status DEFAULT 'pending',
  quoted_price DECIMAL(10,2),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tour_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_enquiries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tour_packages (public read, admin write)
CREATE POLICY "Tour packages are viewable by everyone" 
ON public.tour_packages 
FOR SELECT 
USING (is_active = true);

-- RLS Policies for tour_enquiries
CREATE POLICY "Users can view their own enquiries" 
ON public.tour_enquiries 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create enquiries" 
ON public.tour_enquiries 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own enquiries" 
ON public.tour_enquiries 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_tour_packages_tour_type ON public.tour_packages(tour_type);
CREATE INDEX idx_tour_packages_category ON public.tour_packages(category);
CREATE INDEX idx_tour_packages_state ON public.tour_packages(state);
CREATE INDEX idx_tour_packages_is_featured ON public.tour_packages(is_featured);
CREATE INDEX idx_tour_enquiries_user_id ON public.tour_enquiries(user_id);
CREATE INDEX idx_tour_enquiries_status ON public.tour_enquiries(status);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_tour_packages_updated_at
BEFORE UPDATE ON public.tour_packages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tour_enquiries_updated_at
BEFORE UPDATE ON public.tour_enquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample domestic tour packages
INSERT INTO public.tour_packages (title, slug, description, tour_type, category, location, state, duration_days, duration_nights, price_per_person, discounted_price, inclusions, exclusions, highlights, featured_image, is_featured, rating, total_reviews, itinerary) VALUES
('Golden Triangle Tour', 'golden-triangle-tour', 'Experience the magic of India''s most iconic cities - Delhi, Agra, and Jaipur. This classic tour takes you through centuries of history, magnificent architecture, and vibrant culture.', 'domestic', 'heritage', 'Delhi - Agra - Jaipur', 'Delhi', 6, 5, 24999.00, 21999.00, ARRAY['Accommodation in 4-star hotels', 'Daily breakfast and dinner', 'AC transportation', 'Professional English-speaking guide', 'Monument entrance fees', 'Airport transfers'], ARRAY['Flights', 'Personal expenses', 'Tips and gratuities', 'Travel insurance'], ARRAY['Visit the iconic Taj Mahal at sunrise', 'Explore the majestic Amber Fort', 'Walk through the historic Red Fort', 'Shop at vibrant local bazaars'], 'https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', true, 4.9, 245, '[{"day": 1, "title": "Arrival in Delhi", "description": "Arrive at Delhi airport, transfer to hotel. Evening visit to India Gate and Connaught Place."}, {"day": 2, "title": "Delhi Sightseeing", "description": "Full day tour of Old and New Delhi including Red Fort, Jama Masjid, Qutub Minar, and Humayun Tomb."}, {"day": 3, "title": "Delhi to Agra", "description": "Drive to Agra. Visit Agra Fort and witness the mesmerizing sunset view of Taj Mahal from Mehtab Bagh."}, {"day": 4, "title": "Taj Mahal & Agra to Jaipur", "description": "Early morning Taj Mahal visit. Drive to Jaipur via Fatehpur Sikri."}, {"day": 5, "title": "Jaipur Sightseeing", "description": "Visit Amber Fort, City Palace, Hawa Mahal, and Jantar Mantar. Evening shopping at local markets."}, {"day": 6, "title": "Departure", "description": "Transfer to Jaipur airport or drive back to Delhi for departure."}]'),

('Kerala Backwaters Escape', 'kerala-backwaters-escape', 'Discover God''s Own Country with this enchanting tour through Kerala''s serene backwaters, lush tea gardens, and pristine beaches.', 'domestic', 'honeymoon', 'Kochi - Munnar - Alleppey', 'Kerala', 5, 4, 29999.00, 26999.00, ARRAY['4-star resort accommodation', 'Houseboat stay with all meals', 'Daily breakfast', 'AC transportation', 'Kathakali dance show', 'Spice plantation visit'], ARRAY['Flights', 'Lunch and dinner (except houseboat)', 'Personal expenses', 'Water sports'], ARRAY['Overnight stay in luxury houseboat', 'Tea plantation walk in Munnar', 'Traditional Kathakali performance', 'Ayurvedic spa experience'], 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', true, 4.8, 189, '[{"day": 1, "title": "Arrival in Kochi", "description": "Arrive at Cochin airport, transfer to hotel. Evening Kathakali dance performance."}, {"day": 2, "title": "Kochi to Munnar", "description": "Drive to Munnar through scenic routes. Visit tea plantations and Eravikulam National Park."}, {"day": 3, "title": "Munnar Exploration", "description": "Visit Tea Museum, Echo Point, and Mattupetty Dam. Enjoy the cool mountain weather."}, {"day": 4, "title": "Munnar to Alleppey", "description": "Drive to Alleppey. Board luxury houseboat for overnight cruise through backwaters."}, {"day": 5, "title": "Departure", "description": "Disembark from houseboat. Transfer to Cochin airport for departure."}]'),

('Goa Beach Paradise', 'goa-beach-paradise', 'Unwind on golden beaches, explore Portuguese heritage, and experience the vibrant nightlife of India''s favorite beach destination.', 'domestic', 'beach', 'North & South Goa', 'Goa', 4, 3, 18999.00, 15999.00, ARRAY['Beach resort accommodation', 'Daily breakfast', 'Airport transfers', 'North Goa sightseeing', 'South Goa beach tour', 'Cruise with dinner'], ARRAY['Flights', 'Water sports', 'Personal expenses', 'Lunch and dinner'], ARRAY['Sunset cruise on Mandovi River', 'Visit to Basilica of Bom Jesus', 'Water sports at Baga Beach', 'Explore colorful Latin Quarter'], 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', true, 4.7, 312, '[{"day": 1, "title": "Arrival in Goa", "description": "Arrive at Goa airport, transfer to beach resort. Evening free for beach activities."}, {"day": 2, "title": "North Goa Tour", "description": "Visit Fort Aguada, Calangute Beach, Baga Beach. Evening sunset cruise with dinner."}, {"day": 3, "title": "South Goa Tour", "description": "Explore Old Goa churches, Palolem Beach, and Colva Beach. Visit spice plantation."}, {"day": 4, "title": "Departure", "description": "Morning leisure at beach. Transfer to airport for departure."}]'),

('Kashmir Valley Dream', 'kashmir-valley-dream', 'Experience paradise on Earth with stunning valleys, serene lakes, and snow-capped mountains in this unforgettable Kashmir tour.', 'domestic', 'hill_station', 'Srinagar - Pahalgam - Gulmarg', 'Jammu & Kashmir', 7, 6, 35999.00, 32999.00, ARRAY['Deluxe houseboat stay', '4-star hotel accommodation', 'All meals included', 'Shikara ride', 'Gondola ride', 'AC transportation', 'Local sightseeing'], ARRAY['Flights', 'Pony rides', 'Personal expenses', 'Adventure activities'], ARRAY['Stay in traditional Kashmiri houseboat', 'Gondola ride at Gulmarg', 'Shikara ride on Dal Lake', 'Visit to Mughal Gardens'], 'https://images.unsplash.com/photo-1597074866923-dc0589150358?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', true, 4.9, 156, '[{"day": 1, "title": "Arrival in Srinagar", "description": "Arrive at Srinagar airport. Transfer to houseboat on Dal Lake. Evening Shikara ride."}, {"day": 2, "title": "Srinagar Local", "description": "Visit Mughal Gardens - Nishat Bagh, Shalimar Bagh, and Chashme Shahi. Shankaracharya Temple."}, {"day": 3, "title": "Srinagar to Gulmarg", "description": "Drive to Gulmarg. Enjoy Gondola ride to Kongdoori and Apharwat Peak."}, {"day": 4, "title": "Gulmarg to Pahalgam", "description": "Drive to Pahalgam via Saffron fields. Evening walk along Lidder River."}, {"day": 5, "title": "Pahalgam Exploration", "description": "Visit Betaab Valley, Chandanwari, and Aru Valley. Enjoy pony ride (optional)."}, {"day": 6, "title": "Pahalgam to Srinagar", "description": "Return to Srinagar. Shopping at local markets and leisure time."}, {"day": 7, "title": "Departure", "description": "Transfer to Srinagar airport for departure."}]'),

('Rajasthan Royal Heritage', 'rajasthan-royal-heritage', 'Step into the land of kings with this royal journey through Rajasthan''s magnificent forts, palaces, and golden deserts.', 'domestic', 'heritage', 'Jaipur - Udaipur - Jodhpur - Jaisalmer', 'Rajasthan', 8, 7, 42999.00, 38999.00, ARRAY['Heritage hotel accommodation', 'Daily breakfast and dinner', 'AC transportation', 'English-speaking guide', 'Camel safari', 'Desert camping', 'Monument fees'], ARRAY['Flights', 'Personal expenses', 'Tips', 'Lunch'], ARRAY['Stay in heritage palace hotels', 'Camel safari in Thar Desert', 'Boat ride on Lake Pichola', 'Explore Mehrangarh Fort'], 'https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', true, 4.8, 198, '[{"day": 1, "title": "Arrival in Jaipur", "description": "Arrive in Jaipur, the Pink City. Transfer to heritage hotel. Evening at leisure."}, {"day": 2, "title": "Jaipur Sightseeing", "description": "Visit Amber Fort, City Palace, Hawa Mahal, and Jantar Mantar."}, {"day": 3, "title": "Jaipur to Jodhpur", "description": "Drive to Jodhpur. Evening visit to Mehrangarh Fort for sunset views."}, {"day": 4, "title": "Jodhpur to Jaisalmer", "description": "Visit Mehrangarh Fort and Jaswant Thada. Drive to Jaisalmer."}, {"day": 5, "title": "Jaisalmer Exploration", "description": "Visit Jaisalmer Fort, Patwon Ki Haveli. Evening camel safari and desert camping."}, {"day": 6, "title": "Jaisalmer to Udaipur", "description": "Drive to Udaipur, the City of Lakes. Evening boat ride on Lake Pichola."}, {"day": 7, "title": "Udaipur Sightseeing", "description": "Visit City Palace, Jagdish Temple, and Saheliyon Ki Bari."}, {"day": 8, "title": "Departure", "description": "Transfer to Udaipur airport for departure."}]'),

('Andaman Islands Explorer', 'andaman-islands-explorer', 'Discover pristine beaches, crystal-clear waters, and rich marine life in this tropical paradise adventure.', 'domestic', 'adventure', 'Port Blair - Havelock - Neil Island', 'Andaman & Nicobar', 6, 5, 38999.00, 34999.00, ARRAY['Resort accommodation', 'Daily breakfast', 'Ferry transfers', 'Snorkeling equipment', 'Glass bottom boat ride', 'Airport transfers', 'Sightseeing'], ARRAY['Flights', 'Scuba diving', 'Water sports', 'Personal expenses'], ARRAY['Snorkeling at Elephant Beach', 'Visit Cellular Jail', 'Sunrise at Radhanagar Beach', 'Glass bottom boat experience'], 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', true, 4.9, 134, '[{"day": 1, "title": "Arrival in Port Blair", "description": "Arrive at Port Blair airport. Visit Cellular Jail and attend Light & Sound show."}, {"day": 2, "title": "Port Blair to Havelock", "description": "Ferry to Havelock Island. Visit Radhanagar Beach (Asia best beach). Sunset views."}, {"day": 3, "title": "Havelock Island", "description": "Visit Elephant Beach for snorkeling and water sports. Kayaking in mangroves."}, {"day": 4, "title": "Havelock to Neil Island", "description": "Ferry to Neil Island. Visit Bharatpur Beach and Natural Bridge."}, {"day": 5, "title": "Neil to Port Blair", "description": "Return to Port Blair. Visit Ross Island and North Bay for coral viewing."}, {"day": 6, "title": "Departure", "description": "Morning at leisure. Transfer to airport for departure."}]'),

('Ladakh Adventure Expedition', 'ladakh-adventure-expedition', 'Conquer the roof of the world with this thrilling adventure through high-altitude passes, ancient monasteries, and stunning landscapes.', 'domestic', 'adventure', 'Leh - Nubra - Pangong', 'Ladakh', 7, 6, 45999.00, 41999.00, ARRAY['Hotel and camp accommodation', 'All meals included', 'Oxygen cylinders', '4x4 vehicle', 'Inner line permits', 'English-speaking guide'], ARRAY['Flights', 'Personal expenses', 'Bike rental', 'Tips'], ARRAY['Drive through Khardung La Pass', 'Camp at Pangong Lake', 'Visit ancient monasteries', 'Double hump camel ride'], 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', false, 4.8, 112, '[{"day": 1, "title": "Arrival in Leh", "description": "Arrive at Leh airport. Complete rest for acclimatization. Evening walk to Leh Market."}, {"day": 2, "title": "Leh Local Sightseeing", "description": "Visit Shanti Stupa, Leh Palace, and Thiksey Monastery. Continue acclimatization."}, {"day": 3, "title": "Leh to Nubra Valley", "description": "Drive to Nubra via Khardung La (18,380 ft). Visit Diskit Monastery. Camel ride at Hunder."}, {"day": 4, "title": "Nubra to Pangong Lake", "description": "Drive to Pangong Lake via Shyok route. Overnight camping by the lake."}, {"day": 5, "title": "Pangong to Leh", "description": "Sunrise at Pangong. Return to Leh via Chang La Pass. Visit Hemis Monastery."}, {"day": 6, "title": "Leh Exploration", "description": "Visit magnetic hill, Gurudwara Pathar Sahib, and confluence of Indus and Zanskar rivers."}, {"day": 7, "title": "Departure", "description": "Transfer to Leh airport for departure."}]'),

('Himachal Hill Retreat', 'himachal-hill-retreat', 'Escape to the serene hills of Himachal with scenic valleys, colonial charm, and breathtaking mountain views.', 'domestic', 'hill_station', 'Shimla - Manali - Dharamshala', 'Himachal Pradesh', 8, 7, 32999.00, 28999.00, ARRAY['3-star hotel accommodation', 'Daily breakfast', 'AC transportation', 'Toy train ride', 'Solang Valley activities', 'Sightseeing'], ARRAY['Flights', 'Adventure activities', 'Personal expenses', 'Lunch and dinner'], ARRAY['Toy train ride to Shimla', 'Rohtang Pass excursion', 'Visit Dalai Lama temple', 'Paragliding at Solang Valley'], 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', false, 4.7, 187, '[{"day": 1, "title": "Arrival in Delhi", "description": "Arrive in Delhi. Overnight drive or train to Shimla."}, {"day": 2, "title": "Shimla", "description": "Explore Mall Road, Ridge, and Christ Church. Toy train experience."}, {"day": 3, "title": "Shimla to Manali", "description": "Scenic drive to Manali via Kullu Valley. Visit Vaishno Devi Temple."}, {"day": 4, "title": "Manali Local", "description": "Visit Hadimba Temple, Manu Temple, and Vashisht Hot Springs."}, {"day": 5, "title": "Solang Valley", "description": "Day excursion to Solang Valley. Adventure activities - paragliding, zorbing."}, {"day": 6, "title": "Manali to Dharamshala", "description": "Drive to Dharamshala, seat of Dalai Lama."}, {"day": 7, "title": "Dharamshala - McLeodganj", "description": "Visit Dalai Lama Temple, Bhagsu Waterfall, and Tibetan markets."}, {"day": 8, "title": "Departure", "description": "Drive to Delhi or Dharamshala airport for departure."}]');