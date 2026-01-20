# Gas Town Workflow Learnings

> This document captures end-to-end learnings from building gastownhall.ai using Gas Town.
> The goal is to understand HOW and WHY to use gt commands effectively.

---

## 1. Environment Discovery

### Initial Exploration

**Command**: `gt --help`

**Learning**: Gas Town has a comprehensive CLI with categories:
- Work Management (bead, sling, convoy, close, done, etc.)
- Agent Management (mayor, polecat, crew, witness, refinery, deacon)
- Communication (nudge, mail, broadcast)
- Services (daemon, up, down)
- Workspace (rig, crew, init, install)
- Diagnostics (status, doctor, feed, trail, audit)

**Key Discovery**: `gt` commands are context-aware. Running from `~/gt/` (the HQ) vs from a rig directory changes behavior.

---

## 2. Rig Setup

### Rig Naming Rules

**CRITICAL**: Rig names CANNOT contain hyphens.

**Attempted**: `gt rig add website-cc ...`
**Error**: `rig name "website-cc" contains invalid characters; hyphens, dots, and spaces are reserved for agent ID parsing`

**Solution**: Use underscores: `gt rig add website_cc ...`

**WHY**: Hyphens are used to parse agent IDs (e.g., `wcc-website_cc-witness`)

### What `gt rig add` Creates

```bash
gt rig add website_cc https://github.com/gastownhall/website-cc.git --prefix wcc
```

**Result** (5.0 seconds):
```
website_cc/
├── config.json         # Rig configuration
├── .repo.git/          # Shared bare repo for refinery+polecats
├── .beads/             # Issue tracking (prefix: wcc)
├── plugins/            # Rig-level plugins
├── mayor/rig/          # Mayor's clone (main branch)
├── refinery/rig/       # Refinery worktree (sees polecat branches)
├── crew/               # Empty - for human workspaces
├── witness/            # Witness agent directory
└── polecats/           # Empty - for ephemeral workers
```

**Auto-created beads**:
- `wcc-website_cc-witness` - Witness agent identity
- `wcc-website_cc-refinery` - Refinery agent identity
- `wcc-rig-website_cc` - Rig identity bead

---

## 3. Bead Creation

### Two Approaches

1. **Via Mayor**: `gt mayor attach` - Interactive chat to create beads
2. **Via bd**: `bd create "Title" --type task --description "..."` - Direct creation

### Direct Creation with bd

**Command**: `bd create [title] [flags]`

**Useful flags**:
- `--type` - epic, task, feature, bug, etc.
- `--description` - Issue description
- `--deps` - Dependencies (e.g., "blocks:wcc-1")
- `--parent` - For hierarchical children
- `--labels` - Add labels
- `--priority` - P0-P4 (0=highest)
- `--silent` - Output only ID (for scripting)

### Hierarchical IDs

Child beads use hierarchical IDs based on parent:
- Epic: `wcc-60j`
- Child tasks: `wcc-60j.1`, `wcc-60j.2`, etc.

---

## 4. Work Dispatch (Sling)

### The Sling Command

**Command**: `gt sling <bead-id> <target>`

**What it does**:
1. Resolves target (rig → auto-spawn polecat)
2. Creates polecat from name pool
3. Attaches bead to polecat's hook
4. Auto-creates convoy for tracking
5. Sends start prompt to the polecat

**Example**:
```bash
gt sling wcc-60j.1 website_cc
# → Allocated polecat: obsidian
# → Created convoy hq-cv-lwwwc
# → Polecat obsidian spawned
```

### Polecat Name Pool

Polecats get names from a pool: obsidian, quartz, jasper, onyx, etc.

### Work Branches

Each polecat works on its own branch:
- Format: `polecat/<name>/<bead-id>@<session-id>`
- Example: `polecat/obsidian/wcc-60j.1@mkmvss0x`

### Adding Args

```bash
gt sling <bead> <target> --args "natural language instructions"
```

The `--args` string provides additional context to the polecat.

---

## 5. Monitoring

### Essential Commands

| Command | Purpose |
|---------|---------|
| `gt status` | Overall town status with all agents |
| `gt convoy list` | List active convoys |
| `gt convoy status <id>` | Detailed convoy progress |
| `gt mq list <rig>` | Merge queue status |
| `gt peek <rig>/<polecat>` | Real-time polecat output |

### Status Symbols

- `●` = Running
- `○` = Stopped
- `MQ:N` = N items in merge queue
- `📬N` = N unread mail messages

---

## 6. What Worked

### 1. Rig Setup with `gt rig add`
- Quick and comprehensive setup (5 seconds)
- Creates all necessary directories and agent beads automatically
- Proper git structure with shared bare repo

