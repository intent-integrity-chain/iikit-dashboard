# Specification Analysis Report: Bugs Tab

**Feature**: `009-bugs-tab` | **Date**: 2026-02-19
**Artifacts**: spec.md, plan.md, tasks.md, data-model.md, contracts/, research.md, tests/test-specs.md

## Findings

| ID | Category | Severity | Location(s) | Summary | Recommendation |
|----|----------|----------|-------------|---------|----------------|
| A-001 | Inconsistency | MEDIUM | spec.md FR-010, test-specs.md TS-007 | FR-010 says "MUST show a muted '0' badge (badge remains visible but dimmed)" but TS-007 says "shows no count badge (or '0' muted)" — ambiguous whether badge is visible or hidden | Align TS-007 to FR-010: badge is always visible, shows "0" muted when no open bugs. Re-run `/iikit-05-testify` if spec is updated. |
| A-002 | Coverage Gap | MEDIUM | plan.md, spec.md FR-012 | FR-012 (GitHub issue URL resolution from git remote) has no explicit architectural section in plan.md. The resolution mechanism is only described in tasks (T008) and test specs (TS-041, TS-042). | Add a brief "GitHub URL Resolution" subsection to plan.md Architecture describing how `resolveGitHubIssueUrl` derives the repo URL from `git remote origin`. |
| A-003 | Underspecification | LOW | spec.md Edge Cases:orphaned-tasks | Orphaned T-B tasks (referencing non-existent BUG-NNN) are specified as "flag as orphaned" but the exact visual treatment is undefined — no mockup, color, or icon specified for the orphaned state. | Acceptable for implementation to decide. Suggest: render orphaned tasks in a separate "Orphaned" section at bottom of bug table with a warning icon and muted styling. |
| A-004 | Coverage Gap | LOW | plan.md | Plan.md does not explicitly cite FR-NNN or SC-NNN identifiers in architectural sections. Traceability from plan to requirements is implicit through content matching rather than explicit ID references. Only SC-001 and SC-006 appear in Technical Context. | Minor — plan sections clearly map to requirements by content. No action required, but consider adding FR-NNN references in comments for future maintainability. |

## Coverage Summary

| Requirement | Has Task? | Task IDs | Has Plan? | Plan Refs | Notes |
|-------------|-----------|----------|-----------|-----------|-------|
| FR-001 | Yes | T011 | Yes | Pipeline Bar section | |
| FR-002 | Yes | T012 | Yes | Pipeline Bar section | |
| FR-003 | Yes | T005 | Yes | New Parser section | |
| FR-004 | Yes | T014 | Yes | Server Module (implicit) | Sort order described in spec, implemented in tasks |
| FR-005 | Yes | T007, T014 | Yes | Server Module section | |
| FR-006 | Yes | T017, T018 | Yes | Board Enhancement section | |
| FR-007 | Yes | T019, T020, T021 | Yes | Cross-Panel Navigation section | |
| FR-008 | Yes | T023, T024 | Yes | WebSocket Integration section | |
| FR-009 | Yes | T015 | Yes | Architecture (permissive parsing) | |
| FR-010 | Yes | T012 | Yes | Pipeline Bar ("Muted") | A-001: slight inconsistency with TS-007 |
| FR-011 | Yes | T009, T010 | Yes | contracts/bugs-api.md | |
| FR-012 | Yes | T008, T016 | Partial | Not explicitly described | A-002: missing architectural section |
| SC-001 | Yes | T014 | Yes | Technical Context | "<2 seconds" |
| SC-002 | Yes | T012 | Yes | Pipeline Bar | |
| SC-003 | Yes | T007, T014 | Yes | Server Module | |
| SC-004 | Yes | T017, T018 | Yes | Board Enhancement | |
| SC-005 | Yes | T019, T020, T021 | Yes | Cross-Panel Navigation | |
| SC-006 | Yes | T023, T024 | Yes | Technical Context | "existing latency window" |
| SC-007 | Yes | T013 | Yes | CSS Additions, Constitution Check §III | |

## Phase Separation Violations

None detected.

- **Constitution**: Contains only principles and governance — no technology references.
- **Specification**: Contains only requirements, user stories, and acceptance criteria — no implementation details.
- **Plan**: References constitution with "Per constitution" pattern — no governance redefinition. Technology choices are appropriately placed.

## Constitution Alignment

| Principle | Status | Evidence |
|-----------|--------|----------|
| §I Test-First Development | PASS | TDD mandatory in tasks.md. Tests precede implementation in every phase. 45 test specs locked with assertion integrity hash. 6 test tasks (T001-T004, T009, T022) come before implementation tasks. |
| §II Real-Time Accuracy | PASS | FR-008 requires WebSocket updates. Plan describes chokidar watcher + debounced broadcast. Tasks T023-T024 implement real-time updates. |
| §III Professional Kanban UI | PASS | SC-007 explicitly references §III. Plan uses dedicated CSS classes with professional color palette. Task T013 implements severity styles. Task T026 adds ARIA accessibility. |
| §IV Simplicity | PASS | Plan confirms no new dependencies. Extends existing parsers. Single new module. Research R-001 rejects separate parser per §IV. |
| Quality Standards | PASS | Tests before code (§I). All 5 user stories have acceptance scenarios. Empty state messages (FR-009). ARIA labels (T026). |

## Metrics

| Metric | Value |
|--------|-------|
| Functional Requirements | 12 |
| Success Criteria | 7 |
| User Stories | 5 (all with Given/When/Then scenarios) |
| Edge Cases | 5 (all documented with resolutions) |
| Tasks | 27 |
| Test Specifications | 45 |
| Requirement Coverage (tasks) | 100% (19/19) |
| Requirement Coverage (plan) | 95% (18/19 explicit, FR-012 partial) |
| Research Decisions | 6 |
| Constitution Violations | 0 |
| Phase Separation Violations | 0 |

## Health Score: 95/100 (→ stable)

| Severity | Count | Impact |
|----------|-------|--------|
| CRITICAL | 0 | 0 |
| HIGH | 0 | 0 |
| MEDIUM | 2 | -4 |
| LOW | 2 | -1 |
| **Total findings** | **4** | **-5** |

## Score History

| Run | Score | Coverage | Critical | High | Medium | Low | Total |
|-----|-------|----------|----------|------|--------|-----|-------|
| 2026-02-19T12:45:00Z | 95 | 100% | 0 | 0 | 2 | 2 | 4 |
