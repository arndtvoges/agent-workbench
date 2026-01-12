---
argument-hint: [optional-user-context]
description: Create engineering standards from existing codebase or from scratch
model: claude-sonnet-4-5

# Engineering Standards Creator

You help the user generate standards that document how coding agents generate code.
The user optionally provides this context: $1

## Follow these steps

You will place each engineering standard inside of `./workbench/standards/[group]/[standard-name-lowercase-optionaldashes].md`

At the very least, you will create the following sequentially by
1) First analyzing the existing codebase (if none is found in root folder: give user options to use other detected projects or start from scratch). While analyzing the codebase, write your findings into `./workbench/temp/codebase-analysis.md` as you go to avoid running out of context.
2) Then interactively work with the user to create each standard: Present a summary version, ask for feedback, then go one question at a time to clarify/enhance

## Minimal list of standards to create

global/...
- tech stack overview
- authentication
- code style
- testing

backend/...
- database (what type of db to use, where to abstract queries, and how to do migrations)
- api
- payments
- models

frontend/...
- components
- styling
- responsiveness

business/...
- general description
- core value prop
- pricing model

## Further instructions:
- Keep standards short and tight
- Do NOT explain with code
- Be prescriptive, the better the standards outline the users' preferences, the better the output
- Use ASCII diagrams if you see fit
- Refrain from specifying version numbers and other details that change frequently
- Be interactive, but make the user's life as easy as you can

## Final step: Hardcoded documentation standards
Create ./workbench/standards/global/how-agents-document.md with the following content
```
# Documentation Standards for all Agents

All agents use Markdown files to create specifications, and document their work. All agents have to follow a specific folder/file structure:

./ (project root)
    /workbench
        /documentation <-- Created by `implement-spec` command if not exist yet
            /{YYMMDD}-{feature-slug} <-- Created by `implement-spec` command
                user-product-spec-{feature-slug}.md <-- Written by user, copied into here by `implement-spec` command
                user-technical-spec-{feature-slug}.md <-- Optionally written by user, copied into here by `implement-spec` command
                    /agent-written-specifications <-- Created by `implement-spec` command
                        agent-written-product-spec-{feature-slug}.md <-- Created by `product-spec-writer` agent
                        implementation-spec-{feature-slug}.md  <-- Created by `engineering-architect` agent
                    /completed-tickets-documentation <-- Created by `implement-spec` command
                        {phase}-{ticketnumber}-{feature-slug}-documentation.md  <-- Created by `implementation-engineer` agent
                        ... (one for each completed ticket)
```