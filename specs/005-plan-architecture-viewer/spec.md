# Feature Specification: Plan Architecture Viewer

**Feature Branch**: `005-plan-architecture-viewer`
**Created**: 2026-02-11
**Status**: Draft
**Input**: User description: "005: Plan Architecture Viewer — Tech Stack, Structure Tree, Dependency Diagram. Full visualization of the technical plan with three sub-views."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Tech Stack Badge Wall (Priority: P1)

A developer clicks the "Plan" phase node in the pipeline and sees a visual grid of technology choices extracted from plan.md's Technical Context section. Each technology is shown as a styled badge displaying the category label and value. Badges are grouped by category — runtime, dependencies, storage, testing, platform, and constraints. The developer can immediately understand the technology decisions that underpin the plan.

**Why this priority**: The tech stack is the fastest way to orient a developer about a plan. It answers the fundamental question: "What are we building with?" and provides the entry point to the Plan phase content. It is also the simplest sub-view to parse and render, making it the best MVP.

**Independent Test**: Can be tested by selecting a feature that has a complete plan.md with a Technical Context section. Open the Plan tab and verify badges appear grouped by category with correct values from the file.

**Acceptance Scenarios**:

1. **Given** a feature with plan.md containing 8 Technical Context entries, **When** the Plan tab loads, **Then** 8 badges render in a grid, each showing category name and value
2. **Given** a plan.md with categories including Language/Version, Primary Dependencies, Storage, Testing, and Target Platform, **When** the badge wall renders, **Then** badges are visually grouped by category type
3. **Given** the developer hovers over a badge, **When** the hover event fires, **Then** a tooltip shows additional context if available from research.md (technology decision rationale)

---

### User Story 2 - Explore Project Structure Tree (Priority: P1)

