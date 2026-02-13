# Visualization UX Requirements Quality Checklist: Plan Architecture Viewer

**Purpose**: Validate completeness, clarity, and consistency of UX requirements for the Plan phase visualization
**Created**: 2026-02-11
**Feature**: [spec.md](../spec.md)

## Requirement Completeness — Badge Wall

- [x] CHK001 - Are the visual grouping categories for badges explicitly enumerated, or is "grouped by category" left to interpretation? [Completeness, Resolved: categories are the Technical Context labels themselves (Language/Version, Primary Dependencies, Storage, Testing, Target Platform, etc.). Each label is a category. No separate grouping logic needed — one badge per entry]
- [x] CHK002 - Is the badge visual design specified (size, shape, colors per category, typography)? [Clarity, Resolved: defer to existing dashboard CSS design system]
- [x] CHK003 - Are requirements defined for how multi-value entries are displayed (e.g., "Express, ws, chokidar" — one badge or three)? [Completeness, Resolved: one badge per Technical Context line. "Primary Dependencies: Express, ws, chokidar" is ONE badge with label "Primary Dependencies" and value "Express, ws, chokidar"]
- [x] CHK004 - Is the tooltip behavior fully specified — trigger (hover vs click), delay, positioning, dismissal? [Clarity, Resolved: hover trigger (consistent with existing tooltip patterns in dashboard), no delay, positioned above badge, dismissed on mouse leave]
- [x] CHK005 - Are requirements defined for the empty badge wall state message content and styling? [Completeness, Resolved: per edge case spec — "No tech stack defined" message, consistent with existing empty state patterns (placeholder-view class)]

## Requirement Completeness — File Structure Tree

- [x] CHK006 - Are the file-type icons specified or referenced (which icon set, which file extensions map to which icons)? [Clarity, Resolved: use Unicode emoji icons — folder emoji for directories, file emoji for files. Simple, no external icon dependency (Constitution V Simplicity)]
- [x] CHK007 - Is the visual distinction between "existing" and "planned" files precisely defined (color, opacity, icon, label)? [Clarity, Resolved: existing files use normal text color (--color-text), planned files use dimmed color (--color-text-muted / opacity 0.5). Consistent with existing "done" vs "todo" visual patterns]
- [x] CHK008 - Is the default expand/collapse state specified for the tree on initial load? [Completeness, Resolved: expand first 2 levels, collapse deeper nesting]
- [x] CHK009 - Are requirements defined for how deeply nested trees (3+ levels) should render? [Completeness, Resolved: collapsed by default per CHK008. Standard tree indentation with tree-line characters. No special handling needed beyond existing expand/collapse]
- [x] CHK010 - Is the inline comment display format specified (color, font style, truncation rules)? [Clarity, Resolved: muted color (--color-text-muted), italic font style, no truncation (comments are short one-liners in all existing plan.md files)]

## Requirement Completeness — Architecture Diagram

