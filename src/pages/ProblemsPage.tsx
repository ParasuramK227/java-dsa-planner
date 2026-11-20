import { useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Download, ExternalLink, Filter, Plus, Trash2 } from 'lucide-react'
import { PageHeader } from '@/app/AppShell'
import { useAuth } from '@/app/auth-context'
import { keys, useMyData, useSchedule } from '@/hooks/usePlannerData'
import { Badge, Button, Card, EmptyState, Field, Input, Progress, SectionHeading, Select, Textarea } from '@/components/ui/primitives'
import { deleteProblem, saveProblem, saveProblemDetails } from '@/lib/db/problems'
import { difficultyTarget, pct, problemCounts } from '@/lib/progress'
import type { Difficulty, Platform, Problem, ProblemStatus } from '@/types/domain'

const PLATFORMS: Platform[] = ['leetcode', 'neetcode', 'hackerrank', 'custom']
const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard']
const STATUSES: ProblemStatus[] = ['not_started', 'attempted', 'solved', 'needs_revision']

const emptyForm = {
  name: '', platform: 'leetcode' as Platform, topic_id: '', difficulty: 'easy' as Difficulty,
  url: '', status: 'not_started' as ProblemStatus, attempts: 1, time_minutes: 0,
  approach: '', notes: '',
}

type ProblemForm = typeof emptyForm & { id?: string }
const EMPTY_PROBLEMS: Problem[] = []

