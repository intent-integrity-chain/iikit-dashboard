# Implementation Plan: Analyze Consistency — Coverage Heatmap, Severity Table, Health Gauge

**Branch**: `008-analyze-consistency` | **Date**: 2026-02-18 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/008-analyze-consistency/spec.md`

## Summary

Add an Analyze phase detail view to the pipeline dashboard showing three sub-views: a coverage heatmap matrix (requirements vs. artifact types color-coded by coverage status), a sortable/filterable issue severity table, and a health score gauge (0-100 with color zones and optional trend indicator). All data is consumed from the structured `analysis.md` report produced by `/iikit-07-analyze` — the dashboard is purely a visualization layer that re-renders when the report file changes on disk. The view renders as Phase 7 (Analyze) tab content within the existing pipeline navigation from 002.

## Technical Context

**Language/Version**: Node.js 20+ (LTS) — same as 001-007
**Primary Dependencies**: Express, ws, chokidar — same as 001-007 (no new dependencies)
**Storage**: N/A (reads analysis.md report and source artifacts from disk)
**Testing**: Jest (unit tests for new parser functions and analyze state computation)
**Target Platform**: macOS, Linux, Windows (anywhere Node.js runs)
**Project Type**: Single — server + embedded client HTML
**Performance Goals**: Analyze view loads in <3s, artifact changes reflected in <5s (SC-006). Heatmap renders usably for up to 20 requirements and 100 issues (SC-008)
**Constraints**: Zero new dependencies, no build step, extends existing codebase. HTML tables for heatmap and severity table, SVG for health gauge. No charting library
**Scale/Scope**: Typical features have 10-20 requirements, 20-50 tasks, 10-30 test specs, 0-30 findings

## Constitution Check

| Principle | Compliance | Notes |
|-----------|------------|-------|
| I. Test-First (NON-NEGOTIABLE) | COMPLIANT | Tests written before implementation per constitution. Parser functions and analyze state computation tested in isolation. |
| II. Real-Time Accuracy | COMPLIANT | Analyze data re-read from analysis.md on every file change. Pushed via existing WebSocket. No caching. |
| III. Professional Kanban UI | COMPLIANT | Color-coded heatmap, sortable table with severity badges, animated SVG gauge with color zones and trend arrow. Same design system as existing views. |
| IV. Simplicity | COMPLIANT | No new dependencies. HTML tables for heatmap/issues (simplest semantic choice). SVG gauge is one arc element. Dashboard consumes report — no analyze logic of its own. |

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│  Browser (index.html)                                         │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Pipeline Bar (always visible — from 002)                │ │
│  │  [...][Analyze]──active──[...]                           │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │  Analyze Content Area (NEW — single scroll)              │ │
│  │                                                          │ │
│  │  ┌─ Health Gauge ─────────────────────────────────────┐  │ │
│  │  │     ╭───────╮                                      │  │ │
│  │  │    ╱  72/100 ╲   ▲ improving                       │  │ │
│  │  │   ╱───────────╲  Breakdown: Req 80% | Const 100%  │  │ │
│  │  │  🟥    🟨    🟩  Phase Sep 100% | Test 90%         │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  │                                                          │ │
│  │  ┌─ Coverage Heatmap ─────────────────────────────────┐  │ │
│  │  │          Tasks   Tests   Plan                      │  │ │
│  │  │  FR-001   🟩      🟩      🟩                       │  │ │
│  │  │  FR-002   🟥      🟩      🟥                       │  │ │
│  │  │  FR-003   🟨      🟩      🟩                       │  │ │
│  │  │  SC-001   🟩      🟥      ⬜                       │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  │                                                          │ │
│  │  ┌─ Severity Table ───────────────────────────────────┐  │ │
│  │  │  ID   Category    Severity   Location   Summary    │  │ │
│  │  │  A1   Coverage    🔴 CRIT    spec:FR-2  Missing... │  │ │
│  │  │  A2   Phase Sep   🟡 WARN    plan:45    Governa... │  │ │
│  │  │  A3   Ambiguity   🔵 INFO    spec:SC-1  Unclear... │  │ │
│  │  │  [Filter: All ▼] [Sort: Severity ▼]               │  │ │
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
│  NEW: analyze.js                      │                       │
│  ┌────────────────────────────────────┘                       │
│  │  On file change in specs/NNN/:                            │
│  │  1. parseAnalysisFindings(analysisContent)                │
│  │  2. parseAnalysisCoverage(analysisContent)                │
│  │  3. parseAnalysisMetrics(analysisContent)                 │
│  │  4. parseConstitutionAlignment(analysisContent)           │
│  │  5. computeAnalyzeState() — health score + trend          │
│  │  6. Push analyze_update to WebSocket clients               │
│  └───────────────────────────────────────────────────────────│
└───────────────┬──────────────────────────────────────────────┘
                │ fs.readFileSync
┌───────────────┴──────────────────────────────────────────────┐
│  Project Directory                                            │
│  specs/NNN-feature/                                           │
│    analysis.md          ← Findings, coverage, metrics         │
│    spec.md              ← FR-xxx, SC-xxx (heatmap row source) │
│  CONSTITUTION.md        ← Principle names for alignment table │
└──────────────────────────────────────────────────────────────┘
```

