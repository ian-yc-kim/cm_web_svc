import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, beforeEach, expect } from 'vitest'
import App from '../App'
import { MemoryRouter } from 'react-router-dom'

beforeEach(() => {
  sessionStorage.clear()
})

describe('Layout logout flow', () => {
  it('shows logout when authenticated and clears session on logout', async () => {
    sessionStorage.setItem('AUTH_TOKEN', 'tok')
    sessionStorage.setItem('AUTH_USER', JSON.stringify({ employee_id: 'empX' }))

    render(
      <MemoryRouter initialEntries={["/customer"]}>
        <App />
      </MemoryRouter>
    )

    // wait for hydrated protected content
    await waitFor(() => expect(screen.getByText(/Welcome, empX!/i)).toBeInTheDocument())

    // logout button should be visible
    const logoutBtn = screen.getByRole('button', { name: /logout/i })
    expect(logoutBtn).toBeInTheDocument()

    await userEvent.click(logoutBtn)

    // after logout, token removed and redirected to login
    await waitFor(() => expect(sessionStorage.getItem('AUTH_TOKEN')).toBeNull())
    await waitFor(() => expect(screen.getByText(/Login Page/i)).toBeInTheDocument())
  })
})
