# Analyze Visualization Quality Checklist: 008-analyze-consistency

**Purpose**: Validate requirements completeness, clarity, and consistency for the Analyze Consistency dashboard view
**Created**: 2026-02-18
**Feature**: [spec.md](../spec.md)

## Requirement Completeness

- [x] CHK-001 Are all three sub-views (heatmap, severity table, health gauge) specified with measurable rendering criteria? [Completeness, FR-001, FR-006, FR-012] — FR-001 defines heatmap matrix structure, FR-006 defines table columns, FR-012 defines gauge 0-100 range. SC-001/003/004 add measurable time/accuracy criteria
- [x] CHK-002 Are the heatmap cell color mappings exhaustively defined for all possible coverage states? [Completeness, FR-004] — FR-004 defines four states: green (covered), yellow (partial), red (missing), gray (not applicable)
- [x] CHK-003 Are the severity table column definitions complete with data types and display format for each column? [Completeness, FR-006] — FR-006 lists: ID, Category, Severity, Location, Summary, Recommendation. FR-010 adds severity badge colors
- [x] CHK-004 Is the health score formula fully specified with all four factor definitions and boundary behavior? [Completeness, FR-013] — FR-013 defines equal-weighted average (25% each) of four named factors. Clarification Q2 confirms equal weights
- [x] CHK-005 Are empty state requirements defined for each sub-view independently (not just the overall empty state)? [Completeness, FR-018] — RESOLVED: Updated FR-018 to define per-sub-view empty states: gauge "N/A", heatmap "No coverage data", severity table "No issues found"
- [x] CHK-006 Is the data source for each sub-view explicitly traced to a section of analysis.md? [Completeness, FR-003] — FR-003 traces to "structured analyze report." Clarification Q1 confirms dashboard consumes report, doesn't compute. Plan KDD-2 maps parsers to specific sections
- [x] CHK-007 Are the heatmap cell click interaction requirements complete — what information is shown and how? [Completeness, FR-005] — FR-005 specifies showing "specific artifact references" with example format "T-003 references FR-002". US-1 scenario 3 adds testable scenario
- [x] CHK-008 Is the severity table filter UI specified — dropdown, checkbox, toggle, or other mechanism? [Completeness, FR-009] — FR-009 states "allow filtering by category and severity level." US-2 scenario 2 says "selects the filter" — mechanism deferred to implementation per Constitution IV (Simplicity)

## Clarity

- [x] CHK-009 Is the distinction between "partial" (yellow) and "missing" (red) coverage unambiguously defined? [Clarity, FR-004, Clarification Q3] — Clarification Q3 explicitly delegates: "dashboard renders the coverage status as provided by the analyze report with no dashboard-side classification logic." The distinction is owned by /iikit-07-analyze, not this feature
- [x] CHK-010 Are the health gauge color zone boundaries specified with exact numeric thresholds (not approximate ranges)? [Clarity, FR-014] — FR-014 states exact ranges: red (0-40), yellow (41-70), green (71-100)
- [x] CHK-011 Is the severity sort order explicitly defined for all severity levels used in the system? [Clarity, FR-007, FR-010] — RESOLVED: Updated FR-010 to four levels matching analysis.md: critical, high, medium, low with distinct colors (red, orange, yellow, blue). Sort order: critical first per FR-007
- [x] CHK-012 Are the four health score factor computation rules specified with enough precision to produce deterministic results? [Clarity, FR-013, SC-004] — FR-013 defines "equal-weighted average (25% each)" of four named percentages. SC-004 requires accuracy "within 1 point." Plan KDD-3 adds precise formula
- [x] CHK-013 Is "within 5 seconds" (SC-006) measured from when — file write completion, file watcher detection, or server processing? [Clarity, SC-006] — Accepted: "within 5s" is measured from file change on disk to UI update, same as all other features (005-SC-005, 007-SC-006). Established project convention
- [x] CHK-014 Are the animation requirements (FR-022) specified with enough detail to be testable — duration, easing, sequence? [Clarity, FR-022] — Accepted: FR-022 specifies what animates and "consistent with pipeline animation patterns." Duration/easing are visual polish deferred to implementation per Constitution IV

## Consistency

- [x] CHK-015 Are the severity level names consistent between FR-010 ("critical, high, medium, low") and the analyze report format ("CRITICAL, HIGH, MEDIUM, LOW")? [Consistency, FR-010, US-2] — RESOLVED: Updated FR-010 to use four levels matching analysis.md format: critical, high, medium, low
- [x] CHK-016 Is the "Phase 7" numbering in FR-019 consistent with the pipeline phase numbering defined in 002-intent-flow-pipeline? [Consistency, FR-019] — Analyze is the 8th phase (0-indexed: 7). FR-019 says "Phase 7 (Analyze)" which matches the 0-indexed pipeline convention
- [x] CHK-017 Are the scale limits in FR-020 ("20 requirements, 50 tasks, 30 test specs, 100 issues") consistent with SC-008 ("20 requirements, 100 issues, 50 tasks")? [Consistency, FR-020, SC-008] — Both cite 20 requirements and 100 issues. FR-020 adds 50 tasks and 30 test specs. SC-008 adds 50 tasks. Consistent — SC-008 is a subset of FR-020 limits
- [x] CHK-018 Is the trend indicator requirement (FR-016) consistent with the clarification that trend data requires an upstream change to /iikit-07-analyze? [Consistency, FR-016, Clarification Q4] — FR-016 states the requirement. Clarification Q4 documents the dependency. Plan KDD-7 specifies graceful degradation (no trend shown if no history data). Consistent — feature degrades gracefully

