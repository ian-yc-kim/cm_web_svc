import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, beforeEach, expect } from 'vitest'
import App from '../App'
import { MemoryRouter } from 'react-router-dom'

beforeEach(() => {
  sessionStorage.clear()
})

describe('CustomerPage', () => {
  it('shows welcome message with employee_id for authenticated user', async () => {
    sessionStorage.setItem('AUTH_TOKEN', 'tok')
    sessionStorage.setItem('AUTH_USER', JSON.stringify({ employee_id: 'e1' }))

    render(
      <MemoryRouter initialEntries={["/customer"]}>
        <App />
      </MemoryRouter>
    )

    await waitFor(() => expect(screen.getByText(/Welcome, e1!/i)).toBeInTheDocument())
  })
})
