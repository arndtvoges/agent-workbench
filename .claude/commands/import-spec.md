---
argument-hint: [user-provided-product-specification] [optional-user-provided-technical-specification]
description: Import user specifications and ask clarifying questions
model: claude-opus-4-5
---

# Import user specifications
Your goal is to import a user written specification document, validate it for completeness, ask clarifying questions if needed, prepare the folder structure for its documentation, and kick off the product specification writer agent.

## Overview

The command will create:
- `purple/documentation/{feature-folder}/user-provided-product-spec-{feature-slug}.md` (copied from user)
- `purple/documentation/{feature-folder}/user-provided-technical-spec-{feature-slug}.md` (copied from user, if provided)
- `purple/documentation/{feature-folder}/enriched-user-spec-{feature-slug}.md` (if clarifying questions were asked)

And then hand that latter off the the `product-spec-writer` agent.

## Operating principle
You operate under the principle of avoiding the pitfall of garbage-in-garbage out. Whatever specs the user provides, your job is to cover all unanswered crucial product and engineering questions to maximize the chances of flawless automous execution of the spec by AI code agents.

DOS
- Do: Shine a light on all important product features and how the user wants them implemented
- Do: Map out a technically feasible route to accomplish this if not provided
- Do: Question if what the user asks can be done

DO NOTS
- Don't: Sweat the tiny details, corner cases, etc. unless specifically user-provided
- Don't: Let the user overrule you when things are not feasible
- Don't: Add fluff to the spec that won't benefit an AI agent

## STRICTLY follow ALL these steps

### PHASE 1: Import and Setup

1) **Read Documentation Standards**: Read @purple/standards/global/how-agents-document.md. If it doesn't exist, complain immediately and abort, asking the user to run the `/create-standards` command.

2) **Create Folder Structure**: Derive a feature-slug from $1 and generate the required folder structure as instructed in @purple/standards/global/how-agents-document.md

3) **Copy User Specs**:
   - Copy $1 into the feature folder as `user-provided-product-spec-{feature-slug}.md`
   - If $2 is provided, copy it as `user-provided-technical-spec-{feature-slug}.md`
   - Copy only, do not alter these files.

### PHASE 2: Specification Validation & Clarification

**IMPORTANT**: This phase runs interactively with the user BEFORE launching any agents. Since agents cannot ask questions mid-execution, all clarification must happen here.

1) **Validate Input**: Make sure you have been provided with at least $1 (user command argument pointing to their product specification). If not, complain immediately and abort.

2) **Read the User Specification**: Read the contents of $1 (and $2 if provided) to understand what the user wants to build.

3) **Assess Input Completeness**: Evaluate whether the provided feature description has sufficient detail. A well-detailed input includes:
   - Clear problem statement or user need
   - Target users identified
   - Core functionality described
   - Key interactions or flows mentioned

4) **If Input is Vague or Incomplete - Ask Clarifying Questions**: When the feature description lacks sufficient detail, use the `AskUserQuestion` tool or a free form question to gather the information needed. Conduct a collaborative questioning process:

   **Round 1: Understand the Core**
   - What problem is being solved? What user pain point does this address?
   - Who is the primary user? What's their context?
   - What does success look like for this feature?

   **Round 2: Scope & Context**
   - What platforms/viewports are needed (desktop, mobile, tablet, technical task only like API)?
   - How does this integrate with existing features?
   - What features are excluded (what's explicitly NOT included)?

   **Round 3: Details & Edge Cases** (only if critical)
   - What happens in important error states?
   - What are the key user interactions?
   - Are there performance, security, or accessibility considerations?

   **Questioning Best Practices:**
   - Be concise but thorough - ask focused questions that extract maximum information
   - Batch 2-6 related questions per round using `AskUserQuestion` with multiple questions (if appropriate)
   - Provide options to guide thinking
   - Be opinionated when helpful - suggest best practices or common patterns when the user seems uncertain
   - If the user provides screenshots or mockups, acknowledge what you see and probe for missing information

5) **Save Enriched Specification**: After gathering all clarifications, create an enriched version of the specification that incorporates:
   - The original user input
   - All clarifications and answers from the questioning rounds
   - Any assumptions that were validated

   If clarifying questions were asked in this phase, save the enriched specification as `enriched-user-spec-{feature-slug}.md` in the feature folder. Make sure to be consise and to the point in your enrichment.

   This enriched specification will be passed to the product-spec-writer agent in the next step.


### PHASE 3: Launch Product Spec Writer

10) **Invoke Product Spec Writer**: Launch the `product-spec-writer` agent with:
    - The enriched specification (if created - otherwise use original user spec)
    - Clear indication that input has been pre-validated and is ready for spec writing (no further questions needed)
    - Tell it to place the product spec in: `{feature-folder}/agent-written-specifications/agent-written-product-spec-{feature-slug}.md`