## File Structure

```
iikit-dashboard/
├── src/
│   ├── server.js          # MODIFY — add /api/analyze/:feature endpoint, push analyze_update
│   ├── parser.js          # MODIFY — add parseAnalysisFindings(), parseAnalysisCoverage(), parseAnalysisMetrics(), parseConstitutionAlignment(), parsePhaseSeparation()
│   ├── analyze.js         # NEW — compute analyze view state (heatmap + issues + gauge + trend)
│   ├── board.js           # UNCHANGED
│   ├── pipeline.js        # UNCHANGED
│   ├── storymap.js        # UNCHANGED
│   ├── planview.js        # UNCHANGED
│   ├── checklist.js       # UNCHANGED
│   ├── testify.js         # UNCHANGED
│   ├── integrity.js       # UNCHANGED
│   └── public/
│       └── index.html     # MODIFY — add renderAnalyzeContent(), heatmap table, severity table, SVG gauge
├── test/
│   ├── analyze.test.js    # NEW — unit tests for analyze view state computation
│   ├── parser.test.js     # MODIFY — add tests for analysis.md parser functions
│   ├── server.test.js     # MODIFY — add tests for /api/analyze/:feature + analyze_update
│   ├── board.test.js      # UNCHANGED
│   ├── pipeline.test.js   # UNCHANGED
│   ├── storymap.test.js   # UNCHANGED
│   ├── planview.test.js   # UNCHANGED
│   ├── checklist.test.js  # UNCHANGED
│   ├── testify.test.js    # UNCHANGED
│   └── integrity.test.js  # UNCHANGED
└── bin/
    └── iikit-dashboard.js # UNCHANGED
```

**Structure Decision**: Extends existing single-project structure. One new source file (`analyze.js`), modifications to three existing files (`server.js`, `parser.js`, `index.html`). One new test file (`analyze.test.js`). Follows the same pattern as board.js, storymap.js, testify.js, planview.js — separate compute module per view.

## Key Design Decisions

### KDD-1. Dashboard Consumes Structured Report — No Analysis Logic

Per spec clarification, the dashboard is the view layer, not the analysis engine. All data comes from parsing the `analysis.md` file produced by `/iikit-07-analyze`. The dashboard does NOT independently compute coverage by cross-referencing spec.md, tasks.md, and test-specs.md. It parses the pre-computed findings table, coverage summary, metrics, constitution alignment, and phase separation sections from the markdown report. "Real-time" means re-rendering when `analysis.md` changes on disk, not watching source artifacts directly.

### KDD-2. Five New Parser Functions in parser.js

Five parser functions added to `src/parser.js` to extract data from `analysis.md`:

- `parseAnalysisFindings(content)` — extracts rows from the `## Findings` markdown table: ID, Category, Severity, Location(s), Summary, Recommendation. Handles both "No CRITICAL issues found" (empty state) and the full table. Detects `~~SEVERITY~~ RESOLVED` strikethrough pattern for resolved issues.
- `parseAnalysisCoverage(content)` — extracts rows from the `## Coverage Summary` section. Handles both simple format (`Requirement | Has Task? | Notes`) and detailed format (`Requirement | Has Task? | Task IDs | Has Test? | Test IDs | Status`). Returns per-requirement coverage entries with artifact references.
- `parseAnalysisMetrics(content)` — extracts key-value pairs from the `## Metrics` section. Returns an object with standardized keys: `totalRequirements`, `totalTasks`, `totalTestSpecs`, `requirementCoverage`, `testCoverage`, `criticalIssues`, `highIssues`, `mediumIssues`, `lowIssues`.
- `parseConstitutionAlignment(content)` — extracts rows from the `## Constitution Alignment` table: Principle, Status (ALIGNED/VIOLATION/PARTIAL), Evidence.
- `parsePhaseSeparation(content)` — extracts rows from the `## Phase Separation Violations` section. Returns violation entries or empty array if "None detected".

### KDD-3. Health Score Computation — Equal-Weighted Average

The health score is computed from four factors at 25% each (per spec clarification):

1. **Requirements coverage %** — extracted from metrics `requirementCoverage` (e.g., "28/28 (100%)" → 100)
2. **Constitution compliance %** — computed from constitution alignment table: (ALIGNED count / total count) * 100
3. **Phase separation score** — 100 minus (violations count * penalty), floored at 0. Penalty: CRITICAL=25, HIGH=15, MEDIUM=5, LOW=2
4. **Test coverage %** — extracted from metrics `testCoverage` if present, or derived from test spec → task coverage

Final score = Math.round((factor1 + factor2 + factor3 + factor4) / 4). Color zone: red (0-40), yellow (41-70), green (71-100).

### KDD-4. Coverage Heatmap — HTML Table with Semantic Markup

The heatmap is an HTML `<table>` with `<th>` column headers (Tasks, Tests, Plan) and `<td>` cells color-coded by coverage status. This is the most accessible and simplest approach — tables are natively readable by screen readers with row/column headers. Cell colors use CSS classes mapped to status: `.coverage-full` (green), `.coverage-partial` (yellow), `.coverage-missing` (red), `.coverage-na` (gray). Clicking a cell expands to show the specific references. No canvas or SVG needed — per constitution: Principle IV (Simplicity).

Coverage status per cell is derived from the coverage summary table. For each requirement row:
- **Tasks column**: green if "Has Task?" is "Yes" with task IDs, red if "No", yellow if partial
- **Tests column**: green if "Has Test?" is "Yes" with test IDs, red if "No", gray if test-specs.md not present
- **Plan column**: green if the requirement ID appears in plan.md cross-references, red otherwise. Detected from the coverage summary's Notes/Status column or from the findings table

### KDD-5. Severity Table — Sort and Filter via Data Attributes

The severity table is an HTML `<table>` with sort and filter implemented via vanilla JavaScript (no library). Each `<tr>` has `data-severity` and `data-category` attributes. Filtering toggles `display: none` on non-matching rows. Sorting compares data attributes and reorders DOM nodes. Severity sort order: critical=0, high=1, medium=2, low=3. Severity badges use colored pills matching existing dashboard conventions.

Row expansion: clicking a row toggles a hidden `<tr>` below it containing the full recommendation text. The expand/collapse uses the same CSS pattern as the checklist accordion from 006.

### KDD-6. Health Gauge — SVG Arc with Animated Needle

The health gauge is an SVG semicircular arc divided into three color zones (red/yellow/green). A needle rotates from 0 to the computed score on first load using CSS `transition: transform 1s ease-out`. The score number is displayed in the center. The breakdown tooltip appears on hover/click as an absolutely-positioned div showing the four factor contributions.

The gauge reuses CSS custom properties for colors: `--color-danger` (red zone), `--color-warning` (yellow zone), `--color-success` (green zone). The SVG uses `<path>` elements for arcs with `stroke-dasharray` for zone boundaries.

### KDD-7. Trend Indicator — Read from Analysis Report

Per spec clarification, trend data (historical scores) should come from the analysis report itself. If `analysis.md` includes a score history section (array of timestamped scores), the trend is computed by comparing the latest two entries. If only one entry or no history, no trend indicator is shown. The trend arrow (up for improving, down for declining) appears next to the gauge score.

