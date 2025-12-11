import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables');
}

const fallbackUrl = 'https://placeholder.supabase.co';
const fallbackKey = 'placeholder';

export const supabase = createClient(
    supabaseUrl || fallbackUrl,
    supabaseAnonKey || fallbackKey
);
