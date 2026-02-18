# Implementation Plan: Checklist Quality Gates

**Branch**: `006-checklist-quality-gates` | **Date**: 2026-02-17 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/006-checklist-quality-gates/spec.md`

## Summary

Add a Checklist phase detail view to the pipeline dashboard showing progress rings (one per checklist file) and a gate traffic light indicator. Progress rings use SVG arcs with animated fill and color coding (red/yellow/green). Clicking a ring expands an accordion detail view of individual checklist items. Gate status shows "OPEN" or "BLOCKED" based on worst-case checklist completion. The view renders as the Phase 4 (Checklist) tab content within the existing pipeline navigation from 002.

## Technical Context

**Language/Version**: Node.js 20+ (LTS) — same as 001/002
**Primary Dependencies**: Express, ws, chokidar — same as 001/002 (no new dependencies)
**Storage**: N/A (reads directly from checklist markdown files on disk)
**Testing**: Jest (unit tests for new parser functions and checklist state computation)
**Target Platform**: macOS, Linux, Windows (anywhere Node.js runs)
**Project Type**: Single — server + embedded client HTML
**Performance Goals**: Checklist view loads in <2s (SC-001), artifact changes reflected in <5s (SC-004)
**Constraints**: Zero new dependencies, no build step, extends existing codebase. SVG for rings (no canvas, no charting library)
**Scale/Scope**: 1-6 checklist files per feature, each with 5-50 items

## Constitution Check

| Principle | Compliance | Notes |
|-----------|------------|-------|
| I. Test-First (NON-NEGOTIABLE) | COMPLIANT | Tests written before implementation per constitution. Parser functions and checklist state computation tested in isolation. |
| II. Real-Time Accuracy | COMPLIANT | Checklist data derived from files on disk on every change. Pushed via existing WebSocket. No caching. |
| III. Professional UI | COMPLIANT | SVG progress rings with smooth CSS transitions, color-coded gate indicator, accordion detail view. Same design system as kanban board and pipeline. |
| IV. Simplicity | COMPLIANT | No new dependencies. Rings are basic SVG circles with stroke-dasharray. Gate logic is a pure function. Accordion is vanilla JS toggle. |

## Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│  Browser (index.html)                                     │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Pipeline Bar (always visible — from 002)            │ │
│  │  [...][Check]──active──[...]                         │ │
│  ├──────────────────────────────────────────────────────┤ │
│  │  Checklist Content Area (NEW)                        │ │
│  │  ┌────────────────────────────────────────────────┐  │ │
│  │  │  Gate Traffic Light: ● GATE: OPEN / BLOCKED    │  │ │
│  │  ├────────────────────────────────────────────────┤  │ │
│  │  │  Progress Rings Row                            │  │ │
│  │  │  ┌──────┐  ┌──────┐  ┌──────┐                │  │ │
│  │  │  │ SVG  │  │ SVG  │  │ SVG  │                │  │ │
│  │  │  │ 67%  │  │ 100% │  │  0%  │                │  │ │
│  │  │  │Reqs  │  │ UX   │  │ API  │                │  │ │
│  │  │  └──────┘  └──────┘  └──────┘                │  │ │
│  │  ├────────────────────────────────────────────────┤  │ │
│  │  │  Accordion Detail (one ring expanded at a time)│  │ │
│  │  │  ┌────────────────────────────────────────┐   │  │ │
│  │  │  │  Category: Requirement Completeness    │   │  │ │
│  │  │  │  ✓ CHK-001 All stories have scenarios  │   │  │ │
│  │  │  │  ☐ CHK-002 Edge cases identified       │   │  │ │
│  │  │  │  Category: Clarity                      │   │  │ │
│  │  │  │  ✓ CHK-003 No ambiguous terms  [spec]  │   │  │ │
│  │  │  └────────────────────────────────────────┘   │  │ │
│  │  └────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────┘ │
└───────────────┬──────────────────────────────────────────┘
                │ ws://localhost:PORT
┌───────────────┴──────────────────────────────────────────┐
│  Node.js Server                                           │
│  ┌──────────┐  ┌──────────┐  ┌────────────────┐         │
│  │ Express  │  │ ws       │  │ chokidar       │         │
│  │ (HTTP)   │  │ (push)   │  │ (file watch)   │         │
│  └──────────┘  └──────────┘  └───────┬────────┘         │
│                                       │                   │
│  NEW: checklist.js                    │                   │
│  ┌────────────────────────────────────┘                   │
│  │  On file change in checklists/:                        │
│  │  1. parseChecklistsDetailed(checklistDir) — NEW        │
│  │  2. computeChecklistViewState() — NEW                  │
│  │  3. Push checklist_update to WebSocket clients          │
│  └───────────────────────────────────────────────────────│
└───────────────┬──────────────────────────────────────────┘
                │ fs.readFileSync
┌───────────────┴──────────────────────────────────────────┐
│  Project Directory                                        │
│  specs/NNN-feature/checklists/                            │
│    requirements.md     ← - [x] / - [ ] items with CHK-xxx│
│    ux.md               ← category headings + items        │
│    api.md              ← dimension/reference tags          │
│    security.md         ← etc.                              │
└──────────────────────────────────────────────────────────┘
```

