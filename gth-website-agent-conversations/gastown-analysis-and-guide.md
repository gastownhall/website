# Gas Town Analysis: Four Agent Sessions Compared

## Executive Summary

This document analyzes four separate AI coding agent sessions (Claude Code Tight, Claude Code Loose, Codex, and Gemini) that each attempted to build a website using Gas Town. The analysis reveals common patterns, key differences, and practical lessons for effective Gas Town usage.

---

## Part 1: Comparative Analysis

### Common Patterns All Four Agents Learned

#### 1. Rig Naming Constraints
**All four agents discovered this the hard way:**
- Rig names cannot contain hyphens (reserved for agent ID parsing)
- Use underscores for rig names (e.g., `website_cc`, `website_gemini`)
- Prefixes CAN use hyphens (e.g., prefix `website-cc` for rig `website_cc`)

```bash
# WRONG
gt rig add website-cc https://github.com/...
# Error: rig name "website-cc" contains invalid characters

# CORRECT
gt rig add website_cc https://github.com/... --prefix website-cc
```

#### 2. Run Commands from HQ Root
All agents learned that `gt` commands work most reliably from the town root (`~/gt/`):
- `gt rig add` fails outside HQ with "not in a Gas Town workspace"
- Setting `GT_TOWN_ROOT` env var does NOT reliably override this
- Always `cd ~/gt` before running rig operations

#### 3. `gt sling` Successfully Spawns Polecats
Every agent successfully used `gt sling` to dispatch work:
```bash
gt sling <bead-id> <rig-name>   # Spawns polecat with work
gt sling shiny --args "..."     # Ad-hoc work without bead
```

#### 4. `gt peek` is Essential for Monitoring
All agents relied heavily on `gt peek` for visibility:
```bash
gt peek <rig>/<agent>           # View agent output
gt peek <rig>/<agent> -n 120    # Last 120 lines
gt session list                 # All active sessions
```

#### 5. Refinery Issues Required Manual Workarounds
**This was universal across all four sessions:**
- Refinery timeouts ("timeout waiting for runtime prompt")
- Missing `mol-refinery-patrol` proto
- `git reset --hard` permission errors
- Polecats completed work but merges stalled

**Common workaround pattern:**
1. Polecat completes work and pushes branch
2. Refinery fails to merge
3. Manually merge in refinery repo: `git merge --ff-only polecat/<branch>`
4. Manually close MR beads with `bd close`

#### 6. `bd create` Works Directly (Bypasses Mayor)
All agents discovered they could create beads directly:
```bash
bd create --title "Build scaffold" --type task --prefix website-cc
bd create --title "Epic: Core Site" --type epic --prefix website-cc
bd update <child-id> --parent <epic-id>
```

#### 7. `gt nudge` as Reliable Fallback
When hooks failed or agents got stuck, all four used nudging:
```bash
gt nudge <rig>/<agent> "Process the queue"
gt nudge <rig>/<agent> "Your task is: ..."
```

### Key Differences Between Agents

#### CC-Tight (Most Comprehensive)
- **Explored molecules/formulas deeply** before concluding they're optional for one-off projects
- **Discovered Crew vs Polecat distinction** clearly:
  - Crew: pushes directly to main (no refinery needed)
  - Polecats: work on branches, require refinery merge
- **Created most detailed learnings** (1126 lines)
- **Initial hypothesis was wrong**: thought molecules were essential, later realized plain beads with epic/task hierarchy suffice

#### CC-Loose (Critical Initial Mistake)
- **Anti-pattern discovered**: initially worked outside Gas Town, created files manually, then copied them
- **Corrected by**: adding existing folder as a rig with `gt rig add`
- **Key insight**: "Crew is primary, polecats are swarm workers"
- **Refinery workaround**: created manual tmux session + nudged it directly

#### Codex (Unique Issues)
- **`mol-polecat-work` missing file warnings** during sling (path resolution mismatch)
- **Polecat name reuse caused collisions** - same name assigned to different tasks
- **`bd sync` failed on new branches** - "fatal: couldn't find remote ref"
- **Workaround**: push branch first, then `bd sync` (or skip it), then `gt done`

