# Data Model: Spec Story Map

## Entities

### StoryMapState
The complete story map data for one feature, returned by `/api/storymap/:feature`.

**Attributes:**
- `stories`: Array of StoryCard objects, ordered by appearance in spec.md
- `requirements`: Array of Requirement objects (FR-xxx)
- `successCriteria`: Array of SuccessCriterion objects (SC-xxx)
- `clarifications`: Array of ClarificationEntry objects
- `edges`: Array of Edge objects connecting stories to requirements

**Source:** Computed by `computeStoryMapState(projectPath, featureId)` in storymap.js

### StoryCard
A parsed user story from spec.md.

**Attributes:**
- `id`: String — e.g., `"US1"`, `"US2"`
- `title`: String — story title text
- `priority`: String — `"P1"`, `"P2"`, or `"P3"`
- `scenarioCount`: Number — count of acceptance scenarios (Given/When/Then blocks)
- `requirementRefs`: Array of String — requirement IDs referenced in story text (e.g., `["FR-001", "FR-002"]`)
- `clarificationCount`: Number — count of clarification entries that mention this story

**Source:** Parsed from `### User Story N - Title (Priority: PX)` sections in spec.md

### Requirement
A functional requirement from spec.md.

**Attributes:**
- `id`: String — e.g., `"FR-001"`
- `text`: String — full requirement description

**Source:** Parsed from `- **FR-XXX**: description` patterns in spec.md

### SuccessCriterion
A success criterion from spec.md.

**Attributes:**
- `id`: String — e.g., `"SC-001"`
- `text`: String — full criterion description

**Source:** Parsed from `- **SC-XXX**: description` patterns in spec.md

### ClarificationEntry
A Q&A pair from the Clarifications section.

**Attributes:**
- `session`: String — session date header (e.g., `"2026-02-11"`)
- `question`: String — the question text
- `answer`: String — the answer text

**Source:** Parsed from `- Q: question -> A: answer` patterns under `## Clarifications` / `### Session YYYY-MM-DD` in spec.md

### Edge
A relationship between a story and a requirement in the graph.

**Attributes:**
- `from`: String — source node ID (e.g., `"US1"`)
- `to`: String — target node ID (e.g., `"FR-001"`)

**Source:** Derived by scanning story text for FR-xxx patterns
