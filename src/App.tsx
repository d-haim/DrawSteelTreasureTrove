import React from 'react'
import ItemList from './components/ItemList'
import consumables from '../assets/Consumables.json'
import trinkets from '../assets/Trinkets.json'
import leveled from '../assets/Leveled.json'
import type { Consumable, Trinket, Leveled as LeveledType } from './types/items'

const consumablesTyped = consumables as unknown as Consumable[]
const trinketsTyped = trinkets as unknown as Trinket[]
const leveledTyped = leveled as unknown as LeveledType[]

export default function App() {
  return (
    <div className="app">
      <h1>Draw Steel - Treasure Trove</h1>
      <p>Create a printable deck of treasure cards for Draw Steel TTRPG.</p>

      <ItemList consumables={consumablesTyped} trinkets={trinketsTyped} leveled={leveledTyped} />

      <div className="disclaimer" style={{ marginTop: 18 }}>
        <p>Draw Steel Treasure Trove is an independent product published under the DRAW STEEL Creator License and is not affiliated with MCDM Productions, LLC.</p>
        <p>DRAW STEEL © 2024 MCDM Productions, LLC.</p>
      </div>
    </div>
  )
}
