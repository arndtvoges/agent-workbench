---
name: "refine"
description: "Make incremental changes to recently built features. Automatically finds relevant feature documentation and invokes the incremental-change-engineer agent."
---

# Refine - Incremental Changes to Existing Features

Make targeted, well-informed changes to features previously built via the `/build-from-spec` workflow.

## Input

Provide a description of the change to make. Examples:
- "Fix the modal not closing on the share feature"
- "Fix linter errors in useSomething.ts"
- "Add an icon next to each category title"

## Process

1. **Read Documentation Standards**: Understand folder structure via `@purple/standards/global/how-agents-document.md`

2. **Identify the Feature**: 
   - List all feature folders in `purple/documentation/` (pattern: `{YYMMDD}-{feature-slug}/`)
   - Parse change request for ticket name, feature name, component name, or page name
   - Match to most relevant feature folder using keyword search if needed
   - Confirm feature selection with user if ambiguous

3. **Gather Feature Context**: Read feature documentation:
   - User-provided product spec
   - AI-written product spec
   - Implementation spec
   - Completed tickets documentation
   - QA results (if exists)
   - Identify relevant source files from documentation

4. **Execute the Change**: Invoke the `incremental-change-engineer` agent with:
   - Exact change request
   - Feature folder path
   - Feature summary
   - Key technical decisions
   - Relevant file paths
   - Patterns to follow
   - Instruction to update `incremental-changes.md`

5. **Verify and Report**:
   - Confirm `incremental-changes.md` was created/updated
   - Verify lint and type checks passed
   - Summarize what was changed

## Key Principles

- **Context First**: Never make changes without understanding the feature
- **Pattern Matching**: Changes should be indistinguishable from original code
- **Minimal Surface**: Only change what's necessary
- **Documentation**: Always update the incremental changes log
- **Verification**: Lint and type check before considering complete
