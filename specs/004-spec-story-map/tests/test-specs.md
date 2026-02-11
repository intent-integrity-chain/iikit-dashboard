# Test Specifications: Spec Story Map

**Generated**: 2026-02-11
**Feature**: [spec.md](../spec.md) | **Plan**: [plan.md](../plan.md)

## TDD Assessment

**Determination**: mandatory
**Confidence**: high
**Evidence**: "TDD MUST be used for all feature development. Tests MUST be written before implementation code." (NON-NEGOTIABLE)
**Reasoning**: Constitution contains strong TDD indicators ("TDD", "test-first", "red-green-refactor") combined with MUST and NON-NEGOTIABLE markers.

---

<!--
DO NOT MODIFY TEST ASSERTIONS

These test specifications define the expected behavior derived from requirements.
During implementation:
- Fix code to pass tests, don't modify test assertions
- Structural changes (file organization, naming) are acceptable with justification
- Logic changes to assertions require explicit justification and re-review

If requirements change, re-run /iikit-05-testify to regenerate test specs.
-->

## From spec.md (Acceptance Tests)

### TS-001: Story map renders with priority swim lanes

**Source**: spec.md:User Story 1:scenario-1
**Type**: acceptance
**Priority**: P1

**Given**: a feature with 4 user stories (2x P1, 1x P2, 1x P3)
**When**: the Spec tab loads
**Then**: the story map displays 3 swim lanes with stories placed in the correct priority row

**Traceability**: FR-001, US-001-scenario-1

---

### TS-002: Story card shows scenario count, requirement refs, and priority

**Source**: spec.md:User Story 1:scenario-2
**Type**: acceptance
**Priority**: P1

**Given**: a story with 3 acceptance scenarios and links to FR-001, FR-002, SC-001
**When**: its card renders
**Then**: the card shows "3 scenarios", the requirement IDs as badges, and the priority level

**Traceability**: FR-002, FR-015, US-001-scenario-2

---

### TS-003: Story cards show clarification count

**Source**: spec.md:User Story 1:scenario-3
**Type**: acceptance
**Priority**: P1

**Given**: a feature with stories refined by 2 clarification Q&As
**When**: the story map loads
**Then**: affected story cards show a clarification indicator with the count

**Traceability**: FR-010, US-001-scenario-3

---

### TS-004: Requirements graph renders US and FR nodes with edges

**Source**: spec.md:User Story 2:scenario-1
**Type**: acceptance
**Priority**: P1

**Given**: a spec with US1 referencing FR-001 and FR-002
**When**: the graph renders
**Then**: nodes appear for US1, FR-001, FR-002 with edges connecting US1 to each FR, and SC nodes appear as standalone

**Traceability**: FR-003, FR-004, FR-005, US-002-scenario-1

---

### TS-005: Clicking a node highlights its connections

**Source**: spec.md:User Story 2:scenario-2
**Type**: acceptance
**Priority**: P1

**Given**: the developer clicks on the FR-001 node
**When**: the click registers
**Then**: FR-001 and all its directly connected nodes and edges are highlighted while others dim

**Traceability**: FR-006, US-002-scenario-2

---

### TS-006: Orphaned requirements appear without edges

**Source**: spec.md:User Story 2:scenario-3
**Type**: acceptance
**Priority**: P1

**Given**: FR-003 exists in the requirements list but no story references it
**When**: the graph renders
**Then**: FR-003 appears as an orphaned node with no edges

**Traceability**: FR-004, SC-004, US-002-scenario-3

---

### TS-007: Clarification panel shows Q&A entries

**Source**: spec.md:User Story 3:scenario-1
**Type**: acceptance
**Priority**: P2

**Given**: a spec with a Clarifications section containing 3 Q&A entries
**When**: the clarification panel is expanded
**Then**: all 3 entries display with question, answer, and the date/session identifier

**Traceability**: FR-009, US-003-scenario-1

---

### TS-008: Clarification panel shows empty state

**Source**: spec.md:User Story 3:scenario-2
**Type**: acceptance
**Priority**: P2

