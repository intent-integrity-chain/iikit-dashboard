# Feature Specification: Spec Story Map

**Feature Branch**: `004-spec-story-map`
**Created**: 2026-02-11
**Status**: Draft
**Input**: User description: "Spec Story Map — Visualize the specification and clarification phases with a user story map, requirements graph, and clarification trail."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View User Story Map (Priority: P1)

A developer clicks the "Spec" phase node in the pipeline and sees a two-dimensional story map rendered in the content area. Stories are arranged along the horizontal axis in user journey order (as they appear in spec.md). The vertical axis organizes stories into priority swim lanes: P1 at the top, P2 in the middle, P3 at the bottom. Each story is displayed as a card showing its title, a priority badge, the number of acceptance scenarios, linked requirement IDs (FR-xxx, SC-xxx), and how many clarification Q&As refined it. The developer can instantly see the shape of the feature — what's high priority, what has lots of acceptance criteria, and what still needs clarification.

**Why this priority**: The story map is the primary visualization of the Spec phase. Without it, there is no "Spec" tab content. It answers the fundamental question: "What does this feature look like from the user's perspective?"

**Independent Test**: Can be tested by selecting a feature that has a complete spec.md with multiple stories at different priority levels. Open the Spec tab and verify stories appear in the correct swim lanes with accurate counts.

**Acceptance Scenarios**:

1. **Given** a feature with 4 user stories (2x P1, 1x P2, 1x P3), **When** the Spec tab loads, **Then** the story map displays 3 swim lanes with stories placed in the correct priority row
2. **Given** a story with 3 acceptance scenarios and links to FR-001, FR-002, SC-001, **When** its card renders, **Then** the card shows "3 scenarios", the requirement IDs as badges, and the priority level
3. **Given** a feature with stories refined by 2 clarification Q&As, **When** the story map loads, **Then** affected story cards show a clarification indicator with the count

---

### User Story 2 - Explore Requirements Graph (Priority: P1)

Below the story map, the developer sees an interactive node graph showing the relationships between user stories (US), functional requirements (FR-xxx), and success criteria (SC-xxx). Each entity type is visually distinct. Edges connect stories to the requirements they reference. Success criteria appear as standalone nodes (no explicit cross-references exist in the spec format). Each node type is visually distinct. The developer can click any node to highlight its direct connections, making it easy to trace from a story through its requirements — or spot orphaned requirements with no story.

**Why this priority**: The requirements graph is the second core visualization. It answers: "Are my requirements well-connected and covered?" — essential for understanding spec quality before planning.

**Independent Test**: Can be tested by selecting a feature with spec.md containing stories that reference FR-xxx and SC-xxx IDs. Verify nodes appear for each entity, edges connect correctly, and coverage coloring matches tasks.md/test-specs.md content.

**Acceptance Scenarios**:

1. **Given** a spec with US1 referencing FR-001 and FR-002, **When** the graph renders, **Then** nodes appear for US1, FR-001, FR-002 with edges connecting US1 to each FR, and SC nodes appear as standalone
2. **Given** the developer clicks on the FR-001 node, **When** the click registers, **Then** FR-001 and all its directly connected nodes and edges are highlighted while others dim
3. **Given** FR-003 exists in the requirements list but no story references it, **When** the graph renders, **Then** FR-003 appears as an orphaned node with no edges

---

### User Story 3 - Review Clarification Trail (Priority: P2)

The developer wants to understand what questions were asked during the clarification phase and how they shaped the specification. A collapsible right sidebar panel shows the clarification Q&A sessions parsed from the Clarifications section of spec.md. Each Q&A entry shows the question, the answer, and which section of the spec it refined. From a story card in the story map, the developer can click the clarification indicator to jump to the relevant Q&As.

**Why this priority**: Clarification trail adds context to the story map but is not essential for understanding the spec structure. It enriches the view rather than defining it.

**Independent Test**: Can be tested by selecting a feature whose spec.md has a Clarifications section with Q&A entries. Verify the panel shows the Q&As and clicking a story card's clarification indicator scrolls/highlights the relevant entries.

