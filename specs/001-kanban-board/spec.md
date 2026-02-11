# Feature Specification: IIKit Kanban Board

**Feature Branch**: `001-kanban-board`
**Created**: 2026-02-10
**Status**: Draft
**Input**: User description: "Web-based kanban board that launches during /iikit-08-implement. Shows user stories as cards in Todo/In Progress/Done columns with live-updating task checkboxes. Professional UI on par with Trello/Linear/Jira."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Watch an Agent Work in Real Time (Priority: P1)

A developer runs `/iikit-08-implement` and a kanban dashboard automatically opens in their browser. The board has three columns: Todo, In Progress, and Done. Each user story from the feature spec appears as a card. Inside each card, the tasks from tasks.md (tagged with that story's ID) are shown as checkboxes. As the agent works — checking off tasks in tasks.md — the checkboxes tick off on the dashboard in real time. When a story's first task is checked, its card slides from Todo to In Progress. When all its tasks are checked, the card slides to Done. The developer watches the entire implementation unfold live.

**Why this priority**: This is the "wow" moment and the entire reason to build this tool. Everything else supports this experience.

**Independent Test**: Can be tested by opening the dashboard, then running a script that progressively checks off tasks in tasks.md at 2-second intervals. The dashboard should show checkboxes ticking off and cards sliding between columns.

**Acceptance Scenarios**:

1. **Given** a feature with tasks.md containing 10 unchecked tasks tagged [US1] and [US2], **When** the dashboard is open and an agent checks off a [US1] task, **Then** the checkbox for that task updates on the US1 card within 5 seconds
2. **Given** a US1 card in the "In Progress" column with 3/4 tasks checked, **When** the final task is checked off, **Then** the card slides to the "Done" column with a completion animation
3. **Given** all story cards in "Todo", **When** the first task of US2 is checked, **Then** the US2 card slides from "Todo" to "In Progress"

---

### User Story 2 - See Where Every Story Stands (Priority: P1)

A developer opens the dashboard and immediately sees all user stories for the current feature arranged as cards across three columns. Each card shows the story title, priority badge, task progress (e.g., "3/7"), and individual task checkboxes. The developer can tell at a glance which stories haven't started, which are being worked on, and which are complete.

**Why this priority**: The board is useless if the static view doesn't clearly communicate status. This is the foundation that live updates build on.

**Independent Test**: Can be tested by creating a feature with a spec.md containing 3 user stories and a tasks.md with tasks tagged by story at various completion states, then verifying each card appears in the correct column with accurate progress.

**Acceptance Scenarios**:

1. **Given** a feature with 4 user stories and all tasks unchecked, **When** the dashboard loads, **Then** 4 cards appear in the "Todo" column
2. **Given** a tasks.md with 5 tasks tagged [US1] where 3 are checked, **When** the board renders, **Then** the US1 card is in "In Progress" showing a progress bar at 3/5 (60%)
3. **Given** a story with all 3 tasks checked, **When** the board renders, **Then** the card is in the "Done" column with all checkboxes ticked

---

### User Story 3 - Switch Between Features (Priority: P2)

A project may have multiple features being implemented. The dashboard shows one feature's board at a time, with a feature selector to switch between them. The selector shows the feature number and name.

**Why this priority**: Multi-feature support is needed for real projects but the core value (watching one feature's progress) doesn't depend on it.

**Independent Test**: Can be tested by creating a project with 2 features that have tasks.md, opening the dashboard, and switching between features.

**Acceptance Scenarios**:

1. **Given** a project with features 001-auth and 002-payments both having tasks.md, **When** the dashboard loads, **Then** a feature selector shows both features
2. **Given** the dashboard is showing 001-auth, **When** the user selects 002-payments, **Then** the board updates to show 002-payments' stories and tasks

---

### User Story 4 - Assertion Integrity at a Glance (Priority: P2)

For features that have test-specs.md with stored integrity hashes, the dashboard shows a badge indicating whether assertions are intact or tampered. This gives the developer a persistent visual indicator alongside the git hook enforcement.

**Why this priority**: Integrity monitoring is a key differentiator of IIKit. Surfacing it visually complements the git hooks.

**Independent Test**: Can be tested by creating a feature with test-specs.md, storing a hash, then modifying assertions and verifying the dashboard shows a tamper warning.

**Acceptance Scenarios**:

1. **Given** a feature with test-specs.md and a valid assertion hash, **When** the board renders, **Then** a "verified" badge is displayed
2. **Given** a feature where test-specs.md assertions were modified after testify, **When** the board renders, **Then** a "tampered" warning badge appears prominently

---

### Edge Cases

- What happens when tasks.md has tasks not tagged with any user story? (Show in a separate "Unassigned" card)
- How does the board handle very long story titles? (Truncate with ellipsis, show full title on hover)
- What happens when tasks.md is malformed or unparseable? (Show error indicator, don't crash)
- What happens when the project directory becomes unavailable while the dashboard is running? (Show disconnected state, attempt to reconnect)
- What happens when tasks are un-checked (reverted)? (Card moves back from Done to In Progress, or In Progress to Todo)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST parse spec.md to extract user stories (title, priority)
- **FR-002**: System MUST parse tasks.md to extract tasks and their checked/unchecked status, grouped by user story tag ([US1], [US2], etc.)
- **FR-003**: System MUST render a kanban board in the browser with three columns: Todo, In Progress, Done
- **FR-004**: System MUST display each user story as a card containing its title, priority, task checkboxes, and progress indicator
- **FR-005**: System MUST push live updates to the browser when tasks.md changes on disk, without requiring page refresh
- **FR-006**: System MUST move story cards between columns based on task completion: Todo (0 tasks checked), In Progress (at least 1 checked), Done (all checked)
- **FR-007**: System MUST provide a feature selector to switch between multiple features
- **FR-008**: System MUST check assertion integrity status (valid/tampered/missing) for features with test-specs.md and display the result
- **FR-009**: System MUST serve a local web interface accessible via a browser
- **FR-010**: System MUST accept an optional path argument to specify the project directory
- **FR-011**: System MUST handle missing, incomplete, or malformed project data without crashing
- **FR-012**: System MUST present a professional, polished UI comparable to industry kanban tools
- **FR-013**: System MUST launch automatically when `/iikit-08-implement` starts and provide a browser URL
- **FR-014**: System MUST debounce file change events (300ms after last change) to avoid excessive re-parsing during rapid edits
- **FR-015**: System MUST use semantic markup and ARIA labels on key interactive elements for basic accessibility
- **FR-016**: System MUST be keyboard-navigable for the feature selector and card interactions

### Key Entities

- **Feature**: A numbered directory under specs/ (e.g., `001-kanban-board`) containing workflow artifacts. Key attributes: number, name, integrity status
- **User Story**: A prioritized user journey defined in spec.md. Identified by US1, US2, etc. Has associated tasks from tasks.md
- **Task**: A checkbox item from tasks.md, tagged with a user story ([US1], [US2]). Has checked/unchecked status and description
- **Card**: The visual representation of a user story on the board, showing title, priority, task checkboxes, and progress
- **Board**: Three-column kanban layout (Todo / In Progress / Done) for one feature

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can see the status of all user stories for a feature within 3 seconds of opening the dashboard
- **SC-002**: Task checkbox changes in tasks.md are reflected on the dashboard within 5 seconds without page refresh
- **SC-003**: The board renders correctly for features with 1 to 10 user stories and up to 50 tasks
- **SC-004**: Users can identify which stories are todo, in progress, or done without reading documentation
- **SC-005**: The board correctly reports assertion integrity status (valid/tampered/missing) for features with test specifications
- **SC-006**: The dashboard UI is visually comparable to professional kanban tools (clean cards, smooth card transitions, clear typography)

## Clarifications

### Session 2026-02-10

- Q: How do story cards map to columns? -> A: Columns are Todo / In Progress / Done (not IIKit phases). Cards move based on task completion state.
- Q: When does the dashboard launch? -> A: Only during implementation phase (/iikit-08-implement). The server starts and provides a browser URL.
- Q: When is a story "In Progress" vs "Done"? -> A: Todo = 0 tasks checked. In Progress = at least 1 checked. Done = all checked.
