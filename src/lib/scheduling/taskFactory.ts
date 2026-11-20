import type { ScheduledDay, UserTask } from '@/types/domain'

export function buildTasksForDay(userId: string, day: ScheduledDay, existing: UserTask[]): UserTask[] {
  const existingKeys = new Set(
    existing.map((task) => `${task.activity_type}:${task.topic_id ?? ''}:${task.title}`),
  )
  return day.activities
    .filter((activity) => !existingKeys.has(`${activity.activityType}:${activity.topicId ?? ''}:${activity.title}`))
    .map((activity) => ({
      id: crypto.randomUUID(),
      user_id: userId,
      plan_date: day.date,
      original_date: day.date,
      topic_id: activity.topicId,
      activity_type: activity.activityType,
      title: activity.title,
      duration_minutes: activity.durationMinutes,
      is_custom: false,
      status: 'pending',
      completed_at: null,
      created_at: new Date().toISOString(),
    }))
}
