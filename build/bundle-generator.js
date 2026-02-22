'use strict';

const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

async function bundle() {
  const distDir = path.join(__dirname, '..', 'dist');
  const outfile = path.join(distDir, 'generate-dashboard.js');

  const result = await esbuild.build({
    entryPoints: [path.join(__dirname, '..', 'src', 'generate-dashboard.js')],
    bundle: true,
    platform: 'node',
    target: 'node18',
    outfile,
    external: ['chokidar'],
    format: 'cjs'
  });

  if (result.errors.length > 0) {
    console.error('Bundle failed:', result.errors);
    process.exit(1);
  }

  // Copy index.html to dist/public/ so the bundled generator can find it
  const srcHtml = path.join(__dirname, '..', 'src', 'public', 'index.html');
  const destDir = path.join(distDir, 'public');
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(srcHtml, path.join(destDir, 'index.html'));

  console.log('Bundle complete: dist/generate-dashboard.js');
}

bundle();
