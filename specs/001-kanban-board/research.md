# Research: IIKit Kanban Board

## Decisions

### File Watching Strategy
- **Decision**: chokidar
- **Rationale**: Cross-platform, efficient (uses native OS events), widely used, handles edge cases (atomic writes, rapid changes)
- **Alternatives**: Node.js built-in `fs.watch` (unreliable cross-platform, duplicate events), polling (wastes CPU, violates real-time accuracy principle)

### WebSocket Library
- **Decision**: ws
- **Rationale**: Fastest Node.js WebSocket implementation, zero dependencies, well-maintained, simple API
- **Alternatives**: Socket.io (overkill — adds reconnection/rooms/namespaces we don't need), faye-websocket (less popular)

### Frontend Approach
- **Decision**: Single HTML file with inline CSS/JS, no build step
- **Rationale**: Constitution IV (Simplicity). No bundler, no transpiler, no node_modules on client. Modern browsers support all needed features natively (CSS Grid, CSS Custom Properties, CSS Transitions, WebSocket API, fetch)
- **Alternatives**: React (adds build step, increases complexity), htmx (adds a dependency for something simple enough without it)

### Markdown Parsing
- **Decision**: Custom regex-based parser for spec.md and tasks.md
- **Rationale**: We only need to extract user story headers, priority badges, and task checkboxes. A full markdown parser (marked, remark) is overkill. Simple regex patterns: `### User Story N - Title (Priority: PX)` and `- [x] TXXX [USx] Description`
- **Alternatives**: marked (full parser — unnecessary weight), remark (AST-based — too complex for our needs)

### Hash Computation
- **Decision**: Reimplement assertion extraction + SHA256 in JavaScript
- **Rationale**: Avoids shelling out to `testify-tdd.sh` on every file change. Node.js built-in `crypto.createHash('sha256')` is fast. The extraction logic (grep Given/When/Then, normalize, sort) is simple to port
- **Alternatives**: Call `testify-tdd.sh compute-hash` (adds ~100ms per check from process spawn)

## Tessl Tiles

### Installed Tiles

| Technology | Tile | Type | Version |
|------------|------|------|---------|
| Express | tessl/npm-express | Documentation | 5.1.0 |
| ws | tessl/npm-ws | Documentation | 8.18.0 |
| Jest | tessl/npm-jest | Documentation | 30.1.0 |

### Technologies Without Tiles

- chokidar: No tile found in registry (use npm docs)
- Node.js built-in crypto: No tile needed (standard library)
