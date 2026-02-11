# Tasks: Spec Story Map

**Feature**: 004-spec-story-map | **Branch**: `004-spec-story-map`
**Generated from**: spec.md, plan.md, data-model.md, test-specs.md

## Phase 1: Setup

- [x] T001 Create `src/storymap.js` module with `computeStoryMapState()` stub returning empty state

## Phase 2: Foundational — Parser Functions (Tests First)

- [x] T002 [P] Write tests for `parseRequirements(content)` in `test/parser.test.js` per TS-019, TS-024
- [x] T003 [P] Write tests for `parseSuccessCriteria(content)` in `test/parser.test.js` per TS-020
- [x] T004 [P] Write tests for `parseClarifications(content)` in `test/parser.test.js` per TS-021, TS-025
- [x] T005 [P] Write tests for `parseStoryRequirementRefs(content)` in `test/parser.test.js` per TS-022, TS-026
- [x] T006 [P] Write tests for extended `parseSpecStories` with `scenarioCount` in `test/parser.test.js` per TS-023
- [x] T007 Implement `parseRequirements(content)` in `src/parser.js` — pass TS-019, TS-024
- [x] T008 Implement `parseSuccessCriteria(content)` in `src/parser.js` — pass TS-020
- [x] T009 Implement `parseClarifications(content)` in `src/parser.js` — pass TS-021, TS-025
- [x] T010 Implement `parseStoryRequirementRefs(content)` in `src/parser.js` — pass TS-022, TS-026
- [x] T011 Extend `parseSpecStories` to return `scenarioCount` per story in `src/parser.js` — pass TS-023
- [x] T012 Export new functions from `src/parser.js`

## Phase 3: Foundational — Story Map State & API (Tests First)

- [x] T013 Write tests for `computeStoryMapState()` in `test/storymap.test.js` per TS-027
- [x] T014 Write tests for `GET /api/storymap/:feature` in `test/server.test.js` per TS-015, TS-016, TS-017
- [x] T015 Implement `computeStoryMapState(projectPath, featureId)` in `src/storymap.js` — pass TS-027
- [x] T016 Add `GET /api/storymap/:feature` endpoint in `src/server.js` — pass TS-015, TS-016, TS-017
- [x] T017 Add `storymap_update` WebSocket push in `src/server.js` file watcher handler per TS-018

## Phase 4: User Story 1 — View User Story Map (P1)

- [x] T018 [US1] Add story map CSS styles to `src/public/index.html` — swim lane grid layout (P1/P2/P3 rows), story card styles, priority badge colors using existing CSS vars
- [x] T019 [US1] Add `renderStoryMapView()` function in `src/public/index.html` — fetches `/api/storymap/:feature`, renders swim lanes and story cards per TS-001, TS-002, TS-003
- [x] T020 [US1] Wire `switchTab('spec')` to call `renderStoryMapView()` in `src/public/index.html` — replace placeholder view

## Phase 5: User Story 2 — Explore Requirements Graph (P1)

- [x] T021 [US2] Add requirements graph CSS styles to `src/public/index.html` — SVG container, node styles per type (US/FR/SC), edge styles, highlight/dim states
- [x] T022 [US2] Add `renderRequirementsGraph(data)` function in `src/public/index.html` — SVG force-directed layout, render US/FR/SC nodes with edges per TS-004, TS-006
- [x] T023 [US2] Add click-to-highlight interaction in `src/public/index.html` — click node highlights connections, dims others per TS-005

## Phase 6: User Story 3 — Review Clarification Trail (P2)

- [x] T024 [US3] Add clarification sidebar CSS styles to `src/public/index.html` — right sidebar, slide-in transition, Q&A entry layout
- [x] T025 [US3] Add `renderClarificationSidebar(clarifications)` function in `src/public/index.html` — render Q&A entries with session dates per TS-007, TS-008
- [x] T026 [US3] Add clarification indicator click handler on story cards in `src/public/index.html` — opens sidebar per TS-009
- [x] T027 [US3] Add sidebar toggle button and content area resize transition in `src/public/index.html`

## Phase 7: User Story 4 — Interact with Graph Nodes (P2)

- [x] T028 [US4] Add node drag interaction in `src/public/index.html` — mousedown/mousemove/mouseup on SVG nodes per TS-010
- [x] T029 [US4] Add zoom/pan interaction in `src/public/index.html` — wheel event on SVG viewBox per TS-011
- [x] T030 [US4] Add tooltip on hover for graph nodes in `src/public/index.html` — shows full requirement/story text per TS-012

## Phase 8: User Story 5 — Live Updates (P2)

- [x] T031 [US5] Handle `storymap_update` WebSocket messages in `src/public/index.html` — re-render story map and graph when active tab is spec per TS-013, TS-014

## Phase 9: User Story 1 — Story Card → Graph Link (P1, from FR-016)

- [x] T032 [US1] Add click handler on story cards to scroll to and highlight corresponding US node in requirements graph per FR-016

## Phase 10: Polish & Cross-Cutting

- [x] T033 Add `aria-label` attributes to story map, graph, and sidebar interactive elements in `src/public/index.html` per FR-017
- [x] T034 Add empty state rendering for story map (no stories), graph (no requirements), and sidebar (no clarifications) per FR-012
- [x] T035 Verify all views render correctly in both light and dark themes

## Dependencies

- T002-T006 are parallel (no mutual dependencies, all write separate test blocks)
- T007-T012 depend on T002-T006 (TDD: tests first)
- T013-T014 depend on T012 (need parser functions exported)
- T015-T017 depend on T013-T014 (TDD: tests first)
- T018-T020 depend on T016 (need API endpoint)
- T021-T023 depend on T019 (graph renders below story map)
- T024-T027 depend on T019 (sidebar alongside story map)
- T028-T030 depend on T022 (need graph nodes to interact with)
- T031 depends on T017, T019, T022 (need WebSocket handler and renderers)
- T032 depends on T019, T022 (need both story map and graph rendered)
- T033-T035 depend on all previous phases

## Parallel Execution Opportunities

```
Phase 2:  [T002, T003, T004, T005, T006] (all parallel — separate test blocks)
          then [T007, T008, T009, T010, T011] (parallel — separate functions)
Phase 3:  [T013, T014] (parallel — different test files)
          then [T015, T016] (parallel — different source files) then T017
Phase 4:  T018 then T019 then T020 (sequential — CSS then render then wire)
Phase 5:  T021 then T022 then T023 (sequential — CSS then render then interaction)
Phase 6:  [T024, T025] (parallel — CSS and render) then T026 then T027
Phase 7:  [T028, T029] (parallel — drag and zoom are independent) then T030
Phase 10: [T033, T034, T035] (parallel — independent polish tasks)
```

## Implementation Strategy

**MVP (minimum viable)**: Phases 1-5 (setup + parsers + API + story map + graph) = 23 tasks
**Full feature**: All phases = 35 tasks

Each user story phase is independently testable:
- After Phase 4: Story map with swim lanes is visible and functional
- After Phase 5: Requirements graph with click highlighting works
- After Phase 6: Clarification sidebar is accessible
- After Phase 7: Graph is interactive (drag, zoom, tooltips)
- After Phase 8: Live updates flow through
