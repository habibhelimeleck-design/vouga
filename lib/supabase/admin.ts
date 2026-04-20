import { createClient } from '@supabase/supabase-js'

/**
 * Client Supabase avec service role key — contourne RLS.
 * Serveur uniquement : ne jamais importer depuis 'use client' ou middleware.
 * Usage : actions admin, triggers manuels, jobs server-side.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}