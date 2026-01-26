---
title: "Configuration Commands"
description: "CLI reference for Gas Town configuration commands"
sidebar:
  order: 6
---

This page documents the **Configuration** commands for the `gt` CLI.

## `gt account`

Manage Claude Code accounts

```
Manage multiple Claude Code accounts for Gas Town.

This enables switching between accounts (e.g., personal vs work) with
easy account selection per spawn or globally.

Commands:
  gt account list              List registered accounts
  gt account add <handle>      Add a new account
  gt account default <handle>  Set the default account
  gt account status            Show current account info

Usage:
  gt account [flags]
  gt account [command]

Available Commands:
  add         Add a new account
  default     Set the default account
  list        List registered accounts
  status      Show current account info
  switch      Switch to a different account

Flags:
  -h, --help   help for account

Use "gt account [command] --help" for more information about a command.

```

## `gt completion`

Generate the autocompletion script for the specified shell

```
Generate the autocompletion script for gt for the specified shell.
See each sub-command's help for details on how to use the generated script.


Usage:
  gt completion [command]

Available Commands:
  bash        Generate the autocompletion script for bash
  fish        Generate the autocompletion script for fish
  powershell  Generate the autocompletion script for powershell
  zsh         Generate the autocompletion script for zsh

Flags:
  -h, --help   help for completion

Use "gt completion [command] --help" for more information about a command.

```

## `gt config`

Manage Gas Town configuration

```
Manage Gas Town configuration settings.

This command allows you to view and modify configuration settings
for your Gas Town workspace, including agent aliases and defaults.

Commands:
  gt config agent list              List all agents (built-in and custom)
  gt config agent get <name>         Show agent configuration
  gt config agent set <name> <cmd>   Set custom agent command
  gt config agent remove <name>      Remove custom agent
  gt config default-agent [name]     Get or set default agent

Usage:
  gt config [flags]
  gt config [command]

Available Commands:
  agent              Manage agent configuration
  agent-email-domain Get or set agent email domain
  default-agent      Get or set default agent

Flags:
  -h, --help   help for config

Use "gt config [command] --help" for more information about a command.

```

## `gt disable`

Disable Gas Town system-wide

```
Disable Gas Town for all agentic coding tools.

When disabled:
  - Shell hooks become no-ops
  - Claude Code SessionStart hooks skip 'gt prime'
  - Tools work 100% vanilla (no Gas Town behavior)

The workspace (~/gt) is preserved. Use 'gt enable' to re-enable.

Flags:
  --clean  Also remove shell integration from ~/.zshrc/~/.bashrc

Environment overrides still work:
  GASTOWN_ENABLED=1   - Enable for current session only

Usage:
  gt disable [flags]

Flags:
      --clean   Remove shell integration from RC files
  -h, --help    help for disable

```

## `gt enable`

Enable Gas Town system-wide

```
Enable Gas Town for all agentic coding tools.

When enabled:
  - Shell hooks set GT_TOWN_ROOT and GT_RIG environment variables
  - Claude Code SessionStart hooks run 'gt prime' for context
  - Git repos are auto-registered as rigs (configurable)

Use 'gt disable' to turn off. Use 'gt status --global' to check state.

Environment overrides:
  GASTOWN_DISABLED=1  - Disable for current session only
  GASTOWN_ENABLED=1   - Enable for current session only

Usage:
  gt enable [flags]

Flags:
  -h, --help   help for enable

```

## `gt hooks`

List all Claude Code hooks in the workspace

```
List all Claude Code hooks configured in the workspace.

Scans for .claude/settings.json files and displays hooks by type.

Hook types:
  SessionStart     - Runs when Claude session starts
  PreCompact       - Runs before context compaction
  UserPromptSubmit - Runs before user prompt is submitted
  PreToolUse       - Runs before tool execution
  PostToolUse      - Runs after tool execution
  Stop             - Runs when Claude session stops

Examples:
  gt hooks              # List all hooks in workspace
  gt hooks --verbose    # Show hook commands
  gt hooks --json       # Output as JSON

Usage:
  gt hooks [flags]
  gt hooks [command]

Available Commands:
  install     Install a hook from the registry
  list        List available hooks from the registry

Flags:
  -h, --help      help for hooks
      --json      Output as JSON
  -v, --verbose   Show hook commands

Use "gt hooks [command] --help" for more information about a command.

```

## `gt issue`

Manage current issue for status line display

```
Manage current issue for status line display

Usage:
  gt issue [command]

Available Commands:
  clear       Clear the current issue from status line
  set         Set the current issue (shown in tmux status line)
  show        Show the current issue

Flags:
  -h, --help   help for issue

Use "gt issue [command] --help" for more information about a command.

```

## `gt plugin`

Plugin management

```
Manage plugins that run during Deacon patrol cycles.

Plugins are periodic automation tasks defined by plugin.md files with TOML frontmatter.

PLUGIN LOCATIONS:
  ~/gt/plugins/           Town-level plugins (universal, apply everywhere)
  <rig>/plugins/          Rig-level plugins (project-specific)

GATE TYPES:
  cooldown    Run if enough time has passed (e.g., 1h)
  cron        Run on a schedule (e.g., "0 9 * * *")
  condition   Run if a check command returns exit 0
  event       Run on events (e.g., startup)
  manual      Never auto-run, trigger explicitly

Examples:
  gt plugin list                    # List all discovered plugins
  gt plugin show <name>             # Show plugin details
  gt plugin list --json             # JSON output

Usage:
  gt plugin [flags]
  gt plugin [command]

Available Commands:
  history     Show plugin execution history
  list        List all discovered plugins
  run         Manually trigger plugin execution
  show        Show plugin details

Flags:
  -h, --help   help for plugin

Use "gt plugin [command] --help" for more information about a command.

```

## `gt shell`

Manage shell integration

```
Manage shell integration

Usage:
  gt shell [flags]
  gt shell [command]

Available Commands:
  install     Install or update shell integration
  remove      Remove shell integration
  status      Show shell integration status

Flags:
  -h, --help   help for shell

Use "gt shell [command] --help" for more information about a command.

```

## `gt theme`

View or set tmux theme for the current rig

```
Manage tmux status bar themes for Gas Town sessions.

Without arguments, shows the current theme assignment.
With a name argument, sets the theme for this rig.

Examples:
  gt theme              # Show current theme
  gt theme --list       # List available themes
  gt theme forest       # Set theme to 'forest'
  gt theme apply        # Apply theme to all running sessions in this rig

Usage:
  gt theme [name] [flags]
  gt theme [command]

Available Commands:
  apply       Apply theme to running sessions

Flags:
  -h, --help   help for theme
  -l, --list   List available themes

Use "gt theme [command] --help" for more information about a command.

```

## `gt uninstall`

Remove Gas Town from the system

```
Completely remove Gas Town from the system.

By default, removes:
  - Shell integration (~/.zshrc or ~/.bashrc)
  - Wrapper scripts (~/bin/gt-codex, ~/bin/gt-opencode)
  - State directory (~/.local/state/gastown/)
  - Config directory (~/.config/gastown/)
  - Cache directory (~/.cache/gastown/)

The workspace (e.g., ~/gt) is NOT removed unless --workspace is specified.

Use --force to skip confirmation prompts.

Examples:
  gt uninstall                    # Remove Gas Town, keep workspace
  gt uninstall --workspace        # Also remove workspace directory
  gt uninstall --force            # Skip confirmation

Usage:
  gt uninstall [flags]

Flags:
  -f, --force       Skip confirmation prompts
  -h, --help        help for uninstall
      --workspace   Also remove the workspace directory (DESTRUCTIVE)

```
