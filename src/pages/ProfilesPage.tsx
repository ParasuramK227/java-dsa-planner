import { useEffect, useRef, useState } from 'react'
import { useQueries, useQueryClient, useMutation } from '@tanstack/react-query'
import { Check, NotebookPen, Save, Trash2 } from 'lucide-react'
import { PageHeader } from '@/app/AppShell'
import { useAuth } from '@/app/auth-context'
import { keys, useCurriculum, useMyData, useProfiles } from '@/hooks/usePlannerData'
import { Badge, Button, Card, EmptyState, Field, Input, SectionHeading, Select, Textarea } from '@/components/ui/primitives'
import { updateProfile } from '@/lib/db/profiles'
import { deleteNote, saveNote } from '@/lib/db/shared'
import { getProblems } from '@/lib/db/problems'
import { getStreakRecords } from '@/lib/db/streaks'
import { getTopicProgress } from '@/lib/db/curriculum'
import { getXpTransactions } from '@/lib/db/shared'
import { buildUserStats, overallCompletion } from '@/lib/stats'
import { formatDate } from '@/lib/dates'
import type { Profile } from '@/types/domain'

export function ProfilesPage() {
  const { user, profile, refreshProfile } = useAuth()
  const queryClient = useQueryClient()
  const profiles = useProfiles()
  const my = useMyData()
  const { topics } = useCurriculum()
  const core = (profiles.data ?? []).filter((item) => item.role === 'core')
  const others = core.filter((item) => item.id !== user?.id)
  const partnerData = useQueries({
    queries: others.map((person) => ({
      queryKey: ['profile-stats', person.id],
      queryFn: async () => ({
        problems: await getProblems(person.id),
        streaks: await getStreakRecords(person.id),
        progress: await getTopicProgress(person.id),
        xp: await getXpTransactions(person.id),
      }),
    })),
  })

  const [form, setForm] = useState<Partial<Profile>>({})
  const loaded = useRef(false)
  useEffect(() => {
    if (profile && !loaded.current) { setForm(profile); loaded.current = true }
  }, [profile])

  const save = useMutation({
    mutationFn: () => updateProfile(user!.id, {
      display_name: form.display_name ?? '',
      bio: form.bio ?? '',
      avatar_url: form.avatar_url || null,
      timezone: form.timezone ?? 'Asia/Kolkata',
      daily_goal_minutes: form.daily_goal_minutes ?? 120,
      study_days: form.study_days ?? [1, 2, 3, 4, 5, 6],
      rest_day: form.rest_day ?? 0,
    }),
    onSuccess: async () => {
      await refreshProfile()
      await queryClient.invalidateQueries({ queryKey: keys.profiles })
      await queryClient.invalidateQueries({ queryKey: ['schedule'] })
      await queryClient.invalidateQueries()
    },
  })

  const [note, setNote] = useState({ title: '', content: '', entity_type: 'general' })
  const saveNoteMutation = useMutation({
    mutationFn: () => saveNote(user!.id, {
      id: crypto.randomUUID(),
      title: note.title,
      content: note.content,
      entity_type: note.entity_type as 'general' | 'topic' | 'problem' | 'week',
      entity_id: null,
    }),
    onSuccess: () => {
      setNote({ title: '', content: '', entity_type: 'general' })
      void queryClient.invalidateQueries({ queryKey: keys.notes(user?.id) })
    },
  })
  const deleteNoteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(user!.id, id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: keys.notes(user?.id) }),
  })

  const partnerById = new Map(others.map((person, index) => [person.id, partnerData[index]?.data]))

  const statsFor = (person: Profile, data?: { problems: Awaited<ReturnType<typeof getProblems>>; streaks: Awaited<ReturnType<typeof getStreakRecords>>; progress: Awaited<ReturnType<typeof getTopicProgress>>; xp: Awaited<ReturnType<typeof getXpTransactions>> }) => {
    const isMe = person.id === user?.id
    return buildUserStats({
      profile: person,
      tasks: isMe ? (my.tasks.data ?? []) : [],
      problems: isMe ? (my.problems.data ?? []) : (data?.problems ?? []),
      streaks: isMe ? (my.streaks.data ?? []) : (data?.streaks ?? []),
      xp: isMe ? (my.xp.data ?? []) : (data?.xp ?? []),
      progress: isMe ? (my.progress?.data ?? []) : (data?.progress ?? []),
      totalTopics: topics.data?.length ?? 0,
    })
  }

  return (
    <div>
      <PageHeader eyebrow="Individual identity" title="Profiles" description="Both members' shared statistics, plus your own editable profile and private notes." />

      <div className="mb-8 grid gap-4 lg:grid-cols-2">
        {core.map((person) => {
          const stats = statsFor(person, partnerById.get(person.id))
          const completion = overallCompletion(
            person.id === user?.id ? (my.progress?.data ?? []) : (partnerById.get(person.id)?.progress ?? []),
            topics.data?.length ?? 0,
          )
          return (
            <Card key={person.id} className="p-5">
              <div className="flex items-start gap-4">
                {person.avatar_url ? (
                  <img src={person.avatar_url} alt="" className="h-12 w-12 rounded-full border border-line object-cover" />
                ) : (
                  <div className="grid h-12 w-12 place-items-center rounded-full border border-line bg-raised text-sm font-semibold">
                    {(person.display_name || '?').slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold">{person.display_name || 'Unnamed'}</p>
                    {person.id === user?.id && <Badge tone="solid">YOU</Badge>}
                  </div>
                  <p className="truncate text-[11px] text-muted">{person.email}</p>
                  <p className="mt-1 text-[10px] text-faint">Joined {formatDate(person.created_at.slice(0, 10), 'UTC')}</p>
                </div>
              </div>
              {person.bio && <p className="mt-4 text-xs leading-relaxed text-muted">{person.bio}</p>}
              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4 text-xs sm:grid-cols-3">
                <div><p className="text-[10px] text-faint">Problems</p><p className="mt-1 font-medium">{stats.problemsSolved}</p></div>
                <div><p className="text-[10px] text-faint">E / M / H</p><p className="mt-1 font-medium">{stats.easy} / {stats.medium} / {stats.hard}</p></div>
                <div><p className="text-[10px] text-faint">Study hours</p><p className="mt-1 font-medium">{(stats.studyMinutes / 60).toFixed(1)}h</p></div>
                <div><p className="text-[10px] text-faint">Current streak</p><p className="mt-1 font-medium">{stats.currentStreak}</p></div>
                <div><p className="text-[10px] text-faint">Longest</p><p className="mt-1 font-medium">{stats.longestStreak}</p></div>
                <div><p className="text-[10px] text-faint">Active days</p><p className="mt-1 font-medium">{stats.activeDays}</p></div>
              </div>
              <div className="mt-4">
                <div className="mb-1.5 flex justify-between text-[11px]"><span className="text-muted">Roadmap completion</span><span>{completion}%</span></div>
                <div className="h-1.5 overflow-hidden rounded-full bg-raised"><div className="h-full bg-fg" style={{ width: `${completion}%` }} /></div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <SectionHeading title="Edit your profile" description="Only you can change these fields." />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Display name"><Input value={form.display_name ?? ''} onChange={(e) => setForm({ ...form, display_name: e.target.value })} /></Field>
            <Field label="Avatar URL"><Input value={form.avatar_url ?? ''} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} placeholder="https://..." /></Field>
            <div className="sm:col-span-2"><Field label="Short bio"><Textarea value={form.bio ?? ''} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></Field></div>
            <Field label="Timezone"><Input value={form.timezone ?? ''} onChange={(e) => setForm({ ...form, timezone: e.target.value })} /></Field>
            <Field label="Daily goal (minutes)"><Input type="number" min={1} value={form.daily_goal_minutes ?? 120} onChange={(e) => setForm({ ...form, daily_goal_minutes: Number(e.target.value) })} /></Field>
            <Field label="Rest day"><Select value={form.rest_day ?? 0} onChange={(e) => setForm({ ...form, rest_day: Number(e.target.value) })}>{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((label, i) => <option key={label} value={i}>{label}</option>)}</Select></Field>
            <Field label="Study days" hint="Adjust in Settings."><Input readOnly value={(form.study_days ?? []).map((d) => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d]).join(', ')} /></Field>
          </div>
          <Button className="mt-5" onClick={() => save.mutate()}><Save size={13} /> Save profile</Button>
          {save.isSuccess && <p className="mt-2 text-[11px] text-muted">Saved.</p>}
        </Card>

        <Card className="p-5">
          <SectionHeading title="Personal notes" description="Private by default and never shown in shared views." />
          <div className="space-y-3">
            <Field label="Title"><Input value={note.title} onChange={(e) => setNote({ ...note, title: e.target.value })} placeholder="Short title" /></Field>
            <Field label="Note"><Textarea value={note.content} onChange={(e) => setNote({ ...note, content: e.target.value })} placeholder="Write anything you want to remember..." /></Field>
            <Button size="sm" disabled={!note.content.trim()} onClick={() => saveNoteMutation.mutate()}><Check size={13} /> Add note</Button>
          </div>
          <div className="mt-6 space-y-2 border-t border-line pt-4">
            {(my.notes.data ?? []).length === 0 && <EmptyState icon={<NotebookPen size={18} />} title="No notes yet" description="Your notes stay yours." />}
            {(my.notes.data ?? []).map((item) => (
              <div key={item.id} className="flex items-start gap-3 rounded-md border border-line px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium">{item.title || 'Untitled note'}</p>
                  <p className="mt-1 whitespace-pre-wrap text-[11px] text-muted">{item.content}</p>
                  <p className="mt-1 text-[10px] text-faint">{formatDate(item.updated_at.slice(0, 10), 'UTC')}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => deleteNoteMutation.mutate(item.id)} aria-label="Delete note"><Trash2 size={13} /></Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
