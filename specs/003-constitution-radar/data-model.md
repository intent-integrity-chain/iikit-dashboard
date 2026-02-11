# Data Model: Constitution Radar Chart

## Entities

### ConstitutionData
The complete parsed constitution for the project.

**Attributes:**
- `principles`: Array of Principle objects
- `version`: VersionInfo object or null
- `exists`: Boolean — whether CONSTITUTION.md was found

**Source:** Computed by `parseConstitutionPrinciples(projectPath)` in parser.js

### Principle
A single governance principle extracted from CONSTITUTION.md.

**Attributes:**
- `number`: String — Roman numeral identifier (e.g., "I", "II", "IV")
- `name`: String — principle name (e.g., "Test-First Development")
- `text`: String — full principle text (everything between this heading and the next)
- `rationale`: String — rationale text (after `**Rationale**:` marker)
- `level`: Enum — `"MUST"` | `"SHOULD"` | `"MAY"` (strongest keyword found in text)

**Parsing rules:**
- Headings matching `### N. Name` under `## Core Principles` section
- Level determined by scanning text for keywords: MUST > SHOULD > MAY (first strongest match wins)
- If no keywords found, default to "SHOULD"
- Rationale extracted from text between `**Rationale**:` and next heading or end of section

### VersionInfo
Constitution version metadata from the footer line.

**Attributes:**
- `version`: String — semantic version (e.g., "1.1.0")
- `ratified`: String — ratification date (e.g., "2026-02-10")
- `lastAmended`: String — last amendment date

**Parsing rules:**
- Match pattern: `**Version**: X.Y.Z | **Ratified**: DATE | **Last Amended**: DATE`
- If no match found, VersionInfo is null

## Radar Chart Geometry

### Obligation Level Mapping

| Level | Ring Distance | Value |
|-------|-------------|-------|
| MUST | Outer (100%) | 3 |
| SHOULD | Middle (66%) | 2 |
| MAY | Inner (33%) | 1 |

Each principle axis extends from center to its obligation level distance. The filled polygon shape connects all axis endpoints.
