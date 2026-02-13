'use strict';

const { computePlanViewState, classifyNodeTypes } = require('../src/planview');
const fs = require('fs');
const path = require('path');
const os = require('os');

describe('computePlanViewState', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'planview-test-'));
    fs.mkdirSync(path.join(tmpDir, 'specs', '001-test-feature'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  // TS-021: returns exists:false when no plan.md
  test('returns exists false when plan.md missing', async () => {
    const result = await computePlanViewState(tmpDir, '001-test-feature');
    expect(result.exists).toBe(false);
    expect(result.techContext).toEqual([]);
    expect(result.fileStructure).toBeNull();
    expect(result.diagram).toBeNull();
    expect(result.tesslTiles).toEqual([]);
  });

  // TS-001, TS-002, TS-023: techContext from plan.md
  test('extracts techContext from plan.md Technical Context', async () => {
    const planContent = `# Plan

## Technical Context

**Language/Version**: Node.js 20+ (LTS)
**Primary Dependencies**: Express, ws, chokidar
**Testing**: Jest

## Constitution Check
`;
    fs.writeFileSync(path.join(tmpDir, 'specs', '001-test-feature', 'plan.md'), planContent);
    const result = await computePlanViewState(tmpDir, '001-test-feature');
    expect(result.exists).toBe(true);
    expect(result.techContext).toHaveLength(3);
    expect(result.techContext[0]).toEqual({ label: 'Language/Version', value: 'Node.js 20+ (LTS)' });
  });

  // TS-004, TS-024: fileStructure from plan.md
  test('extracts fileStructure with exists boolean', async () => {
    // Create a real file so exists check works
    fs.mkdirSync(path.join(tmpDir, 'src'), { recursive: true });
    fs.writeFileSync(path.join(tmpDir, 'src', 'server.js'), '');

    const planContent = `# Plan

## File Structure

\`\`\`
myproject/
├── src/
│   ├── server.js          # Express server
│   └── newfile.js
\`\`\`
`;
    fs.writeFileSync(path.join(tmpDir, 'specs', '001-test-feature', 'plan.md'), planContent);
    const result = await computePlanViewState(tmpDir, '001-test-feature');
    expect(result.fileStructure).not.toBeNull();
    expect(result.fileStructure.rootName).toBe('myproject');

    const serverEntry = result.fileStructure.entries.find(e => e.name === 'server.js');
    expect(serverEntry.exists).toBe(true);

    const newfileEntry = result.fileStructure.entries.find(e => e.name === 'newfile.js');
    expect(newfileEntry.exists).toBe(false);
  });

  // TS-008, TS-025: diagram null when no Architecture Overview
  test('diagram is null when no ASCII diagram', async () => {
    const planContent = `# Plan

## Technical Context

**Language/Version**: Node.js 20+

## File Structure

\`\`\`
myproject/
├── index.js
\`\`\`
`;
    fs.writeFileSync(path.join(tmpDir, 'specs', '001-test-feature', 'plan.md'), planContent);
    const result = await computePlanViewState(tmpDir, '001-test-feature');
    expect(result.diagram).toBeNull();
  });

  // TS-026: tesslTiles from tessl.json
  test('reads tessl tiles from project root tessl.json', async () => {
    fs.writeFileSync(path.join(tmpDir, 'tessl.json'), JSON.stringify({
      dependencies: { 'tessl/npm-express': { version: '5.1.0' } }
    }));
    fs.writeFileSync(path.join(tmpDir, 'specs', '001-test-feature', 'plan.md'), '## Technical Context\n\n**Language**: Node.js\n');

    const result = await computePlanViewState(tmpDir, '001-test-feature');
    expect(result.tesslTiles).toHaveLength(1);
    expect(result.tesslTiles[0]).toEqual({ name: 'tessl/npm-express', version: '5.1.0', eval: null });
  });
});

// TS-039, TS-040: classifyNodeTypes fallback
describe('classifyNodeTypes', () => {
  test('returns all default when no API key', async () => {
    const origKey = process.env.ANTHROPIC_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;

    const result = await classifyNodeTypes(['Browser', 'Server']);
    expect(result['Browser']).toBe('default');
    expect(result['Server']).toBe('default');

    if (origKey) process.env.ANTHROPIC_API_KEY = origKey;
  });

  test('returns all default for empty labels', async () => {
    const result = await classifyNodeTypes([]);
    expect(result).toEqual({});
  });
});
