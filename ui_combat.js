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
    playerLevel: playerLevel,
    threat
  };
}

function triggerEncounterAfterTask(task) {
  const encounter = checkForEncounter(task);
  if (encounter) {
    pendingEncounter = encounter;
    
    // Show encounter alert in completion overlay
    const threat = encounter.threat || { label: 'Encuentro', description: 'La amenaza se manifiesta ante ti.' };
    const alertHtml = `
      <div style="background: linear-gradient(135deg, rgba(255,77,109,0.2), transparent); 
                  border: 1px solid var(--accent); border-radius: 8px; padding: 12px; 
                  margin-top: 16px; text-align: center;">
        <div style="font-size: 24px; margin-bottom: 4px;">${encounter.enemy.icon}</div>
        <div style="font-size: 14px; font-weight: 700; color: var(--accent);">¡Encuentro!</div>
        <div style="font-size: 13px; font-weight: 700; color: var(--text);">${threat.label}</div>
        <div style="font-size: 12px; color: var(--text-muted);">${encounter.enemy.name} aparece · ${threat.description}</div>
      </div>
    `;
    
    const rewardsEl = document.getElementById('complete-rewards');
    rewardsEl.innerHTML += alertHtml;
    
    // Change continue button text
    document.getElementById('btn-complete-continue').textContent = '⚔️ ¡Al combate!';
  }
}

function startCombatFromEncounter(encounter) {
  if (!encounter || !encounter.enemy) {
    showScreen('hub');
    return;
  }
  
  // Initialize combat
  if (typeof initCombat === 'function') {
    const formation = encounter.formation || (Array.isArray(encounter.enemy)
      ? { members: encounter.enemy }
      : null);
    initCombat(encounter.enemy, encounter.tactical, {
      type: encounter.type || encounter.enemy.type || 'common',
      playerLevel: encounter.playerLevel || gameState.level || 1,
      threat: encounter.threat || null,
      formation
    });
  }
  
  // Show combat screen
  showScreen('combat');
  renderCombatScreen();
}

// ===========================================================================
// COMBAT UI
// ===========================================================================

function escapeCombatHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getCombatUiMembers() {
  if (typeof getCombatMembers === 'function') {
    return getCombatMembers();
  }
  return combatState?.enemy ? [combatState.enemy] : [];
}

function renderCombatEnemyList(members, selectedTargetInstanceId) {
  const listEl = document.getElementById('combat-enemies-list');
  if (!listEl) return;

  listEl.innerHTML = '';
  if (members.length === 0) {
    listEl.innerHTML = '<div class="combat-enemy-empty">No quedan enemigos en pie.</div>';
    return;
  }

  members.forEach((member, index) => {
    const defeated = Number(member.hp) <= 0;
    const selected = !defeated && member.instanceId === selectedTargetInstanceId;
    const suffix = index === 0 ? '' : `-${index}`;
    const hp = Math.max(0, Number(member.hp) || 0);
    const maxHp = Math.max(1, Number(member.maxHp) || Number(member.hp) || 1);
    const hpPercent = Math.max(0, Math.min(100, (hp / maxHp) * 100));
    const card = document.createElement('button');
    card.type = 'button';
    card.className = `combat-enemy-card${selected ? ' selected' : ''}${defeated ? ' defeated' : ''}`;
    card.dataset.instanceId = member.instanceId || '';
    card.disabled = defeated;
    card.setAttribute('aria-pressed', selected ? 'true' : 'false');
    card.setAttribute('aria-label', defeated
      ? `${member.name}, derrotado`
      : `${member.name}, nivel ${member.level}, ${selected ? 'objetivo seleccionado' : 'seleccionar como objetivo'}`);
    card.innerHTML = `
      <div class="combat-enemy-card-top">
        <span id="combat-enemy-icon${suffix}" class="combat-enemy-card-icon">${escapeCombatHtml(member.icon || '👾')}</span>
        <span class="combat-enemy-card-heading">
          <span id="combat-enemy-name${suffix}" class="combat-enemy-card-name">${escapeCombatHtml(member.name || 'Enemigo')}</span>
          <span id="combat-enemy-level${suffix}" class="combat-enemy-card-level">Lv ${escapeCombatHtml(member.level)}</span>
        </span>
        <span class="combat-enemy-card-target">${defeated ? 'Derrotado' : selected ? 'Objetivo' : 'Seleccionar'}</span>
      </div>
      <div class="combat-enemy-card-hp-row">
        <span class="combat-enemy-card-hp-label">❤️ HP</span>
        <span class="combat-enemy-card-hp-track">
          <span id="combat-enemy-hp-fill${suffix}" class="combat-enemy-card-hp-fill" style="width: ${hpPercent}%;"></span>
        </span>
        <span id="combat-enemy-hp${suffix}" class="combat-enemy-card-hp-value">${hp}/${maxHp}</span>
      </div>
    `;
    if (!defeated) {
      card.addEventListener('click', () => selectCombatTarget(member.instanceId));
    }
    listEl.appendChild(card);
  });
}