**Acceptance Scenarios**:

1. **Given** a spec with a Clarifications section containing 3 Q&A entries, **When** the clarification panel is expanded, **Then** all 3 entries display with question, answer, and the date/session identifier
2. **Given** a spec with no Clarifications section, **When** the Spec tab loads, **Then** the clarification panel shows an empty state message indicating no clarifications were recorded
3. **Given** a story card shows "2 clarifications", **When** the developer clicks that indicator, **Then** the clarification panel expands and scrolls to show the relevant Q&A entries

---

### User Story 4 - Interact with Graph Nodes (Priority: P2)

The requirements graph is interactive. The developer can drag nodes to rearrange the layout for clarity. The graph supports zoom and pan for navigating larger requirement sets. Node positions reset when the feature changes. Hovering over a node shows a tooltip with its full description (the requirement text or story title).

**Why this priority**: Interactivity makes the graph usable for real projects with 5-20 requirements. Without drag/zoom, dense graphs become unreadable. But the graph is still useful in a static layout, so this enhances rather than enables.

**Independent Test**: Can be tested by loading a feature with 10+ requirements, dragging a node to a new position, zooming in/out, and verifying the graph responds smoothly.

**Acceptance Scenarios**:

1. **Given** the requirements graph is displayed, **When** the developer drags a node, **Then** the node moves to the new position and connected edges follow
2. **Given** a graph with 15 nodes, **When** the developer uses zoom controls (scroll or pinch), **Then** the graph scales smoothly around the cursor position
3. **Given** the developer hovers over an FR node, **When** the tooltip appears, **Then** it shows the full requirement text from spec.md

---

### User Story 5 - Live Updates on Spec Changes (Priority: P2)

While the developer views the Spec Story Map, changes to spec.md on disk are reflected in the view. If a new story is added to spec.md, a new card appears in the story map. If a new requirement is added, a new node appears in the graph. The developer sees the spec evolve in real time as agents work.

**Why this priority**: Real-time accuracy is a constitutional principle. However, spec.md changes less frequently than tasks.md during active development, so this is important but lower urgency than the core visualizations.

**Independent Test**: Can be tested by opening the Spec tab, then modifying spec.md to add a new story. Verify the new story card appears within 5 seconds without a page refresh.

**Acceptance Scenarios**:

1. **Given** the story map is displayed, **When** a new user story is added to spec.md, **Then** the new story card appears in the correct swim lane within 5 seconds
2. **Given** the requirements graph is displayed, **When** a new FR-xxx is added to spec.md, **Then** a new node appears in the graph within 5 seconds

---

### Edge Cases

- What happens when a spec has no user stories? (Show an empty story map with a message indicating no stories are defined yet)
- What happens when stories reference requirement IDs that don't exist in the Requirements section? (Show the edge to a placeholder node indicating an undefined requirement)
- What happens when a spec has requirements but no stories reference them? (Show the orphaned requirement nodes in the graph with a distinct visual indicator)
- How does the system handle a spec with 10 stories and 20 requirements? (The graph must remain readable — nodes should not overlap, and the layout should spread them clearly)
- What happens when the Clarifications section has malformed entries? (Show what can be parsed, skip malformed entries gracefully)
- What happens when spec.md has no Requirements section? (Show the story map only, with an empty graph area and a message indicating no requirements are defined)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST render a story map with stories arranged horizontally by journey order and vertically by priority swim lanes (P1, P2, P3)
- **FR-002**: System MUST display each story as a card showing title, priority badge, acceptance scenario count, linked requirement IDs, and clarification count
- **FR-003**: System MUST render an interactive node graph showing user stories (US), functional requirements (FR-xxx), and success criteria (SC-xxx) as distinct node types
- **FR-004**: System MUST draw edges between stories and the requirements they reference. Success criteria nodes are displayed but not connected (no explicit cross-references exist in the spec format)
- **FR-005**: System MUST visually distinguish the three node types (US, FR, SC) using distinct colors or shapes
- **FR-006**: System MUST highlight a clicked node and its direct connections while dimming unrelated nodes and edges
- **FR-007**: System MUST support dragging nodes to rearrange the graph layout
- **FR-008**: System MUST support zoom and pan for navigating the requirements graph
- **FR-009**: System MUST display a collapsible right sidebar panel showing Q&A entries parsed from the spec's Clarifications section
- **FR-010**: System MUST show total clarification count on each story card (clarifications refine the whole spec, not individual stories) and link the indicator to open the clarification panel
- **FR-011**: System MUST update the story map and requirements graph in real time when spec.md changes on disk
- **FR-012**: System MUST handle missing or incomplete artifacts gracefully, showing appropriate empty states
- **FR-013**: System MUST support 1-10 stories and 5-20 requirements without visual degradation
- **FR-014**: System MUST show tooltips with full description text when hovering over graph nodes
- **FR-015**: System MUST parse requirement references from the entire story section — description and acceptance scenarios (pattern: FR-xxx, SC-xxx)
- **FR-016**: System MUST scroll to and highlight the corresponding US node in the requirements graph when a story card is clicked in the story map
- **FR-017**: System MUST use accessible markup with appropriate labels for interactive elements

