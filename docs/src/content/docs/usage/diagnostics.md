---
title: "Diagnostics Commands"
description: "CLI reference for Gas Town diagnostics commands"
sidebar:
  order: 7
---

This page documents the **Diagnostics** commands for the `gt` CLI.

## `gt activity`

Emit and view activity events

```
Emit and view activity events for the Gas Town activity feed.

Events are written to ~/gt/.events.jsonl and can be viewed with 'gt feed'.

Subcommands:
  emit    Emit an activity event

Usage:
  gt activity [command]

Available Commands:
  emit        Emit an activity event

Flags:
  -h, --help   help for activity

Use "gt activity [command] --help" for more information about a command.

```

## `gt audit`

Query work history by actor

```
Query provenance data across git commits, beads, and events.

Shows a unified timeline of work performed by an actor including:
  - Git commits authored by the actor
  - Beads (issues) created by the actor
  - Beads closed by the actor (via assignee)
  - Town log events (spawn, done, handoff, etc.)
  - Activity feed events

Examples:
  gt audit --actor=greenplace/crew/joe       # Show all work by joe
  gt audit --actor=greenplace/polecats/toast # Show polecat toast's work
  gt audit --actor=mayor                  # Show mayor's activity
  gt audit --since=24h                    # Show all activity in last 24h
  gt audit --actor=joe --since=1h         # Combined filters
  gt audit --json                         # Output as JSON

Usage:
  gt audit [flags]

Flags:
      --actor string   Filter by actor (agent address or partial match)
  -h, --help           help for audit
      --json           Output as JSON
  -n, --limit int      Maximum number of entries to show (default 50)
      --since string   Show events since duration (e.g., 1h, 24h, 7d)

```

## `gt checkpoint`

Manage session checkpoints for crash recovery

```
Manage checkpoints for polecat session crash recovery.

Checkpoints capture the current work state so that if a session crashes,
the next session can resume from where it left off.

Checkpoint data includes:
- Current molecule and step
- Hooked bead
- Modified files list
- Git branch and last commit
- Timestamp

Checkpoints are stored in .polecat-checkpoint.json in the polecat directory.

Usage:
  gt checkpoint [command]

Available Commands:
  clear       Clear the checkpoint file
  read        Read and display the current checkpoint
  write       Write a checkpoint of current session state

Flags:
  -h, --help   help for checkpoint

Use "gt checkpoint [command] --help" for more information about a command.

```

## `gt costs`

Show costs for running Claude sessions [DISABLED]

```
Display costs for Claude Code sessions in Gas Town.

⚠️  COST TRACKING IS CURRENTLY DISABLED

Claude Code displays costs in the TUI status bar, which cannot be captured
via tmux. All sessions will show $0.00 until Claude Code exposes cost data
through an API or environment variable.

What we need from Claude Code:
  - Stop hook env var (e.g., $CLAUDE_SESSION_COST)
  - Or queryable file/API endpoint

See: GH#24, gt-7awfj

The infrastructure remains in place and will work once cost data is available.

Examples:
  gt costs              # Live costs from running sessions
  gt costs --today      # Today's costs from wisps (not yet digested)
  gt costs --week       # This week's costs from digest beads + today's wisps
  gt costs --by-role    # Breakdown by role (polecat, witness, etc.)
  gt costs --by-rig     # Breakdown by rig
  gt costs --json       # Output as JSON

Subcommands:
  gt costs record       # Record session cost as ephemeral wisp (Stop hook)
  gt costs digest       # Aggregate wisps into daily digest bead (Deacon patrol)

Usage:
  gt costs [flags]
  gt costs [command]

Available Commands:
  digest      Aggregate session cost wisps into a daily digest bead
  migrate     Migrate legacy session.ended beads to the new wisp architecture
  record      Record session cost as an ephemeral wisp (called by Stop hook)

Flags:
      --by-rig    Show breakdown by rig
      --by-role   Show breakdown by role
  -h, --help      help for costs
      --json      Output as JSON
      --today     Show today's total from session events
  -v, --verbose   Show debug output for failures
      --week      Show this week's total from session events

Use "gt costs [command] --help" for more information about a command.

```

## `gt dashboard`

Start the convoy tracking web dashboard

```
Start a web server that displays the convoy tracking dashboard.

The dashboard shows real-time convoy status with:
- Convoy list with status indicators
- Progress tracking for each convoy
- Last activity indicator (green/yellow/red)
- Auto-refresh every 30 seconds via htmx

Example:
  gt dashboard              # Start on default port 8080
  gt dashboard --port 3000  # Start on port 3000
  gt dashboard --open       # Start and open browser

Usage:
  gt dashboard [flags]

Flags:
  -h, --help       help for dashboard
      --open       Open browser automatically
      --port int   HTTP port to listen on (default 8080)

```

