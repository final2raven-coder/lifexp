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

  const presentationLabels = {
    categories: {
      casa: 'Home',
      cuerpo: 'Body',
      gestiones: 'Errands',
      social: 'Social',
      personal: 'Personal'
    },
    frequencies: {
      daily: 'Daily',
      weekly: 'Weekly',
      fortnightly: 'Every two weeks',
      biweekly: 'Every two weeks',
      monthly: 'Monthly',
      quarterly: 'Every three months',
      halfyearly: 'Every six months',
      yearly: 'Yearly',
      annual: 'Yearly',
      once: 'One time'
    },
    itemTypes: {
      weapon: 'Weapon',
      armor: 'Armor',
      accessory: 'Accessory',
      artifact: 'Artifact',
      consumable: 'Consumable',
      material: 'Material',
      skill: 'Skill',
      key: 'Key item'
    },
    rarities: {
      common: 'Common',
      uncommon: 'Uncommon',
      rare: 'Rare',
      epic: 'Epic',
      legendary: 'Legendary'
    },
    statuses: {
      available: 'Available',
      completed: 'Completed',
      cooldown: 'On cooldown',
      archived: 'Archived',
      needs_review: 'Needs review',
      granted: 'Granted',
      pending: 'Recovery available',
      rejected: 'Unresolved reward'
    }
  };

  function getPresentationLabel(group, key, fallback) {
    if (key == null || key === '') return fallback;
    return presentationLabels[group]?.[String(key).toLowerCase()] || fallback;
  }

  function getItemPresentation(entry) {
    const id = resolve(entry);
    const item = id ? ITEMS[id] : null;
    if (!item) {
      return {
        id: null,
        name: 'Unresolved item',
        description: 'This item could not be identified. Recovery is available.',
        typeLabel: 'Item',
        rarityLabel: null,
        unresolved: true,
        reference: typeof entry === 'string'
          ? entry
          : (entry?.itemId || entry?.id || entry?.name || null)
      };
    }
    return {
      id,
      name: item.name || 'Unnamed item',
      description: item.desc || item.description || '',
      typeLabel: getPresentationLabel('itemTypes', item.type, 'Item'),
      rarityLabel: getPresentationLabel('rarities', item.rarity, 'Unknown rarity'),
      unresolved: false,
      item
    };
  }

  function getRewardPresentation(entry) {
    return getItemPresentation(entry);
  }

  function getTaskPresentation(task) {
    return {
      categoryLabel: getPresentationLabel('categories', task?.cat, 'Adventure'),
      frequencyLabel: getPresentationLabel('frequencies', task?.freq, 'Schedule not specified')
    };
  }

  function getStatusPresentation(status, fallback = 'Unknown status') {
    return presentationLabels.statuses[String(status || '').toLowerCase()] || fallback;
  }

  window.LifeXPPresentation = {
    getItem: getItemPresentation,
    getReward: getRewardPresentation,
    getTask: getTaskPresentation,
    getCategoryLabel: key => getPresentationLabel('categories', key, 'Adventure'),
    getFrequencyLabel: key => getPresentationLabel('frequencies', key, 'Schedule not specified'),
    getItemTypeLabel: key => getPresentationLabel('itemTypes', key, 'Item'),
    getRarityLabel: key => getPresentationLabel('rarities', key, 'Unknown rarity'),
    getStatusLabel: getStatusPresentation
  };

  function ensurePendingLootState() {
    if (typeof gameState === 'undefined') return null;
    if (typeof normalizePendingLootState === 'function') {
      const normalized = normalizePendingLootState(gameState.pendingLoot, []);
      if (JSON.stringify(normalized) !== JSON.stringify(gameState.pendingLoot)) gameState.pendingLoot = normalized;
      return gameState.pendingLoot;
    }
    if (!gameState.pendingLoot || !Array.isArray(gameState.pendingLoot.entries)) {
      gameState.pendingLoot = { version: 1, entries: [] };
    }
    return gameState.pendingLoot;
  }

  function ensureRewardLedger() {
    if (typeof gameState === 'undefined') return null;
    if (!gameState.rewardLedger || typeof gameState.rewardLedger !== 'object' || Array.isArray(gameState.rewardLedger)) {
      gameState.rewardLedger = {};
    }
    return gameState.rewardLedger;
  }

  function getRewardInput(entry) {
    if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
      return entry.itemId ?? entry.id ?? entry.requestedItem ?? entry.name ?? entry.itemName ?? null;
    }
    return entry;
  }

  function getRewardQuantity(entry, options) {
    const value = options.quantity ?? entry?.quantity ?? entry?.qty ?? 1;
    const quantity = Number(value);
    return Number.isFinite(quantity) ? Math.max(1, Math.floor(quantity)) : 1;
  }

  let generatedClaimSequence = 0;

  function getRewardClaimId(entry, options, source, input) {
    if (typeof options.claimId === 'string' && options.claimId) return options.claimId;
    if (entry && typeof entry === 'object' && typeof entry.claimId === 'string' && entry.claimId) return entry.claimId;
    generatedClaimSequence += 1;
    return `reward:${source || 'unknown'}:${Date.now()}:${generatedClaimSequence}`;
  }

  function getPendingEntryIndex(queue, claimId) {
    return queue.entries.findIndex(entry => entry && entry.claimId === claimId);
  }

  function upsertPendingEntry(queue, entry) {
    const index = getPendingEntryIndex(queue, entry.claimId);
    if (index === -1) queue.entries.push(entry);
    else queue.entries[index] = { ...queue.entries[index], ...entry };
  }

  function removePendingEntry(queue, claimId) {
    const index = getPendingEntryIndex(queue, claimId);
    if (index !== -1) queue.entries.splice(index, 1);
  }

  function persistRewardState() {
    if (typeof saveGame === 'function') saveGame();
  }

  function createPendingEntry({ claimId, input, itemId, quantity, source, reason, status, metadata }) {
    const item = itemId && typeof ITEMS !== 'undefined' ? ITEMS[itemId] : null;
    const displayName = typeof input === 'object' && input !== null
      ? (input.displayName || input.name || input.itemName || item?.name || itemId || null)
      : (item?.name || (typeof input === 'string' ? input : null));
    return {
      claimId,
      itemId: itemId || (typeof input === 'string' ? input : null),
      requestedItem: typeof input === 'object' && input !== null ? (input.requestedItem || input.itemId || input.id || input.name || null) : input,
      quantity,
      displayName,
      source,
      reason,
      status,
      createdAt: new Date().toISOString(),
      metadata: typeof input === 'object' && input !== null && input.metadata ? { ...input.metadata, ...(metadata || {}) } : { ...(metadata || {}) }
    };
  }

  function rewardResult(status, details = {}) {
    return { status, granted: status === 'granted', pending: status === 'pending', rejected: status === 'rejected', ...details };
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
      return rewardResult('granted', { claimId, itemId: resolvedId, quantity, duplicate: false, stacked: insertion?.stacked === true });
    }

    const reason = insertion?.reason || 'inventory_rejected';
    const status = reason === 'full' ? 'pending' : 'rejected';
    const pending = createPendingEntry({ claimId, input: entry, itemId: resolvedId, quantity, source, reason, status, metadata: options.metadata });
    upsertPendingEntry(queue, pending);
    ledger[claimId] = { status, itemId: resolvedId, quantity, source, reason, updatedAt: new Date().toISOString() };
    persistRewardState();
    return rewardResult(status, { claimId, itemId: resolvedId, quantity, reason, recoverable: true, pending: true, displayName: pending.displayName });
  }

  function getPendingLoot() {
    const queue = ensurePendingLootState();
    return queue ? queue.entries.map(entry => ({ ...entry, metadata: { ...(entry.metadata || {}) } })) : [];
  }

  function retryPendingLoot() {
    const queue = ensurePendingLootState();
    if (!queue) return [];
    return [...queue.entries].map(entry => deliverReward(entry, {
      claimId: entry.claimId,
      source: entry.source,
      retryRejected: true,
      metadata: entry.metadata
    }));
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
      if (!item) return `<div class="inv-slot inv-slot-recovery" role="button" tabindex="0" onclick="showLegacyItemModal(${index})"><div class="recovery-icon">?</div><div>Unresolved item</div><small>Recovery available</small></div>`;
      const rarity = RARITY[item.rarity] || RARITY.common;
      const qty = Number(entry.qty || entry.quantity || 1);
      const action = `${openFn}('${id}')`;
      return `<div class="inv-slot item-card" role="button" tabindex="0" aria-label="Open ${String(item.name).replace(/"/g, '&quot;')}" onclick="${action}" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();${action}}" style="border-color:${rarity.color}"><div class="item-card-icon">${icon(item, 40)}</div><div class="item-card-name" style="color:${rarity.color}">${String(item.name).replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}</div>${qty > 1 ? `<div class="item-card-qty">x${qty}</div>` : ''}</div>`;
    }).join('');
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
  window.renderCanonicalInventory = function () { render('inventory-grid', 'inventory-empty', 'inventory', 'showItemModal'); };
  window.renderCanonicalStash = function () { render('stash-grid', 'stash-empty', 'stash', 'showStashItemModal'); };
  window.normalizeItemText = text;
  window.migrateLegacyAshbrand = migrateLegacyAshbrand;

  window.emergencyRerollLegacyItem = function (slotIndex) {
    if (typeof gameState === 'undefined' || !Array.isArray(gameState.inventory)) {
      return { success: false, reason: 'inventory_unavailable' };
    }
    const original = gameState.inventory[slotIndex];
    if (original == null) return { success: false, reason: 'slot_unavailable' };
    if (original.recoveryUsed) return { success: false, reason: 'recovery_already_used' };
    try {
      const raw = localStorage.getItem('lifexp_save');
      if (raw && !localStorage.getItem('lifexp_recovery_backup_v15')) {
        localStorage.setItem('lifexp_recovery_backup_v15', raw);
      }
    } catch (e) { console.warn('Recovery backup unavailable:', e); }
    const resolved = resolve(original);
    if (!resolved) return { success: false, reason: 'item_unresolvable' };
    const slot = typeof original === 'string'
      ? { id: resolved, qty: 1 }
      : { ...original, id: resolved, qty: Math.max(1, Number(original.qty ?? original.quantity ?? 1) || 1) };
    delete slot.itemId; delete slot.itemID; delete slot.itemKey; delete slot.key;
    delete slot.name; delete slot.legacyName; delete slot.itemName;
    slot.recoveryUsed = true;
    slot.recoveredAtBuild = BUILD;
    gameState.inventory[slotIndex] = slot;
    if (typeof saveGame === 'function') saveGame();
    return { success: true, method: 'canonical_id', id: resolved };
  };

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