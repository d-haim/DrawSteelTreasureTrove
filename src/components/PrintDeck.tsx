import React from 'react'
import type { BaseItem } from '../types/items'
import ItemCard from './ItemCard'
import { formatPowerRollsHtml, formatAbilitiesHtmlStructured } from '../utils/format'

export default function PrintDeck({
  deck,
  onRemove,
  onClear,
  includeProject
}: {
  deck: (BaseItem & { __category?: string })[]
  onRemove: (item: BaseItem) => void
  onClear: () => void
  includeProject: boolean
}) {
  function showDeck() {
    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Deck</title>
          <style>
            body{ font-family: Arial, Helvetica, sans-serif; margin:20px; color:#111 }
            .print-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:12px }
            .print-card{ border:1px solid #222; padding:12px; border-radius:6px; box-shadow: 0 1px 0 rgba(0,0,0,0.1); background:#fff }
            .print-card h3{ margin:0 0 6px 0 }
            .muted{ color:#666; font-size:0.9rem }
            .effect{ margin-top:8px }
            .project{ margin-top:8px; font-size:0.9rem; color:#444 }
            .power-roll{ margin-top:6px }
            .power-roll .range{ color: #2b6cb0; font-weight:700; display:inline-block; width:72px }
            .power-roll .pr-desc{ display:inline-block }
            .power-roll.power-roll-header{ background: #f7f7f7; padding:6px; border-radius:6px; font-weight:700; display:block }
            @media print{ body{ margin: 0 } .print-grid{ gap:8px } }
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
                <div class="desc">${escapeHtml(it.description || '')}</div>
                <div class="effect">${formatPowerRollsHtml(it.effect || '')}${it.power_roll && it.power_roll.length ? it.power_roll.map(line => {
                  if (/^\s*Power\s+Roll\b/i.test(line)) return `<div class="power-roll power-roll-header"><strong>${escapeHtml(line.trim())}</strong></div>`
                  const m = line.match(/^\s*(<=\s*\d+|\d+\s*-\s*\d+|\d+\+)\s*[:\-\.]?\s*(.*)$/)
                  if (m) return `<div class="power-roll"><span class="range">${escapeHtml(m[1].trim())}:</span> <span class="pr-desc">${escapeHtml(m[2].trim())}</span></div>`
                  return `<div class="power-roll"><span class="pr-desc">${escapeHtml(line.trim())}</span></div>`
                }).join('') : ''}${formatAbilitiesHtmlStructured(it.abilities)}
                </div>
                ${includeProject && it.project ? `<div class="project"><strong>Project:</strong><div>Prereq: ${escapeHtml(it.project.prerequisite || '')}</div><div>Source: ${escapeHtml(it.project.source || '')}</div><div>Characteristics: ${escapeHtml((it.project.characteristics || []).join(', '))}</div><div>Goal: ${escapeHtml(it.project.goal || '')}</div></div>` : ''}
              </div>
            `)
              .join('')}
          </div>
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

  function escapeHtml(s: string) {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  return (
    <div className="print-deck">
      <div className="print-deck-controls">
        <strong>Deck</strong>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="chip-btn" onClick={onClear} disabled={deck.length === 0}>
            Clear deck
          </button>
          <button className="random-btn" onClick={showDeck} disabled={deck.length === 0}>
            Show deck ({deck.length})
          </button>
        </div>
      </div>

      <div className="grid print-deck-grid" style={{ marginTop: 8 }}>
        {deck.map((it) => (
          <div key={`${it.type}:${it.name}`}>
            <ItemCard item={it} compact={true} showProject={includeProject} onRemoveFromDeck={onRemove} inDeck={true} />
          </div>
        ))}
      </div>
    </div>
  )
}
