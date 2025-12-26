import React from 'react'
import type { BaseItem } from '../types/items'
import { parsePowerRolls, markerToGlyphChar, replacePotencyGlyphsHtml, escapeHtml, extractPowerRollMarker } from '../utils/format'

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
  const toGlyphHtml = (text: string) => ({ __html: replacePotencyGlyphsHtml(escapeHtml(text)) })

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

      {item.description && <p className="desc" dangerouslySetInnerHTML={toGlyphHtml(item.description)} />}

      {(item.effect || (item.abilities && item.abilities.length > 0) || (item.power_roll && item.power_roll.length > 0)) && (
        <details open={compact}>
          <summary className="summary">Effect</summary>
          <div className="effect">


            {/* base effect text */}
            {item.effect && parsePowerRolls(item.effect).map((part, i) => (
              part.type === 'plain' ? (
                <p key={`e-${i}`} dangerouslySetInnerHTML={toGlyphHtml(part.text)} />
              ) : (
                <div className="power-roll" key={`e-${i}`}>
                  <span className="range"><span className="ds-glyph">{markerToGlyphChar(part.marker)}</span></span>{' '}
                  <span className="pr-desc" dangerouslySetInnerHTML={toGlyphHtml(part.desc)} />
                </div>
              )
            ))}

            {/* top-level structured power_rolls (render after effect text) */}
            {item.power_roll && item.power_roll.length > 0 && (
              <div className="item-power-rolls">
                {item.power_roll.map((line, i) => {
                  // header (bold in item card)
                  if (/^\s*Power\s+Roll\b/i.test(line)) return (<div className="power-roll power-roll-header" key={`pr-${i}`}><strong>{line.trim()}</strong></div>)
                  const parsed = extractPowerRollMarker(line)
                  if (parsed) return (
                    <div className="power-roll" key={`pr-${i}`}>
                      <span className="range"><span className="ds-glyph">{markerToGlyphChar(parsed.marker)}</span></span>{' '}
                      <span className="pr-desc" dangerouslySetInnerHTML={toGlyphHtml(parsed.desc)} />
                    </div>
                  )
                  return (
                    <div className="power-roll" key={`pr-${i}`}>
                      <span className="pr-desc" dangerouslySetInnerHTML={toGlyphHtml(line.trim())} />
                    </div>
                  )
                })}
              </div>
            )}

            {/* structured abilities, if present */}
            {item.abilities && item.abilities.length > 0 && item.abilities.map((a, ai) => (
              <div className="ability" key={`ab-${ai}`}>
                <h4>{a.name}</h4>
                {a.description && <p className="desc ability-desc" dangerouslySetInnerHTML={toGlyphHtml(a.description)} />}
                {(a.keywords && a.keywords.length > 0 || a.type) && (
                  <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '-0.2em', marginBottom: '0.2em' }}>
                    {a.keywords && a.keywords.length > 0 && (
                      <span style={{ fontWeight: 'bold' }}>{a.keywords.join(', ')}</span>
                    )}
                    {a.type && (
                      <span style={{ fontWeight: 'bold', marginLeft: 'auto' }}>{a.type}</span>
                    )}
                  </div>
                )}
                {(a.range || a.targets) && (
                  <div style={{ display: 'flex', alignItems: 'baseline', fontWeight: 'normal', marginBottom: '0.5em' }}>
                    {a.range && (
                      <span><span className="ds-glyph">{String.fromCharCode(0x0044)}</span> {a.range}</span>
                    )}
                    {a.targets && (
                      <span style={{ marginLeft: 'auto' }}><span className="ds-glyph">{String.fromCharCode(0x0054)}</span> {a.targets}</span>
                    )}
                  </div>
                )}
                {a.description && parsePowerRolls(a.description).filter(pp => pp.type === 'pr').map((pp, j) => (
                  <div className="power-roll" key={`ab-${ai}-d-${j}`}>
                    <span className="range"><span className="ds-glyph">{markerToGlyphChar(pp.marker)}</span></span>{' '}
                    <span className="pr-desc" dangerouslySetInnerHTML={toGlyphHtml(pp.desc)} />
                  </div>
                ))}

                {/* ability-meta now only shows other fields if needed */}
                <div className="ability-meta">
                  {/* Add other meta fields here if needed */}
                </div>

                {/* ability power rolls (above ability effect) */}
                {a.power_roll && a.power_roll.length > 0 && a.power_roll.map((line, pi) => {
                  // header
                  if (/^\s*Power\s+Roll\b/i.test(line)) return (<div className="power-roll power-roll-header" key={`ab-${ai}-pr-${pi}`}><strong>{line.trim()}</strong></div>)
                  const parsed = extractPowerRollMarker(line)
                  if (parsed) return (
                    <div className="power-roll" key={`ab-${ai}-pr-${pi}`}>
                      <span className="range"><span className="ds-glyph">{markerToGlyphChar(parsed.marker)}</span></span>{' '}
                      <span className="pr-desc" dangerouslySetInnerHTML={toGlyphHtml(parsed.desc)} />
                    </div>
                  )
                  return (
                    <div className="power-roll" key={`ab-${ai}-pr-${pi}`}>
                      <span className="pr-desc" dangerouslySetInnerHTML={toGlyphHtml(line.trim())} />
                    </div>
                  )
                })}

                {/* ability effect */}
                {a.effect && parsePowerRolls(a.effect).map((pp, j) => (
                  pp.type === 'plain' ? (
                    <p key={`ab-${ai}-eff-${j}`} dangerouslySetInnerHTML={toGlyphHtml(pp.text)} />
                  ) : (
                    <div className="power-roll" key={`ab-${ai}-eff-${j}`}>
                      <span className="range"><span className="ds-glyph">{markerToGlyphChar(pp.marker)}</span></span>{' '}
                      <span className="pr-desc" dangerouslySetInnerHTML={toGlyphHtml(pp.desc)} />
                    </div>
                  )
                ))}
              </div>
            ))}
          </div>
        </details>
      )} 

      {showProject && item.project && (
        <div className="project">
          <strong>Project:</strong>
          <div>Prerequisite: {item.project.prerequisite}</div>
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
