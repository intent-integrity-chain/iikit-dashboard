const { parseSpecStories, parseTasks, parseChecklists, parseConstitutionTDD, hasClarifications, parseConstitutionPrinciples, parseRequirements, parseSuccessCriteria, parseClarifications, parseStoryRequirementRefs } = require('../src/parser');
const fs = require('fs');
const path = require('path');
const os = require('os');

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
    expect(stories[0]).toMatchObject({ id: 'US1', title: 'Watch an Agent Work', priority: 'P1' });
    expect(stories[1]).toMatchObject({ id: 'US2', title: 'See Where Every Story Stands', priority: 'P1' });
    expect(stories[2]).toMatchObject({ id: 'US3', title: 'Switch Between Features', priority: 'P2' });
    expect(stories[3]).toMatchObject({ id: 'US4', title: 'Assertion Integrity at a Glance', priority: 'P2' });
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
    expect(stories[0]).toMatchObject({ id: 'US1', title: 'Watch an Agent Work in Real Time', priority: 'P1' });
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

// T006: Tests for parseChecklists
describe('parseChecklists', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'checklist-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('returns zeros for missing directory', () => {
    const result = parseChecklists('/nonexistent/path');
    expect(result).toEqual({ total: 0, checked: 0, percentage: 0 });
  });

  test('returns zeros for empty directory', () => {
    const result = parseChecklists(tmpDir);
    expect(result).toEqual({ total: 0, checked: 0, percentage: 0 });
  });

  test('counts checked and unchecked items', () => {
    fs.writeFileSync(path.join(tmpDir, 'req.md'), '- [x] CHK001 Done\n- [x] CHK002 Done\n- [ ] CHK003 Not done\n- [ ] CHK004 Not done\n');
    const result = parseChecklists(tmpDir);
    expect(result.total).toBe(4);
    expect(result.checked).toBe(2);
    expect(result.percentage).toBe(50);
  });

  test('aggregates across multiple files', () => {
    fs.writeFileSync(path.join(tmpDir, 'req.md'), '- [x] CHK001 Done\n- [ ] CHK002 Not done\n');
    fs.writeFileSync(path.join(tmpDir, 'ux.md'), '- [x] CHK003 Done\n- [x] CHK004 Done\n');
    const result = parseChecklists(tmpDir);
    expect(result.total).toBe(4);
    expect(result.checked).toBe(3);
    expect(result.percentage).toBe(75);
  });

  test('returns 100% when all checked', () => {
    fs.writeFileSync(path.join(tmpDir, 'req.md'), '- [x] CHK001 Done\n- [x] CHK002 Done\n');
    const result = parseChecklists(tmpDir);
    expect(result.percentage).toBe(100);
  });

  test('ignores non-md files', () => {
    fs.writeFileSync(path.join(tmpDir, 'notes.txt'), '- [ ] Not a checklist\n');
    const result = parseChecklists(tmpDir);
    expect(result.total).toBe(0);
  });
});

// T007: Tests for parseConstitutionTDD
describe('parseConstitutionTDD', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tdd-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('returns true when TDD + MUST keywords present', () => {
    const filePath = path.join(tmpDir, 'CONSTITUTION.md');
    fs.writeFileSync(filePath, '# Constitution\nTDD MUST be used for all development.\n');
    expect(parseConstitutionTDD(filePath)).toBe(true);
  });

  test('returns true when test-first + NON-NEGOTIABLE present', () => {
    const filePath = path.join(tmpDir, 'CONSTITUTION.md');
    fs.writeFileSync(filePath, '# Constitution\n### Test-First Development (NON-NEGOTIABLE)\nTests must be written before code.\n');
    expect(parseConstitutionTDD(filePath)).toBe(true);
  });

  test('returns false when no TDD keywords', () => {
    const filePath = path.join(tmpDir, 'CONSTITUTION.md');
    fs.writeFileSync(filePath, '# Constitution\nBe nice to each other.\nCode must be reviewed.\n');
    expect(parseConstitutionTDD(filePath)).toBe(false);
  });

  test('returns false for missing file', () => {
    expect(parseConstitutionTDD('/nonexistent/CONSTITUTION.md')).toBe(false);
  });
});

