# Feature Specification: Checklist Quality Gates

**Feature Branch**: `006-checklist-quality-gates`
**Created**: 2026-02-17
**Status**: Draft
**Input**: User description: "Visualize checklist completion and gating status with progress rings and traffic light indicators. One animated ring per checklist file with color transitions. Gate traffic lights showing whether implementation can proceed. Clicking a ring expands to show individual checklist items. Data from checklists/*.md files."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See Checklist Completion at a Glance (Priority: P1)

A developer navigates to the Checklist phase in the pipeline and sees one progress ring for each checklist file in the feature's checklists/ directory. Each ring fills proportionally to the number of checked items versus total items, with the completion percentage displayed in the center. The ring label shows the checklist name and a fraction (e.g., "Requirements 8/12"). The ring color transitions from red (0-33%) to yellow (34-66%) to green (67-100%), giving an instant visual read on quality readiness.

**Why this priority**: Progress rings are the primary visual element of this feature. Without them, there is no checklist visualization — the entire feature hinges on this.

**Independent Test**: Can be tested by creating a feature with two checklist files (one at 50% completion, one at 100%) and verifying that two rings appear with correct percentages, fractions, and colors.

**Acceptance Scenarios**:

1. **Given** a feature with a checklist file "requirements.md" containing 8 checked and 4 unchecked items, **When** the Checklist phase view loads, **Then** a progress ring displays showing 67% filled, green color, labeled "Requirements 8/12"
2. **Given** a feature with three checklist files at varying completion (0%, 50%, 100%), **When** the view loads, **Then** three rings appear — one red at 0%, one yellow at 50%, one green at 100%
3. **Given** a feature with a single checklist file where all items are checked, **When** the view loads, **Then** one fully filled green ring displays at 100%

---

### User Story 2 - Understand Gate Status Instantly (Priority: P1)

Since checklists gate the implementation phase, the developer sees a prominent gate status indicator alongside the progress rings. If all checklists are at 100%, a green light shows with "GATE: OPEN" — implementation can proceed. If some checklists are incomplete, a yellow light shows with "GATE: BLOCKED". If any critical checklist is at 0%, a red light shows. The gate status answers the question "Can I start implementing?" without reading individual checklists.

**Why this priority**: The gate status is the key decision-support element. Even without expanding individual checklists, the developer must know at a glance whether the feature is ready for implementation.

**Independent Test**: Can be tested by creating a feature with all checklists complete and verifying "GATE: OPEN" appears, then unchecking one item and verifying the gate changes to "GATE: BLOCKED".

**Acceptance Scenarios**:

1. **Given** all checklist files in the feature's checklists/ directory are at 100% completion, **When** the view loads, **Then** a green traffic light indicator displays with "GATE: OPEN"
2. **Given** some checklist files are incomplete (between 1-99%), **When** the view loads, **Then** a yellow traffic light indicator displays with "GATE: BLOCKED"
3. **Given** at least one checklist file has 0% completion (no items checked), **When** the view loads, **Then** a red traffic light indicator displays with "GATE: BLOCKED"
4. **Given** the gate is showing "BLOCKED", **When** the developer checks off the remaining items (files change on disk), **Then** the gate transitions to "OPEN" in real time

---

### User Story 3 - Drill Into Individual Checklist Items (Priority: P2)

A developer wants to understand exactly which checklist items remain. They click on a progress ring and it expands to reveal the individual items from that checklist file. Items are grouped by category (matching the heading structure in the checklist file). Each item shows its check status (done or not done), its CHK-xxx identifier, and any dimension or reference tags as small badges. The developer can scan the expanded list to identify specific gaps.

**Why this priority**: While the rings give the summary, developers need to drill down to act on specific incomplete items. This completes the information hierarchy but is secondary to the overview.

**Independent Test**: Can be tested by creating a checklist file with categorized items (some checked, some not), clicking its ring, and verifying all items appear with correct status, grouping, IDs, and badges.

**Acceptance Scenarios**:

