# Gas Town Hall Website - Agent Guide

## Project Structure

```
.
├── AGENTS.md              # This file - agent guidance
├── CLAUDE.md              # Claude-specific instructions
├── GEMINI.md              # Gemini-specific instructions
├── plan.md                # Implementation plan
├── learnings.md           # Document learnings here (to be created)
├── docs-fodder/           # Source content (DO NOT MODIFY)
│   ├── gastown-docs/      # Gas Town documentation (25 markdown files)
│   │   ├── overview.md
│   │   ├── concepts/      # 6 concept docs
│   │   ├── design/        # 11 design docs
│   │   └── examples/      # 1 example doc
│   └── steve-blog-posts/  # Steve's blog posts (5 files)
├── src/                   # Website source (TO BE CREATED)
│   └── (Astro project)
├── deploy/                # Build output (TO BE CREATED)
└── tmp/                   # Scratch files
```

## Key Information

- **Rig Name**: Derived from project folder (e.g., `website-eli`)
- **Beads Prefix**: Same as rig name
- **Technology**: Astro static site generator
- **Analytics**: Plausible (privacy-respecting)

## Content Sources

### Blog Posts to Link (from `docs-fodder/steve-blog-posts/`)
1. Welcome to Gas Town.md
2. The Future of Coding Agents.md
3. BAGS and the Creator Economy.md
4. Gas Town Emergency User Manual.md
5. Stevey's Birthday Blog.md

### Docs to Shred (from `docs-fodder/gastown-docs/`)
- 25 markdown files organized into concepts/, design/, examples/
- Need a shredder script to sync these into the website

## Social Links
- Discord: https://discord.gg/pKsyZJ3S
- X: x.com/gastownhall

## Landing Page Headline
"Gas Town is powerful but chaotic. We help you wrangle the chimps."
