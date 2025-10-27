import React from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Layout(): JSX.Element {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout(): Promise<void> {
    try {
      logout()
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('Component:', error)
    }
  }

  return (
    <div>
      <header style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
        <nav>
          {!isAuthenticated ? (
            <>
              <Link to="/login" style={{ marginRight: 12 }}>Login</Link>
              <Link to="/signup" style={{ marginRight: 12 }}>Signup</Link>
            </>
          ) : null}

          {isAuthenticated ? (
            <button onClick={() => void handleLogout()} style={{ marginRight: 12 }}>Logout</button>
          ) : null}

          <Link to="/customer">Customer</Link>
        </nav>
      </header>
      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>
    </div>
  )
}
