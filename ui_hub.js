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
        <div class="alert-icon">${LifeXPIcons.renderUI('world.lightning', { size: 20 })}</div>
        <div class="alert-text"><strong>${overflow.length} overflow</strong> — high priority</div>
      </div>
    `;
  }
  
  // Saved tasks alert
  if (gameState.savedTasks.length > 0) {
    alertsDiv.innerHTML += `
      <div class="alert alert-saved" onclick="showSavedTasks()">
        <div class="alert-icon">${LifeXPIcons.renderUI('world.pin', { size: 20 })}</div>
        <div class="alert-text"><strong>${gameState.savedTasks.length} saved</strong> for later</div>
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
        <div class="cat-icon">${LifeXPIcons.renderCategory({ id: catId, name: cat.name }, { size: 34 })}</div>
        <div class="cat-name">${typeof LifeXPPresentation !== 'undefined' ? LifeXPPresentation.getCategoryLabel(catId) : cat.name}</div>
        <div class="cat-pending">${pending} pending task${pending !== 1 ? 's' : ''}</div>
        ${overflowCount > 0 ? `<div class="cat-overflow">${LifeXPIcons.renderUI('world.lightning', { size: 14 })}${overflowCount}</div>` : ''}
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
  document.getElementById('char-class-icon').innerHTML = cls
    ? LifeXPIcons.renderClass(cls, { size: 64, decorative: true })
    : LifeXPIcons.renderUI('ui.person', { size: 64 });
  document.getElementById('char-class-name').textContent = cls ? cls.name : 'Novice';
  document.getElementById('char-level').textContent = level;
  document.getElementById('char-tier-name').textContent = cls ? `Class ${getTierName(cls.tier)}` : 'No class';
  
  // XP bar
  const xpProgress = getXpProgress();
  document.getElementById('char-xp-text').textContent = `${xpProgress.current} / ${xpProgress.needed}`;
  document.getElementById('char-xp-bar').style.width = `${xpProgress.pct}%`;
  
  // Class change button
  const availableChanges = getAvailableClassChanges(classId === 'novato' ? null : classId, level);
  const classChangeSection = document.getElementById('class-change-section');
  if (availableChanges.length > 0) {
    classChangeSection.classList.remove('hidden');
  } else {
    classChangeSection.classList.add('hidden');
  }
  
  // Stats with class bonuses
  const baseStats = gameState.stats;
  const derivedStats = calculateDerivedStats(baseStats, classId === 'novato' ? null : classId);
  
  const statsGrid = document.getElementById('char-stats-grid');
  statsGrid.innerHTML = '';
  
  const maxStat = Math.max(...Object.values(derivedStats));
  
  for (const [statId, stat] of Object.entries(STATS)) {
    const baseValue = baseStats[statId] || 0;
    const totalValue = derivedStats[statId] || 0;
    const bonus = totalValue - baseValue;
    const pct = Math.round((totalValue / maxStat) * 100);
    
    statsGrid.innerHTML += `
      <div class="stat-item" data-stat="${statId}">
        <div class="stat-header">
          <div class="stat-name">${stat.abbr}</div>
          <div class="stat-value">${totalValue}${bonus > 0 ? ` <span style="color: var(--green); font-size: 11px;">(+${bonus})</span>` : ''}</div>
        </div>
        <div class="stat-bar">
          <div class="stat-fill" style="width: ${pct}%"></div>
        </div>
      </div>
    `;
  }
  
  // Combat resources
  const resources = calculateResources(derivedStats);
  document.getElementById('char-resources').innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
      <div style="text-align: center;">
        <div style="font-size: 24px; color: var(--red);">${LifeXPIcons.renderUI('ui.heart', { size: 24 })} ${resources.hp}</div>
        <div style="font-size: 11px; color: var(--text-muted);">HP</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 24px; color: var(--blue);">${LifeXPIcons.renderUI('ui.mana', { size: 24 })} ${resources.mp}</div>
        <div style="font-size: 11px; color: var(--text-muted);">MP</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 24px; color: var(--green);">${LifeXPIcons.renderUI('world.lightning', { size: 24 })} ${resources.sp}</div>
        <div style="font-size: 11px; color: var(--text-muted);">SP</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 24px; color: var(--purple);">${LifeXPIcons.renderUI('ui.target', { size: 24 })} ${resources.focusMax}</div>
        <div style="font-size: 11px; color: var(--text-muted);">Focus Max</div>
      </div>
    </div>
  `;
  
  // Class path
  const classPath = document.getElementById('char-class-path');
  if (classId && classId !== 'novato') {
    const chain = getClassChain(classId);
    classPath.innerHTML = chain.map((cId, i) => {
      const c = CLASS_TREE[cId];
      return `<span style="color: var(--gold);">${LifeXPIcons.renderClass(c, { size: 18 })} ${c.name}</span>`;
    }).join(' → ');
  } else {
    classPath.innerHTML = '<span style="color: var(--text-muted);">You have not chosen a class yet. Reach level 10 to unlock your first class.</span>';
  }
}

let currentInventoryTab = 'inventory';
let selectedItemId = null;

function switchInventoryTab(tab) {
  currentInventoryTab = tab;
  document.querySelectorAll('.inv-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.inv-tab[data-tab="${tab}"]`)?.classList.add('active');
  document.getElementById('inv-tab-inventory')?.classList.toggle('hidden', tab !== 'inventory');
  document.getElementById('inv-tab-stash')?.classList.toggle('hidden', tab !== 'stash');
  document.getElementById('inv-tab-equipment')?.classList.toggle('hidden', tab !== 'equipment');
  renderInventory();
}

