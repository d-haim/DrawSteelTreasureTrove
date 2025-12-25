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

export function formatPowerRollsHtml(text: string) {
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
    return `<p>${esc(text)}</p>`
  }

  // leading text
  if (matches[0].idx > 0) {
    const lead = text.slice(0, matches[0].idx).trim()
    if (lead) result += `<p>${esc(lead)}</p>`
  }

  for (let i = 0; i < matches.length; i++) {
    const marker = matches[i].marker
    const start = matches[i].idx + matches[i].marker.length
    const end = i + 1 < matches.length ? matches[i + 1].idx : text.length
    let desc = text.slice(start, end).trim()
    desc = desc.replace(/^[:\-\s]+/, '')

    result += `<div class="power-roll"><span class="range">${escapeHtml(marker)}:</span> <span class="pr-desc">${esc(desc)}</span></div>`
  }

  return result
}


