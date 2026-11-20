import { describe, expect, it } from 'vitest'
import { addCalendarMonths, daysBetween, weekdayIndex } from '@/lib/dates'
import { generateSchedule } from '@/lib/scheduling'
import { currentStreak } from '@/lib/streaks'
import type { RoadmapTopic, RoadmapWeek } from '@/types/domain'

const weeks: RoadmapWeek[] = Array.from({ length: 20 }, (_, i) => ({
  week_no: i + 1,
  month_no: Math.floor(i / 4) + 1,
  title: `Week ${i + 1}`,
  milestone: 'Milestone',
}))

const topics: RoadmapTopic[] = weeks.flatMap((week) =>
  Array.from({ length: 6 }, (_, i) => ({
    id: `w${week.week_no}-t${i + 1}`,
    week_no: week.week_no,
    order_index: i + 1,
    name: `Topic ${i + 1}`,
    description: '',
    objectives: [],
    subtopics: [],
    java_requirements: '',
    recommended_problems: 3,
    related_problems: [],
  })),
)

describe('calendar math', () => {
  it('clamps month-end dates', () => {
    expect(addCalendarMonths('2026-01-31', 1)).toBe('2026-02-28')
    expect(addCalendarMonths('2024-01-31', 1)).toBe('2024-02-29')
    expect(addCalendarMonths('2026-08-31', 5)).toBe('2027-01-31')
  })

  it('counts days correctly', () => {
    expect(daysBetween('2026-11-20', '2027-04-20')).toBe(151)
    expect(weekdayIndex('2026-11-20')).toBe(5)
  })
})

describe('schedule generation', () => {
  it('covers the exact window with all 20 weeks and no dates past the target', () => {
    const start = '2026-11-20'
    const end = addCalendarMonths(start, 5)
    const { weeks: generated, days } = generateSchedule({
      startDate: start,
      endDate: end,
      studyDays: [1, 2, 3, 4, 5, 6],
      restDay: 0,
      weeks,
      topics,
    })

    expect(generated).toHaveLength(20)
    expect(generated.at(-1)?.endDate).toBe(end)
    expect(days.every((day) => day.date >= start && day.date <= end)).toBe(true)
    expect(days.every((day) => day.estimatedMinutes <= 120)).toBe(true)
    expect(days.filter((day) => day.isRestDay)).toHaveLength(20)
    expect(days.flatMap((day) => day.topics)).toHaveLength(topics.length)
  })

  it('honours a custom rest day and keeps 120-minute task breakdown', () => {
    const { days } = generateSchedule({
      startDate: '2026-11-20',
      endDate: '2027-04-20',
      studyDays: [0, 1, 2, 3, 4, 5],
      restDay: 6,
      weeks,
      topics,
    })
    expect(days.filter((day) => day.isRestDay).every((day) => weekdayIndex(day.date) === 6)).toBe(true)
    const studyDay = days.find((day) => !day.isRestDay && !day.isRevisionDay)
    expect(studyDay?.activities.map((a) => a.durationMinutes)).toEqual([25, 20, 65, 10])
  })
})

describe('streaks', () => {
  const records = [
    { activity_date: '2026-11-18', active_day: true },
    { activity_date: '2026-11-19', active_day: true },
    { activity_date: '2026-11-20', active_day: true },
    { activity_date: '2026-11-21', active_day: false },
  ]

  it('breaks on a missed study day', () => {
    expect(currentStreak(records, '2026-11-20', [1, 2, 3, 4, 5, 6], 0)).toBe(3)
    expect(currentStreak(records, '2026-11-21', [1, 2, 3, 4, 5, 6], 0)).toBe(0)
  })

  it('does not break across a rest day', () => {
    const withGap = [...records, { activity_date: '2026-11-23', active_day: true }]
    expect(currentStreak(withGap, '2026-11-23', [1, 2, 3, 4, 5, 6], 0)).toBe(1)
  })
})
