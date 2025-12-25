import React from 'react'
import ItemList from './components/ItemList'
import consumables from '../Consumables.json'
import trinkets from '../Trinkets.json'
import leveled from '../Leveled.json'

export default function App() {
  return (
    <div className="app">
      <h1>Draw Steel — Treasure Trove</h1>
      <p>Below are the items imported from the local JSON files.</p>

      <ItemList consumables={consumables} trinkets={trinkets} leveled={leveled} />
    </div>
  )
}
