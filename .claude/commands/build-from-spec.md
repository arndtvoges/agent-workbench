---
argument-hint: [user-product-specification] [optional-user-technical-specification]
description: End-to-end: import spec → product spec → engineering tasks → implementation (project)
model: claude-opus-4-5
---

# Build From Spec - Complete End-to-End Pipeline

Your goal is to take a user's initial idea/specification and run the complete pipeline: import it, generate a full product spec, create engineering tasks, and orchestrate implementation - all in one flow.

This command combines the work of:
1. `/import-spec` - Setup and product spec writing
2. `/engineer-tasks-from-spec` - Engineering architecture and task breakdown
3. `/orchestrate-implementation` - Parallel implementation by senior engineers
4. `qa-engineer` agent - Basic visual verification that the implementation works

---

# Configuration

## QA_TARGET: "local" | "vercel-preview"

This setting controls where QA verification runs:

- **"local"** (default): QA runs against `http://localhost:3000`. Requires dev server to be running.
- **"vercel-preview"**: QA runs against Vercel preview deployment. Automatically creates a branch, pushes, creates a PR, and waits for deployment.

**To use Vercel preview**: Set `QA_TARGET=vercel-preview` at the start of your prompt, or answer "Vercel preview" when asked about QA target.

## GitHub MCP Tools Reference

When `QA_TARGET=vercel-preview`, use these GitHub MCP tools instead of `gh` CLI commands:

| Operation | MCP Tool |
|-----------|----------|
| Create branch | `mcp__github__create_branch` |
| Create PR | `mcp__github__create_pull_request` |
| Get PR details | `mcp__github__get_pull_request` |
| Check PR status | `mcp__github__get_pull_request_status` |
| List PR files | `mcp__github__get_pull_request_files` |
| Update PR branch | `mcp__github__update_pull_request_branch` |
| Get PR reviews | `mcp__github__get_pull_request_reviews` |

**Repository context:**
- Owner: `SlidesGPT`
- Repo: `slidesgpt-next`
- Base branch: `staging`

---

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

## PHASE 1: Import and Product Specification

6) **Read Documentation Standards**: Read @workbench/standards/global/how-agents-document.md. If it doesn't exist, complain immediately and abort, asking the user to run the `/create-standards` command.

7) **Create Folder Structure**: Derive a feature-slug from $1 and generate the required folder structure as instructed in the documentation standards:
   - `workbench/documentation/{YYMMDD}-{feature-slug}/`
   - `workbench/documentation/{YYMMDD}-{feature-slug}/agent-written-specifications/`
   - `workbench/documentation/{YYMMDD}-{feature-slug}/completed-tickets-documentation/`

8) **Copy User Specs**:
   - Copy $1 into the feature folder as `user-product-spec-{feature-slug}.md`
   - If $2 is provided, copy it as `user-technical-spec-{feature-slug}.md`
   - Copy only, do not alter these files.

9) **Save Enriched Specification**: If clarifying questions were asked in Phase 0, save the enriched specification (original + clarifications) as `enriched-user-spec-{feature-slug}.md` in the feature folder.

10) **Invoke Product Spec Writer**: Launch the `product-spec-writer` agent with:
   - The enriched specification (if created) OR the original user spec
   - Clear indication that input has been pre-validated and is ready for spec writing (no further questions needed)

   Wait for the agent to complete and verify that the following file was created:
   - `{feature-folder}/agent-written-specifications/agent-written-product-spec-{feature-slug}.md`

---

## PHASE 2: Engineering Architecture and Task Breakdown

11) **Read Engineering Standards**: Read all relevant standards from the `./workbench/standards/` directory to understand:
   - Tech stack and architecture patterns
   - Code style and testing requirements
   - Backend patterns (database, API, models)
   - Frontend patterns (components, styling)
   - Any other relevant standards

12) **Invoke Engineering Architect**: Launch the `engineering-architect` agent with:
   - The agent-written product spec
   - The user technical spec (if exists)
   - All relevant engineering standards
   - Request creation of `implementation-spec-{feature-slug}.md`

   Wait for the agent to complete and verify that the following file was created:
   - `{feature-folder}/agent-written-specifications/implementation-spec-{feature-slug}.md`

