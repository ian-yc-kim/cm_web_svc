import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import Pagination from './Pagination'

describe('Pagination', () => {
  it('renders page buttons and prev/next and highlights current', () => {
    const onPageChange = vi.fn()
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />)

    expect(screen.getByLabelText('Previous page')).toBeInTheDocument()
    expect(screen.getByLabelText('Next page')).toBeInTheDocument()

    for (let p = 1; p <= 5; p++) {
      expect(screen.getByLabelText(`Page ${p}`)).toBeInTheDocument()
    }

    const current = screen.getByLabelText('Page 3')
    expect(current).toHaveAttribute('aria-current', 'page')
  })

  it('calls onPageChange with correct values', () => {
    const onPageChange = vi.fn()
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />)

    fireEvent.click(screen.getByLabelText('Previous page'))
    expect(onPageChange).toHaveBeenCalledWith(2)

    fireEvent.click(screen.getByLabelText('Next page'))
    expect(onPageChange).toHaveBeenCalledWith(4)

    fireEvent.click(screen.getByLabelText('Page 1'))
    expect(onPageChange).toHaveBeenCalledWith(1)
  })

  it('disables prev on first and next on last', () => {
    const onPageChange = vi.fn()
    render(<Pagination currentPage={1} totalPages={1} onPageChange={onPageChange} />)

    expect(screen.getByLabelText('Previous page')).toBeDisabled()
    expect(screen.getByLabelText('Next page')).toBeDisabled()
  })
})
