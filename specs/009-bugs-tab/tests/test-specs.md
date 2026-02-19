# Test Specifications: Bugs Tab — Bug Tracking Visualization

**Generated**: 2026-02-19
**Feature**: `spec.md` | **Plan**: `plan.md` | **Data Model**: `data-model.md`

## TDD Assessment

**Determination**: mandatory
**Confidence**: high
**Evidence**: "TDD MUST be used for all feature development. Tests MUST be written before implementation code. The red-green-refactor cycle MUST be strictly followed." (CONSTITUTION.md §I)
**Reasoning**: Constitution §I contains strong TDD indicators — MUST + "TDD" + "test-first" + "red-green-refactor". TDD is non-negotiable for this project.

---

<!--
DO NOT MODIFY TEST ASSERTIONS

These test specifications define the expected behavior derived from requirements.
During implementation:
- Fix code to pass tests, don't modify test assertions
- Structural changes (file organization, naming) are acceptable with justification
- Logic changes to assertions require explicit justification and re-review

If requirements change, re-run /iikit-05-testify to regenerate test specs.
-->

## From spec.md (Acceptance Tests)

### TS-001: Bug table renders with severity colors, status, and progress

**Source**: spec.md:User Story 1:scenario-1
**Type**: acceptance | **Priority**: P1

**Given**: a feature with `bugs.md` containing BUG-001 (critical, reported), BUG-002 (medium, fixed), and BUG-003 (low, reported)
**When**: the developer clicks the Bugs tab
**Then**: a table renders with 3 rows showing each bug's ID, severity badge (color-coded: red for critical, yellow for medium, gray for low), status, fix task progress, and description

**Traceability**: FR-003, FR-004, SC-001, SC-007, US-001-scenario-1

---

### TS-002: Fix task progress displays correct count per bug

**Source**: spec.md:User Story 1:scenario-2
**Type**: acceptance | **Priority**: P1

**Given**: BUG-001 has 3 fix tasks in `tasks.md` (T-B001, T-B002, T-B003) with 1 checked
**When**: the Bugs tab renders
**Then**: the BUG-001 row shows fix task progress as "1/3"

**Traceability**: FR-005, SC-003, US-001-scenario-2

---

### TS-003: GitHub issue link renders as clickable link

**Source**: spec.md:User Story 1:scenario-3
**Type**: acceptance | **Priority**: P1

**Given**: BUG-002 has a GitHub issue link `#13`
**When**: the Bugs tab renders
**Then**: the BUG-002 row shows a clickable link to the GitHub issue

**Traceability**: FR-012, US-001-scenario-3

---

### TS-004: Empty state when no bugs.md exists

**Source**: spec.md:User Story 1:scenario-4
**Type**: acceptance | **Priority**: P1

**Given**: a feature with no `bugs.md` file
**When**: the developer clicks the Bugs tab
**Then**: an empty state is shown with a message indicating no bugs have been reported

**Traceability**: FR-009, US-001-scenario-4

---

### TS-005: Badge shows open bug count in red for critical severity

**Source**: spec.md:User Story 2:scenario-1
**Type**: acceptance | **Priority**: P1

**Given**: a feature with 2 open bugs (1 critical, 1 low)
**When**: the pipeline bar renders
**Then**: the Bugs tab shows a badge with "2" in red (highest open severity is critical)

**Traceability**: FR-002, SC-002, US-002-scenario-1

---

### TS-006: Badge shows open bug count in yellow for medium severity

**Source**: spec.md:User Story 2:scenario-2
**Type**: acceptance | **Priority**: P1

**Given**: a feature with 1 open bug (medium severity)
**When**: the pipeline bar renders
**Then**: the Bugs tab shows a badge with "1" in yellow

**Traceability**: FR-002, SC-002, US-002-scenario-2

---

### TS-007: Muted "0" badge when all bugs are fixed

**Source**: spec.md:User Story 2:scenario-3
**Type**: acceptance | **Priority**: P1

**Given**: a feature with all bugs in "fixed" status
**When**: the pipeline bar renders
**Then**: the Bugs tab shows a muted "0" badge (badge remains visible but dimmed)

**Traceability**: FR-002, FR-010, SC-002, US-002-scenario-3

---

### TS-008: Muted tab when no bugs.md exists

**Source**: spec.md:User Story 2:scenario-4
**Type**: acceptance | **Priority**: P1

