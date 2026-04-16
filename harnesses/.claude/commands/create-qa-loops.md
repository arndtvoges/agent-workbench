---
argument-hint: Optional context about what to focus on (e.g. "focus on API testing" or "we use Playwright")
description: Create workspace-specific QA loop instructions for autonomous verification. Only run when explicitly invoked by the user — not for use in regular development workflows or build-from-spec pipelines.
model: opus
---

# QA Loops Creator

You help the user generate QA loop instructions that coding agents use to autonomously verify their own work.
The user optionally provides this context: $1

Your output will be written to `purple/standards/global/testing.md`.

---

## Step 1: Read Existing QA Coverage

Check if `purple/standards/global/testing.md` already exists.

- **If it exists**: Read it thoroughly. Assess which QA scenarios are already covered, which are thin or missing, and which are well-defined. Decide your mode:
  - **Gap-filling**: Existing file has good content but missing scenarios. Preserve everything, add new sections.
  - **Refinement**: Existing file covers scenarios but instructions are vague. Enhance with specifics.
  - **Fresh creation**: File exists but is empty or only has placeholder content. Start from scratch.
- **If it does not exist**: You are in fresh creation mode. Inform the user and proceed.
- **If no workspace codebase is found at all**: Offer template-only creation — generate a generic `testing.md` with placeholder instructions the user can fill in later.

---

## Step 2: Analyze the Codebase

Scan the workspace to detect the technology landscape. Look for:

- **Web frameworks**: Next.js, React, Vue, Svelte, Angular (check `package.json`, config files)
- **API frameworks**: Hono, Express, Fastify, Django, Flask, Rails (check dependencies, route files)
- **Test runners**: Vitest, Jest, Mocha, pytest, Go test (check test configs, existing test files)
- **CLI tools**: Go binaries (check `go.mod`), Node CLIs (check `bin` fields in `package.json`)
- **Deployment config**: Docker (`Dockerfile`, `docker-compose.yml`), Vercel (`vercel.json`), Fly.io, Railway
- **Database**: PostgreSQL, MySQL, SQLite, MongoDB, Supabase, Firebase (check ORM configs, connection strings)
- **Auth**: Supabase Auth, NextAuth, Clerk, Firebase Auth (check auth middleware, providers)
- **Existing test patterns**: Look at existing test files to understand conventions already in use
- **Background jobs**: Bull, BullMQ, Celery, cron configs
- **Email/notification services**: SendGrid, Resend, Postmark, SNS

**IMPORTANT**: Write your analysis findings to `purple/temp/qa-loops-analysis.md` as you go. This preserves context if the conversation runs long and prevents losing work to context exhaustion.

If the workspace contains **niche or uncommon frameworks**, note them but fall back to generic templates for those areas. Do not block on unfamiliar tech.

---

## Step 3: Present Tailored QA Suggestions

Based on your analysis, select the relevant scenarios from the 9 templates below. Present each relevant scenario as a summary to the user:

- What the scenario covers
- Which tools/approach you recommend
- Why it is relevant to their codebase

**Do NOT present irrelevant scenarios.** If the project has no mobile app, skip the Mobile Apps template. If there is no database, skip Database Verification.

---

## Asking questions interactively

When you need user input (accepting/rejecting scenarios, choosing options, confirming decisions), use the `AskUserQuestion` tool instead of typing plain questions in the chat. This renders a structured UI with clickable options that is much faster for the user to respond to.

Structure your questions with:
- `header`: Short title for the question (e.g. "Website QA Setup")
- `question`: The full question text
- `options`: Array of `{ label, description }` choices when there are clear alternatives
- `multiSelect`: `true` when the user can pick more than one option

Use plain chat text only for open-ended discussion or when the tool is not available.

---

## Step 4: Interactive Refinement

For each scenario the user accepts:

