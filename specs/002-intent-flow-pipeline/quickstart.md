# Quickstart: Intent Flow Pipeline

## Test Scenarios

### 1. Pipeline Renders on Dashboard Open
**Setup**: Project with CONSTITUTION.md, feature with spec.md + plan.md + tasks.md (some checked)
**Action**: `node bin/iikit-kanban.js /path/to/project` → open in browser
**Expected**: Pipeline bar at top shows 9 nodes. Constitution, Spec, Plan = green (complete). Tasks = green. Implement = yellow with progress %. Checklist, Testify, Clarify = gray (not started or skipped).

### 2. Tab Switching
**Setup**: Dashboard open with pipeline visible
**Action**: Click "Implement" node → click "Plan" node → click "Implement" again
**Expected**: Content area below switches between kanban board, placeholder, and back to kanban. Pipeline bar stays visible throughout. Active node is highlighted.

### 3. Live Status Update
**Setup**: Dashboard open, feature missing plan.md
**Action**: In terminal, create `specs/NNN-feature/plan.md` with any content
**Expected**: Within 5 seconds, Plan node transitions from gray (not started) to green (complete).

### 4. Checklist Progress
**Setup**: Feature with `checklists/requirements.md` containing 4 items, 2 checked
**Action**: Open dashboard
**Expected**: Checklist node shows "in progress" (yellow) with "50%".
**Follow-up**: Check a third item → node updates to "75%".

### 5. Feature Switching
**Setup**: Two features — 001 with full artifacts, 002 with only spec.md
**Action**: Switch between features in the selector
**Expected**: All 9 pipeline nodes update to reflect the selected feature's state.

### 6. Skipped Phase Display
**Setup**: Feature with spec.md (no Clarifications section) and plan.md
**Action**: Open dashboard
**Expected**: Clarify node shows "skipped" style (distinct from "not started").

### 7. Empty Project
**Setup**: Project with no specs/ directory or no features
**Action**: Open dashboard
**Expected**: Pipeline shows all nodes as "not started". Content area shows empty state message.
