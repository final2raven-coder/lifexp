#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const TOOL_VERSION = '3.0.0';
const SVG_EXTENSION = '.svg';
const MAX_PAGE_SIZE = 120;

function fail(message) {
  throw new Error(message);
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) fail(`Unknown argument: ${token}`);
    const key = token.slice(2);
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) fail(`Missing value for --${key}`);
    args[key] = value;
    index += 1;
  }
  if (!args.source) fail('Missing --source with the source ZIP path');
  if (!args.out) fail('Missing --out with the output directory');
  return args;
}

function ensureDirectory(directory) {
  fs.mkdirSync(directory, { recursive: true });
}

function sha256Buffer(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function sha256File(file) {
  return sha256Buffer(fs.readFileSync(file));
}

function writeText(file, content) {
  ensureDirectory(path.dirname(file));
  fs.writeFileSync(file, content, 'utf8');
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    encoding: options.encoding || 'buffer'
  });
  if (result.error) fail(`${command} could not run: ${result.error.message}`);
  if (result.status !== 0) {
    const stderr = Buffer.isBuffer(result.stderr) ? result.stderr.toString('utf8') : String(result.stderr || '');
    fail(`${command} failed with status ${result.status}: ${stderr.trim()}`);
  }
  return result.stdout;
}

function safeZipEntry(entry) {
  const normalized = String(entry).replace(/\\/g, '/');
  const clean = path.posix.normalize(normalized.replace(/^\.\//, ''));
  if (!clean || clean === '.' || clean.startsWith('/') || clean === '..' || clean.startsWith('../') || clean.includes('/../')) {
    fail(`Unsafe ZIP entry: ${entry}`);
  }
  return clean;
}

function listZipEntries(source) {
  const output = run('unzip', ['-Z1', source], { encoding: 'utf8' });
  return String(output)
    .split(/\r?\n/)
    .filter(Boolean)
    .map(safeZipEntry);
}

function isSvg(entry) {
  return !entry.endsWith('/') && path.posix.extname(entry).toLowerCase() === SVG_EXTENSION;
}

function isLicense(entry) {
  if (entry.endsWith('/')) return false;
  const base = path.posix.basename(entry).toLowerCase();
  return /^(license|licence|copying|notice)([-_.].*)?$/.test(base) ||
    /^(readme)([-_.].*)?\.(md|txt|rst|html?)$/.test(base);
}

function extractSource(source, temporaryDirectory) {
  run('unzip', ['-q', source, '-d', temporaryDirectory]);
}

function safePathJoin(root, relative) {
  const absoluteRoot = path.resolve(root);
  const target = path.resolve(root, relative);
  if (target !== absoluteRoot && !target.startsWith(`${absoluteRoot}${path.sep}`)) {
    fail(`Path escapes temporary extraction directory: ${relative}`);
  }
  return target;
}

function readSourceFile(extractedRoot, entry) {
  const file = safePathJoin(extractedRoot, entry);
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) fail(`Extracted source file is missing: ${entry}`);
  return fs.readFileSync(file);
}

function sanitizeSvg(buffer, entry) {
  const svg = buffer.toString('utf8').replace(/^\uFEFF/, '').trim();
  if (!/<svg\b[^>]*>[\s\S]*<\/svg>\s*$/i.test(svg)) fail(`Invalid SVG root: ${entry}`);
  if (/<script\b|<foreignObject\b|\bon[a-z]+\s*=|javascript:/i.test(svg)) {
    fail(`Unsafe SVG content: ${entry}`);
  }
  return svg
    .replace(/<\?xml[^>]*>/gi, '')
    .replace(/<!DOCTYPE[^>]*>/gi, '')
    .trim();
}

function attr(svg, name) {
  const expression = new RegExp(`\\\\b${name}\\\\s*=\\\\s*[\\\"']([^\\\"']+)[\\\"']`, 'i');
  const match = svg.match(expression);
  return match ? match[1] : null;
}

function humanize(slug) {
  return String(slug)
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/(^|\s)([a-z])/g, (_, prefix, letter) => `${prefix}${letter.toUpperCase()}`);
}

