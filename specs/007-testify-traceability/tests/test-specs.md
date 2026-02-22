# Test Specifications: Testify Traceability — Sankey Diagram + Test Pyramid

**Generated**: 2026-02-17
**Feature**: [spec.md](../spec.md) | **Plan**: [plan.md](../plan.md)

## TDD Assessment

**Determination**: mandatory
**Confidence**: high
**Evidence**: "TDD MUST be used for all feature development. Tests MUST be written before implementation code. The red-green-refactor cycle MUST be strictly followed" (Section I, NON-NEGOTIABLE)
**Reasoning**: Strong indicators (TDD, test-first, red-green-refactor) combined with MUST and NON-NEGOTIABLE markers in constitution v1.1.0.

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

### TS-001: Sankey diagram renders three columns with flow bands

**Source**: spec.md:User Story 1:scenario-1
**Type**: acceptance
**Priority**: P1

**Given**: a feature with spec.md containing 5 functional requirements and 3 success criteria, test-specs.md containing 8 test specs with traceability links, and tasks.md containing 12 tasks referencing test specs
**When**: the Testify phase view loads
**Then**: a Sankey diagram renders with three columns showing requirements on the left, test specs in the middle, and tasks on the right, with colored flow bands connecting linked items

**Traceability**: FR-001, FR-002, FR-003, FR-004, FR-005, SC-002, US-001-scenario-1

---

### TS-002: Multi-requirement traceability renders separate flow bands

**Source**: spec.md:User Story 1:scenario-2
**Type**: acceptance
**Priority**: P1

**Given**: a test spec (TS-003) that traces to two requirements (FR-001 and FR-002)
**When**: the Sankey diagram renders
**Then**: two separate flow bands connect FR-001 to TS-003 and FR-002 to TS-003

**Traceability**: FR-005, SC-002, US-001-scenario-2

---

### TS-003: Sankey nodes display identifiers and labels

**Source**: spec.md:User Story 1:scenario-3
**Type**: acceptance
**Priority**: P1

**Given**: a feature with complete traceability data
**When**: the Sankey diagram loads
**Then**: each column displays the identifier (FR-xxx, TS-xxx, T-xxx) and a short label for each node

**Traceability**: FR-017, FR-018, SC-003, US-001-scenario-3

---

### TS-004: Untested requirement highlighted as gap

**Source**: spec.md:User Story 2:scenario-1
**Type**: acceptance
**Priority**: P1

**Given**: a requirement FR-004 that is not referenced in any test spec's traceability links
**When**: the Sankey diagram renders
**Then**: FR-004 is highlighted in an alert color (red) as an untested requirement with no outgoing flow bands

**Traceability**: FR-006, SC-001, US-002-scenario-1

---

### TS-005: Unimplemented test spec highlighted as gap

**Source**: spec.md:User Story 2:scenario-2
**Type**: acceptance
**Priority**: P1

**Given**: a test spec TS-005 that is not referenced by any task in tasks.md
**When**: the Sankey diagram renders
**Then**: TS-005 is highlighted in an alert color on its right edge, showing it as an unimplemented test with no outgoing flow band to tasks

**Traceability**: FR-006, SC-001, US-002-scenario-2

---

### TS-006: No gaps when traceability is complete

**Source**: spec.md:User Story 2:scenario-3
**Type**: acceptance
**Priority**: P1

**Given**: all requirements are covered by tests and all tests are covered by tasks
**When**: the Sankey diagram renders
**Then**: no nodes are highlighted as gaps — all nodes have complete flow connections

**Traceability**: FR-006, SC-002, US-002-scenario-3

---

### TS-007: Gap nodes visually distinct within 3 seconds

**Source**: spec.md:User Story 2:scenario-4
**Type**: acceptance
**Priority**: P1

**Given**: a feature with 3 out of 10 requirements uncovered
**When**: the developer views the diagram
**Then**: the 3 gap nodes are visually distinct enough to be spotted within 3 seconds

**Traceability**: FR-006, SC-001, US-002-scenario-4

---

### TS-008: Test pyramid groups nodes by type in middle column

**Source**: spec.md:User Story 3:scenario-1
**Type**: acceptance
**Priority**: P2

**Given**: test-specs.md contains 3 acceptance tests, 5 contract tests, and 8 validation tests
**When**: the Sankey diagram renders
**Then**: the middle column groups test spec nodes into three clusters labeled "Acceptance: 3" (top, narrow), "Contract: 5" (middle), "Validation: 8" (bottom, wide), forming a pyramidal shape

**Traceability**: FR-007, FR-008, SC-005, US-003-scenario-1

---

### TS-009: Flow bands connect to correct pyramid group nodes

**Source**: spec.md:User Story 3:scenario-2
**Type**: acceptance
**Priority**: P2