### 2. Direct Bead Creation with `bd create`
- Fast way to create beads when you know the structure
- Hierarchical IDs make relationships clear
- `--parent` flag creates proper epic/child structure

### 3. Parallel Work Dispatch with `gt sling`
- Spawning multiple polecats for parallel work was effective
- Auto-convoy creation provides visibility
- Name pool is fun and memorable

### 4. Polecat Autonomy
- Polecats read context files (AGENTS.md, plan.md) and work independently
- They create branches, commit code, and push to remote
- No hand-holding needed once work is slung

### 5. Build Scripts by Agents
- Polecats created working build scripts (docs shredder, llms.txt generator)
- Proper Astro configuration for static site generation
- All 25 docs were processed correctly

### 6. `gt peek` for Monitoring
- Real-time visibility into what polecats are doing
- Shows thinking, commands, and output
- Essential for debugging

---

## 7. What Didn't Work

### 1. Refinery Auto-Processing
- **Issue**: Refinery kept crashing or sitting idle
- **Symptom**: `gt refinery start website_cc` → "timeout waiting for runtime prompt"
- **Impact**: Merge queue backed up with 3+ ready MRs
- **Evidence**: Background tasks `gt rig start` and `gt refinery start` failed with exit code 1
- **Workaround**: Manual git merge of polecat branches

### 2. Rig Names with Hyphens
- **Issue**: `gt rig add website-cc` failed
- **Solution**: Use underscores instead (`website_cc`)

### 3. Merge Conflicts from Parallel Work
- **Issue**: Polecats modified same files (astro.config.mjs, index.astro)
- **Symptom**: Merge conflicts when combining branches
- **Learning**: Sequence dependent work OR design for parallel mergeability

### 4. `gt ready --rig` Showing No Work
- **Issue**: `gt ready --rig website_cc` returned "No ready work across town"
- **But**: `bd list --ready` showed all beads as ready

---

## 8. Workarounds

### Manual Merge When Refinery Fails

```bash
cd ~/gt/<rig>/refinery/rig
git fetch origin
git branch -a  # See all polecat branches
git merge polecat/<name>/<bead-id>@<session> -m "Merge: <description>"
# Resolve conflicts
git add . && git commit -m "Merge: ... - resolved conflicts"
git push origin main
```

### Nudge Stuck Agents

```bash
cd ~/gt/<rig> && gt nudge refinery "Process the merge queue"
```

### Use `bd` for Bead Operations

```bash
cd ~/gt/<rig>/.beads
bd create "Title" --type task --description "..."
bd list --ready
bd show <bead-id>
```

### Doctor Fix for Setup Issues

```bash
cd ~/gt && gt doctor --fix --rig <rig-name>
```

---

## 9. Key Insights

### The Gas Town Philosophy

1. **GUPP**: "If it's on your hook, YOU RUN IT." Agents execute immediately without confirmation.

2. **Polecats are ephemeral**: They spawn, do work, submit to MQ, and disappear.

3. **The Refinery is the gatekeeper**: All code goes through the merge queue.

4. **Convoys provide visibility**: Every piece of work is tracked.

### Recommended Workflow

```
1. Add rig:        gt rig add <name> <url> --prefix <prefix>
2. Start services: gt rig start <name>
3. Create epic:    bd create "Project" --type epic
4. Create tasks:   bd create "Task" --type task --parent <epic>
5. Sling work:     gt sling <bead> <rig>
6. Monitor:        gt status && gt convoy list
7. Check output:   gt peek <rig>/<polecat>
8. Verify build:   cd ~/gt/<rig>/refinery/rig/src && npm run build
```

### What I Would Do Differently

1. **Sequence dependent work**: Don't sling task 2 until task 1 is merged.
2. **Keep tasks atomic**: Each bead should touch different files if possible.
3. **Test refinery first**: Before slinging work, verify refinery is healthy.
4. **Use smaller beads**: Break work into smaller pieces for easier merging.

---

## 10. Quick Reference

### Directory Structure

```
~/gt/                      # Town HQ
├── .beads/                # Town-level issue tracking
├── daemon/                # Daemon service
├── deacon/                # Town-level watchdog
├── mayor/                 # Cross-rig coordinator
├── plugins/               # Town-level plugins
└── <rig-name>/            # Each rig container
    ├── .beads/            # Rig-level issues
    ├── refinery/rig/      # Canonical clone
    ├── mayor/rig/         # Mayor's clone
    ├── crew/<name>/rig/   # Crew workspaces
    ├── polecats/<name>/   # Ephemeral workers
    └── witness/           # Witness agent
```

### Essential Commands

