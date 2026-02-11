'use strict';

const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');
const { parseSpecStories, parseTasks } = require('./parser');
const { computeBoardState } = require('./board');
const { computeAssertionHash, checkIntegrity } = require('./integrity');
const { computePipelineState } = require('./pipeline');

/**
 * List features from specs/ directory.
 * A feature is a directory under specs/ that contains tasks.md.
 */
function listFeatures(projectPath) {
  const specsDir = path.join(projectPath, 'specs');
  if (!fs.existsSync(specsDir)) return [];

  const entries = fs.readdirSync(specsDir, { withFileTypes: true });
  const features = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const featureDir = path.join(specsDir, entry.name);
    const tasksPath = path.join(featureDir, 'tasks.md');
    const specPath = path.join(featureDir, 'spec.md');

    if (!fs.existsSync(tasksPath)) continue;

    // Parse to get summary info
    const specContent = fs.existsSync(specPath) ? fs.readFileSync(specPath, 'utf-8') : '';
    const tasksContent = fs.readFileSync(tasksPath, 'utf-8');
    const stories = parseSpecStories(specContent);
    const tasks = parseTasks(tasksContent);

    const checkedCount = tasks.filter(t => t.checked).length;
    const totalCount = tasks.length;

    // Convert id to human-readable name: "001-kanban-board" -> "Kanban Board"
    const namePart = entry.name.replace(/^\d+-/, '');
    const name = namePart.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    features.push({
      id: entry.name,
      name,
      stories: stories.length,
      progress: `${checkedCount}/${totalCount}`
    });
  }

  return features;
}

/**
 * Get board state for a specific feature.
 */
function getBoardState(projectPath, featureId) {
  const featureDir = path.join(projectPath, 'specs', featureId);
  if (!fs.existsSync(featureDir)) return null;

  const specPath = path.join(featureDir, 'spec.md');
  const tasksPath = path.join(featureDir, 'tasks.md');
  const testSpecsPath = path.join(featureDir, 'tests', 'test-specs.md');
  const contextPath = path.join(featureDir, 'context.json');

  const specContent = fs.existsSync(specPath) ? fs.readFileSync(specPath, 'utf-8') : '';
  const tasksContent = fs.existsSync(tasksPath) ? fs.readFileSync(tasksPath, 'utf-8') : '';

  const stories = parseSpecStories(specContent);
  const tasks = parseTasks(tasksContent);
  const board = computeBoardState(stories, tasks);

  // Integrity check
  let integrity = { status: 'missing', currentHash: null, storedHash: null };
  if (fs.existsSync(testSpecsPath)) {
    const testSpecsContent = fs.readFileSync(testSpecsPath, 'utf-8');
    const currentHash = computeAssertionHash(testSpecsContent);

    let storedHash = null;
    if (fs.existsSync(contextPath)) {
      try {
        const context = JSON.parse(fs.readFileSync(contextPath, 'utf-8'));
        storedHash = context?.testify?.assertion_hash || null;
      } catch {
        // malformed context.json
      }
    }

    integrity = checkIntegrity(currentHash, storedHash);
  }

  return { ...board, integrity };
}

/**
 * Create and configure the Express server with WebSocket support.
 *
 * @param {Object} options
 * @param {string} options.projectPath - Path to the project directory
 * @param {number} [options.port=3000] - Port to listen on (0 for random)
 * @returns {Promise<{server: http.Server, port: number, wss: WebSocketServer}>}
 */
function createServer({ projectPath, port = 3000 }) {
  const app = express();

  // Serve static files from src/public
  app.use(express.static(path.join(__dirname, 'public')));

  // API: list features
  app.get('/api/features', (req, res) => {
    try {
      const features = listFeatures(projectPath);
      res.json(features);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // API: pipeline state for a feature
  app.get('/api/pipeline/:feature', (req, res) => {
    try {
      const featureDir = path.join(projectPath, 'specs', req.params.feature);
      if (!fs.existsSync(featureDir)) {
        return res.status(404).json({ error: 'Feature not found' });
      }
      const pipeline = computePipelineState(projectPath, req.params.feature);
      res.json(pipeline);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // API: board state for a feature
  app.get('/api/board/:feature', (req, res) => {
    try {
      const board = getBoardState(projectPath, req.params.feature);
      if (!board) {
        return res.status(404).json({ error: 'Feature not found' });
      }
      res.json(board);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });

  // Track connected clients and their current feature
  wss.on('connection', (ws) => {
    ws.currentFeature = null;

    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw);
        if (msg.type === 'subscribe' && msg.feature) {
          ws.currentFeature = msg.feature;
          // Send initial board state
          const board = getBoardState(projectPath, msg.feature);
          if (board) {
            ws.send(JSON.stringify({ type: 'board_update', feature: msg.feature, board }));
          }
        }
      } catch {
        // ignore malformed messages
      }
    });
  });

  // File watcher with 300ms debounce
  let debounceTimer = null;
  const constitutionPath = path.join(projectPath, 'CONSTITUTION.md');
  const watchPaths = [
    path.join(projectPath, 'specs'),
    path.join(projectPath, '.specify'),
    ...(fs.existsSync(constitutionPath) ? [constitutionPath] : [])
  ].filter(p => fs.existsSync(p));

  let watcher = null;
  if (watchPaths.length > 0) {
    watcher = chokidar.watch(watchPaths, {
      ignoreInitial: true,
      awaitWriteFinish: { stabilityThreshold: 200, pollInterval: 50 }
    });

    watcher.on('all', () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        // Push updates to all connected clients
        for (const ws of wss.clients) {
          if (ws.readyState === 1 && ws.currentFeature) {
            try {
              const board = getBoardState(projectPath, ws.currentFeature);
              if (board) {
                ws.send(JSON.stringify({
                  type: 'board_update',
                  feature: ws.currentFeature,
                  board
                }));
              }
              const pipeline = computePipelineState(projectPath, ws.currentFeature);
              if (pipeline) {
                ws.send(JSON.stringify({
                  type: 'pipeline_update',
                  feature: ws.currentFeature,
                  pipeline
                }));
              }
            } catch {
              // ignore errors during push
            }
          }
        }

        // Also push features_update
        try {
          const features = listFeatures(projectPath);
          const msg = JSON.stringify({ type: 'features_update', features });
          for (const ws of wss.clients) {
            if (ws.readyState === 1) {
              ws.send(msg);
            }
          }
        } catch {
          // ignore
        }
      }, 300);
    });
  }

  return new Promise((resolve) => {
    server.listen(port, () => {
      const actualPort = server.address().port;
      resolve({ server, port: actualPort, wss, watcher });
    });
  });
}

module.exports = { createServer, listFeatures, getBoardState };
