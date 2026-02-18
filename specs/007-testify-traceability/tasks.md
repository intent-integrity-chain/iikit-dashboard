# Tasks: Testify Traceability — Sankey Diagram + Test Pyramid

**Feature**: 007-testify-traceability | **Branch**: `007-testify-traceability`
**Generated**: 2026-02-17 | **TDD**: mandatory (constitution v1.1.0)

---

## Phase 1: Setup

- [x] T001 Create test fixture files for testify feature — sample spec.md with FR-xxx/SC-xxx identifiers, test-specs.md with TS-xxx entries of all three types (acceptance/contract/validation) including traceability links, tasks.md with "must pass TS-xxx" references, and context.json with matching/mismatching assertion hashes. Place in test/fixtures/testify/

---

## Phase 2: Foundational (Parsers + State Computation)

### Tests First (TDD: red phase)

- [x] T002 [P] Write tests for parseTestSpecs() in test/parser.test.js — verify extraction of id, title from heading pattern, type (acceptance/contract/validation), priority, and traceability links filtered to FR-/SC- only; must pass TS-024, TS-025, TS-026
- [x] T003 [P] Write tests for parseTaskTestRefs() in test/parser.test.js — verify extraction of "must pass TS-xxx" references from task descriptions, empty arrays for tasks without refs; must pass TS-027
- [x] T004 [P] Write tests for buildEdges() in test/testify.test.js — verify requirement-to-test edges from traceability links, test-to-task edges from testSpecRefs, and orphaned references ignored; must pass TS-028
- [x] T005 [P] Write tests for findGaps() in test/testify.test.js — verify untested requirements (no outgoing requirement-to-test edges) and unimplemented tests (no outgoing test-to-task edges); must pass TS-029, TS-030
- [x] T006 [P] Write tests for buildPyramid() in test/testify.test.js — verify grouping by type with correct counts and id arrays; must pass TS-032
- [x] T007 [P] Write tests for integrity state computation in test/testify.test.js — verify valid/tampered/missing status from hash comparison; must pass TS-031
- [x] T008 [P] Write tests for GET /api/testify/:feature in test/server.test.js — verify complete TestifyViewState response shape and empty state when test-specs.md missing; must pass TS-021, TS-022
- [x] T009 [P] Write tests for WebSocket testify_update in test/server.test.js — verify message sent on spec/test-spec/task/context file changes with correct shape; must pass TS-023

### Implementation (TDD: green phase)

- [x] T010 [P] Implement parseTestSpecs(content) in src/parser.js — regex for `### TS-(\d+): (.+)` headings, extract type/priority/traceability fields, filter traceability to FR-/SC- patterns
- [x] T011 [P] Implement parseTaskTestRefs(tasks) in src/parser.js — regex for `must pass ((?:TS-\d+(?:,\s*)?)+)` on each task description, return map of taskId to testSpecIds array
- [x] T012 Create src/testify.js with computeTestifyState(projectPath, featureId) — orchestrates parseTestSpecs, parseTaskTestRefs, buildEdges, findGaps, buildPyramid, and integrity check. Export computeTestifyState and helper functions
- [x] T013 Add GET /api/testify/:feature endpoint in src/server.js — calls computeTestifyState, returns JSON response per API contract
- [x] T014 Add testify_update WebSocket push in src/server.js — include in existing file-change handler alongside board_update, pipeline_update, etc.

---

## Phase 3: User Story 1 — Sankey Diagram Core (P1)

- [x] T015 [US1] Implement renderTestifyContent() in src/public/index.html — SVG Sankey diagram with three columns: requirement nodes (left), test spec nodes (middle), task nodes (right). Render rect nodes with id labels and short descriptions. Render flow bands as SVG path elements with cubic Bezier curves connecting linked nodes, color-coded by test type (acceptance blue, contract green, validation purple); must pass TS-001, TS-002, TS-003
- [x] T016 [US1] Implement empty state rendering in src/public/index.html — when exists is false, show "No test specifications generated" message with suggestion to run /iikit-05-testify; must pass TS-014 (empty state portion)

---

## Phase 4: User Story 2 — Gap Highlighting (P1)

- [x] T017 [US2] Add gap node highlighting in src/public/index.html — apply red border/fill to requirement nodes in gaps.untestedRequirements and red right-edge to test spec nodes in gaps.unimplementedTests. No highlight when gaps are empty; must pass TS-004, TS-005, TS-006, TS-007

---

## Phase 5: User Story 3 — Integrated Test Pyramid (P2)

- [x] T018 [US3] Implement pyramid node grouping in Sankey middle column in src/public/index.html — group test spec nodes by type into three clusters (acceptance top/narrow, contract middle, validation bottom/wide) with type labels and counts. Cluster width proportional to node count. Subtle background rects with rounded corners for group boundaries; must pass TS-008, TS-009, TS-010

---

## Phase 6: User Story 4 — Integrity Seal (P2)

