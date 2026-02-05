---
argument-hint: [user-provided roduct-specification] [optional-user-provided-technical-specification]
description: End-to-end: import spec → product spec → engineering tasks → implementation → qa → loop back if necessary
model: claude-opus-4-5
---

# Build From Spec - Complete End-to-End Pipeline

## Workspace Structure

**IMPORTANT:** Before starting, understand the workspace structure:
- **`/repos/`** - Contains the actual codebase(s) you'll be building into. Explore this directory first to understand the project structure, existing patterns, and tech stack.
- **`/purple/documentation/`** - Where feature documentation is stored (specs, tickets, QA reports)
- **`/purple/standards/`** - Engineering standards and coding conventions to follow

**First Step:** Always run `ls repos/` and explore the codebase structure before writing any specs or code. Understanding the existing codebase is critical for writing accurate specifications and implementation.

## CRITICAL: AUTONOMOUS END-TO-END EXECUTION

**YOU MUST RUN THIS ENTIRE PIPELINE WITHOUT STOPPING OR ASKING FOR PERMISSION TO CONTINUE.**

This is a fully autonomous workflow. Once started, you will execute ALL phases from start to finish:
1. `/import-spec` → 2. `/engineer-tasks-from-spec` → 3. `/orchestrate-implementation` → 4. QA Loop → 5. Final Summary

**DO NOT:**
- Stop after any phase and ask "Ready to continue?" or "Should I proceed?"
- Wait for user confirmation between phases
- Consider yourself "done" until you've completed ALL phases including the final MCP signal
- End your turn while agents are still running

**DO:**
- Execute each phase immediately after the previous one completes
- Only time you can stop is to ask questions to the user in phase 1
- Keep working until you reach Step 26 (Signal Build Complete)
- Stay active and waiting when agents are running - your turn is NOT complete until all agents return

---

## Pipeline Overview

1. Run `/import-spec` with parameters [user-provided-product-specification] [optional-user-provided-technical-specification] - Setup and product spec writing
2. Run `/engineer-tasks-from-spec` - Engineering architecture and task breakdown
3. Run `/orchestrate-implementation` - Parallel implementation by senior engineers, followed by qa-fix loop

---

## Phase-by-phase instructions



## PHASE 2: Engineering Architecture and Task Breakdown

11) **Read Engineering Standards**: Read all relevant standards from the `purple/standards/` directory (may be a symlink — if Glob finds nothing, use Bash or Read directly) to understand:
   - Tech stack and architecture patterns
   - Code style and testing requirements
   - Backend patterns (database, API, models)
   - Frontend patterns (components, styling)
   - Any other relevant standards

12) **Invoke Engineering Architect**: Launch the `engineering-architect` agent with:
   - The agent-written product spec
   - The user technical spec (if exists)
   - All relevant engineering standards
   - Request creation of `implementation-spec-{feature-slug}.md`

   Wait for the agent to complete and verify that the following file was created:
   - `{feature-folder}/agent-written-specifications/implementation-spec-{feature-slug}.md`

---

## PHASE 3: Orchestrated Implementation (Agent Teams)

> **Note:** Phase 3 uses **Agent Teams**. The orchestrator creates a team, spawns engineer teammates, and coordinates via shared task lists and inter-agent messaging. The team is created at the start of Phase 3 and destroyed at the end (after QA completes). This replaces the previous one-shot subagent approach.

13) **Invoke `/orchestrate-implementation`** with the feature folder path. The orchestrator will:

14) **Create Agent Team**: Create a team named `impl-{feature-slug}` and populate the shared task list with ALL tickets from the implementation spec, mapped with proper dependency chains.

15) **Spawn Engineer Teammates**: Calculate team size (1-4 engineers based on ticket count), assign ownership zones (grouping by file overlap, dependencies, and layer cohesion), and spawn all engineers in parallel. Each engineer reads standards, claims tasks from the shared list, and works autonomously.

16) **Monitor and Coordinate via Team Communication**:
    - Receive auto-delivered messages from engineer teammates (completions, blockers, interface changes)
    - Check `TaskList` for overall progress
    - Handle blocker escalations (classify as blocking vs correctable)
    - Forward interface change notifications to affected engineers
    - Engineers self-claim unblocked tasks as they complete their current work

17) **QA as Team Members**: After all implementation tasks complete, QA agents are spawned as additional teammates on the same team. They communicate failures **directly to the responsible engineers** via messaging. Engineers fix issues with full context (no `/refine` middleman). Max 3 QA attempts.

18) **Shutdown and Cleanup**: After QA passes (or 3 attempts exhausted), shut down all teammates and clean up the team before proceeding to Phase 4.

---

## PHASE 4: QA Verification (Handled by Agent Team)

> **Note:** QA is now handled WITHIN the Agent Team in Phase 3. The `/orchestrate-implementation` command spawns QA agents as teammates after all implementation tasks complete. QA agents communicate failures directly to engineer teammates, who fix issues with full context. The `/refine` command is NOT used during team-based QA.

**QA is conditional** -- it only runs if the feature has testable surfaces:
- Web UI → qa-agent-web teammate
- API endpoints → qa-agent-api teammate
- CLI commands → qa-agent-cli teammate

**Skip QA if:** The project is backend-only with no testable interface. Note in final summary: "QA skipped."

