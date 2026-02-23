import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// This allows the client to automatically share its session with the server via cookies
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);