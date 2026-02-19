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

function url() {
  return `http://localhost:${port}`;
}

/**
 * Set up network tracking on a page. Intercepts all /api/* requests and
 * records their paths. Returns an object with helpers to inspect captured requests.
 */
function trackRequests(page) {
  const requests = [];

  page.on('request', (req) => {
    const reqUrl = new URL(req.url());
    if (reqUrl.pathname.startsWith('/api/')) {
      requests.push({
        method: req.method(),
        path: reqUrl.pathname,
        timestamp: Date.now()
      });
    }
  });

  return {
    /** All recorded request paths */
    paths() {
      return requests.map(r => r.path);
    },
    /** Unique request paths */
    uniquePaths() {
      return [...new Set(requests.map(r => r.path))];
    },
    /** Clear the captured list */
    clear() {
      requests.length = 0;
    },
    /** Get raw request records */
    all() {
      return [...requests];
    },
    /** Count of requests matching a path pattern */
    countMatching(pattern) {
      return requests.filter(r => r.path.match(pattern)).length;
    }
  };
}

async function waitForDashboard(page) {
  await page.goto(url());
  await page.waitForSelector('.pipeline-node', { timeout: 10000 });
  await page.waitForSelector('#contentArea:not(:empty)', { timeout: 10000 });
  await page.waitForTimeout(500);
}

async function switchToTab(page, phaseName) {
  const node = page.locator('.pipeline-node', { hasText: phaseName });
  await node.click();
  await page.waitForTimeout(800);
}

test.describe('Network Requests', () => {

  test('initial page load fetches required endpoints', async ({ page }) => {
    const tracker = trackRequests(page);

    await waitForDashboard(page);
    // Allow any remaining async fetches to settle
    await page.waitForTimeout(500);

    const paths = tracker.uniquePaths();

    // Must fetch meta, features, and at least one feature-specific endpoint
    expect(paths).toContain('/api/meta');
    expect(paths).toContain('/api/features');

    // After features load, the first feature's pipeline and board are fetched
    // Default feature is 002-payments (newest-first sorting)
    const hasPipeline = paths.some(p => p.match(/^\/api\/pipeline\//));
    const hasBoard = paths.some(p => p.match(/^\/api\/board\//));
    expect(hasPipeline).toBe(true);
    expect(hasBoard).toBe(true);
  });

  test('switching to Checklist tab fetches /api/checklist/:feature', async ({ page }) => {
    const tracker = trackRequests(page);

    await waitForDashboard(page);
    // Select 001-auth for richer data
    await page.selectOption('#featureSelect', { index: 1 });
    await page.waitForTimeout(500);

    // Clear tracker to only capture tab-switch requests
    tracker.clear();

    await switchToTab(page, 'Checklist');
    await page.waitForTimeout(500);

    const paths = tracker.paths();
    const hasChecklist = paths.some(p => p.match(/^\/api\/checklist\/001-auth$/));
    expect(hasChecklist).toBe(true);
  });

  test('switching to Testify tab fetches /api/testify/:feature', async ({ page }) => {
    const tracker = trackRequests(page);

    await waitForDashboard(page);
    await page.selectOption('#featureSelect', { index: 1 });
    await page.waitForTimeout(500);

    tracker.clear();

    await switchToTab(page, 'Testify');
    await page.waitForTimeout(500);

    const paths = tracker.paths();
    const hasTestify = paths.some(p => p.match(/^\/api\/testify\/001-auth$/));
    expect(hasTestify).toBe(true);
  });

  test('switching to Analyze tab fetches /api/analyze/:feature', async ({ page }) => {
    const tracker = trackRequests(page);

    await waitForDashboard(page);
    await page.selectOption('#featureSelect', { index: 1 });
    await page.waitForTimeout(500);

    tracker.clear();

    await switchToTab(page, 'Analyze');
    await page.waitForTimeout(500);

    const paths = tracker.paths();
    const hasAnalyze = paths.some(p => p.match(/^\/api\/analyze\/001-auth$/));
    expect(hasAnalyze).toBe(true);
  });

  test('switching to Spec tab fetches /api/storymap/:feature', async ({ page }) => {
    const tracker = trackRequests(page);

    await waitForDashboard(page);
    await page.selectOption('#featureSelect', { index: 1 });
    await page.waitForTimeout(500);

    tracker.clear();

    await switchToTab(page, 'Spec');
    await page.waitForTimeout(500);

    const paths = tracker.paths();
    const hasStorymap = paths.some(p => p.match(/^\/api\/storymap\/001-auth$/));
    expect(hasStorymap).toBe(true);
  });

  test('switching to Constitution tab fetches /api/constitution', async ({ page }) => {
    const tracker = trackRequests(page);

    await waitForDashboard(page);

    tracker.clear();

    await switchToTab(page, 'Constitution');
    await page.waitForTimeout(500);

    const paths = tracker.paths();
    const hasConstitution = paths.some(p => p === '/api/constitution');
    expect(hasConstitution).toBe(true);
  });

  test('switching to Plan tab fetches /api/planview/:feature', async ({ page }) => {
    const tracker = trackRequests(page);

    await waitForDashboard(page);
    await page.selectOption('#featureSelect', { index: 1 });
    await page.waitForTimeout(500);

    tracker.clear();

    await switchToTab(page, 'Plan');
    await page.waitForTimeout(1000);

    const paths = tracker.paths();
    const hasPlanview = paths.some(p => p.match(/^\/api\/planview\/001-auth$/));
    expect(hasPlanview).toBe(true);
  });

  test('switching features re-fetches pipeline and board for new feature', async ({ page }) => {
    const tracker = trackRequests(page);

    await waitForDashboard(page);
    await page.waitForTimeout(500);

    // Clear to only track feature-switch requests
    tracker.clear();

    // Switch to 001-auth (index 1)
    await page.selectOption('#featureSelect', { index: 1 });
    await page.waitForTimeout(1000);

    const paths = tracker.paths();

    // Should fetch pipeline and board for the new feature
    const hasPipeline = paths.some(p => p === '/api/pipeline/001-auth');
    const hasBoard = paths.some(p => p === '/api/board/001-auth');
    expect(hasPipeline).toBe(true);
    expect(hasBoard).toBe(true);
  });

  test('no duplicate initial requests for the same endpoint', async ({ page }) => {
    const tracker = trackRequests(page);

    await waitForDashboard(page);
    await page.waitForTimeout(500);

    // Check that /api/meta and /api/features are each fetched exactly once
    const metaCount = tracker.countMatching(/^\/api\/meta$/);
    const featuresCount = tracker.countMatching(/^\/api\/features$/);
    expect(metaCount).toBe(1);
    expect(featuresCount).toBe(1);
  });

  test('revisiting a tab does not re-fetch if data is cached', async ({ page }) => {
    const tracker = trackRequests(page);

    await waitForDashboard(page);
    await page.selectOption('#featureSelect', { index: 1 });
    await page.waitForTimeout(500);

    // Visit Constitution tab (first time: should fetch)
    await switchToTab(page, 'Constitution');
    await page.waitForTimeout(500);
    const firstCount = tracker.countMatching(/^\/api\/constitution$/);

    // Switch away and back
    await switchToTab(page, 'Implement');
    await page.waitForTimeout(500);

    await switchToTab(page, 'Constitution');
    await page.waitForTimeout(500);
    const secondCount = tracker.countMatching(/^\/api\/constitution$/);

    // Constitution data is cached after first fetch, so count should not increase
    expect(secondCount).toBe(firstCount);
  });
});
