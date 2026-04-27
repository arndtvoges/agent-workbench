---
name: "orchestrate-implementation"
description: "Orchestrate an Agent Team of senior engineers to implement tasks from engineering spec. Coordinates parallel implementation with team communication, blocker handling, and QA verification loops."
---

# Orchestrate Implementation via Agent Team

Your goal is to take the engineering implementation specification and orchestrate an **Agent Team** of senior engineers to implement all tasks while maintaining consistency and architectural integrity. You are the **team lead**.

---

## CRITICAL: You Are the Team Lead

When you create an Agent Team, you become the team lead. You MUST remain active throughout the entire team lifecycle.

**DO NOT:**
- End your turn while any task is still `in_progress` or `pending`
- Consider yourself "done" until all tasks are `completed` and the team is shut down and cleaned up
- Treat teammate idle notifications as problems -- idle is the normal state between turns
- Implement tickets yourself -- you are the coordinator, not an implementor

**DO:**
- Monitor progress via the task list and auto-delivered teammate messages
- Assign work to teammates when they need direction
- Handle blocker escalations from teammates promptly
- Forward interface change notifications to affected engineers
- Shut down teammates and clean up the team when all work is complete

Messages from teammates are delivered automatically -- you do NOT need to poll or check an inbox. When a teammate sends you a message, it arrives as a new conversation turn.

---

## Inputs & results

Before execution:
- Feature folder path provided (e.g., `purple/documentation/251114-analytics-dashboard`)
- Engineering spec located at: `purple/documentation/{feature-folder}/agent-written-specifications/implementation-spec-{feature-slug}.md`

During/after execution of this command:
- Completed ticket documentation written to: `purple/documentation/{feature-folder}/completed-tickets-documentation/`
- QA results written to: `purple/documentation/{feature-folder}/qa-results/`

---

## DO FIRST: Validation Steps

1. **Validate Input**: Ensure feature folder path is provided. If not, complain and abort.

2. **Read Documentation Standards**: Read `@purple/standards/global/how-agents-document.md`. If missing, complain and abort.

3. **Locate Implementation Spec**: Verify file exists:
   - `purple/documentation/{feature-folder}/agent-written-specifications/implementation-spec-{feature-slug}.md`
   - If missing, instruct user to run `/engineer-tasks-from-spec` first and abort.

4. **Analyze Implementation Spec**: Parse to identify:
   - All phases and their tickets
   - Dependencies between tickets
   - Files created/modified per ticket
   - Potential conflicts and cohesion requirements

5. **Verify Ticket ID Parity** (before announcing or dispatching): Scan the
   spec markdown's `**Ticket ID:**` lines and confirm:
   - All ids use the format `<FEATURE-PREFIX>-<PHASE>.<NUM>` (uppercase,
     single dot before NUM, no leading zeros — e.g. `MCP-1.1`, `BLOG-3.2`).
   - All ids are unique within the spec.
   - The set matches what the engineering-architect would have used in its
     `purple_status` announcements (the architect is on the same contract).

   If you find drift (mixed formats, lowercase, non-prescribed separators,
   duplicates), STOP and surface to the user. Do NOT silently proceed —
   every downstream `purple_status` call will create orphan rows.

6. **Call Purple MCP**: Announce the implementation phase and ticket metadata using the unified `purple_status` tool. This is REQUIRED when the tool is available. The schema is ONE ticket per call — do not batch tickets or send aggregate counts.

   **First, set the feature folder and overall progress context:**
   ```json
   {
     "featureFolder": "purple/documentation/{feature-folder}",
     "phase": "3 - Implementation",
     "agent": "orchestrator",
     "totalTickets": <total count>
   }
   ```

   **Then announce each ticket with full metadata** (one call per ticket — the engineering-architect may have already announced them, in which case you only need to ensure any tickets missing from the initial announcement are announced here):
   ```json
   {
     "ticket": {
       "id": "TICKET-001",
       "name": "Ticket name",
       "description": "What this ticket implements",
       "phase": "Phase 1: Setup",
       "acceptance": ["Criteria 1", "Criteria 2"],
       "status": { "status": "todo" },
       "dependencies": [{"id": "TICKET-000", "phase": "Phase 0"}],
       "estimatedEffort": {
         "humanEffort": "30 minutes",
         "purpleEffort": "5 minutes"
       }
     }
   }
   ```

   **During execution**, you must continue sending updates as work progresses. Senior-engineer teammates emit their own `in_progress` / `completed` / `failed` updates per ticket — as the lead you only need to relay status you observe directly (e.g., when reassigning a ticket, or when a teammate goes silent and you mark a ticket `failed` on their behalf). Use the same per-ticket schema:
   ```json
   {
     "ticket": {
       "id": "TICKET-001",
       "status": { "status": "completed", "completionSummary": "Short summary" }
     }
   }
   ```

   **When QA begins and ends**, send QA status updates:
   ```json
   { "qaActive": true, "qaRunNumber": 1, "qaCurrentTest": "Running unit tests" }
   ```
   ```json
   { "qaActive": false, "qaCurrentTest": "Passed" }
   ```

   **Do NOT** send `buildComplete`, `totalTickets: N, completedTickets: N, buildComplete: true` as a summary substitute for per-ticket updates — those are pipeline-end signals, not a way to mark tickets done in bulk. The Purple UI updates ticket statuses ONLY from per-ticket calls with a matching `ticket.id`.

