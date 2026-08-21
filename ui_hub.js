// ===========================================================================
// LifeXP RPG - ui_hub.js
// UI del hub principal, personaje, inventario, equipo y settings.
// Depende de: engine.js, items.js, inventory_system.js, item_flavor.js.
// ===========================================================================

function renderHub() {
  // Header stats
  document.getElementById('hub-streak').textContent = gameState.streak;
  document.getElementById('hub-gold').textContent = gameState.gold;
  document.getElementById('hub-level').textContent = gameState.level;
  
  const xpProg = getXpProgress();
  document.getElementById('hub-xp').textContent = xpProg.current;
  document.getElementById('hub-xp-next').textContent = xpProg.needed;
  document.getElementById('hub-xp-fill').style.width = xpProg.pct + '%';
  
  // Alerts
  const alertsDiv = document.getElementById('hub-alerts');
  alertsDiv.innerHTML = '';
  
  // Overflow alert
  const overflow = getOverflowTasks();
  if (overflow.length > 0) {
    alertsDiv.innerHTML += `
      <div class="alert alert-overflow" onclick="showOverflowTasks()">
        <div class="alert-icon">⚡</div>
        <div class="alert-text"><strong>${overflow.length} overflow</strong> — tienen prioridad</div>
      </div>
    `;
  }
  
  // Saved tasks alert
  if (gameState.savedTasks.length > 0) {
    alertsDiv.innerHTML += `
      <div class="alert alert-saved" onclick="showSavedTasks()">
        <div class="alert-icon">\uD83D\uDCCC</div>
        <div class="alert-text"><strong>${gameState.savedTasks.length} guardadas</strong> para luego</div>
      </div>
    `;
  }
  
  // Categories
  const catGrid = document.getElementById('hub-categories');
  catGrid.innerHTML = '';
  
  for (const [catId, cat] of Object.entries(CATEGORIES)) {
    const pending = getPendingCount(catId);
    const overflowCount = getOverflowCount(catId);
    
    catGrid.innerHTML += `
      <div class="cat-card" data-cat="${catId}" onclick="openCategory('${catId}')">
        <div class="cat-icon">${cat.icon}</div>
        <div class="cat-name">${cat.name}</div>
        <div class="cat-pending">${pending} pendiente${pending !== 1 ? 's' : ''}</div>
        ${overflowCount > 0 ? `<div class="cat-overflow">⚡${overflowCount}</div>` : ''}
      </div>
    `;
  }
}

function renderCharacter() {
  const level = gameState.level;
  const classId = gameState.classId;
  const cls = classId && classId !== 'novato' ? CLASS_TREE[classId] : null;
  
  // Basic info
  document.getElementById('char-name').textContent = gameState.name;
  document.getElementById('char-class-icon').textContent = cls ? cls.icon : '\uD83E\uDDD1‍\uD83C\uDF3E';
  document.getElementById('char-class-name').textContent = cls ? cls.name : 'Novato';
  document.getElementById('char-level').textContent = level;
  document.getElementById('char-tier-name').textContent = cls ? `Clase ${getTierName(cls.tier)}` : 'Sin clase';
  
  // XP bar
  const xpProgress = getXpProgress();
  document.getElementById('char-xp-text').textContent = `${xpProgress.current} / ${xpProgress.needed}`;
  document.getElementById('char-xp-bar').style.width = `${xpProgress.pct}%`;
  
  // Class change button
  const availableChanges = getAvailableClassChanges(classId === 'novato' ? null : classId, level);
  const classBtn = document.getElementById('class-change-btn');
  if (availableChanges.length > 0) {
    classBtn.classList.remove('hidden');
  } else {
    classBtn.classList.add('hidden');
  }
  
  // Stats
  const statsDiv = document.getElementById('char-stats');
  statsDiv.innerHTML = '';
  for (const [statId, stat] of Object.entries(STATS)) {
    const val = gameState.stats[statId] || 10;
    statsDiv.innerHTML += `
      <div class="stat-row">
        <span class="stat-icon">${stat.icon}</span>
        <span class="stat-name">${stat.name}</span>
        <span class="stat-val">${val}</span>
      </div>
    `;
  }
  
  // Buffs
  const buffsDiv = document.getElementById('char-buffs');
  buffsDiv.innerHTML = '';
  if (gameState.buffs.length === 0) {
    buffsDiv.innerHTML = '<p class="empty-text">Sin buffs activos</p>';
  } else {
    for (const buff of gameState.buffs) {
      buffsDiv.innerHTML += `<div class="buff-item">${buff.icon} ${buff.name} <small>${buff.desc}</small></div>`;
    }
  }
  
  // Class progress
  const classProgress = document.getElementById('class-progress');
  if (cls) {
    classProgress.classList.remove('hidden');
    document.getElementById('class-progress-name').textContent = cls.name;
    document.getElementById('class-progress-bar').style.width = `${getClassProgress(cls)}%`;
    document.getElementById('class-progress-text').textContent = `${getClassProgress(cls)}%`;
  } else {
    classProgress.classList.add('hidden');
  }
}

