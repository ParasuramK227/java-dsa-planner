import { Navigate } from 'react-router-dom'
import { ArrowRight, Code2, Layers, LockKeyhole, Timer } from 'lucide-react'
import { useAuth } from '@/app/auth-context'
import { Button, ErrorBanner } from '@/components/ui/primitives'

export function LoginPage() {
  const { session, loading, signInWithGoogle, error } = useAuth()

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-bg text-sm text-muted">Loading…</div>
  }
  if (session) return <Navigate to="/" replace />

  return (
    <div className="min-h-screen bg-bg text-fg">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-6 py-12 lg:grid-cols-2">
        <div>
          <div className="mb-10 flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-md border border-fg bg-fg font-mono text-xs font-bold text-bg">JD</div>
            <span className="text-sm font-semibold tracking-tight">Java DSA</span>
          </div>
          <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.25em] text-faint">Two people. One learning journey.</p>
          <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Prepare together.<br />Progress individually.
          </h1>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-muted">
            A shared 20-week Java DSA roadmap, a daily plan that adapts to your life, and quiet accountability
            between two people working toward the same placement goal.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Layers, title: 'One roadmap', text: '20 weeks, five months, fully mapped.' },
              { icon: Timer, title: '120 minutes a day', text: 'Concept, code, problems, revision.' },
              { icon: Code2, title: 'Real progress', text: 'Problems, streaks and shared milestones.' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-lg border border-line bg-panel p-4">
                <Icon size={16} className="text-muted" />
                <p className="mt-3 text-xs font-semibold">{title}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm rounded-xl border border-line bg-panel p-7">
          <p className="text-[10px] uppercase tracking-[0.2em] text-faint">Private workspace</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">Sign in to continue</h2>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            Google sign-in only. The two core members share a roadmap; anyone else gets a private workspace.
          </p>
          {error && <div className="mt-5"><ErrorBanner message={error} /></div>}
          <Button className="mt-6 w-full" onClick={() => void signInWithGoogle()}>
            Continue with Google <ArrowRight size={14} />
          </Button>
          <div className="mt-6 flex items-start gap-2 border-t border-line pt-5 text-[11px] text-faint">
            <LockKeyhole size={13} className="mt-0.5 shrink-0" />
            <span>Your notes, reflections and problem approaches are never shared automatically.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
