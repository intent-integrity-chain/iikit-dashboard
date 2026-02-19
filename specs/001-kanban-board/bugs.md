# Bug Reports: 001-kanban-board

## BUG-001

**Reported**: 2026-02-19
**Severity**: low
**Status**: fixed
**GitHub Issue**: #26

**Description**: Clarify phase empty state has broken text alignment and misleading message when clarify was run but found nothing to clarify

**Reproduction Steps**:
1. Run `/iikit-01-specify` to create a feature specification
2. Run `/iikit-02-clarify` — clarify finds no ambiguities and completes successfully
3. Open the dashboard and click the CLARIFY phase in the pipeline bar
4. Observe the "No Clarifications Recorded" empty state
5. Text alignment is visually off/broken (line breaks mid-word)
6. Message says "no clarification sessions have been recorded. Run /iikit-02-clarify to identify and resolve ambiguities" — this implies clarify was never run, but it was run and found nothing to clarify

**Root Cause**: 1) `.clarify-empty` CSS lacked `max-width` and `overflow-wrap`, causing text to break mid-word. 2) `renderClarifyContent()` showed a single "no sessions recorded" message for both "never ran" and "ran with no issues" states — no distinction based on pipeline phase status.

**Fix Reference**: T-B001, T-B002

---

## BUG-002

**Reported**: 2026-02-19
**Severity**: low
**Status**: fixed
**GitHub Issue**: #27

**Description**: Pipeline phase tab buttons are inconsistent sizes — some tabs are wider/taller than others, creating an uneven appearance that doesn't meet professional UI standards (Constitution §III)

**Reproduction Steps**:
1. Open the dashboard at http://localhost:3000
2. Look at the pipeline bar (CONSTITUTION, SPEC, CLARIFY, PLAN, CHECKLIST, TESTIFY, TASKS, ANALYZE, IMPLEMENT)
3. Observe that the tab buttons are not uniform in size

**Root Cause**: `.pipeline-node` CSS used `flex: 0 1 auto` allowing tabs to size based on content width, and `min-width: 40px` was too small to enforce uniformity.

**Fix Reference**: T-B003, T-B004
