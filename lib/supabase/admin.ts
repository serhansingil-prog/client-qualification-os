import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Bypasses Row Level Security via the service-role key. Server-only —
// never import this from a "use client" file or a Client Component.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
