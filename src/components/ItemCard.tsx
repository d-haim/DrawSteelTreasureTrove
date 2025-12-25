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

      {item.effect && (
        <details open={compact}>
          <summary className="summary">Effect</summary>
          <div className="effect">
            {parsePowerRolls(item.effect).map((part, i) =>
              part.type === 'plain' ? (
                <p key={i}>{part.text}</p>
              ) : (
                <div className="power-roll" key={i}>
                  <span className="range">{part.marker}:</span>{' '}
                  <span className="pr-desc">{part.desc}</span>
                </div>
              )
            )}
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
              Add to print deck
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
