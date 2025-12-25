import { describe, it, expect, vi, beforeEach } from 'vitest'
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
globalThis.fetch = vi.fn() as any

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders app title', () => {
    vi.mocked(globalThis.fetch).mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve([])
      } as Response)
    )

    render(<App />)
    expect(screen.getByText('Draw Steel - Treasure Trove')).toBeInTheDocument()
  })

  it('renders app description', () => {
    vi.mocked(globalThis.fetch).mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve([])
      } as Response)
    )

    render(<App />)
    expect(screen.getByText(/Create a printable deck of treasure cards/)).toBeInTheDocument()
  })

  it('shows loading state initially', () => {
    vi.mocked(globalThis.fetch).mockImplementation(() =>
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

    vi.mocked(globalThis.fetch).mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockConsumables)
      } as Response)
    )

    render(<App />)

    await waitFor(() => {
      expect(screen.queryByText(/Loading items/)).not.toBeInTheDocument()
    })
  })

  it('displays error message on fetch failure', async () => {
    vi.mocked(globalThis.fetch).mockImplementation(() =>
      Promise.reject(new Error('Network error'))
    )

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText(/Error loading item data/)).toBeInTheDocument()
    })
  })

  it('renders disclaimer section', () => {
    vi.mocked(globalThis.fetch).mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve([])
      } as Response)
    )

    render(<App />)
    expect(screen.getByText(/DRAW STEEL Creator License/)).toBeInTheDocument()
    expect(screen.getByText(/DRAW STEEL © 2024 MCDM Productions/)).toBeInTheDocument()
  })

  it('renders DS Open Glyphs credit with link', () => {
    vi.mocked(globalThis.fetch).mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve([])
      } as Response)
    )

    render(<App />)
    expect(screen.getByText(/DS Open Glyphs font/)).toBeInTheDocument()
    
    const link = screen.getByRole('link', { name: /mrmattdollar/i })
    expect(link).toHaveAttribute('href', 'https://mrmattdollar.itch.io/draw-steel-symbols-font')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('fetches all three JSON files', async () => {
    vi.mocked(globalThis.fetch).mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve([])
      } as Response)
    )

    render(<App />)

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledTimes(3)
    })

    // Check that fetch was called with the right number of times,
    // actual URLs will be Vite asset paths
    const calls = vi.mocked(globalThis.fetch).mock.calls
    expect(calls).toHaveLength(3)
  })

  it('handles non-array JSON responses', async () => {
    vi.mocked(globalThis.fetch).mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve({ invalid: 'data' })
      } as Response)
    )

    render(<App />)

    await waitFor(() => {
      expect(screen.queryByText(/Loading items/)).not.toBeInTheDocument()
    })

    // Should render with empty arrays instead of crashing
    expect(screen.getByText('Draw Steel - Treasure Trove')).toBeInTheDocument()
  })
})