1. Present the template summary
2. Use `AskUserQuestion` to let the user accept, modify, or reject it
3. Ask targeted follow-up questions specific to that scenario:
   - **Website/Web App**: What is the dev server start command? What is the base URL? Any login credentials for testing? Preferred browser automation tool (Playwright MCP vs agent-browser)?
   - **API Endpoints**: What is the API base URL? Are there auth tokens or API keys needed? Which endpoints are most critical?
   - **CLI/TUI**: What is the binary name? How to build it? What are the key commands to verify?
   - **Database**: What ORM/query tool is used? Are there seed scripts? What tables are critical?
   - **Auth/Permissions**: What roles exist? How to create test users? What are the auth flows?
   - **Email/Notifications**: Is there a test mailbox or webhook inspector? What triggers notifications?
   - **Background Jobs**: How to inspect queues? Where are logs? How to trigger jobs manually?
4. Incorporate their answers into the final instructions

**If the user rejects ALL suggestions**: Ask them to describe their custom QA approach. Write whatever they provide into the testing.md format.

**Sensitive credentials warning**: If the user provides passwords, API keys, or tokens, warn them that these will be written to a file in the workspace. Suggest using environment variables (e.g., `$QA_PASSWORD`) instead. Do not block — if they insist on inline credentials, proceed.

---

## Step 5: Write to `purple/standards/global/testing.md`

Perform a **smart merge**:
- If the file already has content, preserve all existing sections
- Add new QA Loop sections below existing content, or update existing QA sections in-place
- Never delete content the user previously created
- Use the output format specified below

---

## 9 QA Scenario Templates

Each template below defines a complete QA verification approach. Embed the relevant ones into `testing.md` following the output format.

---

### Template 1: Website / Web App QA

**Scenario**: Verify that web pages render correctly, UI components work, and there are no console errors.

**Recommended tools**: Playwright MCP (`mcp__playwright__*` tools) for standard web apps, or `agent-browser` CLI for Electron apps or apps requiring CDP connection.

**Prerequisites template**:
```
- Dev server running: `{start_command}` (e.g., `bun run dev`, `pnpm dev`)
- Base URL: `{base_url}` (e.g., `http://localhost:3000`)
- Test credentials: `{username}` / `{password}` (or env vars `$QA_USER` / `$QA_PASSWORD`)
- Browser automation: {playwright_mcp | agent-browser}
```

**Verification sequence template**:
```
1. Navigate to {base_url}
2. Verify page loads without console errors
3. Take a screenshot for evidence
4. If auth required: log in with test credentials
5. Navigate to each key route: {list_routes}
6. For each route:
   a. Verify page renders (no blank screens, no loading spinners stuck)
   b. Check console for errors or warnings
   c. Take screenshot
   d. Test key interactions (click buttons, open modals, submit forms)
7. Verify responsive behavior at mobile viewport (375px width) if applicable
```

**Expected outcomes template**:
```
- All pages render without console errors
- Key UI elements are visible and interactive
- Forms submit successfully (or show proper validation)
- No stuck loading states
- Screenshots saved to `{feature-folder}/qa-screenshots/`
```

**Failure handling template**:
```
- Console error: Note the exact error message and stack trace. Check if it is a build error (fix code) or runtime error (check data/API).
- Blank page: Check if the dev server is running. Check browser network tab for failed requests.
- Element not found: Verify the selector. Use `snapshot` or `screenshot` to see current page state.
- Auth failure: Verify credentials. Check if the auth service is running.
- Retry up to 3 times with fixes between attempts.
```

---

### Template 2: API Endpoints QA

**Scenario**: Verify that API endpoints return correct responses, handle errors properly, and match expected schemas.

**Recommended tools**: `curl` + `jq` for HTTP requests and JSON parsing.

**Prerequisites template**:
```
- API server running: `{start_command}` (e.g., `bun run dev`, `go run .`)
- Base URL: `{api_base_url}` (e.g., `http://localhost:8787`)
- Auth token: `{token_or_how_to_obtain}` (or env var `$QA_API_TOKEN`)
- Required headers: {list_headers}
```

**Verification sequence template**:
```
1. Health check: `curl -s {api_base_url}/health | jq .`
2. For each critical endpoint:
   a. Send request: `curl -s -X {METHOD} {api_base_url}/{path} -H "Authorization: Bearer {token}" -H "Content-Type: application/json" -d '{payload}' | jq .`
   b. Verify HTTP status code matches expected (200, 201, etc.)
   c. Verify response body shape matches expected schema
   d. Verify response contains expected data
