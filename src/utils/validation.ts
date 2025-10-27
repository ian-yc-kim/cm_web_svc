import validator from 'validator'

export function validateEmployeeId(value: string): string | null {
  const v = String(value ?? '').trim()
  if (!v) return 'Employee ID is required.'
  if (!validator.isAlphanumeric(v)) return 'Employee ID must be alphanumeric.'
  if (!validator.isLength(v, { min: 4, max: 20 })) return 'Employee ID must be 4 to 20 characters long.'
  return null
}

export function validateEmployeeName(value: string): string | null {
  const v = String(value ?? '').trim()
  if (!v) return 'Employee name is required.'
  if (!validator.isLength(v, { min: 1 })) return 'Employee name is required.'
  return null
}

export function validatePassword(value: string): string | null {
  const v = String(value ?? '')
  if (!v) return 'Password is required.'
  if (!validator.isLength(v, { min: 8 })) return 'Password must be at least 8 characters long.'
  const ok = validator.isStrongPassword(v, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  if (!ok) {
    return 'Password must include uppercase, lowercase, number, and special character.'
  }
  return null
}

// Login-specific password validation: only require non-empty for login flows
export function validateLoginPassword(value: string): string | null {
  const v = String(value ?? '')
  if (!v) return 'Password is required.'
  return null
}

export interface ValidationResult {
  employee_id?: string | null
  employee_name?: string | null
  password?: string | null
}

export function validateSignupForm(payload: { employee_id: string; employee_name: string; password: string }): ValidationResult {
  return {
    employee_id: validateEmployeeId(payload.employee_id),
    employee_name: validateEmployeeName(payload.employee_name),
    password: validatePassword(payload.password),
  }
}

// Helper for login form validation
export function validateLoginForm(payload: { employee_id: string; password: string }): ValidationResult {
  return {
    employee_id: validateEmployeeId(payload.employee_id),
    password: validateLoginPassword(payload.password),
  }
}