**Given**: a feature with no `bugs.md` file
**When**: the pipeline bar renders
**Then**: the Bugs tab appears without a badge, in a muted/dimmed style

**Traceability**: FR-001, FR-009, US-002-scenario-4

---

### TS-009: Badge updates on file change via WebSocket

**Source**: spec.md:User Story 2:scenario-5
**Type**: acceptance | **Priority**: P1

**Given**: a bug is added to `bugs.md` on disk
**When**: the file change is detected via WebSocket
**Then**: the Bugs tab badge updates to reflect the new count and severity

**Traceability**: FR-002, FR-008, SC-006, US-002-scenario-5

---

### TS-010: Bug icon on T-B tasks in Implement board

**Source**: spec.md:User Story 3:scenario-1
**Type**: acceptance | **Priority**: P2

**Given**: an Implement board with regular tasks (T001, T002) and bug fix tasks (T-B001, T-B002 tagged [BUG-001])
**When**: the board renders
**Then**: T-B tasks display a bug icon next to their task ID

**Traceability**: FR-006, SC-004, US-003-scenario-1

---

### TS-011: Cmd+click BUG tag navigates from Implement board to Bugs tab

**Source**: spec.md:User Story 3:scenario-2
**Type**: acceptance | **Priority**: P2

**Given**: a bug fix task T-B001 with tag [BUG-001] on the Implement board
**When**: the developer Cmd+clicks [BUG-001]
**Then**: the view switches to the Bugs tab with BUG-001 highlighted

**Traceability**: FR-007, SC-005, US-003-scenario-2

---

### TS-012: Bug fix card is visually identifiable

**Source**: spec.md:User Story 3:scenario-3
**Type**: acceptance | **Priority**: P2

**Given**: the Implement board has a card for a story that contains only bug fix tasks
**When**: the card renders
**Then**: the card is visually identifiable as a bug fix card

**Traceability**: FR-006, SC-004, US-003-scenario-3

---

### TS-013: Cmd+click task ID navigates from Bugs tab to Implement board

**Source**: spec.md:User Story 4:scenario-1
**Type**: acceptance | **Priority**: P2

**Given**: the Bugs tab is showing BUG-001 with fix tasks T-B001 and T-B002
**When**: the developer Cmd+clicks T-B001
**Then**: the view switches to the Implement board and T-B001 is highlighted/scrolled into view

**Traceability**: FR-007, SC-005, US-004-scenario-1

---

### TS-014: GitHub issue link opens in new tab

**Source**: spec.md:User Story 4:scenario-2
**Type**: acceptance | **Priority**: P2

**Given**: the Bugs tab is showing BUG-002 with a GitHub issue link #13
**When**: the developer clicks the GitHub issue link
**Then**: a new browser tab opens to the GitHub issue page

**Traceability**: FR-012, US-004-scenario-2

---

### TS-015: Real-time update when new bug added

**Source**: spec.md:User Story 5:scenario-1
**Type**: acceptance | **Priority**: P3

**Given**: the Bugs tab is open showing 2 bugs
**When**: a new BUG-003 entry is appended to `bugs.md` on disk
**Then**: the table updates to show 3 bugs and the tab badge increments

**Traceability**: FR-008, SC-006, US-005-scenario-1

---

### TS-016: Real-time update when fix task checked

**Source**: spec.md:User Story 5:scenario-2
**Type**: acceptance | **Priority**: P3

**Given**: the Bugs tab is open showing BUG-001 with 1/3 fix tasks done
**When**: a T-B task is checked in `tasks.md`
**Then**: the progress updates to 2/3

**Traceability**: FR-005, FR-008, SC-003, SC-006, US-005-scenario-2

---

### TS-017: Real-time update when bug status changes

**Source**: spec.md:User Story 5:scenario-3
**Type**: acceptance | **Priority**: P3

**Given**: the Bugs tab is open
**When**: `bugs.md` is modified to change BUG-001 status from "reported" to "fixed"
**Then**: the row updates to show "fixed" status and the open bug count decreases

**Traceability**: FR-008, SC-002, SC-006, US-005-scenario-3

---

### TS-018: Bug with zero fix tasks shows dash in progress column

**Source**: spec.md:Edge Cases:zero-fix-tasks
**Type**: acceptance | **Priority**: P2

