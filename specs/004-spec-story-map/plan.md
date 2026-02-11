# Implementation Plan: Spec Story Map

**Branch**: `004-spec-story-map` | **Date**: 2026-02-11 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/004-spec-story-map/spec.md`

## Summary

Add a "Spec" tab to the pipeline that renders a story map (CSS Grid with priority swim lanes), an interactive requirements graph (SVG with force-directed layout), and a collapsible clarification trail sidebar. New server-side parsing extracts stories, requirements, success criteria, and clarifications from spec.md. Data pushed via existing WebSocket infrastructure.

## Technical Context

**Language/Version**: Node.js 20+ (LTS) — same as existing codebase
**Primary Dependencies**: Express, ws, chokidar — no new dependencies
**Storage**: N/A (reads directly from spec.md on disk)
**Testing**: Jest (unit + integration tests)
**Target Platform**: macOS, Linux, Windows (anywhere Node.js runs)
**Project Type**: Single — server + embedded client HTML
**Performance Goals**: Story map loads in <3s (SC-001), artifact changes reflected in <5s (SC-006)
**Constraints**: Zero new dependencies, no build step, extends existing codebase
**Scale/Scope**: 1-10 stories, 5-20 requirements, <30 graph nodes total

## Constitution Check

| Principle | Compliance | Notes |
|-----------|------------|-------|
| I. Test-First (NON-NEGOTIABLE) | COMPLIANT | Tests for storymap.js parser written before implementation. Frontend rendering tested via server API integration tests. |
| II. Real-Time Accuracy | COMPLIANT | Story map state derived from spec.md on disk on every file change. Pushed via existing WebSocket. No caching. |
| IV. Professional UI | COMPLIANT | Story map uses same design system (CSS custom properties, typography, transitions). Graph uses SVG with smooth interactions. |
| V. Simplicity | COMPLIANT | No new dependencies. SVG graph is ~150 lines of vanilla JS. Force layout is <50 lines. |

Validated against constitution v1.1.0

## Architecture Overview

```
+--------------------------------------------------------------+
|  Browser (single index.html)                                  |
|  +----------------------------------------------------------+|
|  |  Header (feature selector, integrity, theme)              ||
|  +----------------------------------------------------------+|
|  |  Pipeline Bar (Spec tab active, highlighted)              ||
|  +----------------------------------------------------------+|
|  |  Content Area — Spec Story Map View                       ||
|  |  +--------------------------------------------+  +-----+||
|  |  |  Story Map (CSS Grid)                      |  | Cla- |||
|  |  |  ┌─────────┐ ┌─────────┐                  |  | rifi-|||
|  |  |  │ P1 Lane │ │  US1    │ │  US2    │      |  | cat- |||
|  |  |  ├─────────┤ ├─────────┤                  |  | ion  |||
|  |  |  │ P2 Lane │ │  US3    │                  |  | Side-|||
|  |  |  ├─────────┤                              |  | bar  |||
|  |  |  │ P3 Lane │ │  US4    │                  |  |      |||
|  |  |  └─────────┘                              |  +-----+||
|  |  +--------------------------------------------+         ||
|  |  +--------------------------------------------+         ||
|  |  |  Requirements Graph (SVG)                  |         ||
|  |  |  (US)──>(FR-001)   (SC-001)               |         ||
|  |  |  (US)──>(FR-002)   (SC-002)               |         ||
|  |  +--------------------------------------------+         ||
|  +----------------------------------------------------------+|
+-------------------+------------------------------------------+
                    | ws://localhost:PORT
+-------------------+------------------------------------------+
|  Node.js Server                                               |
|  +------------+  +--------+  +------------+                   |
|  | Express    |  | ws     |  | chokidar   |                  |
|  | (HTTP)     |  | (push) |  | (watch)    |                  |
|  +------------+  +--------+  +-----+------+                  |
|                                     |                         |
|  NEW: storymap.js                   |                         |
|  +----------------------------------+                         |
|  |  Parses spec.md for:                                       |
|  |  - Stories (title, priority, scenarios, FR refs)           |
|  |  - Requirements (FR-xxx with text)                         |
|  |  - Success criteria (SC-xxx with text)                     |
|  |  - Clarifications (Q&A entries)                            |
|  |  - Edges (US→FR cross-references)                          |
|  +------------------------------------------------------------+
+-------------------+------------------------------------------+
                    | fs.readFileSync
