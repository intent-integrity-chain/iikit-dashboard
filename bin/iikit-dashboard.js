#!/usr/bin/env node
'use strict';

const path = require('path');
const { execFileSync } = require('child_process');

const args = process.argv.slice(2);
let projectPath = '.';
let watch = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--watch' || args[i] === '-w') {
    watch = true;
  } else if (args[i] === '--path' && args[i + 1]) {
    projectPath = args[i + 1];
    i++;
  } else if (!args[i].startsWith('--')) {
    projectPath = args[i];
  }
}

const generatorPath = path.join(__dirname, '..', 'src', 'generate-dashboard.js');
const generatorArgs = [generatorPath, projectPath];
if (watch) generatorArgs.push('--watch');

try {
  execFileSync(process.execPath, generatorArgs, { stdio: 'inherit' });
} catch (err) {
  process.exit(err.status || 1);
}