## `gt doctor`

Run health checks on the workspace

```
Run diagnostic checks on the Gas Town workspace.

Doctor checks for common configuration issues, missing files,
and other problems that could affect workspace operation.

Workspace checks:
  - town-config-exists       Check mayor/town.json exists
  - town-config-valid        Check mayor/town.json is valid
  - rigs-registry-exists     Check mayor/rigs.json exists (fixable)
  - rigs-registry-valid      Check registered rigs exist (fixable)
  - mayor-exists             Check mayor/ directory structure

Town root protection:
  - town-git                 Verify town root is under version control
  - town-root-branch         Verify town root is on main branch (fixable)
  - pre-checkout-hook        Verify pre-checkout hook prevents branch switches (fixable)

Infrastructure checks:
  - stale-binary             Check if gt binary is up to date with repo
  - daemon                   Check if daemon is running (fixable)
  - repo-fingerprint         Check database has valid repo fingerprint (fixable)
  - boot-health              Check Boot watchdog health (vet mode)

Cleanup checks (fixable):
  - orphan-sessions          Detect orphaned tmux sessions
  - orphan-processes         Detect orphaned Claude processes
  - wisp-gc                  Detect and clean abandoned wisps (>1h)

Clone divergence checks:
  - persistent-role-branches Detect crew/witness/refinery not on main
  - clone-divergence         Detect clones significantly behind origin/main

Crew workspace checks:
  - crew-state               Validate crew worker state.json files (fixable)
  - crew-worktrees           Detect stale cross-rig worktrees (fixable)

Rig checks (with --rig flag):
  - rig-is-git-repo          Verify rig is a valid git repository
  - git-exclude-configured   Check .git/info/exclude has Gas Town dirs (fixable)
  - witness-exists           Verify witness/ structure exists (fixable)
  - refinery-exists          Verify refinery/ structure exists (fixable)
  - mayor-clone-exists       Verify mayor/rig/ clone exists (fixable)
  - polecat-clones-valid     Verify polecat directories are valid clones
  - beads-config-valid       Verify beads configuration (fixable)

Routing checks (fixable):
  - routes-config            Check beads routing configuration
  - prefix-mismatch          Detect rigs.json vs routes.jsonl prefix mismatches (fixable)

Session hook checks:
  - session-hooks            Check settings.json use session-start.sh
  - claude-settings          Check Claude settings.json match templates (fixable)

Patrol checks:
  - patrol-molecules-exist   Verify patrol molecules exist
  - patrol-hooks-wired       Verify daemon triggers patrols
  - patrol-not-stuck         Detect stale wisps (>1h)
  - patrol-plugins-accessible Verify plugin directories
  - patrol-roles-have-prompts Verify role prompts exist

Use --fix to attempt automatic fixes for issues that support it.
Use --rig to check a specific rig instead of the entire workspace.

Usage:
  gt doctor [flags]

Flags:
      --fix                Attempt to automatically fix issues
  -h, --help               help for doctor
      --restart-sessions   Restart patrol sessions when fixing stale settings (use with --fix)
      --rig string         Check specific rig only
  -v, --verbose            Show detailed output

```

## `gt feed`

Show real-time activity feed from beads and gt events

