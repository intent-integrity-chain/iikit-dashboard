# Test Specifications: Analyze Consistency — Coverage Heatmap, Severity Table, Health Gauge

**Generated**: 2026-02-18
**Feature**: `spec.md` | **Plan**: `plan.md` | **Data Model**: `data-model.md`

## TDD Assessment

**Determination**: mandatory
**Confidence**: high
**Evidence**: "TDD MUST be used for all feature development" (Constitution §I), "Tests MUST be written before implementation code" (Constitution §I), "red-green-refactor cycle MUST be strictly followed" (Constitution §I)
**Reasoning**: Three MUST-level indicators with explicit TDD, test-first, and red-green-refactor keywords. TDD is non-negotiable per constitution.

---

<!--
DO NOT MODIFY TEST ASSERTIONS

These test specifications define the expected behavior derived from requirements.
During implementation:
- Fix code to pass tests, don't modify test assertions
- Structural changes (file organization, naming) are acceptable with justification
- Logic changes to assertions require explicit justification and re-review

If requirements change, re-run /iikit-05-testify to regenerate test specs.
-->

## From spec.md (Acceptance Tests)

### TS-001: Coverage heatmap renders with correct dimensions and color coding

**Source**: spec.md:User Story 1:scenario-1
**Type**: acceptance
**Priority**: P1

**Given**: a feature with spec.md containing 5 functional requirements and 3 success criteria, tasks.md, tests/test-specs.md, and plan.md each referencing different subsets of those requirements
**When**: the Analyze phase view loads
**Then**: a coverage heatmap renders with 8 rows (one per requirement/criterion) and 3 columns (tasks, tests, plan) with cells color-coded by coverage status

**Traceability**: FR-001, FR-002, FR-004, SC-001, SC-002, US-001-scenario-1

---

### TS-002: Heatmap cell correctly reflects per-artifact coverage status

**Source**: spec.md:User Story 1:scenario-2
**Type**: acceptance
**Priority**: P1

**Given**: FR-002 is referenced in tests/test-specs.md but not in tasks.md or plan.md
**When**: the heatmap renders
**Then**: the FR-002 row shows green for the tests column, red for the tasks column, and red for the plan column

**Traceability**: FR-003, FR-004, SC-002, US-001-scenario-2

---

### TS-003: Heatmap cell click reveals artifact references

**Source**: spec.md:User Story 1:scenario-3
**Type**: acceptance
**Priority**: P1

**Given**: the heatmap is displayed
**When**: the developer clicks a green or yellow cell
**Then**: the specific artifact references that constitute the coverage are shown (e.g., "T-003 references FR-002", "TS-005 verifies FR-002")

**Traceability**: FR-005, SC-001, US-001-scenario-3

---

### TS-004: Severity table renders all issues sorted by severity

**Source**: spec.md:User Story 2:scenario-1
**Type**: acceptance
**Priority**: P1

**Given**: an analyze report containing 10 issues of mixed severity and category
**When**: the severity table loads
**Then**: all 10 issues are displayed in a table with columns: ID, Category, Severity, Location, Summary, Recommendation — sorted by severity (critical first)

**Traceability**: FR-006, FR-007, FR-010, SC-003, US-002-scenario-1

---

### TS-005: Severity table filters by category

**Source**: spec.md:User Story 2:scenario-2
**Type**: acceptance
**Priority**: P1

**Given**: the severity table is displayed with issues across 3 categories
**When**: the developer selects the "coverage gap" filter
**Then**: only issues with category "coverage gap" are shown and other issues are hidden

**Traceability**: FR-009, SC-005, US-002-scenario-2

---

### TS-006: Severity table sorts by any column

**Source**: spec.md:User Story 2:scenario-3
**Type**: acceptance
**Priority**: P1

**Given**: a severity table with 10 issues
**When**: the developer clicks the "Category" column header
**Then**: the table re-sorts alphabetically by category

**Traceability**: FR-008, US-002-scenario-3

---

