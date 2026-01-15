---
argument-hint: [feature-folder-path]
description: "Step 2: Read product spec, create engineering architecture + numbered tickets"
model: claude-sonnet-4-5
---

# Create Engineering Implementation Plan

Your goal is to take the agent-written product specification and transform it into a detailed engineering implementation plan with phased tickets.

---

## Status Reporting

**CRITICAL**: You MUST update the Purple CLI status bar using MCP tools.

Available MCP tools for status updates:
- `purple_update_status` - Full status update with all fields (phase, agent, mode, currentTicket, totalTickets, tool, activeFile)
- `purple_set_phase` - Quick helper to set just the phase
- `purple_report_progress` - Report ticket progress (current, total)

**At start of this command**, call `purple_update_status` with:
- phase: "2 - Architecture"
- agent: "engineering-architect"
- mode: "plan"

See `@workbench/standards/global/how-agents-document.md` for more details.

---

# Steps to strictly follow:

1) **Validate Input**: Make sure you have been provided with $1 (the path to the feature documentation folder, e.g., `documentation/251114-analytics-dashboard`). If not, complain immediately and abort.

2) **Read Documentation Standards**: Read @workbench/standards/global/how-agents-document.md to understand the folder structure. If it doesn't exist, complain immediately and abort, asking the user to run the `/create-standards` command.

3) **Locate Product Spec**: Find and verify that the following file exists in the provided folder:
   - `{feature-folder}/agent-written-specifications/agent-written-product-spec-{feature-slug}.md`

   If this file doesn't exist, complain and abort, informing the user to run `/import-spec` first.

4) **Read Technical Context**: Also read the user technical spec if it exists:
   - `{feature-folder}/user-technical-spec-{feature-slug}.md`

5) **Read Engineering Standards**: Read all relevant standards from the `./workbench/standards/` directory to understand:
   - Tech stack and architecture patterns
   - Code style and testing requirements
   - Backend patterns (database, API, models)
   - Frontend patterns (components, styling)
   - Any other relevant standards

6) **Invoke Engineering Architect**: Launch the `engineering-architect` agent with the following context:
   - Point to the agent-written product spec
   - Point to the user technical spec (if exists)
   - Provide all relevant engineering standards
   - Request creation of BOTH:
     - `implementation-spec-{feature-slug}.md` in the `agent-written-specifications` folder
     - `progress.json` in the feature folder root

   The engineering-architect should create a phased implementation plan with specific tickets that can be handed to implementation engineers.

# Output Location

The engineering-architect agent must create TWO files:

### 1. Implementation Spec
`{feature-folder}/agent-written-specifications/implementation-spec-{feature-slug}.md`

This file should contain:
- Architecture overview
- Technology choices and rationale
- Phased implementation plan
- Detailed tickets with acceptance criteria
- Dependencies and sequencing
- Testing strategy
- Deployment considerations

### 2. Progress Tracking File
`{feature-folder}/progress.json`

This file tracks implementation progress and must contain:
- All phases from the implementation spec
- All tickets with IDs and names
- Initial status of "pending" for all items
- Summary counts

See `@workbench/standards/global/how-agents-document.md` for the full schema.

**IMPORTANT**: Both files are required. The `/orchestrate-implementation` command will fail if progress.json doesn't exist.
