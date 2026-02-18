# Implementation Plan: Testify Traceability — Sankey Diagram + Test Pyramid

**Branch**: `007-testify-traceability` | **Date**: 2026-02-17 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/007-testify-traceability/spec.md`

## Summary

Add a Testify phase detail view to the pipeline dashboard showing a traceability Sankey diagram with an integrated test pyramid. The Sankey has three columns: requirements (FR-xxx, SC-xxx from spec.md) on the left, test specifications (TS-xxx from tests/test-specs.md) grouped by type in a pyramidal arrangement in the middle, and implementation tasks (T-xxx from tasks.md) on the right. Flow bands connect linked items, color-coded by test type (acceptance, contract, validation). Gap nodes (untested requirements, unimplemented tests) are highlighted in red. An integrity seal shows assertion hash verification status. Hover highlights the full traceability chain. The view renders as Phase 5 (Testify) tab content within the existing pipeline navigation from 002.

## Technical Context

**Language/Version**: Node.js 20+ (LTS) — same as 001-006
**Primary Dependencies**: Express, ws, chokidar — same as 001-006 (no new dependencies)
**Storage**: N/A (reads directly from spec.md, tests/test-specs.md, tasks.md, and context.json on disk)
**Testing**: Jest (unit tests for new parser functions and testify state computation)
**Target Platform**: macOS, Linux, Windows (anywhere Node.js runs)
**Project Type**: Single — server + embedded client HTML
**Performance Goals**: Testify view loads in <2s, artifact changes reflected in <5s (SC-006)
**Constraints**: Zero new dependencies, no build step, extends existing codebase. SVG for Sankey diagram (no D3, no charting library). Readably renders 5-20 requirements, 10-30 test specs, 20-50 tasks (SC-003)
**Scale/Scope**: Typical features have 5-20 requirements, 10-30 test specs, 20-50 tasks

## Constitution Check

| Principle | Compliance | Notes |
|-----------|------------|-------|
| I. Test-First (NON-NEGOTIABLE) | COMPLIANT | Tests written before implementation per constitution. Parser functions and testify state computation tested in isolation. |
| II. Real-Time Accuracy | COMPLIANT | Testify data derived from files on disk on every change. Pushed via existing WebSocket. No caching. |
| IV. Professional UI | COMPLIANT | SVG Sankey diagram with smooth hover transitions, color-coded flow bands, integrated pyramid layout, integrity seal indicator. Same design system as kanban board and pipeline. |
| V. Simplicity | COMPLIANT | No new dependencies. Sankey is custom SVG with rect nodes and path bands. Pyramid is node grouping in the middle column. Integrity uses existing computeAssertionHash/checkIntegrity from integrity.js. |

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│  Browser (index.html)                                         │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Pipeline Bar (always visible — from 002)                │ │
│  │  [...][Testify]──active──[...]                           │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │  Testify Content Area (NEW)                              │ │
│  │  ┌────────────────────────────────────────────────────┐  │ │
│  │  │  Integrity Seal: ● VERIFIED / TAMPERED / MISSING   │  │ │
│  │  ├────────────────────────────────────────────────────┤  │ │
│  │  │  Sankey Diagram (SVG)                              │  │ │
│  │  │                                                    │  │ │
│  │  │  Requirements    Test Specs (Pyramid)    Tasks     │  │ │
│  │  │  ┌────────┐     ┌─Acceptance─┐        ┌───────┐  │  │ │
│  │  │  │ FR-001 │─────│   TS-001   │────────│ T-005 │  │  │ │
│  │  │  │ FR-002 │──┐  │   TS-002   │──┐     │ T-006 │  │  │ │
│  │  │  │ SC-001 │  │  ├─Contract───┤  │     │ T-011 │  │  │ │
│  │  │  │ FR-003 │  └──│   TS-003   │  └─────│ T-012 │  │  │ │
│  │  │  │ FR-004 │RED  │   TS-004   │        │ T-013 │  │  │ │
│  │  │  └────────┘     ├─Validation─┤        └───────┘  │  │ │
│  │  │                 │   TS-005   │RED                 │  │ │
│  │  │                 │   TS-006   │                    │  │ │
│  │  │                 │   TS-007   │                    │  │ │
│  │  │                 └────────────┘                    │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────┘ │
└───────────────┬──────────────────────────────────────────────┘
                │ ws://localhost:PORT
┌───────────────┴──────────────────────────────────────────────┐
│  Node.js Server                                               │
│  ┌──────────┐  ┌──────────┐  ┌────────────────┐             │
│  │ Express  │  │ ws       │  │ chokidar       │             │
│  │ (HTTP)   │  │ (push)   │  │ (file watch)   │             │
│  └──────────┘  └──────────┘  └───────┬────────┘             │
│                                       │                       │
│  NEW: testify.js                     │                       │
│  ┌────────────────────────────────────┘                       │
│  │  On file change in specs/NNN/:                            │
│  │  1. parseTestSpecs(testSpecsContent) — NEW                │
│  │  2. parseTaskTestRefs(tasks) — NEW                        │
│  │  3. computeTestifyState() — NEW                           │
│  │  4. Push testify_update to WebSocket clients               │
│  └───────────────────────────────────────────────────────────│
└───────────────┬──────────────────────────────────────────────┘
                │ fs.readFileSync
┌───────────────┴──────────────────────────────────────────────┐
│  Project Directory                                            │
│  specs/NNN-feature/                                           │
│    spec.md              ← FR-xxx, SC-xxx (left column)        │
│    tests/test-specs.md  ← TS-xxx with type + traceability     │
│    tasks.md             ← T-xxx with "must pass TS-xxx"       │
│  context.json           ← assertion hash for integrity seal (per feature)   │
└──────────────────────────────────────────────────────────────┘
```