// T008: Tests for hasClarifications
describe('hasClarifications', () => {
  test('returns true when spec has Clarifications section', () => {
    expect(hasClarifications('# Spec\n## Clarifications\n### Session\n- Q: x -> A: y\n')).toBe(true);
  });

  test('returns false when spec has no Clarifications section', () => {
    expect(hasClarifications('# Spec\n## Requirements\n- FR-001\n')).toBe(false);
  });

  test('returns false for empty string', () => {
    expect(hasClarifications('')).toBe(false);
  });

  test('returns false for null', () => {
    expect(hasClarifications(null)).toBe(false);
  });
});

// T001: Tests for parseConstitutionPrinciples (TS-011 through TS-017)
describe('parseConstitutionPrinciples', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'constitution-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  // TS-011: Extracts principle name from heading
  test('extracts principle number and name from heading', () => {
    fs.writeFileSync(path.join(tmpDir, 'CONSTITUTION.md'), `# Constitution

## Core Principles

### I. Test-First Development (NON-NEGOTIABLE)

TDD MUST be used for all feature development.

**Rationale**: Prevents circular verification.
`);
    const result = parseConstitutionPrinciples(tmpDir);
    expect(result.principles).toHaveLength(1);
    expect(result.principles[0].number).toBe('I');
    expect(result.principles[0].name).toBe('Test-First Development');
  });

  // TS-012: Extracts obligation level MUST
  test('extracts obligation level MUST', () => {
    fs.writeFileSync(path.join(tmpDir, 'CONSTITUTION.md'), `# Constitution
## Core Principles
### I. Test-First Development
TDD MUST be used for all feature development.
**Rationale**: Prevents bugs.
`);
    const result = parseConstitutionPrinciples(tmpDir);
    expect(result.principles[0].level).toBe('MUST');
  });

  // TS-013: Extracts obligation level SHOULD
  test('extracts obligation level SHOULD', () => {
    fs.writeFileSync(path.join(tmpDir, 'CONSTITUTION.md'), `# Constitution
## Core Principles
### I. Code Documentation
Code SHOULD be well documented.
**Rationale**: Helps readability.
`);
    const result = parseConstitutionPrinciples(tmpDir);
    expect(result.principles[0].level).toBe('SHOULD');
  });

  // TS-014: Defaults to SHOULD when no keywords
  test('defaults to SHOULD when no MUST/SHOULD/MAY keywords', () => {
    fs.writeFileSync(path.join(tmpDir, 'CONSTITUTION.md'), `# Constitution
## Core Principles
### I. Be Nice
Be nice to each other.
**Rationale**: Good vibes.
`);
    const result = parseConstitutionPrinciples(tmpDir);
    expect(result.principles[0].level).toBe('SHOULD');
  });

  // TS-015: Extracts rationale text
  test('extracts rationale text', () => {
    fs.writeFileSync(path.join(tmpDir, 'CONSTITUTION.md'), `# Constitution
## Core Principles
### I. Test-First Development
TDD MUST be used.

**Rationale**: Prevents circular verification problem where AI agents weaken assertions.
`);
    const result = parseConstitutionPrinciples(tmpDir);
    expect(result.principles[0].rationale).toContain('Prevents circular verification');
  });

  // TS-016: Extracts version metadata from footer
  test('extracts version metadata from footer', () => {
    fs.writeFileSync(path.join(tmpDir, 'CONSTITUTION.md'), `# Constitution
## Core Principles
### I. Simplicity
Keep it simple. This MUST be followed.
**Rationale**: Less is more.

**Version**: 1.1.0 | **Ratified**: 2026-02-10 | **Last Amended**: 2026-02-10
`);
    const result = parseConstitutionPrinciples(tmpDir);
    expect(result.version).not.toBeNull();
    expect(result.version.version).toBe('1.1.0');
    expect(result.version.ratified).toBe('2026-02-10');
    expect(result.version.lastAmended).toBe('2026-02-10');
  });

  // TS-017: Returns null version when no footer
  test('returns null version when no footer', () => {
    fs.writeFileSync(path.join(tmpDir, 'CONSTITUTION.md'), `# Constitution
## Core Principles
### I. Simplicity
Keep it simple.
`);
    const result = parseConstitutionPrinciples(tmpDir);
    expect(result.version).toBeNull();
  });

  test('extracts multiple principles', () => {
    fs.writeFileSync(path.join(tmpDir, 'CONSTITUTION.md'), `# Constitution
## Core Principles
### I. Test-First Development (NON-NEGOTIABLE)
TDD MUST be used.
**Rationale**: Tests first.
### II. Real-Time Accuracy
The system MUST reflect true state.
**Rationale**: No stale data.
### IV. Simplicity
Start simple. Code MAY be refactored later.
**Rationale**: YAGNI.
`);
    const result = parseConstitutionPrinciples(tmpDir);
    expect(result.principles).toHaveLength(3);
    expect(result.principles[0].number).toBe('I');
    expect(result.principles[0].level).toBe('MUST');
    expect(result.principles[1].number).toBe('II');
    expect(result.principles[1].level).toBe('MUST');
    expect(result.principles[2].number).toBe('IV');
    expect(result.principles[2].level).toBe('MAY');
  });

  test('returns empty when no CONSTITUTION.md', () => {
    const result = parseConstitutionPrinciples(tmpDir);
    expect(result.principles).toEqual([]);
    expect(result.version).toBeNull();
    expect(result.exists).toBe(false);
  });

  test('returns exists true when file found', () => {
    fs.writeFileSync(path.join(tmpDir, 'CONSTITUTION.md'), `# Constitution
## Core Principles
### I. Test
Something MUST happen.
`);
    const result = parseConstitutionPrinciples(tmpDir);
    expect(result.exists).toBe(true);
  });

  // TS-018: Obligation level mapping values
  test('MUST is strongest, SHOULD is moderate, MAY is weakest', () => {
    fs.writeFileSync(path.join(tmpDir, 'CONSTITUTION.md'), `# Constitution
## Core Principles
### I. Strong
This MUST happen.
### II. Moderate
This SHOULD happen.
### III. Optional
This MAY happen.
`);
    const result = parseConstitutionPrinciples(tmpDir);
    expect(result.principles[0].level).toBe('MUST');
    expect(result.principles[1].level).toBe('SHOULD');
    expect(result.principles[2].level).toBe('MAY');
  });
});

