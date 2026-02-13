# Test Specifications: Plan Architecture Viewer

**Generated**: 2026-02-11
**Feature**: [spec.md](../spec.md) | **Plan**: [plan.md](../plan.md)

## TDD Assessment

**Determination**: mandatory
**Confidence**: high
**Evidence**: "TDD MUST be used for all feature development. Tests MUST be written before implementation code. The red-green-refactor cycle MUST be strictly followed."
**Reasoning**: Constitution Principle I explicitly mandates TDD with NON-NEGOTIABLE marker. Tests define the contract; implementation fulfills it.

---

<!--
DO NOT MODIFY TEST ASSERTIONS

These test specifications define the expected behavior derived from requirements.
During implementation:
- Fix code to pass tests, don't modify test assertions
- Structural changes (file organization, naming) are acceptable with justification
- Logic changes to assertions require explicit justification and re-review

If requirements change, re-run /iikit-05-testify to regenerate test specs.
-->

## From spec.md (Acceptance Tests)

### TS-001: Tech stack badges render from plan.md Technical Context

**Source**: spec.md:User Story 1:scenario-1
**Type**: acceptance
**Priority**: P1

**Given**: a feature with plan.md containing 8 Technical Context entries
**When**: the Plan tab loads
**Then**: 8 badges render in a grid, each showing category name and value

**Traceability**: FR-001, FR-002, SC-001, US-001-scenario-1

---

### TS-002: Badges grouped by category type

**Source**: spec.md:User Story 1:scenario-2
**Type**: acceptance
**Priority**: P1

**Given**: a plan.md with categories including Language/Version, Primary Dependencies, Storage, Testing, and Target Platform
**When**: the badge wall renders
**Then**: badges are visually grouped by category type

**Traceability**: FR-001, US-001-scenario-2

---

### TS-003: Badge tooltip shows research.md rationale

**Source**: spec.md:User Story 1:scenario-3
**Type**: acceptance
**Priority**: P1

**Given**: the developer hovers over a badge
**When**: the hover event fires
**Then**: a tooltip shows additional context if available from research.md (technology decision rationale)

**Traceability**: FR-003, US-001-scenario-3

---

### TS-004: File tree renders with correct nesting

**Source**: spec.md:User Story 2:scenario-1
**Type**: acceptance
**Priority**: P1

**Given**: a plan.md with a File Structure section showing a tree with 3 directories and 8 files
**When**: the tree renders
**Then**: all directories and files appear with correct nesting and hierarchy

**Traceability**: FR-004, SC-002, US-002-scenario-1

---

### TS-005: File tree expand/collapse

**Source**: spec.md:User Story 2:scenario-2
**Type**: acceptance
**Priority**: P1

**Given**: the tree is displayed with all directories expanded
**When**: the developer clicks a directory
**Then**: it collapses to hide its children, and clicking again re-expands it

**Traceability**: FR-004, US-002-scenario-2

---

### TS-006: File existence indicators

**Source**: spec.md:User Story 2:scenario-3
**Type**: acceptance
**Priority**: P1

**Given**: a plan.md that lists `src/parser.js` and that file exists on disk
**When**: the tree renders
**Then**: `src/parser.js` is visually marked as "existing" while a file like `src/new-feature.js` that doesn't exist on disk is marked as "planned"

**Traceability**: FR-007, SC-004, US-002-scenario-3

---

### TS-007: Inline comments displayed as annotations

**Source**: spec.md:User Story 2:scenario-4
**Type**: acceptance
**Priority**: P1

**Given**: a file entry in plan.md has an inline comment `# Express + WebSocket server`
**When**: the tree renders
**Then**: the comment is displayed as an annotation next to the file name

**Traceability**: FR-006, US-002-scenario-4

---

### TS-008: ASCII diagram renders as styled nodes and edges

**Source**: spec.md:User Story 3:scenario-1
**Type**: acceptance
**Priority**: P1

**Given**: a plan.md with an ASCII diagram containing 3 boxes and 2 arrows
**When**: the diagram renders
**Then**: 3 styled nodes and 2 labeled edges appear matching the ASCII content

**Traceability**: FR-008, SC-003, US-003-scenario-1

---

### TS-009: Diagram nodes color-coded by type

**Source**: spec.md:User Story 3:scenario-2
**Type**: acceptance
**Priority**: P1

**Given**: the rendered diagram has nodes for "Browser", "Node.js Server", and "Project Directory"
**When**: the developer views the diagram
**Then**: each node has a distinct color based on its type (client, server, filesystem)

