# Data Model: Plan Architecture Viewer

**Feature**: 005-plan-architecture-viewer | **Date**: 2026-02-11

## Entities

### TechContextEntry

A key-value pair from plan.md's Technical Context section.

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| label | string | plan.md | Bold label before colon (e.g., "Language/Version") |
| value | string | plan.md | Text after colon (e.g., "Node.js 20+ (LTS)") |

**Parsing rule**: Match lines with pattern `**[Label]**: [Value]` in the Technical Context section.

### ResearchDecision

A technology decision from research.md's Decisions section.

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| title | string | research.md | Heading text (e.g., "ASCII Diagram Parsing Approach") |
| decision | string | research.md | Text after `**Decision**:` |
| rationale | string | research.md | Text after `**Rationale**:` |

**Parsing rule**: Match `### N. [Title]` headings, then extract `**Decision**:` and `**Rationale**:` lines within each heading block.

### FileStructureEntry

A file or directory entry from plan.md's File Structure section.

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| name | string | plan.md | File or directory name |
| type | "file" \| "directory" | plan.md | Inferred: directories end with `/` or have children |
| comment | string \| null | plan.md | Inline comment after `#` on same line |
| depth | number | plan.md | Nesting level (0 = root children) |
| exists | boolean | filesystem | Checked at compute time via `fs.existsSync` |

**Parsing rule**: Match lines with tree characters (`├──`, `└──`, `│`). Calculate depth from leading whitespace/`│` count. Extract name and optional `# comment`. Directories identified by trailing `/` or by having child entries at greater depth.

**Path resolution**: Strip the tree's root directory name (first line of the tree, e.g., `iikit-kanban/`), then resolve relative to repository root.

### DiagramNode

A component box from plan.md's ASCII architecture diagram.

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| id | string | generated | `"node-0"`, `"node-1"`, etc. |
| label | string | plan.md | First non-empty text line inside the box |
| content | string | plan.md | All text lines inside the box (joined with `\n`) |
| type | "client" \| "server" \| "storage" \| "external" \| "default" | LLM | Classified by Anthropic API; "default" if unavailable |
| x | number | plan.md | Column position of top-left corner in the ASCII grid |
| y | number | plan.md | Row position of top-left corner in the ASCII grid |
| width | number | plan.md | Box width in characters |
| height | number | plan.md | Box height in lines |

**Parsing rule**: Detect `┌` characters, trace boundary clockwise. Extract interior text. Assign positions from character grid coordinates.

### DiagramEdge

A connection between components in the ASCII architecture diagram.

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| from | string | plan.md | ID of source node |
| to | string | plan.md | ID of target node |
| label | string \| null | plan.md | Text near the connector (e.g., "ws://localhost:PORT") |

**Parsing rule**: After box detection, scan for connector paths between box boundaries. Match each path to its nearest source and target boxes. Extract adjacent text as labels.

### TesslTile

An installed Tessl tile from tessl.json.

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| name | string | tessl.json | Tile identifier (e.g., "tessl/npm-express") |
| version | string | tessl.json | Installed version (e.g., "5.1.0") |
| eval | object \| null | Tessl API (future) | `{score, multiplier, chartData}` when available; null for now |

**Parsing rule**: Read `tessl.json`, iterate `dependencies` object. Each key is the tile name, value has `version` field.

## Data Flow

```
plan.md ──parse──→ TechContextEntry[] ──→ badge wall
                 → FileStructureEntry[] + fs.existsSync ──→ structure tree
                 → DiagramNode[] + DiagramEdge[] + LLM classify ──→ architecture diagram

research.md ──parse──→ ResearchDecision[] ──→ badge tooltips

tessl.json ──parse──→ TesslTile[] ──→ tiles panel
```
