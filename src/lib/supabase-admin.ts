import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from './env';

let client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!client) {
    const { url, serviceRoleKey } = getSupabaseConfig();

    client = createClient(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return client;
}
