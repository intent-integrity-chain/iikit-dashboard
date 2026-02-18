# Data Model: Testify Traceability

## Entities

### TestifyViewState
The complete testify visualization state for one feature.

**Attributes:**
- `requirements`: Array of RequirementNode objects — left column of Sankey (FR-xxx, SC-xxx from spec.md)
- `testSpecs`: Array of TestSpecNode objects — middle column of Sankey (TS-xxx from tests/test-specs.md)
- `tasks`: Array of TaskNode objects — right column of Sankey (T-xxx from tasks.md)
- `edges`: Array of Edge objects — traceability connections between nodes
- `gaps`: GapReport object — untested requirements and unimplemented tests
- `pyramid`: PyramidState object — test specs grouped by type with counts
- `integrity`: IntegrityState object — assertion hash verification result
- `exists`: Boolean — true if tests/test-specs.md exists

**Source:** Computed by `computeTestifyState(projectPath, featureId)` in testify.js

### RequirementNode
A functional requirement or success criterion from spec.md.

**Attributes:**
- `id`: String — requirement identifier (e.g., "FR-001", "SC-003")
- `text`: String — requirement description text

**Identity:** Unique by `id` within a feature's spec.md
**Parsing rule:** Extracted by existing `parseRequirements()` (FR-xxx) and `parseSuccessCriteria()` (SC-xxx) from parser.js

### TestSpecNode
A test specification from tests/test-specs.md.

**Attributes:**
- `id`: String — test spec identifier (e.g., "TS-001")
- `title`: String — test spec title (text after the TS-XXX: in heading)
- `type`: String — one of "acceptance", "contract", "validation"
- `priority`: String — priority level (e.g., "P1", "P2")
- `traceability`: Array of String — referenced requirement IDs (e.g., ["FR-001", "SC-001"])

**Identity:** Unique by `id` within a feature's test-specs.md

**Parsing rules:**
- Heading pattern: `### TS-(\d+): (.+)`
- Type extracted via: `**Type**: (acceptance|contract|validation)`
- Priority extracted via: `**Priority**: (P\d+)`
- Traceability extracted via: `**Traceability**: (.+)` — comma-separated IDs, filtered to only FR-xxx and SC-xxx patterns

### TaskNode
An implementation task from tasks.md with test spec references.

**Attributes:**
- `id`: String — task identifier (e.g., "T005")
- `description`: String — task description text
- `testSpecRefs`: Array of String — referenced test spec IDs (e.g., ["TS-014", "TS-015"])

**Identity:** Unique by `id` within a feature's tasks.md

**Parsing rules:**
- Tasks parsed by existing `parseTasks()` from parser.js
- Test spec references extracted by new `parseTaskTestRefs(tasks)`: regex `must pass ((?:TS-\d+(?:,\s*)?)+)` applied to each task's description
- Tasks without "must pass" references have empty `testSpecRefs` array

### Edge
A traceability connection between two nodes in the Sankey.

**Attributes:**
- `from`: String — source node ID (FR-xxx/SC-xxx for requirement-to-test, TS-xxx for test-to-task)
- `to`: String — target node ID (TS-xxx for requirement-to-test, T-xxx for test-to-task)
- `type`: String — "requirement-to-test" or "test-to-task"

**Derivation rules:**
- **requirement-to-test edges**: For each test spec, create an edge from each ID in its `traceability` array to the test spec's `id`
- **test-to-task edges**: For each task, create an edge from each ID in its `testSpecRefs` to the task's `id`
- Only create edges where both the source and target node exist in the parsed data (ignore orphaned references)

### GapReport
Nodes with incomplete traceability connections.

**Attributes:**
- `untestedRequirements`: Array of String — requirement IDs (FR-xxx, SC-xxx) that are not the `from` of any requirement-to-test edge
- `unimplementedTests`: Array of String — test spec IDs (TS-xxx) that are not the `from` of any test-to-task edge

**Derivation rules:**
- A requirement is "untested" if no edge has it as `from` with type "requirement-to-test"
- A test spec is "unimplemented" if no edge has it as `from` with type "test-to-task"

### PyramidState
Test specifications grouped by type for the integrated pyramid visualization.

**Attributes:**
- `acceptance`: Object — `{ count: Number, ids: String[] }` — acceptance test spec IDs
- `contract`: Object — `{ count: Number, ids: String[] }` — contract test spec IDs
- `validation`: Object — `{ count: Number, ids: String[] }` — validation test spec IDs

**Derivation rules:**
- Group test specs by their `type` field
- Count is the length of each group
- IDs are the `id` values of test specs in each group

### IntegrityState
Assertion hash verification result.

**Attributes:**
- `status`: String — "valid", "tampered", or "missing"
- `currentHash`: String | null — SHA256 hash computed from current test-specs.md content
- `storedHash`: String | null — hash stored in `FEATURE_DIR/context.json` at `testify.assertion_hash`

**Source:** Computed by existing `computeAssertionHash()` and `checkIntegrity()` from integrity.js

**Derivation rules:**
- If test-specs.md doesn't exist: `{ status: "missing", currentHash: null, storedHash: null }`
- If context.json doesn't exist or has no `testify.assertion_hash`: `{ status: "missing", currentHash: <hash>, storedHash: null }`
- If hashes match: `{ status: "valid", ... }`
- If hashes differ: `{ status: "tampered", ... }`

### Flow Band Color Map

| Test Type | CSS Variable | Light Mode | Dark Mode |
|-----------|-------------|------------|-----------|
| Acceptance | `--sankey-acceptance` | Blue-ish | Blue-ish (lighter) |
| Contract | `--sankey-contract` | Green-ish | Green-ish (lighter) |
| Validation | `--sankey-validation` | Purple-ish | Purple-ish (lighter) |
| Gap (absence) | `--color-danger` | Red | Red |

### Integrity Seal State Map

| Status | Color | Label | CSS Variable |
|--------|-------|-------|-------------|
| valid | Green | "Verified" | `--color-success` |
| tampered | Red | "Tampered" | `--color-danger` |
| missing | Grey | "Missing" | `--color-muted` |

### Data Flow

```
spec.md          → parseRequirements() + parseSuccessCriteria() ─┐
tests/test-specs.md → parseTestSpecs()                           ├→ computeTestifyState() → API/WebSocket → renderTestifyContent()
tasks.md         → parseTasks() + parseTaskTestRefs()            │                                          ├── renderIntegritySeal()
context.json     → computeAssertionHash() + checkIntegrity()    ─┘                                          ├── renderSankeyDiagram()
                                                                                                             │   ├── renderNodes()
                                                                                                             │   ├── renderFlowBands()
                                                                                                             │   ├── renderPyramidLabels()
                                                                                                             │   └── renderGapHighlights()
                                                                                                             └── attachHoverHandlers()
```
