# Feature Specification: IIKit Kanban Board

**Feature Branch**: `001-kanban-board`
**Created**: 2026-02-10
**Status**: Draft
**Input**: User description: "Live-updating kanban board that visualizes the IIKit workflow status for all features in a project. Shows each phase (specify, clarify, plan, checklist, testify, tasks, analyze, implement) as columns, features as cards, with real-time status derived from the project's artifacts on disk (specs/ directory, context.json, git state). Terminal-based UI that auto-refreshes."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Feature Progress at a Glance (Priority: P1)

A developer working on an IIKit project runs a single command and sees a kanban-style board in their terminal. Each column represents a workflow phase (specify, clarify, plan, checklist, testify, tasks, analyze, implement). Each feature in the project appears as a card positioned in the column corresponding to its current phase. Completed phases show a visual indicator.

**Why this priority**: This is the core value proposition. Without the board visualization, there is no product. A developer must be able to see where every feature stands in the IIKit workflow without manually inspecting files.

**Independent Test**: Can be fully tested by creating a project with 2-3 features at different stages and verifying the board renders correctly with each feature in the right column.

**Acceptance Scenarios**:

1. **Given** a project with one feature that has spec.md and plan.md but no tasks.md, **When** the user runs the kanban command, **Then** the board shows the feature card in the "plan" column with "specify" and "clarify" marked as complete
2. **Given** a project with three features at different stages, **When** the user runs the kanban command, **Then** each feature card appears in the column matching its current phase
3. **Given** a project with no features (empty specs/ directory), **When** the user runs the kanban command, **Then** the board renders with empty columns and a message indicating no features exist
4. **Given** a feature with all phases complete (all artifacts exist), **When** the board renders, **Then** the feature card appears in the "implement" column with all prior phases marked complete

---

### User Story 2 - Live Auto-Refresh (Priority: P1)

While the board is displayed, it automatically detects changes to project artifacts (new files created, specs updated, tasks completed) and re-renders the board without the user needing to restart the command. This enables a developer to keep the board open in one terminal while working in another.

**Why this priority**: "Live-updating" is a core requirement. Without auto-refresh, the user must repeatedly re-run the command, which defeats the purpose of a dashboard.

**Independent Test**: Can be tested by running the board, then in a separate terminal creating a new spec.md file, and verifying the board updates to show the new feature within a few seconds.

**Acceptance Scenarios**:

1. **Given** the board is running and showing one feature in the "specify" phase, **When** a plan.md file is created for that feature, **Then** the board updates within 5 seconds to show the feature in the "plan" column
2. **Given** the board is running, **When** a new feature directory is created in specs/ with a spec.md, **Then** a new card appears on the board within 5 seconds
3. **Given** the board is running, **When** the user presses a quit key (q or Ctrl+C), **Then** the board exits cleanly and returns to the normal terminal

---

### User Story 3 - Feature Card Details (Priority: P2)

Each feature card on the board shows useful metadata beyond just the feature name: the feature number, a progress indicator (how many phases complete out of total), and which specific artifacts exist. The user can see at a glance what's done and what's remaining for each feature.

**Why this priority**: While the board position tells the current phase, the card details provide richer context about completeness and help developers decide what to work on next.

**Independent Test**: Can be tested by creating a feature with specific artifacts and verifying the card displays the correct metadata.

**Acceptance Scenarios**:

1. **Given** a feature with spec.md, plan.md, and checklists/ present, **When** the board renders, **Then** the feature card shows "3/8 phases" and lists which artifacts exist
2. **Given** a feature with test-specs.md that has a valid integrity hash, **When** the board renders, **Then** the testify phase shows a "verified" indicator
3. **Given** a feature with test-specs.md that has a mismatched integrity hash, **When** the board renders, **Then** the testify phase shows a "tampered" warning indicator

---

### User Story 4 - Multiple Project Support (Priority: P3)

A developer can point the kanban board at any IIKit project directory, not just the current working directory. This enables viewing the status of multiple projects from a single terminal.

**Why this priority**: Nice-to-have for developers managing multiple IIKit projects. The core use case (current directory) is covered by P1.

**Independent Test**: Can be tested by running the board with a path argument pointing to a different project directory.

**Acceptance Scenarios**:

1. **Given** two IIKit projects in different directories, **When** the user runs the kanban command with a path argument, **Then** the board shows features from the specified project
2. **Given** a path argument pointing to a non-IIKit directory (no specs/ folder), **When** the user runs the kanban command, **Then** a clear error message is displayed

---

### Edge Cases

- What happens when a feature directory exists but contains no artifacts? (Show as "empty" in the first column)
- How does the board handle very long feature names? (Truncate with ellipsis)
- What happens when there are more than 10 features? (Scrollable or paginated view)
- How does the board handle a feature that has artifacts out of order (e.g., tasks.md but no plan.md)? (Show in the highest-phase column, mark skipped phases differently)
- What happens if the terminal window is too narrow for all 8 columns? (Graceful degradation -- abbreviate column headers or show a warning)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST scan the project's `specs/` directory to discover all features by their numbered directory names
- **FR-002**: System MUST determine each feature's current workflow phase by checking which artifacts exist (spec.md, plan.md, checklists/, tests/test-specs.md, tasks.md)
- **FR-003**: System MUST render a columnar board in the terminal with one column per IIKit workflow phase
- **FR-004**: System MUST display each feature as a card in the column corresponding to its current (highest completed) phase
- **FR-005**: System MUST auto-refresh the board when project artifacts change on disk
- **FR-006**: System MUST provide a clean exit mechanism via keyboard input
- **FR-007**: System MUST check assertion integrity status for features that have test-specs.md (valid/invalid/missing hash)
- **FR-008**: System MUST show a progress indicator on each feature card (phases completed / total phases)
- **FR-009**: System MUST accept an optional path argument to specify the project directory
- **FR-010**: System MUST handle terminal resize events gracefully

### Key Entities

- **Feature**: A numbered directory under specs/ (e.g., `001-kanban-board`) containing workflow artifacts. Key attributes: number, name, current phase, artifact presence map, integrity status
- **Phase**: One of the 8 IIKit workflow stages, each associated with a specific artifact on disk. Order: specify, clarify, plan, checklist, testify, tasks, analyze, implement
- **Card**: The visual representation of a feature on the board, showing name, progress, and phase status
- **Board**: The full kanban visualization with columns for each phase, holding zero or more cards per column

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can see the status of all features in a project within 2 seconds of launching the command
- **SC-002**: Board updates reflect file system changes within 5 seconds
- **SC-003**: The board renders correctly for projects with 1 to 20 features
- **SC-004**: Users can identify which phase each feature is in without reading documentation
- **SC-005**: The board correctly reports assertion integrity status (valid/tampered/missing) for features with test specifications
