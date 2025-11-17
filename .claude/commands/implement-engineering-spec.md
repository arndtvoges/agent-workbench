---
argument-hint: [implementation-spec-path]
description: Import user specifications
model: claude-haiku-4-5
---

# Implement Engineering Specification

Launch senior-engineer agents to implement tickets from an engineering implementation specification.

## Usage

```
/implement-engineering-spec <path-to-implementation-spec>
```

## What This Command Does

1. **Reads the implementation spec** from the provided path
2. **Parses all phases and tickets** with their dependencies
3. **Displays an ASCII tree** showing all phases, tickets, dependencies, and effort estimates
4. **Asks execution mode**: Proceed through all phases continuously, or review after each phase?
5. **Launches senior-engineer agents**: One agent per ticket, respecting dependencies
6. **Tracks progress** with TodoWrite
7. **Reports completion** after each phase (if review mode selected)

## Instructions for Claude

### Step 1: Read and Parse Implementation Spec

Read the implementation spec file at the provided path (argument $1). Parse it to extract:

- **Phase number and name**
- **Tickets within each phase**:
  - Ticket ID (e.g., "PHASE-1-A")
  - Ticket title
  - Estimated effort (S/M/L/XL)
  - Dependencies (which other tickets must complete first)
  - Files to create/modify
  - Acceptance criteria
  - Technical approach

### Step 2: Create ASCII Tree Visualization

Display a tree showing all phases and tickets with this format:

```
Feature Name Implementation
│
├─ Phase 1: Phase Name (X tickets)
│  ├─ [S] PHASE-1-A: Ticket title
│  ├─ [M] PHASE-1-B: Ticket title
│  └─ [M] PHASE-1-C: Ticket title (depends on PHASE-1-A)
│
├─ Phase 2: Phase Name (Y tickets)
│  ├─ [M] PHASE-2-A: Ticket title (depends on PHASE-1-B)
│  ├─ [S] PHASE-2-B: Ticket title
│  └─ [L] PHASE-2-E: Ticket title (depends on PHASE-2-A,B,C,D)
│
└─ Phase 3: Phase Name (Z tickets)
   └─ [M] PHASE-3-A: Ticket title

Total: N tickets across M phases
```

Legend:
- [S] = Small effort
- [M] = Medium effort
- [L] = Large effort
- [XL] = Extra Large effort

### Step 3: Ask Execution Mode

Use the AskUserQuestion tool to ask:

**Question:** "How would you like to proceed with implementation?"

**Options:**
1. "Continuous - Implement all phases without interruption"
2. "Phase-by-phase - Review after each phase completes"

Store the user's choice for later use.

### Step 4: Create Todo List

Create a comprehensive TodoWrite list with ALL tickets from the implementation spec. Format:

- content: "PHASE-X-Y: Brief ticket title"
- status: "pending"
- activeForm: "Present continuous form of ticket title"

Example:
```
{ content: "PHASE-1-A: Move dashboard route", status: "pending", activeForm: "Moving dashboard route" }
```

### Step 5: Implement Each Phase

For each phase in sequence:

#### 5a. Analyze Ticket Dependencies

Within the current phase, identify:
- **Independent tickets**: No dependencies, can run in parallel
- **Dependent tickets**: Must wait for other tickets, run sequentially

#### 5b. Launch `senior-engineer` Agents
- Launch one `senior-engineer` agent for each ticket
- Launch in parallel where allowed
- Remind `senior-engineer` of the folder path for documentating their implementation
- Wait for prerequisite tickets to complete where dependency exists

#### 5d. Update Todo List

After each ticket completes:
- Mark the ticket as "completed" in TodoWrite
- Mark the next ticket(s) as "in_progress"
- Display the updated todo list to the user formatted as the ASCII tree above

#### 5e. Phase Completion

After all tickets in a phase complete:

**If continuous mode:**
- Log phase completion
- Proceed immediately to next phase

**If phase-by-phase mode:**
- Report phase completion to user
- Show summary of changes
- Ask: "Phase X complete. Proceed to Phase Y?"
- Wait for user confirmation before continuing

### Step 6: Final Report

After all phases complete, provide:

1. **Summary of all tickets implemented**
2. **Files created/modified across all phases**
3. **Reminder to run manual testing**
4. **Reminder to run `npm run lint` in affected repositories**
5. **Next steps** (e.g., create PR, deploy, etc.)

## Important Notes

- **One ticket = One senior-engineer agent** (always)
- **Dependencies are defined in the implementation spec** (not guessed)
- **Parallel execution maximizes efficiency** for independent tickets
- **Sequential execution ensures correctness** for dependent tickets
- **User controls the pace** (continuous vs phase-by-phase)
- **Standards compliance is mandatory** for all agents

## Error Handling

If a senior-engineer agent fails to complete a ticket:
1. Mark the ticket as "failed" in TodoWrite
2. Report the error to the user
3. Ask: "Retry this ticket, skip it, or abort remaining phases?"
4. Proceed based on user choice

ARGUMENTS: $1 (path to implementation spec)
