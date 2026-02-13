# Research: Plan Architecture Viewer

**Feature**: 005-plan-architecture-viewer | **Date**: 2026-02-11

## Decisions

### 1. ASCII Diagram Parsing Approach

**Decision**: Build a custom parser for the box-drawing character patterns used in existing plan.md files
**Rationale**: The ASCII diagrams in this project consistently use Unicode box-drawing characters (`┌─┐│└┘├┤┬┴`). The patterns are predictable: rectangular boxes with text content, vertical/horizontal connectors between boxes, and labels near connectors. A focused parser for these specific patterns is simpler and more reliable than a general-purpose ASCII-to-diagram library. Aligns with Constitution V (Simplicity).
**Alternatives considered**:
- General ASCII diagram libraries (rejected — most target ASCII art styles like `+---+` rather than Unicode box-drawing; adds external dependency for a narrow use case)
- Regex-only parsing (rejected — box-drawing character patterns span multiple lines, making pure regex fragile)
- LLM-based parsing (rejected — adds latency and API dependency for something structurally deterministic)

### 2. LLM Node Type Classification

**Decision**: Use the Anthropic SDK (`@anthropic-ai/sdk`) server-side to classify diagram node labels into component types (client, server, storage, external)
**Rationale**: Node labels like "Browser", "Node.js Server", "Project Directory" are natural language — keyword matching would require maintaining a brittle mapping. A single LLM call with all labels at once is simple, flexible, and runs only when plan.md changes (infrequent). Cache results in memory. Fall back to uniform styling if API key is absent or call fails.
**Alternatives considered**:
- Keyword matching (rejected per clarification — user explicitly requested LLM classification)
- Client-side classification (rejected — would require exposing API key to browser)
- Positional heuristics (rejected — not reliable across different diagram layouts)

### 3. No New External Dependencies for Diagram Rendering

**Decision**: Render the architecture diagram using inline SVG in the client HTML, same pattern as the requirements graph in the Spec Story Map
**Rationale**: The existing storymap.js already renders an interactive node-edge graph using SVG with force-directed layout, drag, hover, and click interactions. Reusing this pattern keeps the codebase consistent and avoids adding a diagramming library. Constitution V (Simplicity) — no new dependencies when existing patterns suffice.
**Alternatives considered**:
- D3.js (rejected — large library for a small use case; existing SVG approach already works)
- Mermaid.js (rejected — designed for its own DSL, not for rendering pre-parsed ASCII diagrams)
- Canvas rendering (rejected — SVG is better for interactive elements and accessibility)

### 4. File Existence Check via Server API

**Decision**: Check file existence server-side when computing plan view state, return existence status as a boolean per file entry
**Rationale**: The server already has filesystem access via Node.js. Checking file existence at parse time (when plan.md changes) is efficient and avoids client-side complexity. File paths are resolved relative to repository root, stripping the tree's named root directory per clarification.
**Alternatives considered**:
- Client-side fetch to check each file (rejected — N+1 HTTP requests, unnecessary complexity)
- No existence checking (rejected — FR-007 requires distinguishing existing vs. planned files)

### 5. Tessl Tiles Panel Data Source

**Decision**: Read installed tiles from `tessl.json` at the project root
**Rationale**: Per clarification, tiles are already installed — no registry search needed. `tessl.json` contains tile names and versions. This is a simple JSON read, consistent with how the dashboard reads other project artifacts. No network calls, no loading states.
**Alternatives considered**:
- Search Tessl registry per dependency (rejected per clarification — tiles already installed, just read tessl.json)

### 6. Single New Compute Module

**Decision**: Create `src/planview.js` as the compute module for plan view state, add plan-specific parsing functions to `src/parser.js`
**Rationale**: Follows existing architecture pattern: `board.js` computes board state, `storymap.js` computes story map state, `planview.js` computes plan view state. Parser functions live in `parser.js` alongside existing parsers.
**Alternatives considered**:
- Putting everything in parser.js (rejected — separation between parsing and computation is an established pattern)
- Creating a separate parser file (rejected — one parser file is the convention)

## Tessl Tiles

### Installed Tiles

| Technology | Tile | Type | Version |
|------------|------|------|---------|
| Express | tessl/npm-express | Documentation | 5.1.0 |
| ws | tessl/npm-ws | Documentation | 8.18.0 |
| Jest | tessl/npm-jest | Documentation | 30.1.0 |
| IIKit | tessl-labs/intent-integrity-kit | Skills + Rules | 1.1.0 |

### Technologies Without Tiles

- chokidar: No Tessl tile available
- @anthropic-ai/sdk: No Tessl tile available (new dependency for LLM classification)
