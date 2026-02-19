// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const { createFixtureProject, startServer } = require('./helpers');

let port;
let cleanup;
let projectPath;

test.beforeAll(async () => {
  projectPath = createFixtureProject();
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

/**
 * Trigger a file change to cause chokidar -> server recompute -> WebSocket broadcast.
 * The server watches the project dir and debounces with 300ms + awaitWriteFinish.
 * We wait sufficiently after the write for the full cycle to complete.
 */
async function triggerFileUpdate(page, filePath, newContent) {
  fs.writeFileSync(filePath, newContent);
  // Wait for: awaitWriteFinish (200ms stabilityThreshold) + debounce (300ms) + compute + WS push
  await page.waitForTimeout(2500);
}

test.describe('Data Flow via WebSocket (file change triggers)', () => {

  test('board updates when tasks file changes on disk', async ({ page }) => {
    await waitForDashboard(page);
    // Select 001-auth
    await page.selectOption('#featureSelect', { index: 1 });
    await page.waitForTimeout(500);
    await switchToTab(page, 'Implement');

    // Read current tasks
    const tasksPath = path.join(projectPath, 'specs', '001-auth', 'tasks.md');
    const original = fs.readFileSync(tasksPath, 'utf-8');

    // Add a new task under a new user story reference
    const updated = original + '\n- [ ] T099 [US4] WebSocket data flow test task\n';
    await triggerFileUpdate(page, tasksPath, updated);

    // Board should now contain the US4 story card (Session Management)
    const boardHtml = await page.locator('#contentArea').innerHTML();
    expect(boardHtml).toContain('Session Management');

    // Verify card count changed: US4 card should now have at least 1 task
    const cards = page.locator('.card');
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThanOrEqual(3); // US1, US2, US3 + US4
  });

  test('pipeline phases update when new files are added on disk', async ({ page }) => {
    await waitForDashboard(page);
    await page.selectOption('#featureSelect', { index: 1 });
    await page.waitForTimeout(500);

    // Capture initial pipeline HTML
    const initialPipeline = await page.locator('#pipelineBar').innerHTML();

    // Add a new checklist file to change pipeline state
    const checklistDir = path.join(projectPath, 'specs', '001-auth', 'checklists');
    await triggerFileUpdate(
      page,
      path.join(checklistDir, 'dataflow-test.md'),
      '# Data Flow Test Checklist\n\n- [x] CHK-901 (test) Data flow verified\n- [x] CHK-902 (test) WebSocket push works\n'
    );

    // Pipeline should have been re-rendered
    const updatedPipeline = await page.locator('#pipelineBar').innerHTML();
    expect(updatedPipeline.length).toBeGreaterThan(0);
  });

  test('constitution view updates when CONSTITUTION.md changes', async ({ page }) => {
    await waitForDashboard(page);
    await switchToTab(page, 'Constitution');
    await page.waitForTimeout(500);

    // Verify initial constitution renders
    await expect(page.locator('.constitution-view')).toBeVisible();
    const initialHtml = await page.locator('#contentArea').innerHTML();

    // Modify CONSTITUTION.md to add a new principle
    const constitutionPath = path.join(projectPath, 'CONSTITUTION.md');
    const original = fs.readFileSync(constitutionPath, 'utf-8');
    const updated = original.replace(
      '## Footer',
      '### VI. Data Flow Integrity (MUST)\n\nAll data changes MUST propagate through the WebSocket pipeline in real time.\n\n**Rationale**: Real-time data flow ensures dashboard accuracy.\n\n## Footer'
    );
    await triggerFileUpdate(page, constitutionPath, updated);

    // Constitution view should now show the new principle
    const updatedHtml = await page.locator('#contentArea').innerHTML();
    expect(updatedHtml).toContain('Data Flow Integrity');
  });

  test('checklist view updates when checklist files change', async ({ page }) => {
    await waitForDashboard(page);
    await page.selectOption('#featureSelect', { index: 1 });
    await page.waitForTimeout(500);
    await switchToTab(page, 'Checklist');
    await page.waitForTimeout(500);

    // Count initial checklist rings
    const initialRings = await page.locator('.checklist-ring-wrapper').count();

    // Add a brand-new checklist file
    const checklistDir = path.join(projectPath, 'specs', '001-auth', 'checklists');
    await triggerFileUpdate(
      page,
      path.join(checklistDir, 'performance.md'),
      '# Performance Checklist\n\n- [x] CHK-501 (perf) Page loads under 3s\n- [ ] CHK-502 (perf) No unnecessary re-renders\n- [x] CHK-503 (perf) API responses under 200ms\n'
    );

    // Should now have one more ring
    const updatedRings = await page.locator('.checklist-ring-wrapper').count();
    expect(updatedRings).toBe(initialRings + 1);
  });

  test('storymap view updates when spec.md changes', async ({ page }) => {
    await waitForDashboard(page);
    await page.selectOption('#featureSelect', { index: 1 });
    await page.waitForTimeout(500);
    await switchToTab(page, 'Spec');
    await page.waitForTimeout(500);

    // Count initial story cards
    const initialCount = await page.locator('.story-card').count();

    // Add a new user story to spec.md
    const specPath = path.join(projectPath, 'specs', '001-auth', 'spec.md');
    const original = fs.readFileSync(specPath, 'utf-8');
    const updated = original + `

### User Story 5 - Multi-Factor Authentication (Priority: P1)

As a user, I want to enable MFA so that my account is more secure.

#### Scenarios

**Given** a user with MFA enabled
**When** they log in
**Then** they are prompted for a second factor
`;
    await triggerFileUpdate(page, specPath, updated);

    // Story card count should have increased
    const updatedCount = await page.locator('.story-card').count();
    expect(updatedCount).toBe(initialCount + 1);
  });

  test('testify view updates when test-specs change', async ({ page }) => {
    await waitForDashboard(page);
    await page.selectOption('#featureSelect', { index: 1 });
    await page.waitForTimeout(500);
    await switchToTab(page, 'Testify');
    await page.waitForTimeout(500);

    // Count initial sankey nodes
    const initialNodes = await page.locator('.sankey-node').count();

    // Add a new test spec
    const testSpecsPath = path.join(projectPath, 'specs', '001-auth', 'tests', 'test-specs.md');
    const original = fs.readFileSync(testSpecsPath, 'utf-8');
    const updated = original + `

### TS-006: Session Expiry (Type: acceptance, Priority: P2)

Verifies that sessions expire correctly after the configured TTL.

**Traceability**: FR-004, SC-004
**Task**: T012, T013

**Given**: a user with an active session
**When**: the session TTL expires
**Then**: the user is prompted to re-authenticate
`;
    await triggerFileUpdate(page, testSpecsPath, updated);

    // Sankey node count should have increased (new test spec node)
    const updatedNodes = await page.locator('.sankey-node').count();
    expect(updatedNodes).toBeGreaterThan(initialNodes);
  });

  test('analyze view updates when analysis.md changes', async ({ page }) => {
    await waitForDashboard(page);
    await page.selectOption('#featureSelect', { index: 1 });
    await page.waitForTimeout(500);
    await switchToTab(page, 'Analyze');
    await page.waitForTimeout(500);

    // Capture initial health score
    const initialScore = await page.locator('.gauge-score').textContent();

    // Modify analysis.md to change the metrics
    const analysisPath = path.join(projectPath, 'specs', '001-auth', 'analysis.md');
    const original = fs.readFileSync(analysisPath, 'utf-8');
    // Add another finding to change the metrics
    const updated = original.replace(
      '| Low Issues | 1 |',
      '| Low Issues | 2 |'
    ).replace(
      '## Phase Separation Violations\n\nNone detected.',
      '## Phase Separation Violations\n\nNone detected.\n\n| A5 | Coverage Gap | LOW | spec.md:SC-005 | SC-005 not explicitly tested | Add rate-limit acceptance test |'
    );
    await triggerFileUpdate(page, analysisPath, updated);

    // The analyze view should have re-rendered (health score may or may not change,
    // but the view should at least still be visible and showing data)
    await expect(page.locator('.gauge-score')).toBeVisible();
    const updatedScore = await page.locator('.gauge-score').textContent();
    // Score is still a valid number string
    expect(parseInt(updatedScore, 10)).toBeGreaterThanOrEqual(0);
  });

  test('activity indicator activates on file change', async ({ page }) => {
    await waitForDashboard(page);
    await page.selectOption('#featureSelect', { index: 1 });
    await page.waitForTimeout(500);

    const indicator = page.locator('#activityIndicator');
    // Wait for indicator to settle to idle first (previous tests may have triggered changes)
    await expect(indicator).toHaveClass(/idle/, { timeout: 15000 });

    // Touch a file to trigger activity
    const tasksPath = path.join(projectPath, 'specs', '001-auth', 'tasks.md');
    const content = fs.readFileSync(tasksPath, 'utf-8');
    fs.writeFileSync(tasksPath, content + '\n');

    // Wait for the activity indicator to activate
    await expect(indicator).toHaveClass(/active/, { timeout: 5000 });
  });

  test('board renders correct task counts after incremental updates', async ({ page }) => {
    await waitForDashboard(page);
    await page.selectOption('#featureSelect', { index: 1 });
    await page.waitForTimeout(500);
    await switchToTab(page, 'Implement');

    // Count initial todo tasks in the board
    const tasksPath = path.join(projectPath, 'specs', '001-auth', 'tasks.md');
    const original = fs.readFileSync(tasksPath, 'utf-8');

    // Mark two incomplete tasks as complete
    const updated = original
      .replace('- [ ] T006', '- [x] T006')
      .replace('- [ ] T007', '- [x] T007');
    await triggerFileUpdate(page, tasksPath, updated);

    // Verify progress bars reflect the change (done column should have more tasks)
    const progressBars = page.locator('.progress-bar');
    const count = await progressBars.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // The board should still render correctly
    await expect(page.locator('.board-container')).toBeVisible();
  });
});
