# Implementation Plan: Plan Architecture Viewer

**Branch**: `005-plan-architecture-viewer` | **Date**: 2026-02-11 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/005-plan-architecture-viewer/spec.md`

## Summary

A Plan phase visualization for the IIKit dashboard that renders plan.md content as three interactive views in a single scrollable layout: a Tech Stack badge wall, an interactive file structure tree, and an architecture diagram parsed from ASCII art. Also shows installed Tessl tiles from tessl.json. Built with the same Node.js + Express + ws + vanilla HTML/CSS/JS stack as the existing dashboard, with `@anthropic-ai/sdk` added for LLM-based diagram node classification.

## Technical Context

**Language/Version**: Node.js 20+ (LTS)
**Primary Dependencies**: Express, ws, chokidar (existing); @anthropic-ai/sdk (new — for node type classification)
**Storage**: N/A (reads directly from project artifacts on disk — plan.md, research.md, tessl.json)
**Testing**: Jest (unit + integration tests)
**Target Platform**: macOS, Linux, Windows (anywhere Node.js runs)
**Project Type**: Single — server + embedded client HTML
**Performance Goals**: Plan view loads in <3s, file changes reflected in <5s (SC-001,SC-005)
**Constraints**: Zero build step for client, single `node` command to launch, LLM classification gracefully degrades without API key
**Scale/Scope**: Up to 15 tech stack entries, 30 files in structure, 10 diagram nodes per plan (FR-020)

## Constitution Check

| Principle | Compliance | Notes |
|-----------|------------|-------|
| I. Test-First (NON-NEGOTIABLE) | COMPLIANT | Jest tests written before implementation for all parsers and compute module. Test specs via /iikit-05-testify. |
| II. Real-Time Accuracy | COMPLIANT | File watcher (chokidar) triggers re-parse of plan.md + WebSocket push on every change. tessl.json also watched. No caching of stale data. |
| III. Professional Kanban UI | COMPLIANT | Badge wall, interactive tree, and SVG diagram follow existing design system: CSS custom properties, transitions, dark/light theme support. Visual quality on par with existing story map and radar views. |
| IV. Simplicity | COMPLIANT | Reuses existing architecture patterns (compute module + API endpoint + WebSocket message + render function). One new dependency (@anthropic-ai/sdk) justified for LLM classification, with graceful fallback. No build step. |

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│  Browser                                                     │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Plan Phase View (single scrollable layout)             │ │
│  │  ┌─────────────────────────────────────────────────┐    │ │
│  │  │  Tech Stack Badge Wall                          │    │ │
│  │  │  [badge] [badge] [badge] [badge]                │    │ │
│  │  ├─────────────────────────────────────────────────┤    │ │
│  │  │  Tessl Tiles Panel                              │    │ │
│  │  │  [tile card] [tile card] [tile card]            │    │ │
│  │  ├─────────────────────────────────────────────────┤    │ │
│  │  │  Project Structure Tree                         │    │ │
│  │  │  📁 src/  ▸ server.js  ▸ parser.js             │    │ │
│  │  ├─────────────────────────────────────────────────┤    │ │
│  │  │  Architecture Diagram (SVG)                     │    │ │
│  │  │  [node] ──→ [node] ──→ [node]                  │    │ │
│  │  └─────────────────────────────────────────────────┘    │ │
│  │  WebSocket connection (auto-reconnect)                  │ │
│  └─────────────────────────────────────────────────────────┘ │
└───────────────────┬─────────────────────────────────────────┘
                    │ ws://localhost:PORT
┌───────────────────┴─────────────────────────────────────────┐
│  Node.js Server                                              │
│  ┌────────────┐  ┌────────────┐  ┌──────────────────────┐   │
│  │ Express    │  │ ws         │  │ chokidar             │   │
│  │ (HTTP)     │  │ (push)     │  │ (file watch)         │   │
│  └────────────┘  └────────────┘  └──────────┬───────────┘   │
│                                              │               │
│  ┌───────────┐  ┌────────────────────────────┘               │
│  │ Anthropic │  │  On plan.md change:                        │
│  │ SDK       │  │  1. Re-parse plan.md sections              │
│  │ (classify)│  │  2. Classify node types (LLM)              │
│  └───────────┘  │  3. Check file existence                   │
│                 │  4. Read tessl.json                         │
│                 │  5. Push JSON to WebSocket clients          │
│                 └────────────────────────────────────────────│
└───────────────────┬─────────────────────────────────────────┘
                    │ fs.read
┌───────────────────┴─────────────────────────────────────────┐
│  Project Directory                                           │
│  specs/NNN-feature/                                          │
│    plan.md            (tech context, file tree, ASCII diagram)│
│    research.md        (technology rationale for tooltips)     │
│  tessl.json           (installed tiles and versions)          │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
src/
├── server.js              # + new API endpoint GET /api/planview/:feature, new WebSocket message type
├── parser.js              # + new functions: parseTechContext, parseFileStructure, parseAsciiDiagram, parseTesslJson
├── planview.js            # NEW: compute plan view state from parsed data (tech badges, tree, diagram, tiles)
├── board.js               # (unchanged)
├── storymap.js            # (unchanged)
├── integrity.js           # (unchanged)
├── pipeline.js            # (unchanged)
└── public/
    └── index.html         # + renderPlanView(), plan view CSS, switchTab('plan') handler
test/
├── parser.test.js         # + tests for parseTechContext, parseFileStructure, parseAsciiDiagram, parseTesslJson
├── planview.test.js       # NEW: tests for computePlanViewState
├── board.test.js          # (unchanged)
├── integrity.test.js      # (unchanged)
└── server.test.js         # + integration tests for /api/planview/:feature endpoint
```

