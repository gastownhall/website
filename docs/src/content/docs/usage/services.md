---
title: "Services Commands"
description: "CLI reference for Gas Town services commands"
sidebar:
  order: 4
---

This page documents the **Services** commands for the `gt` CLI.

## `gt daemon`

Manage the Gas Town daemon

```
Manage the Gas Town background daemon.

The daemon is a simple Go process that:
- Pokes agents periodically (heartbeat)
- Processes lifecycle requests (cycle, restart, shutdown)
- Restarts sessions when agents request cycling

The daemon is a "dumb scheduler" - all intelligence is in agents.

Usage:
  gt daemon [flags]
  gt daemon [command]

Available Commands:
  logs        View daemon logs
  start       Start the daemon
  status      Show daemon status
  stop        Stop the daemon

Flags:
  -h, --help   help for daemon

Use "gt daemon [command] --help" for more information about a command.

```

## `gt down`

Stop all Gas Town services

```
Stop Gas Town services (reversible pause).

Shutdown levels (progressively more aggressive):
  gt down                    Stop infrastructure (default)
  gt down --polecats         Also stop all polecat sessions
  gt down --all              Also stop bd daemons/activity
  gt down --nuke             Also kill the tmux server (DESTRUCTIVE)

Infrastructure agents stopped:
  • Refineries - Per-rig work processors
  • Witnesses  - Per-rig polecat managers
  • Mayor      - Global work coordinator
  • Boot       - Deacon's watchdog
  • Deacon     - Health orchestrator
  • Daemon     - Go background process

This is a "pause" operation - use 'gt start' to bring everything back up.
For permanent cleanup (removing worktrees), use 'gt shutdown' instead.

Use cases:
  • Taking a break (stop token consumption)
  • Clean shutdown before system maintenance
  • Resetting the town to a clean state

Usage:
  gt down [flags]

Flags:
  -a, --all        Stop bd daemons/activity and verify shutdown
      --dry-run    Preview what would be stopped without taking action
  -f, --force      Force kill without graceful shutdown
  -h, --help       help for down
      --nuke       Kill entire tmux server (DESTRUCTIVE - kills non-GT sessions!)
  -p, --polecats   Also stop all polecat sessions
  -q, --quiet      Only show errors

```

## `gt shutdown`

Shutdown Gas Town with cleanup

```
Shutdown Gas Town by stopping agents and cleaning up polecats.

This is the "done for the day" command - it stops everything AND removes
polecat worktrees/branches. For a reversible pause, use 'gt down' instead.

Comparison:
  gt down      - Pause (stop processes, keep worktrees) - reversible
  gt shutdown  - Done (stop + cleanup worktrees) - permanent cleanup

After killing sessions, polecats are cleaned up:
  - Worktrees are removed
  - Polecat branches are deleted
  - Polecats with uncommitted work are SKIPPED (protected)

Shutdown levels (progressively more aggressive):
  (default)       - Stop infrastructure + polecats + cleanup
  --all           - Also stop crew sessions
  --polecats-only - Only stop polecats (leaves infrastructure running)

Use --force or --yes to skip confirmation prompt.
Use --graceful to allow agents time to save state before killing.
Use --nuclear to force cleanup even if polecats have uncommitted work (DANGER).
Use --cleanup-orphans to kill orphaned Claude processes (TTY-less, older than 60s).
Use --cleanup-orphans-grace-secs to set the grace period (default 60s).

Usage:
  gt shutdown [flags]

Flags:
  -a, --all                              Also stop crew sessions (by default, crew is preserved)
      --cleanup-orphans                  Clean up orphaned Claude processes (TTY-less processes older than 60s)
      --cleanup-orphans-grace-secs int   Grace period in seconds between SIGTERM and SIGKILL when cleaning orphans (default 60) (default 60)
  -f, --force                            Skip confirmation prompt (alias for --yes)
  -g, --graceful                         Send ESC to agents and wait for them to handoff before killing
  -h, --help                             help for shutdown
      --nuclear                          Force cleanup even if polecats have uncommitted work (DANGER: may lose work)
      --polecats-only                    Only stop polecats (minimal shutdown)
  -w, --wait int                         Seconds to wait for graceful shutdown (default 30) (default 30)
  -y, --yes                              Skip confirmation prompt

```

## `gt start`

Start Gas Town or a crew workspace

```
Start Gas Town by launching the Deacon and Mayor.

The Deacon is the health-check orchestrator that monitors Mayor and Witnesses.
The Mayor is the global coordinator that dispatches work.

By default, other agents (Witnesses, Refineries) are started lazily as needed.
Use --all to start Witnesses and Refineries for all registered rigs immediately.

Crew shortcut:
  If a path like "rig/crew/name" is provided, starts that crew workspace.
  This is equivalent to 'gt start crew rig/name'.

To stop Gas Town, use 'gt shutdown'.

Usage:
  gt start [path] [flags]
  gt start [command]

Available Commands:
  crew        Start a crew workspace (creates if needed)

Flags:
      --agent string   Agent alias to run Mayor/Deacon with (overrides town default)
  -a, --all            Also start Witnesses and Refineries for all rigs
  -h, --help           help for start

Use "gt start [command] --help" for more information about a command.

```

## `gt up`

Bring up all Gas Town services

```
Start all Gas Town long-lived services.

This is the idempotent "boot" command for Gas Town. It ensures all
infrastructure agents are running:

  • Daemon     - Go background process that pokes agents
  • Deacon     - Health orchestrator (monitors Mayor/Witnesses)
  • Mayor      - Global work coordinator
  • Witnesses  - Per-rig polecat managers
  • Refineries - Per-rig merge queue processors

Polecats are NOT started by this command - they are transient workers
spawned on demand by the Mayor or Witnesses.

Use --restore to also start:
  • Crew       - Per rig settings (settings/config.json crew.startup)
  • Polecats   - Those with pinned beads (work attached)

Running 'gt up' multiple times is safe - it only starts services that
aren't already running.

Usage:
  gt up [flags]

Flags:
  -h, --help      help for up
  -q, --quiet     Only show errors
      --restore   Also restore crew (from settings) and polecats (from hooks)

```
