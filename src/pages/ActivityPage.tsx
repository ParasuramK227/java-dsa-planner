import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Flame, Target, Users } from 'lucide-react'
import { PageHeader, CoreOnly } from '@/app/AppShell'
import { useAuth } from '@/app/auth-context'
import { keys, useMyData, useProfiles, useSchedule } from '@/hooks/usePlannerData'
import { ActivityCalendar } from '@/components/shared/ActivityCalendar'
import { ActivityFeedItem } from '@/components/shared/ActivityFeedItem'
import { Badge, Button, Card, EmptyState, Progress, SectionHeading } from '@/components/ui/primitives'
import { setContribution } from '@/lib/db/shared'
import { getStreakRecords } from '@/lib/db/streaks'
import { pct } from '@/lib/progress'
import { formatDate, todayInTimezone } from '@/lib/dates'
import { useQuery } from '@tanstack/react-query'
import type { ChallengeMetric } from '@/types/domain'

const METRIC_LABEL: Record<ChallengeMetric, string> = {
  problems: 'problems solved together',
  minutes: 'study minutes together',
  topics: 'topics completed together',
  medium_problems: 'medium problems together',
}

export function ActivityPage() {
  const { user, profile } = useAuth()
  const queryClient = useQueryClient()
  const my = useMyData()
  const profiles = useProfiles()
  const { schedule, config } = useSchedule()
  const core = (profiles.data ?? []).filter((item) => item.role === 'core')
  const partner = core.find((item) => item.id !== user?.id)
  const [contributionValue, setContributionValue] = useState<Record<string, string>>({})

  const partnerStreaks = useQuery({
    queryKey: ['partner-streaks', partner?.id],
    enabled: Boolean(partner),
    queryFn: () => getStreakRecords(partner!.id),
  })

  const contribute = useMutation({
    mutationFn: ({ challengeId, value }: { challengeId: string; value: number }) => setContribution(challengeId, user!.id, value),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: keys.contributions }),
  })

  const currentWeek = schedule.data?.weeks.find((week) =>
    week.startDate <= todayInTimezone(profile?.timezone ?? 'Asia/Kolkata') &&
    week.endDate >= todayInTimezone(profile?.timezone ?? 'Asia/Kolkata'),
  )
  const challenges = (my.challenges.data ?? []).filter((challenge) => challenge.week_no === (currentWeek?.week_no ?? 1))

  const combined = (challengeId: string) =>
    (my.contributions.data ?? []).filter((item) => item.challenge_id === challengeId).reduce((sum, item) => sum + item.value, 0)

  return (
    <div>
      <PageHeader
        eyebrow="Together"
        title="Shared Activity"
        description="Combined progress, weekly challenges and a feed built from real events. No rankings, no pressure."
      />

      <CoreOnly>
        <div className="mb-6">
          <SectionHeading title="Shared weekly challenge" description="One collaborative goal per week. Both contributions count equally." />
          {challenges.length === 0 ? (
            <Card><EmptyState title="No challenge for this week" description="Challenges are seeded alongside the 20-week curriculum." /></Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {challenges.map((challenge) => {
                const total = combined(challenge.id)
                const mine = (my.contributions.data ?? []).find((item) => item.challenge_id === challenge.id && item.user_id === user?.id)?.value ?? 0
                const partnerValue = total - mine
                return (
                  <Card key={challenge.id} className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{challenge.title}</p>
                        <p className="mt-1 text-xs text-muted">{challenge.description}</p>
                      </div>
                      <Badge tone={total >= challenge.target_value ? 'solid' : 'neutral'}>
                        {total >= challenge.target_value ? 'COMPLETE' : `WEEK ${challenge.week_no}`}
                      </Badge>
                    </div>
                    <div className="mt-5">
                      <div className="mb-1.5 flex justify-between text-xs"><span className="text-muted">{total} / {challenge.target_value} {METRIC_LABEL[challenge.metric]}</span><span>{pct(total, challenge.target_value)}%</span></div>
                      <Progress value={pct(total, challenge.target_value)} />
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-[11px]">
                      <span className="text-muted">You: <span className="text-fg">{mine}</span></span>
                      <span className="text-muted">Partner: <span className="text-fg">{partnerValue}</span></span>
                    </div>
                    <div className="mt-4 flex items-end gap-2">
                      <div className="flex-1">
                        <label className="text-[10px] uppercase tracking-wider text-faint">Your contribution</label>
                        <input
                          type="number"
                          min={0}
                          value={contributionValue[challenge.id] ?? String(mine)}
                          onChange={(event) => setContributionValue({ ...contributionValue, [challenge.id]: event.target.value })}
                          className="mt-1 w-full rounded-md border border-line bg-bg px-3 py-2 text-xs focus:border-fg focus:outline-none"
                        />
                      </div>
                      <Button size="sm" onClick={() => contribute.mutate({ challengeId: challenge.id, value: Number(contributionValue[challenge.id] ?? mine) })}>Update</Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        <div className="mb-6 grid gap-4 lg:grid-cols-2">
          {core.map((person) => (
            <Card key={person.id} className="p-5">
              <SectionHeading title={`${person.id === user?.id ? 'Your' : `${person.display_name}’s`} consistency`} description={`Profile for ${person.email}`} />
              <ActivityCalendar
                records={person.id === user?.id ? (my.streaks.data ?? []) : (partnerStreaks.data ?? [])}
                startDate={config.data?.roadmap_start_date ?? todayInTimezone(person.timezone)}
                endDate={todayInTimezone(person.timezone)}
                goalMinutes={person.daily_goal_minutes}
                weeks={20}
              />
            </Card>
          ))}
        </div>

        <Card className="p-5">
          <SectionHeading title="Activity feed" description="Topic completions, solved problems, milestones and achievements." />
          {(my.activity.data ?? []).length === 0 ? (
            <EmptyState icon={<Users size={18} />} title="Nothing yet" description="The feed fills as both members complete real work." />
          ) : (
            (my.activity.data ?? []).map((item) => (
              <ActivityFeedItem key={item.id} item={item} author={profiles.data?.find((person) => person.id === item.user_id)} />
            ))
          )}
        </Card>
      </CoreOnly>

      {profile?.role !== 'core' && (
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <Flame size={18} className="mt-0.5 text-muted" />
            <div>
              <p className="text-sm font-semibold">Your shared space isn’t active</p>
              <p className="mt-1 text-xs text-muted">You can still track your own activity and streaks on the dashboard and planner. Shared challenges are for the two core members.</p>
            </div>
          </div>
        </Card>
      )}

      {currentWeek && (
        <Card className="mt-6 p-5">
          <SectionHeading title={`Week ${currentWeek.week_no} window`} description="Challenge dates follow the shared roadmap schedule." />
          <div className="flex flex-wrap gap-6 text-xs">
            <div><p className="text-[10px] uppercase tracking-wider text-faint">Start</p><p className="mt-1">{formatDate(currentWeek.startDate, 'UTC')}</p></div>
            <div><p className="text-[10px] uppercase tracking-wider text-faint">End</p><p className="mt-1">{formatDate(currentWeek.endDate, 'UTC')}</p></div>
            <div><p className="text-[10px] uppercase tracking-wider text-faint">Milestone</p><p className="mt-1 max-w-md text-muted">{currentWeek.milestone}</p></div>
            <Target size={14} className="ml-auto text-faint" />
          </div>
        </Card>
      )}
    </div>
  )
}