**Given**: a spec with no Clarifications section
**When**: the Spec tab loads
**Then**: the clarification panel shows an empty state message indicating no clarifications were recorded

**Traceability**: FR-009, FR-012, US-003-scenario-2

---

### TS-009: Clarification indicator on card opens sidebar

**Source**: spec.md:User Story 3:scenario-3
**Type**: acceptance
**Priority**: P2

**Given**: a story card shows "2 clarifications"
**When**: the developer clicks that indicator
**Then**: the clarification panel expands and scrolls to show the relevant Q&A entries

**Traceability**: FR-010, SC-005, US-003-scenario-3

---

### TS-010: Dragging nodes rearranges graph layout

**Source**: spec.md:User Story 4:scenario-1
**Type**: acceptance
**Priority**: P2

**Given**: the requirements graph is displayed
**When**: the developer drags a node
**Then**: the node moves to the new position and connected edges follow

**Traceability**: FR-007, US-004-scenario-1

---

### TS-011: Zoom scales graph smoothly

**Source**: spec.md:User Story 4:scenario-2
**Type**: acceptance
**Priority**: P2

**Given**: a graph with 15 nodes
**When**: the developer uses zoom controls (scroll or pinch)
**Then**: the graph scales smoothly around the cursor position

**Traceability**: FR-008, US-004-scenario-2

---

### TS-012: Tooltip shows full requirement text

**Source**: spec.md:User Story 4:scenario-3
**Type**: acceptance
**Priority**: P2

**Given**: the developer hovers over an FR node
**When**: the tooltip appears
**Then**: it shows the full requirement text from spec.md

**Traceability**: FR-014, US-004-scenario-3

---

### TS-013: Live update adds new story card

**Source**: spec.md:User Story 5:scenario-1
**Type**: acceptance
**Priority**: P2

**Given**: the story map is displayed
**When**: a new user story is added to spec.md
**Then**: the new story card appears in the correct swim lane within 5 seconds

**Traceability**: FR-011, SC-006, US-005-scenario-1

---

### TS-014: Live update adds new requirement node

**Source**: spec.md:User Story 5:scenario-2
**Type**: acceptance
**Priority**: P2

**Given**: the requirements graph is displayed
**When**: a new FR-xxx is added to spec.md
**Then**: a new node appears in the graph within 5 seconds

**Traceability**: FR-011, SC-006, US-005-scenario-2

---

## From plan.md (Contract Tests)

### TS-015: GET /api/storymap/:feature returns story map data

**Source**: plan.md:API Contract:GET /api/storymap/:feature
**Type**: contract
**Priority**: P1

**Given**: a feature with spec.md containing 2 stories, 3 requirements, 2 success criteria, and 1 clarification
**When**: GET /api/storymap/:feature is called
**Then**: response is 200 with JSON containing stories array (2 items with id, title, priority, scenarioCount, requirementRefs, clarificationCount), requirements array (3 items with id, text), successCriteria array (2 items with id, text), clarifications array (1 item with session, question, answer), and edges array

**Traceability**: FR-001, FR-002, FR-003, FR-015

---

### TS-016: GET /api/storymap/:feature returns 404 for missing feature

**Source**: plan.md:API Contract:GET /api/storymap/:feature (error case)
**Type**: contract
**Priority**: P1

**Given**: no feature directory exists for the requested feature
**When**: GET /api/storymap/999-nonexistent is called
**Then**: response is 404 with JSON error message

**Traceability**: FR-012

---

### TS-017: GET /api/storymap/:feature handles empty spec gracefully

**Source**: plan.md:API Contract:GET /api/storymap/:feature (edge case)
**Type**: contract
**Priority**: P1

**Given**: a feature directory exists but spec.md is empty or has no stories
**When**: GET /api/storymap/:feature is called
**Then**: response is 200 with empty stories array, empty requirements array, and empty edges array

**Traceability**: FR-012

---

### TS-018: WebSocket pushes storymap_update on spec.md change

**Source**: plan.md:WebSocket:storymap_update
**Type**: contract
**Priority**: P2

