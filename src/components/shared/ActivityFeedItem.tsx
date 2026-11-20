import { Award, BookOpen, CircleCheck, Flame, Target, Timer, Trophy } from 'lucide-react'
import type { ActivityItem, Profile } from '@/types/domain'

const ICONS: Record<string, typeof Target> = {
  topic_completed: BookOpen,
  problem_solved: Target,
  week_milestone: Trophy,
  month_milestone: Award,
  streak_milestone: Flame,
  achievement: Award,
  study_session: Timer,
}

export function ActivityFeedItem({ item, author }: { item: ActivityItem; author?: Profile }) {
  const Icon = ICONS[item.activity_type] ?? CircleCheck
  return (
    <div className="flex gap-3 border-b border-line/60 py-3 last:border-0">
      {author?.avatar_url ? (
        <img src={author.avatar_url} alt="" className="h-7 w-7 shrink-0 rounded-full border border-line object-cover" />
      ) : (
        <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line bg-raised text-[10px] font-semibold">
          {(author?.display_name || '?').slice(0, 2).toUpperCase()}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-xs">
          <span className="font-medium">{author?.display_name ?? 'A learner'}</span>{' '}
          <span className="text-muted">{item.title.toLowerCase()}</span>
          {item.detail && <span className="text-fg"> — {item.detail}</span>}
        </p>
        <p className="mt-1 text-[10px] text-faint">{new Date(item.created_at).toLocaleString()}</p>
      </div>
      <Icon size={14} className="mt-1 shrink-0 text-faint" />
    </div>
  )
}
