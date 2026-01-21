# Tools

Utilities for Gas Town Hall website development and testing.

## Open Graph Preview Tool

Preview how your Open Graph cards will appear on social media platforms (Facebook, Twitter, LinkedIn, Discord) before deploying.

### Usage

```bash
# Preview local build (from deploy/ directory)
node tools/generate-og-preview.mjs

# Preview local dev server (requires server running on localhost:4321)
npm run dev  # In another terminal
node tools/generate-og-preview.mjs --local

# Preview production site (gastownhall.ai)
node tools/generate-og-preview.mjs --prod
```

### Output

Generates `tools/og-preview.html` showing:
- How cards appear on Facebook, Twitter, LinkedIn, Discord
- Current OG metadata (title, description, image, etc.)
- Visual preview with platform-specific styling

### Opening the Preview

```bash
# macOS
open tools/og-preview.html

# Linux
xdg-open tools/og-preview.html

# Windows
start tools/og-preview.html
```

### When to Use

- **Before deployment**: Check how changes will look on social media
- **After updating OG image**: Verify the new image displays correctly
- **When changing site metadata**: Review title/description updates
- **Debugging social media issues**: Compare local vs production

### Files

- `generate-og-preview.mjs` - Generator script
- `og-preview.html` - Generated preview (git-ignored)

### Example Workflow

```bash
# 1. Make changes to OG image or metadata
magick source.png -resize 1200x630 public/og-image.jpg

# 2. Build the site
npm run build

# 3. Generate preview
node tools/generate-og-preview.mjs

# 4. Open and review
open tools/og-preview.html

# 5. If needed, compare with production
node tools/generate-og-preview.mjs --prod
open tools/og-preview.html
```

## Adding New Tools

When adding new tools to this folder:

1. Create the tool file (preferably `.mjs` for ES modules)
2. Make it executable: `chmod +x tools/your-tool.mjs`
3. Add a shebang: `#!/usr/bin/env node`
4. Document it in this README
5. Add usage examples

## Notes

- Tools should be self-contained and not require installation of dependencies beyond what's in `package.json`
- Use ES modules (`.mjs`) for consistency
- Include helpful console output showing what the tool is doing
- Generate files in the `tools/` directory when possible
- Add generated files to `.gitignore` if they're not meant to be committed
