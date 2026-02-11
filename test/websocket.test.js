const http = require('http');
const path = require('path');
const fs = require('fs');
const os = require('os');
const WebSocket = require('ws');

describe('WebSocket Integration', () => {
  let server;
  let testDir;
  let port;
  let watcher;

  beforeAll(async () => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'iikit-ws-test-'));

    const featureDir = path.join(testDir, 'specs', '001-test');
    const specifyDir = path.join(testDir, '.specify');
    fs.mkdirSync(featureDir, { recursive: true });
    fs.mkdirSync(specifyDir, { recursive: true });

    fs.writeFileSync(path.join(featureDir, 'spec.md'), `
### User Story 1 - Test Feature (Priority: P1)

Description.
`);

    fs.writeFileSync(path.join(featureDir, 'tasks.md'), `# Tasks
- [ ] T001 [US1] First task
- [ ] T002 [US1] Second task
`);

    fs.writeFileSync(path.join(specifyDir, 'context.json'), '{}');

    const { createServer } = require('../src/server');
    const result = await createServer({ projectPath: testDir, port: 0 });
    server = result.server;
    port = result.port;
    watcher = result.watcher;
  });

  afterAll(async () => {
    if (watcher) await watcher.close();
    if (server) await new Promise(r => server.close(r));
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  // TS-013: WebSocket pushes board update on file change
  test('receives board_update when subscribing to a feature', (done) => {
    const ws = new WebSocket(`ws://localhost:${port}`);

    ws.on('open', () => {
      ws.send(JSON.stringify({ type: 'subscribe', feature: '001-test' }));
    });

    ws.on('message', (raw) => {
      const msg = JSON.parse(raw);
      expect(msg.type).toBe('board_update');
      expect(msg.feature).toBe('001-test');
      expect(msg.board).toBeDefined();
      expect(msg.board.todo).toBeDefined();
      expect(msg.board.in_progress).toBeDefined();
      expect(msg.board.done).toBeDefined();

      // US1 should be in todo (both tasks unchecked)
      expect(msg.board.todo).toHaveLength(1);
      expect(msg.board.todo[0].id).toBe('US1');
      expect(msg.board.todo[0].progress).toBe('0/2');

      ws.close();
      done();
    });

    ws.on('error', done);
  });

  test('pushes board_update when tasks.md changes on disk', (done) => {
    const ws = new WebSocket(`ws://localhost:${port}`);
    let messageCount = 0;

    ws.on('open', () => {
      ws.send(JSON.stringify({ type: 'subscribe', feature: '001-test' }));
    });

    ws.on('message', (raw) => {
      const msg = JSON.parse(raw);
      messageCount++;

      if (messageCount === 1) {
        // First message is the initial board state from subscribe
        expect(msg.type).toBe('board_update');

        // Now modify tasks.md to check off first task
        setTimeout(() => {
          const tasksPath = path.join(testDir, 'specs', '001-test', 'tasks.md');
          fs.writeFileSync(tasksPath, `# Tasks
- [x] T001 [US1] First task
- [ ] T002 [US1] Second task
`);
        }, 100);
      }

      if (messageCount === 2) {
        // Second message should be triggered by file change
        // Could be board_update or features_update
        if (msg.type === 'board_update') {
          // US1 should now be in in_progress
          expect(msg.board.in_progress).toHaveLength(1);
          expect(msg.board.in_progress[0].id).toBe('US1');
          expect(msg.board.in_progress[0].progress).toBe('1/2');
          ws.close();
          done();
        }
      }

      if (messageCount === 3) {
        // Could be features_update after board_update
        if (msg.type === 'board_update') {
          expect(msg.board.in_progress).toHaveLength(1);
          ws.close();
          done();
        }
      }
    });

    ws.on('error', done);
  }, 15000); // Extended timeout for file watcher debounce
});
