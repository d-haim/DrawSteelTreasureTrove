import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LeveledCard from './LeveledCard'
import type { Leveled } from '../types/items'

describe('LeveledCard', () => {
  const mockLeveledItem: Leveled = {
    name: 'Leveled Test Item',
    type: 'Leveled',
    echelon: 'Second',
    description: 'Leveled item description',
    effect: 'Base effect',
    first_level: 'Effect at 1st level',
    fifth_level: 'Effect at 5th level',
    ninth_level: 'Effect at 9th level',
    keywords: ['Magic', 'Scaling']
  }

  it('renders item name', () => {
    render(<LeveledCard item={mockLeveledItem} />)
    expect(screen.getByText('Leveled Test Item')).toBeInTheDocument()
  })

  it('renders item type', () => {
    render(<LeveledCard item={mockLeveledItem} />)
    expect(screen.getByText('Leveled')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<LeveledCard item={mockLeveledItem} />)
    expect(screen.getByText('Leveled item description')).toBeInTheDocument()
  })

  it('renders keywords', () => {
    render(<LeveledCard item={mockLeveledItem} />)
    expect(screen.getByText(/Magic/)).toBeInTheDocument()
    expect(screen.getByText(/Scaling/)).toBeInTheDocument()
  })

  it('renders 1st level entry', () => {
    render(<LeveledCard item={mockLeveledItem} />)
    expect(screen.getByText(/1st Level/)).toBeInTheDocument()
  })

  it('renders 5th level entry', () => {
    render(<LeveledCard item={mockLeveledItem} />)
    expect(screen.getByText(/5th Level/)).toBeInTheDocument()
  })

  it('renders 9th level entry', () => {
    render(<LeveledCard item={mockLeveledItem} />)
    expect(screen.getByText(/9th Level/)).toBeInTheDocument()
  })

  it('shows Add to deck button when not in deck', () => {
    render(<LeveledCard item={mockLeveledItem} inDeck={false} onAddToDeck={() => {}} />)
    expect(screen.getByText('Add to deck')).toBeInTheDocument()
  })

  it('shows Remove from deck button when in deck', () => {
    render(<LeveledCard item={mockLeveledItem} inDeck={true} onRemoveFromDeck={() => {}} />)
    expect(screen.getByText('Remove from deck')).toBeInTheDocument()
  })

  it('handles missing level entries gracefully', () => {
    const itemWithMissingLevels: Leveled = {
      ...mockLeveledItem,
      first_level: undefined,
      fifth_level: 'Only 5th level'
    }
    render(<LeveledCard item={itemWithMissingLevels} />)
    expect(screen.queryByText(/1st Level/)).not.toBeInTheDocument()
    expect(screen.getByText(/5th Level/)).toBeInTheDocument()
  })

  it('applies compact class when compact prop is true', () => {
    const { container } = render(<LeveledCard item={mockLeveledItem} compact={true} />)
    expect(container.querySelector('.compact')).toBeInTheDocument()
  })

  it('renders project info when showProject is true', () => {
    const itemWithProject: Leveled = {
      ...mockLeveledItem,
      project: {
        prerequisite: 'Level 10',
        goal: 'Master the artifact'
      }
    }
    render(<LeveledCard item={itemWithProject} showProject={true} />)
    expect(screen.getByText(/Level 10/)).toBeInTheDocument()
  })

  it('does not render project info when showProject is false', () => {
    const itemWithProject: Leveled = {
      ...mockLeveledItem,
      project: {
        prerequisite: 'Level 10',
        goal: 'Master the artifact'
      }
    }
    render(<LeveledCard item={itemWithProject} showProject={false} />)
    expect(screen.queryByText(/Level 10/)).not.toBeInTheDocument()
  })
})