function slugForEntry(entry) {
  return path.posix.basename(entry, SVG_EXTENSION);
}

function authorForEntry(entry) {
  const parts = entry.split('/');
  return parts.length > 1 ? parts[parts.length - 2] : 'unknown';
}

function csvCell(value) {
  const text = value === null || value === undefined ? '' : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeScriptJson(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

function iconId(author, slug, hash, usedIds) {
  const base = `game-icons:${author}/${slug}`.toLowerCase();
  if (!usedIds.has(base)) {
    usedIds.add(base);
    return base;
  }
  const unique = `${base}@${hash.slice(0, 12)}`;
  usedIds.add(unique);
  return unique;
}

function buildCatalogHtml(catalog) {
  const data = escapeScriptJson(catalog.icons);
  const source = escapeHtml(catalog.source.file);
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>LifeXP icon catalog</title>
<style>
:root { color-scheme: dark; --bg: #080d16; --panel: #111a28; --panel2: #172336; --line: #2d405c; --text: #edf3ff; --muted: #9fb0c8; --accent: #70b7ff; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--text); font: 14px/1.45 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
header { position: sticky; top: 0; z-index: 5; padding: 20px; background: rgba(8, 13, 22, .97); border-bottom: 1px solid var(--line); backdrop-filter: blur(10px); }
h1 { margin: 0 0 5px; font-size: 25px; letter-spacing: .01em; }
.summary { color: var(--muted); margin: 0 0 15px; }
.controls { display: grid; grid-template-columns: minmax(220px, 1fr) 150px 150px auto; gap: 10px; align-items: center; }
input, select, button { min-height: 40px; border: 1px solid var(--line); border-radius: 7px; background: var(--panel); color: var(--text); padding: 8px 11px; font: inherit; }
button { cursor: pointer; }
button:hover, button:focus-visible { border-color: var(--accent); outline: none; }
main { padding: 20px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }
.card { min-height: 190px; padding: 10px; border: 1px solid var(--line); border-radius: 9px; background: var(--panel); cursor: pointer; text-align: left; }
.card:hover, .card:focus-visible { border-color: var(--accent); outline: none; transform: translateY(-1px); }
.preview { display: grid; place-items: center; height: 116px; margin-bottom: 9px; border-radius: 6px; background: #03060b; }
.preview img { width: 100px; height: 100px; object-fit: contain; }
.name { font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.meta { color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.badge { display: inline-block; margin-top: 5px; padding: 2px 6px; border-radius: 999px; background: #26354b; color: var(--muted); font-size: 11px; }
.pager { display: flex; gap: 10px; align-items: center; justify-content: center; margin: 22px 0 8px; }
#count { color: var(--muted); text-align: center; margin-bottom: 16px; }
.modal { position: fixed; inset: 0; z-index: 10; display: none; place-items: center; padding: 20px; background: rgba(0, 0, 0, .78); }
.modal.open { display: grid; }
.dialog { width: min(720px, 100%); max-height: 90vh; overflow: auto; padding: 18px; border: 1px solid var(--line); border-radius: 10px; background: var(--panel); }
.dialog-preview { display: grid; place-items: center; min-height: 300px; margin: 10px 0 15px; background: #03060b; border-radius: 8px; }
.dialog-preview img { width: min(340px, 80vw); height: min(340px, 55vh); object-fit: contain; }
dl { display: grid; grid-template-columns: 130px 1fr; gap: 7px 12px; margin: 0; }
dt { color: var(--muted); } dd { margin: 0; overflow-wrap: anywhere; }
@media (max-width: 760px) { .controls { grid-template-columns: 1fr 1fr; } .controls input { grid-column: 1 / -1; } .grid { grid-template-columns: repeat(auto-fill, minmax(135px, 1fr)); } }
</style>
</head>
<body>
<header>
  <h1>LifeXP icon catalog</h1>
  <p class="summary">${catalog.iconCount} SVG files from <code>${source}</code>. Dark preview is intentional: white strokes remain visible.</p>
  <div class="controls">
    <input id="search" type="search" placeholder="Search filename, author or path" aria-label="Search icons">
    <select id="author" aria-label="Filter by author"><option value="">All authors</option></select>
    <select id="sort" aria-label="Sort icons"><option value="name">Name</option><option value="author">Author</option><option value="path">Source path</option></select>
    <button id="reset" type="button">Reset</button>
  </div>
</header>
<main>
  <div id="count"></div>
  <section id="grid" class="grid" aria-live="polite"></section>
  <nav class="pager" aria-label="Catalog pages">
    <button id="previous" type="button">Previous</button>
    <span id="page"></span>
    <button id="next" type="button">Next</button>
  </nav>
</main>
<div id="modal" class="modal" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <article class="dialog">
    <button id="close" type="button" aria-label="Close preview">Close</button>
    <h2 id="dialog-title"></h2>
    <div class="dialog-preview"><img id="dialog-image" alt=""></div>
    <dl id="details"></dl>
  </article>
</div>
<script>
const ICONS = ${data};
const PAGE_SIZE = ${MAX_PAGE_SIZE};
const state = { search: '', author: '', sort: 'name', page: 1 };
const byId = id => document.getElementById(id);
const search = byId('search');
const author = byId('author');
const sort = byId('sort');
const grid = byId('grid');
const count = byId('count');
const page = byId('page');
const modal = byId('modal');
const dialogImage = byId('dialog-image');
const details = byId('details');
const dialogTitle = byId('dialog-title');
const authors = [...new Set(ICONS.map(icon => icon.author))].sort((a, b) => a.localeCompare(b));
for (const value of authors) {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = value;
  author.appendChild(option);
}
function filtered() {
  const query = state.search.trim().toLowerCase();
  return ICONS
    .filter(icon => (!state.author || icon.author === state.author) && (!query || [icon.displayName, icon.author, icon.slug, icon.sourcePath, icon.id].join(' ').toLowerCase().includes(query)))
    .sort((a, b) => {
      const left = state.sort === 'author' ? a.author + '/' + a.slug : state.sort === 'path' ? a.sourcePath : a.displayName;
      const right = state.sort === 'author' ? b.author + '/' + b.slug : state.sort === 'path' ? b.sourcePath : b.displayName;
      return left.localeCompare(right);
    });
}
function render() {
  const list = filtered();
  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  state.page = Math.min(state.page, pages);
  const start = (state.page - 1) * PAGE_SIZE;
  grid.replaceChildren();
  for (const icon of list.slice(start, start + PAGE_SIZE)) {
    const card = document.createElement('button');
    card.className = 'card';
    card.type = 'button';
    const preview = document.createElement('div');
    preview.className = 'preview';
    const image = document.createElement('img');
    image.loading = 'lazy';
    image.src = icon.assetPath;
    image.alt = icon.displayName;
    preview.appendChild(image);
    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = icon.displayName;
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = icon.author + ' / ' + icon.slug;
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = 'unreviewed';
    card.append(preview, name, meta, badge);
    card.addEventListener('click', () => openPreview(icon));
    grid.appendChild(card);
  }
  const first = list.length ? start + 1 : 0;
  const last = Math.min(start + PAGE_SIZE, list.length);
  count.textContent = list.length + ' matching icons | showing ' + first + '-' + last;
  page.textContent = 'Page ' + state.page + ' / ' + pages;
  byId('previous').disabled = state.page <= 1;
  byId('next').disabled = state.page >= pages;
}
function addDetail(label, value) {
  const term = document.createElement('dt');
  term.textContent = label;
  const description = document.createElement('dd');
  description.textContent = value || 'not declared';
  details.append(term, description);
}
function openPreview(icon) {
  dialogTitle.textContent = icon.displayName;
  dialogImage.src = icon.assetPath;
  dialogImage.alt = icon.displayName;
  details.replaceChildren();
  addDetail('Author folder', icon.author);
  addDetail('Stable id', icon.id);
  addDetail('Source path', icon.sourcePath);
  addDetail('Source SHA-256', icon.sourceSha256);
  addDetail('ViewBox', icon.viewBox);
  modal.classList.add('open');
  byId('close').focus();
}
function closePreview() {
  modal.classList.remove('open');
  dialogImage.removeAttribute('src');
}
search.addEventListener('input', () => { state.search = search.value; state.page = 1; render(); });
author.addEventListener('change', () => { state.author = author.value; state.page = 1; render(); });
sort.addEventListener('change', () => { state.sort = sort.value; state.page = 1; render(); });
byId('reset').addEventListener('click', () => { search.value = ''; author.value = ''; sort.value = 'name'; state.search = ''; state.author = ''; state.sort = 'name'; state.page = 1; render(); });
byId('previous').addEventListener('click', () => { state.page -= 1; render(); });
byId('next').addEventListener('click', () => { state.page += 1; render(); });
byId('close').addEventListener('click', closePreview);
modal.addEventListener('click', event => { if (event.target === modal) closePreview(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closePreview(); });
render();
</script>
</body>
</html>
`;
  return html;
}

function buildSheetHtml(icons, pageNumber, pageCount) {
  const start = pageNumber * MAX_PAGE_SIZE;
  const current = icons.slice(start, start + MAX_PAGE_SIZE);
  const cards = current.map(icon => `<article><div class="preview"><img loading="lazy" src="../${escapeHtml(icon.assetPath)}" alt="${escapeHtml(icon.displayName)}"></div><strong>${escapeHtml(icon.displayName)}</strong><small>${escapeHtml(icon.author)} / ${escapeHtml(icon.slug)}</small></article>`).join('\n');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>LifeXP icon sheet ${pageNumber + 1}</title><style>body{margin:0;padding:18px;background:#080d16;color:#edf3ff;font:14px system-ui,sans-serif}.top{display:flex;justify-content:space-between;align-items:center;margin-bottom:15px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}article{padding:10px;border:1px solid #2d405c;border-radius:8px;background:#111a28}.preview{display:grid;place-items:center;height:110px;background:#03060b;border-radius:6px;margin-bottom:8px}.preview img{width:94px;height:94px;object-fit:contain}strong,small{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}small{color:#9fb0c8;margin-top:4px}</style></head><body><div class="top"><h1>LifeXP icon sheet ${pageNumber + 1} / ${pageCount}</h1><a href="../icon-catalog.html">Back to catalog</a></div><section class="grid">${cards}</section></body></html>`;
}

function buildCsv(icons) {
  const headers = ['id', 'displayName', 'author', 'slug', 'sourcePath', 'assetPath', 'sourceSha256', 'viewBox', 'width', 'height'];
  const rows = [headers, ...icons.map(icon => headers.map(header => icon[header]))];
  return `${rows.map(row => row.map(csvCell).join(',')).join('\n')}\n`;
}

function collectFiles(directory) {
  const files = [];
  for (const name of fs.readdirSync(directory).sort()) {
    const file = path.join(directory, name);
    const stat = fs.statSync(file);
    if (stat.isDirectory()) files.push(...collectFiles(file));
    else files.push(file);
  }
  return files;
}

function build(source, out) {
  if (!fs.existsSync(source)) fail(`Source ZIP does not exist: ${source}`);
  const zipEntries = listZipEntries(source);
  const svgEntries = zipEntries.filter(isSvg).sort();
  const licenseEntries = zipEntries.filter(isLicense).sort();
  if (!svgEntries.length) fail('Source ZIP contains no SVG files');
  if (!licenseEntries.length) fail('Source ZIP contains no recognizable license or attribution file');

  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'lifexp-icon-catalog-'));
  try {
    extractSource(source, temporaryDirectory);
    fs.rmSync(out, { recursive: true, force: true });
    ensureDirectory(path.join(out, 'icons'));
    ensureDirectory(path.join(out, 'preview-sheets'));
    ensureDirectory(path.join(out, 'source-license'));

    const usedIds = new Set();
    const icons = [];
    for (let index = 0; index < svgEntries.length; index += 1) {
      const sourcePath = svgEntries[index];
      const original = readSourceFile(temporaryDirectory, sourcePath);
      const sourceSha256 = sha256Buffer(original);
      const svg = sanitizeSvg(original, sourcePath);
      const author = authorForEntry(sourcePath);
      const slug = slugForEntry(sourcePath);
      const id = iconId(author, slug, sourceSha256, usedIds);
      const assetName = `${String(index + 1).padStart(4, '0')}-${slug.replace(/[^a-z0-9_-]+/gi, '-').toLowerCase()}-${sourceSha256.slice(0, 12)}.svg`;
      const assetPath = `icons/${assetName}`;
      writeText(path.join(out, assetPath), `${svg}\n`);
      icons.push({
        ordinal: index + 1,
        id,
        displayName: humanize(slug),
        author,
        slug,
        sourcePath,
        assetPath,
        sourceSha256,
        viewBox: attr(svg, 'viewBox'),
        width: attr(svg, 'width'),
        height: attr(svg, 'height'),
        reviewStatus: 'unreviewed',
        mappedReference: null
      });
    }

    const metadata = {
      schemaVersion: 1,
      toolVersion: TOOL_VERSION,
      mode: 'catalog',
      source: {
        file: path.relative(process.cwd(), source).replace(/\\/g, '/'),
        sha256: sha256File(source),
        svgCount: svgEntries.length,
        licenseFiles: licenseEntries
      },
      iconCount: icons.length,
      pageSize: MAX_PAGE_SIZE,
      pageCount: Math.ceil(icons.length / MAX_PAGE_SIZE),
      reviewPolicy: 'Catalog entries start unreviewed. No game entity is assigned automatically by this artifact.'
    };
    const catalog = { ...metadata, icons };
    writeText(path.join(out, 'icon-catalog.json'), `${JSON.stringify(catalog, null, 2)}\n`);
    writeText(path.join(out, 'icon-catalog.csv'), buildCsv(icons));
    writeText(path.join(out, 'icon-catalog.html'), buildCatalogHtml(catalog));
    for (let pageNumber = 0; pageNumber < metadata.pageCount; pageNumber += 1) {
      writeText(path.join(out, 'preview-sheets', `sheet-${String(pageNumber + 1).padStart(3, '0')}.html`), buildSheetHtml(icons, pageNumber, metadata.pageCount));
    }
    for (const licenseEntry of licenseEntries) {
      const destination = path.join(out, 'source-license', licenseEntry);
      ensureDirectory(path.dirname(destination));
      fs.copyFileSync(safePathJoin(temporaryDirectory, licenseEntry), destination);
    }
    writeText(path.join(out, 'ATTRIBUTION.md'), [
      '# LifeXP icon catalog attribution',
      '',
      'The catalog preserves the source ZIP license and attribution files under `source-license/`.',
      'Per-icon source paths, author folders and source hashes are recorded in `icon-catalog.json` and `icon-catalog.csv`.',
      'No icon-to-game assignment is made automatically in catalog mode.',
      ''
    ].join('\n'));

    const filesBeforeSums = collectFiles(out);
    const sums = filesBeforeSums
      .map(file => `${sha256File(file)}  ${path.relative(out, file).replace(/\\/g, '/')}`)
      .sort()
      .join('\n') + '\n';
    writeText(path.join(out, 'SHA256SUMS.txt'), sums);
    const report = {
      ...metadata,
      outputFiles: collectFiles(out).length + 1,
      sourceZipSha256: sha256File(source),
      outputSha256File: 'SHA256SUMS.txt'
    };
    writeText(path.join(out, 'BUILD-REPORT.json'), `${JSON.stringify(report, null, 2)}\n`);
    console.log(`CATALOG_OK: ${icons.length} SVG files, ${metadata.pageCount} preview sheets, ${licenseEntries.length} license files`);
  } finally {
    fs.rmSync(temporaryDirectory, { recursive: true, force: true });
  }
}

function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    build(path.resolve(args.source), path.resolve(args.out));
  } catch (error) {
    console.error(`ICON_CATALOG_FAIL: ${error.message}`);
    process.exitCode = 1;
  }
}

main();
