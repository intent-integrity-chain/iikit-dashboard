# Tasks: IIKit Kanban Board

**Input**: Design documents from `/specs/001-kanban-board/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, tests/test-specs.md

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions
- Tasks reference test spec IDs from test-specs.md where applicable

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Initialize package.json with name, version, scripts (start, test)
- [ ] T002 Install dependencies: express, ws, chokidar
- [ ] T003 Install dev dependencies: jest
- [ ] T004 Create directory structure: src/, src/public/, test/, bin/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core modules that ALL user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Implement spec.md parser in src/parser.js — extract user stories (title, priority) from markdown headings (FR-001, must pass TS-014)
- [ ] T006 [P] Implement tasks.md parser in src/parser.js — extract tasks with checkbox status and [USx] tags (FR-002, must pass TS-015)
- [ ] T007 Implement board state computation in src/board.js — assign stories to todo/in_progress/done columns based on task completion (FR-006, must pass TS-016)
- [ ] T008 [P] Implement integrity checker in src/integrity.js — SHA256 hash comparison for test-specs.md assertions (FR-008, must pass TS-017)
- [ ] T009 Create Express server skeleton in src/server.js — serve static files from src/public/ (FR-006, FR-009)
- [ ] T010 [P] Create CLI entry point in bin/iikit-kanban.js — parse --path argument, start server, open browser, print URL (FR-009, FR-010, FR-013)
- [ ] T010b [P] Add error handling to parsers — malformed markdown, missing files, invalid UTF-8 return empty/default state instead of throwing (FR-011)

**Checkpoint**: Foundation ready — user story implementation can begin

---

## Phase 3: User Story 1 — Watch an Agent Work in Real Time (Priority: P1)

**Goal**: Live-updating task checkboxes and card movement via WebSocket

**Independent Test**: Check off tasks in tasks.md at intervals → dashboard updates live

- [ ] T011 [US1] Add chokidar file watcher to src/server.js — watch specs/ and .specify/ with 300ms debounce (FR-005, FR-014)
- [ ] T012 [US1] Add WebSocket server (ws) to src/server.js — push board_update messages on file change (FR-005, must pass TS-013)
- [ ] T013 [US1] Implement GET /api/board/:feature endpoint in src/server.js (FR-003, FR-004, must pass TS-012)
- [ ] T014 [US1] Create src/public/index.html — board layout with three columns (Todo, In Progress, Done), WebSocket client with auto-reconnect (FR-003)
- [ ] T015 [US1] Add card rendering in index.html — story cards with title, priority badge, task checkboxes, progress bar (FR-004, FR-012)
- [ ] T016 [US1] Add live DOM update logic in index.html — on WebSocket message, diff and update cards with CSS transitions (FR-006, must pass TS-001, TS-002, TS-003)

**Checkpoint**: US1 complete — live dashboard with real-time task updates working

---

## Phase 4: User Story 2 — See Where Every Story Stands (Priority: P1)

**Goal**: Correct initial board state rendering with progress indicators

**Independent Test**: Create feature with stories at various completion states → board shows correct columns

- [ ] T017 [US2] Implement initial board load via GET /api/board/:feature on page open (FR-003, FR-004, must pass TS-004, TS-005, TS-006)
- [ ] T018 [US2] Add progress bar styling — show "3/7" text and visual bar on each card (FR-012, must pass TS-005)
- [ ] T019 [US2] Add empty state for board — message when no features or no tasks exist (FR-011, must pass TS-004 scenario 4)
- [ ] T020 [US2] Style column headers (Todo, In Progress, Done) with distinct visual treatment (FR-012, FR-013)

**Checkpoint**: US2 complete — accurate static board with progress indicators

---

## Phase 5: User Story 3 — Switch Between Features (Priority: P2)

**Goal**: Feature selector for multi-feature projects

**Independent Test**: Create project with 2 features → switch between them via selector

- [ ] T021 [US3] Implement GET /api/features endpoint in src/server.js (FR-007, must pass TS-011)
- [ ] T022 [US3] Add feature selector dropdown to index.html — show feature names, trigger board reload on selection (FR-007, must pass TS-007, TS-008)
- [ ] T023 [US3] Add feature auto-detection — load first feature with tasks.md on startup (FR-007)

**Checkpoint**: US3 complete — multi-feature switching works

---

## Phase 6: User Story 4 — Assertion Integrity at a Glance (Priority: P2)

**Goal**: Integrity badge showing valid/tampered/missing status

**Independent Test**: Store hash, tamper test-specs.md → badge changes to "tampered"

- [ ] T024 [US4] Wire integrity check into board state computation — call integrity.js on each board rebuild (FR-008, must pass TS-009, TS-010)
- [ ] T025 [US4] Add integrity badge UI to index.html — "verified" (green), "tampered" (red warning), "missing" (gray) (FR-008)

**Checkpoint**: US4 complete — integrity status visible on dashboard

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Professional UI and final refinements

- [ ] T026 Style cards to professional kanban standard — shadows, rounded corners, typography, hover states (FR-012, Constitution III)
- [ ] T027 Add card slide animations — smooth CSS transitions when cards move between columns (FR-012)
- [ ] T028 Add responsive layout — handle narrow viewports with horizontal scroll (FR-010)
- [ ] T029 Add ARIA labels and semantic HTML for accessibility (FR-015)
- [ ] T030 Add keyboard navigation for feature selector (FR-016)

**Checkpoint**: All user stories complete with professional polish

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational — core live update feature
- **US2 (Phase 4)**: Depends on Foundational — can run in parallel with US1
- **US3 (Phase 5)**: Depends on US1 or US2 (needs working board first)
- **US4 (Phase 6)**: Depends on Foundational (integrity.js) — can run in parallel with US1/US2
- **Polish (Phase 7)**: Depends on all user stories

### Parallel Opportunities

- T005 and T006 can run in parallel (different parse functions)
- T007 and T008 can run in parallel (different modules)
- T009 and T010 can run in parallel (different files)
- US1 and US2 can run in parallel after Phase 2 (different concerns)
- US4 can run in parallel with US1/US2 after Phase 2

### Critical Path

T001 → T004 → T005 → T007 → T009 → T011 → T012 → T014 → T016 → T026 → T027

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story checkpoint is independently demonstrable
- Test spec references (TS-XXX) enable TDD: write tests first per constitution
- Commit after each task or logical group
