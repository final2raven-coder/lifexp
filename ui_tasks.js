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
    .replace(/\"/g, '&quot;')
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
  const list = screen.querySelector('#category-task-list');
  const heading = screen.querySelector('#category-task-heading');
  const summary = screen.querySelector('#category-task-summary');
  const randomButton = screen.querySelector('#category-task-random');
  if (!cat || !list || !heading || !summary || !randomButton) return;

  const tasks = gameState.tasks
    .filter(task => !isTaskArchived(task) && task.cat === catId);
  const availableCount = tasks.filter(task => {
    const availability = getTaskAvailability(task);
    return canCompleteTaskFromCatalog(availability);
  }).length;
  const pendingCount = tasks.filter(task => {
    const availability = getTaskAvailability(task);
    return availability.status === 'available';
  }).length;

  heading.textContent = `${cat.icon} ${cat.name}`;
  summary.innerHTML = `
    <div class="stat-card">
      <div class="stat-label">Tareas en esta categoría</div>
      <div class="stat-value">${tasks.length}</div>
      <div class="stat-label">${availableCount} con acción disponible · ${pendingCount} listas ahora</div>
    </div>
  `;
  randomButton.disabled = availableCount === 0;
  randomButton.title = availableCount === 0 ? 'No hay tareas disponibles en esta categoría.' : '';

  if (tasks.length === 0) {
    list.innerHTML = '<div class="empty-state">No hay tareas en esta categoría.</div>';
    return;
  }

  list.innerHTML = tasks.map(task => {
    const availability = getTaskAvailability(task);
    const status = getTaskCatalogStatus(task, availability);
    const history = getTaskCatalogHistory(task, availability);
    const canComplete = canCompleteTaskFromCatalog(availability);
    const safeId = escapeTaskCatalogText(task.id);
    const safeName = escapeTaskCatalogText(task.name);
    const safeDesc = escapeTaskCatalogText(task.desc);
    const actionLabel = availability.status === 'cooldown' ? 'Completar igualmente' : 'Completar tarea';
    return `
      <article class="task-catalog-card" data-task-id="${safeId}">
        <div class="task-catalog-main">
          <div class="task-catalog-name">${safeName}</div>
          <div class="task-catalog-desc">${safeDesc}</div>
          <div class="task-catalog-meta">${escapeTaskCatalogText(status)}</div>
          <div class="task-catalog-history">${escapeTaskCatalogText(history)}</div>
        </div>
        <button class="btn btn-secondary btn-small" type="button" data-category-action="complete" data-task-id="${safeId}" ${canComplete ? '' : 'disabled'}>${actionLabel}</button>
      </article>
    `;
  }).join('');
}

