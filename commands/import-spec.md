---
argument-hint: [user-product-specification] [optional-user-technical-specification]
description: Import user specifications
model: claude-opus-4-5
---

# Import user specifications
Your goal is to import a user written specification document, validate it for completeness (asking clarifying questions if needed), prepare the folder structure for its documentation, and kick off the product specification writer agent.

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

## PHASE 1: Import and Setup

6) **Read Documentation Standards**: Read @workbench/standards/global/how-agents-document.md. If it doesn't exist, complain immediately and abort, asking the user to run the `/create-standards` command.

7) **Create Folder Structure**: Derive a feature-slug from $1 and generate the required folder structure as instructed in @workbench/standards/global/how-agents-document.md

8) **Copy User Specs**:
   - Copy $1 into the feature folder as `user-product-spec-{feature-slug}.md`
   - If $2 is provided, copy it as `user-technical-spec-{feature-slug}.md`
   - Copy only, do not alter these files.

9) **Save Enriched Specification**: If clarifying questions were asked in Phase 0, save the enriched specification (original + clarifications) as `enriched-user-spec-{feature-slug}.md` in the feature folder.

---

## PHASE 2: Launch Product Spec Writer

10) **Invoke Product Spec Writer**: Launch the `product-spec-writer` agent with:
    - The enriched specification (if created) OR the original user spec
    - Clear indication that input has been pre-validated and is ready for spec writing (no further questions needed)
    - Ignore the `user-technical-spec-{feature-slug}.md` for now, it is not needed at this point.

# Output Locations:

The command will create:
- `{feature-folder}/user-product-spec-{feature-slug}.md` (copied from user)
- `{feature-folder}/user-technical-spec-{feature-slug}.md` (copied from user, if provided)
- `{feature-folder}/enriched-user-spec-{feature-slug}.md` (if clarifying questions were asked)
