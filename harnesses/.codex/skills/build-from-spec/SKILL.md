---
name: "build-from-spec"
description: "End-to-end feature pipeline: import spec → product spec → engineering tasks → implementation → QA → complete delivery. Use this when you have a feature specification ready and need to build it through all phases autonomously."
---

# Build From Spec - Complete End-to-End Pipeline

## Workspace Structure

**IMPORTANT:** Before starting, understand the workspace structure:
- **`/repos/`** - Contains the actual codebase(s) you'll be building into. Explore this directory first to understand the project structure, existing patterns, and tech stack.
- **`/purple/documentation/`** - Where feature documentation is stored (specs, tickets, QA reports)
- **`/purple/standards/`** - Engineering standards and coding conventions to follow

**First Step:** Always run `ls repos/` and explore the codebase structure before writing any specs or code. Understanding the existing codebase is critical for writing accurate specifications and implementation.

## CRITICAL: AUTONOMOUS END-TO-END EXECUTION

**YOU MUST RUN THIS ENTIRE PIPELINE WITHOUT STOPPING OR ASKING FOR PERMISSION TO CONTINUE.**

This is a fully autonomous workflow. Once started, you will execute ALL phases from start to finish:
1. `/import-spec` → 2. `/engineer-tasks-from-spec` → 3. `/orchestrate-implementation` → 4. QA Loop → 5. Final Summary

**DO NOT:**
- Stop after any phase and ask "Ready to continue?" or "Should I proceed?"
- Wait for user confirmation between phases
- Consider yourself "done" until you've completed ALL phases including the final MCP signal
- End your turn while agents are still running

**DO:**
- Execute each phase immediately after the previous one completes
- Only time you can stop is to ask questions to the user in phase 1
- Keep working until you reach the final signal
- Stay active and waiting when agents are running

## Pipeline Overview

1. Run `/import-spec` with parameters [user-provided-product-specification] [optional-user-provided-technical-specification] - Setup and product spec writing
2. Run `/engineer-tasks-from-spec` - Engineering architecture and task breakdown
3. Run `/orchestrate-implementation` - Parallel implementation by senior engineers, followed by qa-fix loop

## How to Invoke

User provides a product specification or description, optionally with technical requirements. The skill automatically:
1. Imports and validates the specification
2. Generates a formal product spec
3. Creates engineering architecture and tickets
4. Orchestrates parallel implementation
5. Runs QA verification
6. Delivers completed feature with all documentation

This is a hands-off workflow - once started, the skill manages all handoffs between phases and agents.
