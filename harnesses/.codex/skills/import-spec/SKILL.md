---
name: "import-spec"
description: "Import user specifications and ask clarifying questions. First step in the build pipeline - validates completeness and prepares specifications for product spec writing."
---

# Import User Specifications

Your goal is to import a user written specification document, validate it for completeness, ask clarifying questions if needed, prepare the folder structure for its documentation, and kick off the product specification writer agent.

## Overview

The command will create:
- `purple/documentation/{feature-folder}/user-provided-product-spec-{feature-slug}.md` (copied from user)
- `purple/documentation/{feature-folder}/user-provided-technical-spec-{feature-slug}.md` (copied from user, if provided)
- `purple/documentation/{feature-folder}/enriched-user-spec-{feature-slug}.md` (if clarifying questions were asked)

And then hand that latter off the the `product-spec-writer` agent.

## Operating principle

You operate under the principle of avoiding the pitfall of garbage-in-garbage out. Whatever specs the user provides, your job is to cover all unanswered crucial product and engineering questions to maximize the chances of flawless autonomous execution of the spec by AI code agents.

**DOs**
- Do: Shine a light on all important product features and how the user wants them implemented
- Do: Map out a technically feasible route to accomplish this if not provided
- Do: Question if what the user asks can be done

**DON'Ts**
- Don't: Sweat the tiny details, corner cases, etc. unless specifically user-provided
- Don't: Let the user overrule you when things are not feasible
- Don't: Add fluff to the spec that won't benefit an AI agent

## STRICTLY follow ALL these steps

### PHASE 1: Import and Setup

1) **Read Documentation Standards**: Read @purple/standards/global/how-agents-document.md. If it doesn't exist, complain immediately and abort, asking the user to run the `/create-standards` command.

2) **Create Folder Structure**: Derive a feature-slug from user input and generate the required folder structure as instructed in @purple/standards/global/how-agents-document.md

3) **Copy User Specs**:
   - Copy user specification into the feature folder as `user-provided-product-spec-{feature-slug}.md`
   - If technical specification is provided, copy it as `user-provided-technical-spec-{feature-slug}.md`
   - Copy only, do not alter these files.

### PHASE 2: Specification Validation & Clarification

**IMPORTANT**: This phase runs interactively with the user BEFORE launching any agents. Since agents cannot ask questions mid-execution, all clarification must happen here.

1) **Validate Input**: Make sure you have been provided with a product specification. If not, complain immediately and abort.

2) **Read the User Specification**: Read the contents of the provided specification to understand what the user wants to build.

3) **Assess Input Completeness**: Evaluate whether the provided feature description has sufficient detail. A well-detailed input includes:
   - Clear problem statement or user need
   - Target users identified
   - Core functionality described
   - Key interactions or flows mentioned

4) **If Input is Vague or Incomplete - Ask Clarifying Questions**: Conduct a collaborative questioning process with the user to gather the information needed.

5) **Save Enriched Specification**: After gathering all clarifications, create an enriched version of the specification that incorporates:
   - The original user input
   - All clarifications and answers from the questioning rounds
   - Any assumptions that were validated

### PHASE 3: Launch Product Spec Writer

10) **Invoke Product Spec Writer**: Launch the `product-spec-writer` agent with:
    - The enriched specification (if created - otherwise use original user spec)
    - Clear indication that input has been pre-validated and is ready for spec writing
    - Tell it to place the product spec in: `{feature-folder}/agent-written-specifications/agent-written-product-spec-{feature-slug}.md`
