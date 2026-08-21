// ===========================================================================
// LifeXP RPG - ui_tasks.js
// Navegacion de tareas, renderizado, completado, drops y encuentros.
// Depende de: engine.js, items.js, combat.js, quests.js.
// ===========================================================================

// TASK SCREEN
// ===========================================================================

function openRandomTask() {
  currentCatFilter = null;
  const { tasks, isOverflow } = getAvailableTasks();
  if (tasks.length === 0) {
    alert('¡No hay tareas disponibles!');
    return;
  }
  currentTask = pickRandomTask(tasks);
  currentIsOverflow = isOverflow;
  renderTaskScreen();
  showScreen('task');
  resetTimer();
}

function openCategory(catId) {
  currentCatFilter = catId;
  const { tasks, isOverflow } = getAvailableTasks(catId);
  if (tasks.length === 0) {
    alert('¡No hay tareas disponibles en esta categoría!');
    return;
  }
  currentTask = pickRandomTask(tasks);
  currentIsOverflow = isOverflow;
  renderTaskScreen();
  showScreen('task');
  resetTimer();
}

function shuffleTask() {
  const { tasks, isOverflow } = getAvailableTasks(currentCatFilter);
  if (tasks.length <= 1) return;
  
  let newTask;
  let attempts = 0;
  do {
    newTask = pickRandomTask(tasks);
    attempts++;
  } while (newTask.id === currentTask.id && attempts < 10);
  
  currentTask = newTask;
  currentIsOverflow = isOverflow;
  renderTaskScreen();
  resetTimer();
}

function renderTaskScreen() {
  const task = currentTask;
  const cat = CATEGORIES[task.cat];
  
  // Card
  const card = document.getElementById('task-card');
  card.setAttribute('data-cat', task.cat);
  
  // Category label
  document.getElementById('task-cat-label').innerHTML = `${cat.icon} ${cat.name}`;
  document.getElementById('task-cat-badge').innerHTML = `
    <span style="color: ${cat.color}; font-size: 12px;">${cat.icon} ${cat.name}</span>
  `;
  
  // Task info
  document.getElementById('task-name').textContent = task.name;
  document.getElementById('task-desc').textContent = task.desc;
  
  // Rewards
  const rewardsDiv = document.getElementById('task-rewards');
  let rewardsHtml = '';
  
  for (const [stat, pct] of Object.entries(task.stats)) {
    const points = Math.max(1, Math.floor(pct / 10));
    rewardsHtml += `<div class="task-reward stat-${stat}">+${points} ${STATS[stat].abbr}</div>`;
  }
  rewardsHtml += `<div class="task-reward xp">+${task.xp} XP</div>`;
  rewardsDiv.innerHTML = rewardsHtml;
  
  // Drops
  const dropsBox = document.getElementById('task-drops-box');
  if (task.drops) {
    dropsBox.classList.remove('hidden');
    document.getElementById('task-drops').textContent = task.drops.items.join(', ');
  } else {
    dropsBox.classList.add('hidden');
  }
  
  // Side quest
  const sqBox = document.getElementById('side-quest-box');
  if (task.sideQuest) {
    sqBox.classList.remove('hidden');
    document.getElementById('side-quest-desc').textContent = task.sideQuest.desc;
    
    let sqRewards = '';
    for (const [stat, val] of Object.entries(task.sideQuest.stats)) {
      sqRewards += `<span class="side-quest-reward">+${Math.max(1, Math.floor(val/10))} ${STATS[stat].abbr}</span>`;
    }
    sqRewards += `<span class="side-quest-reward">+${task.sideQuest.xp} XP</span>`;
    if (task.sideQuest.dropBonus > 0) {
      sqRewards += `<span class="side-quest-reward">+${task.sideQuest.dropBonus}% drop</span>`;
    }
    document.getElementById('side-quest-rewards').innerHTML = sqRewards;
  } else {
    sqBox.classList.add('hidden');
  }
}

// ===========================================================================
// TASK COMPLETION
// ===========================================================================

function hasTaskCompletionForToday(task) {
  if (!task || !Array.isArray(gameState.taskHistory)) return false;
  const today = todayStr();
  return gameState.taskHistory.some(entry => {
    if (!entry || entry.taskId !== task.id || entry.date !== today) return false;
    const taskInState = gameState.tasks.find(candidate => candidate.id === task.id);
    return Boolean(taskInState && taskInState.lastDone === today);
  });
}

