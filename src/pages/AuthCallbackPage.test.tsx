import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  useAuth: vi.fn(),
  navigate: vi.fn(),
  location: {
    pathname: '/auth/callback',
    search: '',
    hash: '',
    state: null,
    key: 'test',
  },
}))

vi.mock('@/app/auth-context', () => ({ useAuth: mocks.useAuth }))
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    useLocation: () => mocks.location,
    useNavigate: () => mocks.navigate,
  }
})

import { AuthCallbackPage } from '@/pages/AuthCallbackPage'

function auth(overrides: Record<string, unknown> = {}) {
  return {
    session: null,
    user: null,
    profile: null,
    loading: false,
    error: null,
    signInWithGoogle: vi.fn(),
    signOut: vi.fn(),
    refreshProfile: vi.fn(),
    ...overrides,
  }
}

describe('AuthCallbackPage', () => {
  afterEach(cleanup)

  beforeEach(() => {
    mocks.navigate.mockReset()
    mocks.location.search = ''
    mocks.location.hash = ''
    mocks.useAuth.mockReturnValue(auth())
  })

  it('redirects to the workspace once a session exists', () => {
    mocks.useAuth.mockReturnValue(auth({ session: { access_token: 'token' } }))

    render(<AuthCallbackPage />)

    expect(mocks.navigate).toHaveBeenCalledWith('/', { replace: true })
  })

  it('shows a retry state when auth finishes without a session', () => {
    render(<AuthCallbackPage />)

    expect(screen.getByText('Sign-in could not be completed')).toBeTruthy()
    expect(screen.getByRole('button', { name: /try again/i })).toBeTruthy()
  })

  it('shows errors returned in the OAuth callback URL', () => {
    mocks.location.hash = '#error=access_denied&error_description=Google+sign-in+was+cancelled'

    render(<AuthCallbackPage />)

    expect(screen.getByText('Google sign-in was cancelled')).toBeTruthy()
  })

  it('decodes double-encoded Supabase callback errors', () => {
    mocks.location.hash =
      '#error=server_error&error_description=Unable+to+exchange+external+code%253A+4%252F0A'

    render(<AuthCallbackPage />)

    expect(screen.getByText('Unable to exchange external code: 4/0A')).toBeTruthy()
  })
})
