---
argument-hint: [feature-folder-path]
description: Orchestrate an Agent Team of senior engineers to implement tasks from engineering spec (project)
model: claude-sonnet-4-5
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

5. **Call Purple MCP**: Announce phases and tickets using the unified `purple_status` tool:

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

# DO SECOND: Create Implementation Team

Create an Agent Team named `impl-{feature-slug}`. This team will coordinate all engineer and QA teammates for this feature's implementation.

---

# DO THIRD: Create All Tasks with Dependencies

Map every ticket from the implementation spec into the team's shared task list. Create ALL tasks upfront before spawning any teammates.

## Mapping Rules

For each ticket in the implementation spec, in phase order:

1. **Create a task** for each ticket. The task title should follow the format `"{TICKET-ID}: {ticket title}"`. The task description must include:
   - Full ticket details and objective from the spec
   - Acceptance criteria
   - Files to create/modify
   - Contract/interface signatures
   - Pattern references from the spec
   - Key considerations and gotchas
   - Feature folder path: `purple/documentation/{feature-folder}/`
   - Completion doc path: `completed-tickets-documentation/{phase}-{ticket#}-{slug}-documentation.md`
   - Reminder: **"You MUST read ALL standards in purple/standards/ before writing any code. Report status via purple_status MCP."**

2. **Set dependencies** between tasks to mirror the implementation spec:
   - If ticket B depends on ticket A, mark B as blocked by A
   - Phase N tickets are blocked by their explicit dependencies from the spec
   - If the spec doesn't specify, Phase N tickets are blocked by ALL Phase N-1 tickets

3. **Record the mapping**: Keep track of TICKET-ID to task ID (needed for dependency setup)

## QA Sentinel Task

After all implementation tasks, create ONE sentinel task called "QA Verification". Mark it as blocked by ALL implementation task IDs. This task will automatically unblock when all implementation tasks are completed, signaling that it's time to spawn QA.

---

# DO FOURTH: Spawn Engineer Teammates

## Calculate Team Size

Count total implementation tickets (exclude QA sentinel). Determine engineer count:

| Tickets | Engineers |
|---------|-----------|
| 1-3     | 1         |
| 4-6     | 2         |
| 7-9     | 3         |
| 10+     | 4 (maximum) |

## Assign Ownership Zones

Before spawning, partition tickets into ownership zones. Each engineer gets a set of tickets they are primarily responsible for. Grouping criteria (in priority order):

1. **File overlap**: Tickets modifying the same files go to the same engineer
2. **Dependency chains**: If A blocks B, prefer giving both to the same engineer
3. **Layer cohesion**: Backend tickets together, frontend tickets together
4. **Balanced load**: Roughly equal ticket counts per engineer

## Spawn Teammates

Spawn each engineer as a `senior-engineer` teammate on the `impl-{feature-slug}` team. Name them `engineer-1`, `engineer-2`, etc. **Spawn ALL engineers in a SINGLE message** for true parallelism.

### Spawn Prompt Template

Each engineer's spawn prompt MUST include:

```
You are engineer-{N} on the implementation team for {feature-slug}.

## Your Ownership Zone
You are primarily responsible for these tasks:
- Task #{id}: {TICKET-ID}: {title}
- Task #{id}: {TICKET-ID}: {title}
...

Start by claiming and working on these tasks. After completing your zone, check the task list for any remaining unclaimed tasks.

## Getting Started
1. Read ALL project standards:
   - All files in purple/standards/global/ (may be symlinks -- use Bash/Read directly if Glob finds nothing)
   - All files in purple/standards/backend/
   - All files in purple/standards/frontend/
   This is MANDATORY before writing any code.
2. Check the task list for available tasks
3. Claim your first task (mark it in_progress with yourself as owner)
4. Implement the ticket following all standards and the implementation spec
5. Write completion doc to: completed-tickets-documentation/{phase}-{ticket#}-{slug}-documentation.md
6. Report status via purple_status MCP
7. Mark the task as completed
8. Message the lead with a brief completion summary
9. Check the task list and claim your next available task

## Team Communication Rules
- If you change a shared interface (types, exports, API contract), message affected engineers about the change
- If you hit a blocker you cannot resolve, message the lead immediately
- When a QA agent messages you about a failure, check the task list for fix tasks and fix the issue
- When you receive a shutdown request, finish current work then approve the shutdown

## Feature Context
- Feature folder: purple/documentation/{feature-folder}/
- Implementation spec: {path to implementation spec}
- The implementation spec contains ALL ticket details, contracts, and architecture decisions

## Other Engineers on the Team
{list other engineer names and their ownership zones, so this engineer knows who to message about interface changes}
```

---

# DO FIFTH: Monitor Implementation Progress

After spawning all engineers, monitor their work through auto-delivered messages and the shared task list.

