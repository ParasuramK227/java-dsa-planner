import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Award,
  Bell,
  CalendarDays,
  ChartNoAxesCombined,
  ChevronRight,
  BookOpenText,
  LayoutDashboard,
  LogOut,
  Menu,
  NotebookPen,
  Settings,
  Target,
  UserRound,
  Users,
  X,
} from 'lucide-react'
import clsx from 'clsx'
import { useAuth } from '@/app/auth-context'
import { Button } from '@/components/ui/primitives'
import { NotificationBell } from '@/components/shared/NotificationBell'

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/planner', label: 'My Planner', icon: CalendarDays },
  { to: '/roadmap', label: 'Shared Roadmap', icon: BookOpenText },
  { to: '/problems', label: 'Problems', icon: Target },
  { to: '/weekly-review', label: 'Weekly Review', icon: NotebookPen },
  { to: '/activity', label: 'Shared Activity', icon: Users },
  { to: '/achievements', label: 'Achievements', icon: Award },
  { to: '/profiles', label: 'Profiles', icon: UserRound },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function AppShell() {
  const [open, setOpen] = useState(false)
  const { profile, signOut } = useAuth()
  const location = useLocation()
  const current = NAV.find((item) => (item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)))

  const sidebar = (
    <div className="flex h-full flex-col border-r border-line bg-panel">
      <div className="flex h-16 items-center gap-3 border-b border-line px-5">
        <div className="grid h-8 w-8 place-items-center rounded-md border border-fg bg-fg font-mono text-xs font-bold text-bg">
          JD
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight">Java DSA</p>
          <p className="truncate text-[10px] uppercase tracking-widest text-faint">Shared planner</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              clsx(
                'pressable group flex items-center gap-3 rounded-md px-3 py-2 text-xs font-medium',
                isActive ? 'bg-raised text-fg' : 'text-muted hover:bg-raised/60 hover:text-fg',
              )
            }
          >
            <Icon size={15} strokeWidth={1.8} />
            <span className="flex-1">{label}</span>
            <ChevronRight size={12} className="opacity-0 group-hover:opacity-60" />
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-line p-3">
        <div className="mb-2 flex items-center gap-2 rounded-md px-2 py-1.5">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="h-7 w-7 rounded-full border border-line object-cover" />
          ) : (
            <div className="grid h-7 w-7 place-items-center rounded-full border border-line bg-raised text-[10px] font-semibold">
              {(profile?.display_name || 'U').slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium">{profile?.display_name || 'Your profile'}</p>
            <p className="truncate text-[10px] uppercase tracking-wide text-faint">{profile?.role ?? '…'}</p>
          </div>
          <button onClick={() => void signOut()} title="Sign out" className="pressable rounded p-1.5 text-muted hover:bg-raised hover:text-fg">
            <LogOut size={14} />
          </button>
        </div>
        <p className="px-2 text-[10px] leading-relaxed text-faint">
          Individual progress. Shared accountability.
        </p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-bg text-fg">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} aria-label="Close menu" />
          <div className="absolute inset-y-0 left-0 w-64">
            {sidebar}
            <button className="absolute right-3 top-4 text-muted" onClick={() => setOpen(false)} aria-label="Close">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-bg/95 px-4 backdrop-blur md:px-8">
          <button className="pressable rounded-md p-2 text-muted hover:bg-raised lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu size={18} />
          </button>
          <div className="flex min-w-0 items-center gap-2 text-xs text-muted">
            <span className="hidden sm:inline">Workspace</span>
            <ChevronRight size={12} className="hidden sm:inline" />
            <span className="truncate font-medium text-fg">{current?.label ?? 'Dashboard'}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <NotificationBell />
          </div>
        </header>
        <main className="mx-auto max-w-[1400px] px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-faint">{eyebrow}</p>}
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function CoreOnly({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth()
  if (profile?.role !== 'core') {
    return (
      <div className="rounded-lg border border-line bg-panel p-8 text-center">
        <ChartNoAxesCombined className="mx-auto mb-3 text-faint" size={22} />
        <h2 className="text-sm font-semibold">Personal workspace</h2>
        <p className="mx-auto mt-2 max-w-md text-xs text-muted">
          Shared features are available to the two core members of this journey. Your individual planner,
          problems, streaks and notes are fully available to you.
        </p>
      </div>
    )
  }
  return <>{children}</>
}

export function SignOutButton() {
  const { signOut } = useAuth()
  return (
    <Button variant="secondary" size="sm" onClick={() => void signOut()}>
      <Bell size={13} /> Sign out
    </Button>
  )
}
