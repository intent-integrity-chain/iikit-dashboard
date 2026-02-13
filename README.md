# IIKit Dashboard

**Watch your AI agent develop features in real time.**

A browser-based dashboard for [Intent Integrity Kit](https://github.com/intent-integrity-chain/kit) projects. Visualizes every phase of the IIKit workflow — from constitution principles through specification, planning, and implementation — with live updates as artifacts change on disk.

## Usage

```bash
# Run in your IIKit project directory
npx iikit-kanban

# Or specify a project path
npx iikit-kanban /path/to/your/project
```

The dashboard opens at `http://localhost:3000`.

## Setup

```bash
npm install
tessl install   # installs tile dependencies (like npm install for tiles)
```

## Phase Views

The pipeline bar at the top shows all IIKit workflow phases. Click any phase to see its visualization:

- **Constitution** — radar chart of governance principles with obligation levels (MUST/SHOULD/MAY)
- **Spec** — story map with swim lanes by priority + interactive requirements graph (US/FR/SC nodes and edges)
- **Clarify** — Q&A trail from clarification sessions, with clickable spec item references that navigate back to the Spec view
- **Plan** — tech stack badge wall, interactive file structure tree (existing vs. planned files), rendered architecture diagram from ASCII art, and Tessl tile cards
- **Implement** — kanban board with cards sliding Todo → In Progress → Done as the agent checks off tasks

Checklist, Testify, Tasks, and Analyze views are coming in future updates.

## Features

- **Live updates** — all views update in real time via WebSocket as project files change
- **Pipeline navigation** — phase nodes show status (complete/in-progress/skipped/not started) with progress percentages
- **Feature switching** — dropdown to switch between multiple features in `specs/`
- **Clarification traceability** — Q&A entries link back to the FR/US/SC spec items they clarify
- **Integrity badges** — shows if test assertions have been tampered with
- **Three-state theme** — cycles System (OS preference) → Light → Dark
- **Professional UI** — dark theme, smooth animations, comparable to Linear/Trello
- **Zero build step** — single HTML file with inline CSS/JS

## How It Works

The dashboard reads directly from your project's `specs/` directory:

- **`spec.md`** — user stories, requirements, success criteria, and clarification Q&A
- **`plan.md`** — tech stack, file structure, and architecture diagram
- **`tasks.md`** — task checkboxes grouped by `[US1]`, `[US2]` tags
- **`CONSTITUTION.md`** — governance principles and obligation levels
- **`tessl.json`** — installed Tessl tiles for the dependency panel

A file watcher (chokidar) detects changes and pushes updates to the browser via WebSocket with 300ms debounce.

## Integration with IIKit

When you run `/iikit-08-implement`, the implement skill automatically launches the dashboard in the background. No manual setup needed.

## Requirements

- Node.js 18+
- An IIKit project with `specs/` directory

## License

MIT