**Given**: a WebSocket client is subscribed to a feature
**When**: spec.md is modified on disk
**Then**: server pushes a message with type "storymap_update" containing the updated story map data

**Traceability**: FR-011, SC-006

---

## From data-model.md (Validation Tests)

### TS-019: parseRequirements extracts FR-xxx with text

**Source**: data-model.md:Requirement entity
**Type**: validation
**Priority**: P1

**Given**: spec.md content with "- **FR-001**: System MUST render a story map"
**When**: parseRequirements is called
**Then**: returns array with {id: "FR-001", text: "System MUST render a story map"}

**Traceability**: FR-015

---

### TS-020: parseSuccessCriteria extracts SC-xxx with text

**Source**: data-model.md:SuccessCriterion entity
**Type**: validation
**Priority**: P1

**Given**: spec.md content with "- **SC-001**: Developers can identify priority distribution"
**When**: parseSuccessCriteria is called
**Then**: returns array with {id: "SC-001", text: "Developers can identify priority distribution"}

**Traceability**: FR-003

---

### TS-021: parseClarifications extracts Q&A pairs with session date

**Source**: data-model.md:ClarificationEntry entity
**Type**: validation
**Priority**: P1

**Given**: spec.md content with a Clarifications section containing "### Session 2026-02-11" and "- Q: question text -> A: answer text"
**When**: parseClarifications is called
**Then**: returns array with {session: "2026-02-11", question: "question text", answer: "answer text"}

**Traceability**: FR-009

---

### TS-022: parseStoryRequirementRefs extracts FR-xxx from story sections

**Source**: data-model.md:Edge entity
**Type**: validation
**Priority**: P1

**Given**: spec.md content where User Story 1 mentions FR-001 and FR-002 in its description and acceptance scenarios
**When**: parseStoryRequirementRefs is called
**Then**: returns edges [{from: "US1", to: "FR-001"}, {from: "US1", to: "FR-002"}]

**Traceability**: FR-004, FR-015

---

### TS-023: parseSpecStories returns scenarioCount per story

**Source**: data-model.md:StoryCard entity
**Type**: validation
**Priority**: P1

**Given**: spec.md content where User Story 1 has 3 Given/When/Then acceptance scenarios
**When**: extended story parsing is called
**Then**: story object includes scenarioCount: 3

**Traceability**: FR-002

---

### TS-024: parseRequirements returns empty array for spec with no Requirements section

**Source**: data-model.md:Requirement entity (edge case)
**Type**: validation
**Priority**: P1

**Given**: spec.md content with no "### Functional Requirements" section
**When**: parseRequirements is called
**Then**: returns empty array

**Traceability**: FR-012

---

### TS-025: parseClarifications returns empty array for spec with no Clarifications section

**Source**: data-model.md:ClarificationEntry entity (edge case)
**Type**: validation
**Priority**: P1

**Given**: spec.md content with no "## Clarifications" section
**When**: parseClarifications is called
**Then**: returns empty array

**Traceability**: FR-012

---

### TS-026: parseStoryRequirementRefs handles stories with no FR references

**Source**: data-model.md:Edge entity (edge case)
**Type**: validation
**Priority**: P1

**Given**: spec.md content where User Story 1 mentions no FR-xxx or SC-xxx IDs
**When**: parseStoryRequirementRefs is called
**Then**: returns empty edges array for that story

**Traceability**: FR-015

---

### TS-027: computeStoryMapState assembles complete state

**Source**: data-model.md:StoryMapState entity
**Type**: validation
**Priority**: P1

**Given**: a feature directory with spec.md containing 2 stories, 3 requirements, 1 success criterion, and 1 clarification
**When**: computeStoryMapState is called
**Then**: returns object with stories (2), requirements (3), successCriteria (1), clarifications (1), and edges matching the cross-references

**Traceability**: FR-001, FR-002, FR-003, FR-004

---

## Summary

| Source | Count | Types |
|--------|-------|-------|
| spec.md | 14 | acceptance |
| plan.md | 4 | contract |
| data-model.md | 9 | validation |
| **Total** | **27** | |
