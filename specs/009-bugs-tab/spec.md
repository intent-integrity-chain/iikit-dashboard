# Feature Specification: Bugs Tab — Bug Tracking Visualization

**Feature Branch**: `009-bugs-tab`
**Created**: 2026-02-19
**Status**: Draft
**Input**: User description: "Add a Bugs tab to the dashboard pipeline bar — a standalone tab (no connector line) at the end of the pipeline that visualizes data from /iikit-bugfix. Shows bug count on the tab itself. Clicking opens a bug view with: severity-coded bug table (BUG-NNN entries from bugs.md), fix task progress (T-B prefixed tasks from tasks.md matched by [BUG-NNN] tag), GitHub issue links, status tracking (reported/fixed). T-B tasks on the Implement board get a subtle bug icon to distinguish them from feature tasks. Cross-panel navigation: Cmd+click bug IDs in Implement board navigates to Bugs tab, Cmd+click task IDs in Bugs tab navigates to Implement board."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Bug Status Table (Priority: P1)

A developer navigates to the Bugs tab in the dashboard to see all reported bugs for the current feature. The tab appears at the end of the pipeline bar, visually separated from the workflow chain (no connector line). A bug count badge on the tab shows how many open bugs exist. The bug view displays a table with each bug's ID, severity, status, fix task progress, and GitHub issue link. Rows are color-coded by severity. The developer can quickly scan which bugs are open, which are being worked on, and which are fixed.

**Why this priority**: The bug table is the core value — without it, there's no way to see bug status in the dashboard. This is the MVP that makes the Bugs tab useful.

**Independent Test**: Can be tested by creating a feature with a `bugs.md` containing 3 bugs of different severities and a `tasks.md` with T-B prefixed fix tasks. Open the dashboard, click the Bugs tab, and verify the table renders with correct severity colors, status values, and task progress counts.

**Acceptance Scenarios**:

1. **Given** a feature with `bugs.md` containing BUG-001 (critical, reported), BUG-002 (medium, fixed), and BUG-003 (low, reported), **When** the developer clicks the Bugs tab, **Then** a table renders with 3 rows showing each bug's ID, severity badge (color-coded), status, fix task progress, and description
2. **Given** BUG-001 has 3 fix tasks in `tasks.md` (T-B001, T-B002, T-B003) with 1 checked, **When** the Bugs tab renders, **Then** the BUG-001 row shows fix task progress as "1/3"
3. **Given** BUG-002 has a GitHub issue link `#13`, **When** the Bugs tab renders, **Then** the BUG-002 row shows a clickable link to the GitHub issue
4. **Given** a feature with no `bugs.md` file, **When** the developer clicks the Bugs tab, **Then** an empty state is shown with a message indicating no bugs have been reported

---

### User Story 2 - Bug Count Badge on Tab (Priority: P1)

The Bugs tab in the pipeline bar displays a count of open (non-fixed) bugs for the current feature. The tab itself is visually distinct from the workflow phases — it has no connector line linking it to the pipeline chain. The count badge is color-coded by the highest severity among open bugs: red for critical, orange for high, yellow for medium, gray for low. When there are no bugs, the tab shows no count and appears muted. The badge updates in real time when `bugs.md` changes.

**Why this priority**: The badge provides at-a-glance awareness without clicking the tab. Combined with the table (US1), this completes the core bug visibility experience.

**Independent Test**: Can be tested by creating features with different bug counts and severities, verifying the tab badge shows the correct count and color.

**Acceptance Scenarios**:

1. **Given** a feature with 2 open bugs (1 critical, 1 low), **When** the pipeline bar renders, **Then** the Bugs tab shows a badge with "2" in red (highest open severity is critical)
2. **Given** a feature with 1 open bug (medium severity), **When** the pipeline bar renders, **Then** the Bugs tab shows a badge with "1" in yellow
3. **Given** a feature with all bugs in "fixed" status, **When** the pipeline bar renders, **Then** the Bugs tab shows a muted "0" badge (badge remains visible but dimmed)
4. **Given** a feature with no `bugs.md` file, **When** the pipeline bar renders, **Then** the Bugs tab appears without a badge, in a muted/dimmed style
5. **Given** a bug is added to `bugs.md` on disk, **When** the file change is detected via WebSocket, **Then** the Bugs tab badge updates to reflect the new count and severity

