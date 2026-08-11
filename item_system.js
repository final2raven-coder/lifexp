// ===========================================================================
// LifeXP RPG - item_system.js
// Item system runtime: initialization, equipment, attunement, rituals,
// item modals, knowledge system and activation panel.
// Depende de: engine.js, items.js, item_flavor.js, inventory_system.js.
// ===========================================================================

// ============================================================================
// LifeXP Block 1 - item system compatibility layer
// ============================================================================

function escapeItemHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
const escapeHtml = escapeItemHtml; // alias for quest/UI rendering

function initializeItemSystem() {
  if (!gameState.itemSystem || typeof gameState.itemSystem !== 'object') gameState.itemSystem = {};
  if (!gameState.itemSystem.attunement || typeof gameState.itemSystem.attunement !== 'object') gameState.itemSystem.attunement = {};
  if (!gameState.itemSystem.rituals || typeof gameState.itemSystem.rituals !== 'object') gameState.itemSystem.rituals = {};
  if (!gameState.itemSystem.curses || typeof gameState.itemSystem.curses !== 'object') gameState.itemSystem.curses = {};
  gameState.itemSystem.version = 1;
  if (typeof ITEMS !== 'undefined') {
    Object.values(ITEMS).forEach(normalizeItemDefinition);
  }
}

function normalizeItemDefinition(item) {
  if (!item) return item;
  if (!Array.isArray(item.effects)) item.effects = [];
  if (item.effect && typeof item.effect === 'object' && !item.effects.some(e => e.id === 'legacy_effect')) {
    item.effects.push({ id: 'legacy_effect', name: 'Legacy effect', description: item.passive || '', legacy: item.effect });
  }
  if (item.passive && !item.effects.some(e => e.description === item.passive)) {
    item.effects.push({ id: 'legacy_passive', name: 'Passive', description: item.passive, legacy: true });
  }
  item.lore = item.lore || item.desc || '';
  item.requirements = item.requirements || {};
  item.requirements.stats = item.requirements.stats || {};
  item.requirements.trainingId = item.requirements.trainingId || null;
  item.attunement = item.attunement || { required: false, current: 0, max: 3, stages: [] };
  item.attunement.max = Number(item.attunement.max || 3);
  item.activation = item.activation || null;
  item.curse = item.curse || null;
  return item;
}

function getItemDefinition(itemId) {
  return typeof ITEMS !== 'undefined' && ITEMS[itemId] ? normalizeItemDefinition(ITEMS[itemId]) : null;
}

function getItemAttunement(itemId) {
  initializeItemSystem();
  const item = getItemDefinition(itemId);
  const max = Math.max(1, Number(item?.attunement?.max || 3));
  const saved = gameState.itemSystem.attunement[itemId] || {};
  return { xp: Number(saved.xp || 0), stage: Math.min(max, Number(saved.stage || 0)), max };
}

function getItemAttunementStage(itemId) {
  return getItemAttunement(itemId).stage;
}

function recordItemAttunement(itemId, amount = 1) {
  const item = getItemDefinition(itemId);
  if (!item || !item.attunement?.required) return false;
  initializeItemSystem();
  const state = getItemAttunement(itemId);
  state.xp += Math.max(0, Number(amount) || 0);
  state.stage = Math.min(state.max, Math.floor(state.xp / 3));
  gameState.itemSystem.attunement[itemId] = state;
  saveGame();
  return true;
}

function recordItemAttunementFromTask(task) {
  if (!task || !gameState?.equipment) return;
  Object.values(gameState.equipment).filter(Boolean).forEach(id => {
    const item = getItemDefinition(id);
    if (!item?.attunement?.required) return;
    const themes = item.attunement.themes || item.themes || [];
    const taskThemes = task.drops?.theme ? [task.drops.theme] : [];
    const matches = !themes.length || themes.some(t => taskThemes.includes(t));
    if (matches) { recordItemAttunement(id, 1); advanceItemRitual(id, task); }
  });
}

function getPlayerStatForRequirement(stat) {
  return Number(gameState?.stats?.[stat] || 0) + Number(getEquipmentStats?.()[stat] || 0);
}

