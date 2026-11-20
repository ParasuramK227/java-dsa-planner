import { useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, ChevronDown, ChevronRight, ExternalLink, Layers, Users } from 'lucide-react'
import { PageHeader } from '@/app/AppShell'
import { useAuth } from '@/app/auth-context'
import { keys, useCurriculum, useSharedProgressMap } from '@/hooks/usePlannerData'
import { Badge, Button, Card, EmptyState, Progress, SectionHeading, Select } from '@/components/ui/primitives'
import { setTopicStatus } from '@/lib/db/curriculum'
import { pct } from '@/lib/progress'
import type { TopicStatus } from '@/types/domain'

const STATUS_LABEL: Record<TopicStatus, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  completed: 'Completed',
  needs_revision: 'Needs Revision',
}

const STATUS_TONE: Record<TopicStatus, 'neutral' | 'solid'> = {
  not_started: 'neutral',
  in_progress: 'neutral',
  completed: 'solid',
  needs_revision: 'neutral',
}

export function RoadmapPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const { weeks, topics } = useCurriculum()
  const { core, members, byUser } = useSharedProgressMap()
  const [month, setMonth] = useState(0)
  const [openWeek, setOpenWeek] = useState<number | null>(1)
  const [openTopic, setOpenTopic] = useState<string | null>(null)

  const myProgress = (byUser.get(user?.id ?? '') ?? []).reduce<Record<string, TopicStatus>>((acc, item) => {
    acc[item.topic_id] = item.status
    return acc
  }, {})

  const statusMutation = useMutation({
    mutationFn: ({ topicId, status }: { topicId: string; status: TopicStatus }) => setTopicStatus(user!.id, topicId, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: keys.progress(user?.id) })
      void queryClient.invalidateQueries({ queryKey: keys.activity })
    },
  })

  const visibleWeeks = useMemo(
    () => (weeks.data ?? []).filter((week) => month === 0 || week.month_no === month),
    [weeks.data, month],
  )

  return (
    <div>
      <PageHeader
        eyebrow="Shared curriculum"
        title="Shared Roadmap"
        description="One 20-week curriculum for both of you. Progress is marked independently — dates never mark topics complete."
        actions={
          <Select value={month} onChange={(event) => setMonth(Number(event.target.value))} className="w-44">
            <option value={0}>All five months</option>
            {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>Month {value}</option>)}
          </Select>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-[10px] uppercase tracking-wider text-faint">Curriculum</p>
          <p className="mt-2 text-xl font-semibold tabular-nums">20 weeks · {topics.data?.length ?? 0} topics</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] uppercase tracking-wider text-faint">Shared completion</p>
          <p className="mt-2 text-xl font-semibold tabular-nums">
            {pct(Object.values(myProgress).filter((status) => status === 'completed').length, topics.data?.length ?? 0)}%
          </p>
          <Progress value={pct(Object.values(myProgress).filter((status) => status === 'completed').length, topics.data?.length ?? 0)} className="mt-2" />
        </Card>
        <Card className="p-4">
          <p className="text-[10px] uppercase tracking-wider text-faint">Members</p>
          <div className="mt-2 flex items-center gap-2">
            <Users size={14} className="text-faint" />
            <p className="text-sm">{core.map((person) => person.display_name).join(' & ') || 'Two members'}</p>
          </div>
        </Card>
      </div>

      <div className="space-y-3">
        {visibleWeeks.map((week) => {
          const weekTopics = (topics.data ?? []).filter((topic) => topic.week_no === week.week_no)
          const isOpen = openWeek === week.week_no
          const bothDone = core.length === 2 && core.every((person) => {
            const progress = byUser.get(person.id) ?? []
            return weekTopics.every((topic) => progress.find((item) => item.topic_id === topic.id)?.status === 'completed')
          })

          return (
            <Card key={week.week_no} className="overflow-hidden">
              <button
                onClick={() => setOpenWeek(isOpen ? null : week.week_no)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-raised/40"
              >
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-line font-mono text-xs font-semibold">
                  {String(week.week_no).padStart(2, '0')}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{week.title}</p>
                    <Badge>MONTH {week.month_no}</Badge>
                    {bothDone && <Badge tone="solid"><Check size={10} className="mr-1" /> SHARED MILESTONE</Badge>}
                  </div>
                  <p className="mt-1 truncate text-[11px] text-muted">{week.milestone}</p>
                </div>
                <span className="text-[11px] text-faint">{weekTopics.length} topics</span>
                {isOpen ? <ChevronDown size={15} className="text-muted" /> : <ChevronRight size={15} className="text-muted" />}
              </button>

              {isOpen && (
                <div className="border-t border-line">
                  {weekTopics.map((topic) => {
                    const expanded = openTopic === topic.id
                    return (
                      <div key={topic.id} className="border-b border-line/60 last:border-0">
                        <button
                          onClick={() => setOpenTopic(expanded ? null : topic.id)}
                          className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-raised/30"
                        >
                          <span className="min-w-0 flex-1 truncate text-xs font-medium">{topic.name}</span>
                          <span className="hidden gap-2 sm:flex">
                            {members.map((person) => {
                              const status = (byUser.get(person.id) ?? []).find((item) => item.topic_id === topic.id)?.status ?? 'not_started'
                              return (
                                <span key={person.id} className="text-[10px] text-faint">
                                  {(person.display_name || 'Member').split(' ')[0]}: <span className={status === 'completed' ? 'text-fg' : ''}>{STATUS_LABEL[status]}</span>
                                </span>
                              )
                            })}
                          </span>
                          <Badge tone={STATUS_TONE[myProgress[topic.id] ?? 'not_started']}>{STATUS_LABEL[myProgress[topic.id] ?? 'not_started']}</Badge>
                          {expanded ? <ChevronDown size={13} className="text-faint" /> : <ChevronRight size={13} className="text-faint" />}
                        </button>

                        {expanded && (
                          <div className="grid gap-6 bg-raised/20 px-5 py-5 md:grid-cols-2">
                            <div className="space-y-4">
                              <div>
                                <p className="text-[10px] uppercase tracking-wider text-faint">Description</p>
                                <p className="mt-1 text-xs leading-relaxed text-muted">{topic.description}</p>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase tracking-wider text-faint">Learning objectives</p>
                                <ul className="mt-2 space-y-1">
                                  {(topic.objectives ?? []).map((objective) => (
                                    <li key={objective} className="flex gap-2 text-xs text-muted"><span className="text-faint">—</span>{objective}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase tracking-wider text-faint">Subtopics</p>
                                <p className="mt-1 text-xs leading-relaxed text-muted">{(topic.subtopics ?? []).join(' · ')}</p>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase tracking-wider text-faint">Java implementation</p>
                                <p className="mt-1 text-xs leading-relaxed text-muted">{topic.java_requirements}</p>
                              </div>
                            </div>
                            <div>
                              <SectionHeading title={`Your status — ${topic.name}`} description={`Recommended problems: ${topic.recommended_problems}`} />
                              <div className="mb-4 flex flex-wrap gap-2">
                                {(Object.keys(STATUS_LABEL) as TopicStatus[]).map((status) => (
                                  <Button
                                    key={status}
                                    size="sm"
                                    variant={(myProgress[topic.id] ?? 'not_started') === status ? 'primary' : 'secondary'}
                                    onClick={() => statusMutation.mutate({ topicId: topic.id, status })}
                                  >
                                    {STATUS_LABEL[status]}
                                  </Button>
                                ))}
                              </div>
                              <p className="mb-2 text-[10px] uppercase tracking-wider text-faint">Related problems</p>
                              <div className="space-y-1.5">
                                {(topic.related_problems ?? []).map((problem) => (
                                  <a
                                    key={problem.url + problem.title}
                                    href={problem.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 rounded-md border border-line bg-panel px-3 py-2 text-xs hover:border-muted"
                                  >
                                    <Layers size={12} className="text-faint" />
                                    <span className="flex-1 truncate">{problem.title}</span>
                                    <Badge>{problem.difficulty}</Badge>
                                    <span className="text-[10px] text-faint">{problem.platform}</span>
                                    <ExternalLink size={11} className="text-faint" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                  {weekTopics.length === 0 && <EmptyState title="No topics seeded yet" description="Run the curriculum seed in Supabase." />}
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