## Acceptance Criteria Quality

- [x] CHK-019 Does every P1 user story have acceptance scenarios covering both positive and negative paths? [Acceptance Criteria, US-1, US-2] — US-1 has 3 scenarios (matrix rendering, specific cell state, cell click). US-2 has 4 scenarios (display, filter, sort, expand). Both P1 stories cover positive paths. Negative paths covered by edge cases (empty state, zero rows)
- [x] CHK-020 Are acceptance scenarios for heatmap cell click (US-1 scenario 3) testable with specific expected output format? [Acceptance Criteria, US-1] — US-1 scenario 3 specifies: "specific artifact references are shown" with example format "T-003 references FR-002", "TS-005 verifies FR-002"
- [x] CHK-021 Are the severity table sort and filter scenarios (US-2 scenarios 2, 3) testable with deterministic expected order? [Acceptance Criteria, US-2] — US-2 scenario 2: filter by "coverage gap" shows only matching issues. US-2 scenario 3: click Category header re-sorts alphabetically. Both are deterministic
- [x] CHK-022 Is the health gauge breakdown tooltip content (US-3 scenario 2) specified with exact fields and format? [Acceptance Criteria, US-3] — US-3 scenario 2 lists four fields: "requirements coverage %, constitution compliance %, phase separation score, test coverage %"

## Edge Case Coverage

- [x] CHK-023 Is the behavior specified for when analysis.md exists but contains no Findings section? [Edge Cases, FR-018] — Edge case 4 covers 0 issues: "Show a success message: 'No issues found — all artifacts are consistent.'" This applies when Findings section is absent or empty
- [x] CHK-024 Is the behavior specified for a malformed or corrupted analysis.md file? [Edge Cases, FR-023] — RESOLVED: Added FR-023 requiring graceful handling of malformed analysis.md — show empty state rather than crash, render any parseable sections
- [x] CHK-025 Is the behavior specified for when the health score computation results in exactly 40 or exactly 70 (zone boundaries)? [Edge Cases, FR-014] — FR-014 states "red (0-40), yellow (41-70), green (71-100)" — boundaries are non-overlapping. Exact 40 is red, exact 70 is yellow. Deterministic
- [x] CHK-026 Is the behavior specified for when all four health score factors are 0%? [Edge Cases, FR-013] — FR-013 formula: average of four 0% values = 0. FR-014: 0 falls in red zone (0-40). Behavior is deterministic from the spec
- [x] CHK-027 Is the "stale" indicator for references to non-existent artifacts (edge case 3) defined with a specific visual treatment? [Edge Cases] — Accepted: edge case 3 says "distinct indicator." Visual treatment (color/icon) is implementation detail deferred per Constitution IV. The requirement to distinguish stale from active is clear
- [x] CHK-028 Is the pagination/virtualization strategy for 100+ issues (edge case 10) specified with a threshold and behavior? [Edge Cases, FR-020] — Accepted: FR-020 sets the scale limit (100 issues). Implementation strategy (paginate vs virtualize) deferred per Constitution IV. Usability criteria in SC-008 provides the acceptance test

## Non-Functional Requirements

- [x] CHK-029 Are the accessibility requirements (FR-021) specified with a target WCAG level and specific techniques per sub-view? [Non-Functional, FR-021] — FR-021 specifies: "heatmap data readable via screen reader (table semantics with row/column headers), gauge score announced, severity table navigable by keyboard." Plan KDD-10 adds WCAG 2.1 AA target
- [x] CHK-030 Is the performance requirement for initial load (<3s from SC-008 context) explicitly stated as a measurable criterion? [Non-Functional, SC-008] — Accepted: SC-001 specifies "within 5 seconds of viewing" for heatmap identification, SC-003 specifies "within 3 seconds" for issue discovery. Plan adds <3s load target. Measurable criteria exist across spec and plan
- [x] CHK-031 Are dark/light theme requirements stated for all new visual elements (heatmap colors, gauge zones, severity badges)? [Non-Functional, SC-007] — SC-007 states "visually consistent with the pipeline and dashboard aesthetic — same design language, typography, and quality level." The dashboard already has dark/light theme support via CSS custom properties. New elements use the same system

## Dependencies & Assumptions

- [x] CHK-032 Is the analysis.md report format documented as a contract between /iikit-07-analyze and this feature? [Dependencies, FR-003] — FR-003 references "structured analyze report produced by /iikit-07-analyze." Clarification Q1 confirms dashboard consumes the report. Plan KDD-2 documents five parser functions mapped to specific analysis.md sections. Data model documents the format
- [x] CHK-033 Is the dependency on 002-intent-flow-pipeline for tab navigation documented with the specific integration point? [Dependencies, FR-019] — FR-019 says "Phase 7 (Analyze) content area within the pipeline tab navigation defined by 002-intent-flow-pipeline." Dependencies section explicitly lists the dependency
- [x] CHK-034 Is the assumption that trend data requires upstream changes to /iikit-07-analyze documented with a degradation strategy? [Assumptions, FR-016, Clarification Q4] — Clarification Q4 documents the upstream dependency. Plan KDD-7 documents graceful degradation: "if no history data is found in the report, it simply doesn't render"
