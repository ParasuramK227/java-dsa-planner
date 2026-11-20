import { addDays, daysBetween, formatDate, weekdayIndex } from '@/lib/dates'
import type { StreakRecord } from '@/types/domain'

interface Props {
  records: StreakRecord[]
  startDate: string
  endDate: string
  goalMinutes?: number
  weeks?: number
}

const SHADES = ['bg-raised', 'bg-[#404040]', 'bg-[#737373]', 'bg-[#A3A3A3]', 'bg-fg']

export function ActivityCalendar({ records, startDate, endDate, goalMinutes = 120, weeks = 26 }: Props) {
  const end = endDate < startDate ? startDate : endDate
  const span = Math.min(daysBetween(startDate, end) + 1, weeks * 7)
  const first = addDays(end, -(span - 1))
  const startOffset = weekdayIndex(first)
  const byDate = new Map(records.map((record) => [record.activity_date, record]))

  const cells: (StreakRecord | null | undefined)[] = [
    ...Array.from({ length: startOffset }, () => undefined),
    ...Array.from({ length: span }, (_, i) => byDate.get(addDays(first, i))),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto pb-2">
        <div className="grid shrink-0 grid-rows-7 gap-1 pr-1 pt-[18px] text-[9px] text-faint">
          {['Mon', '', 'Wed', '', 'Fri', '', ''].map((label, i) => (
            <span key={i} className="h-2.5 leading-2.5">{label}</span>
          ))}
        </div>
        {Array.from({ length: Math.ceil(cells.length / 7) }, (_, column) => (
          <div key={column} className="grid grid-rows-7 gap-1">
            {cells.slice(column * 7, column * 7 + 7).map((record, row) => {
              if (record === undefined) return <span key={row} className="h-2.5 w-2.5" />
              if (record === null) return <span key={row} className="h-2.5 w-2.5 rounded-[2px] border border-line/40" />
              const ratio = record.study_minutes / Math.max(1, goalMinutes)
              const level = record.active_day ? Math.min(4, 2 + Math.floor(ratio)) : ratio > 0 ? 1 : 0
              const label = `${formatDate(record.activity_date, 'UTC')} · ${record.study_minutes} min${record.active_day ? ' · active' : ''}`
              return (
                <span
                  key={row}
                  title={label}
                  className={`h-2.5 w-2.5 rounded-[2px] ${SHADES[level]}`}
                />
              )
            })}
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-faint">
        <span>Less</span>
        {SHADES.map((shade) => (
          <span key={shade} className={`h-2.5 w-2.5 rounded-[2px] ${shade}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}
