// LifeXP canonical inventory subsystem.
// Compatibility is part of the data contract, not a migration-only hotfix.
//
// Fase D (saneamiento): este fichero absorbe los dos simbolos publicos que
// antes vivia en ashbrand_hotfix.js:
//   - window.normalizeItemText  (alias de la funcion interna text())
//   - window.emergencyRerollLegacyItem  (herramienta de recuperacion de slots)
// ashbrand_hotfix.js queda como stub vacio de compatibilidad.
(function () {
  'use strict';

  const BUILD = 'v15-merged-hotfix';
  const aliases = {
    'cuchilla llameante': 'cuchilla_llameante',
    'flaming blade': 'cuchilla_llameante',
    'ashbrand': 'cuchilla_llameante',
    'daga corrosiva': 'daga_corrosiva',
    'espada radiante': 'espada_radiante',
    'hoja gelida': 'hoja_gelida',
    'arco de espino': 'arco_espino',
    'tridente marino': 'tridente_marino',
    'katana oriental': 'katana_oriental',
    'seda araña': 'seda_arana',
    'fragmento sueño': 'fragmento_sueno'
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
      const byId = Object.keys(ITEMS).find(id => text(id) === normalized);
      if (byId) return byId;
    }
    return null;
  }

  function normalize(entry) {
    const id = resolve(entry);
    if (!id || typeof ITEMS === 'undefined') return null;
    const item = ITEMS[id];
    const quantity = Math.max(1, Number(entry?.qty ?? entry?.quantity ?? 1) || 1);
    return { id, qty: quantity, item };
  }

  function listEntries(list) {
    return Array.isArray(list) ? list : [];
  }

  function repairList(list) {
    let changed = false;
    const result = [];
    for (const entry of listEntries(list)) {
      const normalized = normalize(entry);
      if (!normalized) {
        result.push(entry);
        continue;
      }
      const currentId = entry?.id;
      const currentQty = Number(entry?.qty ?? entry?.quantity ?? 1) || 1;
      if (currentId !== normalized.id || currentQty !== normalized.qty || entry?.quantity != null) changed = true;
      result.push({ ...entry, id: normalized.id, qty: normalized.qty, quantity: undefined });
      if (result[result.length - 1].quantity === undefined) delete result[result.length - 1].quantity;
    }
    return { list: result, changed };
  }

  function normalizeRewardEntry(entry) {
    if (entry == null) return null;
    if (typeof entry === 'string') return entry;
    if (typeof entry === 'object') return entry.itemId || entry.itemID || entry.id || entry.itemKey || entry.key || entry.name || entry.itemName || null;
    return null;
  }

  function getRewardInput(entry) {
    if (entry && typeof entry === 'object' && !Array.isArray(entry)) return normalizeRewardEntry(entry);
    return entry;
  }

  function getRewardQuantity(entry, options = {}) {
    const candidate = options.quantity ?? entry?.quantity ?? entry?.qty ?? 1;
    const quantity = Number(candidate);
    return Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1;
  }

  function rewardResult(status, details = {}) {
    return { status, ...details };
  }

  function ensurePendingLootState() {
    if (typeof gameState === 'undefined') return [];
    if (!Array.isArray(gameState.pendingLoot)) gameState.pendingLoot = [];
    return gameState.pendingLoot;
  }

  function ensureRewardLedger() {
    if (typeof gameState === 'undefined') return {};
    if (!gameState.rewardLedger || typeof gameState.rewardLedger !== 'object' || Array.isArray(gameState.rewardLedger)) gameState.rewardLedger = {};
    return gameState.rewardLedger;
  }

  function getClaimKeyPart(value) {
    if (value == null) return '';
    if (typeof value === 'object') {
      try { return JSON.stringify(value); } catch (_) { return String(value); }
    }
    return String(value);
  }

  function getRewardClaimId(entry, options, source, input) {
    return options.claimId || entry?.claimId || [source, getClaimKeyPart(input), getRewardQuantity(entry, options)].join('|');
  }

  function createPendingEntry({ claimId, input, itemId, quantity, source, reason, status, metadata }) {
    return {
      claimId,
      input,
      itemId,
      quantity,
      source,
      reason,
      status,
      displayName: typeof input === 'string' ? input : (input?.name || input?.itemName || input?.itemId || 'Unknown item'),
      metadata: metadata || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  function upsertPendingEntry(queue, entry) {
    const index = queue.findIndex(item => item?.claimId === entry.claimId);
    if (index >= 0) queue[index] = { ...queue[index], ...entry, updatedAt: new Date().toISOString() };
    else queue.push(entry);
  }

  function removePendingEntry(queue, claimId) {
    const index = queue.findIndex(item => item?.claimId === claimId);
    if (index >= 0) queue.splice(index, 1);
  }

  function persistRewardState() {
    if (typeof saveGame === 'function') saveGame();
  }

  function addToContainer(id, containerName, quantity) {
    if (typeof gameState === 'undefined') return { success: false, reason: 'game_state_unavailable' };
    if (!Array.isArray(gameState[containerName])) gameState[containerName] = [];
    const existing = gameState[containerName].find(entry => entry?.id === id);
    if (existing) existing.qty = Number(existing.qty || 0) + quantity;
    else gameState[containerName].push({ id, qty: quantity });
    return { success: true, id, quantity };
  }

  function deliverReward(entry, options = {}) {
    if (typeof gameState === 'undefined' || typeof ITEMS === 'undefined') {
      return rewardResult('rejected', { reason: 'inventory_unavailable', recoverable: false });
    }
    const queue = ensurePendingLootState();
    const ledger = ensureRewardLedger();
    const input = getRewardInput(entry);
    const source = options.source || entry?.source || 'unknown';
    const claimId = getRewardClaimId(entry, options, source, input);
    const quantity = getRewardQuantity(entry, options);
    const previous = ledger[claimId];

    if (previous?.status === 'granted') {
      return rewardResult('granted', { claimId, itemId: previous.itemId, quantity: previous.quantity, duplicate: true });
    }
    if (previous?.status === 'rejected' && options.retryRejected !== true) {
      return rewardResult('rejected', { claimId, itemId: previous.itemId || null, quantity: previous.quantity || quantity, reason: previous.reason, recoverable: true, duplicate: true });
    }

    const resolvedId = resolve(input);
    if (!resolvedId) {
      const pending = createPendingEntry({ claimId, input: entry, itemId: null, quantity, source, reason: 'unknown_item', status: 'rejected', metadata: options.metadata });
      upsertPendingEntry(queue, pending);
      ledger[claimId] = { status: 'rejected', itemId: null, quantity, source, reason: 'unknown_item', updatedAt: new Date().toISOString() };
      persistRewardState();
      return rewardResult('rejected', { claimId, itemId: null, quantity, reason: 'unknown_item', recoverable: true, pending: true, displayName: pending.displayName });
    }

    const insertion = typeof addToContainer === 'function'
      ? addToContainer(resolvedId, 'inventory', quantity)
      : { success: false, reason: 'inventory_api_unavailable' };
    const inserted = insertion === true || insertion?.success === true;
    if (inserted) {
      removePendingEntry(queue, claimId);
      ledger[claimId] = { status: 'granted', itemId: resolvedId, quantity, source, updatedAt: new Date().toISOString() };
      persistRewardState();
      return rewardResult('granted', { claimId, itemId: resolvedId, quantity });
    }

    const pending = createPendingEntry({ claimId, input: entry, itemId: resolvedId, quantity, source, reason: insertion?.reason || 'inventory_insert_failed', status: 'pending', metadata: options.metadata });
    upsertPendingEntry(queue, pending);
    ledger[claimId] = { status: 'pending', itemId: resolvedId, quantity, source, reason: pending.reason, updatedAt: new Date().toISOString() };
    persistRewardState();
    return rewardResult('pending', { claimId, itemId: resolvedId, quantity, reason: pending.reason, recoverable: true, pending: true });
  }

  function getPendingLoot() {
    return ensurePendingLootState().slice();
  }

  function retryPendingLoot(claimId) {
    const pending = ensurePendingLootState().find(entry => entry?.claimId === claimId);
    if (!pending) return rewardResult('rejected', { claimId, reason: 'pending_not_found', recoverable: false });
    return deliverReward(pending.input, { claimId, source: pending.source, quantity: pending.quantity, retryRejected: true, metadata: pending.metadata });
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

  function migrateLegacyAshbrand(container) {
    if (!Array.isArray(container)) return;
    container.forEach(slot => {
      if (slot && ['ashbrand', 'Ashbrand', 'cuchilla_llameante'].includes(slot.id)) slot.id = 'cuchilla_llameante';
    });
  }

  function recoverItemIfLost(canonicalId, options = {}) {
    if (typeof ITEMS === 'undefined' || typeof gameState === 'undefined') return false;
    if (!ITEMS[canonicalId]) return false;
    const legacyIds = new Set(options.legacyIds || []);
    const containers = [gameState.inventory, gameState.stash];
    let recoveredLegacy = false;
    for (const container of containers) {
      if (!Array.isArray(container)) continue;
      for (const slot of container) {
        if (!slot || !legacyIds.has(slot.id)) continue;
        slot.id = canonicalId;
        recoveredLegacy = true;
      }
    }
    if (gameState.equipment) {
      for (const slot of Object.keys(gameState.equipment)) {
        if (legacyIds.has(gameState.equipment[slot])) gameState.equipment[slot] = canonicalId;
      }
    }
    const owned = containers.some(container => Array.isArray(container) && container.some(slot => slot && slot.id === canonicalId)) || Object.values(gameState.equipment || {}).includes(canonicalId);
    if (!owned && (recoveredLegacy || options.alwaysRestore === true)) {
      if (!Array.isArray(gameState.inventory)) gameState.inventory = [];
      gameState.inventory.push({ id: canonicalId, qty: 1 });
      return true;
    }
    return recoveredLegacy;
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

  function renderInventory(targetId = 'inventory-grid', source = 'inventory') {
    const target = document.getElementById(targetId);
    if (!target || typeof gameState === 'undefined') return;
    const entries = Array.isArray(gameState[source]) ? gameState[source] : [];
    target.innerHTML = '';
    entries.forEach((entry, index) => {
      const item = ITEMS[entry?.id];
      const qty = Number(entry?.qty || 1);
      if (!item) return;
      const rarity = RARITY[item.rarity] || RARITY.common;
      const action = source === 'stash' ? `showStashItemModal(${index})` : `showItemModal(${index})`;
      target.innerHTML += `<div class="inv-slot item-card" role="button" tabindex="0" aria-label="Open ${String(item.name).replace(/"/g, '&quot;')}" onclick="${action}" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();${action}}" style="border-color:${rarity.color}"><div class="item-card-icon">${icon(item, 40)}</div><div class="item-card-name" style="color:${rarity.color}">${String(item.name).replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}</div>${qty > 1 ? `<div class="item-card-qty">x${qty}</div>` : ''}</div>`;
    });
  }

  window.LifeXPInventory = {
    BUILD,
    resolve,
    normalize,
    repair,
    recoverItemIfLost,
    deliverReward,
    getPendingLoot,
    retryPendingLoot
  };

  window.normalizeItemText = text;
  window.emergencyRerollLegacyItem = recoverItemIfLost;
  window.renderInventory = renderInventory;
})();
