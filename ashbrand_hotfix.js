// LifeXP Ashbrand compatibility, canonical repair and English equip feedback.
// Loaded last so legacy content cannot overwrite the canonical definition.
(function () {
  'use strict';

  const ID = 'cuchilla_llameante';
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
        slot.id = ID;
        delete slot.name;
        delete slot.legacyName;
        delete slot.itemName;
      }
    });
  }

  function repairDefinition() {
    if (typeof ITEMS === 'undefined') return;
    const current = ITEMS[ID] || {};
    ITEMS[ID] = {
      ...current,
      id: ID,
      name: 'Ashbrand',
      type: 'weapon',
      rarity: 'common',
      icon: 'FIRE',
      lore: 'Ashbrand remembers a fire that refused to become a ruin.',
      desc: 'A short sword taken from a shrine after the fire had gone out. The blade is warm. It does not glow.',
      stats: {},
      themes: ['fuego', 'fuego_comida', 'ash'],
      effects: [
        { id: 'burning_edge', name: 'Burning Edge', trigger: 'passive', unlockStage: 1, description: 'Attacks can apply Burn for 3 turns.' },
        { id: 'pressure', name: 'Pressure', trigger: 'passive', unlockStage: 3, activationRequired: true, description: 'A burning target can receive another, shorter Burn.' }
      ],
      requirements: { stats: { fue: 12, des: 12 }, trainingId: null },
      attunement: {
        required: true,
        max: 3,
        minimumStage: 1,
        themes: ['fuego', 'fuego_comida', 'ash'],
        stages: ['The blade resists your hand with sudden heat.', 'The edge catches on fire when you press the attack.', 'The old heat answers without being forced.']
      },
      activation: {
        type: 'task_threshold',
        description: 'Complete three fire-related tasks, then attempt the ritual in the app.',
        instruction: 'The old fire is ready to answer.',
        requirement: { themes: ['fuego', 'fuego_comida'], count: 3 },
        unlocks: ['pressure']
      }
    };
  }

  function backup() {
    try {
      const raw = localStorage.getItem('lifexp_save');
      if (raw && !localStorage.getItem('lifexp_ashbrand_canonical_backup')) {
        localStorage.setItem('lifexp_ashbrand_canonical_backup', raw);
        localStorage.setItem('lifexp_ashbrand_canonical_backup_time', new Date().toISOString());
      }
    } catch (error) { console.warn('Ashbrand backup unavailable:', error); }
  }

  function migrate() {
    if (typeof gameState === 'undefined') return;
    backup();
    canonicalizeList(gameState.inventory);
    canonicalizeList(gameState.stash);
    if (gameState.equipment && typeof gameState.equipment === 'object') {
      Object.keys(gameState.equipment).forEach(slot => {
        if (isAlias(gameState.equipment[slot])) gameState.equipment[slot] = ID;
      });
    }
    const itemSystem = gameState.itemSystem || {};
    ['attunement', 'equipAttempts', 'firstEquipped'].forEach(key => {
      const state = itemSystem[key];
      if (!state || state[ID] != null || state.ashbrand == null) return;
      state[ID] = state.ashbrand;
      delete state.ashbrand;
    });
    if (typeof saveGame === 'function') saveGame();
  }

  function failureText(itemId) {
    if (typeof getItemRequirementStatus !== 'function') return '';
    const status = getItemRequirementStatus(itemId) || {};
    if (status.canEquip || !Array.isArray(status.reasons) || !status.reasons.length) return '';
    const item = typeof getItemDefinition === 'function' ? getItemDefinition(itemId) : null;
    const name = item && item.name ? item.name : 'this item';
    const reasons = status.reasons.join('; ').replace(/^./, c => c.toLowerCase());
    return `You try to equip ${name}, but ${reasons}.`;
  }

  function installFailureContext() {
    if (typeof window.getItemFlavorText !== 'function' || window.getItemFlavorText.__lifexpAshbrandContext) return;
    const original = window.getItemFlavorText;
    function contextualFlavor(itemId, situation) {
      const flavor = original(itemId, situation);
      if (!String(situation || '').startsWith('equip_fail')) return flavor;
      const reason = failureText(itemId);
      return reason ? `${reason} ${flavor}` : flavor;
    }
    contextualFlavor.__lifexpAshbrandContext = true;
    window.getItemFlavorText = contextualFlavor;
  }

  function install() {
    repairDefinition();
    migrate();
    installFailureContext();
    if (typeof initializeItemSystem === 'function') initializeItemSystem();
    if (typeof renderInventory === 'function') renderInventory();
  }

  window.LifeXPAshbrandHotfix = { install, repairDefinition, deprecated: false };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
})();
