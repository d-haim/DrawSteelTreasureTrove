import { describe, it, expect } from 'vitest'
import {
  escapeHtml,
  parsePowerRolls,
  formatPowerRollsHtml,
  markerToGlyphHtml,
  markerToGlyphChar,
  replaceIntensityGlyphs,
  replaceIntensityGlyphsHtml,
  formatAbilityHtml,
  formatAbilitiesHtmlStructured
} from './format'
import type { Ability } from '../types/items'

describe('escapeHtml', () => {
  it('escapes HTML special characters', () => {
    expect(escapeHtml('&')).toBe('&amp;')
    expect(escapeHtml('<')).toBe('&lt;')
    expect(escapeHtml('>')).toBe('&gt;')
    expect(escapeHtml('"')).toBe('&quot;')
    expect(escapeHtml("'")).toBe('&#039;')
  })

  it('escapes multiple characters', () => {
    expect(escapeHtml('<div class="test">')).toBe('&lt;div class=&quot;test&quot;&gt;')
  })

  it('returns empty string for empty input', () => {
    expect(escapeHtml('')).toBe('')
  })
})

describe('parsePowerRolls', () => {
  it('returns empty array for empty text', () => {
    expect(parsePowerRolls('')).toEqual([])
  })

  it('returns plain text when no markers present', () => {
    expect(parsePowerRolls('This is plain text')).toEqual([
      { type: 'plain', text: 'This is plain text' }
    ])
  })

  it('parses <= marker correctly', () => {
    const result = parsePowerRolls('<=11: Description here')
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      type: 'pr',
      marker: '<=11',
      desc: 'Description here'
    })
  })

  it('parses range marker correctly', () => {
    const result = parsePowerRolls('12-16: Mid range effect')
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      type: 'pr',
      marker: '12-16',
      desc: 'Mid range effect'
    })
  })

  it('parses + marker correctly', () => {
    const result = parsePowerRolls('17+: High roll effect')
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      type: 'pr',
      marker: '17+',
      desc: 'High roll effect'
    })
  })

  it('parses multiple markers', () => {
    const result = parsePowerRolls('<=11: Low 12-16: Mid 17+: High')
    expect(result).toHaveLength(3)
    expect(result[0].marker).toBe('<=11')
    expect(result[1].marker).toBe('12-16')
    expect(result[2].marker).toBe('17+')
  })

  it('handles leading text before markers', () => {
    const result = parsePowerRolls('Some intro text <=11: Effect')
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ type: 'plain', text: 'Some intro text' })
    expect(result[1].type).toBe('pr')
  })

  it('trims whitespace and removes leading punctuation from descriptions', () => {
    const result = parsePowerRolls('<=11:  -  Description')
    expect(result[0].desc).toBe('Description')
  })
})

describe('formatPowerRollsHtml', () => {
  it('returns empty string for empty input', () => {
    expect(formatPowerRollsHtml('')).toBe('')
  })

  it('wraps plain text in paragraph', () => {
    const result = formatPowerRollsHtml('Plain text')
    expect(result).toContain('<p>')
    expect(result).toContain('Plain text')
    expect(result).toContain('</p>')
  })

  it('formats power roll with marker and description', () => {
    const result = formatPowerRollsHtml('<=11: Effect')
    expect(result).toContain('class="power-roll"')
    expect(result).toContain('class="range"')
    expect(result).toContain('class="pr-desc"')
    expect(result).toContain('Effect')
  })

  it('escapes HTML in descriptions', () => {
    const result = formatPowerRollsHtml('<=11: <script>alert("xss")</script>')
    expect(result).not.toContain('<script>')
    expect(result).toContain('&lt;script&gt;')
  })

  it('uses different glyphs for print mode', () => {
    const uiMode = formatPowerRollsHtml('<=11: Effect', false)
    const printMode = formatPowerRollsHtml('<=11: Effect', true)
    expect(uiMode).not.toBe(printMode)
  })
})

describe('markerToGlyphHtml', () => {
  describe('UI mode', () => {
    it('converts <= marker to correct glyph', () => {
      const result = markerToGlyphHtml('<=11', false)
      expect(result).toContain('ds-glyph')
      expect(result).toContain('&#x005B;')
    })

    it('converts range marker to correct glyph', () => {
      const result = markerToGlyphHtml('12-16', false)
      expect(result).toContain('&#x002D;')
    })

    it('converts + marker to correct glyph', () => {
      const result = markerToGlyphHtml('17+', false)
      expect(result).toContain('&#x005D;')
    })

    it('handles unicode <= character', () => {
      const result = markerToGlyphHtml('≤11', false)
      expect(result).toContain('&#x005B;')
    })
  })

  describe('print mode', () => {
    it('uses different glyphs for print', () => {
      const result = markerToGlyphHtml('<=11', true)
      expect(result).toContain('&#x007B;')
    })

    it('converts range marker for print', () => {
      const result = markerToGlyphHtml('12-16', true)
      expect(result).toContain('&#x005F;')
    })

    it('converts + marker for print', () => {
      const result = markerToGlyphHtml('17+', true)
      expect(result).toContain('&#x007D;')
    })
  })

  it('escapes unknown markers', () => {
    const result = markerToGlyphHtml('<unknown>', false)
    expect(result).toContain('&lt;')
  })
})

