# Feature Specification: Testify Traceability — Sankey Diagram + Test Pyramid

**Feature Branch**: `007-testify-traceability`
**Created**: 2026-02-17
**Status**: Draft
**Input**: User description: "Visualize the test specification phase with a traceability Sankey diagram and test pyramid. Sankey flows from requirements through tests to tasks with gap highlighting. Test pyramid shows acceptance/contract/validation counts by status. Integrity seal from assertion hash verification. Renders as Phase 5 (Testify) in the pipeline."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See How Intent Flows from Requirements Through Tests to Tasks (Priority: P1)

A developer navigates to the Testify phase in the pipeline and sees a traceability Sankey diagram. The diagram has three columns: requirements on the left (FR-xxx and SC-xxx identifiers from spec.md), test specifications in the middle (TS-xxx from tests/test-specs.md), and implementation tasks on the right (T-xxx from tasks.md). Colored bands connect requirements to the tests that verify them, and tests to the tasks that implement them, based on the traceability links in test-specs.md. The developer can instantly trace any requirement through its verification and implementation chain.

**Why this priority**: The Sankey diagram is the central visualization of this feature. It answers the core question of the Testify phase: "Is every requirement verified by a test, and is every test backed by an implementation task?" Without it, there is no traceability view.

**Independent Test**: Can be tested by creating a feature with spec.md containing 3 requirements (FR-001, FR-002, FR-003), test-specs.md containing 4 test specs (TS-001 tracing to FR-001, TS-002 tracing to FR-001 and FR-002, TS-003 tracing to FR-003, TS-004 tracing to FR-003), and tasks.md with tasks referencing TS-001 through TS-004. Open the Testify phase and verify the Sankey diagram renders with correct columns, nodes, and flow bands.

**Acceptance Scenarios**:

1. **Given** a feature with spec.md containing 5 functional requirements and 3 success criteria, test-specs.md containing 8 test specs with traceability links, and tasks.md containing 12 tasks referencing test specs, **When** the Testify phase view loads, **Then** a Sankey diagram renders with three columns showing requirements on the left, test specs in the middle, and tasks on the right, with colored flow bands connecting linked items
2. **Given** a test spec (TS-003) that traces to two requirements (FR-001 and FR-002), **When** the Sankey diagram renders, **Then** two separate flow bands connect FR-001 to TS-003 and FR-002 to TS-003
3. **Given** a feature with complete traceability data, **When** the Sankey diagram loads, **Then** each column displays the identifier (FR-xxx, TS-xxx, T-xxx) and a short label for each node

---

### User Story 2 - Spot Coverage Gaps in the Traceability Chain (Priority: P1)

While viewing the Sankey diagram, the developer notices that some requirements have no flow bands leading to test specs — these are untested requirements. Some test specs may have no flow bands leading to tasks — these are unimplemented tests. These "dead ends" are visually highlighted in a distinct alert color so they stand out immediately. The developer can scan the diagram and instantly identify where the traceability chain is broken.

**Why this priority**: Gap detection is the primary value proposition of the traceability view. Without it, the Sankey is just a pretty picture. Highlighting gaps turns it into an actionable quality tool that surfaces real risks.

**Independent Test**: Can be tested by creating a feature with one requirement (FR-004) that has no matching test spec, and one test spec (TS-005) that has no matching task. Verify FR-004 appears highlighted as an untested requirement and TS-005 appears highlighted as an unimplemented test.

**Acceptance Scenarios**:

1. **Given** a requirement FR-004 that is not referenced in any test spec's traceability links, **When** the Sankey diagram renders, **Then** FR-004 is highlighted in an alert color (red) as an untested requirement with no outgoing flow bands
2. **Given** a test spec TS-005 that is not referenced by any task in tasks.md, **When** the Sankey diagram renders, **Then** TS-005 is highlighted in an alert color on its right edge, showing it as an unimplemented test with no outgoing flow band to tasks
3. **Given** all requirements are covered by tests and all tests are covered by tasks, **When** the Sankey diagram renders, **Then** no nodes are highlighted as gaps — all nodes have complete flow connections
4. **Given** a feature with 3 out of 10 requirements uncovered, **When** the developer views the diagram, **Then** the 3 gap nodes are visually distinct enough to be spotted within 3 seconds

