# Draw Steel Treasure Trove

https://d-haim.github.io/DrawSteelTreasureTrove/
An app for browsing Draw Steel items (Consumables, Trinkets, Leveled) and building printable decks. Supports structured abilities and power rolls, and includes a custom card creator.

## Features

- Browse and filter by type, echelon, keywords, and search text
- Print deck preview and printable HTML with deck import/export
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
  - Drag to reorder
  - Import/Export to JSON
  - Toggle “Include project” to add or remove item project details from the item cards
  - Click “Show deck” to open printable HTML in a new tab
  - Custom card panel used to add a custom card to the deck. Supports adding one ability and one power roll to an item

## Project Structure

- `src/components/`
  - `ItemCard.tsx`: Base item layout, effect and power roll rendering, abilities
  - `LeveledCard.tsx`: Leveled item layout, collapsible levels, keywords
  - `PrintDeck.tsx`: Print deck panel and printable HTML
  - `CustomCardForm.tsx`: Custom card creation UI
- `src/utils/format.ts`: Glyph replacement, structured ability formatting, power roll parsing/formatting
- `src/types/items.ts`: Type definitions for items, abilities, and power rolls
- `assets/*.json`: Data sources (Consumables, Trinkets, Leveled)

## Glyph Rendering Notes

- Using the DS Open Glyphs font, created by MrMattDollar. https://mrmattdollar.itch.io/draw-steel-symbols-font
- Potency markers like `I<WEAK`, `M<AVERAGE`, `P<STRONG`, and numeric tiers (`A<3`, `<4`) are mapped to DS Open Glyphs codepoints
- Range (`&#x0044;`) and Targets (`&#x0054;`) glyph icons annotate ability meta lines
- Print uses the embedded DS Open Glyphs font for consistent output

## Contributing

Pull requests welcome. Keep changes minimal and focused; follow the existing style. For larger features, open an issue first to discuss scope and design.

## License

Draw Steel Treasure Trove is an independent product published under the DRAW STEEL Creator License and is not affiliated with MCDM Productions, LLC.
DRAW STEEL © 2024 MCDM Productions, LLC.
