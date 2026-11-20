import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'

export const supabase = createClient(env.supabaseUrl, env.supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'java-dsa-planner-auth',
  },
  realtime: {
    params: { eventsPerSecond: 10 },
  },
})

export type SupabaseClient = typeof supabase