const ITEM_REQUIREMENT_NARRATIVE = {
  weapon: {
    fue: 'The weapon settles with unexpected weight; when you lift it, your arm runs out of reach.',
    vit: 'After one movement, the effort cuts your breath short and your body asks you to stop.',
    des: 'Your grip does not follow the movement: the edge drifts and the trajectory slips away from you.',
    int: 'The weapon\'s markings blur together; you cannot anticipate how it will respond.',
    vol: 'The energy running through the weapon fades when you touch it, like a flame without air.',
    pre: 'The weapon\'s presence makes you smaller; the gesture of wielding it loses its authority.',
    training: 'You try to reproduce the movement, but your body has not found the technique the blade demands.',
    attunement: 'When your hand closes around the grip, the power withdraws and leaves only a distant warmth.'
  },
  armor: {
    fue: 'The armor pulls at your shoulders and your legs protest before you take the first step.',
    vit: 'The air grows scarce inside the armor and your body makes you stop too soon.',
    des: 'The joints do not follow your movements; every turn arrives late and the metal slows you down.',
    int: 'The pieces conceal a mechanism you cannot understand; you cannot find the right way to adjust them.',
    vol: 'The armor closes around you, but its resistance makes you hesitate and your body loses steadiness.',
    pre: 'The armor weighs more when you stand before it; you cannot yet inhabit its presence.',
    training: 'The straps and fasteners follow a precise order you have not learned to reproduce.',
    attunement: 'The metal pulls away from your body as if it does not yet recognize the one who would wear it.'
  },
  accessory: {
    fue: 'The accessory pulls with an uncomfortable force and you cannot wear it without losing your balance.',
    vit: 'A wave of fatigue runs through you when you touch it and your body cannot sustain its influence.',
    des: 'The accessory shifts between your fingers and you cannot place it at the exact point.',
    int: 'The accessory\'s details seem to change when you try to understand how it works.',
    vol: 'The accessory\'s response fades as soon as you try to impose your will on it.',
    pre: 'The accessory remains indifferent, as if it finds no presence in you to answer.',
    training: 'The gesture needed to activate it does not come naturally to you.',
    attunement: 'When you bring it close to your body, its power withdraws and waits for a real bond.'
  },
  artifact: {
    fue: 'The artifact suddenly weighs like a sunken stone and your arm cannot move it freely.',
    vit: 'The contact leaves you breathless and the effort quickly exceeds what your body can sustain.',
    des: 'The artifact does not follow your hands; one small error is enough to make you lose position.',
    int: 'The artifact\'s symbols rearrange themselves and you cannot understand what it is trying to show you.',
    vol: 'The artifact\'s inner force passes through you and your concentration breaks before you can contain it.',
    pre: 'The artifact seems to fill the room, but your voice is lost when you try to claim it.',
    training: 'The artifact demands a method of use you have not yet learned to perform.',
    attunement: 'The artifact remains silent when you touch it, as if it is still waiting to recognize you.'
  }
};

const DEFAULT_REQUIREMENT_NARRATIVE = {
  fue: 'The item weighs more than your body can comfortably handle.',
  vit: 'The effort catches up with you too soon and your body asks you to stop.',
  des: 'Your movements do not yet have the precision needed to control it.',
  int: 'You cannot understand how the item responds when you try to use it.',
  vol: 'The item\'s energy fades when you try to hold it.',
  pre: 'The item does not respond to your presence as you expected.',
  training: 'You have not yet learned the gesture needed to use it.',
  attunement: 'The item does not yet recognize the bond you are trying to establish.'
};