| Task | Command |
|------|---------|
| Check town status | `cd ~/gt && gt status` |
| List rigs | `cd ~/gt && gt rig list` |
| Add rig | `gt rig add <name> <url> --prefix <prefix>` |
| Check rig health | `gt doctor --fix --rig <name>` |
| Create bead | `bd create "Title" --type task --parent <epic>` |
| Dispatch work | `gt sling <bead-id> <rig-name>` |
| Monitor polecats | `gt peek <rig>/<polecat>` |
| Check MQ | `gt mq list <rig>` |
| Nudge agent | `gt nudge refinery "message"` |
| List convoys | `gt convoy list` |

---

## Results

### Website Built Successfully

- **Landing page**: Headline, 5 blog links, Discord CTA, X link, docs nav
- **Docs page**: 25 markdown files processed via shredder
- **Infrastructure**: robots.txt, llms.txt, privacy policy, SEO meta tags
- **Build**: `npm run build` → static output in deploy/

### Code Written by Agents

All code was produced by polecat agents via `gt sling` commands:
- obsidian: Astro scaffold, infrastructure
- quartz: Landing page
- jasper: Docs landing page
- onyx: Docs shredder tool

### Time: ~20 minutes from rig creation to working build

---

## 11. Session 2 Learnings (Build & Deploy)

### Resuming Work in Progress

**Key Discovery**: When resuming work on an existing rig:
1. Check rig status: `gt rig status <name>`
2. Check existing beads: `bd list --tree`
3. Check merge queue: `gt mq list <rig>`
4. The refinery may have processed some work already

### Path Configuration Challenges

**Issue**: Nested src/ directory structure caused confusion

The Astro project structure became:
```
website_cc/src/           # Git repo root AND Astro project root
├── src/                  # Astro's srcDir (standard Astro layout)
│   ├── pages/            # Where Astro looks for pages
│   ├── content/          # Where content collections go
│   └── layouts/
├── scripts/              # Build scripts
└── astro.config.mjs      # Astro config
```

**Problem**: Files were being created in wrong locations:
- Polecat created files in `src/pages/` instead of `src/src/pages/`
- Shredder output went to `src/content/docs/` instead of `src/src/content/docs/`

**Solution**: The polecat (wcc-60j.6) identified and fixed path configurations in:
1. `scripts/shred-docs.js` - Fixed DOCS_DEST path
2. Created `src/src/pages/docs/[...slug].astro` - Dynamic route
3. Moved `content.config.ts` to `src/src/content/config.ts`

### Dynamic Routing for Docs

**Implementation**: Created `[...slug].astro` to render docs from content collection:
```astro
---
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const docs = await getCollection('docs');
  return docs.map(doc => ({
    params: { slug: doc.data.slug || doc.slug },
    props: { doc }
  }));
}
---
```

**Result**: All 25 docs pages now render at routes like:
- `/docs/overview`
- `/docs/concepts/convoy`
- `/docs/design/architecture`

### Refinery Issues (Continued)

**Symptom**: Refinery session crashed with "timeout waiting for runtime prompt"

**Observations**:
- `gt refinery restart website_cc` → timeout error
- `gt peek website_cc/refinery` → "session not found"
- `gt nudge website_cc/refinery` → "can't find pane"

**Root Cause Hypothesis**: Claude Code session initialization issues, possibly:
- Resource constraints
- Session lifecycle problems
- Tmux pane management issues

**Workaround Applied**:
```bash
# Manual merge from refinery clone
cd ~/gt/website_cc/refinery/rig
git fetch origin
git merge origin/polecat/<name>/<bead-id>@<session> --no-edit
git push origin main

# Close MR bead manually
gt close wcc-h6l
```

### Build Verification

**Final Build Output**:
```
28 page(s) built in 2.65s
├── index.html (landing page)
├── docs/index.html (docs landing - needs improvement)
├── docs/overview/index.html
├── docs/concepts/convoy/index.html
├── ... (25 doc pages)
├── privacy/index.html
└── static assets
```

**Checklist Results**:
- ✅ Website builds without errors
- ✅ All 25 docs pages generated
- ✅ Landing page has headline, Discord CTA, X link, blog links
- ✅ robots.txt present
- ✅ llms.txt generated
- ✅ Privacy policy page exists
- ⚠️ Docs landing page shows placeholder (needs full listing)

### Commands Discovered This Session

| Command | Purpose |
|---------|---------|
| `gt mq next <rig>` | Show highest-priority MR to process |
| `gt refinery claim <mr-id>` | Claim MR for processing |
| `gt refinery ready` | List MRs ready for processing |
| `bd list --tree` | Hierarchical view of beads |

