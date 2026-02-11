# Test Specifications: IIKit Kanban Board

**Generated**: 2026-02-10
**Feature**: [spec.md](../spec.md) | **Plan**: [plan.md](../plan.md)

## TDD Assessment

**Determination**: mandatory
**Confidence**: high
**Evidence**: "TDD MUST be used for all feature development. Tests MUST be written before implementation code."
**Reasoning**: Strong TDD indicator found with MUST modifier

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

### TS-001: Live task checkbox update

**Source**: spec.md:User Story 1:scenario-1
**Type**: acceptance
**Priority**: P1

**Given**: a feature with tasks.md containing 10 unchecked tasks tagged [US1] and [US2]
**When**: an agent checks off a [US1] task in tasks.md
**Then**: the checkbox for that task updates on the US1 card within 5 seconds

**Traceability**: FR-002, FR-005, SC-002

---

### TS-002: Card moves to Done on final task

**Source**: spec.md:User Story 1:scenario-2
**Type**: acceptance
**Priority**: P1

**Given**: a US1 card in the "In Progress" column with 3/4 tasks checked
**When**: the final task is checked off in tasks.md
**Then**: the card moves to the "Done" column with a completion animation

**Traceability**: FR-006, SC-002

---

### TS-003: Card moves to In Progress on first task

**Source**: spec.md:User Story 1:scenario-3
**Type**: acceptance
**Priority**: P1

**Given**: all story cards in the "Todo" column with 0 tasks checked
**When**: the first task of US2 is checked in tasks.md
**Then**: the US2 card moves from "Todo" to "In Progress"

**Traceability**: FR-006

---

### TS-004: All stories in Todo on load

**Source**: spec.md:User Story 2:scenario-1
**Type**: acceptance
**Priority**: P1

**Given**: a feature with 4 user stories and all tasks unchecked
**When**: the dashboard loads
**Then**: 4 cards appear in the "Todo" column

**Traceability**: FR-001, FR-003, FR-004, SC-001

---

### TS-005: Story card shows progress bar

**Source**: spec.md:User Story 2:scenario-2
**Type**: acceptance
**Priority**: P1

**Given**: a tasks.md with 5 tasks tagged [US1] where 3 are checked
**When**: the board renders
**Then**: the US1 card is in "In Progress" showing a progress indicator at 3/5

**Traceability**: FR-006, FR-004, SC-004

---

### TS-006: Completed story in Done column

**Source**: spec.md:User Story 2:scenario-3
**Type**: acceptance
**Priority**: P1

**Given**: a story with all 3 tasks checked
**When**: the board renders
**Then**: the card is in the "Done" column with all checkboxes ticked

**Traceability**: FR-006

---

### TS-007: Feature selector shows multiple features

**Source**: spec.md:User Story 3:scenario-1
**Type**: acceptance
**Priority**: P2

**Given**: a project with features 001-auth and 002-payments both having tasks.md
**When**: the dashboard loads
**Then**: a feature selector shows both features

**Traceability**: FR-007

---

### TS-008: Feature switching updates board

**Source**: spec.md:User Story 3:scenario-2
**Type**: acceptance
**Priority**: P2

**Given**: the dashboard is showing 001-auth
**When**: the user selects 002-payments in the feature selector
**Then**: the board updates to show 002-payments' stories and tasks

**Traceability**: FR-007

---

### TS-009: Integrity badge shows verified

**Source**: spec.md:User Story 4:scenario-1
**Type**: acceptance
**Priority**: P2

**Given**: a feature with test-specs.md and a valid assertion hash in context.json
**When**: the board renders
**Then**: a "verified" badge is displayed

**Traceability**: FR-008, SC-005

---

### TS-010: Integrity badge shows tampered

**Source**: spec.md:User Story 4:scenario-2
**Type**: acceptance
**Priority**: P2

**Given**: a feature where test-specs.md assertions were modified after testify (hash mismatch)
**When**: the board renders
**Then**: a "tampered" warning badge appears prominently

**Traceability**: FR-008, SC-005

---

## From plan.md (Contract Tests)

### TS-011: GET /api/features returns feature list

**Source**: plan.md:API Contract:GET /api/features
**Type**: contract
**Priority**: P1

**Given**: a project with 2 features in specs/
**When**: GET /api/features is requested
**Then**: the response is a JSON array with 2 feature objects containing id, name, stories, and progress fields

**Traceability**: FR-001, FR-007

---

### TS-012: GET /api/board/:feature returns board state

**Source**: plan.md:API Contract:GET /api/board/:feature
**Type**: contract
**Priority**: P1

**Given**: a feature 001-kanban-board with 3 stories and tasks at various completion states
**When**: GET /api/board/001-kanban-board is requested
**Then**: the response is a JSON object with todo, in_progress, and done arrays containing story cards with tasks

**Traceability**: FR-003, FR-004, FR-006

---

### TS-013: WebSocket pushes board update on file change

**Source**: plan.md:WebSocket Messages:board_update
**Type**: contract
**Priority**: P1

**Given**: a WebSocket connection is open and tasks.md exists for a feature
**When**: tasks.md is modified on disk
**Then**: a board_update message is pushed to the client within 5 seconds containing the updated board state

**Traceability**: FR-005, FR-014, SC-002

---

## From data-model.md (Validation Tests)

### TS-014: Parser extracts user stories from spec.md

**Source**: data-model.md:UserStory:Parsing Rules
**Type**: validation
**Priority**: P1

**Given**: a spec.md with "### User Story 1 - Watch an Agent Work (Priority: P1)"
**When**: the parser processes the file
**Then**: a UserStory object is returned with id "US1", title "Watch an Agent Work", priority "P1"

**Traceability**: FR-001

---

### TS-015: Parser extracts tasks from tasks.md

**Source**: data-model.md:Task:Parsing Rules
**Type**: validation
**Priority**: P1

**Given**: a tasks.md line "- [x] T003 [US1] Implement WebSocket server"
**When**: the parser processes the line
**Then**: a Task object is returned with id "T003", storyTag "US1", description "Implement WebSocket server", checked true

**Traceability**: FR-002

---

### TS-016: Board state computes column assignment correctly

**Source**: data-model.md:BoardState:Column Assignment
**Type**: validation
**Priority**: P1

**Given**: a story with 3 tasks where 1 is checked and 2 are unchecked
**When**: the board state is computed
**Then**: the story is assigned to the "in_progress" column

**Traceability**: FR-006

---

### TS-017: Integrity check detects hash mismatch

**Source**: data-model.md:IntegrityStatus
**Type**: validation
**Priority**: P2

**Given**: a test-specs.md with currentHash "abc123" and context.json storedHash "def456"
**When**: the integrity check runs
**Then**: the status is "tampered"

**Traceability**: FR-008

---

## Summary

| Source | Count | Types |
|--------|-------|-------|
| spec.md | 10 | acceptance |
| plan.md | 3 | contract |
| data-model.md | 4 | validation |
| **Total** | **17** | |
