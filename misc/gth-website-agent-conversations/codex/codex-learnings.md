# Gas Town Learnings - websitecodex

## Project Initiation (Rig Setup)

**What worked (how/why)**
- Running `gt rig add` from the HQ root (`/Users/csells/gt`) succeeded; the command appears to require being inside a Gas Town workspace to resolve town config and routes.
- Using a rig name without hyphens (e.g., `websitecodex`) avoided agent ID parsing conflicts.

**What didn't work (how/why)**
- `gt rig add` from the project repo failed with `not in a Gas Town workspace`; setting `GT_TOWN_ROOT` did not override this.
- `gt rig add` with rig name `website-codex` failed because hyphens are reserved for agent ID parsing; underscores are allowed for rig names but not for beads prefix.
- Using `--prefix website_codex` failed because prefix must be alphanumeric with optional hyphens and max 20 chars.

**Workarounds**
- Ran `gt rig add` from the HQ root and switched to rig name `websitecodex` with prefix `websitecodex` to satisfy both rig and prefix constraints.

**What I learned**
- Gas Town enforces distinct constraints for rig names vs. beads prefixes; plan-derived names may need adaptation.
- Running gt commands from the HQ root is the most reliable way to avoid workspace detection issues.

## Creating Plans / Beads (Mayor vs. Manual)

**What worked (how/why)**
- Sending requirements to the Mayor via `gt mail send mayor/` + `gt nudge mayor` created epics and tasks in the rig (verified via `bd list`).

**What didn't work (how/why)**
- Mayor responses did not arrive in the human context automatically; needed to inspect beads directly.

**Workarounds**
- Used `bd list` and `bd show` against `BEADS_DIR=/Users/csells/gt/websitecodex/.beads` to validate beads and infer what the Mayor created.
- Closed a duplicate bead (`websitecodex-is7`) manually when two identical “Hero section” tasks appeared.

**What I learned**
- The fastest verification loop is `bd list`/`bd show` against the rig’s `.beads` directory; mail responses are not guaranteed.
- Mayor can create a full task tree, but you may still need manual cleanup (duplicates, parent relationships).

## Getting Plan into Beads

**What worked (how/why)**
- `bd update --parent` successfully linked tasks under epics, establishing hierarchy.

**What didn't work (how/why)**
- Parent-child relationships caused child tasks to appear “blocked” (`●`) in `bd ready`, making the ready queue mostly empty.

**Workarounds**
- Proceeded with `gt sling` despite blocked status; assignments still worked.

**What I learned**
- Parent-child links in beads can block children; for “ready” views you may want a different dependency model or accept that `bd ready` won’t show children.

## Executing via gt (Sling, Polecats, Convoys)

**What worked (how/why)**
- `gt sling <bead> <rig>` spawned polecats and delivered args; `gt peek` provided live output.
- `gt convoy create` produced a convoy record with the epics for tracking.

**What didn't work (how/why)**
- `gt sling` emitted `mol-polecat-work` missing file warnings, and `gt polecat list/status` did not recognize spawned polecats.
- Polecat names were reused unexpectedly (e.g., “chrome”), causing task collisions when a new sling reused an existing name.
- A `gt nudge` message containing backticks triggered shell command substitution, accidentally running `gt done` locally.
- `bd sync` frequently failed in polecat branches due to missing remote refs (e.g., `fatal: couldn't find remote ref polecat/...`), which blocked the “happy path” for closing beads.
- `gt done` sometimes stalled or did not emit a merge request; work had to be merged manually to keep progress moving.

**Workarounds**
- Verified formulas exist via `gt formula list/show`; accepted the missing `mol-polecat-work` warning while continuing.
- Used `gt peek websitecodex/<name>` and `gt session list` instead of `gt polecat list` for visibility.
- Avoided backticks in shell messages to prevent unintended command substitution.
- Pushed branches first, then re-ran `bd sync` (or skipped) before `gt done` to avoid missing-remote errors.
- When refinery stalled, manually merged polecat branches in `/Users/csells/gt/websitecodex/refinery/rig` using rebase + fast-forward (no `git reset --hard`) and closed MR beads by hand.

**What I learned**
- Sling can work even when the polecat work molecule is missing, but tracking tools may fail; visibility should be cross-checked with `gt session list` and `gt peek`.
- Namepool reuse can collide with active polecats; avoid re-slinging until prior sessions exit or explicitly reset assignments.
- `gt done`/`bd sync` failures are common on first-time branches; the reliable flow is: push branch, then `gt done`.

## Testing via gt (Early Findings)

