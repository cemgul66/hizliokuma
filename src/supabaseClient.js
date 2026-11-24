import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://ygmcashkmytnyssuwrvx.supabase.co';

export const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_EyelsUIcjZclOVdo0HBB5g_ib-dpfoG';

export const isSupabaseConfigured =
  Boolean(supabaseAnonKey) && supabaseAnonKey !== 'BURAYA_PUBLISHABLE_KEY_GELECEK';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
