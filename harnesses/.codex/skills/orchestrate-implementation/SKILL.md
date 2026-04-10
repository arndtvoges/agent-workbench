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

5. **Call Purple MCP**: Announce phases and tickets using the unified `purple_status` tool with all ticket metadata.
   - This is REQUIRED when the tool is available.
   - You must send ticket updates as work starts, completes, blocks, and when QA begins/ends.

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

After implementation completes:
1. Determine QA agents needed (web, API, CLI based on feature type)
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
