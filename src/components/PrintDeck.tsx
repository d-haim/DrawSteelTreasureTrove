import React, { useState, useRef } from 'react'
import type { BaseItem } from '../types/items'
import ItemCard from './ItemCard'
import LeveledCard from './LeveledCard'
import { formatPowerRollsHtml, formatAbilitiesHtmlStructured } from '../utils/format'

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
      const normalized = json.map((it: any) => ({ ...it }))
      ;(onImport as any)?.(normalized)
    } catch (err: any) {
      alert('Could not import JSON: ' + (err && err.message ? err.message : String(err)))
    }
    e.currentTarget.value = ''
  }

  function showDeck() {
    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Deck</title>
          <style>
            body{ font-family: Arial, Helvetica, sans-serif; margin:20px; color:#111 }
            .print-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:12px }
            .print-card{ border:1px solid #222; padding:12px; border-radius:6px; box-shadow: 0 1px 0 rgba(0,0,0,0.1); background:#fff; box-sizing:border-box }
            .print-card h3{ margin:0 0 6px 0 }
            .muted{ color:#666; font-size:0.9rem }
            .effect{ margin-top:8px }
            .project{ margin-top:8px; font-size:0.9rem; color:#444 }
            .power-roll{ margin-top:6px }
            .power-roll .range{ color: #2b6cb0; font-weight:700; display:inline-block; width:72px }
            .power-roll .pr-desc{ display:inline-block }
            .power-roll.power-roll-header{ background: #f7f7f7; padding:6px; border-radius:6px; font-weight:700; display:block }
            .disclaimer{ margin-top:12px; color:#666; font-size:12px }
            @media print{
              body{ margin: 8mm; color:#111; font-size:12px }
              .print-grid{ gap:8px; grid-template-columns: repeat(2, minmax(220px, 1fr)); }
              .print-card{ padding:8px; font-size:12px; box-shadow:none; border:1px solid #ddd; background:#fff; page-break-inside:avoid; break-inside:avoid; }
              .print-card h3{ font-size:14px; margin-bottom:6px }
              .print-card section{ margin-top:6px }
              .print-card section h4{ margin:4px 0 6px 0; font-size:13px }
              .item-power-rolls{ margin-top:8px; padding-top:6px; border-top:1px dashed #ddd }
              .power-roll .range{ width:64px }
              @page{ margin:8mm }
            }
          </style>
        </head>
        <body>
          <div class="print-grid">
            ${deck
              .map((it) => `
              <div class="print-card">
                <h3>
                  ${escapeHtml(it.name)}
                </h3>
                <div class="muted">${escapeHtml(it.type)}</div>
                <div class="desc">${escapeHtml((it as any).description || '')}</div>
                <div class="effect">${((it as any).first_level || (it as any).fifth_level || (it as any).ninth_level) ? `
                  ${ (it as any).first_level ? `<section><h4>1st level</h4>${formatPowerRollsHtml((it as any).first_level)}</section>` : ''}
                  ${ (it as any).fifth_level ? `<section><h4>5th level</h4>${formatPowerRollsHtml((it as any).fifth_level)}</section>` : ''}
                  ${ (it as any).ninth_level ? `<section><h4>9th level</h4>${formatPowerRollsHtml((it as any).ninth_level)}</section>` : formatPowerRollsHtml((it as any).effect || '')}
                ` : `${formatPowerRollsHtml((it as any).effect || '')}`}${(it as any).power_roll && (it as any).power_roll.length ? `<div class="item-power-rolls">` + (it as any).power_roll.map((line: string) => {
                  if (/^\s*Power\s+Roll\b/i.test(line)) return `<div class="power-roll power-roll-header"><strong>${escapeHtml(line.trim())}</strong></div>`
                  const m = line.match(/^\s*(<=\s*\d+|\d+\s*-\s*\d+|\d+\+)\s*[:\-\.]?\s*(.*)$/)
                  if (m) return `<div class="power-roll"><span class="range">${escapeHtml(m[1].trim())}:</span> <span class="pr-desc">${escapeHtml(m[2].trim())}</span></div>`
                  return `<div class="power-roll"><span class="pr-desc">${escapeHtml(line.trim())}</span></div>`
                }).join('') + `</div>` : ''}${formatAbilitiesHtmlStructured((it as any).abilities)}
                </div>
                ${includeProject && it.project ? `<div class="project"><strong>Project:</strong><div>Prerequisite: ${escapeHtml(it.project.prerequisite || '')}</div><div>Source: ${escapeHtml(it.project.source || '')}</div><div>Characteristics: ${escapeHtml((it.project.characteristics || []).join(', '))}</div><div>Goal: ${escapeHtml(it.project.goal || '')}</div></div>` : ''}
              </div>
            `)
              .join('')}
          </div>

          <div class="disclaimer">Draw Steel Treasure Trove is an independent product published under the DRAW STEEL Creator License and is not affiliated with MCDM Productions, LLC.<br/><br/>DRAW STEEL © 2024 MCDM Productions, LLC.</div>
        </body>
      </html>
    `

    const w = window.open('', '_blank')
    if (!w) return

    // Write and close the document; do not auto-trigger printing — user can print manually
    w.document.open()
    w.document.write(html)
    w.document.close()

    try {
      w.focus && w.focus()
    } catch (e) {
      // ignore
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

  function escapeHtml(s: string) {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
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
                const from = Number(e.dataTransfer.getData('text/plain'))
                const to = idx
                e.currentTarget.classList.remove('drag-over')
                const wrappers = document.querySelectorAll('.draggable-wrapper')
                wrappers.forEach((w) => w.classList.remove('dragging'))
                ;(onMove as any)?.(from, to)
              }}
              onDragEnd={(e) => {
                const wrappers = document.querySelectorAll('.draggable-wrapper')
                wrappers.forEach((w) => w.classList.remove('dragging'))
                wrappers.forEach((w) => w.classList.remove('drag-over'))
              }}
            >

              {(it as any).__category === 'Leveled' || (it as any).first_level ? (
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
