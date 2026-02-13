# Data Parsing Requirements Quality Checklist: Plan Architecture Viewer

**Purpose**: Validate completeness, clarity, and consistency of data parsing and integration requirements
**Created**: 2026-02-11
**Feature**: [spec.md](../spec.md)

## Requirement Completeness — Tech Context Parsing

- [x] CHK035 - Are the expected key-value patterns in Technical Context precisely defined (bold label + colon + value)? [Clarity, Resolved: YES — data-model.md defines pattern as `**[Label]**: [Value]` lines within the Technical Context section. Regex: `/\*\*(.+?)\*\*:\s*(.+)/`]
- [x] CHK036 - Is behavior defined for multi-line values in Technical Context (e.g., value with parenthetical notes spanning lines)? [Completeness, Resolved: all existing plan.md files use single-line values — parse only the line containing the bold label]
- [x] CHK037 - Is behavior defined for unexpected/custom labels not in the standard set? [Completeness, Resolved: parse all bold-label-colon-value lines, no label whitelist — display whatever is found]
- [x] CHK038 - Are requirements defined for parsing Technical Context entries that contain markdown formatting (bold, code, links)? [Completeness, Resolved: strip markdown formatting, display plain text values in badges]

## Requirement Completeness — File Structure Parsing

- [x] CHK039 - Are the exact tree-drawing characters to be recognized specified (`├──`, `└──`, `│`)? [Clarity, Resolved: YES — data-model.md specifies tree characters: `├──` (branch), `└──` (last branch), `│` (vertical line). These are the only characters used in all existing plan.md files]
- [x] CHK040 - Is the depth calculation algorithm specified (indentation counting rules)? [Clarity, Resolved: YES — data-model.md says "Calculate depth from leading whitespace/│ count". Specifically: count the number of `│` characters + indent units before the entry name. Each nesting level adds one `│` + 4 spaces]
- [x] CHK041 - Is the directory detection rule precisely defined (trailing `/` vs. having children vs. both)? [Clarity, Resolved: YES — data-model.md says "Directories identified by trailing `/` or by having child entries at greater depth". Use both signals — trailing `/` OR having children]
- [x] CHK042 - Is behavior defined for file structure entries without inline comments? [Completeness, Resolved: comment field is null when no `#` appears on the line. No annotation displayed — just the file name and icon]
- [x] CHK043 - Is the root directory name extraction specified (first line of tree block)? [Clarity, Resolved: YES — data-model.md says "Strip the tree's root directory name (first line of the tree, e.g., iikit-kanban/)". First line of the code block that ends with `/` is the root name]
- [x] CHK044 - Are requirements defined for handling multiple File Structure code blocks in a single plan.md? [Completeness, Resolved: use the first code block under the File Structure heading — existing plan.md files have only one]

## Requirement Completeness — ASCII Diagram Parsing

- [x] CHK045 - Are the supported box-drawing characters fully enumerated? [Clarity, Resolved: YES — plan.md Key Design Decision 2 lists them: `┌`, `─`, `┐`, `│`, `└`, `┘` for boxes; `┬`, `┴`, `├`, `┤` for connectors. These cover all characters used in existing plan.md files]
- [x] CHK046 - Is behavior defined for nested boxes (boxes inside boxes, as seen in existing plan.md files)? [Completeness, Resolved: YES — plan.md says "Nested boxes (boxes inside boxes) are detected by finding `┌` characters within an already-detected box's bounds". Each nested box becomes its own node]
- [x] CHK047 - Is the box label extraction rule precisely defined (first non-empty line vs. longest line vs. other)? [Clarity, Resolved: YES — data-model.md says "First non-empty text line inside the box" and plan.md confirms "The first non-empty text line is the box label"]
- [x] CHK048 - Is behavior defined for boxes with no text content? [Completeness, Resolved: skip empty boxes — they are decorative borders, not components]
- [x] CHK049 - Is the edge detection algorithm specified for connectors between non-adjacent boxes? [Clarity, Resolved: YES — plan.md Key Design Decision 2 describes: "After removing box regions, scan remaining lines for connector characters that form paths between box boundaries. Extract label text adjacent to connector paths"]
- [x] CHK050 - Is edge label extraction precisely defined (proximity rules, which text counts as a label)? [Clarity, Resolved: YES — plan.md says "text on the same line as a horizontal connector, or between vertical connector segments". Adjacent non-box-drawing text near a connector path is the label]
- [x] CHK051 - Is behavior defined for ASCII diagrams that use `+---+` style instead of Unicode box-drawing? [Completeness, Resolved: not supported — all existing plan.md files use Unicode box-drawing characters. Fall back to raw ASCII display per edge case spec]
- [x] CHK052 - Are requirements defined for the "fallback to raw ASCII" display when parsing fails? [Completeness, Resolved: display the original ASCII text in a monospace code block (pre/code HTML elements), preserving whitespace. Same styling as markdown code blocks in the dashboard]

