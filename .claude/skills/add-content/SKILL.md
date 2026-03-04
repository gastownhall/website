---
name: add-content
description: "Add new blog posts and YouTube videos to the Gas Town Hall website. Use when new markdown files appear in docs-fodder/steve-blog-posts/ or docs-fodder/youtube/, user says 'add content', 'add blog post', 'new blog', 'new video', or asks to update the Town Crier section."
---

# Add Content to Gas Town Hall

Add blog posts (from Medium) and YouTube videos to the site by updating `site.config.json` and downloading images.

## Workflow

### 1. Identify New Content

Compare files in `docs-fodder/steve-blog-posts/*.md` and `docs-fodder/youtube/*.md` against existing entries in `site.config.json` `blogPosts` array. New files not yet in the config need to be added.

### 2. Extract Metadata from Each New File

**Medium blog posts** (`docs-fodder/steve-blog-posts/*.md`):

- **Title**: First `# heading` (line 1-2)
- **Date**: Look for absolute date like `Feb 11, 2026` or relative like `3 days ago`. If relative or "Just now", search the web: `steve yegge "<title>" medium date` to get the month
- **URL**: Extract from the `redirect=` parameter in the first Medium signin link, e.g. `redirect=https%3A%2F%2Fsteve-yegge.medium.com%2Fthe-ai-vampire-eda6e4f07163` → `https://steve-yegge.medium.com/the-ai-vampire-eda6e4f07163`
- **Description**: First substantive paragraph after the metadata/image lines (~1-2 sentences)
- **Lead image URL**: First `![...](<url>)` image in the post body (skip the author avatar). Usually `https://miro.medium.com/v2/resize:fit:1400/format:webp/1*...`

**YouTube videos** (`docs-fodder/youtube/*.md`):

- **Title**: Filename without `.md` extension
- **Date**: First line, e.g. `Premiered Feb 18, 2026`
- **URL**: User must provide the YouTube URL (not in the markdown)
- **Description**: Second line of the file (the description text)
- **Thumbnail**: `https://img.youtube.com/vi/{VIDEO_ID}/mqdefault.jpg` where VIDEO_ID is extracted from the URL (use `mqdefault.jpg` to avoid letterboxing)

### 3. Update site.config.json

Add new entries to the `blogPosts` array. Keep **newest first** date order.

Each entry:
```json
{
  "title": "The Title",
  "url": "https://...",
  "description": "One to two sentence description.",
  "date": "Mon DD",
  "image": "/images/blog/kebab-case-name.jpg"
}
```

- **date format**: Abbreviated month + day + year. Examples: `Jan 1, 2026`, `Feb 11, 2026`, `Mar 4, 2026`
- **image path**: `/images/blog/` + kebab-case title + `.jpg`

### 4. Download Images

#### File naming

Use kebab-case title + `.jpg` extension, matching the `image` path in `site.config.json`:
- "The AI Vampire" → `the-ai-vampire.jpg`
- "Gas Town Refinery #1" → `gas-town-refinery-1.jpg`

#### Save to BOTH locations

Images must exist in two places:

1. **`src/static/images/blog/`** — source of truth, copied to publicDir during build
2. **`tmp/public/images/blog/`** — Astro's publicDir (`astro.config.mjs` sets `publicDir: './tmp/public'`), served directly by the dev server

If you only save to `src/static/`, images will 404 on the dev server until a full build runs. Always copy to both.

#### Medium images

Extract the lead image URL from the markdown (first `![...](<url>)` after the author avatar, usually from `miro.medium.com`):
```bash
curl -sL -o src/static/images/blog/kebab-name.jpg "<miro_url>"
cp src/static/images/blog/kebab-name.jpg tmp/public/images/blog/
```
These download as webp files despite the `.jpg` extension. This is normal and matches existing images. Medium CDN images are typically wide aspect ratio without letterboxing — they work well with `object-fit: cover`.

#### YouTube thumbnails

Use `mqdefault.jpg` (**not** `hqdefault.jpg` or `sddefault.jpg` — those have black letterbox bars baked into the image):
```bash
curl -sL -o src/static/images/blog/kebab-name.jpg "https://img.youtube.com/vi/{VIDEO_ID}/mqdefault.jpg"
cp src/static/images/blog/kebab-name.jpg tmp/public/images/blog/
```
- `mqdefault.jpg` = 320x180 (16:9, minimal/no letterboxing)
- `hqdefault.jpg` = 480x360 (4:3, thick black bars top/bottom) — **avoid**
- `sddefault.jpg` = 640x480 (4:3, thick black bars top/bottom) — **avoid**

YouTube videos may also have a `link:` field on the last line of their markdown file.

#### How images display

Images render in `src/pages/index.astro` in the Town Crier section as:
- **112x112px** square (desktop) or **80x80px** (mobile, ≤768px)
- **`object-fit: cover`** — image fills the square, cropping overflow while maintaining aspect ratio (no black bars, no distortion)
- Wrapped in a `blog-image-frame` div with a brass/bronze gradient border (4px padding)
- The `image` field in `site.config.json` is used directly as the `<img src>` attribute

**Image requirements**: Any aspect ratio works since `object-fit: cover` crops to fill the square. Avoid images with letterboxing/black bars baked in — those bars become visible content that won't be cropped away. Landscape-oriented images work best.

### 5. Verify

Run `npm run dev` and check `localhost:4321` to confirm the Town Crier section renders the new entries with images loading correctly and filling their frames without black bars.