function getPendingTaskResult() {
  if (typeof normalizePendingTaskResult !== 'function') return gameState.pendingTaskResult || null;
  return normalizePendingTaskResult(gameState.pendingTaskResult);
}

function hasPendingTaskResult() {
  return Boolean(getPendingTaskResult());
}

function isTaskResultModalVisible() {
  return document.getElementById('complete-overlay')?.classList.contains('show') || false;
}

function renderTaskResultDrop(drop) {
  const dropBox = document.getElementById('complete-drop');
  const dropItem = document.getElementById('complete-drop-item');
  if (!drop || !dropItem) {
    dropBox?.classList.add('hidden');
    return;
  }
  dropBox?.classList.remove('hidden');
  const item = drop.itemId && typeof ITEMS !== 'undefined' ? ITEMS[drop.itemId] : null;
  if (item) {
    const rarity = typeof RARITY !== 'undefined' ? RARITY[drop.rarity || item.rarity] : null;
    const suffix = drop.status === 'pending'
      ? ' (pendiente: libera espacio para recuperarlo)'
      : drop.status === 'rejected'
        ? ' (no entregado: revisa recuperación)'
        : '';
    const label = `${item.icon} ${item.name}${suffix}`;
    if (rarity?.color) {
      dropItem.innerHTML = `<span style="color: ${rarity.color};">${label}</span>`;
    } else {
      dropItem.textContent = label;
    }
    return;
  }
  dropItem.textContent = drop.status === 'pending'
    ? 'Recompensa pendiente: libera espacio para recuperarla'
    : drop.status === 'rejected'
      ? 'Recompensa no resoluble: conservada para recuperación'
      : 'Recompensa recibida';
}

function renderTaskResultModal(result, task = null) {
  const overlay = document.getElementById('complete-overlay');
  if (!overlay || !result) return false;
  const resolvedTask = task || gameState.tasks.find(candidate => candidate.id === result.taskId) || null;
  const taskName = result.taskName || resolvedTask?.name || result.taskId;
  const awaitingSideQuest = result.status === 'awaiting_side_quest';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-hidden', 'false');
  overlay.setAttribute('aria-label', 'Resultado de tarea');
  overlay.dataset.resultStatus = result.status;
  overlay.classList.add('show');

  document.getElementById('complete-icon').textContent = awaitingSideQuest
    ? (result.isOverflow ? '⚡' : '\uD83C\uDFC6')
    : (result.leveledUp ? '\uD83C\uDF89' : (result.isOverflow ? '⚡' : '\uD83C\uDFC6'));
  document.getElementById('complete-title').textContent = awaitingSideQuest
    ? (result.isOverflow ? '¡Overflow eliminado!' : '¡Tarea completada!')
    : (result.leveledUp ? '¡Subiste de nivel!' : (result.isOverflow ? '¡Overflow eliminado!' : '¡Tarea completada!'));
  document.getElementById('complete-subtitle').textContent = taskName;

  let rewardsHtml = '';
  if (awaitingSideQuest && resolvedTask) {
    const previewXp = Math.round(resolvedTask.xp * (result.isOverflow ? 1.5 : 1));
    rewardsHtml = `<div class="complete-reward gold">+${previewXp} XP</div>`;
    for (const [stat, pct] of Object.entries(resolvedTask.stats)) {
      const points = Math.max(1, Math.floor(pct / 10));
      rewardsHtml += `<div class="complete-reward green">+${points} ${STATS[stat].abbr}</div>`;
    }
  } else if (awaitingSideQuest) {
    rewardsHtml = '<div class="complete-reward gold">Resultado guardado</div>';
  } else {
    rewardsHtml = `<div class="complete-reward gold">+${result.totalXp} XP</div>`;
    rewardsHtml += `<div class="complete-reward">+${result.goldEarned} \uD83E\uDE99</div>`;
  }
  document.getElementById('complete-rewards').innerHTML = rewardsHtml;

  if (awaitingSideQuest) {
    document.getElementById('complete-drop').classList.add('hidden');
    document.getElementById('side-quest-prompt').classList.remove('hidden');
    document.getElementById('side-quest-prompt-desc').textContent = result.sideQuestDesc || resolvedTask?.sideQuest?.desc || 'Hay una decisión opcional pendiente.';
    document.getElementById('btn-complete-continue').classList.add('hidden');
    const canResolve = Boolean(resolvedTask?.sideQuest);
    document.getElementById('btn-side-quest-yes').disabled = !canResolve;
    document.getElementById('btn-side-quest-no').disabled = !canResolve;
  } else {
    document.getElementById('side-quest-prompt').classList.add('hidden');
    document.getElementById('btn-side-quest-yes').disabled = false;
    document.getElementById('btn-side-quest-no').disabled = false;
    if (result.drop) renderTaskResultDrop(result.drop);
    else document.getElementById('complete-drop').classList.add('hidden');
    document.getElementById('btn-complete-continue').classList.remove('hidden');
  }

  if (typeof pushTaskResultHistory === 'function') pushTaskResultHistory();
  const focusId = awaitingSideQuest ? 'btn-side-quest-yes' : 'btn-complete-continue';
  requestAnimationFrame(() => document.getElementById(focusId)?.focus());
  return true;
}

