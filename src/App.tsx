import React, { useEffect, useState } from 'react'
import ItemList from './components/ItemList'
// Use Vite asset bundling to resolve hashed URLs for JSON files in production
import consumablesUrl from '../assets/Consumables.json?url'
import trinketsUrl from '../assets/Trinkets.json?url'
import leveledUrl from '../assets/Leveled.json?url'
import type { Consumable, Trinket, Leveled as LeveledType } from './types/items'

export default function App() {
  const [consumablesTyped, setConsumables] = useState<Consumable[]>([])
  const [trinketsTyped, setTrinkets] = useState<Trinket[]>([])
  const [leveledTyped, setLeveled] = useState<LeveledType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [cResp, tResp, lResp] = await Promise.all([
          fetch(consumablesUrl),
          fetch(trinketsUrl),
          fetch(leveledUrl)
        ])
        const [c, t, l] = await Promise.all([cResp.json(), tResp.json(), lResp.json()])
        if (!cancelled) {
          setConsumables(Array.isArray(c) ? (c as Consumable[]) : [])
          setTrinkets(Array.isArray(t) ? (t as Trinket[]) : [])
          setLeveled(Array.isArray(l) ? (l as LeveledType[]) : [])
          setLoading(false)
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || String(e))
          setLoading(false)
        }
      }
    }
    load()
    return () => { cancelled = true }
  }, [])
  return (
    <div className="app">
      <h1>Draw Steel - Treasure Trove</h1>
      <p>Create a printable deck of treasure cards for Draw Steel TTRPG.</p>

      {loading ? (
        <div className="muted">Loading items…</div>
      ) : (
        <ItemList consumables={consumablesTyped} trinkets={trinketsTyped} leveled={leveledTyped} />
      )}
      {error && (
        <div className="muted" style={{ color: 'red', marginTop: 8 }}>Error loading item data: {error}</div>
      )}

      <div className="disclaimer" style={{ marginTop: 18 }}>
        <p>Draw Steel Treasure Trove is an independent product published under the DRAW STEEL Creator License and is not affiliated with MCDM Productions, LLC.</p>
        <p>DRAW STEEL © 2024 MCDM Productions, LLC.</p>
        <p>
          Using the DS Open Glyphs font, created by MrMattDollar.{' '}
          <a href="https://mrmattdollar.itch.io/draw-steel-symbols-font" target="_blank" rel="noopener noreferrer">
            https://mrmattdollar.itch.io/draw-steel-symbols-font
          </a>
        </p>
      </div>
    </div>
  )
}
