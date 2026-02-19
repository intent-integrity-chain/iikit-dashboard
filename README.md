# IIKit Dashboard

**Watch your AI agent develop features in real time.**

A browser-based dashboard for [Intent Integrity Kit (IIKit)](https://github.com/intent-integrity-chain/kit) projects. IIKit is a specification-driven development framework that guides AI agents through a structured workflow — from governance constitution through specification, clarification, planning, testing, and implementation. The dashboard visualizes every phase of that workflow with live updates as artifacts change on disk.

## Usage

The dashboard launches automatically early in the IIKit workflow — no manual setup needed.

You can also start it standalone to browse historical data for any project that has feature specs:

```bash
npx iikit-dashboard                       # current directory
npx iikit-dashboard /path/to/project      # specific project
npx iikit-dashboard --port 3001           # custom port
```

The dashboard opens at `http://localhost:3000` by default. A pidfile (`.specify/dashboard.pid.json`) is written on startup so external tools can discover which project a running dashboard serves and at which port.

## Views

The pipeline bar at the top shows all nine IIKit workflow phases. Click any phase to see its visualization:

| Phase | View |
|-------|------|
| **Constitution** | Radar chart of governance principles with obligation levels (MUST / SHOULD / MAY) and version timeline |
| **Spec** | Story map with swim lanes by priority + interactive force-directed requirements graph (US / FR / SC nodes and edges) with detail side-panel |
| **Clarify** | Q&A trail from clarification sessions grouped by date, with clickable spec-item references that navigate to the Spec view |
| **Plan** | Tech context key-value pairs, interactive file-structure tree (existing vs. planned files), rendered architecture diagram, and Tessl tile cards with live eval scores |
| **Checklist** | Progress rings per checklist file with color coding (red/yellow/green), gate traffic light (OPEN/BLOCKED), and accordion detail view with CHK IDs and tag badges |
| **Testify** | Assertion integrity seal (Verified/Tampered/Missing), Sankey traceability diagram (Requirements → Test Specs → Tasks), test pyramid, and gap highlighting for untested requirements |
| **Tasks** | Redirects to the Implement board (tasks are managed there) |
| **Analyze** | Health gauge (0–100) with four weighted factors, coverage heatmap (Tasks/Tests/Plan per requirement), and sortable/filterable severity table of analysis findings |
| **Implement** | Kanban board with cards sliding Todo → In Progress → Done as the agent checks off tasks, with collapsible per-story task lists |

## Features

- **Live updates** — all views refresh in real time via WebSocket as project files change
- **Pipeline navigation** — phase nodes show status (complete / in-progress / skipped / not started) with progress percentages
- **Cross-panel navigation** — Cmd/Ctrl+click any FR, US, SC, or task identifier to jump to its linked panel (Spec, Testify, Implement, Checklist, or Clarify)
- **Feature selector** — dropdown to switch between features in `specs/`, sorted newest-first
- **Project label** — header shows the project directory name with full path on hover, so you know which project a dashboard tab belongs to
- **Integrity badges** — shows whether test assertions have been tampered with (verified / tampered / missing)
- **Tessl eval scores** — Plan view tile cards display live eval data (score, pass/fail chart) when available
- **Activity indicator** — green dot pulses in the header when files are actively changing
- **Multi-project support** — pidfile at `.specify/dashboard.pid.json` lets external scripts identify running instances per project
- **Three-state theme** — cycles System (OS preference) → Light → Dark
- **Zero build step** — single HTML file with inline CSS and JS

## How It Works

The server reads directly from your project's directory:

| File | Purpose |
|------|---------|
| `CONSTITUTION.md` | Governance principles and obligation levels |
| `specs/<feature>/spec.md` | User stories, requirements, success criteria, and clarification Q&A |
| `specs/<feature>/plan.md` | Tech stack, file structure, and architecture diagram |
| `specs/<feature>/research.md` | Research decisions (displayed as tooltips in Plan view) |
| `specs/<feature>/tasks.md` | Task checkboxes grouped by `[US1]`, `[US2]` tags |
| `specs/<feature>/checklists/*.md` | Checklist items with completion status, CHK IDs, and category groupings |
| `specs/<feature>/tests/test-specs.md` | Test specifications for the Testify traceability view |
| `specs/<feature>/context.json` | Assertion hash for integrity verification |
| `specs/<feature>/analysis.md` | Consistency analysis findings, coverage, and metrics |
| `tessl.json` | Installed Tessl tiles for the Plan dependency panel |

A file watcher (chokidar) monitors the project tree (excluding `node_modules` and `.git`) and pushes updates to the browser via WebSocket with 300 ms debounce.

## Requirements

- Node.js 18+
- A project with a `specs/` directory containing IIKit feature artifacts

## License

MIT