3. Test error cases:
   a. Invalid auth: Verify 401 response
   b. Missing required fields: Verify 400/422 response
   c. Not found resources: Verify 404 response
4. Test pagination if applicable
5. Test rate limiting if applicable
```

**Expected outcomes template**:
```
- All endpoints return expected status codes
- Response bodies match documented schemas
- Error responses include meaningful error messages
- Auth-protected routes reject unauthenticated requests
- CORS headers present if needed
```

**Failure handling template**:
```
- Connection refused: API server is not running. Start it and retry.
- 500 error: Check server logs for stack trace. Likely a code bug or missing env var.
- Schema mismatch: Compare response with expected schema. Check if API or test expectation is outdated.
- Auth error: Re-obtain token. Check token expiry. Verify auth middleware config.
```

---

### Template 3: CLI / TUI Applications QA

**Scenario**: Verify that command-line tools execute correctly, produce expected output, and handle errors gracefully.

**Recommended tools**: `tmux` for session management, standard shell commands for execution and output capture.

**Prerequisites template**:
```
- Binary built: `{build_command}` (e.g., `go build -o ./bin/mytool .`, `bun run build`)
- Binary path: `{binary_path}` (e.g., `./bin/mytool`)
- Required env vars: {list_env_vars}
- Test data/fixtures: {location_of_test_data}
```

**Verification sequence template**:
```
1. Build the binary: `{build_command}`
2. Verify binary exists and is executable
3. Run help command: `{binary_path} --help` — verify output is sensible
4. Run version command: `{binary_path} --version` — verify version string
5. For each key command/subcommand:
   a. Run with valid inputs: `{binary_path} {subcommand} {args}`
   b. Capture stdout and stderr
   c. Verify exit code is 0
   d. Verify output contains expected content
6. Test error cases:
   a. Invalid arguments: verify non-zero exit code and helpful error message
   b. Missing required inputs: verify clear error message
   c. Invalid file paths: verify graceful handling
7. For TUI apps: use tmux to send keystrokes and capture screen state
```

**Expected outcomes template**:
```
- Binary builds without errors
- All key commands produce expected output
- Error cases produce helpful messages and non-zero exit codes
- TUI renders correctly (no garbled output)
```

**Failure handling template**:
```
- Build failure: Check compiler errors. Verify dependencies are installed.
- Unexpected output: Compare with expected. Check if test data/fixtures are correct.
- Crash/panic: Check stack trace. Likely a nil pointer or unhandled edge case.
- TUI rendering issues: Check terminal size. Verify tmux session is configured correctly.
```

---

### Template 4: Mobile Apps QA

**Scenario**: Verify mobile application functionality on target platforms.

**Recommended tools**: Platform-specific — Xcode Simulator (iOS), Android Emulator (Android), or Expo Go for React Native.

**Prerequisites template**:
```
- Platform: {ios | android | both}
- Framework: {react_native | flutter | swift | kotlin}
- Simulator/Emulator: {setup_instructions}
- Build command: `{build_command}`
- Test credentials: `{username}` / `{password}`
```

**Verification sequence template**:
```
1. Build the app: `{build_command}`
2. Install on simulator/emulator
3. Launch the app
4. Verify splash screen / initial load
5. If auth required: complete login flow
6. For each key screen:
   a. Navigate to screen
   b. Verify UI elements render correctly
   c. Test touch interactions (tap, swipe, scroll)
   d. Capture screenshot
