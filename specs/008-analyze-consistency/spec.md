# Feature Specification: Analyze Consistency — Coverage Heatmap, Severity Table, Health Gauge

**Feature Branch**: `008-analyze-consistency`
**Created**: 2026-02-18
**Status**: Draft
**Input**: User description: "Full visualization of the cross-artifact consistency analysis with three sub-views: Coverage Heatmap (requirements vs. artifact matrix), Issue Severity Table (sortable/filterable issues), and Health Score Gauge (0-100 alignment score with color zones). Data from /iikit-07-analyze results, spec.md, tasks.md, tests/test-specs.md, plan.md, and CONSTITUTION.md."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See Requirements Coverage at a Glance in the Heatmap (Priority: P1)

A developer navigates to the Analyze phase in the pipeline and sees a coverage heatmap matrix. Rows represent requirements (FR-xxx from spec.md) and success criteria (SC-xxx). Columns represent the artifacts that should reference them: tasks (tasks.md), tests (tests/test-specs.md), and plan sections (plan.md). Each cell is color-coded: green when the requirement is fully covered by that artifact, yellow when partially covered, red when missing, and gray when not applicable. The developer can scan the matrix and instantly identify which requirements lack coverage in which artifacts.

**Why this priority**: The coverage heatmap is the core value of the analyze view — it provides the most actionable information by showing exactly where coverage gaps exist across all artifacts. Without it, the developer has no way to see the full picture of requirements traceability.

**Independent Test**: Can be tested by creating a feature with spec.md containing 5 requirements (FR-001 through FR-005), tasks.md referencing FR-001 and FR-003, tests/test-specs.md referencing FR-001, FR-002, and FR-003, and plan.md referencing FR-001. Open the Analyze phase and verify the heatmap renders a 5-row by 3-column matrix with correct cell colors.

**Acceptance Scenarios**:

1. **Given** a feature with spec.md containing 5 functional requirements and 3 success criteria, tasks.md, tests/test-specs.md, and plan.md each referencing different subsets of those requirements, **When** the Analyze phase view loads, **Then** a coverage heatmap renders with 8 rows (one per requirement/criterion) and 3 columns (tasks, tests, plan) with cells color-coded by coverage status
2. **Given** FR-002 is referenced in tests/test-specs.md but not in tasks.md or plan.md, **When** the heatmap renders, **Then** the FR-002 row shows green for the tests column, red for the tasks column, and red for the plan column
3. **Given** the heatmap is displayed, **When** the developer clicks a green or yellow cell, **Then** the specific artifact references that constitute the coverage are shown (e.g., "T-003 references FR-002", "TS-005 verifies FR-002")

---

### User Story 2 - Review and Triage Issues by Severity (Priority: P1)

Below the heatmap, the developer sees a severity table listing all issues found by the consistency analysis. Each row contains an issue ID, category (coverage gap, constitution violation, phase separation, cross-reference mismatch), severity level (critical, warning, info), the artifact location where the issue was found, a summary, and a recommendation. The table is sorted by severity by default (critical first). The developer can sort by any column and filter by category or severity to focus on what matters most.

**Why this priority**: The severity table is equally important as the heatmap — while the heatmap shows coverage, the table surfaces all types of issues including constitution violations and phase separation problems that the heatmap cannot represent. Together they provide complete analyze coverage.

**Independent Test**: Can be tested by creating analyze output containing 3 critical issues, 5 warnings, and 2 info items across different categories. Open the Analyze phase and verify the table renders all 10 issues, defaults to severity sort, and allows filtering by category.

**Acceptance Scenarios**:

1. **Given** an analyze report containing 10 issues of mixed severity and category, **When** the severity table loads, **Then** all 10 issues are displayed in a table with columns: ID, Category, Severity, Location, Summary, Recommendation — sorted by severity (critical first)
2. **Given** the severity table is displayed with issues across 3 categories, **When** the developer selects the "coverage gap" filter, **Then** only issues with category "coverage gap" are shown and other issues are hidden
3. **Given** a severity table with 10 issues, **When** the developer clicks the "Category" column header, **Then** the table re-sorts alphabetically by category
4. **Given** a critical issue with a long recommendation, **When** the developer clicks the issue row, **Then** the row expands to show the full recommendation text

