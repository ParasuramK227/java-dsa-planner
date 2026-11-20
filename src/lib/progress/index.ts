import type { Difficulty, Problem, StreakRecord, TopicProgress, UserTask } from '@/types/domain'

export function pct(done: number, total: number): number {
  if (total <= 0) return 0
  return Math.min(100, Math.round((done / total) * 100))
}

export function problemCounts(problems: Problem[]) {
  const solved = problems.filter((problem) => problem.status === 'solved')
  const byDifficulty = (difficulty: Difficulty) => solved.filter((p) => p.difficulty === difficulty).length
  return {
    solved: solved.length,
    easy: byDifficulty('easy'),
    medium: byDifficulty('medium'),
    hard: byDifficulty('hard'),
  }
}

export function topicCompletion(progress: TopicProgress[], totalTopics: number) {
  const completed = progress.filter((item) => item.status === 'completed').length
  return { completed, total: totalTopics, pct: pct(completed, totalTopics) }
}

export function taskCompletion(tasks: UserTask[]) {
  const completed = tasks.filter((task) => task.status === 'completed').length
  return { completed, total: tasks.length, pct: pct(completed, tasks.length) }
}

export function studyMinutes(records: Pick<StreakRecord, 'study_minutes'>[]): number {
  return records.reduce((sum, record) => sum + (record.study_minutes ?? 0), 0)
}

export function xpLevel(totalXp: number) {
  // Gentle, increasing curve: 500, 1200, 2100, 3200...
  const level = Math.max(1, Math.floor((Math.sqrt(1 + (8 * totalXp) / 100) - 1) / 2) + 1)
  const threshold = (n: number) => Math.round((100 * n * (n - 1)) / 2)
  const currentFloor = threshold(level - 1)
  const next = threshold(level)
  return {
    level,
    intoLevel: Math.max(0, totalXp - currentFloor),
    nextThreshold: next,
    progress: pct(Math.max(0, totalXp - currentFloor), next - currentFloor),
  }
}

export function difficultyTarget(total: number) {
  return {
    easy: Math.round(total * 0.3),
    medium: Math.round(total * 0.6),
    hard: Math.round(total * 0.1),
  }
}
