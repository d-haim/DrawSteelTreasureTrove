import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ItemList from './ItemList'
import type { Consumable, Trinket, Leveled } from '../types/items'

describe('ItemList', () => {
  const mockConsumables: Consumable[] = [
    {
      name: 'Healing Potion',
      type: 'Consumable',
      echelon: 'First',
      description: 'Restores health',
      effect: 'Heal 2d6 HP',
      keywords: ['Magic', 'Healing']
    },
    {
      name: 'Fire Bomb',
      type: 'Consumable',
      echelon: 'Second',
      description: 'Explosive device',
      effect: 'Deal 3d6 fire damage',
      keywords: ['Fire', 'Damage']
    }
  ]

  const mockTrinkets: Trinket[] = [
    {
      name: 'Lucky Coin',
      type: 'Trinket',
      echelon: 'First',
      description: 'Brings luck',
      effect: '+1 to luck rolls',
      keywords: ['Luck']
    }
  ]

  const mockLeveled: Leveled[] = [
    {
      name: 'Scaling Sword',
      type: 'Weapon',
      echelon: 'Third',
      description: 'Grows with user',
      effect: 'Base damage',
      first_level: 'First level effect',
      fifth_level: 'Fifth level effect',
      ninth_level: 'Ninth level effect',
      keywords: ['Weapon', 'Scaling']
    }
  ]

  it('renders all items by default', () => {
    render(<ItemList consumables={mockConsumables} trinkets={mockTrinkets} leveled={mockLeveled} />)
    
    expect(screen.getByText('Healing Potion')).toBeInTheDocument()
    expect(screen.getByText('Fire Bomb')).toBeInTheDocument()
    expect(screen.getByText('Lucky Coin')).toBeInTheDocument()
    expect(screen.getByText('Scaling Sword')).toBeInTheDocument()
  })

  it('displays correct result count', () => {
    render(<ItemList consumables={mockConsumables} trinkets={mockTrinkets} leveled={mockLeveled} />)
    expect(screen.getByText(/Showing/)).toBeInTheDocument()
    expect(screen.getByText('4', { exact: false })).toBeInTheDocument()
  })

  it('renders type filter buttons', () => {
    render(<ItemList consumables={mockConsumables} trinkets={mockTrinkets} leveled={mockLeveled} />)
    
    expect(screen.getByRole('button', { name: 'Consumable' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Trinket' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Leveled' })).toBeInTheDocument()
  })

  it('renders echelon filter buttons', () => {
    render(<ItemList consumables={mockConsumables} trinkets={mockTrinkets} leveled={mockLeveled} />)
    
    expect(screen.getByRole('button', { name: 'First' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Second' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Third' })).toBeInTheDocument()
  })

  it('renders keyword filter buttons', () => {
    render(<ItemList consumables={mockConsumables} trinkets={mockTrinkets} leveled={mockLeveled} />)
    
    expect(screen.getByRole('button', { name: 'Magic' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Healing' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Fire' })).toBeInTheDocument()
  })

  it('filters items by type', async () => {
    const user = userEvent.setup()
    render(<ItemList consumables={mockConsumables} trinkets={mockTrinkets} leveled={mockLeveled} />)
    
    const consumableButton = screen.getByRole('button', { name: 'Consumable' })
    await user.click(consumableButton)
    
    expect(screen.getByText('Healing Potion')).toBeInTheDocument()
    expect(screen.getByText('Fire Bomb')).toBeInTheDocument()
    expect(screen.queryByText('Lucky Coin')).not.toBeInTheDocument()
    expect(screen.queryByText('Scaling Sword')).not.toBeInTheDocument()
  })

  it('filters items by echelon', async () => {
    const user = userEvent.setup()
    render(<ItemList consumables={mockConsumables} trinkets={mockTrinkets} leveled={mockLeveled} />)
    
    const firstEchelonButton = screen.getByRole('button', { name: 'First' })
    await user.click(firstEchelonButton)
    
    expect(screen.getByText('Healing Potion')).toBeInTheDocument()
    expect(screen.getByText('Lucky Coin')).toBeInTheDocument()
    expect(screen.queryByText('Fire Bomb')).not.toBeInTheDocument()
  })

  it('filters items by keyword', async () => {
    const user = userEvent.setup()
    render(<ItemList consumables={mockConsumables} trinkets={mockTrinkets} leveled={mockLeveled} />)
    
    const magicButton = screen.getByRole('button', { name: 'Magic' })
    await user.click(magicButton)
    
    expect(screen.getByText('Healing Potion')).toBeInTheDocument()
    expect(screen.queryByText('Fire Bomb')).not.toBeInTheDocument()
  })

  it('searches items by text', async () => {
    const user = userEvent.setup()
    render(<ItemList consumables={mockConsumables} trinkets={mockTrinkets} leveled={mockLeveled} />)
    
    const searchInput = screen.getByPlaceholderText(/Search/i)
    await user.type(searchInput, 'healing')
    
    expect(screen.getByText('Healing Potion')).toBeInTheDocument()
    expect(screen.queryByText('Fire Bomb')).not.toBeInTheDocument()
  })

  it('shows Random Item button', () => {
    render(<ItemList consumables={mockConsumables} trinkets={mockTrinkets} leveled={mockLeveled} />)
    expect(screen.getByRole('button', { name: 'Random Item' })).toBeInTheDocument()
  })

  it('shows Clear filters button', () => {
    render(<ItemList consumables={mockConsumables} trinkets={mockTrinkets} leveled={mockLeveled} />)
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument()
  })

  it('clears all filters when Clear filters is clicked', async () => {
    const user = userEvent.setup()
    render(<ItemList consumables={mockConsumables} trinkets={mockTrinkets} leveled={mockLeveled} />)
    
    // Apply filters
    const consumableButton = screen.getByRole('button', { name: 'Consumable' })
    await user.click(consumableButton)
    
    const searchInput = screen.getByPlaceholderText(/Search/i)
    await user.type(searchInput, 'healing')
    
    // Clear filters
    const clearButton = screen.getByRole('button', { name: 'Clear filters' })
    await user.click(clearButton)
    
    // All items should be visible again
    expect(screen.getByText('Healing Potion')).toBeInTheDocument()
    expect(screen.getByText('Fire Bomb')).toBeInTheDocument()
    expect(screen.getByText('Lucky Coin')).toBeInTheDocument()
    expect(screen.getByText('Scaling Sword')).toBeInTheDocument()
  })

  it('renders deck management controls', () => {
    render(<ItemList consumables={mockConsumables} trinkets={mockTrinkets} leveled={mockLeveled} />)
    
    expect(screen.getByRole('button', { name: 'Add first result' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add all results' })).toBeInTheDocument()
    // Multiple "Clear deck" buttons exist, use getAllByRole
    const clearButtons = screen.getAllByRole('button', { name: 'Clear deck' })
    expect(clearButtons.length).toBeGreaterThan(0)
  })

  it('shows Include project checkbox', () => {
    render(<ItemList consumables={mockConsumables} trinkets={mockTrinkets} leveled={mockLeveled} />)
    expect(screen.getByLabelText(/Include project/i)).toBeInTheDocument()
  })

  it('handles empty lists gracefully', () => {
    render(<ItemList consumables={[]} trinkets={[]} leveled={[]} />)
    // Check that it shows the results count message
    const filterSummary = screen.getByText((content, element) => {
      return element?.className === 'filter-summary muted' && /Showing/.test(content)
    })
    expect(filterSummary).toBeInTheDocument()
  })

  it('combines multiple filters correctly', async () => {
    const user = userEvent.setup()
    render(<ItemList consumables={mockConsumables} trinkets={mockTrinkets} leveled={mockLeveled} />)
    
    // Filter by type
    const consumableButton = screen.getByRole('button', { name: 'Consumable' })
    await user.click(consumableButton)
    
    // Filter by echelon
    const firstEchelonButton = screen.getByRole('button', { name: 'First' })
    await user.click(firstEchelonButton)
    
    // Only Healing Potion should match both filters
    expect(screen.getByText('Healing Potion')).toBeInTheDocument()
    expect(screen.queryByText('Fire Bomb')).not.toBeInTheDocument()
    expect(screen.queryByText('Lucky Coin')).not.toBeInTheDocument()
  })
})
