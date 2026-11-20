import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/app/auth-context'
import { ErrorBanner } from '@/components/ui/primitives'

export function ProtectedRoute() {
  const { session, profile, loading, error } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-bg text-sm text-muted">Loading your workspace…</div>
  }
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />

  if (!profile) {
    return (
      <div className="grid min-h-screen place-items-center bg-bg px-6">
        <div className="w-full max-w-md space-y-4">
          <h1 className="text-lg font-semibold">Profile unavailable</h1>
          <p className="text-sm text-muted">
            Your Google account is signed in, but no profile was found. Run the database migration first, then sign out and back in.
          </p>
          {error && <ErrorBanner message={error} />}
        </div>
      </div>
    )
  }

  return <Outlet />
}
