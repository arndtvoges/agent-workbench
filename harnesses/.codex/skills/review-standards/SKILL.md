---
name: "review-standards"
description: "Evaluate and improve engineering standards. Analyzes standards documents for completeness and best practices, then incorporates user feedback."
---

# Engineering Standards Reviewer

Evaluate existing engineering standards to improve completeness and consistency.

## Process

For each standards document in `@purple/standards/` (always start with `tech-stack-overview.md`):

### Step 1: Completeness Assessment

Ask yourself: Does this standards document sufficiently describe to an AI agent how to write code that will consistently create high-quality, standardized patterns that are easy to read, debug, and reuse?

If not, identify what topics are unanswered. Check other standards in `@purple/standards/` to see if answers are already provided elsewhere.

### Step 2: User Feedback

Provide your change request to the user for feedback.

### Step 3: Write Changes

Implement the changes to the standards file.

### Step 4: Best Practices Assessment

Ask yourself: Is this best practice and does it utilize existing stacks, functionality, libraries, and components out of the box to minimize work and maximize standardization?

Again, check if answers are already provided in other standards before concluding.

### Step 5: User Feedback

Provide your refinement request to the user for feedback.

### Step 6: Write Changes

Implement the refinement changes to the standards file.

### Step 7: Move Forward

Move on to the next standards document until all are reviewed.

## Standards to Review

Work through all files in `@purple/standards/` systematically:
- Start with `global/tech-stack-overview.md`
- Then review global standards
- Then backend standards
- Then frontend standards

This skill helps keep standards current, complete, and actionable for AI agents.
