# Quickstart: Constitution Radar Chart

## Test Scenarios

### 1. Radar Renders with Principles
**Setup**: Project with CONSTITUTION.md containing 4 principles (2 MUST, 1 SHOULD, 1 MAY)
**Action**: Open dashboard, click Constitution pipeline node
**Expected**: Radar chart renders with 4 axes. MUST axes extend to outer ring, SHOULD to middle, MAY to inner.

### 2. Principle Summary Bar
**Setup**: Same as above
**Action**: View the Constitution tab
**Expected**: Above the radar, a compact list shows "I. Test-First (MUST) | II. Real-Time Accuracy (MUST) | ..."

### 3. Detail Card on Click
**Setup**: Radar displayed with 4 principles
**Action**: Click on the "Test-First Development" axis
**Expected**: Detail card appears alongside the radar showing principle name, full text, rationale, and obligation level.

### 4. Amendment Timeline
**Setup**: CONSTITUTION.md with "Version: 1.1.0 | Ratified: 2026-02-10 | Last Amended: 2026-02-10"
**Action**: View Constitution tab
**Expected**: Timeline below radar shows v1.1.0 with dates.

### 5. Empty State
**Setup**: Project with no CONSTITUTION.md
**Action**: Click Constitution node
**Expected**: Empty state message suggesting to run /iikit-00-constitution.

### 6. Live Update
**Setup**: Dashboard open with Constitution tab active
**Action**: Edit CONSTITUTION.md to add a new principle
**Expected**: Radar updates within 5 seconds to show the new axis.

### 7. Feature Independent
**Setup**: Two features exist
**Action**: Switch between features while Constitution tab is active
**Expected**: Constitution tab shows the same content regardless of selected feature.
