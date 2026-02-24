---
argument-hint: <tool-name> (e.g., amplitude, launchdarkly, stripe)
description: Scan a SaaS tool with vendor-rip, then build its replacement via /build-from-spec
model: claude-opus-4-5
---

# Rip and Build — SaaS Replacement Pipeline

This command orchestrates the full journey from SaaS dependency analysis to a production-ready replacement. It connects two systems: **vendor-rip** (scan, assess, plan) and **/build-from-spec** (implement, test, ship).

```
┌──────────────────────────────────────────────────────────────────────┐
│  vendor-rip (phases 1-3)           │  /build-from-spec (phases 1-5) │
│  Scan → Calibrate → Plan    ──────▸  Spec → Architect → Build → QA │
└──────────────────────────────────────────────────────────────────────┘
```

## CRITICAL: AUTONOMOUS END-TO-END EXECUTION

**YOU MUST RUN THIS ENTIRE PIPELINE WITHOUT STOPPING OR ASKING FOR PERMISSION TO CONTINUE BETWEEN THE TWO MAJOR STAGES.**

The only places you pause are where vendor-rip explicitly asks the developer for input (insights codes, plan confirmation) and at the transition point where the generated product spec is shown before build begins.

---

## Stage 1: Vendor-Rip Assessment (Phases 1-3 only)

Run the vendor-rip skill for the specified tool, but **stop after Phase 3 (Plan)**. Do NOT execute Phase 4 (Execute) or Phase 5 (Validate & Complete).

### Step 1: Run Scan (vendor-rip Phase 1)

Execute the full vendor-rip scan methodology for `<tool-name>`:
- Find the SDK in `repos/` dependency files
- Map integration points
- Map to features
- Assess complexity
- Collect evidence
- Produce and display the scan report
- Save `vendor-rip-report.json` in the target repo root

### Step 2: Community Calibration (vendor-rip Phase 2)

Follow vendor-rip's calibration flow:
- Display the calibration summary for the developer to copy/paste at https://vendor.rip/calibrate
- Wait for the developer to paste an insights code or press Enter to skip
- If insights are provided, incorporate them into context

### Step 3: Generate Migration Plan (vendor-rip Phase 3)

Follow vendor-rip's planning methodology:
- Select migration approach based on scan results and calibration data
- Generate phased plan with tasks, pitfalls, and validation criteria
- Save `vendor-rip-plan.json` in the target repo root
- Display the plan and ask "Ready to start? (y/n)"

**When the developer confirms**: proceed to Stage 2. Do NOT enter vendor-rip's Phase 4.

---

## Stage 2: Translate Plan to Product Spec

This is the bridge between vendor-rip's analysis and the build pipeline. You transform the structured migration plan into a product specification that `/build-from-spec` can consume.

### Step 4: Read All Artifacts

Read the following files produced by Stage 1:
- `vendor-rip-report.json` — scan data (integration points, features, complexity, data dependencies)
- `vendor-rip-plan.json` — migration plan (phases, approach, tasks, risks)
- Community calibration data (if received)

### Step 5: Synthesize Product Spec

Write a product specification document that describes **what to build** (the replacement), not what to remove. This spec must be written from a product perspective, as if you were describing a new internal module to a team that doesn't know about the SaaS tool being replaced.

The spec must include:

