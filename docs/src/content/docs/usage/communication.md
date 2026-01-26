---
title: "Communication Commands"
description: "CLI reference for Gas Town communication commands"
sidebar:
  order: 3
---

This page documents the **Communication** commands for the `gt` CLI.

## `gt broadcast`

Send a nudge message to all workers

```
Broadcasts a message to all active workers (polecats and crew).

By default, only workers (polecats and crew) receive the message.
Use --all to include infrastructure agents (mayor, deacon, witness, refinery).

The message is sent as a nudge to each worker's Claude Code session.

Examples:
  gt broadcast "Check your mail"
  gt broadcast --rig greenplace "New priority work available"
  gt broadcast --all "System maintenance in 5 minutes"
  gt broadcast --dry-run "Test message"

Usage:
  gt broadcast <message> [flags]

Flags:
      --all          Include all agents (mayor, witness, etc.), not just workers
      --dry-run      Show what would be sent without sending
  -h, --help         help for broadcast
      --rig string   Only broadcast to workers in this rig

```

## `gt dnd`

Toggle Do Not Disturb mode for notifications

```
Control notification level for the current agent.

Do Not Disturb (DND) mode mutes non-critical notifications,
allowing you to focus on work without interruption.

Subcommands:
  on      Enable DND mode (mute notifications)
  off     Disable DND mode (resume normal notifications)
  status  Show current notification level

Without arguments, toggles DND mode.

Related: gt notify - for fine-grained notification level control

Usage:
  gt dnd [on|off|status] [flags]

Flags:
  -h, --help   help for dnd

```

## `gt escalate`

Escalation system for critical issues

```
Create and manage escalations for critical issues.

The escalation system provides severity-based routing for issues that need
human or mayor attention. Escalations are tracked as beads with gt:escalation label.

SEVERITY LEVELS:
  critical  (P0) Immediate attention required
  high      (P1) Urgent, needs attention soon
  medium    (P2) Standard escalation (default)
  low       (P3) Informational, can wait

WORKFLOW:
  1. Agent encounters blocking issue
  2. Runs: gt escalate "Description" --severity high --reason "details"
  3. Escalation is routed based on settings/escalation.json
  4. Recipient acknowledges with: gt escalate ack <id>
  5. After resolution: gt escalate close <id> --reason "fixed"

CONFIGURATION:
  Routing is configured in ~/gt/settings/escalation.json:
  - routes: Map severity to action lists (bead, mail:mayor, email:human, sms:human)
  - contacts: Human email/SMS for external notifications
  - stale_threshold: When unacked escalations are re-escalated (default: 4h)
  - max_reescalations: How many times to bump severity (default: 2)

Examples:
  gt escalate "Build failing" --severity critical --reason "CI blocked"
  gt escalate "Need API credentials" --severity high --source "plugin:rebuild-gt"
  gt escalate "Code review requested" --reason "PR #123 ready"
  gt escalate list                          # Show open escalations
  gt escalate ack hq-abc123                 # Acknowledge
  gt escalate close hq-abc123 --reason "Fixed in commit abc"
  gt escalate stale                         # Re-escalate stale escalations

Usage:
  gt escalate [description] [flags]
  gt escalate [command]

Available Commands:
  ack         Acknowledge an escalation
  close       Close a resolved escalation
  list        List open escalations
  show        Show details of an escalation
  stale       Re-escalate stale unacknowledged escalations

Flags:
  -n, --dry-run           Show what would be done without executing
  -h, --help              help for escalate
      --json              Output as JSON
  -r, --reason string     Detailed reason for escalation
      --related string    Related bead ID (task, bug, etc.)
  -s, --severity string   Severity level: critical, high, medium, low (default "medium")
      --source string     Source identifier (e.g., plugin:rebuild-gt, patrol:deacon)

Use "gt escalate [command] --help" for more information about a command.

```

## `gt mail`

Agent messaging system

