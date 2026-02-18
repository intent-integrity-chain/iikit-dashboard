# IIKit Dashboard

**Watch your AI agent develop features in real time.**

A browser-based dashboard for [Intent Integrity Kit (IIKit)](https://github.com/intent-integrity-chain/kit) projects. IIKit is a specification-driven development framework that guides AI agents through a structured workflow — from governance constitution through specification, clarification, planning, testing, and implementation. The dashboard visualizes every phase of that workflow with live updates as artifacts change on disk.

## Usage

The dashboard launches automatically early in the IIKit workflow — no manual setup needed.

You can also start it standalone to browse historical data for any project that has feature specs:

```bash
npx iikit-dashboard              # current directory
npx iikit-dashboard /path/to/project   # specific project
```

The dashboard opens at `http://localhost:3000`.

## Views

The pipeline bar at the top shows all nine IIKit workflow phases. Click any phase to see its visualization:

| Phase | View |
|-------|------|
| **Constitution** | Radar chart of governance principles with obligation levels (MUST / SHOULD / MAY) |
| **Spec** | Story map with swim lanes by priority + interactive requirements graph (US / FR / SC nodes and edges) |
| **Clarify** | Q&A trail from clarification sessions, with clickable spec-item references that navigate back to the Spec view |
| **Plan** | Tech stack badge wall, interactive file-structure tree (existing vs. planned files), rendered architecture diagram, and Tessl tile cards |
| **Checklist** | Progress rings per checklist file with color coding (red/yellow/green), gate traffic light (OPEN/BLOCKED), and accordion detail view with CHK IDs and tag badges |
| **Testify** | *Coming soon* |
| **Tasks** | *Coming soon* |
| **Analyze** | *Coming soon* |
| **Implement** | Kanban board with cards sliding Todo → In Progress → Done as the agent checks off tasks |

## Features

- **Live updates** — all views refresh in real time via WebSocket as project files change
- **Pipeline navigation** — phase nodes show status (complete / in-progress / skipped / not started) with progress percentages
- **Feature selector** — dropdown to switch between features in `specs/`, sorted newest-first
- **Clarification traceability** — Q&A entries link back to the FR / US / SC spec items they clarify
- **Integrity badges** — shows whether test assertions have been tampered with
- **Three-state theme** — cycles System (OS preference) → Light → Dark
- **Zero build step** — single HTML file with inline CSS and JS

## How It Works

The server reads directly from your project's `specs/` directory:

| File | Purpose |
|------|---------|
| `spec.md` | User stories, requirements, success criteria, and clarification Q&A |
| `plan.md` | Tech stack, file structure, and architecture diagram |
| `tasks.md` | Task checkboxes grouped by `[US1]`, `[US2]` tags |
| `checklists/*.md` | Checklist items with completion status, CHK IDs, and category groupings |
| `CONSTITUTION.md` | Governance principles and obligation levels |
| `tessl.json` | Installed Tessl tiles for the dependency panel |

A file watcher (chokidar) detects changes and pushes updates to the browser via WebSocket with 300 ms debounce.

## Requirements

- Node.js 18+
- A project with a `specs/` directory containing IIKit feature artifacts

## License

MIT
