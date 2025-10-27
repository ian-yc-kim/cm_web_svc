import React from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function CustomerPage(): JSX.Element {
  const { user } = useAuth()
  const employeeId = user?.employee_id ?? 'Guest'

  return (
    <div>
      <h2>{`Welcome, ${employeeId}!`}</h2>
    </div>
  )
}
