import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import type { SignupFormData } from '../types/auth'
import { validateEmployeeId, validateEmployeeName, validatePassword, validateSignupForm } from '../utils/validation'

export default function SignupPage(): JSX.Element {
  const navigate = useNavigate()
  const auth = useAuth()

  const [form, setForm] = useState<SignupFormData>({ employee_id: '', employee_name: '', password: '' })
  const [errors, setErrors] = useState<{ [k in keyof SignupFormData]?: string | null }>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))

    // Real-time validation for changed field
    try {
      if (name === 'employee_id') setErrors(prev => ({ ...prev, employee_id: validateEmployeeId(value) }))
      if (name === 'employee_name') setErrors(prev => ({ ...prev, employee_name: validateEmployeeName(value) }))
      if (name === 'password') setErrors(prev => ({ ...prev, password: validatePassword(value) }))
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('SignupPage:', error)
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const { name, value } = e.target
    try {
      if (name === 'employee_id') setErrors(prev => ({ ...prev, employee_id: validateEmployeeId(value) }))
      if (name === 'employee_name') setErrors(prev => ({ ...prev, employee_name: validateEmployeeName(value) }))
      if (name === 'password') setErrors(prev => ({ ...prev, password: validatePassword(value) }))
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('SignupPage:', error)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setApiError(null)

    try {
      // Run validations
      const validation = validateSignupForm(form)
      // Update errors state
      setErrors(prev => ({ ...prev, ...validation }))

      const hasError = Object.values(validation).some(v => v !== null && v !== undefined)
      if (hasError) return

      setLoading(true)
      await auth.signup({ employee_id: form.employee_id, employee_name: form.employee_name, password: form.password })
      navigate('/login', { replace: true })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('SignupPage:', error)
      const anyErr = error as any
      if (anyErr && typeof anyErr.message === 'string' && anyErr.message.length) setApiError(String(anyErr.message))
      else if (typeof anyErr === 'string' && anyErr.length) setApiError(anyErr)
      else setApiError('Signup failed. Please check your details and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Signup Page</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="employee_id">Employee ID</label>
          <input
            id="employee_id"
            name="employee_id"
            value={form.employee_id}
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
          <label htmlFor="employee_name">Employee Name</label>
          <input
            id="employee_name"
            name="employee_name"
            value={form.employee_name}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={errors.employee_name ? 'true' : 'false'}
            aria-describedby={errors.employee_name ? 'employee_name_error' : undefined}
          />
          {errors.employee_name ? (
            <div id="employee_name_error" role="alert" aria-live="polite" style={{ color: 'red' }}>
              {errors.employee_name}
            </div>
          ) : null}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
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

        <button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign up'}
        </button>
      </form>
    </div>
  )
}
