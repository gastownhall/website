# Plan: Build gastownhall.ai Using Gas Town (gt CLI)

## Primary Goals

1. **Build the gastownhall.ai website** using gastown itself via the `gt` CLI
2. **Learn how to use gt for end-to-end scenarios** and document everything in `learnings.md`, with explicit **how/why**, **what worked**, **what didn't**, and **workarounds**

## Learning Capture Protocol (Highest Priority)

This project succeeds or fails based on the quality of the learnings. After every phase and every meaningful `gt` command, update `learnings.md` with:
- **What worked (how/why)**: exact command, expected vs. actual behavior, why it worked
- **What didn't work (how/why)**: error output, mismatches, likely root cause
- **Workarounds**: what you did differently, why it unblocked you, tradeoffs
- **What you learned**: principles about Gas Town workflows and sequencing

Do not batch-learn at the end only. Capture learnings continuously so the "how" and "why" are fresh and accurate.

## Learning Emphasis (Most Important)

Every phase must capture:
- **What worked and why** (command, setup, sequencing, expectations vs. reality)
- **What didn't work and why** (errors, gaps, surprises, missing docs)
- **Workarounds** (exact steps taken + rationale)
- **What was learned** (principles, best practices, pitfalls to avoid)

Additional requirement:
- **Explore new paths** by running `gt --help` and at least 3 `gt <command> --help` calls for commands NOT already in this plan; document what you learned and how these might help future workflows.

## Critical Constraint

> **If you write any code yourself, then you've failed.**

All code must be written by agents dispatched via `gt` commands. This is a learning exercise to understand how Gas Town orchestrates work. The human operator (us) only issues `gt` commands - never writes HTML, CSS, JS, or Astro code directly.

---

## Don't Stop Until You've Achieved the Following

### Website Deliverables

