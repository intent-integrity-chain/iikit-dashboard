# Feature Specification: Constitution Radar Chart

**Feature Branch**: `003-constitution-radar`
**Created**: 2026-02-11
**Status**: Draft
**Input**: User description: "Constitution Radar Chart — the Constitution tab in the pipeline dashboard. Shows a radar chart with each axis representing a constitution principle. Principles plotted by obligation strength (MUST/SHOULD/MAY). Compliance status color-coded based on analyze reports. Principle details on hover/click. Amendment timeline below. Live updates."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See All Principles at a Glance (Priority: P1)

A developer clicks the "Constitution" node in the pipeline bar and sees a radar chart rendered in the content area below. Each axis of the radar represents one constitution principle. The chart shape instantly communicates how strongly each principle is enforced — MUST principles extend to the outer ring, SHOULD to the middle, MAY to the inner ring. The developer can immediately see the "shape" of their project's governance.

**Why this priority**: The radar chart is the core visualization. Without it, the Constitution tab is empty. This single view answers "what are my project's principles and how strict are they?"

**Independent Test**: Can be tested by creating a CONSTITUTION.md with 4 principles (mix of MUST, SHOULD, MAY), opening the dashboard, clicking the Constitution node, and verifying the radar chart renders with 4 axes at the correct distances.

**Acceptance Scenarios**:

1. **Given** a CONSTITUTION.md with 4 principles (2 MUST, 1 SHOULD, 1 MAY), **When** the developer clicks the Constitution pipeline node, **Then** a radar chart renders with 4 axes, MUST principles at the outer ring, SHOULD at middle, MAY at inner ring
2. **Given** a CONSTITUTION.md with a single MUST principle, **When** the radar renders, **Then** the chart displays with one axis extending to the outer ring
3. **Given** no CONSTITUTION.md exists, **When** the developer clicks the Constitution node, **Then** an empty state message is shown suggesting to run /iikit-00-constitution

---

### User Story 2 - Read Principle Details (Priority: P1)

A developer hovers over or clicks on a principle axis in the radar chart and sees the full principle text, its rationale, and its obligation level. This lets the developer understand not just that a principle exists, but what it says and why it matters.

**Why this priority**: The radar chart shows the shape of governance, but developers need to read the actual text to understand what each principle requires. Without this, the chart is just a pretty picture.

**Independent Test**: Can be tested by rendering the radar, clicking on a principle axis, and verifying a detail panel shows the principle name, full text, rationale, and obligation level.

**Acceptance Scenarios**:

1. **Given** the radar chart is displayed, **When** the developer clicks on a principle axis, **Then** a detail panel shows the principle name, full text, rationale, and obligation level (MUST/SHOULD/MAY)
2. **Given** a detail panel is open for one principle, **When** the developer clicks a different axis, **Then** the panel updates to show the new principle's details

---

### User Story 3 - See Amendment History (Priority: P2)

Below the radar chart, a horizontal timeline shows when the constitution was created and when it was last amended. Each point on the timeline shows the version number and date. This helps the developer understand how the governance has evolved.

**Why this priority**: Amendment history is useful context but not essential for the primary visualization. Most constitutions are rarely amended.

**Independent Test**: Can be tested by creating a CONSTITUTION.md with version and date metadata, and verifying the timeline renders below the radar.

**Acceptance Scenarios**:

1. **Given** a CONSTITUTION.md with "Version: 1.1.0", "Ratified: 2026-02-10", "Last Amended: 2026-02-10", **When** the Constitution tab renders, **Then** a timeline appears below the radar showing these dates and version
2. **Given** a CONSTITUTION.md with no version metadata, **When** the tab renders, **Then** the timeline section is hidden

---

### Edge Cases

- What happens when CONSTITUTION.md has no parseable principles? (Show empty state with guidance)
- What happens when CONSTITUTION.md has more than 10 principles? (Radar becomes crowded — still render, but consider label truncation)
- What happens when a principle has no MUST/SHOULD/MAY keywords? (Default to SHOULD level)
- What happens when CONSTITUTION.md is malformed? (Show what can be parsed, skip unparseable sections)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST parse CONSTITUTION.md to extract principle names, full text, rationale, and obligation level (MUST/SHOULD/MAY)
- **FR-002**: System MUST render a radar chart with one axis per principle, scaled by obligation strength (MUST = outer, SHOULD = middle, MAY = inner), with a semi-transparent filled polygon connecting all axis endpoints
- **FR-003**: System MUST show principle details (name, text, rationale, obligation level) in a detail card alongside/below the radar chart when a user clicks on a principle axis. The card stays open until another axis is clicked or the card is dismissed
- **FR-004**: System MUST display an amendment timeline below the radar showing constitution version history (version, ratified date, last amended date)
- **FR-005**: System MUST update the radar chart in real time when CONSTITUTION.md changes on disk
- **FR-006**: System MUST show an appropriate empty state when CONSTITUTION.md does not exist
- **FR-007**: System MUST handle 3 to 10 principles gracefully in the radar layout
- **FR-013**: System MUST size the radar chart responsively to fill available width in the content area (max 400px), maintaining a square aspect ratio
- **FR-014**: System MUST make the radar chart SVG accessible with `role="img"` and an `aria-label` summarizing the chart, plus `aria-label` on each clickable axis element
- **FR-015**: System MUST make radar chart axes focusable with Tab and activatable with Enter/Space to open the detail card
- **FR-008**: System MUST integrate as the Constitution tab content in the pipeline dashboard (rendered in the content area when the Constitution node is clicked)
- **FR-009**: System MUST hide the amendment timeline when no version metadata is present in CONSTITUTION.md
- **FR-010**: System MUST display a one-sentence summary of each principle at the top of the tab (above the radar chart), showing principle name and obligation level as a compact list
- **FR-011**: System MUST show the same Constitution tab content regardless of which feature is selected (CONSTITUTION.md is project-level, not feature-level)

### Key Entities

- **Principle**: A governance rule extracted from CONSTITUTION.md. Has a name, full text, rationale, and obligation level (MUST/SHOULD/MAY)
- **Obligation Level**: The enforcement strength of a principle — MUST (strongest, outer ring), SHOULD (moderate, middle ring), MAY (optional, inner ring)
- **Amendment**: A version point in the constitution's history. Has a version number and date

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Developers can identify all constitution principles and their obligation levels within 5 seconds of opening the Constitution tab
- **SC-002**: Developers can read the full text of any principle in 2 clicks or fewer (click axis, read detail panel)
- **SC-003**: The radar chart renders correctly for constitutions with 3 to 10 principles
- **SC-004**: The Constitution tab visual style is consistent with the pipeline dashboard aesthetic

## Clarifications

### Session 2026-02-11

- Q: Where should the principle detail panel appear when a user clicks a radar axis? -> A: Side panel or card alongside/below the radar. Stays open until another axis is clicked or dismissed. Radar remains visible while reading details.
- Q: Should the Constitution tab show compliance status from analysis.md? -> A: No. Constitution is phase 0, analysis is phase 7 — compliance coloring belongs in the Analyze tab (feature 008), not here. The Constitution tab shows principles and obligation levels only.
