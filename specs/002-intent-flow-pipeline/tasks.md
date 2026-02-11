# Tasks: Intent Flow Pipeline

## Phase 1: Setup

- [x] T001 Create `src/pipeline.js` module scaffold with `computePipelineState` function signature and module.exports
- [x] T002 Create `test/pipeline.test.js` test scaffold with Jest describe blocks for pipeline state computation

## Phase 2: Foundational — Pipeline Detection Logic

- [x] T003 [P] Add `parseChecklists(checklistDir)` to `src/parser.js` — reads all .md files in checklists/, counts `- [x]` vs `- [ ]`, returns {total, checked, percentage}
- [x] T004 [P] Add `parseConstitutionTDD(constitutionPath)` to `src/parser.js` — reads CONSTITUTION.md, returns boolean for whether TDD is required (searches for TDD/test-first + MUST/NON-NEGOTIABLE)
- [x] T005 [P] Add `hasClarifications(specContent)` to `src/parser.js` — returns boolean for whether spec.md contains `## Clarifications` section
- [x] T006 [P] Add tests for `parseChecklists` in `test/parser.test.js` — test empty dir, partial completion, full completion, missing dir
- [x] T007 [P] Add tests for `parseConstitutionTDD` in `test/parser.test.js` — test with TDD keywords, without, missing file
- [x] T008 [P] Add tests for `hasClarifications` in `test/parser.test.js` — test with and without clarifications section

## Phase 3: User Story 1 — See the Full Pipeline at a Glance (P1)

- [x] T009 [US1] Write tests for `computePipelineState` in `test/pipeline.test.js` — test all 9 phase detection rules per data-model.md Artifact Detection Map, to pass TS-001, TS-002, TS-003, TS-016 through TS-025
- [x] T010 [US1] Implement `computePipelineState(projectPath, featureId)` in `src/pipeline.js` — returns array of 9 phase objects {id, name, status, progress, optional} using parser helpers and fs checks
- [x] T011 [US1] Write tests for GET `/api/pipeline/:feature` in `test/server.test.js` — to pass TS-012, TS-013, TS-014
- [x] T012 [US1] Add GET `/api/pipeline/:feature` endpoint to `src/server.js` — calls `computePipelineState`, returns JSON
- [x] T013 [US1] Add pipeline bar HTML/CSS to `src/public/index.html` — 9 phase nodes in a horizontal row with connecting lines/arrows between nodes (FR-010), color-coded by 5 statuses including distinct style for optional/skipped phases (FR-012), `overflow-x: auto` for narrow widths, `role="navigation"` with `aria-label`

## Phase 4: User Story 2 — Navigate to Phase Details (P1)

- [x] T014 [US2] Add tab shell to `src/public/index.html` — content area div below pipeline bar, click handler on phase nodes to switch active view, `aria-current` on active node
- [x] T015 [US2] Refactor existing board rendering in `src/public/index.html` into `renderBoardView()` function — called when Implement tab is active
- [x] T016 [US2] Add placeholder rendering for unbuilt phase views — "Coming soon" message in content area for phases without detail views
- [x] T017 [US2] Implement default tab selection logic — Implement if any tasks checked, otherwise last completed phase walking backward

## Phase 5: User Story 3 — Watch Pipeline Progress Update Live (P1)

- [x] T018 [US3] Write test for WebSocket `pipeline_update` message in `test/server.test.js` — to pass TS-015
- [x] T019 [US3] Add CONSTITUTION.md to chokidar watch paths in `src/server.js`
- [x] T020 [US3] Modify file change handler in `src/server.js` to compute and push `pipeline_update` alongside `board_update`
- [x] T021 [US3] Add WebSocket message handler in `src/public/index.html` for `pipeline_update` — re-render pipeline bar nodes on update

## Phase 6: User Story 4 — Switch Features from the Pipeline (P2)

- [x] T022 [US4] Write test for pipeline state changing on feature switch in `test/server.test.js` — to pass TS-010
- [x] T023 [US4] Wire feature selector change event to re-fetch pipeline state and re-render pipeline bar in `src/public/index.html`

## Phase 7: Polish & Cross-Cutting

- [x] T024 Update dashboard title from "IIKit Kanban" to "IIKit Dashboard" in `src/public/index.html` header
- [x] T025 Update logo icon text from "K" to "D" (or appropriate) in `src/public/index.html`
- [x] T026 Verify all 27 test specifications pass — run full Jest suite, confirm TS-001 through TS-027

## Dependencies & Execution Order

- **Phase 1** (T001-T002): No dependencies, setup scaffolds
- **Phase 2** (T003-T008): No dependencies between tasks — all [P] parallelizable
- **Phase 3** (T009-T013): Depends on Phase 2. T010 depends on T009 (TDD). T012 depends on T011 (TDD). T013 no code deps but logically follows T012.
- **Phase 4** (T014-T017): Depends on T013 (pipeline bar must exist). T015 can run in parallel with T014. T016-T017 depend on T014.
- **Phase 5** (T018-T021): Depends on T012 (API endpoint) and T013 (pipeline bar). T019-T020 are parallel. T021 depends on T020.
- **Phase 6** (T022-T023): Depends on T021 (live updates working). Lightweight — extends existing feature selector.
- **Phase 7** (T024-T026): Depends on all prior phases. T024-T025 are parallel. T026 is final.

## Parallel Execution Batches

```
Phase 2: [T003, T004, T005, T006, T007, T008] (all independent)
Phase 3: [T009, T011] (tests first) → [T010, T012] (implementations) → [T013]
Phase 4: [T014, T015] → [T016, T017]
Phase 5: [T018, T019] → [T020] → [T021]
Phase 7: [T024, T025] → [T026]
```

## Implementation Strategy

**MVP**: Phase 1-3 (pipeline bar renders with correct status — the core "wow" moment)
**Complete**: Phase 4-6 (tab navigation, live updates, feature switching)
**Polish**: Phase 7 (branding, final verification)