function presentPendingTaskResult() {
  const result = getPendingTaskResult();
  if (!result) return false;
  if (!saveGame()) {
    showToast('No se pudo guardar el resultado. Sigue visible y se reintentará al volver a abrirlo.', 'error');
    return false;
  }
  const task = gameState.tasks.find(candidate => candidate.id === result.taskId) || null;
  if (task) {
    currentTask = task;
    currentIsOverflow = Boolean(result.isOverflow);
    renderTaskScreen();
    if (typeof showScreen === 'function' && document.querySelector('.screen.active')?.id !== 'screen-task') {
      showScreen('task', { replaceHistory: true });
    }
  }
  return renderTaskResultModal(result, task);
}

function showPendingTaskResult() {
  return presentPendingTaskResult();
}

function completeTask() {
  const pending = getPendingTaskResult();
  if (pending) {
    if (currentTask && pending.taskId !== currentTask.id) {
      presentPendingTaskResult();
      return;
    }
    presentPendingTaskResult();
    return;
  }
  if (!currentTask) return;
  if (hasTaskCompletionForToday(currentTask)) {
    showToast('Esta tarea ya está completada hoy.', 'gold');
    return;
  }

  stopTimer();
  const task = currentTask;
  if (task.sideQuest) {
    const pendingResult = {
      version: 1,
      status: 'awaiting_side_quest',
      taskId: task.id,
      taskName: task.name,
      sideQuestDesc: task.sideQuest.desc,
      isOverflow: Boolean(currentIsOverflow),
      date: todayStr(),
      createdAt: new Date().toISOString(),
      sideQuestCompleted: null,
      claimId: null,
      totalXp: 0,
      goldEarned: 0,
      leveledUp: false,
      drop: null
    };
    gameState.pendingTaskResult = pendingResult;
    if (!saveGame()) {
      gameState.pendingTaskResult = null;
      showToast('No se pudo guardar la decisión pendiente. No se ha mostrado el resultado.', 'error');
      return;
    }
    renderTaskResultModal(pendingResult, task);
    return;
  }

  finalizeCompletion(false);
}