- [x] T019 [US4] Implement integrity seal rendering in src/public/index.html — colored dot + text label above Sankey. "Verified" (green) when integrity.status is "valid", "Tampered" (red) when "tampered", "Missing" (grey) when "missing". Hidden when exists is false. role="status" aria-live="polite"; must pass TS-011, TS-012, TS-013, TS-014

---

## Phase 7: User Story 5 — Hover Chain Highlighting (P3)

- [x] T020 [US5] Implement hover chain highlighting in src/public/index.html — compute full chain via bidirectional edge traversal. On mouseenter, add .highlighted to chain elements and .dimmed to others. On mouseleave, remove classes. CSS transition: opacity 0.2s. data-chain-id attributes on SVG elements; must pass TS-015, TS-016, TS-017

---

## Phase 8: User Story 6 — Real-Time Updates (P3)

- [x] T021 [US6] Wire testify_update WebSocket handler in src/public/index.html client — on receiving testify_update message, re-render Sankey diagram, pyramid grouping, gap highlights, and integrity seal with new data; must pass TS-018, TS-019, TS-020

---

## Phase 9: Polish & Accessibility

- [x] T022 [P] Add keyboard navigation to Sankey nodes in src/public/index.html — Tab through nodes (left-to-right, top-to-bottom by column: requirements, then test specs by pyramid group, then tasks). Enter/Space triggers chain highlight (same as hover); per FR-019
- [x] T023 [P] Add aria-describedby to all Sankey nodes in src/public/index.html — announce traceability connections on focus (e.g., "FR-001, linked to TS-001, TS-002"); per FR-020
- [x] T024 Add load animation in src/public/index.html — nodes fade in left-to-right by column, then flow bands draw in. Consistent with checklist ring animation pattern; per spec clarification
- [x] T025 Handle edge cases in src/public/index.html — empty pyramid clusters show "Type: 0" label, missing tasks.md shows empty right column with message, malformed context.json shows "Missing" seal, fan-out readability for 5+ connections, scrollable layout for 20+ requirements / 50+ tasks; per FR-007, FR-013, FR-014

---

## Dependencies

```
T001 ──┬── T002 ── T010 ──┐
       ├── T003 ── T011 ──┤
       ├── T004 ──────────┤
       ├── T005 ──────────┤
       ├── T006 ──────────┼── T012 ──┬── T013 ── T015 ──┬── T016
       ├── T007 ──────────┘         │                   ├── T017
       ├── T008 ────────────────────┤                   ├── T018 ── (needs T012 for pyramid data)
       └── T009 ────────────────────┴── T014 ──┐        ├── T019
                                               │        ├── T020 ── (needs T014 + T015)
                                               │        ├── T021 ── (needs T014 + T015)
                                               └────────┤
                                                        ├── T022
                                                        ├── T023
                                                        ├── T024
                                                        └── T025
```

### Key Dependencies

| Task | Blocked By | Reason |
|------|-----------|--------|
| T010 | T002 | TDD: tests before implementation |
| T011 | T003 | TDD: tests before implementation |
| T012 | T004, T005, T006, T007, T010, T011 | TDD: tests first; needs parser functions |
| T013 | T008, T012 | TDD: tests first; needs computeTestifyState |
| T014 | T009, T012 | TDD: tests first; needs computeTestifyState |
| T015 | T013 | Needs API endpoint to fetch data |
| T016 | T015 | Extends Sankey rendering |
| T017 | T015 | Adds gap highlighting to existing Sankey |
| T018 | T015 | Modifies Sankey middle column layout |
| T019 | T013 | Needs integrity data from API |
| T020 | T015 | Needs Sankey elements for hover targets |
| T021 | T014, T015 | Needs WebSocket handler + Sankey to re-render |
| T022-T025 | T015 | Polish tasks require core Sankey to exist |

### Parallel Batches

```
Phase 2 (tests):  [T002, T003, T004, T005, T006, T007, T008, T009] (all independent)
Phase 2 (impl):   [T010, T011] (independent) | T012 (depends on T010, T011) | [T013, T014] (depend on T012)
Phase 3-4:        T015 → T016 | T017 (T016 and T017 independent of each other)
Phase 5-6:        [T018, T019] (independent — different UI sections)
Phase 7-8:        T020 → T021 (T021 needs WebSocket wiring from T020's pattern)
Phase 9:          [T022, T023] (independent) | T024 | T025
```

---

## Implementation Strategy

**MVP (Phase 1-4)**: Setup + Foundational + US1 + US2 = Sankey diagram with three columns, flow bands, and gap highlighting. This delivers the core traceability visualization (P1 stories) and is independently useful.

**Increment 1 (Phase 5-6)**: US3 + US4 = Pyramid grouping and integrity seal. Adds test distribution insight and tamper detection.

**Increment 2 (Phase 7-8)**: US5 + US6 = Hover interaction and real-time updates. Polish interactions for complex diagrams.

**Final (Phase 9)**: Accessibility, animation, edge cases. Production-grade polish.