**Given**: test-specs.md contains test specs of all three types
**When**: the middle column renders
**Then**: flow bands from requirements connect to the correct test spec nodes within their type groups, preserving traceability across the pyramid layout

**Traceability**: FR-005, FR-007, SC-002, US-003-scenario-2

---

### TS-010: Pyramid cluster width reflects test distribution

**Source**: spec.md:User Story 3:scenario-3
**Type**: acceptance
**Priority**: P2

**Given**: test-specs.md contains 10 validation tests and 2 acceptance tests
**When**: the Sankey renders
**Then**: the validation cluster at the bottom is visually wider than the acceptance cluster at the top, reflecting the test distribution shape

**Traceability**: FR-007, SC-005, US-003-scenario-3

---

### TS-011: Integrity seal shows Verified when hashes match

**Source**: spec.md:User Story 4:scenario-1
**Type**: acceptance
**Priority**: P2

**Given**: context.json contains an assertion_hash that matches the current content of test-specs.md
**When**: the Testify view loads
**Then**: an integrity seal displays "Verified" with a green indicator

**Traceability**: FR-009, FR-010, SC-004, US-004-scenario-1

---

### TS-012: Integrity seal shows Tampered when hashes differ

**Source**: spec.md:User Story 4:scenario-2
**Type**: acceptance
**Priority**: P2

**Given**: test-specs.md has been modified after the hash was recorded (hashes differ)
**When**: the Testify view loads
**Then**: the integrity seal displays "Tampered" with a red indicator

**Traceability**: FR-009, FR-010, SC-004, US-004-scenario-2

---

### TS-013: Integrity seal shows Missing when no hash recorded

**Source**: spec.md:User Story 4:scenario-3
**Type**: acceptance
**Priority**: P2

**Given**: context.json does not contain a testify section or assertion_hash
**When**: the Testify view loads
**Then**: the integrity seal displays "Missing" with a grey indicator

**Traceability**: FR-009, FR-010, SC-004, US-004-scenario-3

---

### TS-014: Integrity seal hidden when no test-specs.md

**Source**: spec.md:User Story 4:scenario-4
**Type**: acceptance
**Priority**: P2

**Given**: test-specs.md does not exist for the selected feature
**When**: the Testify view loads
**Then**: the integrity seal is not displayed (replaced by the empty state)

**Traceability**: FR-010, FR-014, US-004-scenario-4

---

### TS-015: Hover highlights full traceability chain

**Source**: spec.md:User Story 5:scenario-1
**Type**: acceptance
**Priority**: P3

**Given**: TS-003 traces to FR-001 and FR-002, and task T-007 references TS-003
**When**: the developer hovers over TS-003
**Then**: FR-001, FR-002, TS-003, T-007, and all connecting flow bands are highlighted while other elements dim

**Traceability**: FR-011, SC-008, US-005-scenario-1

---

### TS-016: Hover on requirement highlights downstream chain

**Source**: spec.md:User Story 5:scenario-2
**Type**: acceptance
**Priority**: P3

**Given**: the developer hovers over a requirement node FR-005
**When**: the hover activates
**Then**: all downstream test specs and tasks connected to FR-005 are highlighted

**Traceability**: FR-011, SC-008, US-005-scenario-2

---

### TS-017: Hover deactivation restores default appearance

**Source**: spec.md:User Story 5:scenario-3
**Type**: acceptance
**Priority**: P3

**Given**: a highlighted chain is active
**When**: the developer moves the cursor away from the diagram
**Then**: all elements return to their default appearance

**Traceability**: FR-011, US-005-scenario-3

---

### TS-018: Real-time Sankey update on new test spec

**Source**: spec.md:User Story 6:scenario-1
**Type**: acceptance
**Priority**: P3

**Given**: the Sankey diagram is displayed
**When**: test-specs.md is modified to add a new test spec TS-010 with a traceability link to FR-003
**Then**: a new node TS-010 and its flow band appear in the diagram within 5 seconds

**Traceability**: FR-012, SC-006, US-006-scenario-1

---

### TS-019: Real-time pyramid update on new validation tests

**Source**: spec.md:User Story 6:scenario-2
**Type**: acceptance
**Priority**: P3

**Given**: the Sankey diagram is displayed
**When**: test-specs.md is modified to add two new validation tests
**Then**: the validation cluster count in the middle column increases and new nodes appear within 5 seconds

**Traceability**: FR-007, FR-012, SC-005, SC-006, US-006-scenario-2

---

### TS-020: Real-time integrity seal update on tamper

**Source**: spec.md:User Story 6:scenario-3
**Type**: acceptance
**Priority**: P3

