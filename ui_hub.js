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
      <div class="cat-card" data-cat="${catId}" role="button" tabindex="0" aria-label="Abrir categoría ${cat.name}" onclick="openCategory('${catId}')" onkeydown="if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openCategory('${catId}'); }">
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
  const classChangeSection = document.getElementById('class-change-section');
  if (availableChanges.length > 0) {
    classChangeSection.classList.remove('hidden');
    const classChangeList = document.getElementById('class-change-list');
    classChangeList.innerHTML = availableChanges.map(c => `
      <button class="class-option" onclick="selectClass('${c.id}')">
        <span class="class-option-icon">${c.icon}</span>
        <span class="class-option-name">${c.name}</span>
        <span class="class-option-desc">${c.desc}</span>
      </button>
    `).join('');
  } else {
    classChangeSection.classList.add('hidden');
  }
  
  // Stats
  for (const [statId, stat] of Object.entries(STATS)) {
    const value = gameState.stats[statId];
    const el = document.getElementById(`stat-${statId}`);
    el.textContent = value;
    el.style.width = Math.min(100, value) + '%';
  }
  
  // Class skills
  const skillsDiv = document.getElementById('char-skills');
  if (cls && cls.skills) {
    skillsDiv.innerHTML = cls.skills.map(skill => `
      <div class="skill-card ${skill.unlockedAt <= level ? 'unlocked' : 'locked'}">
        <span class="skill-icon">${skill.icon}</span>
        <div class="skill-info">
          <div class="skill-name">${skill.name}</div>
          <div class="skill-desc">${skill.desc}</div>
          <div class="skill-level">Nivel ${skill.unlockedAt}</div>
        </div>
      </div>
    `).join('');
  } else {
    skillsDiv.innerHTML = '<div class="empty-state">Elige una clase para desbloquear habilidades.</div>';
  }
}

function renderInventory() {
  // Header stats
  document.getElementById('inv-gold').textContent = gameState.gold;
  
  const inventory = gameState.inventory || [];
  const stash = gameState.stash || [];
  const capacity = getInventoryCapacity();
  const stashCapacity = gameState.stashCapacity || 30;
  
  document.getElementById('inv-count').textContent = inventory.length;
  document.getElementById('inv-capacity').textContent = capacity;
  document.getElementById('stash-count').textContent = stash.length;
  document.getElementById('stash-capacity').textContent = stashCapacity;
  
  // Tabs
  document.querySelectorAll('.inv-tab').forEach(tab => {
    tab.onclick = () => switchInventoryTab(tab.dataset.tab);
  });
  
  renderInventoryTab('inventory');
}

function renderInventoryTab(tab) {
  const content = document.getElementById('inventory-content');
  
  if (tab === 'inventory') {
    const inventory = gameState.inventory || [];
    if (inventory.length === 0) {
      content.innerHTML = '<div class="empty-state">Tu inventario está vacío.</div>';
      return;
    }
    content.innerHTML = inventory.map(itemId => {
      const item = ITEMS[itemId];
      if (!item) return '';
      const rarity = RARITY[item.rarity];
      return `
        <div class="inv-item" onclick="showItemDetail('${itemId}')">
          <span class="inv-item-icon">${item.icon}</span>
          <div class="inv-item-info">
            <div class="inv-item-name" style="color: ${rarity.color};">${item.name}</div>
            <div class="inv-item-type">${ITEM_TYPE[item.type].icon} ${ITEM_TYPE[item.type].name}</div>
          </div>
        </div>
      `;
    }).join('');
  } else {
    const stash = gameState.stash || [];
    if (stash.length === 0) {
      content.innerHTML = '<div class="empty-state">Tu baúl está vacío.</div>';
      return;
    }
    content.innerHTML = stash.map(itemId => {
      const item = ITEMS[itemId];
      if (!item) return '';
      const rarity = RARITY[item.rarity];
      return `
        <div class="inv-item" onclick="showItemDetail('${itemId}')">
          <span class="inv-item-icon">${item.icon}</span>
          <div class="inv-item-info">
            <div class="inv-item-name" style="color: ${rarity.color};">${item.name}</div>
            <div class="inv-item-type">${ITEM_TYPE[item.type].icon} ${ITEM_TYPE[item.type].name}</div>
          </div>
        </div>
      `;
    }).join('');
  }
}

function switchInventoryTab(tab) {
  document.querySelectorAll('.inv-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  renderInventoryTab(tab);
}

function getInventoryCapacity() {
  return 20 + (gameState.inventoryCapacityBonus || 0);
}

function showItemDetail(itemId) {
  const item = ITEMS[itemId];
  if (!item) return;
  const modal = document.getElementById('item-modal');
  const rarity = RARITY[item.rarity];
  document.getElementById('item-modal-icon').textContent = item.icon;
  document.getElementById('item-modal-name').textContent = item.name;
  document.getElementById('item-modal-name').style.color = rarity.color;
  document.getElementById('item-modal-rarity').textContent = rarity.name;
  document.getElementById('item-modal-type').textContent = ITEM_TYPE[item.type].name;
  document.getElementById('item-modal-desc').textContent = item.desc;
  
  // Stats
  const statsDiv = document.getElementById('item-modal-stats');
  if (item.stats) {
    statsDiv.innerHTML = Object.entries(item.stats).map(([stat, val]) =>
      `<span class="item-stat">+${val} ${STATS[stat].abbr}</span>`
    ).join('');
  } else {
    statsDiv.innerHTML = '';
  }
  
  modal.classList.add('show');
}

function showOverflowTasks() {
  const overflow = getOverflowTasks();
  if (overflow.length === 0) return;
  currentTask = overflow[0];
  currentIsOverflow = true;
  renderTaskScreen();
  showScreen('task');
  resetTimer();
}

function showSavedTasks() {
  const saved = gameState.tasks.filter(t => gameState.savedTasks.includes(t.id));
  if (saved.length === 0) return;
  currentTask = saved[0];
  currentIsOverflow = false;
  renderTaskScreen();
  showScreen('task');
  resetTimer();
}