function getItemRequirementNarrative(itemId, status) {
  const item = getItemDefinition(itemId);
  if (!item) return 'You cannot identify what prevents you from using it.';
  const currentStatus = status || getItemRequirementStatus(itemId);
  const family = ITEM_REQUIREMENT_NARRATIVE[item.type] || {};
  const missing = currentStatus.missingRequirements || [];
  const first = missing[0];
  if (!first) return 'Something in the item resists you, though you do not yet understand why.';
  if (first.kind === 'stat') return family[first.stat] || DEFAULT_REQUIREMENT_NARRATIVE[first.stat];
  if (first.kind === 'training') return family.training || DEFAULT_REQUIREMENT_NARRATIVE.training;
  if (first.kind === 'attunement') return family.attunement || DEFAULT_REQUIREMENT_NARRATIVE.attunement;
  return 'The item does not respond as it should when you try to use it.';
}

function getItemRequirementStatus(itemId) {
  const item = getItemDefinition(itemId);
  if (!item) return { canEquip: false, reasons: ['Unknown item'], missingRequirements: [{ kind: 'unknown' }] };
  const reasons = [];
  const missingRequirements = [];
  for (const [stat, needed] of Object.entries(item.requirements?.stats || {})) {
    const actual = getPlayerStatForRequirement(stat);
    if (actual < needed) {
      reasons.push(`Requires ${(STATS[stat]?.abbr || stat).toUpperCase()} ${needed} (current ${actual})`);
      missingRequirements.push({ kind: 'stat', stat, needed: Number(needed), actual });
    }
  }
  if (item.requirements?.trainingId && !(gameState.training?.[item.requirements.trainingId] || gameState.unlockedTrainings?.includes?.(item.requirements.trainingId))) {
    reasons.push(`Needs training: ${item.requirements.trainingName || item.requirements.trainingId}`);
    missingRequirements.push({ kind: 'training', id: item.requirements.trainingId });
  }
  const att = getItemAttunement(itemId);
  if (item.attunement?.required && att.stage < Number(item.attunement.minimumStage || 0)) {
    reasons.push(`Needs attunement (${att.stage}/${item.attunement.minimumStage})`);
    missingRequirements.push({ kind: 'attunement', stage: att.stage, minimumStage: Number(item.attunement.minimumStage || 0) });
  }
  return { canEquip: reasons.length === 0, reasons, missingRequirements, attunement: att };
}

// Override equipment entry point while preserving old item behavior.
function equipItem(itemId) {
  const item = getItemDefinition(itemId);
  if (!item || !item.type) return false;
  const status = getItemRequirementStatus(itemId);
  if (!status.canEquip) {
    return false;
  }
  const type = ITEM_TYPE[item.type];
  if (!type || !type.slot) return false;
  let slot = type.slot;
  if (slot === 'accessory') slot = !gameState.equipment.accessory1 ? 'accessory1' : (!gameState.equipment.accessory2 ? 'accessory2' : 'accessory1');
  const current = gameState.equipment[slot];
  if (current && !addToInventory(current)) return false;
  if (!removeFromInventory(itemId)) return false;
  gameState.equipment[slot] = itemId;
  initializeItemSystem();
  if (item.attunement?.required && !gameState.itemSystem.attunement[itemId]) gameState.itemSystem.attunement[itemId] = { xp: 0, stage: 0 };
  saveGame();
  return true;
}

function getEquippedItemEffects() {
  const effects = [];
  Object.values(gameState?.equipment || {}).filter(Boolean).forEach(id => {
    const item = getItemDefinition(id);
    if (item?.effects) item.effects.forEach(effect => effects.push({ ...effect, itemId: id }));
  });
  return effects;
}

function registerItemCurse(itemId, curseState = {}) {
  initializeItemSystem();
  gameState.itemSystem.curses[itemId] = { active: true, marks: 0, ...curseState };
  saveGame();
}

function getItemCurseState(itemId) {
  initializeItemSystem();
  return gameState.itemSystem.curses[itemId] || { active: false, marks: 0 };
}

function canUnequipItem(slot) {
  const itemId = gameState.equipment?.[slot];
  if (!itemId) return { ok: false, reason: 'No item equipped.' };
  const curse = getItemCurseState(itemId);
  const item = getItemDefinition(itemId);
  if (curse.active && item?.curse?.cannotUnequip) return { ok: false, reason: item.curse.removeHint || 'The item cannot be unequipped yet.' };
  return { ok: true };
}

