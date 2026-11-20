import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addDays, formatDate, todayInTimezone } from '@/lib/dates'
import { PageHeader } from '@/app/AppShell'
import { useAuth } from '@/app/auth-context'
import { keys, useMyData, useSchedule } from '@/hooks/usePlannerData'
import { Badge, Button, Card, EmptyState, Field, Input, Progress, SectionHeading } from '@/components/ui/primitives'
import { StudyTimer } from '@/components/shared/StudyTimer'
import { addCustomTask, deleteCustomTask, rescheduleTask, saveDailyPlan, saveTasks, setTaskStatus } from '@/lib/db/planner'
import { buildTasksForDay } from '@/lib/scheduling/taskFactory'
import { syncStreakDay } from '@/lib/db/streaks'
import { taskCompletion } from '@/lib/progress'
import type { UserTask } from '@/types/domain'

export function PlannerPage() {
  const { user, profile } = useAuth()
  const queryClient = useQueryClient()
  const { schedule } = useSchedule()
  const my = useMyData()
  const timezone = profile?.timezone ?? 'Asia/Kolkata'
  const today = todayInTimezone(timezone)
  const [date, setDate] = useState(today)

  const day = schedule.data?.days.find((item) => item.date === date)
  const tasks = (my.tasks.data ?? []).filter((task) => task.plan_date === date)
  const plan = (my.plans.data ?? []).find((item) => item.plan_date === date)
  const completion = taskCompletion(tasks)
  const actualMinutes = tasks
    .filter((task) => task.status === 'completed')
    .reduce((sum, task) => sum + task.duration_minutes, 0)
  const overdue = (my.tasks.data ?? []).filter((task) => task.plan_date < today && task.status === 'pending')

  const ensureTasks = useMutation({
    mutationFn: async () => {
      if (!user || !day) return
      await saveTasks(buildTasksForDay(user.id, day, my.tasks.data ?? []))
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: keys.tasks(user?.id) }),
  })

  const ensured = useRef(new Set<string>())
  useEffect(() => {
    if (day && my.tasks.isSuccess && !ensured.current.has(day.date)) {
      ensured.current.add(day.date)
      ensureTasks.mutate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, day?.date, my.tasks.isSuccess])

  const toggleTask = useMutation({
    mutationFn: async ({ taskId, completed }: { taskId: string; completed: boolean }) => {
      await setTaskStatus(user!.id, taskId, completed, timezone)
      if (profile) await syncStreakDay(user!.id, date, profile)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: keys.tasks(user?.id) })
      void queryClient.invalidateQueries({ queryKey: keys.completions(user?.id) })
      void queryClient.invalidateQueries({ queryKey: keys.streaks(user?.id) })
      void queryClient.invalidateQueries({ queryKey: keys.activity })
    },
  })

  const moveTask = useMutation({
    mutationFn: ({ taskId, target }: { taskId: string; target: string }) => rescheduleTask(user!.id, taskId, target),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: keys.tasks(user?.id) }),
  })

  const createTask = useMutation({
    mutationFn: async ({ title, minutes }: { title: string; minutes: number }) => {
      await addCustomTask(user!.id, date, title, minutes)
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: keys.tasks(user?.id) }),
  })

  const removeTask = useMutation({
    mutationFn: (taskId: string) => deleteCustomTask(user!.id, taskId),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: keys.tasks(user?.id) }),
  })

  const saveNote = useMutation({
    mutationFn: (notes: string) => saveDailyPlan(user!.id, date, { notes }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: keys.plans(user?.id) }),
  })

  const toggleDay = useMutation({
    mutationFn: () => saveDailyPlan(user!.id, date, { is_complete: !plan?.is_complete }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: keys.plans(user?.id) }),
  })

  const [newTask, setNewTask] = useState('')
  const [newMinutes, setNewMinutes] = useState(15)
  const nextStudyDate = useMemo(() => {
    if (!day || !schedule.data) return addDays(today, 1)
    const later = schedule.data.days.find((item) => item.date > today && !item.isRestDay)
    return later?.date ?? addDays(today, 1)
  }, [day, schedule.data, today])

  return (
    <div>
      <PageHeader
        eyebrow="Individual planner"
        title="My Planner"
        description="Your own tasks and completion history. Rescheduling is always manual — nothing moves by itself."
        actions={
          <div className="flex items-center gap-1 rounded-md border border-line bg-panel p-1">
            <Button variant="ghost" size="sm" onClick={() => setDate(addDays(date, -1))}>←</Button>
            <span className="min-w-32 text-center text-xs font-medium">{formatDate(date, timezone)}</span>
            <Button variant="ghost" size="sm" onClick={() => setDate(addDays(date, 1))}>→</Button>
            <Button variant="ghost" size="sm" onClick={() => setDate(today)}>Today</Button>
          </div>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Card className="p-4"><p className="text-[10px] uppercase tracking-wider text-faint">Daily target</p><p className="mt-2 text-xl font-semibold tabular-nums">{profile?.daily_goal_minutes ?? 120} min</p></Card>
        <Card className="p-4"><p className="text-[10px] uppercase tracking-wider text-faint">Estimated / actual</p><p className="mt-2 text-xl font-semibold tabular-nums">{day?.estimatedMinutes ?? 0} / {actualMinutes} min</p></Card>
        <Card className="p-4"><p className="text-[10px] uppercase tracking-wider text-faint">Completion</p><p className="mt-2 text-xl font-semibold tabular-nums">{completion.pct}%</p><Progress value={completion.pct} className="mt-2" /></Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-5">
            <SectionHeading
              title={day?.isRestDay ? 'Rest & revision day' : day?.topics.map((topic) => topic.name).join(' + ') || 'Today’s plan'}
              description={day ? `${day.phase} · Week ${day.week_no}` : undefined}
              action={plan?.is_complete ? <Badge tone="solid">Day complete</Badge> : undefined}
            />
            {!day ? (
              <EmptyState title="Outside the roadmap window" description="Pick a date within your shared schedule." />
            ) : tasks.length === 0 ? (
              <EmptyState title="No tasks for this date" description="Rest days have no required tasks." />
            ) : (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onToggle={(completed) => toggleTask.mutate({ taskId: task.id, completed })}
                    onReschedule={(target) => moveTask.mutate({ taskId: task.id, target })}
                    onDelete={task.is_custom ? () => removeTask.mutate(task.id) : undefined}
                    targetDate={nextStudyDate}
                  />
                ))}
              </div>
            )}
            <div className="mt-5 flex flex-wrap items-end gap-2 border-t border-line pt-5">
              <Field label="Add a custom task">
                <Input value={newTask} onChange={(event) => setNewTask(event.target.value)} placeholder="e.g. Revise Merge Sort" />
              </Field>
              <Field label="Minutes">
                <Input type="number" min={0} value={newMinutes} onChange={(event) => setNewMinutes(Number(event.target.value))} className="w-24" />
              </Field>
              <Button
                size="sm"
                disabled={!newTask.trim()}
                onClick={() => {
                  createTask.mutate({ title: newTask.trim(), minutes: newMinutes })
                  setNewTask('')
                }}
              >
                Add task
              </Button>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-line pt-5">
              <p className="text-xs text-muted">Mark the whole study day complete?</p>
              <Button variant={plan?.is_complete ? 'secondary' : 'primary'} size="sm" onClick={() => toggleDay.mutate()}>
                {plan?.is_complete ? 'Undo day' : 'Complete study day'}
              </Button>
            </div>
          </Card>

          <Card className="p-5">
            <SectionHeading title="Personal notes" description="Private to you — never shown in shared views." />
            <textarea
              key={`${date}-${plan?.notes ?? ''}`}
              defaultValue={plan?.notes ?? ''}
              onBlur={(event) => {
                if (event.target.value !== (plan?.notes ?? '')) saveNote.mutate(event.target.value)
              }}
              className="w-full min-h-28 rounded-md border border-line bg-bg px-3 py-2 text-sm placeholder:text-faint focus:border-fg focus:outline-none"
              placeholder="What clicked today? What needs another pass?"
            />
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <SectionHeading title="Study timer" description="Only stopped sessions count toward study time." />
            <StudyTimer topics={schedule.topics.data ?? []} defaultTopicId={day?.topics[0]?.id} />
          </Card>

          <Card className="p-5">
            <SectionHeading title="Overdue tasks" description="Nothing is moved automatically." />
            {overdue.length === 0 ? (
              <p className="py-4 text-xs text-muted">No overdue tasks.</p>
            ) : (
              <div className="space-y-2">
                {overdue.slice(0, 8).map((task) => (
                  <div key={task.id} className="rounded-md border border-line px-3 py-2 text-xs">
                    <p className="truncate text-muted">{task.title}</p>
                    <p className="mt-1 text-[10px] text-faint">Originally {formatDate(task.plan_date, timezone)}</p>
                    <Button variant="ghost" size="sm" className="mt-2" onClick={() => moveTask.mutate({ taskId: task.id, target: date })}>
                      Move to selected date
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

function TaskRow({ task, onToggle, onReschedule, onDelete, targetDate }: {
  task: UserTask
  onToggle: (completed: boolean) => void
  onReschedule: (target: string) => void
  onDelete?: () => void
  targetDate: string
}) {
  const done = task.status === 'completed'
  return (
    <div className="flex items-start gap-3 rounded-md border border-line px-3 py-2.5">
      <button
        onClick={() => onToggle(!done)}
        className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-sm border ${done ? 'border-fg bg-fg text-bg' : 'border-line hover:border-fg'}`}
        aria-label={done ? 'Mark incomplete' : 'Mark complete'}
      >
        {done && <span className="text-[10px]">✓</span>}
      </button>
      <div className="min-w-0 flex-1">
        <p className={`text-xs ${done ? 'text-faint line-through' : 'text-fg'}`}>{task.title}</p>
        <p className="mt-0.5 text-[10px] uppercase tracking-wide text-faint">{task.activity_type} · {task.duration_minutes}m</p>
      </div>
      <div className="flex shrink-0 gap-1">
        {!done && (
          <Button variant="ghost" size="sm" onClick={() => onReschedule(targetDate)}>Reschedule</Button>
        )}
        {onDelete && <Button variant="ghost" size="sm" onClick={onDelete}>Delete</Button>}
      </div>
    </div>
  )
}
