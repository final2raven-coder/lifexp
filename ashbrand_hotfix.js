// Deprecated compatibility shim for the historical Ashbrand hotfix.
// Ashbrand is now defined in items.js under its stable legacy id:
// `cuchilla_llameante`.
//
// This file intentionally does not grant items, overwrite UI functions, or
// mutate unrelated saves. It only canonicalizes aliases that may already
// exist in an older save, preserving inventory, stash, equipment and progress.
(function () {
  'use strict';

  const CANONICAL_ID = 'cuchilla_llameante';
  const ALIASES = new Set(['ashbrand', 'cuchilla llameante', 'cuchilla_llameante']);

  function normalize(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  function isAlias(value) {
    return ALIASES.has(normalize(value));
  }

  function canonicalizeList(list) {
    if (!Array.isArray(list)) return;
    list.forEach(slot => {
      if (!slot || typeof slot !== 'object') return;
      if ([slot.id, slot.name, slot.legacyName, slot.itemName].some(isAlias)) {
        slot.id = CANONICAL_ID;
        delete slot.name;
        delete slot.legacyName;
        delete slot.itemName;
      }
    });
  }

  function migrate() {
    if (typeof gameState === 'undefined') return;
    canonicalizeList(gameState.inventory);
    canonicalizeList(gameState.stash);

    if (gameState.equipment && typeof gameState.equipment === 'object') {
      Object.keys(gameState.equipment).forEach(slot => {
        if (isAlias(gameState.equipment[slot])) gameState.equipment[slot] = CANONICAL_ID;
      });
    }

    const itemSystem = gameState.itemSystem || {};
    for (const key of ['attunement', 'equipAttempts', 'firstEquipped']) {
      const state = itemSystem[key];
      if (!state || state[CANONICAL_ID] != null || state.ashbrand == null) continue;
      state[CANONICAL_ID] = state.ashbrand;
      delete state.ashbrand;
    }

    if (typeof saveGame === 'function') saveGame();
  }

  window.LifeXPAshbrandHotfix = { install: migrate, deprecated: true };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', migrate, { once: true });
  } else {
    migrate();
  }
})();