---

### User Story 3 - Understand Test Type Distribution in the Test Pyramid (Priority: P2)

Within the Sankey diagram itself, the middle column (test specifications) is arranged as an integrated test pyramid. Test spec nodes are grouped by type — acceptance tests at the top (fewest, narrow cluster), contract tests in the middle, and validation tests at the bottom (most, wide cluster) — forming a triangular shape. Each group shows a type label and count. This dual-purpose layout lets the developer see both traceability flows and test distribution in a single unified visualization without switching between separate views.

**Why this priority**: The test pyramid is embedded in the Sankey's middle column, making it an integral part of the traceability visualization. Grouping test spec nodes by type gives developers an instant read on test distribution shape without a separate chart.

**Independent Test**: Can be tested by creating test-specs.md with 3 acceptance tests, 5 contract tests, and 8 validation tests. Verify the Sankey middle column groups nodes by type in a pyramidal arrangement with correct counts per group.

**Acceptance Scenarios**:

1. **Given** test-specs.md contains 3 acceptance tests, 5 contract tests, and 8 validation tests, **When** the Sankey diagram renders, **Then** the middle column groups test spec nodes into three clusters labeled "Acceptance: 3" (top, narrow), "Contract: 5" (middle), "Validation: 8" (bottom, wide), forming a pyramidal shape
2. **Given** test-specs.md contains test specs of all three types, **When** the middle column renders, **Then** flow bands from requirements connect to the correct test spec nodes within their type groups, preserving traceability across the pyramid layout
3. **Given** test-specs.md contains 10 validation tests and 2 acceptance tests, **When** the Sankey renders, **Then** the validation cluster at the bottom is visually wider than the acceptance cluster at the top, reflecting the test distribution shape

---

### User Story 4 - Verify Integrity of Test Specifications (Priority: P2)

The developer sees a prominent integrity seal on the Testify view that shows whether the test specifications have been tampered with. The seal reads "Verified" (green) if the current assertion hash matches the stored hash in context.json, "Tampered" (red) if the hashes differ, or "Missing" (grey) if no hash has been recorded. This prevents accidental or intentional weakening of test assertions.

**Why this priority**: Integrity verification is a constitutional principle — tests define the contract and must not be modified to match buggy code. The integrity seal makes tampering immediately visible, but it's a supporting indicator rather than a primary visualization.

**Independent Test**: Can be tested by creating a test-specs.md file and computing its assertion hash, storing it in context.json, then verifying the seal shows "Verified". Then modify test-specs.md without updating the hash and verify the seal shows "Tampered".

**Acceptance Scenarios**:

1. **Given** context.json contains an assertion_hash that matches the current content of test-specs.md, **When** the Testify view loads, **Then** an integrity seal displays "Verified" with a green indicator
2. **Given** test-specs.md has been modified after the hash was recorded (hashes differ), **When** the Testify view loads, **Then** the integrity seal displays "Tampered" with a red indicator
3. **Given** context.json does not contain a testify section or assertion_hash, **When** the Testify view loads, **Then** the integrity seal displays "Missing" with a grey indicator
4. **Given** test-specs.md does not exist for the selected feature, **When** the Testify view loads, **Then** the integrity seal is not displayed (replaced by the empty state)

---

### User Story 5 - Highlight Full Chain on Hover (Priority: P3)

The developer hovers over any node or flow band in the Sankey diagram and the full traceability chain is highlighted. For example, hovering over TS-003 highlights FR-001 (linked requirement), TS-003 itself, and T-007 (linked task), along with all connecting flow bands. All other elements dim, making the selected chain stand out. This interaction helps the developer trace individual requirement flows in a complex diagram.

