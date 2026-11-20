import { useEffect, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Pause, Play, Square } from 'lucide-react'
import { useAuth } from '@/app/auth-context'
import { keys } from '@/hooks/usePlannerData'
import { discardSession, saveSessionNotes, startSession, stopSession } from '@/lib/db/sessions'
import { syncStreakDay } from '@/lib/db/streaks'
import { todayInTimezone } from '@/lib/dates'
import type { RoadmapTopic, StudySession } from '@/types/domain'
import { Button, Field, Select, Textarea } from '@/components/ui/primitives'

function clock(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return [h, m, s].map((value) => String(value).padStart(2, '0')).join(':')
}

export function StudyTimer({ topics, defaultTopicId }: { topics: RoadmapTopic[]; defaultTopicId?: string | null }) {
  const { user, profile } = useAuth()
  const queryClient = useQueryClient()
  const [session, setSession] = useState<StudySession | null>(null)
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [topicId, setTopicId] = useState(defaultTopicId ?? '')
  const [topicTouched, setTopicTouched] = useState(false)
  const [notes, setNotes] = useState('')
  const pausedMs = useRef(0)
  const pauseStarted = useRef<number | null>(null)
  const effectiveTopicId = !topicTouched && !session ? (defaultTopicId ?? topicId) : topicId

  useEffect(() => {
    if (!running || !session) return
    const timer = window.setInterval(() => {
      const paused = pausedMs.current + (pauseStarted.current ? Date.now() - pauseStarted.current : 0)
      setElapsed(Math.max(0, Math.floor((Date.now() - new Date(session.started_at).getTime() - paused) / 1000)))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [running, session])

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: keys.sessions(user?.id) })
    void queryClient.invalidateQueries({ queryKey: keys.streaks(user?.id) })
    void queryClient.invalidateQueries({ queryKey: keys.activity })
  }

  const start = useMutation({
    mutationFn: () => startSession(user!.id, effectiveTopicId || null),
    onSuccess: (created) => {
      setSession(created)
      setRunning(true)
      setElapsed(0)
      pausedMs.current = 0
      pauseStarted.current = null
    },
  })

  const finish = useMutation({
    mutationFn: async () => {
      if (!session) return
      if (pauseStarted.current) pausedMs.current += Date.now() - pauseStarted.current
      const saved = await stopSession(user!.id, session, pausedMs.current)
      if (notes.trim()) await saveSessionNotes(user!.id, saved.id, notes.trim())
      if (profile) {
        await syncStreakDay(user!.id, todayInTimezone(profile.timezone), profile)
      }
    },
    onSuccess: () => {
      setSession(null)
      setRunning(false)
      setNotes('')
      refresh()
    },
  })

  const cancel = useMutation({
    mutationFn: () => discardSession(user!.id, session!.id),
    onSuccess: () => {
      setSession(null)
      setRunning(false)
    },
  })

  const togglePause = () => {
    if (running) {
      pauseStarted.current = Date.now()
      setRunning(false)
    } else if (session) {
      if (pauseStarted.current) pausedMs.current += Date.now() - pauseStarted.current
      pauseStarted.current = null
      setRunning(true)
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-line bg-panel p-5">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-faint">Current session</p>
            <p className="mt-2 font-mono text-4xl font-semibold tabular-nums tracking-tight">{clock(elapsed)}</p>
            <p className="mt-1 text-[11px] text-muted">
              {!session ? 'Ready when you are' : running ? 'Timer running' : 'Paused — paused time is not counted'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {!session ? (
              <Button onClick={() => start.mutate()} disabled={start.isPending}>
                <Play size={14} /> Start session
              </Button>
            ) : (
              <>
                <Button variant="secondary" onClick={togglePause}>
                  {running ? <Pause size={14} /> : <Play size={14} />}
                  {running ? 'Pause' : 'Resume'}
                </Button>
                <Button onClick={() => finish.mutate()} disabled={finish.isPending}>
                  <Square size={12} /> Stop & log
                </Button>
                <Button variant="ghost" onClick={() => cancel.mutate()}>Discard</Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Associate with topic" hint="Defaults to today's topic; change it any time.">
          <Select
            value={effectiveTopicId}
            onChange={(event) => {
              setTopicTouched(true)
              setTopicId(event.target.value)
            }}
            disabled={Boolean(session)}
          >
            <option value="">No topic / general study</option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                W{topic.week_no} · {topic.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Session notes (private)">
          <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="What did you work on?" />
        </Field>
      </div>
      {(start.error || finish.error) && <p className="text-xs text-fg">{start.error?.message ?? finish.error?.message}</p>}
    </div>
  )
}
