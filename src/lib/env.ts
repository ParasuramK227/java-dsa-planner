const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  throw new Error(
    'Missing Supabase configuration. Copy .env.example to .env and set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
  )
}

if (!/^https:\/\/[a-z0-9]+\.supabase\.co$/.test(url)) {
  throw new Error('VITE_SUPABASE_URL must be a Supabase project URL.')
}

export const env = {
  supabaseUrl: url,
  supabaseKey: key,
  projectRef: new URL(url).hostname.split('.')[0] ?? '',
  isDev: import.meta.env.DEV,
} as const
