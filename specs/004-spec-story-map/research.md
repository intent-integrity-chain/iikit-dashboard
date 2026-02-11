# Research: Spec Story Map

## Decisions

### 1. No new server-side dependencies
**Decision**: Reuse Express, ws, chokidar from existing codebase. Add a new `storymap.js` module for spec parsing logic.
**Rationale**: The story map needs to parse spec.md more deeply (stories, requirements, success criteria, clarifications, and cross-references). All infrastructure (HTTP server, WebSocket push, file watching) already exists.
**Alternatives considered**: Adding a markdown AST parser like `remark` (rejected — the spec format is well-defined enough for regex-based parsing, consistent with existing parser.js approach).

### 2. No client-side graph library — use SVG directly
**Decision**: Render the requirements graph using inline SVG with a simple force-directed layout implemented in vanilla JS.
**Rationale**: The project has zero build step and zero client-side dependencies (constitution principle V: Simplicity). The graph has at most ~30 nodes (10 stories + 20 requirements). A full graph library (D3, vis.js, cytoscape) would be massive overkill. SVG provides native zoom/pan via viewBox transforms and native drag via mouse events.
**Alternatives considered**: D3.js force simulation (rejected — adds 250KB dependency for a graph of <30 nodes). Canvas-based rendering (rejected — harder to make interactive and accessible). CSS-only layout (rejected — can't draw edges between nodes).

### 3. Story map uses CSS Grid, not SVG
**Decision**: The story map (horizontal journey, vertical priority swim lanes) is a CSS Grid layout with story cards as DOM elements.
**Rationale**: Story cards need rich content (text, badges, counts, click handlers). CSS Grid naturally handles the 2D layout with priority rows. DOM elements are more accessible than SVG for card content.
**Alternatives considered**: SVG for both map and graph (rejected — story cards have too much text content for SVG).

### 4. New API endpoint `/api/storymap/:feature`
**Decision**: Add a dedicated API endpoint that returns parsed spec data for the story map view.
**Rationale**: The existing `/api/board/:feature` returns task-based board state. The story map needs different data: stories with acceptance scenario counts, requirement lists, success criteria, clarification entries, and cross-references. Mixing this into the board endpoint would violate single responsibility.
**Alternatives considered**: Reusing `/api/board/:feature` with additional fields (rejected — different consumers, different data shapes).

### 5. Force-directed layout with simple spring simulation
**Decision**: Implement a basic force-directed graph layout: nodes repel each other, edges pull connected nodes together, simulation runs for a fixed number of iterations on initial render.
**Rationale**: Force-directed layout naturally clusters connected nodes and spreads disconnected ones. With <30 nodes, the simulation converges in <100 iterations (< 50ms). No animation needed — compute final positions and render.
**Alternatives considered**: Hierarchical layout (rejected — US→FR is not strictly hierarchical since multiple stories can share requirements). Grid layout (rejected — doesn't convey relationships).

### 6. Clarification panel is a CSS sidebar with transition
**Decision**: The clarification trail is a fixed-position right sidebar that slides in/out with a CSS transform transition. Main content area shrinks when sidebar is open.
**Rationale**: Standard sidebar pattern. CSS transitions are smooth and performant. No JS animation library needed.

## Tessl Tiles

No new tiles needed — the tech stack is unchanged from previous features. Existing tiles remain installed.
