# Test Specifications: Checklist Quality Gates

**Generated**: 2026-02-17
**Feature**: [spec.md](../spec.md) | **Plan**: [plan.md](../plan.md)

## TDD Assessment

**Determination**: mandatory
**Confidence**: high
**Evidence**: "TDD MUST be used for all feature development. Tests MUST be written before implementation code. The red-green-refactor cycle MUST be strictly followed." (Constitution Principle I, NON-NEGOTIABLE)
**Reasoning**: Constitution explicitly requires test-first development with MUST + NON-NEGOTIABLE markers. All tests in this file must be written and failing before implementation code is written.

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

### TS-001: Progress ring displays correct percentage, color, and label

**Source**: spec.md:User Story 1:scenario-1
**Type**: acceptance
**Priority**: P1

**Given**: a feature with a checklist file "requirements.md" containing 8 checked and 4 unchecked items
**When**: the Checklist phase view loads
**Then**: a progress ring displays showing 67% filled, green color, labeled "Requirements 8/12"

**Traceability**: FR-001, FR-002, FR-003, FR-004, US-1-scenario-1

---

### TS-002: Multiple rings display with correct per-file colors

**Source**: spec.md:User Story 1:scenario-2
**Type**: acceptance
**Priority**: P1

**Given**: a feature with three checklist files at varying completion (0%, 50%, 100%)
**When**: the view loads
**Then**: three rings appear — one red at 0%, one yellow at 50%, one green at 100%

**Traceability**: FR-001, FR-004, FR-013, US-1-scenario-2

---

### TS-003: Single fully complete checklist shows 100% green ring

**Source**: spec.md:User Story 1:scenario-3
**Type**: acceptance
**Priority**: P1

**Given**: a feature with a single checklist file where all items are checked
**When**: the view loads
**Then**: one fully filled green ring displays at 100%

**Traceability**: FR-001, FR-002, FR-004, US-1-scenario-3

---

### TS-004: Gate shows OPEN when all checklists complete

**Source**: spec.md:User Story 2:scenario-1
**Type**: acceptance
**Priority**: P1

**Given**: all checklist files in the feature's checklists/ directory are at 100% completion
**When**: the view loads
**Then**: a green traffic light indicator displays with "GATE: OPEN"

**Traceability**: FR-006, FR-007, SC-001, US-2-scenario-1

---

### TS-005: Gate shows yellow BLOCKED when checklists partially complete

**Source**: spec.md:User Story 2:scenario-2
**Type**: acceptance
**Priority**: P1

**Given**: some checklist files are incomplete (between 1-99%) and none are at 0%
**When**: the view loads
**Then**: a yellow traffic light indicator displays with "GATE: BLOCKED"

**Traceability**: FR-006, FR-007, US-2-scenario-2

---

### TS-006: Gate shows red BLOCKED when any checklist is at 0%

**Source**: spec.md:User Story 2:scenario-3
**Type**: acceptance
**Priority**: P1

**Given**: at least one checklist file has 0% completion (no items checked)
**When**: the view loads
**Then**: a red traffic light indicator displays with "GATE: BLOCKED"

**Traceability**: FR-006, FR-007, US-2-scenario-3

---

### TS-007: Gate transitions from BLOCKED to OPEN in real time

**Source**: spec.md:User Story 2:scenario-4
**Type**: acceptance
**Priority**: P1

**Given**: the gate is showing "BLOCKED"
**When**: the developer checks off the remaining items (files change on disk)
**Then**: the gate transitions to "OPEN" in real time

**Traceability**: FR-007, FR-012, US-2-scenario-4

---

### TS-008: Expanded view shows items grouped by category

**Source**: spec.md:User Story 3:scenario-1
**Type**: acceptance
**Priority**: P2

**Given**: a checklist file with items grouped under two category headings
**When**: the developer clicks its progress ring
**Then**: an expanded view shows items grouped by those categories

**Traceability**: FR-008, FR-009, US-3-scenario-1

---

### TS-009: Expanded view displays CHK identifiers

**Source**: spec.md:User Story 3:scenario-2
**Type**: acceptance
**Priority**: P2

**Given**: an expanded checklist showing items with CHK-xxx IDs
**When**: the developer views the expanded list
**Then**: each item displays its CHK identifier and check status

**Traceability**: FR-008, FR-010, US-3-scenario-2

---

### TS-010: Tags displayed as badges in expanded view

**Source**: spec.md:User Story 3:scenario-3
**Type**: acceptance
**Priority**: P2

**Given**: checklist items that have dimension or reference tags
**When**: the expanded view is shown
**Then**: tags appear as small badges next to the relevant items

**Traceability**: FR-008, FR-011, US-3-scenario-3

---

### TS-011: Expanded view collapses on re-click

**Source**: spec.md:User Story 3:scenario-4
**Type**: acceptance
**Priority**: P2

