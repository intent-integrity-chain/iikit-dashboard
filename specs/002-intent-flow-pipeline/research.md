# Research: Intent Flow Pipeline

## Decisions

### 1. No new dependencies needed
**Decision**: Reuse Express, ws, chokidar from 001-kanban-board.
**Rationale**: The pipeline is a UI feature (new HTML/CSS/JS) plus a server-side computation (new pipeline.js). All infrastructure (HTTP server, WebSocket push, file watching, debounce) already exists.
**Alternatives considered**: Adding a client-side router (rejected — YAGNI, tab switching is simple DOM manipulation).

### 2. Pipeline detection is synchronous file I/O
**Decision**: Use `fs.existsSync` and `fs.readFileSync` for phase detection.
**Rationale**: The existing codebase (parser.js, server.js) uses synchronous I/O throughout. Pipeline detection runs in the same debounced file-change handler. Consistency > async optimization for a local tool reading small files.
**Alternatives considered**: Async detection with `fs.promises` (rejected — would require refactoring the entire server for marginal benefit on local file reads).

### 3. Checklist parsing reuses existing parser pattern
**Decision**: Add `parseChecklists(checklistDir)` to parser.js following the same pattern as `parseSpecStories` and `parseTasks`.
**Rationale**: Consistent module boundaries. All markdown parsing lives in parser.js.
**Alternatives considered**: Putting checklist parsing in pipeline.js (rejected — parser.js is the single source of truth for markdown parsing).

### 4. Clarify "skipped" detection uses heuristic
**Decision**: Clarify is "skipped" if plan.md exists but spec.md has no `## Clarifications` section. This is a heuristic — the user may have intentionally skipped clarification.
**Rationale**: The only other option is a context.json flag, but context.json may not exist. File-based detection is more resilient.
**Alternatives considered**: Always showing "not started" if no clarifications (rejected — misleading when the user deliberately skipped it).

### 5. Testify "skipped" detection parses CONSTITUTION.md
**Decision**: Parse CONSTITUTION.md for TDD-related keywords ("TDD", "test-first", "MUST be used"). If found, Testify is mandatory. If not found and plan.md exists without test-specs.md, Testify is "skipped".
**Rationale**: The constitution is the source of truth for whether TDD is required. Simple keyword search is sufficient.

## Tessl Tiles

No new tiles needed — the tech stack is unchanged from 001-kanban-board. Existing tiles (if any) from 001 remain installed.
