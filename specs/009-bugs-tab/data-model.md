# Data Model: Bugs Tab

## Entities

### Bug

Represents a reported defect parsed from `bugs.md`.

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| id | string | `## BUG-NNN` heading | Unique bug identifier (e.g., "BUG-001") |
| reported | string | `**Reported**:` field | Date in YYYY-MM-DD format |
| severity | enum | `**Severity**:` field | One of: `critical`, `high`, `medium`, `low` |
| status | enum | `**Status**:` field | One of: `reported`, `fixed` |
| githubIssue | string\|null | `**GitHub Issue**:` field | Issue reference (e.g., "#13") or null if `_(none)_` |
| description | string | `**Description**:` field | One-line bug summary |
| rootCause | string\|null | `**Root Cause**:` field | null if `_(empty until investigation)_` |
| fixReference | string\|null | `**Fix Reference**:` field | null if `_(empty until implementation)_` |

**Validation**:
- `id` must match pattern `BUG-\d+`
- `severity` must be one of the four valid values (default: `medium` if unrecognized)
- `status` must be one of the two valid values (default: `reported` if unrecognized)
- Missing fields are null/defaults, never errors

### FixTask

A task in `tasks.md` that fixes a specific bug. Subset of the existing Task entity with bug-specific fields.

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| id | string | Task line | Task ID with T-B prefix (e.g., "T-B001") |
| bugTag | string | `[BUG-NNN]` tag | Bug reference (e.g., "BUG-001") |
| description | string | Task line text | Task description |
| checked | boolean | `[x]` vs `[ ]` | Whether the task is complete |
| isBugFix | boolean | Derived from `T-B` prefix | Always `true` for fix tasks |

**Validation**:
- `id` must match pattern `T-B\d+`
- `bugTag` must match pattern `BUG-\d+`

### BugsState

Computed state returned by `computeBugsState()`. Aggregates bugs with their fix tasks.

| Field | Type | Description |
|-------|------|-------------|
| exists | boolean | Whether `bugs.md` file exists |
| bugs | Bug[] | Array of parsed bugs, each enriched with `fixTasks` |
| bugs[].fixTasks | object | `{ total, checked, tasks: FixTask[] }` |
| summary | object | Aggregate counts and severity info |
| summary.total | number | Total bug count |
| summary.open | number | Bugs with status != "fixed" |
| summary.fixed | number | Bugs with status == "fixed" |
| summary.highestOpenSeverity | string\|null | Highest severity among open bugs, null if no open bugs |
| summary.bySeverity | object | `{ critical, high, medium, low }` counts for open bugs |

## Relationships

```
Bug (bugs.md)                    FixTask (tasks.md)
+------------------+             +-------------------+
| BUG-001          |<---[1:N]--->| T-B001 [BUG-001]  |
| severity: critical|             | T-B002 [BUG-001]  |
| status: reported  |             | T-B003 [BUG-001]  |
+------------------+             +-------------------+
| BUG-002          |<---[1:N]--->| T-B004 [BUG-002]  |
| severity: medium  |             | T-B005 [BUG-002]  |
+------------------+             +-------------------+
```

Join key: `bug.id` matches `fixTask.bugTag`

## State Transitions

### Bug Status

```
reported ──(manual edit to bugs.md)──> fixed
```

Status changes are driven by manual edits to `bugs.md` (or by the `/iikit-08-implement` skill updating the file). The dashboard is read-only — it never writes to `bugs.md`.

### Severity Hierarchy (for badge color)

```
critical > high > medium > low
```

The tab badge color is determined by the highest severity among open (non-fixed) bugs.

## Severity Color Mapping

| Severity | Badge Color | CSS Class |
|----------|-------------|-----------|
| critical | Red (#ff4757) | `.severity-critical` |
| high | Orange (#ffa502) | `.severity-high` |
| medium | Yellow (#f1c40f) | `.severity-medium` |
| low | Gray (#6b7189) | `.severity-low` |
