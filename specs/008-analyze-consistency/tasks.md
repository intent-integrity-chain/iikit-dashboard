# Tasks: Analyze Consistency — Coverage Heatmap, Severity Table, Health Gauge

**Input**: Design documents from `/specs/008-analyze-consistency/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, research.md, tests/test-specs.md

**TDD**: mandatory (Constitution §I — NON-NEGOTIABLE). Write tests FIRST, verify RED, then implement GREEN.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 2: Foundational — Test Specifications (RED)

**Purpose**: Write all backend tests before any implementation code exists. Tests MUST fail (RED) at this stage.

**CRITICAL**: TDD is mandatory. No implementation task can begin until its corresponding tests exist.

- [x] T001 [P] Write tests for parseAnalysisFindings, parseAnalysisCoverage, parseAnalysisMetrics, parseConstitutionAlignment, and parsePhaseSeparation in test/parser.test.js — must pass TS-039, TS-040, TS-041, TS-042, TS-043, TS-044, TS-045, TS-046, TS-047, TS-048, TS-049, TS-050, TS-051
- [x] T002 [P] Write tests for computeHealthScore, zone assignment, phase separation penalties, constitution compliance, buildHeatmapRows, and mapCellStatus in test/analyze.test.js — must pass TS-052, TS-053, TS-054, TS-055, TS-056, TS-057, TS-058
- [x] T003 [P] Write contract tests for GET /api/analyze/:feature (success + empty state), analyze_update WebSocket message, healthScore factors structure, heatmap row structure, and issue object structure in test/server.test.js — must pass TS-033, TS-034, TS-035, TS-036, TS-037, TS-038

**Checkpoint**: All three test files written. Running tests confirms RED (all new tests fail). No implementation code exists yet.

---

## Phase 3: Foundational — Implementation (GREEN)

**Purpose**: Implement backend logic to make all Phase 2 tests pass. Parsers → compute module → server integration.

- [x] T004 Implement parseAnalysisFindings and parseAnalysisCoverage in src/parser.js — extract findings table rows with resolved/strikethrough detection, extract coverage summary in both simple and detailed table formats (depends on T001)
- [x] T005 Implement parseAnalysisMetrics, parseConstitutionAlignment, and parsePhaseSeparation in src/parser.js — extract metrics from table/bullet formats with percentage parsing, extract constitution alignment table, extract phase separation violations (depends on T001, T004)
- [x] T006 Create src/analyze.js with computeAnalyzeState, computeHealthScore, buildHeatmapRows, and mapCellStatus — health score as equal-weighted average of 4 factors, zone assignment (red/yellow/green), phase separation penalty calculation, heatmap row assembly from spec requirements + coverage data (depends on T002, T004, T005)
- [x] T007 Add GET /api/analyze/:feature endpoint and analyze_update WebSocket broadcast to src/server.js — import computeAnalyzeState, return full analyze state JSON, push analyze_update on file change alongside existing broadcasts (depends on T003, T006)

**Checkpoint**: All parser, analyze, and server tests GREEN. Backend complete. API endpoint returns correct JSON for both populated and empty states.

---

## Phase 4: User Story 1 + User Story 2 — Coverage Heatmap + Severity Table (Priority: P1) MVP

**Goal**: Developer can see requirements coverage at a glance and triage issues by severity
**Independent Test**: Load the Analyze tab and verify the heatmap renders with correct cell colors and the severity table shows sortable, filterable issues

### Implementation for User Story 1 — Coverage Heatmap

- [x] T008 [US1] Implement renderAnalyzeView() entry point and coverage heatmap section in src/public/index.html — fetch /api/analyze/:feature, render HTML table with th scope="col"/"row" for accessibility, color-coded td cells (green/yellow/red/gray via CSS classes), cell click expansion showing artifact references, aria-labels for coverage status, vertical scroll for >8 rows with fixed column headers, empty states for no-data and no-requirements (depends on T007) — must pass TS-001, TS-002, TS-003, TS-018, TS-019, TS-021, TS-025, TS-027, TS-028

### Implementation for User Story 2 — Severity Table

- [x] T009 [US2] Implement severity table section in src/public/index.html — render HTML table with data-severity and data-category attributes on rows, default sort by severity (critical=0, high=1, medium=2, low=3), click-to-sort on all column headers, category and severity dropdown filters, expandable rows for full recommendation text, color-coded severity badges (red/orange/yellow/blue), keyboard navigation with tabindex on headers and rows, success message for zero issues (depends on T008) — must pass TS-004, TS-005, TS-006, TS-007, TS-020, TS-026, TS-029, TS-030, TS-031

**Checkpoint**: Coverage heatmap and severity table fully functional. Developer can scan coverage gaps and triage issues. P1 stories complete — MVP usable.

---

## Phase 5: User Story 3 — Health Gauge (Priority: P2)

**Goal**: Developer can assess overall project health from a prominent score gauge
**Independent Test**: Load the Analyze tab and verify the gauge shows correct score, color zone, and breakdown tooltip

- [x] T010 [US3] Implement SVG health gauge with semicircular arc in src/public/index.html — three color zone segments (red 0-40, yellow 41-70, green 71-100) using path elements with stroke-dasharray, animated needle rotating from 0 to score via CSS transition, score number centered, breakdown tooltip on hover/click showing four factor contributions with labels and percentages, role="meter" with aria-valuenow/min/max, "N/A" display when constitution missing, integer rounding for fractional scores (depends on T009) — must pass TS-008, TS-009, TS-010, TS-011, TS-022, TS-023

**Checkpoint**: Health gauge renders with correct score, zone coloring, and breakdown tooltip. P2 story complete.

---

## Phase 6: User Story 4 + User Story 5 — Trend Indicator + Real-time Updates (Priority: P3)

**Goal**: Developer sees score trajectory and watches updates happen live

### Implementation for User Story 4 — Trend Indicator

- [x] T011 [US4] Implement trend indicator next to health gauge score in src/public/index.html — read score history from analyze state, compare latest two scores, show upward arrow for improvement and downward arrow for decline, hide indicator when only one or no history entries (depends on T010) — must pass TS-012, TS-013, TS-014

### Implementation for User Story 5 — Real-time Updates

- [x] T012 [US5] Implement WebSocket analyze_update message handler in src/public/index.html — listen for analyze_update messages, re-render heatmap cells, severity table rows, gauge needle position, and trend indicator with received data, ensure updates complete within 5 seconds of file change (depends on T009, T010, T011) — must pass TS-015, TS-016, TS-017

**Checkpoint**: Trend arrow shows next to gauge. All three sub-views update in real time when analysis.md changes. P3 stories complete.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Load animations, error resilience, and visual consistency

- [x] T013 Add load animations and CSS styles for analyze view in src/public/index.html — gauge needle sweep from 0 (CSS transition 1s ease-out), heatmap rows fade in with staggered animation-delay, severity table slide-in from below, use existing --transition-normal/--transition-slow variables, prefers-reduced-motion media query to disable animations (depends on T010) — must pass TS-024
- [x] T014 Add graceful handling of malformed analysis.md and per-section empty states in src/public/index.html — try/catch around each parser section, show overall empty state on total failure, render successfully-parsed sections alongside "No coverage data"/"No issues found"/"N/A" placeholders for failed sections (depends on T008) — must pass TS-031, TS-032

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational Tests (Phase 2)**: No dependencies — T001, T002, T003 start immediately in parallel
- **Foundational Implementation (Phase 3)**: Depends on Phase 2 tests existing (TDD). T004→T005→T006→T007 sequential chain
- **P1 Stories (Phase 4)**: Depends on T007 (server endpoint). T008→T009 sequential (same file)
- **P2 Story (Phase 5)**: Depends on T009. T010 sequential
- **P3 Stories (Phase 6)**: T011 depends on T010, T012 depends on T011
- **Polish (Phase 7)**: T013 depends on T010, T014 depends on T008. T013 and T014 can start once their deps complete

### Dependency Graph

```
T001 ──┬──→ T004 → T005 ──┐
T002 ──┤                    ├──→ T006 → T007 → T008 → T009 → T010 → T011 → T012
T003 ──┘                    │                    │              │
                            │                    └──→ T014      └──→ T013
                            └──────────────────────────────────────────────────
