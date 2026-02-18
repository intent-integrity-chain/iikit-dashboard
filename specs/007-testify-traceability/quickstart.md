# Quickstart: Testify Traceability

## Test Scenarios

### 1. Sankey Renders on Tab Click
**Setup**: Project with a feature that has spec.md (5 FR-xxx, 3 SC-xxx), tests/test-specs.md (8 TS-xxx with traceability links), and tasks.md (12 tasks with "must pass TS-xxx" references)
**Action**: `node bin/iikit-dashboard.js /path/to/project` → open in browser → click "Testify" pipeline node
**Expected**: Sankey diagram appears with three columns: 8 requirement nodes on the left, 8 test spec nodes grouped by type in the middle, and 12 task nodes on the right. Colored flow bands connect linked items.

### 2. Flow Bands Colored by Test Type
**Setup**: test-specs.md with acceptance tests (TS-001, TS-002), contract tests (TS-003, TS-004), and validation tests (TS-005, TS-006), all with traceability links to requirements and referenced by tasks
**Action**: Click "Testify" tab
**Expected**: Bands connecting to acceptance tests use one color (blue-ish), contract tests another (green-ish), validation tests a third (purple-ish). Colors are consistent from requirement → test and test → task for the same test spec.

### 3. Gap Detection — Untested Requirement
**Setup**: spec.md has FR-001 through FR-005. test-specs.md has traceability links to FR-001, FR-002, FR-003 only. FR-004 and FR-005 are not referenced.
**Action**: Click "Testify" tab
**Expected**: FR-004 and FR-005 nodes appear with red highlight. All other requirement nodes appear normal with outgoing flow bands.

### 4. Gap Detection — Unimplemented Test
**Setup**: test-specs.md has TS-001 through TS-005. tasks.md references TS-001, TS-002, TS-003 in "must pass" descriptions. TS-004 and TS-005 are not referenced.
**Action**: Click "Testify" tab
**Expected**: TS-004 and TS-005 nodes have red highlighting on their right edge, indicating unimplemented tests with no outgoing flow bands to tasks.

### 5. Integrated Pyramid Grouping
**Setup**: test-specs.md with 2 acceptance tests, 4 contract tests, 6 validation tests
**Action**: Click "Testify" tab
**Expected**: Middle column groups nodes into three labeled clusters: "Acceptance: 2" (top, narrow), "Contract: 4" (middle), "Validation: 6" (bottom, wide). The pyramid shape is visible — bottom wider than top.

### 6. Integrity Seal — Verified
**Setup**: Feature with tests/test-specs.md and `.specify/context.json` containing matching `testify.assertion_hash`
**Action**: Click "Testify" tab
**Expected**: Green "Verified" seal displayed above the Sankey diagram.

### 7. Integrity Seal — Tampered
**Setup**: Modify test-specs.md after hash was recorded (change a **Then** assertion without running `/iikit-05-testify`)
**Action**: Click "Testify" tab
**Expected**: Red "Tampered" seal displayed. Warns that test assertions may have been weakened.

### 8. Integrity Seal — Missing
**Setup**: Feature with tests/test-specs.md but no assertion_hash in context.json
**Action**: Click "Testify" tab
**Expected**: Grey "Missing" seal displayed. Indicates hash has not been recorded yet.

### 9. Hover Chain Highlighting
**Setup**: Feature with complete traceability. TS-003 traces to FR-001 and FR-002, and task T-007 references TS-003.
**Action**: Hover cursor over TS-003 node in the Sankey
**Expected**: FR-001, FR-002, TS-003, T-007, and all connecting flow bands are highlighted. All other elements dim. Moving cursor away restores all elements to normal.

### 10. Empty State — No Test Specs
**Setup**: Feature with spec.md and tasks.md but no tests/test-specs.md file
**Action**: Click "Testify" tab
**Expected**: Empty state message: "No test specifications generated for this feature" with suggestion to run /iikit-05-testify.

### 11. Live Update — New Test Spec Added
**Setup**: Dashboard open with Testify tab active, showing existing Sankey
**Action**: In terminal, add a new TS-xxx entry to test-specs.md with traceability link to FR-003
**Expected**: Within 5 seconds, new TS-xxx node appears in the middle column, flow band connects it to FR-003, and any task referencing it gets connected. Integrity seal transitions to "Tampered" (content changed, hash outdated).

### 12. Node Labels Readable
**Setup**: Feature with 10 requirements, 15 test specs, 25 tasks
**Action**: Click "Testify" tab and view diagram at default zoom
**Expected**: Each node shows its ID (e.g., "FR-001", "TS-003", "T-012") and a truncated description. No overlapping text. Labels readable without hover.

### 13. Many-to-Many Connections
**Setup**: TS-003 traces to both FR-001 and FR-002 (many-to-one). FR-001 is traced by TS-001, TS-002, and TS-003 (one-to-many).
**Action**: Click "Testify" tab
**Expected**: All connections render as separate flow bands without visual overlap making them indistinguishable. Hovering FR-001 highlights all three connected test spec chains.
