import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'
import { MemoryRouter } from 'react-router-dom'

describe('App routing', () => {
  it('renders login page at /login', () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText(/Login Page/i)).toBeInTheDocument()
  })

  it('renders signup page at /signup', () => {
    render(
      <MemoryRouter initialEntries={["/signup"]}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText(/Signup Page/i)).toBeInTheDocument()
  })

  it('redirects / to /login', () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText(/Login Page/i)).toBeInTheDocument()
  })

  it('renders customer page at /customer', () => {
    render(
      <MemoryRouter initialEntries={["/customer"]}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText(/Customer Home/i)).toBeInTheDocument()
  })
})
