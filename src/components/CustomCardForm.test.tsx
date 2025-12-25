import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import CustomCardForm from './CustomCardForm'

describe('CustomCardForm', () => {
  it('renders collapsed by default', () => {
    render(<CustomCardForm onCreate={vi.fn()} />)
    expect(screen.getByText(/Create custom card/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Expand' })).toBeInTheDocument()
  })

  it('renders form header', () => {
    render(<CustomCardForm onCreate={vi.fn()} />)
    expect(screen.getByRole('heading', { name: 'Create custom card' })).toBeInTheDocument()
  })
  
  it('shows collapsed state message', () => {
    render(<CustomCardForm onCreate={vi.fn()} />)
    expect(screen.getByText(/Compact mode/)).toBeInTheDocument()
  })
})
