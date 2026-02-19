# Tasks: Bugs Tab — Bug Tracking Visualization

**Feature**: `009-bugs-tab` | **Branch**: `009-bugs-tab`
**Generated**: 2026-02-19
**TDD**: mandatory (Constitution §I)

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[USn]**: Which user story this task belongs to
- Include exact file paths in descriptions
- Test spec references (TS-NNN) link to `tests/test-specs.md`

---

## Phase 1: Foundational — Parser & Bugs Module

**Purpose**: Shared parsing and computation infrastructure. MUST be complete before any user story work.

### Tests (write first, must fail — Constitution §I)

- [x] T001 [P] Write parseBugs unit tests in test/parser.test.js to pass TS-030, TS-031, TS-032, TS-033, TS-043, TS-044 (Bug ID validation, severity/status defaults, missing fields, empty/missing file)
- [x] T002 [P] Write extended parseTasks regex unit tests in test/parser.test.js to pass TS-034, TS-035, TS-045 (T-B prefix recognition, bugTag extraction, both formats parsed)
- [x] T003 [P] Write computeBugsState unit tests in test/bugs.test.js to pass TS-036, TS-037, TS-038, TS-039, TS-040 (open count, highestOpenSeverity, bySeverity, severity hierarchy, null when no open bugs)
- [x] T004 [P] Write resolveGitHubIssueUrl unit tests in test/bugs.test.js to pass TS-041, TS-042 (URL from git remote, plain text when no remote)

### Implementation (make tests green)

- [x] T005 Implement parseBugs function in src/parser.js — parse `## BUG-NNN` headings with Reported, Severity, Status, GitHub Issue, Description, Root Cause, Fix Reference fields; return empty array on missing/empty/malformed input (depends on T001)
- [x] T006 [P] Extend parseTasks regex in src/parser.js to match `T-B\d+` IDs and `[BUG-\d+]` tags; add isBugFix boolean and bugTag field to task objects (depends on T002)
- [x] T007 Create src/bugs.js with computeBugsState(projectPath, featureId) — cross-reference parseBugs output with parseTasks fix tasks, compute summary (total, open, fixed, highestOpenSeverity, bySeverity), sort bugs by severity descending then ID ascending, detect orphaned T-B tasks (depends on T003, T005, T006)
- [x] T008 Add resolveGitHubIssueUrl(issueRef, repoUrl) helper to src/bugs.js — derive repo URL from git remote origin, resolve "#13" to full GitHub URL; return null when no remote (depends on T004, T007)

**Checkpoint**: All foundational tests pass. parseBugs, extended parseTasks, computeBugsState, and resolveGitHubIssueUrl verified.

---

## Phase 2: User Story 1 — View Bug Status Table (Priority: P1) + User Story 2 — Bug Count Badge (Priority: P1)

**Goal**: Developer can click the Bugs tab to see a severity-coded bug table with fix task progress. Badge on the tab shows open bug count color-coded by highest severity.

**Independent Test**: Create fixture with 3 bugs of different severities and T-B fix tasks. Click Bugs tab, verify table rows, badge count and color.

### Tests (write first)

- [x] T009 Write contract tests for GET /api/bugs/:feature in test/server.test.js to pass TS-025, TS-026, TS-027 (200 with bugs, 200 no bugs.md, 404 unknown feature)

### Implementation

- [x] T010 [US1] Add GET /api/bugs/:feature route in src/server.js — import computeBugsState from src/bugs.js, return JSON response per contracts/bugs-api.md (depends on T007, T009)
- [x] T011 [US1][US2] Add Bugs tab element to pipeline bar in src/public/index.html — standalone tab at end of pipeline, no connector line, gap separator; add data-view="bugs" attribute to pass TS-023
- [x] T012 [US2] Implement bug count badge with severity color on Bugs tab in src/public/index.html — badge shows open bug count, color by highestOpenSeverity (red=critical, orange=high, yellow=medium, gray=low), muted when no bugs or all fixed to pass TS-005, TS-006, TS-007, TS-008 (depends on T010, T011)
- [x] T013 [P] [US1] Add severity CSS classes (.severity-critical, .severity-high, .severity-medium, .severity-low) and bug table styles in src/public/index.html — use dedicated colors per data-model.md: red #ff4757, orange #ffa502, yellow #f1c40f, gray #6b7189
- [x] T014 [US1] Implement renderBugsView() in src/public/index.html — fetch from /api/bugs/:feature, render table with columns Bug ID, Severity (badge), Status, Fix Tasks (progress "N/M" or "—"), Description, GitHub Issue; sort by severity descending then ID ascending; handle orphaned T-B tasks to pass TS-001, TS-002, TS-018, TS-020, TS-024 (depends on T010, T013)
- [x] T015 [US1] Implement empty state in renderBugsView() in src/public/index.html — show message when exists is false or bugs array is empty to pass TS-004, TS-019 (depends on T014)
- [x] T016 [US1] Implement GitHub issue clickable links in bug table rows in src/public/index.html — resolve issue refs to full URLs using repoUrl, render as external link (target="_blank"); plain text when no remote to pass TS-003, TS-014 (depends on T008, T014)

**Checkpoint**: Bug table renders with severity colors, fix task progress, GitHub links, and empty state. Badge shows correct count and color. US1 and US2 acceptance scenarios verified.

---

## Phase 3: User Story 3 — Bug Task Differentiation (Priority: P2) + User Story 4 — Cross-Panel Navigation (Priority: P2)

**Goal**: Bug fix tasks are visually distinct on the Implement board. Cmd+click navigates between Bugs tab and Implement board.

