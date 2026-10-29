-- =========================================================================
-- YUKTOP: O'zbekiston Zamonaviy Yuk Tashish Tizimi — Supabase PostgreSQL Sxemasi
-- Ushbu skriptni Supabase SQL Editor oynasiga joylab, "Run" tugmasini bosing
-- =========================================================================

-- 1. PROFILLAR (Yuk beruvchi va Yuk tashuvchilar)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    active_role TEXT NOT NULL DEFAULT 'yuk_beruvchi' CHECK (active_role IN ('yuk_beruvchi', 'yuk_tashuvchi')),
    avatar_url TEXT,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    total_orders INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TRANSPORTLAR (Yuk tashuvchilar mashinalari)
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    transport_type TEXT NOT NULL,
    model TEXT NOT NULL,
    plate_number TEXT NOT NULL,
    capacity_ton NUMERIC(5, 2) NOT NULL,
    volume_m3 NUMERIC(5, 2) NOT NULL,
    current_city TEXT NOT NULL,
    current_lat NUMERIC(9, 6) NOT NULL,
    current_lng NUMERIC(9, 6) NOT NULL,
    destination_route TEXT,
    is_available BOOLEAN DEFAULT true,
    gps_tracking_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. YUKLAR (E'lon qilingan yuklar)
CREATE TABLE IF NOT EXISTS public.cargos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    owner_name TEXT NOT NULL,
    owner_phone TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    weight_kg NUMERIC(9, 2) NOT NULL,
    volume_m3 NUMERIC(7, 2) NOT NULL,
    pickup_city TEXT NOT NULL,
    pickup_district TEXT,
    pickup_address TEXT NOT NULL,
    pickup_lat NUMERIC(9, 6) NOT NULL,
    pickup_lng NUMERIC(9, 6) NOT NULL,
    delivery_city TEXT NOT NULL,
    delivery_district TEXT,
    delivery_address TEXT NOT NULL,
    delivery_lat NUMERIC(9, 6) NOT NULL,
    delivery_lng NUMERIC(9, 6) NOT NULL,
    pickup_date DATE NOT NULL,
    delivery_date DATE NOT NULL,
    price_uzs NUMERIC(12, 2) NOT NULL,
    distance_km NUMERIC(7, 2) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    special_notes TEXT,
    status TEXT NOT NULL DEFAULT 'yangi' CHECK (status IN (
        'yangi',
        'taklif_kutilmoqda',
        'kelishildi',
        'yuklashda',
        'yolda',
        'yetkazildi',
        'bekor_qilindi'
    )),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. NARX TAKLIFLARI VA SAVDOLASHUV (Bids & Counter Offers)
CREATE TABLE IF NOT EXISTS public.bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cargo_id UUID REFERENCES public.cargos(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    driver_name TEXT NOT NULL,
    driver_phone TEXT NOT NULL,
    driver_rating NUMERIC(3, 2) DEFAULT 5.0,
    vehicle_model TEXT NOT NULL,
    vehicle_plate TEXT NOT NULL,
    transport_type TEXT NOT NULL,
    vehicle_capacity_ton NUMERIC(5, 2) NOT NULL,
    offered_price_uzs NUMERIC(12, 2) NOT NULL,
    proposed_date DATE NOT NULL,
    counter_price_uzs NUMERIC(12, 2),
    counter_note TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'countered', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. KELISHILGAN BUYURTMALAR (Active & Historic Orders)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_code TEXT UNIQUE NOT NULL,
    cargo_id UUID REFERENCES public.cargos(id),
    cargo_title TEXT NOT NULL,
    category TEXT NOT NULL,
    weight_kg NUMERIC(9, 2) NOT NULL,
    volume_m3 NUMERIC(7, 2) NOT NULL,
    owner_id UUID REFERENCES public.profiles(id),
    owner_name TEXT NOT NULL,
    owner_phone TEXT NOT NULL,
    driver_id UUID REFERENCES public.profiles(id),
    driver_name TEXT NOT NULL,
    driver_phone TEXT NOT NULL,
    driver_rating NUMERIC(3, 2),
    vehicle_model TEXT NOT NULL,
    vehicle_plate TEXT NOT NULL,
    transport_type TEXT NOT NULL,
    pickup_city TEXT NOT NULL,
    pickup_address TEXT NOT NULL,
    pickup_lat NUMERIC(9, 6) NOT NULL,
    pickup_lng NUMERIC(9, 6) NOT NULL,
    delivery_city TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_lat NUMERIC(9, 6) NOT NULL,
    delivery_lng NUMERIC(9, 6) NOT NULL,
    pickup_date DATE NOT NULL,
    delivery_date DATE NOT NULL,
    agreed_price_uzs NUMERIC(12, 2) NOT NULL,
    distance_km NUMERIC(7, 2) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'kelishildi' CHECK (status IN (
        'kelishildi',
        'yuklashda',
        'yolda',
        'yetkazildi',
        'bekor_qilindi'
    )),
    carrier_gps_enabled BOOLEAN DEFAULT true,
    driver_current_lat NUMERIC(9, 6),
    driver_current_lng NUMERIC(9, 6),
    driver_speed_kmh NUMERIC(5, 2) DEFAULT 0,
    driver_location_updated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 6. REAL-TIME CHAT XABARLARI
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id),
    sender_role TEXT NOT NULL CHECK (sender_role IN ('yuk_beruvchi', 'yuk_tashuvchi')),
    sender_name TEXT NOT NULL,
    text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. BILDIRISHNOMALAR (Notifications)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'system',
    related_order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. REYTING VA SHARHLAR (Reviews)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    reviewer_name TEXT NOT NULL,
    reviewer_role TEXT NOT NULL CHECK (reviewer_role IN ('yuk_beruvchi', 'yuk_tashuvchi')),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Real-time funksiyalarni yoqish
ALTER PUBLICATION supabase_realtime ADD TABLE public.cargos;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bids;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