- [x] CHK011 - Are the color assignments for each node type (client, server, storage, external, default) specified? [Clarity, Resolved: use existing dashboard palette — client: --color-accent (blue), server: --color-p2 (orange), storage: --color-done (green), external: --color-p1 (red), default: --color-text-muted (gray)]
- [x] CHK012 - Is the detail panel location and behavior specified (where it appears, how it's dismissed)? [Clarity, Resolved: reuse existing detail-panel pattern from story map — appears below the diagram, dismissed by clicking X button or clicking elsewhere. Same HTML structure and CSS]
- [x] CHK013 - Are zoom/pan requirements defined for the diagram, or is it fixed-size? [Completeness, Resolved: fixed-size SVG scaling to container width, no zoom/pan]
- [x] CHK014 - Is the node layout algorithm specified (how parsed ASCII positions map to rendered SVG positions)? [Clarity, Resolved: preserve relative positions from ASCII grid. Map character x,y coordinates to SVG proportionally — node center at (x/totalWidth * svgWidth, y/totalHeight * svgHeight). Maintains spatial relationships from original diagram]
- [x] CHK015 - Are edge routing requirements defined (straight lines, curves, avoiding node overlap)? [Completeness, Resolved: defer to implementation — straight lines, consistent with existing graph rendering]
- [x] CHK016 - Is the fallback behavior specified when ASCII diagram parsing fails partially (some boxes parsed, some not)? [Completeness, Resolved: show whatever was successfully parsed as nodes/edges. If zero boxes parsed, fall back to raw ASCII in a code block per edge case spec]

## Requirement Completeness — Tessl Tiles Panel

- [x] CHK017 - Is the tile card layout specified (grid, list, card dimensions)? [Clarity, Resolved: defer to implementation using existing card patterns from dashboard]
- [x] CHK018 - Is the eval score visualization precisely defined — bar chart type (histogram? sparkline?), color scheme, dimensions? [Clarity, Resolved: match the Tessl registry visual — horizontal bar chart with green bars for pass, gray for fail, large percentage number on left, multiplier badge (green pill). Exact implementation deferred to when eval API becomes available; the data model structure is defined (score, multiplier, chartData)]
- [x] CHK019 - Are requirements defined for the empty tessl.json dependencies state (has file but no dependencies)? [Completeness, Resolved: per edge case spec — show empty Tessl panel with "No tiles installed" message]
- [x] CHK020 - Is the visual relationship between badges and tile cards clear (do they visually associate related items)? [Clarity, Resolved: no visual association needed — they are separate sections in vertical layout, badges show tech context, tile cards show installed tiles]

## Requirement Completeness — Layout & Scrolling

- [x] CHK021 - Are section header/separator requirements defined between the stacked sub-views? [Completeness, Resolved: defer to implementation using existing section patterns]
- [x] CHK022 - Is the vertical spacing between sections specified? [Clarity, Resolved: defer to existing dashboard spacing]
- [x] CHK023 - Are responsive behavior requirements defined for narrow viewports (mobile/tablet)? [Completeness, Resolved: vertical overflow scrolling per FR-017, no special mobile layout needed — this is a developer tool typically used on desktop]

## Requirement Consistency

- [x] CHK024 - Are interactive element styles (click, hover, focus) consistent with the existing dashboard pattern (story map, radar chart)? [Consistency, Resolved: YES — reuse existing CSS classes and patterns: cursor pointer on interactive elements, hover state with opacity/color change, focus outline for accessibility. Same as story map graph nodes and constitution radar dots]
- [x] CHK025 - Is the detail panel pattern (click node → show detail) consistent with the story map's detail panel behavior? [Consistency, Resolved: YES — same detail-panel HTML structure, same showDetailPanel() function pattern, same close behavior (X button)]
- [x] CHK026 - Are empty state messages consistent in tone and format across all sub-views? [Consistency, Resolved: YES — all follow existing placeholder-view pattern: centered text, title + description, muted color. Messages: "No plan created yet" / "No tech stack defined" / "No structure defined" / "No tiles installed"]
- [x] CHK027 - Is the dark/light theme specified for all new visual elements (badges, tree, diagram, tile cards)? [Consistency, Resolved: use existing CSS custom properties (--color-bg, --color-surface, etc.) — theme support automatic]

## Acceptance Criteria Quality

- [x] CHK028 - Are all acceptance scenarios in Given/When/Then format testable without subjective judgment? [Measurability, Resolved: YES — reviewed all 19 scenarios. Each has concrete inputs, actions, and verifiable outputs. No subjective terms like "looks good" or "feels fast"]
- [x] CHK029 - Is "professional aesthetic consistent with dashboard theme" (SC-006) quantified with specific criteria? [Clarity, Resolved: quantified by reference — "same typography, color palette, and quality level" means using the same CSS custom properties, same font stack, same spacing/shadow system. Verified by visual comparison with existing views]
- [x] CHK030 - Is the 5-second live update requirement (SC-005) tested for all three sub-views, not just one? [Coverage, Resolved: YES — US5 has three acceptance scenarios, one per sub-view (badge wall, tree, diagram), each specifying "within 5 seconds"]

## Accessibility Requirements

- [x] CHK031 - Are keyboard navigation requirements defined for the file structure tree (arrow keys, enter to expand)? [Coverage, Resolved: tree items are focusable with tabindex, Enter/Space to toggle expand/collapse. Consistent with standard tree widget ARIA pattern]
- [x] CHK032 - Are ARIA role/label requirements specified for diagram nodes and edges? [Coverage, Resolved: SVG nodes get role="img" with aria-label containing node label and type. Edges get aria-hidden="true" (decorative). Diagram container gets role="figure" with aria-label]
- [x] CHK033 - Are color contrast requirements defined for the node type color coding? [Coverage, Resolved: use existing dashboard color system which already meets contrast requirements]
- [x] CHK034 - Are screen reader requirements defined for badge content and tooltips? [Coverage, Resolved: badges are semantic elements with visible text (label: value), tooltip content is also in aria-label. Standard HTML, inherently accessible]

## Notes

- All 34 items resolved
- 12 resolved in initial checklist generation
- 22 resolved during pre-implementation review
