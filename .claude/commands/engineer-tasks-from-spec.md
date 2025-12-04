---
argument-hint: [feature-folder-path]
description: Create engineering implementation plan from product spec (project)
model: claude-sonnet-4-5
---

# Create Engineering Implementation Plan

Your goal is to take the agent-written product specification and transform it into a detailed engineering implementation plan with phased tickets.

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
   - Request creation of `implementation-spec-{feature-slug}.md` in the `agent-written-specifications` folder

   The engineering-architect should create a phased implementation plan with specific tickets that can be handed to implementation engineers.

# Output Location

The engineering-architect agent must create:
`{feature-folder}/agent-written-specifications/implementation-spec-{feature-slug}.md`

This file should contain:
- Architecture overview
- Technology choices and rationale
- Phased implementation plan
- Detailed tickets with acceptance criteria
- Dependencies and sequencing
- Testing strategy
- Deployment considerations
