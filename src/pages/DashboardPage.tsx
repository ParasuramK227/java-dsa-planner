import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowUpRight, CalendarClock, Check, CircleDot, Flame, Layers, Target, Timer, Users } from 'lucide-react'
import { PageHeader } from '@/app/AppShell'
import { useAuth } from '@/app/auth-context'
import { useCurriculum, useMyData, useProfiles, useSchedule } from '@/hooks/usePlannerData'
import { Badge, Card, EmptyState, Progress, SectionHeading } from '@/components/ui/primitives'
import { ActivityCalendar } from '@/components/shared/ActivityCalendar'
import { ActivityFeedItem } from '@/components/shared/ActivityFeedItem'
import { getProblems } from '@/lib/db/problems'
import { getStreakRecords } from '@/lib/db/streaks'
import { getTasks } from '@/lib/db/planner'
import { getTopicProgress } from '@/lib/db/curriculum'
import { getXpTransactions } from '@/lib/db/shared'
import { buildUserStats, overallCompletion } from '@/lib/stats'
import { formatDate, todayInTimezone, daysBetween } from '@/lib/dates'
import { taskCompletion } from '@/lib/progress'
import type { Profile } from '@/types/domain'

function StatCardLike({ label, value, detail, icon: Icon }: { label: string; value: string; detail?: string; icon: typeof Target }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <p className="text-[10px] uppercase tracking-[0.15em] text-faint">{label}</p>
        <Icon size={14} className="text-faint" />
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      {detail && <p className="mt-1 text-[11px] text-muted">{detail}</p>}
    </Card>
  )
}