**Given**: an expanded checklist
**When**: the developer clicks the ring again or clicks a collapse control
**Then**: the expanded view collapses back to the ring summary

**Traceability**: FR-008, US-3-scenario-4

---

### TS-012: Accordion behavior — expanding one collapses another

**Source**: spec.md:User Story 3:scenario-5
**Type**: acceptance
**Priority**: P2

**Given**: one checklist is already expanded
**When**: the developer clicks a different progress ring
**Then**: the previously expanded checklist collapses and the newly clicked one expands (accordion behavior)

**Traceability**: FR-008, US-3-scenario-5

---

### TS-013: Ring animates on live update with color transition

**Source**: spec.md:User Story 4:scenario-1
**Type**: acceptance
**Priority**: P2

**Given**: a progress ring showing 50%
**When**: a checklist file is modified on disk to check off additional items bringing it to 75%
**Then**: the ring animates from 50% to 75% and transitions from yellow to green within 5 seconds

**Traceability**: FR-004, FR-005, FR-012, SC-004, US-4-scenario-1

---

### TS-014: Gate transitions BLOCKED to OPEN on last item completion

**Source**: spec.md:User Story 4:scenario-2
**Type**: acceptance
**Priority**: P2

**Given**: the gate status is "BLOCKED"
**When**: the last unchecked item across all checklists is checked off on disk
**Then**: the gate transitions to "OPEN" within 5 seconds

**Traceability**: FR-007, FR-012, SC-004, US-4-scenario-2

---

### TS-015: Expanded detail view updates items in real time

**Source**: spec.md:User Story 4:scenario-3
**Type**: acceptance
**Priority**: P2

**Given**: an expanded checklist detail view is open
**When**: an item's status changes on disk
**Then**: the item's check status updates in the expanded view

**Traceability**: FR-012, US-4-scenario-3

---

## From plan.md (Contract Tests)

### TS-016: GET /api/checklist/:feature returns correct response shape

**Source**: plan.md:API Contract:GET /api/checklist/:feature
**Type**: contract
**Priority**: P1

**Given**: a feature "001-kanban-board" exists with checklist files in checklists/
**When**: GET /api/checklist/001-kanban-board is requested
**Then**: response is 200 with JSON body containing "files" (array of objects with name, filename, total, checked, percentage, color, items) and "gate" (object with status, level, label)

**Traceability**: plan.md:API Contract

---

### TS-017: GET /api/checklist/:feature returns 404 for unknown feature

**Source**: plan.md:API Contract:error handling
**Type**: contract
**Priority**: P1

**Given**: no feature "999-nonexistent" exists
**When**: GET /api/checklist/999-nonexistent is requested
**Then**: response is 404 with JSON body containing "error" message

**Traceability**: plan.md:API Contract

---

### TS-018: GET /api/checklist/:feature returns empty files array when no checklists

**Source**: plan.md:API Contract:empty state
**Type**: contract
**Priority**: P1

**Given**: a feature exists but has no checklists/ directory
**When**: GET /api/checklist/:feature is requested
**Then**: response is 200 with "files" as empty array and "gate" with status "blocked", level "red", label "GATE: BLOCKED"

**Traceability**: FR-014, plan.md:API Contract

---

### TS-019: checklist_update WebSocket message sent on file change

**Source**: plan.md:WebSocket Message:checklist_update
**Type**: contract
**Priority**: P1

**Given**: a WebSocket client is subscribed to a feature
**When**: a checklist file in that feature's checklists/ directory changes on disk
**Then**: the server sends a message with type "checklist_update", the feature ID, and a "checklist" object matching the API response shape

**Traceability**: FR-012, plan.md:WebSocket Message

---

## From data-model.md (Validation Tests)

### TS-020: parseChecklistsDetailed returns per-file item arrays

**Source**: data-model.md:ChecklistFile:attributes
**Type**: validation
**Priority**: P1

**Given**: a checklists/ directory with two files — "requirements.md" (3 checked, 2 unchecked) and "ux.md" (1 checked, 0 unchecked)
**When**: parseChecklistsDetailed is called on the directory
**Then**: returns array of 2 objects, first with name "Requirements", filename "requirements.md", total 5, checked 3, items array of length 5; second with name "Ux", filename "ux.md", total 1, checked 1, items array of length 1

**Traceability**: data-model.md:ChecklistFile

---

### TS-021: Percentage calculation rounds correctly

**Source**: data-model.md:ChecklistFile:percentage
**Type**: validation
**Priority**: P1

**Given**: a checklist file with 1 checked and 2 unchecked items (3 total)
**When**: percentage is computed
**Then**: percentage equals 33 (Math.round(1/3 * 100) = 33)

**Traceability**: data-model.md:ChecklistFile:percentage, FR-002

---

### TS-022: Color mapping — red for 0-33%

