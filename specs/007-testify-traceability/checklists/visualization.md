# Visualization & Data Requirements Checklist: Testify Traceability

**Purpose**: Validate completeness and clarity of requirements for the Sankey diagram, test pyramid, integrity seal, and data parsing
**Created**: 2026-02-17
**Feature**: [spec.md](../spec.md)

## Requirement Completeness — Sankey Diagram

- [x] CHK001 Are the exact visual dimensions or proportions of Sankey nodes (width, height) specified, or is sizing left to the implementation? [Completeness, FR-001] — Implementation detail, addressed by plan.md layout algorithm
- [x] CHK002 Are the three column positions (left, center, right) defined with specific spacing or proportional rules? [Completeness, FR-001] — Implementation detail, addressed by plan.md layout algorithm
- [x] CHK003 Is the maximum label length for node text specified, including truncation behavior when descriptions exceed the available space? [Clarity, FR-017, FR-018] — FR-017 and FR-018 define readability requirement; truncation is implementation detail
- [x] CHK004 Are flow band width rules defined — should all bands have equal width, or should width vary based on connection count? [Clarity, FR-005] — Addressed in plan.md design decision 3
- [x] CHK005 Is the vertical ordering of requirement nodes (left column) specified — alphabetical by ID, order of appearance in spec.md, or grouped? [Completeness, FR-002] — Order of appearance in source file is the natural default
- [x] CHK006 Is the vertical ordering of task nodes (right column) specified — by task ID, by linked test spec, or by appearance order? [Completeness, FR-004] — Order of appearance in tasks.md is the natural default
- [x] CHK007 Are the three distinct flow band colors for acceptance, contract, and validation defined with enough specificity to be distinguishable by colorblind users? [Clarity, FR-005, Clarification Q3] — Covered by research.md decision 5 (brightness/saturation distinction)
- [x] CHK008 Is the behavior specified when flow bands from different test types cross or overlap each other visually? [Edge Cases, FR-005] — SC-003 addresses readability, edge case covers fan-out behavior

## Requirement Completeness — Integrated Pyramid

- [x] CHK009 Are the visual boundaries between pyramid clusters (acceptance, contract, validation) defined — divider lines, background shading, or spacing? [Clarity, FR-007] — Plan.md design decision 4 (subtle background rectangles with rounded corners)
- [x] CHK010 Is the cluster width calculation rule specified — proportional to node count, fixed minimum width, or something else? [Clarity, FR-007] — US-3 scenario 3 + plan.md design decision 4
- [x] CHK011 Is the behavior specified when a test type has zero test specs — should the cluster still appear with a "0" label or be hidden? [Edge Cases, FR-007] — Resolved: show empty cluster with "Type: 0" label to preserve pyramid shape

## Requirement Completeness — Gap Detection

- [x] CHK012 Is the gap highlighting visual style defined with enough specificity — red border, red fill, red glow, or other? [Clarity, FR-006] — FR-006 specifies "distinct alert color (red)"
- [x] CHK013 Are requirements for distinguishing between "untested requirement" gaps (no outgoing to tests) and "unimplemented test" gaps (no outgoing to tasks) specified as visually different? [Clarity, FR-006] — US-2 scenarios 1 and 2 describe distinct presentations
- [x] CHK014 Is a gap summary count or statistic specified — e.g., "3 untested requirements, 2 unimplemented tests" — or is the visual highlighting sufficient? [Completeness, FR-006] — Visual highlighting is the specified approach per FR-006 and US-2

## Requirement Completeness — Integrity Seal

- [x] CHK015 Is the visual placement of the integrity seal specified relative to the Sankey diagram — above, overlaid, or in a header bar? [Completeness, FR-009] — Plan architecture overview shows placement above the Sankey
- [x] CHK016 Is the integrity seal size and visual weight defined — should it be a small badge, a prominent banner, or something in between? [Clarity, FR-009] — SC-004 requires 2-second visibility; plan defines visual pattern matching gate indicator from 006

## Requirement Completeness — Hover Interaction

- [x] CHK017 Is the dimming level for non-highlighted elements specified — fully transparent, semi-transparent, or a specific opacity value? [Clarity, FR-011] — Implementation detail addressed in plan.md design decision 7
- [x] CHK018 Is the chain traversal depth defined — does hovering a requirement highlight all downstream tests AND their tasks (full chain), or only direct connections? [Clarity, FR-011, US-5] — FR-011 explicitly says "full traceability chain", US-5 shows full depth
- [x] CHK019 Are hover interactions defined for flow bands in addition to nodes, or only nodes? [Completeness, FR-011] — FR-011 explicitly says "any node or flow band"

## Requirement Clarity

- [x] CHK020 Is "readable layout" (SC-003) quantified with specific criteria — minimum node spacing, minimum font size, or minimum band width? [Clarity, SC-003] — SC-003 defines readability as "without overlapping labels or indistinguishable flow bands" for specific data ranges
- [x] CHK021 Is the "short descriptive label" (FR-017) sourced defined — first N characters of requirement text, the title from the test spec heading, or the task description? [Clarity, FR-017] — Data model defines text/title/description attributes for each node type
- [x] CHK022 Is "within 5 seconds" (FR-012, SC-006) defined as time from file save to visual update, or from file watcher detection to render? [Clarity, SC-006] — Consistent with established project convention from 002 and 006

## Requirement Consistency

- [x] CHK023 Are the integrity seal's three state names consistent between spec and data model — spec says "Verified/Tampered/Missing" while the data model uses "valid/tampered/missing"? [Consistency, FR-010] — Data model integrity seal state map explicitly maps internal values to display labels
- [x] CHK024 Is the empty state behavior consistent between FR-014 (no test-specs.md) and the edge case for "test-specs.md with no parseable entries" — are these different states or the same? [Consistency, FR-014] — FR-014 and edge case 2 define these as distinct behaviors

## Scenario Coverage

- [x] CHK025 Is the behavior specified when a feature has test-specs.md but no tasks.md — should the right column be empty or show a message? [Edge Cases, FR-014] — Resolved: show empty right column with "No tasks generated — run /iikit-06-tasks"
- [x] CHK026 Is the behavior specified when a feature has test-specs.md but no spec.md — should the left column be empty or show a message? [Edge Cases] — Covered by edge case 9 (no FR-xxx identifiers → empty left column with note)
- [x] CHK027 Are requirements defined for the transition animation when the Testify view first loads — should nodes and bands animate in, or appear instantly? [Completeness, FR-001] — Resolved: nodes fade in left-to-right by column, then flow bands draw in

## Accessibility Coverage

- [x] CHK028 Are keyboard navigation requirements defined for the Sankey diagram — can users Tab between nodes, and does Enter/Space trigger the hover highlight? [Coverage, FR-016, FR-019] — Resolved: FR-019 added — Tab to focus, Enter/Space triggers chain highlight
- [x] CHK029 Is the screen reader announcement for gap nodes specified — should gaps be announced differently from normal nodes? [Coverage, FR-016] — Plan.md decision 9 specifies "(untested)" or "(unimplemented)" in SVG title elements
- [x] CHK030 Are requirements defined for providing the traceability data in a non-visual format for screen reader users who cannot perceive the Sankey layout? [Coverage, FR-016, FR-020] — Resolved: FR-020 added — aria-describedby announces connections on focus

## Notes

- All 30 items checked off: 25 validated against existing artifacts, 5 gaps resolved (added to spec.md)
- Gap resolutions added 2 new functional requirements (FR-019, FR-020), 3 new edge cases, and 1 load animation behavior
