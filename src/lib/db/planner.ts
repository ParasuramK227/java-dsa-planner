import { supabase } from '@/lib/supabase/client'
import { unwrapList } from '@/lib/db/helpers'
import { todayInTimezone } from '@/lib/dates'
import type { DailyPlan, UserTask } from '@/types/domain'

export async function getDailyPlans(userId: string, from?: string, to?: string): Promise<DailyPlan[]> {
  let query = supabase.from('daily_plans').select('*').eq('user_id', userId)
  if (from) query = query.gte('plan_date', from)
  if (to) query = query.lte('plan_date', to)
  return unwrapList(await query.order('plan_date'))
}

export async function saveDailyPlan(userId: string, date: string, patch: Partial<DailyPlan>) {
  const { error } = await supabase
    .from('daily_plans')
    .upsert({ user_id: userId, plan_date: date, ...patch })
  if (error) throw new Error(error.message)
}

export async function getTasks(userId: string, from?: string, to?: string): Promise<UserTask[]> {
  let query = supabase.from('user_tasks').select('*').eq('user_id', userId)
  if (from) query = query.gte('plan_date', from)
  if (to) query = query.lte('plan_date', to)
  return unwrapList(await query.order('plan_date').order('created_at'))
}

export async function saveTasks(tasks: UserTask[]) {
  if (!tasks.length) return
  const { error } = await supabase.from('user_tasks').upsert(
    tasks.map(({ id, ...task }) => ({ id, ...task })),
    { onConflict: 'id' },
  )
  if (error) throw new Error(error.message)
}

export async function setTaskStatus(userId: string, taskId: string, completed: boolean, timezone: string) {
  const now = new Date().toISOString()
  const { error } = await supabase
    .from('user_tasks')
    .update({ status: completed ? 'completed' : 'pending', completed_at: completed ? now : null })
    .eq('id', taskId)
    .eq('user_id', userId)
  if (error) throw new Error(error.message)

  if (completed) {
    const task = (await getTasks(userId)).find((item) => item.id === taskId)
    const { error: completionError } = await supabase.from('task_completions').upsert(
      {
        user_id: userId,
        task_id: taskId,
        activity_type: task?.activity_type ?? 'custom',
        completion_date: task?.plan_date ?? todayInTimezone(timezone),
        minutes: task?.duration_minutes ?? 0,
      },
      { onConflict: 'task_id,completion_date' },
    )
    if (completionError) throw new Error(completionError.message)
  } else {
    const { error: deleteError } = await supabase
      .from('task_completions')
      .delete()
      .eq('task_id', taskId)
      .eq('user_id', userId)
    if (deleteError) throw new Error(deleteError.message)
  }
}

export async function rescheduleTask(userId: string, taskId: string, date: string) {
  const { error } = await supabase
    .from('user_tasks')
    .update({ plan_date: date })
    .eq('id', taskId)
    .eq('user_id', userId)
  if (error) throw new Error(error.message)
}

export async function addCustomTask(userId: string, date: string, title: string, durationMinutes: number) {
  const { error } = await supabase.from('user_tasks').insert({
    user_id: userId,
    plan_date: date,
    original_date: date,
    activity_type: 'custom',
    title,
    duration_minutes: durationMinutes,
    is_custom: true,
  })
  if (error) throw new Error(error.message)
}

export async function deleteCustomTask(userId: string, taskId: string) {
  const { error } = await supabase
    .from('user_tasks')
    .delete()
    .eq('id', taskId)
    .eq('user_id', userId)
    .eq('is_custom', true)
  if (error) throw new Error(error.message)
}

export async function rescheduleAllOverdue(userId: string, targetDate: string, today: string) {
  const { error } = await supabase
    .from('user_tasks')
    .update({ plan_date: targetDate })
    .eq('user_id', userId)
    .eq('status', 'pending')
    .lt('plan_date', today)
  if (error) throw new Error(error.message)
}

export async function resetPlannerData(userId: string) {
  for (const table of ['task_completions', 'user_tasks', 'daily_plans']) {
    const { error } = await supabase.from(table).delete().eq('user_id', userId)
    if (error) throw new Error(error.message)
  }
}

export async function getCompletions(userId: string, from?: string, to?: string) {
  let query = supabase.from('task_completions').select('*').eq('user_id', userId)
  if (from) query = query.gte('completion_date', from)
  if (to) query = query.lte('completion_date', to)
  return unwrapList(await query.order('completion_date'))
}
