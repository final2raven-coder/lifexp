// LifeXP RPG - Canonical icon rendering contract.
//
// Data and UI code refer to semantic icon references. The optional local pack
// can register SVG entries for those references without changing saves or game
// rules. Fallback SVGs keep the interface usable before the pack is installed.
(function (global) {
  'use strict';

  const CONTRACT_VERSION = '1.0';
  const DEFAULT_COLOR = '#c9c5bb';
  const DEFAULT_SIZE = 40;
  const packEntries = Object.create(null);

  const FALLBACK_PATHS = Object.freeze({
    'item.weapon': '<path d="M10 31 28 7l4 4-18 24H10z"/><path d="m8 33 8-2M25 10l4 4"/>',
    'item.dagger': '<path d="M20 5 30 16 16 31 10 25 20 5z"/><path d="m10 25-4 7 7-4M20 5l6 6"/>',
    'item.armor': '<path d="M12 7c3 3 9 3 12 0l5 5-3 18H10L7 12l5-5z"/><path d="M16 10v17m4-17v17"/>',
    'item.accessory': '<circle cx="20" cy="20" r="10"/><circle cx="20" cy="20" r="4"/>',
    'item.artifact': '<path d="m20 5 5 9-5 15-5-15 5-9z"/><path d="M9 20h22M12 13h16"/>',
    'item.consumable': '<path d="M14 6h12M16 6v6l-5 14c-.5 2 1 4 3 4h12c2 0 3.5-2 3-4l-5-14V6"/><path d="M13 21h14"/>',
    'item.material': '<path d="m20 5 11 7-11 17L9 12 20 5z"/><path d="m9 12 11 7 11-7"/>',
    'item.skill': '<path d="M10 5h20v30H10z"/><path d="M15 12h10M15 18h10M15 24h7"/>',
    'item.key': '<circle cx="13" cy="25" r="6"/><path d="m18 21 13-13M25 12l4 4M21 16l4 4"/>',
    'world.fire': '<path d="M20 35c-7 0-12-5-12-12 0-5 3-9 8-14 0 5 2 7 4 8-1-6 2-11 5-14 1 6 7 10 7 20 0 7-5 12-12 12z"/><path d="M20 30c-3 0-5-2-5-5 0-2 1-4 3-6 0 2 1 3 2 4 0-3 1-5 3-7 0 3 3 5 3 9 0 3-3 5-6 5z"/>',
    'world.book': '<path d="M8 7h20a3 3 0 0 1 3 3v23H11a3 3 0 0 1-3-3V7z"/><path d="M12 13h13M12 19h13M12 25h9"/>',
    'world.map': '<path d="m6 8 9-3 10 3 9-3v27l-9 3-10-3-9 3V8z"/><path d="M15 5v27m10-24v27"/>',
    'world.skull': '<circle cx="20" cy="17" r="11"/><path d="M13 25v7h14v-7M15 16h1m8 0h1M16 22h8"/>',
    'world.lightning': '<path d="m22 4-9 16h7l-2 16 9-16h-7l2-16z"/>',
    'world.castle': '<path d="M7 34V12h7V7h6v5h6V7h7v27H7z"/><path d="M14 20h12M14 26h12"/>',
    'world.pin': '<path d="M20 35s10-9 10-18a10 10 0 1 0-20 0c0 9 10 18 10 18z"/><circle cx="20" cy="17" r="3"/>',
    'world.dice': '<rect x="7" y="7" width="26" height="26" rx="4"/><circle cx="14" cy="14" r="1.5"/><circle cx="26" cy="26" r="1.5"/><circle cx="20" cy="20" r="1.5"/>',
    'world.water': '<path d="M20 5c5 7 9 11 9 17a9 9 0 1 1-18 0c0-6 4-10 9-17z"/>',
    'world.star': '<path d="m20 5 4.5 9.1 10 1.5-7.2 7.1 1.7 10-9-4.7-9 4.7 1.7-10-7.2-7.1 10-1.5L20 5z"/>',
    'ui.person': '<circle cx="20" cy="12" r="6"/><path d="M8 35c1-8 5-12 12-12s11 4 12 12"/>',
    'ui.sword': '<path d="M10 31 28 7l4 4-18 24H10z"/><path d="m8 33 8-2M25 10l4 4"/>',
    'ui.coin': '<circle cx="20" cy="20" r="13"/><path d="M24 14c-1-2-7-2-7 1s7 2 7 5-6 3-8 1M20 11v18"/>',
    'ui.settings': '<circle cx="20" cy="20" r="4"/><path d="M20 4v5m0 22v5M4 20h5m22 0h5M8.7 8.7l3.5 3.5m15.6 15.6 3.5 3.5m0-22.6-3.5 3.5M12.2 27.8l-3.5 3.5"/>',
    'ui.back': '<path d="M32 20H8m0 0 9-9m-9 9 9 9"/>',
    'ui.tasks': '<path d="M10 6h22v28H10z"/><path d="M15 13h12M15 20h12M15 27h8"/>',
    'ui.guild': '<circle cx="14" cy="13" r="5"/><circle cx="27" cy="16" r="4"/><path d="M5 34c1-7 4-10 9-10s8 3 9 10M22 34c0-5 2-8 6-8 4 0 6 3 7 8"/>',
    'ui.heart': '<path d="M20 34S7 25 7 15a7 7 0 0 1 13-4 7 7 0 0 1 13 4c0 10-13 19-13 19z"/>',
    'ui.mana': '<path d="M20 5c5 7 9 11 9 17a9 9 0 1 1-18 0c0-6 4-10 9-17z"/><path d="M15 25c2 2 5 3 9 2"/>',
    'ui.check': '<path d="m8 21 8 8L32 12"/>',
    'ui.save': '<path d="M8 7h24v26H8z"/><path d="M13 7v9h14V7M14 33v-9h12v9"/>',
    'ui.play': '<path d="m13 7 20 13-20 13V7z"/>',
    'ui.refresh': '<path d="M32 15a13 13 0 1 0 2 10"/><path d="M32 7v8h-8"/>',
    'ui.trophy': '<path d="M12 7h16v9c0 7-3 11-8 11s-8-4-8-11V7z"/><path d="M12 11H7v3c0 5 3 8 8 8m13-11h5v3c0 5-3 8-8 8M20 27v6M13 35h14"/>',
    'ui.gift': '<rect x="6" y="14" width="28" height="20" rx="2"/><path d="M6 20h28M20 14v20M20 14c-5 0-9-2-8-6 1-3 6-2 8 6zm0 0c5 0 9-2 8-6-1-3-6-2-8 6z"/>',
    'ui.plus': '<path d="M20 7v26M7 20h26"/>',
    'ui.inventory': '<rect x="7" y="7" width="26" height="26" rx="2"/><path d="M7 14h26M14 7v7m6-7v7m6-7v7"/>',
    'ui.arrow_up': '<path d="M20 33V7m0 0-9 9m9-9 9 9"/>',
    'ui.trash': '<path d="M8 11h24M16 11V7h8v4m-14 0 2 24h16l2-24M17 17v12m6-12v12"/>',
    'class.generic': '<circle cx="20" cy="11" r="6"/><path d="M8 35c1-8 5-12 12-12s11 4 12 12"/><path d="M12 18h16"/>',
    'enemy.generic': '<path d="M8 14 14 7l6 5 6-5 6 7-4 16H12L8 14z"/><path d="M15 20h1m8 0h1M16 26h8"/>',
    'category.generic': '<rect x="7" y="7" width="26" height="26" rx="3"/><path d="M13 14h14M13 20h14M13 26h9"/>',
    'action.generic': '<circle cx="20" cy="20" r="13"/><path d="M20 9v22M9 20h22"/>',
    'ui.generic': '<circle cx="20" cy="20" r="13"/><path d="M20 12v9m0 6v1"/>'
  });

  const LEGACY_REFERENCES = Object.freeze({
    '\u2694': 'item.weapon',
    '\ud83d\uddef': 'item.dagger',
    '\ud83d\udee1': 'item.armor',
    '\ud83d\udc8d': 'item.accessory',
    '\ud83d\udd2e': 'item.artifact',
    '\ud83e\uddea': 'item.consumable',
    '\ud83d\udce6': 'item.material',
    '\ud83d\udcdc': 'item.skill',
    '\ud83d\udd11': 'item.key',
    '\ud83d\udd25': 'world.fire',
    '\ud83d\udcd6': 'world.book',
    '\ud83d\uddfa': 'world.map',
    '\ud83d\udc80': 'world.skull',
    '\u26a1': 'world.lightning',
    '\ud83c\udff0': 'world.castle',
    '\ud83d\udccc': 'world.pin',
    '\ud83c\udfb2': 'world.dice',
    '\ud83d\udc9a': 'ui.heart',
    '\u2764': 'ui.heart',
    '\u2705': 'ui.check',
    '\u25b6': 'ui.play',
    '\u21bb': 'ui.refresh',
    '\u2699': 'ui.settings',
    '\u2190': 'ui.back',
    '\u2b06': 'ui.arrow_up',
    '\u2795': 'ui.plus',
    '\ud83c\udfc6': 'ui.trophy',
    '\ud83c\udf89': 'world.star',
    '\ud83c\udf81': 'ui.gift'
  });

  function escapeAttribute(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function safeSize(value) {
    const size = Number(value);
    return Number.isFinite(size) && size > 0 ? Math.min(Math.max(Math.round(size), 12), 160) : DEFAULT_SIZE;
  }

  function safeColor(value) {
    const color = String(value || DEFAULT_COLOR);
    return /^#[0-9a-f]{3,8}$/i.test(color) || /^var\(--[a-z0-9-]+\)$/i.test(color) ? color : DEFAULT_COLOR;
  }

  function normalizeLegacy(value) {
    if (value == null) return null;
    const text = String(value);
    if (LEGACY_REFERENCES[text]) return LEGACY_REFERENCES[text];
    const normalized = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    if (LEGACY_REFERENCES[normalized]) return LEGACY_REFERENCES[normalized];
    return null;
  }

  function isSemanticReference(value) {
    return /^(item|class|enemy|category|action|ui|world)\.[a-z0-9_-]+$/i.test(value);
  }

  function canonicalReference(reference) {
    if (!reference) return null;
    const value = String(reference).trim();
    return FALLBACK_PATHS[value] || packEntries[value] || isSemanticReference(value)
      ? value
      : normalizeLegacy(value) || null;
  }

  function fallbackReference(reference) {
    if (FALLBACK_PATHS[reference]) return reference;
    const namespace = String(reference).split('.')[0];
    return FALLBACK_PATHS[`${namespace}.generic`] ? `${namespace}.generic` : 'ui.generic';
  }

  function resolveReference(value, options = {}) {
    if (typeof value === 'string') {
      return canonicalReference(value) || normalizeLegacy(value) || 'ui.generic';
    }
    if (!value || typeof value !== 'object') return 'ui.generic';
    const explicit = value.iconRef || options.iconRef;
    if (explicit) return canonicalReference(explicit) || 'ui.generic';
    const legacy = normalizeLegacy(value.icon);
    if (legacy) return legacy;
    const kind = options.kind || value.kind;
    if (kind === 'item') return canonicalReference(`item.${value.type || 'material'}`) || 'item.material';
    if (kind === 'class') return 'class.generic';
    if (kind === 'enemy') return 'enemy.generic';
    if (kind === 'category') return canonicalReference(`category.${value.id || 'generic'}`) || 'category.generic';
    if (kind === 'action') return 'action.generic';
    if (value.type && FALLBACK_PATHS[`item.${value.type}`]) return `item.${value.type}`;
    return 'ui.generic';
  }

  function labelFor(value, options, reference) {
    if (options && options.label) return String(options.label);
    if (value && typeof value === 'object' && value.name) return String(value.name);
    return reference.split('.').slice(-1)[0].replace(/[_-]+/g, ' ');
  }

  function colorizePackSvg(svg) {
    return String(svg)
      .replace(/<\?xml[^>]*>/gi, '')
      .replace(/<!DOCTYPE[^>]*>/gi, '')
      .replace(/\s(stroke|fill)\s*=\s*(["'])(?:white|#fff(?:fff)?|#ffffff)\2/gi, ' $1="currentColor"')
      .replace(/(stroke|fill)\s*:\s*(?:white|#fff(?:fff)?|#ffffff)/gi, '$1:currentColor');
  }

  function renderPackEntry(entry, label, decorative) {
    if (!entry || typeof entry !== 'object') return null;
    if (entry.svg) {
      return `<span class="lifexp-icon-pack-svg">${colorizePackSvg(entry.svg)}</span>`;
    }
    if (entry.src || entry.path) {
      const alt = decorative ? '' : label;
      return `<img class="lifexp-icon-image" src="${escapeAttribute(entry.src || entry.path)}" alt="${escapeAttribute(alt)}" decoding="async">`;
    }
    return null;
  }

  function render(value, options = {}) {
    const reference = resolveReference(value, options);
    const size = safeSize(options.size);
    const label = labelFor(value, options, reference);
    const decorative = options.decorative !== false;
    const color = safeColor(options.color || value?.color || DEFAULT_COLOR);
    const packBody = renderPackEntry(packEntries[reference], label, decorative);
    const fallbackBody = `<svg class="lifexp-icon-svg" width="${size}" height="${size}" viewBox="0 0 40 40" focusable="false"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${FALLBACK_PATHS[fallbackReference(reference)]}</g></svg>`;
    const body = packBody || fallbackBody;
    const accessibility = decorative
      ? 'aria-hidden="true"'
      : `role="img" aria-label="${escapeAttribute(label)}"`;
    const className = reference.replace(/[^a-z0-9_-]+/gi, '-');
    return `<span class="lifexp-icon lifexp-icon-${className}" ${accessibility} style="--lifexp-icon-size:${size}px;width:${size}px;height:${size}px;color:${color};display:inline-flex;align-items:center;justify-content:center;vertical-align:middle;line-height:1">${body}</span>`;
  }

  function renderItem(item, options = {}) {
    return render(item, { ...options, kind: 'item' });
  }

  function renderClass(cls, options = {}) {
    return render(cls, { ...options, kind: 'class' });
  }

  function renderEnemy(enemy, options = {}) {
    return render(enemy, { ...options, kind: 'enemy' });
  }

  function renderCategory(category, options = {}) {
    return render(category, { ...options, kind: 'category' });
  }

  function renderAction(action, options = {}) {
    return render(action, { ...options, kind: 'action' });
  }

  function renderUI(reference, options = {}) {
    return render(reference, { ...options, kind: 'ui' });
  }

  function registerPack(pack) {
    if (!pack || typeof pack !== 'object' || !pack.entries || typeof pack.entries !== 'object') return false;
    Object.entries(pack.entries).forEach(([reference, entry]) => {
      const canonical = canonicalReference(reference) || reference;
      if (canonical && entry && typeof entry === 'object') packEntries[canonical] = { ...entry };
    });
    return true;
  }

  function getPackInfo() {
    return { contractVersion: CONTRACT_VERSION, registeredEntries: Object.keys(packEntries).length };
  }

  function hydrateStaticIcons(root) {
    if (typeof document === 'undefined') return 0;
    const scope = root && typeof root.querySelectorAll === 'function' ? root : document;
    const mounts = [];
    if (scope.nodeType === 1 && scope.hasAttribute('data-lifexp-icon')) mounts.push(scope);
    scope.querySelectorAll('[data-lifexp-icon]').forEach(mount => mounts.push(mount));
    let hydrated = 0;
    mounts.forEach(mount => {
      if (mount.getAttribute('data-lifexp-icon-ready') === 'true') return;
      const reference = mount.getAttribute('data-lifexp-icon');
      if (!reference) return;
      const size = Number(mount.getAttribute('data-icon-size'));
      const label = mount.getAttribute('data-icon-label') || undefined;
      mount.innerHTML = render(reference, {
        size: Number.isFinite(size) ? size : DEFAULT_SIZE,
        label,
        decorative: mount.getAttribute('data-icon-decorative') !== 'false'
      });
      mount.setAttribute('data-lifexp-icon-ready', 'true');
      hydrated += 1;
    });
    return hydrated;
  }

  global.LifeXPIcons = Object.freeze({
    contractVersion: CONTRACT_VERSION,
    canonicalReference,
    resolveReference,
    render,
    renderItem,
    renderClass,
    renderEnemy,
    renderCategory,
    renderAction,
    renderUI,
    registerPack,
    getPackInfo,
    getFallbackReferences: () => Object.keys(FALLBACK_PATHS),
    hydrateStaticIcons
  });

  if (typeof document !== 'undefined') hydrateStaticIcons(document);
})(typeof window !== 'undefined' ? window : globalThis);
