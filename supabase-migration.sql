-- =====================================================
-- WESDIVA SUPABASE SCHEMA
-- Application-Compatible Schema
-- Fresh Database
-- =====================================================

-- -----------------------------
-- Drop Existing Tables
-- -----------------------------

DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.addresses CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;

-- =====================================================
-- PRODUCTS
-- =====================================================

CREATE TABLE public.products (

    id TEXT PRIMARY KEY,

    name TEXT NOT NULL,

    description TEXT,

    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),

    category TEXT NOT NULL,

    subcategory TEXT,

    image TEXT,

    brand TEXT,

    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_category
ON public.products(category);

CREATE INDEX idx_products_subcategory
ON public.products(subcategory);

CREATE INDEX idx_products_brand
ON public.products(brand);

CREATE INDEX idx_products_active
ON public.products(active);

CREATE INDEX idx_products_price
ON public.products(price);

-- =====================================================
-- PROFILES
-- =====================================================

CREATE TABLE public.profiles (

    id UUID PRIMARY KEY
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    email TEXT UNIQUE NOT NULL,

    full_name TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_email
ON public.profiles(email);

-- =====================================================
-- ORDERS
-- =====================================================

CREATE TABLE public.orders (

    order_id TEXT PRIMARY KEY,

    user_id UUID
        REFERENCES public.profiles(id)
        ON DELETE SET NULL,

    amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),

    name TEXT NOT NULL,

    email TEXT NOT NULL,

    phone TEXT,

    payment_method TEXT NOT NULL DEFAULT 'ONLINE'
        CHECK (
            payment_method IN (
                'ONLINE',
                'COD'
            )
        ),

    status TEXT NOT NULL DEFAULT 'PENDING'
        CHECK (
            status IN (
                'PENDING',
                'PROCESSING',
                'SHIPPED',
                'DELIVERED',
                'CANCELLED',
                'FAILED'
            )
        ),

    gateway_response JSONB,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user
ON public.orders(user_id);

CREATE INDEX idx_orders_status
ON public.orders(status);

CREATE INDEX idx_orders_email
ON public.orders(email);

CREATE INDEX idx_orders_created
ON public.orders(created_at DESC);

-- =====================================================
-- ADDRESSES
-- =====================================================

CREATE TABLE public.addresses (

    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id UUID NOT NULL
        REFERENCES public.profiles(id)
        ON DELETE CASCADE,

    address_line1 TEXT NOT NULL,

    address_line2 TEXT,

    city TEXT NOT NULL,

    state TEXT,

    postal_code TEXT,

    country TEXT NOT NULL DEFAULT 'India',

    is_default BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_addresses_user
ON public.addresses(user_id);

CREATE UNIQUE INDEX idx_default_address
ON public.addresses(user_id)
WHERE is_default = TRUE;

-- =====================================================
-- PAYMENTS
-- =====================================================

CREATE TABLE public.payments (

    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    order_id TEXT NOT NULL
        REFERENCES public.orders(order_id)
        ON DELETE CASCADE,

    amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),

    status TEXT NOT NULL DEFAULT 'PENDING'
        CHECK (
            status IN (
                'PENDING',
                'SUCCESS',
                'FAILED',
                'REFUNDED'
            )
        ),

    gateway_response JSONB,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_order
ON public.payments(order_id);

CREATE INDEX idx_payments_status
ON public.payments(status);

-- =====================================================
-- UPDATED_AT TRIGGER
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_products_updated
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_profiles_updated
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_orders_updated
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_addresses_updated
BEFORE UPDATE ON public.addresses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_payments_updated
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY products_dev
ON public.products
FOR ALL
USING (TRUE)
WITH CHECK (TRUE);

CREATE POLICY profiles_dev
ON public.profiles
FOR ALL
USING (TRUE)
WITH CHECK (TRUE);

CREATE POLICY orders_dev
ON public.orders
FOR ALL
USING (TRUE)
WITH CHECK (TRUE);

CREATE POLICY addresses_dev
ON public.addresses
FOR ALL
USING (TRUE)
WITH CHECK (TRUE);

CREATE POLICY payments_dev
ON public.payments
FOR ALL
USING (TRUE)
WITH CHECK (TRUE);

-- =====================================================
-- VERIFY
-- =====================================================

SELECT table_name
FROM information_schema.tables
WHERE table_schema='public'
ORDER BY table_name;

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema='public'
AND table_name='products'
ORDER BY ordinal_position;