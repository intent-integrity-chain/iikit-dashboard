# Tasks: Constitution Radar Chart

## Phase 1: Foundational — Constitution Parser

- [x] T001 [P] Write tests for `parseConstitutionPrinciples` in `test/parser.test.js` — to pass TS-011 through TS-017 (principle extraction, obligation levels, rationale, version metadata, defaults)
- [x] T002 [P] Write tests for GET `/api/constitution` in `test/server.test.js` — to pass TS-008, TS-009
- [x] T003 Implement `parseConstitutionPrinciples(projectPath)` in `src/parser.js` — extracts principles array and version metadata from CONSTITUTION.md, returns structured JSON
- [x] T004 Add GET `/api/constitution` endpoint to `src/server.js` — calls `parseConstitutionPrinciples`, returns JSON

## Phase 2: User Story 1 — See All Principles at a Glance (P1)

- [x] T005 [US1] Add Constitution tab CSS to `src/public/index.html` — styles for radar chart container, SVG, summary bar, detail card, timeline, empty state
- [x] T006 [US1] Implement `renderConstitutionView(data)` in `src/public/index.html` — replaces placeholder when Constitution node is clicked, loads data from `/api/constitution`
- [x] T007 [US1] Implement principle summary bar at top of Constitution tab — compact list showing "I. Name (MUST) | II. Name (SHOULD) | ..."
- [x] T008 [US1] Implement SVG radar chart rendering — inline SVG with regular polygon, concentric rings for MUST/SHOULD/MAY levels, semi-transparent filled polygon connecting axis endpoints, axis labels, responsive sizing (max 400px), `role="img"` with `aria-label`
- [x] T009 [US1] Implement empty state for missing CONSTITUTION.md — message suggesting to run /iikit-00-constitution

## Phase 3: User Story 2 — Read Principle Details (P1)

- [x] T010 [US2] Add clickable axis interaction to radar chart — axes are focusable with Tab, activatable with Enter/Space and click, `aria-label` per axis
- [x] T011 [US2] Implement detail card rendering alongside radar — shows principle name, full text, rationale, obligation level; stays open until another axis clicked or dismissed

## Phase 4: User Story 3 — See Amendment History (P2)

- [x] T012 [US3] Implement amendment timeline below radar chart — horizontal timeline showing version number and dates, hidden when no version metadata present

## Phase 5: Live Updates & Integration

- [x] T013 Write test for WebSocket `constitution_update` message in `test/server.test.js` — to pass TS-010
- [x] T014 Add `constitution_update` WebSocket push to `src/server.js` — sent to ALL clients on CONSTITUTION.md change (not feature-specific)
- [x] T015 Add WebSocket handler for `constitution_update` in `src/public/index.html` — re-renders Constitution tab if active

## Phase 6: Polish

- [x] T016 Verify all 18 test specifications pass — run full Jest suite

## Dependencies & Execution Order

- **Phase 1** (T001-T004): T001-T002 parallel (tests first), T003 depends on T001 (TDD), T004 depends on T002 (TDD)
- **Phase 2** (T005-T009): Depends on T004 (API endpoint). T005-T009 are sequential within the tab (CSS first, then rendering, then components)
- **Phase 3** (T010-T011): Depends on T008 (radar must exist for click interaction)
- **Phase 4** (T012): Depends on T006 (tab container must exist)
- **Phase 5** (T013-T015): Depends on T004 (server endpoint) and T006 (tab rendering). T013-T014 sequential (TDD), T015 depends on T014
- **Phase 6** (T016): Depends on all prior phases

## Parallel Execution Batches

```
Phase 1: [T001, T002] (tests) -> [T003, T004] (implementations)
Phase 2: T005 -> T006 -> [T007, T008, T009] (parallel within tab)
Phase 3: T010 -> T011
Phase 5: T013 -> T014 -> T015
```

## Implementation Strategy

**MVP**: Phase 1-2 (parser + radar chart renders with principles)
**Complete**: Phase 3-5 (detail card, timeline, live updates)
**Polish**: Phase 6 (final verification)

## Bug Fix Tasks

- [x] T-B001 [BUG-001] Implement fix for BUG-001 referencing test specs TS-019 through TS-023: Add /api/premise endpoint, render premise.md content in Constitution panel, rename panel to "Premise and Constitution" when premise.md exists (GitHub #29)
- [x] T-B002 [BUG-001] Verify fix passes tests TS-019 through TS-023 for BUG-001: Run test suite confirming premise rendering, panel title logic, and API endpoint (GitHub #29)