## Requirement Completeness — LLM Classification

- [x] CHK053 - Is the LLM prompt for node type classification specified or at least constrained? [Clarity, Resolved: plan.md constrains it — input is "array of node labels", output is "{label: type} mapping" where type is one of {client, server, storage, external}. Prompt asks to classify each label into one of these 4 categories]
- [x] CHK054 - Is the expected response format from the LLM call defined? [Clarity, Resolved: YES — plan.md says output is `{label: type}` mapping. Implementation parses JSON response mapping each label string to a type string]
- [x] CHK055 - Are requirements defined for LLM response validation (what if it returns unexpected types)? [Completeness, Resolved: if LLM returns type not in {client, server, storage, external}, use "default"]
- [x] CHK056 - Is the caching strategy for LLM results specified (invalidation trigger, scope)? [Clarity, Resolved: YES — plan.md says "Cache: in-memory, invalidated when plan.md changes". Cache is per-feature, stored in server memory, cleared when the file watcher detects a plan.md change]
- [x] CHK057 - Are latency requirements defined for the LLM call (timeout, impact on page load)? [Completeness, Resolved: 5-second timeout, fall back to "default" type on timeout]

## Requirement Completeness — Tessl Integration

- [x] CHK058 - Is the tessl.json schema precisely defined (required fields, expected structure)? [Clarity, Resolved: YES — data-model.md defines it: top-level `dependencies` object where keys are "workspace/tile-name" and values are `{version: "X.Y.Z"}`. This matches the actual tessl.json format observed in the project]
- [x] CHK059 - Is behavior defined for tessl.json with unexpected fields or structure? [Completeness, Resolved: per edge case spec — "Skip the Tessl panel gracefully; other sections render normally". If JSON parsing fails or `dependencies` key is missing, treat as empty]
- [x] CHK060 - Are requirements defined for when eval data becomes available — how will the system detect and display it? [Completeness, Resolved: the eval field in the data model is `null` for now. When the Tessl API adds eval support, the parseTesslJson function will be updated to include eval data. The client already has the card structure to show score/multiplier/chart — it just conditionally renders those elements when eval is non-null]

## Requirement Completeness — Research.md Tooltip Matching

- [x] CHK061 - Is the matching algorithm between badge values and research decision titles precisely defined? [Clarity, Resolved: YES — plan.md Key Design Decision 6 says "substring matching". Badge value text is compared against research decision titles. If a decision title contains any word from the badge value (case-insensitive), it's a match]
- [x] CHK062 - Is behavior defined when multiple research decisions match a single badge? [Completeness, Resolved: use the first match — research decisions have unique technology focuses]

## Requirement Consistency

- [x] CHK063 - Are the parsing functions consistent with existing parser.js patterns (regex-based, same return shapes)? [Consistency, Resolved: YES — plan specifies new functions in parser.js following existing patterns: regex-based extraction, return arrays of objects, same module.exports pattern]
- [x] CHK064 - Is the WebSocket message format (`planview_update`) consistent with existing message types? [Consistency, Resolved: YES — follows same pattern as board_update, pipeline_update, storymap_update: `{type: "planview_update", feature: "...", planview: {...}}`]
- [x] CHK065 - Is the API response shape consistent with existing endpoints (`/api/board`, `/api/storymap`)? [Consistency, Resolved: YES — returns JSON object with structured data, same as /api/storymap returns {stories, requirements, edges, ...}. The /api/planview returns {techContext, fileStructure, diagram, tesslTiles, exists}]

## Scenario Coverage

- [x] CHK066 - Are requirements defined for plan.md files that have only some sections (e.g., tech context but no file structure)? [Coverage, Resolved: YES — FR-019 covers this: "handle missing or incomplete plan artifacts gracefully, showing appropriate empty states". Each section is independently parsed; missing sections return empty/null without affecting others]
- [x] CHK067 - Are requirements defined for how the system handles concurrent plan.md changes (rapid successive edits)? [Coverage, Resolved: chokidar debounces with 300ms stability threshold — existing behavior handles this]
- [x] CHK068 - Are requirements defined for plan.md files with non-UTF-8 encoding? [Coverage, Resolved: assume UTF-8, consistent with all existing parsers]

## Notes

- All 34 items resolved
- 11 resolved in initial checklist generation
- 23 resolved during pre-implementation review
