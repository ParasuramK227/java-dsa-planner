import { supabase } from '@/lib/supabase/client'
import { unwrapList } from '@/lib/db/helpers'
import type { Problem, ProblemDetails } from '@/types/domain'

export async function getProblems(userId: string): Promise<Problem[]> {
  return unwrapList(await supabase.from('problems').select('*').eq('user_id', userId).order('created_at', { ascending: false }))
}

export async function saveProblem(userId: string, problem: Partial<Problem> & { name: string }) {
  const payload = { ...problem, user_id: userId, updated_at: new Date().toISOString() }
  const { data, error } = await supabase
    .from('problems')
    .upsert({ ...payload, id: problem.id || undefined })
    .select('*')
    .single()
  if (error) throw new Error(error.message)
  return data as Problem
}

export async function deleteProblem(userId: string, problemId: string) {
  const { error } = await supabase.from('problems').delete().eq('id', problemId).eq('user_id', userId)
  if (error) throw new Error(error.message)
}

export async function getProblemDetails(userId: string): Promise<ProblemDetails[]> {
  return unwrapList(await supabase.from('problem_details').select('*').eq('user_id', userId))
}

export async function saveProblemDetails(userId: string, problemId: string, patch: Partial<ProblemDetails>) {
  const { error } = await supabase.from('problem_details').upsert({
    problem_id: problemId,
    user_id: userId,
    updated_at: new Date().toISOString(),
    ...patch,
  })
  if (error) throw new Error(error.message)
}
