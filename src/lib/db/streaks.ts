import { supabase } from '@/lib/supabase/client'
import { unwrapList } from '@/lib/db/helpers'
import { deriveStreakSnapshot } from '@/lib/streaks'
import { toCalendarDate, weekdayIndex } from '@/lib/dates'
import { getCompletions } from '@/lib/db/planner'
import { getSessions } from '@/lib/db/sessions'
import type { Profile, StreakRecord } from '@/types/domain'

export async function getStreakRecords(userId: string): Promise<StreakRecord[]> {
  return unwrapList(
    await supabase.from('streak_records').select('*').eq('user_id', userId).order('activity_date'),
  )
}

export interface DailyActivityInput {
  date: string
  studyMinutes: number
  tasksCompleted: number
  isRestDay: boolean
  goalMinutes: number
  studyDays: number[]
  restDay: number
}

/** Writes one immutable-per-day snapshot. Past snapshots are never recomputed. */
export async function upsertStreakDay(userId: string, input: DailyActivityInput): Promise<StreakRecord> {
  const existing = await getStreakRecords(userId)
  const activeDay = !input.isRestDay && input.studyMinutes >= input.goalMinutes
  const others = existing.filter((record) => record.activity_date !== input.date)
  const candidate: StreakRecord = {
    user_id: userId,
    activity_date: input.date,
    study_minutes: input.studyMinutes,
    tasks_completed: input.tasksCompleted,
    active_day: activeDay,
    is_rest_day: input.isRestDay,
    goal_minutes_snapshot: input.goalMinutes,
    current_streak: 0,
    longest_streak: 0,
    updated_at: new Date().toISOString(),
  }
  const snapshot = deriveStreakSnapshot(
    [...others, candidate],
    input.date,
    input.studyDays,
    input.restDay,
  )

  const { data, error } = await supabase
    .from('streak_records')
    .upsert({
      user_id: userId,
      activity_date: input.date,
      study_minutes: input.studyMinutes,
      tasks_completed: input.tasksCompleted,
      active_day: activeDay,
      is_rest_day: input.isRestDay,
      goal_minutes_snapshot: input.goalMinutes,
      current_streak: snapshot.current,
      longest_streak: snapshot.longest,
    })
    .select('*')
    .single()
  if (error) throw new Error(error.message)
  return data as StreakRecord
}

/**
 * Recomputes one day from real records only. Task completions and a stopped
 * timer can describe the same work, so the larger of the two totals is used
 * rather than double-counting.
 */
export async function syncStreakDay(userId: string, date: string, profile: Profile): Promise<StreakRecord> {
  const completions = await getCompletions(userId, date, date)
  const taskMinutes = completions.reduce((sum, item) => sum + item.minutes, 0)
  const sessions = await getSessions(userId)
  const sessionMinutes = sessions
    .filter(
      (session) =>
        session.is_completed &&
        session.ended_at &&
        toCalendarDate(session.ended_at, profile.timezone) === date,
    )
    .reduce((sum, session) => sum + Math.floor(session.duration_seconds / 60), 0)

  return upsertStreakDay(userId, {
    date,
    studyMinutes: Math.max(taskMinutes, sessionMinutes),
    tasksCompleted: completions.length,
    isRestDay: weekdayIndex(date) === profile.rest_day,
    goalMinutes: profile.daily_goal_minutes,
    studyDays: profile.study_days,
    restDay: profile.rest_day,
  })
}
