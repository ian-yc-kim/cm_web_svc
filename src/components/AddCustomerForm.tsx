import React, { useState, useEffect } from 'react'
import type { CustomerRequest, Customer } from '../api/customerService'
import * as customerService from '../api/customerService'
import { validateCustomerForm } from '../utils/validation'

interface AddCustomerFormProps {
  isOpen: boolean
  onCancel: () => void
  onSuccess: (created: Customer) => void
}

export default function AddCustomerForm({ isOpen, onCancel, onSuccess }: AddCustomerFormProps): JSX.Element | null {
  const [customerName, setCustomerName] = useState<string>('')
  const [customerContact, setCustomerContact] = useState<string>('')
  const [customerAddress, setCustomerAddress] = useState<string>('')
  const [managedBy, setManagedBy] = useState<string>('')
  const [errors, setErrors] = useState<Record<string, string | null>>({})
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setCustomerName('')
      setCustomerContact('')
      setCustomerAddress('')
      setManagedBy('')
      setErrors({})
      setSubmitError(null)
      setIsSubmitting(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  function validateAll(): boolean {
    const res = validateCustomerForm({ customer_name: customerName, customer_contact: customerContact, customer_address: customerAddress, managed_by: managedBy })
    const errs: Record<string, string | null> = {}
    errs.customer_name = res.customer_name ?? null
    errs.customer_contact = res.customer_contact ?? null
    errs.customer_address = res.customer_address ?? null
    errs.managed_by = res.managed_by ?? null
    setErrors(errs)
    return !errs.customer_name && !errs.customer_contact && !errs.customer_address && !errs.managed_by
  }

  async function handleSubmit(e?: React.FormEvent): Promise<void> {
    if (e) e.preventDefault()
    setSubmitError(null)
    if (!validateAll()) return
    setIsSubmitting(true)
    try {
      const payload: CustomerRequest = {
        customer_name: customerName,
        customer_contact: customerContact,
        customer_address: customerAddress,
        managed_by: managedBy,
      }
      const created = await customerService.createCustomer(payload)
      onSuccess(created)
    } catch (err: unknown) {
      console.error('Component:', err)
      const anyErr = err as any
      setSubmitError(anyErr?.message ? String(anyErr.message) : 'Failed to create customer')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div role="dialog" aria-modal="true" aria-label="Add customer dialog" style={{ position: 'fixed', left: 0, top: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: 16, minWidth: 320, borderRadius: 6 }}>
        <h3>Add Customer</h3>

        <div>
          <label htmlFor="customerName">Name</label>
          <input id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} onBlur={validateAll} disabled={isSubmitting} />
          {errors.customer_name ? <div role="alert">{errors.customer_name}</div> : null}
        </div>

        <div>
          <label htmlFor="customerContact">Contact</label>
          <input id="customerContact" value={customerContact} onChange={(e) => setCustomerContact(e.target.value)} onBlur={validateAll} disabled={isSubmitting} />
          {errors.customer_contact ? <div role="alert">{errors.customer_contact}</div> : null}
        </div>

        <div>
          <label htmlFor="customerAddress">Address</label>
          <input id="customerAddress" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} onBlur={validateAll} disabled={isSubmitting} />
          {errors.customer_address ? <div role="alert">{errors.customer_address}</div> : null}
        </div>

        <div>
          <label htmlFor="managedBy">Managed By</label>
          <input id="managedBy" value={managedBy} onChange={(e) => setManagedBy(e.target.value)} onBlur={validateAll} disabled={isSubmitting} />
          {errors.managed_by ? <div role="alert">{errors.managed_by}</div> : null}
        </div>

        {submitError ? <div role="alert">{submitError}</div> : null}

        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={isSubmitting}>Save</button>
          <button type="button" onClick={onCancel} disabled={isSubmitting} style={{ marginLeft: 8 }}>Cancel</button>
        </div>
      </form>
    </div>
  )
}