### TS-007: Severity table row expands to show full recommendation

**Source**: spec.md:User Story 2:scenario-4
**Type**: acceptance
**Priority**: P1

**Given**: a critical issue with a long recommendation
**When**: the developer clicks the issue row
**Then**: the row expands to show the full recommendation text

**Traceability**: FR-011, US-002-scenario-4

---

### TS-008: Health gauge displays score in green zone

**Source**: spec.md:User Story 3:scenario-1
**Type**: acceptance
**Priority**: P2

**Given**: an analyze report with 80% requirements coverage, 100% constitution compliance, no phase separation violations, and 90% test coverage
**When**: the Analyze view loads
**Then**: a health gauge displays a score in the green zone (71-100) with the needle/indicator positioned at the computed value

**Traceability**: FR-012, FR-013, FR-014, SC-004, US-003-scenario-1

---

### TS-009: Health gauge breakdown tooltip shows factor contributions

**Source**: spec.md:User Story 3:scenario-2
**Type**: acceptance
**Priority**: P2

**Given**: a health gauge is displayed
**When**: the developer hovers over or clicks the gauge
**Then**: a breakdown tooltip appears showing the contribution of each factor: requirements coverage %, constitution compliance %, phase separation score, test coverage %

**Traceability**: FR-015, SC-004, US-003-scenario-2

---

### TS-010: Health gauge displays score in red zone for poor alignment

**Source**: spec.md:User Story 3:scenario-3
**Type**: acceptance
**Priority**: P2

**Given**: an analyze report with 30% requirements coverage and 3 constitution violations
**When**: the Analyze view loads
**Then**: the health gauge shows a score in the red zone (0-40)

**Traceability**: FR-012, FR-013, FR-014, SC-004, US-003-scenario-3

---

### TS-011: Health gauge shows no trend for first analyze run

**Source**: spec.md:User Story 3:scenario-4
**Type**: acceptance
**Priority**: P2

**Given**: a feature with no previous analyze runs
**When**: the Analyze view loads
**Then**: the gauge shows the current score without a trend indicator

**Traceability**: FR-016, US-003-scenario-4

---

### TS-012: Trend indicator shows improvement across multiple runs

**Source**: spec.md:User Story 4:scenario-1
**Type**: acceptance
**Priority**: P3

**Given**: a feature with two or more analyze runs showing scores 45, 60, and 72
**When**: the health gauge loads
**Then**: a trend indicator (upward arrow) shows next to the score, indicating improvement

**Traceability**: FR-016, US-004-scenario-1

---

### TS-013: Trend indicator shows decline across multiple runs

**Source**: spec.md:User Story 4:scenario-2
**Type**: acceptance
**Priority**: P3

**Given**: a feature with analyze runs showing scores 85, 70, and 55
**When**: the health gauge loads
**Then**: a trend indicator (downward arrow) shows next to the score, indicating decline

**Traceability**: FR-016, US-004-scenario-2

---

### TS-014: No trend indicator for single analyze run

**Source**: spec.md:User Story 4:scenario-3
**Type**: acceptance
**Priority**: P3

**Given**: a feature with only one analyze run
**When**: the health gauge loads
**Then**: no trend indicator is displayed

**Traceability**: FR-016, US-004-scenario-3

---

### TS-015: Heatmap updates in real time when report changes

**Source**: spec.md:User Story 5:scenario-1
**Type**: acceptance
**Priority**: P3

**Given**: the heatmap shows FR-004 as uncovered in the tasks column (red cell)
**When**: the developer re-runs /iikit-07-analyze after adding a task referencing FR-004
**Then**: the heatmap cell for FR-004/tasks transitions from red to green within 5 seconds of the report file updating

**Traceability**: FR-017, SC-006, US-005-scenario-1

---

### TS-016: Severity table updates in real time when issues resolve

**Source**: spec.md:User Story 5:scenario-2
**Type**: acceptance
**Priority**: P3