---

### User Story 3 - Assess Overall Project Health from the Gauge (Priority: P2)

At the top of the Analyze view, the developer sees a prominent health score gauge showing a score from 0 to 100. The gauge has three color zones: red (0-40), yellow (41-70), and green (71-100). The score is computed from requirements coverage percentage, constitution compliance, phase separation violations, and test coverage. A breakdown tooltip shows how each factor contributes to the score. The developer gets an instant read on overall spec-to-implementation alignment.

**Why this priority**: The health gauge provides the high-level summary that frames the detail views below. It's important but derivative — its value depends on the heatmap and table already existing to provide the underlying data. A developer can still use the heatmap and table without the gauge, but the gauge without the details would be insufficient.

**Independent Test**: Can be tested by creating a feature with 80% requirements coverage, no constitution violations, 1 phase separation warning, and 90% test coverage. Open the Analyze phase and verify the gauge shows a score in the green zone with a breakdown tooltip showing all four factors.

**Acceptance Scenarios**:

1. **Given** an analyze report with 80% requirements coverage, 100% constitution compliance, no phase separation violations, and 90% test coverage, **When** the Analyze view loads, **Then** a health gauge displays a score in the green zone (71-100) with the needle/indicator positioned at the computed value
2. **Given** a health gauge is displayed, **When** the developer hovers over or clicks the gauge, **Then** a breakdown tooltip appears showing the contribution of each factor: requirements coverage %, constitution compliance %, phase separation score, test coverage %
3. **Given** an analyze report with 30% requirements coverage and 3 constitution violations, **When** the Analyze view loads, **Then** the health gauge shows a score in the red zone (0-40)
4. **Given** a feature with no previous analyze runs, **When** the Analyze view loads, **Then** the gauge shows the current score without a trend indicator

---

### User Story 4 - See Health Score Trend Over Time (Priority: P3)

If the project has had multiple analyze runs, the developer sees a small trend indicator next to the health gauge showing whether alignment is improving or declining. This helps the developer understand the trajectory of the project's consistency over time.

**Why this priority**: Trend tracking is a polish feature that adds temporal context to the health score. The current score is useful on its own; the trend is supplementary information that helps with longer-running projects.

**Independent Test**: Can be tested by creating a feature with two analyze report snapshots (scores 45 and 72). Verify the trend indicator shows an upward arrow or "improving" label.

**Acceptance Scenarios**:

1. **Given** a feature with two or more analyze runs showing scores 45, 60, and 72, **When** the health gauge loads, **Then** a trend indicator (upward arrow) shows next to the score, indicating improvement
2. **Given** a feature with analyze runs showing scores 85, 70, and 55, **When** the health gauge loads, **Then** a trend indicator (downward arrow) shows next to the score, indicating decline
3. **Given** a feature with only one analyze run, **When** the health gauge loads, **Then** no trend indicator is displayed

---

### User Story 5 - See Analyze View Update in Real Time (Priority: P3)

While the Analyze view is open, the developer watches updates happen live. When the analyze report file is regenerated (by re-running /iikit-07-analyze), the heatmap, severity table, and health gauge update to reflect the new results. The developer sees consistency evolve without manually refreshing the dashboard.

**Why this priority**: Real-time updates are a constitutional principle. However, analyze runs are heavier than simple file parsing, and artifacts change less frequently during the analyze phase, making this lower priority than real-time in other views.

**Independent Test**: Can be tested by opening the Analyze view, then externally modifying tasks.md to add a reference to a previously uncovered requirement. Verify the heatmap cell changes from red to green within 5 seconds.

**Acceptance Scenarios**:

1. **Given** the heatmap shows FR-004 as uncovered in the tasks column (red cell), **When** the developer re-runs /iikit-07-analyze after adding a task referencing FR-004, **Then** the heatmap cell for FR-004/tasks transitions from red to green within 5 seconds of the report file updating
2. **Given** the severity table shows 5 issues, **When** the developer re-runs /iikit-07-analyze after fixing a constitution violation, **Then** the severity table removes the resolved issue and the count decreases within 5 seconds
3. **Given** the health gauge shows a score of 65, **When** the analyze report is regenerated with improved coverage, **Then** the gauge score updates to reflect the new analysis within 5 seconds

---

### Edge Cases

- What happens when no analyze report data exists for the selected feature? (Show an empty state suggesting the user run /iikit-07-analyze)
- What happens when spec.md has no FR-xxx or SC-xxx identifiers? (Heatmap shows zero rows with a note "No requirements found in spec.md")
- What happens when the analyze report references artifacts that no longer exist on disk? (The dashboard renders the report as-is — stale detection is the responsibility of /iikit-07-analyze, not the dashboard. Re-run /iikit-07-analyze to get an updated report)
- What happens when there are 0 issues in the severity table? (Show a success message: "No issues found — all artifacts are consistent")
- What happens when a feature has 20 requirements and 50 tasks? (Heatmap scrolls vertically for rows; columns remain fixed since there are only 3 artifact types)
- What happens when the health score factors produce a fractional result (e.g., 72.4)? (Round to nearest integer for display)
- What happens when CONSTITUTION.md is missing? (Constitution compliance shows as "N/A" in the health breakdown; score computed from remaining factors)
- How does the Analyze view animate on first load? (Gauge needle sweeps from 0 to the computed score; heatmap cells fade in row-by-row; severity table slides in — consistent with pipeline animation patterns)
- What happens when a cell represents partial coverage (e.g., task mentions the requirement in a comment but doesn't formally implement it)? (Yellow cell with tooltip explaining the partial match)
- What happens when the analyze report is very large (100+ issues)? (Severity table remains responsive and scrollable without scroll jank)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a coverage heatmap matrix with requirements/success criteria as rows and artifact types (tasks, tests, plan) as columns
- **FR-002**: System MUST parse functional requirements (FR-xxx) and success criteria (SC-xxx) from spec.md to populate heatmap rows
- **FR-003**: System MUST determine coverage status for each requirement-artifact cell by reading the structured analyze report produced by /iikit-07-analyze
- **FR-004**: System MUST color-code heatmap cells based on the coverage status provided by the analyze report: green (covered), yellow (partial), red (missing), gray (not applicable) — the dashboard renders the classification as-is without applying its own coverage logic
- **FR-005**: System MUST show the specific artifact references when a heatmap cell is clicked (e.g., "T-003 references FR-002")
- **FR-006**: System MUST display an issue severity table with columns: ID, Category, Severity, Location, Summary, Recommendation
- **FR-007**: System MUST sort the severity table by severity (critical first) by default
- **FR-008**: System MUST allow sorting the severity table by any column
- **FR-009**: System MUST allow filtering the severity table by category and severity level
- **FR-010**: System MUST display color-coded severity badges: red for critical, orange for high, yellow for medium, blue for low
- **FR-011**: System MUST expand issue rows on click to show full recommendation text
- **FR-012**: System MUST display a health score gauge showing a computed score from 0 to 100
- **FR-013**: System MUST compute the health score as an equal-weighted average (25% each) of: requirements coverage percentage, constitution compliance percentage, phase separation score, and test coverage percentage
- **FR-014**: System MUST color the health gauge in three zones: red (0-40), yellow (41-70), green (71-100)
- **FR-015**: System MUST show a breakdown tooltip on the health gauge detailing each scoring factor's contribution
- **FR-016**: System MUST show a trend indicator (improving/declining) when multiple analyze runs exist for the feature. If the analyze report does not include score history, the trend indicator is simply not rendered (graceful degradation)
- **FR-017**: System MUST update the heatmap, severity table, and health gauge in real time when the analyze report file changes on disk, within 5 seconds
- **FR-018**: System MUST show a meaningful empty state when no analyze data exists for the selected feature, suggesting the user run /iikit-07-analyze. When analysis.md exists but lacks specific sections, each sub-view shows its own empty state: gauge shows "N/A", heatmap shows "No coverage data", severity table shows "No issues found"
- **FR-023**: System MUST handle malformed or corrupted analysis.md gracefully — show the overall empty state rather than crashing, and render any sections that parse successfully
- **FR-019**: System MUST render as the Phase 7 (Analyze) content area within the pipeline tab navigation defined by 002-intent-flow-pipeline
- **FR-020**: System MUST handle typical project sizes: up to 20 requirements, 50 tasks, 30 test specs, and 100 issues without degraded usability
- **FR-021**: System MUST be accessible — heatmap data readable via screen reader (table semantics with row/column headers), gauge score announced, severity table navigable by keyboard
- **FR-022**: System MUST animate on first load: gauge needle sweeps to score, heatmap cells fade in row-by-row, severity table slides in — consistent with pipeline animation patterns

### Key Entities

- **Coverage Cell**: A single cell in the heatmap representing the coverage status of one requirement in one artifact type. Has a status (covered, partial, missing, not applicable) and optional artifact references
- **Analyze Issue**: A consistency problem found during analysis. Has an ID, category, severity, location (artifact and line), summary, and recommendation
- **Health Score**: A computed 0-100 alignment score derived from coverage, compliance, phase separation, and test coverage metrics. Has a current value, color zone, and optional trend direction
- **Score Factor**: One of the four components contributing to the health score. Has a name, value (percentage or count), and weight in the overall computation

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Developers can identify which requirements lack coverage in which artifacts within 5 seconds of viewing the Analyze phase
- **SC-002**: All heatmap cell colors accurately reflect the actual cross-reference state of requirements across artifacts with 100% accuracy
- **SC-003**: Developers can find the most severe consistency issues within 3 seconds using the default severity-sorted table
- **SC-004**: The health gauge score accurately reflects the computed alignment of spec-to-implementation within 1 point of the true value
- **SC-005**: Developers can filter the severity table to show only a specific category of issues in under 2 seconds
- **SC-006**: Changes to project artifacts are reflected in the Analyze view within 5 seconds
- **SC-007**: The Analyze visualization uses the same CSS custom properties (colors, spacing, shadows), font stack, border-radius tokens, and card/table patterns as the existing pipeline views (Testify, Plan, Checklist)
- **SC-008**: The heatmap, severity table, and health gauge render usably for up to 20 requirements, 100 issues, and 50 tasks without overlapping elements or scroll jank

## Out of Scope

- Automatically fixing issues found by the analysis — the view is strictly read-only
- Running the analyze phase from the dashboard — the view only displays pre-computed results from the /iikit-07-analyze report
- Comparing analysis across different features — each feature's analyze view is independent
- Customizing scoring weights for the health gauge — weights are fixed in the implementation
- Exporting analysis reports to external formats (PDF, CSV)

## Clarifications

### Session 2026-02-18

- Q: Should the dashboard compute coverage analysis by parsing raw artifacts, or consume a structured report from /iikit-07-analyze? -> A: Consume the structured report. The dashboard is the view of the iikit process, not the engine. Real-time means re-rendering when the report file changes, not watching source artifacts. [FR-003, FR-017, US-5, SC-006]
- Q: What relative weights should the four health score factors have? -> A: Equal weights — 25% each. Score is the average of the four percentage values. Simple and transparent. [FR-013, US-3, SC-004]
- Q: What distinguishes "partially covered" (yellow) from "fully covered" (green) in a heatmap cell? -> A: The dashboard renders the coverage status as provided by the analyze report with no dashboard-side classification logic. The analyze phase owns the definition; the dashboard just visualizes. [FR-004, US-1, SC-002]
- Q: Where should historical analyze scores be stored for the trend indicator? -> A: The analyze report should include score history (array of timestamped scores). Dashboard reads it from the report — no dashboard-side persistence. Requires upstream change to /iikit-07-analyze (see intent-integrity-chain/kit issue). [FR-016, US-4, SC-004]

## Dependencies

- **002-intent-flow-pipeline**: This feature renders as the Phase 7 (Analyze) tab content within the pipeline navigation defined by feature 002
