import { useEffect, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { keys } from '@/hooks/usePlannerData'
import { useAuth } from '@/app/auth-context'

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel(`planner-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activity_feed' }, () => {
        void queryClient.invalidateQueries({ queryKey: keys.activity })
      })
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        () => {
          void queryClient.invalidateQueries({ queryKey: keys.notifications(user.id) })
        },
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'challenge_contributions' }, () => {
        void queryClient.invalidateQueries({ queryKey: keys.contributions })
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'topic_progress' }, () => {
        void queryClient.invalidateQueries({ queryKey: ['topic-progress'] })
        void queryClient.invalidateQueries({ queryKey: keys.activity })
      })
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'task_completions' },
        () => {
          void queryClient.invalidateQueries()
        },
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [user, queryClient])

  return <>{children}</>
}
