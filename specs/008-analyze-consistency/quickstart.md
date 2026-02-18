# Quickstart Test Scenarios: Analyze Consistency

**Feature**: 008-analyze-consistency | **Date**: 2026-02-18

## Prerequisites

- Node.js 20+ installed
- Project has at least one feature with analysis.md (e.g., run `/iikit-07-analyze` on any feature)
- `npm install` completed

## Scenarios

### 1. Analyze view loads with all sections

1. Start server: `npm start`
2. Open browser to `http://localhost:3000`
3. Select a feature that has analysis.md (e.g., "007-testify-traceability")
4. Click the "Analyze" phase in the pipeline bar
5. **Expected**: Content area shows three sections stacked vertically:
   - Health gauge at the top (semicircular arc with score number)
   - Coverage heatmap (colored table with requirement rows and artifact columns)
   - Severity table (sortable issue list)

### 2. Health gauge displays correct score and zone

1. Navigate to Analyze view for a feature with analysis.md
2. **Expected**: Gauge needle animates from 0 to the computed score
3. **Expected**: Score is in the correct color zone (green for 71+, yellow for 41-70, red for 0-40)
4. Hover over the gauge
5. **Expected**: Breakdown tooltip shows four factors: Requirements Coverage %, Constitution Compliance %, Phase Separation %, Test Coverage %

### 3. Coverage heatmap shows requirement-artifact matrix

1. Navigate to Analyze view for feature 007-testify-traceability
2. **Expected**: Heatmap shows rows for each FR-xxx and SC-xxx from the spec
3. **Expected**: Three columns: Tasks, Tests, Plan
4. **Expected**: Cells are color-coded — green (covered), yellow (partial), red (missing), gray (N/A)
5. Click a green cell
6. **Expected**: Cell expands to show specific references (e.g., "T-003, T-005")

### 4. Severity table interaction

1. Navigate to Analyze view for a feature with findings (e.g., 005-plan-architecture-viewer)
2. **Expected**: Table shows all issues sorted by severity (critical first)
3. Click the "Category" column header
4. **Expected**: Table re-sorts by category alphabetically
5. Select "Coverage Gap" from the filter dropdown
6. **Expected**: Only coverage gap issues are shown
7. Click an issue row
8. **Expected**: Row expands to show full recommendation text

### 5. Empty state — no analysis.md

1. Select a feature that has no analysis.md
2. Click "Analyze" in the pipeline bar
3. **Expected**: Empty state message: "No analysis data found" with suggestion to run `/iikit-07-analyze`

### 6. All issues resolved

1. Navigate to Analyze view for a feature where all findings are resolved
2. **Expected**: Severity table shows resolved issues with strikethrough styling
3. **Expected**: Health gauge shows a high score in the green zone

### 7. Live update

1. Navigate to Analyze view
2. In another terminal, re-run `/iikit-07-analyze` on the active feature
3. **Expected**: When analysis.md is regenerated, the heatmap, severity table, and health gauge all update within 5 seconds without page refresh

### 8. Large report

1. Navigate to Analyze view for feature 005-plan-architecture-viewer (31 findings, 21 requirements)
2. **Expected**: All findings visible in the severity table (scrollable if needed)
3. **Expected**: All requirements visible in the heatmap with vertical scrolling for rows
4. **Expected**: Columns remain fixed — no horizontal overflow

### 9. Minimal report

1. Navigate to Analyze view for feature 001-kanban-board (metrics only, no findings table)
2. **Expected**: Health gauge shows a high score
3. **Expected**: Severity table shows "No issues found" success message
4. **Expected**: Heatmap shows all requirements as covered

### 10. Load animations

1. Navigate to Analyze view
2. **Expected**: Gauge needle sweeps from 0 to score
3. **Expected**: Heatmap rows fade in sequentially
4. **Expected**: Severity table slides in from below
