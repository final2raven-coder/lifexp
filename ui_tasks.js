// ===========================================================================
// LifeXP RPG - ui_tasks.js
// UI para categorias, tareas y completion.
// ===========================================================================

let currentCategory = null;
let currentTask = null;

function openCategory(catId) {
  currentCategory = catId;
  showScreen('category');
  renderCategoryScreen();
}

function openTask(taskId) {
  const task = gameState.tasks.find(t => t.id === taskId);
  if (!task) return;
  currentTask = task;
  showScreen('task');
  renderTaskScreen();
}

function renderCategoryScreen() {
  const catId = currentCategory;
  const cat = CATEGORIES[catId];
  if (!cat) return;
  const presentation = typeof LifeXPPresentation !== 'undefined' ? LifeXPPresentation : null;
  
  const pendingTasks = getPendingTasks(catId);
  const overflowTasks = pendingTasks.filter(t => t.isOverflow);
  const normalTasks = pendingTasks.filter(t => !t.isOverflow);
  
  const categoryName = presentation ? presentation.getCategoryLabel(catId) : cat.name;
  const categoryDescription = presentation ? presentation.getCategoryDescription(catId) : cat.description;
  const heading = document.getElementById('category-heading');
  if (heading) {
    heading.innerHTML = `${LifeXPIcons.renderCategory({ id: catId, name: categoryName }, { size: 28 })} ${categoryName}`;
  }
  const description = document.getElementById('category-description');
  if (description) description.textContent = categoryDescription;
  
  const list = document.getElementById('category-task-list');
  if (!list) return;
  
  if (!pendingTasks.length) {
    list.innerHTML = '<div class="empty-state">No pending tasks in this category.</div>';
    return;
  }
  
  list.innerHTML = [
    ...overflowTasks.map(task => renderTaskCard(task, true)),
    ...normalTasks.map(task => renderTaskCard(task, false))
  ].join('');
}

function renderTaskCard(task, isOverflow) {
  const xp = getTaskXp(task);
  const statusClass = isOverflow ? 'task-card-overflow' : '';
  const statusLabel = isOverflow ? 'Overflow' : 'Pending';
  return `
    <button class="task-card ${statusClass}" type="button" data-task-id="${task.id}">
      <span class="task-card-main">
        <span class="task-card-title">${task.title}</span>
        <span class="task-card-meta">${statusLabel} · ${xp} XP</span>
      </span>
      <span class="task-card-arrow">›</span>
    </button>
  `;
}

function renderTaskScreen() {
  const task = currentTask;
  if (!task) return;
  const category = CATEGORIES[task.cat];
  const presentation = typeof LifeXPPresentation !== 'undefined' ? LifeXPPresentation : null;
  const categoryLabel = presentation ? presentation.getCategoryLabel(task.cat) : category.name;
  const taskPresentation = typeof getTaskPresentation === 'function'
    ? getTaskPresentation(task)
    : { title: task.title, description: task.description, categoryLabel };
  
  document.getElementById('task-title').textContent = taskPresentation.title;
  document.getElementById('task-desc').textContent = taskPresentation.description;
  document.getElementById('task-cat-label').innerHTML = `${LifeXPIcons.renderCategory({ id: task.cat, name: taskPresentation.categoryLabel }, { size: 24 })} ${taskPresentation.categoryLabel}`;
  document.getElementById('task-xp').textContent = `${getTaskXp(task)} XP`;
  
  const dropsBox = document.getElementById('task-drops-box');
  if (dropsBox) {
    const drops = getTaskDropPreview(task);
    dropsBox.classList.toggle('hidden', drops.length === 0);
    dropsBox.innerHTML = drops.length
      ? `<div class="task-drops-title">Possible drops</div><div class="task-drops-list">${drops.map(renderDropPreview).join('')}</div>`
      : '';
  }
  
  const completeBtn = document.getElementById('btn-complete-task');
  if (completeBtn) {
    completeBtn.onclick = () => completeCurrentTask();
    completeBtn.disabled = false;
  }
}

function renderDropPreview(drop) {
  const item = typeof ITEMS !== 'undefined' ? ITEMS[drop.itemId] : null;
  return `<div class="drop-preview">${item ? LifeXPIcons.renderItem(item, { size: 24 }) : LifeXPIcons.renderUI('item.material', { size: 24 })}<span>${item ? item.name : 'Unknown drop'}</span></div>`;
}

function completeCurrentTask() {
  if (!currentTask) return;
  const taskId = currentTask.id;
  const result = completeTask(taskId);
  if (!result || result.status === 'invalid') return;
  renderCompletion(result);
}

function renderCompletion(result) {
  showScreen('completion');
  const icon = document.getElementById('complete-icon');
  if (!icon) return;
  const resultIcon = result.status === 'awaiting_side_quest'
    ? (result.isOverflow
      ? LifeXPIcons.renderUI('world.lightning', { size: 64 })
      : LifeXPIcons.renderUI('ui.trophy', { size: 64 }))
    : (result.leveledUp
      ? LifeXPIcons.renderUI('world.star', { size: 64 })
      : (result.isOverflow
        ? LifeXPIcons.renderUI('world.lightning', { size: 64 })
        : LifeXPIcons.renderUI('ui.trophy', { size: 64 })));
  icon.innerHTML = resultIcon;
  
  document.getElementById('complete-title').textContent = result.leveledUp ? 'Level up!' : 'Task complete';
  document.getElementById('complete-xp').textContent = `+${result.xpGained} XP`;
  document.getElementById('complete-message').textContent = result.message || 'Progress recorded.';
  
  const lootList = document.getElementById('complete-loot');
  if (lootList) {
    lootList.innerHTML = (result.loot || []).map(loot => {
      const item = typeof ITEMS !== 'undefined' ? ITEMS[loot.itemId] : null;
      return `<div class="loot-row">${item ? LifeXPIcons.renderItem(item, { size: 32 }) : LifeXPIcons.renderUI('item.material', { size: 32 })}<span>${item ? item.name : 'Unidentified reward'}</span></div>`;
    }).join('');
  }
}

function bindTaskUiEvents() {
  document.addEventListener('click', event => {
    const taskCard = event.target.closest('[data-task-id]');
    if (taskCard) {
      openTask(taskCard.getAttribute('data-task-id'));
      return;
    }
    const action = event.target.closest('[data-category-action]')?.getAttribute('data-category-action');
    if (action === 'back') showScreen('hub');
    if (action === 'random') {
      const task = getRandomTask(currentCategory);
      if (task) openTask(task.id);
    }
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', bindTaskUiEvents, { once: true });
}