function finalizeCompletion(sideQuestCompleted) {
  const task = currentTask;
  if (!task) {
    presentPendingTaskResult();
    return;
  }
  const pending = getPendingTaskResult();
  if (pending?.status === 'ready') {
    presentPendingTaskResult();
    return;
  }
  if (pending && pending.taskId !== task.id) {
    presentPendingTaskResult();
    return;
  }

  const stateBeforeCompletion = typeof cloneSaveState === 'function' ? cloneSaveState(gameState) : null;
  const pendingEncounterBeforeCompletion = pendingEncounter;
  const today = todayStr();
  if (hasTaskCompletionForToday(task)) {
    gameState.pendingTaskResult = null;
    showToast('Esta tarea ya está completada hoy.', 'gold');
    return;
  }
  const xpMultiplier = currentIsOverflow ? 1.5 : 1;
  
  // Calculate XP
  let totalXp = Math.round(task.xp * xpMultiplier);
  if (sideQuestCompleted && task.sideQuest) {
    totalXp += task.sideQuest.xp;
  }
  
  // Add XP and check level up
  const leveledUp = addXp(totalXp);
  
  // Add stats
  addStats(task.stats);
  if (sideQuestCompleted && task.sideQuest) {
    addStats(task.sideQuest.stats);
  }
  
  // Add gold (simplified)
  const goldEarned = Math.floor(task.xp / 5);
  gameState.gold += goldEarned;
  
  // Roll for drops using items.js system
  let dropResult = null;
  const bonusChance = sideQuestCompleted && task.sideQuest?.dropBonus ? task.sideQuest.dropBonus / 100 : 0;
  
  if (task.drops?.theme && typeof rollDropFromTheme === 'function') {
    dropResult = rollDropFromTheme(task.drops.theme, bonusChance);
  } else if (task.drops?.items) {
    // Fallback to old system for tasks without theme
    const drop = rollDrop(task, sideQuestCompleted);
    if (drop) dropResult = { itemId: null, name: drop };
  }
  
  // Side quest bonus drop
  if (sideQuestCompleted && task.sideQuest?.drops && !dropResult) {
    const sqDrop = rollSideQuestDrop(task);
    if (sqDrop) dropResult = { itemId: null, name: sqDrop };
  }

  let dropSummary = null;
  if (dropResult) {
    const rewardInput = normalizeTaskRewardDrop(dropResult);
    const claimId = `task:${task.id}:${today}:${sideQuestCompleted ? 'side' : 'base'}`;
    const reward = typeof LifeXPInventory !== 'undefined' && typeof LifeXPInventory.deliverReward === 'function'
      ? LifeXPInventory.deliverReward({
          itemId: rewardInput.itemId,
          requestedItem: rewardInput.requestedItem,
          name: rewardInput.displayName,
          quantity: 1,
          claimId,
          source: sideQuestCompleted ? 'side_quest' : 'task'
        }, {
          claimId,
          source: sideQuestCompleted ? 'side_quest' : 'task',
          metadata: { taskId: task.id, sideQuest: Boolean(sideQuestCompleted), date: today }
        })
      : { status: 'rejected', rejected: true, reason: 'reward_boundary_unavailable', recoverable: false };
    dropSummary = {
      itemId: rewardInput.itemId,
      displayName: rewardInput.displayName,
      rarity: rewardInput.rarity || (rewardInput.itemId && ITEMS[rewardInput.itemId] ? ITEMS[rewardInput.itemId].rarity : null),
      status: reward.status || (reward.rejected ? 'rejected' : 'granted'),
      reason: reward.reason || null
    };
  }
  
  // Update task lastDone
  const taskInState = gameState.tasks.find(t => t.id === task.id);
  if (taskInState) {
    taskInState.lastDone = today;
  }
  
  // Remove from saved if it was there
  gameState.savedTasks = gameState.savedTasks.filter(id => id !== task.id);
  
  // Update streak
  if (gameState.lastActiveDate !== today) {
    if (gameState.lastActiveDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (gameState.lastActiveDate === yesterday.toISOString().slice(0, 10)) {
        gameState.streak++;
      } else {
        gameState.streak = 1;
      }
    } else {
      gameState.streak = 1;
    }
    gameState.lastActiveDate = today;
  }
  
  // Add to history
  gameState.taskHistory.push({
    taskId: task.id,
    date: today,
    xp: totalXp,
    sideQuest: sideQuestCompleted,
    completionId: `task:${task.id}:${today}:${sideQuestCompleted ? 'side' : 'base'}`
  });

  // Trigger all post-completion state changes before persisting the visible result.
  triggerEncounterAfterTask(task);
  if (typeof updateQuestProgress === 'function') {
    updateQuestProgress('task_complete', { category: task.cat });
  }
  if (typeof recordItemAttunementFromTask === 'function') recordItemAttunementFromTask(task);

  gameState.pendingTaskResult = {
    version: 1,
    status: 'ready',
    taskId: task.id,
    taskName: task.name,
    sideQuestDesc: task.sideQuest?.desc || null,
    isOverflow: Boolean(currentIsOverflow),
    date: today,
    createdAt: new Date().toISOString(),
    sideQuestCompleted: Boolean(sideQuestCompleted),
    claimId: `task:${task.id}:${today}:${sideQuestCompleted ? 'side' : 'base'}`,
    totalXp,
    goldEarned,
    leveledUp,
    drop: dropSummary
  };

  // Persist the complete result before opening any result UI.
  if (!saveGame()) {
    if (stateBeforeCompletion) gameState = stateBeforeCompletion;
    pendingEncounter = pendingEncounterBeforeCompletion;
    if (gameState.pendingTaskResult?.status === 'awaiting_side_quest') presentPendingTaskResult();
    showToast('No se pudo guardar el resultado. No se ha mostrado; pulsa completar de nuevo para reintentar.', 'error');
    return;
  }
  renderTaskResultModal(gameState.pendingTaskResult, task);
}

