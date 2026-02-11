# Test Specifications: Intent Flow Pipeline

**Generated**: 2026-02-11
**Feature**: [spec.md](../spec.md) | **Plan**: [plan.md](../plan.md)

## TDD Assessment

**Determination**: mandatory
**Confidence**: high
**Evidence**: "TDD MUST be used for all feature development. Tests MUST be written before implementation code. The red-green-refactor cycle MUST be strictly followed."
**Reasoning**: Strong indicators (TDD, test-first, red-green-refactor) combined with MUST and NON-NEGOTIABLE in Constitution Principle I.

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

### TS-001: Pipeline shows correct status for partially complete feature

**Source**: spec.md:User Story 1:scenario-1
**Type**: acceptance
**Priority**: P1

**Given**: a feature with spec.md, plan.md, and tasks.md present (tasks 40% complete)
**When**: the pipeline view loads
**Then**: Constitution, Spec, Clarify, Plan, and Tasks nodes show as complete, Checklist shows as not started, and Implement shows as in-progress with "40%" label

**Traceability**: FR-001, FR-002, FR-003, SC-001

---

### TS-002: Pipeline shows only Spec complete for new feature

**Source**: spec.md:User Story 1:scenario-2
**Type**: acceptance
**Priority**: P1

**Given**: a brand new feature with only spec.md created
**When**: the pipeline loads
**Then**: only the Spec node shows as complete, all subsequent nodes show as not started

**Traceability**: FR-002, SC-001

---

### TS-003: Pipeline shows all nodes complete for finished feature

**Source**: spec.md:User Story 1:scenario-3
**Type**: acceptance
**Priority**: P1

**Given**: a feature with all phases complete
**When**: the pipeline loads
**Then**: all nine nodes display as complete with checkmarks

**Traceability**: FR-001, FR-002, FR-004

---

### TS-004: Clicking phase node renders detail view below

**Source**: spec.md:User Story 2:scenario-1
**Type**: acceptance
**Priority**: P1

**Given**: the pipeline is displayed at top
**When**: the developer clicks the "Tasks" phase node
**Then**: the kanban board renders in the content area below and the "Tasks" node is visually highlighted as selected

**Traceability**: FR-005, FR-006, SC-004

---

### TS-005: Switching between phase detail views

**Source**: spec.md:User Story 2:scenario-2
**Type**: acceptance
**Priority**: P1

**Given**: the developer is viewing a phase detail below the pipeline
**When**: they click a different phase node
**Then**: the content area switches to the new phase's detail view

**Traceability**: FR-005, FR-006, SC-004

---

### TS-006: Unbuilt phase shows placeholder

**Source**: spec.md:User Story 2:scenario-3
**Type**: acceptance
**Priority**: P1

**Given**: a phase node for a view that hasn't been built yet
**When**: the developer clicks it
**Then**: a placeholder message appears in the content area indicating the view is coming soon

**Traceability**: FR-005, FR-011

---

### TS-007: Checklist node transitions on artifact creation

**Source**: spec.md:User Story 3:scenario-1
**Type**: acceptance
**Priority**: P1

**Given**: the pipeline is showing Checklist as "not started"
**When**: a checklist file is created in the feature's checklists/ directory
**Then**: the Checklist node transitions to "in progress" within 5 seconds

**Traceability**: FR-002, FR-007, SC-003

---

### TS-008: Implement node updates progress percentage

**Source**: spec.md:User Story 3:scenario-2
**Type**: acceptance
**Priority**: P1

**Given**: Implement node shows "60%"
**When**: additional tasks are checked off bringing completion to 80%
**Then**: the Implement node updates to "80%" within 5 seconds

**Traceability**: FR-003, FR-007, SC-003

---

### TS-009: Implement node transitions to complete

**Source**: spec.md:User Story 3:scenario-3
**Type**: acceptance
**Priority**: P1

**Given**: all tasks are checked off
**When**: the last task completes
**Then**: the Implement node transitions to "complete" with a visual indicator