// TS-019, TS-024: parseRequirements
describe('parseRequirements', () => {
  test('extracts FR-xxx with description text', () => {
    const content = `## Requirements

### Functional Requirements

- **FR-001**: System MUST render a story map
- **FR-002**: System MUST display each story as a card
`;
    const reqs = parseRequirements(content);
    expect(reqs).toHaveLength(2);
    expect(reqs[0]).toEqual({ id: 'FR-001', text: 'System MUST render a story map' });
    expect(reqs[1]).toEqual({ id: 'FR-002', text: 'System MUST display each story as a card' });
  });

  test('returns empty array for spec with no Requirements section', () => {
    const content = '# Feature\n\n## User Stories\n\nSome stories.\n';
    const reqs = parseRequirements(content);
    expect(reqs).toEqual([]);
  });

  test('returns empty array for empty string', () => {
    expect(parseRequirements('')).toEqual([]);
  });

  test('returns empty array for null', () => {
    expect(parseRequirements(null)).toEqual([]);
  });
});

// TS-020: parseSuccessCriteria
describe('parseSuccessCriteria', () => {
  test('extracts SC-xxx with description text', () => {
    const content = `## Success Criteria

### Measurable Outcomes

- **SC-001**: Developers can identify priority distribution within 3 seconds
- **SC-002**: Developers can trace from any story to requirements in under 3 clicks
`;
    const criteria = parseSuccessCriteria(content);
    expect(criteria).toHaveLength(2);
    expect(criteria[0]).toEqual({ id: 'SC-001', text: 'Developers can identify priority distribution within 3 seconds' });
    expect(criteria[1]).toEqual({ id: 'SC-002', text: 'Developers can trace from any story to requirements in under 3 clicks' });
  });

  test('returns empty array for empty string', () => {
    expect(parseSuccessCriteria('')).toEqual([]);
  });

  test('returns empty array for null', () => {
    expect(parseSuccessCriteria(null)).toEqual([]);
  });
});