## File Structure

```
iikit-dashboard/
├── src/
│   ├── server.js          # MODIFY — add /api/testify/:feature endpoint, push testify_update
│   ├── parser.js          # MODIFY — add parseTestSpecs(), parseTaskTestRefs()
│   ├── testify.js         # NEW — compute testify view state (Sankey + pyramid + integrity)
│   ├── integrity.js       # UNCHANGED (already has computeAssertionHash, checkIntegrity)
│   ├── pipeline.js        # UNCHANGED (already computes testify phase status)
│   ├── board.js           # UNCHANGED
│   ├── checklist.js       # UNCHANGED
│   ├── storymap.js        # UNCHANGED
│   ├── planview.js        # UNCHANGED
│   └── public/
│       └── index.html     # MODIFY — add renderTestifyContent(), SVG Sankey, hover interactions
├── test/
│   ├── testify.test.js    # NEW — unit tests for testify view state
│   ├── parser.test.js     # MODIFY — add tests for parseTestSpecs, parseTaskTestRefs
│   ├── server.test.js     # MODIFY — add tests for /api/testify/:feature + testify_update
│   ├── pipeline.test.js   # UNCHANGED
│   ├── board.test.js      # UNCHANGED
│   ├── checklist.test.js  # UNCHANGED
│   └── integrity.test.js  # UNCHANGED
└── bin/
    └── iikit-dashboard.js # UNCHANGED
```

**Structure Decision**: Extends existing single-project structure. One new source file (`testify.js`), modifications to three existing files (`server.js`, `parser.js`, `index.html`). One new test file (`testify.test.js`).

## Key Design Decisions

### 1. New `parseTestSpecs()` in parser.js

A new `parseTestSpecs(content)` function parses tests/test-specs.md to extract test specification entries. Each TS-xxx entry is parsed for: ID, title, type (acceptance/contract/validation), priority, and traceability links (FR-xxx, SC-xxx references). The regex pattern matches `### TS-XXX:` headings, then extracts `**Type**: value` and `**Traceability**: refs` from the body. Returns an array of `{id, title, type, priority, traceability: string[]}` objects.

### 2. New `parseTaskTestRefs()` in parser.js

A new `parseTaskTestRefs(tasks)` function takes the already-parsed tasks array (from `parseTasks()`) and extracts "must pass TS-xxx" references from each task's description. Returns a map of `{taskId: testSpecIds[]}`. The regex pattern `must pass ((?:TS-\d+(?:,\s*)?)+)` captures the test spec IDs. Tasks without "must pass" references are included with an empty array.

