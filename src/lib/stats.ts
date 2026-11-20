import { currentStreak, longestStreak } from '@/lib/streaks'
import { pct, problemCounts, studyMinutes, topicCompletion, taskCompletion } from '@/lib/progress'
import { addDays, todayInTimezone } from '@/lib/dates'
import type {
  Problem, Profile, StreakRecord, TopicProgress, UserStats, UserTask, XpTransaction,
} from '@/types/domain'

export function buildUserStats(input: {
  profile: Profile
  tasks: UserTask[]
  problems: Problem[]
  streaks: StreakRecord[]
  xp: XpTransaction[]
  progress: TopicProgress[]
  totalTopics: number
}): UserStats {
  const { profile, tasks, problems, streaks, xp, progress, totalTopics } = input
  const counts = problemCounts(problems)
  const today = todayInTimezone(profile.timezone)
  const weekTasks = tasks.filter((task) => task.plan_date >= addDays(today, -6) && task.plan_date <= today)
  const current = currentStreak(streaks, today, profile.study_days, profile.rest_day)

  return {
    problemsSolved: counts.solved,
    easy: counts.easy,
    medium: counts.medium,
    hard: counts.hard,
    studyMinutes: studyMinutes(streaks),
    activeDays: streaks.filter((record) => record.active_day).length,
    currentStreak: current,
    longestStreak: Math.max(longestStreak(streaks), current),
    topicsCompleted: topicCompletion(progress, totalTopics).completed,
    xp: xp.reduce((sum, item) => sum + item.points, 0),
    weeklyCompletionPct: taskCompletion(weekTasks).pct,
  }
}

export function overallCompletion(progress: TopicProgress[], totalTopics: number): number {
  return pct(progress.filter((item) => item.status === 'completed').length, totalTopics)
}
