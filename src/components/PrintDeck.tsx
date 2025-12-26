import React, { useState, useRef } from 'react'
import type { BaseItem } from '../types/items'
import { isLeveledItem } from '../types/items'
import ItemCard from './ItemCard'
import LeveledCard from './LeveledCard'
import { formatPowerRollsHtml, formatAbilitiesHtmlStructured, markerToGlyphHtml, replacePotencyGlyphsHtml, escapeHtml, extractPowerRollMarker } from '../utils/format'
// Removed duplicate escapeHtml function
// Use Vite asset bundling to get the correct hashed URL for the font in production
// Path from src/components to assets at project root
import dsOpenGlyphsUrl from '../../assets/DS Open Glyphs 1.75 Regular.ttf?url'

export default function PrintDeck({
  deck,
  onRemove,
  onClear,
  includeProject,
  onMove,
  onImport
}: {
  deck: (BaseItem & { __category?: string })[]
  onRemove: (item: BaseItem) => void
  onClear: () => void
  includeProject: boolean
  onMove?: (from: number, to: number) => void
  onImport?: (items: BaseItem[]) => void
}) {
  const [collapsed, setCollapsed] = useState(true)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  function triggerImport() {
    // Clear the value first so selecting the same file again will still trigger a change event
    if (fileInputRef.current) fileInputRef.current.value = ''
    fileInputRef.current?.click()
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const json = JSON.parse(text)
      if (!Array.isArray(json)) {
        alert('Invalid JSON: expected an array of items')
        return
      }
      
      // Validate that items have required fields
      const invalidItems = json.filter((it: any, idx: number) => {
        if (!it || typeof it !== 'object') return true
        if (!it.name || typeof it.name !== 'string') return true
        if (!it.type || typeof it.type !== 'string') return true
        return false
      })
      
      if (invalidItems.length > 0) {
        alert(`Invalid items found: ${invalidItems.length} items are missing required fields (name, type)`)
        return
      }
      
      const normalized = json.map((it: any) => ({ ...it }))
      ;(onImport as any)?.(normalized)
    } catch (err: any) {
      alert('Could not import JSON: ' + (err && err.message ? err.message : String(err)))
    }
    e.currentTarget.value = ''
  }

  function showDeck() {
    function levelSummary(text: string) {
      if (!text) return ''
      const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
      const parts = lines.map((line) => {
        const parsed = extractPowerRollMarker(line)
        return parsed ? parsed.desc : line
      })
      return parts.join(' ')
    }
    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Deck</title>
          <style>
            @font-face{
              font-family: 'DS Open Glyphs';
              src: url('${dsOpenGlyphsUrl}') format('truetype');
              font-weight: normal;
              font-style: normal;
              font-display: swap;
            }
            /* Base styles mirror print for accurate preview */
            body{ font-family: Arial, Helvetica, sans-serif; margin: 8mm; color:#111; font-size:12px }
            .print-grid{ display:grid; grid-template-columns: repeat(2, 1fr); gap:8px; width: 194mm }
            .print-card{ border:1px solid #ddd; padding:8px; border-radius:6px; box-shadow:none; background:#fff; box-sizing:border-box; font-size:12px }
            .print-card h3{ font-size:14px; margin-bottom:6px }
            .muted{ color:#666; font-size:0.9rem }
            .effect{ margin-top:8px }
            .project{ margin-top:8px; font-size:12px; color:#111; font-family: inherit; }
            .power-roll{ margin-top:6px }
            .power-roll .range{ display:inline; font-weight:700 }
            .power-roll .pr-desc{ display:inline-block }
            .power-roll.power-roll-header{ background: #f7f7f7; padding:6px; border-radius:6px; font-weight:700; display:block }
            .item-power-rolls{ margin-top:8px; padding-top:6px }
            .ds-glyph{ font-family: 'DS Open Glyphs', monospace; font-size:1.25em; display:inline-block; width:auto; line-height:1; color:#000 }
            .leveled-line{ margin: 0.5em 0; }
            /* ability description text: italic + underline */
            .ability > .meta { margin-bottom: 0.18em; }
            /* reduce gap between ability name and description */
            .ability h4{ margin: 0; margin-bottom: 0.08em; }
            .ability-desc, .ability > .desc, .ability > p.desc {
              font-style: italic;
              text-decoration: underline;
              text-underline-offset: 0.18em;
            }
            }
            .ability .power-roll .pr-desc{ font-style: normal; text-decoration: none; text-underline-offset: initial; }
            @media print{
              @page{ margin:8mm }
              .power-roll.power-roll-header{ background: #f7f7f7 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact }
            }
          </style>
        </head>
        <body>
          <div class="print-grid">
            ${deck
              .map((it) => `
              <div class="print-card">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
                  <h3 style="margin:0;font-size:14px;">${escapeHtml(it.name)}</h3>
                  <span class="muted" style="font-weight:bold;font-size:13px;">${escapeHtml(it.type)}</span>
                </div>
                ${(it.keywords && it.keywords.length > 0) ? `<div style="font-weight:bold;margin-bottom:0.2em">${escapeHtml(it.keywords.join(', '))}</div>` : ''}
                <div class="desc">${replacePotencyGlyphsHtml(escapeHtml((it as any).description || ''))}</div>
                <div class="effect">${((it as any).first_level || (it as any).fifth_level || (it as any).ninth_level) ? `
                  ${ (it as any).first_level ? `<p class="leveled-line"><strong>1st Level:</strong> ${replacePotencyGlyphsHtml(escapeHtml(levelSummary((it as any).first_level)))}</p>` : ''}
                  ${ (it as any).fifth_level ? `<p class="leveled-line"><strong>5th Level:</strong> ${replacePotencyGlyphsHtml(escapeHtml(levelSummary((it as any).fifth_level)))}</p>` : ''}
                  ${ (it as any).ninth_level ? `<p class="leveled-line"><strong>9th Level:</strong> ${replacePotencyGlyphsHtml(escapeHtml(levelSummary((it as any).ninth_level)))}</p>` : formatPowerRollsHtml((it as any).effect || '', true)}
                ` : `${formatPowerRollsHtml((it as any).effect || '', true)}`}${(it as any).power_roll && (it as any).power_roll.length ? `<div class="item-power-rolls">` + (it as any).power_roll.map((line: string) => {
                  if (/^\s*Power\s+Roll\b/i.test(line)) return `<div class="power-roll power-roll-header"><strong>${escapeHtml(line.trim())}</strong></div>`
                  const parsed = extractPowerRollMarker(line)
                  if (parsed) return `<div class="power-roll"><span class="range">${markerToGlyphHtml(parsed.marker, true)}</span> <span class="pr-desc">${replacePotencyGlyphsHtml(escapeHtml(parsed.desc))}</span></div>`
                  return `<div class="power-roll"><span class="pr-desc">${replacePotencyGlyphsHtml(escapeHtml(line.trim()))}</span></div>`
                }).join('') + `</div>` : ''}${formatAbilitiesHtmlStructured((it as any).abilities, true)}
                </div>
                ${includeProject && it.project ? `<div class="project"><strong>Project:</strong><div>Prerequisite: ${escapeHtml(it.project.prerequisite || '')}</div><div>Source: ${escapeHtml(it.project.source || '')}</div><div>Characteristics: ${escapeHtml((it.project.characteristics || []).join(', '))}</div><div>Goal: ${escapeHtml(it.project.goal || '')}</div></div>` : ''}
              </div>
            `)
              .join('')}
          </div>
        </body>
      </html>
    `

    try {
      const w = window.open('', '_blank')
      if (!w) {
        console.error('Failed to open print window - popup may be blocked')
        return
      }

      // Write and close the document; do not auto-trigger printing — user can print manually
      w.document.open()
      w.document.write(html)
      w.document.close()

      try {
        w.focus && w.focus()
      } catch (e) {
        // ignore focus errors
      }
    } catch (err) {
      console.error('Error opening print window:', err)
    }
  }

  function exportDeck() {
    const data = deck.map(({ __category, ...rest }) => rest)
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'deck.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={`print-deck ${collapsed ? 'collapsed' : ''}`}>
      <div className="print-deck-controls">
        <strong>Deck</strong>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="chip-btn" onClick={onClear} disabled={deck.length === 0}>
            Clear deck
          </button>
          <button className="chip-btn" onClick={exportDeck} disabled={deck.length === 0}>
            Export JSON
          </button>
          <button className="chip-btn" onClick={triggerImport}>
            Import JSON
          </button>
          <input ref={fileInputRef} type="file" accept=".json,application/json" style={{ display: 'none' }} onChange={handleImportFile} />
          <button className="random-btn" onClick={showDeck} disabled={deck.length === 0}>
            Show deck ({deck.length})
          </button>
          <button className="chip-btn" onClick={() => setCollapsed(!collapsed)} aria-expanded={!collapsed}>
            {collapsed ? `Expand (${deck.length})` : 'Collapse'}
          </button>
        </div>
      </div>

      {collapsed ? (
        <div className="print-deck-collapsed" style={{ marginTop: 8, fontSize: '0.9rem', color: '#666' }}>
          Deck collapsed — {deck.length} items
        </div>
      ) : (
        <div className="grid print-deck-grid" style={{ marginTop: 8 }}>
          {deck.map((it, idx) => (
            <div
              key={`${it.type}:${it.name}`}
              className={`draggable-wrapper`}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', String(idx))
                e.dataTransfer.effectAllowed = 'move'
                e.currentTarget.classList.add('dragging')
              }}
              onDragOver={(e) => {
                e.preventDefault()
                e.dataTransfer.dropEffect = 'move'
                e.currentTarget.classList.add('drag-over')
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove('drag-over')
              }}
              onDrop={(e) => {
                e.preventDefault()
                try {
                  const from = Number(e.dataTransfer.getData('text/plain'))
                  const to = idx
                  if (isNaN(from) || from < 0 || from >= deck.length || to < 0 || to >= deck.length) {
                    console.error('Invalid drag-drop indices:', from, to)
                    return
                  }
                  e.currentTarget.classList.remove('drag-over')
                  const wrappers = document.querySelectorAll('.draggable-wrapper')
                  wrappers.forEach((w) => w.classList.remove('dragging'))
                  ;(onMove as any)?.(from, to)
                } catch (err) {
                  console.error('Error during drag-drop:', err)
                }
              }}
              onDragEnd={(e) => {
                const wrappers = document.querySelectorAll('.draggable-wrapper')
                wrappers.forEach((w) => w.classList.remove('dragging'))
                wrappers.forEach((w) => w.classList.remove('drag-over'))
              }}
            >

              {isLeveledItem(it) ? (
                <LeveledCard item={it as any} compact={true} showProject={includeProject} onRemoveFromDeck={onRemove} inDeck={true} />
              ) : (
                <ItemCard item={it} compact={true} showProject={includeProject} onRemoveFromDeck={onRemove} inDeck={true} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