**Source**: data-model.md:Checklist Color Map
**Type**: validation
**Priority**: P1

**Given**: a checklist file with percentage values 0, 15, 33
**When**: color is determined for each
**Then**: all return "red"

**Traceability**: data-model.md:Checklist Color Map, FR-004

---

### TS-023: Color mapping — yellow for 34-66%

**Source**: data-model.md:Checklist Color Map
**Type**: validation
**Priority**: P1

**Given**: a checklist file with percentage values 34, 50, 66
**When**: color is determined for each
**Then**: all return "yellow"

**Traceability**: data-model.md:Checklist Color Map, FR-004

---

### TS-024: Color mapping — green for 67-100%

**Source**: data-model.md:Checklist Color Map
**Type**: validation
**Priority**: P1

**Given**: a checklist file with percentage values 67, 85, 100
**When**: color is determined for each
**Then**: all return "green"

**Traceability**: data-model.md:Checklist Color Map, FR-004

---

### TS-025: Gate status — red when any file at 0%

**Source**: data-model.md:GateStatus:derivation rules
**Type**: validation
**Priority**: P1

**Given**: two checklist files — one at 0% and one at 50%
**When**: gate status is computed
**Then**: gate is { status: "blocked", level: "red", label: "GATE: BLOCKED" }

**Traceability**: data-model.md:GateStatus, FR-007

---

### TS-026: Gate status — yellow when all between 1-99%

**Source**: data-model.md:GateStatus:derivation rules
**Type**: validation
**Priority**: P1

**Given**: two checklist files — one at 25% and one at 75%
**When**: gate status is computed
**Then**: gate is { status: "blocked", level: "yellow", label: "GATE: BLOCKED" }

**Traceability**: data-model.md:GateStatus, FR-007

---

### TS-027: Gate status — green when all at 100%

**Source**: data-model.md:GateStatus:derivation rules
**Type**: validation
**Priority**: P1

**Given**: two checklist files both at 100%
**When**: gate status is computed
**Then**: gate is { status: "open", level: "green", label: "GATE: OPEN" }

**Traceability**: data-model.md:GateStatus, FR-007

---

### TS-028: Gate status — red when no files exist

**Source**: data-model.md:GateStatus:derivation rules
**Type**: validation
**Priority**: P1

**Given**: no checklist files in the checklists/ directory
**When**: gate status is computed
**Then**: gate is { status: "blocked", level: "red", label: "GATE: BLOCKED" }

**Traceability**: data-model.md:GateStatus, FR-014

---

### TS-029: ChecklistItem parsing extracts CHK ID

**Source**: data-model.md:ChecklistItem:parsing rules
**Type**: validation
**Priority**: P2

**Given**: a checklist line "- [x] CHK-001 All stories have acceptance scenarios [spec]"
**When**: the line is parsed
**Then**: item has checked=true, chkId="CHK-001", text="All stories have acceptance scenarios", tags=["spec"]

**Traceability**: data-model.md:ChecklistItem, FR-010, FR-011, FR-015

---

### TS-030: ChecklistItem parsing handles items without CHK ID or tags

**Source**: data-model.md:ChecklistItem:parsing rules
**Type**: validation
**Priority**: P2

**Given**: a checklist line "- [ ] Edge cases identified"
**When**: the line is parsed
**Then**: item has checked=false, chkId=null, text="Edge cases identified", tags=[]

**Traceability**: data-model.md:ChecklistItem, FR-015

---

### TS-031: Category assignment from nearest heading

**Source**: data-model.md:ChecklistItem:category
**Type**: validation
**Priority**: P2

**Given**: a checklist file with "## Requirement Completeness" heading followed by two items, then "## Clarity" heading followed by one item
**When**: items are parsed
**Then**: first two items have category "Requirement Completeness", third has category "Clarity"

**Traceability**: data-model.md:ChecklistItem:category, FR-009

---

### TS-032: Checklist name derived from filename

**Source**: data-model.md:ChecklistFile:name
**Type**: validation
**Priority**: P2

**Given**: checklist filenames "requirements.md", "api-design.md", "ux.md"
**When**: names are derived
**Then**: names are "Requirements", "Api Design", "Ux"

**Traceability**: data-model.md:ChecklistFile:name, FR-003

---

### TS-033: Empty checklist file returns zero total and percentage

**Source**: data-model.md:ChecklistFile:percentage
**Type**: validation
**Priority**: P2

**Given**: a checklist file with no parseable checkbox items
**When**: parsed
**Then**: total=0, checked=0, percentage=0

**Traceability**: data-model.md:ChecklistFile, Edge Case #2

---

## Summary

| Source | Count | Types |
|--------|-------|-------|
| spec.md | 15 | acceptance |
| plan.md | 4 | contract |
| data-model.md | 14 | validation |
| **Total** | **33** | |
