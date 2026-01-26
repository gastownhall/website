---
title: "Additional Commands"
description: "CLI reference for Gas Town additional commands"
sidebar:
  order: 8
---

This page documents the **Additional Commands** commands for the `gt` CLI.

## `gt cycle`

Cycle between sessions in the same group

```
Cycle between related tmux sessions based on the current session type.

Session groups:
- Town sessions: Mayor ↔ Deacon
- Crew sessions: All crew members in the same rig (e.g., greenplace/crew/max ↔ greenplace/crew/joe)
- Rig infra sessions: Witness ↔ Refinery (per rig)
- Polecat sessions: All polecats in the same rig (e.g., greenplace/Toast ↔ greenplace/Nux)

The appropriate cycling is detected automatically from the session name.

Usage:
  gt cycle [command]

Available Commands:
  next        Switch to next session in group
  prev        Switch to previous session in group

Flags:
  -h, --help   help for cycle

Use "gt cycle [command] --help" for more information about a command.

```

## `gt tap`

Claude Code hook handlers

```
Hook handlers for Claude Code PreToolUse and PostToolUse events.

These commands are called by Claude Code hooks to implement policies,
auditing, and input transformation. They tap into the tool execution
flow to guard, audit, inject, or check.

Subcommands:
  guard   - Block forbidden operations (PreToolUse, exit 2)
  audit   - Log/record tool executions (PostToolUse) [planned]
  inject  - Modify tool inputs (PreToolUse, updatedInput) [planned]
  check   - Validate after execution (PostToolUse) [planned]

Hook configuration in .claude/settings.json:
  {
    "PreToolUse": [{
      "matcher": "Bash(gh pr create*)",
      "hooks": [{"command": "gt tap guard pr-workflow"}]
    }]
  }

See ~/gt/docs/HOOKS.md for full documentation.

Usage:
  gt tap [command]

Available Commands:
  guard       Block forbidden operations (PreToolUse hook)

Flags:
  -h, --help   help for tap

Use "gt tap [command] --help" for more information about a command.

```

## `gt town`

Town-level operations

```
Commands for town-level operations including session cycling.

Usage:
  gt town [command]

Available Commands:
  next        Switch to next town session (mayor/deacon)
  prev        Switch to previous town session (mayor/deacon)

Flags:
  -h, --help   help for town

Use "gt town [command] --help" for more information about a command.

```
