import { addDays, weekdayIndex } from '@/lib/dates'
import type { StreakRecord } from '@/types/domain'

export const STREAK_MILESTONES = [3, 7, 14, 30, 50, 100] as const

export function isRestDay(date: string, restDay: number): boolean {
  return weekdayIndex(date) === restDay
}

export function isScheduledStudyDay(date: string, studyDays: number[], restDay: number): boolean {
  return !isRestDay(date, restDay) && studyDays.includes(weekdayIndex(date))
}

/**
 * Walks backwards from `date`. Rest days are skipped without breaking the run;
 * a missed or inactive scheduled study day ends it. Past snapshots are never
 * rewritten — only the derived current value changes.
 */
export function currentStreak(
  records: Pick<StreakRecord, 'activity_date' | 'active_day'>[],
  date: string,
  studyDays: number[],
  restDay: number,
  limitDays = 400,
): number {
  const byDate = new Map(records.map((record) => [record.activity_date, record.active_day]))
  let cursor = date
  let streak = 0

  for (let i = 0; i < limitDays; i += 1) {
    if (isRestDay(cursor, restDay)) {
      cursor = addDays(cursor, -1)
      continue
    }
    if (!studyDays.includes(weekdayIndex(cursor))) {
      cursor = addDays(cursor, -1)
      continue
    }
    if (byDate.get(cursor)) {
      streak += 1
      cursor = addDays(cursor, -1)
      continue
    }
    break
  }
  return streak
}

export function longestStreak(records: Pick<StreakRecord, 'longest_streak'>[]): number {
  return records.reduce((max, record) => Math.max(max, record.longest_streak ?? 0), 0)
}

export function deriveStreakSnapshot(
  records: StreakRecord[],
  date: string,
  studyDays: number[],
  restDay: number,
): { current: number; longest: number } {
  const current = currentStreak(records, date, studyDays, restDay)
  return { current, longest: Math.max(current, longestStreak(records)) }
}

export function streakMilestoneReached(previous: number, next: number): number | null {
  return STREAK_MILESTONES.find((milestone) => previous < milestone && next >= milestone) ?? null
}
