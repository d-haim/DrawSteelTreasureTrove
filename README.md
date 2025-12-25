# Draw Steel Treasure Trove

A React + TypeScript (Vite) app for browsing Draw Steel items (Consumables, Trinkets, Leveled) and building printable decks. It renders DS Open Glyphs for intensity markers and digit tokens, supports structured abilities and power rolls, and includes a custom card creator.

## Features

- Browse and filter by type, echelon, keywords, and search text
- Accurate glyph rendering for intensity markers (I/M/P/R/A<WEAK|AVERAGE|STRONG) and digits (0–6)
- Ability meta layout: keywords bold, type right-aligned; range and targets on the next line with glyph icons
- Print deck preview and printable HTML with deck import/export, drag-and-drop reordering
- Leveled items show 1st/5th/9th levels; collapsible in UI and concise single-line summaries in print
- Custom card form: add keywords, abilities, and item/ability power rolls

## Quick Start

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open the app at the URL Vite prints (default: http://localhost:5173/).

## Build

Create a production build (outputs to `dist/`):

```bash
npm run build
```

## Usage Overview

- Filters: Use the chips and search box to narrow results by Type, Echelon, Keywords, or text across name/description/effects.
- Random Item: Picks a random item from the current filtered list.
- Print Deck Panel:
  - Add items using card actions or the deck controls
  - Drag to reorder; import/export JSON; toggle “Include project”
  - Click “Show deck” to open printable HTML in a new tab

### Item Cards

- Header: Item name with type on the right; echelon chip on base item cards
- Keywords: Displayed as tags under the header
- Description: Italic and underlined; intensity markers render as glyphs
- Effects & Power Rolls:
  - Base items: Effect section with parsed power rolls rendered as range glyph + description
  - Abilities: Keywords/type on the first line; range/targets on the next line (glyphs for range/targets); description italic+underlined; ability power rolls above the ability effect

### Leveled Item Cards

- Keywords shown like base items
- Level entries are collapsible sections:
  - “1st Level”, “5th Level”, “9th Level” summaries expand to the full formatted content

### Print Deck

- Name and type share one line (type right-aligned)
- Keywords shown near the top (without the "Keywords:" label)
- Project text style matches the rest of the card text
- Leveled items render single-line summaries for 1st/5th/9th levels
- Ability descriptions remain italic and underlined; glyphs render in print

## Custom Card Form

- Top-level fields: Name, Type (Consumable/Trinket/Leveled), Echelon, Description, Keywords (comma-separated)
- Leveled items require text for 1st, 5th, and 9th levels
- Abilities (optional):
  - Buttons: “Add ability to item”, “Add power roll to item”
  - Fields: name, description, keywords, type, range, targets, effect
  - Power rolls (optional): header + tier descriptions (`<=11`, `12-16`, `17+`)
- Item-level power roll (optional): header + tiers
- Project (optional): prerequisite, source, characteristics (comma-separated), goal
- Export/Import: Use deck export/import to persist or load sets of cards

## Project Structure

- `src/components/`
  - `ItemCard.tsx`: Base item layout, effect and power roll rendering, abilities
  - `LeveledCard.tsx`: Leveled item layout, collapsible levels, keywords
  - `PrintDeck.tsx`: Print deck panel and printable HTML
  - `CustomCardForm.tsx`: Custom card creation UI
- `src/utils/format.ts`: Glyph replacement, structured ability formatting, power roll parsing/formatting
- `src/types/items.ts`: Type definitions for items, abilities, and power rolls
- `assets/*.json`: Data sources (Consumables, Trinkets, Leveled)
- `scripts/convert_leveled.js`: Utility script for leveled data conversion

## Glyph Rendering Notes

- Intensity markers like `I<WEAK`, `M<AVERAGE`, `P<STRONG`, and numeric tiers (`A<3`, `<4`) are mapped to DS Open Glyphs codepoints
- Range (`&#x0044;`) and Targets (`&#x0054;`) glyph icons annotate ability meta lines
- Print uses the embedded DS Open Glyphs font for consistent output

## Contributing

Pull requests welcome. Keep changes minimal and focused; follow the existing style. For larger features, open an issue first to discuss scope and design.

## License

Not specified. If you need a license, add one appropriate to your use.

# Draw Steel — Treasure Trove

Vite + React + TypeScript starter for the Draw Steel project.

Quick commands:

- Install: npm install
- Dev: npm run dev
- Build: npm run build
- Preview: npm run preview
- Lint: npm run lint
- Format: npm run format