#### Gemini (Coordination Failures)
- **Empty hooks problem**: agents ran `gt hook` and saw nothing despite `--args`
- **Multiple agents duplicated work**: three polecats all built Astro scaffold because they couldn't see each other's in-flight work
- **Key architectural insight**: "Skipping Crew layer is anti-pattern" - need Crew as coordinator to prevent duplicate effort

### Architecture Insights from Failures

| Issue | Root Cause | Lesson |
|-------|-----------|--------|
| Duplicate scaffold builds | No coordinator to serialize dependent tasks | Use Crew as "Lead Engineer" |
| Empty hooks | Wisp attachment failed with `shiny` | `gt nudge` is reliable fallback |
| Refinery stalls | Missing patrol molecule or permission issues | Manual merge is acceptable |
| `bd sync` failures | No remote branch exists yet | Push first, then sync |
| Polecat collisions | Namepool reuse before prior session exits | Wait for sessions to exit |

---

## Part 2: Practical Gas Town Usage Guide

Based on the four agent sessions and official documentation, here's how to use Gas Town for common scenarios.

### How to Initialize a New Project

```bash
# 1. Navigate to HQ root
cd ~/gt

# 2. Add the rig (use underscore, not hyphen in rig name)
gt rig add myproject https://github.com/you/myproject.git --prefix myproject

# 3. Verify it worked
gt rig list
gt doctor --rig myproject

# 4. Start the Mayor (optional but recommended)
gt may at  # or: gt start mayor

# 5. Start a Crew member for hands-on work
gt crew add myproject joe
gt crew at myproject/joe
```

### How to Create an Initial Plan

**Option A: Use Mayor for Complex Planning**
```bash
gt may at
# Then in conversation:
# "Create epics and tasks for building a React todo app with auth"
```

**Option B: Use `bd create` Directly (Faster)**
```bash
# Create epic
bd create --title "Epic: Core Application" --type epic --prefix myproject

# Create tasks under epic
bd create --title "Build scaffold" --type task --prefix myproject
bd create --title "Add authentication" --type task --prefix myproject
bd create --title "Create UI components" --type task --prefix myproject

# Link tasks to epic
bd update myproject-abc --parent myproject-xyz
bd update myproject-def --parent myproject-xyz
```

**Option C: Use Crew for Design Work**
```bash
gt crew at myproject/joe
# "Design the architecture and create beads for a todo app"
```

### How Plans Turn into Beads

Beads are the fundamental work units. The hierarchy:

```
Epic (myproject-xyz)
├── Task (myproject-abc): Build scaffold
├── Task (myproject-def): Add auth
└── Task (myproject-ghi): Create UI
```

Key commands:
```bash
bd list --type epic            # View epics
bd list --type task            # View tasks
bd show myproject-abc          # Task details
bd ready                       # Work with no blockers
bd update <id> --status in_progress  # Claim work
bd close <id>                  # Mark complete
```

### How Crew Gets Work Done

**Crew = Persistent workers, push directly to main**

```bash
# Start crew session
gt crew at myproject/joe

# Option 1: Self-assign from ready queue
bd ready
bd update myproject-abc --status in_progress
# Do the work...
bd close myproject-abc

# Option 2: Sling work to self
gt sling myproject-abc myproject

# Option 3: Just talk to crew member
# "Implement the scaffold task myproject-abc"
```

**Crew advantages:**
- No refinery needed (pushes to main)
- Persistent context across sessions
- Good for exploratory/design work

### How Polecats Get Work Done

**Polecats = Ephemeral workers, branch-based, refinery merges**

```bash
# Sling work to spawn a polecat
gt sling myproject-abc myproject

# Monitor the polecat
gt peek myproject/Toast -n 60

# Polecat lifecycle:
# 1. Spawns with work on hook
# 2. Creates branch, does work
# 3. Pushes branch, calls gt done
# 4. Self-destructs (no idle state)
# 5. Refinery merges to main
```

**When to use Polecats:**
- Well-defined, discrete tasks
- Parallelizable work
- Batch processing (convoys)

**When NOT to use Polecats:**
- Design/exploratory work (use Crew)
- When you need to iterate (use Crew)
- Foundation work that others depend on (use Crew, merge first)

### Using Convoys for Batch Work

```bash
# Create convoy tracking multiple issues
gt convoy create "Feature X" myproject-abc myproject-def myproject-ghi

# Sling issues to polecats
gt sling myproject-abc myproject
gt sling myproject-def myproject
gt sling myproject-ghi myproject

# Check progress
gt convoy status
gt convoy list
```