**Given**: the severity table shows 5 issues
**When**: the developer re-runs /iikit-07-analyze after fixing a constitution violation
**Then**: the severity table removes the resolved issue and the count decreases within 5 seconds

**Traceability**: FR-017, SC-006, US-005-scenario-2

---

### TS-017: Health gauge updates in real time on re-analysis

**Source**: spec.md:User Story 5:scenario-3
**Type**: acceptance
**Priority**: P3

**Given**: the health gauge shows a score of 65
**When**: the analyze report is regenerated with improved coverage
**Then**: the gauge score updates to reflect the new analysis within 5 seconds

**Traceability**: FR-017, SC-006, US-005-scenario-3

---

### TS-018: Empty state when no analyze data exists

**Source**: spec.md:Edge Cases:no-data
**Type**: acceptance
**Priority**: P1

**Given**: a selected feature with no analysis.md file on disk
**When**: the Analyze phase view loads
**Then**: an empty state is shown suggesting the user run /iikit-07-analyze

**Traceability**: FR-018, US-edge-no-data

---

### TS-019: Heatmap shows zero rows when spec has no requirements

**Source**: spec.md:Edge Cases:no-requirements
**Type**: acceptance
**Priority**: P2

**Given**: spec.md has no FR-xxx or SC-xxx identifiers
**When**: the Analyze phase view loads
**Then**: the heatmap shows zero rows with a note "No requirements found in spec.md"

**Traceability**: FR-002, FR-018, US-edge-no-requirements

---

### TS-020: Severity table shows success message when zero issues

**Source**: spec.md:Edge Cases:no-issues
**Type**: acceptance
**Priority**: P2

**Given**: the analyze report contains 0 issues
**When**: the severity table loads
**Then**: a success message is shown: "No issues found — all artifacts are consistent"

**Traceability**: FR-006, FR-018, US-edge-no-issues

---

### TS-021: Heatmap scrolls vertically for many requirements

**Source**: spec.md:Edge Cases:many-requirements
**Type**: acceptance
**Priority**: P2

**Given**: a feature with 20 requirements and 50 tasks
**When**: the heatmap renders
**Then**: the heatmap scrolls vertically for rows while columns remain fixed (3 artifact types)

**Traceability**: FR-020, SC-008, US-edge-many-requirements

---

### TS-022: Health score rounds fractional values to nearest integer

**Source**: spec.md:Edge Cases:fractional-score
**Type**: acceptance
**Priority**: P2

**Given**: health score factors produce a fractional result (e.g., 72.4)
**When**: the gauge renders
**Then**: the displayed score is rounded to the nearest integer (72)

**Traceability**: FR-013, SC-004, US-edge-fractional-score

---

### TS-023: Health gauge handles missing CONSTITUTION.md

**Source**: spec.md:Edge Cases:no-constitution
**Type**: acceptance
**Priority**: P2

**Given**: CONSTITUTION.md is missing
**When**: the Analyze view loads
**Then**: constitution compliance shows as "N/A" in the health breakdown and the score is computed from the remaining factors

**Traceability**: FR-013, FR-015, US-edge-no-constitution

---

### TS-024: Load animations play on first render

**Source**: spec.md:Edge Cases:animation
**Type**: acceptance
**Priority**: P2

**Given**: the Analyze view is navigated to for the first time
**When**: the content area loads
**Then**: the gauge needle sweeps from 0 to the computed score, heatmap cells fade in row-by-row, and the severity table slides in

**Traceability**: FR-022, US-edge-animation

---

### TS-025: Partial coverage shown as yellow cell with tooltip

**Source**: spec.md:Edge Cases:partial-coverage
**Type**: acceptance
**Priority**: P2

