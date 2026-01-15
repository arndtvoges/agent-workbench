---
argument-hint: [feature-folder-path]
description: "Step 3: Spawn parallel senior engineers to implement all tickets"
model: claude-sonnet-4-5
---

# Orchestrate Parallel Implementation

Your goal is to take the engineering implementation specification and orchestrate multiple senior engineer agents working in parallel to efficiently implement all tasks while maintaining consistency and architectural integrity.

---

## Progress Tracking

**CRITICAL**: You MUST use `progress.json` for accurate progress tracking. This file is the single source of truth for implementation status.

### Reading Progress

At the start of orchestration:
1. Read `{feature-folder}/progress.json`
2. Parse phases and tickets from the file
3. Use this data for orchestration planning

### Updating Progress

- Use `purple_progress_start_ticket` when assigning a ticket to an agent
- Use `purple_progress_complete_ticket` when a ticket is done
- Update phase status when all tickets in a phase complete

### Status Bar Updates

Also update the Purple CLI status bar for visual feedback:
- `purple_update_status` - Full status update with all fields
- `purple_set_phase` - Quick helper to set just the phase
- `purple_report_progress` - Report ticket progress

**At start of orchestration**, call `purple_update_status` with:
- phase: "3 - Implementation"
- agent: "orchestrator"
- mode: "plan"
- currentTicket: 0
- totalTickets: {from progress.json summary}

**As tickets complete**, the progress.json file will be updated by senior-engineer agents. Read it periodically to get accurate counts.

See `@workbench/standards/global/how-agents-document.md` for the full progress.json schema.

---

# Steps to strictly follow:

1) **Validate Input**: Make sure you have been provided with $1 (the path to the feature documentation folder, e.g., `documentation/251114-analytics-dashboard`). If not, complain immediately and abort.

2) **Read Documentation Standards**: Read @workbench/standards/global/how-agents-document.md to understand the folder structure. If it doesn't exist, complain immediately and abort.

3) **Locate Implementation Spec and Progress File**: Find and verify that the following files exist in the provided folder:
   - `{feature-folder}/agent-written-specifications/implementation-spec-{feature-slug}.md`
   - `{feature-folder}/progress.json`

   If these files don't exist, complain and abort, informing the user to run `/engineer-tasks-from-spec` first.

   **Read progress.json** to get the current state of all phases and tickets. Use this as your source of truth for what needs to be implemented.

4) **Read Engineering Standards**: Read all relevant standards from the `./workbench/standards/` directory to understand:
   - Tech stack and architecture patterns
   - Code style and testing requirements
   - Backend patterns (database, API, models)
   - Frontend patterns (components, styling)
   - File organization and naming conventions
   - Any other relevant standards

5) **Analyze Implementation Spec**: Parse the implementation spec to identify:
   - All phases of implementation
   - All tickets within each phase
   - Dependencies between tickets
   - Files that will be created or modified by each ticket
   - Potential conflicts (e.g., multiple tickets modifying the same file)
   - **Cohesion requirements** (components that need consistent implementation)

6) **Intelligent Task Grouping**: Analyze tasks to determine optimal grouping:
   - **Identify Cohesive Units**: Group related components that should share:
     - Similar visual styling or UI patterns
     - Common data structures or types
     - Shared business logic or calculations
     - Similar architectural patterns
   - **Analyze Separable Work**: Identify truly independent tasks that can be parallelized:
     - Different feature areas with no shared dependencies
     - Distinct backend services or API endpoints
     - Independent utility functions or helpers
   - **Respect Natural Boundaries**: Group by:
     - Feature cohesion (all widgets of same type together)
     - Layer cohesion (all API endpoints together, all UI components together)
     - Data flow (components that share data models)
   - **Balance Load**: Ensure each agent gets a reasonable amount of work

7) **Create Smart Orchestration Plan**: Design an intelligent parallelization strategy:
   - **Phase Planning**: Respect phase dependencies but maximize parallelism within phases
   - **Agent Assignment Strategy**:
     - One agent per cohesive unit (e.g., "all dashboard widgets")
     - One agent for shared foundations (types, contexts, utilities)
     - Specialized agents for distinct domains (auth, data, UI)
   - **Consistency Instructions**: Give each agent clear guidelines about:
     - Design patterns to follow
     - Styling conventions to maintain
     - Integration points with other components
   - **Conflict Prevention**: Assign clear file ownership to avoid merge conflicts

8) **Launch Senior Engineer Agents with Smart Grouping**: For the current phase:
   - Use a SINGLE message with multiple Task tool calls to launch all parallel agents
   - **Assign Cohesive Work Units**: Give each agent a complete, logical unit of work:
     - Example: "Implement all 4 metric widgets with consistent styling"
     - Example: "Build the complete authentication flow"
     - Example: "Create all API endpoints for analytics data"
   - **Provide Context for Consistency**:
     - Share design tokens, color schemes, spacing conventions
     - Include examples of similar components for reference
     - Specify exact integration interfaces
   - **Clear Ownership Boundaries**: Each agent owns specific files/directories
   - **Include Cross-Agent Contracts**: Define interfaces between components