## File Structure

```
iikit-dashboard/
├── src/
│   ├── server.js          # MODIFY — add /api/checklist/:feature endpoint, push checklist_update
│   ├── parser.js          # MODIFY — add parseChecklistsDetailed() function
│   ├── checklist.js       # NEW — compute checklist view state (per-file + gate status)
│   ├── pipeline.js        # UNCHANGED (already computes aggregate checklist status)
│   ├── board.js           # UNCHANGED
│   ├── integrity.js       # UNCHANGED
│   ├── storymap.js        # UNCHANGED
│   ├── planview.js        # UNCHANGED
│   └── public/
│       └── index.html     # MODIFY — add renderChecklistContent(), SVG rings, gate indicator, accordion
├── test/
│   ├── checklist.test.js  # NEW — unit tests for checklist view state
│   ├── parser.test.js     # MODIFY — add tests for parseChecklistsDetailed
│   ├── server.test.js     # MODIFY — add tests for /api/checklist/:feature + checklist_update
│   ├── pipeline.test.js   # UNCHANGED
│   ├── board.test.js      # UNCHANGED
│   └── integrity.test.js  # UNCHANGED
└── bin/
    └── iikit-dashboard.js # UNCHANGED
```

**Structure Decision**: Extends existing single-project structure. One new source file (`checklist.js`), modifications to three existing files (`server.js`, `parser.js`, `index.html`). One new test file (`checklist.test.js`).

## Key Design Decisions

### 1. New `parseChecklistsDetailed()` in parser.js

The existing `parseChecklists()` returns only aggregate `{total, checked, percentage}`. Feature 006 needs per-file detail: individual items with check status, CHK IDs, categories, and tags. A new `parseChecklistsDetailed(checklistDir)` function returns an array of file objects, each containing parsed items grouped by category. The existing `parseChecklists()` remains unchanged since pipeline.js depends on it.

### 2. New `checklist.js` module for view state

Follows the established pattern of one module per view (board.js, pipeline.js, storymap.js, planview.js). A `computeChecklistViewState(projectPath, featureId)` function calls `parseChecklistsDetailed()` and adds computed fields: per-file percentage, color classification, and aggregate gate status. The gate logic uses worst-case precedence: red if any file is at 0%, yellow if all are between 1-99%, green only if all are at 100%.

### 3. SVG circles for progress rings

Each ring is an SVG with two `<circle>` elements: a gray background track and a colored foreground arc. The foreground uses `stroke-dasharray` and `stroke-dashoffset` to show partial fill. Animation on load: CSS transition on `stroke-dashoffset` from fully hidden to target percentage. Color transitions use CSS custom properties mapped to the percentage bracket. No charting library needed — this is ~15 lines of SVG per ring.

### 4. Gate traffic light as simple indicator

The gate indicator is a colored dot (SVG circle or CSS `border-radius: 50%`) with text label. Three states: green dot + "GATE: OPEN", yellow dot + "GATE: BLOCKED", red dot + "GATE: BLOCKED". Positioned above the rings row for immediate visibility. Uses the same color variables as pipeline node status.

