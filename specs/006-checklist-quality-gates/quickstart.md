# Quickstart: Checklist Quality Gates

## Test Scenarios

### 1. Progress Rings Render on Tab Click
**Setup**: Project with a feature that has `checklists/requirements.md` (8/12 checked) and `checklists/ux.md` (4/4 checked)
**Action**: `node bin/iikit-dashboard.js /path/to/project` → open in browser → click "Checklist" pipeline node
**Expected**: Two progress rings appear. Requirements ring shows 67% filled in green, labeled "Requirements 8/12". UX ring shows 100% filled in green, labeled "Ux 4/4".

### 2. Gate Status — All Complete
**Setup**: Feature with all checklist files at 100% completion
**Action**: Click "Checklist" tab
**Expected**: Green dot with "GATE: OPEN" text displayed above the rings.

### 3. Gate Status — Worst-Case Precedence
**Setup**: Feature with `checklists/requirements.md` (0/10 checked) and `checklists/ux.md` (5/8 checked)
**Action**: Click "Checklist" tab
**Expected**: Red dot with "GATE: BLOCKED". Requirements ring is red (0%), UX ring is yellow (63%). Gate is red because worst-case (0%) takes precedence over partial.

### 4. Accordion Expand/Collapse
**Setup**: Feature with two checklist files containing categorized items
**Action**: Click the Requirements ring → detail panel expands showing items grouped by category headings. Click the UX ring.
**Expected**: Requirements panel collapses, UX panel expands. Only one panel open at a time.

### 5. CHK IDs and Tags Display
**Setup**: Checklist file with items like `- [x] CHK-001 All stories have scenarios [spec]`
**Action**: Expand the checklist ring
**Expected**: Item shows check mark, "CHK-001" identifier, description text, and "spec" as a small badge.

### 6. Empty State
**Setup**: Feature with no `checklists/` directory (or empty directory)
**Action**: Click "Checklist" tab
**Expected**: Empty state message: "No checklists generated for this feature" with suggestion to run /iikit-04-checklist.

### 7. Live Update — Ring Animation
**Setup**: Dashboard open with Checklist tab active, feature with `checklists/requirements.md` at 50%
**Action**: In terminal, edit the file to check off more items bringing it to 75%
**Expected**: Within 5 seconds, the ring animates from 50% to 75%, color transitions from yellow to green, gate status updates if applicable.

### 8. Ring Color Thresholds
**Setup**: Three checklist files at 25%, 50%, and 80%
**Action**: Click "Checklist" tab
**Expected**: First ring = red (25% is in 0-33 range). Second ring = yellow (50% is in 34-66 range). Third ring = green (80% is in 67-100 range).

### 9. Items Without Categories
**Setup**: Checklist file with checkbox items but no heading structure
**Action**: Expand the ring
**Expected**: Items shown in a single ungrouped list (no category headers).

### 10. Malformed Checklist
**Setup**: Checklist file with some valid `- [x]` items and some non-checkbox lines mixed in
**Action**: Click "Checklist" tab and expand the ring
**Expected**: Only valid checkbox items appear. Non-checkbox lines are ignored. Ring percentage reflects only the parseable items.