---

## PHASE 3: Orchestrated Implementation

13) **Analyze Implementation Spec**: Parse the implementation spec to identify:
   - All phases of implementation
   - All tickets within each phase
   - Dependencies between tickets
   - Files that will be created or modified by each ticket
   - Potential conflicts (multiple tickets modifying the same file)
   - Cohesion requirements (components that need consistent implementation)

14) **Intelligent Task Grouping**: Analyze tasks to determine optimal grouping:
   - **Identify Cohesive Units**: Group related components that should share similar styling, data structures, or patterns
   - **Analyze Separable Work**: Identify truly independent tasks that can be parallelized
   - **Respect Natural Boundaries**: Group by feature cohesion, layer cohesion, or data flow
   - **Balance Load**: Ensure each agent gets a reasonable amount of work

15) **Create Smart Orchestration Plan**: Design an intelligent parallelization strategy:
    - Phase Planning: Respect dependencies but maximize parallelism within phases
    - Agent Assignment: One agent per cohesive unit, specialized agents for distinct domains
    - Consistency Instructions: Clear guidelines about patterns, styling, integration points
    - Conflict Prevention: Assign clear file ownership

16) **Launch Senior Engineer Agents**: For each phase:
    - Use a SINGLE message with multiple Task tool calls to launch parallel agents
    - Assign cohesive work units to each agent
    - Provide full context (spec excerpts, standards, patterns to follow)
    - Define clear ownership boundaries and cross-agent contracts

17) **Monitor and Coordinate**: After each phase completes:
    - Verify all tickets in the phase are completed
    - Check for consistency across related components
    - Validate integration points between agent work
    - Run tests if specified
    - Move to the next phase

---

## PHASE 4: QA Verification Loop

This phase runs a QA → Fix → QA loop with a maximum of 3 attempts to ensure the implementation works correctly.

### Step 18: Determine QA Target

Check if `QA_TARGET` was specified. If not explicitly set, ask the user:

```
Where should QA verification run?
- Local (localhost:3000) - requires dev server running
- Vercel Preview - will create PR and wait for deployment
```

Set `QA_TARGET` to either `"local"` or `"vercel-preview"`.

---

### Step 19: Prepare QA Environment

#### If QA_TARGET = "local":
- Verify dev server is running at `http://localhost:3000`
- If not running, start it with `pnpm dev` in background
- Wait for server to be ready (check with curl)
- Set `QA_BASE_URL = "http://localhost:3000"`

#### If QA_TARGET = "vercel-preview":
Execute the following sub-steps using GitHub MCP tools:

**19a) Create Feature Branch** (if not already on one):
```bash
# Check current branch locally
git branch --show-current

# If on staging/main, create feature branch locally first
git checkout -b feat/{feature-slug}
```

Or use the GitHub MCP tool to create the branch on the remote:
```
mcp__github__create_branch(
  owner: "SlidesGPT",
  repo: "slidesgpt-next",
  branch: "feat/{feature-slug}",
  from_branch: "staging"
)
```

**19b) Commit All Changes Locally**:
```bash
git add -A
git commit -m "feat({feature-slug}): implement {feature-name}

🤖 Generated with Claude Code"
```

**19c) Push and Create PR using GitHub MCP**:
First push the branch:
```bash
git push -u origin feat/{feature-slug}
```

Then create the PR using the GitHub MCP tool:
```
mcp__github__create_pull_request(
  owner: "SlidesGPT",
  repo: "slidesgpt-next",
  title: "feat({feature-slug}): {feature-name}",
  head: "feat/{feature-slug}",
  base: "staging",
  body: "## Summary\nAuto-generated implementation of {feature-name}\n\n## Changes\n- [List key files/components created]\n\n## Testing\nQA verification will run against this preview deployment.\n\n🤖 Generated with Claude Code"
)
```

**19d) Wait for Vercel Deployment**:
Poll the PR for deployment status every 30 seconds (max 10 minutes) using the GitHub MCP:

```
mcp__github__get_pull_request_status(
  owner: "SlidesGPT",
  repo: "slidesgpt-next",
  pull_number: {PR_NUMBER}
)
```

