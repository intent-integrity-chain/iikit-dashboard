# Implementation Plan: Constitution Radar Chart

**Branch**: `003-constitution-radar` | **Date**: 2026-02-11 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/003-constitution-radar/spec.md`

## Summary

Add the Constitution tab content to the pipeline dashboard. Parses CONSTITUTION.md server-side to extract principles (name, text, rationale, obligation level) and version metadata. Renders a radar chart in the client with one axis per principle scaled by obligation strength (MUST/SHOULD/MAY), a principle summary bar above, a detail card on click, and an amendment timeline below. No new dependencies — radar chart drawn with inline SVG.

## Technical Context

**Language/Version**: Node.js 20+ (LTS) — same as 001/002
**Primary Dependencies**: Express, ws, chokidar — same as 001/002. Radar chart drawn with inline SVG (no charting library)
**Storage**: N/A (reads CONSTITUTION.md from disk)
**Testing**: Jest (unit + integration tests)
**Target Platform**: macOS, Linux, Windows
**Project Type**: Single — server + embedded client HTML
**Performance Goals**: Tab renders in <3s (SC-001), CONSTITUTION.md changes reflected in <5s
**Constraints**: Zero new dependencies, no build step, no charting libraries (inline SVG keeps it simple per Constitution V)
**Scale/Scope**: 3-10 principles per constitution, 1 version timeline

## Constitution Check

| Principle | Compliance | Notes |
|-----------|------------|-------|
| I. Test-First (NON-NEGOTIABLE) | COMPLIANT | Tests before implementation per constitution. Constitution parser tested in isolation. |
| II. Real-Time Accuracy | COMPLIANT | CONSTITUTION.md already in chokidar watch list (added in 002). Changes pushed via WebSocket. |
| III. Professional UI | COMPLIANT | SVG radar chart with same design system (CSS custom properties, transitions, typography). |
| IV. Simplicity | COMPLIANT | No charting library. Inline SVG is ~50 lines of math. No new dependencies. |

## Architecture Overview

```
Browser (index.html)
  Constitution Tab Content:
  +--------------------------------------------------+
  |  Principle Summary Bar                            |
  |  "I. Test-First (MUST) | II. Accuracy (MUST) |.." |
  +--------------------------------------------------+
  |  Radar Chart (SVG)       |  Detail Card          |
  |    /\                    |  Principle: ...        |
  |   /  \   axis per        |  Text: ...             |
  |  /    \  principle       |  Rationale: ...        |
  |  \    /                  |  Level: MUST           |
  |   \  /                   |                        |
  |    \/                    |                        |
  +--------------------------------------------------+
  |  Amendment Timeline                               |
  |  v1.0 -------- v1.1                              |
  |  2026-02-10    2026-02-10                         |
  +--------------------------------------------------+

Server
  NEW: GET /api/constitution
    -> parseConstitutionPrinciples(projectPath)
    -> returns { principles: [...], version: {...} }

  MODIFIED: WebSocket file change handler
    -> also pushes constitution_update when CONSTITUTION.md changes
```

## File Structure

```
iikit-dashboard/
├── src/
│   ├── server.js          # MODIFY — add /api/constitution endpoint, push constitution_update
│   ├── parser.js           # MODIFY — add parseConstitutionPrinciples (full extraction)
│   ├── pipeline.js         # UNCHANGED
│   ├── board.js            # UNCHANGED
│   ├── integrity.js        # UNCHANGED
│   └── public/
│       └── index.html      # MODIFY — add Constitution tab rendering (radar SVG, summary, detail card, timeline)
├── test/
│   ├── parser.test.js      # MODIFY — add tests for parseConstitutionPrinciples
│   ├── server.test.js      # MODIFY — add tests for /api/constitution endpoint
│   ├── pipeline.test.js    # UNCHANGED
│   ├── board.test.js       # UNCHANGED
│   └── integrity.test.js   # UNCHANGED
└── bin/
    └── iikit-kanban.js     # UNCHANGED
```

**Structure Decision**: Extends existing structure. No new source files. Modifications to 3 files (parser.js, server.js, index.html) and 2 test files.

## Key Design Decisions

### 1. Inline SVG for radar chart (no charting library)

A radar chart is simple geometry — regular polygon with axes. Using a charting library (d3, chart.js) would violate Constitution V (simplicity) and add a dependency. Inline SVG with basic trigonometry (~50 lines) produces the same result. The SVG is generated client-side from the principles JSON.

### 2. Server-side CONSTITUTION.md parsing

Add `parseConstitutionPrinciples(projectPath)` to parser.js. This extracts:
- Principle names from `### N. Name` headings under `## Core Principles`
- Full text (everything between headings)
- Rationale (text after `**Rationale**:`)
- Obligation level (scan text for MUST/SHOULD/MAY keywords)
- Version metadata from the footer line (`**Version**: X.Y.Z | **Ratified**: DATE | **Last Amended**: DATE`)

Returns a structured JSON object served via `/api/constitution`.

### 3. Constitution tab replaces placeholder for "constitution" phase

The existing `renderPlaceholderView('constitution')` in index.html is replaced with `renderConstitutionView(data)` that draws the full tab: summary bar, radar chart, detail card, and timeline.

### 4. WebSocket `constitution_update` message

On CONSTITUTION.md change, the server pushes a `constitution_update` message to all clients (not feature-specific — constitution is project-level per FR-011).

### 5. Detail card layout

The radar chart and detail card sit side by side (flex row). On click, the detail card shows the selected principle's full text. On narrow screens, they stack vertically.

## API Contract

### New HTTP Endpoint

| Method | Path | Response | Purpose |
|--------|------|----------|---------|
| GET | `/api/constitution` | JSON | Parsed constitution principles and version metadata |

**Response shape:**
```json
{
  "principles": [
    {
      "number": "I",
      "name": "Test-First Development",
      "text": "TDD MUST be used for all feature development...",
      "rationale": "Test-first development prevents the circular verification problem...",
      "level": "MUST"
    }
  ],
  "version": {
    "version": "1.1.0",
    "ratified": "2026-02-10",
    "lastAmended": "2026-02-10"
  },
  "exists": true
}
```

When CONSTITUTION.md doesn't exist: `{ "principles": [], "version": null, "exists": false }`

### New WebSocket Message

**Server -> Client:**
```json
{
  "type": "constitution_update",
  "constitution": { "principles": [...], "version": {...}, "exists": true }
}
```

Sent to ALL clients on CONSTITUTION.md change (not feature-specific).

## Quickstart Test Scenarios

1. **Radar renders**: Open dashboard, click Constitution node -> radar chart with 4 axes appears
2. **Obligation levels**: MUST principles at outer ring, SHOULD middle, MAY inner
3. **Principle summary**: One-line summaries shown above radar
4. **Detail card**: Click an axis -> detail card shows full principle text and rationale
5. **Timeline**: Version and dates shown below radar
6. **Empty state**: Delete CONSTITUTION.md -> empty state message appears
7. **Live update**: Edit CONSTITUTION.md -> radar updates within 5s
8. **Feature-independent**: Switch features -> Constitution tab shows same content

Validated against constitution v1.1.0