function ProfileCard({ profile, stats, completion, isMe }: { profile: Profile; stats: ReturnType<typeof buildUserStats>; completion: number; isMe: boolean }) {
  return (
    <Card className="p-5">
      <div className="flex items-start gap-3">
        {profile.avatar_url ? (
          <img src={profile.avatar_url} alt="" className="h-10 w-10 rounded-full border border-line object-cover" />
        ) : (
          <div className="grid h-10 w-10 place-items-center rounded-full border border-line bg-raised text-xs font-semibold">
            {(profile.display_name || '?').slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold">{profile.display_name || 'Unnamed profile'}</p>
            {isMe && <Badge>YOU</Badge>}
          </div>
          <p className="text-[11px] text-muted">Week {stats.topicsCompleted > 0 ? 'in progress' : '1'} · {profile.role === 'core' ? 'Core member' : 'Personal workspace'}</p>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        <div>
          <div className="mb-1.5 flex justify-between text-[11px]"><span className="text-muted">Roadmap</span><span>{completion}%</span></div>
          <Progress value={completion} />
        </div>
        <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
          <div><p className="text-[10px] text-faint">Problems</p><p className="mt-0.5 font-medium tabular-nums">{stats.problemsSolved}</p></div>
          <div><p className="text-[10px] text-faint">Study hours</p><p className="mt-0.5 font-medium tabular-nums">{(stats.studyMinutes / 60).toFixed(1)}h</p></div>
          <div><p className="text-[10px] text-faint">Current streak</p><p className="mt-0.5 font-medium tabular-nums">{stats.currentStreak} days</p></div>
          <div><p className="text-[10px] text-faint">Longest streak</p><p className="mt-0.5 font-medium tabular-nums">{stats.longestStreak} days</p></div>
        </div>
      </div>
    </Card>
  )
}

export function DashboardPage() {
  const { user, profile } = useAuth()
  const { schedule, config } = useSchedule()
  const my = useMyData()
  const profiles = useProfiles()
  const { topics } = useCurriculum()
  const timezone = profile?.timezone ?? 'Asia/Kolkata'
  const today = todayInTimezone(timezone)
  const todaySchedule = schedule.data?.days.find((day) => day.date === today)
  const currentWeek = todaySchedule?.week_no ?? 1

  const coreProfiles = (profiles.data ?? []).filter((item) => item.role === 'core')
  const partner = coreProfiles.find((item) => item.id !== user?.id)

  const partnerData = useQuery({
    queryKey: ['partner-stats', partner?.id],
    enabled: Boolean(partner),
    queryFn: async () => {
      const id = partner!.id
      const [problems, streaks, tasks, progress, xp] = await Promise.all([
        getProblems(id), getStreakRecords(id), getTasks(id), getTopicProgress(id), getXpTransactions(id),
      ])
      return { problems, streaks, tasks, progress, xp }
    },
  })

  const myStats = profile ? buildUserStats({
    profile,
    tasks: my.tasks.data ?? [],
    problems: my.problems.data ?? [],
    streaks: my.streaks.data ?? [],
    xp: my.xp.data ?? [],
    progress: my.progress?.data ?? [],
    totalTopics: topics.data?.length ?? 0,
  }) : null

  const partnerStats = partner && partnerData.data ? buildUserStats({
    profile: partner,
    tasks: partnerData.data.tasks,
    problems: partnerData.data.problems,
    streaks: partnerData.data.streaks,
    xp: partnerData.data.xp,
    progress: partnerData.data.progress,
    totalTopics: topics.data?.length ?? 0,
  }) : null

  const myProgress = my.progress?.data ?? []
  const totalCompleted = myProgress.filter((item) => item.status === 'completed').length +
    (partnerData.data?.progress.filter((item) => item.status === 'completed').length ?? 0)
  const combinedProblems = (myStats?.problemsSolved ?? 0) + (partnerStats?.problemsSolved ?? 0)
  const combinedMinutes = (myStats?.studyMinutes ?? 0) + (partnerStats?.studyMinutes ?? 0)
  const combinedWeekly = (myStats?.weeklyCompletionPct ?? 0) + (partnerStats?.weeklyCompletionPct ?? 0)
  const daysRemaining = config.data ? Math.max(0, daysBetween(today, config.data.target_end_date)) : 0
  const todayTasks = my.tasks.data?.filter((task) => task.plan_date === today) ?? []
  const todayDone = taskCompletion(todayTasks)

  return (
    <div>
      <PageHeader
        eyebrow="Shared learning space"
        title="Dashboard"
        description="A quiet view of where the two of you are, what is due today, and what you have built together."
        actions={<Badge tone="outline">{formatDate(today, timezone, 'long')}</Badge>}
      />

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCardLike label="Roadmap start" value={config.data ? formatDate(config.data.roadmap_start_date, timezone) : '—'} detail="Shared config" icon={CalendarClock} />
        <StatCardLike label="Target completion" value={config.data ? formatDate(config.data.target_end_date, timezone) : '—'} detail={`${daysRemaining} days remaining`} icon={CalendarClock} />
        <StatCardLike label="Current month" value={`Month ${todaySchedule?.month_no ?? 1}`} detail={`Week ${currentWeek} of 20`} icon={Layers} />
        <StatCardLike label="Phase" value={todaySchedule?.phase.split('—')[0].trim() ?? 'Month 1'} detail="Five-month journey" icon={Target} />
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCardLike label="Combined progress" value={`${overallCompletion([...myProgress, ...(partnerData.data?.progress ?? [])], (topics.data?.length ?? 0) * 2)}%`} detail={`${totalCompleted} topic completions`} icon={Layers} />
        <StatCardLike label="Problems solved" value={String(combinedProblems)} detail="Both members combined" icon={Target} />
        <StatCardLike label="Study hours" value={`${(combinedMinutes / 60).toFixed(1)}h`} detail="All logged sessions" icon={Timer} />
        <StatCardLike label="Shared weekly goal" value={`${Math.round(combinedWeekly / 2)}%`} detail="Average task completion" icon={Users} />
      </div>

      <div className="mb-8">
        <SectionHeading title="Individual progress" description="Separate records, shared visibility." />
        <div className="grid gap-4 md:grid-cols-2">
          {myStats && profile && <ProfileCard profile={profile} stats={myStats} completion={overallCompletion(myProgress, topics.data?.length ?? 0)} isMe />}
          {partnerStats && partner && <ProfileCard profile={partner} stats={partnerStats} completion={overallCompletion(partnerData.data?.progress ?? [], topics.data?.length ?? 0)} isMe={false} />}
        </div>
      </div>

      <div className="mb-8 grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <SectionHeading
            title="Today's learning"
            description={todaySchedule ? `${todaySchedule.phase} · Week ${todaySchedule.week_no}` : undefined}
            action={<Link to="/planner" className="inline-flex items-center gap-1 text-[11px] text-muted hover:text-fg">Open planner <ArrowUpRight size={12} /></Link>}
          />
          {!todaySchedule ? (
            <EmptyState title="No plan for today" description="Your schedule will appear once the roadmap is seeded." />
          ) : todaySchedule.isRestDay ? (
            <div className="rounded-md border border-line bg-raised/50 p-6 text-center">
              <Flame size={18} className="mx-auto mb-2 text-muted" />
              <p className="text-sm font-medium">Rest & revision day</p>
              <p className="mt-1 text-xs text-muted">Rest is part of the plan. Your streak is safe today.</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-[10px] uppercase tracking-wider text-faint">Today's topic</p>
                <p className="mt-1 text-base font-medium">{todaySchedule.topics.map((topic) => topic.name).join(' + ') || 'Mixed practice'}</p>
                <p className="mt-1 text-xs text-muted">{todaySchedule.topics[0]?.description ?? 'Revision and consolidation.'}</p>
              </div>
              <div className="mb-4 flex items-center gap-3 text-xs text-muted">
                <span>{todayDone.completed}/{todayDone.total} tasks</span><span>·</span>
                <span>{todaySchedule.estimatedMinutes} min planned</span>
              </div>
              <Progress value={todayDone.pct} />
              <div className="mt-4 space-y-2">
                {todayTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 rounded-md border border-line px-3 py-2 text-xs">
                    <span className={`grid h-4 w-4 place-items-center rounded-sm border ${task.status === 'completed' ? 'border-fg bg-fg text-bg' : 'border-line'}`}>
                      {task.status === 'completed' && <Check size={10} />}
                    </span>
                    <span className="flex-1 truncate text-muted">{task.title}</span>
                    <span className="text-faint">{task.duration_minutes}m</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>

        <Card className="p-5">
          <SectionHeading title="Your consistency" description="Grey intensity shows study activity." />
          <ActivityCalendar
            records={my.streaks.data ?? []}
            startDate={config.data?.roadmap_start_date ?? today}
            endDate={today}
            goalMinutes={profile?.daily_goal_minutes}
            weeks={18}
          />
          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4 text-xs">
            <div><p className="text-[10px] text-faint">Current streak</p><p className="mt-1 font-medium">{myStats?.currentStreak ?? 0} days</p></div>
            <div><p className="text-[10px] text-faint">Active days</p><p className="mt-1 font-medium">{myStats?.activeDays ?? 0}</p></div>
          </div>
        </Card>
      </div>

      {profile?.role === 'core' && (
        <Card className="p-5">
          <SectionHeading title="Recent shared activity" description="Based on real completed actions only." action={<Link to="/activity" className="inline-flex items-center gap-1 text-[11px] text-muted hover:text-fg">All activity <ArrowUpRight size={12} /></Link>} />
          {(my.activity.data ?? []).length === 0 ? (
            <EmptyState icon={<CircleDot size={18} />} title="A quiet start" description="Activity from both members will appear here as work is completed." />
          ) : (
            (my.activity.data ?? []).slice(0, 6).map((item) => (
              <ActivityFeedItem key={item.id} item={item} author={profiles.data?.find((p) => p.id === item.user_id)} />
            ))
          )}
        </Card>
      )}
    </div>
  )
}
