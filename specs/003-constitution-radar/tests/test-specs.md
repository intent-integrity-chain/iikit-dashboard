# Test Specifications: Constitution Radar Chart

**Generated**: 2026-02-11
**Feature**: [spec.md](../spec.md) | **Plan**: [plan.md](../plan.md)

## TDD Assessment

**Determination**: mandatory
**Confidence**: high
**Evidence**: "TDD MUST be used for all feature development. Tests MUST be written before implementation code."
**Reasoning**: Strong indicators (TDD, test-first, red-green-refactor) combined with MUST and NON-NEGOTIABLE.

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

### TS-001: Radar renders with correct obligation levels for 4 principles

**Source**: spec.md:User Story 1:scenario-1
**Type**: acceptance
**Priority**: P1

**Given**: a CONSTITUTION.md with 4 principles (2 MUST, 1 SHOULD, 1 MAY)
**When**: the developer clicks the Constitution pipeline node
**Then**: a radar chart renders with 4 axes, MUST principles at the outer ring, SHOULD at middle, MAY at inner ring

**Traceability**: FR-001, FR-002, SC-001

---

### TS-002: Radar renders with single principle

**Source**: spec.md:User Story 1:scenario-2
**Type**: acceptance
**Priority**: P1

**Given**: a CONSTITUTION.md with a single MUST principle
**When**: the radar renders
**Then**: the chart displays with one axis extending to the outer ring

**Traceability**: FR-002, FR-007

---

### TS-003: Empty state when no constitution exists

**Source**: spec.md:User Story 1:scenario-3
**Type**: acceptance
**Priority**: P1

**Given**: no CONSTITUTION.md exists
**When**: the developer clicks the Constitution node
**Then**: an empty state message is shown suggesting to run /iikit-00-constitution

**Traceability**: FR-006

---

### TS-004: Detail card shows principle on axis click

**Source**: spec.md:User Story 2:scenario-1
**Type**: acceptance
**Priority**: P1

**Given**: the radar chart is displayed
**When**: the developer clicks on a principle axis
**Then**: a detail card shows the principle name, full text, rationale, and obligation level (MUST/SHOULD/MAY)

**Traceability**: FR-003, SC-002

---

### TS-005: Detail card updates on different axis click

**Source**: spec.md:User Story 2:scenario-2
**Type**: acceptance
**Priority**: P1

**Given**: a detail card is open for one principle
**When**: the developer clicks a different axis
**Then**: the card updates to show the new principle's details

**Traceability**: FR-003

---

### TS-006: Amendment timeline shows version and dates

**Source**: spec.md:User Story 3:scenario-1
**Type**: acceptance
**Priority**: P2

**Given**: a CONSTITUTION.md with "Version: 1.1.0", "Ratified: 2026-02-10", "Last Amended: 2026-02-10"
**When**: the Constitution tab renders
**Then**: a timeline appears below the radar showing these dates and version

**Traceability**: FR-004, FR-009

---

### TS-007: Timeline hidden when no version metadata

**Source**: spec.md:User Story 3:scenario-2
**Type**: acceptance
**Priority**: P2

**Given**: a CONSTITUTION.md with no version metadata
**When**: the tab renders
**Then**: the timeline section is hidden

**Traceability**: FR-009

---

## From plan.md (Contract Tests)

### TS-008: GET /api/constitution returns principles array

**Source**: plan.md:API Contract:GET /api/constitution
**Type**: contract
**Priority**: P1

**Given**: a CONSTITUTION.md with 4 principles exists
**When**: GET /api/constitution is requested
**Then**: response is JSON with "principles" array of 4 objects each having number, name, text, rationale, and level fields, plus "version" object and "exists": true

**Traceability**: FR-001

---

### TS-009: GET /api/constitution returns empty when no file

**Source**: plan.md:API Contract:GET /api/constitution (missing)
**Type**: contract
**Priority**: P1

**Given**: no CONSTITUTION.md exists
**When**: GET /api/constitution is requested
**Then**: response is JSON with "principles": [], "version": null, "exists": false

**Traceability**: FR-006

---

### TS-010: WebSocket sends constitution_update on file change

**Source**: plan.md:API Contract:WebSocket Messages
**Type**: contract
**Priority**: P1

**Given**: a client is connected via WebSocket
**When**: CONSTITUTION.md changes on disk
**Then**: the server sends a message with type "constitution_update" containing the parsed constitution data

**Traceability**: FR-005

---

## From data-model.md (Validation Tests)

### TS-011: Parser extracts principle name from heading

**Source**: data-model.md:Principle:parsing rules
**Type**: validation
**Priority**: P1

**Given**: a CONSTITUTION.md with heading "### I. Test-First Development (NON-NEGOTIABLE)"
**When**: principles are parsed
**Then**: principle has number "I", name "Test-First Development"

**Traceability**: FR-001

---

### TS-012: Parser extracts obligation level MUST

**Source**: data-model.md:Principle:level
**Type**: validation
**Priority**: P1

**Given**: a principle with text containing "TDD MUST be used"
**When**: the obligation level is determined
**Then**: level is "MUST"

**Traceability**: FR-001, FR-002

---

### TS-013: Parser extracts obligation level SHOULD

**Source**: data-model.md:Principle:level
**Type**: validation
**Priority**: P1

**Given**: a principle with text containing "Code SHOULD be documented"
**When**: the obligation level is determined
**Then**: level is "SHOULD"

**Traceability**: FR-001, FR-002

---

### TS-014: Parser defaults to SHOULD when no keywords

**Source**: data-model.md:Principle:level + edge case
**Type**: validation
**Priority**: P1

**Given**: a principle with text containing no MUST/SHOULD/MAY keywords
**When**: the obligation level is determined
**Then**: level defaults to "SHOULD"

**Traceability**: FR-001, edge case

---

### TS-015: Parser extracts rationale text

**Source**: data-model.md:Principle:rationale
**Type**: validation
**Priority**: P1

**Given**: a principle with "**Rationale**: Prevents circular verification."
**When**: principles are parsed
**Then**: rationale field contains "Prevents circular verification."

**Traceability**: FR-001

---

### TS-016: Parser extracts version metadata from footer

**Source**: data-model.md:VersionInfo:parsing rules
**Type**: validation
**Priority**: P1

**Given**: a CONSTITUTION.md with footer "**Version**: 1.1.0 | **Ratified**: 2026-02-10 | **Last Amended**: 2026-02-10"
**When**: the constitution is parsed
**Then**: version object has version "1.1.0", ratified "2026-02-10", lastAmended "2026-02-10"

**Traceability**: FR-004

---

### TS-017: Parser returns null version when no footer

**Source**: data-model.md:VersionInfo:parsing rules
**Type**: validation
**Priority**: P1

**Given**: a CONSTITUTION.md with no version footer line
**When**: the constitution is parsed
**Then**: version is null

**Traceability**: FR-009

---

### TS-018: Obligation level mapping values

**Source**: data-model.md:Obligation Level Mapping
**Type**: validation
**Priority**: P1

**Given**: the obligation level mapping
**When**: levels are mapped to radar distances
**Then**: MUST maps to value 3 (100%), SHOULD to 2 (66%), MAY to 1 (33%)

**Traceability**: FR-002

---

## Summary

| Source | Count | Types |
|--------|-------|-------|
| spec.md | 7 | acceptance |
| plan.md | 3 | contract |
| data-model.md | 8 | validation |
| **Total** | **18** | |
