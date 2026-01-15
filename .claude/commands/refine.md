---
argument-hint: [change-description]
description: Make incremental changes to a recently built feature (finds the relevant feature automatically)
model: claude-opus-4-5
---

# Refine - Incremental Changes to Existing Features

Your goal is to make a targeted, well-informed change to a feature that was previously built via the `/build-from-spec` workflow. You will intelligently find the relevant feature documentation before making any changes.

This command invokes the `incremental-change-engineer` agent after determining which feature to modify.

---

## Status Reporting

**CRITICAL**: You MUST update the Purple CLI status bar using MCP tools.

Available MCP tools for status updates:
- `purple_update_status` - Full status update with all fields (phase, agent, mode, currentTicket, totalTickets, tool, activeFile)
- `purple_set_phase` - Quick helper to set just the phase
- `purple_report_progress` - Report ticket progress (current, total)

**At start of refinement**, call `purple_update_status` with:
- phase: "Refinement"
- agent: "incremental-change-engineer"
- mode: "execute"

See `@workbench/standards/global/how-agents-document.md` for more details.

---

## Input

**$1** (required): A description of the change to make. Examples:
- "Add a Technology category to the inspiration page"
- "Fix the modal not closing on the share feature"
- "Make the topic cards have a hover shadow effect"
- "Add an icon next to each category title"

---

## PHASE 1: Identify the Relevant Feature

### Step 1: Read Documentation Standards

Read @workbench/standards/global/how-agents-document.md to understand the folder structure.

### Step 2: List Available Feature Folders

List all feature folders in `workbench/documentation/`:

```bash
ls -la workbench/documentation/
```

Feature folders follow the pattern `{YYMMDD}-{feature-slug}/`.

### Step 3: Analyze the Change Request

Parse $1 to identify keywords that might match a feature:
- Look for feature names (e.g., "inspiration", "collaboration", "share", "app-view")
- Look for component names (e.g., "modal", "card", "sidebar", "dialog")
- Look for page names (e.g., "inspiration page", "dashboard", "pricing")

### Step 4: Match to Feature Folder

**Strategy 1 - Direct Match**: If the change request mentions a specific feature name that matches a folder slug, use that folder.

**Strategy 2 - Keyword Search**: If no direct match:
1. Read the `user-product-spec-{slug}.md` from each recent feature folder (last 3-5 folders by date)
2. Scan for keywords from the change request
3. Select the best matching feature

**Strategy 3 - Most Recent**: If still ambiguous and the change seems generic, use the most recent feature folder (highest date prefix).

### Step 5: Confirm Feature Selection

Before proceeding, briefly state which feature you identified and why:

```
Identified feature: {YYMMDD}-{feature-slug}
Reason: {why this feature matches the request}
```

If you're uncertain, ask the user to confirm:
```
I found multiple possible features for this change:
1. 251207-inspiration - "Get Inspired" page with topic categories
2. 251126-app-view - Dashboard and app view layout

Which feature should I modify?
```

---

## PHASE 2: Gather Feature Context

### Step 6: Load Feature Documentation

Read the following files from the identified feature folder (in order):

1. **User Intent**: `user-product-spec-{feature-slug}.md`
2. **Product Spec**: `agent-written-specifications/agent-written-product-spec-{feature-slug}.md`
3. **Engineering Spec**: `agent-written-specifications/implementation-spec-{feature-slug}.md`
4. **Completed Work**: All files in `completed-tickets-documentation/`
5. **QA Results**: `qa-report-{feature-slug}.md` (if exists) - Testing results and known issues
6. **Previous Changes**: `incremental-changes.md` (if exists)

### Step 7: Identify Relevant Source Files

Based on the documentation and the change request, identify which source files are relevant:
- Which components were created?
- Which files contain the code that needs to change?
- What patterns were used?

Read the relevant source files to understand the current implementation.

---

## PHASE 3: Execute the Change

### Step 8: Launch Incremental Change Engineer

Invoke the `incremental-change-engineer` agent with comprehensive context:

**Prompt must include:**
1. The exact change request from $1
2. The feature folder path
3. Summary of the feature (from product spec)
4. Key technical decisions (from engineering spec)
5. Relevant file paths and their purposes
6. Patterns to follow (from existing implementation)
7. Instruction to update `incremental-changes.md` after completion

**Example prompt:**
```
Make the following change to the {feature-slug} feature:

"{$1}"

## Feature Context

**Feature Folder:** workbench/documentation/{YYMMDD}-{feature-slug}/

**What This Feature Does:**
{Brief summary from product spec}

**Key Technical Decisions:**
{Relevant decisions from engineering spec}

**Relevant Files:**
- `{path/to/component.tsx}` - {what it does}
- `{path/to/data.ts}` - {what it contains}

**Patterns to Follow:**
{Specific patterns from the existing implementation}

## Your Task

1. Read the feature documentation to fully understand the implementation
2. Make the requested change following existing patterns
3. Run `pnpm lint` and `pnpm check-types`
4. Update `workbench/documentation/{feature-folder}/incremental-changes.md` with your changes

Remember: Your change should look like it was part of the original implementation.
```

---

## PHASE 4: Verify and Report

### Step 9: Verify Agent Completion

After the agent completes:
1. Check that `incremental-changes.md` was created/updated
2. Verify lint and type checks passed
3. Collect the list of modified files from the agent's output
4. Summarize what was changed

### Step 10: Final Report

Provide a summary to the user:

```
## Refinement Complete

**Feature:** {feature-slug}
**Change:** {brief description of what was done}

**Files Modified:**
- {list of files}

**Documentation:** Updated in `workbench/documentation/{feature-folder}/incremental-changes.md`

**Next Steps:**
- Test the change locally at {relevant URL}
- Run full QA if needed: (user can invoke qa-engineer manually)
```

---

## Error Handling

### No Feature Folders Found
```
Error: No feature documentation found in workbench/documentation/

This command requires features to have been built via /build-from-spec.
Please run /build-from-spec first to create a feature with documentation.
```

### Ambiguous Feature Match
Use `AskUserQuestion` to let the user select from matching features.

### Change Request Too Vague
If $1 is too vague to understand, ask for clarification:
```
I need more details about this change. Could you clarify:
- Which specific component or page should change?
- What exactly should be different?
```

### Change Requires Major Rework
If the requested change would require significant architectural changes:
```
This change appears to require significant rework that goes beyond incremental refinement:
- {reason why}

Consider running /build-from-spec with a new specification that includes this functionality,
or break this into smaller incremental changes.
```

---

## Key Principles

1. **Context First**: Never make changes without understanding the feature
2. **Pattern Matching**: Changes should be indistinguishable from original code
3. **Minimal Surface**: Only change what's necessary
4. **Documentation**: Always update the incremental changes log
5. **Verification**: Lint and type check before considering complete
