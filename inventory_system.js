// LifeXP canonical inventory subsystem.
// Compatibility is part of the data contract, not a migration-only hotfix.
(function () {
  'use strict';

  const BUILD = 'v14-canonical-inventory';
  const aliases = {
    'cuchilla llameante': 'cuchilla_llameante',
    'flaming blade': 'cuchilla_llameante',
    'ashbrand': 'cuchilla_llameante',
    'daga corrosiva': 'daga_corrosiva',
    'espada radiante': 'espada_radiante',
    'hoja gelida': 'hoja_gelida',
    'hoja gélida': 'hoja_gelida',
    'arco de espino': 'arco_espino',
    'tridente marino': 'tridente_marino',
    'katana oriental': 'katana_oriental'
  };

  function text(value) {
    return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  function resolve(entry) {
    if (entry == null || typeof ITEMS === 'undefined') return null;
    const candidates = typeof entry === 'string'
      ? [entry]
      : [entry.id, entry.itemId, entry.itemID, entry.itemKey, entry.key, entry.name, entry.legacyName, entry.itemName];
    for (const candidate of candidates) {
      if (candidate == null || typeof candidate === 'object') continue;
      const value = String(candidate);
      if (ITEMS[value]) return value;
      const normalized = text(value);
      if (aliases[normalized]) return aliases[normalized];
      const byName = Object.entries(ITEMS).find(([id, item]) => text(item?.name) === normalized);
      if (byName) return byName[0];
      const byId = Object.keys(ITEMS).find(id => text(id) === normalized || text(id.replaceAll('_', ' ')) === normalized);
      if (byId) return byId;
    }
    return null;
  }

  function normalize(entry) {
    const id = resolve(entry);
    if (!id) return null;
    if (typeof entry === 'string') return { id, qty: 1 };
    return { ...entry, id, qty: Math.max(1, Number(entry.qty ?? entry.quantity ?? 1) || 1) };
  }

  function repairList(list) {
    if (!Array.isArray(list)) return { list: [], changed: false };
    let changed = false;
    const result = list.map(entry => {
      const normalized = normalize(entry);
      if (!normalized) return entry;
      const clean = { ...normalized };
      delete clean.itemId; delete clean.itemID; delete clean.itemKey; delete clean.key;
      delete clean.name; delete clean.legacyName; delete clean.itemName;
      clean.recoveredAtBuild = clean.recoveredAtBuild || BUILD;
      if (JSON.stringify(clean) !== JSON.stringify(entry)) changed = true;
      return clean;
    });
    return { list: result, changed };
  }

  function repair() {
    if (typeof gameState === 'undefined') return false;
    let changed = false;
    for (const key of ['inventory', 'stash']) {
      const repaired = repairList(gameState[key]);
      gameState[key] = repaired.list;
      changed ||= repaired.changed;
    }
    if (changed && typeof saveGame === 'function') saveGame();
    return changed;
  }

  function icon(item, size) {
    const type = item?.type || 'material';
    const color = RARITY[item?.rarity]?.color || '#c9c5bb';
    const paths = {
      weapon: '<path d="M10 31 28 7l4 4-18 24H10z"/><path d="m8 33 8-2M25 10l4 4"/>',
      armor: '<path d="M12 7c3 3 9 3 12 0l5 5-3 18H10L7 12l5-5z"/><path d="M16 10v17m4-17v17"/>',
      accessory: '<circle cx="20" cy="20" r="10"/><circle cx="20" cy="20" r="4"/>',
      artifact: '<path d="m20 5 5 9-5 15-5-15 5-9z"/><path d="M9 20h22M12 13h16"/>',
      consumable: '<path d="M14 6h12M16 6v6l-5 14c-.5 2 1 4 3 4h12c2 0 3.5-2 3-4l-5-14V6"/><path d="M13 21h14"/>',
      material: '<path d="m20 5 11 7-11 17L9 12 20 5z"/><path d="m9 12 11 7 11-7"/>',
      skill: '<path d="M10 5h20v30H10z"/><path d="M15 12h10M15 18h10M15 24h7"/>',
      key: '<circle cx="13" cy="25" r="6"/><path d="m18 21 13-13M25 12l4 4M21 16l4 4"/>'
    };
    return `<svg class="item-icon-svg" width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true" style="color:${color}"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths[type] || paths.material}</g></svg>`;
  }

  function render(listId, emptyId, container, openFn) {
    const grid = document.getElementById(listId);
    const empty = document.getElementById(emptyId);
    if (!grid || typeof gameState === 'undefined') return;
    repair();
    const list = Array.isArray(gameState[container]) ? gameState[container] : [];
    empty?.classList.toggle('hidden', list.length > 0);
    grid.innerHTML = list.map((entry, index) => {
      const id = resolve(entry);
      const item = id ? ITEMS[id] : null;
      if (!item) return `<div class="inv-slot inv-slot-recovery" role="button" tabindex="0" onclick="showLegacyItemModal(${index})"><div class="recovery-icon">?</div><div>Unidentified item</div><small>Review recovery</small></div>`;
      const rarity = RARITY[item.rarity] || RARITY.common;
      const qty = Number(entry.qty || entry.quantity || 1);
      const action = `${openFn}('${id}')`;
      return `<div class="inv-slot item-card" role="button" tabindex="0" aria-label="Open ${String(item.name).replace(/"/g, '&quot;')}" onclick="${action}" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();${action}}" style="border-color:${rarity.color}"><div class="item-card-icon">${icon(item, 40)}</div><div class="item-card-name" style="color:${rarity.color}">${String(item.name).replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}</div>${qty > 1 ? `<div class="item-card-qty">x${qty}</div>` : ''}</div>`;
    }).join('');
  }

  window.LifeXPInventory = { BUILD, resolve, normalize, repair };
  window.renderCanonicalInventory = function () { render('inventory-grid', 'inventory-empty', 'inventory', 'showItemModal'); };
  window.renderCanonicalStash = function () { render('stash-grid', 'stash-empty', 'stash', 'showStashItemModal'); };

  const previousRenderInventory = window.renderInventory;
  window.renderInventory = function () {
    repair();
    const capacity = typeof getInventoryCapacity === 'function' ? getInventoryCapacity() : 20;
    const count = (gameState.inventory || []).reduce((sum, entry) => sum + Number(entry.qty || entry.quantity || 1), 0);
    document.getElementById('inv-count')?.replaceChildren(document.createTextNode(`${count}/${capacity}`));
    const stashCount = (gameState.stash || []).reduce((sum, entry) => sum + Number(entry.qty || entry.quantity || 1), 0);
    document.getElementById('stash-count')?.replaceChildren(document.createTextNode(`${stashCount}/${gameState.stashCapacity || 30}`));
    if (typeof currentInventoryTab !== 'undefined' && currentInventoryTab === 'stash') render('stash-grid', 'stash-empty', 'stash', 'showStashItemModal');
    else if (typeof currentInventoryTab !== 'undefined' && currentInventoryTab === 'equipment' && typeof renderEquipment === 'function') renderEquipment();
    else render('inventory-grid', 'inventory-empty', 'inventory', 'showItemModal');
  };

  document.addEventListener('DOMContentLoaded', function () {
    repair();
    if (typeof window.renderInventory === 'function') window.renderInventory();
  }, { once: true });
})();
