import { describe, it, expect } from 'vitest'
import { validateEmployeeId, validateEmployeeName, validatePassword } from './validation'

describe('validation utils', () => {
  it('validateEmployeeId - accepts valid ids', () => {
    expect(validateEmployeeId('abc1')).toBeNull()
    expect(validateEmployeeId('A1b2')).toBeNull()
  })

  it('validateEmployeeId - rejects invalid', () => {
    expect(validateEmployeeId('')).toMatch(/required/)
    expect(validateEmployeeId('a b')).toMatch(/alphanumeric/)
    expect(validateEmployeeId('a1')).toMatch(/4 to 20/)
    expect(validateEmployeeId('a'.repeat(21))).toMatch(/4 to 20/)
  })

  it('validateEmployeeName - basic checks', () => {
    expect(validateEmployeeName('John Doe')).toBeNull()
    expect(validateEmployeeName('')).toMatch(/required/)
  })

  it('validatePassword - complexity', () => {
    expect(validatePassword('Aa1!aaaa')).toBeNull()
    expect(validatePassword('short1!')).toMatch(/at least 8/)
    expect(validatePassword('alllowercase1!')).toMatch(/uppercase/)
    expect(validatePassword('ALLUPPERCASE1!')).toMatch(/lowercase/)
    expect(validatePassword('NoNumber!!')).toMatch(/number/)
    expect(validatePassword('NoSymbol1A')).toMatch(/special character/)
  })
})
