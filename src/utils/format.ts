export function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

const markerRe = /(?:<=\s*\d+|\d+\s*-\s*\d+|\d+\+)/g

export type PowerRollPart =
  | { type: 'plain'; text: string }
  | { type: 'pr'; marker: string; desc: string }

export function parsePowerRolls(text: string): PowerRollPart[] {
  if (!text) return []

  const parts: PowerRollPart[] = []
  let m: RegExpExecArray | null
  const matches: { idx: number; marker: string }[] = []
  while ((m = markerRe.exec(text))) {
    matches.push({ idx: m.index, marker: m[0].trim() })
  }

  if (matches.length === 0) {
    return [{ type: 'plain', text: text.trim() }]
  }

  // leading text
  if (matches[0].idx > 0) {
    const lead = text.slice(0, matches[0].idx).trim()
    if (lead) parts.push({ type: 'plain', text: lead })
  }

  for (let i = 0; i < matches.length; i++) {
    const marker = matches[i].marker
    const start = matches[i].idx + matches[i].marker.length
    const end = i + 1 < matches.length ? matches[i + 1].idx : text.length
    let desc = text.slice(start, end).trim()
    desc = desc.replace(/^[:\-\s]+/, '')
    parts.push({ type: 'pr', marker, desc })
  }

  return parts
}

export function formatPowerRollsHtml(text: string, forPrint = false) {
  if (!text) return ''

  function esc(s: string) {
    return escapeHtml(s).replace(/\n/g, '<br/>')
  }

  let result = ''
  let m: RegExpExecArray | null
  const matches: { idx: number; marker: string }[] = []
  while ((m = markerRe.exec(text))) {
    matches.push({ idx: m.index, marker: m[0].trim() })
  }

  if (matches.length === 0) {
    return `<p>${replacePotencyGlyphsHtml(esc(text))}</p>`
  }

  // leading text
  if (matches[0].idx > 0) {
    const lead = text.slice(0, matches[0].idx).trim()
    if (lead) result += `<p>${replacePotencyGlyphsHtml(esc(lead))}</p>`
  }

  for (let i = 0; i < matches.length; i++) {
    const marker = matches[i].marker
    const start = matches[i].idx + matches[i].marker.length
    const end = i + 1 < matches.length ? matches[i + 1].idx : text.length
    let desc = text.slice(start, end).trim()
    desc = desc.replace(/^[:\-\s]+/, '')
    const safeDesc = replacePotencyGlyphsHtml(esc(desc))

    result += `<div class="power-roll"><span class="range">${markerToGlyphHtml(marker, forPrint)}</span> <span class="pr-desc">${safeDesc}</span></div>`
  }

  return result
}

// Structured ability formatting helpers
import type { Ability, PowerRoll } from '../types/items'

function prStringToHtml(line: string, forPrint = false) {
  // Header detection: lines that start with 'Power Roll' (case-insensitive)
  if (/^\s*Power\s+Roll\b/i.test(line)) {
    return `<div class="power-roll power-roll-header">${escapeHtml(line.trim())}</div>`
  }

  // Extract marker (<=11, 12-16, 17+) at start if present, accept optional punctuation after marker
  const m = line.match(/^\s*(<=\s*\d+|\d+\s*-\s*\d+|\d+\+)\s*[:\-\.]?\s*(.*)$/)
  if (m) {
    const marker = m[1].trim()
    const desc = replacePotencyGlyphsHtml(escapeHtml(m[2].trim()))
    return `<div class="power-roll"><span class="range">${markerToGlyphHtml(marker, forPrint)}</span> <span class="pr-desc">${desc}</span></div>`
  }

  // fallback: treat as single-line PR header/desc
  return `<div class="power-roll"><span class="pr-desc">${replacePotencyGlyphsHtml(escapeHtml(line.trim()))}</span></div>`
}

