import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'

vi.mock('../api/customerService', () => ({
  login: vi.fn(),
  signup: vi.fn(),
}))

import * as customerService from '../api/customerService'

beforeEach(() => {
  vi.resetAllMocks()
  sessionStorage.clear()
})

function TestConsumer(): JSX.Element {
  const { isAuthenticated, token, user, login, logout, signup } = useAuth()

  return (
    <div>
      <div data-testid="auth">{String(isAuthenticated)}</div>
      <div data-testid="token">{token ?? 'null'}</div>
      <div data-testid="user">{user ? JSON.stringify(user) : 'null'}</div>
      <button onClick={() => void login({ username: 'u', password: 'p' })}>doLogin</button>
      <button onClick={() => logout()}>doLogout</button>
      <button onClick={() => void signup({ email: 'a@b', password: 'p' })}>doSignup</button>
    </div>
  )
}

describe('AuthContext', () => {
  it('login sets token, user and sessionStorage', async () => {
    ;(customerService.login as unknown as vi.Mock).mockResolvedValue({ access_token: 'tok123', user: { employee_id: 'e1' } })
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )
    const btn = screen.getByText('doLogin')
    btn.click()
    await waitFor(() => expect(screen.getByTestId('auth').textContent).toBe('true'))
    expect(screen.getByTestId('token').textContent).toBe('tok123')
    expect(JSON.parse(String(screen.getByTestId('user').textContent))).toEqual({ employee_id: 'e1' })
    expect(sessionStorage.getItem('AUTH_TOKEN')).toBe('tok123')
  })

  it('logout clears token and sessionStorage', async () => {
    // seed sessionStorage
    sessionStorage.setItem('AUTH_TOKEN', 'pretok')
    sessionStorage.setItem('AUTH_USER', JSON.stringify({ employee_id: 'e2' }))

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )

    // initial hydrated state becomes authenticated
    await waitFor(() => expect(screen.getByTestId('auth').textContent).toBe('true'))
    expect(sessionStorage.getItem('AUTH_TOKEN')).toBe('pretok')

    const btn = screen.getByText('doLogout')
    btn.click()
    await waitFor(() => expect(screen.getByTestId('auth').textContent).toBe('false'))
    expect(sessionStorage.getItem('AUTH_TOKEN')).toBeNull()
  })

  it('signup calls customerService.signup', async () => {
    ;(customerService.signup as unknown as vi.Mock).mockResolvedValue({ id: 'newid' })
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )
    const btn = screen.getByText('doSignup')
    btn.click()
    await waitFor(() => expect(customerService.signup).toHaveBeenCalled())
  })
})