```
Display a real-time feed of issue changes and agent activity.

By default, launches an interactive TUI dashboard with:
  - Agent tree (top): Shows all agents organized by role with latest activity
  - Convoy panel (middle): Shows in-progress and recently landed convoys
  - Event stream (bottom): Chronological feed you can scroll through
  - Vim-style navigation: j/k to scroll, tab to switch panels, 1/2/3 for panels, q to quit

The feed combines multiple event sources:
  - Beads activity: Issue creates, updates, completions (from bd activity)
  - GT events: Agent activity like patrol, sling, handoff (from .events.jsonl)
  - Convoy status: In-progress and recently-landed convoys (refreshes every 10s)

Use --plain for simple text output (wraps bd activity only).

Tmux Integration:
  Use --window to open the feed in a dedicated tmux window named 'feed'.
  This creates a persistent window you can cycle to with C-b n/p.

Event symbols:
  +  created/bonded    - New issue or molecule created
  →  in_progress       - Work started on an issue
  ✓  completed         - Issue closed or step completed
  ✗  failed            - Step or issue failed
  ⊘  deleted           - Issue removed
  🦉  patrol_started   - Witness began patrol cycle
  ⚡  polecat_nudged   - Worker was nudged
  🎯  sling            - Work was slung to worker
  🤝  handoff          - Session handed off

MQ (Merge Queue) event symbols:
  ⚙  merge_started   - Refinery began processing an MR
  ✓  merged          - MR successfully merged (green)
  ✗  merge_failed    - Merge failed (conflict, tests, etc.) (red)
  ⊘  merge_skipped   - MR skipped (already merged, etc.)

Examples:
  gt feed                       # Launch TUI dashboard
  gt feed --plain               # Plain text output (bd activity)
  gt feed --window              # Open in dedicated tmux window
  gt feed --since 1h            # Events from last hour
  gt feed --rig greenplace         # Use gastown rig's beads

Usage:
  gt feed [flags]

Flags:
  -f, --follow         Stream events in real-time (default when no other flags)
  -h, --help           help for feed
  -n, --limit int      Maximum number of events to show (default 100)
      --mol string     Filter by molecule/issue ID prefix
      --no-follow      Show events once and exit
      --plain          Use plain text output (bd activity) instead of TUI
      --rig string     Run from specific rig's beads directory
      --since string   Show events since duration (e.g., 5m, 1h, 30s)
      --type string    Filter by event type (create, update, delete, comment)
  -w, --window         Open in dedicated tmux window (creates 'feed' window)

```

## `gt help`

Help about any command

```
Help provides help for any command in the application.
Simply type gt help [path to command] for full details.

Usage:
  gt help [command] [flags]

Flags:
  -h, --help   help for help

```

## `gt info`

Show Gas Town information and what's new

```
Display information about the current Gas Town installation.

This command shows:
  - Version information
  - What's new in recent versions (with --whats-new flag)

Examples:
  gt info
  gt info --whats-new
  gt info --whats-new --json

Usage:
  gt info [flags]

Flags:
  -h, --help        help for info
      --json        Output in JSON format
      --whats-new   Show agent-relevant changes from recent versions

```

## `gt log`

View town activity log

```
View the centralized log of Gas Town agent lifecycle events.

Events logged include:
  spawn   - new agent created
  wake    - agent resumed
  nudge   - message injected into agent
  handoff - agent handed off to fresh session
  done    - agent finished work
  crash   - agent exited unexpectedly
  kill    - agent killed intentionally

Examples:
  gt log                     # Show last 20 events
  gt log -n 50               # Show last 50 events
  gt log --type spawn        # Show only spawn events
  gt log --agent greenplace/    # Show events for gastown rig
  gt log --since 1h          # Show events from last hour
  gt log -f                  # Follow log (like tail -f)

Usage:
  gt log [flags]
  gt log [command]

Available Commands:
  crash       Record a crash event (called by tmux pane-died hook)

Flags:
  -a, --agent string   Filter by agent prefix (e.g., gastown/, greenplace/crew/max)
  -f, --follow         Follow log output (like tail -f)
  -h, --help           help for log
      --since string   Show events since duration (e.g., 1h, 30m, 24h)
  -n, --tail int       Number of events to show (default 20)
  -t, --type string    Filter by event type (spawn,wake,nudge,handoff,done,crash,kill)

Use "gt log [command] --help" for more information about a command.

```

## `gt patrol`

Patrol digest management

```
Manage patrol cycle digests.

Patrol cycles (Deacon, Witness, Refinery) create ephemeral per-cycle digests
to avoid JSONL pollution. This command aggregates them into daily summaries.

Examples:
  gt patrol digest --yesterday  # Aggregate yesterday's patrol digests
  gt patrol digest --dry-run    # Preview what would be aggregated

Usage:
  gt patrol [command]

Available Commands:
  digest      Aggregate patrol cycle digests into a daily summary bead

Flags:
  -h, --help   help for patrol

Use "gt patrol [command] --help" for more information about a command.

```

## `gt prime`

Output role context for current directory