7. Test offline behavior if applicable
8. Test push notifications if applicable
9. Verify deep links if applicable
```

**Expected outcomes template**:
```
- App builds and installs without errors
- All screens render correctly
- Touch interactions work as expected
- No crashes during normal usage flow
- Screenshots captured for evidence
```

**Failure handling template**:
```
- Build failure: Check platform-specific build logs. Verify SDK versions.
- Simulator crash: Restart simulator. Check memory usage.
- UI not rendering: Check component tree. Verify styles for platform.
- Network issues in simulator: Check simulator network settings.
```

---

### Template 5: Email / Notifications QA

**Scenario**: Verify that emails, push notifications, or other notifications are sent correctly with proper content.

**Recommended tools**: Test mailboxes (Mailpit, MailHog, Ethereal), webhook inspection tools (webhook.site, RequestBin), console log inspection.

**Prerequisites template**:
```
- Email service: {service_name} (e.g., Resend, SendGrid, Postmark)
- Test mailbox: {mailbox_url} (e.g., `http://localhost:8025` for Mailpit)
- Trigger action: {how_to_trigger_email} (e.g., "create a new user", "submit a form")
- Webhook inspector: {webhook_url} (if using webhooks)
```

**Verification sequence template**:
```
1. Ensure email service is running (or test mailbox is accessible)
2. Trigger the action that sends the notification:
   a. Via API: `curl -X POST {api_url}/{trigger_endpoint} ...`
   b. Via UI: navigate and perform the trigger action
3. Check the test mailbox / webhook inspector:
   a. Verify notification was received
   b. Verify subject line / title
   c. Verify body content (correct data, proper formatting)
   d. Verify recipient is correct
   e. Verify links in email work (click-through test)
4. Test edge cases:
   a. Invalid recipient: verify graceful handling
   b. Large content: verify no truncation
   c. Special characters: verify proper encoding
```

**Expected outcomes template**:
```
- Notifications are delivered to test mailbox / webhook
- Content matches expected template with correct dynamic data
- Links in notifications resolve correctly
- No duplicate sends
```

**Failure handling template**:
```
- No email received: Check email service logs. Verify SMTP config. Check spam folder in test mailbox.
- Wrong content: Check template rendering. Verify data passed to template.
- Delivery delay: Check queue processing. Some services batch sends.
- Link broken: Verify URL generation logic. Check base URL config.
```

---

### Template 6: Database Verification QA

**Scenario**: Verify that database operations (CRUD, migrations, seeds) produce correct state.

**Recommended tools**: SQL queries via ORM CLI (e.g., `drizzle-kit`, `prisma studio`), direct SQL (`psql`, `sqlite3`), or ORM query scripts.

**Prerequisites template**:
```
- Database: {db_type} (e.g., PostgreSQL, SQLite, MongoDB)
- Connection: {connection_string_or_env_var} (e.g., `$DATABASE_URL`)
- ORM: {orm_name} (e.g., Drizzle, Prisma, SQLAlchemy)
- Seed command: `{seed_command}` (e.g., `bun run db:seed`)
- Migration command: `{migration_command}` (e.g., `bun run db:migrate`)
```

**Verification sequence template**:
```
1. Run migrations: `{migration_command}`
2. Verify migration succeeded (check for errors)
3. Run seed script if applicable: `{seed_command}`
4. Verify seed data exists:
   a. Query key tables: `SELECT COUNT(*) FROM {table};`
   b. Verify expected row counts
   c. Verify data integrity (foreign keys, required fields)
5. Test CRUD operations via API or direct queries:
   a. CREATE: Insert a record, verify it exists
   b. READ: Query the record, verify all fields
   c. UPDATE: Modify a field, verify the change persisted
   d. DELETE: Remove the record, verify it is gone
6. Verify constraints:
   a. Unique constraints: attempt duplicate insert, verify rejection
   b. Not-null constraints: attempt null insert, verify rejection
   c. Foreign key constraints: attempt orphan insert, verify rejection
