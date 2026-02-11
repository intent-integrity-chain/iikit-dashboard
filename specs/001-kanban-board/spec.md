# Feature Specification: IIKit Kanban Board

**Feature Branch**: `001-kanban-board`
**Created**: 2026-02-10
**Status**: Draft
**Input**: User description: "Web-based kanban board dashboard that visualizes IIKit workflow progress. Cards represent user stories, each containing live-updating task checkboxes. Features are switchable. Assertion integrity status displayed. Professional kanban UI on par with Trello/Linear/Jira."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Watch an Agent Work in Real Time (Priority: P1)

A developer kicks off an AI agent to implement a feature, then opens the kanban dashboard in their browser. They see user story cards arranged in columns by IIKit phase. As the agent works — creating files, checking off tasks in tasks.md — the checkboxes inside each card tick off in real time. When all tasks for a story's current phase complete, the card slides to the next column. The developer watches the feature come to life without touching the terminal.

**Why this priority**: This is the "wow" moment — watching AI work visualized live. It's the core reason to build this tool. Everything else is supporting infrastructure.

**Independent Test**: Can be tested by opening the dashboard, then running a script that progressively checks off tasks in tasks.md at 2-second intervals. The dashboard should show checkboxes ticking off and cards moving.

**Acceptance Scenarios**:

1. **Given** a feature with tasks.md containing 10 unchecked tasks tagged with [US1] and [US2], **When** the dashboard is open and an agent checks off a [US1] task, **Then** the checkbox for that task updates on the US1 card within 5 seconds
2. **Given** a US1 card in the "implement" column with 3/4 tasks checked, **When** the final task is checked off, **Then** the card shows 4/4 tasks complete with a visual completion indicator
3. **Given** the dashboard is open, **When** a new file is created in the feature directory (e.g., plan.md), **Then** the phase indicators on all story cards update to reflect the new artifact

---

### User Story 2 - See Where Every Story Stands (Priority: P1)

A developer opens the dashboard and immediately sees all user stories for the current feature laid out as cards on a kanban board. Each card shows the story title, its priority, a task progress bar (e.g., "3/7 tasks"), and which IIKit phase it's in. The columns represent the IIKit workflow phases. The developer can tell at a glance which stories are in progress, which are blocked, and which are done.

**Why this priority**: The board is useless if the static view doesn't clearly communicate status. This is the foundation that the live updates build on.

**Independent Test**: Can be tested by creating a feature with a spec.md containing 3 user stories and a tasks.md with tasks tagged by story, then opening the dashboard and verifying each story appears as a card in the correct column with accurate task counts.

**Acceptance Scenarios**:

1. **Given** a feature spec with 4 user stories (P1, P1, P2, P3), **When** the dashboard loads, **Then** 4 cards appear on the board, each showing the story title and priority
2. **Given** a tasks.md with 5 tasks tagged [US1] where 3 are checked, **When** the board renders, **Then** the US1 card shows a progress bar at 3/5 (60%)
3. **Given** a feature with spec.md and plan.md but no tasks.md, **When** the board renders, **Then** story cards appear in the "plan" column (highest completed phase) with no task checkboxes shown
4. **Given** no features exist in the project, **When** the dashboard loads, **Then** an empty state message is displayed

---

### User Story 3 - Switch Between Features (Priority: P2)

A project may have multiple features (e.g., `001-auth`, `002-payments`). The dashboard shows one feature's board at a time, with a feature selector (tabs or dropdown) to switch between them. The selector shows the feature number and name, and indicates which features have activity.

