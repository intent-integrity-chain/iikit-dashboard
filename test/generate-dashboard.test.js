'use strict';

const path = require('path');
const fs = require('fs');
const os = require('os');

// --- Compute module smoke tests (Phase 2: Foundational) ---

describe('Compute module smoke tests', () => {
  let tmpDir;

  beforeAll(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'iikit-smoke-'));
    // Minimal project structure
    fs.mkdirSync(path.join(tmpDir, 'specs', '001-test-feature', 'tests'), { recursive: true });
    fs.writeFileSync(path.join(tmpDir, 'specs', '001-test-feature', 'spec.md'), '# Spec\n');
    fs.writeFileSync(path.join(tmpDir, 'specs', '001-test-feature', 'tasks.md'), '# Tasks\n- [ ] T001 A task\n');
    fs.writeFileSync(path.join(tmpDir, 'CONSTITUTION.md'), '# Constitution\n## Core Principles\n### I. Test-First\nTDD required.\n');
    fs.writeFileSync(path.join(tmpDir, 'PREMISE.md'), '# Premise\n');
  });

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('parser exports parse functions', () => {
    const parser = require('../src/parser');
    expect(typeof parser.parseSpecStories).toBe('function');
    expect(typeof parser.parseTasks).toBe('function');
    expect(typeof parser.parseConstitutionPrinciples).toBe('function');
    expect(typeof parser.parsePremise).toBe('function');
  });

  test('board exports computeBoardState', () => {
    const { computeBoardState } = require('../src/board');
    expect(typeof computeBoardState).toBe('function');
    const result = computeBoardState([], []);
    expect(result).toBeDefined();
  });

  test('pipeline exports computePipelineState', () => {
    const { computePipelineState } = require('../src/pipeline');
    expect(typeof computePipelineState).toBe('function');
    const result = computePipelineState(tmpDir, '001-test-feature');
    expect(result).toBeDefined();
  });

  test('storymap exports computeStoryMapState', () => {
    const { computeStoryMapState } = require('../src/storymap');
    expect(typeof computeStoryMapState).toBe('function');
    const result = computeStoryMapState(tmpDir, '001-test-feature');
    expect(result).toBeDefined();
  });

  test('planview exports computePlanViewState', async () => {
    const { computePlanViewState } = require('../src/planview');
    expect(typeof computePlanViewState).toBe('function');
    const result = await computePlanViewState(tmpDir, '001-test-feature');
    expect(result).toBeDefined();
  });

  test('checklist exports computeChecklistViewState', () => {
    const { computeChecklistViewState } = require('../src/checklist');
    expect(typeof computeChecklistViewState).toBe('function');
    const result = computeChecklistViewState(tmpDir, '001-test-feature');
    expect(result).toBeDefined();
  });

  test('testify exports computeTestifyState', () => {
    const { computeTestifyState } = require('../src/testify');
    expect(typeof computeTestifyState).toBe('function');
    const result = computeTestifyState(tmpDir, '001-test-feature');
    expect(result).toBeDefined();
  });

  test('analyze exports computeAnalyzeState', () => {
    const { computeAnalyzeState } = require('../src/analyze');
    expect(typeof computeAnalyzeState).toBe('function');
    const result = computeAnalyzeState(tmpDir, '001-test-feature');
    expect(result).toBeDefined();
  });

  test('integrity exports computeAssertionHash and checkIntegrity', () => {
    const { computeAssertionHash, checkIntegrity } = require('../src/integrity');
    expect(typeof computeAssertionHash).toBe('function');
    expect(typeof checkIntegrity).toBe('function');
    const hash = computeAssertionHash('**Given**: a project\n**When**: run\n**Then**:\n- result\n');
    expect(typeof hash).toBe('string');
    expect(hash.length).toBe(64); // SHA-256 hex
    const result = checkIntegrity(hash, hash);
    expect(result).toBeDefined();
    expect(result.status).toBe('valid');
  });

  test('bugs exports computeBugsState', () => {
    const { computeBugsState } = require('../src/bugs');
    expect(typeof computeBugsState).toBe('function');
    const result = computeBugsState(tmpDir, '001-test-feature');
    expect(result).toBeDefined();
  });
});
