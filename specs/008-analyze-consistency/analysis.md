# Specification Analysis Report: 008-analyze-consistency

**Date**: 2026-02-18 | **Constitution**: v1.1.0 | **Run**: 2

## Findings

| ID | Category | Severity | Location(s) | Summary | Recommendation |
|----|----------|----------|-------------|---------|----------------|
| F01 | Ambiguity | ~~MEDIUM~~ RESOLVED | spec.md:SC-007 | "Visually consistent with the pipeline and dashboard aesthetic" lacks measurable criteria — subjective assessment with no reference benchmark or checklist | Replaced with concrete criteria: same CSS custom properties, font stack, border-radius tokens, and card/table patterns as existing pipeline views |
| F02 | Inconsistency | ~~MEDIUM~~ RESOLVED | spec.md:Edge Cases vs plan.md:KDD-1 | Edge case says "Mark affected cells as 'stale' with a distinct indicator" when referenced artifacts no longer exist on disk, but KDD-1 states dashboard is purely a visualization layer that does NOT independently check source artifacts — stale detection requires file existence checks the dashboard explicitly avoids | Rewritten to defer stale detection to /iikit-07-analyze, consistent with KDD-1 |
| F03 | Phase Separation | ~~MEDIUM~~ RESOLVED | spec.md:Edge Cases | "Heatmap scrolls... severity table paginates or virtualizes to maintain performance" uses implementation terminology ("paginates", "virtualizes") in the specification — these are implementation strategies, not user-facing outcomes | Rewritten as user-facing outcome: "remains responsive and scrollable without scroll jank" |
| F04 | Underspecification | ~~LOW~~ RESOLVED | spec.md:FR-016, plan.md:KDD-7 | Trend indicator depends on score history from the analyze report, which requires an upstream change to /iikit-07-analyze that has not been implemented — graceful degradation is documented but the dependency is external and unresolved | Added explicit graceful degradation clause to FR-016 |
| F05 | Inconsistency | ~~LOW~~ RESOLVED | data-model.md vs plan.md:API Contract | Data model names the entity "AnalysisFinding" while the API contract uses "issues" as the JSON array key — minor naming divergence between internal model and external API | Documented the API mapping in data-model.md entity description |
| F06 | Inconsistency | MEDIUM | plan.md:KDD-2, data-model.md:CoverageEntry | Plan KDD-2 and data-model.md describe 2 coverage table formats (simple 3-col, detailed 6-col) but implementation now supports 3 formats including the 8-column format with Has Plan?/Plan Refs columns (per issue #21) | Update KDD-2 and data-model.md CoverageEntry parsing rule to document the 8-column format |
| F07 | Phase Separation | MEDIUM | spec.md:SC-007 | SC-007 uses implementation-specific terms: "CSS custom properties", "font stack", "border-radius tokens", "card/table patterns" — these are implementation strategies that belong in plan.md, not spec.md | Rewrite SC-007 as: "The Analyze visualization uses the same visual design language as the existing pipeline views" |
| F08 | Style | LOW | spec.md:FR-023 | FR-023 numbering is out of sequence — appears between FR-018 and FR-019 in the spec instead of after FR-022 | Renumber to maintain sequential order or add a comment explaining the late addition |

## Coverage Summary

| Requirement | Has Task? | Task IDs | Has Test? | Test IDs | Has Plan? | Plan Refs | Status |
|-------------|-----------|----------|-----------|----------|-----------|-----------|--------|
| FR-001 | Yes | T006, T008 | Yes | TS-001, TS-037 | Yes | KDD-4, KDD-1 | Full |
| FR-002 | Yes | T008 | Yes | TS-001, TS-019 | Yes | KDD-2 | Full |
| FR-003 | Yes | T004, T006, T008 | Yes | TS-002, TS-042, TS-043, TS-057 | Yes | KDD-1, KDD-2 | Full |
| FR-004 | Yes | T008 | Yes | TS-001, TS-002, TS-025, TS-058 | Yes | KDD-4 | Full |
| FR-005 | Yes | T008 | Yes | TS-003, TS-025 | Yes | KDD-4 | Full |
| FR-006 | Yes | T004, T009 | Yes | TS-004, TS-038, TS-039, TS-040, TS-041 | Yes | KDD-2, KDD-5 | Full |
| FR-007 | Yes | T009 | Yes | TS-004 | Yes | KDD-5 | Full |
| FR-008 | Yes | T009 | Yes | TS-006 | Yes | KDD-5 | Full |
| FR-009 | Yes | T009 | Yes | TS-005 | Yes | KDD-5 | Full |
| FR-010 | Yes | T009 | Yes | TS-004, TS-030 | Yes | KDD-5 | Full |
| FR-011 | Yes | T009 | Yes | TS-007 | Yes | KDD-5 | Full |
| FR-012 | Yes | T006, T010 | Yes | TS-008, TS-010 | Yes | KDD-3, KDD-6 | Full |
| FR-013 | Yes | T005, T006, T010 | Yes | TS-008, TS-022, TS-036, TS-044, TS-052 | Yes | KDD-3 | Full |
| FR-014 | Yes | T006, T010 | Yes | TS-008, TS-010, TS-053 | Yes | KDD-3, KDD-6 | Full |
| FR-015 | Yes | T010 | Yes | TS-009, TS-023 | Yes | KDD-6 | Full |
| FR-016 | Yes | T011 | Yes | TS-011, TS-012, TS-013, TS-014 | Yes | KDD-7 | Full |
| FR-017 | Yes | T007, T012 | Yes | TS-015, TS-016, TS-017, TS-035 | Yes | KDD-8 | Full |
| FR-018 | Yes | T008, T014 | Yes | TS-018, TS-019, TS-020, TS-031, TS-041, TS-049 | Yes | KDD-4, KDD-5 | Full |
| FR-019 | Yes | T008 | Yes | TS-027 | Yes | Architecture | Full |
| FR-020 | Yes | T008, T009 | Yes | TS-021, TS-026 | Yes | Performance Goals | Full |
| FR-021 | Yes | T008, T009, T010 | Yes | TS-028, TS-029 | Yes | KDD-10 | Full |
| FR-022 | Yes | T013 | Yes | TS-024 | Yes | KDD-9 | Full |
| FR-023 | Yes | T014 | Yes | TS-031, TS-032 | No | — | Full |
| SC-001 | Yes | T008 | Yes | TS-001, TS-003, TS-028 | Yes | KDD-4 | Full |
| SC-002 | Yes | T004, T006, T008 | Yes | TS-001, TS-002, TS-025 | Yes | KDD-4 | Full |
| SC-003 | Yes | T009 | Yes | TS-004, TS-029, TS-030 | Yes | KDD-5 | Full |
| SC-004 | Yes | T006, T010 | Yes | TS-008, TS-009, TS-010, TS-022, TS-052 | Yes | KDD-3 | Full |
| SC-005 | Yes | T009 | Yes | TS-005 | Yes | KDD-5 | Full |
| SC-006 | Yes | T007, T012 | Yes | TS-015, TS-016, TS-017 | Yes | KDD-8 | Full |
| SC-007 | Yes | T008, T009, T010, T013 | Yes | TS-024, TS-027 | Yes | KDD-4, KDD-5, KDD-6 | Full |
| SC-008 | Yes | T008, T009 | Yes | TS-021, TS-026 | Yes | Performance Goals | Full |

## Constitution Alignment

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Test-First (NON-NEGOTIABLE) | ALIGNED | TDD mandatory in tasks.md header; Phase 2 = RED (tests first), Phase 3 = GREEN (implementation); 58 test specs locked with assertion integrity hash; tasks reference specific TS-xxx IDs |
| II. Real-Time Accuracy | ALIGNED | T007 adds analyze_update WebSocket broadcast on file change; T012 implements client-side handler; FR-017 requires <5s update latency; no caching per KDD-8 |
| III. Professional Kanban UI | ALIGNED | Color-coded heatmap cells, severity badges, animated SVG gauge with color zones, load animations (T013); same design system as existing views per SC-007 |
| IV. Simplicity | ALIGNED | Zero new dependencies; HTML tables for heatmap and severity (simplest semantic choice); SVG gauge is one arc element; dashboard consumes report — no analyze logic of its own per KDD-1 |

## Phase Separation Violations

| Artifact | Status | Severity |
|----------|--------|----------|
| CONSTITUTION.md | Clean | — |
| spec.md | Minor: SC-007 uses implementation terms (CSS custom properties, font stack, border-radius tokens) | MEDIUM |
| plan.md | Clean | — |
| tasks.md | Clean | — |

## Metrics

| Metric | Value |
|--------|-------|
| Total Requirements (FR + SC) | 31 |
| Total Tasks | 14 |
| Total Test Specifications | 58 |
| Requirement Coverage | 31/31 (100%) |
| Test Coverage | 31/31 (100%) |
| Critical Issues | 0 |
| High Issues | 0 |
| Medium Issues | 2 |
| Low Issues | 1 |

**Health Score**: 96/100 (→ stable)

## Score History

| Run | Score | Coverage | Critical | High | Medium | Low | Total |
|-----|-------|----------|----------|------|--------|-----|-------|
| 2026-02-18T12:00:00Z | 96 | 100% | 0 | 0 | 2 | 1 | 3 |
