# Tasks: Plan Architecture Viewer

**Feature**: 005-plan-architecture-viewer | **Date**: 2026-02-11
**Plan**: [plan.md](plan.md) | **Spec**: [spec.md](spec.md) | **Tests**: [test-specs.md](tests/test-specs.md)

---

## Phase 1: Setup

- [x] T001 Install @anthropic-ai/sdk dependency via `npm install @anthropic-ai/sdk`
- [x] T002 Create src/planview.js module with empty computePlanViewState export
- [x] T003 Create test/planview.test.js with initial describe block

---

## Phase 2: Foundational — Parsers (TDD: write tests first)

- [x] T004 [P] Write tests for parseTechContext in test/parser.test.js (TS-027)
- [x] T005 [P] Write tests for parseFileStructure in test/parser.test.js (TS-028, TS-029, TS-030, TS-031)
- [x] T006 [P] Write tests for parseAsciiDiagram in test/parser.test.js (TS-032, TS-033, TS-034, TS-035, TS-036)
- [x] T007 [P] Write tests for parseTesslJson in test/parser.test.js (TS-037, TS-038)
- [x] T008 [P] Write tests for parseResearchDecisions in test/parser.test.js (TS-041)
- [x] T009 Implement parseTechContext in src/parser.js — parse `**Label**: Value` lines from Technical Context section
- [x] T010 Implement parseFileStructure in src/parser.js — parse tree characters, extract name/type/comment/depth, strip root directory
- [x] T011 Implement parseAsciiDiagram in src/parser.js — box detection (scan `┌` corners, trace boundaries, extract content), connection detection (scan connector chars between boxes, extract labels)
- [x] T012 Implement parseTesslJson in src/parser.js — read tessl.json, iterate dependencies, return [{name, version, eval: null}]
- [x] T013 Implement parseResearchDecisions in src/parser.js — extract decision title, decision text, and rationale from research.md

---

## Phase 3: User Story 1 — Tech Stack Badge Wall (P1)

- [x] T014 [US1] Write tests for computePlanViewState techContext output in test/planview.test.js (TS-001, TS-002, TS-023)
- [x] T015 [US1] Implement computePlanViewState in src/planview.js — call parseTechContext, parseResearchDecisions, return techContext and researchDecisions arrays
- [x] T016 [US1] Add GET /api/planview/:feature endpoint in src/server.js (TS-020, TS-021)
- [x] T017 [US1] Write integration test for GET /api/planview/:feature in test/server.test.js
- [x] T018 [US1] Add renderPlanView() function in src/public/index.html — renders badge wall section with grouped badges
- [x] T019 [US1] Add switchTab('plan') handler in src/public/index.html — calls renderPlanView when Plan phase clicked
- [x] T020 [US1] Add badge wall CSS styles in src/public/index.html — badge grid, category groups, hover tooltip
- [x] T021 [US1] Implement badge tooltip with research.md rationale on hover (TS-003)

---

## Phase 4: User Story 2 — Project Structure Tree (P1)

- [x] T022 [US2] Write tests for computePlanViewState fileStructure output in test/planview.test.js (TS-004, TS-024)
- [x] T023 [US2] Extend computePlanViewState in src/planview.js — call parseFileStructure, check file existence with fs.existsSync, return fileStructure object
- [x] T024 [US2] Add renderStructureTree() in src/public/index.html — renders interactive tree with expand/collapse, file icons, exist/planned indicators (TS-005, TS-006, TS-007)
- [x] T025 [US2] Add structure tree CSS styles in src/public/index.html — tree lines, file icons, expand/collapse animation, existing vs planned visual distinction
- [x] T026 [US2] Implement depth-based default expand state — expand first 2 levels, collapse deeper nesting

---

## Phase 5: User Story 3 — Architecture Diagram (P1)

- [x] T027 [US3] Write tests for computePlanViewState diagram output in test/planview.test.js (TS-008, TS-025)
- [x] T028 [US3] Extend computePlanViewState in src/planview.js — call parseAsciiDiagram, classify nodes via LLM, return diagram object (or null if no diagram)
- [x] T029 [US3] Implement LLM node type classification in src/planview.js — single Anthropic API call, 5s timeout, cache in memory, fall back to "default" (TS-039, TS-040)
- [x] T030 [US3] Add renderArchitectureDiagram() in src/public/index.html — renders SVG with colored nodes, labeled edges (TS-009, TS-011)
- [x] T031 [US3] Add diagram node click handler — shows detail panel with node content text (TS-010)
- [x] T032 [US3] Add architecture diagram CSS styles in src/public/index.html — node colors by type, edge styling, detail panel
- [x] T033 [US3] Implement diagram fallback — show raw ASCII in code block when parsing fails, hide section when no diagram exists

