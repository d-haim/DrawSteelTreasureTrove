export type Echelon = 'First' | 'Second' | 'Third' | 'Fourth'

export interface Project {
  prerequisite?: string
  source?: string
  characteristics?: string[]
  goal?: string
}

export type PowerRoll = { marker: string; desc: string }

export interface Ability {
  name: string
  description?: string
  keywords?: string[]
  type?: string
  range?: string
  targets?: string
  effect?: string
  power_roll?: string[]
}

export interface BaseItem {
  name: string
  type: string
  echelon: Echelon
  source?: string
  keywords?: string[]
  description: string
  effect: string
  abilities?: Ability[]
  power_roll?: string[]
  project?: Project
}

export interface Consumable extends BaseItem {}

export interface Trinket extends BaseItem {}

export interface Leveled extends BaseItem {
  first_level?: string
  fifth_level?: string
  ninth_level?: string
}

// Type guard utility to check if an item is a Leveled item
export function isLeveledItem(item: BaseItem | (BaseItem & { __category?: string })): item is Leveled {
  return (
    ('__category' in item && item.__category === 'Leveled') ||
    'first_level' in item ||
    'fifth_level' in item ||
    'ninth_level' in item
  )
}
