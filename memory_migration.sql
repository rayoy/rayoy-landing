-- Memory System and User Profiles Database Schema (Phase 3)
-- Please run this script in your Supabase SQL Editor.

-- 1. Create user_profiles_extended table (for long-term traits & cached charts)
CREATE TABLE IF NOT EXISTS public.user_profiles_extended (
    user_id TEXT PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    bazi_chart JSONB,
    ziwei_chart JSONB,
    fusion_context TEXT,
    personality_tags TEXT[],     -- e.g., ['Pragmatic', 'Risk-Averse', 'Strategist']
    life_themes JSONB,           -- Important domains identified by AI
    preferred_engines TEXT[],    -- Preferred analysis tools
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Note: user_profiles_extended has RLS policies if needed, but since we use service role for AI, 
-- we can skip RLS for now or add it later. For standard web queries we should enable it.
-- ALTER TABLE public.user_profiles_extended ENABLE ROW LEVEL SECURITY;

-- 2. Create conversation_memory table (to store AI chat history and insights)
CREATE TABLE IF NOT EXISTS public.conversation_memory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    session_id TEXT,
    messages JSONB NOT NULL,     -- Array of chat messages
    summary TEXT,                -- AI-generated summary of the conversation
    key_insights TEXT[],         -- Specific extractions to feed back to the profile
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create prediction_tracking table (for self-evolution and accuracy tracking)
CREATE TABLE IF NOT EXISTS public.prediction_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    prediction_date DATE,
    prediction_content TEXT,
    prediction_domain TEXT,      -- e.g., 'career', 'finance', 'relationship'
    confidence_score FLOAT,
    actual_outcome TEXT,         -- Filled in by the user later
    accuracy_score FLOAT,        -- Evaluated later
    engine_sources TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger for updated_at on users_profiles_extended
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trg_user_profiles_extended_updated_at ON public.user_profiles_extended;
CREATE TRIGGER trg_user_profiles_extended_updated_at
BEFORE UPDATE ON public.user_profiles_extended
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