**Traceability**: FR-002, FR-004, FR-007

---

### TS-010: Feature switching updates all pipeline nodes

**Source**: spec.md:User Story 4:scenario-1
**Type**: acceptance
**Priority**: P2

**Given**: two features exist — one with all phases complete and one with only spec.md
**When**: the developer switches between them
**Then**: the pipeline nodes update to reflect each feature's state

**Traceability**: FR-008, SC-001

---

### TS-011: Selected feature carries into phase detail view

**Source**: spec.md:User Story 4:scenario-2
**Type**: acceptance
**Priority**: P2

**Given**: the developer selects a feature from the pipeline
**When**: they click into a phase detail view
**Then**: the phase detail shows data for the selected feature

**Traceability**: FR-005, FR-008

---

## From plan.md (Contract Tests)

### TS-012: GET /api/pipeline/:feature returns correct phase array

**Source**: plan.md:API Contract:GET /api/pipeline/:feature
**Type**: contract
**Priority**: P1

**Given**: a feature "001-kanban-board" exists with spec.md, plan.md, and tasks.md (3/10 checked)
**When**: GET /api/pipeline/001-kanban-board is requested
**Then**: response is JSON with a "phases" array of 9 objects, each having id, name, status, progress, and optional fields

**Traceability**: FR-001, FR-002

---

### TS-013: Pipeline API returns correct status values per phase

**Source**: plan.md:API Contract:status values
**Type**: contract
**Priority**: P1

**Given**: a feature with CONSTITUTION.md present, spec.md with clarifications, plan.md, checklists at 50%, no test-specs.md, tasks.md with 3/10 checked
**When**: GET /api/pipeline/:feature is requested
**Then**: Constitution=complete, Spec=complete, Clarify=complete, Plan=complete, Checklist=in_progress with "50%", Testify=not_started, Tasks=complete, Analyze=available, Implement=in_progress with "30%"

**Traceability**: FR-002, FR-003, Phase Status Detection Rules

---

### TS-014: Pipeline API returns 404 for nonexistent feature

**Source**: plan.md:API Contract:error handling
**Type**: contract
**Priority**: P1

**Given**: no feature with id "999-nonexistent" exists
**When**: GET /api/pipeline/999-nonexistent is requested
**Then**: response is 404 with error message

**Traceability**: FR-011

---

### TS-015: WebSocket sends pipeline_update on file change

**Source**: plan.md:API Contract:WebSocket Messages
**Type**: contract
**Priority**: P1

**Given**: a client is connected via WebSocket and subscribed to a feature
**When**: a file changes in the feature's specs/ directory
**Then**: the server sends a message with type "pipeline_update" containing the pipeline phases array

**Traceability**: FR-007, SC-003

---

## From data-model.md (Validation Tests)

### TS-016: Constitution detection — complete when file exists

**Source**: data-model.md:Artifact Detection Map:Constitution
**Type**: validation
**Priority**: P1

**Given**: CONSTITUTION.md exists at the project root
**When**: pipeline state is computed
**Then**: Constitution phase status is "complete"

**Traceability**: Phase Status Detection Rules

---

### TS-017: Constitution detection — not started when file missing

**Source**: data-model.md:Artifact Detection Map:Constitution
**Type**: validation
**Priority**: P1

**Given**: CONSTITUTION.md does not exist at the project root
**When**: pipeline state is computed
**Then**: Constitution phase status is "not_started"

**Traceability**: Phase Status Detection Rules

---

### TS-018: Clarify detection — complete when clarifications section exists

**Source**: data-model.md:Artifact Detection Map:Clarify
**Type**: validation
**Priority**: P1

**Given**: spec.md exists and contains a "## Clarifications" section
**When**: pipeline state is computed
**Then**: Clarify phase status is "complete"

**Traceability**: Phase Status Detection Rules

---

### TS-019: Clarify detection — skipped when plan exists without clarifications

