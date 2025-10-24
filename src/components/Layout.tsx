import React from 'react'
import { Outlet, Link } from 'react-router-dom'

export default function Layout(): JSX.Element {
  return (
    <div>
      <header style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
        <nav>
          <Link to="/login" style={{ marginRight: 12 }}>Login</Link>
          <Link to="/signup" style={{ marginRight: 12 }}>Signup</Link>
          <Link to="/customer">Customer</Link>
        </nav>
      </header>
      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>
    </div>
  )
}
