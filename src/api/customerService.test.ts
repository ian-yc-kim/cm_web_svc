import { describe, it, expect, vi, beforeEach } from 'vitest'

// Provide a mock implementation for axios before importing modules that use it
vi.mock('axios', () => {
  const post = vi.fn()
  const get = vi.fn()
  const put = vi.fn()
  const del = vi.fn()
  const create = vi.fn(() => ({
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
    post: (...args: any[]) => post(...args),
    get: (...args: any[]) => get(...args),
    put: (...args: any[]) => put(...args),
    delete: (...args: any[]) => del(...args),
  }))
  return { default: { post, get, put, delete: del, create }, __esModule: true }
})

import axios from 'axios'
import * as cs from './customerService'

const mockedAxios = axios as unknown as { post?: any; get?: any; put?: any; delete?: any; create?: any }

beforeEach(() => {
  vi.resetAllMocks()
  if (!mockedAxios.post) mockedAxios.post = vi.fn()
  if (!mockedAxios.get) mockedAxios.get = vi.fn()
  if (!mockedAxios.put) mockedAxios.put = vi.fn()
  if (!mockedAxios.delete) mockedAxios.delete = vi.fn()
  if (!mockedAxios.create) mockedAxios.create = vi.fn(() => ({
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
    post: (...args: any[]) => mockedAxios.post(...args),
    get: (...args: any[]) => mockedAxios.get(...args),
    put: (...args: any[]) => mockedAxios.put(...args),
    delete: (...args: any[]) => mockedAxios.delete(...args),
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

  // fetchCustomers
  it('fetchCustomers success returns paginated data', async () => {
    const page = 1
    const pageSize = 10
    const payload = { customers: [], current_page: 1, total_pages: 0, page_size: 10, total_count: 0 }
    mockedAxios.get = vi.fn().mockResolvedValue({ data: payload })
    const resp = await cs.fetchCustomers(page, pageSize)
    expect(resp).toEqual(payload)
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/customers?page=1&page_size=10')
  })

  it('fetchCustomers handles axios error with response', async () => {
    const error = { isAxiosError: true, response: { status: 400, data: { message: 'Bad Request' } } }
    mockedAxios.get = vi.fn().mockRejectedValue(error)
    await expect(cs.fetchCustomers(1, 5)).rejects.toHaveProperty('status', 400)
  })

  it('fetchCustomers handles network error', async () => {
    const error = { isAxiosError: true, message: 'Network Down' }
    mockedAxios.get = vi.fn().mockRejectedValue(error)
    await expect(cs.fetchCustomers(1, 5)).rejects.toThrow(/Network Down/)
  })

  // createCustomer
  it('createCustomer success posts payload', async () => {
    const payload = { customer_name: 'A', customer_contact: 'c', customer_address: 'addr', managed_by: 'm' }
    const customer = { ...payload, customer_id: 'cid' }
    mockedAxios.post = vi.fn().mockResolvedValue({ data: customer })
    const resp = await cs.createCustomer(payload)
    expect(resp).toEqual(customer)
    expect(mockedAxios.post).toHaveBeenCalledWith('/api/customers', payload)
  })

  it('createCustomer handles error response', async () => {
    const error = { isAxiosError: true, response: { status: 422, data: { message: 'Invalid' } } }
    mockedAxios.post = vi.fn().mockRejectedValue(error)
    await expect(cs.createCustomer({ customer_name: 'x', customer_contact: '', customer_address: '', managed_by: '' })).rejects.toHaveProperty('status', 422)
  })

  // updateCustomer
  it('updateCustomer success puts payload', async () => {
    const id = 'cid'
    const payload = { customer_name: 'B', customer_contact: 'c2', customer_address: 'addr2', managed_by: 'm2' }
    const updated = { ...payload, customer_id: id }
    mockedAxios.put = vi.fn().mockResolvedValue({ data: updated })
    const resp = await cs.updateCustomer(id, payload)
    expect(resp).toEqual(updated)
    expect(mockedAxios.put).toHaveBeenCalledWith(`/api/customers/${id}`, payload)
  })

  it('updateCustomer handles error response', async () => {
    const error = { isAxiosError: true, response: { status: 404, data: { message: 'Not Found' } } }
    mockedAxios.put = vi.fn().mockRejectedValue(error)
    await expect(cs.updateCustomer('nope', { customer_name: 'x', customer_contact: '', customer_address: '', managed_by: '' })).rejects.toHaveProperty('status', 404)
  })

  // deleteCustomer
  it('deleteCustomer success calls delete', async () => {
    const id = 'delid'
    mockedAxios.delete = vi.fn().mockResolvedValue({})
    await expect(cs.deleteCustomer(id)).resolves.toBeUndefined()
    expect(mockedAxios.delete).toHaveBeenCalledWith(`/api/customers/${id}`)
  })

  it('deleteCustomer handles error response', async () => {
    const error = { isAxiosError: true, response: { status: 403, data: { message: 'Forbidden' } } }
    mockedAxios.delete = vi.fn().mockRejectedValue(error)
    await expect(cs.deleteCustomer('x')).rejects.toHaveProperty('status', 403)
  })
})
