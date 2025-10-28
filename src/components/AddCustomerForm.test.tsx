import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import AddCustomerForm from './AddCustomerForm'
import * as customerService from '../api/customerService'

vi.mock('../api/customerService')

describe('AddCustomerForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders when open and validates inputs', async () => {
    const onCancel = vi.fn()
    const onSuccess = vi.fn()

    render(<AddCustomerForm isOpen={true} onCancel={onCancel} onSuccess={onSuccess} />)

    const save = screen.getByText(/save/i)
    fireEvent.click(save)

    await waitFor(() => expect(screen.getAllByRole('alert').length).toBeGreaterThan(0))
  })

  it('submits valid data and calls createCustomer and onSuccess', async () => {
    const onCancel = vi.fn()
    const onSuccess = vi.fn()
    const mockCreate = customerService.createCustomer as unknown as vi.Mock
    mockCreate.mockResolvedValue({ customer_id: '1', customer_name: 'A', customer_contact: 'C', customer_address: 'Addr', managed_by: 'M' })

    render(<AddCustomerForm isOpen={true} onCancel={onCancel} onSuccess={onSuccess} />)

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Name' } })
    fireEvent.change(screen.getByLabelText('Contact'), { target: { value: 'Contact' } })
    fireEvent.change(screen.getByLabelText('Address'), { target: { value: 'Address' } })
    fireEvent.change(screen.getByLabelText('Managed By'), { target: { value: 'Manager' } })

    fireEvent.click(screen.getByText(/save/i))

    await waitFor(() => expect(mockCreate).toHaveBeenCalled())
    await waitFor(() => expect(onSuccess).toHaveBeenCalled())
  })
})
