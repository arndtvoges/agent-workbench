---
name: "build-from-spec"
description: "End-to-end feature pipeline: import spec → product spec → engineering tasks → implementation → QA → complete delivery. Use this when you have a feature specification ready and need to build it through all phases autonomously."
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

This is a fully autonomous workflow. Once started, you will execute ALL phases from start to finish.

**DO NOT:**
- Stop after any phase and ask "Ready to continue?" or "Should I proceed?"
- Wait for user confirmation between phases
- Consider yourself "done" until you've completed ALL phases including the final MCP signal
- End your turn while agents are still running
- Collapse or skip phases — each phase has specific instructions you MUST follow
- Guess what a phase does — READ the skill file for each phase
- Start implementing code before the required documentation artifacts for the current phase exist on disk

**DO:**
- Execute each phase immediately after the previous one completes
- Only time you can stop is to ask questions to the user in phase 1
- Keep working until you reach the final signal
- Stay active and waiting when agents are running
- Treat invocation of `/build-from-spec` as explicit user authorization to spawn sub-agents for product spec writing, engineering planning, implementation, and QA
- Verify the required output files for each phase before proceeding

## Required Phase Gates

You may only move to the next phase when these files exist:

- After Phase 1:
  - `purple/documentation/{feature-folder}/user-provided-product-spec-{feature-slug}.md`
  - `purple/documentation/{feature-folder}/agent-written-specifications/agent-written-product-spec-{feature-slug}.md`
- After Phase 2:
  - `purple/documentation/{feature-folder}/agent-written-specifications/implementation-spec-{feature-slug}.md`
- After Phase 3:
  - At least one file in `purple/documentation/{feature-folder}/completed-tickets-documentation/`
  - At least one file in `purple/documentation/{feature-folder}/qa-results/`

If a required file is missing, the pipeline is not complete and you must continue working instead of summarizing.

## Pipeline Execution

You MUST execute these 3 phases in order. For each phase, READ the skill file to get the full instructions, then follow them exactly.

### Phase 1: Import & Validate Specification

**Read the file `.codex/skills/import-spec/SKILL.md` now.** Execute every instruction in that file before proceeding to Phase 2.

This phase validates the user's spec, asks clarifying questions, and produces a formal product specification. Do not proceed to Phase 2 until a product spec document has been written to `purple/documentation/`.

### Phase 2: Engineering Architecture & Task Breakdown

**Read the file `.codex/skills/engineer-tasks-from-spec/SKILL.md` now.** Execute every instruction in that file before proceeding to Phase 3.

This phase takes the product spec from Phase 1 and creates an engineering implementation plan with phased tickets. Do not proceed to Phase 3 until an implementation spec with tickets has been written to `purple/documentation/`.

### Phase 3: Orchestrate Implementation & QA

**Read the file `.codex/skills/orchestrate-implementation/SKILL.md` now.** Execute every instruction in that file.

This phase spawns sub-agents to implement the tickets from Phase 2 in parallel, then runs QA verification loops. This phase is complete when all tickets are implemented and QA passes.

## Phase 4: Manual Setup Documentation

After Phase 3 (orchestrate-implementation) completes, create `{feature-folder}/manual-setup.md` to document any manual actions the user must perform.

**Review all documentation** (implementation spec, completed tickets) to identify manual setup requirements:
- Environment variables to add
- Database migrations to run manually
- API keys to obtain and configure
- Third-party service configurations
- DNS or domain settings
- Cron jobs or scheduled tasks
- Any other manual steps not handled by code

**Create the file with this format:**

```markdown
# Manual Setup Required

**Feature:** {feature-name}
**Date:** {YYYY-MM-DD}

## Checklist

### Environment Variables
- [ ] `EXAMPLE_API_KEY` - Get from [Service Dashboard](https://example.com) and add to `.env.local`

### Third-Party Services
- [ ] Configure webhook URL in service dashboard

### Other
- [ ] Run database migration: `pnpm db:migrate`

---

**Note:** If no manual setup is required, this section will state "No manual setup required for this feature."
```

**If no manual setup is needed**, still create the file with:

```markdown
# Manual Setup Required

**Feature:** {feature-name}
**Date:** {YYYY-MM-DD}

## Checklist

No manual setup required for this feature. All configuration is handled automatically by the implementation.
```

## Phase 5: Final Summary & Build Complete Signal

### Present Final Summary

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
- QA Report: `qa-results/qa-report-{slug}.md`
- Manual Setup: `manual-setup.md`

### Next Steps
1. Review the manual setup checklist above
2. Test the feature
3. Use `/refine` to make any adjustments
```

### Signal Build Complete (REQUIRED)

**CRITICAL:** After presenting the final summary, you MUST signal build completion via the `purple_status` MCP tool:

```json
{
  "buildComplete": true,
  "phase": "5 - Complete"
}
```

This tells the app the entire build pipeline has finished. **Do not skip this step.**

## Output Locations

The pipeline will create:
- `{feature-folder}/user-provided-product-spec-{feature-slug}.md`
- `{feature-folder}/user-provided-technical-spec-{feature-slug}.md` (if provided)
- `{feature-folder}/enriched-user-spec-{feature-slug}.md` (if clarifications were asked)
- `{feature-folder}/agent-written-specifications/agent-written-product-spec-{feature-slug}.md`
- `{feature-folder}/agent-written-specifications/implementation-spec-{feature-slug}.md`
- `{feature-folder}/completed-tickets-documentation/*.md` (one per ticket)
- `{feature-folder}/qa-results/*.md` (QA reports)
- `{feature-folder}/manual-setup.md` (manual setup checklist)

If the purple_status MCP tool is available, you MUST update it:
- at the start of the workflow
- at the end of Phase 1
- at the end of Phase 2
- when implementation begins
- when QA begins and ends
- at final completion
