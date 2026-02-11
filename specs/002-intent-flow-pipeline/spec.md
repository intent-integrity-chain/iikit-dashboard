# Feature Specification: Intent Flow Pipeline

**Feature Branch**: `002-intent-flow-pipeline`
**Created**: 2026-02-11
**Status**: Draft
**Input**: User description: "An overarching dashboard home screen showing the full IIKit pipeline as a horizontal flow visualization. Each IIKit phase is a clickable node showing completion status. Clicking a node navigates to the phase-specific visualization. Nodes are color-coded by status and show progress percentages. Live-updates via existing infrastructure. Professional UI consistent with the kanban board aesthetic."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See the Full Pipeline at a Glance (Priority: P1)

A developer opens the dashboard and sees the entire IIKit workflow rendered as a horizontal pipeline. Nine phase nodes are displayed in order: Constitution, Spec, Clarify, Plan, Checklist, Testify, Tasks, Analyze, Implement. Each node shows whether the phase has been completed, is in progress, or hasn't started yet. The developer can instantly understand where their feature stands in the specification-to-implementation journey without opening any files.

**Why this priority**: This is the core "home screen" experience. Without it, the other phase-specific views (kanban board, radar chart, etc.) have no navigational context. This single view answers the most fundamental question: "Where am I in the process?"

**Independent Test**: Can be tested by creating a project with a feature that has completed some phases (e.g., spec.md and plan.md exist, tasks.md is 60% complete, no checklists yet). Open the dashboard and verify that each phase node correctly reflects the artifact state on disk.

**Acceptance Scenarios**:

1. **Given** a feature with spec.md, plan.md, and tasks.md present (tasks 40% complete), **When** the pipeline view loads, **Then** Constitution, Spec, Clarify, Plan, and Tasks nodes show as complete, Checklist shows as not started, and Implement shows as in-progress with "40%" label
2. **Given** a brand new feature with only spec.md created, **When** the pipeline loads, **Then** only the Spec node shows as complete, all subsequent nodes show as not started
3. **Given** a feature with all phases complete, **When** the pipeline loads, **Then** all nine nodes display as complete with checkmarks

---

### User Story 2 - Navigate to Phase Details (Priority: P1)

The pipeline is always visible at the top of the dashboard. A developer clicks on any phase node and the corresponding detail view renders in a content area below the pipeline. Clicking "Tasks" shows the kanban board below. Clicking "Constitution" shows the principles radar chart below. The pipeline acts as both persistent status overview and tab-style navigation. The currently selected phase node is visually highlighted.

**Why this priority**: The pipeline is the navigation backbone for the entire dashboard. Without clickable nodes, the phase-specific views are isolated pages with no way to discover or reach them.

**Independent Test**: Can be tested by opening the pipeline, clicking on the "Tasks" node, verifying the kanban board loads, then clicking back to return to the pipeline view.

**Acceptance Scenarios**:

1. **Given** the pipeline is displayed at top, **When** the developer clicks the "Tasks" phase node, **Then** the kanban board renders in the content area below and the "Tasks" node is visually highlighted as selected
2. **Given** the developer is viewing a phase detail below the pipeline, **When** they click a different phase node, **Then** the content area switches to the new phase's detail view
3. **Given** a phase node for a view that hasn't been built yet, **When** the developer clicks it, **Then** a placeholder message appears in the content area indicating the view is coming soon

---

### User Story 3 - Watch Pipeline Progress Update Live (Priority: P1)

While the developer watches the pipeline, an agent is working — creating artifacts, checking off tasks, completing checklists. As these changes happen on disk, the pipeline nodes update in real time. A node transitions from "not started" to "in progress" when its first artifact appears. Progress percentages tick up as tasks complete. Nodes transition to "complete" when all phase criteria are met. The developer sees the feature flowing through the pipeline without refreshing.

**Why this priority**: Real-time accuracy is a constitutional principle. The pipeline must reflect the true state of the project at all times, making it the live heartbeat of the dashboard.

**Independent Test**: Can be tested by opening the pipeline, then running a script that creates spec.md, then plan.md, then progressively checks tasks in tasks.md. The pipeline nodes should transition states in real time.

**Acceptance Scenarios**:

1. **Given** the pipeline is showing Checklist as "not started", **When** a checklist file is created in the feature's checklists/ directory, **Then** the Checklist node transitions to "in progress" within 5 seconds
2. **Given** Implement node shows "60%", **When** additional tasks are checked off bringing completion to 80%, **Then** the Implement node updates to "80%" within 5 seconds
3. **Given** all tasks are checked off, **When** the last task completes, **Then** the Implement node transitions to "complete" with a visual indicator

---

### User Story 4 - Switch Features from the Pipeline (Priority: P2)

