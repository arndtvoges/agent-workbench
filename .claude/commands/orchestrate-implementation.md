---
argument-hint: [feature-folder-path]
description: Orchestrate parallel senior engineers to implement tasks from engineering spec (project)
model: claude-sonnet-4-5
---

# Orchestrate Parallel Implementation

Your goal is to take the engineering implementation specification and orchestrate multiple senior engineer agents working in parallel to efficiently implement all tasks while maintaining consistency and architectural integrity.

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

5. **Call Purple MCP**: Announce phases and tickets
  - Call the Purple MCP to announce all phases and tickets and their relevant metadata. This allows external progress tracking.

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

```
attempt_count = 0

LOOP:
    attempt_count++

    1. BUILD QA plan based on feature characteristics:
       - Has web UI       → include Web QA agent
       - Has API endpoints → include API QA agent
       - Has CLI commands  → include CLI QA agent

    2. EXECUTE tests via appropriate QA agents
       → Results written to `purple/documentation/{feature-folder}/qa-results/`

    3. EVALUATE results:

       IF all tests pass:
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

