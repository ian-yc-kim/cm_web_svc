import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock useAuth from context
const mockSignup = vi.fn()
vi.mock('../contexts/AuthContext', async () => {
  const actual = await vi.importActual('../contexts/AuthContext')
  return {
    ...(actual as any),
    useAuth: () => ({ signup: mockSignup, login: async () => {}, logout: () => {}, isAuthenticated: false, token: null, user: null }),
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

import SignupPage from './SignupPage'

beforeEach(() => {
  vi.resetAllMocks()
})

describe('SignupPage', () => {
  it('renders form fields and submit button', () => {
    render(<SignupPage />)
    expect(screen.getByLabelText(/Employee ID/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Employee Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
  })

  it('shows validation errors for empty submission', async () => {
    const user = userEvent.setup()
    render(<SignupPage />)
    const btn = screen.getByRole('button', { name: /sign up/i })
    await user.click(btn)
    await waitFor(() => expect(screen.getByText(/Employee ID is required/)).toBeInTheDocument())
    expect(screen.getByText(/Employee name is required/)).toBeInTheDocument()
    expect(screen.getByText(/Password is required/)).toBeInTheDocument()
    expect(mockSignup).not.toHaveBeenCalled()
  })

  it('successful signup redirects to /login', async () => {
    mockSignup.mockResolvedValueOnce(undefined)
    const user = userEvent.setup()
    render(<SignupPage />)

    await user.type(screen.getByLabelText(/Employee ID/i), 'emp123')
    await user.type(screen.getByLabelText(/Employee Name/i), 'Jane Doe')
    await user.type(screen.getByLabelText(/Password/i), 'Aa1!aaaa')

    await user.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => expect(mockSignup).toHaveBeenCalled())
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true })
  })

  it('failed signup shows api error', async () => {
    mockSignup.mockRejectedValueOnce(new Error('Employee ID already taken'))
    const user = userEvent.setup()
    render(<SignupPage />)

    await user.type(screen.getByLabelText(/Employee ID/i), 'emp123')
    await user.type(screen.getByLabelText(/Employee Name/i), 'Jane Doe')
    await user.type(screen.getByLabelText(/Password/i), 'Aa1!aaaa')

    await user.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => expect(mockSignup).toHaveBeenCalled())
    await waitFor(() => expect(screen.getByText(/Employee ID already taken/)).toBeInTheDocument())
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