**Given**: a bug BUG-004 exists in `bugs.md` with no matching T-B tasks in `tasks.md`
**When**: the Bugs tab renders
**Then**: the BUG-004 row shows "\u2014" (dash) in the fix task progress column

**Traceability**: FR-005, US-001-edge-1

---

### TS-019: Empty or malformed bugs.md shows empty state

**Source**: spec.md:Edge Cases:malformed-bugs-md
**Type**: acceptance | **Priority**: P2

**Given**: `bugs.md` exists but contains no valid `## BUG-NNN` entries
**When**: the developer clicks the Bugs tab
**Then**: an empty state is shown with a message

**Traceability**: FR-009, US-001-edge-2

---

### TS-020: Orphaned T-B tasks when no matching bug in bugs.md

**Source**: spec.md:Edge Cases:orphaned-tasks
**Type**: acceptance | **Priority**: P2

**Given**: `tasks.md` has T-B tasks tagged with [BUG-005] but `bugs.md` has no BUG-005 entry
**When**: the Bugs tab renders
**Then**: the orphaned tasks appear in a separate "Orphaned Fix Tasks" section at the bottom of the bug table with a warning icon and muted styling

**Traceability**: FR-005, US-001-edge-3

---

### TS-021: T-B tasks exist but no bugs.md

**Source**: spec.md:Edge Cases:tasks-without-bugs-md
**Type**: acceptance | **Priority**: P2

**Given**: `tasks.md` has T-B tasks but no `bugs.md` file exists
**When**: the pipeline bar renders
**Then**: the Bugs tab appears muted (no badge) and the bug view shows empty state

**Traceability**: FR-001, FR-009, US-001-edge-4

---

### TS-022: Bug data reloads on feature switch

**Source**: spec.md:Edge Cases:feature-switch
**Type**: acceptance | **Priority**: P2

**Given**: the Bugs tab is open for feature A showing 3 bugs
**When**: the user switches to feature B which has 1 bug
**Then**: the bug table and badge update to show feature B's bug data

**Traceability**: FR-003, FR-008, US-001-edge-5

---

### TS-023: Bugs tab has no connector line to pipeline chain

**Source**: spec.md:FR-001
**Type**: acceptance | **Priority**: P1

**Given**: a dashboard with the standard pipeline phases
**When**: the pipeline bar renders
**Then**: the Bugs tab is rendered at the end of the pipeline bar, visually separated with no connector line

**Traceability**: FR-001, SC-007

---

### TS-024: Bug table sorted by severity descending then ID ascending

**Source**: spec.md:FR-004
**Type**: acceptance | **Priority**: P1

**Given**: `bugs.md` contains BUG-001 (low), BUG-002 (critical), BUG-003 (medium), BUG-004 (critical)
**When**: the Bugs tab renders the table
**Then**: rows are ordered: BUG-002 (critical), BUG-004 (critical), BUG-003 (medium), BUG-001 (low)

**Traceability**: FR-004

---

## From plan.md / contracts (Contract Tests)

### TS-025: GET /api/bugs/:feature returns bug state with fix tasks

**Source**: plan.md:contracts/bugs-api.md:200-OK
**Type**: contract | **Priority**: P1

**Given**: a feature "009-bugs-tab" with `bugs.md` containing 2 bugs and `tasks.md` with matching T-B fix tasks
**When**: a GET request is made to `/api/bugs/009-bugs-tab`
**Then**: the response has status 200 with JSON body containing `exists: true`, a `bugs` array with each bug's id, reported, severity, status, githubIssue, description, and `fixTasks` object (total, checked, tasks array), and a `summary` object with total, open, fixed, highestOpenSeverity, and bySeverity counts

**Traceability**: FR-011, contracts/bugs-api.md:200-OK

---

### TS-026: GET /api/bugs/:feature returns empty state when no bugs.md

**Source**: plan.md:contracts/bugs-api.md:200-no-bugs
**Type**: contract | **Priority**: P1

**Given**: a feature "test-feature" that has no `bugs.md` file
**When**: a GET request is made to `/api/bugs/test-feature`
**Then**: the response has status 200 with JSON body containing `exists: false`, empty `bugs` array, and summary with all counts at 0 and `highestOpenSeverity: null`

**Traceability**: FR-009, FR-011, contracts/bugs-api.md:200-no-bugs

---

### TS-027: GET /api/bugs/:feature returns 404 for unknown feature