function renderCombatScreen() {
  if (!combatState) return;
  
  const p = combatState.player;
  const members = getCombatUiMembers();
  const livingMembers = members.filter(member => Number(member.hp) > 0);
  let selectedTarget = null;
  if (typeof normalizeSelectedCombatTarget === 'function') {
    selectedTarget = normalizeSelectedCombatTarget();
  } else {
    selectedTarget = livingMembers.find(member => member.instanceId === combatState.selectedTargetInstanceId)
      || livingMembers[0]
      || null;
    if (selectedTarget) combatState.selectedTargetInstanceId = selectedTarget.instanceId;
  }
  
  renderCombatEnemyList(members, selectedTarget?.instanceId || null);
  
  // Player section
  document.getElementById('combat-player-hp').textContent = `${p.hp}/${p.maxHp}`;
  document.getElementById('combat-player-hp-fill').style.width = `${Math.max(0, Math.min(100, (p.hp / p.maxHp) * 100))}%`;
  document.getElementById('combat-player-mp').textContent = `${p.mp}/${p.maxMp}`;
  document.getElementById('combat-player-mp-fill').style.width = `${Math.max(0, Math.min(100, (p.mp / p.maxMp) * 100))}%`;
  document.getElementById('combat-player-sp').textContent = `${p.sp}/${p.maxSp}`;
  document.getElementById('combat-player-sp-fill').style.width = `${Math.max(0, Math.min(100, (p.sp / p.maxSp) * 100))}%`;
  document.getElementById('combat-player-focus').textContent = `${p.focus}/${p.focusMax}`;
  document.getElementById('combat-player-focus-fill').style.width = `${Math.max(0, Math.min(100, (p.focus / p.focusMax) * 100))}%`;
  
  // Actions
  renderCombatActions();
  
  // Log
  renderCombatLog();
  
  // Phase indicator
  const phaseEl = document.getElementById('combat-phase');
  if (combatState.phase === 'player') {
    phaseEl.textContent = 'Tu turno';
    phaseEl.style.color = 'var(--green)';
  } else if (combatState.phase === 'enemy') {
    phaseEl.textContent = 'Turno enemigo';
    phaseEl.style.color = 'var(--red)';
  }
}

function selectCombatTarget(instanceId) {
  if (!combatState || combatState.phase !== 'player') return false;
  const target = typeof setCombatTarget === 'function'
    ? setCombatTarget(instanceId)
    : getCombatUiMembers().find(member => member.instanceId === instanceId && Number(member.hp) > 0);
  if (!target) return false;
  combatState.selectedTargetInstanceId = target.instanceId;
  renderCombatScreen();
  return true;
}

function renderCombatActions() {
  const actionsEl = document.getElementById('combat-actions');
  if (!actionsEl) return;
  
  const actions = typeof getAvailableActions === 'function' ? getAvailableActions() : [];
  
  actionsEl.innerHTML = '';
  
  for (const action of actions) {
    const disabled = !action.available;
    const costText = action.cost ? ` (${action.cost} ${action.costType?.toUpperCase() || ''})` : '';
    
    actionsEl.innerHTML += `
      <button class="combat-action-btn ${disabled ? 'disabled' : ''}" 
              onclick="${disabled ? '' : `executeCombatAction('${action.id}')`}"
              ${disabled ? 'disabled' : ''}>
        <span class="combat-action-icon">${action.icon}</span>
        <span class="combat-action-name">${action.name}${costText}</span>
      </button>
    `;
  }
}

function renderCombatLog() {
  const logEl = document.getElementById('combat-log');
  if (!logEl || !combatState) return;
  
  const logs = combatState.log.slice(-5); // Last 5 entries
  logEl.innerHTML = logs.map(l => `<div class="combat-log-entry">${l.message}</div>`).join('');
  logEl.scrollTop = logEl.scrollHeight;
}

function executeCombatAction(actionId) {
  if (!combatState || combatState.phase !== 'player') return;
  
  const result = executePlayerAction(actionId, combatState.selectedTargetInstanceId || null);
  renderCombatScreen();
  
  // Check for end conditions
  if (combatState.phase === 'victory') {
    setTimeout(() => showCombatVictory(), 500);
  } else if (combatState.phase === 'defeat') {
    setTimeout(() => showCombatDefeat(), 500);
  } else if (combatState.phase === 'fled') {
    setTimeout(() => endCombatAndReturn(), 500);
  } else if (combatState.phase === 'enemy') {
    // Enemy turn with delay
    setTimeout(() => {
      executeEnemyTurn();
      renderCombatScreen();
      
      if (combatState.phase === 'defeat') {
        setTimeout(() => showCombatDefeat(), 500);
      }
    }, 800);
  }
}

