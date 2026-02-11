# Feature Specification: IIKit Kanban Board

**Feature Branch**: `001-kanban-board`
**Created**: 2026-02-10
**Status**: Draft
**Input**: User description: "Web-based kanban board dashboard that visualizes IIKit workflow status for all features in a project. Served locally in the browser with live updates. Shows each IIKit phase as columns, features as cards that move through columns based on which artifacts exist on disk. Includes assertion integrity status on feature cards. Auto-refreshes when project files change."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Feature Progress at a Glance (Priority: P1)

A developer working on an IIKit project runs a single command and opens a browser-based dashboard. The dashboard shows a kanban-style board where each column represents a workflow phase (specify, clarify, plan, checklist, testify, tasks, analyze, implement). Each feature in the project appears as a card positioned in the column corresponding to its current phase. Completed phases are visually indicated.

**Why this priority**: This is the core value proposition. Without the board visualization, there is no product. A developer must be able to see where every feature stands in the IIKit workflow without manually inspecting files.

**Independent Test**: Can be fully tested by creating a project with 2-3 features at different stages, launching the dashboard, and verifying the board renders correctly in a browser with each feature in the right column.

**Acceptance Scenarios**:

1. **Given** a project with one feature that has spec.md and plan.md but no tasks.md, **When** the user opens the dashboard, **Then** the board shows the feature card in the "plan" column with "specify" and "clarify" marked as complete
2. **Given** a project with three features at different stages, **When** the user opens the dashboard, **Then** each feature card appears in the column matching its current phase
3. **Given** a project with no features (empty specs/ directory), **When** the user opens the dashboard, **Then** the board renders with empty columns and a message indicating no features exist
4. **Given** a feature with all phases complete (all artifacts exist), **When** the board renders, **Then** the feature card appears in the "implement" column with all prior phases marked complete

---

### User Story 2 - Live Dashboard Updates (Priority: P1)

While the dashboard is open in the browser, it automatically receives updates when project artifacts change on disk (new files created, specs updated, tasks completed). The board re-renders without the user needing to refresh the page. This enables a developer to keep the dashboard open while working in their editor or terminal.

**Why this priority**: Live updates are a core requirement. Without them, the user must repeatedly refresh the page, which defeats the purpose of a persistent dashboard.

**Independent Test**: Can be tested by opening the dashboard, then in a separate terminal creating a new spec.md file, and verifying the board updates in the browser within a few seconds without manual page refresh.

**Acceptance Scenarios**:

1. **Given** the dashboard is open showing one feature in the "specify" phase, **When** a plan.md file is created for that feature, **Then** the board updates within 5 seconds to show the feature moved to the "plan" column
2. **Given** the dashboard is open, **When** a new feature directory is created in specs/ with a spec.md, **Then** a new card appears on the board within 5 seconds
3. **Given** the dashboard is open, **When** a feature's test-specs.md is modified, **Then** the integrity status indicator updates accordingly

---

### User Story 3 - Feature Card Details (Priority: P2)

Each feature card on the board shows useful metadata beyond just the feature name: the feature number, a progress indicator (how many phases complete out of total), and the assertion integrity status for features that have test specifications. A user can see at a glance what's done, what's remaining, and whether test integrity is maintained.

**Why this priority**: While the board position tells the current phase, the card details provide richer context about completeness and integrity, helping developers decide what to work on next and catch integrity violations early.

**Independent Test**: Can be tested by creating a feature with specific artifacts and verifying the card displays the correct metadata including integrity status.

**Acceptance Scenarios**:

1. **Given** a feature with spec.md, plan.md, and checklists/ present, **When** the board renders, **Then** the feature card shows "3/8 phases" and indicates which artifacts exist
2. **Given** a feature with test-specs.md that has a valid integrity hash, **When** the board renders, **Then** the testify phase shows a "verified" indicator
3. **Given** a feature with test-specs.md that has a mismatched integrity hash, **When** the board renders, **Then** the testify phase shows a "tampered" warning indicator

---

### User Story 4 - Multiple Project Support (Priority: P3)

A developer can point the dashboard at any IIKit project directory, not just the current working directory. This enables viewing the status of different projects by specifying a path when launching the dashboard.

**Why this priority**: Nice-to-have for developers managing multiple IIKit projects. The core use case (current directory) is covered by P1.

**Independent Test**: Can be tested by running the dashboard with a path argument pointing to a different project directory.

**Acceptance Scenarios**:

1. **Given** two IIKit projects in different directories, **When** the user launches the dashboard with a path argument, **Then** the board shows features from the specified project
2. **Given** a path argument pointing to a non-IIKit directory (no specs/ folder), **When** the user launches the dashboard, **Then** a clear error message is displayed

---

### Edge Cases

- What happens when a feature directory exists but contains no artifacts? (Show as "new" in the first column with an empty-state indicator)
- How does the board handle very long feature names? (Truncate with ellipsis, show full name on hover)
- What happens when there are more than 10 features? (Scrollable board area)
- How does the board handle a feature with artifacts out of order (e.g., tasks.md but no plan.md)? (Show in the highest-phase column, visually indicate skipped phases)
- What happens if the browser window is too narrow for all 8 columns? (Responsive layout — horizontal scroll or collapsed columns)
- What happens when the project directory is deleted while the dashboard is running? (Show an error state, attempt to reconnect)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST scan the project's `specs/` directory to discover all features by their numbered directory names
- **FR-002**: System MUST determine each feature's current workflow phase by checking which artifacts exist (spec.md, plan.md, checklists/, tests/test-specs.md, tasks.md)
- **FR-003**: System MUST render a columnar kanban board in the browser with one column per IIKit workflow phase
- **FR-004**: System MUST display each feature as a card in the column corresponding to its current (highest completed) phase
- **FR-005**: System MUST push live updates to connected browsers when project artifacts change on disk, without requiring page refresh
- **FR-006**: System MUST serve a local web interface accessible via a browser
- **FR-007**: System MUST check assertion integrity status for features that have test-specs.md (valid/invalid/missing hash)
- **FR-008**: System MUST show a progress indicator on each feature card (phases completed / total phases)
- **FR-009**: System MUST accept an optional path argument to specify the project directory
- **FR-010**: System MUST handle missing, incomplete, or malformed project data gracefully without crashing
- **FR-011**: System MUST display the project name and summary information on the dashboard
- **FR-012**: System MUST visually distinguish between phase states (complete, current, pending, skipped)

### Key Entities

- **Feature**: A numbered directory under specs/ (e.g., `001-kanban-board`) containing workflow artifacts. Key attributes: number, name, current phase, artifact presence map, integrity status
- **Phase**: One of the 8 IIKit workflow stages, each associated with a specific artifact on disk. Ordered: specify, clarify, plan, checklist, testify, tasks, analyze, implement
- **Card**: The visual representation of a feature on the board, showing name, progress, phase status, and integrity indicators
- **Board**: The full kanban visualization with columns for each phase, holding zero or more cards per column
- **Integrity Status**: The assertion hash verification state for a feature's test-specs.md: valid (hash matches), tampered (hash mismatch), or missing (no hash stored)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can see the status of all features in a project within 3 seconds of opening the dashboard
- **SC-002**: Board updates reflect file system changes within 5 seconds without page refresh
- **SC-003**: The board renders correctly for projects with 1 to 20 features
- **SC-004**: Users can identify which phase each feature is in without reading documentation
- **SC-005**: The board correctly reports assertion integrity status (valid/tampered/missing) for features with test specifications
- **SC-006**: The dashboard is usable on common screen sizes (laptop and desktop) without horizontal scrolling for up to 8 columns