**Why this priority**: Multi-feature support is needed for real projects but the core value (watching one feature's progress) doesn't depend on it.

**Independent Test**: Can be tested by creating a project with 3 features at different stages, opening the dashboard, and switching between features via the selector.

**Acceptance Scenarios**:

1. **Given** a project with features 001-auth and 002-payments, **When** the dashboard loads, **Then** a feature selector is visible showing both features
2. **Given** the dashboard is showing 001-auth, **When** the user selects 002-payments, **Then** the board updates to show 002-payments' user stories and tasks
3. **Given** a feature with no spec.md (empty directory), **When** it appears in the selector, **Then** it is visually marked as "not started"

---

### User Story 4 - Assertion Integrity at a Glance (Priority: P2)

For features that have gone through `/iikit-05-testify`, the dashboard shows the assertion integrity status. If test-specs.md assertions have been tampered with (hash mismatch), a prominent warning appears on the affected story cards. This lets the developer catch integrity violations without running git commands.

**Why this priority**: Integrity monitoring is a key differentiator of IIKit. Surfacing it visually complements the git hooks with a persistent, always-visible indicator.

**Independent Test**: Can be tested by creating a feature with test-specs.md, storing a hash, then modifying assertions and verifying the dashboard shows a tamper warning.

**Acceptance Scenarios**:

1. **Given** a feature with test-specs.md and a valid assertion hash, **When** the board renders, **Then** the testify phase shows a "verified" badge
2. **Given** a feature where test-specs.md assertions were modified after testify, **When** the board renders, **Then** a "tampered" warning badge appears prominently
3. **Given** a feature with no test-specs.md, **When** the board renders, **Then** the testify phase shows as "pending" with no integrity indicator

---

### Edge Cases

- What happens when tasks.md has tasks not tagged with any user story? (Show in a separate "Unassigned" section or aggregate card)
- How does the board handle a user story with zero tasks? (Show the card with "No tasks yet" indicator)
- What happens when a feature directory exists but contains no spec.md? (Show as "not started" in the feature selector, empty board if selected)
- How does the board handle very long story titles? (Truncate with ellipsis, show full title on hover)
- What happens when tasks.md is malformed or unparseable? (Show the feature with an error indicator, don't crash)
- What happens when the project directory becomes unavailable while the dashboard is running? (Show disconnected state, attempt to reconnect)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST parse spec.md to extract user stories (title, priority, acceptance scenarios)
- **FR-002**: System MUST parse tasks.md to extract tasks and their checked/unchecked status, grouped by user story tag ([US1], [US2], etc.)
- **FR-003**: System MUST render a kanban board in the browser with one column per IIKit workflow phase (specify, clarify, plan, checklist, testify, tasks, analyze, implement)
- **FR-004**: System MUST display each user story as a card containing its title, priority, and task checkboxes
- **FR-005**: System MUST push live updates to the browser when tasks.md or any artifact file changes on disk, without requiring page refresh
- **FR-006**: System MUST determine each feature's current workflow phase by checking which artifacts exist on disk
- **FR-007**: System MUST provide a feature selector to switch between multiple features in the project
- **FR-008**: System MUST check assertion integrity status (valid/tampered/missing) for features with test-specs.md and display the result
- **FR-009**: System MUST serve a local web interface accessible via a browser
- **FR-010**: System MUST accept an optional path argument to specify the project directory
- **FR-011**: System MUST handle missing, incomplete, or malformed project data without crashing
- **FR-012**: System MUST display task progress on each story card (checked tasks / total tasks)
- **FR-013**: System MUST visually distinguish between phase states (complete, current, pending)
- **FR-014**: System MUST present a professional, polished UI comparable to industry kanban tools

### Key Entities

- **Feature**: A numbered directory under specs/ (e.g., `001-kanban-board`) containing workflow artifacts. Key attributes: number, name, current phase, artifact presence map, integrity status
- **User Story**: A prioritized user journey defined in spec.md with acceptance scenarios. Identified by US1, US2, etc. Contains zero or more associated tasks.
- **Task**: A checkbox item from tasks.md, tagged with a user story ([US1], [US2]). Has a checked/unchecked status and a description.
- **Phase**: One of the 8 IIKit workflow stages, each associated with a specific artifact on disk. Ordered: specify, clarify, plan, checklist, testify, tasks, analyze, implement
- **Card**: The visual representation of a user story on the board, showing title, priority, task checkboxes, and progress
- **Board**: The full kanban visualization for one feature, with columns for each phase

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can see the status of all user stories for a feature within 3 seconds of opening the dashboard
- **SC-002**: Task checkbox changes in tasks.md are reflected on the dashboard within 5 seconds without page refresh
- **SC-003**: The board renders correctly for features with 1 to 10 user stories and up to 50 tasks
- **SC-004**: Users can identify which phase each story is in and how many tasks are complete without reading documentation
- **SC-005**: The board correctly reports assertion integrity status (valid/tampered/missing) for features with test specifications
- **SC-006**: The dashboard UI is visually comparable to professional kanban tools (clean cards, clear typography, visual hierarchy)