### Refinery: The Merge Queue

The Refinery processes polecat branches:

```bash
# Start refinery
gt refinery start myproject

# Check merge queue
gt mq list myproject

# Nudge if stuck
gt nudge myproject/refinery "Process the queue"
```

**If Refinery Fails (common):**
```bash
# Manual merge in refinery repo
cd ~/gt/myproject/refinery/rig
git fetch origin
git merge --ff-only origin/polecat/<branch>
git push origin main

# Close the MR bead manually
bd close myproject-mr-xyz
```

### Formulas and Molecules (Optional)

**Formulas** = Workflow templates (TOML files)
**Molecules** = Active workflow instances with trackable steps

For most one-off projects, you don't need molecules. Simple beads with epic/task hierarchy suffice.

**When you might want molecules:**
- Repeatable multi-step workflows
- Complex coordination patterns
- When you want step-by-step audit trail

```bash
# View available formulas
bd formula list

# Cook formula into protomolecule
bd cook mol-polecat-work

# Pour molecule for specific work
bd mol pour mol-polecat-work --var issue=myproject-abc

# Navigate molecule
bd mol current            # Where am I?
bd close <step> --continue  # Close step and advance
```

### Quick Reference: Most Useful Commands

| Command | Purpose |
|---------|---------|
| `gt rig add <name> <url> --prefix <pfx>` | Add new project |
| `gt may at` | Attach to Mayor |
| `gt crew at <rig>/<name>` | Attach to Crew member |
| `gt sling <bead> <rig>` | Dispatch work to polecat |
| `gt peek <rig>/<agent>` | Monitor agent output |
| `gt nudge <rig>/<agent> "msg"` | Send message to agent |
| `gt session list` | View all sessions |
| `gt doctor --rig <name>` | Health check |
| `bd ready` | Show unblocked work |
| `bd list --type task` | List tasks |
| `bd create --title "X" --type task` | Create bead |
| `bd show <id>` | View bead details |
| `bd close <id>` | Mark complete |
| `gt mq list <rig>` | View merge queue |

### Anti-Patterns to Avoid

1. **Don't work outside Gas Town** - Don't manually create files and copy them in
2. **Don't skip Crew for greenfield projects** - Polecats need foundation work merged first
3. **Don't expect Refinery to be reliable** - Be ready for manual merges
4. **Don't use hyphens in rig names** - Use underscores
5. **Don't run `gt` commands outside HQ** - Always `cd ~/gt` first
6. **Don't watch agents work** - Check results when they finish
7. **Don't let sessions run long** - Use `gt handoff` liberally

### Recommended Workflow for New Projects

1. **Start with Crew** - Create a Crew member as your "Lead Engineer"
2. **Build foundation first** - Have Crew build and merge scaffold to main
3. **Then use Polecats** - Once foundation exists, sling discrete tasks
4. **Monitor with `gt peek`** - Check agent progress periodically
5. **Manual merge if needed** - Don't block on Refinery issues
6. **Clean up regularly** - Ask Crew to clear stale beads and branches

---

## Appendix: Directory Structure Reference

```
~/gt/                           Town root
├── .beads/                     Town-level beads (hq-* prefix)
├── mayor/                      Mayor config
├── deacon/                     Deacon daemon
└── <rig>/                      Project container
    ├── config.json             Rig identity
    ├── .beads/                 Rig beads (via mayor/rig)
    ├── .repo.git/              Bare repo (shared by worktrees)
    ├── mayor/rig/              Mayor's clone (canonical beads)
    ├── refinery/rig/           Worktree on main
    ├── witness/                Monitors polecats
    ├── crew/<name>/rig/        Crew member workspaces
    └── polecats/<name>/rig/    Ephemeral polecat worktrees
```

---

## Conclusion

Gas Town is a powerful orchestration system, but the "happy path" (`gt sling` → Refinery merge) frequently breaks. All four agents converged on similar workarounds: manual merges, direct `bd create`, and `gt nudge` as fallback. The key insight is that **Crew members are more reliable than Polecats** for coordinated work, and the Refinery should be treated as "nice to have" rather than essential.

The most successful pattern: Use Crew for design and foundation work, merge to main, then use Polecats for well-defined parallel tasks.
