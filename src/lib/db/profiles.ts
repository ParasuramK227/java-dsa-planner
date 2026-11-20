import { supabase } from '@/lib/supabase/client'
import { unwrap, unwrapList } from '@/lib/db/helpers'
import type { PlannerConfig, Profile } from '@/types/domain'

export async function getProfiles(): Promise<Profile[]> {
  return unwrapList(await supabase.from('profiles').select('*').order('role', { ascending: true }))
}

export async function updateProfile(id: string, patch: Partial<Profile>): Promise<Profile> {
  return unwrap(
    await supabase.from('profiles').update(patch).eq('id', id).select('*').single(),
  )
}

export async function getPlannerConfig(): Promise<PlannerConfig> {
  return unwrap(await supabase.from('planner_config').select('*').eq('id', true).single())
}

export async function updatePlannerConfig(
  patch: Pick<PlannerConfig, 'roadmap_start_date' | 'target_end_date'>,
  userId: string,
): Promise<PlannerConfig> {
  return unwrap(
    await supabase
      .from('planner_config')
      .update({ ...patch, updated_by: userId })
      .eq('id', true)
      .select('*')
      .single(),
  )
}
