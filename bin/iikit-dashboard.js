#!/usr/bin/env node
'use strict';

const path = require('path');
const { createServer } = require('../src/server');

// Parse arguments
const args = process.argv.slice(2);
let projectPath = process.cwd();
let port = 3000;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--path' && args[i + 1]) {
    projectPath = path.resolve(args[i + 1]);
    i++;
  } else if (args[i] === '--port' && args[i + 1]) {
    port = parseInt(args[i + 1], 10);
    i++;
  } else if (!args[i].startsWith('--')) {
    // Positional argument = project path
    projectPath = path.resolve(args[i]);
  }
}

async function main() {
  console.log(`\n  IIKit Dashboard`);
  console.log(`  ===============\n`);
  console.log(`  Project: ${projectPath}`);

  try {
    const result = await createServer({ projectPath, port });
    const url = `http://localhost:${result.port}`;
    console.log(`  Server:  ${url}`);
    console.log(`\n  Open your browser to view the dashboard.\n`);

    // Try to open browser (best effort, don't fail if it doesn't work)
    try {
      const { exec } = require('child_process');
      const cmd = process.platform === 'darwin' ? 'open' :
                  process.platform === 'win32' ? 'start' : 'xdg-open';
      exec(`${cmd} ${url}`);
    } catch {
      // Ignore browser open errors
    }

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n  Shutting down...');
      result.server.close(() => {
        if (result.watcher) result.watcher.close();
        process.exit(0);
      });
    });

    process.on('SIGTERM', () => {
      result.server.close(() => {
        if (result.watcher) result.watcher.close();
        process.exit(0);
      });
    });

  } catch (err) {
    console.error(`  Error: ${err.message}`);
    process.exit(1);
  }
}

main();
