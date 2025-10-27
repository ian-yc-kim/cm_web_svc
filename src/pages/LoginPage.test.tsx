import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock useAuth from context
const mockLogin = vi.fn()
vi.mock('../contexts/AuthContext', async () => {
  const actual = await vi.importActual('../contexts/AuthContext')
  return {
    ...(actual as any),
    useAuth: () => ({ login: mockLogin, signup: async () => {}, logout: () => {}, isAuthenticated: false, token: null, user: null }),
  }
})

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...(actual as any),
    useNavigate: () => mockNavigate,
  }
})

import LoginPage from './LoginPage'

beforeEach(() => {
  vi.resetAllMocks()
})

describe('LoginPage', () => {
  it('renders employee_id and password inputs and submit button', () => {
    render(<LoginPage />)
    expect(screen.getByLabelText(/Employee ID/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
  })

  it('shows validation errors for empty submission', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    await user.click(screen.getByRole('button', { name: /log in/i }))
    await waitFor(() => expect(screen.getByText(/Employee ID is required/)).toBeInTheDocument())
    expect(screen.getByText(/Password is required/)).toBeInTheDocument()
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('shows validation error for invalid employee_id', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    await user.type(screen.getByLabelText(/Employee ID/i), 'a b')
    await user.type(screen.getByLabelText(/Password/i), 'somepass')
    await user.click(screen.getByRole('button', { name: /log in/i }))
    await waitFor(() => expect(screen.getByText(/Employee ID must be alphanumeric/)).toBeInTheDocument())
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('successful login redirects to /customer', async () => {
    mockLogin.mockResolvedValueOnce(undefined)
    const user = userEvent.setup()
    render(<LoginPage />)

    await user.type(screen.getByLabelText(/Employee ID/i), 'emp123')
    await user.type(screen.getByLabelText(/Password/i), 'password')
    await user.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => expect(mockLogin).toHaveBeenCalled())
    expect(mockNavigate).toHaveBeenCalledWith('/customer')
  })

  it('failed login 401 shows invalid credentials message', async () => {
    const err = { status: 401, message: 'Unauthorized' }
    mockLogin.mockRejectedValueOnce(err)
    const user = userEvent.setup()
    render(<LoginPage />)

    await user.type(screen.getByLabelText(/Employee ID/i), 'emp123')
    await user.type(screen.getByLabelText(/Password/i), 'password')
    await user.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => expect(mockLogin).toHaveBeenCalled())
    await waitFor(() => expect(screen.getByText(/Invalid employee ID or password/)).toBeInTheDocument())
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('failed login other error shows generic api error message', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Network'))
    const user = userEvent.setup()
    render(<LoginPage />)

    await user.type(screen.getByLabelText(/Employee ID/i), 'emp123')
    await user.type(screen.getByLabelText(/Password/i), 'password')
    await user.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => expect(mockLogin).toHaveBeenCalled())
    await waitFor(() => expect(screen.getByText(/Login failed: Network/)).toBeInTheDocument())
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