function unequipItem(slot) {
  const check = canUnequipItem(slot);
  if (!check.ok) { if (typeof showToast === 'function') showToast(check.reason, 'error'); return false; }
  const itemId = gameState.equipment[slot];
  if (!itemId || !canAddToInventory()) return false;
  if (!addToInventory(itemId)) return false;
  gameState.equipment[slot] = null;
  saveGame();
  return true;
}

// Item modal: effect-first information hierarchy and balanced actions.

function showEquippedItemModal(slot) {
  const itemId = gameState.equipment?.[slot]; if (!itemId) return;
  showItemModal(itemId, 'equipped');
  const actionBtn = document.getElementById('btn-item-action');
  const check = canUnequipItem(slot);
  actionBtn.textContent = check.ok ? 'Unequip' : check.reason;
  actionBtn.disabled = !check.ok;
  actionBtn.onclick = () => unequipItemToInventory(slot);
}



// ============================================================================
// Block 2.1 - inventory identity recovery
// Alias resolution lives in inventory_system.js (single source of truth).
// ============================================================================

// Delegates to the canonical inventory system loaded in inventory_system.js.
function resolveInventoryItemId(slot) {
  if (window.LifeXPInventory && typeof window.LifeXPInventory.resolve === 'function') {
    return window.LifeXPInventory.resolve(slot);
  }
  // Fallback: direct ID lookup only (no alias resolution without the canonical system).
  if (!slot) return null;
  const id = typeof slot === 'string' ? slot : slot.id;
  return (id && typeof ITEMS !== 'undefined' && ITEMS[id]) ? id : null;
}

function repairInventoryIdentities() {
  if (window.LifeXPInventory && typeof window.LifeXPInventory.repair === 'function') {
    return window.LifeXPInventory.repair();
  }
  return false;
}

function itemIconSvg(item, size = 38) {
  const type = item?.type || 'material';
  const color = RARITY[item?.rarity]?.color || '#c9c5bb';
  const paths = {
    weapon: '<path d="M10 31 28 7l4 4-18 24H10z"/><path d="m8 33 8-2M25 10l4 4"/>',
    armor: '<path d="M12 7c3 3 9 3 12 0l5 5-3 18H10L7 12l5-5z"/><path d="M16 10v17m4-17v17"/>',
    accessory: '<circle cx="20" cy="20" r="10"/><circle cx="20" cy="20" r="4"/>',
    artifact: '<path d="m20 5 5 9-5 15-5-9 5-15z"/><path d="M9 20h22M12 13h16"/>',
    consumable: '<path d="M14 6h12M16 6v6l-5 14c-.5 2 1 4 3 4h12c2 0 3.5-2 3-4l-5-14V6"/><path d="M13 21h14"/>',
    material: '<path d="m20 5 11 7-11 17L9 12 20 5z"/><path d="m9 12 11 7 11-7"/>',
    skill: '<path d="M10 5h20v30H10z"/><path d="M15 12h10M15 18h10M15 24h7"/>',
    key: '<circle cx="13" cy="25" r="6"/><path d="m18 21 13-13M25 12l4 4M21 16l4 4"/>'
  };
  return `<svg class="item-icon-svg" width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true" style="color:${color}"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths[type] || paths.material}</g></svg>`;
}

function renderInventoryGrid() {
  const grid = document.getElementById('inventory-grid');
  const empty = document.getElementById('inventory-empty');
  if (!grid) return;
  repairInventoryIdentities();
  const list = Array.isArray(gameState.inventory) ? gameState.inventory : [];
  if (list.length === 0) { grid.innerHTML = ''; empty?.classList.remove('hidden'); return; }
  empty?.classList.add('hidden');
  grid.innerHTML = list.map((slot, index) => {
    const id = resolveInventoryItemId(slot);
    const item = id ? ITEMS[id] : null;
    if (!item) return `<div class="inv-slot inv-slot-recovery" onclick="showLegacyItemModal(${index})"><div class="recovery-icon">?</div><div>Unidentified item</div><small>Review recovery</small></div>`;
    const rarity = RARITY[item.rarity] || RARITY.common;
    const qty = slot.qty || 1;
    return `<div class="inv-slot item-card" onclick="showItemModal('${id}')" style="border-color:${rarity.color}"><div class="item-card-icon">${itemIconSvg(item, 40)}</div><div class="item-card-name" style="color:${rarity.color}">${escapeItemHtml(item.name)}</div>${qty > 1 ? `<div class="item-card-qty">x${qty}</div>` : ''}</div>`;
  }).join('');
}

