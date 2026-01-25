# Learnings from using Gas Town

## Project Initiation

### What worked
- Initialized `learnings.md` early to capture thoughts.

### What didn't work
- **Rig Naming**: Tried to use `website-gemini` but `gt` failed.
  - *Error*: `rig name "website-gemini" contains invalid characters; hyphens, dots, and spaces are reserved for agent ID parsing.`
  - *Fix*: Changed rig name to `website_gemini` (underscores are allowed).
  - *Why*: Gas Town uses hyphens as delimiters in agent IDs (e.g., `rig-agent`).
- **Bead Prefix**: Tried to use `website_gemini` as prefix but `gt` failed.
  - *Error*: `invalid beads prefix "website_gemini": must be alphanumeric with optional hyphens...`
  - *Fix*: Used `website-gemini` (hyphens allowed in prefix).
  - *Lesson*: Rig names use `_`, Prefix uses `-`.
- **Slinging Beads**: Created beads with `bd create`, but `gt sling <bead-id>` failed.
  - *Error*: `'website-gemini-c1z.1' is not a valid bead or formula`.
  - *Investigation*: `gt show` could see the beads, but `gt sling` could not resolve them. `gt ready` showed "No ready work".
  - *Hypothesis*: `gt` requires beads to be in a specific state or index that wasn't updated.
  - *Workaround*: Used `gt sling shiny --args "..."` to dispatch work using the "shiny" formula directly, bypassing the bead lookup issue.
- **Context Matters**: `gt sling` and `gt formula list` failed when running from the rig directory (`~/gt/website_gemini`).
  - *Fix*: Ran commands from the HQ directory (`~/gt`).
  - *Lesson*: Dispatch operations seem to work best from the town square (HQ).
- **Empty Hooks**: Even with `shiny`, `gt sling` sometimes failed to attach the wisp to the agent's hook (likely due to ID resolution issues).
  - *Symptom*: Agent runs `gt hook`, sees nothing, and gets confused or escalates, despite `--args` being passed.
  - *Fix*: Used `gt nudge <agent> "<instructions>"` to manually provide the task to the running agent.
  - *Why*: The agent listens for nudges. If the hook mechanism fails, the direct message channel (nudge) is a reliable fallback.
- **Agent Autonomy**: Agents inspect the environment. If a prerequisite (like `src/` folder) is missing, they may pivot to build it themselves, even if assigned a dependent task (like "Docs Shredder").
  - *Observation*: Three agents (`rust`, `chrome`, `nitro`) all decided to build the Astro Scaffold because they couldn't find it.
  - *Lesson*: For dependent tasks, ensure the foundation is **merged and available** in `main` before dispatching dependent work. Use `gt mq list` to verify merges.
- **Refinery Latency**: The Refinery loop can take time. `gt mq list` showed items, but the Refinery didn't process them immediately.
  - *Fix*: Patience. Or `gt nudge <refinery> "Process queue"`.
- **Manual MR Creation**: If `gt done` fails to resolve the source issue (common with `shiny` ephemeral wisps), manual Merge Request beads can be created using `bd create --type merge-request` with a specific description format (`branch: ..., target: ..., source_issue: ..., rig: ...`).
- **Stranded Convoys**: `gt convoy stranded` helps identify work that has no active workers. Cross-project convoys can appear in the town-level list, so filtering by rig or prefix is important.
- **Agent Pivot**: When an agent sees a missing prerequisite (like `src/` folder), it will often build it rather than failing, which can lead to duplicate effort if multiple agents are dispatched simultaneously.
- **Final Orchestration**: In complex scenarios where `gt done` or wisp resolution fails, manual management of the Merge Queue via `bd create --type merge-request` and direct `gt nudge` to the Refinery is a highly effective way to drive the project to completion.
- **Polecats vs. Crew**: I targeted the rig (`website_gemini`) directly during `gt sling`, which spawns ephemeral **polecats**. I skipped creating a **crew member**.
  - *Result*: I achieved high parallelism (3 agents at once), but lost "centralized awareness."
  - *Improvement*: In future, I should start a **Crew session** first to act as a "Lead Engineer." This persistent agent can then `gt sling` work to polecats from within the rig, providing better coordination and preventing duplicate work (like three agents all trying to scaffold the same project).

### Architecture Insights: Mayor vs. Crew
Based on the Gas Town documentation, the intended workflow separates concerns significantly:
- **Mayor (Project Manager)**: Operates at the town level. Great for cross-rig coordination and tracking high-level status, but lacks visibility into the minute-by-minute state of a specific repo (e.g., "is `src/` empty?").
- **Crew (Lead Engineer)**: A persistent agent ("Design Team") that lives *inside* the rig. It has the context to:
    1.  Inspect the codebase state.
    2.  Design the architecture and break it down into Beads ("guzzoline").
    3.  Act as "Traffic Control," serializing dependent tasks (e.g., "Wait for scaffold merge before dispatching docs").
- **Polecats (Junior Devs/Swarm)**: Ephemeral workers that execute specific tickets. They thrive on well-defined specs and should not be making architectural decisions (like "the repo is empty, I'll init a project").

**Key Takeaway**: Skipping the Crew layer and slinging directly from Mayor to Polecats is an anti-pattern for greenfield projects. It forces Polecats to make decisions they lack the context for, leading to conflicts. **Always start with a Crew member to set the foundation.**

## Final Workflow Observations

### End-to-End Workflow Summary

1.  **Planning**: Bypassed interactive Mayor sessions. Used `bd create` via a shell script for deterministic, batch creation of Epics and Tasks.
2.  **Dispatch**:
    -   Standard `gt sling <bead>` failed (likely local DB/context issues).
    -   **Workaround**: Used `gt sling shiny --args "..."` to spawn agents with ad-hoc instructions matching the bead requirements.
    -   **Consequence**: The strong link between the Agent and the Bead was severed. Agents often started with "Empty Hooks" because the wisp didn't attach correctly.
3.  **Execution (The "Chimps")**:
    -   **Nudging**: Required `gt nudge` to manually paste instructions to agents who had empty hooks.
    -   **Autonomy**: Once nudged, agents (`rust`, `chrome`, `nitro`) were highly autonomous. They wrote all code, created scripts (`shred-docs.js`, `generate-llms-txt.js`), and managed git operations (`git add`, `commit`, `push`) flawlessly.
    -   **Conflict**: Multiple agents attempted to build the same foundation (Astro scaffold) simultaneously because they couldn't see each other's work until it merged.
4.  **Completion & Merging**:
    -   `gt done` failed to auto-create Merge Requests because the source bead wasn't attached.
    -   **Manual Intervention**: Manually created Merge Request beads (`bd create --type merge-request ...`) to place items in the Refinery's queue.
    -   **Refinery**: The Refinery agent worked correctly but required nudging (`gt nudge`) to process the queue promptly.
5.  **Review**: Skipped formal "Crew" code review. Relied on agent self-testing (`npm run build`) and the Refinery's merge process.

### Conclusion
The Gas Town primitives (`gt`, `bd`, Polecats, Refinery) provide a powerful, decentralized workflow. However, when the "happy path" (`gt sling <bead>`) breaks, the operator must understand the underlying mechanics (Merge Queue, Bead types, Nudging) to manually orchestrate the swarm. The agents themselves are capable implementers, but the coordination layer requires active supervision.