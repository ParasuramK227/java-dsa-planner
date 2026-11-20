import { supabase } from '@/lib/supabase/client'
import { unwrapList } from '@/lib/db/helpers'
import type { SessionDetails, StudySession } from '@/types/domain'

export async function getSessions(userId: string): Promise<StudySession[]> {
  return unwrapList(
    await supabase.from('study_sessions').select('*').eq('user_id', userId).order('started_at', { ascending: false }),
  )
}

export async function startSession(userId: string, topicId: string | null) {
  const { data, error } = await supabase
    .from('study_sessions')
    .insert({ user_id: userId, topic_id: topicId, started_at: new Date().toISOString() })
    .select('*')
    .single()
  if (error) throw new Error(error.message)
  return data as StudySession
}

export async function stopSession(userId: string, session: StudySession, pausedMs = 0) {
  const endedAt = new Date()
  const seconds = Math.max(
    0,
    Math.floor((endedAt.getTime() - new Date(session.started_at).getTime() - pausedMs) / 1000),
  )
  const { data, error } = await supabase
    .from('study_sessions')
    .update({ ended_at: endedAt.toISOString(), duration_seconds: seconds, is_completed: true })
    .eq('id', session.id)
    .eq('user_id', userId)
    .select('*')
    .single()
  if (error) throw new Error(error.message)
  return data as StudySession
}

export async function discardSession(userId: string, sessionId: string) {
  const { error } = await supabase.from('study_sessions').delete().eq('id', sessionId).eq('user_id', userId)
  if (error) throw new Error(error.message)
}

export async function getSessionDetails(userId: string): Promise<SessionDetails[]> {
  return unwrapList(await supabase.from('session_details').select('*').eq('user_id', userId))
}

export async function saveSessionNotes(userId: string, sessionId: string, notes: string) {
  const { error } = await supabase
    .from('session_details')
    .upsert({ session_id: sessionId, user_id: userId, notes })
  if (error) throw new Error(error.message)
}
