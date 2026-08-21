// ===========================================================================
// LifeXP RPG - ui_tasks.js
// Navegacion de tareas, renderizado, completado, drops y encuentros.
// Depende de: engine.js, items.js, combat.js, quests.js.
// ===========================================================================

// TASK SCREEN
// ===========================================================================

// True only while the player is completing a task from the category catalog.
// It is intentionally transient and is persisted in pendingTaskResult only
// when an optional side-quest decision still needs to be resolved.
let allowManualCooldownCompletion = false;

function openRandomTask() {
  currentCatFilter = null;
  allowManualCooldownCompletion = false;
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
  renderCategoryTaskList(catId);
  showScreen('category-tasks');
}

function openRandomTaskFromCategory(catId) {
  currentCatFilter = catId;
  allowManualCooldownCompletion = false;
  const { tasks, isOverflow } = getAvailableTasks(catId);
  if (tasks.length === 0) {
    showToast('No hay tareas disponibles para el aleatorio de esta categoría.', 'gold');
    return;
  }
  currentTask = pickRandomTask(tasks);
  currentIsOverflow = isOverflow;
  renderTaskScreen();
  showScreen('task');
  resetTimer();
}

function shuffleTask() {
  allowManualCooldownCompletion = false;
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

function escapeTaskCatalogText(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatTaskCatalogDate(value) {
  if (typeof isValidTaskDate !== 'function' || !isValidTaskDate(value)) return null;
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date(`${value}T00:00:00Z`));
}

function getTaskCatalogStatus(task, availability) {
  if (availability.status === 'archived') return 'Archivada';
  if (availability.status === 'needs_review') return 'Necesita revisión';
  if (availability.status === 'completed') return 'Completada';
  if (availability.status === 'cooldown') {
    const next = formatTaskCatalogDate(availability.nextAvailableDate);
    return next ? `En espera hasta ${next}` : 'En espera';
  }
  if (task?.sideQuest) return 'Disponible · incluye decisión opcional';
  return 'Disponible';
}

function getTaskCatalogHistory(task, availability) {
  if (availability.completionCount === 0) return 'Sin registros de finalización';
  const latest = typeof getLatestTaskCompletionDate === 'function'
    ? formatTaskCatalogDate(getLatestTaskCompletionDate(task))
    : null;
  const count = availability.completionCount;
  return `${count} finalización${count === 1 ? '' : 'es'}${latest ? ` · última: ${latest}` : ''}`;
}

function canCompleteTaskFromCatalog(availability) {
  return availability.status === 'available' || availability.status === 'cooldown';
}

function ensureCategoryTaskScreen() {
  let screen = document.getElementById('screen-category-tasks');
  if (screen) return screen;

  screen = document.createElement('div');
  screen.className = 'screen';
  screen.id = 'screen-category-tasks';
  screen.innerHTML = `
    <div class="header">
      <button class="btn btn-ghost btn-small" type="button" data-category-action="back" style="width: auto;">&#8592; Volver</button>
      <div id="category-task-heading" style="flex: 1; text-align: right;"></div>
    </div>
    <div class="content">
      <div id="category-task-summary" style="margin-bottom: 16px;"></div>
      <button class="btn btn-primary" type="button" data-category-action="random" id="category-task-random" style="margin-bottom: 18px;">&#127922; Elegir una tarea de esta categoría</button>
      <div id="category-task-list"></div>
    </div>
  `;
  document.body.appendChild(screen);
  screen.addEventListener('click', event => {
    const actionElement = event.target.closest('[data-category-action]');
    if (!actionElement) return;
    const action = actionElement.dataset.categoryAction;
    if (action === 'back') {
      showScreen('hub');
      return;
    }
    if (action === 'random') {
      openRandomTaskFromCategory(currentCatFilter);
      return;
    }
    if (action === 'complete') {
      completeTaskFromCategory(actionElement.dataset.taskId);
    }
  });
  return screen;
}

function renderCategoryTaskList(catId) {
  const screen = ensureCategoryTaskScreen();
  const cat = CATEGORIES[catId];
  const tasks = gameState.tasks
    .filter(task => !isTaskArchived(task) && task.cat === catId);
  const randomPool = getAvailableTasks(catId);
  const availableCount = randomPool.tasks.length;

  document.getElementById('category-task-heading').innerHTML = `<strong>${escapeTaskCatalogText(cat?.icon || '')} ${escapeTaskCatalogText(cat?.name || catId)}</strong>`;
  document.getElementById('category-task-summary').innerHTML = `<div class="section-title" style="margin-top: 0;">Lista completa</div><div style="color: var(--text-muted); font-size: 12px;">${tasks.length} tarea${tasks.length === 1 ? '' : 's'} · ${availableCount} disponible${availableCount === 1 ? '' : 's'} para el aleatorio</div>`;
  const randomButton = document.getElementById('category-task-random');
  randomButton.disabled = availableCount === 0;
  randomButton.title = randomPool.tasks.length === 0
    ? 'No hay tareas disponibles para el aleatorio en esta categoría.'
    : 'Elegir solo entre las tareas disponibles de esta categoría';

  const list = document.getElementById('category-task-list');
  if (tasks.length === 0) {
    list.innerHTML = '<div class="empty-state">No hay tareas en esta categoría.</div>';
    return screen;
  }

  list.innerHTML = tasks.map(task => {
    const availability = getTaskAvailability(task);
    const status = getTaskCatalogStatus(task, availability);
    const history = getTaskCatalogHistory(task, availability);
    const canComplete = canCompleteTaskFromCatalog(availability);
    const nextDate = availability.status === 'cooldown' ? formatTaskCatalogDate(availability.nextAvailableDate) : null;
    const action = canComplete
      ? `<button class="btn btn-primary btn-small" type="button" data-category-action="complete" data-task-id="${escapeTaskCatalogText(task.id)}">Completar</button>`
      : '';
    return `
      <article style="background: var(--bg-card); border: 1px solid var(--border); border-left: 4px solid ${escapeTaskCatalogText(cat?.color || 'var(--border)')}; border-radius: var(--radius); padding: 16px; margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
          <div style="min-width: 0; flex: 1;">
            <h3 style="font-size: 16px; line-height: 1.3; margin-bottom: 6px;">${escapeTaskCatalogText(task.name)}</h3>
            <div style="font-size: 12px; color: var(--text-muted); line-height: 1.45;">${escapeTaskCatalogText(task.desc || 'Sin descripción')}</div>
          </div>
          ${action}
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 6px 12px; margin-top: 14px; font-size: 12px;">
          <span style="color: ${availability.status === 'cooldown' ? 'var(--orange)' : availability.status === 'available' ? 'var(--green)' : 'var(--text-muted)'};">${escapeTaskCatalogText(status)}</span>
          ${nextDate ? `<span style="color: var(--text-muted);">Vuelve: ${escapeTaskCatalogText(nextDate)}</span>` : ''}
        </div>
        <div style="margin-top: 8px; color: var(--text-muted); font-size: 11px;">${escapeTaskCatalogText(history)}</div>
      </article>
    `;
  }).join('');
  return screen;
}

function completeTaskFromCategory(taskId) {
  const task = gameState.tasks.find(candidate => candidate.id === taskId);
  if (!task) {
    showToast('No se ha encontrado esa tarea.', 'error');
    return;
  }
  const availability = getTaskAvailability(task);
  if (!canCompleteTaskFromCatalog(availability)) {
    showToast('Esta tarea no puede completarse manualmente en su estado actual.', 'gold');
    return;
  }
  currentTask = task;
  currentCatFilter = task.cat;
  currentIsOverflow = isTaskOverdue(task);
  allowManualCooldownCompletion = availability.status === 'cooldown';
  completeTask();
}

function renderTaskScreen() {
  const task = currentTask;
  const cat = CATEGORIES[task.cat];
  
  // Card
  const card = document.getElementById('task-card');
  card.setAttribute('data-cat', task.cat);
  
  // Category label
  document.getElementById('task-cat-label').innerHTML = `${cat.icon} ${cat.name}`;
  
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
  return document.getElementById('complete-overlay')?.classList.contains('show') === true;
}

function renderTaskResultDrop(drop) {
  const dropBox = document.getElementById('complete-drop');
  if (!drop) {
    dropBox.classList.add('hidden');
    return;
  }
  dropBox.classList.remove('hidden');
  const itemName = drop.displayName || drop.name || drop.itemId || 'Recompensa';
  const statusLabel = drop.status === 'granted' ? 'Conseguido' : drop.status === 'pending' ? 'Pendiente de guardar' : 'No entregado';
  document.getElementById('complete-drop-item').textContent = `${statusLabel}: ${itemName}`;
}

function renderTaskResultModal(result, task = null) {
  if (!result) return false;
  const overlay = document.getElementById('complete-overlay');
  const resolvedTask = task || gameState.tasks.find(candidate => candidate.id === result.taskId) || null;
  const awaitingSideQuest = result.status === 'awaiting_side_quest';
  const taskName = result.taskName || resolvedTask?.name || 'Tarea';

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
    document.getElementById('side-quest-prompt-desc').textContent = result.sideQuestDesc || '¿Has realizado también el objetivo opcional?';
    document.getElementById('complete-dismiss').textContent = 'Decidir más tarde';
    document.getElementById('side-quest-yes').onclick = () => finalizeCompletion(true);
    document.getElementById('side-quest-no').onclick = () => finalizeCompletion(false);
  } else {
    document.getElementById('side-quest-prompt').classList.add('hidden');
    document.getElementById('complete-dismiss').textContent = 'Continuar';
    renderTaskResultDrop(result.drop);
  }
  return true;
}

