-- PDF-GPT Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Roles Enum
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'pro_user', 'free_user');

-- Subscription Status Enum
CREATE TYPE subscription_status AS ENUM ('active', 'trialing', 'past_due', 'canceled', 'none');

-- Subscription Plan Enum
CREATE TYPE subscription_plan AS ENUM ('free', 'pro_monthly', 'pro_annual');

-- Users Table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'free_user' NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE, -- Pro users can also be admins
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions Table
CREATE TABLE public.subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status subscription_status DEFAULT 'none' NOT NULL,
    plan subscription_plan DEFAULT 'free' NOT NULL,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- User Stats Table (for tracking limits)
CREATE TABLE public.user_stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    pdf_count INTEGER DEFAULT 0,
    storage_used BIGINT DEFAULT 0, -- in bytes
    monthly_uploads_used INTEGER DEFAULT 0,
    monthly_uploads_reset_at TIMESTAMP WITH TIME ZONE DEFAULT (DATE_TRUNC('month', NOW()) + INTERVAL '1 month'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- PDFs Table (user's personal PDFs)
CREATE TABLE public.pdfs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    page_count INTEGER DEFAULT 0,
    storage_path TEXT NOT NULL,
    thumbnail_url TEXT,
    is_processed BOOLEAN DEFAULT FALSE,
    summary TEXT,
    tags TEXT[] DEFAULT '{}',
    embeddings_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PDF Shop Table (PDFs managed by admins)
CREATE TABLE public.shop_pdfs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    filename TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    page_count INTEGER DEFAULT 0,
    storage_path TEXT NOT NULL,
    thumbnail_url TEXT,
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT FALSE,
    is_pro_only BOOLEAN DEFAULT FALSE,
    download_count INTEGER DEFAULT 0,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Promotions Table
CREATE TABLE public.promotions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    discount_percent INTEGER NOT NULL CHECK (discount_percent >= 0 AND discount_percent <= 100),
    code TEXT NOT NULL UNIQUE,
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    max_uses INTEGER DEFAULT NULL,
    current_uses INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Password Reset Tokens Table
CREATE TABLE public.password_reset_tokens (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_pdfs_user_id ON public.pdfs(user_id);
CREATE INDEX idx_pdfs_created_at ON public.pdfs(created_at DESC);
CREATE INDEX idx_shop_pdfs_category ON public.shop_pdfs(category);
CREATE INDEX idx_shop_pdfs_is_featured ON public.shop_pdfs(is_featured);
CREATE INDEX idx_promotions_code ON public.promotions(code);
CREATE INDEX idx_promotions_active ON public.promotions(is_active);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pdfs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_pdfs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Super admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

-- PDFs policies
CREATE POLICY "Users can view their own PDFs" ON public.pdfs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own PDFs" ON public.pdfs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own PDFs" ON public.pdfs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own PDFs" ON public.pdfs
    FOR DELETE USING (auth.uid() = user_id);

-- Shop PDFs policies (public read, admin write)
CREATE POLICY "Anyone can view shop PDFs" ON public.shop_pdfs
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage shop PDFs" ON public.shop_pdfs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND (role IN ('super_admin', 'admin') OR is_admin = true)
        )
    );

-- Promotions policies
CREATE POLICY "Anyone can view active promotions" ON public.promotions
    FOR SELECT USING (is_active = true AND valid_until > NOW());

CREATE POLICY "Admins can manage promotions" ON public.promotions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND (role IN ('super_admin', 'admin') OR is_admin = true)
        )
    );

-- Functions and Triggers

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    
    INSERT INTO public.user_stats (user_id)
    VALUES (NEW.id);
    
    INSERT INTO public.subscriptions (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers to all tables
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_pdfs_updated_at
    BEFORE UPDATE ON public.pdfs
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_shop_pdfs_updated_at
    BEFORE UPDATE ON public.shop_pdfs
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Function to reset monthly upload counts
CREATE OR REPLACE FUNCTION public.reset_monthly_uploads()
RETURNS void AS $$
BEGIN
    UPDATE public.user_stats
    SET 
        monthly_uploads_used = 0,
        monthly_uploads_reset_at = DATE_TRUNC('month', NOW()) + INTERVAL '1 month'
    WHERE monthly_uploads_reset_at <= NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
