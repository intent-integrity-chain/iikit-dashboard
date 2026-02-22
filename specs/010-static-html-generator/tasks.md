# Tasks: Static HTML Generator

**Input**: Design documents from `/specs/010-static-html-generator/`
**Prerequisites**: plan.md ✓, spec.md ✓, data-model.md ✓, contracts/ ✓, tests/test-specs.md ✓
**TDD**: MANDATORY — every implementation task is preceded by a failing test task

## Format: `[ID] [P?] [USn] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[USn]**: User story this task belongs to
- Test IDs in parentheses: `(TS-001, TS-002)` — tests that task implements/satisfies

## Plan Readiness

- Tech stack: JavaScript / Node.js 18+ ✅
- User stories: US1 (7 scenarios, P1), US2 (3 scenarios, P2) ✅
- Shared entities: all 10 parser/compute modules used by generator → verified in Foundational phase
- Critical path: Setup → Foundational → US1 → US2 → Polish (strict sequential)
- Test specs locked: 10 test specs (TS-001 through TS-010)

---

## Phase 1: Setup

**Purpose**: Establish a clean baseline and add build tooling.

- [x] T001 Verify baseline — run `npm test` and `npm run test:visual`, confirm all tests pass, record counts
- [x] T002 Add `esbuild` to devDependencies in `package.json` (`npm install --save-dev esbuild`)
- [x] T003 [P] Create `build/` directory; add `dist/` to `.gitignore`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Verify all existing parser/compute modules are importable and produce valid output. The generator depends on all 10 modules — validate they work before building anything on top.

**CRITICAL**: No user story work can begin until this phase is complete.

- [x] T004 Write Jest smoke test in `test/generate-dashboard.test.js` — import all 10 compute modules (parser, board, pipeline, storymap, planview, checklist, testify, analyze, integrity, bugs), verify each exports its compute function, call each with minimal fixture data, verify no throws (FR-010)
- [x] T005 Run `npm test` — smoke test must pass. Record which compute functions exist and their signatures.

**Checkpoint**: All 10 compute modules verified importable and functional.

---

## Phase 3: User Story 1 — Static HTML Generator (Priority: P1)

**Goal**: `node src/generate-dashboard.js <path>` writes `.specify/dashboard.html` with all data inlined. `--watch` re-generates on file changes. Output works via `file://`.

**Independent Test**: Run generator against this project, open output via `file://`, verify all views render.

> **Write tests FIRST — ensure they FAIL before implementation**

### Tests for US1

