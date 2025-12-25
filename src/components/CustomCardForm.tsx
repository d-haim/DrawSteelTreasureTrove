import React, { useState } from 'react'
import type { BaseItem } from '../types/items'

export default function CustomCardForm({ onCreate }: { onCreate: (item: BaseItem) => void }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('Consumable')
  const [echelon, setEchelon] = useState('')
  const [description, setDescription] = useState('')
  const [effect, setEffect] = useState('')
  const [abilitiesJson, setAbilitiesJson] = useState('')
  const [powerRollsJson, setPowerRollsJson] = useState('')
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

    let abilities
    if (abilitiesJson.trim()) {
      try {
        const parsed = JSON.parse(abilitiesJson)
        if (Array.isArray(parsed)) abilities = parsed
      } catch (e) {
        // ignore invalid json
        abilities = undefined
      }
    }

    let power_roll
    if (powerRollsJson.trim()) {
      try {
        const parsed = JSON.parse(powerRollsJson)
        if (Array.isArray(parsed)) power_roll = parsed
      } catch (e) {
        power_roll = undefined
      }
    }

    const item: BaseItem = {
      name: name.trim(),
      type: type || 'Custom',
      echelon: echelon || undefined,
      description: description || undefined,
      effect: effect || undefined,
      abilities: abilities || undefined,
      power_roll: power_roll || undefined,
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

  const [collapsed, setCollapsed] = useState(true)

  return (
    <div className={`custom-form-wrapper ${collapsed ? 'collapsed' : 'expanded'}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
        <h4 style={{ margin: 0 }}>Create custom card</h4>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="chip-btn" onClick={() => setCollapsed(!collapsed)} aria-expanded={!collapsed}>
            {collapsed ? 'Expand' : 'Collapse'}
          </button>
        </div>
      </div>

      {collapsed ? (
        <div className="custom-form-collapsed" style={{ marginTop: 8 }}>
          Compact mode — expand to create a custom card
        </div>
      ) : (
        <form className="custom-form" onSubmit={handleSubmit}>
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
            <textarea placeholder={"Abilities (optional) — paste JSON array of {name,description,keywords,type,range,targets,effect,power_rolls}"} value={abilitiesJson} onChange={(e) => setAbilitiesJson(e.target.value)} />
          </div>

          <div className="row">
            <textarea placeholder={"Power Rolls (optional) — paste JSON array of {marker, desc}"} value={powerRollsJson} onChange={(e) => setPowerRollsJson(e.target.value)} />
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
      )}
    </div>
  )
}
