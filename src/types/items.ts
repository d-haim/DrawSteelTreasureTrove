export type Echelon = 'First' | 'Second' | 'Third' | 'Fourth' | string

export interface Project {
  prerequisite?: string
  source?: string
  characteristics?: string[]
  goal?: string
}

export interface BaseItem {
  name: string
  type: string
  echelon?: Echelon
  source?: string
  keywords?: string[]
  description?: string
  effect?: string
  project?: Project
}

export interface Consumable extends BaseItem {}

export interface Trinket extends BaseItem {}

export interface Leveled extends BaseItem {
  first_level?: string
  fifth_level?: string
  ninth_level?: string
}
