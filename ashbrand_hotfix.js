// LifeXP inventory compatibility shim.
// This file is kept for backwards-compatible deployment.
// All canonical alias resolution and inventory repair logic lives in inventory_system.js.
// normalizeItemText is kept as a global because game.js references it at runtime.
function normalizeItemText(value) {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

// Emergency slot recovery tool (available from emergency-save.html and the console).
// Delegates to the canonical inventory system when available.
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
  const inv = window.LifeXPInventory;
  if (!inv || typeof inv.resolve !== 'function') {
    return { success: false, reason: 'inventory_system_unavailable' };
  }
  const resolved = inv.resolve(original);
  if (!resolved) return { success: false, reason: 'item_unresolvable' };
  const slot = typeof original === 'string'
    ? { id: resolved, qty: 1 }
    : { ...original, id: resolved, qty: Math.max(1, Number(original.qty ?? original.quantity ?? 1) || 1) };
  delete slot.itemId; delete slot.itemID; delete slot.itemKey; delete slot.key;
  delete slot.name; delete slot.legacyName; delete slot.itemName;
  slot.recoveryUsed = true;
  slot.recoveredAtBuild = 'v16-unified-aliases';
  gameState.inventory[slotIndex] = slot;
  if (typeof saveGame === 'function') saveGame();
  return { success: true, method: 'canonical_id', id: resolved };
};