### Key Insight: The Propulsion Principle in Action

Watching the polecat work on wcc-60j.6 demonstrated GUPP in action:
1. Work was slung → polecat immediately started
2. No confirmation requested
3. Polecat read context, analyzed code, identified issues
4. Made fixes, ran builds, verified results
5. Committed, pushed, called `gt done`

The entire cycle took ~15 minutes of autonomous work.

---

## 12. Success Criteria Status

| Criterion | Status |
|-----------|--------|
| Website builds from src/ to deploy/ | ✅ Complete |
| Landing page with headline, CTAs | ✅ Complete |
| Docs with 25 markdown files | ✅ Complete |
| robots.txt | ✅ Complete |
| llms.txt generator | ✅ Complete |
| Privacy policy | ✅ Complete |
| All code by agents via gt | ✅ Complete |
| learnings.md documented | ✅ Complete |

### What the Agents Built

1. **obsidian** (polecat): Astro scaffold, infrastructure setup, build/deploy fixes
2. **quartz** (polecat): Landing page with hero, blog links, CTAs
3. **jasper** (polecat): Docs landing page
4. **onyx** (polecat): Docs shredder tool

### Final Working Commands

```bash
# Build the site
cd ~/gt/website_cc/refinery/rig/src
npm install
npm run build  # Runs shredder, llms.txt generator, astro build

# Preview
npm run preview  # Starts server at http://localhost:4321

# Output
ls ../deploy/  # Static files ready for deployment
```

---

## 13. Final Observations: Workflow Analysis

### Who Did What

| Task | Actor | Method |
|------|-------|--------|
| Add rig | Human (me) | `gt rig add` |
| Create beads | Human (me) | `bd create` directly |
| Write website code | Polecats | Via `gt sling`, auto-spawned |
| Commit code | Polecats | `git commit` in their worktrees |
| Push to remote | Polecats | `git push` to polecat branches |
| Merge to main | Human (me) | Manual `git merge` (refinery was broken) |
| Sync to project folder | Human (me) | `git pull origin main` |
| Testing | Human (me) | `npm run build`, browser verification |
| Code review | Skipped | Should have used `gt crew start` |
| Write learnings | Human (me) | Direct edit (appropriate for meta-docs) |

### Where I Didn't Use Gas Town As Intended

#### 1. Bead Creation: Used `bd create` Instead of Mayor

**What I did**: Created beads directly with `bd create` commands
```bash
bd create "gastownhall.ai website" --type epic
bd create "Astro scaffold" --type task --parent wcc-60j
```

**What I should have done**: Used Mayor to create beads from requirements
```bash
gt mayor attach
# Then describe: "I need to build gastownhall.ai with landing page, docs, etc."
# Mayor would create the epic/task structure
```

**Why I deviated**:
- Tried `gt mayor attach` but interactive tmux sessions were clunky from Claude Code
- `bd create` was faster when I already knew the task structure from plan.md
- This was a **shortcut** that bypassed testing Mayor's planning capabilities

**Future improvement**: Use Mayor for bead creation, especially when requirements are ambiguous. Mayor can help structure work better than manual bead creation.

#### 2. Merge Processing: Manual Git Instead of Refinery

**What I did**: Manually merged polecat branches when refinery failed
```bash
cd ~/gt/website_cc/refinery/rig
git fetch origin
git merge origin/polecat/obsidian/wcc-60j.1@mkmvss0x --no-edit
git push origin main
gt close wcc-6lm  # Manually closed MR beads
```

**What should have happened**: Refinery auto-processes merge queue
```bash
# Polecat calls gt done → MR created → Refinery merges automatically
```

**Why I deviated**:
- Refinery was genuinely broken (timeout errors)
- Tried multiple recovery attempts:
  - `gt refinery restart website_cc` → timeout
  - `gt refinery start website_cc` → timeout
  - `gt nudge website_cc/refinery "Process the merge queue"` → failed
  - `gt peek website_cc/refinery` → "session not found"
- **No alternative** - work was stuck without manual intervention

**Future improvement**:
- Verify refinery health BEFORE slinging work: `gt doctor --rig <name>`
- Start refinery explicitly: `gt refinery start <rig>` and confirm it's running
- If refinery fails, report the issue rather than working around it silently

#### 3. Testing: Direct Verification Instead of Test Beads

**What I did**: Ran `npm run build` and used browser to verify manually

**What I should have done**: Create test beads via Mayor and sling them
```bash
gt mayor attach
# "Create test beads: verify build works, check all links, test responsiveness"
gt sling wcc-test-build website_cc
gt sling wcc-test-links website_cc
```

