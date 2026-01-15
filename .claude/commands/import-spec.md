---
argument-hint: [user-product-specification] [optional-user-technical-specification]
description: "Step 1: Setup feature folder, ask clarifying questions, write product spec"
model: claude-opus-4-5
---

# Import user specifications
Your goal is to import a user written specification document, validate it for completeness (asking clarifying questions if needed), prepare the folder structure for its documentation, and kick off the product specification writer agent.

---

## Status Reporting

**CRITICAL**: You MUST update the Purple CLI status bar using MCP tools at each phase transition.

Available MCP tools for status updates:
- `purple_update_status` - Full status update with all fields (phase, agent, mode, currentTicket, totalTickets, tool, activeFile)
- `purple_set_phase` - Quick helper to set just the phase
- `purple_report_progress` - Report ticket progress (current, total)

**Phase 0 - Validation**: Call `purple_update_status` with phase: "0 - Validation", agent: "orchestrator", mode: "plan"
**Phase 1 - Import**: Call `purple_update_status` with phase: "1 - Import", agent: "orchestrator", mode: "execute"
**Phase 2 - Product Spec**: Call `purple_update_status` with phase: "1 - Product Spec", agent: "product-spec-writer", mode: "execute"

See `@workbench/standards/global/how-agents-document.md` for more details.

---

# Steps to strictly follow:

---

## PHASE 0: Specification Validation & Clarification

**IMPORTANT**: This phase runs interactively with the user BEFORE launching any agents. Since agents cannot ask questions mid-execution, all clarification must happen here.

1) **Validate Input**: Make sure you have been provided with at least $1 (user command argument pointing to their product specification). If not, complain immediately and abort.

2) **Understand the Codebase Context**: Before reading the user spec, read the following to understand what kind of system this is:
   - `@workbench/standards/README.md` - To understand the codebase structure
   - `@workbench/standards/global/tech-stack-overview.md` - To understand the tech stack
   - `@workbench/standards/business/general-description.md` - To understand the business context

   This context will help you ask relevant questions specific to this codebase.

3) **Read the User Specification**: Read the contents of $1 to understand what the user wants to build.

4) **Assess Input Completeness**: Evaluate whether the provided feature description has sufficient detail. A well-detailed input includes:
   - Clear problem statement or user need
   - Target users identified
   - Core functionality described
   - Key interactions or flows mentioned
   - Success criteria implied or stated

5) **If Input is Vague or Incomplete - Ask Clarifying Questions**: When the feature description lacks sufficient detail, use the `AskUserQuestion` tool to gather the information needed.

   **IMPORTANT: Generate ONLY Relevant Questions**

   Your questions must be tailored to THIS specific feature. Do NOT ask generic questions or go through a checklist. Instead:

   1. **Understand what the feature actually is** - What components of the system does it touch?
   2. **Identify what's missing** - What do YOU need to know to implement this? What decisions are unclear?
   3. **Ask only what matters** - If it's a scraper feature, don't ask about UI. If it's a backend API, don't ask about translations.

   **Think before asking**:
   - "Would the answer to this question change how I implement the feature?"
   - If NO, don't ask it.
   - If YES, ask it.

   **Never ask about something already in the spec**:
   - Read the spec carefully first
   - If the user already specified the schedule, don't ask about the schedule
   - If they described the UI, don't ask what it should look like

   **Examples of smart questioning:**
   - User wants "a new DAG to sync product prices" → Ask about schedule, source tables, target tables, error handling - NOT about UI or translations
   - User wants "a comparison page for products" → Ask about which products, layout preferences, data to display - NOT about Redis queues or DAG schedules
   - User wants "scrape reviews from a new site" → Ask about site structure, data to extract, queue integration - NOT about frontend components

   **Questioning Best Practices:**
   - Be concise - ask only what you genuinely need to know
   - Batch 2-3 related questions per round using `AskUserQuestion`
   - Suggest answers based on existing codebase patterns when helpful
   - Skip questions if the spec already provides the answer
   - If the spec is detailed enough, you may not need to ask anything at all

6) **Compile Enriched Specification**: After gathering all clarifications, create an enriched version of the specification that incorporates:
   - The original user input
   - All clarifications and answers from the questioning rounds
   - Any assumptions that were validated

   This enriched specification will be passed to the product-spec-writer agent.

---

## PHASE 1: Import and Setup

7) **Read Documentation Standards**: Read @workbench/standards/global/how-agents-document.md. If it doesn't exist, complain immediately and abort, asking the user to run the `/create-standards` command.

8) **Create Folder Structure**: Derive a feature-slug from $1 and generate the required folder structure as instructed in @workbench/standards/global/how-agents-document.md

9) **Copy User Specs**:
   - Copy $1 into the feature folder as `user-product-spec-{feature-slug}.md`
   - If $2 is provided, copy it as `user-technical-spec-{feature-slug}.md`
   - Copy only, do not alter these files.

10) **Save Enriched Specification**: If clarifying questions were asked in Phase 0, save the enriched specification (original + clarifications) as `enriched-user-spec-{feature-slug}.md` in the feature folder.

---

## PHASE 2: Launch Product Spec Writer

11) **Invoke Product Spec Writer**: Launch the `product-spec-writer` agent with:
    - The enriched specification (if created) OR the original user spec
    - Clear indication that input has been pre-validated and is ready for spec writing (no further questions needed)
    - Ignore the `user-technical-spec-{feature-slug}.md` for now, it is not needed at this point.

# Output Locations:

The command will create:
- `{feature-folder}/user-product-spec-{feature-slug}.md` (copied from user)
- `{feature-folder}/user-technical-spec-{feature-slug}.md` (copied from user, if provided)
- `{feature-folder}/enriched-user-spec-{feature-slug}.md` (if clarifying questions were asked)