9) **Monitor and Coordinate**: After each phase completes:
   - Verify all tickets in the phase are completed
   - **Update status with current progress**: Call `purple_report_progress` with updated current/total ticket counts
   - Check for consistency across related components
   - Validate integration points between agent work
   - Run tests if specified in the implementation spec
   - Move to the next phase and launch the next batch of parallel agents

# Key Principles for Smart Orchestration:

- **Cohesion Over Speed**: Group related work together even if it means fewer parallel agents - consistency is more important than raw parallelism
- **Natural Work Units**: Respect logical boundaries in the codebase:
  - All similar UI components together (maintains consistent look/feel)
  - All related API endpoints together (maintains consistent patterns)
  - All shared utilities together (avoids duplication)
- **File Isolation**: When work CAN be separated, assign different files/directories to different agents to avoid conflicts
- **Clear Ownership**: Each agent owns complete features or layers, not fragments
- **Shared Dependencies First**: Create shared types, utilities, or context in sequential tasks before parallel tasks that depend on them
- **Integration Contracts**: Define clear interfaces between agent work upfront
- **True Parallelism**: Use a single message with multiple Task tool calls to launch agents simultaneously

# Example Smart Orchestration Strategies:

## Example 1: Dashboard with Multiple Similar Widgets

**Phase 1 (Sequential - Foundation):**
- Agent 1: Set up routing, layout, shared context, and design system tokens

**Phase 2 (Smart Parallel Grouping):**
- Launch 2 agents in ONE message:
  - Agent A: **All Metric Widgets** (tickets: ActiveLearnersWidget, LessonsCreatedWidget, LessonsCompletedWidget, EngagementWidget, CompletionRateWidget)
    - Rationale: These share similar card layouts, data fetching patterns, and styling
    - Benefits: Consistent look/feel, shared component abstractions, unified loading states
  - Agent B: **All Backend Analytics Functions** (tickets: all analytics API endpoints and database queries)
    - Rationale: Share data models, query patterns, and response formats
    - Benefits: Consistent API design, shared validation, unified error handling

**Phase 3 (Sequential - Integration):**
- Agent 1: Dashboard page integration, time filtering, and final polish

## Example 2: E-commerce Feature

**Phase 1 (Sequential - Foundation):**
- Agent 1: Database schema, types, and shared utilities

**Phase 2 (Smart Parallel Grouping):**
- Launch 3 agents in ONE message:
  - Agent A: **Complete Product Catalog** (ProductList, ProductCard, ProductDetails, CategoryFilter)
    - Rationale: Consistent product display across all views
  - Agent B: **Shopping Cart System** (CartProvider, CartWidget, CartPage, checkout logic)
    - Rationale: Tightly coupled state management and UI
  - Agent C: **Search & Filter Engine** (SearchBar, FilterPanel, SearchResults, search API)
    - Rationale: Integrated search experience with consistent behavior

## Example 3: User Authentication System

**Phase 1 (Smart Parallel Grouping):**
- Launch 2 agents in ONE message:
  - Agent A: **All Auth UI Forms** (LoginForm, RegisterForm, ForgotPassword, ResetPassword)
    - Rationale: Consistent form validation, error handling, and styling
  - Agent B: **Auth Backend & Middleware** (auth endpoints, JWT handling, middleware, guards)
    - Rationale: Security patterns must be consistent across all auth operations

**Phase 2 (Sequential - Integration):**
- Agent 1: Protected route setup and user context integration

# Intelligent Task Analysis Guidelines:

When analyzing tickets for grouping, consider these factors:

## Signs Tasks Should Be Grouped Together:
- **Visual Consistency**: UI components that appear together (e.g., dashboard widgets, form fields)
- **Shared State**: Components that access or modify the same state/context
- **Common Patterns**: Code following similar architectural patterns (e.g., all CRUD operations)
- **Data Relationships**: Features working with related data models
- **User Journey**: Features that are part of the same user flow
- **Style Dependencies**: Components needing consistent theming/styling

## Signs Tasks Can Be Separated:
- **Different Tech Layers**: Frontend vs backend, database vs API
- **Isolated Features**: Completely independent functionality
- **Different Pages/Routes**: Features on separate pages with no shared state
- **Distinct Business Domains**: Unrelated business logic (e.g., billing vs content management)
- **No Shared Files**: Work that touches completely different parts of the codebase

## Grouping Decision Matrix:

| Scenario | Grouping Strategy |
|----------|------------------|
| 5+ similar widgets | Single agent for all widgets |
| Frontend + its backend | Can separate if clear API contract exists |
| Auth forms | Single agent for consistency |
| CRUD operations | Single agent per entity type |
| Shared component library | Single agent for the library |
| Independent microservices | Separate agents per service |

# Output Location:

As agents complete their work, they will create/modify files according to the implementation spec. Keep track of progress and document any deviations from the original plan.

# Important Notes:

- **Prioritize Consistency**: It's better to have fewer parallel agents with cohesive work than many agents creating inconsistent implementations
- **Provide Rich Context**: When grouping tasks, give agents the full picture of what they're building
- Always launch parallel agents using a SINGLE message with multiple Task tool calls
- Each agent should be given the full context they need (spec excerpts, standards, patterns to follow)
- Monitor for both conflicts AND consistency issues between agents
- Respect phase dependencies - don't start Phase N+1 until Phase N is complete
- If inconsistencies arise, address them before proceeding to the next phase
