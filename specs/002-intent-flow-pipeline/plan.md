# Implementation Plan: Intent Flow Pipeline

**Branch**: `002-intent-flow-pipeline` | **Date**: 2026-02-11 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/002-intent-flow-pipeline/spec.md`

## Summary

Add a persistent pipeline bar to the top of the dashboard showing all nine IIKit phases as clickable status nodes. The pipeline acts as tab-style navigation — clicking a node renders the corresponding detail view in a content area below. The existing kanban board becomes one of these detail views (the "Implement" tab). Phase status is computed server-side by examining project artifacts on disk. Live-updates via the existing WebSocket infrastructure.

## Technical Context

**Language/Version**: Node.js 20+ (LTS) — same as 001-kanban-board
**Primary Dependencies**: Express, ws, chokidar — same as 001-kanban-board (no new dependencies)
**Storage**: N/A (reads directly from project artifacts on disk)
**Testing**: Jest (unit + integration tests)
**Target Platform**: macOS, Linux, Windows (anywhere Node.js runs)
**Project Type**: Single — server + embedded client HTML
**Performance Goals**: Pipeline loads in <3s (SC-001), artifact changes reflected in <5s (SC-003)
**Constraints**: Zero new dependencies, no build step, extends existing 001 codebase
**Scale/Scope**: 9 pipeline nodes, 1-5 features per project

## Constitution Check

| Principle | Compliance | Notes |
|-----------|------------|-------|
| I. Test-First (NON-NEGOTIABLE) | COMPLIANT | Tests written before implementation per constitution. Pipeline detection logic tested in isolation. |
| II. Real-Time Accuracy | COMPLIANT | Pipeline state derived from artifacts on disk on every file change. Pushed via existing WebSocket. No caching. |
| III. Professional UI | COMPLIANT | Pipeline bar uses same design system (CSS custom properties, transitions, typography) as kanban board. |
| IV. Simplicity | COMPLIANT | No new dependencies. Pipeline detection is pure file existence checks. Tab shell is vanilla JS DOM manipulation. |

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│  Browser (single index.html)                             │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  Header (feature selector, integrity, theme)        │ │
│  ├─────────────────────────────────────────────────────┤ │
│  │  Pipeline Bar (9 phase nodes, always visible)       │ │
│  │  [Const]──[Spec]──[Clarify]──[Plan]──[Check]──...  │ │
│  ├─────────────────────────────────────────────────────┤ │
│  │  Content Area (renders active tab's view)           │ │
│  │  ┌─────────────────────────────────────────────┐   │ │
│  │  │  Kanban Board / Placeholder / Future views  │   │ │
│  │  └─────────────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────┘ │
└───────────────┬─────────────────────────────────────────┘
                │ ws://localhost:PORT
┌───────────────┴─────────────────────────────────────────┐
│  Node.js Server                                          │
│  ┌──────────┐  ┌──────────┐  ┌────────────────┐        │
│  │ Express  │  │ ws       │  │ chokidar       │        │
│  │ (HTTP)   │  │ (push)   │  │ (file watch)   │        │
│  └──────────┘  └──────────┘  └───────┬────────┘        │
│                                       │                  │
│  NEW: pipeline.js                     │                  │
│  ┌────────────────────────────────────┘                  │
│  │  On file change:                                      │
│  │  1. Re-parse spec.md + tasks.md (existing)            │
│  │  2. Compute board state (existing)                    │
│  │  3. Compute pipeline state (NEW)                      │
│  │  4. Push board + pipeline JSON to WebSocket clients   │
│  └──────────────────────────────────────────────────────│
└───────────────┬─────────────────────────────────────────┘
                │ fs.watch
┌───────────────┴─────────────────────────────────────────┐
│  Project Directory                                       │
│  CONSTITUTION.md              (Constitution phase)       │
│  specs/NNN-feature/                                      │
│    spec.md                    (Spec + Clarify phases)    │
│    plan.md                    (Plan phase)               │
│    checklists/*.md            (Checklist phase)          │
│    tests/test-specs.md        (Testify phase)            │
│    tasks.md                   (Tasks + Implement phases) │
│  .specify/context.json        (Analyze phase marker)     │
└─────────────────────────────────────────────────────────┘
```

## File Structure

```
iikit-dashboard/
├── src/
│   ├── server.js          # MODIFY — add /api/pipeline/:feature endpoint, push pipeline_update
│   ├── parser.js           # MODIFY — add parseChecklists, parseConstitution helpers
│   ├── pipeline.js         # NEW — compute pipeline phase states from artifacts
│   ├── board.js            # UNCHANGED
│   ├── integrity.js        # UNCHANGED
│   └── public/
│       └── index.html      # MODIFY — add pipeline bar, content area, tab switching logic
├── test/
│   ├── pipeline.test.js    # NEW — unit tests for pipeline state computation
│   ├── parser.test.js      # MODIFY — add tests for new parser functions
│   ├── board.test.js       # UNCHANGED
│   ├── integrity.test.js   # UNCHANGED
│   └── server.test.js      # MODIFY — add tests for new API endpoint + WebSocket message
└── bin/
    └── iikit-kanban.js     # UNCHANGED (rename to iikit-dashboard.js is a separate task)
```

