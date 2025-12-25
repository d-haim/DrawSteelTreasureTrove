import React from 'react'
import type { BaseItem } from '../types/items'

export default function ItemCard({ item }: { item: BaseItem }) {
  return (
    <article className="item-card">
      <header>
        <h3>{item.name}</h3>
        {item.echelon && <span className="chip">{item.echelon}</span>}
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
        <details>
          <summary className="summary">Effect</summary>
          <p className="effect">{item.effect}</p>
        </details>
      )}

      {item.project && (
        <div className="project">
          <strong>Project:</strong>
          <div>Prereq: {item.project.prerequisite}</div>
          <div>Source: {item.project.source}</div>
          <div>Characteristics: {item.project.characteristics?.join(', ')}</div>
          <div>Goal: {item.project.goal}</div>
        </div>
      )}
    </article>
  )
}
