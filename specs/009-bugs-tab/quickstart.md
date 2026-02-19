# Quickstart: Bugs Tab Testing

## Test Fixtures

### Fixture 1: Feature with Multiple Bugs

Create `specs/test-feature/bugs.md`:
```markdown
# Bug Reports: test-feature

## BUG-001

**Reported**: 2026-02-19
**Severity**: critical
**Status**: reported
**GitHub Issue**: #13

**Description**: Login fails when email contains plus sign

**Reproduction Steps**:
1. Enter email with plus sign (user+test@example.com)
2. Click login
3. Observe 500 error

**Root Cause**: _(empty until investigation)_

**Fix Reference**: _(empty until implementation)_

---

## BUG-002

**Reported**: 2026-02-18
**Severity**: medium
**Status**: fixed
**GitHub Issue**: _(none)_

**Description**: Dashboard flickers on theme toggle

**Reproduction Steps**:
1. Open dashboard
2. Toggle theme
3. Observe flicker

**Root Cause**: CSS transition timing

**Fix Reference**: T-B004

---

## BUG-003

**Reported**: 2026-02-17
**Severity**: low
**Status**: reported
**GitHub Issue**: _(none)_

**Description**: Tooltip not dismissing on scroll

**Reproduction Steps**:
1. Hover over element to show tooltip
2. Scroll the page
3. Tooltip remains visible

**Root Cause**: _(empty until investigation)_

**Fix Reference**: _(empty until implementation)_
```

Create `specs/test-feature/tasks.md`:
```markdown
# Tasks: test-feature

## Implementation Tasks

- [x] T001 [US1] Implement login form
- [ ] T002 [US1] Add validation
- [x] T003 [US2] Build dashboard layout

## Bug Fix Tasks

- [ ] T-B001 [BUG-001] Investigate root cause for BUG-001: Login fails when email contains plus sign
- [x] T-B002 [BUG-001] Implement fix for BUG-001: Login fails when email contains plus sign
- [ ] T-B003 [BUG-001] Write regression test for BUG-001: Login fails when email contains plus sign
- [x] T-B004 [BUG-002] Implement fix for BUG-002: Dashboard flickers on theme toggle
- [x] T-B005 [BUG-002] Write regression test for BUG-002: Dashboard flickers on theme toggle
```

### Fixture 2: Feature with No Bugs

Create `specs/no-bugs-feature/spec.md` and `specs/no-bugs-feature/tasks.md` (no `bugs.md`).

### Fixture 3: Feature with Empty bugs.md

Create `specs/empty-bugs-feature/bugs.md`:
```markdown
# Bug Reports: empty-bugs-feature
```

## Verification Scenarios

### Scenario 1: Bug Table Renders (FR-003, FR-004, US1)

1. Start dashboard with Fixture 1
2. Navigate to test-feature
3. Click Bugs tab
4. Verify table shows 3 rows:
   - BUG-001: critical (red badge), reported, 1/3 fix tasks, GitHub #13
   - BUG-002: medium (yellow badge), fixed, 2/2 fix tasks, no GitHub link
   - BUG-003: low (gray badge), reported, 0/0 fix tasks, no GitHub link

### Scenario 2: Bug Count Badge (FR-002, US2)

1. Start dashboard with Fixture 1
2. Verify Bugs tab shows badge "2" (open bugs) in red (highest open = critical)

### Scenario 3: Empty State (FR-009, US1.4)

1. Start dashboard with Fixture 2
2. Click Bugs tab
3. Verify empty state message

### Scenario 4: Fix Task Progress (FR-005, US1.2)

1. Start dashboard with Fixture 1
2. Click Bugs tab
3. Verify BUG-001 row shows "1/3" progress
4. Verify BUG-002 row shows "2/2" progress

### Scenario 5: Bug Icon on Board (FR-006, US3)

1. Start dashboard with Fixture 1
2. Navigate to Implement board
3. Verify T-B tasks show bug icon
4. Verify BUG-001 card shows bug icon in header

### Scenario 6: Cross-Panel Navigation (FR-007, US3, US4)

1. Start dashboard with Fixture 1
2. On Bugs tab: Cmd+click T-B001 → navigates to Implement board, T-B001 highlighted
3. On Implement board: Cmd+click [BUG-001] → navigates to Bugs tab, BUG-001 highlighted

### Scenario 7: Real-Time Update (FR-008, US5)

1. Start dashboard with Fixture 1, Bugs tab open
2. Append new BUG-004 entry to bugs.md on disk
3. Verify table updates to show 4 rows
4. Verify badge updates to new open count

### Scenario 8: REST Endpoint (FR-011)

```bash
curl http://localhost:3000/api/bugs/test-feature
```
Verify JSON response matches contract in `contracts/bugs-api.md`.
