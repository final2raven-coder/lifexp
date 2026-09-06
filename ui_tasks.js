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
let taskHistoryReturnScreen = 'settings';

function getSavedTaskRecords() {
  const savedIds = Array.isArray(gameState.savedTasks) ? gameState.savedTasks : [];
  const taskById = new Map((Array.isArray(gameState.tasks) ? gameState.tasks : []).map(task => [task.id, task]));
  return savedIds.map((taskId, index) => {
    const task = taskById.get(taskId) || null;
    return {
      taskId,
      task,
      index,
      status: task ? 'recoverable' : 'needs_review'
    };
  });
}

function getSavedTaskById(taskId) {
  return getSavedTaskRecords().find(record => record.taskId === taskId) || null;
}

function renderSavedTasksModal() {
  const modal = document.getElementById('modal-saved');
  const content = document.getElementById('modal-saved-content');
  if (!modal || !content) return;

  const records = getSavedTaskRecords();
  if (records.length === 0) {
    content.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#128221;</div><div class="empty-state-title">No saved tasks</div><div class="empty-state-desc">Tasks you save for later will appear here.</div></div>';
    modal.classList.add('show');
    return;
  }

  content.innerHTML = records.map(record => {
    const safeTaskId = escapeTaskCatalogText(record.taskId);
    if (!record.task) {
      return `
        <article class="saved-task-card" data-task-id="${safeTaskId}">
          <div class="saved-task-main">
            <div class="saved-task-name">Saved task needs review</div>
            <div class="saved-task-desc">This saved reference is no longer present in the current task catalog.</div>
          </div>
          <button class="btn btn-ghost btn-small" type="button" data-saved-task-action="remove" data-task-id="${safeTaskId}">Remove</button>
        </article>
      `;
    }

    const safeName = escapeTaskCatalogText(record.task.name);
    const safeDesc = escapeTaskCatalogText(record.task.desc);
    const availability = getTaskAvailability(record.task);
    const status = escapeTaskCatalogText(getTaskCatalogStatus(record.task, availability));
    return `
      <article class="saved-task-card" data-task-id="${safeTaskId}">
        <div class="saved-task-main">
          <div class="saved-task-name">${safeName}</div>
          <div class="saved-task-desc">${safeDesc}</div>
          <div class="saved-task-meta">${status}</div>
        </div>
        <div class="saved-task-actions">
          <button class="btn btn-primary btn-small" type="button" data-saved-task-action="open" data-task-id="${safeTaskId}">Open task</button>
          <button class="btn btn-ghost btn-small" type="button" data-saved-task-action="remove" data-task-id="${safeTaskId}">Remove</button>
        </div>
      </article>
    `;
  }).join('');
  modal.classList.add('show');
}

function showSavedTasks() {
  bindSavedTasksModal();
  renderSavedTasksModal();
}

function openSavedTask(taskId) {
  const record = getSavedTaskById(taskId);
  if (!record) return;
  if (!record.task) {
    showToast('This saved task needs review before it can be opened.', 'gold');
    return;
  }

  const availability = getTaskAvailability(record.task);
  if (availability.status === 'archived') {
    showToast('This saved task is archived and cannot be opened.', 'gold');
    return;
  }

  currentTask = record.task;
  currentCatFilter = record.task.cat;
  currentIsOverflow = Boolean(typeof isTaskOverdue === 'function' && isTaskOverdue(record.task));
  allowManualCooldownCompletion = false;
  closeSavedTasksModal();
  renderTaskScreen();
  showScreen('task');
  resetTimer();
}

function removeSavedTask(taskId) {
  const record = getSavedTaskById(taskId);
  if (!record) return;
  gameState.savedTasks.splice(record.index, 1);
  if (!saveGame()) {
    gameState.savedTasks.splice(record.index, 0, taskId);
    showToast('The saved task could not be removed. Try again.', 'error');
    return;
  }
  renderSavedTasksModal();
  if (typeof renderHub === 'function') renderHub();
  showToast('Task removed from saved tasks.', 'green');
}

