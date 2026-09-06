'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const outputArgIndex = process.argv.indexOf('--out');
const outputDir = path.resolve(root, outputArgIndex >= 0 && process.argv[outputArgIndex + 1] ? process.argv[outputArgIndex + 1] : 'dist/pages');

const commitSha = process.env.GITHUB_SHA || process.env.LIFEXP_COMMIT_SHA || 'local-development';
const shortSha = commitSha === 'local-development' ? 'local' : commitSha.slice(0, 12);
const buildId = process.env.LIFEXP_BUILD_ID || `main-${shortSha}`;
const label = process.env.LIFEXP_RELEASE_LABEL || buildId;
const builtAt = process.env.SOURCE_DATE_EPOCH
  ? new Date(Number(process.env.SOURCE_DATE_EPOCH) * 1000).toISOString()
  : new Date().toISOString();
const cacheName = `lifexp-${buildId.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') || 'development'}`;

if (!/^[a-zA-Z0-9._-]+$/.test(buildId)) throw new Error(`Invalid build id: ${buildId}`);
if (!/^[^\r\n]+$/.test(label)) throw new Error('Build label contains a line break.');

const buildInfo = {
  buildId,
  label,
  commitSha,
  shortSha,
  builtAt,
  cacheName
};

const excludedNames = new Set(['.git', '.github', 'node_modules', 'dist', 'tests', 'tools', 'lifexp-a1-final']);
const excludedExtensions = new Set(['.md', '.yml', '.yaml']);

function shouldCopy(name, relativePath) {
  if (excludedNames.has(name)) return false;
  if (relativePath.startsWith('.')) return false;
  if (relativePath === 'assets/source' || relativePath.startsWith(`assets${path.sep}source${path.sep}`)) return false;
  return !excludedExtensions.has(path.extname(name).toLowerCase());
}

function copyTree(sourceDir, targetDir, relativeDir = '') {
  fs.mkdirSync(targetDir, { recursive: true });
  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const relativePath = path.join(relativeDir, entry.name);
    if (!shouldCopy(entry.name, relativePath)) continue;
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);
    if (entry.isDirectory()) copyTree(sourcePath, targetPath, relativePath);
    else if (entry.isFile()) fs.copyFileSync(sourcePath, targetPath);
  }
}

fs.rmSync(outputDir, { recursive: true, force: true });
copyTree(root, outputDir);
fs.writeFileSync(path.join(outputDir, 'build-info.json'), `${JSON.stringify(buildInfo, null, 2)}\n`);
fs.writeFileSync(path.join(outputDir, 'build-info.js'), `globalThis.LifeXPBuild = Object.freeze(${JSON.stringify(buildInfo)});\n`);

const required = ['index.html', 'sw.js', 'build-info.js', 'build-info.json'];
for (const file of required) {
  if (!fs.existsSync(path.join(outputDir, file))) throw new Error(`Release artifact is missing ${file}.`);
}

console.log(JSON.stringify({ outputDir, ...buildInfo }, null, 2));