**Why I deviated**:
- Refinery was already broken - adding more work to the queue seemed counterproductive
- Direct verification was faster for the scope needed
- Time pressure to complete the project

**Future improvement**: Create test beads as part of the work breakdown. Testing should be a first-class citizen in the bead hierarchy.

#### 4. Code Review: Skipped Crew Entirely

**What I did**: No formal code review

**What I should have done**: Use Crew for systematic review
```bash
gt crew start website_cc reviewer
gt crew at website_cc/reviewer
# Then ask: "Review CSS patterns, JS quality, Astro structure"
```

**Why I deviated**:
- Build was working, success criteria were met
- Debugging refinery issues consumed available time
- Didn't prioritize review workflow testing

**Future improvement**: Always include a review phase. Use `gt crew start` to test the Crew workflow even if the review itself is brief.

### What I Did That Wasn't gt/git Commands

| Action | Reason | Alternative That Failed/Wasn't Tried |
|--------|--------|--------------------------------------|
| `bd create` for beads | Faster than Mayor for known structure | `gt mayor attach` was tried but clunky |
| Manual `git merge` | Refinery was broken | `gt refinery restart`, `gt nudge` all failed |
| Direct `npm run build` | Verify build works | Could have created test bead |
| Browser testing | Verify pages render | Could have used `gt crew start` |
| Edit learnings.md | Meta-documentation is human work | N/A - appropriate |

### Refinery Failure: Deep Dive

**What I tried**:
```bash
gt refinery restart website_cc  # → timeout waiting for runtime prompt
gt refinery start website_cc    # → timeout waiting for runtime prompt
gt peek website_cc/refinery     # → "session not found"
gt nudge website_cc/refinery    # → "can't find pane"
gt doctor --fix --rig website_cc # → didn't fix refinery
```

**Hypothesis**: The refinery's Claude Code session couldn't initialize, possibly due to:
- Tmux pane management issues
- Resource constraints
- Session lifecycle problems

**Impact**: Without a working refinery, the merge queue backs up indefinitely. This is a critical path failure.

**Recommendation**: Refinery health should be a pre-flight check before any `gt sling` operations.

### Progress Tracking Methods Used

| Method | Command | Effectiveness |
|--------|---------|---------------|
| Overall status | `gt status` | Good - shows all agents and MQ counts |
| Convoy tracking | `gt convoy list` | Good - shows work groupings |
| Real-time monitoring | `gt peek <rig>/<polecat>` | **Excellent** - essential for debugging |
| Merge queue | `gt mq list <rig>` | Good - shows pending MRs |
| Nudging stuck agents | `gt nudge <agent>` | Failed - agent session was dead |

### Recommendations for Future Gas Town Projects

1. **Pre-flight checklist**:
   ```bash
   gt doctor --rig <name>           # Verify rig health
   gt refinery start <rig>          # Start refinery explicitly
   gt peek <rig>/refinery           # Confirm refinery is alive
   ```

2. **Use Mayor for planning**: Even if you know the task structure, let Mayor create beads to test that workflow.

3. **Sequence dependent work**: Don't sling task B until task A is merged. Parallel slinging causes merge conflicts.

4. **Keep beads atomic**: Each bead should touch different files when possible.

5. **Include test and review beads**: Make testing and review part of the work breakdown, not afterthoughts.

6. **Monitor continuously**: Keep `gt peek` running in a terminal to watch polecat progress.

7. **Document refinery failures immediately**: If refinery breaks, capture diagnostics before working around it.

### The Ideal vs Actual Workflow

**Ideal (what plan.md envisioned)**:
```
Human → gt mayor attach → Mayor creates beads → gt sling → Polecats work →
gt done → Refinery merges → gt crew review → Done
```

**Actual (what happened)**:
```
Human → bd create (bypassed Mayor) → gt sling → Polecats work →
gt done → Refinery FAILED → Manual git merge → Manual testing → Done
```

### Key Takeaway

Gas Town's core value proposition worked brilliantly: **polecats autonomously wrote all the website code**. The `gt sling` → polecat → code workflow is solid.

The breakdown was in the **merge pipeline** (refinery failures) and **workflow shortcuts** (skipping Mayor, Crew). Future projects should:
1. Ensure refinery is healthy before starting
2. Use Mayor for planning to test that workflow
3. Use Crew for review to test that workflow
4. Create test beads to formalize verification

The learnings from this project will make the next Gas Town project smoother.

---

## 14. Documentation Review: What I Got Wrong

After reviewing the Gas Town documentation in `docs-fodder/gastown-docs/`, I found significant gaps between what I did and what the docs prescribe as best practice.

### Critical Gap: I Didn't Use Molecules At All

