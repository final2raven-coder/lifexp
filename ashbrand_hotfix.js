// LifeXP Hotfix 2.5 - item UX, encoding and requirement privacy repair.
// Loaded after game.js, items.js and expansion modules.
(function () {
  'use strict';
  const HOTFIX_ID = 'lifexp_hotfix_2_5_item_ux_privacy';
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
    requirements: { stats: { fue: 12, des: 12 }, trainingId: null },
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
      if (raw && !localStorage.getItem('lifexp_item_ux_backup_2_5')) {
        localStorage.setItem('lifexp_item_ux_backup_2_5', raw);
        localStorage.setItem('lifexp_item_ux_backup_2_5_time', new Date().toISOString());
      }
    } catch (e) { console.warn('Item UX backup unavailable:', e); }
  }
  function norm(v) { return String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim(); }
  function isAshbrand(v) { return ['ashbrand', 'cuchilla llameante', 'cuchilla_llameante'].includes(norm(v)); }
  function canonicalize(list) {
    if (!Array.isArray(list)) return;
    list.forEach(slot => {
      if (slot && typeof slot === 'object' && [slot.id, slot.name, slot.legacyName, slot.itemName].some(isAshbrand)) {
        slot.id = ID;
        delete slot.name; delete slot.legacyName; delete slot.itemName;
      }
    });
  }
  function install() {
    if (typeof gameState === 'undefined' || typeof ITEMS === 'undefined') return;
    backup();
    Object.assign(ITEMS, { [ID]: { ...(ITEMS[ID] || {}), ...COMPLETE } });
    canonicalize(gameState.inventory); canonicalize(gameState.stash);
    if (gameState.equipment) Object.keys(gameState.equipment).forEach(k => { if (isAshbrand(gameState.equipment[k])) gameState.equipment[k] = ID; });
    gameState.inventory = Array.isArray(gameState.inventory) ? gameState.inventory : [];
    gameState.stash = Array.isArray(gameState.stash) ? gameState.stash : [];
    if (!gameState.inventory.some(x => x && x.id === ID) && !gameState.stash.some(x => x && x.id === ID) && !Object.values(gameState.equipment || {}).includes(ID)) gameState.inventory.push({ id: ID, qty: 1, obtainedAt: new Date().toISOString().slice(0, 10) });
    gameState.__lifexpHotfix = HOTFIX_ID;
    if (typeof initializeItemSystem === 'function') initializeItemSystem();
    if (typeof renderInventory === 'function') renderInventory();
    if (typeof saveGame === 'function') saveGame();
  }

  function narrative(text) {
    const s = String(text || '');
    if (!s) return 'The item does not respond.';
    if (/requier|actual|needs? training|training:|aclimat|fue|vit|des|int|vol|pre|\d+\s*\/\s*\d+|\b\d+\s*\(actual/i.test(s)) return 'Something in you is not ready for this yet.';
    if (/algo en ti|todav[ií]a no est[aá]s? listo/i.test(s)) return 'Something in you is not ready for this yet.';
    return s;
  }
  function scrub(root) {
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll('#modal-item, .flavor-dialog, .toast, [role="dialog"]').forEach(node => {
      if (/requier|actual|needs? training|training:|aclimat|\b(fue|vit|des|int|vol|pre)\b|\d+\s*\/\s*\d+|algo en ti|todav[ií]a no est[aá]s? listo/i.test(node.textContent || '')) {
        node.querySelectorAll('button, [data-action]').forEach(() => {});
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
        const textNodes = [];
        while (walker.nextNode()) textNodes.push(walker.currentNode);
        textNodes.forEach(t => { if (/requier|actual|needs? training|training:|aclimat|\b(fue|vit|des|int|vol|pre)\b|\d+\s*\/\s*\d+|algo en ti|todav[ií]a no est[aá]s? listo/i.test(t.nodeValue || '')) t.nodeValue = narrative(t.nodeValue); });
      }
    });
  }

  const oldStatus = window.getItemRequirementStatus;
  if (typeof oldStatus === 'function') window.getItemRequirementStatus = function () {
    const status = oldStatus.apply(this, arguments) || {};
    return status.canEquip ? status : { ...status, reasons: ['The item does not respond.'], flavorReasons: ['Something in you is not ready for this yet.'] };
  };
  const oldToast = window.showToast;
  if (typeof oldToast === 'function') window.showToast = function (text, type) { return oldToast.call(this, narrative(text), type); };
  const oldFlavor = window.showFlavorDialog;
  if (typeof oldFlavor === 'function') window.showFlavorDialog = function (text, type) { return oldFlavor.call(this, narrative(text), type); };
  const oldModal = window.showItemModal;
  if (typeof oldModal === 'function') window.showItemModal = function (itemId, container) {
    const result = oldModal.apply(this, arguments);
    const actions = document.querySelector('#modal-item .item-modal-actions');
    const primary = document.getElementById('btn-item-action');
    const item = typeof getItemDefinition === 'function' ? getItemDefinition(itemId) : null;
    if (container !== 'inventory' || !actions || !primary || !item || !['weapon', 'armor', 'accessory', 'artifact'].includes(item.type)) return result;
    document.getElementById('btn-item-vault-action')?.remove();
    const button = document.createElement('button');
    button.id = 'btn-item-vault-action'; button.type = 'button'; button.className = 'btn btn-ghost';
    button.textContent = 'Guardar en el ba\u00FAl';
    button.setAttribute('aria-label', 'Guardar este objeto en el ba\u00FAl');
    button.onclick = () => { if (typeof moveItemToStash === 'function') moveItemToStash(itemId); };
    actions.insertBefore(button, primary.nextSibling);
    scrub(document.body);
    return result;
  };
  if (typeof MutationObserver !== 'undefined') new MutationObserver(() => scrub(document.body)).observe(document.body, { childList: true, subtree: true, characterData: true });
  window.LifeXPAshbrandHotfix = { install, definition: COMPLETE };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true }); else install();
})();
