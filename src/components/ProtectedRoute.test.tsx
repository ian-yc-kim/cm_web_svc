import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, beforeEach, expect } from 'vitest'
import App from '../App'
import { MemoryRouter } from 'react-router-dom'

beforeEach(() => {
  sessionStorage.clear()
})

describe('ProtectedRoute', () => {
  it('redirects unauthenticated user to /login when accessing /customer', async () => {
    render(
      <MemoryRouter initialEntries={["/customer"]}>
        <App />
      </MemoryRouter>
    )

    await waitFor(() => expect(screen.getByText(/Login Page/i)).toBeInTheDocument())
    expect(screen.queryByText(/Welcome,/i)).toBeNull()
  })

  it('renders protected content when authenticated', async () => {
    sessionStorage.setItem('AUTH_TOKEN', 'tok')
    sessionStorage.setItem('AUTH_USER', JSON.stringify({ employee_id: 'emp123' }))

    render(
      <MemoryRouter initialEntries={["/customer"]}>
        <App />
      </MemoryRouter>
    )

    await waitFor(() => expect(screen.getByText(/Welcome, emp123!/i)).toBeInTheDocument())
  })
})
