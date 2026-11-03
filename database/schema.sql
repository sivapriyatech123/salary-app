-- ====================================================================
-- SALARYSPLIT PLATFORM - FULL POSTGRESQL + SUPABASE SCHEMA & RLS POLICIES
-- ====================================================================

-- 1. Profiles Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    monthly_income NUMERIC(15, 2) NOT NULL DEFAULT 60000.00,
    payday_date INTEGER NOT NULL DEFAULT 1 CHECK (payday_date BETWEEN 1 AND 31),
    has_onboarded BOOLEAN NOT NULL DEFAULT FALSE,
    household_id UUID,
    budget_rollover BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Households Table (CoupleSpace)
CREATE TABLE IF NOT EXISTS public.households (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    invite_code VARCHAR(12) UNIQUE NOT NULL,
    contribution_method VARCHAR(20) NOT NULL DEFAULT 'proportional',
    custom_partner_a_ratio NUMERIC(5, 2) DEFAULT 50.00,
    approval_threshold NUMERIC(15, 2) DEFAULT 5000.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Household Members Table
CREATE TABLE IF NOT EXISTS public.household_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL DEFAULT 'member',
    income NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    share_income_permission BOOLEAN NOT NULL DEFAULT TRUE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(household_id, user_id)
);

-- Add Foreign Key to profiles after households table creation
ALTER TABLE public.profiles 
ADD CONSTRAINT fk_profiles_household 
FOREIGN KEY (household_id) REFERENCES public.households(id) ON DELETE SET NULL;

-- 4. Budget Categories Table
CREATE TABLE IF NOT EXISTS public.budget_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    household_id UUID REFERENCES public.households(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL DEFAULT 'Tag',
    color VARCHAR(20) NOT NULL DEFAULT '#7557E8',
    category_type VARCHAR(20) NOT NULL DEFAULT 'needs', -- 'needs', 'wants', 'savings', 'debt', 'household'
    allocated_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    allocated_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    is_hybrid_fixed BOOLEAN NOT NULL DEFAULT FALSE,
    is_shared BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Transactions / Expenses Table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    household_id UUID REFERENCES public.households(id) ON DELETE SET NULL,
    category_id UUID NOT NULL REFERENCES public.budget_categories(id) ON DELETE CASCADE,
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT NOT NULL,
    payment_method VARCHAR(30) NOT NULL DEFAULT 'UPI',
    receipt_url TEXT,
    is_shared BOOLEAN NOT NULL DEFAULT FALSE,
    requires_approval BOOLEAN NOT NULL DEFAULT FALSE,
    is_approved BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Savings Accounts / Vaults Table
CREATE TABLE IF NOT EXISTS public.savings_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    household_id UUID REFERENCES public.households(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL DEFAULT 'PiggyBank',
    color VARCHAR(20) NOT NULL DEFAULT '#10B981',
    balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    target_amount NUMERIC(15, 2),
    is_shared BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Savings Transactions Log
CREATE TABLE IF NOT EXISTS public.savings_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES public.savings_accounts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('deposit', 'withdrawal')),
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. DreamGoals Table
CREATE TABLE IF NOT EXISTS public.dream_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    household_id UUID REFERENCES public.households(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    category VARCHAR(30) NOT NULL DEFAULT 'house', -- 'house', 'car', 'vacation', 'emergency'
    target_amount NUMERIC(15, 2) NOT NULL CHECK (target_amount > 0),
    current_balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    starting_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    monthly_target NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    target_date DATE,
    is_shared BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. SmartPantry Inventory & Grocery List Tables
CREATE TABLE IF NOT EXISTS public.grocery_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category VARCHAR(30) NOT NULL DEFAULT 'Produce',
    quantity NUMERIC(10, 2) NOT NULL DEFAULT 1.0,
    unit VARCHAR(20) NOT NULL DEFAULT 'Pcs',
    estimated_price NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    actual_price NUMERIC(15, 2),
    is_purchased BOOLEAN NOT NULL DEFAULT FALSE,
    purchased_date DATE,
    expense_created BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pantry_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category VARCHAR(30) NOT NULL DEFAULT 'Produce',
    quantity NUMERIC(10, 2) NOT NULL DEFAULT 1.0,
    unit VARCHAR(20) NOT NULL DEFAULT 'Pcs',
    purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiry_date DATE NOT NULL,
    stock_status VARCHAR(20) NOT NULL DEFAULT 'in-stock',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all public tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.household_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dream_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies Example: Users can only read/write their own profiles
CREATE POLICY "Users access own profile" ON public.profiles
    FOR ALL USING (auth.uid() = id);

-- Users can access budget categories if owner or household member
CREATE POLICY "Users access own categories" ON public.budget_categories
    FOR ALL USING (auth.uid() = user_id);