// TS-021, TS-025: parseClarifications
describe('parseClarifications', () => {
  test('extracts Q&A pairs with session date', () => {
    const content = `## Clarifications

### Session 2026-02-11

- Q: How should cross-linking work? -> A: Only draw US to FR edges
- Q: Should nodes show coverage? -> A: No, coverage belongs to Tasks phase
`;
    const clarifications = parseClarifications(content);
    expect(clarifications).toHaveLength(2);
    expect(clarifications[0]).toEqual({
      session: '2026-02-11',
      question: 'How should cross-linking work?',
      answer: 'Only draw US to FR edges'
    });
    expect(clarifications[1]).toEqual({
      session: '2026-02-11',
      question: 'Should nodes show coverage?',
      answer: 'No, coverage belongs to Tasks phase'
    });
  });

  test('returns empty array for spec with no Clarifications section', () => {
    const content = '# Feature\n\n## Requirements\n\n- FR-001\n';
    expect(parseClarifications(content)).toEqual([]);
  });

  test('returns empty array for empty string', () => {
    expect(parseClarifications('')).toEqual([]);
  });

  test('returns empty array for null', () => {
    expect(parseClarifications(null)).toEqual([]);
  });
});

// TS-022, TS-026: parseStoryRequirementRefs
describe('parseStoryRequirementRefs', () => {
  test('extracts FR-xxx references from story sections', () => {
    const content = `### User Story 1 - View Story Map (Priority: P1)

A developer sees stories linked to FR-001 and FR-002.

**Acceptance Scenarios**:
1. **Given** a spec with FR-001, **When** loaded, **Then** display

---

### User Story 2 - Explore Graph (Priority: P1)

The graph shows FR-003 connections.
`;
    const edges = parseStoryRequirementRefs(content);
    expect(edges).toContainEqual({ from: 'US1', to: 'FR-001' });
    expect(edges).toContainEqual({ from: 'US1', to: 'FR-002' });
    expect(edges).toContainEqual({ from: 'US2', to: 'FR-003' });
  });

  test('returns empty edges for stories with no FR references', () => {
    const content = `### User Story 1 - Simple View (Priority: P1)

A simple story with no requirement references.
`;
    const edges = parseStoryRequirementRefs(content);
    expect(edges).toEqual([]);
  });

  test('deduplicates FR references within a story', () => {
    const content = `### User Story 1 - View Map (Priority: P1)

FR-001 is mentioned here and FR-001 again in acceptance.

**Acceptance Scenarios**:
1. **Given** FR-001, **When** loaded, **Then** display
`;
    const edges = parseStoryRequirementRefs(content);
    const us1Edges = edges.filter(e => e.from === 'US1' && e.to === 'FR-001');
    expect(us1Edges).toHaveLength(1);
  });

  test('returns empty array for empty string', () => {
    expect(parseStoryRequirementRefs('')).toEqual([]);
  });

  test('returns empty array for null', () => {
    expect(parseStoryRequirementRefs(null)).toEqual([]);
  });
});

// TS-023: parseSpecStories extended with scenarioCount
describe('parseSpecStories extended', () => {
  test('returns scenarioCount per story', () => {
    const content = `### User Story 1 - View Map (Priority: P1)

Description.

**Acceptance Scenarios**:

1. **Given** state, **When** action, **Then** result
2. **Given** state2, **When** action2, **Then** result2
3. **Given** state3, **When** action3, **Then** result3

---

### User Story 2 - Graph (Priority: P2)

Description.

**Acceptance Scenarios**:

1. **Given** state, **When** action, **Then** result
`;
    const stories = parseSpecStories(content);
    expect(stories[0].scenarioCount).toBe(3);
    expect(stories[1].scenarioCount).toBe(1);
  });

  test('returns 0 scenarioCount for story with no scenarios', () => {
    const content = `### User Story 1 - Simple (Priority: P1)

Just a description, no scenarios.

---

### User Story 2 - Another (Priority: P2)

Also no scenarios.
`;
    const stories = parseSpecStories(content);
    expect(stories[0].scenarioCount).toBe(0);
    expect(stories[1].scenarioCount).toBe(0);
  });
});
