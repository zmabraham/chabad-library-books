# Undaunted Knowledge System

A three-layer knowledge system built around Rabbi David Eliezrie's biography *"Undaunted: How the Sixth Lubavitcher Rebbe..."* (Toby Press, 2025).

## Architecture

The system maintains a strict separation between:

1. **Source Layer** — Tagged text from the original book
2. **Index Layer** — Curated entity registry (people, places, events, concepts)
3. **Knowledge Layer** — Derived wiki entries with citations

## Project Structure

```
├── registry/           # YAML entity definitions (the source of truth)
│   ├── people.yaml     # Person entities
│   ├── places.yaml     # Place entities
│   ├── events.yaml     # Event entities
│   ├── concepts.yaml   # Concept entities
│   ├── quotes.yaml     # Quote entities
│   ├── times.yaml      # Time/year entities
│   ├── relationships.yaml  # Relationships between entities
│   ├── chapters.yaml   # Book chapters
│   └── wiki/           # Markdown wiki entries per entity
├── pipeline/           # Python build tools
│   └── undaunted/      # Main package
├── site/               # Vite + TypeScript frontend
└── scripts/            # Build and extraction scripts
```

## Development

### Prerequisites

- Python 3.11+
- Node.js 20+
- Git

### Setup

```bash
# Install Python dependencies
pip install -e pipeline/

# Install frontend dependencies
cd site && npm install
```

### Commands

```bash
# Validate the registry
undaunted validate

# Build the site
undaunted build --output site/public/data

# Run frontend dev server
cd site && npm run dev
```

## License

- Code: MIT License
- Registry & Wiki Content: CC-BY-SA-4.0
