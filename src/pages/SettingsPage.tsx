import { useEffect, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Download, LogOut, RotateCcw, Upload } from 'lucide-react'
import { PageHeader } from '@/app/AppShell'
import { useAuth } from '@/app/auth-context'
import { useTheme } from '@/app/theme-context'
import { keys, useCurriculum, useMyData, useProfiles } from '@/hooks/usePlannerData'
import { Badge, Button, Card, ErrorBanner, Field, Input, SectionHeading, Toggle } from '@/components/ui/primitives'
import { updatePlannerConfig, updateProfile } from '@/lib/db/profiles'
import { resetPlannerData, rescheduleAllOverdue } from '@/lib/db/planner'
import { saveNote } from '@/lib/db/shared'
import { saveProblem } from '@/lib/db/problems'
import { todayInTimezone, WEEKDAY_LABELS } from '@/lib/dates'
import type { Profile } from '@/types/domain'

export function SettingsPage() {
  const { user, profile, signOut, refreshProfile } = useAuth()
  const queryClient = useQueryClient()
  const { theme, setTheme } = useTheme()
  const { config } = useCurriculum()
  const profiles = useProfiles()
  const my = useMyData()
  const [error, setError] = useState<string | null>(null)
  const [confirmReset, setConfirmReset] = useState('')
  const [overdueDate, setOverdueDate] = useState(todayInTimezone(profile?.timezone ?? 'Asia/Kolkata'))
  const [form, setForm] = useState<Partial<Profile>>({})
  const [configForm, setConfigForm] = useState({ roadmap_start_date: '', target_end_date: '' })
  const loaded = useRef(false)

  useEffect(() => {
    if (profile && !loaded.current) {
      setForm(profile)
      loaded.current = true
    }
  }, [profile])

  const startDateValue = configForm.roadmap_start_date || config.data?.roadmap_start_date || ''
  const endDateValue = configForm.target_end_date || config.data?.target_end_date || ''

  const refreshAll = () => void queryClient.invalidateQueries()

  const saveLearning = useMutation({
    mutationFn: () => updateProfile(user!.id, {
      daily_goal_minutes: form.daily_goal_minutes ?? 120,
      study_days: form.study_days ?? [1, 2, 3, 4, 5, 6],
      rest_day: form.rest_day ?? 0,
      timezone: form.timezone ?? 'Asia/Kolkata',
      display_name: form.display_name ?? '',
    }),
    onSuccess: async () => { await refreshProfile(); await queryClient.invalidateQueries({ queryKey: keys.profiles }); refreshAll() },
  })

  const saveDates = useMutation({
    mutationFn: () => updatePlannerConfig(configForm, user!.id),
    onSuccess: async (saved) => {
      setConfigForm({ roadmap_start_date: saved.roadmap_start_date, target_end_date: saved.target_end_date })
      await queryClient.invalidateQueries({ queryKey: keys.config })
      refreshAll()
    },
  })

  const bulkReschedule = useMutation({
    mutationFn: () => rescheduleAllOverdue(user!.id, overdueDate, todayInTimezone(profile?.timezone ?? 'Asia/Kolkata')),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: keys.tasks(user?.id) })
      setError(null)
    },
  })

  const reset = useMutation({
    mutationFn: () => resetPlannerData(user!.id),
    onSuccess: () => {
      setConfirmReset('')
      refreshAll()
    },
  })

  const exportJson = () => {
    const payload = {
      exported_at: new Date().toISOString(),
      profile,
      config: config.data,
      tasks: my.tasks.data,
      completions: my.completions.data,
      plans: my.plans.data,
      problems: my.problems.data,
      problem_details: my.problemDetails.data,
      sessions: my.sessions.data,
      streak_records: my.streaks.data,
      xp: my.xp.data,
      achievements: my.myAchievements.data,
      reviews: my.reviews.data,
      notes: my.notes.data,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `java-dsa-export-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const importJson = async (file: File) => {
    try {
      const data = JSON.parse(await file.text()) as Record<string, unknown[]>
      for (const problem of (data.problems ?? []) as Parameters<typeof saveProblem>[1][]) {
        await saveProblem(user!.id, problem)
      }
      for (const note of (data.notes ?? []) as Parameters<typeof saveNote>[1][]) {
        await saveNote(user!.id, { ...note, id: crypto.randomUUID() })
      }
      refreshAll()
      setError(null)
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : 'Could not import that file.')
    }
  }

  const toggleDay = (day: number) => {
    const current = form.study_days ?? []
    setForm({
      ...form,
      study_days: current.includes(day) ? current.filter((value) => value !== day) : [...current, day].sort(),
    })
  }

  return (
    <div>
      <PageHeader eyebrow="Workspace controls" title="Settings" description="Learning preferences, shared dates, appearance and data management." />

      {error && <div className="mb-6"><ErrorBanner message={error} /></div>}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <SectionHeading title="Account" description="Google account information and session controls." />
          <div className="space-y-2 text-xs">
            <div className="flex justify-between border-b border-line/60 pb-2"><span className="text-muted">Email</span><span>{profile?.email}</span></div>
            <div className="flex justify-between border-b border-line/60 pb-2"><span className="text-muted">Role</span><Badge>{profile?.role}</Badge></div>
            <div className="flex justify-between"><span className="text-muted">Member since</span><span>{profile ? new Date(profile.created_at).toLocaleDateString() : '—'}</span></div>
          </div>
          <Button variant="secondary" size="sm" className="mt-5" onClick={() => void signOut()}><LogOut size={13} /> Sign out</Button>
        </Card>

        <Card className="p-5">
          <SectionHeading title="Learning settings" description="Changing the daily target never rewrites past streak history." />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Daily goal (minutes)"><Input type="number" min={1} value={form.daily_goal_minutes ?? 120} onChange={(e) => setForm({ ...form, daily_goal_minutes: Number(e.target.value) })} /></Field>
            <Field label="Timezone"><Input value={form.timezone ?? ''} onChange={(e) => setForm({ ...form, timezone: e.target.value })} /></Field>
            <Field label="Rest day"><select className="w-full rounded-md border border-line bg-bg px-3 py-2 text-sm" value={form.rest_day ?? 0} onChange={(e) => setForm({ ...form, rest_day: Number(e.target.value) })}>{WEEKDAY_LABELS.map((label, i) => <option key={label} value={i}>{label}</option>)}</select></Field>
            <Field label="Display name"><Input value={form.display_name ?? ''} onChange={(e) => setForm({ ...form, display_name: e.target.value })} /></Field>
          </div>
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-muted">Study days</p>
            <div className="flex flex-wrap gap-2">
              {WEEKDAY_LABELS.map((label, day) => (
                <Toggle key={label} label={label} checked={(form.study_days ?? []).includes(day)} onChange={() => toggleDay(day)} />
              ))}
            </div>
          </div>
          <Button className="mt-5" size="sm" onClick={() => saveLearning.mutate()}>Save learning settings</Button>
        </Card>

        <Card className="p-5">
          <SectionHeading title="Shared roadmap dates" description={profile?.role === 'core' ? 'Both core members use these dates. Completed history is preserved.' : 'Only core members can change these dates.'} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Starting date"><Input type="date" disabled={profile?.role !== 'core'} value={startDateValue} onChange={(e) => setConfigForm({ ...configForm, roadmap_start_date: e.target.value })} /></Field>
            <Field label="Target completion date"><Input type="date" disabled={profile?.role !== 'core'} value={endDateValue} onChange={(e) => setConfigForm({ ...configForm, target_end_date: e.target.value })} /></Field>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button size="sm" disabled={profile?.role !== 'core'} onClick={() => saveDates.mutate()}>Save dates</Button>
            <Button size="sm" variant="secondary" onClick={refreshAll}><RotateCcw size={13} /> Recalculate roadmap</Button>
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeading title="Planner settings" description="Missed tasks never move automatically." />
          <div className="flex flex-wrap items-end gap-3">
            <Field label="Move overdue tasks to"><Input type="date" value={overdueDate} onChange={(e) => setOverdueDate(e.target.value)} /></Field>
            <Button size="sm" variant="secondary" onClick={() => bulkReschedule.mutate()}>Reschedule overdue</Button>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-muted">This is a bulk manual action. Original dates remain in each task record.</p>
        </Card>

        <Card className="p-5">
          <SectionHeading title="Appearance" description="Monochromatic by design, in either mode." />
          <div className="flex gap-2">
            <Button size="sm" variant={theme === 'dark' ? 'primary' : 'secondary'} onClick={() => setTheme('dark')}>Dark</Button>
            <Button size="sm" variant={theme === 'light' ? 'primary' : 'secondary'} onClick={() => setTheme('light')}>Light</Button>
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeading title="Data management" description="Your data stays in Supabase. Exports are for backup and portability." />
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={exportJson}><Download size={13} /> Export JSON</Button>
            <label className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-md border border-line bg-raised px-3 text-xs font-medium hover:border-muted">
              <Upload size={13} /> Import JSON
              <input type="file" accept="application/json" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) void importJson(file) }} />
            </label>
          </div>
          <div className="mt-6 border-t border-line pt-5">
            <p className="text-xs font-medium">Reset individual planner data</p>
            <p className="mt-1 text-[11px] text-muted">Deletes your daily plans, tasks and completion records only. Problems, sessions, streaks and notes are kept. Type <span className="font-mono text-fg">RESET</span> to confirm.</p>
            <div className="mt-3 flex gap-2">
              <Input value={confirmReset} onChange={(e) => setConfirmReset(e.target.value)} placeholder="RESET" className="max-w-32" />
              <Button size="sm" variant="danger" disabled={confirmReset !== 'RESET'} onClick={() => reset.mutate()}>Reset planner</Button>
            </div>
          </div>
        </Card>
      </div>

      <p className="mt-8 text-center text-[10px] text-faint">
        {profiles.data?.length ?? 0} accounts in this workspace · Java DSA shared planner
      </p>
    </div>
  )
}
