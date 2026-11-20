import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, Lock, Share2 } from 'lucide-react'
import { PageHeader } from '@/app/AppShell'
import { useAuth } from '@/app/auth-context'
import { keys, useMyData, useSchedule } from '@/hooks/usePlannerData'
import { Badge, Button, Card, EmptyState, Field, SectionHeading, Select, Textarea } from '@/components/ui/primitives'
import { saveWeeklyReview } from '@/lib/db/shared'
import { pct } from '@/lib/progress'
import { formatDate } from '@/lib/dates'
import type { WeeklyReview } from '@/types/domain'

export function WeeklyReviewPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const my = useMyData()
  const { schedule } = useSchedule()
  const weeks = schedule.data?.weeks ?? []
  const [selected, setSelected] = useState(weeks[0]?.week_no ?? 1)
  const reviews = my.reviews.data ?? []
  const current = reviews.find((review) => review.week_no === selected)
  const week = weeks.find((item) => item.week_no === selected)

  const [draft, setDraft] = useState({ difficult_concepts: '', revision_topics: '', observations: '' })

  const stats = useMemo(() => {
    if (!week) return { topics: 0, problems: 0, minutes: 0, completion: 0 }
    const progress = (my.progress?.data ?? []).filter((item) => {
      const topic = schedule.topics.data?.find((t) => t.id === item.topic_id)
      return topic?.week_no === selected
    })
    const problems = (my.problems.data ?? []).filter((problem) => {
      if (!problem.solved_at) return false
      const day = problem.solved_at.slice(0, 10)
      return day >= week.startDate && day <= week.endDate
    })
    const minutes = (my.streaks.data ?? [])
      .filter((record) => record.activity_date >= week.startDate && record.activity_date <= week.endDate)
      .reduce((sum, record) => sum + record.study_minutes, 0)
    const tasks = (my.tasks.data ?? []).filter((task) => task.plan_date >= week.startDate && task.plan_date <= week.endDate)
    const done = tasks.filter((task) => task.status === 'completed').length
    return {
      topics: progress.filter((item) => item.status === 'completed').length,
      problems: problems.length,
      minutes,
      completion: pct(done, tasks.length),
    }
  }, [week, selected, my.progress.data, my.problems.data, my.streaks.data, my.tasks.data, schedule.topics.data])

  const save = useMutation({
    mutationFn: (payload: { isShared: boolean }) => saveWeeklyReview(user!.id, selected, {
      ...draft,
      topics_completed: stats.topics,
      problems_solved: stats.problems,
      study_minutes: stats.minutes,
      completion_pct: stats.completion,
      is_shared: payload.isShared,
      shared_at: payload.isShared ? new Date().toISOString() : null,
    }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: keys.reviews(user?.id) }),
  })

  const loadDraft = (review: WeeklyReview | undefined) => {
    setDraft({
      difficult_concepts: review?.difficult_concepts ?? '',
      revision_topics: review?.revision_topics ?? '',
      observations: review?.observations ?? '',
    })
  }

  const loaded = useRef<string | null>(null)
  useEffect(() => {
    if (!current) return
    const key = `${current.week_no}:${current.updated_at}`
    if (loaded.current !== key) {
      loaded.current = key
      loadDraft(current)
    }
  }, [current])

  return (
    <div>
      <PageHeader
        eyebrow="Private reflection"
        title="Weekly Review"
        description="A quiet checkpoint each week. Reflections stay private unless you explicitly share one."
        actions={
          <Select value={selected} onChange={(event) => { setSelected(Number(event.target.value)); loadDraft(reviews.find((r) => r.week_no === Number(event.target.value))) }} className="w-48">
            {weeks.map((item) => <option key={item.week_no} value={item.week_no}>Week {item.week_no} — {item.title}</option>)}
          </Select>
        }
      />

      {!week ? (
        <Card><EmptyState title="Roadmap not loaded" description="Run the SQL migrations and seeds first." /></Card>
      ) : (
        <>
          <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {([
              ['Topics completed', stats.topics],
              ['Problems solved', stats.problems],
              ['Study hours', (stats.minutes / 60).toFixed(1)],
              ['Daily completion', `${stats.completion}%`],
            ] as const).map(([label, value]) => (
              <Card key={label} className="p-4">
                <p className="text-[10px] uppercase tracking-wider text-faint">{label}</p>
                <p className="mt-2 text-xl font-semibold tabular-nums">{value}</p>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="p-5 lg:col-span-2">
              <SectionHeading
                title={`Week ${week.week_no} reflection`}
                description={`${formatDate(week.startDate, 'UTC')} — ${formatDate(week.endDate, 'UTC')}`}
                action={current?.is_shared ? <Badge tone="solid"><Share2 size={10} className="mr-1" /> SHARED</Badge> : <Badge><Lock size={10} className="mr-1" /> PRIVATE</Badge>}
              />
              <div className="space-y-4">
                <Field label="Difficult concepts"><Textarea value={draft.difficult_concepts} onChange={(e) => setDraft({ ...draft, difficult_concepts: e.target.value })} placeholder="What felt hard this week?" /></Field>
                <Field label="Topics requiring revision"><Textarea value={draft.revision_topics} onChange={(e) => setDraft({ ...draft, revision_topics: e.target.value })} placeholder="What should get another pass?" /></Field>
                <Field label="Personal observations"><Textarea value={draft.observations} onChange={(e) => setDraft({ ...draft, observations: e.target.value })} placeholder="Anything you noticed about your learning?" /></Field>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button onClick={() => save.mutate({ isShared: false })}><Check size={13} /> Save reflection</Button>
                <Button variant="secondary" onClick={() => save.mutate({ isShared: true })}><Share2 size={13} /> Save & share</Button>
                {current?.is_shared && <Button variant="ghost" onClick={() => save.mutate({ isShared: false })}>Make private</Button>}
              </div>
            </Card>

            <Card className="p-5">
              <SectionHeading title="Week context" description={week.title} />
              <p className="text-xs leading-relaxed text-muted">{week.milestone}</p>
              <div className="mt-5 border-t border-line pt-4">
                <p className="text-[10px] uppercase tracking-wider text-faint">Historical reviews</p>
                <div className="mt-2 space-y-1.5">
                  {reviews.length === 0 && <p className="text-xs text-muted">No reviews saved yet.</p>}
                  {reviews.map((review) => (
                    <button
                      key={review.week_no}
                      onClick={() => { setSelected(review.week_no); loadDraft(review) }}
                      className="flex w-full items-center justify-between rounded-md border border-line px-3 py-2 text-left text-xs hover:bg-raised/50"
                    >
                      <span>Week {review.week_no}</span>
                      <span className="text-[10px] text-faint">{review.is_shared ? 'shared' : 'private'}</span>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
