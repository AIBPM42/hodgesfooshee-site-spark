import { createClient } from '@supabase/supabase-js';

// Lazy initialization - only create client when needed (not at build time)
let _supabaseAdmin: ReturnType<typeof createClient> | null = null;

export const supabaseAdmin = (() => {
  if (!_supabaseAdmin) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase environment variables are not configured');
    }

    _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });
  }
  return _supabaseAdmin;
})();