Below the badge wall, the developer sees the planned file/directory structure from plan.md rendered as an interactive tree. Directories are expandable and collapsible. Each file entry shows a file-type icon and the inline comment from the plan (describing the file's purpose). Files that already exist on disk are visually distinguished from files that are only planned. The developer can quickly understand how the project is organized and what each file does.

**Why this priority**: The project structure tree is the second core visualization of the Plan phase. It answers: "How is the code organized and what does each piece do?" This is essential context before an implementation phase. Along with the badge wall, it provides a complete plan overview.

**Independent Test**: Can be tested by selecting a feature with plan.md containing a File Structure section with directories, files, and inline comments. Open the Plan tab and verify the tree renders with correct nesting, icons, and expand/collapse behavior.

**Acceptance Scenarios**:

1. **Given** a plan.md with a File Structure section showing a tree with 3 directories and 8 files, **When** the tree renders, **Then** all directories and files appear with correct nesting and hierarchy
2. **Given** the tree is displayed with all directories expanded, **When** the developer clicks a directory, **Then** it collapses to hide its children, and clicking again re-expands it
3. **Given** a plan.md that lists `src/parser.js` and that file exists on disk, **When** the tree renders, **Then** `src/parser.js` is visually marked as "existing" while a file like `src/new-feature.js` that doesn't exist on disk is marked as "planned"
4. **Given** a file entry in plan.md has an inline comment `# Express + WebSocket server`, **When** the tree renders, **Then** the comment is displayed as an annotation next to the file name

---

### User Story 3 - View Architecture Diagram (Priority: P1)

The developer sees a proper rendered diagram derived from the ASCII architecture diagram in plan.md. The ASCII box-and-arrow art is parsed and rendered as styled, interactive boxes (nodes) with labeled arrows (edges) showing data flow between components. Nodes are color-coded by component type — the developer can distinguish between browser/client components, server components, storage/file system components, and external services at a glance. Clicking a node shows a detail panel with the node's content text from the original diagram.

**Why this priority**: The architecture diagram is the most visually impactful part of the Plan phase view and the most technically interesting. It transforms hard-to-read ASCII art into professional, interactive diagrams. It answers: "How do the components connect and communicate?" — the architectural big picture.

**Independent Test**: Can be tested by selecting a feature with plan.md containing an ASCII architecture diagram using box-drawing characters. Open the Plan tab and verify boxes, arrows, and labels from the ASCII art are rendered as styled interactive elements.

**Acceptance Scenarios**:

1. **Given** a plan.md with an ASCII diagram containing 3 boxes and 2 arrows, **When** the diagram renders, **Then** 3 styled nodes and 2 labeled edges appear matching the ASCII content
2. **Given** the rendered diagram has nodes for "Browser", "Node.js Server", and "Project Directory", **When** the developer views the diagram, **Then** each node has a distinct color based on its type (client, server, filesystem)
3. **Given** the developer clicks a node labeled "Node.js Server", **When** the click registers, **Then** a detail panel shows the text content inside that box from the original ASCII diagram
4. **Given** an ASCII diagram with labeled connectors (e.g., `ws://localhost:PORT` or `fs.watch`), **When** the diagram renders, **Then** the connector labels appear on or near the corresponding edges

---

### User Story 4 - View Matched Tessl Tiles (Priority: P2)

Below the Tech Stack badge wall, the developer sees a Tessl integration panel. The system reads installed tiles from `tessl.json` in the project root and displays a card for each tile. Each card shows the tile name, version, and workspace. When evaluation data becomes available via the Tessl API, each card also shows an eval score visualization — a percentage with a bar chart and multiplier indicator (as seen on the Tessl registry). Until evals are available, the card shows the tile info without a score.

**Why this priority**: Tessl tiles provide curated documentation and quality signals for dependencies. Showing which tiles are available helps developers understand the tooling ecosystem around their tech stack. However, the tech stack badges are useful on their own, so this enriches rather than enables the Plan view.

**Independent Test**: Can be tested by selecting a feature whose plan.md lists dependencies that have Tessl tiles (e.g., Express, Jest). Open the Plan view and verify tile cards appear with correct name, version, and description matching the Tessl registry.

**Acceptance Scenarios**:

1. **Given** a project with `tessl.json` listing 4 installed tiles, **When** the Tessl panel loads, **Then** 4 tile cards render showing tile name and version
2. **Given** `tessl.json` lists `tessl/npm-express` at version 5.1.0, **When** the card renders, **Then** it shows "tessl/npm-express" and "v5.1.0"
3. **Given** no `tessl.json` exists in the project root, **When** the Plan view loads, **Then** the Tessl panel is not shown
4. **Given** evaluation data is available for a tile, **When** the card renders, **Then** it shows the eval score as a percentage with a bar chart visualization and multiplier badge
5. **Given** evaluation data is not yet available for a tile, **When** the card renders, **Then** it shows the tile info without a score section (no placeholder or "coming soon" — just absent)

---

### User Story 5 - Live Updates on Plan Changes (Priority: P2)

While the developer views the Plan Architecture Viewer, changes to plan.md on disk are reflected in the view. If the tech stack changes, badges update. If the file structure changes, the tree updates. If the architecture diagram is modified, the rendered diagram updates. The developer sees the plan evolve in real time.

**Why this priority**: Real-time accuracy is a constitutional principle. However, plan.md changes infrequently once written, so this is important for correctness but lower urgency than the core visualizations.

**Independent Test**: Can be tested by opening the Plan tab, then modifying plan.md to add a new dependency. Verify the badge wall updates within 5 seconds without a page refresh.

**Acceptance Scenarios**:

1. **Given** the badge wall is displayed, **When** a new entry is added to plan.md's Technical Context, **Then** a new badge appears within 5 seconds without page refresh
2. **Given** the structure tree is displayed, **When** a new file is added to plan.md's File Structure section, **Then** a new tree entry appears within 5 seconds
3. **Given** the architecture diagram is displayed, **When** a box is added to the ASCII diagram in plan.md, **Then** a new node appears in the rendered diagram within 5 seconds

---

### Edge Cases

- What happens when plan.md does not exist for a feature? (Show an empty state with a message indicating no plan has been created yet, and suggest running `/iikit-03-plan`)
- What happens when plan.md exists but has no Technical Context section? (Show an empty badge wall with a message indicating no tech stack is defined)
- What happens when plan.md exists but has no File Structure section? (Show an empty tree with a message indicating no structure is defined)
- What happens when plan.md has no ASCII diagram? (The Architecture section is not shown — only Tech Stack and Structure sections appear)
- What happens when the ASCII diagram uses non-standard characters? (Best-effort parsing; fall back to displaying the raw ASCII in a code block if parsing fails)
- What happens when research.md does not exist? (Badge tooltips simply don't show rationale — the badges still render normally)
- How does the system handle a File Structure with 30+ files? (The tree must remain performant and usable — first 2 levels expanded, deeper nesting collapsed by default)
- What happens when the plan references files in its structure but the project directory doesn't exist yet? (All files are marked as "planned")
- What happens when `tessl.json` has no dependencies listed? (Show an empty Tessl panel with a message indicating no tiles are installed)
- What happens when `tessl.json` is malformed? (Skip the Tessl panel gracefully; other sections render normally)
- What happens when the Tessl API call for eval scores fails (network error, timeout, 500)? (Treat as "data unavailable" per FR-015 — omit eval score silently, same as when no eval data exists)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST render a badge wall displaying technology choices from plan.md's Technical Context section as styled badges grouped by category
- **FR-002**: System MUST display each badge with the category label and its value
- **FR-003**: System MUST show a tooltip on badge hover with technology decision rationale from research.md when available
- **FR-004**: System MUST render an interactive file tree from plan.md's File Structure section with expand/collapse behavior on directories
- **FR-005**: System MUST display file-type icons next to each entry in the structure tree
- **FR-006**: System MUST show inline comments from plan.md as annotations next to file names in the tree
- **FR-007**: System MUST visually distinguish files that exist on disk from files that are only planned. File paths are resolved relative to the repository root, stripping the tree's named root directory (e.g., `iikit-kanban/src/server.js` checks `<repo-root>/src/server.js`)
- **FR-008**: System MUST parse ASCII architecture diagrams from plan.md and render them as styled, interactive node-and-edge diagrams
- **FR-009**: System MUST color-code diagram nodes by component type (client, server, storage, external), using LLM classification of node labels to determine type
- **FR-010**: System MUST display edge labels from the ASCII diagram on the corresponding rendered edges
- **FR-011**: System MUST show a detail panel when a diagram node is clicked, displaying the node's content from the original ASCII text
- **FR-012**: System MUST read installed tiles from `tessl.json` in the project root and display them in a panel below the badge wall
- **FR-013**: System MUST display each installed tile as a card showing tile name (workspace/tile) and version
- **FR-014**: System MUST show an eval score visualization (percentage, bar chart, multiplier) on tile cards when evaluation data is available from the Tessl API
- **FR-015**: System MUST gracefully omit the eval score section when evaluation data is not available (no placeholder text)
- **FR-016**: System MUST not show the Tessl panel when no `tessl.json` exists
- **FR-017**: System MUST display all sub-views in a single vertically scrollable layout: Tech Stack badge wall, then Tessl tiles panel, then Structure tree, then Architecture diagram (if present). Overflows vertically on smaller screens
- **FR-018**: System MUST update all visible sub-views in real time when plan.md changes on disk (including showing/hiding the Architecture section if a diagram is added or removed)
- **FR-019**: System MUST handle missing or incomplete plan artifacts gracefully, showing appropriate empty states with guidance
- **FR-020**: System MUST support plan.md files with up to 15 tech stack entries, 30 files in the structure, and diagrams with 10 nodes without visual degradation
- **FR-021**: System MUST use accessible markup with appropriate labels for all interactive elements

### Key Entities

- **Tech Badge**: A visual badge representing one technology choice from plan.md's Technical Context. Has a category label (e.g., "Language/Version") and a value (e.g., "Node.js 20+"). Optionally linked to rationale from research.md
- **Structure Entry**: A node in the file tree representing a file or directory from plan.md's File Structure. Has a name, type (file/directory), inline comment, nesting depth, and existence status (existing vs. planned)
- **Architecture Node**: A styled box in the rendered diagram representing a component from the ASCII diagram. Has a label, content text, component type (client/server/storage/external), and position
- **Architecture Edge**: A styled arrow in the rendered diagram representing a connection from the ASCII diagram. Has a source node, target node, and optional label
- **Tessl Tile Card**: A card representing an installed Tessl tile from `tessl.json`. Has tile name (e.g., `tessl/npm-express`), version, and optionally an eval score (percentage, bar chart, multiplier) when available from the Tessl API
- **Plan Phase View**: Container for the sub-views in a single scrollable layout, accessible from the Phase 3 node in the pipeline. Manages data loading from plan.md, research.md, and tessl.json

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Developers can identify the complete tech stack of a feature within 5 seconds of opening the Plan tab
- **SC-002**: Developers can understand the project file organization by expanding the structure tree in under 3 clicks
- **SC-003**: The architecture diagram correctly renders all boxes, arrows, and labels from ASCII diagrams with up to 10 nodes
- **SC-004**: Files marked as "existing" in the structure tree accurately reflect what is on disk
- **SC-005**: Artifact changes to plan.md are reflected in the view within 5 seconds without page refresh
- **SC-006**: The visualization is visually consistent with the dashboard's existing design language — same typography, color palette, and quality level
- **SC-007**: All sub-views are visible in a single scrollable layout (Architecture section appears only when an ASCII diagram exists)
- **SC-008**: ASCII diagram parsing succeeds for the standard patterns used in existing plan.md files (box-drawing characters, labeled arrows)

## Clarifications

### Session 2026-02-11

- Q: Should Key Design Decisions, Constitution Check, and API Contract sections from plan.md be visible in the Plan tab? -> A: No. The Plan tab only shows the three specified sub-views (Tech Stack, Structure, Architecture). Other sections are text-heavy and better read in the raw markdown. Keeping scope tight aligns with Constitution V (Simplicity) [FR-017, SC-007]
- Q: How should the system determine a diagram node's component type for color coding? -> A: Use LLM classification — pass node labels to an LLM and ask what architectural category each belongs to (client, server, storage, external). More flexible than keyword matching and handles edge cases [FR-009, US-3]
- Q: When checking file existence on disk (FR-007), what path should the tree's root directory map to? -> A: Repository root, stripping the tree's named root directory. E.g., `iikit-kanban/src/server.js` checks `<repo-root>/src/server.js` [FR-007, US-2]
- Q: Should the three sub-views use tab navigation or a single scrollable layout? -> A: Single vertically scrollable layout — all sub-views visible at once, no tabs. Simpler (Constitution V) and sufficient screen real estate. Overflows vertically on smaller screens [FR-017, SC-007]
- Q: Should the Plan view show matched Tessl tiles for tech stack dependencies? -> A: Yes. Show a Tessl panel below the badge wall. Read installed tiles from `tessl.json` (no registry search needed — tiles are already installed). Show tile cards with name/version. Show eval scores when the Tessl API makes them available; omit the score section (not a placeholder) when unavailable [FR-012, FR-013, FR-014, FR-015, US-4]
- Q: How should the system find which Tessl tiles match the tech stack? -> A: Don't search the registry. Just read `tessl.json` from the project root — it already lists all installed tiles with their workspace/name and version [FR-012, US-4]
- Q: Should badge visual design be specified in the spec? -> A: No. Defer to implementation using the existing dashboard CSS design system (custom properties, same typography/colors). Spec defines WHAT to show, not pixel-level styling [FR-001, FR-002]
- Q: What should the default expand/collapse state of the file tree be on initial load? -> A: Depth-based — expand the first 2 levels, collapse deeper nesting. Balances overview visibility with manageable tree size [FR-004, US-2]
- Q: Should the architecture diagram support zoom/pan? -> A: No. Fixed-size SVG that scales to container width. Simpler (Constitution V) and sufficient for diagrams with up to 10 nodes [FR-008, US-3]
- Q: Should there be a timeout for the LLM classification call? -> A: Yes, 5 seconds. Matches the live update SLA. On timeout, fall back to uniform "default" node type coloring [FR-009, US-3]

### Session 2026-02-13

- Q: How should the system handle Tessl API errors when fetching eval scores? -> A: Treat API errors same as "data unavailable" — omit eval score silently [FR-014, FR-015, US-4]
