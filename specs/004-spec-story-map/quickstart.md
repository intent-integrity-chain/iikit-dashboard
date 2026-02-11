# Quick Start: Spec Story Map

## Test Scenarios

### 1. Story Map renders with priority swim lanes
1. Start the dashboard: `npm start`
2. Select a feature with a complete spec.md (e.g., 001-kanban-board)
3. Click the "Spec" phase node in the pipeline
4. Verify: Story cards appear in P1/P2/P3 swim lanes
5. Verify: Each card shows title, priority badge, scenario count, requirement refs

### 2. Requirements graph shows nodes and edges
1. With the Spec tab active, scroll to the requirements graph
2. Verify: US nodes, FR nodes, and SC nodes appear with distinct visual styles
3. Verify: Edges connect US nodes to the FR nodes they reference
4. Verify: SC nodes appear standalone (no edges)

### 3. Click highlighting works
1. Click on any FR node in the graph
2. Verify: The clicked node and its connected nodes/edges highlight
3. Verify: Unrelated nodes and edges dim
4. Click the same node again or click empty space
5. Verify: All nodes return to normal

### 4. Clarification sidebar
1. Click the clarification toggle button
2. Verify: Right sidebar slides in showing Q&A entries
3. Verify: Each entry shows question, answer, and session date
4. Click toggle again to close

### 5. Live updates
1. Open the Spec tab for a feature
2. In a separate terminal, edit the feature's spec.md (add a new user story)
3. Verify: The new story card appears in the story map within 5 seconds

### 6. Empty states
1. Select a feature with a minimal/empty spec.md
2. Verify: Empty state messages appear instead of empty visualizations
