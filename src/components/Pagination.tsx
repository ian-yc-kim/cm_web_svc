import React from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  disabled?: boolean
}

export default function Pagination({ currentPage, totalPages, onPageChange, disabled = false }: PaginationProps): JSX.Element {
  const handlePrev = (): void => {
    if (disabled) return
    const target = Math.max(1, currentPage - 1)
    if (target !== currentPage) onPageChange(target)
  }

  const handleNext = (): void => {
    if (disabled) return
    const target = Math.min(totalPages, currentPage + 1)
    if (target !== currentPage) onPageChange(target)
  }

  const handlePage = (page: number): void => {
    if (disabled) return
    if (page < 1 || page > totalPages) return
    if (page !== currentPage) onPageChange(page)
  }

  const pages = Array.from({ length: Math.max(0, totalPages) }, (_, i) => i + 1)

  return (
    <nav aria-label="Pagination Navigation">
      <button aria-label="Previous page" disabled={disabled || currentPage <= 1} onClick={handlePrev}>
        Previous
      </button>

      {pages.map((p) => (
        <button
          key={p}
          aria-label={`Page ${p}`}
          aria-current={p === currentPage ? 'page' : undefined}
          onClick={() => handlePage(p)}
          disabled={disabled}
          style={p === currentPage ? { fontWeight: 'bold' } : undefined}
        >
          {p}
        </button>
      ))}

      <button aria-label="Next page" disabled={disabled || currentPage >= totalPages} onClick={handleNext}>
        Next
      </button>
    </nav>
  )
}
