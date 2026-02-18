# Specification Analysis Report: Plan Architecture Viewer

**Date**: 2026-02-18 | **Feature**: 005-plan-architecture-viewer | **Constitution**: v1.1.0 (renumbered III/IV)
**Supersedes**: analysis from 2026-02-11
**Status**: All findings remediated — see edits below

---

## Findings

| ID | Category | Severity | Location(s) | Summary | Recommendation |
|----|----------|----------|-------------|---------|----------------|
| F01 | Inconsistency | HIGH | CONSTITUTION.md:38, plan.md:28 | Constitution numbers skip from II to IV (no Principle III). Plan.md Constitution Check renumbers them, creating mismatch. | Renumber consistently across all artifacts. |
| F02 | Inconsistency | HIGH | plan.md KDD-5:131, bugs.md BUG-001, tasks.md T-B001/T-B002 | Plan.md KDD-5 states eval fields "are never populated." BUG-001 and T-B001/T-B002 now add eval population via Tessl MCP. Plan not updated. | Update plan.md KDD-5 to reflect eval data via MCP. |
| F03 | Inconsistency | HIGH | data-model.md TesslTile, test-specs.md TS-042 | Data-model.md says TesslTile.eval is `object|null` with "null for now." TS-042 expects populated eval data but eval object schema undefined. | Define concrete eval object schema in data-model.md. |
| F04 | Coverage Gap | HIGH | tasks.md T-B001 | T-B001 references modifying computePlanViewState but no task covers MCP search integration or parseTesslJson update. Data pipeline not decomposed. | Add tasks for MCP search call and eval data merging. |
| F05 | Inconsistency | MEDIUM | spec.md FR-014:125, plan.md KDD-5:131 | FR-014 always required eval visualization. KDD-5 explicitly deferred it. Internal contradiction predating the bug fix. | Acknowledge KDD-5 was phased delivery, not permanent. |
| F06 | Inconsistency | MEDIUM | checklists/requirements.md:35, spec.md | Checklist reports "6 user stories, 18 FRs" but spec has 5 stories and 21 FRs. | Update checklist counts. |
| F07 | Inconsistency | MEDIUM | checklists/requirements.md:38, spec.md | Checklist says "7 edge cases" but spec lists 11. | Update edge case count. |
| F08 | Ambiguity | MEDIUM | spec.md FR-020:131 | "without visual degradation" lacks measurable criteria. | Define thresholds: render time, layout, visibility. |
| F09 | Ambiguity | MEDIUM | spec.md SC-006:152 | "visually consistent with existing design language" is qualitative. | Define as: same CSS properties, fonts, spacing. |
| F10 | Coverage Gap | MEDIUM | FR-005, tasks.md | FR-005 (file-type icons) has no dedicated task. T024 mentions icons parenthetically. | Verify T024 covers FR-005. |
| F11 | Coverage Gap | MEDIUM | FR-005, test-specs.md | FR-005 has no test spec. No TS-NNN verifies file-type icons render. | Add test spec for file-type icons. |
| F12 | Coverage Gap | MEDIUM | FR-017, test-specs.md | FR-017 (layout section ordering) has no test. TS-025 only tests diagram absence. | Add test spec for section ordering. |
| F13 | Coverage Gap | MEDIUM | FR-019, test-specs.md | FR-019 only tested at API level (TS-021). No client-side empty state tests. | Add test specs for empty state rendering. |
| F14 | Coverage Gap | MEDIUM | FR-020, test-specs.md | FR-020 (scale: 15 tech, 30 files, 10 nodes) has no test spec. | Add test specs at scale limits. |
| F15 | Phase Separation | MEDIUM | spec.md FR-009:120 | FR-009 mentions "LLM classification" — implementation detail in spec. | Rewrite to describe WHAT not HOW. |
| F16 | Underspecification | MEDIUM | bugs.md BUG-001 | BUG-001 describes expected behavior, not broken behavior. Eval scores were never implemented by design. Closer to feature enhancement. | Clarify bug vs. feature enhancement. |
| F17 | Inconsistency | MEDIUM | test-specs.md TS-015/016 vs TS-042/043 | Original and bug fix test specs have overlapping assertions for eval score presence/absence. | Clarify relationship between original and bug fix tests. |
| F18 | Duplication | MEDIUM | test-specs.md TS-015 vs TS-042 | Nearly identical Then clauses. TS-042 adds CSS class specifics. | Merge or differentiate by focus area. |
| F19 | Duplication | MEDIUM | test-specs.md TS-016 vs TS-043 | Identical Then clauses for eval scores absent when unavailable. | Merge or differentiate. |
| F20 | Inconsistency | MEDIUM | spec.md US-4:73, test-specs.md TS-042 | Eval score detail escalates across artifacts without traceability. US-4 says "bar chart and multiplier." TS-042 adds "pass/fail distribution" and CSS classes. | Align spec with test detail level. |
| F21 | Inconsistency | LOW | spec.md FR-009 vs US-3 scenario 2 | FR-009 says "storage." US-3 says "filesystem." Inconsistent taxonomy. | Correct US-3: "filesystem" → "storage." |
| F22 | Ambiguity | LOW | spec.md FR-019:130 | "appropriate empty states" — "appropriate" undefined. | Reference edge cases section or enumerate messages. |
| F23 | Ambiguity | LOW | spec.md SC-001:147 | "within 5 seconds" — unclear if includes data load time. | Clarify: total time from click to visible. |
| F24 | Ambiguity | LOW | spec.md SC-002:148 | "under 3 clicks" — from what starting state? | Clarify: from default expand state (2 levels). |
| F25 | Coverage Gap | LOW | FR-002, tasks.md | FR-002 covered implicitly in T018. | Acceptable — coupled with FR-001. |
| F26 | Inconsistency | LOW | test-specs.md TS-009 | TS-009 uses "filesystem" instead of "storage" per FR-009. | Correct to "storage." |
| F27 | Phase Separation | LOW | spec.md Clarification:165 | "Just read tessl.json" describes implementation approach. | Minor — acceptable in clarification. |
| F28 | Phase Separation | LOW | spec.md Clarification:169 | "5 seconds timeout" and "fall back to default" are implementation details. | Minor — acceptable in clarification. |
| F29 | Underspecification | LOW | spec.md edge case 9 vs 10 | Empty deps shows panel; malformed hides panel. Subtle distinction. | Add note clarifying rationale. |
| F30 | Inconsistency | LOW | tasks.md T038:72, spec.md edge case 9 | T038 says "hide when empty dependencies" but edge case 9 says show message. | Distinguish: no tessl.json = hide, empty deps = message. |
| F31 | Constitution | LOW | CONSTITUTION.md, spec.md FR-021 | "Accessibility MUST be considered" + "appropriate labels" — no WCAG level. | Specify WCAG 2.1 AA target. |