**1. Product Overview**
- What this module/system does (described in terms of capabilities, not "replace X")
- Why it exists (cost savings, control, customization — reference vendor-rip's assessment)
- Where it fits in the existing architecture

**2. Feature Requirements**
For each feature identified in the scan report:
- What the feature does (in product terms)
- Current usage patterns (calls count, files involved — from scan data)
- Acceptance criteria (the replacement must handle all current call patterns)
- Complexity notes (from vendor-rip's assessment)

**3. Technical Context**
- Current SDK and version being replaced
- Integration pattern observed (wrapper/scattered/embedded)
- Data dependencies (env vars, config files, API keys, data stores — from scan)
- Existing tech stack context (what's already in the repo)

**4. Migration-Specific Requirements**
- The chosen migration approach and rationale (from vendor-rip plan)
- Parallel run requirements (if applicable)
- Rollback strategy
- Cleanup checklist: old SDK packages to remove, config to delete, env vars to clean up
- Validation criteria per phase (from vendor-rip plan)

**5. Risk Flags & Gotchas**
- Key risks from vendor-rip's assessment
- Community-reported gotchas (if calibration data was received)
- Features that are harder than they look

**6. Out of Scope**
- Features of the SaaS tool that were NOT detected in the scan (not used, don't need replacement)
- Data migration decisions (export/import) — flag these for the developer to decide

### Step 6: Present Spec for Review

Display a summary of the synthesized product spec to the developer:

```
## Migration Spec Ready

**Replacing:** {tool} ({sdk_package} v{sdk_version})
**Approach:** {approach}
**Features to build:** {feature_count}
  - {feature_1} ({complexity})
  - {feature_2} ({complexity})
  ...

**Key risks:**
  - {risk_1}
  - {risk_2}

This spec will be passed to /build-from-spec for implementation.
Proceed? (y/n)
```

If the developer wants changes, adjust the spec. If they confirm, proceed.

---

## Stage 3: Build the Replacement

### Step 7: Hand Off to /build-from-spec

Invoke `/build-from-spec` with the synthesized product specification as the user-provided product spec.

Additionally, construct a technical specification that includes:
- The migration approach details from `vendor-rip-plan.json`
- The data dependencies and integration point details from `vendor-rip-report.json`
- Specific instructions about the parallel run strategy (if applicable)
- The cleanup checklist (packages to remove, config to delete)
- Validation criteria from the vendor-rip plan

`/build-from-spec` will then execute its full autonomous pipeline:
1. Import spec and clarify (should need minimal clarification since the spec is already detailed)
2. Engineering architecture — break down into phased tickets
3. Orchestrated implementation — parallel senior engineers
4. QA verification loop
5. Manual setup documentation

### Step 8: Post-Build Vendor-Rip Validation

After `/build-from-spec` completes, run vendor-rip's validation checks as a final layer:

1. **Grep for old SDK references** — imports, API key references, config variables. There should be none.
2. **Verify dependency removal** — confirm old packages are gone from dependency files and lock file.
3. **Compute post-migration lock hash** — same methodology as vendor-rip Phase 5, Step 2.

If old references remain, flag them clearly — some may be intentional (comments, docs) and some may be missed cleanup.

### Step 9: Completion Report

Display the combined completion summary:

```
┌──────────────────────────────────────────────────────────────────────┐
│  ✓ Scan   ✓ Plan   ✓ Build   ✓ QA   ✓ Validate   ▸ Done           │
└──────────────────────────────────────────────────────────────────────┘

{tool} replacement complete | {approach}

  Features built:
    - {feature_1} ({complexity})
    - {feature_2} ({complexity})
    ...

  Old SDK cleanup:
    - Packages removed: {yes/no}
    - Config cleaned: {yes/no}
    - Remaining references: {count} (details in report)

  Build pipeline results:
    - QA: {PASS/FAIL}
    - Manual setup: see purple/documentation/{feature-folder}/manual-setup.md

  Saved: ./vendor-rip-completion.json
```

Then present the vendor-rip completion calibration flow:

```
────────────────────────────────────────────────────────────────
  Next: See what teams like yours did after this.

  1. Copy the block below
  2. Paste at https://vendor.rip/calibrate
  3. Paste the insights code you get back here

  tool: {tool_name}
  sdk: {sdk_package}@{sdk_version}
  features:
    - {feature}: {calls_count} calls -> replaced
  approach: {approach}
  outcome: {outcome}
  evidence:
    lock_hash_before: {sha256}
    lock_hash_after: {sha256}
  session: {token or empty}

  (saved to ./vendor-rip-completion-calibrate.txt)
────────────────────────────────────────────────────────────────

Insights code: ___ (or Enter to finish)
```

Handle the response per vendor-rip's Phase 5 flow (insights or skip).

---

## Key Principles

- **vendor-rip owns analysis**: Scan, calibration, and planning are vendor-rip's domain. Follow its methodology exactly.
- **/build-from-spec owns implementation**: Architecture, parallel builds, and QA are the build pipeline's domain. Don't try to replicate vendor-rip's single-agent execution.
- **The translation layer is the bridge**: The synthesized product spec must be detailed enough that `/build-from-spec` can work autonomously, while faithfully representing what vendor-rip discovered.
- **Developer checkpoints**: The developer confirms at three points: (1) after scan/calibration, (2) after plan, (3) after spec synthesis. Once build starts, it runs autonomously per `/build-from-spec` rules.
- **All vendor-rip artifacts are preserved**: `vendor-rip-report.json`, `vendor-rip-plan.json`, and calibration files stay in the repo root alongside the build pipeline's documentation in `purple/documentation/`.