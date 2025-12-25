import React from 'react'
import ItemList from './components/ItemList'
import consumables from '../Consumables.json'
import trinkets from '../Trinkets.json'
import leveled from '../Leveled.json'
import type { Consumable, Trinket, Leveled as LeveledType } from './types/items'

const consumablesTyped = consumables as unknown as Consumable[]
const trinketsTyped = trinkets as unknown as Trinket[]
const leveledTyped = leveled as unknown as LeveledType[]

export default function App() {
  return (
    <div className="app">
      <h1>Draw Steel — Treasure Trove</h1>
      <p>Create a printable deck of treasure cards for Draw Steel TTRPG.</p>

      <ItemList consumables={consumablesTyped} trinkets={trinketsTyped} leveled={leveledTyped} />
    </div>
  )
}