+-------------------+------------------------------------------+
|  Project Directory                                            |
|  specs/NNN-feature/                                           |
|    spec.md           (stories, requirements, SC, clarifications)|
+--------------------------------------------------------------+
```

## File Structure

```
iikit-dashboard/
├── src/
│   ├── server.js          # MODIFY — add /api/storymap/:feature endpoint, push storymap_update
│   ├── storymap.js        # NEW — parse spec.md, compute story map state
│   ├── parser.js          # MODIFY — add parseRequirements, parseSuccessCriteria, parseClarifications, parseStoryRequirementRefs
│   ├── pipeline.js        # UNCHANGED
│   ├── board.js           # UNCHANGED
│   ├── integrity.js       # UNCHANGED
│   └── public/
│       └── index.html     # MODIFY — add story map view, requirements graph, clarification sidebar, switchTab integration
├── test/
│   ├── storymap.test.js   # NEW — unit tests for story map state computation
│   ├── parser.test.js     # MODIFY — add tests for new parser functions
│   ├── server.test.js     # MODIFY — add tests for /api/storymap/:feature endpoint
│   ├── pipeline.test.js   # UNCHANGED
│   ├── board.test.js      # UNCHANGED
│   ├── integrity.test.js  # UNCHANGED
│   └── websocket.test.js  # UNCHANGED
└── bin/
    └── iikit-kanban.js    # UNCHANGED
```

**Structure Decision**: Extends existing single-project structure. One new source file (`storymap.js`), modifications to three existing files (`server.js`, `parser.js`, `index.html`). One new test file (`storymap.test.js`).

## Key Design Decisions

### 1. New `storymap.js` module for spec parsing and state computation
All story map logic lives in `computeStoryMapState(projectPath, featureId)`. This reads spec.md, delegates parsing to parser.js functions, and assembles the response. Follows the existing pattern (board.js computes board state, pipeline.js computes pipeline state).

### 2. Parser functions added to existing parser.js
New functions: `parseRequirements(content)`, `parseSuccessCriteria(content)`, `parseClarifications(content)`, `parseStoryRequirementRefs(content)`. These follow the same regex-based pattern as existing `parseSpecStories()` and `parseTasks()`. All markdown parsing stays in one module.

### 3. Story map is CSS Grid in the DOM
Story cards are DOM elements in a CSS Grid with 3 rows (P1, P2, P3). Cards contain text, badges, and click handlers. This is more accessible and easier to style than SVG for text-heavy content.

### 4. Requirements graph is inline SVG
The graph uses SVG for nodes and edges. Force-directed layout runs synchronously on render (~100 iterations, <50ms for <30 nodes). Nodes are SVG groups (circle + text). Edges are SVG lines. Click highlighting via CSS classes. Drag via mousedown/mousemove/mouseup. Zoom/pan via SVG viewBox transform on wheel events.

### 5. Clarification sidebar is CSS-based
A fixed-position right panel that slides in with `transform: translateX(0)`. Main content area width adjusts with CSS transition. Toggle button always visible. No JS animation library.

### 6. WebSocket pushes storymap_update alongside board_update and pipeline_update
On spec.md changes, the server computes and pushes story map state. Reuses existing debounced file watcher. Client updates the story map view if the Spec tab is active.

## API Contract

### New HTTP Endpoint

| Method | Path | Response | Purpose |
|--------|------|----------|---------|
| GET | `/api/storymap/:feature` | JSON | Story map data for a feature |

**Response shape:**
```json
{
  "stories": [
    {
      "id": "US1",
      "title": "View User Story Map",
      "priority": "P1",
      "scenarioCount": 3,
      "requirementRefs": ["FR-001", "FR-002"],
      "clarificationCount": 1
    }
  ],
  "requirements": [
    { "id": "FR-001", "text": "System MUST render a story map..." }
  ],
  "successCriteria": [
    { "id": "SC-001", "text": "Developers can identify..." }
  ],
  "clarifications": [
    {
      "session": "2026-02-11",
      "question": "How should FR-to-SC cross-linking work?",
      "answer": "Only draw US→FR edges..."
    }
  ],
  "edges": [
    { "from": "US1", "to": "FR-001" },
    { "from": "US1", "to": "FR-002" }
  ]
}
```

### New WebSocket Message

**Server → Client:**
```json
{
  "type": "storymap_update",
  "feature": "004-spec-story-map",
  "storymap": { ... }
}
```

Sent alongside existing `board_update` and `pipeline_update` on every file change.

## Complexity Tracking

No constitution violations requiring justification. Zero new dependencies.