**Source**: plan.md:contracts/bugs-api.md:404
**Type**: contract | **Priority**: P1

**Given**: no feature directory named "nonexistent-feature" exists
**When**: a GET request is made to `/api/bugs/nonexistent-feature`
**Then**: the response has status 404 with JSON body `{ "error": "Feature not found" }`

**Traceability**: FR-011, contracts/bugs-api.md:404

---

### TS-028: WebSocket broadcasts bugs_update on file change

**Source**: plan.md:contracts/bugs-api.md:websocket
**Type**: contract | **Priority**: P1

**Given**: a client is subscribed to feature "009-bugs-tab" via WebSocket
**When**: `bugs.md` or `tasks.md` changes on disk
**Then**: the server broadcasts a message with `type: "bugs_update"`, `feature: "009-bugs-tab"`, and `bugs` payload matching the GET /api/bugs response format

**Traceability**: FR-008, SC-006, contracts/bugs-api.md:websocket

---

### TS-029: WebSocket bugs_update payload matches API response

**Source**: plan.md:contracts/bugs-api.md:websocket-format
**Type**: contract | **Priority**: P2

**Given**: a feature with known bug state
**When**: a file change triggers a WebSocket `bugs_update` message
**Then**: the `bugs` payload in the WebSocket message is identical in structure and data to the `GET /api/bugs/:feature` response body

**Traceability**: FR-008, FR-011, contracts/bugs-api.md:websocket-format

---

## From data-model.md (Validation Tests)

### TS-030: Bug ID must match BUG-\d+ pattern

**Source**: data-model.md:Bug:id-validation
**Type**: validation | **Priority**: P2

**Given**: `bugs.md` contains entries with headings "## BUG-001", "## BUG-099", and "## INVALID-BUG"
**When**: `parseBugs` is called
**Then**: only entries with IDs matching `BUG-\d+` pattern are returned (BUG-001 and BUG-099); the invalid entry is skipped

**Traceability**: data-model.md:Bug:id

---

### TS-031: Unrecognized severity defaults to medium

**Source**: data-model.md:Bug:severity-default
**Type**: validation | **Priority**: P2

**Given**: `bugs.md` contains a bug with `**Severity**: unknown`
**When**: `parseBugs` is called
**Then**: the bug's severity field is set to "medium"

**Traceability**: data-model.md:Bug:severity

---

### TS-032: Unrecognized status defaults to reported

**Source**: data-model.md:Bug:status-default
**Type**: validation | **Priority**: P2

**Given**: `bugs.md` contains a bug with `**Status**: in-progress`
**When**: `parseBugs` is called
**Then**: the bug's status field is set to "reported"

**Traceability**: data-model.md:Bug:status

---

### TS-033: Missing bug fields default to null

**Source**: data-model.md:Bug:missing-fields
**Type**: validation | **Priority**: P2

**Given**: `bugs.md` contains a bug entry with only `## BUG-001` heading and `**Severity**: critical` (no other fields)
**When**: `parseBugs` is called
**Then**: the bug is returned with `reported: null`, `status: "reported"`, `githubIssue: null`, `description: null`, `rootCause: null`, `fixReference: null`

**Traceability**: data-model.md:Bug:missing-fields

---

### TS-034: FixTask ID must match T-B\d+ pattern

**Source**: data-model.md:FixTask:id-validation
**Type**: validation | **Priority**: P2

**Given**: `tasks.md` contains tasks T-B001, T-B002, T001, and T002
**When**: fix tasks are extracted for bug cross-referencing
**Then**: only T-B001 and T-B002 are identified as fix tasks (isBugFix: true)

**Traceability**: data-model.md:FixTask:id

---

### TS-035: FixTask bugTag must match BUG-\d+ pattern

**Source**: data-model.md:FixTask:bugTag-validation
**Type**: validation | **Priority**: P2

**Given**: `tasks.md` contains `- [ ] T-B001 [BUG-001] Fix login` and `- [ ] T-B002 [INVALID] Fix signup`
**When**: fix tasks are parsed
**Then**: T-B001 has `bugTag: "BUG-001"` and T-B002 has `bugTag: null`

**Traceability**: data-model.md:FixTask:bugTag

---

### TS-036: BugsState summary.open counts only non-fixed bugs

**Source**: data-model.md:BugsState:open-count
**Type**: validation | **Priority**: P1

