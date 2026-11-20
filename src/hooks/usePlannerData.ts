import { useQueries, useQuery } from '@tanstack/react-query'
import { useAuth } from '@/app/auth-context'
import { getPlannerConfig, getProfiles } from '@/lib/db/profiles'
import { getRoadmapTopics, getRoadmapWeeks, getTopicProgress } from '@/lib/db/curriculum'
import { getTasks, getCompletions, getDailyPlans } from '@/lib/db/planner'
import { getProblems, getProblemDetails } from '@/lib/db/problems'
import { getSessions, getSessionDetails } from '@/lib/db/sessions'
import { getStreakRecords } from '@/lib/db/streaks'
import { getAchievements, getUserAchievements, getXpTransactions, getChallenges, getContributions, getActivityFeed, getNotifications, getWeeklyReviews, getNotes } from '@/lib/db/shared'
import { generateSchedule } from '@/lib/scheduling'
import type { ScheduleWeek, ScheduledDay } from '@/types/domain'

export const keys = {
  config: ['planner-config'] as const,
  profiles: ['profiles'] as const,
  weeks: ['roadmap-weeks'] as const,
  topics: ['roadmap-topics'] as const,
  progress: (userId?: string) => ['topic-progress', userId] as const,
  tasks: (userId?: string) => ['tasks', userId] as const,
  completions: (userId?: string) => ['completions', userId] as const,
  plans: (userId?: string) => ['daily-plans', userId] as const,
  problems: (userId?: string) => ['problems', userId] as const,
  sessions: (userId?: string) => ['sessions', userId] as const,
  streaks: (userId?: string) => ['streaks', userId] as const,
  xp: (userId?: string) => ['xp', userId] as const,
  myAchievements: (userId?: string) => ['my-achievements', userId] as const,
  achievements: ['achievements'] as const,
  challenges: ['challenges'] as const,
  contributions: ['contributions'] as const,
  activity: ['activity'] as const,
  notifications: (userId?: string) => ['notifications', userId] as const,
  reviews: (userId?: string) => ['reviews', userId] as const,
  notes: (userId?: string) => ['notes', userId] as const,
}

export function useCurriculum() {
  const weeks = useQuery({ queryKey: keys.weeks, queryFn: getRoadmapWeeks })
  const topics = useQuery({ queryKey: keys.topics, queryFn: getRoadmapTopics })
  const config = useQuery({ queryKey: keys.config, queryFn: getPlannerConfig })
  return { weeks, topics, config }
}

export function useProfiles() {
  return useQuery({ queryKey: keys.profiles, queryFn: getProfiles })
}

export function useSchedule() {
  const { profile } = useAuth()
  const { weeks, topics, config } = useCurriculum()

  const query = useQuery({
    queryKey: ['schedule', config.data?.roadmap_start_date, config.data?.target_end_date, profile?.study_days?.join(''), profile?.rest_day],
    enabled: Boolean(profile && weeks.data && topics.data && config.data),
    queryFn: (): { weeks: ScheduleWeek[]; days: ScheduledDay[] } => {
      const startDate = config.data!.roadmap_start_date
      const endDate = config.data!.target_end_date
      return generateSchedule({
        startDate,
        endDate,
        studyDays: profile!.study_days,
        restDay: profile!.rest_day,
        weeks: weeks.data!,
        topics: topics.data!,
      })
    },
  })
  return { schedule: { ...query, weeks, topics }, config, weeks, topics }
}

export function useMyData() {
  const { user } = useAuth()
  const id = user?.id
  const enabled = Boolean(id)

  const tasks = useQuery({ queryKey: keys.tasks(id), queryFn: () => getTasks(id!), enabled })
  const progress = useQuery({ queryKey: keys.progress(id), queryFn: () => getTopicProgress(id!), enabled })
  const completions = useQuery({ queryKey: keys.completions(id), queryFn: () => getCompletions(id!), enabled })
  const plans = useQuery({ queryKey: keys.plans(id), queryFn: () => getDailyPlans(id!), enabled })
  const problems = useQuery({ queryKey: keys.problems(id), queryFn: () => getProblems(id!), enabled })
  const problemDetails = useQuery({
    queryKey: ['problem-details', id],
    queryFn: () => getProblemDetails(id!),
    enabled,
  })
  const sessions = useQuery({ queryKey: keys.sessions(id), queryFn: () => getSessions(id!), enabled })
  const sessionDetails = useQuery({
    queryKey: ['session-details', id],
    queryFn: () => getSessionDetails(id!),
    enabled,
  })
  const streaks = useQuery({ queryKey: keys.streaks(id), queryFn: () => getStreakRecords(id!), enabled })
  const xp = useQuery({ queryKey: keys.xp(id), queryFn: () => getXpTransactions(id!), enabled })
  const myAchievements = useQuery({
    queryKey: keys.myAchievements(id),
    queryFn: () => getUserAchievements(id!),
    enabled,
  })
  const achievements = useQuery({ queryKey: keys.achievements, queryFn: getAchievements })
  const challenges = useQuery({ queryKey: keys.challenges, queryFn: getChallenges })
  const contributions = useQuery({ queryKey: keys.contributions, queryFn: getContributions })
  const activity = useQuery({ queryKey: keys.activity, queryFn: () => getActivityFeed(60) })
  const notifications = useQuery({
    queryKey: keys.notifications(id),
    queryFn: () => getNotifications(id!),
    enabled,
  })
  const reviews = useQuery({ queryKey: keys.reviews(id), queryFn: () => getWeeklyReviews(id!), enabled })
  const notes = useQuery({ queryKey: keys.notes(id), queryFn: () => getNotes(id!), enabled })

  return {
    tasks, progress, completions, plans, problems, problemDetails, sessions, sessionDetails, streaks,
    xp, myAchievements, achievements, challenges, contributions, activity, notifications, reviews, notes,
  }
}

export function useSharedProgress() {
  const { profile } = useAuth()
  const isCore = profile?.role === 'core'
  const progress = useQuery({
    queryKey: keys.progress(profile?.id),
    queryFn: () => getTopicProgress(profile!.id),
    enabled: Boolean(profile),
  })
  return { progress, isCore }
}

export function useSharedProgressMap() {
  const profiles = useProfiles()
  const core = (profiles.data ?? []).filter((item) => item.role === 'core')
  const members = profiles.data ?? []
  const results = useQueries({
    queries: members.map((person) => ({
      queryKey: keys.progress(person.id),
      queryFn: () => getTopicProgress(person.id),
    })),
  })
  const byUser = new Map<string, Awaited<ReturnType<typeof getTopicProgress>>>()
  members.forEach((person, index) => byUser.set(person.id, results[index]?.data ?? []))
  return { core, members, byUser }
}
