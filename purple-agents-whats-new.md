# What's New in Purple Agents

**by ./purple** | bepurple.ai | March 2026

---

## From Project-Specific to Universal Agent Orchestration

Purple Agents has evolved from a codebase-specific implementation into a **portable, universal AI development framework** — ready to drop into any project. Here's what changed.

---

## vA — Core Platform (main)

> Generalized agent orchestration. No more hardcoded repos or project-specific workflows.

### New Agents

| Agent | What it does |
|---|---|
| **backend-qa-tester** | Tests API endpoints, validates response schemas, checks error handling. Generates detailed QA reports with severity levels. |
| **cli-qa-tester** | Headless QA for CLI/TUI apps via tmux. Captures screen states, navigates interfaces, verifies output. |

*Total: 7 agents (up from 5) — product-spec-writer, engineering-architect, senior-engineer, incremental-change-engineer, qa-engineer (web), backend-qa-tester, cli-qa-tester.*

### Architecture Changes

- **Portable by design** — No hardcoded repos, branches, or org names. Drop `.claude/` into any project and it works.
- **`purple/` folder structure** — Replaces project-specific `workbench/` directory. Clean separation: `purple/standards/`, `purple/documentation/`, `purple/temp/`.
- **3 specialized QA agents** — Web (Playwright), API (curl/jq), CLI (tmux) — instead of one web-only QA agent.
- **Streamlined command set** — 7 focused commands.
- **Cleaner `/build-from-spec` pipeline** — Delegates Phase 0 to `/import-spec`. Autonomous end-to-end execution with no stops between phases.
- **`repos/` directory** — Supports multi-repo workspaces under a single agent-workbench.

---

## vB — Agent Teams (agent_teams branch)

> From command-and-control orchestration to **autonomous team collaboration**.

### The Big Shift

Engineers are no longer one-shot subprocesses. They become **long-lived team members** with shared task lists, ownership zones, and direct messaging.

### What's New

| Capability | Before (vA) | Now (vB) |
|---|---|---|
| **Agent lifecycle** | Spawn → execute → return result → die | Spawn → claim tasks → message teammates → complete → shutdown |
| **Task coordination** | Orchestrator assigns work sequentially by phase | Shared task list — engineers self-claim unblocked tasks |
| **Communication** | None between agents | Auto-delivered messages (completion, blockers, interface changes) |
| **QA fix loop** | QA → orchestrator → `/refine` → new agent | QA messages the responsible engineer directly — no middleman |
| **Parallelism** | Parallel within phases, sequential across phases | ALL engineers spawned in a single message, work across phases |
| **Ownership** | Implicit file isolation | Explicit ownership zones assigned per engineer |

### How It Works

1. **Team creation** — Orchestrator creates a named team (`impl-{feature}`) with a shared task list
2. **Task mapping** — ALL tickets loaded upfront with dependencies tracked
3. **Engineer spawning** — 1–4 engineers based on ticket count, each assigned an ownership zone
4. **Autonomous work** — Engineers claim tasks, build, and message teammates about interface changes
5. **QA integration** — QA agents join the team, message engineers directly with failures
6. **Structured shutdown** — Team lead sends shutdown requests; engineers confirm or reject

### Agent Upgrades

All four operational agents (`senior-engineer`, `qa-engineer`, `backend-qa-tester`, `cli-qa-tester`) received new **"When Working as a Team Member"** sections defining:

- How to claim and prioritize tasks from the shared list
- When and how to message teammates (completions, blockers, interface changes)
- How to handle QA failure messages and create fix tasks
- Shutdown protocol (approve/reject with reason)

---

## Quick Comparison

|  | slidesgpt (old) | vA (main) | vB (agent_teams) |
|---|---|---|---|
| **Agents** | 5 | 7 | 7 (with team behavior) |
| **Commands** | 13+ | 7 | 7 (rewritten orchestration) |
| **Portable** | No (hardcoded to SlidesGPT) | Yes | Yes |
| **QA coverage** | Web only | Web + API + CLI | Web + API + CLI |
| **Agent communication** | None | Via orchestrator | Direct messaging |
| **Task management** | Orchestrator-driven | Orchestrator-driven | Shared task list |
| **Status reporting** | None | purple_status MCP | purple_status MCP |
| **Ownership model** | Implicit | Implicit | Explicit zones |
| **GitHub Actions support** | Yes (built-in) | No (add separately) | No (add separately) |

---

<p align="center"><sub>Purple Agents is maintained by <strong>./purple</strong> — AI-powered development workflows.<br>hello@bepurple.ai · bepurple.ai</sub></p>
