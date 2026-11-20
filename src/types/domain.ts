export type UserRole = 'core' | 'member'

export type TopicStatus = 'not_started' | 'in_progress' | 'completed' | 'needs_revision'
export type TaskStatus = 'pending' | 'completed'
export type ActivityType = 'concept' | 'implementation' | 'problems' | 'revision' | 'custom'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type ProblemStatus = 'not_started' | 'attempted' | 'solved' | 'needs_revision'
export type Platform = 'leetcode' | 'neetcode' | 'hackerrank' | 'custom'
export type ChallengeMetric = 'problems' | 'minutes' | 'topics' | 'medium_problems'
export type AchievementCategory = 'consistency' | 'problems' | 'learning' | 'difficulty'

export interface Profile {
  id: string
  role: UserRole
  email: string
  display_name: string
  avatar_url: string | null
  bio: string
  timezone: string
  daily_goal_minutes: number
  study_days: number[]
  rest_day: number
  roadmap_start_date: string
  target_end_date: string | null
  created_at: string
  updated_at: string
}

export interface PlannerConfig {
  id: boolean
  roadmap_start_date: string
  target_end_date: string
  updated_by: string | null
  updated_at: string
}

export interface RoadmapWeek {
  week_no: number
  month_no: number
  title: string
  milestone: string
}

export interface RelatedProblem {
  title: string
  platform: Platform
  url: string
  difficulty: Difficulty
}

export interface RoadmapTopic {
  id: string
  week_no: number
  order_index: number
  name: string
  description: string
  objectives: string[]
  subtopics: string[]
  java_requirements: string
  recommended_problems: number
  related_problems: RelatedProblem[]
}

export interface TopicProgress {
  user_id: string
  topic_id: string
  status: TopicStatus
  completed_at: string | null
  updated_at: string
}

export interface DailyPlan {
  user_id: string
  plan_date: string
  notes: string
  is_complete: boolean
}

export interface UserTask {
  id: string
  user_id: string
  plan_date: string
  original_date: string
  topic_id: string | null
  activity_type: ActivityType
  title: string
  duration_minutes: number
  is_custom: boolean
  status: TaskStatus
  completed_at: string | null
  created_at: string
}

export interface TaskCompletion {
  id: string
  user_id: string
  task_id: string
  activity_type: ActivityType
  completion_date: string
  minutes: number
  created_at: string
}

export interface Problem {
  id: string
  user_id: string
  name: string
  platform: Platform
  topic_id: string | null
  difficulty: Difficulty
  url: string | null
  status: ProblemStatus
  attempts: number
  time_minutes: number
  attempted_at: string | null
  solved_at: string | null
  created_at: string
  updated_at: string
}

export interface ProblemDetails {
  problem_id: string
  user_id: string
  approach: string
  notes: string
  updated_at: string
}

export interface StudySession {
  id: string
  user_id: string
  topic_id: string | null
  started_at: string
  ended_at: string | null
  duration_seconds: number
  is_completed: boolean
  created_at: string
}

export interface SessionDetails {
  session_id: string
  user_id: string
  notes: string
}

export interface StreakRecord {
  user_id: string
  activity_date: string
  study_minutes: number
  tasks_completed: number
  active_day: boolean
  is_rest_day: boolean
  goal_minutes_snapshot: number
  current_streak: number
  longest_streak: number
  updated_at: string
}

export interface Achievement {
  code: string
  category: AchievementCategory
  name: string
  description: string
  criteria: Record<string, number | string>
  icon: string
}

export interface UserAchievement {
  user_id: string
  achievement_code: string
  awarded_at: string
}

export interface XpTransaction {
  id: string
  user_id: string
  source_type: string
  source_id: string
  points: number
  description: string
  created_at: string
}

export interface WeeklyReview {
  user_id: string
  week_no: number
  topics_completed: number
  problems_solved: number
  study_minutes: number
  completion_pct: number
  difficult_concepts: string
  revision_topics: string
  observations: string
  is_shared: boolean
  shared_at: string | null
  created_at: string
  updated_at: string
}

export interface PersonalNote {
  id: string
  user_id: string
  entity_type: 'topic' | 'problem' | 'week' | 'general'
  entity_id: string | null
  title: string
  content: string
  created_at: string
  updated_at: string
}

export interface WeeklyChallenge {
  id: string
  week_no: number
  title: string
  description: string
  metric: ChallengeMetric
  target_value: number
  start_date: string
  end_date: string
}

export interface ChallengeContribution {
  challenge_id: string
  user_id: string
  value: number
  updated_at: string
}

export interface ActivityItem {
  id: string
  user_id: string
  activity_type: string
  topic_id: string | null
  problem_id: string | null
  title: string
  detail: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  notification_type: string
  title: string
  body: string
  is_read: boolean
  created_at: string
}

export interface ScheduleWeek {
  week_no: number
  month_no: number
  title: string
  milestone: string
  startDate: string
  endDate: string
  studyDates: string[]
  restDate: string
  revisionDates: string[]
  topics: RoadmapTopic[]
}

export interface ScheduledActivity {
  key: string
  activityType: ActivityType
  title: string
  durationMinutes: number
  topicId: string | null
}

export interface ScheduledDay {
  date: string
  week_no: number
  month_no: number
  phase: string
  isRestDay: boolean
  isRevisionDay: boolean
  topics: RoadmapTopic[]
  activities: ScheduledActivity[]
  estimatedMinutes: number
}

export interface UserStats {
  problemsSolved: number
  easy: number
  medium: number
  hard: number
  studyMinutes: number
  activeDays: number
  currentStreak: number
  longestStreak: number
  topicsCompleted: number
  xp: number
  weeklyCompletionPct: number
}