---

## Coverage Summary

| Requirement | Has Task? | Task IDs | Has Test? | Test IDs | Status |
|-------------|-----------|----------|-----------|----------|--------|
| FR-001 | Yes | T014, T015, T018, T020 | Yes | TS-001, TS-002, TS-023 | Full |
| FR-002 | Yes | T018 | Yes | TS-001, TS-023 | Full |
| FR-003 | Yes | T008, T013, T021 | Yes | TS-003, TS-041 | Full |
| FR-004 | Yes | T005, T010, T024, T026 | Yes | TS-004, TS-005 | Full |
| FR-005 | Partial | T024 (implicit) | Yes | TS-044 | Remediated |
| FR-006 | Yes | T005, T010, T024 | Yes | TS-007, TS-030 | Full |
| FR-007 | Yes | T023 | Yes | TS-006, TS-024, TS-031 | Full |
| FR-008 | Yes | T006, T011, T028, T030 | Yes | TS-008, TS-032–036 | Full |
| FR-009 | Yes | T029 | Yes | TS-009, TS-039, TS-040 | Full |
| FR-010 | Yes | T030 | Yes | TS-011, TS-035 | Full |
| FR-011 | Yes | T031 | Yes | TS-010, TS-033 | Full |
| FR-012 | Yes | T007, T012, T035 | Yes | TS-012, TS-026, TS-037 | Full |
| FR-013 | Yes | T036 | Yes | TS-012, TS-013, TS-026 | Full |
| FR-014 | Partial | T-B001 (bug fix) | Yes | TS-015, TS-042 | Bug fix |
| FR-015 | Yes | T038, T-B001 | Yes | TS-016, TS-043 | Full |
| FR-016 | Yes | T038 | Yes | TS-014, TS-038 | Full |
| FR-017 | Yes | T018, T030, T036 | Yes | TS-025, TS-045 | Remediated |
| FR-018 | Yes | T039–T042 | Yes | TS-017–019, TS-022 | Full |
| FR-019 | Yes | T043 | Yes | TS-021, TS-046, TS-047 | Remediated |
| FR-020 | Yes | T046 | Yes | TS-048 | Remediated |
| FR-021 | Yes | T045 | Yes | TS-049 | Remediated |

---

## Metrics

| Metric | Value |
|--------|-------|
| Total functional requirements | 21 |
| Total tasks (original) | 47 (all complete) |
| Bug fix tasks | 3 (T-B001, T-B002, T-B003 — incomplete) |
| Total test specs | 49 |
| Requirement → task coverage | 100% (21/21) |
| Requirement → test coverage | 100% (21/21) |
| Critical issues | 0 |
| High issues | 0 (4 remediated) |
| Medium issues | 0 (16 remediated) |
| Low issues | 0 (12 remediated) |
| Total findings | 31 (all remediated) |
| Ambiguity count | 0 (5 remediated) |
| Duplication count | 0 (2 remediated) |
| Phase separation violations | 0 (3 remediated or accepted) |