- [x] T006 [P] [US1] Write Jest test for CLI arg parsing in `test/generate-dashboard.test.js` — test: missing arg exits 1 (TS-001), bad path exits 1 (error code 1), valid path writes file, `.` resolves to CWD, relative path resolves correctly
- [x] T007 [P] [US1] Write Jest test for error handling in `test/generate-dashboard.test.js` — test: missing project dir → exit 1 (TS-001), missing CONSTITUTION.md → exit 3, write permission denied → exit 4, compute module failure → exit 5
- [x] T008 [P] [US1] Write Jest test for DASHBOARD_DATA assembly in `test/generate-dashboard.test.js` — test: output contains all features (every specs/*/spec.md dir), each feature has 8 view keys (board, pipeline, storyMap, planView, checklist, testify, analyze, bugs), meta.projectPath is non-empty, meta.generatedAt is ISO-8601 (TS-001, TS-003)
- [x] T009 [P] [US1] Write Jest test for HTML output in `test/generate-dashboard.test.js` — test: output contains `<script>window.DASHBOARD_DATA`, contains `<meta http-equiv="refresh" content="2">`, contains JS fallback `setInterval`, output is valid HTML with `</html>`, file written atomically via .tmp rename (TS-001, TS-006)
- [x] T010 [US1] Write Jest test for watch mode in `test/generate-dashboard.test.js` — test: `--watch` flag starts chokidar watcher, file change triggers re-generation, 300ms debounce works, only specs/**/*.md + CONSTITUTION.md + PREMISE.md trigger re-gen, node_modules/.git/dist ignored (TS-005, TS-007)

### Implementation for US1

- [x] T011 [US1] Create `src/generate-dashboard.js` — CLI entry point: parse args (projectPath required, --watch optional), resolve paths (absolute/relative/.), validate project dir exists (exit 1 if not), validate CONSTITUTION.md exists (exit 3 if not)
- [x] T012 [US1] Implement data assembly in `src/generate-dashboard.js` — list features (specs/*/spec.md dirs per FR-004), for each feature call all 10 compute modules, read constitution + premise, assemble full DASHBOARD_DATA per data-model.md schema (FR-004, FR-010)
- [x] T013 [US1] Implement HTML injection in `src/generate-dashboard.js` — read `src/public/index.html` as template, inject `<meta http-equiv="refresh" content="2">` before `</head>` (FR-007), inject JS fallback `setInterval(() => location.reload(), 2000)` (FR-007), inject `<script>window.DASHBOARD_DATA = JSON.stringify(data)</script>` before `</body>` (FR-004, FR-005)
- [x] T014 [US1] Implement atomic file write in `src/generate-dashboard.js` — write to `.specify/dashboard.html.tmp`, rename to `.specify/dashboard.html` on success (FR-011). Create `.specify/` dir if missing. Log warning for features >500KB (SC-007)
- [x] T015 [US1] Implement `--watch` mode in `src/generate-dashboard.js` — lazy-require chokidar, watch with include globs (`specs/**/*.md`, `CONSTITUTION.md`, `PREMISE.md`) and ignore globs (`node_modules/**`, `.git/**`, `dist/**`, `.specify/dashboard.html`, `.*cache*`, `*.tmp`), 300ms debounce, re-run generation on change (FR-008)
- [x] T016 [US1] Implement error handling in `src/generate-dashboard.js` — wrap compute calls in try/catch, exit with appropriate codes (1-5 per error matrix), print to stderr in format "Error: [problem]. [recovery hint].", never write partial dashboard.html
- [x] T017 [US1] Run Jest unit tests: `npm test` — all generate-dashboard tests must pass (TS-001 through TS-007)
- [x] T018 [US1] Manual integration test: run `node src/generate-dashboard.js .`, open `.specify/dashboard.html` via `file://` in Chrome, verify all 9 phase views render with real data, feature selector works (TS-001, TS-002, TS-003)
- [x] T019 [US1] Run Playwright visual regression: `npm run test:visual` — must pass with ≤2% pixel diff (FR-009, SC-001)

**Checkpoint**: US1 complete. Generator works. `dashboard.html` renders offline. Watch mode re-generates.

---

## Phase 4: User Story 1 — Bundle (P1 continued)

**Goal**: Bundle generator into single distributable .js file for tessl tile.

> **Write tests FIRST — ensure they FAIL before implementation**

### Tests for Bundle

- [x] T020 [US1] Write Jest test for bundle correctness in `test/bundle.test.js` — run modular `src/generate-dashboard.js` and bundled `dist/generate-dashboard.js` on same test project, compare DASHBOARD_DATA JSON hashes (must match exactly) (TS-004, FR-006a)

### Implementation for Bundle

- [x] T021 [US1] Create `build/bundle-generator.js` — esbuild script: bundle `src/generate-dashboard.js` into `dist/generate-dashboard.js`, platform=node, external fs/path/chokidar (FR-006a)
- [x] T022 [US1] Add `"build:generator": "node build/bundle-generator.js"` to `package.json` scripts; run build and verify output exists
- [x] T023 [US1] Run bundle correctness test: `npm test` — bundled vs modular output must match (TS-004, FR-006a)

**Checkpoint**: Bundled generator produces identical output to modular source.

---

## Phase 5: User Story 2 — Server Cleanup (Priority: P2)

**Goal**: Remove Express, ws, @anthropic-ai/sdk. Delete server code. Update bin entry point.

**Independent Test**: `grep express package.json` returns nothing; `node src/generate-dashboard.js . --watch` still works.

> **Write tests FIRST — ensure they FAIL before implementation**

### Tests for US2

- [x] T024 [P] [US2] Write Jest test in `test/server-cleanup.test.js` — verify `package.json` dependencies do NOT include `express`, `ws`, or `@anthropic-ai/sdk` (TS-008)
- [x] T025 [P] [US2] Write Jest test in `test/server-cleanup.test.js` — verify `src/server.js` does not exist; verify no files in `src/` contain `require('express')`, `require('ws')`, or REST route handlers `app.get(`, `app.post(` (TS-009)
- [x] T026 [P] [US2] Write Jest test in `test/server-cleanup.test.js` — verify pidfile management code (`dashboard.pid.json`) is absent from `src/`; verify port scanning logic is absent (TS-009)

### Implementation for US2

- [x] T027 [US2] Remove `express`, `ws`, `@anthropic-ai/sdk` from `package.json` dependencies; run `npm install` to update lockfile (SC-006, TS-008)
- [x] T028 [US2] Delete `src/server.js` entirely (TS-009)
- [x] T029 [US2] Remove WebSocket code from `src/public/index.html` — `connectWebSocket()`, `handleMessage()`, `scheduleReconnect()`, activity indicator, all `ws://` references (TS-009)
- [x] T030 [US2] Remove pidfile management and port scanning code from any remaining source files (TS-009)
- [x] T031 [US2] Update `bin/iikit-dashboard.js` — point to generator instead of server; `start` command runs `src/generate-dashboard.js` with `--watch` (TS-010)
- [x] T032 [US2] Update `package.json` scripts — `"start"` runs generator, remove any server-related scripts
- [x] T033 [US2] Run server-cleanup tests: `npm test` — all T024-T026 tests must pass (TS-008, TS-009)
- [x] T034 [US2] Run full test suite: `npm test` && `npm run test:visual` — all tests pass (SC-001, SC-002, TS-010)

**Checkpoint**: US2 complete. Express is gone. Package ships generator only.

---

## Phase 6: Polish & Validation

**Purpose**: End-to-end validation against all success criteria.

- [x] T035 [P] Measure generator performance: `time node src/generate-dashboard.js .` — record baseline (SC-004, expected <2s)
- [x] T036 [P] Measure generated file size: `wc -c .specify/dashboard.html` — must be under 2MB (SC-007)
- [x] T037 [P] Verify zero npm deps in single-run mode: examine bundled `dist/generate-dashboard.js` — no external requires except fs, path, chokidar (FR-006, TS-004)
- [x] T038 Final: Run full test suite `npm test` && `npm run test:visual` for last clean pass

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) — no dependencies
    ↓
Phase 2 (Foundational — compute module verification)
    ↓
Phase 3 (US1 — generator + watch mode)
    ↓
Phase 4 (US1 — bundle)
    ↓
Phase 5 (US2 — server cleanup; depends on generator being fully functional)
    ↓
Phase 6 (Polish)
```

### Parallel Opportunities

- T002, T003 — parallel in Phase 1 (different targets)
- T006, T007, T008, T009 — parallel in US1 tests (different test concerns, same file — write to separate `describe` blocks)
- T020 — sequential after T021-T022 (needs bundled output to test)
- T024, T025, T026 — parallel in US2 tests (different assertions)
- T027, T031 — parallel in US2 (package.json vs bin/)
- T035, T036, T037 — all parallel in Polish

### Critical Path

```
T001 → T004 → T006..T010 → T011..T016 → T017..T019 → T020..T023 → T024..T026 → T027..T034 → T035..T038
```

Longest chain: 38 tasks. US1 implementation (T011-T019) is the highest risk — touches generator logic and requires Playwright visual regression passing.

---

## Notes

- Test IDs in parentheses map tasks to `tests/test-specs.md` for traceability
- All `[P]` tasks operate on different files or independent test concerns
- TDD mandatory: write test → verify it fails → implement → verify it passes → next task
- Each phase checkpoint is a safe stopping point with a releasable increment
- Assertion integrity hash stored in `.specify/context.json` — do not modify `tests/test-specs.md` during implementation
- Previous tasks.md was from an older 4-story spec. This is a full regeneration for the current 2-story spec.