1. **Given** a checklist file with items grouped under two category headings, **When** the developer clicks its progress ring, **Then** an expanded view shows items grouped by those categories
2. **Given** an expanded checklist showing items with CHK-xxx IDs, **When** the developer views the expanded list, **Then** each item displays its CHK identifier and check status
3. **Given** checklist items that have dimension or reference tags, **When** the expanded view is shown, **Then** tags appear as small badges next to the relevant items
4. **Given** an expanded checklist, **When** the developer clicks the ring again or clicks a collapse control, **Then** the expanded view collapses back to the ring summary
5. **Given** one checklist is already expanded, **When** the developer clicks a different progress ring, **Then** the previously expanded checklist collapses and the newly clicked one expands (accordion behavior)

---

### User Story 4 - See Checklists Update in Real Time (Priority: P2)

While the developer has the Checklist phase view open, an agent or another process may be completing checklist items on disk. As checklist files change, the progress rings animate to reflect the new completion percentages, colors transition accordingly, and the gate status updates automatically. The developer watches quality gates close in real time.

**Why this priority**: Real-time updates are a constitutional principle. However, this builds on the same live-update infrastructure from the pipeline (002), making it an extension rather than net-new capability.

**Independent Test**: Can be tested by opening the Checklist view, then externally editing a checklist file to check off items, and verifying the rings and gate status update within seconds.

**Acceptance Scenarios**:

1. **Given** a progress ring showing 50%, **When** a checklist file is modified on disk to check off additional items bringing it to 75%, **Then** the ring animates from 50% to 75% and transitions from yellow to green within 5 seconds
2. **Given** the gate status is "BLOCKED", **When** the last unchecked item across all checklists is checked off on disk, **Then** the gate transitions to "OPEN" within 5 seconds
3. **Given** an expanded checklist detail view is open, **When** an item's status changes on disk, **Then** the item's check status updates in the expanded view

---

### Edge Cases

- What happens when a feature has no checklist files? (Show an empty state message indicating no checklists have been generated, suggest running /iikit-04-checklist)
- What happens when a checklist file has no parseable items (no `- [ ]` or `- [x]` patterns)? (Show the checklist ring at 0% with a note that no items were detected)
- How does the system handle a checklist file being deleted while the view is open? (Remove the corresponding ring gracefully, update gate status)
- What happens when a feature has 6 checklists (the upper range)? (Layout adapts to display all rings without overlap, wrapping if necessary)
- What happens when a checklist file has items but no category headings? (Show items in a single ungrouped list in the detail view)
- How does the system handle malformed checklist markdown? (Parse best-effort, treat unparseable lines as non-items, show only valid items)
- What happens when a new checklist file is created while the view is open? (A new ring appears automatically within 5 seconds, consistent with real-time update behavior)
- What happens during rapid successive changes to checklist files? (Updates are debounced — the view shows the latest state within 5 seconds rather than every intermediate state, avoiding visual thrashing)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display one progress ring for each checklist file found in the feature's checklists/ directory
- **FR-002**: Each progress ring MUST show the completion percentage (checked items / total items) as a filled arc and a centered numeric label
- **FR-003**: Each progress ring MUST display a text label with the checklist name and item fraction (e.g., "Requirements 8/12")
- **FR-004**: Progress rings MUST use color coding based on completion: red (0-33%), yellow (34-66%), green (67-100%)
- **FR-005**: Progress rings MUST animate on initial load, filling from 0% to the current completion percentage
- **FR-006**: System MUST display a gate traffic light indicator showing overall implementation readiness
- **FR-007**: Gate status MUST be "OPEN" (green) only when all checklists are at 100% completion; "BLOCKED" (red) when any checklist is at 0% (worst-case takes precedence); "BLOCKED" (yellow) when all checklists are between 1-99% (none at 0%)
- **FR-008**: Clicking a progress ring MUST expand to show individual checklist items with their check status. Only one ring may be expanded at a time (accordion behavior) — expanding one MUST collapse any previously expanded ring
- **FR-009**: Expanded checklist items MUST be grouped by category headings from the checklist file
- **FR-010**: Each checklist item in the expanded view MUST display its CHK-xxx identifier when present
- **FR-011**: Dimension and reference tags on checklist items MUST be shown as small visual badges
- **FR-012**: System MUST update progress rings and gate status in real time when checklist files change on disk, within 5 seconds
- **FR-013**: System MUST handle 1 to 6 checklist files with an adaptive layout that avoids overlap
- **FR-014**: System MUST show a meaningful empty state when no checklist files exist for the selected feature
- **FR-015**: System MUST parse checklist items by detecting `- [ ]` (unchecked) and `- [x]` (checked) patterns in checklist files
- **FR-016**: System MUST render as the Phase 4 (Checklist) content area within the pipeline tab navigation defined by 002-intent-flow-pipeline
- **FR-017**: System MUST be accessible, with progress ring values readable by screen readers and gate status announced to assistive technologies
- **FR-018**: Progress rings MUST be keyboard-navigable: focusable via Tab, expandable/collapsible via Enter or Space
- **FR-019**: Focus order MUST follow the visual layout: gate status indicator, then rings left-to-right, then expanded detail items

