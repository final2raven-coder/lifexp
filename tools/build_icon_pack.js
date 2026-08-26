#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const TOOL_VERSION = '1.0.0';
const SEMANTIC_REFERENCE = /^(item|class|enemy|category|action|ui|world)\.[a-z0-9_-]+$/i;
const REPO_SCAN_FILES = [
  'index.html',
  'icon_system.js',
  'classes.js',
  'items.js',
  'enemies.js',
  'ui_hub.js',
  'ui_tasks.js',
  'ui_combat.js',
  'ui_misc.js',
  'ui_feedback.js'
];

function fail(message) {
  console.error(`ICON_PACK_FAIL: ${message}`);
  process.exitCode = 1;
  throw new Error(message);
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) fail(`Argumento desconocido: ${token}`);
    const key = token.slice(2);
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) fail(`Falta valor para --${key}`);
    args[key] = value;
    index += 1;
  }
  args.mode = args.mode || (args.manifest ? 'build' : 'discover');
  if (!['discover', 'build'].includes(args.mode)) fail(`Modo no valido: ${args.mode}`);
  if (!args.source) fail('Falta --source con la ruta al ZIP fuente');
  if (!args.out) fail('Falta --out con el directorio de salida');
  if (args.mode === 'build' && !args.manifest) fail('El modo build requiere --manifest');
  return args;
}

function ensureInside(root, target) {
  const absoluteRoot = path.resolve(root);
  const absoluteTarget = path.resolve(target);
  if (absoluteTarget !== absoluteRoot && !absoluteTarget.startsWith(`${absoluteRoot}${path.sep}`)) {
    fail(`Ruta fuera del directorio permitido: ${target}`);
  }
}

function ensureDirectory(directory) {
  fs.mkdirSync(directory, { recursive: true });
}

function readText(file) {
  return fs.readFileSync(file, 'utf8');
}

function writeText(file, content) {
  ensureDirectory(path.dirname(file));
  fs.writeFileSync(file, content, 'utf8');
}