export function formatAbilityHtml(a: Ability, forPrint = false) {
  const parts: string[] = [];
  parts.push(`<div class="ability"><h4>${escapeHtml(a.name)}</h4>`);
  if (a.description) parts.push(`<p class="desc ability-desc">${replacePotencyGlyphsHtml(escapeHtml(a.description))}</p>`);

  // Keywords and type on one line
  if ((a.keywords && a.keywords.length > 0) || a.type) {
    parts.push(`<div style="display:flex;align-items:baseline;margin-top:-0.2em;margin-bottom:0.2em">${a.keywords && a.keywords.length > 0 ? `<span style="font-weight:bold">${escapeHtml(a.keywords.join(', '))}</span>` : ''}${a.type ? `<span style="font-weight:bold;margin-left:auto">${escapeHtml(a.type)}</span>` : ''}</div>`);
  }
  // Range and targets on next line
  if (a.range || a.targets) {
    parts.push(`<div style="display:flex;align-items:baseline;font-weight:normal;margin-bottom:0.5em">${a.range ? `<span><span class="ds-glyph">&#x0044;</span> ${escapeHtml(a.range)}</span>` : ''}${a.targets ? `<span style="margin-left:auto"><span class="ds-glyph">&#x0054;</span> ${escapeHtml(a.targets)}</span>` : ''}</div>`);
  }

  // Power rolls (string[]). Render above the ability effect.
  if (a.power_roll && a.power_roll.length > 0) {
    parts.push('<div class="ability-prs">');
    for (const line of a.power_roll) parts.push(prStringToHtml(line, forPrint));
    parts.push('</div>');
  }

  // Effect paragraph (after power rolls)
  if (a.effect) parts.push(formatPowerRollsHtml(a.effect, forPrint));

  parts.push('</div>');
  return parts.join('');
}

export function formatAbilitiesHtmlStructured(abilities: Ability[] | undefined, forPrint = false) {
  if (!abilities || abilities.length === 0) return ''
  return abilities.map((a) => formatAbilityHtml(a, forPrint)).join('')
}

// Map a PR marker (<=11, 12-16, 17+) to a glyph codepoint from the DS Open Glyphs font
export function markerToGlyphHtml(marker: string, forPrint = false) {
  const m = marker.trim()
  // accept ascii '<=' or the unicode '≤' (U+2264)
  if (forPrint) {
    if (/^(?:<=|\u2264)/.test(m)) return `<span class="ds-glyph">&#x007B;</span>` // <=11 -> U+007B
    if (/^\d+\s*-\s*\d+/.test(m)) return `<span class="ds-glyph">&#x005F;</span>` // 12-16 -> U+005F
    if (/^\d+\+/.test(m)) return `<span class="ds-glyph">&#x007D;</span>` // 17+ -> U+007D
    return escapeHtml(marker)
  }

  if (/^(?:<=|\u2264)/.test(m)) return `<span class="ds-glyph">&#x005B;</span>` // <=11 -> U+005B
  if (/^\d+\s*-\s*\d+/.test(m)) return `<span class="ds-glyph">&#x002D;</span>` // 12-16 -> U+002D
  if (/^\d+\+/.test(m)) return `<span class="ds-glyph">&#x005D;</span>` // 17+ -> U+005D
  return escapeHtml(marker)
}

export function markerToGlyphChar(marker: string) {
  const m = marker.trim()
  // accept ascii '<=' or the unicode '≤' (U+2264)
  if (/^(?:<=|\u2264)/.test(m)) return String.fromCharCode(parseInt('005B', 16))
  if (/^\d+\s*-\s*\d+/.test(m)) return String.fromCharCode(parseInt('002D', 16))
  if (/^\d+\+/.test(m)) return String.fromCharCode(parseInt('005D', 16))
  return marker
}

// Replace potency markers with glyphs
export function replacePotencyGlyphs(text: string): string {
  if (!text) return text
  return text
    .replace(/I<WEAK/g, String.fromCharCode(0x0049) + String.fromCharCode(0x0078))
    .replace(/I<AVERAGE/g, String.fromCharCode(0x0049) + String.fromCharCode(0x0079))
    .replace(/I<STRONG/g, String.fromCharCode(0x0049) + String.fromCharCode(0x007A))
    .replace(/M<WEAK/g, String.fromCharCode(0x004D) + String.fromCharCode(0x0078))
    .replace(/M<AVERAGE/g, String.fromCharCode(0x004D) + String.fromCharCode(0x0079))
    .replace(/M<STRONG/g, String.fromCharCode(0x004D) + String.fromCharCode(0x007A))
    .replace(/P<WEAK/g, String.fromCharCode(0x0050) + String.fromCharCode(0x0078))
    .replace(/P<AVERAGE/g, String.fromCharCode(0x0050) + String.fromCharCode(0x0079))
    .replace(/P<STRONG/g, String.fromCharCode(0x0050) + String.fromCharCode(0x007A))
    .replace(/R<WEAK/g, String.fromCharCode(0x0052) + String.fromCharCode(0x0078))
    .replace(/R<AVERAGE/g, String.fromCharCode(0x0052) + String.fromCharCode(0x0079))
    .replace(/R<STRONG/g, String.fromCharCode(0x0052) + String.fromCharCode(0x007A))
    .replace(/A<WEAK/g, String.fromCharCode(0x0041) + String.fromCharCode(0x0078))
    .replace(/A<AVERAGE/g, String.fromCharCode(0x0041) + String.fromCharCode(0x0079))
    .replace(/A<STRONG/g, String.fromCharCode(0x0041) + String.fromCharCode(0x007A))
    // Numeric tiers: include the leading letter glyph + digit glyph
    .replace(/([IMPRA])<([0-6])/g, (_, letter: string, d: string) => String.fromCharCode(letter.charCodeAt(0)) + String.fromCharCode(0x0030 + Number(d)))
    // Fallback: bare <digit> (no letter prefix)
    .replace(/<([0-6])/g, (_, d: string) => String.fromCharCode(0x0030 + Number(d)))
}

export function replacePotencyGlyphsHtml(text: string): string {
  if (!text) return text

  const strengthToChar: Record<string, string> = {
    WEAK: '0078', // x
    AVERAGE: '0079', // y
    STRONG: '007A' // z
  }

  return text
    .replace(/([IMPRA])(?:<|&lt;|&#60;)(WEAK|AVERAGE|STRONG)/g, (_, letter: string, strength: string) => {
      const suffix = strengthToChar[strength]
      if (!suffix) return `${letter}<${strength}`

      // Prefix letter stays as-is; second codepoint encodes potency (x/y/z)
      const codepoint = letter.charCodeAt(0).toString(16).padStart(4, '0').toUpperCase()
      return `<span class="ds-glyph">&#x${codepoint};&#x${suffix};</span>`
    })
    // Numeric tiers: include optional leading letter glyph if provided
    .replace(/([IMPRA])?(?:<|&lt;|&#60;)([0-6])/g, (_, letter: string, d: string) => {
      const digit = (0x0030 + Number(d)).toString(16).padStart(4, '0').toUpperCase()
      const prefix = letter ? letter.charCodeAt(0).toString(16).padStart(4, '0').toUpperCase() : ''
      return `<span class="ds-glyph">${prefix ? `&#x${prefix};` : ''}&#x${digit};</span>`
    })
}