function completeTaskFromCategory(taskId) {
  const task = gameState.tasks.find(candidate => candidate.id === taskId);
  if (!task) return;
  const availability = getTaskAvailability(task);
  if (!canCompleteTaskFromCatalog(availability)) {
    showToast('Esta tarea no se puede completar ahora.', 'gold');
    return;
  }
  currentTask = task;
  currentCatFilter = task.cat;
  currentIsOverflow = Boolean(availability.isOverflow);
  allowManualCooldownCompletion = availability.status === 'cooldown';
  renderTaskScreen();
  showScreen('task');
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
  document.getElementById('task-cat-badge').textContent = task.freq;
  
  // Task name and description
  document.getElementById('task-name').textContent = task.name;
  document.getElementById('task-desc').textContent = task.desc;
  
  // Rewards
  const rewardsDiv = document.getElementById('task-rewards');
  let rewardsHtml = '';
  for (const [stat, val] of Object.entries(task.stats)) {
    rewardsHtml += `<div class="task-reward stat-${stat}">+${Math.max(1, Math.floor(val / 10))} ${STATS[stat].abbr}</div>`;
  }
  rewardsHtml += `<div class="task-reward xp">+${task.xp} XP</div>`;
  rewardsDiv.innerHTML = rewardsHtml;
  
  // Overflow state is kept on the existing task card; the base HTML has no banner.
  card.dataset.overflow = currentIsOverflow ? 'true' : 'false';
  
  // Drops
  const dropsBox = document.getElementById('task-drops-box');
  const dropsList = document.getElementById('task-drops');
  if (task.drops && dropsList) {
    dropsBox.classList.remove('hidden');
    const dropDetails = task.drops.theme
      || (Array.isArray(task.drops.items) ? task.drops.items.join(', ') : 'misterioso');
    dropsList.textContent = dropDetails;
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
  return document.getElementById('complete-overlay')?.classList.contains('show');
}

function closeTaskResultModalIfOpen() {
  if (isTaskResultModalVisible() && typeof closeTaskResultModal === 'function') {
    closeTaskResultModal();
    return true;
  }
  return false;
}

function presentPendingTaskResult() {
  const result = getPendingTaskResult();
  if (!result) return false;
  const task = gameState.tasks.find(candidate => candidate.id === result.taskId) || null;
  if (!task) return false;
  renderTaskResultModal(result, task);
  return true;
}

function renderTaskResultModal(result, task) {
  const overlay = document.getElementById('complete-overlay');
  overlay.setAttribute('aria-label', 'Resultado de tarea');
  overlay.dataset.resultStatus = result.status;
  overlay.classList.add('show');

  document.getElementById('complete-icon').textContent = result.status === 'awaiting_side_quest'
    ? (result.isOverflow ? '⚡' : '\uD83C\uDFC6')
    : (result.leveledUp ? '\uD83C\uDF89' : (result.isOverflow ? '⚡' : '\uD83C\uDFC6'));
  document.getElementById('complete-title').textContent = result.status === 'awaiting_side_quest'
    ? (result.isOverflow ? '¡Overflow eliminado!' : '¡Tarea completada!')
    : (result.leveledUp ? '¡Subiste de nivel!' : (result.isOverflow ? '¡Overflow eliminado!' : '¡Tarea completada!'));
  document.getElementById('complete-subtitle').textContent = result.taskName;

  let rewardsHtml = '';
  if (result.status === 'awaiting_side_quest' && task) {
    const previewXp = Math.round(task.xp * (result.isOverflow ? 1.5 : 1));
    rewardsHtml = `<div class="complete-reward gold">+${previewXp} XP</div>`;
    for (const [stat, pct] of Object.entries(task.stats)) {
      const points = Math.max(1, Math.floor(pct / 10));
      rewardsHtml += `<div class="complete-reward green">+${points} ${STATS[stat].abbr}</div>`;
    }
  } else if (result.status === 'awaiting_side_quest') {
    rewardsHtml = '<div class="complete-reward gold">Resultado guardado</div>';
  } else {
    rewardsHtml = `<div class="complete-reward gold">+${result.totalXp} XP</div>`;
    rewardsHtml += `<div class="complete-reward">+${result.goldEarned} \uD83E\uDE99</div>`;
  }
  document.getElementById('complete-rewards').innerHTML = rewardsHtml;

  const sideQuestPrompt = document.getElementById('side-quest-prompt');
  const completeDrop = document.getElementById('complete-drop');
  const continueButton = document.getElementById('btn-complete-continue');
  if (result.status === 'awaiting_side_quest') {
    completeDrop.classList.add('hidden');
    sideQuestPrompt.classList.remove('hidden');
    document.getElementById('side-quest-prompt-desc').textContent = result.sideQuestDesc || '¿Has realizado también el objetivo opcional?';
    document.getElementById('btn-side-quest-yes').disabled = !task?.sideQuest;
    document.getElementById('btn-side-quest-no').disabled = !task?.sideQuest;
    continueButton.classList.add('hidden');
  } else {
    sideQuestPrompt.classList.add('hidden');
    document.getElementById('btn-side-quest-yes').disabled = false;
    document.getElementById('btn-side-quest-no').disabled = false;
    completeDrop.classList.toggle('hidden', !result.drop);
    const drop = result.drop;
    if (drop) {
      const dropName = drop.displayName || drop.name || drop.itemId || 'Objeto';
      const dropDetails = [drop.status, dropName, drop.rarity].filter(Boolean).join(' · ');
      document.getElementById('complete-drop-item').textContent = dropDetails;
    }
    continueButton.classList.remove('hidden');
  }

  continueButton.textContent = result.status === 'awaiting_side_quest' ? 'Resolver después' : 'Continuar';
}

function openTaskResultDecision(sideQuestCompleted) {
  const current = getPendingTaskResult();
  if (!current || current.status !== 'awaiting_side_quest') return;
  finalizeCompletion(Boolean(sideQuestCompleted), current);
}

function completeTask() {
  if (!currentTask) return;
  const availability = getTaskAvailability(currentTask);
  const canCompleteDuringCooldown = allowManualCooldownCompletion && availability.status === 'cooldown';
  if (availability.status !== 'available' && !canCompleteDuringCooldown) {
    showToast('Esta tarea no está disponible ahora.', 'gold');
    return;
  }

  const pending = getPendingTaskResult();
  if (pending) {
    presentPendingTaskResult();
    return;
  }

  stopTimer();
  if (currentTask.sideQuest) {
    const completionId = createTaskCompletionId(currentTask, todayStr());
    gameState.pendingTaskResult = {
      version: 1,
      status: 'awaiting_side_quest',
      taskId: currentTask.id,
      taskName: currentTask.name,
      sideQuestDesc: currentTask.sideQuest.desc,
      isOverflow: Boolean(currentIsOverflow),
      date: todayStr(),
      createdAt: new Date().toISOString(),
      allowCooldownCompletion: Boolean(canCompleteDuringCooldown),
      claimId: completionId
    };
    if (!saveGame()) {
      gameState.pendingTaskResult = null;
      showToast('No se pudo guardar el resultado. Inténtalo de nuevo.', 'error');
      return;
    }
    renderTaskResultModal(gameState.pendingTaskResult, currentTask);
    return;
  }

  finalizeCompletion(false, {
    version: 1,
    status: 'awaiting_side_quest',
    taskId: currentTask.id,
    taskName: currentTask.name,
    isOverflow: Boolean(currentIsOverflow),
    date: todayStr(),
    allowCooldownCompletion: Boolean(canCompleteDuringCooldown),
    claimId: createTaskCompletionId(currentTask, todayStr())
  });
}

function finalizeCompletion(sideQuestCompleted, pendingResult) {
  const task = gameState.tasks.find(candidate => candidate.id === pendingResult.taskId) || currentTask;
  if (!task) return;
  const availability = getTaskAvailability(task);
  const canCompleteDuringCooldown = Boolean(pendingResult.allowCooldownCompletion) && availability.status === 'cooldown';
  if (availability.status !== 'available' && !canCompleteDuringCooldown) {
    showToast('Esta tarea ya no está disponible ahora.', 'gold');
    return;
  }

  const stateBeforeCompletion = typeof cloneSaveState === 'function' ? cloneSaveState(gameState) : JSON.parse(JSON.stringify(gameState));
  const pendingEncounterBeforeCompletion = pendingEncounter;
  const today = pendingResult.date || todayStr();
  const completionSequence = gameState.taskHistory.filter(entry => entry && entry.taskId === task.id).length;
  const completionId = pendingResult.claimId || createTaskCompletionId(task, today, completionSequence);
  const baseXp = task.xp * (currentIsOverflow ? 1.5 : 1);
  const sideXp = sideQuestCompleted && task.sideQuest ? task.sideQuest.xp : 0;
  const totalXp = Math.round(baseXp + sideXp);
  const goldEarned = Math.max(1, Math.floor(totalXp / 4));

  addXp(totalXp);
  gameState.gold += goldEarned;
  let leveledUp = false;
  while (gameState.xp >= getXpForNextLevel()) {
    gameState.xp -= getXpForNextLevel();
    gameState.level++;
    leveledUp = true;
  }

  for (const [stat, pct] of Object.entries(task.stats)) {
    const points = Math.max(1, Math.floor(pct / 10));
    if (!gameState.stats[stat]) gameState.stats[stat] = 10;
    gameState.stats[stat] += points;
  }
  if (sideQuestCompleted && task.sideQuest) {
    for (const [stat, pct] of Object.entries(task.sideQuest.stats)) {
      const points = Math.max(1, Math.floor(pct / 10));
      if (!gameState.stats[stat]) gameState.stats[stat] = 10;
      gameState.stats[stat] += points;
    }
  }

  let dropResult = rollDrop(task, sideQuestCompleted);
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
  gameState.savedTasks = gameState.savedTasks.filter(taskId => taskId !== task.id);
  
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