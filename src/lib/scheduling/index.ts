import { addDays, daysBetween, weekdayIndex } from '@/lib/dates'
import type { ActivityType, RoadmapTopic, RoadmapWeek, ScheduleWeek, ScheduledActivity, ScheduledDay } from '@/types/domain'

export interface ScheduleInput {
  startDate: string
  endDate: string
  studyDays: number[]
  restDay: number
  weeks: RoadmapWeek[]
  topics: RoadmapTopic[]
  dailyMinutes?: Record<ActivityType, number>
}

const DEFAULT_MINUTES: Record<ActivityType, number> = {
  concept: 25,
  implementation: 20,
  problems: 65,
  revision: 10,
  custom: 0,
}

const ACTIVITY_TITLES: Record<Exclude<ActivityType, 'custom'>, string> = {
  concept: 'Concept learning',
  implementation: 'Java implementation',
  problems: 'Problem solving',
  revision: 'Revision and notes',
}

function chunk<T>(items: T[], count: number): T[][] {
  if (count <= 0) return items.length ? [items] : []
  const size = Math.ceil(items.length / count)
  const result: T[][] = []
  for (let i = 0; i < items.length; i += size) result.push(items.slice(i, i + size))
  while (result.length < count) result.push([])
  return result
}

function activitiesFor(topics: RoadmapTopic[], minutes: Record<ActivityType, number>, isRevision: boolean) {
  if (isRevision) return [] as ScheduledActivity[]
  const label = topics.length ? topics.map((t) => t.name).join(' + ') : 'Mixed practice'
  const types: Exclude<ActivityType, 'custom'>[] = ['concept', 'implementation', 'problems', 'revision']
  return types.map((type) => ({
    key: type,
    activityType: type,
    title: `${ACTIVITY_TITLES[type]} — ${label}`,
    durationMinutes: minutes[type],
    topicId: topics[0]?.id ?? null,
  }))
}

/**
 * Distributes 20 curriculum weeks across the exact calendar window.
 * Some weeks receive 8 days; surplus non-study days become revision days.
 * No task is ever scheduled after endDate.
 */
export function generateSchedule(input: ScheduleInput): { weeks: ScheduleWeek[]; days: ScheduledDay[] } {
  const { startDate, endDate, studyDays, restDay, weeks, topics } = input
  const minutes = { ...DEFAULT_MINUTES, ...input.dailyMinutes }
  const totalDays = daysBetween(startDate, endDate) + 1
  if (totalDays <= 0) return { weeks: [], days: [] }

  const days = new Map<string, ScheduledDay>()
  const resultWeeks: ScheduleWeek[] = []

  for (const week of weeks.slice().sort((a, b) => a.week_no - b.week_no)) {
    const from = Math.round(((week.week_no - 1) * totalDays) / 20)
    const to = Math.round((week.week_no * totalDays) / 20) - 1
    const weekStart = addDays(startDate, from)
    const weekEnd = addDays(startDate, Math.min(to, totalDays - 1))

    const weekTopics = topics
      .filter((topic) => topic.week_no === week.week_no)
      .slice()
      .sort((a, b) => a.order_index - b.order_index)

    const slotDates: string[] = []
    for (let i = 0; i <= daysBetween(weekStart, weekEnd); i += 1) slotDates.push(addDays(weekStart, i))

    let restDate = slotDates.find((date) => weekdayIndex(date) === restDay)
    if (!restDate) restDate = slotDates[slotDates.length - 1]
    const studyDates = slotDates.filter((date) => date !== restDate && studyDays.includes(weekdayIndex(date)))
    const revisionDates = slotDates.filter(
      (date) => date !== restDate && !studyDays.includes(weekdayIndex(date)),
    )
    const topicGroups = chunk(weekTopics, studyDates.length)
    const phase = monthLabel(week.month_no)

    studyDates.forEach((date, index) => {
      const dayTopics = topicGroups[index] ?? []
      days.set(date, {
        date,
        week_no: week.week_no,
        month_no: week.month_no,
        phase,
        isRestDay: false,
        isRevisionDay: false,
        topics: dayTopics,
        activities: activitiesFor(dayTopics, minutes, false),
        estimatedMinutes: dayTopics.length ? Object.values(minutes).reduce((a, b) => a + b, 0) : 0,
      })
    })

    for (const date of revisionDates) {
      days.set(date, {
        date,
        week_no: week.week_no,
        month_no: week.month_no,
        phase,
        isRestDay: false,
        isRevisionDay: true,
        topics: [],
        activities: [],
        estimatedMinutes: 0,
      })
    }

    days.set(restDate, {
      date: restDate,
      week_no: week.week_no,
      month_no: week.month_no,
      phase,
      isRestDay: true,
      isRevisionDay: false,
      topics: [],
      activities: [],
      estimatedMinutes: 0,
    })

    resultWeeks.push({
      ...week,
      startDate: weekStart,
      endDate: weekEnd,
      studyDates,
      restDate,
      revisionDates,
      topics: weekTopics,
    })
  }

  return { weeks: resultWeeks, days: Array.from(days.values()).sort((a, b) => a.date.localeCompare(b.date)) }
}

export function monthLabel(month: number): string {
  return [
    'Month 1 — Arrays & Core Problem-Solving',
    'Month 2 — Recursion & Linear Structures',
    'Month 3 — Trees & Graphs',
    'Month 4 — Advanced Algorithms',
    'Month 5 — Placement Preparation',
  ][month - 1] ?? `Month ${month}`
}

export function findCurrentWeek(weeks: ScheduleWeek[], date: string): ScheduleWeek | undefined {
  return weeks.find((week) => date >= week.startDate && date <= week.endDate)
}