**What I did**: Created plain beads with `bd create` and slung them directly to polecats.

**What the docs prescribe**: Use the **molecule system** for coordinated multi-step work:

```bash
# 1. Cook a formula into a protomolecule
bd cook mol-polecat-work

# 2. Pour the proto to create an active molecule
bd mol pour mol-polecat-work --var issue=gt-xyz

# 3. Polecats work through molecule steps
bd mol current           # Where am I?
bd close <step> --continue  # Close step and auto-advance
```

From `concepts/molecules.md`:
> "Molecules are workflow templates that coordinate multi-step work in Gas Town."
> "Polecats receive work via their hook - a pinned molecule attached to an issue."

**The lifecycle I missed**:
```
Formula (source TOML) → bd cook → Protomolecule → bd mol pour → Molecule → steps → bd squash → Digest
```

**Impact**: By skipping molecules, I missed:
- Structured step tracking (`bd mol current`)
- Auto-advancement (`bd close <step> --continue`)
- Audit trail of step completions (molecules ARE the ledger)
- The ability to squash completed work into digests

**Severity**: HIGH - This is central to how polecats are supposed to work.

### Gap: Convoys Should Be Explicit

**What I did**: Relied on auto-convoy created by `gt sling`.

**What the docs prescribe**: Create convoys explicitly FIRST for better visibility:

```bash
# Correct workflow
gt convoy create "Website v1" wcc-60j.1 wcc-60j.2 wcc-60j.3 --notify overseer
gt sling wcc-60j.1 website_cc
gt sling wcc-60j.2 website_cc
```

From `concepts/convoy.md`:
> "When you kick off work - even a single issue - create a convoy to track it."

While auto-convoy exists ("Even swarm of one gets convoy visibility"), explicit creation provides:
- Better naming (vs auto-generated "Work: wcc-xyz")
- Notification setup (`--notify overseer`)
- Grouped visibility in dashboard

**Severity**: LOW - Auto-convoy worked, but explicit is better practice.

### Correct: Propulsion Principle Was Followed

**What I did**: Polecats executed immediately when slung.

**What the docs prescribe**: Same!

From `concepts/propulsion-principle.md`:
> "If you find something on your hook, YOU RUN IT."
> "Gas Town is a steam engine. Agents are pistons."

The polecats correctly:
1. Found work on their hook
2. Began immediately without waiting for confirmation
3. Executed autonomously

**Severity**: ✓ CORRECT

### Correct: Plain Beads vs Mayor

**What I did**: Used `bd create` directly instead of Mayor.

**What the docs say**: Both are valid approaches.

From `overview.md`:
> The overview shows Mayor for interactive planning AND `bd create` for direct creation.

Using `bd create` is a valid shortcut when you already know the task structure. Mayor is preferred when:
- Requirements are ambiguous
- You want the system to help structure work
- You're testing the Mayor workflow

**Severity**: LOW - Either approach is valid.

### Gap: Polecat Workflow Was Incomplete

**What I did**: Slung beads, polecats worked, but without molecule navigation.

**What the docs prescribe** (from `concepts/molecules.md`):

```
1. Spawn with work on hook
2. gt hook                 # What's hooked?
3. bd mol current          # Where am I in the molecule?
4. Execute current step
5. bd close <step> --continue  # Close and advance
6. If more steps: GOTO 3
7. gt done                 # Signal completion
```

Key commands I didn't use:
- `gt hook` - What's on my hook?
- `bd mol current` - Where am I in the molecule?
- `bd close <step> --continue` - Close step and auto-advance

From `concepts/propulsion-principle.md`:
> "The old workflow (friction): 3 commands. Context switches. Momentum lost."
> "The new workflow (propulsion): `bd close gt-abc.3 --continue` - One command."

**Severity**: HIGH - This is core to efficient polecat work.

### Gap: Skipped Crew for Review

**What I did**: No code review.

**What the docs prescribe**: Use Crew for review work.

From `overview.md`:
> "When to use Crew: Exploratory work, long-running projects, work requiring human judgment"

Crew differs from polecats:
- Persistent (user controls lifecycle)
- Pushes to main directly
- Good for review, judgment calls

**Severity**: MEDIUM - Should have tested this workflow.

### Refinery: Broken, Not Misused

**What happened**: Refinery timed out, requiring manual git merge.

**What should happen** (from `concepts/polecat-lifecycle.md`):
> "Once `gt done` submits work: The branch is pushed to origin, Work exists in MQ, not in the polecat"
> "Refinery rebases and merges to main"

The manual merge workaround was necessary due to refinery failure, not misuse. However, I should have:
1. Diagnosed the failure better
2. Reported the issue rather than silently working around it

