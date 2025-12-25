import React from 'react'
import type { Leveled } from '../types/items'

export default function LeveledCard({ item }: { item: Leveled }) {
  return (
    <article className="item-card leveled">
      <header>
        <h3>{item.name}</h3>
        <span className="muted">{item.type}</span>
      </header>

      {item.description && <p className="desc">{item.description}</p>}

      <div className="leveled-levels">
        {item.first_level && (
          <section>
            <h4>1st level</h4>
            <p>{item.first_level}</p>
          </section>
        )}
        {item.fifth_level && (
          <section>
            <h4>5th level</h4>
            <p>{item.fifth_level}</p>
          </section>
        )}
        {item.ninth_level && (
          <section>
            <h4>9th level</h4>
            <p>{item.ninth_level}</p>
          </section>
        )}
      </div>

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
