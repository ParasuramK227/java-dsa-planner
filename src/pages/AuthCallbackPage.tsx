import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/auth-context'
import { Button, ErrorBanner } from '@/components/ui/primitives'

const CALLBACK_TIMEOUT_MS = 15_000

function paramsFrom(value: string) {
  return new URLSearchParams(value.replace(/^#/, ''))
}

function decodeCallbackError(value: string | null) {
  if (!value) return null
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export function AuthCallbackPage() {
  const { session, loading, error, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [timedOut, setTimedOut] = useState(false)

  const urlError = useMemo(() => {
    const hash = paramsFrom(location.hash)
    const query = new URLSearchParams(location.search)

    return decodeCallbackError(
      hash.get('error_description') ||
        query.get('error_description') ||
        hash.get('error') ||
        query.get('error') ||
        hash.get('message') ||
        query.get('message') ||
        hash.get('error_code') ||
        query.get('error_code') ||
        null,
    )
  }, [location.hash, location.search])

  const failureMessage = urlError || error
  const failed = Boolean(failureMessage) || (!loading && (timedOut || !session))

  useEffect(() => {
    if (!loading || failureMessage) return

    const timer = window.setTimeout(() => setTimedOut(true), CALLBACK_TIMEOUT_MS)
    return () => window.clearTimeout(timer)
  }, [loading, failureMessage])

  useEffect(() => {
    if (!failed && !loading && session) navigate('/', { replace: true })
  }, [failed, loading, session, navigate])

  if (!failed) {
    return (
      <div className="grid min-h-screen place-items-center bg-bg text-sm text-muted">
        <div className="text-center">
          <div className="mx-auto mb-4 h-6 w-6 animate-spin rounded-full border border-line border-t-fg" />
          Completing sign-in…
        </div>
      </div>
    )
  }

  const retry = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="grid min-h-screen place-items-center bg-bg px-6">
      <div className="w-full max-w-md space-y-4 text-center">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-fg">Sign-in could not be completed</h1>
          <p className="mt-2 text-sm text-muted">
            {failureMessage
              ? 'The sign-in flow returned an error.'
              : 'Sign-in took too long. Check your connection and try again.'}
          </p>
        </div>

        <ErrorBanner message={failureMessage || 'No active session was returned by the sign-in flow.'} />

        <Button onClick={retry}>Try again</Button>
      </div>
    </div>
  )
}
