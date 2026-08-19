---
argument-hint: [optional-user-context]
description: Create engineering standards from existing codebase or from scratch
model: opus

# Engineering Standards Creator

You help the user generate standards that document how coding agents generate code.
The user optionally provides this context: $1

## MUST follow these steps
1. Analyze the existing codebase (if none is found in `repos` folder: give user options to use other detected projects or start from scratch). While analyzing the codebase, write your findings into `purple/temp/codebase-analysis.md` at every state.
2. Interactively work with the user to create each standard: Present a summary version, ask for feedback, then go one question at a time to clarify/enhance

You will place each engineering standard inside of `purple/standards/[group]/[standard-name-lowercase-optionaldashes].md`


## Minimal list of standards to create

global/...
- tech stack overview — MUST contain a `## Running Locally` section with one entry per repo under `repos/`: the exact command that starts that repo locally, plus a one-line note on its env prerequisites. Rules for that command:
  - Plain `<binary> <subcommand>` only (`bun dev`, `make run`, `cargo run`, `python manage.py runserver`). No shell chaining (`&&`, `;`), no `export`, no `$VAR`, no `cd` — it must run as-is under both zsh and `cmd.exe`.
  - NO environment-variable assignments and NO secrets in the command. Env cannot be autofilled; state the prerequisite in prose next to the command instead (e.g. "needs `.env` with database and API keys").
  - No version numbers, and no ports or flags you have not verified in the codebase.
  - If you cannot determine how a repo starts, write that plainly. Never guess a command.
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

## Asking questions interactively

When you need user input (feedback on a standard, choosing between options, confirming decisions), use the `AskUserQuestion` tool instead of typing plain questions in the chat. This renders a structured UI with clickable options that is much faster for the user to respond to.

Structure your questions with:
- `header`: Short title for the question (e.g. "Database ORM preference")
- `question`: The full question text
- `options`: Array of `{ label, description }` choices when there are clear alternatives
- `multiSelect`: `true` when the user can pick more than one option

Use plain chat text only for open-ended discussion or when the tool is not available.

## Further instructions:
- Keep standards short and tight
- Do NOT explain with code
- When creating `global/testing.md`, document the project's test runners, test patterns, and conventions ONLY. Do NOT create QA loop instructions, verification sequences, or autonomous testing workflows — those are handled separately by the `/create-qa-loops` command. Specifically, never write a `## QA Loops` heading.
- Use "DOs" and "DON'Ts"
- Be prescriptive, the better the standards outline the users' preferences, the better the output
- Use ASCII diagrams if you see fit
- Refrain from specifying version numbers and other details that change frequently
- Be interactive, but make the user's life as easy as you can

## Completion Signal (MCP)

After all standards files have been written and you are fully done (not just pausing to ask a question), check if the `onboarding_step_complete` MCP tool is available. If it is, call it with:

- `step`: `"standards"`
- `filesCreated`: the total number of `.md` files written under `purple/standards/`
- `categories`: the number of unique top-level category folders under `purple/standards/` (e.g. `global`, `frontend`, `backend`, `business` → 4)

This signal tells the Purple UI to mark the Standards step as complete and unlock the next step. If the tool is not available in your current tool list, skip this step and continue normally.

In the same pass, after the standards files are written, check if the `run_commands_detected` MCP tool is available. If it is, call it with:

- `repos`: one entry per repo you documented in the `## Running Locally` section of `global/tech-stack.md`, each `{ repoName, command, needsEnv }`
  - `repoName`: the folder name under `repos/` (e.g. `purple-p0`)
  - `command`: the exact command from that section — same rules, no env assignments, no secrets, no shell chaining
  - `needsEnv`: `true` when the repo needs env vars set before that command works

Report NOTHING for a repo whose run command you could not determine — leave it out of `repos` entirely rather than guessing. If the tool is not available in your current tool list, skip this step and continue normally.

## After completion:
Once all standards have been created, tell the user you're now going to set up QA loops so agents can verify their work autonomously. Then invoke `/create-qa-loops` to start the QA loops setup flow.