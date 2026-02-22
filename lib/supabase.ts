import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

// Initialize Supabase. Note: this is a simple client for public/anon access if needed.
export const supabase = createClient(supabaseUrl, supabaseKey);

// Admin client using service role key (only use this in server-side routes)
export const supabaseAdmin = createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
);
