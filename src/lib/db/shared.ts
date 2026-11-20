import { supabase } from '@/lib/supabase/client'
import { unwrapList } from '@/lib/db/helpers'
import type {
  Achievement,
  ActivityItem,
  ChallengeContribution,
  Notification,
  PersonalNote,
  WeeklyChallenge,
  WeeklyReview,
  XpTransaction,
} from '@/types/domain'

export async function getAchievements(): Promise<Achievement[]> {
  return unwrapList(await supabase.from('achievements').select('*'))
}

export async function getUserAchievements(userId?: string) {
  let query = supabase.from('user_achievements').select('*')
  if (userId) query = query.eq('user_id', userId)
  return unwrapList(await query)
}

export async function getXpTransactions(userId?: string): Promise<XpTransaction[]> {
  let query = supabase.from('xp_transactions').select('*')
  if (userId) query = query.eq('user_id', userId)
  return unwrapList(await query)
}

export async function getChallenges(): Promise<WeeklyChallenge[]> {
  return unwrapList(await supabase.from('weekly_challenges').select('*').order('week_no'))
}

export async function getContributions(): Promise<ChallengeContribution[]> {
  return unwrapList(await supabase.from('challenge_contributions').select('*'))
}

export async function setContribution(challengeId: string, userId: string, value: number) {
  const { error } = await supabase.from('challenge_contributions').upsert({
    challenge_id: challengeId,
    user_id: userId,
    value,
    updated_at: new Date().toISOString(),
  })
  if (error) throw new Error(error.message)
}

export async function getActivityFeed(limit = 50): Promise<ActivityItem[]> {
  return unwrapList(
    await supabase.from('activity_feed').select('*').order('created_at', { ascending: false }).limit(limit),
  )
}

export async function getNotifications(userId: string): Promise<Notification[]> {
  return unwrapList(
    await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50),
  )
}

export async function markNotificationRead(id: string, userId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw new Error(error.message)
}

export async function getWeeklyReviews(userId?: string): Promise<WeeklyReview[]> {
  let query = supabase.from('weekly_reviews').select('*')
  if (userId) query = query.eq('user_id', userId)
  return unwrapList(await query.order('week_no'))
}

export async function saveWeeklyReview(userId: string, weekNo: number, patch: Partial<WeeklyReview>) {
  const { data, error } = await supabase
    .from('weekly_reviews')
    .upsert({ user_id: userId, week_no: weekNo, ...patch, updated_at: new Date().toISOString() })
    .select('*')
    .single()
  if (error) throw new Error(error.message)
  return data as WeeklyReview
}

export async function getNotes(userId: string): Promise<PersonalNote[]> {
  return unwrapList(
    await supabase.from('personal_notes').select('*').eq('user_id', userId).order('updated_at', { ascending: false }),
  )
}

export async function saveNote(userId: string, note: Partial<PersonalNote>) {
  const { data, error } = await supabase
    .from('personal_notes')
    .upsert({ ...note, user_id: userId, updated_at: new Date().toISOString() })
    .select('*')
    .single()
  if (error) throw new Error(error.message)
  return data as PersonalNote
}

export async function deleteNote(userId: string, noteId: string) {
  const { error } = await supabase.from('personal_notes').delete().eq('id', noteId).eq('user_id', userId)
  if (error) throw new Error(error.message)
}