```
WHILE there are pending or in_progress implementation tasks:

    1. RECEIVE messages from teammates (auto-delivered):

       - COMPLETION notifications:
         → Note the completed task
         → Update purple_status with ticket status "completed" and completion summary
         → Check the task list for overall progress

       - BLOCKER escalations:
         → Classify as BLOCKING or CORRECTABLE (see table below)
         → BLOCKING: Surface to user with full context, request input
         → CORRECTABLE: Message the engineer with resolution guidance,
           also forward context to any affected downstream engineers

       - INTERFACE CHANGE notifications:
         → Forward to affected engineers
         → Example: engineer-1 renames an API endpoint -> message engineer-2 who
           consumes that endpoint

    2. CHECK the task list periodically:
       - Verify all engineers have in_progress tasks (no one is idle without reason)
       - Check that tasks are unblocking correctly as dependencies complete
       - If an engineer appears idle with unclaimed tasks in their zone,
         message them to claim the next task

    3. If an engineer has no more tasks in their zone but other unclaimed tasks exist:
       → Message them to claim from the remaining pool

WHEN all implementation tasks show status "completed":
    → The QA Sentinel task becomes unblocked
    → Proceed to DO SIXTH (QA)
```

## Blocking vs Correctable Issues

| Issue Type | Examples | Action |
|------------|----------|--------|
| **Blocking** | Missing dependencies, schema conflicts, unresolvable errors, fundamental misunderstanding | Stop, surface to user |
| **Correctable** | Minor API changes, renamed exports, adjusted interfaces, workarounds applied | Message engineer with guidance, forward context to downstream engineers |

---

# DO SIXTH: QA Verification Loop

After all implementation tasks are complete, validate the feature through QA teammates.

## Step 1: Determine QA Agents Needed

Based on feature characteristics:
- Has web UI / frontend pages → spawn a `qa-agent-web` teammate
- Has API endpoints → spawn a `qa-agent-api` teammate
- Has CLI commands → spawn a `qa-agent-cli` teammate

If multiple QA types are needed, create separate QA sub-tasks (one per type), all blocked by the implementation tasks.

## Step 2: Spawn QA Teammate(s)

Spawn each QA agent as a teammate on the `impl-{feature-slug}` team. Name them `qa-web`, `qa-api`, or `qa-cli` as appropriate.

### QA Spawn Prompt Template

```
You are {qa-type} on the implementation team for {feature-slug}.

## Your Task
Claim the QA task (Task #{qa_task_id}) and run verification.
- QA attempt: {attempt_number} of 3
- Feature folder: purple/documentation/{feature-folder}/
- Write QA report to: purple/documentation/{feature-folder}/qa-results/

## What Was Built
{Summary of implemented tickets and what they do, from completion docs}

## Key Pages/Endpoints/Commands to Test
{List based on the implementation spec}

## Team Communication
- If you find failures, message the SPECIFIC engineer responsible with precise details
- Also create fix tasks in the task list and assign them to the responsible engineer
- Also message the lead with a summary of results
- After engineers fix issues, re-run your FULL test suite
- Do NOT invoke /refine -- communicate with engineers directly

## Other Team Members
{List of engineers and their ownership zones, so QA knows who to message}

## Standards
Read purple/standards/ before starting. This is mandatory.
```

## Step 3: QA Execution and Communication Loop

```
attempt_count = 0

LOOP:
    attempt_count++

    UPDATE purple_status: qaActive=true, qaRunNumber=attempt_count

    1. QA teammate(s) claim QA task, run tests, write report

    2. QA teammate messages lead with results:
       - PASS: QA marks task completed, messages lead "QA PASS"
       - FAIL: QA messages specific engineers with failure details,
         creates fix tasks, assigns to responsible engineers

    3. IF QA PASS:
       → Set qaActive=false via purple_status
       → Proceed to DO SEVENTH (shutdown)

    4. IF QA FAIL AND attempt_count < 3:
       → Monitor fix tasks via the task list
       → When all fix tasks completed, message QA to re-run full suite
       → QA re-runs ALL tests (not just failures)
       → Loop back

    5. IF QA FAIL AND attempt_count >= 3:
       → Set qaActive=false via purple_status
       → QA report documents remaining failures
       → Proceed to DO SEVENTH with failure note
       → Surface remaining failures to user
```

### If an Engineer is Unreachable During QA Fixes

If QA messages an engineer who doesn't respond (already shut down or stuck):
1. Spawn a new engineer teammate with the fix context
2. Or reassign the fix task to another active engineer

---

# DO SEVENTH: Shutdown and Cleanup

After QA passes (or 3 attempts exhausted), shut down the team.

1. **Shutdown all teammates**: Send a shutdown request to each active teammate (each engineer and QA agent).

2. **Wait for shutdown confirmations**: Each teammate will confirm shutdown. Wait for all confirmations.

3. **Handle rejections**: If a teammate declines shutdown:
   - Read their reason (they may be finishing critical work)
   - Wait a reasonable time and retry
   - If still declining, send another request with context that all tasks are done

4. **Cleanup team**: Remove the team and its task directories.

5. **If cleanup fails**: Retry once after re-sending shutdown requests to any remaining active teammates. If still failing, log a warning and proceed -- the team directories are ephemeral and use the feature slug, so they won't conflict with future runs.

6. **Final purple_status update**: Set `qaActive: false` if not already done.