Monitor for:
- **State: "pending"** → Keep waiting
- **State: "success"** → Extract preview URL and continue
- **State: "failure"** → Fetch deployment logs and report error

The preview URL follows the pattern: `https://slidesgpt-next-git-{branch-name}-slidesgpt.vercel.app`

**19e) Handle Deployment Failure** (if deployment fails):
Use GitHub MCP to get PR check details:
```
mcp__github__get_pull_request_status(
  owner: "SlidesGPT",
  repo: "slidesgpt-next",
  pull_number: {PR_NUMBER}
)
```

If deployment fails:
- Extract error message from the status response
- Report the deployment failure in QA report
- Attempt to fix build errors before retrying

**19f) Set QA URL**:
- Extract the preview URL from successful deployment
- Set `QA_BASE_URL = "{vercel-preview-url}"`

---

### Step 20: Initialize QA Loop

Set attempt counter to 1. Maximum attempts = 3.

---

### Step 21: Launch QA Engineer

Invoke the `qa-engineer` agent to perform basic visual verification:
- Provide the **feature folder path** (e.g., `workbench/documentation/251204-{feature-slug}/`)
- Provide the **feature slug** for naming the report file
- Provide context about what was built (summary of implemented features)
- List the key pages/components that were created or modified
- Specify the URL(s) to check: `{QA_BASE_URL}` + relevant paths (e.g., `/inspiration`)
- Include the current attempt number (e.g., "QA Attempt 1 of 3")
- Indicate if testing against Vercel preview (for context in report)

The QA engineer will:
- Navigate to the implemented pages using Playwright MCP
- Take screenshots to verify rendering (saved to `{feature-folder}/qa-screenshots/`)
- Check browser console for errors or warnings
- Verify new UI components actually appear on screen
- Test basic interactions (buttons click, dialogs open, etc.)
- **Save a QA report** to `{feature-folder}/qa-report-{feature-slug}.md`
- Clearly indicate PASS or FAIL status with specific issues listed

---

### Step 22: Review QA Results and Decide

- Read the QA report from `{feature-folder}/qa-report-{feature-slug}.md`
- If **PASS**: Proceed to step 24 (completion)
- If **FAIL** and attempt < 3: Proceed to step 23 (fix issues)
- If **FAIL** and attempt = 3: Proceed to step 24 with failure note

---

### Step 23: Fix Issues (only if QA failed and attempts remaining)

- Analyze the specific issues reported in the QA report
- Launch a `senior-engineer` agent to fix ONLY the reported issues:
  - Provide the exact error descriptions from the QA report
  - Specify which files likely need changes
  - Instruct to make minimal, targeted fixes (not refactoring)
- After fixes are applied, increment attempt counter

**If QA_TARGET = "vercel-preview"**:
- Commit the fixes: `git add -A && git commit -m "fix({feature-slug}): address QA issues (attempt {N})"`
- Push to update PR: `git push`
- Wait for new Vercel deployment using `mcp__github__get_pull_request_status` (repeat step 19d-19f)

- Return to step 21 (run QA again)

---

### Step 24: Finalize QA Phase

- Ensure a final QA report exists in `{feature-folder}/qa-report-{feature-slug}.md`
- The final report should reflect the last QA run
- If all attempts failed, the report should clearly document remaining issues
- **The pipeline ALWAYS ends with a QA verification as the last action**

**If QA_TARGET = "vercel-preview"**:
- Include the PR URL in the final summary
- Note whether the preview deployment is passing or failing
- **IMPORTANT: NEVER merge the PR automatically** - the PR must remain open for user review
- The user will decide whether to merge, request changes, or close the PR

---

## PHASE 5: Manual Setup Documentation

### Step 25: Create Manual Setup File

After QA completes, create `{feature-folder}/manual-setup.md` to document any manual actions the user must perform.

**Review all documentation** (implementation spec, completed tickets) to identify manual setup requirements:

- Environment variables to add
- Firebase/Firestore indexes to create
- API keys to obtain and configure
- Database migrations to run manually
- Third-party service configurations
- DNS or domain settings
- Cron jobs or scheduled tasks to configure
- Any other manual steps not handled by code

