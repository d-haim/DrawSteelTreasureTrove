import React, { useMemo, useState } from 'react'
import ItemCard from './ItemCard'
import LeveledCard from './LeveledCard'
import type { Consumable, Trinket, Leveled, BaseItem } from '../types/items'

function textMatch(item: BaseItem, q: string) {
  if (!q) return true
  const s = q.toLowerCase()
  return (
    item.name.toLowerCase().includes(s) ||
    (item.description || '').toLowerCase().includes(s) ||
    (item.effect || '').toLowerCase().includes(s) ||
    (item.project?.prerequisite || '').toLowerCase().includes(s)
  )
}

function hasKeywords(item: BaseItem, keywords: string[]) {
  if (!keywords.length) return true
  const k = (item.keywords || []).map((x) => x.toLowerCase())
  return keywords.every((kw) => k.includes(kw.toLowerCase()))
}

export default function ItemList({
  consumables = [],
  trinkets = [],
  leveled = []
}: {
  consumables?: Consumable[]
  trinkets?: Trinket[]
  leveled?: Leveled[]
}) {
  const [query, setQuery] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedEchelons, setSelectedEchelons] = useState<string[]>([])
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])
  const [randomItem, setRandomItem] = useState<(BaseItem & { __category: string }) | null>(null)

  function pickRandom() {
    if (!filtered || filtered.length === 0) return
    const idx = Math.floor(Math.random() * filtered.length)
    setRandomItem(filtered[idx])
  }

  function clearRandom() {
    setRandomItem(null)
  }

  const allItems = useMemo(() => {
    return [
      ...consumables.map((c) => ({ ...c, __category: 'Consumable' })),
      ...trinkets.map((t) => ({ ...t, __category: 'Trinket' })),
      ...leveled.map((l) => ({ ...l, __category: 'Leveled' }))
    ] as (BaseItem & { __category: string })[]
  }, [consumables, trinkets, leveled])

  const allKeywords = useMemo(() => {
    const set = new Set<string>()
    allItems.forEach((it) => (it.keywords || []).forEach((k) => set.add(k)))
    return Array.from(set).sort()
  }, [allItems])

  const allEchelons = useMemo(() => {
    const set = new Set<string>()
    allItems.forEach((it) => it.echelon && set.add(it.echelon))
    return Array.from(set).sort()
  }, [allItems])

  const filtered = useMemo(() => {
    return allItems.filter((it) => {
      if (selectedTypes.length && !selectedTypes.includes((it as any).__category)) return false
      if (selectedEchelons.length && !(it.echelon && selectedEchelons.includes(it.echelon))) return false
      if (!hasKeywords(it, selectedKeywords)) return false
      if (!textMatch(it, query)) return false
      return true
    })
  }, [allItems, query, selectedTypes, selectedEchelons, selectedKeywords])

  function toggle<T extends string>(arr: T[], v: T) {
    return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]
  }

  return (
    <div className="lists">
      <div className="filters">
        <input
          className="search"
          placeholder="Search name, description, effects..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="filter-row">
          <div className="filter-group">
            <label>Type</label>
            <div className="chips">
              {['Consumable', 'Trinket', 'Leveled'].map((t) => (
                <button
                  key={t}
                  className={`chip-btn ${selectedTypes.includes(t) ? 'active' : ''}`}
                  onClick={() => setSelectedTypes(toggle(selectedTypes, t))}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Echelon</label>
            <div className="chips">
              {allEchelons.length ? (
                allEchelons.map((e) => (
                  <button
                    key={e}
                    className={`chip-btn ${selectedEchelons.includes(e) ? 'active' : ''}`}
                    onClick={() => setSelectedEchelons(toggle(selectedEchelons, e))}
                  >
                    {e}
                  </button>
                ))
              ) : (
                <em className="muted">No echelons</em>
              )}
            </div>
          </div>

          <div className="filter-group">
            <label>Keywords</label>
            <div className="chips keywords">
              {allKeywords.map((k) => (
                <button
                  key={k}
                  className={`chip-btn ${selectedKeywords.includes(k) ? 'active' : ''}`}
                  onClick={() => setSelectedKeywords(toggle(selectedKeywords, k))}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="filter-summary muted">
          Showing <strong>{filtered.length}</strong> result{filtered.length !== 1 ? 's' : ''}
        </div>

        <div className="random-controls">
          <button className="random-btn" onClick={pickRandom} disabled={filtered.length === 0}>
            Random Item
          </button>
          <button className="chip-btn" onClick={() => setSelectedTypes([])}>
            Clear Type Filters
          </button>
        </div>

        {randomItem && (
          <div className="random-panel">
            <div className="random-panel-header">
              <strong>Random pick</strong>
              <div>
                <button className="chip-btn" onClick={pickRandom} style={{ marginRight: 6 }}>
                  Pick again
                </button>
                <button className="chip-btn" onClick={clearRandom}>
                  Clear
                </button>
              </div>
            </div>

            <div className="random-panel-content">
              {randomItem.__category === 'Leveled' ? (
                <LeveledCard item={randomItem as Leveled} />
              ) : (
                <ItemCard item={randomItem as Consumable | Trinket} />
              )}
            </div>
          </div>
        )}
      </div>

      <section>
        <div className="grid">
          {filtered.map((it) =>
            (it.__category === 'Leveled' ? (
              <LeveledCard key={it.name} item={it as Leveled} />
            ) : (
              <ItemCard key={it.name} item={it as Consumable | Trinket} />
            ))
          )}
        </div>
      </section>
    </div>
  )
}