```

### Parallel Opportunities

**Batch 1** (Phase 2): T001 + T002 + T003 — three test files written simultaneously
**Batch 2** (Phase 7): T013 + T014 — can overlap if T013 starts after T010 and T014 starts after T008 (different concerns, but same file limits true parallelism)

### Critical Path

T001 → T004 → T005 → T006 → T007 → T008 → T009 → T010 → T011 → T012 (10 tasks)

### Story Task Counts

| Story | Tasks | IDs | Test Specs |
|-------|-------|-----|------------|
| Foundational | 7 | T001-T007 | TS-033–TS-058 |
| US1 — Heatmap (P1) | 1 | T008 | TS-001–TS-003, TS-018–TS-019, TS-021, TS-025, TS-027–TS-028 |
| US2 — Severity Table (P1) | 1 | T009 | TS-004–TS-007, TS-020, TS-026, TS-029–TS-031 |
| US3 — Health Gauge (P2) | 1 | T010 | TS-008–TS-011, TS-022–TS-023 |
| US4 — Trend (P3) | 1 | T011 | TS-012–TS-014 |
| US5 — Real-time (P3) | 1 | T012 | TS-015–TS-017 |
| Polish | 2 | T013-T014 | TS-024, TS-031–TS-032 |

### MVP Scope

**MVP = Phase 2 + Phase 3 + Phase 4** (T001–T009): Full backend + coverage heatmap + severity table. Delivers the two P1 stories — developer can see coverage gaps and triage issues. Health gauge and real-time updates follow as incremental P2/P3 enhancements.

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- TDD is MANDATORY: write tests FIRST (RED), implement (GREEN), refactor
- All backend tests written in Phase 2 before any implementation in Phase 3
- Each user story is independently completable after Phase 3
- Frontend tasks (T008–T014) modify src/public/index.html — sequential execution required
- Commit after each task or logical group
- Stop at any checkpoint to validate independently
