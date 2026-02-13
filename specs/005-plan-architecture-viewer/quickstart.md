# Quickstart Test Scenarios: Plan Architecture Viewer

**Feature**: 005-plan-architecture-viewer | **Date**: 2026-02-11

## Prerequisites

- Node.js 20+ installed
- Project has at least one feature with plan.md (e.g., `specs/001-kanban-board/plan.md`)
- `npm install` completed (includes `@anthropic-ai/sdk`)
- Optional: `ANTHROPIC_API_KEY` environment variable set for LLM node classification

## Scenarios

### 1. Plan view loads with all sections

1. Start server: `npm start`
2. Open browser to `http://localhost:3000`
3. Select feature "001-kanban-board" from dropdown
4. Click the "Plan" phase in the pipeline bar
5. **Expected**: Content area shows four sections stacked vertically:
   - Tech Stack badge wall (8 badges)
   - Tessl tiles panel (tile cards for installed tiles)
   - Project Structure tree (expandable)
   - Architecture Diagram (rendered SVG with colored nodes)

### 2. Badge wall displays tech context

1. Navigate to Plan view for any feature with plan.md
2. **Expected**: Badges show label and value (e.g., "Language/Version: Node.js 20+")
3. Hover over a badge whose technology has a research.md entry
4. **Expected**: Tooltip shows the decision rationale

### 3. Structure tree interaction

1. Navigate to Plan view
2. Click a directory entry (e.g., `src/`)
3. **Expected**: Directory collapses, hiding child entries
4. Click again
5. **Expected**: Directory re-expands
6. **Expected**: Files that exist on disk show with "existing" visual indicator; files only in plan.md show as "planned"

### 4. Architecture diagram rendering

1. Navigate to Plan view for feature with ASCII diagram in plan.md
2. **Expected**: Boxes from ASCII art are rendered as styled SVG rectangles
3. **Expected**: Arrows between boxes are rendered as SVG paths with labels
4. Click a node
5. **Expected**: Detail panel appears showing the node's content text
6. **Expected**: Nodes are color-coded by type (if ANTHROPIC_API_KEY is set)

### 5. Tessl tiles panel

1. Navigate to Plan view
2. **Expected**: Panel below badge wall shows cards for each tile in tessl.json
3. Each card shows tile name (e.g., "tessl/npm-express") and version (e.g., "v5.1.0")

### 6. Live update

1. Navigate to Plan view
2. In another terminal, edit the active feature's plan.md:
   - Add a new line to Technical Context: `**New Tool**: something`
3. **Expected**: A new badge appears in the badge wall within 5 seconds (no page refresh)

### 7. Missing plan.md

1. Select a feature that has no plan.md (or create a new feature with only spec.md)
2. Click "Plan" in the pipeline bar
3. **Expected**: Empty state message: "No plan has been created yet" with guidance to run `/iikit-03-plan`

### 8. No ASCII diagram

1. Select a feature whose plan.md has no Architecture Overview section
2. Click "Plan" in the pipeline bar
3. **Expected**: Badge wall and structure tree render normally; architecture diagram section is not shown

### 9. LLM fallback (no API key)

1. Stop server
2. Unset `ANTHROPIC_API_KEY`: `unset ANTHROPIC_API_KEY`
3. Restart server: `npm start`
4. Navigate to Plan view for feature with diagram
5. **Expected**: Diagram renders with all nodes in a uniform neutral color (no error message)
