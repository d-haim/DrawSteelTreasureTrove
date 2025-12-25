import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import App from './App'

// Mock the asset URLs
vi.mock('../../assets/Consumables.json?url', () => ({
  default: '/mock/consumables.json'
}))

vi.mock('../../assets/Trinkets.json?url', () => ({
  default: '/mock/trinkets.json'
}))

vi.mock('../../assets/Leveled.json?url', () => ({
  default: '/mock/leveled.json'
}))

// Mock fetch
global.fetch = vi.fn()

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders app title', () => {
    ;(global.fetch as any).mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve([])
      })
    )

    render(<App />)
    expect(screen.getByText('Draw Steel - Treasure Trove')).toBeInTheDocument()
  })

  it('renders app description', () => {
    ;(global.fetch as any).mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve([])
      })
    )

    render(<App />)
    expect(screen.getByText(/Create a printable deck of treasure cards/)).toBeInTheDocument()
  })

  it('shows loading state initially', () => {
    ;(global.fetch as any).mockImplementation(() =>
      new Promise(() => {}) // Never resolves
    )

    render(<App />)
    expect(screen.getByText(/Loading items/)).toBeInTheDocument()
  })

  it('loads and displays items after fetch', async () => {
    const mockConsumables = [
      {
        name: 'Test Potion',
        type: 'Consumable',
        echelon: 'First',
        description: 'Test',
        effect: 'Test effect'
      }
    ]

    ;(global.fetch as any).mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockConsumables)
      })
    )

    render(<App />)

    await waitFor(() => {
      expect(screen.queryByText(/Loading items/)).not.toBeInTheDocument()
    })
  })

  it('displays error message on fetch failure', async () => {
    ;(global.fetch as any).mockImplementation(() =>
      Promise.reject(new Error('Network error'))
    )

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText(/Error loading item data/)).toBeInTheDocument()
    })
  })

  it('renders disclaimer section', () => {
    ;(global.fetch as any).mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve([])
      })
    )

    render(<App />)
    expect(screen.getByText(/DRAW STEEL Creator License/)).toBeInTheDocument()
    expect(screen.getByText(/DRAW STEEL © 2024 MCDM Productions/)).toBeInTheDocument()
  })

  it('renders DS Open Glyphs credit with link', () => {
    ;(global.fetch as any).mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve([])
      })
    )

    render(<App />)
    expect(screen.getByText(/DS Open Glyphs font/)).toBeInTheDocument()
    
    const link = screen.getByRole('link', { name: /mrmattdollar/i })
    expect(link).toHaveAttribute('href', 'https://mrmattdollar.itch.io/draw-steel-symbols-font')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('fetches all three JSON files', async () => {
    ;(global.fetch as any).mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve([])
      })
    )

    render(<App />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(3)
    })

    // Check that fetch was called with the right number of times,
    // actual URLs will be Vite asset paths
    const calls = (global.fetch as any).mock.calls
    expect(calls).toHaveLength(3)
  })

  it('handles non-array JSON responses', async () => {
    ;(global.fetch as any).mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve({ invalid: 'data' })
      })
    )

    render(<App />)

    await waitFor(() => {
      expect(screen.queryByText(/Loading items/)).not.toBeInTheDocument()
    })

    // Should render with empty arrays instead of crashing
    expect(screen.getByText('Draw Steel - Treasure Trove')).toBeInTheDocument()
  })
})