function renderStashGrid() {
  const grid = document.getElementById('stash-grid');
  const empty = document.getElementById('stash-empty');
  if (!grid) return;
  repairInventoryIdentities();
  const list = Array.isArray(gameState.stash) ? gameState.stash : [];
  if (!list.length) { grid.innerHTML = ''; empty?.classList.remove('hidden'); return; }
  empty?.classList.add('hidden');
  grid.innerHTML = list.map((slot, index) => {
    const id = resolveInventoryItemId(slot), item = id ? ITEMS[id] : null;
    if (!item) return `<div class="inv-slot inv-slot-recovery"><div class="recovery-icon">?</div><small>Unidentified item</small></div>`;
    const rarity = RARITY[item.rarity] || RARITY.common;
    return `<div class="inv-slot item-card" onclick="showStashItemModal('${id}')" style="border-color:${rarity.color}"><div class="item-card-icon">${itemIconSvg(item, 40)}</div><div class="item-card-name" style="color:${rarity.color}">${escapeItemHtml(item.name)}</div></div>`;
  }).join('');
}


// ============================================================================
// Block 2.2 - attunement gates and in-app activation
// ============================================================================

function getItemActivationState(itemId) {
  initializeItemSystem();
  const item = getItemDefinition(itemId);
  const req = item?.activation?.requirement || {};
  const saved = gameState.itemSystem.rituals[itemId] || {};
  const count = Number(saved.count || 0);
  const needed = Number(req.count || 0);
  return { count, needed, ready: needed > 0 && count >= needed, active: Boolean(saved.active), discovered: Boolean(saved.discovered) };
}

function getTaskTheme(task) {
  return task?.drops?.theme || task?.theme || null;
}

function isTaskRelevantToItem(task, item) {
  const themes = item?.attunement?.themes || item?.themes || item?.activation?.requirement?.themes || [];
  const taskTheme = getTaskTheme(task);
  return Boolean(taskTheme && themes.includes(taskTheme));
}

function advanceItemRitual(itemId, task) {
  const item = getItemDefinition(itemId);
  const req = item?.activation?.requirement;
  if (!item?.activation || !req?.count || !isTaskRelevantToItem(task, item)) return false;
  initializeItemSystem();
  const state = gameState.itemSystem.rituals[itemId] || { count: 0, active: false, discovered: true };
  if (!state.active) state.count = Math.min(Number(req.count), Number(state.count || 0) + 1);
  state.discovered = true;
  gameState.itemSystem.rituals[itemId] = state;
  return true;
}

function attemptItemActivation(itemId) {
  const item = getItemDefinition(itemId);
  const state = getItemActivationState(itemId);
  if (!item?.activation || !state.ready || state.active) return { success: false, reason: 'not_ready' };
  initializeItemSystem();
  gameState.itemSystem.rituals[itemId] = { ...state, active: true, discovered: true, activatedAt: Date.now() };
  saveGame();
  // Show ritual flavor text
  setTimeout(function() { showRitualFlavor(itemId); }, 300);
  return { success: true };
}




function renderItemEffectList(itemId) {
  const item = getItemDefinition(itemId);
  const att = getItemAttunement(itemId);
  const ritual = getItemActivationState(itemId);
  return (item?.effects || []).map(effect => {
    const unlocked = isItemEffectUnlocked(itemId, effect);
    if (unlocked) return `<div class="item-effect"><strong>${escapeItemHtml(effect.name || 'Effect')}</strong><br>${escapeItemHtml(effect.description || '')}</div>`;
    const stage = Number(effect.unlockStage || 1);
    const ritualText = effect.activationRequired ? ' · Ritual required' : '';
    return `<div class="item-effect item-effect-locked"><strong>Locked effect</strong><br>${escapeItemHtml(effect.name || 'Unknown effect')} · Unlocks at Attunement ${stage}/ ${att.max}${ritualText}</div>`;
  }).join('');
}


