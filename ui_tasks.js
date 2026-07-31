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

function completeTask() {
  if (!currentTask) return;
  
  stopTimer();
  
  // Show completion overlay
  const overlay = document.getElementById('complete-overlay');
  overlay.classList.add('show');
  
  // Icon & title
  document.getElementById('complete-icon').textContent = currentIsOverflow ? '⚡' : '\uD83C\uDFC6';
  document.getElementById('complete-title').textContent = currentIsOverflow 
    ? '¡Overflow eliminado!' 
    : '¡Tarea completada!';
  document.getElementById('complete-subtitle').textContent = currentTask.name;
  
  // Calculate base rewards
  const baseXp = currentTask.xp;
  const xpMultiplier = currentIsOverflow ? 1.5 : 1;
  
  // Rewards display
  let rewardsHtml = `<div class="complete-reward gold">+${Math.round(baseXp * xpMultiplier)} XP</div>`;
  for (const [stat, pct] of Object.entries(currentTask.stats)) {
    const points = Math.max(1, Math.floor(pct / 10));
    rewardsHtml += `<div class="complete-reward green">+${points} ${STATS[stat].abbr}</div>`;
  }
  document.getElementById('complete-rewards').innerHTML = rewardsHtml;
  
  // Hide drop and side quest prompt initially
  document.getElementById('complete-drop').classList.add('hidden');
  document.getElementById('side-quest-prompt').classList.add('hidden');
  document.getElementById('btn-complete-continue').classList.add('hidden');
  
  // If has side quest, show prompt
  if (currentTask.sideQuest) {
    const prompt = document.getElementById('side-quest-prompt');
    prompt.classList.remove('hidden');
    document.getElementById('side-quest-prompt-desc').textContent = currentTask.sideQuest.desc;
  } else {
    // No side quest, finalize immediately
    finalizeCompletion(false);
  }
}

function finalizeCompletion(sideQuestCompleted) {
  const task = currentTask;
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
  
  // Show drop if any
  if (dropResult) {
    document.getElementById('complete-drop').classList.remove('hidden');
    
    if (dropResult.itemId && typeof ITEMS !== 'undefined' && ITEMS[dropResult.itemId]) {
      const item = ITEMS[dropResult.itemId];
      const rarity = RARITY[dropResult.rarity || item.rarity];
      document.getElementById('complete-drop-item').innerHTML = 
        `<span style="color: ${rarity.color};">${item.icon} ${item.name}</span>`;
      // Add to inventory using items.js system
      if (typeof addToInventory === 'function') {
        addLootSafely(dropResult.itemId, 1);
      } else {
        gameState.inventory.push({ id: dropResult.itemId, qty: 1, obtainedAt: todayStr() });
      }
    } else {
      document.getElementById('complete-drop-item').textContent = dropResult.name || dropResult;
      gameState.inventory.push({ name: dropResult.name || dropResult, type: 'item', obtainedAt: todayStr() });
    }
  }
  
  // Update task lastDone
  const taskInState = gameState.tasks.find(t => t.id === task.id);
  if (taskInState) {
    taskInState.lastDone = todayStr();
  }
  
  // Remove from saved if it was there
  gameState.savedTasks = gameState.savedTasks.filter(id => id !== task.id);
  
  // Update streak
  const today = todayStr();
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
    sideQuest: sideQuestCompleted
  });
  
  // Save
  saveGame();
  
  // Show continue button
  document.getElementById('btn-complete-continue').classList.remove('hidden');
  
  // Update rewards display with final values
  let rewardsHtml = `<div class="complete-reward gold">+${totalXp} XP</div>`;
  rewardsHtml += `<div class="complete-reward">+${goldEarned} \uD83E\uDE99</div>`;
  document.getElementById('complete-rewards').innerHTML = rewardsHtml;
  
  if (leveledUp) {
    document.getElementById('complete-title').textContent = '¡Subiste de nivel!';
    document.getElementById('complete-icon').textContent = '\uD83C\uDF89';
  }
  
  // Check for random encounter after task completion
  triggerEncounterAfterTask(task);
  
  // Update quest progress (delegates to quests.js canonical implementation)
  if (typeof updateQuestProgress === 'function') {
    updateQuestProgress('task_complete', { category: task.cat });
  }
  if (typeof recordItemAttunementFromTask === 'function') recordItemAttunementFromTask(task);
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
  document.getElementById('complete-overlay').classList.remove('show');
  
  // Check for pending encounter
  if (pendingEncounter) {
    startCombatFromEncounter(pendingEncounter);
    pendingEncounter = null;
  } else {
    showScreen('hub');
  }
}