```
Detect the agent role from the current directory and output context.

Role detection:
  - Town root, mayor/, or <rig>/mayor/ → Mayor context
  - <rig>/witness/rig/ → Witness context
  - <rig>/refinery/rig/ → Refinery context
  - <rig>/polecats/<name>/ → Polecat context

This command is typically used in shell prompts or agent initialization.

HOOK MODE (--hook):
  When called as an LLM runtime hook, use --hook to enable session ID handling.
  This reads session metadata from stdin and persists it for the session.

  Claude Code integration (in .claude/settings.json):
    "SessionStart": [{"hooks": [{"type": "command", "command": "gt prime --hook"}]}]

  Claude Code sends JSON on stdin:
    {"session_id": "uuid", "transcript_path": "/path", "source": "startup|resume"}

  Other agents can set GT_SESSION_ID environment variable instead.

Usage:
  gt prime [flags]

Flags:
      --dry-run   Show what would be injected without side effects (no marker removal, no bd prime, no mail)
      --explain   Show why each section was included
  -h, --help      help for prime
      --hook      Hook mode: read session ID from stdin JSON (for LLM runtime hooks)
      --json      Output state as JSON (requires --state)
      --state     Show detected session state only (normal/post-handoff/crash/autonomous)

```

## `gt seance`

Talk to your predecessor sessions

```
Seance lets you literally talk to predecessor sessions.

"Where did you put the stuff you left for me?" - The #1 handoff question.

Instead of parsing logs, seance spawns a Claude subprocess that resumes
a predecessor session with full context. You can ask questions directly:
  - "Why did you make this decision?"
  - "Where were you stuck?"
  - "What did you try that didn't work?"

DISCOVERY:
  gt seance                     # List recent sessions from events
  gt seance --role crew         # Filter by role type
  gt seance --rig gastown       # Filter by rig
  gt seance --recent 10         # Last N sessions

THE SEANCE (talk to predecessor):
  gt seance --talk <session-id>              # Interactive conversation
  gt seance --talk <id> -p "Where is X?"     # One-shot question

The --talk flag spawns: claude --fork-session --resume <id>
This loads the predecessor's full context without modifying their session.

Sessions are discovered from:
  1. Events emitted by SessionStart hooks (~/gt/.events.jsonl)
  2. The [GAS TOWN] beacon makes sessions searchable in /resume

Usage:
  gt seance [flags]

Flags:
  -h, --help            help for seance
      --json            Output as JSON
  -p, --prompt string   One-shot prompt (with --talk)
  -n, --recent int      Number of recent sessions to show (default 20)
      --rig string      Filter by rig name
      --role string     Filter by role (crew, polecat, witness, etc.)
  -t, --talk string     Session ID to commune with

```

## `gt stale`

Check if the gt binary is stale

```
Check if the gt binary was built from an older commit than the current repo HEAD.

This command compares the commit hash embedded in the binary at build time
with the current HEAD of the gastown repository.

Examples:
  gt stale              # Human-readable output
  gt stale --json       # Machine-readable JSON output
  gt stale --quiet      # Exit code only (0=stale, 1=fresh)

Exit codes:
  0 - Binary is stale (needs rebuild)
  1 - Binary is fresh (up to date)
  2 - Error (could not determine staleness)

Usage:
  gt stale [flags]

Flags:
  -h, --help    help for stale
      --json    Output as JSON
  -q, --quiet   Exit code only (0=stale, 1=fresh)

```

## `gt status`

Show overall town status

```
Display the current status of the Gas Town workspace.

Shows town name, registered rigs, active polecats, and witness status.

Use --fast to skip mail lookups for faster execution.
Use --watch to continuously refresh status at regular intervals.

Usage:
  gt status [flags]

Aliases:
  status, stat

Flags:
      --fast           Skip mail lookups for faster execution
  -h, --help           help for status
  -n, --interval int   Refresh interval in seconds (default 2)
      --json           Output as JSON
  -v, --verbose        Show detailed multi-line output per agent
  -w, --watch          Watch mode: refresh status continuously

```

## `gt thanks`

Thank the human contributors to Gas Town

```
Display acknowledgments to all the humans who have contributed
to the Gas Town project. This command celebrates the collaborative
effort behind the multi-agent workspace manager.

Usage:
  gt thanks [flags]

Flags:
  -h, --help   help for thanks

```

## `gt version`

Print version information

```
Print version information

Usage:
  gt version [flags]

Flags:
  -h, --help   help for version

```

## `gt whoami`

Show current identity for mail commands

```
Show the identity that will be used for mail commands.

Identity is determined by:
1. GT_ROLE env var (if set) - indicates an agent session
2. No GT_ROLE - you are the overseer (human)

Use --identity flag with mail commands to override.

Examples:
  gt whoami                      # Show current identity
  gt mail inbox                  # Check inbox for current identity
  gt mail inbox --identity mayor/  # Check Mayor's inbox instead

Usage:
  gt whoami [flags]

Flags:
  -h, --help   help for whoami

```
