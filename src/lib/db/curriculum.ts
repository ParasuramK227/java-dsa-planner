import { supabase } from '@/lib/supabase/client'
import { unwrapList } from '@/lib/db/helpers'
import type { RoadmapTopic, RoadmapWeek, TopicProgress, TopicStatus } from '@/types/domain'

export async function getRoadmapWeeks(): Promise<RoadmapWeek[]> {
  return unwrapList(await supabase.from('roadmap_weeks').select('*').order('week_no'))
}

export async function getRoadmapTopics(): Promise<RoadmapTopic[]> {
  return unwrapList(
    await supabase.from('roadmap_topics').select('*').order('week_no').order('order_index'),
  )
}

export async function getTopicProgress(userId: string): Promise<TopicProgress[]> {
  return unwrapList(await supabase.from('topic_progress').select('*').eq('user_id', userId))
}

export async function setTopicStatus(userId: string, topicId: string, status: TopicStatus) {
  const { error } = await supabase
    .from('topic_progress')
    .upsert({ user_id: userId, topic_id: topicId, status, updated_at: new Date().toISOString() })
  if (error) throw new Error(error.message)
}