function renderInventory() {
  const grid = document.getElementById('inventory-grid');
  const empty = document.getElementById('inventory-empty');
  if (!grid) return;
  
  grid.innerHTML = '';
  const inventory = getInventoryItems();
  
  if (inventory.length === 0) {
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');
  
  for (const entry of inventory) {
    const itemId = entry.id;
    const item = ITEMS[itemId];
    if (!item) continue;
    const rarity = RARITY[item.rarity];
    const displayName = item.name || itemId;
    const equipped = isItemEquipped(itemId);
    const count = entry.qty || 1;
    
    grid.innerHTML += `
      <div class="inv-item" onclick="showInventoryItemModal('${itemId}')" style="border-color: ${rarity.color};">
        <div class="inv-icon">${item.icon}</div>
        <div class="inv-name">${displayName}</div>
        <div class="inv-rarity" style="color: ${rarity.color};">${rarity.name}</div>
        ${equipped ? '<div class="inv-equipped">EQUIPPED</div>' : ''}
        ${count > 1 ? `<div class="inv-count">x${count}</div>` : ''}
      </div>
    `;
  }
}

function showInventoryItemModal(itemId) {
  showItemModal(itemId, 'inventory');
}

function showStashItemModal(itemId) {
  showItemModal(itemId, 'stash');
}

function moveItemToStash(itemId) {
  if (!moveBetweenContainers(itemId, 'inventory', 'stash')) {
    showToast('Stash is full.', 'error');
    return;
  }
  saveGame(); closeModal('modal-item'); renderInventory();
}

function moveItemToInventory(itemId) {
  if (!moveBetweenContainers(itemId, 'stash', 'inventory')) {
    showToast('No room in inventory.', 'error');
    return;
  }
  saveGame(); closeModal('modal-item'); renderInventory();
}

function renderEquipment() {
  const slots = document.getElementById('equipment-slots');
  const statsDiv = document.getElementById('equipment-stats');
  if (!slots) return;
  
  const slotConfig = [
    { key: 'weapon', name: 'Weapon', icon: '⚔️' },
    { key: 'armor', name: 'Armor', icon: '\uD83D\uDEE1️' },
    { key: 'accessory1', name: 'Accessory 1', icon: '\uD83D\uDC8D' },
    { key: 'accessory2', name: 'Accessory 2', icon: '\uD83D\uDC8D' },
    { key: 'artifact', name: 'Artifact', icon: '\uD83D\uDD2E' }
  ];
  
  slots.innerHTML = '';
  
  for (const cfg of slotConfig) {
    const itemId = gameState.equipment[cfg.key];
    const item = itemId && typeof ITEMS !== 'undefined' ? ITEMS[itemId] : null;
    const rarity = item && typeof RARITY !== 'undefined' ? RARITY[item.rarity] : null;
    
    slots.innerHTML += `
      <div class="equip-slot" onclick="${item ? `showEquippedItemModal('${cfg.key}')` : ''}"
           style="background: var(--bg-surface); border: 2px solid ${rarity ? rarity.color : 'var(--border)'}; 
                  border-radius: 8px; padding: 12px; text-align: center; cursor: ${item ? 'pointer' : 'default'};">
        <div style="font-size: 28px;">${item ? item.icon : cfg.icon}</div>
        <div style="font-size: 11px; color: ${item ? rarity.color : 'var(--text-muted)'};">${item ? item.name : cfg.name}</div>
      </div>
    `;
  }
  
  if (statsDiv) {
    const stats = getEquipmentStats();
    statsDiv.innerHTML = `<div style="font-size: 12px; color: var(--text-muted); margin-top: 12px;">${stats.text || 'No bonuses'}</div>`;
  }
}

function showEquippedItemModal(slot) {
  const itemId = gameState.equipment[slot];
  if (itemId) showItemModal(itemId, 'equipment');
}

function renderStash() {
  const grid = document.getElementById('stash-grid');
  const empty = document.getElementById('stash-empty');
  if (!grid) return;
  
  grid.innerHTML = '';
  const stash = getStashItems();
  
  if (stash.length === 0) {
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');
  
  for (const entry of stash) {
    const itemId = entry.id;
    const item = ITEMS[itemId];
    if (!item) continue;
    const rarity = RARITY[item.rarity];
    const displayName = item.name || itemId;
    
    grid.innerHTML += `
      <div class="inv-item" onclick="showStashItemModal('${itemId}')" style="border-color: ${rarity.color};">
        <div class="inv-icon">${item.icon}</div>
        <div class="inv-name">${displayName}</div>
        <div class="inv-rarity" style="color: ${rarity.color};">${rarity.name}</div>
        <div class="inv-count">x${entry.qty || 1}</div>
      </div>
    `;
  }
}

function equipItem(itemId) {
  const item = ITEMS[itemId];
  if (!item) return;
  
  const prevAttempts = (gameState.itemSystem && gameState.itemSystem.equipAttempts && gameState.itemSystem.equipAttempts[itemId]) || 0;
  const result = tryEquip(itemId);
  if (result.success) {
    saveGame();
    closeModal('modal-item');
    renderInventory();
    renderEquipment();
    renderCharacter();
    showFlavorDialog(result.flavor || getItemFlavorText(itemId, 'equip_success'), 'success');
  } else {
    // Record the attempt
    gameState.itemSystem.equipAttempts[itemId] = prevAttempts + 1;
    saveGame();

    // Show flavor toast — evocative, not a stat sheet
    var situation = prevAttempts === 0 ? 'equip_fail_1' : 'equip_fail_n';
    var requirementStatus = getItemRequirementStatus(itemId);
    var flavor = requirementStatus.missingRequirements?.length
      ? getItemRequirementNarrative(itemId, requirementStatus)
      : getItemFlavorText(itemId, situation);
    showFlavorDialog(flavor, 'error');

    // Refresh modal so the hint appears
    showItemModal(itemId, 'inventory');
  }
}


// == ATTUNEMENT FLAVOR TRIGGER =================================================
function showAttunementFlavor(itemId, newStage) {
  var text = getItemFlavorText(itemId, 'attune_' + newStage);
  showFlavorDialog(text, 'success');
}

// == RITUAL FLAVOR TRIGGER =====================================================
function showRitualFlavor(itemId) {
  var text = getItemFlavorText(itemId, 'ritual');
  showFlavorDialog(text, 'success');
}

// == LEGACY SHIM ===============================================================
function _getEquipFlavorText(itemId) {
  var attempts = (gameState.itemSystem && gameState.itemSystem.equipAttempts && gameState.itemSystem.equipAttempts[itemId]) || 0;
  return getItemFlavorText(itemId, attempts <= 1 ? 'equip_fail_1' : 'equip_fail_n');
}


function unequipItemToInventory(slot) {
  if (unequipItem(slot)) {
    saveGame();
    closeModal('modal-item');
    renderInventory();
    renderCharacter();
  } else {
    alert('Inventory full.');
  }
}

function sellItemFromInventory(itemId) {
  const item = ITEMS[itemId];
  if (!item) return;
  
  const gold = sellItem(itemId, 1);
  if (gold > 0) {
    saveGame();
    closeModal('modal-item');
    renderInventory();
    renderHub();
    alert('Sold for ' + gold + ' gold.');
  }
}

function useConsumable(itemId) {
  alert('Consumables are available in combat (Block 4).');
  closeModal('modal-item');
}

// renderQuests() definido al final del archivo en sección QUESTS RENDERING


function forceAppUpdate() {
  const current = typeof LIFE_XP_BUILD !== 'undefined' ? LIFE_XP_BUILD : 'unknown';
  const url = `${location.pathname}?lifexp_update=${encodeURIComponent(current)}_${Date.now()}`;
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(regs => Promise.all(regs.map(reg => reg.update()))).finally(() => location.replace(url));
  } else {
    location.replace(url);
  }
}

function renderSettings() {
  const content = document.getElementById('settings-content');
  content.innerHTML = `
    <div class="section-title">Datos</div>
    <div class="card">
      <button class="btn btn-gold mb-8" onclick="forceAppUpdate()">↻ Actualizar versión</button>
      <button class="btn btn-secondary mb-8" onclick="exportData()">\uD83D\uDCE4 Exportar save</button>
      <button class="btn btn-secondary mb-8" onclick="showImportModal()">\uD83D\uDCE5 Importar save</button>
      <button class="btn btn-ghost" onclick="resetGame()" style="color: var(--red)">\uD83D\uDDD1️ Resetear progreso</button>
    </div>
    
    <div class="section-title">Content Planning</div>
    <div class="card">
      <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">
        Exporta un snapshot con métricas de uso y sugerencias para planificar actualizaciones de contenido con tu agente de Langdock.
      </p>
      <button class="btn btn-gold" onclick="exportSnapshot()">\uD83D\uDCCA Exportar Snapshot para Agente</button>
    </div>
    
    <div class="section-title">Info</div>
    <div class="card">
      <p style="font-size: 13px; color: var(--text-muted);">
        LifeXP RPG v1.0 · Build ${LIFE_XP_BUILD}<br>
        Tareas: ${gameState.tasks.length}<br>
        Nivel: ${gameState.level}<br>
        XP Total: ${gameState.taskHistory.reduce((a, h) => a + h.xp, 0)}
      </p>
    </div>
  `;
}

// ===========================================================================
