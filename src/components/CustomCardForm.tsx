import React, { useState } from 'react'
import type { BaseItem, Echelon } from '../types/items'

export default function CustomCardForm({ onCreate }: { onCreate: (item: BaseItem) => void }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('Consumable')
  const [echelon, setEchelon] = useState<Echelon>('First')
  const [formError, setFormError] = useState('')
  const [missingFields, setMissingFields] = useState<string[]>([])
  const [description, setDescription] = useState('')
  const [keywords, setKeywords] = useState('')
  const [effect, setEffect] = useState('')
  // Leveled item fields
  const [firstLevel, setFirstLevel] = useState('')
  const [fifthLevel, setFifthLevel] = useState('')
  const [ninthLevel, setNinthLevel] = useState('')
  // Single ability fields (assume at most one ability)
  const [abilityName, setAbilityName] = useState('')
  const [abilityDescription, setAbilityDescription] = useState('')
  const [abilityKeywords, setAbilityKeywords] = useState('')
  const [abilityType, setAbilityType] = useState('')
  const [abilityRange, setAbilityRange] = useState('')
  const [abilityTargets, setAbilityTargets] = useState('')
  const [abilityEffect, setAbilityEffect] = useState('')
  // Ability power roll (single header + tiers)
  const [abilityPrHeader, setAbilityPrHeader] = useState('')
  const [abilityPrTier1, setAbilityPrTier1] = useState('')
  const [abilityPrTier2, setAbilityPrTier2] = useState('')
  const [abilityPrTier3, setAbilityPrTier3] = useState('')
  const [showAbilityPr, setShowAbilityPr] = useState(false)

  // Item-level power roll (single header + tiers)
  const [itemPrHeader, setItemPrHeader] = useState('')
  const [itemPrTier1, setItemPrTier1] = useState('')
  const [itemPrTier2, setItemPrTier2] = useState('')
  const [itemPrTier3, setItemPrTier3] = useState('')

  // UI toggles to show/hide optional sections
  const [showAbility, setShowAbility] = useState(false)
  const [showItemPr, setShowItemPr] = useState(false)
  const [prerequisite, setPrerequisite] = useState('')
  const [source, setSource] = useState('')
  const [characteristics, setCharacteristics] = useState('')
  const [goal, setGoal] = useState('')

  function handleSubmit(e?: React.FormEvent) {
    e && e.preventDefault()
    setFormError('')
    setMissingFields([])

    const missing: string[] = []
    if (!name.trim()) missing.push('Name')
    if (!description.trim()) missing.push('Description')
    if (type === 'Leveled') {
      if (!firstLevel.trim()) missing.push('1st Level')
      if (!fifthLevel.trim()) missing.push('5th Level')
      if (!ninthLevel.trim()) missing.push('9th Level')
    } else {
      if (!effect.trim()) missing.push('Effect')
    }

    if (missing.length) {
      setMissingFields(missing)
      setFormError(`Missing required: ${missing.join(', ')}`)
      return
    }
    const project = (prerequisite || source || characteristics || goal)
      ? {
          prerequisite: prerequisite || undefined,
          source: source || undefined,
          characteristics: characteristics ? characteristics.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
          goal: goal || undefined
        }
      : undefined

    // Build single ability object if the ability section is shown
    let abilities
    if (showAbility) {
      // Enforce required ability fields (everything except the power roll)
      const abilityMissing: string[] = []
      if (!abilityName.trim()) abilityMissing.push('Ability name')
      if (!abilityDescription.trim()) abilityMissing.push('Ability description')
      if (!abilityKeywords.trim()) abilityMissing.push('Ability keywords')
      if (!abilityType.trim()) abilityMissing.push('Ability type')
      if (!abilityRange.trim()) abilityMissing.push('Ability range')
      if (!abilityTargets.trim()) abilityMissing.push('Ability targets')
      if (!abilityEffect.trim()) abilityMissing.push('Ability effect')

      if (abilityMissing.length) {
        setMissingFields((prev) => [...prev, ...abilityMissing])
        setFormError(`Missing ability fields: ${abilityMissing.join(', ')}`)
        return
      }

      const a: any = { name: abilityName.trim() }
      if (abilityDescription.trim()) a.description = abilityDescription.trim()
      if (abilityKeywords.trim()) a.keywords = abilityKeywords.split(',').map((s) => s.trim()).filter(Boolean)
      if (abilityType.trim()) a.type = abilityType.trim()
      if (abilityRange.trim()) a.range = abilityRange.trim()
      if (abilityTargets.trim()) a.targets = abilityTargets.trim()
      if (abilityEffect.trim()) a.effect = abilityEffect.trim()

      const apr: string[] = []
      if (showAbilityPr && abilityPrHeader.trim()) {
        const h = abilityPrHeader.trim()
        const header = /^\s*Power\s+Roll\b/i.test(h) ? h : `Power Roll + ${h}`
        apr.push(header)
      }
      if (showAbilityPr && abilityPrTier1.trim()) apr.push(`<=11 ${abilityPrTier1.trim()}`)
      if (showAbilityPr && abilityPrTier2.trim()) apr.push(`12-16 ${abilityPrTier2.trim()}`)
      if (showAbilityPr && abilityPrTier3.trim()) apr.push(`17+ ${abilityPrTier3.trim()}`)
      if (apr.length) a.power_roll = apr

      abilities = [a]
    }

    // Build item-level power_roll array if provided (prefix tier lines with markers)
    let power_roll
    const ipr: string[] = []
    if (itemPrHeader.trim()) {
      const h = itemPrHeader.trim()
      const header = /^\s*Power\s+Roll\b/i.test(h) ? h : `Power Roll + ${h}`
      ipr.push(header)
    }
    if (itemPrTier1.trim()) ipr.push(`<=11 ${itemPrTier1.trim()}`)
    if (itemPrTier2.trim()) ipr.push(`12-16 ${itemPrTier2.trim()}`)
    if (itemPrTier3.trim()) ipr.push(`17+ ${itemPrTier3.trim()}`)
    if (ipr.length) power_roll = ipr

    const item: BaseItem = {
      name: name.trim(),
      type: type || 'Custom',
      echelon: echelon as Echelon,
      description,
      keywords: keywords ? keywords.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
      effect: type === 'Leveled' ? '' : effect,
      abilities: abilities || undefined,
      power_roll: power_roll || undefined,
      project,
      ...(type === 'Leveled' ? {
        first_level: firstLevel.trim() || undefined,
        fifth_level: fifthLevel.trim() || undefined,
        ninth_level: ninthLevel.trim() || undefined
      } : {})
    }

    onCreate(item)
    // keep form populated per user request; clear validation indicators
    setFormError('')
    setMissingFields([])
  }

  function reset() {
    setName('')
    setType('Consumable')
    setEchelon('First')
    setDescription('')
    setKeywords('')
    setEffect('')
    // reset leveled fields
    setFirstLevel('')
    setFifthLevel('')
    setNinthLevel('')
    setFormError('')
    setMissingFields([])

    // reset structured ability fields
    setAbilityName('')
    setAbilityDescription('')
    setAbilityKeywords('')
    setAbilityType('')
    setAbilityRange('')
    setAbilityTargets('')
    setAbilityEffect('')
    setAbilityPrHeader('')
    setAbilityPrTier1('')
    setAbilityPrTier2('')
    setAbilityPrTier3('')
    setShowAbility(false)

    // reset item-level power roll
    setItemPrHeader('')
    setItemPrTier1('')
    setItemPrTier2('')
    setItemPrTier3('')
    setShowItemPr(false)

    setPrerequisite('')
    setSource('')
    setCharacteristics('')
    setGoal('')
  }

  function clearAbilityFields() {
    setAbilityName('')
    setAbilityDescription('')
    setAbilityKeywords('')
    setAbilityType('')
    setAbilityRange('')
    setAbilityTargets('')
    setAbilityEffect('')
    setAbilityPrHeader('')
    setAbilityPrTier1('')
    setAbilityPrTier2('')
    setAbilityPrTier3('')
    setShowAbilityPr(false)
    setShowAbility(false)
  }

  function clearItemPrFields() {
    setItemPrHeader('')
    setItemPrTier1('')
    setItemPrTier2('')
    setItemPrTier3('')
    setShowItemPr(false)
  }

  function clearMissingField(field: string) {
    setMissingFields((prev) => {
      const next = prev.filter((f) => f !== field)
      if (next.length === 0) setFormError('')
      return next
    })
  }

  const [collapsed, setCollapsed] = useState(true)

  // whether the ability fields are in a valid state when present
  const abilityInvalid = showAbility && (
    !abilityName.trim() || !abilityDescription.trim() || !abilityKeywords.trim() || !abilityType.trim() || !abilityRange.trim() || !abilityTargets.trim() || !abilityEffect.trim()
  )

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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
              <input className={missingFields.includes('Name') ? 'error' : ''} placeholder="Name" value={name} onChange={(e) => { setName(e.target.value); clearMissingField('Name') }} />
              {missingFields.includes('Name') && formError && <div className="field-error">Name is required</div>}
            </div>

            <select className="narrow-select" value={type} onChange={(e) => setType(e.target.value)}>
              <option>Consumable</option>
              <option>Trinket</option>
              <option>Leveled</option>
            </select>
          </div>



          <div className="row">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
              <textarea className={missingFields.includes('Description') ? 'error' : ''} placeholder="Short description" value={description} onChange={(e) => { setDescription(e.target.value); clearMissingField('Description') }} />
              {missingFields.includes('Description') && formError && <div className="field-error">Description is required</div>}
            </div>
          </div>

          <div className="row">
            <input placeholder="Keywords (comma-separated)" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
          </div>

          {type === 'Leveled' ? (
            <>
              <div className="row">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
                  <textarea className={missingFields.includes('1st Level') ? 'error' : ''} placeholder="1st level" value={firstLevel} onChange={(e) => { setFirstLevel(e.target.value); clearMissingField('1st Level') }} />
                  {missingFields.includes('1st Level') && formError && <div className="field-error">1st level is required</div>}
                </div>
              </div>

              <div className="row">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
                  <textarea className={missingFields.includes('5th Level') ? 'error' : ''} placeholder="5th level" value={fifthLevel} onChange={(e) => { setFifthLevel(e.target.value); clearMissingField('5th Level') }} />
                  {missingFields.includes('5th Level') && formError && <div className="field-error">5th level is required</div>}
                </div>
              </div>

              <div className="row">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
                  <textarea className={missingFields.includes('9th Level') ? 'error' : ''} placeholder="9th level" value={ninthLevel} onChange={(e) => { setNinthLevel(e.target.value); clearMissingField('9th Level') }} />
                  {missingFields.includes('9th Level') && formError && <div className="field-error">9th level is required</div>}
                </div>
              </div>
            </>
          ) : (
            <div className="row">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
                <textarea className={missingFields.includes('Effect') ? 'error' : ''} placeholder="Effect (full text shown on card)" value={effect} onChange={(e) => { setEffect(e.target.value); clearMissingField('Effect') }} />
                {missingFields.includes('Effect') && formError && <div className="field-error">Effect is required</div>}
              </div>
            </div>
          )}

          <div className="row">
        {!showAbility ? (
          <button type="button" className="chip-btn" onClick={() => setShowAbility(true)}>
            Add ability to item
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <strong>Ability</strong>
            <button type="button" className="chip-btn" onClick={() => clearAbilityFields()}>
              Remove ability
            </button>
          </div>
        )}
      </div>

      {showAbility && (
        <>
          <div className="row">
            <input className={missingFields.includes('Ability name') ? 'error' : ''} placeholder="Ability name" value={abilityName} onChange={(e) => { setAbilityName(e.target.value); clearMissingField('Ability name') }} />
            {missingFields.includes('Ability name') && formError && <div className="field-error">Ability name is required</div>}
          </div>

          <div className="row">
            <textarea className={missingFields.includes('Ability description') ? 'error' : ''} placeholder="Ability description" value={abilityDescription} onChange={(e) => { setAbilityDescription(e.target.value); clearMissingField('Ability description') }} />
            {missingFields.includes('Ability description') && formError && <div className="field-error">Ability description is required</div>}
          </div>

          <div className="row">
            <input className={missingFields.includes('Ability keywords') ? 'error' : ''} placeholder="Ability keywords (comma-separated)" value={abilityKeywords} onChange={(e) => { setAbilityKeywords(e.target.value); clearMissingField('Ability keywords') }} />
            {missingFields.includes('Ability keywords') && formError && <div className="field-error">Ability keywords are required</div>}
          </div>

          <div className="row">
            <input className={missingFields.includes('Ability type') ? 'error' : ''} placeholder="Ability type" value={abilityType} onChange={(e) => { setAbilityType(e.target.value); clearMissingField('Ability type') }} />
            <input className={missingFields.includes('Ability range') ? 'error' : ''} placeholder="Ability range" value={abilityRange} onChange={(e) => { setAbilityRange(e.target.value); clearMissingField('Ability range') }} />
          </div>

          <div className="row">
            <input className={missingFields.includes('Ability targets') ? 'error' : ''} placeholder="Ability targets" value={abilityTargets} onChange={(e) => { setAbilityTargets(e.target.value); clearMissingField('Ability targets') }} />
            {missingFields.includes('Ability targets') && formError && <div className="field-error">Ability targets are required</div>}
          </div>

          <div className="row">
            <textarea className={missingFields.includes('Ability effect') ? 'error' : ''} placeholder="Ability effect" value={abilityEffect} onChange={(e) => { setAbilityEffect(e.target.value); clearMissingField('Ability effect') }} />
            {missingFields.includes('Ability effect') && formError && <div className="field-error">Ability effect is required</div>}
          </div>

          <div className="row">
            {!showAbilityPr ? (
              <button type="button" className="chip-btn" onClick={() => setShowAbilityPr(true)}>Add ability power roll</button>
            ) : (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <strong>Ability Power Roll</strong>
                <button type="button" className="chip-btn" onClick={() => { setShowAbilityPr(false); setAbilityPrHeader(''); setAbilityPrTier1(''); setAbilityPrTier2(''); setAbilityPrTier3('') }}>
                  Remove power roll
                </button>
              </div>
            )}
          </div>

          {showAbilityPr && (
            <>
              <div className="row">
                <input placeholder="Power Roll Modifier (example: Might or Agility, 2)" value={abilityPrHeader} onChange={(e) => setAbilityPrHeader(e.target.value)} />
              </div>

              <div className="row">
                <input placeholder="Tier 1 (<=11)" value={abilityPrTier1} onChange={(e) => setAbilityPrTier1(e.target.value)} />
                <input placeholder="Tier 2 (12-16)" value={abilityPrTier2} onChange={(e) => setAbilityPrTier2(e.target.value)} />
              </div>

              <div className="row">
                <input placeholder="Tier 3 (17+)" value={abilityPrTier3} onChange={(e) => setAbilityPrTier3(e.target.value)} />
              </div>
            </>
          )}
        </>
      )}

      <div className="row">
        {!showItemPr ? (
          <button type="button" className="chip-btn" onClick={() => setShowItemPr(true)}>
            Add power roll to item
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <strong>Item Power Roll</strong>
            <button type="button" className="chip-btn" onClick={() => clearItemPrFields()}>
              Remove power roll
            </button>
          </div>
        )}
      </div>

      {showItemPr && (
        <>
          <div className="row">
            <input placeholder="Power Roll Modifier (example: Might or Agility, 2)" value={itemPrHeader} onChange={(e) => setItemPrHeader(e.target.value)} />
          </div>

          <div className="row">
            <input placeholder="Tier 1 (<=11)" value={itemPrTier1} onChange={(e) => setItemPrTier1(e.target.value)} />
            <input placeholder="Tier 2 (12-16)" value={itemPrTier2} onChange={(e) => setItemPrTier2(e.target.value)} />
          </div>

          <div className="row">
            <input placeholder="Tier 3 (17+)" value={itemPrTier3} onChange={(e) => setItemPrTier3(e.target.value)} />
          </div>
        </>
      )}

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

          {formError && <div style={{ color: '#f87171', margin: '6px 0' }}>{formError}</div>}
          <div className="row actions">
            <button type="submit" className="chip-btn" disabled={!name.trim() || !description.trim() || (type === 'Leveled' ? (!firstLevel.trim() || !fifthLevel.trim() || !ninthLevel.trim()) : !effect.trim()) || abilityInvalid}>
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