Since this requires an upstream change to `/iikit-07-analyze` to include score history, the trend indicator will gracefully degrade: if no history data is found in the report, it simply doesn't render.

### KDD-8. Analyze Update via Existing File Watcher

The existing chokidar watcher fires on any file change under the project. When `analysis.md` changes (after a `/iikit-07-analyze` re-run), the server recomputes analyze view state and pushes an `analyze_update` WebSocket message. No new watcher needed.

### KDD-9. Load Animations — Consistent with Pipeline Patterns

On first load: gauge needle sweeps from 0 to score (CSS transition), heatmap rows fade in sequentially (`animation-delay` per row), severity table slides in from below. Uses existing CSS transition variables (`--transition-normal`, `--transition-slow`). Animations are `prefers-reduced-motion` aware.

### KDD-10. Accessibility

Heatmap table uses `<th scope="col">` for artifact columns and `<th scope="row">` for requirement rows. Coverage status communicated via `aria-label` on cells (not color alone). Gauge has `role="meter"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`. Severity table is keyboard-navigable with `tabindex` on sortable headers and expandable rows. Targets WCAG 2.1 AA.

## API Contract

### New HTTP Endpoint

| Method | Path | Response | Purpose |
|--------|------|----------|---------|
| GET | `/api/analyze/:feature` | JSON | Analyze view state for a feature |

**Response shape:**
```json
{
  "healthScore": {
    "score": 72,
    "zone": "green",
    "factors": {
      "requirementsCoverage": { "value": 80, "label": "Requirements Coverage" },
      "constitutionCompliance": { "value": 100, "label": "Constitution Compliance" },
      "phaseSeparation": { "value": 100, "label": "Phase Separation" },
      "testCoverage": { "value": 90, "label": "Test Coverage" }
    },
    "trend": "improving"
  },
  "heatmap": {
    "columns": ["tasks", "tests", "plan"],
    "rows": [
      {
        "id": "FR-001",
        "text": "System MUST display a coverage heatmap...",
        "cells": {
          "tasks": { "status": "covered", "refs": ["T-003", "T-005"] },
          "tests": { "status": "covered", "refs": ["TS-001", "TS-003"] },
          "plan": { "status": "covered", "refs": [] }
        }
      },
      {
        "id": "FR-002",
        "text": "System MUST parse functional requirements...",
        "cells": {
          "tasks": { "status": "missing", "refs": [] },
          "tests": { "status": "covered", "refs": ["TS-005"] },
          "plan": { "status": "missing", "refs": [] }
        }
      }
    ]
  },
  "issues": [
    {
      "id": "A1",
      "category": "Coverage Gap",
      "severity": "critical",
      "location": "spec.md:FR-002",
      "summary": "FR-002 has no task implementation",
      "recommendation": "Add task covering FR-002",
      "resolved": false
    }
  ],
  "metrics": {
    "totalRequirements": 28,
    "totalTasks": 25,
    "totalTestSpecs": 32,
    "requirementCoverage": "28/28 (100%)",
    "criticalIssues": 0,
    "highIssues": 0,
    "mediumIssues": 2,
    "lowIssues": 1
  },
  "constitutionAlignment": [
    { "principle": "I. Test-First", "status": "ALIGNED", "evidence": "TDD tasks precede impl" }
  ],
  "exists": true
}
```

**When analysis.md does not exist:**
```json
{
  "healthScore": null,
  "heatmap": { "columns": [], "rows": [] },
  "issues": [],
  "metrics": null,
  "constitutionAlignment": [],
  "exists": false
}
```

### New WebSocket Message

**Server -> Client:**
```json
{
  "type": "analyze_update",
  "feature": "008-analyze-consistency",
  "analyze": { "healthScore": {...}, "heatmap": {...}, "issues": [...], "metrics": {...}, "constitutionAlignment": [...], "exists": true }
}
```

Sent alongside existing messages on every file change.

### Existing Messages — No Changes

`board_update`, `pipeline_update`, `storymap_update`, `planview_update`, `checklist_update`, `testify_update`, `constitution_update`, `features_update` are all unchanged.

Validated against constitution v1.1.0