function closeSavedTasksModal() {
  document.getElementById('modal-saved')?.classList.remove('show');
}

function saveForLater() {
  if (!currentTask || !currentTask.id) return;
  if (!Array.isArray(gameState.savedTasks)) gameState.savedTasks = [];
  const wasAlreadySaved = gameState.savedTasks.includes(currentTask.id);
  if (!wasAlreadySaved) gameState.savedTasks.push(currentTask.id);
  if (!saveGame()) {
    if (!wasAlreadySaved) gameState.savedTasks = gameState.savedTasks.filter(taskId => taskId !== currentTask.id);
    showToast('The task could not be saved. Try again.', 'error');
    return;
  }
  showToast('Task saved for later.', 'blue');
  showScreen('hub');
}

function bindSavedTasksModal() {
  const modal = document.getElementById('modal-saved');
  if (!modal || modal.dataset.savedTasksBound === 'true') return;
  modal.dataset.savedTasksBound = 'true';
  modal.addEventListener('click', event => {
    const actionElement = event.target.closest('[data-saved-task-action]');
    if (actionElement) {
      const taskId = actionElement.dataset.taskId;
      if (actionElement.dataset.savedTaskAction === 'open') openSavedTask(taskId);
      if (actionElement.dataset.savedTaskAction === 'remove') removeSavedTask(taskId);
      return;
    }
    if (event.target === modal) closeSavedTasksModal();
  });
}

function openRandomTask() {
  currentCatFilter = null;
  allowManualCooldownCompletion = false;
  const { tasks, isOverflow } = getAvailableTasks();
  if (tasks.length === 0) {
    alert('No tasks are available.');
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
    showToast('No tasks are available for this category randomizer.', 'gold');
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
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date(`${value}T00:00:00Z`));
}

function getTaskCatalogStatus(task, availability) {
  if (availability.status === 'archived') return 'Archived';
  if (availability.status === 'needs_review') return 'Needs review';
  if (availability.status === 'completed') return 'Completed';
  if (availability.status === 'cooldown') {
    const next = formatTaskCatalogDate(availability.nextAvailableDate);
    return next ? `Available again ${next}` : 'Waiting for the next period';
  }
  if (task?.sideQuest) return 'Available · includes optional decision';
  return 'Available';
}

function getTaskScheduleSummary(availability) {
  const limit = availability.limit;
  if (limit === null || limit === undefined) return 'Repetitions: unlimited';
  const used = Number.isInteger(availability.periodCompletionCount) ? availability.periodCompletionCount : availability.completionCount;
  return `Repetitions: ${Math.min(used, limit)}/${limit}`;
}

function openTaskHistory(taskOrId = null, returnScreen = 'settings') {
  const taskId = typeof taskOrId === 'string' ? taskOrId : taskOrId?.id || null;
  const task = taskId ? gameState.tasks.find(candidate => candidate.id === taskId) : null;
  if (taskId && !task) return;
  if (typeof renderTaskHistory !== 'function') return;
  taskHistoryReturnScreen = returnScreen;
  renderTaskHistory(task?.id || null);
  showScreen('task-history');
}

function getTaskCatalogHistory(task, availability) {
  if (availability.completionCount === 0) return 'No completions recorded';
  const latest = typeof getLatestTaskCompletionDate === 'function'
    ? formatTaskCatalogDate(getLatestTaskCompletionDate(task))
    : null;
  const count = availability.completionCount;
  return `${count} completion${count === 1 ? '' : 's'}${latest ? ` · last: ${latest}` : ''}`;
}

function canCompleteTaskFromCatalog(availability) {
  return availability.status === 'available';
}