**QA environment setup** (dev server, etc.) is handled by the orchestrator before spawning QA teammates.

**Max 3 QA attempts.** The QA → Fix → QA loop runs within the team:
```
QA teammate finds failures → messages specific engineers → engineers fix →
QA re-runs full suite → repeat up to 3 times
```

After QA completes (pass or fail), the team is shut down and cleaned up.

---

## PHASE 5: Manual Setup Documentation

### Step 24: Create Manual Setup File

After QA completes, create `{feature-folder}/manual-setup.md` to document any manual actions the user must perform.

**Review all documentation** (implementation spec, completed tickets) to identify manual setup requirements:

- Environment variables to add
- Firebase/Firestore indexes to create
- API keys to obtain and configure
- Database migrations to run manually
- Third-party service configurations
- DNS or domain settings
- Cron jobs or scheduled tasks to configure
- Any other manual steps not handled by code

**Create the file with this format:**

```markdown
# Manual Setup Required

**Feature:** {feature-name}
**Date:** {YYYY-MM-DD}

## Checklist

Use this checklist to complete the manual setup for this feature.

### Environment Variables
- [ ] `EXAMPLE_API_KEY` - Get from [Service Dashboard](https://example.com) and add to `.env.local` and Vercel

### Firebase / Firestore
- [ ] Create composite index: Collection `users`, fields: `status` (ASC), `createdAt` (DESC)

### Third-Party Services
- [ ] Enable XYZ API in Google Cloud Console
- [ ] Configure webhook URL in Stripe Dashboard: `https://yourdomain.com/api/webhooks/stripe`

### Other
- [ ] Run database migration: `pnpm db:migrate`

---

**Note:** If no manual setup is required, this section will state "No manual setup required for this feature."
```

**If no manual setup is needed**, create the file with:

```markdown
# Manual Setup Required

**Feature:** {feature-name}
**Date:** {YYYY-MM-DD}

## Checklist

No manual setup required for this feature. All configuration is handled automatically by the implementation.
```

### Step 25: Final User Summary

Present a final summary to the user that prominently highlights the manual setup file:

```
## Build Complete!

**Feature:** {feature-slug}
**Status:** {QA PASS/FAIL}

### Manual Setup Required
**IMPORTANT:** Review `purple/documentation/{feature-folder}/manual-setup.md` for any manual configuration steps.

{List 2-3 key items from manual-setup.md, or "No manual setup required"}

### Documentation Created
- Product Spec: `agent-written-specifications/agent-written-product-spec-{slug}.md`
- Engineering Spec: `agent-written-specifications/implementation-spec-{slug}.md`
- QA Report: `qa-report-{slug}.md`
- Manual Setup: `manual-setup.md`

### Next Steps
1. Review the manual setup checklist above
2. Test the feature at {URL}
3. Use `/refine` to make any adjustments
```

---

### Step 26: Signal Build Complete (REQUIRED)

**CRITICAL:** After presenting the final summary, you MUST signal build completion to the Purple app via MCP.

Call the `purple_status` tool with:
```json
{
  "buildComplete": true,
  "phase": "5 - Complete"
}
```

This signal tells the Purple app that the entire build pipeline has finished, allowing it to transition the UI to the final phase. **Do not skip this step.**

---

**QA Loop Summary** (runs within the Agent Team):
```
[Start dev server if needed]
     ↓
Attempt 1: QA teammate tests → if FAIL → messages engineers → engineers fix →
Attempt 2: QA re-tests → if FAIL → messages engineers → engineers fix →
Attempt 3: QA re-tests → Done (pass or fail) → Shutdown team
```

**Note**: QA agents communicate failures directly to the engineer who built the broken component. No `/refine` middleman during team builds. Engineers fix their own code with full context.

---

# Key Principles:

- **Sequential Handoffs**: Each phase must complete before starting the next
- **Agent Teams for Implementation**: Phase 3 uses Agent Teams with shared task lists and inter-agent messaging
- **Cohesion Over Speed**: Group related work together - consistency is more important than parallelism
- **Natural Work Units**: Respect logical boundaries in the codebase
- **Ownership Zones**: Each engineer teammate owns a set of related tickets, assigned by the lead
- **Self-Claiming Tasks**: Engineers claim unblocked tasks from the shared list after completing their zone
- **Direct QA Communication**: QA teammates message specific engineers about failures -- no intermediaries

# Output Locations:

The pipeline will create:
- `{feature-folder}/user-provided-product-spec-{feature-slug}.md` (copied from user)
- `{feature-folder}/user-provided-technical-spec-{feature-slug}.md` (copied from user, if provided)
- `{feature-folder}/enriched-user-spec-{feature-slug}.md` (if clarifying questions were asked in Phase 0)
- `{feature-folder}/agent-written-specifications/agent-written-product-spec-{feature-slug}.md`
- `{feature-folder}/agent-written-specifications/implementation-spec-{feature-slug}.md`
- `{feature-folder}/completed-tickets-documentation/*.md` (one per completed ticket)
- `{feature-folder}/qa-screenshots/*.png` (screenshots from QA verification)
- `{feature-folder}/qa-report-{feature-slug}.md` (QA verification report, if QA ran)
- `{feature-folder}/manual-setup.md` (manual setup checklist for user)
- All implementation code changes as specified in the tickets