---

### User Story 3 - Bug Task Differentiation on Implement Board (Priority: P2)

When viewing the Implement board, fix tasks (T-B prefixed, tagged with [BUG-NNN]) are visually distinguishable from feature tasks. Each bug fix task shows a small bug icon next to its task ID. The bug ID tag ([BUG-NNN]) is rendered as a cross-link that navigates to the Bugs tab when Cmd+clicked. This helps the developer see at a glance which tasks on the board are bug fixes vs. feature work.

**Why this priority**: This enhances the existing Implement board with bug awareness. It's valuable but not essential — the Bugs tab already shows fix task progress. This adds convenience when looking at the board.

**Independent Test**: Can be tested by creating a feature with both regular tasks and T-B prefixed fix tasks, opening the Implement board, and verifying the visual differentiation and cross-link behavior.

**Acceptance Scenarios**:

1. **Given** an Implement board with regular tasks (T001, T002) and bug fix tasks (T-B001, T-B002 tagged [BUG-001]), **When** the board renders, **Then** T-B tasks display a bug icon next to their task ID
2. **Given** a bug fix task T-B001 with tag [BUG-001] on the Implement board, **When** the developer Cmd+clicks [BUG-001], **Then** the view switches to the Bugs tab with BUG-001 highlighted
3. **Given** the Implement board has a card for a story that contains only bug fix tasks, **When** the card renders, **Then** the card is visually identifiable as a bug fix card

---

### User Story 4 - Cross-Panel Navigation from Bugs Tab (Priority: P2)

In the Bugs tab table, task IDs (T-B001, T-B002, etc.) are rendered as cross-links. When the developer Cmd+clicks a task ID, the view switches to the Implement board and highlights the corresponding task. This follows the same cross-panel navigation pattern used throughout the dashboard.

**Why this priority**: Cross-panel navigation is a consistency feature — it follows the existing pattern and makes the Bugs tab feel integrated rather than isolated.

**Independent Test**: Can be tested by clicking task ID cross-links in the Bugs tab and verifying navigation to the Implement board with the correct task highlighted.

**Acceptance Scenarios**:

1. **Given** the Bugs tab is showing BUG-001 with fix tasks T-B001 and T-B002, **When** the developer Cmd+clicks T-B001, **Then** the view switches to the Implement board and T-B001 is highlighted/scrolled into view
2. **Given** the Bugs tab is showing BUG-002 with a GitHub issue link #13, **When** the developer clicks the GitHub issue link, **Then** a new browser tab opens to the GitHub issue page

---

### User Story 5 - Real-Time Bug Updates via WebSocket (Priority: P3)

When `bugs.md` or `tasks.md` changes on disk (e.g., during a `/iikit-bugfix` or `/iikit-08-implement` session), the Bugs tab updates in real time via WebSocket. The bug table re-renders with updated status, severity, and fix task progress. The tab badge count updates. No manual refresh is required.

**Why this priority**: Real-time updates follow the dashboard's constitutional principle of real-time accuracy (Constitution §II). This is important but can be delivered after the core table and badge.

**Independent Test**: Can be tested by opening the Bugs tab, modifying `bugs.md` or `tasks.md` on disk, and verifying the view updates within the standard WebSocket update window.

**Acceptance Scenarios**:

1. **Given** the Bugs tab is open showing 2 bugs, **When** a new BUG-003 entry is appended to `bugs.md` on disk, **Then** the table updates to show 3 bugs and the tab badge increments
2. **Given** the Bugs tab is open showing BUG-001 with 1/3 fix tasks done, **When** a T-B task is checked in `tasks.md`, **Then** the progress updates to 2/3
3. **Given** the Bugs tab is open, **When** `bugs.md` is modified to change BUG-001 status from "reported" to "fixed", **Then** the row updates to show "fixed" status and the open bug count decreases

