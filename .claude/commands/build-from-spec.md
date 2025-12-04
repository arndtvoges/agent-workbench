---
argument-hint: [user-product-specification] [optional-user-technical-specification]
description: End-to-end: import spec → product spec → engineering tasks → implementation (project)
model: claude-opus-4-5
---

# Build From Spec - Complete End-to-End Pipeline

Your goal is to take a user's initial idea/specification and run the complete pipeline: import it, generate a full product spec, create engineering tasks, and orchestrate implementation - all in one flow.

This command combines the work of:
1. `/import-spec` - Setup and product spec writing
2. `/engineer-tasks-from-spec` - Engineering architecture and task breakdown
3. `/orchestrate-implementation` - Parallel implementation by senior engineers
4. `qa-engineer` agent - Basic visual verification that the implementation works

# Steps to strictly follow:

---

## PHASE 0: Specification Validation & Clarification

**IMPORTANT**: This phase runs interactively with the user BEFORE launching any agents. Since agents cannot ask questions mid-execution, all clarification must happen here.

1) **Validate Input**: Make sure you have been provided with at least $1 (user command argument pointing to their product specification). If not, complain immediately and abort.

2) **Read the User Specification**: Read the contents of $1 to understand what the user wants to build.

3) **Assess Input Completeness**: Evaluate whether the provided feature description has sufficient detail. A well-detailed input includes:
   - Clear problem statement or user need
   - Target users identified
   - Core functionality described
   - Key interactions or flows mentioned
   - Success criteria implied or stated

4) **If Input is Vague or Incomplete - Ask Clarifying Questions**: When the feature description lacks sufficient detail, use the `AskUserQuestion` tool to gather the information needed. Conduct a collaborative questioning process (typically 2-4 question rounds):

   **Round 1: Understand the Core**
   - What problem is being solved? What user pain point does this address?
   - Who is the primary user? What's their context?
   - What does success look like for this feature?

   **Round 2: Scope & Context**
   - What platforms/viewports are needed (desktop, mobile, tablet)?
   - How does this integrate with existing features?
   - What are the boundaries (what's explicitly NOT included)?

   **Round 3: Details & Edge Cases** (if needed)
   - What happens in error states?
   - What are the key user interactions?
   - Are there performance, security, or accessibility considerations?

   **Questioning Best Practices:**
   - Be concise but thorough - ask focused questions that extract maximum information
   - Batch 2-3 related questions per round using `AskUserQuestion` with multiple questions
   - Provide examples of possible answers to guide thinking
   - Be opinionated when helpful - suggest best practices or common patterns when the user seems uncertain
   - If the user provides screenshots or mockups, acknowledge what you see and probe for missing information

5) **Compile Enriched Specification**: After gathering all clarifications, create an enriched version of the specification that incorporates:
   - The original user input
   - All clarifications and answers from the questioning rounds
   - Any assumptions that were validated

   This enriched specification will be passed to the product-spec-writer agent.

---

## PHASE 1: Import and Product Specification

6) **Read Documentation Standards**: Read @workbench/standards/global/how-agents-document.md. If it doesn't exist, complain immediately and abort, asking the user to run the `/create-standards` command.

7) **Create Folder Structure**: Derive a feature-slug from $1 and generate the required folder structure as instructed in the documentation standards:
   - `workbench/documentation/{YYMMDD}-{feature-slug}/`
   - `workbench/documentation/{YYMMDD}-{feature-slug}/agent-written-specifications/`
   - `workbench/documentation/{YYMMDD}-{feature-slug}/completed-tickets-documentation/`

8) **Copy User Specs**:
   - Copy $1 into the feature folder as `user-product-spec-{feature-slug}.md`
   - If $2 is provided, copy it as `user-technical-spec-{feature-slug}.md`
   - Copy only, do not alter these files.

9) **Save Enriched Specification**: If clarifying questions were asked in Phase 0, save the enriched specification (original + clarifications) as `enriched-user-spec-{feature-slug}.md` in the feature folder.

10) **Invoke Product Spec Writer**: Launch the `product-spec-writer` agent with:
   - The enriched specification (if created) OR the original user spec
   - Clear indication that input has been pre-validated and is ready for spec writing (no further questions needed)

   Wait for the agent to complete and verify that the following file was created:
   - `{feature-folder}/agent-written-specifications/agent-written-product-spec-{feature-slug}.md`

---

## PHASE 2: Engineering Architecture and Task Breakdown

11) **Read Engineering Standards**: Read all relevant standards from the `./workbench/standards/` directory to understand:
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

## PHASE 4: QA Verification

18) **Launch QA Engineer**: After ALL implementation phases are complete, invoke the `qa-engineer` agent to perform basic visual verification:
    - Provide the **feature folder path** (e.g., `workbench/documentation/251204-{feature-slug}/`)
    - Provide the **feature slug** for naming the report file
    - Provide context about what was built (summary of implemented features)
    - List the key pages/components that were created or modified
    - Specify the URL(s) to check (typically `http://localhost:3000` + relevant paths)

    The QA engineer will:
    - Navigate to the implemented pages using Playwright MCP
    - Take screenshots to verify rendering
    - Check browser console for errors or warnings
    - Verify new UI components actually appear on screen
    - Test basic interactions (buttons click, dialogs open, etc.)
    - **Save a QA report** to `{feature-folder}/qa-report-{feature-slug}.md`

    **Note**: This is a quick sanity check, not comprehensive testing. The goal is to catch obvious issues like missing components, console errors, or broken layouts.

19) **Review QA Results**: After verification completes:
    - Review any issues reported by the QA engineer
    - Verify the QA report was saved to the feature folder
    - If critical issues found, address them before considering implementation complete
    - Note any minor issues for future improvement

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
- `{feature-folder}/user-product-spec-{feature-slug}.md` (copied from user)
- `{feature-folder}/user-technical-spec-{feature-slug}.md` (copied from user, if provided)
- `{feature-folder}/enriched-user-spec-{feature-slug}.md` (if clarifying questions were asked in Phase 0)
- `{feature-folder}/agent-written-specifications/agent-written-product-spec-{feature-slug}.md`
- `{feature-folder}/agent-written-specifications/implementation-spec-{feature-slug}.md`
- `{feature-folder}/completed-tickets-documentation/*.md` (one per completed ticket)
- `{feature-folder}/qa-report-{feature-slug}.md` (QA verification report)
- All implementation code changes as specified in the tickets