### Key Entities

- **Checklist File**: A markdown file in the feature's checklists/ directory. Contains categorized items in checkbox format. Has a name (derived from filename), total items count, and checked items count
- **Checklist Item**: An individual line in a checklist file with a checkbox. Has a check status (done/not done), optional CHK-xxx identifier, optional category (from heading), and optional dimension/reference tags
- **Progress Ring**: Visual representation of one checklist file's completion. Has a percentage, color, label, and expandable state
- **Gate Status**: Aggregate indicator of implementation readiness. Derived from all checklist files' completion. Has three states with worst-case precedence: open (all 100%), blocked-critical/red (any at 0%, takes precedence), blocked-partial/yellow (all between 1-99%, none at 0%)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Developers can determine whether implementation is gated or ready within 2 seconds of viewing the Checklist phase
- **SC-002**: All checklist files are represented as rings without requiring scrolling when 4 or fewer checklists exist (typical case)
- **SC-003**: Completion percentages on rings match the actual checked/total ratio in the corresponding checklist files with 100% accuracy
- **SC-004**: Ring color transitions and gate status changes are reflected within 5 seconds of a checklist file changing on disk
- **SC-005**: Developers can identify specific incomplete items within 2 clicks (one to select Checklist phase, one to expand a ring)
- **SC-006**: The checklist visualization is visually consistent with the pipeline and kanban board aesthetic — same design language, typography, and quality level

## Out of Scope

- Editing or toggling checklist items from the dashboard — the view is strictly read-only. Developers modify checklist files via their editor or agents.

## Dependencies

- **002-intent-flow-pipeline**: This feature renders as the Phase 4 (Checklist) tab content within the pipeline navigation defined by feature 002

## Clarifications

### Session 2026-02-17

- Q: Should the checklist detail view allow toggling items or be read-only? -> A: Read-only — display only, no editing from dashboard [FR-008, US-3]
- Q: When a second ring is clicked while one is expanded, accordion or multi-expand? -> A: Accordion — only one ring expanded at a time [FR-008, US-3]
- Q: When checklists have mixed completion (some 0%, some partial), which gate color takes precedence? -> A: Worst-case wins — red (0%) takes precedence over yellow (partial) [FR-007, US-2, SC-001]
- Q: What happens when a new checklist file is created while the view is open? -> A: New ring appears automatically within 5 seconds [FR-012]
- Q: What happens during rapid successive file changes? -> A: Updates are debounced, latest state shown within 5 seconds [FR-012]
- Q: Should keyboard navigation be specified for progress rings? -> A: Yes — Tab to focus, Enter/Space to expand, standard ARIA button pattern [FR-018]
- Q: Should focus order be specified? -> A: Yes — gate status, then rings left-to-right, then expanded detail [FR-019]
