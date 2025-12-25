import React from 'react'
import ItemList from './components/ItemList'
import consumables from '../Consumables.json'
import trinkets from '../Trinkets.json'
import leveled from '../Leveled.json'

export default function App() {
  return (
    <div className="app">
      <h1>Draw Steel — Treasure Trove</h1>
      <p>Create a printable deck of treasure cards for Draw Steel TTRPG.</p>

      <ItemList consumables={consumables} trinkets={trinkets} leveled={leveled} />
    </div>
  )
}
