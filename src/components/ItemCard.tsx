import React from 'react'
import type { BaseItem } from '../types/items'
import { parsePowerRolls } from '../utils/format'

export default function ItemCard({
  item,
  onAddToDeck,
  onRemoveFromDeck,
  inDeck = false,
  showProject = true,
  compact = false
}: {
  item: BaseItem
  onAddToDeck?: (item: BaseItem) => void
  onRemoveFromDeck?: (item: BaseItem) => void
  inDeck?: boolean
  showProject?: boolean
  compact?: boolean
}) {
  return (
    <article className={`item-card ${compact ? 'compact' : ''}`}>
      <header>
        <h3>{item.name}</h3>
        {!compact && item.echelon && <span className="chip">{item.echelon}</span>}
        <span className="muted">{item.type}</span>
      </header>

      {item.keywords && (
        <div className="keywords">
          {item.keywords.map((k) => (
            <span key={k} className="keyword">
              {k}
            </span>
          ))}
        </div>
      )}

      {item.description && <p className="desc">{item.description}</p>}

      {(item.effect || (item.abilities && item.abilities.length > 0) || (item.power_roll && item.power_roll.length > 0)) && (
        <details open={compact}>
          <summary className="summary">Effect</summary>
          <div className="effect">


            {/* base effect text */}
            {item.effect && parsePowerRolls(item.effect).map((part, i) => (part.type === 'plain' ? <p key={`e-${i}`}>{part.text}</p> : <div className="power-roll" key={`e-${i}`}><span className="range">{part.marker}:</span> <span className="pr-desc">{part.desc}</span></div>))}

            {/* top-level structured power_rolls (render after effect text) */}
            {item.power_roll && item.power_roll.length > 0 && (
              <div className="item-power-rolls">
                {item.power_roll.map((line, i) => {
                  // header (bold in item card)
                  if (/^\s*Power\s+Roll\b/i.test(line)) return (<div className="power-roll power-roll-header" key={`pr-${i}`}><strong>{line.trim()}</strong></div>)
                  const m = line.match(/^\s*(<=\s*\d+|\d+\s*-\s*\d+|\d+\+)\s*[:\-\.\u2013\u2014]?\s*(.*)$/)
                  if (m) return (<div className="power-roll" key={`pr-${i}`}><span className="range">{m[1].trim()}:</span> <span className="pr-desc">{m[2].trim()}</span></div>)
                  return (<div className="power-roll" key={`pr-${i}`}><span className="pr-desc">{line.trim()}</span></div>)
                })}
              </div>
            )}

            {/* structured abilities, if present */}
            {item.abilities && item.abilities.length > 0 && item.abilities.map((a, ai) => (
              <div className="ability" key={`ab-${ai}`}>
                <h4>{a.name}</h4>
                {a.description && parsePowerRolls(a.description).map((pp, j) => pp.type === 'plain' ? <p key={`ab-${ai}-d-${j}`}>{pp.text}</p> : <div className="power-roll" key={`ab-${ai}-d-${j}`}><span className="range">{pp.marker}:</span> <span className="pr-desc">{pp.desc}</span></div>)}

                <div className="ability-meta">
                  {a.keywords && a.keywords.length > 0 && <div><strong>Keywords:</strong> {a.keywords.join(', ')}</div>}
                  {a.type && <div><strong>Type:</strong> {a.type}</div>}
                  {a.range && <div><strong>Range:</strong> {a.range}</div>}
                  {a.targets && <div><strong>Targets:</strong> {a.targets}</div>}
                </div>

                {/* ability power rolls (above ability effect) */}
                {a.power_roll && a.power_roll.length > 0 && a.power_roll.map((line, pi) => {
                  // header
                  if (/^\s*Power\s+Roll\b/i.test(line)) return (<div className="power-roll power-roll-header" key={`ab-${ai}-pr-${pi}`}><strong>{line.trim()}</strong></div>)
                  const m = line.match(/^\s*(<=\s*\d+|\d+\s*-\s*\d+|\d+\+)\s*[:\-\.\u2013\u2014]?\s*(.*)$/)
                  if (m) return (<div className="power-roll" key={`ab-${ai}-pr-${pi}`}><span className="range">{m[1].trim()}:</span> <span className="pr-desc">{m[2].trim()}</span></div>)
                  return (<div className="power-roll" key={`ab-${ai}-pr-${pi}`}><span className="pr-desc">{line.trim()}</span></div>)
                })}

                {/* ability effect */}
                {a.effect && parsePowerRolls(a.effect).map((pp, j) => pp.type === 'plain' ? <p key={`ab-${ai}-eff-${j}`}>{pp.text}</p> : <div className="power-roll" key={`ab-${ai}-eff-${j}`}><span className="range">{pp.marker}:</span> <span className="pr-desc">{pp.desc}</span></div>)}
              </div>
            ))}
          </div>
        </details>
      )} 

      {showProject && item.project && (
        <div className="project">
          <strong>Project:</strong>
          <div>Prereq: {item.project.prerequisite}</div>
          <div>Source: {item.project.source}</div>
          <div>Characteristics: {item.project.characteristics?.join(', ')}</div>
          <div>Goal: {item.project.goal}</div>
        </div>
      )}

      {/* Deck controls */}
      {(onAddToDeck || onRemoveFromDeck) && (
        <div className="card-actions">
          {!inDeck && onAddToDeck && (
            <button className="chip-btn" onClick={() => onAddToDeck(item)}>
              Add to deck
            </button>
          )}

          {inDeck && onRemoveFromDeck && (
            <button className="chip-btn" onClick={() => onRemoveFromDeck(item)}>
              Remove from deck
            </button>
          )}
        </div>
      )}
    </article>
  )
}
