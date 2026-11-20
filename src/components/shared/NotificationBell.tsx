import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Bell } from 'lucide-react'
import { useAuth } from '@/app/auth-context'
import { keys, useMyData } from '@/hooks/usePlannerData'
import { markNotificationRead } from '@/lib/db/shared'

export function NotificationBell() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const { notifications } = useMyData()
  const [open, setOpen] = useState(false)
  const items = notifications.data ?? []
  const unread = items.filter((item) => !item.is_read).length

  const mutation = useMutation({
    mutationFn: (id: string) => markNotificationRead(id, user!.id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: keys.notifications(user?.id) }),
  })

  return (
    <div className="relative">
      <button
        className="pressable relative rounded-md border border-line p-2 text-muted hover:bg-raised hover:text-fg"
        onClick={() => setOpen((value) => !value)}
        aria-label="Notifications"
      >
        <Bell size={16} />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-fg px-1 text-[9px] font-semibold text-bg">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-50 w-80 overflow-hidden rounded-lg border border-line bg-panel shadow-xl">
          <div className="border-b border-line px-4 py-3 text-xs font-semibold">Notifications</div>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 && <p className="px-4 py-6 text-center text-xs text-muted">Nothing new yet.</p>}
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => !item.is_read && mutation.mutate(item.id)}
                className="block w-full border-b border-line/60 px-4 py-3 text-left hover:bg-raised/60"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium">{item.title}</span>
                  {!item.is_read && <span className="h-1.5 w-1.5 rounded-full bg-fg" />}
                </div>
                <p className="mt-0.5 text-[11px] text-muted">{item.body}</p>
                <p className="mt-1 text-[10px] text-faint">{new Date(item.created_at).toLocaleString()}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