A project may have multiple features at different stages. The pipeline includes a feature selector (consistent with the kanban board's feature selector). When the developer switches features, the entire pipeline updates to reflect the selected feature's phase states.

**Why this priority**: Multi-feature support was already specified for the kanban board (001-US3). The pipeline needs the same capability but inherits the existing selector mechanism.

**Independent Test**: Can be tested by creating two features at different completion stages, opening the pipeline, and switching between them to verify the nodes update.

**Acceptance Scenarios**:

1. **Given** two features exist — one with all phases complete and one with only spec.md, **When** the developer switches between them, **Then** the pipeline nodes update to reflect each feature's state
2. **Given** the developer selects a feature from the pipeline, **When** they click into a phase detail view, **Then** the phase detail shows data for the selected feature

---

### Edge Cases

- What happens when a feature has no artifacts at all? (Show all nodes as "not started" with an empty-state message)
- What happens when context.json is missing or malformed? (Derive state from artifact file presence instead of relying solely on context.json)
- How does the pipeline handle phases that are optional (e.g., Testify when TDD is not required)? (Show the node as "skipped" with a distinct visual style)
- What happens when the project has no features yet? (Show an empty pipeline with a message suggesting to run /iikit-01-specify)
- How does the pipeline handle the Clarify phase, which may have been skipped intentionally? (Show as "skipped" if spec.md has no clarifications section but plan.md exists)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display all nine IIKit phases as nodes in a horizontal pipeline: Constitution, Spec, Clarify, Plan, Checklist, Testify, Tasks, Analyze, Implement
- **FR-002**: System MUST determine each phase's status (not started, in progress, complete, skipped) by examining project artifacts on disk
- **FR-003**: System MUST display progress percentages for phases that have quantifiable progress (Implement task completion %, Checklist completion %)
- **FR-004**: System MUST color-code nodes by status: distinct visual treatment for not started, in progress, complete, skipped, and available states
- **FR-005**: System MUST make each phase node clickable, rendering the phase-specific detail view in a content area below the pipeline
- **FR-006**: System MUST keep the pipeline persistently visible at the top of the dashboard while phase detail views render below it, acting as tab-style navigation
- **FR-007**: System MUST update pipeline node states in real time when project artifacts change on disk, without requiring page refresh
- **FR-008**: System MUST include a feature selector to switch between multiple features, consistent with the kanban board's selector
- **FR-009**: System MUST serve the pipeline as the default landing page of the dashboard. The default active tab MUST be the Implement phase if implementation is in progress (any tasks checked), otherwise the last completed phase (determined by artifact existence on disk, walking backward from Implement)
- **FR-010**: System MUST show connecting lines or arrows between pipeline nodes to convey the sequential flow
- **FR-011**: System MUST handle missing or malformed artifacts gracefully, showing appropriate empty states rather than errors
- **FR-012**: System MUST visually distinguish optional phases (like Testify when TDD is not constitutionally required) from mandatory ones
- **FR-013**: System MUST use `role="navigation"` with `aria-label` on the pipeline bar, and `aria-current` on the active phase node for screen reader accessibility

### Phase Status Detection Rules

- **Constitution**: Complete if CONSTITUTION.md exists at project root; not started otherwise
- **Spec**: Complete if spec.md exists in the feature directory; not started otherwise
- **Clarify**: Complete if spec.md contains a "Clarifications" section; skipped if plan.md exists without clarifications; not started otherwise
- **Plan**: Complete if plan.md exists; not started otherwise
- **Checklist**: Complete if all checklist files in checklists/ are 100%; in progress if any exist with items checked; not started if no checklist files
- **Testify**: Complete if tests/test-specs.md exists; skipped if constitution does not require TDD and plan.md exists; not started otherwise
- **Tasks**: Complete if tasks.md exists in the feature directory; not started otherwise (binary — task generation is fast, no in-progress state needed)
- **Analyze**: Complete if analysis.md exists in the feature directory (written by `/iikit-07-analyze`); not started otherwise. Detail view content defined by feature 008
- **Implement**: In progress if any tasks in tasks.md are checked; complete if all tasks are checked; not started if no tasks are checked or tasks.md doesn't exist. Progress percentage shown (e.g., "60%"). This is the only phase that shows task checkbox progress.

### Key Entities

- **Pipeline**: The horizontal flow visualization showing all nine IIKit phases for one feature. Has a selected feature and renders phase nodes with connecting flow indicators
- **Phase Node**: A visual element representing one IIKit phase. Has a name, status (not started / in progress / complete / skipped), optional progress percentage, and a navigation target (the phase detail view)
- **Feature**: A numbered specification directory under specs/. Selected via the feature selector. Determines which artifacts are examined for phase status

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Developers can identify the current phase of any feature within 3 seconds of opening the dashboard
- **SC-002**: All nine pipeline phases are visible without scrolling on a standard developer screen (1280px+). On narrower widths, the pipeline bar scrolls horizontally within its own container (not the page) as a graceful fallback
- **SC-003**: Phase status changes are reflected on the pipeline within 5 seconds of the artifact change on disk
- **SC-004**: Developers can switch between any two phase detail views in a single click (pipeline is always visible)
- **SC-005**: The pipeline correctly distinguishes between skipped and not-started phases
- **SC-006**: The pipeline view is visually consistent with the kanban board aesthetic — same design language, typography, and quality level

## Clarifications

### Session 2026-02-11

- Q: How should the pipeline and phase detail views relate to each other — separate pages, client-side routing, or tab-based? -> A: Tab-based single page. The pipeline is always visible at the top of the dashboard acting as both navigation and status overview. Clicking a phase node renders the corresponding detail view in a content area below the pipeline. No page reloads, no separate routes — one page with the pipeline as a persistent header/tab bar.
- Q: Tasks and Implement nodes both derive status from tasks.md checkboxes — how should they differ? -> A: Pipeline-level: Tasks node is binary (complete once tasks.md exists, no progress needed). Implement node tracks checkbox completion with progress %. Tab content details deferred to their respective feature specs.
- Q: Analyze node status detection? -> A: Available once tasks.md exists, no "complete" state. Tab content (AI analysis + mechanical analysis) defined by feature 008.
- Q: Scope boundary — should this spec define what each tab shows? -> A: No. This spec defines the pipeline bar, tab shell, node status detection, and navigation. Each tab's content is its own feature spec (003-008). This spec only provides placeholder content areas for tabs not yet built.