- [ ] **Landing page** exists at `src/` with:
  - [ ] Headline: "Gas Town is powerful but chaotic. We help you wrangle the chimps."
  - [ ] Links to all 5 of Steve's blog posts (from `docs-fodder/steve-blog-posts/`)
  - [ ] Big Discord invite button (https://discord.gg/fuge9UVvzF) - prominent CTA
  - [ ] X link (x.com/gastownhall)
  - [ ] Navigation link to docs sub-page

- [ ] **Docs landing page** at `/docs` showing:
  - [ ] Overview content from gastown-docs
  - [ ] Links to ALL sub-pages (25 markdown files across concepts/, design/, examples/)

- [ ] **Docs shredder tool** that:
  - [ ] Reads `docs-fodder/gastown-docs/` markdown files
  - [ ] Generates corresponding pages in the website docs section
  - [ ] Can be re-run when gastown-docs evolves (idempotent updates)

- [ ] **Infrastructure**:
  - [ ] Plausible analytics integration (privacy-respecting, no cookies)
  - [ ] `robots.txt` file
  - [ ] `llms.txt` generator script (creates llms.txt from site contents)
  - [ ] SEO meta tags on all pages (title, description, og:image, etc.)
  - [ ] Privacy policy page

- [ ] **Build system**:
  - [ ] Astro project scaffold in `src/`
  - [ ] Build scripts that produce deployable output in `deploy/` folder
  - [ ] Can run `npm run build` (or similar) and get production-ready output

### Quality Criteria (for code review)

- [ ] **CSS**: Clear separation and reuse of styles, consistent application, well-written
- [ ] **JS** (if any): Clean, minimal, something to be proud of
- [ ] **Structure**: Logical file organization following Astro best practices
- [ ] **No hardcoded paths**: Docs shredder uses relative paths, configurable
- [ ] **Responsive**: Website works on mobile, tablet, desktop
- [ ] **Accessible**: Basic a11y (alt text, semantic HTML, color contrast)

### Testing Checklist

- [ ] Website builds without errors (`npm run build`)
- [ ] Website serves locally and renders correctly (`npm run dev`)
- [ ] All internal links work (no 404s)
- [ ] All external links work (Steve's posts, Discord, X)
- [ ] Docs pages are generated from gastown-docs correctly
- [ ] llms.txt is generated correctly
- [ ] Analytics script loads (check Plausible dashboard or network tab)

### Learning Deliverables

- [ ] `learnings.md` exists documenting:
  - [ ] **Project initiation**: How to add a rig via `gt rig add`
  - [ ] **Creating plans**: Using Mayor to file beads (or formulas for reusable workflows)
  - [ ] **Getting plan into beads**: Which approach worked best and why
  - [ ] **Executing beads**: How `gt sling` dispatches work, convoy tracking
  - [ ] **Testing via gt**: How to create test beads, verify agent work
  - [ ] **Code review via gt**: How to use Crew for review
  - [ ] **Working directory reference**: Which directories mean what
  - [ ] **Key command reference**: Essential `gt` commands with examples
  - [ ] **Code snippets**: Actual commands run from cwd
  - [ ] **What worked (how/why)**: Concrete successes and the reasons they worked
  - [ ] **What didn't (how/why)**: Concrete failures and the reasons they failed
  - [ ] **Workarounds**: Steps taken to get unblocked + why they were chosen
  - [ ] **Lessons learned**: Guidance for best end-to-end Gas Town workflows

---

## Phase 0: Setup

### Step 0.1: Create Agent Guidance Files

Create these files in the project root to guide AI agents:

**AGENTS.md** - Describes the folder hierarchy:
```markdown
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
- Discord: https://discord.gg/fuge9UVvzF
- X: x.com/gastownhall

## Landing Page Headline
"Gas Town is powerful but chaotic. We help you wrangle the chimps."
```

**CLAUDE.md** - Claude agent instructions:
```markdown
# Claude Agent Instructions

Read AGENTS.md for project structure and key information.
Read plan.md for the implementation plan and success criteria.

## Critical Constraint
All code must be written by agents via `gt` commands. Do not write code directly.

## Your Role
You are working on a Gas Town rig. Use `gt` commands to:
- Create beads via Mayor (`gt mayor attach`)
- Dispatch work (`gt sling <bead> $RIG_NAME`)
- Monitor progress (`gt ready --rig $RIG_NAME`)
```

**GEMINI.md** - Gemini agent instructions:
```markdown
# Gemini Agent Instructions

Read AGENTS.md for project structure and key information.
Read plan.md for the implementation plan and success criteria.

## Critical Constraint
All code must be written by agents via `gt` commands. Do not write code directly.

## Your Role
You are working on a Gas Town rig. Use `gt` commands to:
- Create beads via Mayor (`gt mayor attach`)
- Dispatch work (`gt sling <bead> $RIG_NAME`)
- Monitor progress (`gt ready --rig $RIG_NAME`)
```

### Step 0.2: Add Rig to Gas Town

**Existing HQ**: `~/gt/` is already initialized (daemon, deacon, mayor, dartantic rig exist)

**Project**: Use the origin of the current working directory (supports multiple forks)

### Steps (all commands run from cwd - no `cd` needed)

```bash
# Get the git remote URL and derive a rig name from the current project
ORIGIN=$(git remote get-url origin)
RIG_NAME=$(basename $(pwd))  # e.g., "website-eli" from the folder name

# 1. Add this project as a new rig (uses origin from current directory)
gt rig add $RIG_NAME $ORIGIN --prefix $RIG_NAME

# 2. Verify setup
gt doctor --rig $RIG_NAME
gt rig status $RIG_NAME
```

**Note**: Each agent works on their own copy of the repo (e.g., `gastown/website-eli`, `gastown/website-cc`). The rig name and prefix are derived from the project folder name to avoid conflicts.

`gt rig add` clones the repo into `~/gt/$RIG_NAME/` and initializes:
- `refinery/rig/` - Canonical main clone
- `mayor/rig/` - Mayor's working clone
- `.beads/` - Already initialized with prefix `$RIG_NAME`
- `crew/`, `polecats/`, `witness/` - Agent directories

### Learning: Document what `gt rig add` creates and how it differs from `gt init`
### Learning: Capture what worked/didn't and why, plus any workarounds

---

## Phase 1: Create the Project Plan via Mayor

### Approach: Mayor-driven planning (gt-native workflow)

The `gt` workflow is centered on the Mayor handling bead creation. Instead of manually running `bd create`, we describe requirements to the Mayor and let it file beads.

```bash
gt mayor attach
```

Then describe the full requirements to Mayor:

```
I need to build the gastownhall.ai website with the following components:

LANDING PAGE:
- Hero section with headline: "Gas Town is powerful but chaotic. We help you wrangle the chimps."
- Links to Steve's 5 blog posts (see docs-fodder/steve-blog-posts/)
- Big Discord invite CTA button (https://discord.gg/fuge9UVvzF)
- X link (x.com/gastownhall)
- Navigation to docs

DOCS SYSTEM:
- Docs landing page showing overview + links to all sub-pages
- Docs shredder script that syncs docs-fodder/gastown-docs/ into the website

INFRASTRUCTURE:
- Plausible analytics integration
- robots.txt
- llms.txt generator script
- SEO meta tags on all pages
- Privacy policy page

BUILD SYSTEM:
- Astro project scaffold
- Build scripts for src/ → deploy/

Please create an epic hierarchy for this with appropriate beads filed in rig $RIG_NAME.
Show me the bead IDs when done.
```

### Alternative: Formulas for reusable workflows

If we want to define a reusable workflow pattern:
```bash
gt formula create mol-website-feature --type=workflow
# Mayor edits the formula
gt formula show mol-website-feature
```

### Learning: Document how Mayor files beads and manages dependencies
### Learning: Capture what worked/didn't and why, plus any workarounds

---

## Phase 2: Work Breakdown Structure

**Note**: Bead IDs use the rig's prefix (e.g., `website-eli-landing` if `$RIG_NAME=website-eli`). Below shows the suffix pattern - actual IDs will be `$RIG_NAME-<suffix>`.

### Epic: Landing Page (`$RIG_NAME-landing`)
| Bead Suffix | Description |
|-------------|-------------|
| `landing-hero` | Hero section with headline "Gas Town is powerful but chaotic. We help you wrangle the chimps." |
| `landing-blog-links` | Links to Steve's 5 blog posts |
| `landing-cta` | Big Discord button (https://discord.gg/fuge9UVvzF) + X link (x.com/gastownhall) |
| `landing-nav` | Navigation to docs sub-page |

### Epic: Docs System (`$RIG_NAME-docs`)
| Bead Suffix | Description |
|-------------|-------------|
| `docs-shredder` | Script that syncs docs-fodder/gastown-docs/ into website docs |
| `docs-landing` | Docs index page with overview + links to all sub-pages |

### Epic: Infrastructure (`$RIG_NAME-infra`)
| Bead Suffix | Description |
|-------------|-------------|
| `analytics` | Plausible analytics integration |
| `robots` | robots.txt file |
| `llms-txt` | llms.txt generator script |
| `seo` | SEO meta tags on all pages |
| `privacy-policy` | Privacy policy page |

### Epic: Build System (`$RIG_NAME-build`)
| Bead Suffix | Description |
|-------------|-------------|
| `astro-scaffold` | Astro project setup with content collections |
| `build-scripts` | Build scripts for src/ → deploy/ |

---

## Phase 3: Execute via Polecats

**Note**: Replace `$RIG_NAME` with your actual rig name (e.g., `website-eli`). Bead IDs include the prefix (e.g., `website-eli-landing`).

### Create convoy for tracking (town-level, works from any directory)
```bash
gt convoy create "Website v1" $RIG_NAME-landing $RIG_NAME-docs $RIG_NAME-infra $RIG_NAME-build --notify overseer
```

### Dispatch in dependency order (specify rig as target)

1. **Foundation** (must complete first):
   ```bash
   gt sling $RIG_NAME-astro-scaffold $RIG_NAME
   gt sling $RIG_NAME-docs-shredder $RIG_NAME
   ```

2. **Landing page** (can parallelize):
   ```bash
   gt sling $RIG_NAME-landing-hero $RIG_NAME
   gt sling $RIG_NAME-landing-blog-links $RIG_NAME
   gt sling $RIG_NAME-landing-cta $RIG_NAME
   gt sling $RIG_NAME-landing-nav $RIG_NAME
   ```

3. **Docs pages**:
   ```bash
   gt sling $RIG_NAME-docs-landing $RIG_NAME
   ```

4. **Infrastructure**:
   ```bash
   gt sling $RIG_NAME-analytics $RIG_NAME
   gt sling $RIG_NAME-robots $RIG_NAME
   gt sling $RIG_NAME-llms-txt $RIG_NAME
   gt sling $RIG_NAME-seo $RIG_NAME
   gt sling $RIG_NAME-privacy-policy $RIG_NAME
   ```

5. **Build scripts**:
   ```bash
   gt sling $RIG_NAME-build-scripts $RIG_NAME
   ```

### Monitor progress (all gt commands, no `cd` needed)
```bash
gt convoy list                    # Dashboard view of all convoys
gt convoy status <convoy-id>      # Specific convoy details
gt rig status $RIG_NAME           # Rig-specific worker status
gt ready --rig $RIG_NAME          # Ready work in this rig
gt show <bead-id>                 # Details of a specific bead
```

### Learning: Capture what worked/didn't and why, plus any workarounds

---

## Phase 4: Test and Review

### Testing beads - via Mayor
```bash
gt mayor attach
```
Then ask:
```
Create test beads for the website in rig $RIG_NAME:
- Test: Build process works
- Test: All internal links work
- Test: All external links work
- Test: Responsive design
- Test: Basic accessibility

Then create a convoy for these tests and sling them.
```

Alternatively, dispatch test work directly:
```bash
gt convoy create "Website Tests" $RIG_NAME-test-* --notify overseer
gt sling $RIG_NAME-test-build $RIG_NAME
```

### Code review via Crew
```bash
gt crew start $RIG_NAME reviewer        # Start a crew member named "reviewer"
gt crew at $RIG_NAME/reviewer           # Attach to the crew session
```
Then ask for review of:
- CSS separation and reuse patterns
- JS quality (if any)
- Astro component structure
- Build script quality

### Learning: Document the test/review workflow
### Learning: Capture what worked/didn't and why, plus any workarounds

---

## Phase 5: Document Learnings

Create `learnings.md` with:

### Sections Required
1. **Project Initiation**: What `gt` commands, what directories are created, gotchas
2. **Creating Plans**: How Mayor handles requirements → beads (or formulas for workflows)
3. **Getting Plan into Beads**: The actual commands used, the bead IDs created
4. **Executing via gt**: How `gt sling` works, convoy tracking, monitoring
5. **Testing via gt**: How to verify agent work
6. **Code Review via gt**: Crew-based review workflow
7. **Working Directories Reference** (where `$RIG_NAME` is your rig, e.g., `website-eli`):
   - Town Root: `~/gt/`
   - Rig Root: `~/gt/$RIG_NAME/`
   - Mayor's Clone: `~/gt/$RIG_NAME/mayor/rig/`
   - Refinery's Clone: `~/gt/$RIG_NAME/refinery/rig/`
   - Polecats: `~/gt/$RIG_NAME/polecats/<name>/rig/`
   - Crew: `~/gt/$RIG_NAME/crew/<name>/rig/`
8. **Key Commands Reference** (with actual examples from this project)
9. **What Went Wrong**: Any issues encountered and how resolved
10. **What Worked (How/Why)**: Concrete wins and their root causes
11. **What Didn't (How/Why)**: Concrete failures and their root causes
12. **Workarounds**: Steps taken, why they worked, and tradeoffs
13. **Lessons Learned**: Best practices and anti-patterns for gt workflows

---

## Confirmed Details

| Item | Value |
|------|-------|
| Rig name | `$RIG_NAME` (derived from project folder, e.g., `website-eli`) |
| Beads prefix | `$RIG_NAME` (same as rig name) |
| Git remote | `$ORIGIN` (from `git remote get-url origin`) |
| Static site technology | Astro |
| Discord invite URL | https://discord.gg/fuge9UVvzF |
| X handle | x.com/gastownhall |
| Analytics | Plausible |
| Docs source | `docs-fodder/gastown-docs/` (25 markdown files) |
| Blog posts source | `docs-fodder/steve-blog-posts/` (5 posts) |
| Output folder | `deploy/` |

---

## Critical Files (relative to project root)

### Source content
- `docs-fodder/gastown-docs/overview.md` - Main overview doc
- `docs-fodder/gastown-docs/concepts/` - 6 concept docs
- `docs-fodder/gastown-docs/design/` - 11 design docs
- `docs-fodder/gastown-docs/examples/` - 1 example doc
- `docs-fodder/steve-blog-posts/Welcome to Gas Town.md`
- `docs-fodder/steve-blog-posts/The Future of Coding Agents.md`
- `docs-fodder/steve-blog-posts/BAGS and the Creator Economy.md`
- `docs-fodder/steve-blog-posts/Gas Town Emergency User Manual.md`
- `docs-fodder/steve-blog-posts/Stevey's Birthday Blog.md`

### Reference docs for gt usage
- `docs-fodder/gastown-docs/INSTALLING.md` - Setup guide
- `docs-fodder/gastown-docs/reference.md` - CLI reference
- `docs-fodder/gastown-docs/concepts/molecules.md` - Workflow system
- `docs-fodder/gastown-docs/concepts/convoy.md` - Work tracking

---

## Command Reference (no `cd` required, gt-native)

Use `$RIG_NAME` derived from project folder (e.g., `website-eli`):

| Task | Command |
|------|---------|
| Add rig | `gt rig add $RIG_NAME $ORIGIN --prefix $RIG_NAME` |
| Check rig health | `gt doctor --rig $RIG_NAME` |
| Rig status | `gt rig status $RIG_NAME` |
| Create beads | `gt mayor attach` → describe requirements |
| Show bead details | `gt show <bead-id>` |
| Ready work | `gt ready --rig $RIG_NAME` |
| Create convoy | `gt convoy create "Name" <beads...>` |
| Convoy status | `gt convoy status <id>` |
| Sling to rig | `gt sling <bead> $RIG_NAME` |
| Close bead | `gt close <bead-id>` |
| Start crew | `gt crew start $RIG_NAME <name>` |
| Attach to crew | `gt crew at $RIG_NAME/<name>` |
| Attach to Mayor | `gt mayor attach` |

---

## Success Criteria Summary

This plan is complete when:

1. ✅ Website builds and deploys from `src/` to `deploy/`
2. ✅ All website features are implemented (landing page, docs, infrastructure)
3. ✅ All code was written by agents via gt, not by human
4. ✅ Code passes quality review (CSS separation, JS quality, structure)
5. ✅ All tests pass (links work, responsive, accessible)
6. ✅ `learnings.md` comprehensively documents the gt workflow with WHY and HOW