// Normalizes current and legacy drop shapes at the reward boundary.
function normalizeTaskRewardDrop(value) {
  const visited = new Set();
  let candidate = value;
  let rarity = null;
  while (candidate && typeof candidate === 'object' && !visited.has(candidate)) {
    visited.add(candidate);
    if (typeof candidate.rarity === 'string' && !rarity) rarity = candidate.rarity;
    const itemId = candidate.itemId || candidate.id || candidate.itemKey || candidate.key;
    if (typeof itemId === 'string' && itemId) {
      return {
        itemId,
        requestedItem: candidate.requestedItem || itemId,
        displayName: candidate.displayName || candidate.name || itemId,
        rarity
      };
    }
    if (candidate.name !== undefined) {
      candidate = candidate.name;
    } else if (candidate.item !== undefined) {
      candidate = candidate.item;
    } else {
      break;
    }
  }
  const displayName = typeof candidate === 'string' ? candidate : null;
  return { itemId: displayName, requestedItem: displayName, displayName, rarity };
}

// === Drop system ============================================================
// rollDropFromTheme: calls rollDropByTheme() from items.js.
// Note: items.js uses rollDropByTheme (not rollDrop) to avoid collision with
// this file's rollDrop(task, sideQuestCompleted). No alias needed.
function rollDropFromTheme(theme, bonusChance) {
  if (typeof rollDropByTheme === 'function') return rollDropByTheme(theme, bonusChance || 0);
  return null;
}

// rollDrop: task-based drop resolver. Uses rollDropFromTheme when theme is set.
function rollDrop(task, sideQuestCompleted) {
  if (!task.drops) return null;
  const bonus = sideQuestCompleted && task.sideQuest ? (task.sideQuest.dropBonus || 0) / 100 : 0;
  if (task.drops.theme) {
    const result = rollDropFromTheme(task.drops.theme, bonus);
    if (result) return result;
  }
  // Fallback: old string-based items list
  if (task.drops.items && task.drops.items.length > 0) {
    const dropChance = 0.4 + bonus;
    if (Math.random() < dropChance) {
      return { itemId: null, name: task.drops.items[Math.floor(Math.random() * task.drops.items.length)] };
    }
  }
  return null;
}

// rollSideQuestDrop: drop from side quest theme.
function rollSideQuestDrop(task) {
  if (!task.sideQuest) return null;
  const theme = task.drops?.theme || null;
  if (!theme) {
    // Fallback: string list
    const drops = task.sideQuest.drops;
    if (!drops || !drops.length) return null;
    if (Math.random() < 0.6) return { itemId: null, name: drops[Math.floor(Math.random() * drops.length)] };
    return null;
  }
  const bonus = (task.sideQuest.dropBonus || 0) / 100;
  return rollDropFromTheme(theme, bonus);
}


// Pending encounter after task completion
let pendingEncounter = null;

function dismissComplete() {
  const result = getPendingTaskResult();
  if (!result || result.status !== 'ready') return;
  gameState.pendingTaskResult = null;
  if (!saveGame()) {
    gameState.pendingTaskResult = result;
    showToast('No se pudo confirmar la salida. La recompensa sigue protegida.', 'error');
    return;
  }
  closeTaskResultModal();
  
  // Check for pending encounter
  if (pendingEncounter) {
    startCombatFromEncounter(pendingEncounter);
    pendingEncounter = null;
  } else {
    showScreen('hub', { replaceHistory: true });
  }
}

function restorePendingTaskResult() {
  const result = getPendingTaskResult();
  if (!result) return false;
  const task = gameState.tasks.find(candidate => candidate.id === result.taskId) || null;
  if (task) {
    currentTask = task;
    currentIsOverflow = Boolean(result.isOverflow);
    renderTaskScreen();
    showScreen('task', { replaceHistory: true });
  }
  return presentPendingTaskResult();
}