**Traceability**: FR-009, US-003-scenario-2

---

### TS-010: Diagram node click shows detail panel

**Source**: spec.md:User Story 3:scenario-3
**Type**: acceptance
**Priority**: P1

**Given**: the developer clicks a node labeled "Node.js Server"
**When**: the click registers
**Then**: a detail panel shows the text content inside that box from the original ASCII diagram

**Traceability**: FR-011, US-003-scenario-3

---

### TS-011: Diagram edge labels render

**Source**: spec.md:User Story 3:scenario-4
**Type**: acceptance
**Priority**: P1

**Given**: an ASCII diagram with labeled connectors (e.g., `ws://localhost:PORT` or `fs.watch`)
**When**: the diagram renders
**Then**: the connector labels appear on or near the corresponding edges

**Traceability**: FR-010, US-003-scenario-4

---

### TS-012: Tessl panel shows installed tiles

**Source**: spec.md:User Story 4:scenario-1
**Type**: acceptance
**Priority**: P2

**Given**: a project with `tessl.json` listing 4 installed tiles
**When**: the Tessl panel loads
**Then**: 4 tile cards render showing tile name and version

**Traceability**: FR-012, FR-013, US-004-scenario-1

---

### TS-013: Tessl tile card shows name and version

**Source**: spec.md:User Story 4:scenario-2
**Type**: acceptance
**Priority**: P2

**Given**: `tessl.json` lists `tessl/npm-express` at version 5.1.0
**When**: the card renders
**Then**: it shows "tessl/npm-express" and "v5.1.0"

**Traceability**: FR-013, US-004-scenario-2

---

### TS-014: Tessl panel hidden when no tessl.json

**Source**: spec.md:User Story 4:scenario-3
**Type**: acceptance
**Priority**: P2

**Given**: no `tessl.json` exists in the project root
**When**: the Plan view loads
**Then**: the Tessl panel is not shown

**Traceability**: FR-016, US-004-scenario-3

---

### TS-015: Eval score visualization when available

**Source**: spec.md:User Story 4:scenario-4
**Type**: acceptance
**Priority**: P2

**Given**: evaluation data is available for a tile
**When**: the card renders
**Then**: it shows the eval score as a percentage with a bar chart visualization and multiplier badge

**Traceability**: FR-014, US-004-scenario-4

---

### TS-016: Eval score absent when unavailable

**Source**: spec.md:User Story 4:scenario-5
**Type**: acceptance
**Priority**: P2

**Given**: evaluation data is not yet available for a tile
**When**: the card renders
**Then**: it shows the tile info without a score section (no placeholder or "coming soon" — just absent)

**Traceability**: FR-015, US-004-scenario-5

---

### TS-017: Live update — badge wall

**Source**: spec.md:User Story 5:scenario-1
**Type**: acceptance
**Priority**: P2

**Given**: the badge wall is displayed
**When**: a new entry is added to plan.md's Technical Context
**Then**: a new badge appears within 5 seconds without page refresh

**Traceability**: FR-018, SC-005, US-005-scenario-1

---

### TS-018: Live update — structure tree

**Source**: spec.md:User Story 5:scenario-2
**Type**: acceptance
**Priority**: P2

**Given**: the structure tree is displayed
**When**: a new file is added to plan.md's File Structure section
**Then**: a new tree entry appears within 5 seconds

**Traceability**: FR-018, SC-005, US-005-scenario-2

---

### TS-019: Live update — architecture diagram

**Source**: spec.md:User Story 5:scenario-3
**Type**: acceptance
**Priority**: P2

**Given**: the architecture diagram is displayed
**When**: a box is added to the ASCII diagram in plan.md
**Then**: a new node appears in the rendered diagram within 5 seconds

**Traceability**: FR-018, SC-005, US-005-scenario-3

---

## From plan.md (Contract Tests)

### TS-020: GET /api/planview/:feature returns plan view state

**Source**: plan.md:API Contract:GET /api/planview
**Type**: contract
**Priority**: P1

**Given**: a feature "001-kanban-board" exists with plan.md
**When**: GET /api/planview/001-kanban-board is requested
**Then**: response is JSON with status 200 containing techContext array, fileStructure object, diagram object (or null), tesslTiles array, and exists: true

**Traceability**: plan.md API Contract

---

### TS-021: GET /api/planview/:feature returns 200 with exists:false for missing plan

**Source**: plan.md:API Contract:GET /api/planview
**Type**: contract
**Priority**: P1

