import React, { useMemo, useState } from 'react'
import ItemCard from './ItemCard'
import LeveledCard from './LeveledCard'
import PrintDeck from './PrintDeck'
import CustomCardForm from './CustomCardForm'
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
  const [deck, setDeck] = useState<(BaseItem & { __category?: string })[]>([])
  const [includeProjectInPrint, setIncludeProjectInPrint] = useState(true)

  function addToDeck(item: BaseItem & { __category?: string }) {
    setDeck((d) => (d.some((x) => x.type === item.type && x.name === item.name) ? d : [...d, item]))
  }

  function removeFromDeck(item: BaseItem & { __category?: string }) {
    setDeck((d) => d.filter((x) => !(x.type === item.type && x.name === item.name)))
  }

  function clearDeck() {
    setDeck([])
  }

  function moveUp(item: BaseItem & { __category?: string }) {
    setDeck((d) => {
      const idx = d.findIndex((x) => x.type === item.type && x.name === item.name)
      if (idx <= 0) return d
      const next = [...d]
      const tmp = next[idx - 1]
      next[idx - 1] = next[idx]
      next[idx] = tmp
      return next
    })
  }

  function moveDown(item: BaseItem & { __category?: string }) {
    setDeck((d) => {
      const idx = d.findIndex((x) => x.type === item.type && x.name === item.name)
      if (idx < 0 || idx === d.length - 1) return d
      const next = [...d]
      const tmp = next[idx + 1]
      next[idx + 1] = next[idx]
      next[idx] = tmp
      return next
    })
  }

  function moveItem(from: number, to: number) {
    setDeck((d) => {
      if (from < 0 || from >= d.length) return d
      if (to < 0 || to >= d.length) return d
      const next = [...d]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      return next
    })
  }

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

  // Keep filteredItems with __category for adding to deck easily
  const filteredWithCategory = filtered as (BaseItem & { __category?: string })[]

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
                <LeveledCard item={randomItem as Leveled} onAddToDeck={() => addToDeck(randomItem)} />
              ) : (
                <ItemCard item={randomItem as Consumable | Trinket} onAddToDeck={() => addToDeck(randomItem)} />
              )}
            </div>
          </div>
        )}

        <div style={{ marginTop: 8, marginBottom: 8 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div className="muted">Print deck: <strong>{deck.length}</strong></div>
            <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input type="checkbox" checked={includeProjectInPrint} onChange={(e) => setIncludeProjectInPrint(e.target.checked)} />
              <span className="muted">Include project</span>
            </label>
          </div>

          <div style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="chip-btn" onClick={() => setDeck(filteredWithCategory.slice(0, 1))}>Add first result</button>
              <button className="chip-btn" onClick={() => setDeck(filteredWithCategory)}>Add all results</button>
              <button className="chip-btn" onClick={clearDeck}>Clear deck</button>
            </div>
          </div>

          <div style={{ marginTop: 8 }}>
            <label className="muted">Deck controls — you can also add/remove from cards</label>
          </div>

          {/* PrintDeck */}
          <div style={{ marginTop: 10 }}>
            <div className="print-deck-panel">
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <PrintDeck deck={deck} onRemove={removeFromDeck} onClear={clearDeck} includeProject={includeProjectInPrint} onMove={moveItem} />
                </div>

                <div style={{ width: 320 }}>
                  <CustomCardForm onCreate={(item) => addToDeck({ ...item, __category: 'Custom' })} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section>
        <div className="grid">
          {filtered.map((it) =>
            (it.__category === 'Leveled' ? (
              <LeveledCard
                key={it.name}
                item={it as Leveled}
                onAddToDeck={() => addToDeck(it as BaseItem & { __category?: string })}
                onRemoveFromDeck={() => removeFromDeck(it as BaseItem & { __category?: string })}
                inDeck={deck.some((x) => x.name === it.name && x.type === it.type)}
                showProject={includeProjectInPrint}
              />
            ) : (
              <ItemCard
                key={it.name}
                item={it as Consumable | Trinket}
                onAddToDeck={() => addToDeck(it as BaseItem & { __category?: string })}
                onRemoveFromDeck={() => removeFromDeck(it as BaseItem & { __category?: string })}
                inDeck={deck.some((x) => x.name === it.name && x.type === it.type)}
                showProject={includeProjectInPrint}
              />
            ))
          )}
        </div>
      </section>
    </div>
  )
}
