'use strict';

const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');

// T024: Verify removed dependencies (TS-008)
describe('Package dependency cleanup', () => {
  let pkg;

  beforeAll(() => {
    pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf-8'));
  });

  test('express is NOT in dependencies', () => {
    expect(pkg.dependencies?.express).toBeUndefined();
  });

  test('ws is NOT in dependencies', () => {
    expect(pkg.dependencies?.ws).toBeUndefined();
  });

  test('@anthropic-ai/sdk is NOT in dependencies', () => {
    expect(pkg.dependencies?.['@anthropic-ai/sdk']).toBeUndefined();
  });
});

// T025: Verify server code removal (TS-009)
describe('Server code removal', () => {
  test('src/server.js does not exist', () => {
    expect(fs.existsSync(path.join(ROOT, 'src', 'server.js'))).toBe(false);
  });

  test('no src/ files contain require("express")', () => {
    const srcDir = path.join(ROOT, 'src');
    const srcFiles = fs.readdirSync(srcDir).filter(f => f.endsWith('.js'));
    for (const file of srcFiles) {
      const content = fs.readFileSync(path.join(srcDir, file), 'utf-8');
      expect(content).not.toMatch(/require\(['"]express['"]\)/);
    }
  });

  test('no src/ files contain require("ws")', () => {
    const srcDir = path.join(ROOT, 'src');
    const srcFiles = fs.readdirSync(srcDir).filter(f => f.endsWith('.js'));
    for (const file of srcFiles) {
      const content = fs.readFileSync(path.join(srcDir, file), 'utf-8');
      expect(content).not.toMatch(/require\(['"]ws['"]\)/);
    }
  });

  test('no src/ files contain REST route handlers', () => {
    const srcDir = path.join(ROOT, 'src');
    const srcFiles = fs.readdirSync(srcDir).filter(f => f.endsWith('.js'));
    for (const file of srcFiles) {
      const content = fs.readFileSync(path.join(srcDir, file), 'utf-8');
      expect(content).not.toMatch(/app\.get\(/);
      expect(content).not.toMatch(/app\.post\(/);
    }
  });
});

// T026: Verify pidfile management removed (TS-009)
describe('Pidfile and port scanning removal', () => {
  test('no src/ files reference dashboard.pid.json', () => {
    const srcDir = path.join(ROOT, 'src');
    const srcFiles = fs.readdirSync(srcDir).filter(f => f.endsWith('.js'));
    for (const file of srcFiles) {
      const content = fs.readFileSync(path.join(srcDir, file), 'utf-8');
      expect(content).not.toMatch(/dashboard\.pid\.json/);
    }
  });

  test('no src/ files contain port scanning logic', () => {
    const srcDir = path.join(ROOT, 'src');
    const srcFiles = fs.readdirSync(srcDir).filter(f => f.endsWith('.js'));
    for (const file of srcFiles) {
      const content = fs.readFileSync(path.join(srcDir, file), 'utf-8');
      expect(content).not.toMatch(/writePidfile|removePidfile/);
    }
  });
});
