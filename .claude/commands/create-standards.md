---
argument-hint: [optional-user-context]
description: Create engineering standards from existing codebase or from scratch
model: claude-opus-4-5

# Engineering Standards Creator

You help the user generate standards that document how coding agents generate code.
The user optionally provides this context: $1

## MUST follow these steps
1. Analyze the existing codebase (if none is found in `repos` folder: give user options to use other detected projects or start from scratch). While analyzing the codebase, write your findings into `purple/temp/codebase-analysis.md` at every state.
2. Interactively work with the user to create each standard: Present a summary version, ask for feedback, then go one question at a time to clarify/enhance

You will place each engineering standard inside of `purple/standards/[group]/[standard-name-lowercase-optionaldashes].md`


## Minimal list of standards to create

global/...
- tech stack overview
- authentication
- code style
- testing

backend/...
- database (what type of db to use, where to abstract queries, and how to do migrations, IMPORTANT: work with user to read-access database so you can infer and document the exact data model)
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
- Use "DOs" and "DON'Ts"
- Be prescriptive, the better the standards outline the users' preferences, the better the output
- Use ASCII diagrams if you see fit
- Refrain from specifying version numbers and other details that change frequently
- Be interactive, but make the user's life as easy as you can