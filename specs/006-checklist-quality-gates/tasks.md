# Tasks: Checklist Quality Gates

## Phase 1: Setup

- [x] T001 Create `src/checklist.js` module scaffold with `computeChecklistViewState` function signature and module.exports
- [x] T002 Create `test/checklist.test.js` test scaffold with Jest describe blocks for checklist view state computation

## Phase 2: Foundational — Detailed Checklist Parsing

- [x] T003 [P] Write tests for `parseChecklistsDetailed` in `test/parser.test.js` — per-file item arrays, CHK ID extraction, tag parsing, category assignment from headings, name derivation from filename, empty/malformed files (to pass TS-020, TS-021, TS-029, TS-030, TS-031, TS-032, TS-033)
- [x] T004 [P] Implement `parseChecklistsDetailed(checklistDir)` in `src/parser.js` — reads all .md files in checklists/, applies same `requirements.md`-only filter as existing `parseChecklists` (skip if requirements.md is the only file — the /iikit-04-checklist phase hasn't run yet), returns array of {name, filename, total, checked, items[{text, checked, chkId, category, tags}]} per file, exports alongside existing `parseChecklists`
- [x] T005 Write tests for `computeChecklistViewState` in `test/checklist.test.js` — per-file percentage calculation, color mapping (red 0-33%, yellow 34-66%, green 67-100%), gate status derivation with worst-case precedence (to pass TS-022, TS-023, TS-024, TS-025, TS-026, TS-027, TS-028)
- [x] T006 Implement `computeChecklistViewState(projectPath, featureId)` in `src/checklist.js` — calls `parseChecklistsDetailed`, computes percentage/color per file, derives gate status {status, level, label}, returns {files, gate}

## Phase 3: User Story 1 — See Checklist Completion at a Glance (P1)

- [x] T007 [US1] Write tests for GET `/api/checklist/:feature` in `test/server.test.js` — valid feature returns 200 with files array and gate object, unknown feature returns 404, feature without checklists returns empty files with red gate (to pass TS-016, TS-017, TS-018)
- [x] T008 [US1] Add GET `/api/checklist/:feature` endpoint to `src/server.js` — calls `computeChecklistViewState`, returns JSON response
- [x] T009 [US1] Add `renderChecklistContent(checklist)` function to `src/public/index.html` — renders SVG progress rings with `<circle>` elements using stroke-dasharray/stroke-dashoffset for arc fill, percentage label centered in ring, checklist name + fraction below ring (e.g., "Requirements 8/12"), color coding via CSS custom properties (--ring-red, --ring-yellow, --ring-green), adaptive flexbox layout for 1-6 rings with wrapping, wire to "checklist" tab in `switchTab()`
- [x] T010 [US1] Add ring animation CSS to `src/public/index.html` — CSS transition on stroke-dashoffset for smooth fill animation from 0% to target on load, transition on stroke color for color changes

## Phase 4: User Story 2 — Understand Gate Status Instantly (P1)

- [x] T011 [US2] Add `renderGateIndicator(gate)` to `src/public/index.html` — colored circle dot (green/yellow/red) + "GATE: OPEN" or "GATE: BLOCKED" text label, positioned above the progress rings row, `role="status"` with `aria-live="polite"` for screen reader announcements
- [x] T012 [US2] Add empty state view to `src/public/index.html` — "No checklists generated for this feature" message with suggestion to run /iikit-04-checklist, displayed when checklist.files is empty array

## Phase 5: User Story 3 — Drill Into Individual Checklist Items (P2)

- [x] T013 [US3] Add `renderChecklistDetail(file)` to `src/public/index.html` — accordion panel below each ring, items grouped under `<h4>` category headings, each item shows check status icon (✓/☐), CHK-xxx ID when present, description text, dimension/reference tags as small badge `<span>` elements, `expandedChecklist` state variable (filename or null), click handler on ring toggles expand/collapse, accordion behavior (expanding one collapses previous), `max-height` CSS transition for smooth expand/collapse
- [x] T014 [US3] Add keyboard navigation to progress rings in `src/public/index.html` — `tabindex="0"` on ring containers, Enter/Space key handler to expand/collapse, `aria-expanded` and `aria-controls` attributes, focus order: gate indicator → rings left-to-right → expanded detail items

## Phase 6: User Story 4 — See Checklists Update in Real Time (P2)

- [x] T015 [US4] Write test for `checklist_update` WebSocket message in `test/server.test.js` — verify message sent with correct shape on file change (to pass TS-019)
- [x] T016 [US4] Add `checklist_update` push to file change handler in `src/server.js` — import `computeChecklistViewState` from checklist.js, compute and send alongside existing `pipeline_update` in the debounced watcher callback
- [x] T017 [US4] Add WebSocket message handler for `checklist_update` in `src/public/index.html` — store `currentChecklist` state, re-render rings with animation (update stroke-dashoffset + color), re-render gate indicator, update expanded detail view if open

## Phase 7: Polish & Cross-Cutting

- [x] T018 Add screen reader accessibility polish to `src/public/index.html` — `role="img"` with `aria-label` on each SVG ring (e.g., "Requirements: 8 of 12 items complete, 67%"), verify focus order per FR-019, ensure gate text + ring percentage provide non-color status indicators for color-blind users
- [x] T019 Verify all 33 test specifications pass — run full Jest suite, confirm TS-001 through TS-033, fix any regressions

## Dependencies & Execution Order

- **Phase 1** (T001-T002): No dependencies, setup scaffolds
- **Phase 2** (T003-T006): T003 and T004 are [P] parallelizable with T005-T006. T004 depends on T003 (TDD). T006 depends on T005 (TDD). T006 also depends on T004 (uses parseChecklistsDetailed).
- **Phase 3** (T007-T010): Depends on Phase 2. T008 depends on T007 (TDD). T009-T010 depend on T008 (need API data).
- **Phase 4** (T011-T012): Depends on T009 (rings must exist for gate to sit above). T011 and T012 are [P] parallelizable.
- **Phase 5** (T013-T014): Depends on T009 (rings must be clickable). T013 before T014.
- **Phase 6** (T015-T017): Depends on T008 (API endpoint) and T009 (rings rendered). T016 depends on T015 (TDD). T017 depends on T016.
- **Phase 7** (T018-T019): Depends on all prior phases. T018 before T019.

## Parallel Execution Batches

```
Phase 2: [T003, T005] (tests first) → [T004, T006] (implementations)
Phase 3: [T007] (test) → [T008] (implementation) → [T009, T010] (frontend, parallel)
Phase 4: [T011, T012] (independent frontend components)
Phase 5: [T013] → [T014]
Phase 6: [T015] (test) → [T016] (server) → [T017] (client)
Phase 7: [T018] → [T019]
```

## Implementation Strategy

**MVP**: Phase 1-4 (progress rings + gate indicator render with correct data — the core "can I implement?" view)
**Complete**: Phase 5-6 (accordion detail + live updates — full interactivity)
**Polish**: Phase 7 (accessibility, final test verification)