function attemptActivationFromModal(itemId) {
  const result = attemptItemActivation(itemId);
  if (!result.success) { if (typeof showToast === 'function') showToast('The ritual is not ready.', 'error'); return; }
  // showRitualFlavor() already presents the item-specific persistent text.
  showItemModal(itemId, 'inventory');
}

function showItemModal(itemId, container) {
  container = container || 'inventory';
  selectedItemId = itemId;
  var item = getItemDefinition(itemId);
  if (!item) return;

  // Show first_look flavor text the first time this item's modal is opened
  if (container !== 'equipped') {
    initializeItemSystem();
    if (!gameState.itemSystem.firstSeen) gameState.itemSystem.firstSeen = {};
    if (!gameState.itemSystem.firstSeen[itemId]) {
      gameState.itemSystem.firstSeen[itemId] = true;
      saveGame();
      setTimeout(function() {
        var flavorText = getItemFlavorText(itemId, 'first_look');
        if (flavorText) showFlavorDialog(flavorText, 'default');
      }, 400);
    }
  }
  var rarity  = RARITY[item.rarity]  || RARITY.common;
  var type    = ITEM_TYPE[item.type] || { name: item.type || 'Item', slot: null };
  var qty     = container === 'stash'
    ? ((gameState.stash || []).find(function(s){ return s.id === itemId; }) || {}).qty || 1
    : getItemCount(itemId);
  var req = getItemRequirementStatus(itemId);
  var att = req.attunement;

  // == HEADER ================================================================
  var html = '';
  html += '<div style="text-align:center;padding-bottom:10px;border-bottom:1px solid var(--border);margin-bottom:10px;">';
  html += '<div style="font-size:48px;line-height:1;margin-bottom:6px;">' + (item.icon || '\uD83D\uDCE6') + '</div>';
  html += '<div style="font-size:18px;font-weight:700;color:' + rarity.color + ';letter-spacing:.3px;">' + escapeItemHtml(item.name) + '</div>';
  html += '<div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-top:3px;">';
  html += escapeItemHtml(type.name) + ' · <span style="color:' + rarity.color + ';">' + escapeItemHtml(rarity.name) + '</span>';
  if (qty > 1) html += ' · ×' + qty;
  html += '</div></div>';

  // == LORE ==================================================================
  var lore = item.lore || item.desc || '';
  if (lore) {
    html += '<div style="font-size:13px;color:var(--text-muted);font-style:italic;line-height:1.5;margin-bottom:8px;">' + escapeItemHtml(lore) + '</div>';
  }

  // == STATS =================================================================
  var statsEntries = Object.entries(item.stats || {}).filter(function(e){ return e[1]; });
  if (statsEntries.length) {
    html += '<div style="display:flex;flex-wrap:wrap;gap:6px;margin:8px 0;">';
    statsEntries.forEach(function(entry) {
      var s = entry[0], v = entry[1];
      var statColor = 'var(--stat-' + s + ', var(--text))';
      html += '<span style="background:var(--bg-surface);border:1px solid var(--stat-' + s + ',var(--border));border-radius:6px;padding:3px 8px;font-size:12px;font-weight:600;color:' + statColor + ';">';
      html += (STATS[s] ? STATS[s].abbr : s.toUpperCase());
      html += ' <span style="color:var(--green);">+' + v + '</span></span>';
    });
    html += '</div>';
  }

  // == PASSIVE ===============================================================
  if (item.passive) {
    html += '<div style="font-size:11px;color:var(--gold);margin:4px 0;">✦ ' + escapeItemHtml(item.passive) + '</div>';
  }

  // == EFFECTS (only known) ==================================================
  var knownEffects = (item.effects || []).filter(function(e){ return isItemEffectKnown(itemId, e); });
  if (knownEffects.length) {
    html += '<div class="item-panel" style="margin-top:10px;">';
    html += '<div class="item-panel-label" style="color:var(--orange);font-size:10px;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;">Known effects</div>';
    knownEffects.forEach(function(e) {
      var unlocked = isItemEffectUnlocked(itemId, e);
      if (unlocked) {
        html += '<div style="font-size:12px;margin-bottom:4px;">';
        html += '<span style="color:var(--orange);font-weight:600;">' + escapeItemHtml(e.name || 'Effect') + '</span>';
        html += ' <span style="color:var(--text-muted);">— ' + escapeItemHtml(e.description || '') + '</span></div>';
      } else {
        html += '<div style="font-size:12px;margin-bottom:4px;color:var(--text-muted);opacity:.5;">\uD83D\uDD12 ' + escapeItemHtml(e.name || 'Effect');
        html += ' <span style="font-size:10px;">(Attunement ' + (e.unlockStage || '?') + '/' + att.max + (e.activationRequired ? ' · Ritual' : '') + ')</span></div>';
      }
    });
    html += '</div>';
  }

  // == REQUIREMENTS — progressive discovery, no spoilers ===================
  // Requirements are never shown as a stat list. The player discovers them
  // by attempting to equip. If they've tried before, show a single flavor hint.
  var equipAttempts = (gameState.itemSystem && gameState.itemSystem.equipAttempts && gameState.itemSystem.equipAttempts[itemId]) || 0;
  if (!req.canEquip && equipAttempts > 0) {
    // Show a vague hint — evocative, not a stat sheet
    var hint = (req.flavorReasons && req.flavorReasons[0]) || 'Something in you is not ready for this yet.';
    html += '<div style="margin-top:8px;font-size:12px;color:var(--text-muted);font-style:italic;padding:8px;background:var(--bg-surface);border-radius:6px;border-left:2px solid var(--border);">⟳ ' + escapeItemHtml(hint) + '</div>';
  }

  // == ATTUNEMENT (only if stage > 0 or equipped) ===========================
  if (item.attunement && item.attunement.required && (att.stage > 0 || container === 'equipped')) {
    var attText = (item.attunement.stages && item.attunement.stages[att.stage])
      || (att.stage >= att.max ? 'Attunement complete.' : 'The item has not responded yet.');
    var attPct = Math.min(100, att.stage / att.max * 100);
    html += '<div class="item-panel" style="margin-top:8px;">';
    html += '<div class="item-panel-label" style="font-size:10px;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;color:var(--purple);">Attunement</div>';
    html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">';
    html += '<div style="flex:1;height:4px;background:var(--bg-surface);border-radius:2px;overflow:hidden;">';
    html += '<div style="height:100%;width:' + attPct + '%;background:var(--purple);border-radius:2px;"></div></div>';
    html += '<span style="font-size:11px;color:var(--purple);">' + att.stage + '/' + att.max + '</span></div>';
    html += '<div style="font-size:12px;color:var(--text-muted);font-style:italic;">' + escapeItemHtml(attText) + '</div>';
    html += '</div>';
  }

  // == ACTIVATION (gated by minimumStage) ===================================
  var minStage = Number((item.attunement && item.attunement.minimumStage) || 1);
  if (!item.attunement || !item.attunement.required || att.stage >= minStage) {
    html += renderActivationPanel(itemId);
  }

  // == CURSE =================================================================
  if (item.curse) {
    html += '<div class="item-panel item-curse" style="margin-top:8px;border-color:var(--red);">';
    html += '<div class="item-panel-label" style="font-size:10px;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;color:var(--red);">Curse</div>';
    html += '<div style="font-size:12px;color:var(--red);">' + escapeItemHtml((item.curse && item.curse.description) || 'This item bears a curse.') + '</div>';
    html += '</div>';
  }

  // == VALUE =================================================================
  html += '<div style="font-size:11px;color:var(--text-muted);margin-top:10px;text-align:right;">' + (item.value || 0) + ' \uD83E\uDE99</div>';

  document.getElementById('modal-item-content').innerHTML = html;

  // == ACTION BUTTON =========================================================
  var actionBtn = document.getElementById('btn-item-action');
  if (!actionBtn) return;
  actionBtn.style.display = 'flex';
  actionBtn.style.visibility = 'visible';
  actionBtn.style.opacity = '1';
  actionBtn.disabled = false;
  if (container === 'stash') {
    actionBtn.textContent = 'Move to inventory';
    actionBtn.onclick = function() { moveItemToInventory(itemId); };
  } else if (type.slot || ['weapon', 'armor', 'accessory', 'artifact'].includes(item.type)) {
    // Every equippable item keeps the primary action visible. Do not rely
    // only on ITEM_TYPE.slot: older and expansion definitions may omit it.
    actionBtn.textContent = 'Equip';
    actionBtn.disabled = false;
    actionBtn.onclick = function() { equipItemFromInventory(itemId); };
  } else if (item.type === 'consumable') {
    actionBtn.textContent = 'Use';
    actionBtn.onclick = function() { useConsumable(itemId); };
  } else {
    actionBtn.textContent = 'Store in stash';
    actionBtn.onclick = function() { moveItemToStash(itemId); };
  }
  openModal('modal-item');
}