### 3. Custom SVG Sankey diagram — no D3 or charting library

The Sankey diagram is built with raw SVG elements: `<rect>` for nodes, `<path>` with cubic Bezier curves for flow bands, `<text>` for labels. The layout algorithm:
- **Left column**: Requirements stacked vertically at x=0, evenly spaced
- **Middle column**: Test specs stacked vertically at x=center, grouped by type into three clusters (acceptance top, contract middle, validation bottom) with group labels
- **Right column**: Tasks stacked vertically at x=right, evenly spaced
- **Flow bands**: SVG `<path>` elements using cubic Bezier curves (`M x1,y1 C cx1,cy1 cx2,cy2 x2,y2`) connecting linked node centers. Band width proportional to connection count. Color determined by test type.

This avoids adding D3 (~500KB) for a single diagram. The Sankey layout is simpler than general-purpose layouts because columns are fixed and nodes don't need force-directed positioning.

### 4. Integrated pyramid via grouped nodes in middle column

The middle column (test specs) is arranged as a pyramid by grouping nodes by type. Acceptance tests appear at the top with the narrowest cluster, contract tests in the middle, and validation tests at the bottom with the widest cluster. Each cluster has a type label with count (e.g., "Acceptance: 3"). The cluster width is proportional to the number of nodes, creating the pyramid silhouette. Group boundaries use subtle background rectangles with rounded corners.

### 5. Gap detection as pure function

Gaps are computed by traversing the edge graph:
- **Untested requirements**: Requirement nodes (FR-xxx, SC-xxx) with no outgoing edges to test specs
- **Unimplemented tests**: Test spec nodes (TS-xxx) with no outgoing edges to tasks

Gap nodes receive a `gap: true` flag and are rendered with a red border/highlight. The gap computation is a pure function taking nodes and edges as input, making it trivially testable.

### 6. Integrity seal reuses existing integrity.js

The integrity seal reads the stored hash from `FEATURE_DIR/context.json` (path: `testify.assertion_hash`) and computes the current hash from the feature's test-specs.md using the existing `computeAssertionHash()` function. The existing `checkIntegrity()` function returns `{status: 'valid'|'tampered'|'missing'}`. The seal renders as a colored dot + text label, matching the gate indicator pattern from 006.

### 7. Hover chain highlighting via CSS opacity transitions

Hovering a node or flow band highlights the full traceability chain. Implementation:
- Each SVG element has `data-chain-id` attributes listing all connected node IDs
- On `mouseenter`, JavaScript adds a `.dimmed` class to all elements NOT in the chain and a `.highlighted` class to those in the chain
- On `mouseleave`, classes are removed, returning all elements to default opacity
- CSS `transition: opacity 0.2s` provides smooth dim/highlight effect
- Chain computation: for a given node, traverse edges in both directions to find all connected nodes

### 8. Testify update pushed via existing file watcher

The existing chokidar watcher fires on any file change under `specs/`. When test-specs.md, spec.md, tasks.md, or context.json changes, the server recomputes testify view state and pushes a `testify_update` message alongside existing messages. No new watcher needed.

### 9. Screen reader accessibility

The SVG Sankey has `role="img"` with `aria-label` describing the diagram purpose. Each node has a `<title>` element with its ID and description. Gap nodes include "(untested)" or "(unimplemented)" in their title. The integrity seal has `role="status"` with `aria-live="polite"`. Pyramid cluster counts are announced as part of the diagram description.

### 10. Flow band coloring by test type

Three distinct colors for flow bands, mapped to test type:
- Acceptance flows: accent color (blue-ish, matches pipeline active node color)
- Contract flows: secondary color (green-ish)
- Validation flows: tertiary color (purple-ish)

Colors use CSS custom properties for theme consistency with dark/light modes. Gap edges (or absence of edges) use the existing `--color-danger` red.

## API Contract

### New HTTP Endpoint

| Method | Path | Response | Purpose |
|--------|------|----------|---------|
| GET | `/api/testify/:feature` | JSON | Testify traceability state for a feature |

