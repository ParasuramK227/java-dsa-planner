import type { PostgrestError } from '@supabase/supabase-js'

export function unwrap<T>(response: { data: T | null; error: PostgrestError | null }): T {
  if (response.error) throw new Error(response.error.message)
  return response.data as T
}

export function unwrapList<T>(response: { data: T[] | null; error: PostgrestError | null }): T[] {
  if (response.error) throw new Error(response.error.message)
  return response.data ?? []
}
