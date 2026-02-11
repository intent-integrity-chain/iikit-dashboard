# Quickstart: IIKit Kanban Board

## Setup

```bash
cd /path/to/iikit-kanban
npm install
```

## Launch

```bash
# Watch current directory (if it's an IIKit project)
node bin/iikit-kanban.js

# Watch a specific project directory
node bin/iikit-kanban.js /path/to/iikit-project
```

The dashboard opens automatically in your default browser at `http://localhost:PORT`.

## Validation Scenarios

### Scenario 1: Board loads with stories in correct columns
1. Ensure the target project has `specs/NNN-feature/spec.md` with user stories
2. Ensure `specs/NNN-feature/tasks.md` exists with tasks tagged `[US1]`, `[US2]`
3. Launch the dashboard
4. Verify: stories appear as cards, unchecked stories in Todo, partially checked in In Progress, fully checked in Done

### Scenario 2: Live task update
1. Launch the dashboard
2. In a separate terminal, edit tasks.md: change `- [ ]` to `- [x]` on one task
3. Verify: the checkbox on the corresponding card ticks off within 5 seconds

### Scenario 3: Card moves between columns
1. Launch the dashboard with a story that has all tasks unchecked (card in Todo)
2. Check one task → card moves to In Progress
3. Check remaining tasks → card moves to Done

### Scenario 4: Feature switching
1. Ensure the project has 2+ features with tasks.md
2. Launch the dashboard
3. Use the feature selector to switch between features
4. Verify: board updates to show the selected feature's stories

### Scenario 5: Integrity badge
1. Run `/iikit-05-testify` on a feature (creates hash)
2. Launch the dashboard → verify "verified" badge
3. Modify test-specs.md assertions
4. Verify: badge changes to "tampered"
