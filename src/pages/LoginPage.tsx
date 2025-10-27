import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { validateEmployeeId, validateLoginPassword } from '../utils/validation'

interface Errors {
  employee_id?: string | null
  password?: string | null
}

export default function LoginPage(): JSX.Element {
  const navigate = useNavigate()
  const auth = useAuth()

  const [employeeId, setEmployeeId] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [errors, setErrors] = useState<Errors>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    if (name === 'employee_id') {
      setEmployeeId(value)
      try {
        setErrors(prev => ({ ...prev, employee_id: validateEmployeeId(value) }))
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('LoginPage:', error)
      }
    }

    if (name === 'password') {
      setPassword(value)
      try {
        setErrors(prev => ({ ...prev, password: validateLoginPassword(value) }))
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('LoginPage:', error)
      }
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const { name, value } = e.target
    try {
      if (name === 'employee_id') setErrors(prev => ({ ...prev, employee_id: validateEmployeeId(value) }))
      if (name === 'password') setErrors(prev => ({ ...prev, password: validateLoginPassword(value) }))
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('LoginPage:', error)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setApiError(null)

    try {
      // client-side validation
      const empErr = validateEmployeeId(employeeId)
      const passErr = validateLoginPassword(password)
      const validation: Errors = { employee_id: empErr, password: passErr }
      setErrors(prev => ({ ...prev, ...validation }))

      const hasError = Object.values(validation).some(v => v !== null && v !== undefined)
      if (hasError) return

      setIsSubmitting(true)
      await auth.login({ username: employeeId, password })
      navigate('/customer')
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('LoginPage:', error)
      const anyErr = error as any
      if (anyErr && typeof anyErr.status === 'number' && anyErr.status === 401) {
        setApiError('Invalid employee ID or password.')
      } else if (anyErr && typeof anyErr.message === 'string' && anyErr.message.length) {
        setApiError(`Login failed: ${anyErr.message}`)
      } else if (typeof anyErr === 'string' && anyErr.length) {
        setApiError(anyErr)
      } else {
        setApiError('Login failed. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h2>Login Page</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="employee_id">Employee ID</label>
          <input
            id="employee_id"
            name="employee_id"
            value={employeeId}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={errors.employee_id ? 'true' : 'false'}
            aria-describedby={errors.employee_id ? 'employee_id_error' : undefined}
          />
          {errors.employee_id ? (
            <div id="employee_id_error" role="alert" aria-live="polite" style={{ color: 'red' }}>
              {errors.employee_id}
            </div>
          ) : null}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={errors.password ? 'true' : 'false'}
            aria-describedby={errors.password ? 'password_error' : undefined}
          />
          {errors.password ? (
            <div id="password_error" role="alert" aria-live="polite" style={{ color: 'red' }}>
              {errors.password}
            </div>
          ) : null}
        </div>

        {apiError ? (
          <div role="alert" aria-live="polite" style={{ color: 'red', marginBottom: 12 }}>
            {apiError}
          </div>
        ) : null}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>
    </div>
  )
}