```

**Expected outcomes template**:
```
- Migrations run without errors
- Seed data populates correctly
- CRUD operations work as expected
- Constraints are enforced
- No orphaned records or data integrity issues
```

**Failure handling template**:
```
- Migration failure: Check SQL syntax. Verify database is accessible. Check for conflicting migrations.
- Seed failure: Check for missing dependencies (tables not yet created). Verify seed data format.
- Constraint violation: Expected behavior — verify the error message is helpful.
- Connection error: Verify database is running. Check connection string. Check firewall/network.
```

---

### Template 7: Background Jobs QA

**Scenario**: Verify that background jobs, queues, and scheduled tasks execute correctly.

**Recommended tools**: Log inspection (`tail -f`), queue monitoring dashboards (Bull Board, Flower), direct queue queries.

**Prerequisites template**:
```
- Queue system: {queue_system} (e.g., BullMQ, Celery, Sidekiq)
- Queue dashboard: {dashboard_url} (if available)
- Worker start command: `{worker_command}` (e.g., `bun run worker`, `celery -A app worker`)
- Log location: {log_path}
- How to trigger a job: {trigger_method}
```

**Verification sequence template**:
```
1. Start the worker: `{worker_command}`
2. Verify worker is running and connected to queue
3. Trigger a job:
   a. Via API: `curl -X POST {api_url}/{job_trigger_endpoint} ...`
   b. Via direct enqueue: `{enqueue_command}`
4. Monitor job execution:
   a. Check queue dashboard (if available): verify job appears and transitions from pending → active → completed
   b. Check logs: `tail -f {log_path}` — verify job execution log entries
   c. Verify job completed within expected time
5. Verify job side effects:
   a. Database changes: query for expected state changes
   b. Files created: check filesystem
   c. Notifications sent: check notification channel
6. Test failure cases:
   a. Trigger a job with invalid data: verify it fails gracefully
   b. Verify retry behavior (if configured)
   c. Verify dead letter queue / failed job handling
```

**Expected outcomes template**:
```
- Worker starts and connects to queue
- Jobs execute and complete within expected time
- Side effects (DB changes, files, notifications) occur correctly
- Failed jobs are handled gracefully with proper error messages
- Retry logic works as configured
```

**Failure handling template**:
```
- Worker won't start: Check queue connection. Verify Redis/queue service is running.
- Job stuck in pending: Check worker is consuming from correct queue. Verify concurrency settings.
- Job fails: Check error message in logs or dashboard. Common: missing env vars, network errors, data issues.
- Side effects missing: Check job completed successfully first. Then verify side effect logic.
```

---

### Template 8: Integration Testing QA

**Scenario**: Verify end-to-end flows that span multiple services or components (e.g., UI action triggers API call, which triggers background job, which sends email).

**Recommended tools**: Combined approach — use the tools from other templates together. Playwright/agent-browser for UI, curl for API, log inspection for jobs, test mailbox for email.

**Prerequisites template**:
```
- All services running: {list_of_services_and_start_commands}
- Integration flow to test: {describe_the_flow}
- Expected end state: {describe_expected_outcome}
- Monitoring: {how_to_observe_each_step}
```

**Verification sequence template**:
```
1. Start all required services:
   a. {service_1}: `{start_command_1}`
   b. {service_2}: `{start_command_2}`
   c. ... (repeat for each service)
2. Verify all services are healthy (health checks, log inspection)
3. Execute the integration flow:
   a. Step 1: {action} — verify {expected_result}
   b. Step 2: {action} — verify {expected_result}
   c. ... (follow the flow end-to-end)
4. At each step, verify:
   a. The action completed successfully
   b. The next service in the chain received the expected input
   c. No errors in any service logs
5. Verify final end state:
   a. UI shows expected result
   b. Database has expected records
   c. Notifications were sent
   d. Files were created/modified
