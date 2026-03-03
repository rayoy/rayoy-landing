-- Agentic Push System Database Schema (Phase 4)
-- Please run this script in your Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS public.agentic_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    insight_type TEXT DEFAULT 'daily',    -- e.g., 'daily', 'transit', 'monthly'
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,                      -- optional link to specific feature
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Realtime notifications could be enabled here if we use Supabase subscriptions,
-- but for MVP, standard polling or page-load fetch in the dashboard is fine.
