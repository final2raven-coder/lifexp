// ===========================================================================
// LifeXP RPG - ui_combat.js
// UI de combate, tareas guardadas y overflow.
// Depende de: engine.js, combat.js.
// ===========================================================================

// ===========================================================================
// ENCOUNTER SYSTEM
// ===========================================================================

function checkForEncounter(task) {
  // Check if combat system is available
  if (typeof rollEncounter !== 'function' || typeof pickRandomEnemy !== 'function') {
    return null;
  }
  
  const theme = task.drops?.theme || null;
  const playerLevel = gameState.level || 1;
  
  // Roll for encounter
  if (!rollEncounter(theme, playerLevel)) {
    return null;
  }
  
  // Determine encounter type
  const encounterType = getEncounterType(playerLevel);
  
  // Pick enemy
  const enemy = typeof pickEncounterEnemy === 'function'
    ? pickEncounterEnemy(theme, playerLevel, encounterType)
    : pickRandomEnemy(theme, playerLevel, encounterType);
  if (!enemy) return null;
  
  // Scale newly generated encounters inside the declared difficulty band.
  const targetLevel = typeof getEncounterTargetLevel === 'function'
    ? getEncounterTargetLevel(playerLevel, encounterType)
    : Math.max(1, playerLevel);
  const scaledEnemy = typeof scaleEncounterEnemy === 'function'
    ? scaleEncounterEnemy(enemy, targetLevel)
    : (typeof scaleEnemy === 'function' ? scaleEnemy(enemy, targetLevel) : enemy);
  const threat = typeof getEncounterThreat === 'function'
    ? getEncounterThreat(encounterType, scaledEnemy.level, playerLevel)
    : null;
  
  return {
    enemy: scaledEnemy,
    tactical: encounterType !== 'common', // Elite and boss = tactical
    theme: theme,
    type: encounterType,
    threat: threat
  };
}

function handleTaskCompletionResult(result) {
  if (!result) return;
  
  if (result.encounter) {
    // Store encounter and show combat prompt
    gameState.pendingEncounter = result.encounter;
    saveGame();
    
    document.getElementById('complete-message').textContent = 'An enemy appears!';
    document.getElementById('btn-complete-continue').innerHTML = `${LifeXPIcons.renderUI('ui.sword', { size: 18 })} To combat!`;
    document.getElementById('btn-complete-continue').onclick = () => {
      startPendingEncounter();
    };
  } else {
    document.getElementById('btn-complete-continue').textContent = 'Continue';
    document.getElementById('btn-complete-continue').onclick = () => showScreen('hub');
  }
}

function startPendingEncounter() {
  const encounter = gameState.pendingEncounter;
  if (!encounter) return;
  
  gameState.pendingEncounter = null;
  saveGame();
  
  showScreen('combat');
  initCombat(encounter);
}

function renderCombatScreen() {
  if (!combatState) return;
  
  const encounter = combatState.encounter;
  if (!encounter) return;
  
  const enemy = encounter.enemy;
  const threatLabel = encounter.threat ? encounter.threat.label : (encounter.tactical ? 'Tactical encounter' : 'Common encounter');
  const threatColor = encounter.threat ? encounter.threat.color : (encounter.tactical ? 'var(--orange)' : 'var(--green)');
  const enemyLevelLabel = enemy.level ? `Lv ${enemy.level}` : '';
  
  const content = document.getElementById('combat-content');
  if (!content) return;
  
  content.innerHTML = `
    <div class="combat-encounter-header" style="border-color: ${threatColor};">
      <div class="combat-encounter-icon">${LifeXPIcons.renderEnemy(encounter.enemy, { size: 28 })}</div>
      <div class="combat-encounter-title">
        <div class="combat-encounter-type" style="color: ${threatColor};">${threatLabel}</div>
        <div class="combat-encounter-name">${enemy.name} ${enemyLevelLabel}</div>
      </div>
    </div>
    <div id="combat-members" class="combat-members"></div>
    <div id="combat-actions" class="combat-actions"></div>
    <div id="combat-log" class="combat-log"></div>
  `;
  renderCombatMembers();
  renderCombatActions();
  renderCombatLog();
}

function escapeCombatHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function combatMemberLabel(member) {
  const suffix = member.instanceId && member.instanceId !== member.id ? ` · ${member.instanceId}` : '';
  return `${escapeCombatHtml(member.name || member.id || 'Enemy')}${suffix}`;
}

function renderCombatMembers() {
  const membersDiv = document.getElementById('combat-members');
  if (!membersDiv || !combatState) return;
  
  const members = getCombatMembers();
  membersDiv.innerHTML = members.map(member => {
    const hp = Math.max(0, member.currentHp ?? member.hp ?? 0);
    const maxHp = Math.max(1, member.maxHp ?? member.hp ?? 1);
    const pct = Math.max(0, Math.min(100, Math.round((hp / maxHp) * 100)));
    const isTarget = combatState.targetInstanceId === member.instanceId;
    const isDead = hp <= 0;
    const suffix = member.instanceId ? `-${escapeCombatHtml(member.instanceId)}` : '';
    return `
      <button type="button" class="combat-enemy-card ${isTarget ? 'selected' : ''} ${isDead ? 'defeated' : ''}" data-combat-target="${escapeCombatHtml(member.instanceId || member.id)}">
        <span id="combat-enemy-icon${suffix}" class="combat-enemy-card-icon">${LifeXPIcons.renderEnemy(member, { size: 36 })}</span>
        <span class="combat-enemy-card-name">${combatMemberLabel(member)}</span>
        <span class="combat-enemy-card-hp"><span class="combat-enemy-card-hp-fill" style="width:${pct}%"></span></span>
        <span class="combat-enemy-card-hp-label">${LifeXPIcons.renderUI('ui.heart', { size: 14 })} HP</span>
      </button>
    `;
  }).join('');
  
  membersDiv.querySelectorAll('[data-combat-target]').forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-combat-target');
      setCombatTarget(targetId);
      renderCombatMembers();
    });
  });
}

