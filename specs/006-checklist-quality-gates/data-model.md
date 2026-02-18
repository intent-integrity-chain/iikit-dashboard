# Data Model: Checklist Quality Gates

## Entities

### ChecklistViewState
The complete checklist visualization state for one feature.

**Attributes:**
- `files`: Array of ChecklistFile objects, one per markdown file in checklists/
- `gate`: GateStatus object — aggregate implementation readiness

**Source:** Computed by `computeChecklistViewState(projectPath, featureId)` in checklist.js

### ChecklistFile
Parsed representation of one checklist markdown file.

**Attributes:**
- `name`: String — human-readable name derived from filename (e.g., "Requirements")
- `filename`: String — original filename (e.g., "requirements.md")
- `total`: Number — total count of checklist items (checked + unchecked)
- `checked`: Number — count of checked items
- `percentage`: Number — integer 0-100, `Math.round((checked / total) * 100)`, 0 if total is 0
- `color`: String — `"red"` (0-33%), `"yellow"` (34-66%), `"green"` (67-100%)
- `items`: Array of ChecklistItem objects

**Identity:** Unique by `filename` within a feature's checklists/ directory

### ChecklistItem
A single checkbox line from a checklist file.

**Attributes:**
- `text`: String — the item description text (after checkbox, CHK ID, and before tags)
- `checked`: Boolean — true if `[x]`, false if `[ ]`
- `chkId`: String | null — CHK-xxx identifier if present (e.g., "CHK-001")
- `category`: String | null — heading text of the most recent `##` or `###` above the item
- `tags`: Array of String — dimension/reference tags extracted from `[tag]` patterns at end of line

**Parsing rules:**
- Line must match `- \[[ x]\]` to be recognized as an item
- CHK ID extracted via `/CHK-\d{3}/` pattern
- Tags extracted via `/\[([^\]]+)\]/g` at end of line (excluding the checkbox itself)
- Category is the text of the nearest preceding markdown heading (## or ###)

### GateStatus
Aggregate indicator of implementation readiness.

**Attributes:**
- `status`: String — `"open"` or `"blocked"`
- `level`: String — `"green"`, `"yellow"`, or `"red"`
- `label`: String — `"GATE: OPEN"` or `"GATE: BLOCKED"`

**Derivation rules (worst-case precedence):**
- If no files exist: `{ status: "blocked", level: "red", label: "GATE: BLOCKED" }`
- If any file has percentage === 0: `{ status: "blocked", level: "red", label: "GATE: BLOCKED" }`
- If all files have percentage === 100: `{ status: "open", level: "green", label: "GATE: OPEN" }`
- Otherwise (all between 1-99): `{ status: "blocked", level: "yellow", label: "GATE: BLOCKED" }`

### Checklist Color Map

| Percentage Range | Color | CSS Variable |
|-----------------|-------|-------------|
| 0-33% | red | `--ring-red` |
| 34-66% | yellow | `--ring-yellow` |
| 67-100% | green | `--ring-green` |

### Data Flow

```
checklists/*.md → parseChecklistsDetailed() → computeChecklistViewState() → API/WebSocket → renderChecklistContent()
                                                                                            ├── renderGateIndicator()
                                                                                            ├── renderProgressRings()
                                                                                            └── renderChecklistDetail()
```