**Structure Decision**: Extends existing single-project structure. One new source file (`pipeline.js`), modifications to three existing files (`server.js`, `parser.js`, `index.html`). One new test file (`pipeline.test.js`).

## Key Design Decisions

### 1. New `pipeline.js` module for phase detection

All pipeline status logic lives in a single new module: `computePipelineState(projectPath, featureId)`. This function examines artifacts on disk and returns an array of 9 phase objects with status, progress, and metadata. Keeps the logic testable in isolation and follows the existing pattern (board.js, integrity.js).

### 2. Pipeline state pushed alongside board state

The existing file watcher already triggers on `specs/` and `.specify/` changes. On each change, the server now computes BOTH board state and pipeline state, and pushes both in the WebSocket message. This reuses the existing 300ms debounce and chokidar infrastructure — no new watcher needed.

### 3. Tab shell is client-side only

The server has no concept of "active tab" — it just sends pipeline + board data. The client handles tab selection, content area rendering, and highlighting the active node. This keeps the server stateless (per 001 design decision).

### 4. Kanban board becomes the "Implement" tab content

The existing board rendering logic in index.html becomes a function `renderBoardView()` that's called when the Implement tab is active. Other tabs render placeholder content until their features (003-008) are built. The pipeline bar is always visible regardless of active tab.

### 5. File-based phase detection (no context.json dependency for most phases)

Most phases are detected by file existence, not context.json. This is more resilient — if context.json is missing or stale, the pipeline still works. Specific detection per phase:

- **Constitution**: `fs.existsSync(path.join(projectPath, 'CONSTITUTION.md'))`
- **Spec**: `fs.existsSync(path.join(featureDir, 'spec.md'))`
- **Clarify**: spec.md content contains `## Clarifications`; skipped if plan.md exists without it
- **Plan**: `fs.existsSync(path.join(featureDir, 'plan.md'))`
- **Checklist**: parse `checklists/*.md` for `- [x]` / `- [ ]` counts
- **Testify**: `fs.existsSync(path.join(featureDir, 'tests', 'test-specs.md'))`; skipped detection requires parsing CONSTITUTION.md for TDD requirement
- **Tasks**: `fs.existsSync(path.join(featureDir, 'tasks.md'))`
- **Analyze**: available if tasks.md exists
- **Implement**: parse tasks.md checkbox completion

### 6. Also watch CONSTITUTION.md

The existing chokidar watcher monitors `specs/` and `.specify/`. We add `CONSTITUTION.md` to the watch list so the Constitution node updates live when the file is created or modified.

## API Contract

### New HTTP Endpoint

| Method | Path | Response | Purpose |
|--------|------|----------|---------|
| GET | `/api/pipeline/:feature` | JSON | Pipeline phase states for a feature |

**Response shape:**
```json
{
  "phases": [
    {
      "id": "constitution",
      "name": "Constitution",
      "status": "complete",
      "progress": null,
      "optional": false
    },
    {
      "id": "spec",
      "name": "Spec",
      "status": "complete",
      "progress": null,
      "optional": false
    },
    {
      "id": "checklist",
      "name": "Checklist",
      "status": "in_progress",
      "progress": "75%",
      "optional": false
    },
    {
      "id": "implement",
      "name": "Implement",
      "status": "in_progress",
      "progress": "40%",
      "optional": false
    }
  ]
}
```

Status values: `"not_started"`, `"in_progress"`, `"complete"`, `"skipped"`, `"available"`

### New WebSocket Message

**Server → Client:**
```json
{
  "type": "pipeline_update",
  "feature": "002-intent-flow-pipeline",
  "pipeline": { "phases": [...] }
}
```

Sent alongside existing `board_update` on every file change.

### Modified WebSocket Messages

The existing `board_update` message is unchanged. A new `pipeline_update` message is sent in parallel.

## Quickstart Test Scenarios

1. **Pipeline loads on open**: Start dashboard → pipeline bar shows at top with 9 phase nodes colored by status
2. **Tab switching**: Click "Implement" node → kanban board renders below → click "Plan" → placeholder renders → pipeline stays visible
3. **Live status update**: Create plan.md in feature dir → Plan node transitions from "not started" to "complete" within 5s
4. **Checklist progress**: Create a checklist with 4 items, check 2 → Checklist node shows "in progress" with 50%
5. **Feature switch**: Switch feature in selector → all 9 pipeline nodes update to new feature's state
6. **Skipped phase**: Feature has plan.md but no clarifications in spec.md → Clarify node shows "skipped" style
7. **Optional phase**: Constitution doesn't require TDD, plan.md exists, no test-specs.md → Testify shows "skipped"

Validated against constitution v1.1.0