**Given**: a feature "999-nonexistent" has no plan.md
**When**: GET /api/planview/999-nonexistent is requested
**Then**: response is JSON with status 200 containing exists: false and empty arrays/nulls for all fields

**Traceability**: FR-019, plan.md API Contract

---

### TS-022: WebSocket sends planview_update on plan.md change

**Source**: plan.md:WebSocket Messages:planview_update
**Type**: contract
**Priority**: P2

**Given**: a client is connected via WebSocket and subscribed to a feature
**When**: plan.md for that feature is modified on disk
**Then**: the server sends a message with type "planview_update" containing the updated plan view state

**Traceability**: FR-018, plan.md WebSocket Messages

---

### TS-023: techContext array entries have label and value

**Source**: plan.md:Response Shape:techContext
**Type**: contract
**Priority**: P1

**Given**: a plan.md with Technical Context containing "**Language/Version**: Node.js 20+ (LTS)"
**When**: the plan view state is computed
**Then**: techContext array contains an entry with label "Language/Version" and value "Node.js 20+ (LTS)"

**Traceability**: FR-001, FR-002, plan.md Response Shape

---

### TS-024: fileStructure entries include exists boolean

**Source**: plan.md:Response Shape:fileStructure
**Type**: contract
**Priority**: P1

**Given**: a plan.md with File Structure listing "server.js" and server.js exists on disk
**When**: the plan view state is computed
**Then**: the fileStructure entry for "server.js" has exists: true

**Traceability**: FR-007, plan.md Response Shape

---

### TS-025: diagram is null when no ASCII diagram exists

**Source**: plan.md:Response Shape:diagram
**Type**: contract
**Priority**: P1

**Given**: a plan.md with no Architecture Overview section
**When**: the plan view state is computed
**Then**: the diagram field is null

**Traceability**: FR-017, plan.md Response Shape

---

### TS-026: tesslTiles populated from tessl.json

**Source**: plan.md:Response Shape:tesslTiles
**Type**: contract
**Priority**: P2

**Given**: a tessl.json with dependency "tessl/npm-express" at version "5.1.0"
**When**: the plan view state is computed
**Then**: tesslTiles array contains an entry with name "tessl/npm-express", version "5.1.0", and eval null

**Traceability**: FR-012, FR-013, plan.md Response Shape

---

## From data-model.md (Validation Tests)

### TS-027: parseTechContext extracts bold-label-colon-value pairs

**Source**: data-model.md:TechContextEntry:parsing rule
**Type**: validation
**Priority**: P1

**Given**: plan.md content with lines matching `**Label**: Value` pattern in the Technical Context section
**When**: parseTechContext is called
**Then**: returns an array of {label, value} objects, one per matching line

**Traceability**: data-model.md TechContextEntry

---

### TS-028: parseFileStructure calculates correct depth

**Source**: data-model.md:FileStructureEntry:parsing rule
**Type**: validation
**Priority**: P1

**Given**: a file tree with entries at depth 0 (root children), depth 1 (one level nested), and depth 2 (two levels nested)
**When**: parseFileStructure is called
**Then**: each entry has the correct depth value based on leading tree characters

**Traceability**: data-model.md FileStructureEntry

---

### TS-029: parseFileStructure identifies directories vs files

**Source**: data-model.md:FileStructureEntry:parsing rule
**Type**: validation
**Priority**: P1

**Given**: a file tree with entries ending in `/` (directories) and without `/` (files)
**When**: parseFileStructure is called
**Then**: entries with trailing `/` or child entries are type "directory", others are type "file"

**Traceability**: data-model.md FileStructureEntry

---

### TS-030: parseFileStructure extracts inline comments

**Source**: data-model.md:FileStructureEntry:parsing rule
**Type**: validation
**Priority**: P1

**Given**: a file tree entry with `server.js          # Express + WebSocket server`
**When**: parseFileStructure is called
**Then**: the entry has name "server.js" and comment "Express + WebSocket server"

**Traceability**: FR-006, data-model.md FileStructureEntry

---

### TS-031: parseFileStructure strips root directory name

**Source**: data-model.md:FileStructureEntry:path resolution
**Type**: validation
**Priority**: P1

**Given**: a file tree starting with `iikit-kanban/` as the root
**When**: parseFileStructure is called
**Then**: the rootName is "iikit-kanban" and entries are relative to it (depth 0 = direct children of iikit-kanban)

**Traceability**: FR-007, data-model.md FileStructureEntry

---

### TS-032: parseAsciiDiagram detects boxes with box-drawing characters

**Source**: data-model.md:DiagramNode:parsing rule
**Type**: validation
**Priority**: P1

