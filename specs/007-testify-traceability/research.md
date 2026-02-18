# Research: Testify Traceability

## Decisions

### 1. No new dependencies — custom SVG Sankey
**Decision**: Build the Sankey diagram using raw SVG elements (`<rect>`, `<path>`, `<text>`). No D3.js, no charting library.
**Rationale**: The Sankey layout is simpler than general-purpose force-directed graphs because columns are fixed (requirements → tests → tasks) and nodes don't need dynamic positioning. SVG `<path>` with cubic Bezier curves handles flow bands elegantly. D3.js (~500KB minified) would be massive overkill for a 3-column layout with straight connections. The existing codebase uses raw SVG throughout (checklist rings, constitution radar) — this maintains consistency. Satisfies constitution Principle IV (Simplicity).
**Alternatives considered**: D3.js with d3-sankey plugin (rejected — enormous dependency for a fixed-column layout). Canvas 2D (rejected — no hover events on individual elements, poor accessibility). Third-party Sankey library like Google Charts (rejected — external dependency, style inconsistency, bloated). React or similar framework for component rendering (rejected — project uses vanilla JS exclusively).

### 2. New `parseTestSpecs()` parser function
**Decision**: Add `parseTestSpecs(content)` to parser.js that extracts TS-xxx entries with type, priority, and traceability links.
**Rationale**: No existing parser handles test-specs.md. The format is well-structured markdown with consistent patterns (`### TS-XXX:`, `**Type**:`, `**Traceability**:`), making regex parsing straightforward. Follows the established parser.js pattern of one function per artifact type. The existing `computeAssertionHash()` in integrity.js only extracts Given/When/Then lines for hashing — it doesn't parse the full structure.
**Alternatives considered**: Parsing test-specs.md inside testify.js (rejected — parser.js is the single source of truth for all markdown parsing). Using a markdown AST library (rejected — same as prior decisions: regex is sufficient and avoids dependencies).

### 3. New `parseTaskTestRefs()` for test spec references in tasks
**Decision**: Add `parseTaskTestRefs(tasks)` to parser.js that extracts "must pass TS-xxx" references from already-parsed task descriptions.
**Rationale**: The existing `parseTasks()` already extracts task descriptions but doesn't parse internal references. Rather than modifying `parseTasks()` (which would change its return shape and affect board.js), a separate function takes the parsed tasks array and enriches it with test spec references. This follows the 006 pattern of adding new functions alongside existing ones.
**Alternatives considered**: Modifying `parseTasks()` to include test refs (rejected — changes return shape used by board.js). Parsing task-to-test references inside testify.js (rejected — parser.js is the canonical parsing module).

### 4. Integrated pyramid as node grouping — not separate visualization
**Decision**: The test pyramid is the grouping strategy for the Sankey's middle column, not a separate chart.
**Rationale**: Per clarification Q2, the user chose to integrate the pyramid into the Sankey. This eliminates layout coordination between two separate visualizations and creates a single unified view. The pyramidal shape emerges naturally from grouping test spec nodes by type with proportional cluster widths. Simpler than maintaining two synchronized views.
**Alternatives considered**: Side-by-side layout (rejected by user). Stacked vertically (rejected by user). Separate pyramid chart component (rejected — user chose integrated approach).

### 5. Flow band coloring by test type — three colors
**Decision**: Color flow bands by test type: acceptance (blue), contract (green), validation (purple). Use CSS custom properties for theme support.
**Rationale**: Per clarification Q3, the user chose test-type coloring over status-based or uniform coloring. Three colors reinforce the pyramid grouping visually — a band entering the acceptance cluster is the same color as one leaving it. This creates strong visual continuity across the diagram. The three colors are distinct in both light and dark themes and accessible to colorblind users (distinguishable by brightness/saturation).
**Alternatives considered**: Status-based coloring (rejected by user). Uniform coloring with opacity (rejected by user).

### 6. Gap detection as pure function
**Decision**: Implement gap detection as a pure function `findGaps(requirements, testSpecs, tasks, edges)` in testify.js.
**Rationale**: Gap detection is a graph traversal: find nodes with no outgoing edges. For requirements, check if any edge has the requirement as `from`. For test specs, check if any edge has the test spec as `from` going to a task. Pure function with no side effects makes it trivially testable and predictable.
**Alternatives considered**: Computing gaps during edge construction (rejected — mixing concerns, harder to test independently). Client-side gap computation (rejected — keeps all logic server-side, consistent with existing pattern).

### 7. Hover highlighting via CSS classes
**Decision**: Use CSS `opacity` transitions with `.dimmed` and `.highlighted` classes toggled by JavaScript event handlers.
**Rationale**: This is the same pattern used by the story map's graph node hover in the existing codebase. Each SVG element has `data-chain-id` attributes listing all connected node IDs. On hover, JavaScript computes the full chain (bidirectional edge traversal) and adds classes. CSS handles the animation. Simple, no library needed.
**Alternatives considered**: SVG `filter` for dimming (rejected — inconsistent across browsers). Immediate-mode re-rendering of the entire SVG (rejected — heavier than class toggling).

### 8. Reuse existing integrity.js for hash verification
**Decision**: Call `computeAssertionHash()` and `checkIntegrity()` directly from testify.js.
**Rationale**: The integrity module already implements exactly the hash computation (SHA256 of normalized Given/When/Then lines) and comparison logic needed. The stored hash location (`.specify/context.json` → `testify.assertion_hash`) is already established. No new code needed for integrity verification — only rendering the result.
**Alternatives considered**: Re-implementing hash computation in testify.js (rejected — code duplication, violates DRY).

## Tessl Tiles

### Installed Tiles

| Technology | Tile | Type | Version |
|------------|------|------|---------|
| Express | tessl/npm-express | Documentation | 5.1.0 |
| ws | tessl/npm-ws | Documentation | 8.18.0 |
| Jest | tessl/npm-jest | Documentation | 30.1.0 |

### Technologies Without Tiles

- chokidar: No dedicated tile (tessl/npm-chokidar-cli is for the CLI tool, not the library)
- SVG: Not a library dependency, browser-native

No new tiles needed — the tech stack is unchanged from 001-006.