**Given**: the integrity seal shows "Verified"
**When**: test-specs.md is modified without updating context.json
**Then**: the seal transitions to "Tampered" within 5 seconds

**Traceability**: FR-009, FR-010, FR-012, SC-004, SC-006, US-006-scenario-3

---

## From plan.md (Contract Tests)

### TS-021: GET /api/testify/:feature returns complete TestifyViewState

**Source**: plan.md:API Contract:GET /api/testify/:feature
**Type**: contract
**Priority**: P1

**Given**: a feature directory contains spec.md with requirements, tests/test-specs.md with test specs including traceability links, tasks.md with tasks referencing test specs, and context.json with a valid assertion hash
**When**: a GET request is made to /api/testify/:feature
**Then**: the response is JSON with status 200 containing: requirements array (id, text), testSpecs array (id, title, type, priority, traceability), tasks array (id, description, testSpecRefs), edges array (from, to, type), gaps object (untestedRequirements, unimplementedTests), pyramid object (acceptance, contract, validation with count and ids), integrity object (status, currentHash, storedHash), and exists: true

**Traceability**: FR-001, FR-002, FR-003, FR-004, FR-009

---

### TS-022: GET /api/testify/:feature returns empty state when test-specs.md missing

**Source**: plan.md:API Contract:GET /api/testify/:feature (empty)
**Type**: contract
**Priority**: P1

**Given**: a feature directory exists but contains no tests/test-specs.md file
**When**: a GET request is made to /api/testify/:feature
**Then**: the response is JSON with status 200 containing: empty arrays for requirements, testSpecs, tasks, and edges; empty arrays in gaps; zero counts in all pyramid tiers; integrity status "missing" with null hashes; and exists: false

**Traceability**: FR-014

---

### TS-023: WebSocket pushes testify_update on file change

**Source**: plan.md:API Contract:WebSocket testify_update
**Type**: contract
**Priority**: P1

**Given**: a WebSocket client is connected and a feature is selected
**When**: test-specs.md, spec.md, tasks.md, or context.json changes on disk
**Then**: the server sends a testify_update message containing the feature identifier and the complete testify state object (same shape as GET response), within 5 seconds

**Traceability**: FR-012, SC-006

---

## From data-model.md (Validation Tests)

### TS-024: parseTestSpecs extracts id and title from heading pattern

**Source**: data-model.md:TestSpecNode:heading pattern
**Type**: validation
**Priority**: P2

**Given**: test-specs.md content containing a heading `### TS-001: Login with valid credentials`
**When**: parseTestSpecs() parses the content
**Then**: the result contains an entry with id "TS-001" and title "Login with valid credentials"

**Traceability**: TestSpecNode.id, TestSpecNode.title

---

### TS-025: parseTestSpecs extracts type as acceptance, contract, or validation

**Source**: data-model.md:TestSpecNode:type constraint
**Type**: validation
**Priority**: P2

**Given**: test-specs.md content with a test spec containing `**Type**: acceptance`
**When**: parseTestSpecs() parses the content
**Then**: the result entry has type "acceptance"; similarly "contract" and "validation" are correctly extracted

**Traceability**: TestSpecNode.type

---

### TS-026: parseTestSpecs extracts traceability links filtered to FR-/SC- patterns

**Source**: data-model.md:TestSpecNode:traceability filtering
**Type**: validation
**Priority**: P2

**Given**: test-specs.md content with `**Traceability**: FR-001, SC-002, US-001-scenario-1`
**When**: parseTestSpecs() parses the content
**Then**: the traceability array contains ["FR-001", "SC-002"] — US-xxx references are filtered out, only FR-xxx and SC-xxx are retained

**Traceability**: TestSpecNode.traceability

---

### TS-027: parseTaskTestRefs extracts "must pass TS-xxx" references

**Source**: data-model.md:TaskNode:testSpecRefs extraction
**Type**: validation
**Priority**: P2

**Given**: a parsed tasks array where one task description contains "must pass TS-014, TS-015"
**When**: parseTaskTestRefs() processes the tasks
**Then**: the result maps that task's id to testSpecRefs ["TS-014", "TS-015"]; tasks without "must pass" have empty arrays

**Traceability**: TaskNode.testSpecRefs

---

### TS-028: Edge derivation ignores orphaned references

**Source**: data-model.md:Edge:orphan handling
**Type**: validation
**Priority**: P2

**Given**: a test spec with traceability link to "FR-099" which does not exist in the parsed requirements, and a task referencing "TS-999" which does not exist in parsed test specs
**When**: edges are derived
**Then**: no edge is created for the FR-099 or TS-999 references — only edges where both source and target nodes exist in the parsed data are included

**Traceability**: Edge.derivation rules

---

### TS-029: GapReport identifies untested requirements