function renderCombatActions() {
  const actionsDiv = document.getElementById('combat-actions');
  if (!actionsDiv || !combatState) return;
  
  const actions = getAvailableActions();
  if (!actions.length) {
    actionsDiv.innerHTML = '<div class="empty-state">No actions available.</div>';
    return;
  }
  
  actionsDiv.innerHTML = actions.map(action => `
    <button type="button" class="combat-action-btn ${action.disabled ? 'disabled' : ''}" data-combat-action="${escapeCombatHtml(action.id)}" ${action.disabled ? 'disabled' : ''}>
      <span class="combat-action-icon">${LifeXPIcons.renderAction(action, { size: 24 })}</span>
      <span class="combat-action-name">${escapeCombatHtml(action.name)}</span>
      <span class="combat-action-cost">${escapeCombatHtml(action.costLabel || '')}</span>
    </button>
  `).join('');
  
  actionsDiv.querySelectorAll('[data-combat-action]').forEach(button => {
    button.addEventListener('click', () => {
      if (button.disabled) return;
      executePlayerAction(button.getAttribute('data-combat-action'));
    });
  });
}

function renderCombatLog() {
  const log = document.getElementById('combat-log');
  if (!log || !combatState) return;
  log.innerHTML = (combatState.log || []).map(entry => {
    const typeClass = entry.type ? ` combat-log-${escapeCombatHtml(entry.type)}` : '';
    return `<div class="combat-log-entry${typeClass}">${escapeCombatHtml(entry.message)}</div>`;
  }).join('');
  log.scrollTop = log.scrollHeight;
}

function refreshCombatUi() {
  renderCombatMembers();
  renderCombatActions();
  renderCombatLog();
}

function finishCombat(result) {
  if (!result) return;
  const message = result.victory ? 'Victory!' : 'Defeat';
  const completeMessage = document.getElementById('complete-message');
  if (completeMessage) completeMessage.textContent = message;
  const continueButton = document.getElementById('btn-combat-continue');
  if (continueButton) {
    continueButton.textContent = 'Continue';
    continueButton.onclick = () => showScreen('hub');
  }
}

function renderSavedTasks() {
  const list = document.getElementById('saved-tasks-list');
  if (!list) return;
  const tasks = (gameState.savedTasks || []).map(taskId => gameState.tasks.find(task => task.id === taskId)).filter(Boolean);
  if (!tasks.length) {
    list.innerHTML = '<div class="empty-state">No saved tasks.</div>';
    return;
  }
  list.innerHTML = tasks.map(task => {
    const cat = CATEGORIES[task.cat] || { name: task.cat || 'Unknown', iconRef: 'category.generic' };
    return `
      <button type="button" class="task-list-row" data-task-id="${escapeCombatHtml(task.id)}">
        <span class="task-list-category-icon">${LifeXPIcons.renderCategory({ ...cat, id: task.cat, iconRef: `category.${task.cat}` }, { size: 20 })}</span>
        <span class="task-list-title">${escapeCombatHtml(task.title)}</span>
      </button>
    `;
  }).join('');
}

function showSavedTasks() {
  renderSavedTasks();
  openModal('modal-saved-tasks');
}

function renderOverflowTasks() {
  const list = document.getElementById('overflow-tasks-list');
  if (!list) return;
  const tasks = getOverflowTasks();
  const title = document.getElementById('modal-tasks-title');
  if (title) title.innerHTML = `${LifeXPIcons.renderUI('world.lightning', { size: 18 })} Overflow tasks`;
  if (!tasks.length) {
    list.innerHTML = '<div class="empty-state">No overflow tasks.</div>';
    return;
  }
  list.innerHTML = tasks.map(task => {
    const cat = CATEGORIES[task.cat] || { name: task.cat || 'Unknown', iconRef: 'category.generic' };
    return `
      <button type="button" class="task-list-row" data-task-id="${escapeCombatHtml(task.id)}">
        <span class="task-list-category-icon">${LifeXPIcons.renderCategory({ ...cat, id: task.cat, iconRef: `category.${task.cat}` }, { size: 20 })}</span>
        <span class="task-list-title">${escapeCombatHtml(task.title)}</span>
        <span class="task-list-meta">${escapeCombatHtml(cat.name)} · ${LifeXPIcons.renderUI('world.lightning', { size: 14 })} Overflow</span>
      </button>
    `;
  }).join('');
}

function showOverflowTasks() {
  renderOverflowTasks();
  openModal('modal-overflow-tasks');
}

if (typeof document !== 'undefined') {
  document.addEventListener('click', event => {
    const target = event.target.closest('[data-combat-target]');
    if (target) {
      setCombatTarget(target.getAttribute('data-combat-target'));
      renderCombatMembers();
    }
    const taskRow = event.target.closest('.task-list-row[data-task-id]');
    if (taskRow) {
      closeModal(taskRow.closest('.modal-overlay')?.id);
      openTask(taskRow.getAttribute('data-task-id'));
    }
  });
}
