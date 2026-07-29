// LifeXP Hotfix 2.2 - deterministic runtime repair for Ashbrand.
// Load after game.js, items.js and optional expansion modules.
(function () {
  'use strict';
  const HOTFIX_ID = 'lifexp_hotfix_2_2_ashbrand_runtime_repair';
  const ID = 'cuchilla_llameante';
  const COMPLETE = {
    id: ID,
    name: 'Ashbrand',
    rarity: 'rare',
    type: 'weapon',
    lore: 'A short sword taken from a shrine after the fire had gone out. The blade is warm. It does not glow.',
    desc: 'A short sword taken from a shrine after the fire had gone out. The blade is warm. It does not glow.',
    // Ashbrand intentionally has no direct stat bonus. Its power is earned through use.
    stats: {},
    effects: [
      { id: 'burning_edge', name: 'Burn', trigger: 'on_hit', status: 'burn', unlockStage: 1, chance: 0.35, duration: 3, damage: 4, description: 'Attacks can apply Burn for 3 turns.' },
      { id: 'pressure', name: 'Pressure', trigger: 'on_hit', status: 'burn', unlockStage: 3, activationRequired: true, chance: 0.15, duration: 2, damage: 2, description: 'A burning target can receive another, shorter Burn.' }
    ],
    requirements: { stats: { fue: 12 }, trainingId: null },
    attunement: {
      required: true,
      max: 3,
      minimumStage: 1,
      themes: ['fuego', 'fuego_comida'],
      stages: [
        'The blade resists your hand with sudden heat.',
        'The edge catches on fire when you press the attack.',
        'The old heat answers without being forced.'
      ]
    },
    activation: {
      type: 'task_threshold',
      description: 'Complete three fire-related tasks, then attempt the ritual in the app.',
      instruction: 'The old fire is ready to answer.',
      requirement: { themes: ['fuego', 'fuego_comida'], count: 3 },
      unlocks: ['pressure']
    }
  };

  function backup() {
    try {
      const raw = localStorage.getItem('lifexp_save');
      if (raw && !localStorage.getItem('lifexp_hotfix_2_2_backup')) {
        localStorage.setItem('lifexp_hotfix_2_2_backup', raw);
        localStorage.setItem('lifexp_hotfix_2_2_backup_time', new Date().toISOString());
      }
    } catch (e) { console.warn('Ashbrand hotfix backup unavailable:', e); }
  }

  function normalize(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  function isAshbrand(value) {
    return ['ashbrand', 'cuchilla llameante', 'cuchilla_llameante'].includes(normalize(value));
  }

  // Recover every known legacy shape without changing quantity or metadata.
  function canonicalize(container) {
    if (!Array.isArray(container)) return;
    for (const slot of container) {
      if (!slot || typeof slot !== 'object') continue;
      const candidates = [slot.id, slot.name, slot.legacyName, slot.itemName];
      if (candidates.some(isAshbrand)) {
        slot.id = ID;
        delete slot.name;
        delete slot.legacyName;
        delete slot.itemName;
      }
    }
  }

  function canonicalizeEquipment(equipment) {
    if (!equipment || typeof equipment !== 'object') return;
    for (const slot of Object.keys(equipment)) {
      if (isAshbrand(equipment[slot])) equipment[slot] = ID;
    }
  }

  function install() {
    if (typeof gameState === 'undefined' || typeof ITEMS === 'undefined') return;

    // Always apply the canonical definition before checking the migration marker.
    // This repairs saves that were marked by an earlier hotfix but still contain
    // legacy item data or a stale/common rarity in the runtime definition.
    backup();
    Object.assign(ITEMS, { [ID]: { ...(ITEMS[ID] || {}), ...COMPLETE } });
    canonicalize(gameState.inventory);
    canonicalize(gameState.stash);
    canonicalizeEquipment(gameState.equipment);

    gameState.inventory = Array.isArray(gameState.inventory) ? gameState.inventory : [];
    gameState.stash = Array.isArray(gameState.stash) ? gameState.stash : [];
    const owned = gameState.inventory.some(x => x?.id === ID) ||
      gameState.stash.some(x => x?.id === ID) ||
      Object.values(gameState.equipment || {}).includes(ID);
    if (!owned) {
      gameState.inventory.push({
        id: ID,
        qty: 1,
        obtainedAt: typeof todayStr === 'function' ? todayStr() : new Date().toISOString().slice(0, 10)
      });
    }

    gameState.__lifexpHotfix = HOTFIX_ID;
    if (typeof initializeItemSystem === 'function') initializeItemSystem();
    if (typeof renderInventory === 'function') renderInventory();
    if (typeof saveGame === 'function') saveGame();
  }

  window.LifeXPAshbrandHotfix = { install, definition: COMPLETE };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
})();