function sha256Buffer(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function sha256File(file) {
  return sha256Buffer(fs.readFileSync(file));
}

function runUnzip(args, options = {}) {
  const result = spawnSync('unzip', args, { encoding: options.encoding || 'buffer' });
  if (result.error) fail(`No se pudo ejecutar unzip: ${result.error.message}`);
  if (result.status !== 0) {
    const details = Buffer.isBuffer(result.stderr) ? result.stderr.toString('utf8') : String(result.stderr || '');
    fail(`unzip fallo (${result.status}): ${details.trim()}`);
  }
  return result.stdout;
}

function listZipEntries(source) {
  if (!fs.existsSync(source)) fail(`No existe el ZIP fuente: ${source}`);
  const output = runUnzip(['-Z1', source], { encoding: 'utf8' });
  return String(output)
    .split(/\r?\n/)
    .map(entry => entry.replace(/\\/g, '/').replace(/^\.\//, ''))
    .filter(Boolean);
}

function readZipEntry(source, entry) {
  return runUnzip(['-p', source, entry]);
}

function isSvgEntry(entry) {
  return !entry.endsWith('/') && path.posix.extname(entry).toLowerCase() === '.svg';
}

function isLicenseEntry(entry) {
  if (entry.endsWith('/')) return false;
  const base = path.posix.basename(entry).toLowerCase();
  return /^(license|licence|copying|notice)([-_.].*)?$/.test(base) ||
    /^(readme)([-_.].*)?\.(md|txt|rst|html?)$/.test(base);
}

function normalizedToken(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

function semanticReferences(repoRoot) {
  const references = new Set();
  const literalPatterns = [
    /data-lifexp-icon\s*=\s*[\"']([^\"']+)[\"']/gi,
    /\biconRef\s*:\s*[\"']([^\"']+)[\"']/g,
    /\b(?:render|renderUI|renderItem|renderClass|renderEnemy|renderCategory|renderAction)\s*\(\s*[\"']([^\"']+)[\"']/g
  ];
  for (const relative of REPO_SCAN_FILES) {
    const file = path.join(repoRoot, relative);
    if (!fs.existsSync(file)) continue;
    const content = readText(file);
    for (const pattern of literalPatterns) {
      for (const match of content.matchAll(pattern)) {
        const reference = String(match[1]).trim().toLowerCase();
        if (SEMANTIC_REFERENCE.test(reference)) references.add(reference);
      }
    }
  }
  return [...references].sort();
}

function semanticNameTokens(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function candidateScore(reference, svgEntry) {
  const wantedTokens = semanticNameTokens(String(reference).split('.').pop() || '');
  const candidateTokens = semanticNameTokens(path.posix.basename(svgEntry, '.svg'));
  if (!wantedTokens.length || !candidateTokens.length) return 0;

  const wantedName = wantedTokens.join('');
  const candidateName = candidateTokens.join('');
  if (wantedName === candidateName) return 100;
  if (wantedTokens.length > 1 && wantedTokens.every(token => candidateTokens.includes(token))) return 90;
  if (wantedTokens.length === 1 && candidateTokens.includes(wantedTokens[0])) return 80;
  return 0;
}

function discover(source, out, repoRoot) {
  const entries = listZipEntries(source);
  const svgEntries = entries.filter(isSvgEntry).sort();
  const licenseEntries = entries.filter(isLicenseEntry).sort();
  if (!svgEntries.length) fail('El ZIP fuente no contiene SVG');
  if (!licenseEntries.length) fail('El ZIP fuente no contiene un fichero de licencia o atribucion reconocible');

  const references = semanticReferences(repoRoot);
  const candidates = references.map(reference => {
    const ranked = svgEntries
      .map(entry => ({ entry, score: candidateScore(reference, entry) }))
      .filter(item => item.score > 0)
      .sort((left, right) => right.score - left.score || left.entry.localeCompare(right.entry))
      .slice(0, 20);
    return { reference, candidates: ranked };
  });

  const report = {
    toolVersion: TOOL_VERSION,
    mode: 'discover',
    source: {
      file: path.relative(repoRoot, path.resolve(source)).replace(/\\/g, '/'),
      sha256: sha256File(source),
      svgCount: svgEntries.length,
      licenseFiles: licenseEntries
    },
    applicationReferences: references.length,
    candidates,
    unmatchedReferences: candidates.filter(item => item.candidates.length === 0).map(item => item.reference),
    ambiguousReferences: candidates.filter(item => item.candidates.length > 1 && item.candidates[0].score === item.candidates[1].score).map(item => item.reference),
    candidatePolicy: 'Solo se aceptan nombres exactos o tokens completos separados por guion/underscore; las coincidencias por subcadena se rechazan.'
  };

  ensureDirectory(out);
  writeText(path.join(out, 'icon-pack-discovery.json'), `${JSON.stringify(report, null, 2)}\n`);
  const markdown = [
    '# LifeXP icon pack discovery',
    '',
    `- Source ZIP SHA-256: \`${report.source.sha256}\``,
    `- SVG files found: ${report.source.svgCount}`,
    `- License files found: ${report.source.licenseFiles.length}`,
    `- Application references: ${report.applicationReferences}`,
    `- Unmatched references: ${report.unmatchedReferences.length}`,
    `- Ambiguous references: ${report.ambiguousReferences.length}`,
    '',
    'Review every reference before creating the build manifest. The tool never selects an icon automatically during build.',
    '',
    '## License files',
    ...licenseEntries.map(entry => `- \`${entry}\``),
    '',
    '## Candidate matches',
    ...candidates.map(item => {
      const list = item.candidates.length
        ? item.candidates.map(candidate => `\`${candidate.entry}\` (score ${candidate.score})`).join(', ')
        : 'no candidate';
      return `- \`${item.reference}\`: ${list}`;
    }),
    ''
  ].join('\n');
  writeText(path.join(out, 'icon-pack-discovery.md'), markdown);
  console.log(`DISCOVERY_OK: ${svgEntries.length} SVG, ${references.length} referencias, ${licenseEntries.length} ficheros de licencia`);
}

function parseManifest(manifestFile) {
  if (!fs.existsSync(manifestFile)) fail(`No existe el manifiesto de seleccion: ${manifestFile}`);
  let manifest;
  try {
    manifest = JSON.parse(readText(manifestFile));
  } catch (error) {
    fail(`JSON invalido en el manifiesto: ${error.message}`);
  }
  if (!manifest || typeof manifest !== 'object') fail('El manifiesto debe ser un objeto JSON');
  if (!manifest.packId || !manifest.version) fail('El manifiesto requiere packId y version');
  if (!manifest.source || typeof manifest.source !== 'object') fail('El manifiesto requiere source');
  if (!manifest.source.license || !manifest.source.licenseUrl) fail('source requiere license y licenseUrl');
  if (!manifest.entries || typeof manifest.entries !== 'object' || Array.isArray(manifest.entries)) {
    fail('El manifiesto requiere entries como objeto');
  }
  const refs = Object.keys(manifest.entries);
  if (!refs.length) fail('El manifiesto no contiene entries');
  const seenPaths = new Set();
  for (const reference of refs) {
    if (!SEMANTIC_REFERENCE.test(reference)) fail(`Referencia semantica invalida: ${reference}`);
    const item = manifest.entries[reference];
    if (!item || typeof item !== 'object') fail(`Entrada invalida para ${reference}`);
    for (const field of ['sourcePath', 'title', 'author', 'license', 'licenseUrl', 'sourceUrl']) {
      if (!item[field] || typeof item[field] !== 'string') fail(`Falta ${field} en ${reference}`);
    }
    if (seenPaths.has(item.sourcePath)) fail(`El SVG se reutiliza en varias referencias: ${item.sourcePath}`);
    seenPaths.add(item.sourcePath);
  }
  return manifest;
}

function sanitizeSvg(buffer, reference) {
  const svg = buffer.toString('utf8').replace(/^\uFEFF/, '').trim();
  if (!/<svg\b[^>]*>[\s\S]*<\/svg>\s*$/i.test(svg)) fail(`SVG invalido para ${reference}: falta una raiz SVG completa`);
  if (/<script\b|<foreignObject\b|\bon[a-z]+\s*=|javascript:/i.test(svg)) fail(`SVG no seguro para ${reference}: contiene script, foreignObject, handlers o javascript`);
  return svg
    .replace(/<\?xml[^>]*>/gi, '')
    .replace(/<!DOCTYPE[^>]*>/gi, '')
    .trim();
}

function safeRelativeEntry(entry) {
  const normalized = path.posix.normalize(String(entry).replace(/\\/g, '/'));
  if (!normalized || normalized === '.' || normalized.startsWith('../') || normalized.includes('/../') || normalized.startsWith('/')) {
    fail(`Ruta de ZIP no segura: ${entry}`);
  }
  return normalized;
}

function jsonForJavaScript(value) {
  return JSON.stringify(value, null, 2).replace(/<\/script/gi, '<\\/script');
}

function writePackScript(out, manifest, packedEntries) {
  const payload = {
    packId: manifest.packId,
    version: manifest.version,
    license: manifest.source.license,
    licenseUrl: manifest.source.licenseUrl,
    entries: packedEntries
  };
  const script = [
    '// Generated by tools/build_icon_pack.js. Do not edit by hand.',
    '(function (global) {',
    "  'use strict';",
    `  const pack = ${jsonForJavaScript(payload)};`,
    "  if (!global.LifeXPIcons || typeof global.LifeXPIcons.registerPack !== 'function') {",
    "    throw new Error('LifeXPIcons must be loaded before the generated icon pack');",
    '  }',
    '  global.LifeXPIcons.registerPack(pack);',
    "})(typeof window !== 'undefined' ? window : globalThis);",
    ''
  ].join('\n');
  writeText(path.join(out, 'lifexp-game-icons-pack.js'), script);
}

function build(source, manifestFile, out, repoRoot) {
  const zipEntries = listZipEntries(source);
  const zipEntrySet = new Set(zipEntries);
  const svgEntries = new Set(zipEntries.filter(isSvgEntry));
  const licenseEntries = zipEntries.filter(isLicenseEntry).sort();
  if (!licenseEntries.length) fail('El ZIP fuente no contiene licencia o atribucion reconocible');
  const manifest = parseManifest(manifestFile);
  const packedEntries = {};
  const attribution = [];

  for (const reference of Object.keys(manifest.entries).sort()) {
    const item = manifest.entries[reference];
    const sourcePath = safeRelativeEntry(item.sourcePath);
    if (!zipEntrySet.has(sourcePath)) fail(`${reference}: sourcePath no existe en el ZIP: ${sourcePath}`);
    if (!svgEntries.has(sourcePath)) fail(`${reference}: sourcePath no es un SVG: ${sourcePath}`);
    const svg = sanitizeSvg(readZipEntry(source, sourcePath), reference);
    packedEntries[reference] = {
      svg,
      title: item.title,
      author: item.author,
      license: item.license,
      licenseUrl: item.licenseUrl,
      sourceUrl: item.sourceUrl
    };
    attribution.push(`- \`${reference}\` - ${item.title}, ${item.author}. ${item.license}. ${item.sourceUrl}`);
  }

  fs.rmSync(out, { recursive: true, force: true });
  ensureDirectory(out);
  writePackScript(out, manifest, packedEntries);

  const selectedLicenseFiles = Array.isArray(manifest.source.licenseFiles) && manifest.source.licenseFiles.length
    ? manifest.source.licenseFiles.map(safeRelativeEntry)
    : licenseEntries;
  for (const licenseEntry of selectedLicenseFiles) {
    if (!zipEntrySet.has(licenseEntry)) fail(`licenseFiles no contiene una entrada existente: ${licenseEntry}`);
    const destination = path.join(out, 'licenses', 'source', licenseEntry);
    ensureInside(path.join(out, 'licenses', 'source'), destination);
    ensureDirectory(path.dirname(destination));
    fs.writeFileSync(destination, readZipEntry(source, licenseEntry));
  }

  const metadata = {
    toolVersion: TOOL_VERSION,
    packId: manifest.packId,
    version: manifest.version,
    source: {
      name: manifest.source.name || null,
      license: manifest.source.license,
      licenseUrl: manifest.source.licenseUrl,
      zipSha256: sha256File(source),
      licenseFiles: selectedLicenseFiles
    },
    entryCount: Object.keys(packedEntries).length,
    references: Object.keys(packedEntries).sort()
  };
  writeText(path.join(out, 'BUILD-METADATA.json'), `${JSON.stringify(metadata, null, 2)}\n`);
  writeText(path.join(out, 'ATTRIBUTION.md'), [
    '# LifeXP icon pack attribution',
    '',
    `Pack: ${manifest.packId} ${manifest.version}`,
    `Source: ${manifest.source.name || 'declared in selection manifest'}`,
    `License: ${manifest.source.license} (${manifest.source.licenseUrl})`,
    '',
    'The original source license files are included under `licenses/source/`.',
    '',
    '## Included icons',
    ...attribution,
    ''
  ].join('\n'));

  const report = {
    toolVersion: TOOL_VERSION,
    mode: 'build',
    sourceZipSha256: sha256File(source),
    entryCount: Object.keys(packedEntries).length,
    licenseFiles: selectedLicenseFiles,
    note: 'The ZIP SHA-256 is printed by the builder after packaging; this report is included in the ZIP.'
  };
  writeText(path.join(out, 'BUILD-REPORT.json'), `${JSON.stringify(report, null, 2)}\n`);

  const contentFiles = [];
  function collect(directory) {
    for (const name of fs.readdirSync(directory).sort()) {
      const file = path.join(directory, name);
      const stat = fs.statSync(file);
      if (stat.isDirectory()) collect(file);
      else contentFiles.push(file);
    }
  }
  collect(out);
  const sums = contentFiles
    .filter(file => path.basename(file) !== 'SHA256SUMS.txt')
    .map(file => `${sha256File(file)}  ${path.relative(out, file).replace(/\\/g, '/')}`)
    .sort()
    .join('\n') + '\n';
  writeText(path.join(out, 'SHA256SUMS.txt'), sums);

  const zipFile = `${out}.zip`;
  fs.rmSync(zipFile, { force: true });
  const packageFiles = contentFiles.concat(path.join(out, 'SHA256SUMS.txt'));
  for (const file of packageFiles) {
    fs.utimesSync(file, new Date('1980-01-01T00:00:00Z'), new Date('1980-01-01T00:00:00Z'));
  }
  const zipResult = spawnSync('zip', ['-X', '-q', '-r', zipFile, '.'], { cwd: out, encoding: 'utf8' });
  if (zipResult.error || zipResult.status !== 0) fail(`No se pudo crear el ZIP final: ${(zipResult.stderr || zipResult.error || '').toString()}`);
  console.log(`BUILD_OK: ${report.entryCount} iconos, ${selectedLicenseFiles.length} ficheros de licencia`);
  console.log(`ZIP: ${zipFile}`);
  console.log(`ZIP_SHA256: ${sha256File(zipFile)}`);
}

function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    const repoRoot = path.resolve(args.repo || process.cwd());
    const source = path.resolve(repoRoot, args.source);
    const out = path.resolve(repoRoot, args.out);
    ensureInside(repoRoot, out);
    if (args.mode === 'discover') discover(source, out, repoRoot);
    else build(source, path.resolve(repoRoot, args.manifest), out, repoRoot);
  } catch (error) {
    if (!process.exitCode) {
      console.error(`ICON_PACK_FAIL: ${error.message}`);
      process.exitCode = 1;
    }
  }
}

main();