function showCombatVictory() {
  // Apply the victory package idempotently; repeated rendering must not replay it.
  const application = typeof applyCombatRewards === 'function' ? applyCombatRewards() : null;
  const rewards = combatState?.rewards;
  const dropResults = application?.dropResults || [];
  
  // Show victory overlay
  document.getElementById('combat-result-icon').textContent = '\uD83C\uDFC6';
  document.getElementById('combat-result-title').textContent = '¡Victoria!';
  const defeatedMembers = getCombatUiMembers();
  document.getElementById('combat-result-subtitle').textContent = defeatedMembers.length === 1
    ? `${defeatedMembers[0].name} derrotado`
    : `${defeatedMembers.length} enemigos derrotados`;
  
  let rewardsHtml = '';
  if (rewards) {
    rewardsHtml = `
      <div class="complete-reward gold">+${rewards.xp} XP</div>
      <div class="complete-reward">+${rewards.gold} \uD83E\uDE99</div>
    `;
    if (rewards.drops && rewards.drops.length > 0) {
      rewards.drops.forEach((drop, index) => {
        const item = typeof ITEMS !== 'undefined' ? ITEMS[drop] : null;
        const result = dropResults[index];
        const statusLabel = result?.status === 'pending'
          ? ' (pendiente: libera espacio para recuperarlo)'
          : result?.status === 'rejected'
            ? ' (no entregado: revisa recuperación)'
            : '';
        rewardsHtml += `<div class="complete-reward" style="color: var(--purple);">\uD83C\uDF81 ${item?.name || drop}${statusLabel}</div>`;
      });
    }
  }
  document.getElementById('combat-result-rewards').innerHTML = rewardsHtml;
  
  document.getElementById('combat-result-overlay').classList.add('show');
}

function showCombatDefeat() {
  document.getElementById('combat-result-icon').textContent = '\uD83D\uDC80';
  document.getElementById('combat-result-title').textContent = 'Derrotado...';
  document.getElementById('combat-result-subtitle').textContent = 'Vives para luchar otro día';
  document.getElementById('combat-result-rewards').innerHTML = '';
  
  document.getElementById('combat-result-overlay').classList.add('show');
}

function endCombatAndReturn() {
  if (typeof endCombat === 'function') {
    endCombat();
  }
  document.getElementById('combat-result-overlay').classList.remove('show');
  showScreen('hub');
  renderHub();
}

// ===========================================================================
// SAVE FOR LATER
// ===========================================================================

function saveForLater() {
  if (!currentTask) return;
  if (!gameState.savedTasks.includes(currentTask.id)) {
    gameState.savedTasks.push(currentTask.id);
    saveGame();
  }
  showScreen('hub');
}

function showSavedTasks() {
  const list = document.getElementById('modal-tasks-list');
  document.getElementById('modal-tasks-title').textContent = '\uD83D\uDCCC Tareas guardadas';
  
  list.innerHTML = '';
  for (const taskId of gameState.savedTasks) {
    const task = getTaskById(taskId);
    if (!task) continue;
    const cat = CATEGORIES[task.cat];
    list.innerHTML += `
      <div class="card" style="cursor: pointer;" onclick="openSavedTask('${task.id}')">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 20px;">${cat.icon}</span>
          <div>
            <div style="font-weight: 600;">${task.name}</div>
            <div style="font-size: 12px; color: var(--text-muted);">${cat.name}</div>
          </div>
        </div>
      </div>
    `;
  }
  
  document.getElementById('modal-tasks').classList.add('show');
}

function openSavedTask(taskId) {
  closeModal('modal-tasks');
  currentTask = getTaskById(taskId);
  currentIsOverflow = isTaskOverdue(currentTask);
  currentCatFilter = null;
  renderTaskScreen();
  showScreen('task');
  resetTimer();
}

function showOverflowTasks() {
  const list = document.getElementById('modal-tasks-list');
  document.getElementById('modal-tasks-title').textContent = '⚡ Tareas overflow';
  
  const overflow = getOverflowTasks();
  list.innerHTML = '';
  
  for (const task of overflow) {
    const cat = CATEGORIES[task.cat];
    list.innerHTML += `
      <div class="card" style="cursor: pointer;" onclick="openOverflowTask('${task.id}')">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 20px;">${cat.icon}</span>
          <div>
            <div style="font-weight: 600;">${task.name}</div>
            <div style="font-size: 12px; color: var(--text-muted);">${cat.name} · ⚡ Overflow</div>
          </div>
        </div>
      </div>
    `;
  }
  
  document.getElementById('modal-tasks').classList.add('show');
}

function openOverflowTask(taskId) {
  closeModal('modal-tasks');
  currentTask = getTaskById(taskId);
  currentIsOverflow = true;
  currentCatFilter = null;
  renderTaskScreen();
  showScreen('task');
  resetTimer();
}