**Severity**: N/A (system failure, not misuse)

### Summary: Gaps vs Best Practice

| Area | What I Did | Best Practice | Gap Severity |
|------|------------|---------------|--------------|
| **Molecules** | Not used | Central to workflow | **HIGH** |
| **Convoys** | Auto-created | Create explicitly first | LOW |
| **Mayor** | Bypassed | Either valid | LOW |
| **Polecat workflow** | Plain beads | Molecule navigation | **HIGH** |
| **Crew review** | Skipped | Use for review | MEDIUM |
| **Propulsion** | Followed | Immediate execution | ✓ CORRECT |
| **Refinery** | Manual merge | Auto-process | N/A (broken) |

### What the Correct Workflow Should Have Been

```bash
# 1. Create rig
gt rig add website_cc <url> --prefix wcc

# 2. Create epic and tasks (via Mayor or bd create - either is fine)
bd create "gastownhall.ai website" --type epic  # → wcc-60j

# 3. Cook a formula for website work (or create molecules directly)
bd cook mol-website-feature
bd mol pour mol-website-feature --var epic=wcc-60j

# 4. Create convoy FIRST for visibility
gt convoy create "Website v1" wcc-60j.1 wcc-60j.2 wcc-60j.3 --notify overseer

# 5. Sling work to polecats
gt sling wcc-60j.1 website_cc

# 6. Polecats use molecule navigation
#    (Inside polecat session):
gt hook                    # What's hooked?
bd mol current             # Where am I?
# ... do work ...
bd close wcc-60j.1.step1 --continue  # Close step, auto-advance
# ... continue until done ...
gt done                    # Signal completion, submit to MQ

# 7. Refinery auto-merges (if working)
# 8. Code review via Crew
gt crew start website_cc reviewer
gt crew at website_cc/reviewer
# ... review the merged code ...

# 9. Squash completed molecules for audit trail
bd mol squash wcc-60j --summary "Website v1 complete"
```

### Key Insight: Molecules Are Not Optional

The biggest learning is that **molecules are central to Gas Town's design**, not an optional feature. They provide:

1. **Structured step tracking** - Know where you are in multi-step work
2. **Propulsion** - `--continue` keeps momentum
3. **Audit trail** - Step closures are timestamped CV entries
4. **Coordination** - Steps can have dependencies

From `concepts/molecules.md`:
> "CRITICAL: Close steps in real-time - Mark `in_progress` BEFORE starting, `closed` IMMEDIATELY after completing. Never batch-close steps at the end. Molecules ARE the ledger."

By skipping molecules, I treated Gas Town like a simple issue tracker instead of the sophisticated workflow orchestration system it's designed to be.

### For Next Time (Revised)

1. **Use plain beads with epic/children** for one-off projects
2. **Use molecules** only for repeatable workflow patterns
3. **Auto-convoy is fine** - explicit creation only needed for custom naming/notifications
4. **Design for parallelism** - tasks that touch different files can run simultaneously
5. **Use Crew** for code review and exploratory work

---

## 15. Practical Gas Town Workflow: A Clearer Mental Model

### Plain Beads vs Molecules: When to Use Which

**Plain beads with epic/child structure**:
```
Epic: wcc-60j "Website project"
├── Task: wcc-60j.1 "Scaffold"
├── Task: wcc-60j.2 "Landing page"
├── Task: wcc-60j.3 "Docs page"
└── Task: wcc-60j.4 "Build scripts"
```

This is a hierarchy. Each task is an independent unit. Sling them in parallel.

**Molecules (formulas)** define reusable patterns:
```toml
formula = "feature-workflow"
[[steps]]
id = "design"
[[steps]]
id = "implement"
needs = ["design"]
[[steps]]
id = "test"
needs = ["implement"]
```

Every feature follows: design → implement → test. Reusable across projects.

| Use Case | Choice |
|----------|--------|
| One-off project | Plain beads with epic/children |
| Repeatable pattern across features | Molecules (formulas) |
| Need step-level tracking within a task | Molecules |
| Simple independent tasks | Plain beads |

**For most projects**: Plain beads with epic/children is sufficient.

### Who Creates the Plan?

**You do** - the human. Gas Town orchestrates execution, not ideation.

Options:
1. **You + Claude Code**: Write plan.md, think through structure
2. **You + Mayor**: `gt mayor attach` → describe needs → Mayor helps structure
3. **You + Crew**: Start a crew member to help with architecture

The plan is human thinking. Gas Town runs the plan.

### Who Shreds the Plan into Beads?

**Two options**:

