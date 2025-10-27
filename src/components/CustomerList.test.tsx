import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'

import * as customerService from '../api/customerService'
import CustomerList from './CustomerList'

vi.mock('../api/customerService')

type FetchMock = (typeof customerService.fetchCustomers)

function makeResponse(page = 1, pageSize = 10) {
  const total = 12
  const totalPages = Math.ceil(total / pageSize)
  const customers = Array.from({ length: Math.min(pageSize, total - (page - 1) * pageSize) }, (_, i) => {
    const id = (page - 1) * pageSize + i + 1
    return {
      customer_id: String(id),
      customer_name: `Customer ${id}`,
      customer_contact: `contact-${id}`,
      customer_address: `Address ${id}`,
      managed_by: `Manager ${id}`,
    }
  })

  return {
    customers,
    current_page: page,
    total_pages: totalPages,
    page_size: pageSize,
    total_count: total,
  }
}

describe('CustomerList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls fetchCustomers on mount with default params and renders rows', async () => {
    const mockFetch = customerService.fetchCustomers as FetchMock
    mockFetch.mockResolvedValue(makeResponse(1, 10))

    render(<CustomerList />)

    await waitFor(() => expect(mockFetch).toHaveBeenCalledWith(1, 10))

    // rows present
    const table = await screen.findByRole('table', { name: /customer-table/i })
    expect(table).toBeInTheDocument()
    expect(screen.getByText('Customer 1')).toBeInTheDocument()
  })

  it('shows loading while fetching', async () => {
    const mockFetch = customerService.fetchCustomers as FetchMock

    let resolveFn: (v: unknown) => void
    const p = new Promise((res) => { resolveFn = res })
    mockFetch.mockReturnValue(p as any)

    render(<CustomerList />)

    expect(screen.getByLabelText('loading')).toBeInTheDocument()

    // resolve
    // @ts-expect-error - we know resolveFn was assigned
    resolveFn(makeResponse(1, 10))

    await waitFor(() => expect(screen.queryByLabelText('loading')).not.toBeInTheDocument())
  })

  it('shows error when fetch fails', async () => {
    const mockFetch = customerService.fetchCustomers as FetchMock
    mockFetch.mockRejectedValue(new Error('Network error'))

    render(<CustomerList />)

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
    expect(screen.getByRole('alert')).toHaveTextContent(/network error/i)
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('changes page when pagination clicked and refetches', async () => {
    const mockFetch = customerService.fetchCustomers as FetchMock
    mockFetch.mockResolvedValue(makeResponse(1, 5))

    render(<CustomerList />)

    await waitFor(() => expect(mockFetch).toHaveBeenCalledWith(1, 10))

    // set up next call
    mockFetch.mockResolvedValueOnce(makeResponse(2, 10))

    // click page 2 via Pagination
    const page2 = await screen.findByLabelText('Page 2')
    fireEvent.click(page2)

    await waitFor(() => expect(mockFetch).toHaveBeenCalledWith(2, 10))
  })

  it('changing page size resets to page 1 and refetches with new size', async () => {
    const mockFetch = customerService.fetchCustomers as FetchMock
    mockFetch.mockResolvedValue(makeResponse(1, 10))

    render(<CustomerList />)

    await waitFor(() => expect(mockFetch).toHaveBeenCalledWith(1, 10))

    mockFetch.mockResolvedValueOnce(makeResponse(1, 5))

    const select = screen.getByLabelText(/page size/i)
    fireEvent.change(select, { target: { value: '5' } })

    await waitFor(() => expect(mockFetch).toHaveBeenCalledWith(1, 5))
  })
})
