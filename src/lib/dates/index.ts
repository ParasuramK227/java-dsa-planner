import { addMonths } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'

export function toCalendarDate(instant: string | Date, timezone: string): string {
  return formatInTimeZone(new Date(instant), timezone, 'yyyy-MM-dd')
}

export function todayInTimezone(timezone: string): string {
  return toCalendarDate(new Date(), timezone)
}

function utcMs(date: string): number {
  return Date.parse(`${date}T00:00:00Z`)
}

function fromUtcMs(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10)
}

export function addCalendarMonths(date: string, months: number): string {
  const shifted = addMonths(new Date(`${date}T00:00:00Z`), months)
  return fromUtcMs(shifted.getTime())
}

export function addDays(date: string, days: number): string {
  return fromUtcMs(utcMs(date) + days * 86_400_000)
}

export function daysBetween(from: string, to: string): number {
  return Math.round((utcMs(to) - utcMs(from)) / 86_400_000)
}

export function eachDate(from: string, to: string): string[] {
  const result: string[] = []
  for (let i = 0; i <= daysBetween(from, to); i += 1) result.push(addDays(from, i))
  return result
}

export function weekdayIndex(date: string): number {
  return new Date(`${date}T00:00:00Z`).getUTCDay()
}

export function formatDate(date: string, timezone: string, style: 'short' | 'long' = 'short'): string {
  return formatInTimeZone(
    new Date(`${date}T12:00:00Z`),
    timezone,
    style === 'long' ? 'EEEE, d MMMM yyyy' : 'd MMM yyyy',
  )
}

export function formatTime(instant: string, timezone: string): string {
  return formatInTimeZone(new Date(instant), timezone, 'h:mm a')
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest ? `${hours}h ${rest}m` : `${hours}h`
}

export const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
