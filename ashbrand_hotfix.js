// Deprecated compatibility shim for historical Ashbrand saves.
// Ashbrand is defined canonically in items.js and native save migration lives in game.js.
// This file intentionally grants no loot and does not patch UI or equipment behavior.
(function () {
  'use strict';

  const CANONICAL_ID = 'cuchilla_llameante';
  const ALIASES = new Set(['ashbrand', 'cuchilla llameante', 'cuchilla_llameante']);

  function normalize(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  function isAlias(value) { return ALIASES.has(normalize(value)); }

  function canonicalizeList(list) {
    if (!Array.isArray(list)) return false;
    let changed = false;
    list.forEach(slot => {
      if (!slot || typeof slot !== 'object') return;
      if ([slot.id, slot.name, slot.legacyName, slot.itemName].some(isAlias)) {
        slot.id = CANONICAL_ID;
        delete slot.name;
        delete slot.legacyName;
        delete slot.itemName;
        changed = true;
      }
    });
    return changed;
  }

  function migrate() {
    if (typeof gameState === 'undefined') return false;
    let changed = canonicalizeList(gameState.inventory) || canonicalizeList(gameState.stash);
    if (gameState.equipment && typeof gameState.equipment === 'object') {
      Object.keys(gameState.equipment).forEach(slot => {
        if (isAlias(gameState.equipment[slot])) {
          gameState.equipment[slot] = CANONICAL_ID;
          changed = true;
        }
      });
    }
    const itemSystem = gameState.itemSystem || {};
    ['attunement', 'equipAttempts', 'firstEquipped'].forEach(key => {
      const state = itemSystem[key];
      if (!state || typeof state !== 'object') return;
      if (state.ashbrand != null && state[CANONICAL_ID] == null) {
        state[CANONICAL_ID] = state.ashbrand;
        changed = true;
      }
      if (Object.prototype.hasOwnProperty.call(state, 'ashbrand')) {
        delete state.ashbrand;
        changed = true;
      }
    });
    if (changed && typeof saveGame === 'function') saveGame();
    return changed;
  }

  window.LifeXPAshbrandHotfix = { install: migrate, deprecated: true };
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', migrate, { once: true });
    else migrate();
  }
})();
