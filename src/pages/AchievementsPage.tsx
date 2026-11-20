import { Award, Check, Lock, Star } from 'lucide-react'
import { PageHeader } from '@/app/AppShell'
import { useAuth } from '@/app/auth-context'
import { useMyData } from '@/hooks/usePlannerData'
import { Badge, Card, EmptyState, Progress, SectionHeading } from '@/components/ui/primitives'
import { xpLevel } from '@/lib/progress'
import { formatDate } from '@/lib/dates'
import type { AchievementCategory } from '@/types/domain'

const CATEGORY_LABEL: Record<AchievementCategory, string> = {
  consistency: 'Consistency',
  problems: 'Problem solving',
  learning: 'Learning',
  difficulty: 'Difficulty',
}

export function AchievementsPage() {
  const { profile } = useAuth()
  const my = useMyData()
  const earned = new Set((my.myAchievements.data ?? []).map((item) => item.achievement_code))
  const totalXp = (my.xp.data ?? []).reduce((sum, item) => sum + item.points, 0)
  const level = xpLevel(totalXp)
  const achievements = my.achievements.data ?? []
  const grouped = (Object.keys(CATEGORY_LABEL) as AchievementCategory[]).map((category) => ({
    category,
    items: achievements.filter((item) => item.category === category),
  }))

  return (
    <div>
      <PageHeader
        eyebrow="Lightweight gamification"
        title="Achievements & XP"
        description="Recognition for consistency and real work — never a leaderboard. XP is awarded by verified events only."
      />

      <div className="mb-8 grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-faint">Current level</p>
              <p className="mt-2 text-4xl font-semibold tracking-tight">{level.level}</p>
            </div>
            <Star size={20} className="text-muted" />
          </div>
          <div className="mt-5">
            <div className="mb-2 flex justify-between text-xs text-muted">
              <span>{totalXp} XP total</span>
              <span>{level.nextThreshold} XP to next level</span>
            </div>
            <Progress value={level.progress} />
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-faint">Collection</p>
          <p className="mt-2 text-4xl font-semibold tracking-tight tabular-nums">{earned.size}<span className="text-lg text-faint">/{achievements.length}</span></p>
          <p className="mt-3 text-xs text-muted">Earned achievements</p>
        </Card>
      </div>

      <div className="space-y-8">
        {grouped.map(({ category, items }) => (
          <div key={category}>
            <SectionHeading title={CATEGORY_LABEL[category]} description={`${items.filter((item) => earned.has(item.code)).length} of ${items.length} earned`} />
            {items.length === 0 ? (
              <Card><EmptyState title="No achievements seeded" description="Run seed_gamification.sql in Supabase." /></Card>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((achievement) => {
                  const has = earned.has(achievement.code)
                  return (
                    <Card key={achievement.code} className={`relative overflow-hidden p-4 ${has ? '' : 'opacity-60'}`}>
                      <div className="flex items-start justify-between">
                        <div className={`grid h-8 w-8 place-items-center rounded-md border ${has ? 'border-fg bg-fg text-bg' : 'border-line text-muted'}`}>
                          {has ? <Check size={14} /> : <Lock size={13} />}
                        </div>
                        <Badge>{category}</Badge>
                      </div>
                      <p className="mt-4 text-xs font-semibold">{achievement.name}</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-muted">{achievement.description}</p>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10">
        <SectionHeading title="XP history" description="Derived from solved problems and completed milestones." />
        <Card className="overflow-hidden">
          {(my.xp.data ?? []).length === 0 ? (
            <EmptyState icon={<Award size={18} />} title="No XP yet" description="Solve a problem or complete a topic to earn your first XP." />
          ) : (
            <div className="divide-y divide-line/60">
              {(my.xp.data ?? []).slice().reverse().map((transaction) => (
                <div key={transaction.id} className="flex items-center gap-4 px-5 py-3 text-xs">
                  <span className="flex-1 text-muted">{transaction.description}</span>
                  <span className="text-[10px] text-faint">{formatDate(transaction.created_at.slice(0, 10), profile?.timezone ?? 'UTC')}</span>
                  <span className="w-12 text-right font-semibold tabular-nums">+{transaction.points}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
