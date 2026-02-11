# Implementation Plan: IIKit Kanban Board

**Branch**: `001-kanban-board` | **Date**: 2026-02-10 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/001-kanban-board/spec.md`

## Summary

A local web dashboard that launches during `/iikit-08-implement` to visualize implementation progress. Shows user stories as kanban cards in Todo/In Progress/Done columns with live-updating task checkboxes. Built with Node.js, Express, ws (WebSocket), and vanilla HTML/CSS/JS. No build step.

## Technical Context

**Language/Version**: Node.js 20+ (LTS)
**Primary Dependencies**: Express (HTTP server), ws (WebSocket), chokidar (file watching)
**Storage**: N/A (reads directly from project artifacts on disk — spec.md, tasks.md, context.json)
**Testing**: Jest (unit + integration tests)
**Target Platform**: macOS, Linux, Windows (anywhere Node.js runs)
**Project Type**: Single — server + embedded client HTML
**Performance Goals**: Dashboard loads in <3s, file changes reflected in <5s (per SC-001, SC-002)
**Constraints**: Zero build step, single `npx` or `node` command to launch, no external services
**Scale/Scope**: 1-10 user stories per feature, up to 50 tasks, 1-5 features per project

## Constitution Check

| Principle | Compliance | Notes |
|-----------|------------|-------|
| I. Test-First (NON-NEGOTIABLE) | COMPLIANT | Jest tests written before implementation. Test specs via /iikit-05-testify. |
| II. Real-Time Accuracy | COMPLIANT | File watcher (chokidar) triggers re-parse + WebSocket push on every change. No caching. |
| III. Professional Kanban UI | COMPLIANT | Vanilla CSS with modern design system: shadows, rounded corners, smooth transitions, priority badges. Comparable to Linear/Trello aesthetics. |
| IV. Simplicity | COMPLIANT | No build step, no bundler, no framework. Express + ws + single HTML file with inline CSS/JS. |

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│  Browser                                         │
│  ┌─────────────────────────────────────────────┐ │
│  │  Single HTML page                           │ │
│  │  ┌───────────┬──────────────┬─────────────┐ │ │
│  │  │   Todo    │ In Progress  │    Done     │ │ │
│  │  │  [card]   │   [card]     │   [card]   │ │ │
│  │  │  [card]   │              │            │ │ │
│  │  └───────────┴──────────────┴─────────────┘ │ │
│  │  WebSocket connection (auto-reconnect)       │ │
│  └─────────────────────────────────────────────┘ │
└───────────────┬─────────────────────────────────┘
                │ ws://localhost:PORT
┌───────────────┴─────────────────────────────────┐
│  Node.js Server                                   │
│  ┌──────────┐  ┌──────────┐  ┌────────────────┐ │
│  │ Express  │  │ ws       │  │ chokidar       │ │
│  │ (HTTP)   │  │ (push)   │  │ (file watch)   │ │
│  └──────────┘  └──────────┘  └───────┬────────┘ │
│                                       │          │
│  ┌────────────────────────────────────┘          │
│  │  On file change:                              │
│  │  1. Re-parse spec.md + tasks.md               │
│  │  2. Compute board state                       │
│  │  3. Push JSON to all WebSocket clients        │
│  └───────────────────────────────────────────────│
└───────────────┬─────────────────────────────────┘
                │ fs.watch
┌───────────────┴─────────────────────────────────┐
│  Project Directory                                │
│  specs/NNN-feature/                               │
│    spec.md          (user stories, priorities)    │
│    tasks.md         (checkbox items, [USx] tags)  │
│    tests/test-specs.md  (integrity hash check)    │
│  .specify/context.json  (assertion hashes)        │
└─────────────────────────────────────────────────┘
```

## File Structure

```
iikit-kanban/
├── package.json
├── src/
│   ├── server.js          # Express + WebSocket server, file watcher
│   ├── parser.js           # Parse spec.md and tasks.md into structured data
│   ├── board.js            # Compute board state (cards in columns) from parsed data
│   ├── integrity.js        # Check assertion integrity (hash comparison)
│   └── public/
│       └── index.html      # Single-file client (HTML + CSS + JS inline)
├── test/
│   ├── parser.test.js      # Unit tests for markdown parsing
│   ├── board.test.js       # Unit tests for board state computation
│   ├── integrity.test.js   # Unit tests for hash checking
│   └── server.test.js      # Integration tests for HTTP + WebSocket
└── bin/
    └── iikit-kanban.js     # CLI entry point: parse args, start server, open browser
```

## Key Design Decisions

### 1. Single HTML file with inline CSS/JS
No build step, no bundler, no node_modules on the client side. The server serves one HTML file that contains all styles and scripts inline. This maximizes simplicity (Constitution IV) while still achieving professional aesthetics (Constitution III) through modern CSS features (grid, transitions, custom properties).

### 2. File watcher → re-parse → WebSocket push
On any change to `specs/` or `.specify/`:
1. chokidar detects the change
2. Server re-parses spec.md and tasks.md
3. Server computes new board state (which cards in which columns)
4. Server pushes the full board state as JSON to all connected WebSocket clients
5. Client does a DOM diff and applies changes with CSS transitions

This ensures real-time accuracy (Constitution II) — no polling, no caching.

### 3. Stateless server
The server holds no state. Every file change triggers a full re-parse from disk. This means the dashboard always reflects the exact state on disk (Constitution II) and simplifies the server logic (Constitution IV).

### 4. Card column assignment
From FR-006:
- **Todo**: Story has 0 checked tasks
- **In Progress**: Story has ≥1 checked task but not all
- **Done**: Story has all tasks checked

### 5. Integrity check at render time
On each re-parse, run `compute_assertion_hash` on test-specs.md (if it exists) and compare against context.json's stored hash. Display result as a badge. No need to call the full testify-tdd.sh — just the hash comparison logic, reimplemented in JS for speed.

## API Contract

### HTTP Endpoints

| Method | Path | Response | Purpose |
|--------|------|----------|---------|
| GET | `/` | HTML page | Dashboard UI |
| GET | `/api/board/:feature` | JSON | Board state for a specific feature |
| GET | `/api/features` | JSON | List of all features with summary |

### WebSocket Messages

**Server → Client:**
```json
{
  "type": "board_update",
  "feature": "001-kanban-board",
  "board": {
    "todo": [{ "id": "US1", "title": "...", "priority": "P1", "tasks": [...], "progress": "0/5" }],
    "in_progress": [...],
    "done": [...]
  },
  "integrity": { "status": "valid", "hash": "abc123..." }
}
```

```json
{
  "type": "features_update",
  "features": [
    { "id": "001-kanban-board", "name": "Kanban Board", "stories": 4, "progress": "3/12" }
  ]
}
```

## Quickstart Test Scenarios

1. **Startup**: `node bin/iikit-kanban.js /path/to/project` → opens browser → shows board
2. **Live update**: In another terminal, edit tasks.md to check a box → board updates within 5s
3. **Card movement**: Check all tasks for US1 → card slides from In Progress to Done
4. **Feature switch**: Click feature selector → board shows different feature's stories
5. **Integrity badge**: Modify test-specs.md assertions → badge changes to "tampered"

Validated against constitution v1.1.0