### 5. Accordion detail powered by CSS max-height transition

Clicking a ring sets `expandedChecklist` state variable to that file's name (or null to collapse). The detail panel uses `max-height` CSS transition for smooth expand/collapse. Only one panel open at a time — setting a new `expandedChecklist` value automatically collapses the previous. Items render as a flat list grouped under `<h4>` category headings.

### 6. Checklist name derived from filename

The human-readable checklist name is derived from the markdown filename: strip `.md`, replace hyphens with spaces, title-case each word. Example: `api-design.md` → "Api Design", `requirements.md` → "Requirements". This matches the existing feature name derivation pattern in server.js.

### 7. Checklist update pushed via existing file watcher

The existing chokidar watcher already fires on any file change under `specs/`. When a checklist file changes, the server recomputes checklist view state and pushes a `checklist_update` message alongside the existing `pipeline_update` (which already reflects aggregate checklist status). No new watcher needed.

### 8. Screen reader accessibility via aria attributes

Each SVG ring has `role="img"` with `aria-label` describing the checklist name and completion (e.g., "Requirements: 8 of 12 items complete, 67%"). The gate indicator has `role="status"` with `aria-live="polite"` so screen readers announce gate changes. Accordion buttons use `aria-expanded` and `aria-controls`.

## API Contract

### New HTTP Endpoint

| Method | Path | Response | Purpose |
|--------|------|----------|---------|
| GET | `/api/checklist/:feature` | JSON | Detailed checklist state for a feature |

**Response shape:**
```json
{
  "files": [
    {
      "name": "Requirements",
      "filename": "requirements.md",
      "total": 12,
      "checked": 8,
      "percentage": 67,
      "color": "green",
      "items": [
        {
          "text": "All user stories have acceptance scenarios",
          "checked": true,
          "chkId": "CHK-001",
          "category": "Requirement Completeness",
          "tags": ["spec"]
        },
        {
          "text": "Edge cases identified",
          "checked": false,
          "chkId": "CHK-002",
          "category": "Requirement Completeness",
          "tags": []
        }
      ]
    }
  ],
  "gate": {
    "status": "blocked",
    "level": "yellow",
    "label": "GATE: BLOCKED"
  }
}
```

**Gate level values:** `"green"` (all 100%), `"yellow"` (all 1-99%), `"red"` (any at 0%)

**Color values per file:** `"red"` (0-33%), `"yellow"` (34-66%), `"green"` (67-100%)

### New WebSocket Message

**Server → Client:**
```json
{
  "type": "checklist_update",
  "feature": "006-checklist-quality-gates",
  "checklist": { "files": [...], "gate": {...} }
}
```

Sent alongside existing `pipeline_update` and `board_update` on every file change.

### Existing Messages — No Changes

`board_update`, `pipeline_update`, `storymap_update`, `planview_update`, `constitution_update`, `features_update` are all unchanged. The existing `pipeline_update` already includes aggregate checklist percentage in the Checklist phase node.

## Quickstart Test Scenarios

1. **Rings render on tab click**: Start dashboard → click "Checklist" pipeline node → progress rings appear, one per checklist file, with correct percentages and colors
2. **Gate status display**: Feature with all checklists at 100% → "GATE: OPEN" green. Uncheck one item in a file → gate changes to "GATE: BLOCKED" yellow within 5s
3. **Ring color coding**: Checklist at 25% → red ring. At 50% → yellow ring. At 80% → green ring
4. **Accordion expand/collapse**: Click a ring → detail panel expands showing items grouped by category. Click another ring → first collapses, second expands
5. **CHK IDs and tags**: Checklist items with `CHK-001` identifiers and `[spec]` tags display with IDs and badge labels
6. **Empty state**: Feature with no checklists directory → "No checklists generated" message with suggestion to run /iikit-04-checklist
7. **Live update**: Open checklist view → externally edit a checklist file to check off items → ring animates to new percentage, color transitions, gate updates

Validated against constitution v1.1.0