**Why this priority**: Hover-to-trace is a polish feature that improves usability for larger diagrams (10+ requirements). The diagram is useful without it, but this interaction makes navigating complex traceability chains significantly easier.

**Independent Test**: Can be tested by creating a Sankey diagram with 5+ requirements and hovering over one test spec node. Verify the connected requirement and task nodes plus their flow bands are highlighted while other elements dim.

**Acceptance Scenarios**:

1. **Given** TS-003 traces to FR-001 and FR-002, and task T-007 references TS-003, **When** the developer hovers over TS-003, **Then** FR-001, FR-002, TS-003, T-007, and all connecting flow bands are highlighted while other elements dim
2. **Given** the developer hovers over a requirement node FR-005, **When** the hover activates, **Then** all downstream test specs and tasks connected to FR-005 are highlighted
3. **Given** a highlighted chain is active, **When** the developer moves the cursor away from the diagram, **Then** all elements return to their default appearance

---

### User Story 6 - See Testify View Update in Real Time (Priority: P3)

While the Testify view is open, the developer watches updates happen live. If an agent generates new test specifications, the Sankey diagram adds new nodes and flows. If tasks are checked off, status colors may update. The integrity seal recalculates as context.json or test-specs.md change. The developer sees the traceability picture evolve without refreshing.

**Why this priority**: Real-time updates are a constitutional principle. However, the Testify view changes less frequently than tasks or checklists (test specs are typically generated once per feature), making this lower priority than real-time in other views.

**Independent Test**: Can be tested by opening the Testify view, then externally creating or modifying test-specs.md to add new test specs, and verifying the Sankey and pyramid update within 5 seconds.

**Acceptance Scenarios**:

1. **Given** the Sankey diagram is displayed, **When** test-specs.md is modified to add a new test spec TS-010 with a traceability link to FR-003, **Then** a new node TS-010 and its flow band appear in the diagram within 5 seconds
2. **Given** the Sankey diagram is displayed, **When** test-specs.md is modified to add two new validation tests, **Then** the validation cluster count in the middle column increases and new nodes appear within 5 seconds
3. **Given** the integrity seal shows "Verified", **When** test-specs.md is modified without updating context.json, **Then** the seal transitions to "Tampered" within 5 seconds

---

### Edge Cases

