# Data Model: IIKit Kanban Board

## Entities

### Feature
Represents a numbered directory under `specs/`.

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| id | string | Directory name | e.g., "001-kanban-board" |
| number | string | Parsed from id | e.g., "001" |
| name | string | Parsed from id | e.g., "kanban-board" → "Kanban Board" |
| stories | UserStory[] | Parsed from spec.md | User stories for this feature |
| integrityStatus | "valid" \| "tampered" \| "missing" | Computed | Assertion hash check result |

### UserStory
Represents a user story extracted from spec.md.

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| id | string | Parsed from heading | e.g., "US1", "US2" |
| title | string | Parsed from heading | e.g., "Watch an Agent Work in Real Time" |
| priority | string | Parsed from heading | e.g., "P1", "P2", "P3" |
| tasks | Task[] | Matched from tasks.md by [USx] tag | Tasks belonging to this story |
| column | "todo" \| "in_progress" \| "done" | Computed | Based on task completion state |
| progress | string | Computed | e.g., "3/7" |

### Task
Represents a checkbox item from tasks.md.

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| id | string | Parsed from line | e.g., "T001" |
| description | string | Parsed from line | Task text after ID and tag |
| storyTag | string | Parsed from [USx] tag | Which story this belongs to |
| checked | boolean | Parsed from `[x]` vs `[ ]` | Completion status |

### BoardState
Computed state of the kanban board for one feature.

| Field | Type | Description |
|-------|------|-------------|
| feature | Feature | The feature being displayed |
| todo | UserStory[] | Stories with 0 tasks checked |
| inProgress | UserStory[] | Stories with ≥1 but not all tasks checked |
| done | UserStory[] | Stories with all tasks checked |
| integrity | IntegrityStatus | Assertion hash check result |

### IntegrityStatus
Result of comparing test-specs.md assertions against stored hash.

| Field | Type | Description |
|-------|------|-------------|
| status | "valid" \| "tampered" \| "missing" | Hash comparison result |
| currentHash | string \| null | SHA256 of current assertions |
| storedHash | string \| null | Hash from context.json |

## Parsing Rules

### spec.md → UserStory[]
Pattern: `### User Story N - Title (Priority: PX)`
- Extract story number (N → "USN")
- Extract title (text between "- " and " (Priority:")
- Extract priority (text inside parentheses)

### tasks.md → Task[]
Pattern: `- [x] TXXX [USy] Description` or `- [ ] TXXX [USy] Description`
- `[x]` → checked: true, `[ ]` → checked: false
- TXXX → task id (e.g., "T001")
- [USy] → storyTag (e.g., "US1")
- Remaining text → description

### Column Assignment
```
if (story.tasks.every(t => !t.checked))  → "todo"
if (story.tasks.every(t => t.checked))   → "done"
otherwise                                 → "in_progress"
```