```

**Expected outcomes template**:
```
- Full flow executes without errors in any service
- Data flows correctly between services
- Final state matches expected outcome
- All intermediate steps produce correct results
- No race conditions or timing issues
```

**Failure handling template**:
```
- Service not reachable: Verify it started correctly. Check ports and networking.
- Data not propagating: Check inter-service communication (API calls, queue messages). Verify serialization.
- Partial completion: Identify which step failed. Check that step's service logs.
- Timing issues: Add polling/wait logic. Check if async operations need time to complete.
```

---

### Template 9: Permission / Auth Setup QA

**Scenario**: Interactive setup wizard for auth and permission testing — verify that roles, permissions, and access controls work correctly.

**Recommended tools**: curl for API auth flows, Playwright/agent-browser for UI auth flows, database queries for role verification.

**Prerequisites template**:
```
- Auth system: {auth_system} (e.g., Supabase Auth, NextAuth, Clerk)
- Roles defined: {list_of_roles} (e.g., admin, member, viewer)
- Test users: {how_to_create_or_existing_test_users}
- Auth endpoint: {auth_url}
- Protected routes/endpoints: {list_of_protected_resources}
```

**Verification sequence template**:
```
1. Create or verify test users for each role:
   a. Admin user: `{admin_credentials}`
   b. Member user: `{member_credentials}`
   c. Viewer user: `{viewer_credentials}` (if applicable)
   d. Unauthenticated: no credentials
2. For each protected resource, test with each role:
   a. Authenticate as {role}: obtain token/session
   b. Access the resource: `curl -H "Authorization: Bearer {token}" {resource_url}`
   c. Verify:
      - Authorized roles get 200 + correct data
      - Unauthorized roles get 403
      - Unauthenticated requests get 401
3. Test auth flows:
   a. Login: verify token/session is created
   b. Logout: verify token/session is invalidated
   c. Token refresh: verify new token is issued (if applicable)
   d. Password reset: verify flow works (if applicable)
4. Test edge cases:
   a. Expired token: verify 401 response
   b. Malformed token: verify 401 response
   c. Role escalation attempt: verify prevention
```

**Expected outcomes template**:
```
- Each role can only access permitted resources
- Unauthorized access returns proper 401/403 codes
- Auth flows (login, logout, refresh) work correctly
- Token expiry is handled properly
- No role escalation vulnerabilities
```

**Failure handling template**:
```
- Login fails: Check auth service is running. Verify credentials. Check auth configuration.
- Wrong access level: Check role assignment in database. Verify middleware/policy logic.
- Token issues: Check token generation. Verify signing keys. Check expiry settings.
- CORS issues on auth: Verify CORS config includes auth headers.
```

---

## Output Format for testing.md

Write the final content in this structure. Only include scenarios the user approved.

```markdown
## QA Loops

Instructions for autonomous QA verification. Agents use these instructions to verify their own work after implementation.

> These QA loops are designed to be run by AI coding agents autonomously. Each scenario provides step-by-step instructions that an agent can follow without human intervention.

### [Scenario Name] QA

**Prerequisites:**
- How to start services, credentials, environment setup
- All requirements to run this QA scenario

**Verification Sequence:**
1. Step-by-step actions the agent should take
2. Each step includes what to check and what success looks like
3. Concrete commands and expected outputs

**Expected Outcomes:**
- What success looks like for this scenario
- Specific things to verify

**On Failure:**
- Diagnosis steps
- Common causes and fixes
- Retry instructions
```

---

## Further Instructions

- Keep instructions concise but complete — an agent must be able to follow them without asking questions
- Use concrete commands, not abstract descriptions (e.g., `curl -s http://localhost:3000/api/health | jq .` not "check the health endpoint")
- Include actual test credentials or env var references — never leave placeholders unfilled after the user provides info
- Be prescriptive about tools: tell the agent exactly which tool to use, not "use an appropriate tool"
- If the user provides URLs, ports, credentials, or commands during the interactive phase, embed them directly into the instructions
- Warn about credentials in plaintext but do not block on it
- Write analysis findings to `purple/temp/qa-loops-analysis.md` to preserve context during long sessions

## Completion Signal (MCP)

After finishing the QA loops file (`purple/standards/global/testing.md`) and you are fully done (not just pausing to ask a question), check if the `onboarding_step_complete` MCP tool is available. If it is, call it with:

- `step`: `"qa-loops"`
- `scenariosCreated`: the number of distinct QA scenarios you configured (e.g. website QA + API QA + DB verification = 3)

This signal tells the Purple UI to transition to the completion screen. If the tool is not available in your current tool list, skip this step and continue normally.