- What happens when a feature has no test-specs.md file? (Show an empty state message indicating no test specifications have been generated, suggest running /iikit-05-testify)
- What happens when test-specs.md exists but contains no parseable test specs (no TS-xxx entries)? (Show the Sankey with empty middle column and a note that no test specs were detected)
- What happens when test specs have no traceability links? (Show test spec nodes in the middle column with no incoming flow bands, highlighted as unlinked)
- What happens when tasks.md references test spec IDs that don't exist in test-specs.md? (Ignore orphaned references — only display connections where both sides exist)
- What happens when the feature has 20 requirements and 50 tasks (upper range)? (Layout adapts with scrolling or zooming to accommodate without visual clutter)
- What happens when a test type has zero test specs (e.g., no contract tests)? (Show the empty cluster with a "Type: 0" label to preserve the pyramid shape and make the missing type obvious)
- What happens when a requirement is referenced by 5+ test specs (fan-out)? (Flow bands remain visually distinguishable; consider bundling or grouping for readability)
- How does the Testify view animate on first load? (Nodes fade in left-to-right by column, then flow bands draw in — consistent with the animated load pattern from checklist progress rings)
- How does the system handle test-specs.md being deleted while the view is open? (Transition to empty state gracefully within 5 seconds)
- What happens when context.json is malformed or has unexpected structure? (Integrity seal shows "Missing" — treat unreadable hash data as absent)
- What happens when a feature has test-specs.md but no tasks.md? (Show empty right column with message "No tasks generated — run /iikit-06-tasks", consistent with FR-014 empty state pattern)
- What happens when spec.md has no FR-xxx identifiers? (Show empty left column in Sankey with a note that no requirements were found)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a traceability Sankey diagram with three columns: requirements (left), test specifications (middle), and implementation tasks (right)
- **FR-002**: System MUST parse functional requirements (FR-xxx) and success criteria (SC-xxx) from spec.md to populate the left column of the Sankey
- **FR-003**: System MUST parse test specifications (TS-xxx) from tests/test-specs.md to populate the middle column of the Sankey, including their type (acceptance, contract, validation) and traceability links
- **FR-004**: System MUST parse tasks (T-xxx) from tasks.md and match them to test specifications via "must pass TS-xxx" references to populate the right column of the Sankey
- **FR-005**: System MUST render flow bands connecting linked requirements to test specs and test specs to tasks, color-coded by test type — acceptance, contract, and validation flows each use a distinct color, reinforcing the pyramid grouping in the middle column
- **FR-006**: System MUST visually highlight gap nodes — requirements with no linked test specs and test specs with no linked tasks — in a distinct alert color (red)
- **FR-007**: System MUST arrange the Sankey middle column (test specifications) as an integrated test pyramid — nodes grouped by type into three clusters: acceptance (top, narrow), contract (middle), validation (bottom, wide), each showing a type label and count
- **FR-008**: System MUST display all pyramid clusters in a uniform "specified" color (blue), since the pyramid visualizes test specification coverage rather than execution results
- **FR-009**: System MUST display an integrity seal showing the verification status of test specifications by comparing the assertion hash in context.json with the current content of test-specs.md
- **FR-010**: Integrity seal MUST show one of three states: "Verified" (green, hashes match), "Tampered" (red, hashes differ), "Missing" (grey, no hash recorded)
- **FR-011**: System MUST highlight the full traceability chain (all connected nodes and flow bands) when the user hovers over any node or flow band in the Sankey, dimming all other elements
- **FR-012**: System MUST update the Sankey diagram, test pyramid, and integrity seal in real time when underlying files change on disk, within 5 seconds
- **FR-013**: System MUST handle the typical data range of 5-20 requirements, 10-30 test specs, and 20-50 tasks with a readable layout
- **FR-014**: System MUST show a meaningful empty state when no test-specs.md exists for the selected feature, suggesting the user run /iikit-05-testify
- **FR-015**: System MUST render as the Phase 5 (Testify) content area within the pipeline tab navigation defined by 002-intent-flow-pipeline
- **FR-016**: System MUST be accessible, with Sankey diagram data readable by screen readers and pyramid tier counts announced to assistive technologies
- **FR-017**: System MUST display each node in the Sankey with its identifier (FR-xxx, TS-xxx, T-xxx) and a short descriptive label
- **FR-018**: Sankey node labels MUST be readable without interaction — identifiers and short labels visible at default zoom level
- **FR-019**: Sankey nodes MUST be keyboard-navigable: focusable via Tab (left-to-right, top-to-bottom order), with Enter or Space triggering the chain highlight (same as hover). Focus order follows columns: requirements, then test specs by pyramid group, then tasks
- **FR-020**: Each Sankey node MUST use `aria-describedby` to announce its traceability connections on focus — e.g., "FR-001, linked to TS-001, TS-002" for requirements, "TS-003, linked from FR-001, FR-002, linked to T-007" for test specs

### Key Entities

