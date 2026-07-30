// LifeXP canonical inventory compatibility and legacy recovery.
function normalizeItemText(value) {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}
(function () {
  'use strict';
  const BUILD = 'v15-ashbrand-recovery-idempotent';
  const ALIASES = {
    ashbrand: 'cuchilla_llameante',
    'cuchilla llameante': 'cuchilla_llameante',
    'flaming blade': 'cuchilla_llameante',
    'daga corrosiva': 'daga_corrosiva',
    'espada radiante': 'espada_radiante',
    'hoja gelida': 'hoja_gelida',
    'arco de espino': 'arco_espino',
    'tridente marino': 'tridente_marino',
    'katana oriental': 'katana_oriental'
  };
  function resolve(entry) {
    if (entry == null || typeof ITEMS === 'undefined') return null;
    const values = typeof entry === 'string' ? [entry] : [entry.id, entry.itemId, entry.itemID, entry.itemKey, entry.key, entry.name, entry.legacyName, entry.itemName];
    for (const raw of values) {
      if (raw == null || typeof raw === 'object') continue;
      const value = String(raw);
      const key = normalizeItemText(value);
      if (ITEMS[value]) return value;
      if (ALIASES[key]) return ALIASES[key];
      const byName = Object.entries(ITEMS).find(([id, item]) => normalizeItemText(item?.name) === key);
      if (byName) return byName[0];
      const byId = Object.keys(ITEMS).find(id => normalizeItemText(id) === key || normalizeItemText(id.replaceAll('_', ' ')) === key);
      if (byId) return byId;
    }
    return null;
  }
  function repair() {
    if (typeof gameState === 'undefined') return false;
    let changed = false;
    for (const key of ['inventory', 'stash']) {
      const list = Array.isArray(gameState[key]) ? gameState[key] : [];
      gameState[key] = list.map(original => {
        const id = resolve(original);
        if (!id) return original;
        const slot = typeof original === 'string' ? { id, qty: 1 } : { ...original, id, qty: Math.max(1, Number(original.qty ?? original.quantity ?? 1) || 1) };
        delete slot.itemId; delete slot.itemID; delete slot.itemKey; delete slot.key; delete slot.name; delete slot.legacyName; delete slot.itemName;
        slot.recoveredAtBuild = slot.recoveredAtBuild || BUILD;
        if (JSON.stringify(slot) !== JSON.stringify(original)) changed = true;
        return slot;
      });
    }
    if (changed && typeof saveGame === 'function') saveGame();
    return changed;
  }
  window.emergencyRerollLegacyItem = function (slotIndex) {
    if (typeof gameState === 'undefined' || !Array.isArray(gameState.inventory)) return { success: false, reason: 'inventory_unavailable' };
    const original = gameState.inventory[slotIndex];
    if (original == null) return { success: false, reason: 'slot_unavailable' };
    const slot = typeof original === 'string' ? { legacyName: original, qty: 1 } : { ...original };
    if (slot.recoveryUsed) return { success: false, reason: 'recovery_already_used' };
    try {
      const raw = localStorage.getItem('lifexp_save');
      if (raw && !localStorage.getItem('lifexp_recovery_backup_v15')) localStorage.setItem('lifexp_recovery_backup_v15', raw);
    } catch (error) { console.warn('Recovery backup unavailable:', error); }
    const resolved = resolve(slot);
    const id = resolved || 'cuchilla_llameante';
    if (typeof ITEMS === 'undefined' || !ITEMS[id]) return { success: false, reason: 'item_definition_unavailable' };
    const recovered = { ...slot, id, qty: Math.max(1, Number(slot.qty ?? slot.quantity ?? 1) || 1), recoveryUsed: true, recoveredAtBuild: BUILD };
    delete recovered.itemId; delete recovered.itemID; delete recovered.itemKey; delete recovered.key; delete recovered.name; delete recovered.legacyName; delete recovered.itemName;
    gameState.inventory[slotIndex] = recovered;
    if (typeof saveGame === 'function') saveGame();
    return { success: true, method: resolved ? 'canonical_id' : 'legacy_fallback', id };
  };
  function icon(item) {
    const color = (typeof RARITY !== 'undefined' && RARITY[item?.rarity]?.color) || '#c9c5bb';
    return `<svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true" style="color:${color}"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 31 28 7l4 4-18 24H10z"/><path d="m8 33 8-2M25 10l4 4"/></g></svg>`;
  }
  function card(entry, index, stash) {
    const id = resolve(entry);
    const item = id && typeof ITEMS !== 'undefined' ? ITEMS[id] : null;
    if (!item) return `<div class="inv-slot inv-slot-recovery" role="button" tabindex="0" onclick="showLegacyItemModal(${index})"><div class="recovery-icon">?</div><div>Objeto no identificado</div><small>Revisar recuperación</small></div>`;
    const rarity = (typeof RARITY !== 'undefined' && RARITY[item.rarity]) || { color: '#c9c5bb' };
    const qty = Number(entry?.qty || entry?.quantity || 1);
    const fn = stash ? 'showStashItemModal' : 'showItemModal';
    return `<div class="inv-slot item-card" role="button" tabindex="0" onclick="${fn}('${id}')" style="border-color:${rarity.color}"><div class="item-card-icon">${icon(item)}</div><div class="item-card-name" style="color:${rarity.color}">${String(item.name || id)}</div>${qty > 1 ? `<div class="item-card-qty">x${qty}</div>` : ''}</div>`;
  }
  function render(listId, emptyId, key, stash) {
    const grid = document.getElementById(listId);
    if (!grid || typeof gameState === 'undefined') return;
    repair();
    const list = Array.isArray(gameState[key]) ? gameState[key] : [];
    document.getElementById(emptyId)?.classList.toggle('hidden', list.length > 0);
    grid.innerHTML = list.map((entry, index) => card(entry, index, stash)).join('');
  }
  window.LifeXPInventory = { BUILD, resolve, repair };
  window.renderInventoryGrid = () => render('inventory-grid', 'inventory-empty', 'inventory', false);
  window.renderStashGrid = () => render('stash-grid', 'stash-empty', 'stash', true);
  repair();
})();