```
Send and receive messages between agents.

The mail system allows Mayor, polecats, and the Refinery to communicate.
Messages are stored in beads as issues with type=message.

MAIL ROUTING:
  ┌─────────────────────────────────────────────────────┐
  │                    Town (.beads/)                   │
  │  ┌─────────────────────────────────────────────┐   │
  │  │                 Mayor Inbox                 │   │
  │  │  └── mayor/                                 │   │
  │  └─────────────────────────────────────────────┘   │
  │                                                     │
  │  ┌─────────────────────────────────────────────┐   │
  │  │           gastown/ (rig mailboxes)          │   │
  │  │  ├── witness      ← greenplace/witness         │   │
  │  │  ├── refinery     ← greenplace/refinery        │   │
  │  │  ├── Toast        ← greenplace/Toast           │   │
  │  │  └── crew/max     ← greenplace/crew/max        │   │
  │  └─────────────────────────────────────────────┘   │
  └─────────────────────────────────────────────────────┘

ADDRESS FORMATS:
  mayor/              → Mayor inbox
  <rig>/witness       → Rig's Witness
  <rig>/refinery      → Rig's Refinery
  <rig>/<polecat>     → Polecat (e.g., greenplace/Toast)
  <rig>/crew/<name>   → Crew worker (e.g., greenplace/crew/max)
  --human             → Special: human overseer

COMMANDS:
  inbox     View your inbox
  send      Send a message
  read      Read a specific message
  mark      Mark messages read/unread

Usage:
  gt mail [flags]
  gt mail [command]

Available Commands:
  announces   List or read announce channels
  archive     Archive messages
  channel     Manage and view beads-native channels
  check       Check for new mail (for hooks)
  claim       Claim a message from a queue
  clear       Clear all messages from an inbox
  delete      Delete messages
  group       Manage mail groups
  hook        Attach mail to your hook (alias for 'gt hook attach')
  inbox       Check inbox
  mark-read   Mark messages as read without archiving
  mark-unread Mark messages as unread
  peek        Show preview of first unread message
  queue       Manage mail queues
  read        Read a message
  release     Release a claimed queue message
  reply       Reply to a message
  search      Search messages by content
  send        Send a message
  thread      View a message thread

Flags:
  -h, --help   help for mail

Use "gt mail [command] --help" for more information about a command.

```

## `gt notify`

Set notification level

```
Control the notification level for the current agent.

Notification levels:
  verbose  All notifications (mail, convoy events, status updates)
  normal   Important notifications only (default)
  muted    Silent/DND mode - batch notifications for later

Without arguments, shows the current notification level.

Examples:
  gt notify           # Show current level
  gt notify verbose   # Enable all notifications
  gt notify normal    # Default notification level
  gt notify muted     # Enable DND mode

Related: gt dnd - quick toggle for DND mode

Usage:
  gt notify [verbose|normal|muted] [flags]

Flags:
  -h, --help   help for notify

```

## `gt nudge`

Send a synchronous message to any Gas Town worker

```
Universal synchronous messaging API for Gas Town worker-to-worker communication.

Delivers a message directly to any worker's Claude Code session: polecats, crew,
witness, refinery, mayor, or deacon. Use this for real-time coordination when
you need immediate attention from another worker.

Uses a reliable delivery pattern:
1. Sends text in literal mode (-l flag)
2. Waits 500ms for paste to complete
3. Sends Enter as a separate command

This is the ONLY way to send messages to Claude sessions.
Do not use raw tmux send-keys elsewhere.

Role shortcuts (expand to session names):
  mayor     Maps to gt-mayor
  deacon    Maps to gt-deacon
  witness   Maps to gt-<rig>-witness (uses current rig)
  refinery  Maps to gt-<rig>-refinery (uses current rig)

Channel syntax:
  channel:<name>  Nudges all members of a named channel defined in
                  ~/gt/config/messaging.json under "nudge_channels".
                  Patterns like "gastown/polecats/*" are expanded.

DND (Do Not Disturb):
  If the target has DND enabled (gt dnd on), the nudge is skipped.
  Use --force to override DND and send anyway.

Examples:
  gt nudge greenplace/furiosa "Check your mail and start working"
  gt nudge greenplace/alpha -m "What's your status?"
  gt nudge mayor "Status update requested"
  gt nudge witness "Check polecat health"
  gt nudge deacon session-started
  gt nudge channel:workers "New priority work available"

Usage:
  gt nudge <target> [message] [flags]

Flags:
  -f, --force            Send even if target has DND enabled
  -h, --help             help for nudge
  -m, --message string   Message to send

```

## `gt peek`

View recent output from a polecat or crew session

```
Capture and display recent terminal output from an agent session.

This is the ergonomic alias for 'gt session capture'. Use it to check
what an agent is currently doing or has recently output.

The nudge/peek pair provides the canonical interface for agent sessions:
  gt nudge - send messages TO a session (reliable delivery)
  gt peek  - read output FROM a session (capture-pane wrapper)

Supports both polecats and crew workers:
  - Polecats: rig/name format (e.g., greenplace/furiosa)
  - Crew: rig/crew/name format (e.g., beads/crew/dave)

Examples:
  gt peek greenplace/furiosa         # Polecat: last 100 lines (default)
  gt peek greenplace/furiosa 50      # Polecat: last 50 lines
  gt peek beads/crew/dave            # Crew: last 100 lines
  gt peek beads/crew/dave -n 200     # Crew: last 200 lines

Usage:
  gt peek <rig/polecat> [count] [flags]

Flags:
  -h, --help        help for peek
  -n, --lines int   Number of lines to capture (default 100)

```
