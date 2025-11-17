---
argument-hint: [user-product-specification] [optional-user-technical-specification]
description: Import user specifications
model: claude-haiku-4-5
---

# Import user specifications
Your goal is to import a user written specification document, prepare the folder structure for its documentation, and kick off the product specification writer agent.

# Steps to strictly follow:
1) Make sure you have been provided with at least $1 (user command argument pointing to their product specification). If not, complain immediately and abort.
2) Read @standards/global/how-agents-document.md. If it doesn't exist, complain and immediately and abort, asking the user to run the `/create-standards` command.
3) Derive a feature-slug from $1 and generate the required folder structure as instructed in @standards/global/how-agents-document.md
4) Copy $1 over into the feature folder as `user-product-spec-{feature-slug}.md` and (if provided) copy $2 as `user-technical-spec-{feature-slug}.md`. Copy only, do not alter these.
5) Invoke the `product-spec-writer` agent by pointing them to the `user-product-spec-{feature-slug}.md` file. Ignore the `user-technical-spec-{feature-slug}.md` for now, it is not needed at this point.
6) After the `product-spec-writer` agent completes, ask the user: "Product specification created. Would you like to proceed with the engineering-architect agent to create the implementation plan?" DO NOT automatically proceed. Wait for explicit user confirmation.
7) If the user confirms, invoke the `engineering-architect` agent by pointing them to BOTH the newly created `agent-written-product-spec-{feature-slug}.md` AND `user-technical-spec-{feature-slug}.md` (if it exists).
8) After the `engineering-architect` agent completes, ask the user: "Implementation specification created at [path]. Would you like to proceed with implementation using the /implement-engineering-spec command?" DO NOT automatically launch implementation. Wait for explicit user confirmation.