function closeTaskResultModal() {
  const overlay = document.getElementById('complete-overlay');
  overlay.classList.remove('show');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.removeAttribute('aria-label');
  overlay.removeAttribute('data-result-status');
}

function presentPendingTaskResult() {
  const result = getPendingTaskResult();
  if (!result) return false;
  const task = gameState.tasks.find(candidate => candidate.id === result.taskId) || null;
  if (task && typeof showScreen === 'function' && document.querySelector('.screen.active')?.id !== 'screen-task') {
    currentTask = task;
    currentIsOverflow = Boolean(result.isOverflow);
    renderTaskScreen();
    showScreen('task', { replaceHistory: true });
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
  const pendingAllowsCooldownCompletion = pending?.allowCooldownCompletion === true;
  const canCompleteDuringCooldown = allowManualCooldownCompletion || pendingAllowsCooldownCompletion;
  if (hasTaskCompletionForToday(currentTask) && !canCompleteDuringCooldown) {
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
      allowCooldownCompletion: Boolean(allowManualCooldownCompletion),
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
  const pendingAllowsCooldownCompletion = pending?.allowCooldownCompletion === true;
  const canCompleteDuringCooldown = allowManualCooldownCompletion || pendingAllowsCooldownCompletion;
  if (hasTaskCompletionForToday(task) && !canCompleteDuringCooldown) {
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
  const completionSequence = gameState.taskHistory.filter(entry => entry && entry.taskId === task.id).length;
  const completionId = `task:${task.id}:${today}:${sideQuestCompleted ? 'side' : 'base'}:${completionSequence}`;
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
    const claimId = completionId;
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
  gameState.savedTasks = gameState.savedTasks.filter(t => t.id !== task.id);
  
  // Add to history. The sequence keeps same-day manual completions distinct,
  // so each intentional completion can receive its own durable reward claim.
  const historyEntry = typeof createTaskHistoryEntry === 'function'
    ? createTaskHistoryEntry(task, { date: today, xp: totalXp, sideQuest: sideQuestCompleted, completionId })
    : {
        taskId: task.id,
        date: today,
        xp: totalXp,
        sideQuest: sideQuestCompleted,
        completionId
      };
  gameState.taskHistory.push(historyEntry);

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
    allowCooldownCompletion: Boolean(canCompleteDuringCooldown),
    claimId: historyEntry.completionId,
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
  let candidate = value;
  let rarity = null;
  for (let depth = 0; depth < 4; depth++) {
    if (candidate === null || candidate === undefined) break;
    if (typeof candidate === 'object') {
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
  allowManualCooldownCompletion = false;
  
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
