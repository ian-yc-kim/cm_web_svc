import React, { useEffect, useState } from 'react'
import type { Customer, PaginatedCustomersResponse } from '../api/customerService'
import * as customerService from '../api/customerService'
import Pagination from './Pagination'

export default function CustomerList(): JSX.Element {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function load(): Promise<void> {
      setIsLoading(true)
      setError(null)
      try {
        const resp: PaginatedCustomersResponse = await customerService.fetchCustomers(currentPage, pageSize)
        if (!mounted) return
        setCustomers(resp.customers ?? [])
        setTotalPages(resp.total_pages ?? 1)
        setTotalCount(resp.total_count ?? 0)
      } catch (err: unknown) {
        console.error('CustomerList:', err)
        const anyErr = err as any
        setError(anyErr?.message ? String(anyErr.message) : 'Failed to fetch customers')
        setCustomers([])
        setTotalPages(1)
        setTotalCount(0)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    void load()

    return () => {
      mounted = false
    }
  }, [currentPage, pageSize])

  function handlePageChange(page: number): void {
    setCurrentPage(page)
  }

  function handlePageSizeChange(e: React.ChangeEvent<HTMLSelectElement>): void {
    const newSize = Number(e.target.value) || 10
    setPageSize(newSize)
    setCurrentPage(1)
  }

  return (
    <div>
      <h2>Customers</h2>

      <label htmlFor="pageSize">Page size: </label>
      <select id="pageSize" value={pageSize} onChange={handlePageSizeChange} disabled={isLoading}>
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
      </select>

      {isLoading ? <div aria-label="loading">Loading...</div> : null}

      {error ? <div role="alert">{error}</div> : null}

      {!isLoading && !error ? (
        <table aria-label="customer-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Address</th>
              <th>Managed By</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5}>No customers</td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.customer_id}>
                  <td>{c.customer_id}</td>
                  <td>{c.customer_name}</td>
                  <td>{c.customer_contact}</td>
                  <td>{c.customer_address}</td>
                  <td>{c.managed_by}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      ) : null}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} disabled={isLoading} />

      <div>Total: {totalCount}</div>
    </div>
  )
}
