# Data Model: Intent Flow Pipeline

## Entities

### PipelineState
The complete pipeline status for one feature.

**Attributes:**
- `phases`: Array of 9 PhaseNode objects, ordered by workflow sequence

**Source:** Computed by `computePipelineState(projectPath, featureId)` in pipeline.js

### PhaseNode
A single IIKit phase's status within the pipeline.

**Attributes:**
- `id`: String — machine identifier (e.g., `"constitution"`, `"spec"`, `"clarify"`, `"plan"`, `"checklist"`, `"testify"`, `"tasks"`, `"analyze"`, `"implement"`)
- `name`: String — display name (e.g., `"Constitution"`, `"Spec"`, `"Clarify"`)
- `status`: Enum — `"not_started"` | `"in_progress"` | `"complete"` | `"skipped"` | `"available"`
- `progress`: String | null — percentage for quantifiable phases (e.g., `"75%"`, `"40%"`), null for binary phases
- `optional`: Boolean — whether this phase can be skipped (Clarify, Testify)

**Status transitions:**
- `not_started` → `in_progress` → `complete` (standard flow)
- `not_started` → `skipped` (for optional phases that were bypassed)
- `not_started` → `available` (for Analyze, which has no "complete" state)

### Artifact Detection Map

| Phase | Artifact(s) Checked | Status Logic |
|-------|---------------------|--------------|
| Constitution | `CONSTITUTION.md` | exists → complete; else → not_started |
| Spec | `spec.md` | exists → complete; else → not_started |
| Clarify | `spec.md` content, `plan.md` | has `## Clarifications` → complete; plan exists without clarifications → skipped; else → not_started |
| Plan | `plan.md` | exists → complete; else → not_started |
| Checklist | `checklists/*.md` | all 100% → complete; any items checked → in_progress (with %); no files → not_started |
| Testify | `tests/test-specs.md`, `CONSTITUTION.md` | exists → complete; TDD not required + plan exists → skipped; else → not_started |
| Tasks | `tasks.md` | exists → complete; else → not_started |
| Analyze | `analysis.md` | exists -> complete; else -> not_started |
| Implement | `tasks.md` checkboxes | all checked → complete; any checked → in_progress (with %); else → not_started |
