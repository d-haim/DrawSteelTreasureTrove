const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'Leveled.txt');
const out = path.join(__dirname, '..', 'Leveled.json');

const text = fs.readFileSync(src, 'utf8');
const lines = text.split(/\r?\n/);
let i = 0;
const items = [];

function nextNonEmpty(start) {
  let j = start;
  while (j < lines.length && lines[j].trim() === '') j++;
  return j;
}

while (i < lines.length) {
  i = nextNonEmpty(i);
  if (i >= lines.length) break;

  const name = lines[i].trim();
  i++;

  // description lines until we find a line starting with 'Keywords:'
  const descLines = [];
  while (i < lines.length && !/^Keywords:\s*/i.test(lines[i])) {
    if (lines[i].trim() !== '') descLines.push(lines[i].trim());
    i++;
  }
  const description = descLines.join(' ');

  // keywords
  const keywordsLine = (lines[i] || '')
  const keywords = [];
  if (/^Keywords:\s*/i.test(keywordsLine)) {
    const rest = keywordsLine.replace(/^Keywords:\s*/i, '').trim();
    rest.split(',').map(s => s.trim()).filter(Boolean).forEach(k => keywords.push(k));
    i++;
  }

  // Item Prerequisite (may wrap across lines)
  let prerequisite = undefined;
  if (i < lines.length && /^Item Prerequisite:\s*/i.test(lines[i])) {
    prerequisite = lines[i].replace(/^Item Prerequisite:\s*/i, '').trim();
    i++;
    while (i < lines.length && lines[i].trim() !== '' && !/^Project Source:\s*/i.test(lines[i]) && !/^Project Roll Characteristic:\s*/i.test(lines[i]) && !/^Project Goal:\s*/i.test(lines[i]) && !/^1st Level:\s*/i.test(lines[i]) && !/^5th Level:\s*/i.test(lines[i]) && !/^9th Level:\s*/i.test(lines[i])) {
      prerequisite += ' ' + lines[i].trim();
      i++;
    }
  }

  // Project Source (may wrap across lines)
  let projectSource = undefined;
  if (i < lines.length && /^Project Source:\s*/i.test(lines[i])) {
    projectSource = lines[i].replace(/^Project Source:\s*/i, '').trim();
    i++;
    while (i < lines.length && lines[i].trim() !== '' && !/^Project Roll Characteristic:\s*/i.test(lines[i]) && !/^Project Goal:\s*/i.test(lines[i]) && !/^1st Level:\s*/i.test(lines[i]) && !/^5th Level:\s*/i.test(lines[i]) && !/^9th Level:\s*/i.test(lines[i])) {
      projectSource += ' ' + lines[i].trim();
      i++;
    }
  }

  // Project Roll Characteristic (may wrap across lines)
  let projectChars = [];
  if (i < lines.length && /^Project Roll Characteristic:\s*/i.test(lines[i])) {
    let rest = lines[i].replace(/^Project Roll Characteristic:\s*/i, '').trim();
    i++;
    while (i < lines.length && lines[i].trim() !== '' && !/^Project Goal:\s*/i.test(lines[i]) && !/^1st Level:\s*/i.test(lines[i]) && !/^5th Level:\s*/i.test(lines[i]) && !/^9th Level:\s*/i.test(lines[i])) {
      rest += ' ' + lines[i].trim();
      i++;
    }
    // normalize ' or ' and ' and ' into commas
    rest = rest.replace(/\s+or\s+/gi, ',').replace(/\s+and\s+/gi, ',');
    projectChars = rest.split(',').map(s => s.trim()).filter(Boolean);
  }

  // Project Goal
  let projectGoal = undefined;
  if (i < lines.length && /^Project Goal:\s*/i.test(lines[i])) {
    projectGoal = lines[i].replace(/^Project Goal:\s*/i, '').trim();
    i++;
  }

  // Now parse 1st/5th/9th levels
  let first_level = undefined;
  let fifth_level = undefined;
  let ninth_level = undefined;

  // consume until next blank line, recognizing level headers
  while (i < lines.length && lines[i].trim() === '') i++;

  // 1st Level
  if (i < lines.length && /^1st Level:\s*/i.test(lines[i])) {
    let line = lines[i].replace(/^1st Level:\s*/i, '').trim();
    i++;
    const parts = [line];
    while (i < lines.length && !/^5th Level:\s*/i.test(lines[i]) && !/^9th Level:\s*/i.test(lines[i]) && lines[i].trim() !== '') {
      parts.push(lines[i].trim());
      i++;
    }
    first_level = parts.join(' ');
  }

  // 5th Level
  if (i < lines.length && /^5th Level:\s*/i.test(lines[i])) {
    let line = lines[i].replace(/^5th Level:\s*/i, '').trim();
    i++;
    const parts = [line];
    while (i < lines.length && !/^9th Level:\s*/i.test(lines[i]) && lines[i].trim() !== '') {
      parts.push(lines[i].trim());
      i++;
    }
    fifth_level = parts.join(' ');
  }

  // 9th Level
  if (i < lines.length && /^9th Level:\s*/i.test(lines[i])) {
    let line = lines[i].replace(/^9th Level:\s*/i, '').trim();
    i++;
    const parts = [line];
    while (i < lines.length && lines[i].trim() !== '') {
      parts.push(lines[i].trim());
      i++;
    }
    ninth_level = parts.join(' ');
  }

  const item = {
    name,
    type: 'Leveled',
    keywords,
    source: 'Draw Steel Herose',
    description,
    project: {
      prerequisite: prerequisite || undefined,
      source: projectSource || undefined,
      characteristics: projectChars.length ? projectChars : undefined,
      goal: projectGoal || undefined
    },
    first_level: first_level || undefined,
    fifth_level: fifth_level || undefined,
    ninth_level: ninth_level || undefined
  };

  // remove undefined fields for cleanliness
  function clean(obj) {
    Object.keys(obj).forEach(k => {
      if (obj[k] && typeof obj[k] === 'object') clean(obj[k]);
      if (obj[k] === undefined) delete obj[k];
    });
  }
  clean(item);

  items.push(item);
}

fs.writeFileSync(out, JSON.stringify(items, null, 2), 'utf8');
console.log('Wrote', items.length, 'items to', out);