export function ProblemsPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const my = useMyData()
  const { topics } = useSchedule()
  const [filters, setFilters] = useState({ topic: '', difficulty: '', platform: '', status: '' })
  const [form, setForm] = useState<ProblemForm>(emptyForm)
  const [editing, setEditing] = useState(false)
  const [detailFor, setDetailFor] = useState<string | null>(null)
  const [detailText, setDetailText] = useState({ approach: '', notes: '' })

  const problems = my.problems.data ?? EMPTY_PROBLEMS
  const details = my.problemDetails.data ?? []
  const filtered = useMemo(() => problems.filter((problem) =>
    (!filters.topic || problem.topic_id === filters.topic) &&
    (!filters.difficulty || problem.difficulty === filters.difficulty) &&
    (!filters.platform || problem.platform === filters.platform) &&
    (!filters.status || problem.status === filters.status),
  ), [problems, filters])

  const counts = problemCounts(problems)
  const target = difficultyTarget(200)

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: keys.problems(user?.id) })
    void queryClient.invalidateQueries({ queryKey: keys.xp(user?.id) })
    void queryClient.invalidateQueries({ queryKey: keys.activity })
    void queryClient.invalidateQueries({ queryKey: keys.myAchievements(user?.id) })
  }

  const save = useMutation({
    mutationFn: async () => {
      const problem = await saveProblem(user!.id, {
        ...(form.id ? { id: form.id } : {}),
        name: form.name,
        platform: form.platform,
        topic_id: form.topic_id || null,
        difficulty: form.difficulty,
        url: form.url || null,
        status: form.status,
        attempts: form.attempts,
        time_minutes: form.time_minutes,
        solved_at: form.status === 'solved' ? new Date().toISOString() : null,
        attempted_at: new Date().toISOString(),
      })
      await saveProblemDetails(user!.id, problem.id, { approach: form.approach, notes: form.notes })
    },
    onSuccess: () => {
      setForm(emptyForm); setEditing(false); refresh()
    },
  })

  const remove = useMutation({
    mutationFn: (id: string) => deleteProblem(user!.id, id),
    onSuccess: refresh,
  })

  const saveDetails = useMutation({
    mutationFn: () => saveProblemDetails(user!.id, detailFor!, detailText),
    onSuccess: () => {
      setDetailFor(null)
      void queryClient.invalidateQueries({ queryKey: ['problem-details', user?.id] })
    },
  })

  const exportCsv = () => {
    const header = ['name','platform','topic_id','difficulty','url','status','attempts','time_minutes','solved_at']
    const rows = problems.map((p) => header.map((key) => `"${String(p[key as keyof Problem] ?? '').replaceAll('"', '""')}"`).join(','))
    const blob = new Blob([[header.join(','), ...rows].join('\n')], { type: 'text/csv' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'dsa-problems.csv'
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const startEdit = (problem: Problem) => {
    const detail = details.find((item) => item.problem_id === problem.id)
    setForm({
      id: problem.id, name: problem.name, platform: problem.platform, topic_id: problem.topic_id ?? '',
      difficulty: problem.difficulty, url: problem.url ?? '', status: problem.status,
      attempts: problem.attempts, time_minutes: problem.time_minutes,
      approach: detail?.approach ?? '', notes: detail?.notes ?? '',
    })
    setEditing(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      <PageHeader
        eyebrow="Individual tracking"
        title="Problem Tracker"
        description="Every count comes from a real record. No completed problems are created for you."
        actions={<Button variant="secondary" size="sm" onClick={exportCsv}><Download size={13} /> Export CSV</Button>}
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {([
          ['Solved', counts.solved, 200],
          ['Easy', counts.easy, target.easy],
          ['Medium', counts.medium, target.medium],
          ['Hard', counts.hard, target.hard],
        ] as const).map(([label, value, goal]) => (
          <Card key={label} className="p-4">
            <div className="flex items-baseline justify-between">
              <p className="text-[10px] uppercase tracking-wider text-faint">{label}</p>
              <p className="text-[10px] text-faint">target {goal}</p>
            </div>
            <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
            <Progress value={pct(value, goal)} className="mt-2" />
          </Card>
        ))}
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <SectionHeading title={editing ? 'Edit problem' : 'Add a problem'} description="Solution approach and notes stay private." />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Problem name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Two Sum" /></Field>
            <Field label="Platform"><Select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value as Platform })}>{PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}</Select></Field>
            <Field label="Topic"><Select value={form.topic_id} onChange={(e) => setForm({ ...form, topic_id: e.target.value })}><option value="">No topic</option>{topics.data?.map((t) => <option key={t.id} value={t.id}>W{t.week_no} · {t.name}</option>)}</Select></Field>
            <Field label="Difficulty"><Select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value as Difficulty })}>{DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}</Select></Field>
            <Field label="URL"><Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://leetcode.com/problems/..." /></Field>
            <Field label="Status"><Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ProblemStatus })}>{STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</Select></Field>
            <Field label="Attempts"><Input type="number" min={0} value={form.attempts} onChange={(e) => setForm({ ...form, attempts: Number(e.target.value) })} /></Field>
            <Field label="Time spent (min)"><Input type="number" min={0} value={form.time_minutes} onChange={(e) => setForm({ ...form, time_minutes: Number(e.target.value) })} /></Field>
            <div className="sm:col-span-2"><Field label="Solution approach (private)"><Textarea value={form.approach} onChange={(e) => setForm({ ...form, approach: e.target.value })} /></Field></div>
            <div className="sm:col-span-2"><Field label="Personal notes (private)"><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field></div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button disabled={!form.name.trim()} onClick={() => save.mutate()}>{editing ? 'Save changes' : 'Add problem'}</Button>
            {editing && <Button variant="ghost" onClick={() => { setForm(emptyForm); setEditing(false) }}>Cancel</Button>}
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeading title="Filters" description="Narrow the list below." />
          <div className="space-y-3">
            <Field label="Topic"><Select value={filters.topic} onChange={(e) => setFilters({ ...filters, topic: e.target.value })}><option value="">All topics</option>{topics.data?.map((t) => <option key={t.id} value={t.id}>W{t.week_no} · {t.name}</option>)}</Select></Field>
            <Field label="Difficulty"><Select value={filters.difficulty} onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}><option value="">All</option>{DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}</Select></Field>
            <Field label="Platform"><Select value={filters.platform} onChange={(e) => setFilters({ ...filters, platform: e.target.value })}><option value="">All</option>{PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}</Select></Field>
            <Field label="Status"><Select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><option value="">All</option>{STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</Select></Field>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center gap-2 border-b border-line px-5 py-4 text-xs font-semibold"><Filter size={13} className="text-faint" /> {filtered.length} problems</div>
        {filtered.length === 0 ? (
          <EmptyState icon={<Plus size={18} />} title="No problems yet" description="Add the first problem you attempt — counts start at zero." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-line text-[10px] uppercase tracking-wider text-faint">
                <tr><th className="px-5 py-3 font-medium">Problem</th><th className="px-3 py-3 font-medium">Topic</th><th className="px-3 py-3 font-medium">Difficulty</th><th className="px-3 py-3 font-medium">Status</th><th className="px-3 py-3 font-medium">Attempts</th><th className="px-3 py-3 font-medium">Time</th><th className="px-5 py-3" /></tr>
              </thead>
              <tbody>
                {filtered.map((problem) => (
                  <tr key={problem.id} className="border-b border-line/50 last:border-0 hover:bg-raised/30">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{problem.name}</span>
                        {problem.url && <a href={problem.url} target="_blank" rel="noreferrer" className="text-faint hover:text-fg"><ExternalLink size={11} /></a>}
                      </div>
                      <p className="mt-0.5 text-[10px] uppercase text-faint">{problem.platform}</p>
                    </td>
                    <td className="px-3 py-3 text-muted">{topics.data?.find((t) => t.id === problem.topic_id)?.name ?? '—'}</td>
                    <td className="px-3 py-3"><Badge>{problem.difficulty}</Badge></td>
                    <td className="px-3 py-3 text-muted">{problem.status.replaceAll('_', ' ')}</td>
                    <td className="px-3 py-3 tabular-nums text-muted">{problem.attempts}</td>
                    <td className="px-3 py-3 tabular-nums text-muted">{problem.time_minutes}m</td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => {
                          const detail = details.find((item) => item.problem_id === problem.id)
                          setDetailFor(problem.id)
                          setDetailText({ approach: detail?.approach ?? '', notes: detail?.notes ?? '' })
                        }}>Notes</Button>
                        <Button variant="ghost" size="sm" onClick={() => startEdit(problem)}>Edit</Button>
                        <Button variant="ghost" size="sm" onClick={() => remove.mutate(problem.id)} aria-label="Delete"><Trash2 size={13} /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {detailFor && (
        <Card className="mt-6 p-5">
          <SectionHeading title="Private problem notes" description="These fields are never included in shared activity or profiles." />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Solution approach"><Textarea value={detailText.approach} onChange={(e) => setDetailText({ ...detailText, approach: e.target.value })} /></Field>
            <Field label="Personal notes"><Textarea value={detailText.notes} onChange={(e) => setDetailText({ ...detailText, notes: e.target.value })} /></Field>
          </div>
          <div className="mt-4 flex gap-2">
            <Button size="sm" onClick={() => saveDetails.mutate()}>Save notes</Button>
            <Button size="sm" variant="ghost" onClick={() => setDetailFor(null)}>Close</Button>
          </div>
        </Card>
      )}
    </div>
  )
}