// ============================================================================
// Block 2.3 - hidden item knowledge
// ============================================================================
// Unknown effects are not shown as locked. They remain undiscovered until the
// item teaches them through attunement, activation, combat or another system.
// Items may later opt into visible/known effects with `knowledge: 'known'`.

function getItemKnowledgeState(itemId) {
  initializeItemSystem();
  if (!gameState.itemSystem.knowledge || typeof gameState.itemSystem.knowledge !== 'object') gameState.itemSystem.knowledge = {};
  return gameState.itemSystem.knowledge[itemId] || {};
}

function isItemEffectKnown(itemId, effect) {
  const item = getItemDefinition(itemId);
  const knowledge = getItemKnowledgeState(itemId);
  if (effect.knowledge === 'known' || effect.visibility === 'visible') return true;
  if (knowledge[effect.id] === true) return true;
  const stage = Number(effect.unlockStage || 0);
  return stage > 0 && getItemAttunement(itemId).stage >= stage;
}

function discoverItemEffect(itemId, effectId) {
  const item = getItemDefinition(itemId);
  const effect = item?.effects?.find(e => e.id === effectId);
  if (!effect) return false;
  initializeItemSystem();
  if (!gameState.itemSystem.knowledge || typeof gameState.itemSystem.knowledge !== 'object') gameState.itemSystem.knowledge = {};
  gameState.itemSystem.knowledge[itemId] = { ...(gameState.itemSystem.knowledge[itemId] || {}), [effectId]: true };
  saveGame();
  return true;
}

