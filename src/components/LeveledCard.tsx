import React from 'react'
import type { Leveled, BaseItem } from '../types/items'
import { formatPowerRollsHtml, escapeHtml, replaceIntensityGlyphsHtml } from '../utils/format'

export default function LeveledCard({
  item,
  onAddToDeck,
  onRemoveFromDeck,
  inDeck = false,
  showProject = true,
  compact = false
}: {
  item: Leveled
  onAddToDeck?: (item: BaseItem) => void
  onRemoveFromDeck?: (item: BaseItem) => void
  inDeck?: boolean
  showProject?: boolean
  compact?: boolean
}) {
  const toGlyphHtml = (text: string) => ({ __html: replaceIntensityGlyphsHtml(escapeHtml(text)) })

  return (
    <article className={`item-card leveled ${compact ? 'compact' : ''}`}>
      <header>
        <h3>{item.name}</h3>
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

      {item.description && <p className="desc" dangerouslySetInnerHTML={toGlyphHtml(item.description)} />}

      <div className="leveled-levels">
        {item.first_level && (
          <details open={compact}>
            <summary className="summary">1st Level</summary>
            <div className="effect" dangerouslySetInnerHTML={{ __html: formatPowerRollsHtml(item.first_level) }} />
          </details>
        )}
        {item.fifth_level && (
          <details open={compact}>
            <summary className="summary">5th Level</summary>
            <div className="effect" dangerouslySetInnerHTML={{ __html: formatPowerRollsHtml(item.fifth_level) }} />
          </details>
        )}
        {item.ninth_level && (
          <details open={compact}>
            <summary className="summary">9th Level</summary>
            <div className="effect" dangerouslySetInnerHTML={{ __html: formatPowerRollsHtml(item.ninth_level) }} />
          </details>
        )}
      </div>

      {showProject && item.project && (
        <div className="project">
          <strong>Project:</strong>
          <div>Prerequisite: {item.project.prerequisite}</div>
          <div>Source: {item.project.source}</div>
          <div>Characteristics: {item.project.characteristics?.join(', ')}</div>
          <div>Goal: {item.project.goal}</div>
        </div>
      )}

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
