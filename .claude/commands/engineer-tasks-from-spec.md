---
argument-hint: [feature-folder-path]
description: Create engineering implementation plan from product spec (project)
model: claude-sonnet-4-5
---

# Create Engineering Implementation Plan

Your goal is to take the agent-written product specification and transform it into a detailed engineering implementation plan with phased tickets.

# Steps to strictly follow:

1) **Validate Input**: Make sure you have been provided with $1 (the path to the feature documentation folder, e.g., `purple/documentation/251114-analytics-dashboard`). If not, complain immediately and abort.

2) **Read Documentation Standards**: Read @purple/standards/global/how-agents-document.md to understand the folder structure. If it doesn't exist, complain immediately and abort, asking the user to run the `/create-standards` command.

3) **Locate Agent Written Product Spec**: Find and verify that the following file exists in the provided folder:
   - `purple/documentation/{feature-folder}/agent-written-specifications/agent-written-product-spec-{feature-slug}.md`

   If this file doesn't exist, complain and abort, informing the user to run `/import-spec` first.

4) **Locate User-Provided Technical Context**: Find out if the user-provided technical spec exists to make sure to include it in the next step:
   - `purple/documentation/{feature-folder}/user-provided-technical-spec-{feature-slug}.md`

5) **Invoke Engineering Architect**: Launch the `engineering-architect` agent with the following context:
   - Point to the agent-written product spec
   - (If exists) point to the user-provided technical spec
   - Provide all relevant engineering standards
   - Request creation of `implementation-spec-{feature-slug}.md` in the `agent-written-specifications` folder

   The engineering-architect is tasked create a phased implementation plan with specific tickets that can be handed to implementation engineers.

# Output Location

The engineering-architect agent must create:
`purple/documentation/{feature-folder}/agent-written-specifications/implementation-spec-{feature-slug}.md`