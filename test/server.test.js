const http = require('http');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Helper to make HTTP requests
function httpGet(port, path) {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://localhost:${port}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data), headers: res.headers });
        } catch {
          resolve({ status: res.statusCode, data, headers: res.headers });
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(5000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

describe('Server', () => {
  let server;
  let testDir;
  let port;

  beforeAll(async () => {
    // Create a temporary project directory with test fixtures
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'iikit-dashboard-test-'));

    // Create specs directory structure for two features
    const feature1Dir = path.join(testDir, 'specs', '001-auth');
    const feature2Dir = path.join(testDir, 'specs', '002-payments');
    const testsDir1 = path.join(feature1Dir, 'tests');
    const specifyDir = path.join(testDir, '.specify');

    fs.mkdirSync(feature1Dir, { recursive: true });
    fs.mkdirSync(feature2Dir, { recursive: true });
    fs.mkdirSync(testsDir1, { recursive: true });
    fs.mkdirSync(specifyDir, { recursive: true });

    // Feature 1: 001-auth with 3 stories, mixed task states
    fs.writeFileSync(path.join(feature1Dir, 'spec.md'), `# Feature Specification

### User Story 1 - Login with Email (Priority: P1)

Description.

### User Story 2 - Password Reset (Priority: P1)

Description.

### User Story 3 - OAuth Integration (Priority: P2)

Description.
`);

    fs.writeFileSync(path.join(feature1Dir, 'tasks.md'), `# Tasks

## Phase 2
- [x] T001 [US1] Create login form
- [x] T002 [US1] Add validation
- [ ] T003 [US2] Design reset flow
- [ ] T004 [US2] Send reset email
- [ ] T005 [US3] Add OAuth buttons
`);

    fs.writeFileSync(path.join(testsDir1, 'test-specs.md'), `# Test Specifications

**Given**: a user with valid credentials
**When**: they submit the login form
**Then**: they are redirected to dashboard
`);

    // Feature 2: 002-payments with 1 story
    fs.writeFileSync(path.join(feature2Dir, 'spec.md'), `# Feature Specification

### User Story 1 - Process Payment (Priority: P1)

Description.
`);

    fs.writeFileSync(path.join(feature2Dir, 'tasks.md'), `# Tasks

- [ ] T001 [US1] Integrate Stripe
- [ ] T002 [US1] Add payment form
`);

    // context.json per feature with a hash (intentionally wrong for tampered test)
    fs.writeFileSync(path.join(feature1Dir, 'context.json'), JSON.stringify({
      testify: {
        assertion_hash: 'intentionally_wrong_hash',
        generated_at: '2026-02-10T00:00:00Z',
        test_specs_file: 'specs/001-auth/tests/test-specs.md'
      }
    }));

    // Start server
    const { createServer } = require('../src/server');
    const result = await createServer({ projectPath: testDir, port: 0 });
    server = result.server;
    port = result.port;
  });

  afterAll(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    // Clean up temp dir
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  // TS-011: GET /api/features returns feature list
  test('GET /api/features returns list of features', async () => {
    const res = await httpGet(port, '/api/features');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data).toHaveLength(2);

    const ids = res.data.map(f => f.id);
    expect(ids).toContain('001-auth');
    expect(ids).toContain('002-payments');

    const auth = res.data.find(f => f.id === '001-auth');
    expect(auth.name).toBeDefined();
    expect(auth.stories).toBe(3);
    expect(auth.progress).toBe('2/5');
  });

  // Features should be sorted newest-first (highest prefix number first)
  test('GET /api/features returns features sorted newest first', async () => {
    const res = await httpGet(port, '/api/features');
    const ids = res.data.map(f => f.id);
    expect(ids).toEqual(['002-payments', '001-auth']);
  });

  // TS-012: GET /api/board/:feature returns board state
  test('GET /api/board/:feature returns board state with columns', async () => {
    const res = await httpGet(port, '/api/board/001-auth');
    expect(res.status).toBe(200);

    const board = res.data;
    expect(board).toHaveProperty('todo');
    expect(board).toHaveProperty('in_progress');
    expect(board).toHaveProperty('done');
    expect(board).toHaveProperty('integrity');

    // US1 has all tasks checked -> done
    expect(board.done).toHaveLength(1);
    expect(board.done[0].id).toBe('US1');

    // US2 has 0 checked -> todo
    expect(board.todo.find(c => c.id === 'US2')).toBeDefined();

    // US3 has 0 checked -> todo
    expect(board.todo.find(c => c.id === 'US3')).toBeDefined();
  });

  test('GET /api/board/:feature returns 404 for missing feature', async () => {
    const res = await httpGet(port, '/api/board/999-nonexistent');
    expect(res.status).toBe(404);
  });

  test('GET / serves HTML page', async () => {
    const res = await httpGet(port, '/');
    expect(res.status).toBe(200);
    expect(typeof res.data).toBe('string');
    expect(res.data).toContain('<!DOCTYPE html>');
  });

  test('board state includes integrity status', async () => {
    const res = await httpGet(port, '/api/board/001-auth');
    expect(res.data.integrity).toBeDefined();
    expect(res.data.integrity.status).toBeDefined();
    // We stored an intentionally wrong hash, so it should be tampered
    expect(res.data.integrity.status).toBe('tampered');
  });

  // TS-008: GET /api/constitution returns principles
  test('GET /api/constitution returns principles array', async () => {
    const res = await httpGet(port, '/api/constitution');
    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('principles');
    expect(res.data).toHaveProperty('exists');
  });

  // TS-009: GET /api/constitution returns empty when no file
  test('GET /api/constitution returns exists false when no CONSTITUTION.md', async () => {
    // testDir has no CONSTITUTION.md by default
    const res = await httpGet(port, '/api/constitution');
    expect(res.status).toBe(200);
    expect(res.data.exists).toBe(false);
    expect(res.data.principles).toEqual([]);
  });

  // TS-012: GET /api/pipeline/:feature returns correct phase array
  test('GET /api/pipeline/:feature returns pipeline with 9 phases', async () => {
    const res = await httpGet(port, '/api/pipeline/001-auth');
    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('phases');
    expect(res.data.phases).toHaveLength(9);

    const ids = res.data.phases.map(p => p.id);
    expect(ids).toEqual([
      'constitution', 'spec', 'clarify', 'plan',
      'checklist', 'testify', 'tasks', 'analyze', 'implement'
    ]);
  });

  // TS-013: Pipeline API returns correct status values per phase
  test('GET /api/pipeline/:feature returns correct statuses', async () => {
    const res = await httpGet(port, '/api/pipeline/001-auth');
    const phases = res.data.phases;

    // spec.md exists -> complete
    expect(phases.find(p => p.id === 'spec').status).toBe('complete');
    // tasks.md exists -> complete
    expect(phases.find(p => p.id === 'tasks').status).toBe('complete');
    // tasks has 2/5 checked -> in_progress with 40%
    const impl = phases.find(p => p.id === 'implement');
    expect(impl.status).toBe('in_progress');
    expect(impl.progress).toBe('40%');
  });

  // TS-014: Pipeline API returns 404 for nonexistent feature
  test('GET /api/pipeline/:feature returns 404 for missing feature', async () => {
    const res = await httpGet(port, '/api/pipeline/999-nonexistent');
    expect(res.status).toBe(404);
  });

  // TS-015: GET /api/storymap/:feature returns story map data
  test('GET /api/storymap/:feature returns story map data', async () => {
    const res = await httpGet(port, '/api/storymap/001-auth');
    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('stories');
    expect(res.data).toHaveProperty('requirements');
    expect(res.data).toHaveProperty('successCriteria');
    expect(res.data).toHaveProperty('clarifications');
    expect(res.data).toHaveProperty('edges');
    expect(Array.isArray(res.data.stories)).toBe(true);
    expect(res.data.stories.length).toBe(3);
  });

  // TS-016: GET /api/storymap/:feature returns 404 for missing feature
  test('GET /api/storymap/:feature returns 404 for missing feature', async () => {
    const res = await httpGet(port, '/api/storymap/999-nonexistent');
    expect(res.status).toBe(404);
  });

  // TS-017: GET /api/storymap/:feature handles empty spec
  test('GET /api/storymap/:feature handles feature with no stories', async () => {
    const res = await httpGet(port, '/api/storymap/002-payments');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data.stories)).toBe(true);
  });

  // TS-016: GET /api/checklist/:feature returns correct response shape
  test('GET /api/checklist/:feature returns files array and gate object', async () => {
    // Create checklist files for 001-auth
    const checklistDir = path.join(testDir, 'specs', '001-auth', 'checklists');
    fs.mkdirSync(checklistDir, { recursive: true });
    fs.writeFileSync(path.join(checklistDir, 'ux.md'), '# UX\n\n- [x] CHK-001 Item 1\n- [ ] CHK-002 Item 2\n');

    const res = await httpGet(port, '/api/checklist/001-auth');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data.files)).toBe(true);
    expect(res.data.files.length).toBeGreaterThan(0);

    const file = res.data.files[0];
    expect(file).toHaveProperty('name');
    expect(file).toHaveProperty('filename');
    expect(file).toHaveProperty('total');
    expect(file).toHaveProperty('checked');
    expect(file).toHaveProperty('percentage');
    expect(file).toHaveProperty('color');
    expect(file).toHaveProperty('items');

    expect(res.data).toHaveProperty('gate');
    expect(res.data.gate).toHaveProperty('status');
    expect(res.data.gate).toHaveProperty('level');
    expect(res.data.gate).toHaveProperty('label');
  });

  // TS-017: GET /api/checklist/:feature returns 404 for unknown feature
  test('GET /api/checklist/:feature returns 404 for unknown feature', async () => {
    const res = await httpGet(port, '/api/checklist/999-nonexistent');
    expect(res.status).toBe(404);
  });

  // TS-018: GET /api/checklist/:feature returns empty files when no checklists
  test('GET /api/checklist/:feature returns empty files with red gate when no checklists', async () => {
    const res = await httpGet(port, '/api/checklist/002-payments');
    expect(res.status).toBe(200);
    expect(res.data.files).toEqual([]);
    expect(res.data.gate).toEqual({ status: 'blocked', level: 'red', label: 'GATE: BLOCKED' });
  });

  // T008: TS-021 — GET /api/testify/:feature returns complete TestifyViewState
  test('GET /api/testify/:feature returns complete testify state', async () => {
    // Feature 001-auth has spec.md, tasks.md, and tests/test-specs.md
    const res = await httpGet(port, '/api/testify/001-auth');
    expect(res.status).toBe(200);

    const data = res.data;
    expect(data).toHaveProperty('requirements');
    expect(data).toHaveProperty('testSpecs');
    expect(data).toHaveProperty('tasks');
    expect(data).toHaveProperty('edges');
    expect(data).toHaveProperty('gaps');
    expect(data).toHaveProperty('pyramid');
    expect(data).toHaveProperty('integrity');
    expect(data).toHaveProperty('exists');

    expect(Array.isArray(data.requirements)).toBe(true);
    expect(Array.isArray(data.testSpecs)).toBe(true);
    expect(Array.isArray(data.tasks)).toBe(true);
    expect(Array.isArray(data.edges)).toBe(true);
    expect(data.gaps).toHaveProperty('untestedRequirements');
    expect(data.gaps).toHaveProperty('unimplementedTests');
    expect(data.pyramid).toHaveProperty('acceptance');
    expect(data.pyramid).toHaveProperty('contract');
    expect(data.pyramid).toHaveProperty('validation');
    expect(data.integrity).toHaveProperty('status');
  });

  // T008: TS-022 — GET /api/testify/:feature returns empty state when test-specs.md missing
  test('GET /api/testify/:feature returns empty state when no test-specs.md', async () => {
    // Feature 002-payments has no tests/test-specs.md
    const res = await httpGet(port, '/api/testify/002-payments');
    expect(res.status).toBe(200);

    const data = res.data;
    expect(data.exists).toBe(false);
    expect(data.testSpecs).toEqual([]);
    expect(data.edges).toEqual([]);
    expect(data.pyramid.acceptance.count).toBe(0);
    expect(data.pyramid.contract.count).toBe(0);
    expect(data.pyramid.validation.count).toBe(0);
    expect(data.integrity.status).toBe('missing');
  });

  // T008: GET /api/testify/:feature returns 404 for unknown feature
  test('GET /api/testify/:feature returns 404 for unknown feature', async () => {
    const res = await httpGet(port, '/api/testify/999-nonexistent');
    expect(res.status).toBe(404);
  });
});
