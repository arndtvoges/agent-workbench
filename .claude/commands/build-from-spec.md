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

11) **Read Engineering Standards**: Read all relevant standards from the `purple/standards/` directory to understand:
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

## PHASE 3: Orchestrated Implementation

13) **Analyze Implementation Spec**: Parse the implementation spec to identify:
   - All phases of implementation
   - All tickets within each phase
   - Dependencies between tickets
   - Files that will be created or modified by each ticket
   - Potential conflicts (multiple tickets modifying the same file)
   - Cohesion requirements (components that need consistent implementation)

14) **Intelligent Task Grouping**: Analyze tasks to determine optimal grouping:
   - **Identify Cohesive Units**: Group related components that should share similar styling, data structures, or patterns
   - **Analyze Separable Work**: Identify truly independent tasks that can be parallelized
   - **Respect Natural Boundaries**: Group by feature cohesion, layer cohesion, or data flow
   - **Balance Load**: Ensure each agent gets a reasonable amount of work

15) **Create Smart Orchestration Plan**: Design an intelligent parallelization strategy:
    - Phase Planning: Respect dependencies but maximize parallelism within phases
    - Agent Assignment: One agent per cohesive unit, specialized agents for distinct domains
    - Consistency Instructions: Clear guidelines about patterns, styling, integration points
    - Conflict Prevention: Assign clear file ownership

16) **Launch Senior Engineer Agents**: For each phase:
    - Use a SINGLE message with multiple Task tool calls to launch parallel agents
    - Assign cohesive work units to each agent
    - Provide full context (spec excerpts, standards, patterns to follow)
    - Define clear ownership boundaries and cross-agent contracts

17) **Monitor and Coordinate**: After each phase completes:
    - Verify all tickets in the phase are completed
    - Check for consistency across related components
    - Validate integration points between agent work
    - Run tests if specified
    - Move to the next phase

---

## PHASE 4: QA Verification Loop (Conditional)

This phase runs a QA → Fix → QA loop with a maximum of 3 attempts to ensure the implementation works correctly.

**IMPORTANT:** This phase is **conditional** and should only run if:
1. The project has a web interface (frontend, web app, etc.)
2. The implementation includes visual/UI changes that can be verified in a browser

**Skip QA if:**
- The project is a CLI tool, library, or backend-only service
- The implementation is purely backend/API changes with no UI
- There are no web pages or components to visually verify

If QA is skipped, proceed directly to PHASE 5 (Manual Setup Documentation) and note in the final summary: "QA skipped - no visual/UI changes to verify."

### Step 18: Prepare QA Environment

- Check if the project has a dev server command (usually `pnpm dev`, `npm run dev`, or similar)
- If a dev server is already running, use it
- If not running, start it in the background and wait for it to be ready
- Set `QA_BASE_URL` to the local dev server URL (typically `http://localhost:3000` or similar)

---

### Step 19: Initialize QA Loop

Set attempt counter to 1. Maximum attempts = 3.

---

### Step 20: Launch QA Engineer

Invoke the `qa-engineer` agent to perform basic visual verification:
- Provide the **feature folder path** (e.g., `purple/documentation/251204-{feature-slug}/`)
- Provide the **feature slug** for naming the report file
- Provide context about what was built (summary of implemented features)
- List the key pages/components that were created or modified
- Specify the URL(s) to check: `{QA_BASE_URL}` + relevant paths
- Include the current attempt number (e.g., "QA Attempt 1 of 3")

The QA engineer will:
- Navigate to the implemented pages using Playwright MCP
- Take screenshots to verify rendering (saved to `{feature-folder}/qa-screenshots/`)
- Check browser console for errors or warnings
- Verify new UI components actually appear on screen
- Test basic interactions (buttons click, dialogs open, etc.)
- **Save a QA report** to `{feature-folder}/qa-report-{feature-slug}.md`
- Clearly indicate PASS or FAIL status with specific issues listed

---

### Step 21: Review QA Results and Decide

- Read the QA report from `{feature-folder}/qa-report-{feature-slug}.md`
- If **PASS**: Proceed to step 23 (completion)
- If **FAIL** and attempt < 3: Proceed to step 22 (fix issues)
- If **FAIL** and attempt = 3: Proceed to step 23 with failure note

---

### Step 22: Fix Issues (only if QA failed and attempts remaining)

- Analyze the specific issues reported in the QA report
- Launch a `senior-engineer` agent to fix ONLY the reported issues:
  - Provide the exact error descriptions from the QA report
  - Specify which files likely need changes
  - Instruct to make minimal, targeted fixes (not refactoring)
- After fixes are applied, increment attempt counter
- Return to step 20 (run QA again)

---

### Step 23: Finalize QA Phase

- Ensure a final QA report exists in `{feature-folder}/qa-report-{feature-slug}.md`
- The final report should reflect the last QA run
- If all attempts failed, the report should clearly document remaining issues

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

**QA Loop Summary**:
```
[Start dev server if needed]
     ↓
Attempt 1: QA → if FAIL → Fix →
Attempt 2: QA → if FAIL → Fix →
Attempt 3: QA → Done (pass or fail)
```

**Note**: This is a quick sanity check loop, not comprehensive testing. The goal is to catch and fix obvious issues like missing components, console errors, or broken layouts within 3 attempts.

---

# Key Principles:

- **Sequential Handoffs**: Each phase must complete before starting the next
- **Cohesion Over Speed**: Group related work together - consistency is more important than parallelism
- **Natural Work Units**: Respect logical boundaries in the codebase
- **File Isolation**: When work CAN be separated, assign different files to different agents
- **Clear Ownership**: Each agent owns complete features or layers, not fragments
- **True Parallelism**: Use a single message with multiple Task tool calls within phases

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