### Key Entities

- **Story Card**: A visual card representing one user story from spec.md. Has a title, priority (P1/P2/P3), acceptance scenario count, linked requirement IDs, and clarification count. Placed in the story map by journey order and priority swim lane
- **Requirement Node**: A graph node representing a functional requirement (FR-xxx). Has an ID and description text. Connected to stories that reference it
- **Success Criterion Node**: A graph node representing a success criterion (SC-xxx). Has an ID and description. Connected to requirements that support it
- **Story Node**: A graph node representing a user story (US-N) in the requirements graph. Connected to the requirements it references
- **Clarification Entry**: A Q&A pair from the Clarifications section of spec.md. Has a question, answer, session date, and links to the spec sections it refined

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Developers can identify the priority distribution of stories within 3 seconds of opening the Spec tab
- **SC-002**: Developers can trace from any story to its requirements to its success criteria in under 3 clicks using the graph
- **SC-003**: The requirements graph correctly displays all FR/SC/US nodes and their connections for specs with up to 20 requirements
- **SC-004**: Orphaned requirements (not referenced by any story) are visually identifiable in the graph
- **SC-005**: Clarification Q&As are accessible from both the clarification panel and story card indicators
- **SC-006**: Artifact changes are reflected in the view within 5 seconds without page refresh
- **SC-007**: The visualization is visually consistent with the dashboard's existing design language — same typography, color palette, and quality level
- **SC-008**: The graph remains readable and interactive with 10 stories and 20 requirements without overlapping nodes

## Clarifications

### Session 2026-02-11

- Q: How should FR-to-SC cross-linking work in the graph? -> A: Only draw US→FR edges. SC nodes appear standalone since no explicit cross-references exist in the spec format
- Q: Should requirement nodes show task/test coverage status? -> A: No. Coverage belongs to the Tasks phase. The Spec Story Map only visualizes spec.md content (stories, requirements, success criteria, clarifications)
- Q: Where should the clarification trail panel be placed? -> A: Right sidebar panel, collapsible — overlays or pushes content left when open
- Q: Where in a story section should FR-xxx references be scanned? -> A: Scan the entire story section — description and acceptance scenarios
- Q: How should clarifications be linked to story cards? -> A: Global count on all cards — clarifications refine the whole spec, not individual stories
- Q: What happens when a story card is clicked? -> A: Scrolls to and highlights the corresponding US node in the requirements graph
- Q: How does the graph behave when the sidebar opens? -> A: Content area shrinks with CSS transition, graph scales proportionally
- Q: Should the Spec Story Map show task/test coverage traceability? -> A: No. Coverage traceability (tasks→FR, tests→FR) belongs to their respective downstream panels (Tasks, Testify). By the time those panels are built, the Spec panel will already exist and they can add traceability links back to it. Add this as a note to the relevant GitHub issues.
