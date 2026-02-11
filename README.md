# IIKit Kanban Board

**Watch your AI agent implement features in real time.**

A browser-based kanban dashboard for [Intent Integrity Kit](https://github.com/intent-integrity-chain/kit) projects. User stories appear as cards in Todo / In Progress / Done columns. As the agent checks off tasks in `tasks.md`, the checkboxes tick off and cards slide between columns live.

## Usage

```bash
# Run in your IIKit project directory
npx iikit-kanban

# Or specify a project path
npx iikit-kanban /path/to/your/project
```

The dashboard opens automatically in your browser at `http://localhost:3000`.

## Features

- **Live updates** — task checkboxes tick off in real time via WebSocket
- **Card movement** — stories slide from Todo → In Progress → Done as tasks complete
- **Dark/light theme** — toggle or auto-detect from OS preference
- **Collapsible tasks** — expand/collapse task lists per card (default: collapsed)
- **Integrity badges** — shows if test assertions have been tampered with
- **Feature switching** — dropdown to switch between multiple features
- **Professional UI** — dark theme, smooth animations, comparable to Linear/Trello
- **Zero build step** — single HTML file with inline CSS/JS

## How It Works

The dashboard reads directly from your project's `specs/` directory:

- **`spec.md`** — extracts user story titles and priorities
- **`tasks.md`** — extracts task checkboxes grouped by `[US1]`, `[US2]` tags
- **`context.json`** — checks assertion integrity hashes

A file watcher (chokidar) detects changes and pushes updates to the browser via WebSocket with 300ms debounce.

## Integration with IIKit

When you run `/iikit-08-implement`, the implement skill automatically launches the kanban dashboard in the background. No manual setup needed.

## Requirements

- Node.js 18+
- An IIKit project with `specs/` directory containing `spec.md` and `tasks.md`

## License

MIT