describe('markerToGlyphChar', () => {
  it('converts <= marker to character', () => {
    const result = markerToGlyphChar('<=11')
    expect(result).toBe('[')
  })

  it('converts range marker to character', () => {
    const result = markerToGlyphChar('12-16')
    expect(result).toBe('-')
  })

  it('converts + marker to character', () => {
    const result = markerToGlyphChar('17+')
    expect(result).toBe(']')
  })

  it('handles unicode <= character', () => {
    const result = markerToGlyphChar('≤11')
    expect(result).toBe('[')
  })

  it('returns marker unchanged if no match', () => {
    const result = markerToGlyphChar('unknown')
    expect(result).toBe('unknown')
  })
})

describe('replaceIntensityGlyphs', () => {
  it('returns empty string for empty input', () => {
    expect(replaceIntensityGlyphs('')).toBe('')
  })

  it('replaces I<WEAK with correct glyphs', () => {
    const result = replaceIntensityGlyphs('I<WEAK')
    expect(result).toBe(String.fromCharCode(0x0049) + String.fromCharCode(0x0078))
  })

  it('replaces I<AVERAGE with correct glyphs', () => {
    const result = replaceIntensityGlyphs('I<AVERAGE')
    expect(result).toBe(String.fromCharCode(0x0049) + String.fromCharCode(0x0079))
  })

  it('replaces I<STRONG with correct glyphs', () => {
    const result = replaceIntensityGlyphs('I<STRONG')
    expect(result).toBe(String.fromCharCode(0x0049) + String.fromCharCode(0x007A))
  })

  it('replaces multiple markers in text', () => {
    const result = replaceIntensityGlyphs('I<WEAK and M<STRONG')
    expect(result).toContain(String.fromCharCode(0x0049))
    expect(result).toContain(String.fromCharCode(0x004D))
  })

  it('replaces all letter variants (I, M, P, R, A)', () => {
    const text = 'I<WEAK M<WEAK P<WEAK R<WEAK A<WEAK'
    const result = replaceIntensityGlyphs(text)
    expect(result).not.toContain('<WEAK')
  })

  it('replaces numeric tiers correctly', () => {
    const result = replaceIntensityGlyphs('I<0 I<6')
    expect(result).toContain(String.fromCharCode(0x0049))
    expect(result).toContain(String.fromCharCode(0x0030))
    expect(result).toContain(String.fromCharCode(0x0036))
  })

  it('handles bare numeric tiers without letter prefix', () => {
    const result = replaceIntensityGlyphs('<3')
    expect(result).toContain(String.fromCharCode(0x0033))
  })
})

describe('replaceIntensityGlyphsHtml', () => {
  it('returns empty string for empty input', () => {
    expect(replaceIntensityGlyphsHtml('')).toBe('')
  })

  it('wraps intensity markers in span with ds-glyph class', () => {
    const result = replaceIntensityGlyphsHtml('I<WEAK')
    expect(result).toContain('class="ds-glyph"')
    expect(result).toContain('&#x0049;')
    expect(result).toContain('&#x0078;')
  })

  it('handles escaped HTML entities', () => {
    const result = replaceIntensityGlyphsHtml('I&lt;WEAK')
    expect(result).toContain('class="ds-glyph"')
  })

  it('replaces all strength levels', () => {
    const text = 'I<WEAK I<AVERAGE I<STRONG'
    const result = replaceIntensityGlyphsHtml(text)
    expect(result).toContain('&#x0078;') // WEAK
    expect(result).toContain('&#x0079;') // AVERAGE
    expect(result).toContain('&#x007A;') // STRONG
  })

  it('handles numeric tiers with letter prefix', () => {
    const result = replaceIntensityGlyphsHtml('M<3')
    expect(result).toContain('class="ds-glyph"')
    expect(result).toContain('&#x004D;')
    expect(result).toContain('&#x0033;')
  })

  it('handles bare numeric tiers', () => {
    const result = replaceIntensityGlyphsHtml('<5')
    expect(result).toContain('class="ds-glyph"')
    expect(result).toContain('&#x0035;')
  })
})