- **Requirement Node**: A functional requirement (FR-xxx) or success criterion (SC-xxx) from spec.md. Appears in the left column of the Sankey. May link to zero or more test specs via traceability
- **Test Spec Node**: A test specification (TS-xxx) from tests/test-specs.md. Appears in the middle column of the Sankey. Has a type (acceptance, contract, or validation), priority, and traceability links to requirements. May be referenced by zero or more tasks
- **Task Node**: An implementation task (T-xxx) from tasks.md that references one or more test specs via "must pass TS-xxx". Appears in the right column of the Sankey
- **Flow Band**: A colored connection between linked nodes in the Sankey. Represents a traceability link between a requirement and a test spec, or between a test spec and a task. Color is determined by the test spec's type (acceptance, contract, or validation), creating visual continuity with the pyramid grouping
- **Gap**: A node with incomplete connections — a requirement with no outgoing flows (untested) or a test spec with no outgoing flows to tasks (unimplemented). Highlighted in alert color
- **Test Pyramid**: The pyramidal arrangement of test spec nodes in the Sankey middle column. Test specs are grouped into three clusters by type (acceptance, contract, validation), each with a count label. The triangular shape emerges from cluster width — narrow at the top (acceptance), wide at the bottom (validation)
- **Integrity Seal**: A verification indicator comparing the stored assertion hash (from context.json) with the current test-specs.md content. Has three states: verified, tampered, missing

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Developers can identify untested requirements (coverage gaps) within 5 seconds of viewing the Testify phase
- **SC-002**: All traceability connections between requirements, tests, and tasks match the data in the source files with 100% accuracy
- **SC-003**: The Sankey diagram renders readably for up to 20 requirements, 30 test specs, and 50 tasks without overlapping labels or indistinguishable flow bands
- **SC-004**: Developers can determine test specification integrity status (verified/tampered/missing) within 2 seconds of viewing the Testify phase
- **SC-005**: The test pyramid accurately reflects the count of test specs per type (acceptance, contract, validation) as defined in test-specs.md
- **SC-006**: Changes to test-specs.md, tasks.md, or context.json are reflected in the Testify view within 5 seconds
- **SC-007**: The traceability visualization is visually consistent with the pipeline and kanban board aesthetic — same design language, typography, and quality level
- **SC-008**: Developers can trace a single requirement through its full chain (requirement → tests → tasks) in under 3 seconds using the hover interaction

## Out of Scope

- Editing test specifications or traceability links from the dashboard — the view is strictly read-only
- Running or executing tests — the view only displays test specification metadata, not test execution results
- Displaying code coverage metrics — the pyramid shows specification status, not runtime coverage
- Creating or modifying assertion hashes — the integrity seal only reads and compares existing data

## Dependencies

- **002-intent-flow-pipeline**: This feature renders as the Phase 5 (Testify) tab content within the pipeline navigation defined by feature 002

## Clarifications

### Session 2026-02-17

- Q: Since test execution is out of scope, should the pyramid show multi-status coloring (blue/yellow/green/red) or only specification coverage? -> A: Pyramid shows only "specified" counts — all tiers use uniform blue color. The pyramid visualizes test specification coverage, not execution status. [FR-008, US-3, SC-005]
- Q: Should the test pyramid sit beside/below the Sankey or be integrated into it? -> A: Pyramid integrated into the Sankey — the middle column (test specs) groups nodes by type in a pyramidal layout, combining traceability and distribution into one unified visualization. [FR-001, FR-007, US-1, US-3]
- Q: What should flow band colors represent? -> A: Color by test type — acceptance, contract, and validation flows each get a distinct color, reinforcing the pyramid grouping in the middle column. [FR-005, US-1, US-5]
- Q: Should SC-xxx success criteria appear as nodes in the Sankey left column alongside FR-xxx requirements? -> A: Yes — both FR-xxx and SC-xxx appear in the left column. All are "requirements" that should be traceable through tests to tasks. [FR-002, US-1, US-2]
- Q: What happens when a test type has zero test specs in the pyramid? -> A: Show the empty cluster with a "Type: 0" label to preserve pyramid shape and make missing types obvious. [FR-007, US-3]
- Q: What happens when a feature has test-specs.md but no tasks.md? -> A: Show empty right column with message "No tasks generated — run /iikit-06-tasks". [FR-014]
- Q: Should the Testify view animate on first load? -> A: Yes — nodes fade in left-to-right by column, then flow bands draw in. Consistent with checklist ring animation pattern. [FR-001, US-1, SC-007]
- Q: Should Sankey nodes be keyboard-navigable? -> A: Yes — Tab between nodes (left-to-right, top-to-bottom), Enter/Space triggers chain highlight. [FR-016, FR-019, US-5]
- Q: How should traceability connections be communicated to screen readers? -> A: Use aria-describedby on each node to announce connections on focus. [FR-016, FR-020]