function ensureCategoryTaskScreen() {
  let screen = document.getElementById('screen-category-tasks');
  if (screen) return screen;

  screen = document.createElement('div');
  screen.className = 'screen';
  screen.id = 'screen-category-tasks';
  screen.innerHTML = `
    <div class="header">
      <button class="btn btn-ghost btn-small" type="button" data-category-action="back" style="width: auto;">&#8592; Back</button>
      <div id="category-task-heading" style="flex: 1; text-align: right;"></div>
    </div>
    <div class="content">
      <div id="category-task-summary" style="margin-bottom: 16px;"></div>
      <button class="btn btn-primary" type="button" data-category-action="random" id="category-task-random" style="margin-bottom: 18px;">&#127922; Choose a task from this category</button>
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
    if (action === 'history') {
      openTaskHistory(actionElement.dataset.taskId, 'category-tasks');
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
  const statusCounts = tasks.reduce((counts, task) => {
    const status = getTaskAvailability(task).status;
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {});
  const availableCount = statusCounts.available || 0;
  const waitingCount = (statusCounts.cooldown || 0) + (statusCounts.completed || 0);
  const reviewCount = statusCounts.needs_review || 0;

  const presentation = typeof LifeXPPresentation !== 'undefined'
    ? LifeXPPresentation
    : { getCategoryLabel: () => 'Adventure' };
  heading.textContent = `${cat.icon} ${presentation.getCategoryLabel(catId)}`;
  summary.innerHTML = `
    <div class="task-catalog-summary">
      <div class="task-catalog-summary-intro">
        <div class="task-catalog-summary-kicker">Category overview</div>
        <div class="task-catalog-summary-title">${tasks.length} task${tasks.length === 1 ? '' : 's'} in this category</div>
        <div class="task-catalog-summary-copy">Choose a task to open its full action screen.</div>
      </div>
      <div class="task-catalog-summary-stats" aria-label="Category task summary">
        <div class="task-catalog-summary-stat">
          <span class="task-catalog-summary-value">${availableCount}</span>
          <span class="task-catalog-summary-label">Available now</span>
        </div>
        <div class="task-catalog-summary-stat">
          <span class="task-catalog-summary-value">${waitingCount}</span>
          <span class="task-catalog-summary-label">Waiting</span>
        </div>
        ${reviewCount > 0 ? `
          <div class="task-catalog-summary-stat task-catalog-summary-stat-warning">
            <span class="task-catalog-summary-value">${reviewCount}</span>
            <span class="task-catalog-summary-label">Needs review</span>
          </div>
        ` : ''}
      </div>
    </div>
  `;
  randomButton.disabled = availableCount === 0;
  randomButton.title = availableCount === 0 ? 'No tasks are available in this category.' : '';

  if (tasks.length === 0) {
    list.innerHTML = '<div class="empty-state task-catalog-empty"><div class="empty-state-icon">&#128221;</div><div class="empty-state-title">No tasks in this category</div><div class="empty-state-desc">Choose another category or add a task to begin.</div></div>';
    return;
  }

  const unavailableNotice = availableCount === 0
    ? `
      <div class="task-catalog-empty task-catalog-empty-compact" role="status">
        <div class="task-catalog-empty-title">No tasks are available right now</div>
        <div class="task-catalog-empty-copy">Your task history is safe. Check the schedule shown on each card to see when it returns.</div>
      </div>
    `
    : '';

  list.innerHTML = unavailableNotice + tasks.map(task => {
    const availability = getTaskAvailability(task);
    const status = getTaskCatalogStatus(task, availability);
    const history = getTaskCatalogHistory(task, availability);
    const schedule = getTaskScheduleSummary(availability);
    const taskPresentation = typeof LifeXPPresentation !== 'undefined' && typeof LifeXPPresentation.getTask === 'function'
      ? LifeXPPresentation.getTask(task)
      : null;
    const frequency = taskPresentation?.frequencyLabel || task.freq || 'Schedule not specified';
    const statusClassMap = {
      available: 'available',
      cooldown: 'cooldown',
      completed: 'completed',
      needs_review: 'needs-review',
      archived: 'archived'
    };
    const statusClass = statusClassMap[availability.status] || 'unknown';
    const canComplete = canCompleteTaskFromCatalog(availability);
    const safeId = escapeTaskCatalogText(task.id);
    const safeName = escapeTaskCatalogText(task.name);
    const safeDesc = escapeTaskCatalogText(task.desc);
    return `
      <article class="task-catalog-card" data-task-id="${safeId}">
        <div class="task-catalog-main">
          <div class="task-catalog-heading">
            <div class="task-catalog-name">${safeName}</div>
            <span class="task-catalog-frequency">${escapeTaskCatalogText(frequency)}</span>
          </div>
          <div class="task-catalog-desc">${safeDesc}</div>
          <div class="task-catalog-details">
            <div class="task-catalog-detail task-catalog-detail-status task-catalog-detail-${statusClass}">
              <span class="task-catalog-detail-label">Status</span>
              <span class="task-catalog-detail-value">${escapeTaskCatalogText(status)}</span>
            </div>
            <div class="task-catalog-detail">
              <span class="task-catalog-detail-label">History</span>
              <span class="task-catalog-detail-value">${escapeTaskCatalogText(history)}</span>
            </div>
            <div class="task-catalog-detail">
              <span class="task-catalog-detail-label">Schedule</span>
              <span class="task-catalog-detail-value">${escapeTaskCatalogText(schedule)}</span>
            </div>
          </div>
        </div>
        <div class="task-catalog-actions">
          <button class="btn btn-secondary btn-small" type="button" data-category-action="history" data-task-id="${safeId}" aria-label="View history for ${safeName}">History</button>
          <button class="btn btn-primary btn-small" type="button" data-category-action="complete" data-task-id="${safeId}" ${canComplete ? '' : 'disabled'} aria-label="${canComplete ? `Open ${safeName}` : `${safeName} is unavailable`}">${canComplete ? 'Open task' : 'Unavailable'}</button>
        </div>
      </article>
    `;
  }).join('');
}

function completeTaskFromCategory(taskId) {
  const task = gameState.tasks.find(candidate => candidate.id === taskId);
  if (!task) return;
  const availability = getTaskAvailability(task);
  if (!canCompleteTaskFromCatalog(availability)) {
    showToast('This task cannot be completed right now.', 'gold');
    return;
  }
  currentTask = task;
  currentCatFilter = task.cat;
  currentIsOverflow = Boolean(availability.isOverflow);
  allowManualCooldownCompletion = false;
  renderTaskScreen();
  showScreen('task');
  resetTimer();
}

function getTaskHistoryRows(task) {
  return getTaskHistoryEntries(task)
    .filter(entry => entry && isValidTaskDate(entry.date))
    .sort((left, right) => right.date.localeCompare(left.date));
}

function renderTaskHistory(selectedTaskId = null) {
  let screen = document.getElementById('screen-task-history');
  if (!screen) {
    screen = document.createElement('div');
    screen.className = 'screen';
    screen.id = 'screen-task-history';
    screen.innerHTML = `
      <div class="header">
        <button class="btn btn-ghost btn-small" type="button" data-task-history-action="back" style="width: auto;">&#8592; Back</button>
        <div class="header-title" style="display: inline-block; margin-left: 10px;">Task history</div>
      </div>
      <div class="content">
        <div id="task-history-content"></div>
      </div>
    `;
    document.body.appendChild(screen);
    screen.addEventListener('click', event => {
      const actionElement = event.target.closest('[data-task-history-action]');
      if (!actionElement) return;
      const action = actionElement.dataset.taskHistoryAction;
      if (action === 'back') {
        showScreen(taskHistoryReturnScreen || 'settings');
        return;
      }
      if (action === 'open') {
        const task = gameState.tasks.find(candidate => candidate.id === actionElement.dataset.taskId);
        if (!task) return;
        currentTask = task;
        currentCatFilter = task.cat;
        currentIsOverflow = false;
        allowManualCooldownCompletion = false;
        renderTaskScreen();
        showScreen('task');
        resetTimer();
        return;
      }
      if (action === 'save-limit') {
        const task = gameState.tasks.find(candidate => candidate.id === actionElement.dataset.taskId);
        const input = [...screen.querySelectorAll('[data-task-repeat-limit]')]
          .find(candidate => candidate.dataset.taskRepeatLimit === actionElement.dataset.taskId);
        if (!task || !input) return;
        const rawValue = input.value.trim();
        if (!setTaskRepeatLimit(task, rawValue)) {
          showToast('Enter a positive whole number for a periodic task.', 'error');
          return;
        }
        if (!saveGame()) {
          showToast('The schedule could not be saved. Try again.', 'error');
          return;
        }
        renderTaskHistory(task.id);
        showToast('Task schedule saved.', 'green');
      }
    });
  }

  const content = screen.querySelector('#task-history-content');
  if (!content) return;
  const tasks = gameState.tasks
    .filter(task => !isTaskArchived(task))
    .sort((left, right) => `${left.cat}:${left.name}`.localeCompare(`${right.cat}:${right.name}`));
  if (tasks.length === 0) {
    content.innerHTML = '<div class="empty-state"><div class="empty-state-title">No tasks available</div><div class="empty-state-desc">Add a task before reviewing its schedule.</div></div>';
    return;
  }

  const filteredTasks = selectedTaskId ? tasks.filter(task => task.id === selectedTaskId) : tasks;
  const visibleTasks = filteredTasks.length > 0 ? filteredTasks : tasks;
  content.innerHTML = visibleTasks.map(task => {
    const availability = getTaskAvailability(task);
    const schedule = getTaskScheduleSettings(task);
    const history = getTaskHistoryRows(task);
    const safeId = escapeTaskCatalogText(task.id);
    const frequency = escapeTaskCatalogText(
      typeof LifeXPPresentation !== 'undefined'
        ? LifeXPPresentation.getTask(task).frequencyLabel
        : (schedule.frequency || 'Schedule not specified')
    );
    const next = availability.nextAvailableDate ? formatTaskCatalogDate(availability.nextAvailableDate) : null;
    const limitValue = schedule.limit === null || schedule.limit === undefined ? '' : schedule.limit;
    const historyMarkup = history.length === 0
      ? '<div class="task-history-empty">No completions recorded.</div>'
      : history.slice(0, 12).map(entry => `
          <div class="task-history-entry">
            <span>${escapeTaskCatalogText(formatTaskCatalogDate(entry.date) || entry.date)}</span>
            <span>+${escapeTaskCatalogText(entry.xp || 0)} XP${entry.sideQuest ? ' · Side quest' : ''}</span>
          </div>
        `).join('');
    const canEdit = schedule.editable;
    return `
      <article class="card task-history-card" data-task-id="${safeId}">
        <div class="card-header">
          <div>
            <div class="card-title">${escapeTaskCatalogText(task.name)}</div>
            <div class="task-catalog-desc">${escapeTaskCatalogText(task.desc)}</div>
          </div>
          <span class="card-badge">${frequency}</span>
        </div>
        <div class="task-history-status">${escapeTaskCatalogText(getTaskCatalogStatus(task, availability))} · ${escapeTaskCatalogText(getTaskScheduleSummary(availability))}${next ? ` · Next: ${escapeTaskCatalogText(next)}` : ''}</div>
        <div class="task-history-list">${historyMarkup}</div>
        <div class="task-history-controls">
          <label class="task-history-limit-label" for="task-repeat-${safeId}">Repetitions per period</label>
          <div class="task-history-limit-row">
            <input id="task-repeat-${safeId}" class="task-repeat-limit" type="number" min="1" step="1" value="${escapeTaskCatalogText(limitValue)}" ${canEdit ? '' : 'disabled'} data-task-repeat-limit="${safeId}" aria-label="Repetitions per period for ${escapeTaskCatalogText(task.name)}">
            <button class="btn btn-secondary btn-small" type="button" data-task-history-action="save-limit" data-task-id="${safeId}" ${canEdit ? '' : 'disabled'}>Save schedule</button>
            <button class="btn btn-ghost btn-small" type="button" data-task-history-action="open" data-task-id="${safeId}">Open task</button>
          </div>
          ${canEdit ? '<div class="task-history-help">Changes apply now; previous history stays unchanged.</div>' : '<div class="task-history-help">This task has no repeatable period.</div>'}
        </div>
      </article>
    `;
  }).join('');
}

function renderTaskScreen() {
  const task = currentTask;
  const cat = CATEGORIES[task.cat];
  
  // Card
  const card = document.getElementById('task-card');
  card.setAttribute('data-cat', task.cat);
  
  // Category label
  const taskPresentation = typeof LifeXPPresentation !== 'undefined'
    ? LifeXPPresentation.getTask(task)
    : { categoryLabel: 'Adventure', frequencyLabel: 'Schedule not specified' };
  const availability = getTaskAvailability(task);
  document.getElementById('task-cat-label').textContent = `${cat.icon} ${taskPresentation.categoryLabel}`;
  document.getElementById('task-cat-badge').textContent = taskPresentation.frequencyLabel;
  const scheduleBox = document.getElementById('task-schedule');
  if (scheduleBox) {
    const schedule = getTaskScheduleSummary(availability);
    const next = availability.nextAvailableDate ? formatTaskCatalogDate(availability.nextAvailableDate) : null;
    const status = getTaskCatalogStatus(task, availability);
    scheduleBox.textContent = `${status} · ${schedule}${next ? ` · Next: ${next}` : ''}`;
    scheduleBox.dataset.status = availability.status;
  }
  const completeButton = document.getElementById('btn-complete');
  if (completeButton) {
    completeButton.disabled = availability.status !== 'available';
    completeButton.title = availability.status === 'cooldown' && availability.nextAvailableDate
      ? `Available again ${formatTaskCatalogDate(availability.nextAvailableDate)}`
      : availability.status !== 'available' ? 'This task is not available right now.' : '';
  }
  
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
  if (!task) {
    showToast('The saved result needs review because its task is no longer available.', 'gold');
    return false;
  }
  renderTaskResultModal(result, task);
  return true;
}

// Canonical recovery entry point for every navigation path. A pending result
// always returns to the task screen before its modal is presented, and the
// modal is represented by exactly one browser-history entry.
function showPendingTaskResult(options = {}) {
  const result = getPendingTaskResult();
  if (!result) return false;
  const task = gameState.tasks.find(candidate => candidate.id === result.taskId) || null;
  if (!task) {
    showToast('The saved result needs review because its task is no longer available.', 'gold');
    return false;
  }

  currentTask = task;
  currentCatFilter = task.cat;
  currentIsOverflow = Boolean(result.isOverflow);
  allowManualCooldownCompletion = Boolean(result.allowCooldownCompletion);
  renderTaskScreen();
  showScreen('task', {
    fromHistory: Boolean(options.fromHistory),
    replaceHistory: Boolean(options.replaceHistory)
  });
  return presentPendingTaskResult();
}

function renderTaskResultModal(result, task) {
  const overlay = document.getElementById('complete-overlay');
  overlay.setAttribute('aria-label', 'Task result');
  overlay.setAttribute('aria-hidden', 'false');
  overlay.setAttribute('aria-modal', 'true');
  overlay.dataset.resultStatus = result.status;
  overlay.classList.add('show');
  if (typeof pushTaskResultHistory === 'function') pushTaskResultHistory();

  document.getElementById('complete-icon').textContent = result.status === 'awaiting_side_quest'
    ? (result.isOverflow ? '⚡' : '\uD83C\uDFC6')
    : (result.leveledUp ? '\uD83C\uDF89' : (result.isOverflow ? '⚡' : '\uD83C\uDFC6'));
  document.getElementById('complete-title').textContent = result.status === 'awaiting_side_quest'
    ? (result.isOverflow ? 'Overflow cleared!' : 'Task completed!')
    : (result.leveledUp ? 'Level up!' : (result.isOverflow ? 'Overflow cleared!' : 'Task completed!'));
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
    rewardsHtml = '<div class="complete-reward gold">Result saved</div>';
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
    document.getElementById('side-quest-prompt-desc').textContent = result.sideQuestDesc || 'Did you also complete the optional objective?';
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
      const dropName = drop.displayName || 'Unresolved reward';
      const statusLabel = typeof LifeXPPresentation !== 'undefined'
        ? LifeXPPresentation.getStatusLabel(drop.status, 'Reward status unknown')
        : 'Reward status unknown';
      const rarityLabel = drop.rarity && typeof LifeXPPresentation !== 'undefined'
        ? LifeXPPresentation.getRarityLabel(drop.rarity)
        : null;
      const dropDetails = [statusLabel, dropName, rarityLabel].filter(Boolean).join(' · ');
      document.getElementById('complete-drop-item').textContent = dropDetails;
    }
    continueButton.classList.remove('hidden');
  }

  continueButton.textContent = result.status === 'awaiting_side_quest' ? 'Resolve later' : 'Continue';
}

function openTaskResultDecision(sideQuestCompleted) {
  const current = getPendingTaskResult();
  if (!current || current.status !== 'awaiting_side_quest') return;
  finalizeCompletion(Boolean(sideQuestCompleted), current);
}

function completeTask() {
  if (!currentTask) return;
  const availability = getTaskAvailability(currentTask);
  if (availability.status !== 'available') {
    showToast('This task is not available right now.', 'gold');
    return;
  }

  const pending = getPendingTaskResult();
  if (pending) {
    presentPendingTaskResult();
    return;
  }

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
      allowCooldownCompletion: false,
      claimId: completionId
    };
    if (!saveGame()) {
      gameState.pendingTaskResult = null;
      showToast('The result could not be saved. Try again.', 'error');
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
    allowCooldownCompletion: false,
    claimId: createTaskCompletionId(currentTask, todayStr())
  });
}

function finalizeCompletion(sideQuestCompleted, pendingResult = getPendingTaskResult()) {
  const resolvedPendingResult = pendingResult || {
    taskId: currentTask?.id,
    date: todayStr(),
    isOverflow: Boolean(currentIsOverflow),
    allowCooldownCompletion: false,
    claimId: currentTask ? createTaskCompletionId(currentTask, todayStr()) : null
  };
  const task = gameState.tasks.find(candidate => candidate.id === resolvedPendingResult.taskId) || currentTask;
  if (!task) return;
  const availability = getTaskAvailability(task);
  if (availability.status !== 'available') {
    showToast('This task is no longer available right now.', 'gold');
    return;
  }

  const stateBeforeCompletion = typeof cloneSaveState === 'function' ? cloneSaveState(gameState) : JSON.parse(JSON.stringify(gameState));
  const pendingEncounterBeforeCompletion = pendingEncounter;
  const today = resolvedPendingResult.date || todayStr();
  const completionSequence = gameState.taskHistory.filter(entry => entry && entry.taskId === task.id).length;
  const completionId = resolvedPendingResult.claimId || createTaskCompletionId(task, today, completionSequence);
  const baseXp = task.xp * (resolvedPendingResult.isOverflow ? 1.5 : 1);
  const sideXp = sideQuestCompleted && task.sideQuest ? task.sideQuest.xp : 0;
  const totalXp = Math.round(baseXp + sideXp);
  const goldEarned = Math.max(1, Math.floor(totalXp / 4));

  const leveledUp = addXp(totalXp);
  gameState.gold += goldEarned;

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
    isOverflow: Boolean(resolvedPendingResult.isOverflow),
    date: today,
    createdAt: new Date().toISOString(),
    sideQuestCompleted: Boolean(sideQuestCompleted),
    allowCooldownCompletion: false,
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
    showToast('The result could not be saved. It was not shown; complete the task again to retry.', 'error');
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
          displayName: typeof LifeXPPresentation !== 'undefined'
            ? LifeXPPresentation.getReward(itemId).name
            : 'Unresolved reward',
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
  const requestedItem = typeof candidate === 'string' ? candidate : null;
  const displayName = typeof LifeXPPresentation !== 'undefined'
    ? LifeXPPresentation.getReward(requestedItem).name
    : 'Unresolved reward';
  return { itemId: requestedItem, requestedItem, displayName, rarity };
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
    showToast('The result could not be confirmed. The reward remains protected.', 'error');
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
  return showPendingTaskResult({ replaceHistory: true });
}