---

### Edge Cases

- What happens when a bug has zero fix tasks in tasks.md? → Show "—" in the fix task progress column
- What happens when `bugs.md` exists but is empty or malformed? → Show empty state with a message
- What happens when a BUG-NNN is referenced in tasks but not in bugs.md? → Show orphaned tasks in a separate "Orphaned Fix Tasks" section at the bottom of the bug table with a warning icon and muted styling
- What happens when `tasks.md` has T-B tasks but no `bugs.md` exists? → Show the Bugs tab muted (no badge), bug view shows empty state
- How does the tab behave when switching features? → Reload bug data for the new feature, update badge and table

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST render a Bugs tab at the end of the pipeline bar, visually separated from the workflow chain with no connector line
- **FR-002**: System MUST display an open bug count badge on the Bugs tab, color-coded by the highest severity among open bugs (red=critical, orange=high, yellow=medium, gray=low)
- **FR-003**: System MUST parse `bugs.md` to extract BUG-NNN entries with reported date, severity, status, description, GitHub issue link, root cause, and fix reference fields
- **FR-004**: System MUST render a bug status table with columns: Bug ID, Severity (color-coded badge), Status, Fix Tasks (progress), Description, and GitHub Issue link — sorted by severity descending (critical first), then by bug ID ascending
- **FR-005**: System MUST compute fix task progress per bug by matching T-B prefixed tasks tagged with [BUG-NNN] in `tasks.md`
- **FR-006**: System MUST show a bug icon on T-B prefixed tasks in the Implement board to visually distinguish them from feature tasks
- **FR-007**: System MUST support Cmd+click cross-panel navigation: BUG-NNN tags in the Implement board navigate to the Bugs tab, task IDs in the Bugs tab navigate to the Implement board
- **FR-008**: System MUST update the Bugs tab in real time via WebSocket when `bugs.md` or `tasks.md` changes on disk
- **FR-009**: System MUST show an empty state when no `bugs.md` exists or when the file contains no valid bug entries
- **FR-010**: System MUST show a muted "0" badge when there are no open bugs (badge remains visible but dimmed)
- **FR-011**: System MUST provide a REST endpoint `GET /api/bugs/:feature` returning the bug state for a given feature
- **FR-012**: System MUST resolve GitHub issue references (e.g., "#13") to clickable URLs by deriving the repository URL from the git remote origin; if no remote is configured, display the reference as plain text

### Key Entities

- **Bug**: Represents a reported defect — has an ID (BUG-NNN), severity (critical/high/medium/low), status (reported/fixed), description, optional GitHub issue link, optional root cause, and optional fix reference
- **Fix Task**: A task in `tasks.md` prefixed with T-B and tagged with [BUG-NNN] — has completion status (checked/unchecked) and a description

### Dependencies & Assumptions

- The `bugs.md` file format follows the template produced by `/iikit-bugfix` (v1.8.1+): `## BUG-NNN` headings with `**Reported**`, `**Severity**`, `**Status**`, `**GitHub Issue**`, `**Description**`, `**Root Cause**`, `**Fix Reference**` fields
- Fix tasks in `tasks.md` follow the `/iikit-bugfix` naming convention: `T-B` prefix with `[BUG-NNN]` tag
- The dashboard is read-only — it never writes to `bugs.md` or `tasks.md`

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Developer can identify all open bugs for a feature within 2 seconds of clicking the Bugs tab
- **SC-002**: Bug count badge on the tab accurately reflects the number of open (non-fixed) bugs at all times
- **SC-003**: Fix task progress per bug matches the actual checked/unchecked state of T-B tasks in `tasks.md`
- **SC-004**: Bug fix tasks on the Implement board are visually distinguishable from feature tasks without reading the task description
- **SC-005**: Cross-panel navigation between Bugs tab and Implement board works consistently with the existing Cmd+click pattern
- **SC-006**: Real-time updates to the Bugs tab occur within the same latency window as other WebSocket-driven views
- **SC-007**: The Bugs tab follows the same professional UI standards as other dashboard views (Constitution §III)
