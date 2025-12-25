import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ItemCard from './ItemCard'
import type { Consumable } from '../types/items'

describe('ItemCard', () => {
  const mockItem: Consumable = {
    name: 'Test Item',
    type: 'Consumable',
    echelon: 'First',
    description: 'Test description',
    effect: 'Test effect',
    keywords: ['Magic', 'Potion']
  }

  it('renders item name', () => {
    render(<ItemCard item={mockItem} />)
    expect(screen.getByText('Test Item')).toBeInTheDocument()
  })

  it('renders item type', () => {
    render(<ItemCard item={mockItem} />)
    expect(screen.getByText('Consumable')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<ItemCard item={mockItem} />)
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })

  it('renders effect', () => {
    render(<ItemCard item={mockItem} />)
    expect(screen.getByText(/Test effect/)).toBeInTheDocument()
  })

  it('renders keywords', () => {
    render(<ItemCard item={mockItem} />)
    expect(screen.getByText(/Magic/)).toBeInTheDocument()
    expect(screen.getByText(/Potion/)).toBeInTheDocument()
  })

  it('renders echelon', () => {
    render(<ItemCard item={mockItem} />)
    expect(screen.getByText(/First/)).toBeInTheDocument()
  })

  it('shows Add to deck button when not in deck', () => {
    render(<ItemCard item={mockItem} inDeck={false} onAddToDeck={() => {}} />)
    expect(screen.getByText('Add to deck')).toBeInTheDocument()
  })

  it('shows Remove from deck button when in deck', () => {
    render(<ItemCard item={mockItem} inDeck={true} onRemoveFromDeck={() => {}} />)
    expect(screen.getByText('Remove from deck')).toBeInTheDocument()
  })

  it('renders abilities when present', () => {
    const itemWithAbilities = {
      ...mockItem,
      abilities: [
        {
          name: 'Test Ability',
          description: 'Ability description'
        }
      ]
    }
    render(<ItemCard item={itemWithAbilities} />)
    expect(screen.getByText('Test Ability')).toBeInTheDocument()
    expect(screen.getByText('Ability description')).toBeInTheDocument()
  })

  it('renders project info when showProject is true', () => {
    const itemWithProject = {
      ...mockItem,
      project: {
        prerequisite: 'Level 5',
        source: 'Ancient ruins',
        characteristics: ['Rare', 'Valuable'],
        goal: 'Complete quest'
      }
    }
    render(<ItemCard item={itemWithProject} showProject={true} />)
    expect(screen.getByText(/Level 5/)).toBeInTheDocument()
  })

  it('does not render project info when showProject is false', () => {
    const itemWithProject = {
      ...mockItem,
      project: {
        prerequisite: 'Level 5',
        goal: 'Complete quest'
      }
    }
    render(<ItemCard item={itemWithProject} showProject={false} />)
    expect(screen.queryByText(/Level 5/)).not.toBeInTheDocument()
  })

  it('applies compact class when compact prop is true', () => {
    const { container } = render(<ItemCard item={mockItem} compact={true} />)
    expect(container.querySelector('.compact')).toBeInTheDocument()
  })

  it('handles item without keywords', () => {
    const itemWithoutKeywords = { ...mockItem, keywords: undefined }
    render(<ItemCard item={itemWithoutKeywords} />)
    expect(screen.getByText('Test Item')).toBeInTheDocument()
  })

  it('handles item without abilities', () => {
    const itemWithoutAbilities = { ...mockItem, abilities: undefined }
    render(<ItemCard item={itemWithoutAbilities} />)
    expect(screen.getByText('Test Item')).toBeInTheDocument()
  })
})
