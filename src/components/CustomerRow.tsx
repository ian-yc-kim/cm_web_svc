import React, { useState } from 'react'
import type { Customer, CustomerRequest } from '../api/customerService'
import * as customerService from '../api/customerService'
import { validateCustomerForm } from '../utils/validation'

interface CustomerRowProps {
  customer: Customer
  onSaved: (updated: Customer) => void
  onDeleted: (id: string) => void
}

export default function CustomerRow({ customer, onSaved, onDeleted }: CustomerRowProps): JSX.Element {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [name, setName] = useState<string>(customer.customer_name)
  const [contact, setContact] = useState<string>(customer.customer_contact)
  const [address, setAddress] = useState<string>(customer.customer_address)
  const [managedBy, setManagedBy] = useState<string>(customer.managed_by)
  const [errors, setErrors] = useState<Record<string, string | null>>({})
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [opError, setOpError] = useState<string | null>(null)

  function validateAll(): boolean {
    const res = validateCustomerForm({ customer_name: name, customer_contact: contact, customer_address: address, managed_by: managedBy })
    const errs: Record<string, string | null> = {}
    errs.customer_name = res.customer_name ?? null
    errs.customer_contact = res.customer_contact ?? null
    errs.customer_address = res.customer_address ?? null
    errs.managed_by = res.managed_by ?? null
    setErrors(errs)
    return !errs.customer_name && !errs.customer_contact && !errs.customer_address && !errs.managed_by
  }

  async function handleSave(): Promise<void> {
    setOpError(null)
    if (!validateAll()) return
    setIsSaving(true)
    try {
      const payload: CustomerRequest = { customer_name: name, customer_contact: contact, customer_address: address, managed_by: managedBy }
      const updated = await customerService.updateCustomer(customer.customer_id, payload)
      onSaved(updated)
      setIsEditing(false)
    } catch (err: unknown) {
      console.error('Component:', err)
      const anyErr = err as any
      setOpError(anyErr?.message ? String(anyErr.message) : 'Failed to update customer')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(): Promise<void> {
    setOpError(null)
    const ok = window.confirm('Are you sure you want to delete this customer?')
    if (!ok) return
    setIsDeleting(true)
    try {
      await customerService.deleteCustomer(customer.customer_id)
      onDeleted(customer.customer_id)
    } catch (err: unknown) {
      console.error('Component:', err)
      const anyErr = err as any
      setOpError(anyErr?.message ? String(anyErr.message) : 'Failed to delete customer')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <tr>
      <td>{customer.customer_id}</td>
      <td>
        {isEditing ? <input value={name} onChange={(e) => setName(e.target.value)} disabled={isSaving} /> : <>{customer.customer_name}</>}
        {errors.customer_name ? <div role="alert">{errors.customer_name}</div> : null}
      </td>
      <td>
        {isEditing ? <input value={contact} onChange={(e) => setContact(e.target.value)} disabled={isSaving} /> : <>{customer.customer_contact}</>}
        {errors.customer_contact ? <div role="alert">{errors.customer_contact}</div> : null}
      </td>
      <td>
        {isEditing ? <input value={address} onChange={(e) => setAddress(e.target.value)} disabled={isSaving} /> : <>{customer.customer_address}</>}
        {errors.customer_address ? <div role="alert">{errors.customer_address}</div> : null}
      </td>
      <td>
        {isEditing ? <input value={managedBy} onChange={(e) => setManagedBy(e.target.value)} disabled={isSaving} /> : <>{customer.managed_by}</>}
        {errors.managed_by ? <div role="alert">{errors.managed_by}</div> : null}
      </td>
      <td>
        {isEditing ? (
          <>
            <button onClick={handleSave} disabled={isSaving}>Save</button>
            <button onClick={() => { setIsEditing(false); setName(customer.customer_name); setContact(customer.customer_contact); setAddress(customer.customer_address); setManagedBy(customer.managed_by); setErrors({}) }} disabled={isSaving} style={{ marginLeft: 8 }}>Cancel</button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={handleDelete} disabled={isDeleting} style={{ marginLeft: 8 }}>Delete</button>
          </>
        )}
        {opError ? <div role="alert">{opError}</div> : null}
      </td>
    </tr>
  )
}