**Response shape:**
```json
{
  "requirements": [
    { "id": "FR-001", "text": "System MUST display a traceability Sankey diagram..." },
    { "id": "SC-001", "text": "Developers can identify untested requirements..." }
  ],
  "testSpecs": [
    {
      "id": "TS-001",
      "title": "Tech stack badges render from plan.md Technical Context",
      "type": "acceptance",
      "priority": "P1",
      "traceability": ["FR-001", "FR-002", "SC-001"]
    }
  ],
  "tasks": [
    {
      "id": "T005",
      "description": "Implement spec.md parser...",
      "testSpecRefs": ["TS-014"]
    }
  ],
  "edges": [
    { "from": "FR-001", "to": "TS-001", "type": "requirement-to-test" },
    { "from": "TS-001", "to": "T005", "type": "test-to-task" }
  ],
  "gaps": {
    "untestedRequirements": ["FR-004"],
    "unimplementedTests": ["TS-005"]
  },
  "pyramid": {
    "acceptance": { "count": 3, "ids": ["TS-001", "TS-002", "TS-003"] },
    "contract": { "count": 5, "ids": ["TS-004", "TS-005", "TS-006", "TS-007", "TS-008"] },
    "validation": { "count": 8, "ids": ["TS-009", "TS-010", "TS-011", "TS-012", "TS-013", "TS-014", "TS-015", "TS-016"] }
  },
  "integrity": {
    "status": "valid",
    "currentHash": "d91dc4a...",
    "storedHash": "d91dc4a..."
  },
  "exists": true
}
```

**When test-specs.md does not exist:**
```json
{
  "requirements": [],
  "testSpecs": [],
  "tasks": [],
  "edges": [],
  "gaps": { "untestedRequirements": [], "unimplementedTests": [] },
  "pyramid": { "acceptance": { "count": 0, "ids": [] }, "contract": { "count": 0, "ids": [] }, "validation": { "count": 0, "ids": [] } },
  "integrity": { "status": "missing", "currentHash": null, "storedHash": null },
  "exists": false
}
```

### New WebSocket Message

**Server → Client:**
```json
{
  "type": "testify_update",
  "feature": "007-testify-traceability",
  "testify": { "requirements": [...], "testSpecs": [...], "tasks": [...], "edges": [...], "gaps": {...}, "pyramid": {...}, "integrity": {...}, "exists": true }
}
```

Sent alongside existing `pipeline_update` and `board_update` on every file change.

### Existing Messages — No Changes

`board_update`, `pipeline_update`, `storymap_update`, `planview_update`, `checklist_update`, `constitution_update`, `features_update` are all unchanged.

## Quickstart Test Scenarios

1. **Sankey renders on tab click**: Start dashboard → click "Testify" pipeline node → Sankey diagram appears with three columns. Requirements on the left, test specs grouped by type in the middle, tasks on the right.
2. **Flow bands connect linked items**: Feature with complete traceability → colored bands connect requirements to test specs and test specs to tasks. Band colors correspond to test type (acceptance, contract, validation).
3. **Gap highlighting**: Feature with FR-004 having no test coverage → FR-004 node appears with red highlight. TS-005 with no task → TS-005 right edge highlighted red.
4. **Integrated pyramid grouping**: Test-specs.md with 3 acceptance, 5 contract, 8 validation → middle column groups nodes into three clusters with labels "Acceptance: 3", "Contract: 5", "Validation: 8". Bottom cluster wider than top.
5. **Integrity seal — verified**: context.json hash matches test-specs.md → green "Verified" seal displayed.
6. **Integrity seal — tampered**: Modify test-specs.md without updating hash → red "Tampered" seal displayed.
7. **Hover chain highlighting**: Hover over TS-003 → connected FR-xxx and T-xxx nodes plus flow bands highlight, all other elements dim. Move cursor away → all elements return to normal.
8. **Empty state**: Feature with no tests/test-specs.md → "No test specifications generated" message with suggestion to run /iikit-05-testify.
9. **Live update**: Open Testify tab → externally add a new TS-xxx entry to test-specs.md → new node and flow band appear within 5 seconds.
10. **Node labels readable**: Each node shows its ID (FR-001, TS-003, T-012) and a truncated description label without needing hover.

Validated against constitution v1.1.0
