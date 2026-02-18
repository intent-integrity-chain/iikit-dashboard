# Research: Analyze Consistency

**Feature**: 008-analyze-consistency | **Date**: 2026-02-18

## Decisions

### 1. Data Source: Consume analysis.md Report

**Decision**: Parse the structured `analysis.md` markdown report produced by `/iikit-07-analyze` rather than independently computing coverage from source artifacts
**Rationale**: Per spec clarification, the dashboard is the view layer. The analyze phase already computes coverage, finds issues, and produces a structured report with findings tables, coverage summaries, metrics, and constitution alignment. Re-implementing this logic in the dashboard would violate Constitution IV (Simplicity) and create duplication. Parsing markdown tables is straightforward with regex, and the report format is stable across existing features (001-007).
**Alternatives considered**:
- Independent analysis by cross-referencing spec.md, tasks.md, test-specs.md (rejected — duplicates /iikit-07-analyze logic, violates separation of concerns)
- JSON output from /iikit-07-analyze (rejected — analyze produces markdown, not JSON; would require upstream change for no clear benefit since markdown parsing is sufficient)

### 2. Health Score Formula

**Decision**: Equal-weighted average of four factors (25% each): requirements coverage, constitution compliance, phase separation score, and test coverage
**Rationale**: Per spec clarification, equal weights are the simplest and most transparent approach. The four factors map directly to the four main sections of the analysis report. No configuration or customization needed — Constitution IV (Simplicity).
**Alternatives considered**:
- Weighted formula with configurable weights (rejected per clarification — out of scope, adds unnecessary complexity)
- Severity-based scoring (rejected — findings severity is shown in the table, not folded into a single number)

### 3. Heatmap as HTML Table (Not Canvas/SVG)

**Decision**: Render the coverage heatmap as a semantic HTML `<table>` with colored `<td>` cells
**Rationale**: HTML tables are natively accessible with screen reader support for row/column headers (`<th scope>`). The heatmap has only 3 columns (tasks, tests, plan) and up to 20 rows — well within what an HTML table handles efficiently. CSS can color cells and add hover/click interactions. No canvas or SVG complexity needed.
**Alternatives considered**:
- SVG grid (rejected — adds complexity for no benefit over HTML table; tables have built-in accessibility)
- Canvas heatmap (rejected — not accessible, no semantic structure, overkill for a 3-column table)

### 4. Severity Table Sort/Filter — Vanilla JS

**Decision**: Implement sort and filter via vanilla JavaScript using `data-*` attributes on table rows
**Rationale**: The severity table has at most ~100 rows. DOM-based sorting (reorder `<tr>` elements) and filtering (toggle `display`) are efficient at this scale. No virtual scrolling or pagination library needed. Consistent with the zero-dependency approach across the dashboard.
**Alternatives considered**:
- DataTables library (rejected — adds dependency, overkill for ~100 rows)
- Client-side pagination (only if >100 issues — edge case 10 mentions this, but typical features have 0-30)

### 5. SVG Gauge — Single Arc Element

**Decision**: Render the health gauge as an SVG semicircular arc with a rotating needle
**Rationale**: The gauge is a simple visualization — three colored arc segments and a needle indicator. SVG is ideal for this: resolution-independent, animatable via CSS transforms, accessible via `role="meter"`. The existing dashboard already uses SVG for progress rings (checklist, 006) and Sankey diagrams (testify, 007), so the pattern is established.
**Alternatives considered**:
- CSS-only gauge with conic-gradient (rejected — harder to add the needle animation and three discrete zones)
- Canvas gauge (rejected — not accessible, harder to animate)

### 6. Analysis Report Parsing Strategy

**Decision**: Parse the known sections of analysis.md using section-boundary regex (find `## Section` headers, extract content between them, then parse markdown tables within each section)
**Rationale**: The analysis.md format is consistent across all 7 existing features. Each section (`## Findings`, `## Coverage Summary`, `## Metrics`, `## Constitution Alignment`, `## Phase Separation Violations`) uses standard markdown tables. The same section-boundary approach is used by existing parsers (e.g., `parseTechContext` finds `## Technical Context` then extracts until next `## `). Handles both minimal reports (001-003 with just metrics) and detailed reports (005-007 with full tables).
**Alternatives considered**:
- Full markdown parser library (rejected — adds dependency, the format is simple enough for regex)
- Line-by-line state machine (considered but regex section extraction is cleaner for this structured format)

## Tessl Tiles

### Installed Tiles

| Technology | Tile | Type | Version | Eval |
|------------|------|------|---------|------|
| Express | tessl/npm-express | Documentation | 5.1.0 | No eval data available |
| ws | tessl/npm-ws | Documentation | 8.18.0 | No eval data available |
| Jest | tessl/npm-jest | Documentation | 30.1.0 | No eval data available |
| @anthropic-ai/sdk | tessl/npm-anthropic-ai--sdk | Documentation | 0.70.0 | No eval data available |
| IIKit | tessl-labs/intent-integrity-kit | Skills + Rules | 1.6.5 | No eval data available |

### Technologies Without Tiles

- chokidar: No Tessl tile available