**Create the file with this format:**

```markdown
# Manual Setup Required

**Feature:** {feature-name}
**Date:** {YYYY-MM-DD}

## Checklist

Use this checklist to complete the manual setup for this feature.

### Environment Variables
- [ ] `EXAMPLE_API_KEY` - Get from [Service Dashboard](https://example.com) and add to `.env.local` and Vercel

### Firebase / Firestore
- [ ] Create composite index: Collection `users`, fields: `status` (ASC), `createdAt` (DESC)

### Third-Party Services
- [ ] Enable XYZ API in Google Cloud Console
- [ ] Configure webhook URL in Stripe Dashboard: `https://yourdomain.com/api/webhooks/stripe`

### Other
- [ ] Run database migration: `pnpm db:migrate`

---

**Note:** If no manual setup is required, this section will state "No manual setup required for this feature."
```

**If no manual setup is needed**, create the file with:

```markdown
# Manual Setup Required

**Feature:** {feature-name}
**Date:** {YYYY-MM-DD}

## Checklist

No manual setup required for this feature. All configuration is handled automatically by the implementation.
```

### Step 26: Final User Summary

Present a final summary to the user that prominently highlights the manual setup file:

```
## Build Complete!

**Feature:** {feature-slug}
**Status:** {QA PASS/FAIL}

### Manual Setup Required
**IMPORTANT:** Review `workbench/documentation/{feature-folder}/manual-setup.md` for any manual configuration steps.

{List 2-3 key items from manual-setup.md, or "No manual setup required"}

### Documentation Created
- Product Spec: `agent-written-specifications/agent-written-product-spec-{slug}.md`
- Engineering Spec: `agent-written-specifications/implementation-spec-{slug}.md`
- QA Report: `qa-report-{slug}.md`
- Manual Setup: `manual-setup.md`

### Next Steps
1. Review the manual setup checklist above
2. Test the feature at {URL}
3. Use `/refine` to make any adjustments
```

---

**QA Loop Summary**:
```
[Prepare Environment: local dev server OR create PR + wait for Vercel deploy]
     ↓
Attempt 1: QA → if FAIL → Fix → [if vercel: push + wait for deploy] →
Attempt 2: QA → if FAIL → Fix → [if vercel: push + wait for deploy] →
Attempt 3: QA → Done (pass or fail)
```

**Note**: This is a quick sanity check loop, not comprehensive testing. The goal is to catch and fix obvious issues like missing components, console errors, or broken layouts within 3 attempts.

---

# Key Principles:

- **Sequential Handoffs**: Each phase must complete before starting the next
- **Cohesion Over Speed**: Group related work together - consistency is more important than parallelism
- **Natural Work Units**: Respect logical boundaries in the codebase
- **File Isolation**: When work CAN be separated, assign different files to different agents
- **Clear Ownership**: Each agent owns complete features or layers, not fragments
- **True Parallelism**: Use a single message with multiple Task tool calls within phases

# Output Locations:

The pipeline will create:
- `{feature-folder}/user-product-spec-{feature-slug}.md` (copied from user)
- `{feature-folder}/user-technical-spec-{feature-slug}.md` (copied from user, if provided)
- `{feature-folder}/enriched-user-spec-{feature-slug}.md` (if clarifying questions were asked in Phase 0)
- `{feature-folder}/agent-written-specifications/agent-written-product-spec-{feature-slug}.md`
- `{feature-folder}/agent-written-specifications/implementation-spec-{feature-slug}.md`
- `{feature-folder}/completed-tickets-documentation/*.md` (one per completed ticket)
- `{feature-folder}/qa-screenshots/*.png` (screenshots from QA verification)
- `{feature-folder}/qa-report-{feature-slug}.md` (QA verification report)
- `{feature-folder}/manual-setup.md` (manual setup checklist for user)
- All implementation code changes as specified in the tickets

**If QA_TARGET = "vercel-preview"**, also creates:
- Git branch: `feat/{feature-slug}`
- GitHub PR with preview deployment
- PR URL included in final summary
- **Note: The PR is NEVER merged automatically - it remains open for user review**