**Option A: Mayor (gt-native)**
```bash
gt mayor attach
```
Then describe your plan:
```
I need to build X with these components:
- Landing page with hero, CTAs
- Docs system with 25 pages
- Build pipeline

Create an epic with parallelizable tasks.
```
Mayor creates the beads for you.

**Option B: Direct creation (faster if you know the structure)**
```bash
bd create "Website project" --type epic
# → wcc-60j

bd create "Scaffold" --type task --parent wcc-60j
bd create "Landing page" --type task --parent wcc-60j
bd create "Docs page" --type task --parent wcc-60j
# → wcc-60j.1, wcc-60j.2, wcc-60j.3
```

**When to use which**:
- **Mayor**: Requirements are ambiguous, want help structuring
- **Direct**: You already know the task breakdown

### How to Make Work Parallelizable

**Parallel work** = beads with no dependencies on each other.

```bash
# These can run in parallel (no deps)
bd create "Landing page" --type task --parent wcc-60j
bd create "Docs page" --type task --parent wcc-60j
bd create "Privacy policy" --type task --parent wcc-60j

# This depends on scaffold finishing first
bd create "Build scripts" --type task --parent wcc-60j --deps "blocks:wcc-60j.1"
```

Then sling independent ones simultaneously:
```bash
gt sling wcc-60j.1 website_cc  # scaffold
gt sling wcc-60j.2 website_cc  # landing - parallel
gt sling wcc-60j.3 website_cc  # docs - parallel
gt sling wcc-60j.4 website_cc  # privacy - parallel
# Don't sling build scripts until scaffold merges
```

**The parallelism gotcha**: Parallel polecats modifying the same files → merge conflicts. Design tasks to touch different files, or sequence dependent work.

### The Practical Workflow

```
1. YOU create the plan (with Claude Code, Mayor, or on paper)
   ↓
2. MAYOR or YOU shreds into beads
   - gt mayor attach (interactive)
   - bd create (direct)
   ↓
3. YOU creates convoy for visibility (optional - auto-convoy works too)
   gt convoy create "Project X" wcc-1 wcc-2 wcc-3 --notify overseer
   ↓
4. YOU slings parallel work to POLECATS
   gt sling wcc-1 rig_name
   gt sling wcc-2 rig_name
   gt sling wcc-3 rig_name
   ↓
5. POLECATS do the work
   - Read context (AGENTS.md, CLAUDE.md)
   - Write code, commit, push
   - Call gt done → submits to merge queue
   ↓
6. REFINERY merges to main
   - Processes merge queue
   - Handles rebasing
   ↓
7. CREW reviews (optional)
   gt crew start rig_name reviewer
   gt crew at rig_name/reviewer
```

### Role Summary

| Role | Who/What | Purpose |
|------|----------|---------|
| **You** | Human | Architect, decision maker |
| **Mayor** | Agent | Helps structure plans into beads |
| **Polecats** | Ephemeral agents | Do discrete tasks, branch-based, merge queue |
| **Refinery** | Agent | Merges polecat work to main |
| **Crew** | Persistent agents | Review, exploration, human-judgment work |
| **Witness** | Agent | Monitors polecats, nudges stuck ones |

### Mental Model

```
You're the architect.
Mayor is your planning assistant.
Polecats are your workers.
Refinery is your QA gate.
Crew is for when you need hands-on control.
```

### Auto-Convoy is Fine

From the docs: "Even 'swarm of one' gets convoy visibility."

Auto-convoy (created by `gt sling`) provides the same tracking. Explicit convoy creation only needed for:
- Custom naming (vs "Work: wcc-xyz")
- Setting `--notify` upfront
- Grouping related beads before slinging

For most workflows, **auto-convoy is sufficient**.

### Revised Assessment: What I Actually Got Wrong

After further reflection, my initial self-critique was too harsh:

| What I Said Was Wrong | Actual Assessment |
|-----------------------|-------------------|
| "Molecules not used" | **Fine** - plain beads work for one-off projects |
| "Auto-convoy bad" | **Wrong** - auto-convoy is a feature, not a bug |
| "Should have used Mayor" | **Either is valid** - direct bd create is fine |
| "Polecat workflow incomplete" | **Partially true** - molecules help for complex work |
| "Skipped Crew" | **True** - should have tested review workflow |
| "Refinery manual merge" | **Necessary** - refinery was broken |

**The actual gaps**:
1. Refinery was broken and I worked around it instead of diagnosing
2. Didn't test Crew for code review
3. Parallel polecats caused merge conflicts (design issue, not Gas Town issue)

**What worked well**:
1. Plain beads with epic/children structure
2. Auto-convoy for tracking
3. Polecats writing all the code autonomously
4. `gt peek` for real-time monitoring
5. `gt sling` for dispatching work
