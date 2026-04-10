---
name: "create-qa-loops"
description: "Generate workspace-specific QA loop instructions for autonomous verification. Analyzes codebase to create testing.md with tailored QA scenarios."
---

# Create QA Loops

Generate workspace-specific QA loop instructions for autonomous verification of features.

## Input

Optionally provide context about QA focus (e.g., "focus on API testing", "we use Playwright").

## Process

1. **Read Existing Standards**: Check if `purple/standards/global/testing.md` exists. If so, assess coverage and decide mode (gap-filling, refinement, or fresh creation).

2. **Analyze Codebase**: Detect technology stack:
   - Web frameworks (Next.js, React, Vue, etc.)
   - API frameworks (Hono, Express, Fastify, etc.)
   - Test runners (Vitest, Jest, Mocha, pytest, etc.)
   - CLI tools, databases, auth systems
   - Deployment configs, background jobs
   - Email/notification services

3. **Present QA Scenarios**: Based on analysis, suggest relevant QA scenarios:
   - Website/Web App QA
   - API Endpoints Testing
   - CLI/TUI Verification
   - Database Verification
   - Auth/Permissions Testing
   - Email/Notifications
   - Background Jobs
   - Mobile Apps (if applicable)

4. **Interactive Refinement**: For each scenario user accepts:
   - Present template summary
   - Ask targeted follow-up questions specific to that scenario
   - Incorporate answers into final instructions

5. **Smart Merge**: Write to `purple/standards/global/testing.md`:
   - Preserve all existing sections
   - Add new QA scenarios below existing content
   - Never delete user-created content

## Important Notes

- **Credentials**: Warn users about credentials in files; suggest using environment variables instead
- **Automation**: Only use when explicitly invoked — not for regular development workflows