## Key Design Decisions

### 1. Single scrollable layout (no tabs)

Per clarification, all sub-views stack vertically: badge wall → Tessl panel → file tree → architecture diagram (if present). This is simpler than tab navigation (Constitution IV) and allows developers to see everything at once. If a section has no data, it is either omitted (architecture diagram without ASCII art) or shows an empty state message (badge wall without tech context).

### 2. ASCII diagram parser — box detection algorithm

The parser works in two passes:
1. **Box detection**: Scan for `┌` characters, then trace the box boundary (right along `─` to `┐`, down along `│` to `┘`, left along `─` to `└`). Extract all text lines inside the box. The first non-empty text line is the box label. Nested boxes (boxes inside boxes) are detected by finding `┌` characters within an already-detected box's bounds.
2. **Connection detection**: After removing box regions, scan remaining lines for connector characters (`│`, `─`, `┬`, `┴`, `├`, `┤`) that form paths between box boundaries. Extract label text adjacent to connector paths (text on the same line as a horizontal connector, or between vertical connector segments).

Output: `{ nodes: [{id, label, content, x, y, width, height}], edges: [{from, to, label}] }`

### 3. LLM node type classification with graceful fallback

When ASCII diagram nodes are detected, the server makes a single Anthropic API call:
- Input: array of node labels (e.g., `["Browser", "Node.js Server", "Project Directory"]`)
- Prompt: classify each as client/server/storage/external
- Output: `{label: type}` mapping
- Cache: in-memory, invalidated when plan.md changes
- Fallback: if `ANTHROPIC_API_KEY` is not set or the call fails, all nodes get a uniform "default" type (single neutral color). No error shown to user.

### 4. File existence checking at parse time

When `parseFileStructure` processes the tree from plan.md, it returns entries with a `name`, `type` (file/dir), `comment`, and `depth`. The `computePlanViewState` function then checks each file's existence on disk using `fs.existsSync`, resolving paths relative to repo root and stripping the tree's named root directory. Results are included in the WebSocket payload so the client just renders the boolean.

### 5. Tessl tiles from tessl.json

The server reads `tessl.json` from the project root at startup and on file change. It extracts the `dependencies` object, which maps `workspace/tile-name` to `{version}`. This is sent as-is to the client. The eval score fields are reserved for future use — the data model includes them but they are never populated until the Tessl API supports evals.

### 6. Research.md tooltip matching

For badge tooltips (FR-003), the server parses `research.md`'s Decisions section. Each decision has a `**Decision**:` line with the technology name. The client matches badge values against decision titles using substring matching. If research.md doesn't exist or no match is found, the tooltip is simply not shown.

## API Contract

### HTTP Endpoints

| Method | Path | Response | Purpose |
|--------|------|----------|---------|
| GET | `/api/planview/:feature` | JSON | Plan view state for a specific feature |

### Response Shape

```json
{
  "techContext": [
    {"label": "Language/Version", "value": "Node.js 20+ (LTS)"}
  ],
  "researchDecisions": [
    {"title": "ASCII Diagram Parsing Approach", "decision": "Build a custom parser...", "rationale": "..."}
  ],
  "fileStructure": {
    "rootName": "iikit-kanban",
    "entries": [
      {"name": "src", "type": "directory", "comment": null, "depth": 0, "exists": true},
      {"name": "server.js", "type": "file", "comment": "Express + WebSocket server", "depth": 1, "exists": true}
    ]
  },
  "diagram": {
    "nodes": [
      {"id": "node-0", "label": "Browser", "content": "Single HTML page\n...", "type": "client", "x": 0, "y": 0, "width": 40, "height": 10}
    ],
    "edges": [
      {"from": "node-0", "to": "node-1", "label": "ws://localhost:PORT"}
    ],
    "raw": "┌───────...└───────┘"
  },
  "tesslTiles": [
    {"name": "tessl/npm-express", "version": "5.1.0", "eval": null}
  ],
  "exists": true
}
```

### WebSocket Messages

**Server → Client:**
```json
{
  "type": "planview_update",
  "feature": "005-plan-architecture-viewer",
  "planview": { ... same shape as API response ... }
}
```

## Quickstart Test Scenarios

1. **Plan view loads**: Select feature with plan.md → badge wall, tree, and diagram appear
2. **Badge hover**: Hover over "Express" badge → tooltip shows research decision rationale
3. **Tree expand/collapse**: Click directory in structure tree → children toggle visibility
4. **File existence**: Tree shows `server.js` as existing (green) and `new-module.js` as planned (gray)
5. **Diagram nodes**: ASCII boxes render as colored SVG rectangles with labels
6. **Diagram click**: Click a node → detail panel shows the box's content text
7. **Diagram edge labels**: Connectors show labels like "ws://localhost:PORT"
8. **Node colors**: "Browser" node is client-colored, "Server" node is server-colored (LLM-classified)
9. **Tessl panel**: tessl.json tiles appear as cards with name and version
10. **Live update**: Edit plan.md to add a tech stack entry → new badge appears within 5s
11. **No plan**: Select feature without plan.md → empty state with guidance message
12. **No diagram**: Select feature whose plan.md has no Architecture Overview → diagram section hidden, badge wall and tree still show
13. **No API key**: Unset ANTHROPIC_API_KEY → diagram renders with uniform node colors (no error)

Validated against constitution v1.1.0
