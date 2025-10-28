import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import CustomerList from '../components/CustomerList'
import AddCustomerForm from '../components/AddCustomerForm'
import type { Customer } from '../api/customerService'

export default function CustomerPage(): JSX.Element {
  const { user } = useAuth()
  const employeeId = user?.employee_id ?? 'Guest'
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false)
  const [reloadToken, setReloadToken] = useState<number>(0)
  const [message, setMessage] = useState<string | null>(null)

  function handleOpenAdd(): void {
    setIsAddOpen(true)
  }

  function handleCloseAdd(): void {
    setIsAddOpen(false)
  }

  function handleCreated(created: Customer): void {
    // increment reload token to cause list refresh
    setReloadToken((t) => t + 1)
    setIsAddOpen(false)
    setMessage('Customer created successfully')
    setTimeout(() => setMessage(null), 3000)
  }

  function handleChanged(type: 'created' | 'updated' | 'deleted', _customer?: Customer): void {
    if (type === 'updated') setMessage('Customer updated')
    if (type === 'deleted') setMessage('Customer deleted')
    setTimeout(() => setMessage(null), 2500)
  }

  return (
    <div>
      <h2>{`Welcome, ${employeeId}!`}</h2>

      <div style={{ marginBottom: 12 }}>
        <button onClick={handleOpenAdd}>Add Customer</button>
        {message ? <span style={{ marginLeft: 12 }} aria-live="polite">{message}</span> : null}
      </div>

      <CustomerList reloadToken={reloadToken} onChanged={handleChanged} />

      <AddCustomerForm isOpen={isAddOpen} onCancel={handleCloseAdd} onSuccess={handleCreated} />
    </div>
  )
}
