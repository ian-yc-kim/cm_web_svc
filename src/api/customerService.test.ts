import { describe, it, expect, vi, beforeEach } from 'vitest'

// Provide a mock implementation for axios before importing modules that use it
vi.mock('axios', () => {
  const post = vi.fn()
  const create = vi.fn(() => ({
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
    post: (...args: any[]) => post(...args),
  }))
  return { default: { post, create }, __esModule: true }
})

import axios from 'axios'
import * as cs from './customerService'

const mockedAxios = axios as unknown as { post?: any; create?: any }

beforeEach(() => {
  vi.resetAllMocks()
  // ensure mocks exist and can be overridden by individual tests
  if (!mockedAxios.post) mockedAxios.post = vi.fn()
  if (!mockedAxios.create) mockedAxios.create = vi.fn(() => ({
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
    post: (...args: any[]) => mockedAxios.post(...args),
  }))
})

describe('customerService', () => {
  it('login success returns data', async () => {
    const data = { access_token: 'tok', user: { employee_id: 'e1' } }
    mockedAxios.post = vi.fn().mockResolvedValue({ data })
    const resp = await cs.login({ username: 'u', password: 'p' })
    expect(resp).toEqual(data)
    expect(mockedAxios.post).toHaveBeenCalledWith('/login', { username: 'u', password: 'p' })
  })

  it('signup success returns data', async () => {
    const data = { id: 'id1' }
    mockedAxios.post = vi.fn().mockResolvedValue({ data })
    const resp = await cs.signup({ email: 'a@b', password: 'p' })
    expect(resp).toEqual(data)
    expect(mockedAxios.post).toHaveBeenCalledWith('/signup', { email: 'a@b', password: 'p' })
  })

  it('login handles axios error with response', async () => {
    const error = { isAxiosError: true, response: { status: 401, data: { message: 'Unauthorized' } } }
    mockedAxios.post = vi.fn().mockRejectedValue(error)
    await expect(cs.login({ username: 'x', password: 'y' })).rejects.toHaveProperty('status', 401)
  })

  it('login handles network error without response', async () => {
    const error = { isAxiosError: true, message: 'Network Error' }
    mockedAxios.post = vi.fn().mockRejectedValue(error)
    await expect(cs.login({ username: 'x', password: 'y' })).rejects.toThrow(/Network Error/)
  })
})
