# Gas Town: The Missing Manual

A complete end-to-end guide to orchestrating AI coding agents with Gas Town.

**What you'll learn**: How to take a project idea from concept → plan → beads → agent execution → merged PR, using the full Gas Town workflow.

**Example project**: We'll build `linky`, a CLI tool that extracts and validates URLs from markdown files. This is a small-to-medium project that demonstrates the full workflow. Substitute your own project where indicated with `[YOUR PROJECT]`.

> 📝 **Note on this guide**: This document was synthesized from four AI agent experiments with Gas Town, cross-referenced with official documentation and verified against `gt --help` / `bd --help` output. Expected output examples are illustrative and may differ from actual output. Please report any corrections!

---

## Table of Contents

1. [Mental Model: What Gas Town Actually Is](#1-mental-model-what-gas-town-actually-is)
2. [The Directory Structure](#2-the-directory-structure)
3. [Phase 1: Town Setup](#3-phase-1-town-setup)
4. [Phase 2: Adding Your Project as a Rig](#4-phase-2-adding-your-project-as-a-rig)
5. [Phase 3: Planning with the Mayor](#5-phase-3-planning-with-the-mayor)
6. [Phase 4: Understanding Beads](#6-phase-4-understanding-beads)
7. [Phase 5: Working with Crew](#7-phase-5-working-with-crew)
8. [Phase 6: Polecats and Convoys](#8-phase-6-polecats-and-convoys)
9. [Phase 7: The Refinery and PRs](#9-phase-7-the-refinery-and-prs)
10. [Complete Workflow: Putting It All Together](#10-complete-workflow-putting-it-all-together)
11. [Troubleshooting Appendix](#11-troubleshooting-appendix)

---

## 1. Mental Model: What Gas Town Actually Is

Gas Town is an orchestration system for AI coding agents. Think of it as:

- **A town** (`~/gt/`) where all your agent work happens
- **Rigs** are projects registered with the town (your repos)
- **Workers** are AI agents that do the actual coding

### Role Taxonomy

**Infrastructure Roles** (manage the system):

| Role | Description | Lifecycle |
|------|-------------|-----------|
| **Mayor** | Global coordinator at `mayor/` - initiates convoys, coordinates work | Singleton, persistent |
| **Deacon** | Background supervisor daemon (watchdog) | Singleton, persistent |
| **Witness** | Per-rig polecat lifecycle manager | One per rig, persistent |
| **Refinery** | Per-rig merge queue processor | One per rig, persistent |

**Worker Roles** (do actual project work):

| Role | Description | Lifecycle |
|------|-------------|-----------|
| **Polecat** | Ephemeral worker with own worktree | Transient, Witness-managed |
| **Crew** | Persistent worker with own clone | Long-lived, user-managed |
| **Dog** | Deacon helper for infrastructure tasks | Ephemeral, Deacon-managed |

**The Core Loop**:
```
You → Mayor → Beads (work items) → Convoy → Crew/Polecats → Code → Refinery → main branch
```

### Key Principles

| Principle | Meaning |
|-----------|---------|
| **GUPP** (Gas Town Universal Propulsion Principle) | "If it's on your hook, YOU RUN IT" - agents execute immediately when given work |
| **MEOW** (Molecular Expression of Work) | Breaking large goals into detailed instructions. Supported by Beads, Epics, Formulas, and Molecules |
| **NDI** (Nondeterministic Idempotence) | Persistent Beads and oversight agents guarantee eventual completion even when individual operations fail |

### Key Concepts

| Concept | Meaning |
|---------|---------|
| **Beads** | The universal work item format - issues, tasks, epics, MRs (stored as JSONL) |
| **Hook** | A pinned bead for each agent - when work appears on your hook, GUPP says run it |
| **Convoy** | Primary work-order tracking related beads across rigs (`hq-cv-*` prefix) |
| **Swarm** | Ephemeral - "the workers currently on a convoy's issues" (not a persistent concept) |

---

## 2. The Directory Structure

Understanding where things live is crucial. Gas Town has a specific layout:

```
~/gt/                              # Town root (HQ)
├── .beads/                        # Town-level beads (hq-* prefix, includes convoys)
├── mayor/                         # Mayor config
│   ├── town.json                  # Town configuration
│   └── CLAUDE.md                  # Mayor context
├── deacon/                        # Deacon daemon
│   └── dogs/                      # Deacon helpers (NOT workers)
│       └── boot/                  # Health triage dog
│
└── <rig_name>/                    # Your project (e.g., "linky")
    ├── config.json                # Rig identity and settings
    ├── .beads/ → mayor/rig/.beads # (symlink or redirect)
    ├── .repo.git/                 # Bare repo (shared by all worktrees)
    │
    ├── mayor/rig/                 # Mayor's worktree (canonical beads live here)
    │   ├── .beads/                # THE source of truth for this rig's beads
    │   └── CLAUDE.md              # Per-rig mayor context
    │
    ├── refinery/                  # Refinery settings parent
    │   ├── .claude/settings.json
    │   └── rig/                   # Worktree on main (merge target)
    │
    ├── witness/                   # Monitors polecats (NO git clone)
    │   └── .claude/settings.json
    │
    ├── crew/                      # Persistent workers
    │   ├── .claude/settings.json  # Shared by all crew (via traversal)
    │   ├── joe/rig/               # Crew member "joe"'s worktree
    │   └── max/rig/               # Crew member "max"'s worktree
    │
    └── polecats/                  # Ephemeral workers (come and go)
        ├── .claude/settings.json  # Shared by all polecats
        └── Toast/rig/             # Polecat "Toast"'s worktree
```

**Critical Insights**:
- The rig root is a container, NOT a clone
- `.repo.git/` is bare - refinery and polecats are worktrees sharing refs
- Per-rig `mayor/rig/` holds canonical `.beads/`, others inherit via redirect
- Settings are placed in parent dirs (not git clones) so Claude finds them via upward traversal

---

## 3. Phase 1: Town Setup

### Prerequisites

| Tool | Version | Check | Install |
|------|---------|-------|---------|
| **Go** | 1.21+ | `go version` | See [golang.org](https://go.dev/doc/install) |
| **Git** | 2.20+ | `git --version` | `brew install git` (macOS) |
| **Beads** | latest | `bd version` | `go install github.com/steveyegge/beads/cmd/bd@latest` |
| **tmux** | 3.0+ | `tmux -V` | `brew install tmux` (macOS) |
| **AI Coding Agent** | any | see below | Claude Code, Codex CLI, or Gemini CLI |

**AI Agent Setup**: Gas Town orchestrates AI coding agents. You need at least one of these configured and working:
- **Claude Code** (`claude --version`) - via API key or account auth
- **Codex CLI** (`codex --version`) - via OpenAI API key or account auth
- **Gemini CLI** (`gemini --version`) - via Google API key or account auth

The key requirement is that your chosen agent CLI tool runs successfully on its own before using it with Gas Town. Authentication can be via API keys (environment variables) OR account-based login—whatever your agent supports.

### Install Gas Town

```bash
# From anywhere
go install github.com/steveyegge/gastown/cmd/gt@latest
go install github.com/steveyegge/beads/cmd/bd@latest

# Verify installation
gt version
bd version
```

If `gt` is not found, ensure `$GOPATH/bin` (usually `~/go/bin`) is in your PATH:

```bash
# Add to ~/.bashrc, ~/.zshrc, or equivalent
export PATH="$PATH:$HOME/go/bin"
```

### Create Your Town (HQ)

```bash
# Create a Gas Town workspace (HQ)
gt install ~/gt
```

**Expected output**:
```
Creating Gas Town workspace at /Users/you/gt
  ✓ Created mayor/
  ✓ Created deacon/
  ✓ Created .beads/
  ✓ Initialized configuration

Gas Town installed successfully.
Run 'cd ~/gt && gt doctor' to verify.
```

**[YOUR PROJECT]**: You can install to any path, but `~/gt` is conventional.

### Verify Installation

```bash
cd ~/gt
gt doctor
```

**Expected output** (healthy, illustrative):
```
Gas Town Health Check
=====================
✓ Town root: /Users/you/gt
✓ Config valid
✓ Mayor directory exists
✓ Deacon directory exists
✓ Agent CLI available

Status: HEALTHY
```

> ⚠️ **Warning**: If `gt doctor` reports agent issues, ensure your AI coding agent CLI (Claude Code, Codex, or Gemini) is installed and authenticated. Gas Town needs to be able to spawn agent sessions.

---

## 4. Phase 2: Adding Your Project as a Rig

A **rig** is a project registered with Gas Town. This creates the directory structure and clones your repo.

### Create Your Project Repository First

If you don't have a repo yet:

```bash
# Outside of Gas Town - create repo on GitHub first, then:
cd ~/code  # or wherever you keep projects
mkdir linky && cd linky
git init
echo "# Linky - URL extractor for markdown" > README.md
git add . && git commit -m "Initial commit"
gh repo create linky --public --source=. --push
```

**[YOUR PROJECT]**: Replace `linky` with your project name and create your own repo.

### Add the Rig to Gas Town

```bash
# CRITICAL: Must be in ~/gt for this command
cd ~/gt

# Add the rig
gt rig add linky https://github.com/yourusername/linky.git
```

**Syntax**:
```bash
gt rig add <name> <url>
```

> ⚠️ **Warning - Naming Rules**:
> - Rig names: Use underscores, NOT hyphens (`my_project`, not `my-project`)
> - Beads prefix: Derived from rig name, can be configured separately
>
> **Why?** Hyphens are reserved for agent ID parsing internally.

**Expected output**:
```
Adding rig 'linky'...
  Cloning https://github.com/yourusername/linky.git
  Creating bare repo at linky/.repo.git
  Creating mayor worktree at linky/mayor/rig
  Creating refinery worktree at linky/refinery/rig

Rig 'linky' added successfully.
```

### Verify the Rig

```bash
# Still in ~/gt
gt rig list
```

**Expected output**:
```
Registered Rigs
===============
linky    https://github.com/yourusername/linky.git
```

```bash
# Detailed health check
gt doctor --rig linky
```

### Understanding What Just Happened

When you added the rig, Gas Town:
1. Created `~/gt/linky/` directory structure
2. Cloned your repo as a bare repo (`.repo.git`)
3. Created worktrees for mayor and refinery
4. Set up the beads directory at `linky/mayor/rig/.beads/`

---

## 5. Phase 3: Planning with the Mayor

The **Mayor** is your primary interface for planning work. The Mayor is the Chief-of-Staff responsible for initiating convoys, coordinating work distribution, and notifying users.

### Operational Modes

Gas Town supports two modes:

| Mode | When to Use | Agents Run In |
|------|-------------|---------------|
| **Minimal** (no daemon) | Testing, simple workflows, manual control | Manual `claude` sessions |
| **Full Stack** (with daemon) | Production workflows, multiple concurrent agents | tmux sessions via daemon |

### Start the Mayor (Full Stack Mode)

```bash
# From ~/gt
cd ~/gt

# Start the daemon (manages agent lifecycle)
gt daemon start

# Attach to Mayor
gt mayor attach
```

**Or start the Mayor directly**:
```bash
gt mayor start   # Start Mayor session
gt mayor attach  # Attach to running Mayor
gt mayor stop    # Stop Mayor session
```

This opens a tmux session with the Mayor. You're now in a conversation with an AI that understands Gas Town.

**Expected**: You'll see a tmux pane with a Claude conversation interface.

### Describe Your Project

Talk to the Mayor naturally. Here's an example conversation:

```
You: I want to build linky, a CLI tool in Go that:
     1. Takes a markdown file or directory as input
     2. Extracts all URLs from the markdown
     3. Validates each URL (checks if reachable)
     4. Outputs a report of broken links

     Can you help me plan this out and create the work items?
```

**Mayor response** (abbreviated):
```
I'll help you plan linky. Let me break this down into epics and tasks.

Based on your requirements, I see these major components:
1. CLI Framework (argument parsing, help text)
2. Markdown Parser (extract URLs)
3. URL Validator (HTTP checks, concurrency)
4. Reporter (output formatting)

Let me create the beads for this...

Created:
- linky-a1b2c: Epic: Linky CLI Tool
  - linky-d3e4f: Task: Set up Go project structure
  - linky-g5h6i: Task: Implement CLI argument parsing
  - linky-j7k8l: Task: Build markdown URL extractor
  - linky-m9n0p: Task: Create concurrent URL validator
  - linky-q1r2s: Task: Implement report generator
  - linky-t3u4v: Task: Add error handling and edge cases
  - linky-w5x6y: Task: Write tests
```

### Alternative: Create Beads Directly

If you already know your task breakdown, skip the conversation and create beads directly:

```bash
# From ~/gt (or you can ask any agent to run these)
cd ~/gt/linky/mayor/rig

# Create epic
bd create --title "Epic: Linky CLI Tool" --type epic

# Note the ID it returns (e.g., linky-a1b2c), then create tasks:
bd create --title "Set up Go project structure" --type task
bd create --title "Implement CLI argument parsing" --type task
bd create --title "Build markdown URL extractor" --type task
bd create --title "Create concurrent URL validator" --type task
bd create --title "Implement report generator" --type task

# Link tasks to epic (two equivalent syntaxes)
bd dep add linky-d3e4f linky-a1b2c  # "blocked-id blocker-id" = child depends on parent
# Or use the --parent flag:
bd update linky-d3e4f --parent linky-a1b2c
```

**Expected output** (for each create):
```
Created bead: linky-d3e4f
  Title: Set up Go project structure
  Type: task
  Status: open
```

> 💡 **Tip**: The Mayor is better for exploratory planning. Direct `bd create` is faster when you know exactly what you want.

### View Your Plan

```bash
# From anywhere in the rig
cd ~/gt/linky/mayor/rig

# List all beads
bd list

# List just tasks
bd list --type task

# List with status
bd list --status=open

# Show details of a specific bead
bd show linky-a1b2c

# Show ready work (no blockers)
bd ready
```

---

## 6. Phase 4: Understanding Beads

**Beads** are the universal work item in Gas Town. Everything is a bead: issues, tasks, epics, merge requests, convoys. They're stored as git-backed JSONL files.

### Bead Types

| Type | Purpose | Example |
|------|---------|---------|
| `epic` | Large feature grouping | "Epic: User Authentication" |
| `task` | Discrete implementable work | "Implement login endpoint" |
| `bug` | Something broken | "Fix null pointer in parser" |
| `mr` | Merge request (created by polecats) | "MR: polecat/Toast/linky-d3e4f" |
| `chore` | Maintenance work | "Update dependencies" |

### Bead Lifecycle

```
open → in_progress → closed
         ↓
      blocked (optional)
```

### Key Bead Commands

```bash
# Always run from within a rig worktree (e.g., ~/gt/linky/mayor/rig)

# Create
bd create --title "My task" --type task

# List
bd list                      # All beads
bd list --type task          # Just tasks
bd list --status=open        # Just open items
bd ready                     # Work with no blockers (ready to start)

# Update
bd update linky-abc --status=in_progress    # Claim work
bd dep add linky-child linky-parent         # Add dependency (blocked, blocker)
bd dep linky-child --blocks linky-parent    # Alternative syntax

# Close
bd close linky-abc                          # Mark done

# Details
bd show linky-abc                           # Full details

# Sync (push/pull changes across worktrees)
bd sync
```

### Beads Routing

Gas Town routes beads commands based on issue ID prefix automatically:

```bash
bd show linky-xyz    # Routes to linky rig's beads
bd show hq-abc       # Routes to town-level beads
bd show bd-123       # Routes to beads rig (if you have one)
```

Routes are defined in `~/gt/.beads/routes.jsonl`.

### The `bd ready` Command

This is your best friend. It shows work that's unblocked and ready to start:

```bash
bd ready
```

**Expected output**:
```
Ready work (no blockers, status=open):
  linky-d3e4f  task  Set up Go project structure
  linky-g5h6i  task  Implement CLI argument parsing
  linky-j7k8l  task  Build markdown URL extractor
```

There's also a town-level version:

```bash
gt ready   # Show work ready across entire town
```

---

## 7. Phase 5: Working with Crew

**Crew** are persistent, named workers for each rig. They're your "senior developers":
- Have ongoing context about the project
- Push directly to main (no refinery needed)
- Ideal for exploratory work, design, and foundation building

### Crew vs Polecats

| Aspect | Crew | Polecat |
|--------|------|---------|
| **Lifecycle** | Persistent (user controls) | Transient (Witness controls) |
| **Monitoring** | None | Witness watches, nudges, recycles |
| **Work assignment** | Human-directed or self-assigned | Slung via `gt sling` |
| **Git state** | Pushes to main directly | Works on branch, Refinery merges |
| **Cleanup** | Manual | Automatic on completion |
| **Identity** | `<rig>/crew/<name>` | `<rig>/polecats/<name>` |

### Add a Crew Member

```bash
# From ~/gt
cd ~/gt

# Add a crew member named "joe" to the linky rig
gt crew add linky joe
```

**Expected output**:
```
Adding crew member 'joe' to rig 'linky'...
  Creating worktree at linky/crew/joe/rig
  Branch: main

Crew member 'joe' ready.
```

### Attach to Crew

```bash
# From ~/gt
gt start crew joe           # Start crew member session
# Or attach to already running:
gt crew at joe              # Attach to running crew session
```

> 📝 **Note**: The `gt crew at` command is the standard way to attach. The name is just the crew member name (e.g., `joe`), not the full path.

This opens a tmux session with the crew member. You're now talking to an AI that:
- Has access to the codebase
- Can read/write files
- Can run commands
- Understands the beads in the project

### Give Crew Work

**Option 1: Conversational**
```
You: Please work on linky-d3e4f (Set up Go project structure).
     Create a standard Go project layout with:
     - cmd/linky/main.go
     - internal/extractor/
     - internal/validator/
     - go.mod
```

**Option 2: Sling the bead (hooks it so they can't forget)**
```bash
# From ~/gt (in a different terminal)
gt sling linky-d3e4f linky/joe
```

When you sling to crew, the work is "hooked" to them. They'll see it when they run `gt hook`.

### Monitor Crew Work

```bash
# From ~/gt
gt peek linky/joe           # See their output
gt peek linky/joe -n 100    # Last 100 lines
```

### Crew Pushes to Main

When crew completes work, they commit and push directly to main. They signal completion via `gt done`:

```
Crew (joe): I've created the project structure. Committing and pushing to main...

[joe commits: "feat: initial project structure"]
[joe pushes to origin/main]
[joe runs: gt done]

Done. linky-d3e4f complete.
```

### Session Management for Crew

```bash
# Hand off to a fresh session (preserves hook, refreshes context)
gt handoff

# Talk to predecessor sessions
gt seance                                    # List past sessions
gt seance --talk <session-id>                # Interactive conversation
gt seance --talk <session-id> -p "prompt"    # Single prompt mode
```

### When to Use Crew vs. Polecats

**Use Crew When**:
- Exploratory work
- Long-running projects
- Work requiring human judgment
- Tasks where you want direct control
- Building foundation/scaffold

**Use Polecats When**:
- Discrete, well-defined tasks
- Batch work (tracked via convoys)
- Parallelizable work
- Work that benefits from supervision

> ⚠️ **Critical Pattern**: For new projects, **always use Crew first** to build the foundation. Polecats can't coordinate well on greenfield work.

---

## 8. Phase 6: Polecats and Convoys

**Polecats** are ephemeral swarm workers. They:
- Spawn, do one task, submit MR, self-destruct
- Work on branches (not main)
- Require the Refinery to merge their work
- Are great for batch parallel execution

### The Polecat Lifecycle (Three Layers)

Polecats have three distinct lifecycle layers:

| Layer | Component | Lifecycle | Persistence |
|-------|-----------|-----------|-------------|
| **Session** | Claude (tmux pane) | Ephemeral | Cycles per step/handoff |
| **Sandbox** | Git worktree | Until nuke | Persists through session cycles |
| **Slot** | Name from pool | Until nuke | Released only on completion |

**Key Insight**: Session cycling is **normal operation**, not failure. The polecat continues working—only the Claude context refreshes.

### The Three Operating States

Polecats have exactly three states. **There is NO idle pool**:

| State | Description | What went wrong |
|-------|-------------|-----------------|
| **Working** | Actively doing assigned work | Normal operation |
| **Stalled** | Session stopped mid-work | Interrupted/crashed, never nudged |
| **Zombie** | Completed work but failed to die | `gt done` failed during cleanup |

When a polecat completes its work:
1. Signals completion via `gt done`
2. Exits its session immediately (no idle waiting)
3. Requests its own nuke (self-delete)

### Prerequisites for Polecats

Before using polecats:
1. ✅ Foundation code exists on main (built by Crew)
2. ✅ Tasks are well-defined and independent
3. ✅ Refinery is running (or you're ready for manual merges)

### Convoys: The Primary Tracking Unit

A **convoy** is how you track batched work. Even single issues should go through convoys for dashboard visibility.

```bash
# From ~/gt

# Create a convoy tracking multiple issues
gt convoy create --name "CLI Features" linky-g5h6i linky-j7k8l linky-m9n0p

# Check progress
gt convoy status hq-cv-xyz

# List all active convoys (the dashboard)
gt convoy list

# Include landed convoys
gt convoy list --all
```

**Convoy vs Swarm**:

| Concept | Persistent? | ID | Description |
|---------|-------------|-----|-------------|
| **Convoy** | Yes | `hq-cv-*` | Tracking unit. What you create, track, get notified about. |
| **Swarm** | No | None | Ephemeral. "The workers currently on this convoy's issues." |

### Sling Work to Polecats

```bash
# From ~/gt
cd ~/gt

# Sling a single task (auto-creates convoy for visibility)
gt sling linky-g5h6i linky
```

**Expected output**:
```
Slinging linky-g5h6i to rig linky...
  Creating convoy: "Work: linky-g5h6i"
  Spawning polecat 'Toast' on linky
  Branch: polecat/Toast/linky-g5h6i
  Hooked: linky-g5h6i (Implement CLI argument parsing)

Polecat Toast is working. Monitor with: gt peek linky/Toast
```

### Override Agent Runtime

```bash
# Use a different agent for this sling
gt sling linky-g5h6i linky --agent codex
gt sling linky-g5h6i linky --agent claude

# Available agents depend on your configuration
```

### Monitor Polecats

```bash
# See what's happening
gt peek linky/Toast

# See all active sessions
gt session list

# Detailed view
gt peek linky/Toast -n 150

# Send a nudge (synchronous message)
gt nudge linky/Toast "What's your status?"

# Broadcast to all workers
gt broadcast linky "Heads up: API changed, rebase before pushing"
```

### Sling Ad-Hoc Work (No Bead)

Sometimes you want a polecat to do something without a pre-existing bead:

```bash
gt sling shiny linky --args "Add a --verbose flag to the CLI"
```

The `shiny` keyword means "ad-hoc task". The polecat will:
1. Create a bead for this work
2. Do the work
3. Submit MR

### Monitor Convoy Progress

```bash
# Check convoy status
gt convoy status hq-cv-xyz
# Or by name:
gt convoy status "CLI Features"
```

**Expected output**:
```
🚚 hq-cv-xyz: CLI Features

  Status:    ●
  Progress:  1/3 completed

  Tracked Issues:
    ✓ linky-g5h6i: Implement CLI argument parsing [task]
    ○ linky-j7k8l: Build markdown URL extractor [task]
    ○ linky-m9n0p: Create concurrent URL validator [task]
```

### What Polecats Produce

When a polecat finishes via `gt done`:
1. Pushes branch to origin
2. Submits work to merge queue (MR bead)
3. Requests self-nuke
4. Exits immediately

The MR bead then lives in the merge queue. **The polecat is GONE**—work now exists in the MQ, not in the polecat.

> ⚠️ **Warning**: Polecats create MR beads but **don't merge them**. That's the Refinery's job (or yours, manually).

---

## 9. Phase 7: The Refinery and PRs

The **Refinery** is the merge queue processor. It takes polecat branches and merges them into main.

### Start the Refinery

```bash
# From ~/gt
gt refinery start linky
```

**Expected output**:
```
Starting refinery for rig 'linky'...
  Worktree: linky/refinery/rig
  Watching for MR beads...

Refinery running. Check queue with: gt mq list linky
```

### Check the Merge Queue

```bash
gt mq list linky
```

**Expected output**:
```
Merge Queue: linky
==================
linky-mr-abc123  pending   polecat/Toast/linky-g5h6i  CLI argument parsing
linky-mr-def456  pending   polecat/Rust/linky-j7k8l   URL extractor
linky-mr-ghi789  merging   polecat/Nitro/linky-m9n0p  URL validator

Queue depth: 3
Currently merging: linky-mr-ghi789
```

### The Refinery Flow

```
MR bead created → Refinery picks it up →
  Fetches branch → Attempts rebase + merge →
  If clean: merge + push + close MR bead →
  If conflict: spawn FRESH polecat to re-implement (never send back to original)
```

### When Refinery Succeeds

The MR beads are closed, main has all the code, and the convoy lands (triggering notification).

### Manual Merge (When Refinery Fails)

The Refinery frequently has issues. Based on all agent sessions, expect to do manual merges sometimes.

> ⚠️ **Common Refinery Issues**:
> - "timeout waiting for runtime prompt"
> - "permission denied" on git operations
> - Missing patrol molecule
> - Conflicts requiring human resolution

**Manual merge process**:

```bash
# Go to the refinery worktree
cd ~/gt/linky/refinery/rig

# Fetch all branches
git fetch origin

# See pending polecat branches
git branch -r | grep polecat

# Merge a specific branch
git merge --ff-only origin/polecat/Toast/linky-g5h6i

# If that fails (not fast-forward), use regular merge
git merge origin/polecat/Toast/linky-g5h6i -m "Merge polecat/Toast/linky-g5h6i"

# Push to main
git push origin main

# Close the MR bead manually
bd close linky-mr-abc123
```

**Shell script for batch manual merges**:

```bash
#!/bin/bash
# save as: ~/gt/scripts/manual-merge.sh

RIG=${1:-linky}
cd ~/gt/$RIG/refinery/rig

echo "Fetching all branches..."
git fetch origin

echo "Polecat branches:"
git branch -r | grep polecat

echo ""
read -p "Branch to merge (e.g., origin/polecat/Toast/linky-abc): " BRANCH

if [ -z "$BRANCH" ]; then
    echo "No branch specified, exiting."
    exit 1
fi

echo "Merging $BRANCH..."
git merge --ff-only $BRANCH || git merge $BRANCH -m "Merge $BRANCH"

if [ $? -eq 0 ]; then
    echo "Pushing to main..."
    git push origin main
    echo "Done! Remember to close the MR bead with: bd close <mr-id>"
else
    echo "Merge failed. Resolve conflicts manually."
fi
```

### Your Final PR

After all polecats have merged (via Refinery or manually), your main branch has all the code. To create a GitHub PR for final review:

```bash
# In the refinery worktree (on main)
cd ~/gt/linky/refinery/rig

# Create a feature branch from all this work (optional, for PR)
git checkout -b feature/linky-mvp

# Push and create PR
git push -u origin feature/linky-mvp
gh pr create --title "Linky MVP" --body "Built with Gas Town"
```

---

## 10. Complete Workflow: Putting It All Together

Here's the entire flow as a single reference:

### Phase 1: Setup (One-time)

```bash
# Install
go install github.com/steveyegge/gastown/cmd/gt@latest
go install github.com/steveyegge/beads/cmd/bd@latest

# Create town
gt install ~/gt
cd ~/gt
gt doctor
```

### Phase 2: Add Rig

```bash
cd ~/gt
gt rig add linky https://github.com/you/linky.git
gt doctor --rig linky
```

### Phase 3: Plan with Mayor

```bash
cd ~/gt
gt daemon start
gt mayor attach
# "Create epics and tasks for building a URL extractor CLI..."
# Or: bd create directly
```

### Phase 4: Build Foundation with Crew

```bash
cd ~/gt
gt crew add linky joe
gt start crew joe
# "Build the project scaffold: go.mod, directory structure, main.go..."
# Crew pushes to main when done, runs gt done
```

### Phase 5: Verify Foundation

```bash
cd ~/gt/linky/mayor/rig
git pull
ls -la  # Should see scaffold
bd list  # Should see some tasks closed
```

### Phase 6: Dispatch Parallel Work via Convoy

```bash
cd ~/gt

# Start refinery (or skip and plan to merge manually)
gt refinery start linky

# Create convoy and sling
gt convoy create --name "Features" linky-j7k8l linky-m9n0p linky-q1r2s
gt sling linky-j7k8l linky
gt sling linky-m9n0p linky
gt sling linky-q1r2s linky
```

### Phase 7: Monitor and Merge

```bash
# Monitor polecats
gt peek linky/Toast
gt convoy status "Features"
gt convoy list

# Check merge queue
gt mq list linky

# If refinery stalls, merge manually
cd ~/gt/linky/refinery/rig
git fetch origin
git merge --ff-only origin/polecat/Toast/linky-j7k8l
git push origin main
bd close linky-mr-xyz
```

### Phase 8: Final PR

```bash
cd ~/gt/linky/refinery/rig
git checkout -b feature/complete-build
git push -u origin feature/complete-build
gh pr create --title "Linky: Complete Build" --body "..."
```

---

## 11. Troubleshooting Appendix

### Error: "not in a Gas Town workspace"

**Cause**: Running `gt` commands from outside `~/gt`

**Fix**:
```bash
cd ~/gt
# Then run your command
```

### Error: Rig name contains invalid characters

**Cause**: Used hyphen in rig name

**Example**:
```
gt rig add my-project ...
Error: rig name "my-project" contains invalid characters; hyphens are reserved
```

**Fix**: Use underscores
```bash
gt rig add my_project https://...
```

### Error: timeout waiting for runtime prompt

**Cause**: Refinery patrol molecule not working

**Fix**: Manual merge (see Phase 7 above)

### Error: fatal: couldn't find remote ref polecat/...

**Cause**: Running `bd sync` before branch is pushed

**Fix**: Push branch first, or skip sync
```bash
git push origin polecat/Toast/linky-abc
bd sync
```

### Polecat hooks are empty

**Cause**: Work wasn't properly hooked on spawn

**Fix**: Use `gt nudge` as fallback
```bash
gt nudge linky/Toast "Your task is linky-abc: Implement X. Start working."
```

### Multiple polecats doing same work

**Cause**: No coordinator, all saw same ready work

**Fix**: Use Crew as coordinator for dependent tasks, or serialize slinging

### Refinery permission denied on git reset

**Cause**: Refinery can't hard reset (filesystem permissions)

**Fix**: Manual merge in refinery worktree (see Phase 7)

### Crew changes not visible to polecats

**Cause**: Crew pushed to main but polecats branched before

**Fix**:
1. Wait for current polecats to finish
2. Have them rebase: `git fetch origin && git rebase origin/main`
3. Or just let refinery handle merge conflicts

### Stale beads after work is done

**Cause**: Beads not synced across worktrees

**Fix**:
```bash
bd sync  # In the worktree that needs update
```

### How to reset a stuck rig

```bash
cd ~/gt

# Remove and re-add the rig
gt rig remove linky
gt rig add linky https://github.com/you/linky.git

# Note: This loses local worktree changes but preserves git history
```

### How to kill a stuck polecat

```bash
# Find the session
gt session list

# Stop it
gt session stop linky/Toast

# Or nuke it entirely (removes worktree + branch)
gt polecat nuke Toast
```

### Escalations

When something needs human attention:

```bash
gt escalate "topic"              # Default severity
gt escalate -s critical "msg"    # Urgent, immediate attention
gt escalate -s high "msg"        # Important blocker
gt escalate -s medium "msg"      # Normal priority
gt escalate -s low "msg"         # Low priority
```

> 📝 **Note**: Severity levels are lowercase: `critical`, `high`, `medium`, `low`.

### How to clear all polecats

```bash
# Ask the Mayor or a crew member
gt mayor attach
# "Clear all polecats on the linky rig"

# Or nuke polecats individually
gt polecat nuke Toast
gt polecat nuke Rust
```

---

## Quick Reference Card

```bash
# === INSTALLATION ===
gt install ~/gt              # Create new town
gt init                      # Initialize existing dir as rig
gt doctor                    # Health check

# === RIGS ===
gt rig add NAME URL          # Add project
gt rig list                  # List rigs

# === SERVICES (Full Stack Mode) ===
gt daemon start              # Start daemon
gt up                        # Bring up all services
gt down                      # Stop all services
gt shutdown                  # Shutdown with cleanup

# === MAYOR ===
gt mayor start               # Start Mayor session
gt mayor attach              # Attach to Mayor
gt mayor stop                # Stop Mayor session

# === CREW ===
gt crew add RIG NAME         # Add crew member
gt start crew NAME           # Start crew session
gt crew at NAME              # Attach to running crew

# === BEADS ===
bd list                      # List all
bd ready                     # Show unblocked work
gt ready                     # Town-wide ready work
bd create --title "X" --type task
bd create --title "X" --parent ID   # Create with parent
bd show ID
bd update ID --status=in_progress
bd update ID --parent ID     # Set parent
bd close ID
bd dep add BLOCKED BLOCKER   # Add dependency
bd dep ID --blocks ID        # Alternative syntax
bd sync                      # Sync beads

# === CONVOYS ===
gt convoy create --name "Name" BEAD1 BEAD2
gt convoy list               # Dashboard
gt convoy status ID          # Progress

# === POLECATS ===
gt sling BEAD RIG            # Dispatch work
gt sling BEAD RIG --agent X  # Override agent
gt sling shiny RIG --args "..." # Ad-hoc work

# === REFINERY ===
gt refinery start RIG        # Start merge queue
gt mq list RIG               # View queue

# === MONITORING ===
gt session list              # All sessions
gt peek RIG/AGENT            # View output
gt peek RIG/AGENT -n 100     # Last 100 lines
gt nudge RIG/AGENT "msg"     # Send message
gt broadcast RIG "msg"       # All workers

# === SESSION MANAGEMENT ===
gt handoff                   # Fresh session (keeps hook)
gt seance                    # List past sessions
gt seance --talk ID          # Talk to predecessor
gt seance --talk ID -p "msg" # Single prompt mode
gt done                      # Signal completion (polecats)

# === ESCALATION ===
gt escalate "msg"            # Human attention needed
gt escalate -s critical "msg" # Urgent
gt escalate -s high "msg"    # High priority
```

---

## Next Steps

Once you're comfortable with this workflow:

1. **Explore molecules** for repeatable multi-step workflows (`bd formula list`, `bd cook`, `bd mol pour`)
2. **Set up Witness** for automatic polecat monitoring (`gt witness start`)
3. **Configure Deacon** for automated cleanup (`gt deacon start`)
4. **Configure agents** for your preferred runtimes (`gt config agent list`, `gt config agent set`)
5. **Try multi-rig** with the Mayor managing several projects
6. **Use the dashboard** (`gt dashboard`) for visual convoy tracking

---

*This guide synthesized from four AI agent experiments with Gas Town, cross-referenced with official documentation and verified against `gt --help` / `bd --help` output. Last updated: January 2026.*