**Given**: `bugs.md` contains 3 bugs: BUG-001 (reported), BUG-002 (fixed), BUG-003 (reported)
**When**: `computeBugsState` is called
**Then**: `summary.open` is 2 and `summary.fixed` is 1

**Traceability**: FR-002, data-model.md:BugsState:summary

---

### TS-037: highestOpenSeverity returns highest among open bugs only

**Source**: data-model.md:BugsState:highest-severity
**Type**: validation | **Priority**: P1

**Given**: `bugs.md` contains BUG-001 (critical, fixed) and BUG-002 (low, reported)
**When**: `computeBugsState` is called
**Then**: `summary.highestOpenSeverity` is "low" (the critical bug is fixed, so not counted)

**Traceability**: FR-002, data-model.md:BugsState:highestOpenSeverity

---

### TS-038: bySeverity counts only open bugs

**Source**: data-model.md:BugsState:by-severity
**Type**: validation | **Priority**: P1

**Given**: `bugs.md` contains BUG-001 (critical, reported), BUG-002 (critical, fixed), BUG-003 (medium, reported)
**When**: `computeBugsState` is called
**Then**: `summary.bySeverity` is `{ critical: 1, high: 0, medium: 1, low: 0 }`

**Traceability**: FR-002, data-model.md:BugsState:bySeverity

---

### TS-039: Severity hierarchy ordering is critical > high > medium > low

**Source**: data-model.md:Severity-Hierarchy
**Type**: validation | **Priority**: P1

**Given**: `bugs.md` contains open bugs with severities: low, medium, high
**When**: `computeBugsState` is called
**Then**: `summary.highestOpenSeverity` is "high"

**Traceability**: FR-002, data-model.md:Severity-Hierarchy

---

### TS-040: highestOpenSeverity is null when no open bugs

**Source**: data-model.md:BugsState:no-open-bugs
**Type**: validation | **Priority**: P2

**Given**: `bugs.md` contains only fixed bugs
**When**: `computeBugsState` is called
**Then**: `summary.highestOpenSeverity` is null

**Traceability**: FR-002, FR-010, data-model.md:BugsState:highestOpenSeverity

---

### TS-041: GitHub issue reference resolved to URL from git remote

**Source**: spec.md:FR-012
**Type**: validation | **Priority**: P2

**Given**: the git remote origin is `https://github.com/user/repo.git` and a bug has `githubIssue: "#13"`
**When**: the GitHub issue link is rendered
**Then**: the link href is `https://github.com/user/repo/issues/13`

**Traceability**: FR-012

---

### TS-042: GitHub issue reference as plain text when no remote

**Source**: spec.md:FR-012
**Type**: validation | **Priority**: P2

**Given**: no git remote origin is configured and a bug has `githubIssue: "#13"`
**When**: the GitHub issue link is rendered
**Then**: the reference "#13" is displayed as plain text (not a link)

**Traceability**: FR-012

---

### TS-043: parseBugs returns empty array for missing file

**Source**: data-model.md:Bug:missing-file
**Type**: validation | **Priority**: P2

**Given**: no `bugs.md` file exists at the expected path
**When**: `parseBugs` is called
**Then**: an empty array is returned (no error thrown)

**Traceability**: FR-009, data-model.md:Bug

---

### TS-044: parseBugs returns empty array for empty file

**Source**: data-model.md:Bug:empty-file
**Type**: validation | **Priority**: P2

**Given**: `bugs.md` exists but is empty
**When**: `parseBugs` is called
**Then**: an empty array is returned (no error thrown)

**Traceability**: FR-009, data-model.md:Bug

---

### TS-045: Extended parseTasks regex matches both T\d+ and T-B\d+ formats

**Source**: plan.md:Architecture:Parser-Extension
**Type**: validation | **Priority**: P1

**Given**: `tasks.md` contains `- [x] T001 [US1] Feature task` and `- [ ] T-B001 [BUG-001] Bug fix task`
**When**: `parseTasks` is called
**Then**: both tasks are parsed; T001 has `isBugFix: false` and tag "US1"; T-B001 has `isBugFix: true` and bugTag "BUG-001"

**Traceability**: plan.md:Parser-Extension

---

## Summary

| Source | Count | Types |
|--------|-------|-------|
| spec.md | 24 | acceptance |
| plan.md / contracts | 5 | contract |
| data-model.md | 16 | validation |
| **Total** | **45** | |