**Source**: data-model.md:Artifact Detection Map:Clarify
**Type**: validation
**Priority**: P1

**Given**: spec.md exists without a "## Clarifications" section, and plan.md exists
**When**: pipeline state is computed
**Then**: Clarify phase status is "skipped"

**Traceability**: Phase Status Detection Rules, FR-012, SC-005

---

### TS-020: Checklist detection — in progress with percentage

**Source**: data-model.md:Artifact Detection Map:Checklist
**Type**: validation
**Priority**: P1

**Given**: checklists/ directory contains one file with 4 items total, 2 checked
**When**: pipeline state is computed
**Then**: Checklist phase status is "in_progress" with progress "50%"

**Traceability**: FR-003, Phase Status Detection Rules

---

### TS-021: Checklist detection — complete when all 100%

**Source**: data-model.md:Artifact Detection Map:Checklist
**Type**: validation
**Priority**: P1

**Given**: checklists/ directory contains files where all items are checked
**When**: pipeline state is computed
**Then**: Checklist phase status is "complete"

**Traceability**: Phase Status Detection Rules

---

### TS-022: Testify detection — skipped when TDD not required

**Source**: data-model.md:Artifact Detection Map:Testify
**Type**: validation
**Priority**: P1

**Given**: CONSTITUTION.md exists but contains no TDD indicators, plan.md exists, tests/test-specs.md does not exist
**When**: pipeline state is computed
**Then**: Testify phase status is "skipped" and optional is true

**Traceability**: FR-012, Phase Status Detection Rules

---

### TS-023: Tasks detection — binary complete when file exists

**Source**: data-model.md:Artifact Detection Map:Tasks
**Type**: validation
**Priority**: P1

**Given**: tasks.md exists in the feature directory
**When**: pipeline state is computed
**Then**: Tasks phase status is "complete" with progress null

**Traceability**: Phase Status Detection Rules

---

### TS-024: Analyze detection — not started when no analysis.md

**Source**: data-model.md:Artifact Detection Map:Analyze
**Type**: validation
**Priority**: P1

**Given**: no analysis.md exists in the feature directory
**When**: pipeline state is computed
**Then**: Analyze phase status is "not_started"

**Traceability**: Phase Status Detection Rules

---

### TS-028: Analyze detection — complete when analysis.md exists

**Source**: data-model.md:Artifact Detection Map:Analyze
**Type**: validation
**Priority**: P1

**Given**: analysis.md exists in the feature directory (written by /iikit-07-analyze)
**When**: pipeline state is computed
**Then**: Analyze phase status is "complete"

**Traceability**: Phase Status Detection Rules

---

### TS-025: Implement detection — in progress with percentage

**Source**: data-model.md:Artifact Detection Map:Implement
**Type**: validation
**Priority**: P1

**Given**: tasks.md exists with 10 tasks, 4 checked
**When**: pipeline state is computed
**Then**: Implement phase status is "in_progress" with progress "40%"

**Traceability**: FR-003, Phase Status Detection Rules

---

### TS-026: Default tab — shows Implement when in progress

**Source**: spec.md:FR-009
**Type**: validation
**Priority**: P1

**Given**: a feature with tasks.md where some tasks are checked (implementation in progress)
**When**: the dashboard loads
**Then**: the Implement tab is selected as the default active tab

**Traceability**: FR-009

---

### TS-027: Default tab — shows last completed phase when Implement not in progress

**Source**: spec.md:FR-009
**Type**: validation
**Priority**: P1

**Given**: a feature with spec.md, plan.md, and checklists (all complete), but tasks.md has 0 checked tasks
**When**: the dashboard loads
**Then**: the last completed phase (Checklist) is selected as the default active tab

**Traceability**: FR-009

---

## Summary

| Source | Count | Types |
|--------|-------|-------|
| spec.md | 11 | acceptance |
| plan.md | 4 | contract |
| data-model.md | 13 | validation |
| **Total** | **28** | |