---

## DO SECOND: Create Implementation Team

Create an Agent Team named `impl-{feature-slug}`. This team will coordinate all engineer and QA teammates for this feature's implementation.

---

## DO THIRD: Create All Tasks with Dependencies

Map every ticket from the implementation spec into the team's shared task list. Create ALL tasks upfront before spawning any teammates.

For each ticket in the implementation spec:
1. Create a task with format `"{TICKET-ID}: {ticket title}"`
2. Include full ticket details, acceptance criteria, files to create/modify, contracts/interfaces
3. Set dependencies to mirror implementation spec

After all implementation tasks, create ONE sentinel task called "QA Verification" blocked by ALL implementation task IDs.

---

## DO FOURTH: Spawn Engineer Teammates

Calculate team size based on ticket count (1-4 engineers), assign ownership zones based on file overlap and dependencies, and spawn all engineers in parallel.

Each engineer spawns with their ownership zone and task list to begin work. You MUST use actual harness sub-agents for this step; do not simulate teammates in prose.

**Pass the ticket id verbatim in every dispatch prompt.** At the top of each senior-engineer's prompt (and in each task description on the shared task list), include a clearly labeled line:

```
TICKET_ID: <exact id from spec>
```

Copy this id from the spec markdown's `**Ticket ID:**` field for that ticket. The engineering-architect has already announced this id to Purple via `purple_status`; the engineer's per-ticket status updates key off this exact string. Do not re-format, re-case, or simplify the id — even one character of drift produces an orphan row in the UI and the ticket stays stuck at "todo" even after the engineer finishes the work.

If a teammate later picks up additional tickets (e.g. you reassign or chain work), include a fresh `TICKET_ID:` line for each new assignment.

---

## DO FIFTH: Monitor Implementation Progress

After spawning all engineers, monitor their work through auto-delivered messages and the shared task list:
- Receive completion notifications and update purple_status
- Classify blockers as BLOCKING or CORRECTABLE
- Forward interface change notifications to affected engineers
- Verify engineers have work and resolve idle states
- Ensure each completed implementation ticket produces a documentation file in `completed-tickets-documentation/`

When all implementation tasks are completed, the QA Sentinel task unblocks automatically.

---

## DO SIXTH: QA Verification Loop

**BEFORE starting QA:**
- Read `purple/standards/global/testing.md` (if it exists) for QA loop procedures, verification sequences, tool-specific instructions, and prerequisites
- Review the implementation spec and completed ticket docs to identify what was built: web UI, API endpoints, CLI commands, database changes, background jobs, auth flows, etc.
- These standards define HOW to run QA for each project type — always follow them when present

**IMPORTANT:** Do NOT skip QA based on project type. If the project has API endpoints, CLI commands, database operations, or any other testable surface — QA must run. QA is not limited to web/UI verification. Only skip if there is genuinely nothing testable (e.g., documentation-only changes).

After implementation completes:
1. Determine QA agents needed based on feature characteristics AND standards:
   - Has web UI         → spawn Web QA teammate (Playwright or as defined in testing.md)
   - Has API endpoints  → spawn API QA teammate (curl/jq or as defined in testing.md)
   - Has CLI commands   → spawn CLI QA teammate (tmux or as defined in testing.md)
   - Has DB changes     → spawn Database QA teammate (if procedures defined in testing.md)
   - Has background jobs → spawn Jobs QA teammate (if procedures defined in testing.md)
   - Has auth changes   → spawn Auth QA teammate (if procedures defined in testing.md)
   - If testing.md defines verification sequences for a relevant type, pass them to the QA teammate
2. Spawn QA teammates with full context
3. Run QA loop (up to 3 attempts):
   - QA runs tests and reports to lead
   - QA must write at least one report file to `purple/documentation/{feature-folder}/qa-results/`
   - If PASS: Set qaActive=false and proceed to shutdown
   - If FAIL: QA messages engineers with failures, engineers fix, QA re-runs
4. After 3 attempts or pass, proceed to shutdown

---

## DO SEVENTH: Shutdown and Cleanup

After QA passes (or 3 attempts exhausted):
1. Send shutdown request to all teammates
2. Wait for shutdown confirmations
3. Clean up team and task directories
4. Final purple_status update
5. Verify that completed-ticket documentation exists and at least one QA report exists before considering the workflow complete

---

## Team Communication Rules

- If you change a shared interface, message affected engineers
- If you hit an unresolvable blocker, message the lead immediately
- When QA messages about failures, fix the issues directly
- When receiving a shutdown request, approve it (unless mid-critical work)

## Other Engineers on the Team

[Engineers and their ownership zones will be provided at runtime for interface change notifications]