**Given**: a cell represents partial coverage (task mentions the requirement in a comment but doesn't formally implement it)
**When**: the heatmap renders
**Then**: a yellow cell is displayed with a tooltip explaining the partial match

**Traceability**: FR-004, FR-005, SC-002, US-edge-partial-coverage

---

### TS-026: Severity table handles large issue counts

**Source**: spec.md:Edge Cases:many-issues
**Type**: acceptance
**Priority**: P2

**Given**: the analyze report contains 100+ issues
**When**: the severity table loads
**Then**: the table remains responsive and scrollable without scroll jank

**Traceability**: FR-020, SC-008, US-edge-many-issues

---

### TS-027: Analyze view renders as Phase 7 tab content

**Source**: spec.md:FR-019
**Type**: acceptance
**Priority**: P1

**Given**: the pipeline tab navigation is displayed
**When**: the user clicks the Analyze (Phase 7) tab
**Then**: the Analyze content area renders within the pipeline navigation defined by 002-intent-flow-pipeline

**Traceability**: FR-019, SC-007

---

### TS-028: Heatmap is accessible via screen reader

**Source**: spec.md:FR-021
**Type**: acceptance
**Priority**: P1

**Given**: the heatmap table is rendered with data
**When**: a screen reader navigates the table
**Then**: the data is readable with proper table semantics (row/column headers via th scope attributes), and coverage status is communicated via aria-label (not color alone)

**Traceability**: FR-021, SC-001

---

### TS-029: Severity table is keyboard navigable

**Source**: spec.md:FR-021
**Type**: acceptance
**Priority**: P1

**Given**: the severity table is rendered
**When**: the developer uses keyboard navigation (Tab, Enter)
**Then**: sortable headers and expandable rows are reachable and activatable via keyboard

**Traceability**: FR-021, SC-003

---

### TS-030: Severity badges are color-coded by level

**Source**: spec.md:FR-010
**Type**: acceptance
**Priority**: P1

**Given**: the severity table has issues of all severity levels
**When**: the table renders
**Then**: badges are displayed as: red for critical, orange for high, yellow for medium, blue for low

**Traceability**: FR-010, SC-003

---

### TS-031: Sub-view empty states when analysis.md lacks sections

**Source**: spec.md:FR-018
**Type**: acceptance
**Priority**: P1

**Given**: analysis.md exists but lacks the Coverage Summary section
**When**: the Analyze view loads
**Then**: the gauge shows "N/A", the heatmap shows "No coverage data", and the severity table shows "No issues found" for missing sections, while present sections render normally

**Traceability**: FR-018, FR-023

---

### TS-032: Graceful handling of malformed analysis.md

**Source**: spec.md:FR-023
**Type**: acceptance
**Priority**: P1

**Given**: analysis.md exists but contains corrupted or malformed markdown
**When**: the Analyze view loads
**Then**: the overall empty state is shown rather than crashing, and any sections that parse successfully are rendered

**Traceability**: FR-023

---

## From plan.md (Contract Tests)

### TS-033: GET /api/analyze/:feature returns full analyze state

**Source**: plan.md:API Contract:GET-analyze-success
**Type**: contract
**Priority**: P1

**Given**: a feature directory contains a valid analysis.md file
**When**: GET /api/analyze/:feature is called
**Then**: the response is JSON with shape: `{ healthScore: { score, zone, factors, trend }, heatmap: { columns, rows }, issues: [...], metrics: {...}, constitutionAlignment: [...], exists: true }` where score is 0-100, zone is "red"/"yellow"/"green", columns is ["tasks", "tests", "plan"], rows have id/text/cells, issues have id/category/severity/location/summary/recommendation/resolved

**Traceability**: plan.md:API Contract

---

### TS-034: GET /api/analyze/:feature returns empty state when no analysis.md

**Source**: plan.md:API Contract:GET-analyze-empty
**Type**: contract
**Priority**: P1

**Given**: a feature directory has no analysis.md file
**When**: GET /api/analyze/:feature is called
**Then**: the response is JSON with shape: `{ healthScore: null, heatmap: { columns: [], rows: [] }, issues: [], metrics: null, constitutionAlignment: [], exists: false }`

**Traceability**: plan.md:API Contract

---

### TS-035: WebSocket pushes analyze_update on file change

**Source**: plan.md:API Contract:WS-analyze-update
**Type**: contract
**Priority**: P1

**Given**: a WebSocket client is connected and a feature's analysis.md exists
**When**: analysis.md is modified on disk
**Then**: the server sends a WebSocket message with type "analyze_update", feature name, and the full analyze state object

**Traceability**: plan.md:WebSocket Message, FR-017

---

### TS-036: Health score factors have correct JSON structure

**Source**: plan.md:API Contract:healthScore-factors
**Type**: contract
**Priority**: P1

**Given**: analysis.md has all four health score components
**When**: the healthScore is computed
**Then**: factors object contains exactly four keys: requirementsCoverage, constitutionCompliance, phaseSeparation, testCoverage — each with { value: number, label: string }

**Traceability**: plan.md:API Contract, FR-013

---

### TS-037: Heatmap row cells have correct JSON structure

**Source**: plan.md:API Contract:heatmap-rows
**Type**: contract
**Priority**: P1

**Given**: analysis.md has coverage data for requirements
**When**: the heatmap is computed
**Then**: each row has { id: string, text: string, cells: { tasks: { status, refs }, tests: { status, refs }, plan: { status, refs } } } where status is one of "covered", "partial", "missing", "na" and refs is a string array

**Traceability**: plan.md:API Contract, FR-001, FR-004

---

### TS-038: Issue objects have correct JSON structure

**Source**: plan.md:API Contract:issues-shape
**Type**: contract
**Priority**: P1

**Given**: analysis.md has findings
**When**: the issues are parsed
**Then**: each issue has { id: string, category: string, severity: string, location: string, summary: string, recommendation: string, resolved: boolean }

**Traceability**: plan.md:API Contract, FR-006

---

## From data-model.md (Validation Tests)

### TS-039: parseAnalysisFindings extracts findings from markdown table

**Source**: data-model.md:AnalysisFinding:parsing-rule
**Type**: validation
**Priority**: P1

**Given**: analysis.md content contains a `## Findings` section with a pipe-delimited markdown table of issues
**When**: parseAnalysisFindings(content) is called
**Then**: returns an array of AnalysisFinding objects with id, category, severity, resolved (false), location, summary, and recommendation fields extracted from each table row

**Traceability**: data-model.md:AnalysisFinding, FR-006

---

### TS-040: parseAnalysisFindings detects resolved findings via strikethrough

**Source**: data-model.md:AnalysisFinding:resolved-pattern
**Type**: validation
**Priority**: P1

**Given**: analysis.md Findings table has a row where severity column contains `~~CRITICAL~~ RESOLVED`
**When**: parseAnalysisFindings(content) is called
**Then**: the finding object has resolved: true and severity: "CRITICAL"

**Traceability**: data-model.md:AnalysisFinding, FR-006

---

### TS-041: parseAnalysisFindings returns empty array for no-findings state

**Source**: data-model.md:AnalysisFinding:empty-state
**Type**: validation
**Priority**: P1

**Given**: analysis.md Findings section contains "No CRITICAL issues found" text without a table
**When**: parseAnalysisFindings(content) is called
**Then**: returns an empty array

**Traceability**: data-model.md:AnalysisFinding, FR-018

---

### TS-042: parseAnalysisCoverage handles simple table format

**Source**: data-model.md:CoverageEntry:simple-format
**Type**: validation
**Priority**: P1

**Given**: analysis.md Coverage Summary section has a table with columns: Requirement, Has Task?, Notes
**When**: parseAnalysisCoverage(content) is called
**Then**: returns CoverageEntry objects with id, hasTask (boolean from "Yes"/"No"), taskIds (empty), hasTest (false), testIds (empty), status (null), and notes

**Traceability**: data-model.md:CoverageEntry, FR-003

---

### TS-043: parseAnalysisCoverage handles detailed table format

**Source**: data-model.md:CoverageEntry:detailed-format
**Type**: validation
**Priority**: P1

**Given**: analysis.md Coverage Summary section has a table with columns: Requirement, Has Task?, Task IDs, Has Test?, Test IDs, Status
**When**: parseAnalysisCoverage(content) is called
**Then**: returns CoverageEntry objects with id, hasTask (boolean), taskIds (array of strings), hasTest (boolean), testIds (array of strings), and status

**Traceability**: data-model.md:CoverageEntry, FR-003

---

### TS-044: parseAnalysisMetrics extracts metrics from table format

**Source**: data-model.md:AnalysisMetrics:table-format
**Type**: validation
**Priority**: P1

**Given**: analysis.md Metrics section has a `| Metric | Value |` table
**When**: parseAnalysisMetrics(content) is called
**Then**: returns an AnalysisMetrics object with totalRequirements, totalTasks, totalTestSpecs, requirementCoverage (raw string), requirementCoveragePct (number), criticalIssues, highIssues, mediumIssues, lowIssues

**Traceability**: data-model.md:AnalysisMetrics, FR-013

---

### TS-045: parseAnalysisMetrics extracts metrics from bullet list format

**Source**: data-model.md:AnalysisMetrics:bullet-format
**Type**: validation
**Priority**: P1

**Given**: analysis.md Metrics section has `- Metric: Value` bullet items
**When**: parseAnalysisMetrics(content) is called
**Then**: returns the same AnalysisMetrics object with all fields populated

**Traceability**: data-model.md:AnalysisMetrics, FR-013

---

### TS-046: parseAnalysisMetrics extracts percentage from coverage strings

**Source**: data-model.md:AnalysisMetrics:percentage-extraction
**Type**: validation
**Priority**: P1

**Given**: requirementCoverage is "28/28 (100%)" and testCoverage is "85%"
**When**: parseAnalysisMetrics extracts percentage values
**Then**: requirementCoveragePct is 100 and testCoveragePct is 85

**Traceability**: data-model.md:AnalysisMetrics, FR-013

---

### TS-047: parseAnalysisMetrics defaults testCoveragePct to 100 when absent

**Source**: data-model.md:AnalysisMetrics:test-coverage-absent
**Type**: validation
**Priority**: P2

**Given**: analysis.md Metrics section has no test coverage entry
**When**: parseAnalysisMetrics(content) is called
**Then**: testCoveragePct defaults to 100

**Traceability**: data-model.md:AnalysisMetrics, FR-013

---

### TS-048: parseConstitutionAlignment extracts alignment table

**Source**: data-model.md:ConstitutionAlignmentEntry:normal
**Type**: validation
**Priority**: P1

**Given**: analysis.md Constitution Alignment section has a table with Principle, Status, Evidence columns
**When**: parseConstitutionAlignment(content) is called
**Then**: returns an array of ConstitutionAlignmentEntry objects with principle, status ("ALIGNED"/"VIOLATION"/"PARTIAL"), and evidence

**Traceability**: data-model.md:ConstitutionAlignmentEntry, FR-013

---

### TS-049: parseConstitutionAlignment returns empty array for absent section

**Source**: data-model.md:ConstitutionAlignmentEntry:empty
**Type**: validation
**Priority**: P1

**Given**: analysis.md has no Constitution Alignment section or section says "None detected"
**When**: parseConstitutionAlignment(content) is called
**Then**: returns an empty array

**Traceability**: data-model.md:ConstitutionAlignmentEntry, FR-018

---

### TS-050: parsePhaseSeparation extracts violation entries

**Source**: data-model.md:PhaseSeparationEntry:table
**Type**: validation
**Priority**: P1

**Given**: analysis.md Phase Separation Violations section has a table of violations
**When**: parsePhaseSeparation(content) is called
**Then**: returns an array of PhaseSeparationEntry objects with artifact, status, and severity

**Traceability**: data-model.md:PhaseSeparationEntry, FR-013

---

### TS-051: parsePhaseSeparation returns empty array for "None detected"

**Source**: data-model.md:PhaseSeparationEntry:none
**Type**: validation
**Priority**: P1

**Given**: analysis.md Phase Separation Violations section says "None detected"
**When**: parsePhaseSeparation(content) is called
**Then**: returns an empty array

**Traceability**: data-model.md:PhaseSeparationEntry, FR-013

---

### TS-052: Health score computed as equal-weighted average of four factors

**Source**: data-model.md:HealthScore:computation
**Type**: validation
**Priority**: P1

**Given**: requirementsCoverage = 80, constitutionCompliance = 100, phaseSeparation = 100, testCoverage = 90
**When**: the health score is computed
**Then**: score = Math.round((80 + 100 + 100 + 90) / 4) = 93

**Traceability**: data-model.md:HealthScore, FR-013, SC-004

---

### TS-053: Health score zone assignment follows color boundaries

**Source**: data-model.md:HealthScore:zones
**Type**: validation
**Priority**: P1

**Given**: computed scores of 0, 40, 41, 70, 71, and 100
**When**: the zone is determined for each score
**Then**: 0 -> "red", 40 -> "red", 41 -> "yellow", 70 -> "yellow", 71 -> "green", 100 -> "green"

**Traceability**: data-model.md:HealthScore, FR-014

---

### TS-054: Phase separation score applies severity penalties

**Source**: data-model.md:HealthScore:phase-separation-penalty
**Type**: validation
**Priority**: P1

**Given**: phase separation violations with 1 CRITICAL (25) and 2 MEDIUM (5 each)
**When**: the phase separation factor is computed
**Then**: phaseSeparation = max(0, 100 - 25 - 5 - 5) = 65

**Traceability**: data-model.md:HealthScore, FR-013

---

### TS-055: Phase separation score floors at 0

**Source**: data-model.md:HealthScore:floor
**Type**: validation
**Priority**: P2

**Given**: phase separation violations totaling penalty > 100 (e.g., 5 CRITICAL = 125)
**When**: the phase separation factor is computed
**Then**: phaseSeparation = 0 (floored, not negative)

**Traceability**: data-model.md:HealthScore, FR-013

---

### TS-056: Constitution compliance percentage computed from alignment entries

**Source**: data-model.md:HealthScore:constitution-compliance
**Type**: validation
**Priority**: P1

**Given**: 4 constitution alignment entries: 3 ALIGNED, 1 VIOLATION
**When**: constitutionCompliance is computed
**Then**: constitutionCompliance = Math.round((3 / 4) * 100) = 75

**Traceability**: data-model.md:HealthScore, FR-013

---

### TS-057: Heatmap row assembly combines spec requirements with coverage data

**Source**: data-model.md:HeatmapRow:assembly
**Type**: validation
**Priority**: P1

**Given**: spec.md contains FR-001 "System MUST display heatmap" and coverage data shows FR-001 has tasks (T-003) and tests (TS-001) but no plan reference
**When**: heatmap rows are assembled
**Then**: row has id "FR-001", text "System MUST display heatmap", cells: tasks={status:"covered", refs:["T-003"]}, tests={status:"covered", refs:["TS-001"]}, plan={status:"missing", refs:[]}

**Traceability**: data-model.md:HeatmapRow, data-model.md:CellStatus, FR-001, FR-003

---

### TS-058: Cell status maps coverage entry boolean to status string

**Source**: data-model.md:CellStatus:mapping
**Type**: validation
**Priority**: P1

**Given**: a CoverageEntry with hasTask=true/taskIds=["T-001"], hasTask=false/taskIds=[], and status="Partial"
**When**: cell status is derived
**Then**: hasTask true with IDs -> "covered", hasTask false with no IDs -> "missing", status "Partial" -> "partial"

**Traceability**: data-model.md:CellStatus, FR-004

---

## Summary

| Source | Count | Types |
|--------|-------|-------|
| spec.md | 32 | acceptance |
| plan.md | 6 | contract |
| data-model.md | 20 | validation |
| **Total** | **58** | |