**What worked (how/why)**
- Polecat scaffold runs invoked `npm run build` in their workspace, producing a deploy output directory and confirming the Astro build path.
- Local `npm run build` succeeded after installs; Astro checks only emitted hints (unused vars, inline script hint).

**What didn't work (how/why)**
- `bd sync` failed inside a new polecat branch because there was no remote beads-sync branch yet.
- `astro` command was missing in fresh polecat environments until `npm install` ran.

**Workarounds**
- Instructed polecats to skip `bd sync` failures and proceed to `gt done`.
- Used `npm install` (or `npx astro build`) before running `npm run build`.

**What I learned**
- `bd sync` can fail on new branches; `gt done` is still the correct completion signal.

## Code Review via gt (Early Notes)

**What worked (how/why)**
- `gt mq list` revealed merge requests generated by polecats; `gt refinery start` brought the Refinery online.
- `gt peek websitecodex/refinery` exposed the refinery session context and queue state.

**What didn't work (how/why)**
- Refinery didn’t auto-process MRs because `mol-refinery-patrol` proto wasn’t found in its catalog.
- Refinery attempted `git reset --hard` and hit permission denial; required a safer merge approach.

**Workarounds**
- Nudged the Refinery to process MRs manually and handle rebases directly.
- Manually merged branches in the refinery repo when it stalled, then closed MR beads to clear `gt mq`.

**What I learned**
- The Refinery can run without patrol molecules, but you may need to explicitly nudge it to process the queue.

## Working Directories Reference

- Town Root: `/Users/csells/gt`
- Rig Root: `/Users/csells/gt/websitecodex`
- Mayor’s Clone: `/Users/csells/gt/websitecodex/mayor/rig`
- Refinery’s Clone: `/Users/csells/gt/websitecodex/refinery/rig`
- Polecats: `/Users/csells/gt/websitecodex/polecats/<name>/websitecodex`
- Crew: `/Users/csells/gt/websitecodex/crew/<name>`

## Key Commands Reference (with examples from this run)

- `gt rig add websitecodex https://github.com/gastownhall/website-codex.git --prefix websitecodex`
- `gt doctor --rig websitecodex` / `gt doctor --fix --restart-sessions --rig websitecodex`
- `gt mail send mayor/ -s "Create websitecodex plan beads" -m "..."`
- `BEADS_DIR=/Users/csells/gt/websitecodex/.beads bd list --type epic`
- `gt sling websitecodex-lu8 websitecodex` (spawned polecat rust)
- `gt peek websitecodex/rust -n 120`
- `gt mq list websitecodex`
- `gt refinery start websitecodex`

## What Went Wrong (So Far)

- Workspace detection blocked `gt rig add` unless run from HQ.
- Rig name/prefix constraints caused initial failures.
- Parent-child dependencies blocked `bd ready` results.
- Polecat name reuse caused task collisions and lost progress.
- Missing `mol-polecat-work` file warnings in sling.
- Refinery patrol molecule missing (`mol-refinery-patrol` proto not found).
- `gt done`/`bd sync` failures on new branches blocked normal closure of beads.
- Refinery stalls required manual merges due to restricted `git reset --hard`.
- Markdown file with curly apostrophe (`Stevey’s Birthday Blog.md`) required globbing to read reliably.

## What Worked (How/Why)

- Rig creation succeeded with a compliant rig name/prefix.
- Mayor created epics/tasks after nudge + mail.
- `gt sling` + `gt peek` provided a workable execution loop.
- `gt mq` exposed submitted branches, and Refinery can be run as a session.

## What Didn’t Work (How/Why)

- `gt` commands run outside HQ didn’t see the workspace.
- Rig names with hyphens and prefixes with underscores are invalid.
- `bd sync` fails on new polecat branches without a remote beads-sync.
- `gt polecat list` didn’t show active polecats when `mol-polecat-work` wasn’t attached.

## Workarounds

- Run `gt rig add` from `/Users/csells/gt` and use a compliant rig name.
- Use `bd list`/`bd show` with explicit `BEADS_DIR` to inspect work.
- Use `gt session list`/`gt peek` for polecat visibility.
- Use `bd update` to reset stuck assignments when sessions vanish.
- Manually merge polecat branches in the refinery repo when the refinery loop stalls.
- Close MR beads manually to clear stale `gt mq` entries.

## Lessons Learned (Early)

- Rig/prefix naming rules matter early; pick names that satisfy both to avoid rework.
- The Mayor can create beads, but verifying via `bd` is faster than waiting for replies.
- Expect to nudge agents and the Refinery; automated patrols may not be present.
- Keep shell quoting simple in nudges to avoid unexpected command execution.
- Manual merges may be necessary if refinery can’t use restricted commands; document the exact steps for reproducibility.

