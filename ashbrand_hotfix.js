// Deprecated compatibility shim for historical Ashbrand saves and item UX.
// Ashbrand itself is defined canonically in items.js.
(function () {
  'use strict';

  const CANONICAL_ID = 'cuchilla_llameante';
  const ALIASES = new Set(['ashbrand', 'cuchilla llameante', 'cuchilla_llameante']);

  function normalize(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  function isAlias(value) { return ALIASES.has(normalize(value)); }

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
    ['attunement', 'equipAttempts', 'firstEquipped'].forEach(key => {
      const state = itemSystem[key];
      if (!state || state[CANONICAL_ID] != null || state.ashbrand == null) return;
      state[CANONICAL_ID] = state.ashbrand;
      delete state.ashbrand;
    });
    if (typeof saveGame === 'function') saveGame();
  }

  function getFailureReasonText(itemId) {
    if (typeof getItemRequirementStatus !== 'function') return '';
    const status = getItemRequirementStatus(itemId);
    if (!status || !Array.isArray(status.reasons) || !status.reasons.length) return '';
    const item = typeof getItemDefinition === 'function' ? getItemDefinition(itemId) : null;
    return `No puedes equipar ${item?.name || 'este objeto'} todavía: ${status.reasons.join('; ')}.`;
  }

  // Keep the existing narrative system, but make failed attempts explain the
  // actual blocking requirement instead of hiding it behind pure atmosphere.
  function installFailureContext() {
    if (typeof window.getItemFlavorText !== 'function' || window.getItemFlavorText.__lifexpFailureContext) return;
    const original = window.getItemFlavorText;
    function withRequirementContext(itemId, situation) {
      const flavor = original(itemId, situation);
      if (!String(situation || '').startsWith('equip_fail')) return flavor;
      const reason = getFailureReasonText(itemId);
      return reason ? `${reason} ${flavor}` : flavor;
    }
    withRequirementContext.__lifexpFailureContext = true;
    window.getItemFlavorText = withRequirementContext;
  }

  window.LifeXPAshbrandHotfix = { install: migrate, deprecated: true };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { migrate(); installFailureContext(); }, { once: true });
  } else {
    migrate();
    installFailureContext();
  }
})();