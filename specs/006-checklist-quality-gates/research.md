# Research: Checklist Quality Gates

## Decisions

### 1. No new dependencies needed
**Decision**: Reuse Express, ws, chokidar from 001/002. SVG for rings, no charting library.
**Rationale**: Progress rings are simple SVG circles with `stroke-dasharray` — a well-established technique that needs zero libraries. The existing file watcher and WebSocket infrastructure handle real-time updates.
**Alternatives considered**: Chart.js or D3.js for rings (rejected — massive overkill for circular progress indicators; violates Simplicity principle). CSS-only conic-gradient rings (rejected — limited animation control and inconsistent browser support for transitions).

### 2. New parseChecklistsDetailed() alongside existing parseChecklists()
**Decision**: Add a new function rather than modifying the existing one.
**Rationale**: The existing `parseChecklists()` returns `{total, checked, percentage}` and is used by `pipeline.js` for aggregate status. Modifying its return shape would break `pipeline.js`. The new function returns per-file arrays with individual items, CHK IDs, categories, and tags — a different shape for a different consumer.
**Alternatives considered**: Modifying `parseChecklists()` to return both shapes (rejected — couples pipeline and checklist view unnecessarily). Putting parsing in checklist.js (rejected — parser.js is the single source of truth for all markdown parsing).

### 3. SVG stroke-dasharray for ring animation
**Decision**: Use SVG `<circle>` with `stroke-dasharray` and CSS `transition` on `stroke-dashoffset`.
**Rationale**: This is the standard technique for circular progress indicators. A circle with circumference C and `stroke-dasharray: C` plus `stroke-dashoffset: C * (1 - percentage/100)` draws an arc proportional to the percentage. CSS transitions animate the offset smoothly. Works in all modern browsers. Accessible with `role="img"` and `aria-label`.
**Alternatives considered**: Canvas 2D (rejected — harder to animate, no CSS transitions, poor accessibility). HTML `conic-gradient` (rejected — can't animate smoothly, limited browser support for transition).

### 4. Gate status as pure function with worst-case precedence
**Decision**: Gate logic: if any file percentage === 0 → red; else if any < 100 → yellow; else → green.
**Rationale**: Simple, predictable, and matches the spec's worst-case precedence rule from clarification Q3. No state machine needed — the gate is a pure derivation from file percentages.
**Alternatives considered**: Weighted average across all files (rejected — masks critical 0% gaps). Per-file gate (rejected — too granular, the gate is a single aggregate decision).

### 5. Checklist item parsing: regex-based with optional CHK ID and tags
**Decision**: Parse each line matching `- \[[ x]\]` pattern. Extract optional `CHK-XXX` prefix and optional `[tag]` suffixes via regex. Group items under the most recent `##` or `###` heading as category.
**Rationale**: Consistent with existing parser patterns (parseSpecStories, parseTasks). Checklist files already use standard markdown checkboxes. CHK IDs and tags follow the `/iikit-04-checklist` output format.
**Alternatives considered**: Formal markdown AST parsing with remark/unified (rejected — massive dependency for simple pattern matching; existing parser.js uses regex throughout).

### 6. Separate checklist.js module
**Decision**: Create `checklist.js` following the one-module-per-view pattern (board.js, pipeline.js, storymap.js, planview.js).
**Rationale**: Consistent architecture. Each view has a `compute*State()` function that takes `(projectPath, featureId)` and returns the JSON shape for the API. Keeps logic testable in isolation.

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

No new tiles needed — the tech stack is unchanged from 001/002.
