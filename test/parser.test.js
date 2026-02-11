const { parseSpecStories, parseTasks } = require('../src/parser');

// TS-014: Parser extracts user stories from spec.md
describe('parseSpecStories', () => {
  test('extracts user story with id, title, and priority', () => {
    const content = `# Feature Specification

### User Story 1 - Watch an Agent Work (Priority: P1)

Some description text here.

### User Story 2 - See Where Every Story Stands (Priority: P1)

More description.

### User Story 3 - Switch Between Features (Priority: P2)

Even more.

### User Story 4 - Assertion Integrity at a Glance (Priority: P2)

Last one.
`;
    const stories = parseSpecStories(content);
    expect(stories).toHaveLength(4);
    expect(stories[0]).toEqual({ id: 'US1', title: 'Watch an Agent Work', priority: 'P1' });
    expect(stories[1]).toEqual({ id: 'US2', title: 'See Where Every Story Stands', priority: 'P1' });
    expect(stories[2]).toEqual({ id: 'US3', title: 'Switch Between Features', priority: 'P2' });
    expect(stories[3]).toEqual({ id: 'US4', title: 'Assertion Integrity at a Glance', priority: 'P2' });
  });

  test('returns empty array for content with no user stories', () => {
    const content = '# Just a heading\n\nSome text.\n';
    const stories = parseSpecStories(content);
    expect(stories).toEqual([]);
  });

  test('returns empty array for empty string', () => {
    const stories = parseSpecStories('');
    expect(stories).toEqual([]);
  });

  test('handles single user story', () => {
    const content = '### User Story 1 - Watch an Agent Work in Real Time (Priority: P1)\n';
    const stories = parseSpecStories(content);
    expect(stories).toHaveLength(1);
    expect(stories[0]).toEqual({ id: 'US1', title: 'Watch an Agent Work in Real Time', priority: 'P1' });
  });

  test('handles malformed input gracefully', () => {
    const stories = parseSpecStories(null);
    expect(stories).toEqual([]);
  });
});

// TS-015: Parser extracts tasks from tasks.md
describe('parseTasks', () => {
  test('extracts checked task with story tag', () => {
    const content = '- [x] T003 [US1] Implement WebSocket server\n';
    const tasks = parseTasks(content);
    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toEqual({
      id: 'T003',
      storyTag: 'US1',
      description: 'Implement WebSocket server',
      checked: true
    });
  });

  test('extracts unchecked task with story tag', () => {
    const content = '- [ ] T005 [US2] Add feature selector\n';
    const tasks = parseTasks(content);
    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toEqual({
      id: 'T005',
      storyTag: 'US2',
      description: 'Add feature selector',
      checked: false
    });
  });

  test('extracts tasks with [P] parallel marker', () => {
    const content = '- [ ] T006 [P] [US1] Implement tasks.md parser\n';
    const tasks = parseTasks(content);
    expect(tasks).toHaveLength(1);
    expect(tasks[0].id).toBe('T006');
    expect(tasks[0].storyTag).toBe('US1');
    expect(tasks[0].checked).toBe(false);
  });

  test('extracts multiple tasks', () => {
    const content = `## Phase 3
- [ ] T011 [US1] Add chokidar file watcher
- [x] T012 [US1] Add WebSocket server
- [ ] T013 [US1] Implement GET endpoint
- [x] T014 [US2] Create index.html
`;
    const tasks = parseTasks(content);
    expect(tasks).toHaveLength(4);
    expect(tasks[0]).toEqual({ id: 'T011', storyTag: 'US1', description: 'Add chokidar file watcher', checked: false });
    expect(tasks[1]).toEqual({ id: 'T012', storyTag: 'US1', description: 'Add WebSocket server', checked: true });
    expect(tasks[2]).toEqual({ id: 'T013', storyTag: 'US1', description: 'Implement GET endpoint', checked: false });
    expect(tasks[3]).toEqual({ id: 'T014', storyTag: 'US2', description: 'Create index.html', checked: true });
  });

  test('handles tasks without story tag', () => {
    const content = '- [ ] T001 Initialize package.json with name, version, scripts (start, test)\n';
    const tasks = parseTasks(content);
    expect(tasks).toHaveLength(1);
    expect(tasks[0].id).toBe('T001');
    expect(tasks[0].storyTag).toBeNull();
    expect(tasks[0].description).toBe('Initialize package.json with name, version, scripts (start, test)');
  });

  test('returns empty array for content with no tasks', () => {
    const tasks = parseTasks('# Just headings\n\nSome text.\n');
    expect(tasks).toEqual([]);
  });

  test('returns empty array for empty string', () => {
    const tasks = parseTasks('');
    expect(tasks).toEqual([]);
  });

  test('handles malformed input gracefully', () => {
    const tasks = parseTasks(null);
    expect(tasks).toEqual([]);
  });

  test('handles tasks with [P] but no story tag', () => {
    const content = '- [ ] T002 [P] Install dependencies: express, ws, chokidar\n';
    const tasks = parseTasks(content);
    expect(tasks).toHaveLength(1);
    expect(tasks[0].id).toBe('T002');
    expect(tasks[0].storyTag).toBeNull();
  });
});