describe('formatAbilityHtml', () => {
  it('formats ability with name', () => {
    const ability: Ability = {
      name: 'Test Ability'
    }
    const result = formatAbilityHtml(ability)
    expect(result).toContain('<h4>Test Ability</h4>')
    expect(result).toContain('class="ability"')
  })

  it('includes description when present', () => {
    const ability: Ability = {
      name: 'Test',
      description: 'This is a description'
    }
    const result = formatAbilityHtml(ability)
    expect(result).toContain('This is a description')
    expect(result).toContain('class="desc ability-desc"')
  })

  it('escapes HTML in name and description', () => {
    const ability: Ability = {
      name: '<script>alert("xss")</script>',
      description: '<img src=x onerror=alert(1)>'
    }
    const result = formatAbilityHtml(ability)
    expect(result).not.toContain('<script>')
    expect(result).not.toContain('<img')
    expect(result).toContain('&lt;')
  })

  it('formats keywords when present', () => {
    const ability: Ability = {
      name: 'Test',
      keywords: ['Magic', 'Attack']
    }
    const result = formatAbilityHtml(ability)
    expect(result).toContain('Magic, Attack')
  })

  it('formats type when present', () => {
    const ability: Ability = {
      name: 'Test',
      type: 'Action'
    }
    const result = formatAbilityHtml(ability)
    expect(result).toContain('Action')
  })

  it('formats range with glyph', () => {
    const ability: Ability = {
      name: 'Test',
      range: '5'
    }
    const result = formatAbilityHtml(ability)
    expect(result).toContain('ds-glyph')
    expect(result).toContain('&#x0044;')
    expect(result).toContain('5')
  })

  it('formats targets with glyph', () => {
    const ability: Ability = {
      name: 'Test',
      targets: '3 enemies'
    }
    const result = formatAbilityHtml(ability)
    expect(result).toContain('ds-glyph')
    expect(result).toContain('&#x0054;')
    expect(result).toContain('3 enemies')
  })

  it('formats power rolls when present', () => {
    const ability: Ability = {
      name: 'Test',
      power_roll: ['Power Roll', '<=11: Low effect']
    }
    const result = formatAbilityHtml(ability)
    expect(result).toContain('Power Roll')
    expect(result).toContain('Low effect')
    expect(result).toContain('class="ability-prs"')
  })

  it('formats effect when present', () => {
    const ability: Ability = {
      name: 'Test',
      effect: 'This is the effect'
    }
    const result = formatAbilityHtml(ability)
    expect(result).toContain('This is the effect')
  })

  it('handles complete ability with all fields', () => {
    const ability: Ability = {
      name: 'Complete Ability',
      description: 'Full description',
      keywords: ['Magic', 'Attack'],
      type: 'Action',
      range: '5',
      targets: '2 creatures',
      power_roll: ['Power Roll', '<=11: Low', '12-16: Mid', '17+: High'],
      effect: 'Additional effect text'
    }
    const result = formatAbilityHtml(ability)
    expect(result).toContain('Complete Ability')
    expect(result).toContain('Full description')
    expect(result).toContain('Magic, Attack')
    expect(result).toContain('Action')
    expect(result).toContain('5')
    expect(result).toContain('2 creatures')
    expect(result).toContain('Low')
    expect(result).toContain('Mid')
    expect(result).toContain('High')
    expect(result).toContain('Additional effect text')
  })
})

describe('formatAbilitiesHtmlStructured', () => {
  it('returns empty string for undefined abilities', () => {
    expect(formatAbilitiesHtmlStructured(undefined)).toBe('')
  })

  it('returns empty string for empty array', () => {
    expect(formatAbilitiesHtmlStructured([])).toBe('')
  })

  it('formats single ability', () => {
    const abilities: Ability[] = [{ name: 'Test Ability' }]
    const result = formatAbilitiesHtmlStructured(abilities)
    expect(result).toContain('Test Ability')
    expect(result).toContain('class="ability"')
  })

  it('formats multiple abilities', () => {
    const abilities: Ability[] = [
      { name: 'First Ability', description: 'First desc' },
      { name: 'Second Ability', description: 'Second desc' }
    ]
    const result = formatAbilitiesHtmlStructured(abilities)
    expect(result).toContain('First Ability')
    expect(result).toContain('First desc')
    expect(result).toContain('Second Ability')
    expect(result).toContain('Second desc')
  })

  it('passes forPrint parameter correctly', () => {
    const abilities: Ability[] = [
      { name: 'Test', power_roll: ['<=11: Effect'] }
    ]
    const uiResult = formatAbilitiesHtmlStructured(abilities, false)
    const printResult = formatAbilitiesHtmlStructured(abilities, true)
    expect(uiResult).not.toBe(printResult)
  })
})
