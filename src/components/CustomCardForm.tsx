import React, { useState } from 'react'
import type { BaseItem } from '../types/items'

export default function CustomCardForm({ onCreate }: { onCreate: (item: BaseItem) => void }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('Consumable')
  const [echelon, setEchelon] = useState('')
  const [description, setDescription] = useState('')
  const [effect, setEffect] = useState('')
  const [prerequisite, setPrerequisite] = useState('')
  const [source, setSource] = useState('')
  const [characteristics, setCharacteristics] = useState('')
  const [goal, setGoal] = useState('')

  function handleSubmit(e?: React.FormEvent) {
    e && e.preventDefault()
    if (!name.trim()) return
    const project = (prerequisite || source || characteristics || goal)
      ? {
          prerequisite: prerequisite || undefined,
          source: source || undefined,
          characteristics: characteristics ? characteristics.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
          goal: goal || undefined
        }
      : undefined

    const item: BaseItem = {
      name: name.trim(),
      type: type || 'Custom',
      echelon: echelon || undefined,
      description: description || undefined,
      effect: effect || undefined,
      project
    }

    onCreate(item)
    reset()
  }

  function reset() {
    setName('')
    setType('Consumable')
    setEchelon('')
    setDescription('')
    setEffect('')
    setPrerequisite('')
    setSource('')
    setCharacteristics('')
    setGoal('')
  }

  return (
    <form className="custom-form" onSubmit={handleSubmit}>
      <h4>Create custom card</h4>
      <div className="row">
        <input placeholder="Name*" value={name} onChange={(e) => setName(e.target.value)} />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option>Consumable</option>
          <option>Trinket</option>
          <option>Leveled</option>
        </select>
      </div>

      <div className="row">
        <input placeholder="Echelon (optional)" value={echelon} onChange={(e) => setEchelon(e.target.value)} />
      </div>

      <div className="row">
        <textarea placeholder="Short description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="row">
        <textarea placeholder="Effect (full text shown on card)" value={effect} onChange={(e) => setEffect(e.target.value)} />
      </div>

      <div className="row">
        <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <strong>Project (optional)</strong>
        </label>
      </div>

      <div className="project-fields">
        <input placeholder="Project prerequisite" value={prerequisite} onChange={(e) => setPrerequisite(e.target.value)} />
        <input placeholder="Project source" value={source} onChange={(e) => setSource(e.target.value)} />
        <input placeholder="Characteristics (comma-separated)" value={characteristics} onChange={(e) => setCharacteristics(e.target.value)} />
        <input placeholder="Goal" value={goal} onChange={(e) => setGoal(e.target.value)} />
      </div>

      <div className="row actions">
        <button type="submit" className="chip-btn" disabled={!name.trim()}>
          Add to deck
        </button>
        <button type="button" className="chip-btn" onClick={reset}>
          Reset
        </button>
      </div>
    </form>
  )
}
