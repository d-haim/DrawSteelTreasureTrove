import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PrintDeck from './PrintDeck'
import type { BaseItem } from '../types/items'

const baseProps = {
  onRemove: (_item: BaseItem) => {},
  onClear: () => {},
  includeProject: true
}

describe('PrintDeck', () => {
  it('disables expand/collapse and show deck when empty', () => {
    render(<PrintDeck {...baseProps} deck={[]} />)

    expect(screen.getByRole('button', { name: /Expand \(0\)/ })).toBeDisabled()
    expect(screen.getByRole('button', { name: /Show deck \(0\)/ })).toBeDisabled()
  })

  it('enables expand/collapse and show deck when items exist', () => {
    const deck: BaseItem[] = [
      {
        echelon: 'First',
        name: 'Test Item',
        type: 'Consumable',
        description: 'Desc',
        effect: 'Effect'
      }
    ]

    render(<PrintDeck {...baseProps} deck={deck} />)

    expect(screen.getByRole('button', { name: /Expand \(1\)/ })).not.toBeDisabled()
    expect(screen.getByRole('button', { name: /Show deck \(1\)/ })).not.toBeDisabled()
  })
})