**Source**: data-model.md:GapReport:untested requirements
**Type**: validation
**Priority**: P2

**Given**: requirements [FR-001, FR-002, FR-003] where FR-001 and FR-002 each appear as "from" in requirement-to-test edges, but FR-003 does not
**When**: gaps are computed
**Then**: untestedRequirements contains ["FR-003"]

**Traceability**: GapReport.untestedRequirements

---

### TS-030: GapReport identifies unimplemented tests

**Source**: data-model.md:GapReport:unimplemented tests
**Type**: validation
**Priority**: P2

**Given**: test specs [TS-001, TS-002, TS-003] where TS-001 and TS-002 each appear as "from" in test-to-task edges, but TS-003 does not
**When**: gaps are computed
**Then**: unimplementedTests contains ["TS-003"]

**Traceability**: GapReport.unimplementedTests

---

### TS-031: IntegrityState returns correct status based on hash comparison

**Source**: data-model.md:IntegrityState:status determination
**Type**: validation
**Priority**: P2

**Given**: three scenarios — (a) stored hash matches current hash, (b) stored hash differs from current hash, (c) no stored hash exists
**When**: integrity state is computed for each scenario
**Then**: (a) status is "valid", (b) status is "tampered", (c) status is "missing"

**Traceability**: IntegrityState.status, IntegrityState.derivation rules

---

### TS-032: PyramidState groups test specs by type with correct counts

**Source**: data-model.md:PyramidState:grouping
**Type**: validation
**Priority**: P2

**Given**: test specs with types: 3 acceptance, 5 contract, 8 validation
**When**: pyramid state is computed
**Then**: acceptance.count is 3, contract.count is 5, validation.count is 8, and each tier's ids array contains the corresponding test spec IDs

**Traceability**: PyramidState.derivation rules

---

## Bug Fix Tests

### TS-033: parseTestSpecs parses Gherkin .feature file format

**Source**: BUG-001:Gherkin parser support
**Type**: validation
**Priority**: P1

**Given**: a Gherkin .feature file containing `@TS-001 @P1 @acceptance @FR-001 @SC-001` tags followed by `Scenario: Login with valid credentials` and Given/When/Then steps
**When**: parseTestSpecs() parses the content
**Then**: the result contains an entry with id "TS-001", title "Login with valid credentials", type "acceptance", priority "P1", and traceability ["FR-001", "SC-001"]

**Traceability**: FR-001, BUG-001

---

### TS-034: computeAssertionHash extracts Gherkin step lines from multiple sorted files

**Source**: BUG-001:integrity hash migration
**Type**: validation
**Priority**: P1

**Given**: two .feature files where file "a.feature" contains `Given a user` / `When they login` / `Then they see dashboard` and file "b.feature" contains `Given an admin` / `When they login` / `Then they see admin panel`
**When**: computeAssertionHash() is called with the concatenated content (files sorted by name)
**Then**: the hash is computed from lines matching `^\s*(Given|When|Then|And|But) ` with leading whitespace stripped, producing a deterministic SHA256 hash

**Traceability**: FR-009, FR-010, BUG-001

---

### TS-035: Pipeline detects Testify phase from .feature files

**Source**: BUG-001:pipeline detection
**Type**: validation
**Priority**: P1

**Given**: a feature directory containing tests/features/acceptance.feature but no tests/test-specs.md
**When**: computePipelineState() evaluates the testify phase
**Then**: the testify phase status is "complete" (not "not_started")

**Traceability**: FR-013, BUG-001

---

### TS-036: computeTestifyState aggregates test specs from multiple .feature files

**Source**: BUG-001:multi-file aggregation
**Type**: validation
**Priority**: P1

**Given**: a feature directory with tests/features/acceptance.feature containing 3 test specs and tests/features/validation.feature containing 2 test specs
**When**: computeTestifyState() is called
**Then**: the returned testSpecs array contains all 5 test specs with correct ids, types, priorities, and traceability links

**Traceability**: FR-001, FR-002, BUG-001

---

### TS-037: Gherkin Background and Scenario Outline parsed without breaking

**Source**: BUG-001:advanced Gherkin constructs
**Type**: validation
**Priority**: P2

**Given**: a .feature file containing Background: with shared Given steps, Scenario Outline: with Examples: table, and Rule: grouping
**When**: parseTestSpecs() parses the content
**Then**: the parser does not throw errors and correctly extracts tagged scenarios (Background steps are not counted as separate test specs)

**Traceability**: FR-001, BUG-001

---

## Summary

| Source | Count | Types |
|--------|-------|-------|
| spec.md | 20 | acceptance |
| plan.md | 3 | contract |
| data-model.md | 9 | validation |
| BUG-001 | 5 | validation |
| **Total** | **37** | |
