# Data Model: Analyze Consistency

**Feature**: 008-analyze-consistency | **Date**: 2026-02-18

## Entities

### AnalysisFinding

An issue found during cross-artifact consistency analysis, extracted from the `## Findings` table in analysis.md. Exposed as `issues` in the API response (user-facing terminology).

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| id | string | analysis.md | Finding ID (e.g., "A1", "F01") |
| category | string | analysis.md | One of: "Coverage Gap", "Inconsistency", "Ambiguity", "Underspecification", "Duplication", "Constitution", "Phase Separation" |
| severity | string | analysis.md | One of: "CRITICAL", "HIGH", "MEDIUM", "LOW" |
| resolved | boolean | analysis.md | True if severity has `~~SEVERITY~~ RESOLVED` strikethrough pattern |
| location | string | analysis.md | Artifact and position (e.g., "spec.md:FR-002", "plan.md:45") |
| summary | string | analysis.md | Brief description of the issue |
| recommendation | string | analysis.md | Suggested fix or action |

**Parsing rule**: Match the markdown table under `## Findings`. Each row is pipe-delimited. Detect resolved status from `~~...~~ RESOLVED` pattern in the Severity column. If section contains "No CRITICAL issues found" or similar text without a table, return empty array.

### CoverageEntry

A single requirement's coverage status across artifacts, extracted from the `## Coverage Summary` table.

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| id | string | analysis.md | Requirement ID (e.g., "FR-001", "SC-003") |
| hasTask | boolean | analysis.md | Whether tasks.md covers this requirement |
| taskIds | string[] | analysis.md | Task IDs (e.g., ["T-003", "T-005"]) |
| hasTest | boolean | analysis.md | Whether test-specs.md covers this requirement |
| testIds | string[] | analysis.md | Test spec IDs (e.g., ["TS-001"]) |
| status | string | analysis.md | "Full", "Partial", "Remediated", "Bug fix", or null |
| notes | string | analysis.md | Additional notes from the table |

**Parsing rule**: Match the markdown table(s) under `## Coverage Summary`. Handles two formats:
- Simple: `| Requirement | Has Task? | Notes |`
- Detailed: `| Requirement | Has Task? | Task IDs | Has Test? | Test IDs | Status |`

Extract task/test IDs from pipe-delimited cells. "Yes" → true, "No"/"Partial" → false/partial.

### AnalysisMetrics

Aggregate metrics from the `## Metrics` section.

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| totalRequirements | number | analysis.md | Count of FR + SC |
| totalTasks | number | analysis.md | Count of tasks |
| totalTestSpecs | number | analysis.md | Count of test specs (may be absent in simple reports) |
| requirementCoverage | string | analysis.md | Raw coverage string (e.g., "28/28 (100%)") |
| requirementCoveragePct | number | computed | Extracted percentage (e.g., 100) |
| testCoverage | string \| null | analysis.md | Raw test coverage string (may be absent) |
| testCoveragePct | number | computed | Extracted percentage; 100 if absent (no tests needed) |
| criticalIssues | number | analysis.md | Count of critical findings |
| highIssues | number | analysis.md | Count of high findings |
| mediumIssues | number | analysis.md | Count of medium findings |
| lowIssues | number | analysis.md | Count of low findings |

**Parsing rule**: Match `## Metrics` section. Extract `| Metric | Value |` rows or `- Metric: Value` list items. Parse percentage from strings like "28/28 (100%)" or "100%". Handle both table and bullet-list metric formats (both exist across features).

### ConstitutionAlignmentEntry

A constitution principle's compliance status from the `## Constitution Alignment` table.

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| principle | string | analysis.md | Principle name (e.g., "I. Test-First") |
| status | string | analysis.md | "ALIGNED", "VIOLATION", or "PARTIAL" |
| evidence | string | analysis.md | Description of compliance or violation |

**Parsing rule**: Match `## Constitution Alignment` table. Each row has Principle, Status, Evidence columns. If section says "None detected" or is absent, return empty array.

### PhaseSeparationEntry

A phase separation violation from the `## Phase Separation Violations` section.

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| artifact | string | analysis.md | Source artifact (e.g., "plan.md") |
| status | string | analysis.md | "Clean" or description of violation |
| severity | string \| null | analysis.md | Violation severity if applicable |

**Parsing rule**: Match `## Phase Separation Violations` section. May be a table or "None detected" text.

### HealthScore

Computed alignment score from 0-100, derived from analysis data.

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| score | number | computed | 0-100, equal-weighted average of 4 factors |
| zone | string | computed | "red" (0-40), "yellow" (41-70), "green" (71-100) |
| factors | object | computed | Four factor values (see below) |
| trend | string \| null | analysis.md | "improving", "declining", or null (if no history) |

**Factor computation**:
- `requirementsCoverage`: from metrics `requirementCoveragePct`
- `constitutionCompliance`: (ALIGNED count / total principles) * 100
- `phaseSeparation`: 100 - sum(penalties). CRITICAL=25, HIGH=15, MEDIUM=5, LOW=2. Floor at 0
- `testCoverage`: from metrics `testCoveragePct`

### HeatmapRow

A row in the coverage heatmap representing one requirement.

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| id | string | spec.md | Requirement ID (FR-xxx or SC-xxx) |
| text | string | spec.md | Requirement text |
| cells | object | analysis.md + spec.md | `{tasks: CellStatus, tests: CellStatus, plan: CellStatus}` |

### CellStatus

Coverage status for one requirement in one artifact type.

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| status | string | analysis.md | "covered", "partial", "missing", "na" |
| refs | string[] | analysis.md | Specific IDs (e.g., ["T-003", "TS-001"]) |

## Data Flow

```
analysis.md ──parse──→ AnalysisFinding[] ──→ severity table
                      → CoverageEntry[]  ──→ heatmap cells
                      → AnalysisMetrics   ──→ health score factors
                      → ConstitutionAlignmentEntry[] ──→ health score factors
                      → PhaseSeparationEntry[] ──→ health score factors

spec.md ──parse──→ Requirement[] + SuccessCriteria[] ──→ heatmap row labels

                ──compute──→ HealthScore ──→ gauge
```
