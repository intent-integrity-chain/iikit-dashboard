// @ts-check
const { test, expect } = require('@playwright/test');
const { createFixtureProject, startServer } = require('./helpers');

let port;
let cleanup;

test.beforeAll(async () => {
  const projectPath = createFixtureProject();
  const result = await startServer(projectPath);
  port = result.port;
  cleanup = result.cleanup;
});

test.afterAll(async () => {
  if (cleanup) await cleanup();
});

function baseURL() {
  return `http://localhost:${port}`;
}

/**
 * Strip volatile values from an object tree: timestamps, absolute paths,
 * hashes that change per run. Returns a deep-cloned, sanitised copy.
 */
function stripVolatile(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') {
    // Replace absolute filesystem paths (e.g. /tmp/iikit-visual-test-XXXX/...)
    let s = obj.replace(/\/tmp\/[^\s"',}]+/g, '<stripped-path>');
    s = s.replace(/\/var\/folders\/[^\s"',}]+/g, '<stripped-path>');
    s = s.replace(/\/Users\/[^\s"',}]+/g, '<stripped-path>');
    s = s.replace(/\/private\/[^\s"',}]+/g, '<stripped-path>');
    // Replace ISO timestamps
    s = s.replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[.\dZ+-]*/g, '<stripped-timestamp>');
    return s;
  }
  if (Array.isArray(obj)) return obj.map(stripVolatile);
  if (typeof obj === 'object') {
    const out = {};
    for (const [key, value] of Object.entries(obj)) {
      // Strip keys that are known to be volatile
      if (['projectPath', 'startedAt', 'generated_at'].includes(key)) {
        out[key] = '<stripped>';
        continue;
      }
      out[key] = stripVolatile(value);
    }
    return out;
  }
  return obj;
}

test.describe('API Contracts', () => {

  test('GET /api/meta returns project metadata shape', async ({ request }) => {
    const res = await request.get(`${baseURL()}/api/meta`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    const sanitised = stripVolatile(body);
    expect(sanitised).toMatchObject({
      projectPath: '<stripped>'
    });
    // Verify no unexpected top-level keys
    expect(Object.keys(body)).toEqual(['projectPath']);
  });

  test('GET /api/features returns features array shape', async ({ request }) => {
    const res = await request.get(`${baseURL()}/api/features`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(2);
    // Features are sorted newest-first: 002-payments, then 001-auth
    for (const feature of body) {
      expect(feature).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        stories: expect.any(Number),
        progress: expect.stringMatching(/^\d+\/\d+$/)
      });
      expect(Object.keys(feature).sort()).toEqual(['id', 'name', 'progress', 'stories']);
    }
  });

  test('GET /api/constitution returns constitution shape', async ({ request }) => {
    const res = await request.get(`${baseURL()}/api/constitution`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    // Constitution has principles array with version info and exists flag
    expect(body).toMatchObject({
      principles: expect.any(Array),
      exists: expect.any(Boolean)
    });
    expect(body.principles.length).toBeGreaterThanOrEqual(1);
    for (const p of body.principles) {
      expect(p).toMatchObject({
        number: expect.any(String),
        name: expect.any(String),
        level: expect.stringMatching(/^(MUST|SHOULD|MAY)$/),
        text: expect.any(String)
      });
    }
  });

  test('GET /api/pipeline/001-auth returns pipeline shape', async ({ request }) => {
    const res = await request.get(`${baseURL()}/api/pipeline/001-auth`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({
      phases: expect.any(Array)
    });
    expect(body.phases.length).toBeGreaterThanOrEqual(1);
    for (const phase of body.phases) {
      expect(phase).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        status: expect.any(String)
      });
    }
  });

  test('GET /api/storymap/001-auth returns storymap shape', async ({ request }) => {
    const res = await request.get(`${baseURL()}/api/storymap/001-auth`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    // Story map has stories, requirements, and edges
    expect(body).toMatchObject({
      stories: expect.any(Array),
      requirements: expect.any(Array)
    });
    expect(body.stories.length).toBeGreaterThanOrEqual(1);
    for (const story of body.stories) {
      expect(story).toMatchObject({
        id: expect.any(String),
        title: expect.any(String)
      });
    }
  });

  test('GET /api/checklist/001-auth returns checklist shape', async ({ request }) => {
    const res = await request.get(`${baseURL()}/api/checklist/001-auth`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({
      files: expect.any(Array),
      gate: expect.any(Object)
    });
    expect(body.files.length).toBeGreaterThanOrEqual(1);
    for (const cl of body.files) {
      expect(cl).toMatchObject({
        name: expect.any(String),
        items: expect.any(Array),
        total: expect.any(Number),
        checked: expect.any(Number)
      });
    }
  });

  test('GET /api/testify/001-auth returns testify shape', async ({ request }) => {
    const res = await request.get(`${baseURL()}/api/testify/001-auth`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    // Testify state has requirements, testSpecs, tasks, edges, gaps, pyramid, integrity
    expect(body).toMatchObject({
      requirements: expect.any(Array),
      testSpecs: expect.any(Array),
      tasks: expect.any(Array),
      edges: expect.any(Array),
      gaps: expect.any(Object),
      pyramid: expect.any(Object),
      integrity: expect.any(Object),
      exists: expect.any(Boolean)
    });
    expect(body.requirements.length).toBeGreaterThanOrEqual(1);
    for (const req of body.requirements) {
      expect(req).toMatchObject({
        id: expect.any(String),
        text: expect.any(String)
      });
    }
  });

  test('GET /api/analyze/001-auth returns analyze shape', async ({ request }) => {
    const res = await request.get(`${baseURL()}/api/analyze/001-auth`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    const sanitised = stripVolatile(body);
    // Analyze state has healthScore, heatmap, issues, metrics, constitutionAlignment
    expect(sanitised).toMatchObject({
      healthScore: expect.any(Object),
      heatmap: expect.any(Object),
      issues: expect.any(Array),
      metrics: expect.any(Object),
      constitutionAlignment: expect.any(Array),
      exists: expect.any(Boolean)
    });
    expect(body.issues.length).toBeGreaterThanOrEqual(1);
    for (const issue of body.issues) {
      expect(issue).toMatchObject({
        id: expect.any(String),
        category: expect.any(String),
        severity: expect.any(String),
        summary: expect.any(String)
      });
    }
  });

  test('GET /api/board/001-auth returns board shape', async ({ request }) => {
    const res = await request.get(`${baseURL()}/api/board/001-auth`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    // Board has todo/in_progress/done arrays plus integrity
    expect(body).toMatchObject({
      todo: expect.any(Array),
      in_progress: expect.any(Array),
      done: expect.any(Array),
      integrity: expect.any(Object)
    });
    // At least one column should have cards
    const allCards = [...body.todo, ...body.in_progress, ...body.done];
    expect(allCards.length).toBeGreaterThanOrEqual(1);
    for (const card of allCards) {
      expect(card).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        tasks: expect.any(Array)
      });
    }
    // Integrity has status field
    expect(body.integrity).toMatchObject({
      status: expect.stringMatching(/^(valid|tampered|missing)$/)
    });
  });

  test('GET /api/planview/001-auth returns planview shape', async ({ request }) => {
    const res = await request.get(`${baseURL()}/api/planview/001-auth`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    const sanitised = stripVolatile(body);
    // Plan view has techContext, researchDecisions, fileStructure, diagram, tesslTiles
    expect(sanitised).toMatchObject({
      techContext: expect.any(Array),
      exists: expect.any(Boolean)
    });
    expect(body.techContext.length).toBeGreaterThanOrEqual(1);
  });

  test('GET /api/pipeline/nonexistent returns 404', async ({ request }) => {
    const res = await request.get(`${baseURL()}/api/pipeline/nonexistent`);
    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body).toMatchObject({ error: expect.any(String) });
  });

  test('GET /api/board/nonexistent returns 404', async ({ request }) => {
    const res = await request.get(`${baseURL()}/api/board/nonexistent`);
    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body).toMatchObject({ error: expect.any(String) });
  });
});