**Given**: ASCII text with a box drawn using `┌`, `─`, `┐`, `│`, `└`, `┘` containing the text "Browser"
**When**: parseAsciiDiagram is called
**Then**: returns a node with label "Browser" and correct x, y, width, height from the character grid

**Traceability**: FR-008, data-model.md DiagramNode

---

### TS-033: parseAsciiDiagram extracts all text content from boxes

**Source**: data-model.md:DiagramNode:parsing rule
**Type**: validation
**Priority**: P1

**Given**: a box containing multiple lines of text ("Node.js Server", "Express", "ws", "chokidar")
**When**: parseAsciiDiagram is called
**Then**: the node's label is "Node.js Server" (first non-empty line) and content contains all text lines joined with newlines

**Traceability**: FR-011, data-model.md DiagramNode

---

### TS-034: parseAsciiDiagram detects connections between boxes

**Source**: data-model.md:DiagramEdge:parsing rule
**Type**: validation
**Priority**: P1

**Given**: ASCII text with two boxes connected by vertical connector characters between them
**When**: parseAsciiDiagram is called
**Then**: returns an edge linking the two boxes with the correct from and to node IDs

**Traceability**: FR-008, data-model.md DiagramEdge

---

### TS-035: parseAsciiDiagram extracts edge labels

**Source**: data-model.md:DiagramEdge:parsing rule
**Type**: validation
**Priority**: P1

**Given**: ASCII text with a connector between boxes and the text "ws://localhost:PORT" adjacent to the connector
**When**: parseAsciiDiagram is called
**Then**: the edge has label "ws://localhost:PORT"

**Traceability**: FR-010, data-model.md DiagramEdge

---

### TS-036: parseAsciiDiagram handles nested boxes

**Source**: data-model.md:DiagramNode:parsing rule
**Type**: validation
**Priority**: P1

**Given**: ASCII text with a large outer box containing two smaller inner boxes
**When**: parseAsciiDiagram is called
**Then**: returns nodes for the outer box and both inner boxes with correct containment relationships

**Traceability**: FR-008, data-model.md DiagramNode

---

### TS-037: parseTesslJson reads dependencies from tessl.json

**Source**: data-model.md:TesslTile:parsing rule
**Type**: validation
**Priority**: P2

**Given**: a tessl.json file with dependencies {"tessl/npm-express": {"version": "5.1.0"}, "tessl/npm-ws": {"version": "8.18.0"}}
**When**: parseTesslJson is called
**Then**: returns [{name: "tessl/npm-express", version: "5.1.0", eval: null}, {name: "tessl/npm-ws", version: "8.18.0", eval: null}]

**Traceability**: FR-012, data-model.md TesslTile

---

### TS-038: parseTesslJson returns empty array when file missing

**Source**: data-model.md:TesslTile:parsing rule
**Type**: validation
**Priority**: P2

**Given**: no tessl.json file exists at the project root
**When**: parseTesslJson is called
**Then**: returns an empty array

**Traceability**: FR-016, data-model.md TesslTile

---

### TS-039: LLM classification falls back to "default" on timeout

**Source**: data-model.md:DiagramNode:type field
**Type**: validation
**Priority**: P2

**Given**: the LLM classification call exceeds the 5-second timeout
**When**: node types are resolved
**Then**: all nodes receive type "default"

**Traceability**: FR-009, Clarification: LLM timeout

---

### TS-040: LLM classification falls back to "default" without API key

**Source**: data-model.md:DiagramNode:type field
**Type**: validation
**Priority**: P2

**Given**: ANTHROPIC_API_KEY environment variable is not set
**When**: node types are resolved
**Then**: all nodes receive type "default"

**Traceability**: FR-009, plan.md Key Design Decision 3

---

### TS-041: parseResearchDecisions extracts decision entries

**Source**: data-model.md:ResearchDecision:parsing rule
**Type**: validation
**Priority**: P2

**Given**: a research.md with a decision headed "### 1. ASCII Diagram Parsing Approach" containing "**Decision**: Build a custom parser..." and "**Rationale**: The ASCII diagrams..."
**When**: parseResearchDecisions is called
**Then**: returns [{title: "ASCII Diagram Parsing Approach", decision: "Build a custom parser...", rationale: "The ASCII diagrams..."}]

**Traceability**: FR-003, data-model.md ResearchDecision

---

## Summary

| Source | Count | Types |
|--------|-------|-------|
| spec.md | 19 | acceptance |
| plan.md | 7 | contract |
| data-model.md | 15 | validation |
| **Total** | **41** | |
