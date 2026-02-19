# Research: Bugs Tab

## Decision Log

### R-001: Parser Strategy — Extend vs. Separate

**Question**: Should bug fix tasks be parsed by extending the existing `parseTasks` regex or by a separate `parseBugTasks` function?

**Decision**: Extend the existing `parseTasks` regex.

**Rationale**: Bug fix tasks follow the same checkbox-list format as regular tasks, differing only in ID prefix (`T-B` vs `T`) and tag format (`[BUG-NNN]` vs `[US\d+]`). A single regex handles both, keeping parser surface area minimal. The task object gains `isBugFix` (boolean) and `bugTag` (string|null) fields. Existing consumers that filter by `storyTag` are unaffected — bug tasks have `storyTag: null` and `bugTag: "BUG-001"` instead.

**Alternatives Considered**:
- Separate `parseBugTasks` function: Would duplicate regex logic for the same markdown format. Rejected per Constitution §IV (simplicity).
- Parse in `bugs.js` only: Would prevent the Implement board from seeing T-B tasks. Rejected because FR-006 requires bug icons on the board.

### R-002: Board Grouping for Bug Fix Tasks

**Question**: How should bug fix tasks appear on the Implement board?

**Decision**: Group bug fix tasks into per-bug cards titled by their BUG-NNN ID.

**Rationale**: Bug fix tasks are tagged with `[BUG-NNN]` (not `[US\d+]`), so they'd fall into the generic "Unassigned" card. Grouping by bug ID creates natural cards (one per bug) that show fix progress, matching how story cards work. The card gets a bug icon to satisfy FR-006.

**Alternatives Considered**:
- Single "Bug Fixes" card for all bugs: Loses per-bug progress visibility. Rejected.
- Mix into "Unassigned" card: No visual differentiation. Violates FR-006. Rejected.
- Separate bugs from board entirely: Spec explicitly requires T-B tasks visible on Implement board (US3). Rejected.

### R-003: Bugs Tab Pipeline Placement

**Question**: Should the Bugs tab be a pipeline phase or a standalone element?

**Decision**: Standalone element rendered after the pipeline chain, no connector line.

**Rationale**: Bugs are not a workflow phase — they can be reported at any time during development. The spec explicitly requires "no connector line" and "visually separated." The tab is appended to the pipeline bar DOM after the phase nodes but uses distinct styling.

**Alternatives Considered**:
- Add as a pipeline phase: Would add it to `pipeline.js` phases array, implying workflow order. Rejected — bugs are orthogonal to the workflow.

### R-004: Severity Color Mapping

**Question**: The spec defines bug severity colors (red/orange/yellow/gray) that partially overlap with existing priority colors (P1=red, P2=orange, P3=blue). How to handle?

**Decision**: Use dedicated CSS classes for bug severity (`.severity-critical`, `.severity-high`, `.severity-medium`, `.severity-low`) with explicit color values matching the spec: red, orange, yellow, gray.

**Rationale**: Bug severity and story priority are different concepts. Reusing priority variables would create confusion (P3=blue vs medium=yellow). Dedicated classes are clear and self-documenting.

### R-005: Bug Status Values

**Question**: What status values should the system recognize?

**Decision**: Two statuses: `reported` and `fixed`, matching the `/iikit-bugfix` skill output.

**Rationale**: The bugfix skill (v1.8.1) sets initial status to `reported`. The `fixed` status is the terminal state. No intermediate states are defined by the skill. Per Constitution §IV, we support exactly what the data source produces.

### R-006: Empty and Edge Case Handling

**Question**: How to handle missing/empty/malformed `bugs.md`?

**Decision**: Permissive parsing with graceful degradation:
- No `bugs.md`: `exists: false`, empty state in UI
- Empty `bugs.md`: `exists: true`, empty bugs array, empty state in UI
- Malformed entries: Skip unparseable entries, render valid ones
- Orphaned T-B tasks (tasks referencing non-existent BUG-NNN): Show on board, flag as orphaned in Bugs tab

**Rationale**: Matches the permissive parsing pattern used throughout `src/parser.js` (all parsers return `[]` on invalid input). Dashboard should never crash on bad data.

## Tessl Tiles

### Installed Tiles

| Technology | Tile | Type | Version | Eval |
|------------|------|------|---------|------|
| Express | tessl/npm-express | docs | 5.1.0 | N/A |
| WebSocket (ws) | tessl/npm-ws | docs | 8.18.0 | N/A |
| Jest | tessl/npm-jest | docs | 30.1.0 | N/A |
| IIKit | tessl-labs/intent-integrity-kit | skills | 1.8.1 | N/A |

### Technologies Without Tiles

- chokidar: No tile found (file watching library, well-established, no tile needed)
- Playwright: No tile found (used for visual tests only)

### Best Practices Applied

From Express tile docs: REST endpoint follows existing `app.get('/api/bugs/:feature', ...)` pattern with try/catch error handling and 404 for missing features.

From ws tile docs: WebSocket broadcast uses `wss.clients.forEach()` with `readyState === 1` check, matching existing broadcast pattern in `server.js`.