function renderInventory() {
  const capacity = typeof getInventoryCapacity === 'function' ? getInventoryCapacity() : 20;
  const count = gameState.inventory.reduce((sum, i) => sum + (i.qty || 1), 0);
  document.getElementById('inv-count').textContent = `${count}/${capacity}`;
  const stashCount = (gameState.stash || []).reduce((sum, i) => sum + (i.qty || 1), 0);
  const stashLabel = document.getElementById('stash-count');
  if (stashLabel) stashLabel.textContent = `${stashCount}/${gameState.stashCapacity || 30}`;
  
  if (currentInventoryTab === 'stash') {
    renderStashGrid();
  } else if (currentInventoryTab === 'equipment') {
    renderEquipment();
  } else {
    renderInventoryGrid();
  }
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
    { key: 'weapon', name: 'Weapon', iconRef: 'item.weapon' },
    { key: 'armor', name: 'Armor', iconRef: 'item.armor' },
    { key: 'accessory1', name: 'Accessory 1', iconRef: 'item.accessory' },
    { key: 'accessory2', name: 'Accessory 2', iconRef: 'item.accessory' },
    { key: 'artifact', name: 'Artifact', iconRef: 'item.artifact' }
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
        <div class="equipment-slot-icon">${item ? LifeXPIcons.renderItem(item, { size: 28 }) : LifeXPIcons.renderUI(cfg.iconRef, { size: 28 })}</div>
        <div style="font-size: 11px; color: ${item ? rarity.color : 'var(--text-muted)'}; margin-top: 4px;">
          ${item ? item.name : cfg.name}
        </div>
      </div>
    `;
  }
  
  // Equipment stats
  if (typeof getEquipmentStats === 'function' && statsDiv) {
    const eqStats = getEquipmentStats();
    const hasStats = Object.values(eqStats).some(v => v > 0);
    
    if (hasStats) {
      statsDiv.innerHTML = Object.entries(eqStats)
        .filter(([_, v]) => v > 0)
        .map(([stat, val]) => `<span style="color: var(--stat-${stat}); margin-right: 12px;">${STATS[stat].abbr} +${val}</span>`)
        .join('');
    } else {
      statsDiv.innerHTML = '<span style="color: var(--text-muted);">No equipment</span>';
    }
  }
}


function showLegacyItemModal(slotIndex) {
  const slot = gameState.inventory?.[slotIndex];
  if (!slot) return;
  const oldName = slot.name || slot.legacyName || 'Unidentified reward';
  const used = Boolean(slot.recoveryUsed);
  document.getElementById('modal-item-content').innerHTML = `
    <div style="text-align:center;margin-bottom:12px;">
      <div style="font-size:48px;">${LifeXPIcons.renderUI('ui.generic', { size: 48 })}</div>
      <div style="font-size:18px;font-weight:700;color:var(--orange);">Unreadable reward</div>
      <div style="font-size:12px;color:var(--text-muted);">${oldName}</div>
    </div>
    <div style="font-size:13px;color:var(--text);line-height:1.5;">This reward comes from an older version and has no valid identifier. You can rebuild or reroll it once without losing progress.</div>
    <div style="margin-top:10px;font-size:11px;color:var(--text-muted);">Emergency reroll is a data-recovery tool, not a normal mechanic.</div>
  `;
  const actionBtn = document.getElementById('btn-item-action');
  actionBtn.innerHTML = used ? 'Recovery already used' : `${LifeXPIcons.renderUI('ui.refresh', { size: 16 })} Rebuild reward`;
  actionBtn.disabled = used;
  actionBtn.onclick = () => {
    if (used || typeof emergencyRerollLegacyItem !== 'function') return;
    const result = emergencyRerollLegacyItem(slotIndex);
    if (!result.success) { showToast('The reward could not be recovered.', 'error'); return; }
    closeModal('modal-item');
    renderInventory();
    showToast(result.method === 'name' ? 'Reward rebuilt.' : 'Reward rerolled.', 'gold');
  };
  openModal('modal-item');
}


function equipItemFromInventory(itemId) {
  initializeItemSystem();
  if (!gameState.itemSystem.equipAttempts) gameState.itemSystem.equipAttempts = {};
  var prevAttempts = gameState.itemSystem.equipAttempts[itemId] || 0;

  if (equipItem(itemId)) {
    // Track first successful equip
    if (!gameState.itemSystem.firstEquipped) gameState.itemSystem.firstEquipped = {};
    var isFirst = !gameState.itemSystem.firstEquipped[itemId];
    gameState.itemSystem.firstEquipped[itemId] = true;
    saveGame();
    closeModal('modal-item');
    renderInventory();
    renderCharacter();
    // Show equip_success flavor on first equip
    if (isFirst && typeof showToast === 'function') {
      var successText = getItemFlavorText(itemId, 'equip_success');
      showFlavorDialog(successText, 'success');
    }
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
      <button class="btn btn-gold mb-8" onclick="forceAppUpdate()">${LifeXPIcons.renderUI('ui.refresh', { size: 16 })} Update version</button>
      <button class="btn btn-secondary mb-8" onclick="exportData()">${LifeXPIcons.renderUI('ui.upload', { size: 16 })} Export save</button>
      <button class="btn btn-secondary mb-8" onclick="showImportModal()">${LifeXPIcons.renderUI('ui.download', { size: 16 })} Import save</button>
      <button class="btn btn-ghost" onclick="resetGame()" style="color: var(--red)">${LifeXPIcons.renderUI('ui.trash', { size: 16 })} Resetear progreso</button>
    </div>
    
    <div class="section-title">Content Planning</div>
    <div class="card">
      <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">
        Export a snapshot with usage metrics and suggestions to plan content updates with your Langdock agent.
      </p>
      <button class="btn btn-gold" onclick="exportSnapshot()">${LifeXPIcons.renderUI('ui.analytics', { size: 16 })} Export snapshot for agent</button>
    </div>
    
    <div class="section-title">Info</div>
    <div class="card">
      <p style="font-size: 13px; color: var(--text-muted);">
        LifeXP RPG v1.0 · Build ${LIFE_XP_BUILD}<br>
        Tasks: ${gameState.tasks.length}<br>
        Level: ${gameState.level}<br>
        XP Total: ${gameState.taskHistory.reduce((a, h) => a + h.xp, 0)}
      </p>
    </div>
  `;
}

// ===========================================================================