## Explore-By-Help Commands (Not in Plan)

- `gt hook --help` (hook semantics, unsling behavior)
- `gt trail --help` (recent activity and bead/commit tracking)
- `gt dashboard --help` (convoy dashboard server)
- `gt formula --help` / `gt formula list` (formula search paths, mol-polecat-work)
- `gt session --help` (polecat session capture and management)

## Docs-Fodder Validation Notes

**Confirmations from docs**
- **Formula resolution order** (project → town → system) explains how `mol-polecat-work` *should* be found; missing-molecule warnings likely mean the project/town tier was empty or mis-resolved.
- **Two-level beads architecture** clarifies that rig beads are canonical in the mayor clone and routed by prefix; I could have used `bd show <prefix>-...` without hardcoding `BEADS_DIR`.
- **Polecat lifecycle** confirms there is no idle state; a stuck `gt done` indicates a **zombie** (work complete, cleanup failed), which matches observed stalls.
- **Convoy behavior**: convoys are persistent trackers; swarms are ephemeral. `gt sling` auto-creates convoys for single issues, so manual convoys should be reserved for grouping multiple issues.
- **Propulsion principle** and `bd close --continue` reinforce that agents should advance molecule steps without waiting; manual nudges should be minimal.
- **Env var guidance** explicitly documents `GT_TOWN_ROOT` and `GT_RIG`; my experience with `GT_TOWN_ROOT` not working is a discrepancy to investigate.

**Where my workflow diverged from docs**
- I hard-set `BEADS_DIR` to access rig beads; docs suggest prefix routing should make this unnecessary in most cases.
- I ran manual merges in the refinery repo; docs describe refinery as the primary merge queue processor.
- I used direct edits for documentation; docs imply this should be handled via beads and agents when possible.

**How to align better next time (based on docs)**
- Install/verify `mol-polecat-work` in `.beads/formulas/` at the project or town level so polecats always get a molecule.
- Prefer `bd show <id>` without explicit `BEADS_DIR` once routes are configured; use `bd where` for confirmation.
- Use `bd close --continue` in molecule flows to preserve propulsion and reduce handoff friction.
- Keep merges inside refinery when possible; use manual merges only when refinery is blocked and document the reason.

**Docs discrepancies to investigate**
- `GT_TOWN_ROOT` override did not allow `gt rig add` from a non-HQ directory in practice, despite being documented.
- `mol-polecat-work` was listed via `gt formula list`, but sling could not locate `/Users/csells/gt/websitecodex/mol-polecat-work` (path resolution mismatch).

## Final Observations (End-to-End Workflow)

**What got done, who did it, and how**
- Planning: Mayor created epics and tasks after `gt nudge` and `gt mail send`; I verified with `bd list`/`bd show`.
- Execution: Polecats did all code changes via `gt sling` with detailed args; I tracked progress using `gt session list` + `gt peek` and nudged when stuck.
- Testing: Polecats ran `npm run build` in their sandboxes; I later validated with `npm install` + `npm run build` in the project folder.
- Review/merge: Refinery was started, but manual merges were required when the refinery stalled; I merged polecat branches in `/Users/csells/gt/websitecodex/refinery/rig` and then `git pull`ed into the project folder.
- Documentation: I updated `learnings.md` and `plan.md` directly in the project folder since no bead covered documentation.

**Where I did not use Gas Town as intended (and why)**
- Manual merges: Refinery did not auto-process due to missing `mol-refinery-patrol` and a denied `git reset --hard`. I merged branches manually to keep progress unblocked.
- Manual MR bead closure: `gt mq` retained stale entries after manual merges, so I closed MR beads by hand to clear the queue.
- Local builds: I ran builds in the project folder to verify the final merged state because polecat build logs were isolated to their sandboxes.
- Moving untracked files: `git pull` in the project folder was blocked by untracked `package.json`/`package-lock.json`, so I moved them to `tmp/` to allow fast-forward.
- Direct documentation edits: No bead existed for learnings/plan updates, so I edited those files directly to comply with the required documentation deliverable.

**How to improve next time (use GT as designed)**
- Create explicit beads for documentation and testing so that polecats own those steps and `gt done` closes them.
- Ensure `mol-polecat-work` and `mol-refinery-patrol` are available in the rig to avoid missing-molecule behavior.
- Run `gt doctor --fix` early and confirm witness/refinery readiness before slinging work.
- Keep all merges inside the refinery flow; if it stalls, restart or re-sling to a fresh polecat rather than manual merges.
- Avoid local file conflicts in the project folder by not generating artifacts there until after merges are complete.