function isItemEffectUnlocked(itemId, effect) {
  const item = getItemDefinition(itemId);
  const att = getItemAttunement(itemId);
  const needed = Number(effect.unlockStage || 0);
  if (att.stage < needed) return false;
  if (effect.activationRequired && !getItemActivationState(itemId).active) return false;
  return isItemEffectKnown(itemId, effect);
}

function getActiveItemEffects(itemId) {
  const item = getItemDefinition(itemId);
  return (item?.effects || []).filter(effect => isItemEffectUnlocked(itemId, effect));
}



function renderActivationPanel(itemId) {
  const item = getItemDefinition(itemId);
  if (!item?.activation) return '';
  const state = getItemActivationState(itemId);
  if (state.active) return `<div class="item-panel item-activation-active"><div class="item-panel-label">ACTIVATION</div><div>Ritual complete.</div></div>`;
  const progress = `${state.count}/${state.needed}`;
  const button = state.ready ? `<button class="btn btn-primary item-ritual-button" onclick="attemptActivationFromModal('${itemId}')">Attempt activation</button>` : '';
  return `<div class="item-panel"><div class="item-panel-label">ACTIVATION</div><div>${escapeItemHtml(item.activation.description || 'Complete the required tasks.')}</div><div class="ritual-progress">${progress}</div>${button}</div>`;
}
