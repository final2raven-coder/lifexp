// LifeXP Hotfix 2.3 - deterministic runtime repair for Ashbrand plus item UX compatibility.
// Load after game.js, items.js and optional expansion modules.
(function () {
  'use strict';
  const HOTFIX_ID = 'lifexp_hotfix_2_3_ashbrand_runtime_repair';
  const ID = 'cuchilla_llameante';
  const COMPLETE = {
    id: ID, name: 'Ashbrand', rarity: 'rare', type: 'weapon',
    lore: 'A short sword taken from a shrine after the fire had gone out. The blade is warm. It does not glow.',
    desc: 'A short sword taken from a shrine after the fire had gone out. The blade is warm. It does not glow.',
    stats: {},
    effects: [
      { id: 'burning_edge', name: 'Burn', trigger: 'on_hit', status: 'burn', unlockStage: 1, chance: 0.35, duration: 3, damage: 4, description: 'Attacks can apply Burn for 3 turns.' },
      { id: 'pressure', name: 'Pressure', trigger: 'on_hit', status: 'burn', unlockStage: 3, activationRequired: true, chance: 0.15, duration: 2, damage: 2, description: 'A burning target can receive another, shorter Burn.' }
    ],
    requirements: { stats: { fue: 12 }, trainingId: null },
    attunement: { required: true, max: 3, minimumStage: 1, themes: ['fuego', 'fuego_comida'], stages: [
      'The blade resists your hand with sudden heat.',
      'The edge catches on fire when you press the attack.',
      'The old heat answers without being forced.'
    ] },
    activation: { type: 'task_threshold', description: 'Complete three fire-related tasks, then attempt the ritual in the app.', instruction: 'The old fire is ready to answer.', requirement: { themes: ['fuego', 'fuego_comida'], count: 3 }, unlocks: ['pressure'] }
  };

  function backup() {
    try {
      const raw = localStorage.getItem('lifexp_save');
      if (raw && !localStorage.getItem('lifexp_hotfix_2_3_backup')) {
        localStorage.setItem('lifexp_hotfix_2_3_backup', raw);
        localStorage.setItem('lifexp_hotfix_2_3_backup_time', new Date().toISOString());
      }
    } catch (e) { console.warn('Ashbrand hotfix backup unavailable:', e); }
  }
  function normalize(value) { return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim(); }
  function isAshbrand(value) { return ['ashbrand', 'cuchilla llameante', 'cuchilla_llameante'].includes(normalize(value)); }
  function canonicalize(container) {
    if (!Array.isArray(container)) return;
    for (const slot of container) {
      if (!slot || typeof slot !== 'object') continue;
      if ([slot.id, slot.name, slot.legacyName, slot.itemName].some(isAshbrand)) {
        slot.id = ID; delete slot.name; delete slot.legacyName; delete slot.itemName;
      }
    }
  }
  function canonicalizeEquipment(equipment) {
    if (!equipment || typeof equipment !== 'object') return;
    for (const slot of Object.keys(equipment)) if (isAshbrand(equipment[slot])) equipment[slot] = ID;
  }

  function install() {
    if (typeof gameState === 'undefined' || typeof ITEMS === 'undefined') return;
    backup();
    Object.assign(ITEMS, { [ID]: { ...(ITEMS[ID] || {}), ...COMPLETE } });
    canonicalize(gameState.inventory); canonicalize(gameState.stash); canonicalizeEquipment(gameState.equipment);
    gameState.inventory = Array.isArray(gameState.inventory) ? gameState.inventory : [];
    gameState.stash = Array.isArray(gameState.stash) ? gameState.stash : [];
    const owned = gameState.inventory.some(x => x?.id === ID) || gameState.stash.some(x => x?.id === ID) || Object.values(gameState.equipment || {}).includes(ID);
    if (!owned) gameState.inventory.push({ id: ID, qty: 1, obtainedAt: typeof todayStr === 'function' ? todayStr() : new Date().toISOString().slice(0, 10) });
    gameState.__lifexpHotfix = HOTFIX_ID;
    if (typeof initializeItemSystem === 'function') initializeItemSystem();
    if (typeof renderInventory === 'function') renderInventory();
    if (typeof saveGame === 'function') saveGame();
  }

  function isEquippable(item) {
    return !!(item && ((window.ITEM_TYPE && window.ITEM_TYPE[item.type] && window.ITEM_TYPE[item.type].slot) || ['weapon', 'armor', 'accessory', 'artifact'].includes(item.type)));
  }
  function addVaultAction(itemId, container) {
    const actions = document.querySelector('#modal-item .item-modal-actions');
    const primary = document.getElementById('btn-item-action');
    if (!actions || !primary) return;
    document.getElementById('btn-item-vault-action')?.remove();
    const item = typeof getItemDefinition === 'function' ? getItemDefinition(itemId) : null;
    if (container !== 'inventory' || !isEquippable(item)) return;
    const button = document.createElement('button');
    button.id = 'btn-item-vault-action'; button.type = 'button'; button.className = 'btn btn-ghost';
    button.textContent = 'Guardar en el baúl'; button.setAttribute('aria-label', 'Guardar este objeto en el baúl');
    button.style.cssText = 'flex:1 1 auto;min-width:0;min-height:50px;padding:14px 12px;font-size:13px;border-color:var(--gold-dim);color:var(--gold);';
    button.onclick = () => { if (typeof moveItemToStash === 'function') moveItemToStash(itemId); };
    actions.insertBefore(button, primary.nextSibling);
  }
  const originalShowItemModal = window.showItemModal;
  if (typeof originalShowItemModal === 'function') {
    window.showItemModal = function (itemId, container) {
      originalShowItemModal.apply(this, arguments);
      addVaultAction(itemId, container || 'inventory');
    };
  }

  function statLabel(stat) { const meta = window.STATS && window.STATS[stat]; return meta ? (meta.name || meta.abbr || stat.toUpperCase()) : stat.toUpperCase(); }
  function failureContext(itemId) {
    if (typeof getItemRequirementStatus !== 'function') return '';
    const status = getItemRequirementStatus(itemId);
    if (!status || status.canEquip || !status.reasons?.length) return '';
    const item = typeof getItemDefinition === 'function' ? getItemDefinition(itemId) : null;
    const missing = [];
    Object.keys(item?.requirements?.stats || {}).forEach(stat => {
      const required = Number(item.requirements.stats[stat]);
      const actual = typeof getPlayerStatForRequirement === 'function' ? Number(getPlayerStatForRequirement(stat)) : Number(gameState?.stats?.[stat] || 0);
      if (actual < required) missing.push(statLabel(stat) + ' (' + actual + '/' + required + ')');
    });
    const parts = [];
    if (missing.length) parts.push('Al intentar ajustarlo, notas dónde cede tu cuerpo: ' + missing.join(', ') + '. Todavía no has desarrollado esas capacidades hasta el umbral que exige.');
    if (status.reasons.some(r => /entrenamiento/i.test(r))) parts.push('También percibes que te falta la preparación específica para manejarlo con seguridad.');
    if (status.reasons.some(r => /aclimataci/i.test(r))) {
      const att = status.attunement || {};
      parts.push('La conexión todavía no responde: necesitas más aclimatación (' + (att.stage || 0) + '/' + (item?.attunement?.minimumStage || '?') + ').');
    }
    return parts.length ? 'Lo que descubres al intentarlo: ' + parts.join(' ') : 'Lo que descubres al intentarlo: hay una barrera concreta entre tú y su uso.';
  }
  const originalGetItemFlavorText = window.getItemFlavorText;
  if (typeof originalGetItemFlavorText === 'function') {
    window.getItemFlavorText = function (itemId, situation) {
      const base = originalGetItemFlavorText.apply(this, arguments) || '';
      if (!['equip_fail_1', 'equip_fail_n'].includes(situation)) return base;
      const context = failureContext(itemId);
      return context ? base + '\n\n' + context : base;
    };
  }

  window.LifeXPAshbrandHotfix = { install, definition: COMPLETE };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true }); else install();
})();