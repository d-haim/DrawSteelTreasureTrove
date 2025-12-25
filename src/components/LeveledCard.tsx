import React from 'react'
import type { Leveled, BaseItem } from '../types/items'
import { parsePowerRolls } from '../utils/format'

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
  return (
    <article className={`item-card leveled ${compact ? 'compact' : ''}`}>
      <header>
        <h3>{item.name}</h3>
        <span className="muted">{item.type}</span>
      </header>

      {item.description && <p className="desc">{item.description}</p>}

      <div className="leveled-levels">
        {item.first_level && (
          <section>
            <h4>1st level</h4>
            <div className="effect">
              {parsePowerRolls(item.first_level).map((part, i) =>
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
          </section>
        )}
        {item.fifth_level && (
          <section>
            <h4>5th level</h4>
            <div className="effect">
              {parsePowerRolls(item.fifth_level).map((part, i) =>
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
          </section>
        )}
        {item.ninth_level && (
          <section>
            <h4>9th level</h4>
            <div className="effect">
              {parsePowerRolls(item.ninth_level).map((part, i) =>
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
          </section>
        )}
      </div>

      {showProject && item.project && (
        <div className="project">
          <strong>Project:</strong>
          <div>Prereq: {item.project.prerequisite}</div>
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