---

## Phase 6: User Story 4 — Tessl Tiles Panel (P2)

- [x] T034 [US4] Write tests for computePlanViewState tesslTiles output in test/planview.test.js (TS-026)
- [x] T035 [US4] Extend computePlanViewState in src/planview.js — call parseTesslJson, return tesslTiles array
- [x] T036 [US4] Add renderTesslPanel() in src/public/index.html — renders tile cards with name and version (TS-012, TS-013)
- [x] T037 [US4] Add Tessl panel CSS styles in src/public/index.html — tile card layout, eval score placeholder structure
- [x] T038 [US4] Implement conditional panel display — hide when no tessl.json (FR-016); show message when dependencies empty (edge case 9) (TS-014, TS-016)

---

## Phase 7: User Story 5 — Live Updates (P2)

- [x] T039 [US5] Write integration test for planview_update WebSocket message in test/server.test.js (TS-022)
- [x] T040 [US5] Add planview_update WebSocket message type in src/server.js — send on plan.md or tessl.json change
- [x] T041 [US5] Add WebSocket handler for planview_update in src/public/index.html — update cached planview data and re-render if on Plan tab (TS-017, TS-018, TS-019)
- [x] T042 [US5] Add plan.md and tessl.json to chokidar watch patterns in src/server.js (if not already watched)

---

## Phase 8: Polish & Cross-Cutting

- [x] T043 Implement empty states for all sections — no plan.md, no tech context, no file structure, no tessl.json (FR-019)
- [x] T044 Add dark/light theme support for all new CSS using existing custom properties
- [x] T045 Add ARIA labels and keyboard navigation for tree and diagram nodes (FR-021)
- [x] T046 End-to-end verification — run all quickstart test scenarios from quickstart.md
- [x] T047 Update pipeline.js if needed — ensure Plan phase shows correct status

---

## Dependencies

```
T001 ─→ T002 ─→ T003
                  │
T004,T005,T006,T007,T008 (parallel, after T003)
  │     │     │     │    │
  T009  T010  T011  T012 T013 (each test→impl pair)
        │     │     │
        ├─────┼─────┤
        ▼     ▼     ▼
      T014─→T015─→T016─→T017─→T018─→T019─→T020─→T021 (US1)
                    │
      T022─→T023─→T024─→T025─→T026 (US2, after T016)
                    │
      T027─→T028─→T029─→T030─→T031─→T032─→T033 (US3, after T016)
                    │
      T034─→T035─→T036─→T037─→T038 (US4, after T016)
                    │
      T039─→T040─→T041─→T042 (US5, after US1-US4 complete)
                    │
      T043─→T044─→T045─→T046─→T047 (Polish, after US5)
```

### Phase-Level Parallelism

- **Phase 2**: T004, T005, T006, T007, T008 can run in parallel (different test files)
- **Phases 3-6**: US1 must complete first (provides API endpoint + base render). Then US2, US3, US4 can run in parallel (different render functions, different sections)
- **Phase 7**: Requires all sub-views working (US1-US4)
- **Phase 8**: Requires everything working

### Critical Path

T001 → T002 → T003 → T006 → T011 → T015 → T016 → T028 → T029 → T040 → T046

**11 tasks on critical path** (ASCII diagram parser + LLM classification is the longest chain)

---

## Bug Fix Tasks

- [x] T-B001 [BUG-001] Add Tessl MCP search call in computePlanViewState to fetch eval data for each tile, merge into TesslTile objects (GitHub #13)
- [x] T-B002 [BUG-001] Update renderTesslPanel() to render eval score (percentage), bar chart (pass/fail), and multiplier badge when tile.eval is non-null (GitHub #13)
- [x] T-B003 [BUG-001] Verify fix passes tests TS-015, TS-016, TS-042, TS-043 for BUG-001: eval scores display when available and are absent when unavailable (GitHub #13)

---

## Implementation Strategy

**MVP (Phase 1-3)**: Setup + parsers + badge wall. Provides a working Plan tab with tech stack visualization. Independently testable and demonstrable.

**Core (Phase 4-5)**: Add structure tree and architecture diagram. The three P1 stories deliver the full plan visualization.

**Enhancement (Phase 6-7)**: Tessl panel and live updates. Enriches the view but core visualization works without them.

**Polish (Phase 8)**: Empty states, accessibility, theme support. Production readiness.