**Independent Test**: Open Implement board with T-B tasks, verify bug icon. Cmd+click BUG tag → Bugs tab. Cmd+click task ID → Implement board.

- [x] T017 [US3] Add bug icon and visual styling to T-B prefixed tasks on Implement board in src/public/index.html — render bug SVG icon next to task ID for tasks with isBugFix: true to pass TS-010 (depends on T006)
- [x] T018 [US3] Add per-bug card grouping for T-B fix tasks on Implement board in src/public/index.html — group by BUG-NNN tag instead of "Unassigned", show bug icon in card header per research R-002 to pass TS-012 (depends on T017)
- [x] T019 [US3][US4] Add Cmd+click cross-link from [BUG-NNN] tags on Implement board to Bugs tab in src/public/index.html — use data-cross-target="bugs" data-cross-id="BUG-001" pattern, switch to Bugs view and highlight bug row to pass TS-011 (depends on T014, T018)
- [x] T020 [US4] Add Cmd+click cross-link from task IDs in Bugs tab to Implement board in src/public/index.html — use data-cross-target="implement" data-cross-id="T-B001" pattern, switch to Implement view and highlight task to pass TS-013 (depends on T014)
- [x] T021 [US4] Implement highlightBugsEntity(entityId) in src/public/index.html — find [data-bug-id] row, scroll into view, apply 2-second highlight animation matching existing cross-link highlight pattern (depends on T019, T020)

**Checkpoint**: Bug fix tasks visually differentiated on board. Cross-navigation works both directions. US3 and US4 acceptance scenarios verified.

---

## Phase 4: User Story 5 — Real-Time Updates via WebSocket (Priority: P3)

**Goal**: Bugs tab updates in real time when bugs.md or tasks.md changes on disk.

**Independent Test**: Open Bugs tab, modify bugs.md on disk, verify table and badge update without refresh.

### Tests (write first)

- [x] T022 Write WebSocket bugs_update broadcast tests in test/websocket.test.js to pass TS-028, TS-029 (broadcast on file change, payload matches API response format)

### Implementation

- [x] T023 [US5] Extend file change handler in src/server.js to compute and broadcast bugs_update via WebSocket — include bug state in debounced broadcast alongside existing view updates to pass TS-015, TS-016, TS-017 (depends on T007, T022)
- [x] T024 [US5] Handle bugs_update WebSocket messages in frontend in src/public/index.html — update bug table and badge when bugs_update received to pass TS-009 (depends on T014, T023)
- [x] T025 [US5] Implement bug data reload on feature switch in src/public/index.html — re-fetch /api/bugs/:feature when active feature changes, update table and badge to pass TS-022 (depends on T014)

**Checkpoint**: Real-time updates working for bug table, badge, and feature switch. US5 acceptance scenarios verified.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility and final verification.

- [x] T026 [P] Add ARIA labels and keyboard accessibility for Bugs tab, table, badge, and cross-links in src/public/index.html — aria-label on tab button, role="table" with aria-sort, aria-live="polite" on badge
- [x] T027 Run quickstart.md verification scenarios (all 8 scenarios) to validate end-to-end behavior

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Foundational) ──> Phase 2 (US1+US2, P1) ──> Phase 3 (US3+US4, P2) ──> Phase 5 (Polish)
                       └──> Phase 4 (US5, P3) ──────────────────────────────┘
```

Phase 3 and Phase 4 can run in parallel after Phase 2 is complete.

### Critical Path

T001 → T005 → T007 → T010 → T014 → T019 → T021 → T027 (8 tasks, longest chain)

### Parallel Batches

| Batch | Tasks | Notes |
|-------|-------|-------|
| 1 | T001, T002, T003, T004 | All foundational tests (different files/sections) |
| 2 | T005, T006 | parseBugs + parseTasks extension (different functions in parser.js) |
| 3 | T007 then T008 | computeBugsState then resolveGitHubIssueUrl (same file, sequential) |
| 4 | T009 | Contract tests for endpoint |
| 5 | T010, T013 | Server route + CSS classes (different files) |
| 6 | T011, T012, T014, T015, T016 | Frontend: tab + badge + table + empty state + links (sequential within index.html) |
| 7 | T017, T018, T019, T020, T021 | Board differentiation + cross-nav (sequential) |
| 8 | T022 then T023, T024, T025 | WebSocket tests then implementation |
| 9 | T026, T027 | Polish (parallel) |

### Story Task Count

| Story | Tasks | Test Tasks | Impl Tasks |
|-------|-------|------------|------------|
| Foundational | 8 | 4 | 4 |
| US1 (P1) | 7 | 1 | 6 |
| US2 (P1) | 2 | 0 | 2 |
| US3 (P2) | 3 | 0 | 3 |
| US4 (P2) | 3 | 0 | 3 |
| US5 (P3) | 4 | 1 | 3 |
| Polish | 2 | 0 | 2 |
| **Total** | **27** | **6** | **21** |

### MVP Scope

**Minimum viable**: Phases 1–2 (T001–T016, 16 tasks) → Bug table + badge functional
**Full feature**: All phases (T001–T027, 27 tasks) → Complete with cross-nav, real-time, and polish

### Implementation Strategy

1. **TDD is mandatory** — write tests before implementation in every phase
2. **No new dependencies** — extend existing Express/ws/chokidar stack
3. **Follow existing patterns** — computeBugsState mirrors computeChecklistViewState, parseBugs mirrors parseSpecStories
4. **Single-file frontend** — all UI changes in src/public/index.html (inline JS/CSS)
5. **Permissive parsing** — parseBugs returns [] on bad input, never throws
