---
argument-hint: [feature-folder-path]
description: Orchestrate parallel senior engineers to implement tasks from engineering spec (project)
model: opus
---

# Orchestrate Parallel Implementation

Your goal is to take the engineering implementation specification and orchestrate multiple senior engineer agents working in parallel to efficiently implement all tasks while maintaining consistency and architectural integrity.

---

## CRITICAL: Stay Alive While Agents Work

**When you spawn agents via the Task tool, you MUST remain active and waiting for their results.**

**DO NOT:**
- End your turn or consider yourself "done" while agents are still running
- Output a final summary until ALL spawned agents have returned results
- Say "agents are working, I'll wait" and then stop - you must actually wait

**DO:**
- Keep waiting indefinitely - agents may take a long time to complete
- The Task tool will return results when agents finish
- Stay in the conversation and wait for those results before proceeding

**WRONG:** Spawn agents → Output "agents are working..." → End turn
**RIGHT:** Spawn agents → Wait for results → Process results → Continue or summarize

---

## Inputs & results

Before execution:
- Feature folder path provided as `$1` (e.g., `purple/documentation/251114-analytics-dashboard`)
- Engineering spec located at: `purple/documentation/{feature-folder}/agent-written-specifications/implementation-spec-{feature-slug}.md`

During/after execution of this command:
- Completed ticket documentation written to: `purple/documentation/{feature-folder}/completed-tickets-documentation/`
- QA results written to: `purple/documentation/{feature-folder}/qa-results/`

---

# DO FIRST: Validation Steps

1. **Validate Input**: Ensure `$1` (feature folder path) is provided. If not, complain and abort.

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

6. **Call Purple MCP**: Announce phases and tickets using the unified `purple_status` tool:

   **First, set the feature folder:**
   ```json
   {
     "featureFolder": "purple/documentation/{feature-folder}",
     "phase": "3 - Implementation",
     "agent": "orchestrator",
     "totalTickets": <total count>
   }
   ```

   **Then announce each ticket with full metadata:**
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

   The Purple CLI automatically creates and updates `progress.json` based on these MCP calls.
   No manual file writing needed - the Go server handles persistence.

---

# DO SECOND: Phase Execution Loop

Execute phases sequentially. Within each phase, maximize parallelism while respecting dependencies.

```
FOR each phase in implementation_spec.phases:

    1. IDENTIFY tickets and their dependencies

    2. SPAWN senior-engineer agents:
       - Independent tickets → launch in PARALLEL (single message, multiple Task calls)
       - Dependent tickets → run SEQUENTIALLY after dependencies complete
       - Each agent receives: ticket details, relevant standards, cohesion context
       - Each agent writes completion summary to:
         `completed-tickets-documentation/{phase}-{ticket#}-{slug}-documentation.md`
       - Agents call `purple_status` with `ticket.status.status: "in_progress"` and `"completed"`
       - The dispatch prompt to each senior-engineer MUST include a top-of-prompt
         `TICKET_ID: <exact id>` line, copied verbatim from the spec markdown's
         `**Ticket ID:**` field. The id is the binding key between architect
         announcement, engineer update, and UI row — any drift here breaks the
         ticket tree.

    3. WAIT for all agents in phase to complete

    4. READ all summaries from `completed-tickets-documentation/` for this phase

    5. EVALUATE summaries:

       IF all OK:
           → Proceed to next phase

       IF BLOCKING issues found:
           → STOP execution
           → Surface issue to user with full context
           → Request user input
           → After resolution: retry failed ticket(s)
           → Continue with tickets that were blocked by the failed ones

       IF CORRECTABLE (non-critical deviations):
           → Note deviations in memory
           → When spawning future tickets that may be affected,
             inject relevant deviation context into their prompts
           → Proceed to next phase

AFTER all phases complete → enter QA Loop
```

## Blocking vs Correctable Issues

| Issue Type | Examples | Action |
|------------|----------|--------|
| **Blocking** | Missing dependencies, schema conflicts, unresolvable errors, fundamental misunderstanding | Stop, ask user |
| **Correctable** | Minor API changes, renamed exports, adjusted interfaces, workarounds applied | Note deviation, propagate context to downstream tickets |

---

# DO THIRD: QA Loop

After all implementation phases complete, validate the feature through automated testing.

**Update QA status in the progress panel using `purple_status`:**
```json
{
  "qaActive": true,
  "qaRunNumber": 1,
  "qaCurrentTest": "Running unit tests"
}
```

Update `qaCurrentTest` as you move through different test phases. When QA completes:
```json
{
  "qaActive": false
}
```

**BEFORE entering the loop:**
- Read `purple/standards/global/testing.md` (if it exists) for QA loop procedures, verification sequences, tool-specific instructions, and prerequisites
- Review the implementation spec and completed ticket docs to identify what was built: web UI, API endpoints, CLI commands, database changes, background jobs, auth flows, etc.
- These standards define HOW to run QA for each project type — always follow them when present

**IMPORTANT:** Do NOT skip QA based on project type. If the project has API endpoints, CLI commands, database operations, or any other testable surface — QA must run. QA is not limited to web/UI verification. Only skip if there is genuinely nothing testable (e.g., documentation-only changes).

```
attempt_count = 0

LOOP:
    attempt_count++

    1. BUILD QA plan based on feature characteristics AND standards:
       - Has web UI         → include Web QA agent (Playwright MCP or as defined in testing.md)
       - Has API endpoints  → include API QA agent (curl/jq or as defined in testing.md)
       - Has CLI commands   → include CLI QA agent (tmux or as defined in testing.md)
       - Has DB changes     → include Database QA (if procedures defined in testing.md)
       - Has background jobs → include Jobs QA (if procedures defined in testing.md)
       - Has auth changes   → include Auth QA (if procedures defined in testing.md)
       - If testing.md defines verification sequences for a relevant type, pass them to the QA agent

    2. UPDATE QA status via `purple_status`:
       - Set `qaActive: true`, `qaRunNumber: attempt_count`
       - Update `qaCurrentTest` as tests progress

    3. EXECUTE tests via appropriate QA agents
       → Results written to `purple/documentation/{feature-folder}/qa-results/`

    4. EVALUATE results:

       IF all tests pass:
           → Set `qaActive: false` via `purple_status`
           → EXIT loop
           → Report success to user

       IF failures AND attempt_count < 3:
           → Invoke /refine with failure context
           → /refine reads failures, implements fixes
           → Re-run FULL QA plan (all tests, not just failures)
           → Loop back to step 1

       IF failures AND attempt_count >= 3:
           → ABORT QA loop
           → Surface all failures to user
           → Request guidance on how to proceed
```

